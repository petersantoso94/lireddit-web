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
import { SSRExchange } from "next-urql";
import Router from "next/router";
import {
  dedupExchange,
  Exchange,
  fetchExchange,
  Query,
  stringifyVariables,
} from "urql";
import { pipe, tap } from "wonka";
import { DefaultVariables, graphqlUrl } from "../Constants";
import {
  CreatePostMutation,
  CustomError,
  GetPostsDocument,
  GetPostsQuery,
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
          },
          createPost: (_result, args, cache, info) => {
            cache.invalidate("Query", "getPosts", DefaultVariables);
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
