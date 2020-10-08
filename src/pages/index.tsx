import { Button, CircularProgress, Flex, Heading, Link } from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React, { useState } from "react";
import BaseLayout from "../components/BaseLayout";
import { PostWrapper } from "../components/PostWrapper";
import { useGetPostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/utils";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as number | null,
  });
  const [{ data, fetching }] = useGetPostsQuery({ variables });
  let postComponent = data.getPosts && (
    <>
      <Flex align="center" mb={4}>
        <Heading>PiReddit - Beta</Heading>
        <NextLink href="/create-post">
          <Link ml="auto">Create Post</Link>
        </NextLink>
      </Flex>
      <PostWrapper column={1} spacing={10} posts={data.getPosts.posts as any} />
      <Flex>
        {data.getPosts.hasMore && (
          <Button
            m="auto"
            isLoading={fetching}
            my={4}
            onClick={() => {
              setVariables({
                ...variables,
                cursor: data.getPosts.posts[data.getPosts.posts.length - 1].id,
              });
            }}
          >
            Load more
          </Button>
        )}
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
