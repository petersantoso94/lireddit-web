export const graphqlUrl =
  process.env.GRAPHQL_URL || "http://localhost:4000/graphql";

export const REDIRECT_TO = "redirectTo";
export const QUERY_TOKEN = "token";

// post invalidate const
export const DefaultVariables = {
  limit: 10,
  cursor: undefined as number | undefined,
};
