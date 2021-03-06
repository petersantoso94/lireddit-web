import {
  Cache,
  cacheExchange,
  Data,
  NullArray,
  QueryInput,
  ResolveInfo,
  Resolver,
  Variables,
} from "@urql/exchange-graphcache";
import gql from "graphql-tag";
import { SSRExchange } from "next-urql";
import Router from "next/router";
import {
  dedupExchange,
  Exchange,
  fetchExchange,
  stringifyVariables,
} from "urql";
import { pipe, tap } from "wonka";
import { graphqlUrl } from "../Constants";
import {
  CustomError,
  GetPostsDocument,
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from "../generated/graphql";
export const toErrorMap = (errors: CustomError[]): Record<string, string> => {
  const errorMap: Record<string, string> = {};
  errors.forEach(({ field, message }) => {
    errorMap[field] = message;
  });

  return errorMap;
};

function UpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}

const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      // If the OperationResult has an error send a request to sentry
      if (error != null && error.message.includes("Not Authenticated")) {
        // the error is a CombinedError with networkError and graphqlErrors properties
        // if it is not authenticated error, redirect to login page
        Router.replace("/login");
      }
    })
  );
};

// pagination resolver for urql
const cursorPagination = (): Resolver => {
  return (
    parent: Data,
    fieldArgs: Variables,
    cache: Cache,
    info: ResolveInfo
  ) => {
    const { parentKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    // check if the data in the cache
    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const IsDataInCache = cache.resolve(
      cache.resolveFieldByKey(entityKey, fieldKey) as string,
      "posts"
    );
    info.partial = !IsDataInCache;
    // because we will have multiple field, so need loop through
    let result: NullArray<string> = [];
    let hasMore: boolean = true;
    fieldInfos.forEach((fi) => {
      const key = cache.resolveFieldByKey(entityKey, fi.fieldKey) as string;
      const posts = cache.resolve(key, "posts") as string[];
      hasMore = cache.resolve(key, "hasMore") as boolean;
      result.push(...posts);
    });
    return {
      __typename: "PaginatedPostResponse",
      hasMore,
      posts: result,
    };
  };
};

export const createUrqlClient = (ssrExchange: SSRExchange) => ({
  url: graphqlUrl,
  fetchOptions: {
    credentials: "include" as const,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      resolvers: {
        Query: {
          getPosts: cursorPagination(),
        },
      },
      updates: {
        Mutation: {
          login: (_result, args, cache, info) => {
            UpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    me: result.login.user,
                  };
                }
              }
            );
            cache.invalidate("Query", "getVotes");
          },
          register: (_result, args, cache, info) => {
            UpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                } else {
                  return {
                    me: result.register.user,
                  };
                }
              }
            );
            cache.invalidate("Query", "getVotes");
          },
          logout: (_result, args, cache, info) => {
            UpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.logout) {
                  return { me: null };
                } else {
                  return query;
                }
              }
            );
            cache.invalidate("Query", "getVotes");
          },
          createPost: (result: any, _args, cache, _info) => {
            const newPost = result.createPost.post;
            cache.updateQuery(
              { query: GetPostsDocument, variables: { limit: 10 } },
              (data: any) => {
                if (data !== null) {
                  // add the post to the begining of the result
                  data.getPosts.posts.unshift(newPost);
                  return data;
                } else {
                  return null;
                }
              }
            );
          },
          vote: (_result: any, args, cache, info) => {
            const selectedPostId = args.postId;
            const data = cache.readFragment(
              gql`
                fragment _ on Post {
                  id
                  point
                }
              `,
              {
                id: selectedPostId,
              } as any
            );
            if (data) {
              const newPoints = _result.vote.newPoint;
              cache.writeFragment(
                gql`
                  fragment __ on Post {
                    point
                  }
                `,
                { id: selectedPostId, point: newPoints } as any
              );
            }
            cache.invalidate("Query", "getVotes");
          },
        },
      },
    }),
    ssrExchange,
    errorExchange,
    fetchExchange,
  ],
});

export const isInServer = () => typeof window === "undefined";
