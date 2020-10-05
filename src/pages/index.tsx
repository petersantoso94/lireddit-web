import { Button, CircularProgress, Flex, Heading, Link } from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import React, { useMemo, useState } from "react";
import BaseLayout from "../components/BaseLayout";
import { PostWrapper } from "../components/PostWrapper";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/utils";
import NextLink from "next/link";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as number | null,
  });
  const [{ data, fetching }] = usePostsQuery({ variables });
  let postComponent = data && (
    <>
      <Flex align="center" mb={4}>
        <Heading>PiReddit - Beta</Heading>
        <NextLink href="/create-post">
          <Link ml="auto">Create Post</Link>
        </NextLink>
      </Flex>
      <PostWrapper column={1} spacing={10} posts={data.posts as any} />
      <Flex>
        <Button
          m="auto"
          isLoading={fetching}
          my={4}
          onClick={() => {
            setVariables({
              ...variables,
              cursor: data.posts[data.posts.length - 1].id,
            });
          }}
        >
          Load more
        </Button>
      </Flex>
    </>
  );

  return (
    <BaseLayout variant="regular">
      {fetching ? (
        <CircularProgress isIndeterminate color="green"></CircularProgress>
      ) : (
        postComponent
      )}
    </BaseLayout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
