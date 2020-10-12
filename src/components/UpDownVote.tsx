import { Flex, IconButton, Text } from "@chakra-ui/core";
import React, { useState } from "react";
import {
  RegularPostFragment,
  RegularVoteFragment,
  useVotingMutation,
} from "../generated/graphql";

interface Prop {
  post: RegularPostFragment;
  votesData: RegularVoteFragment;
}

export const UpDownVote = ({ post, votesData }: Prop) => {
  const [loadingState, setLoadingState] = useState<
    "upvote-loading" | "downvote-loading" | "not-loading"
  >("not-loading");
  const [, vote] = useVotingMutation();
  const buttonActive: "upvote" | "downvote" | "no" = !votesData
    ? "no"
    : votesData.up
    ? "upvote"
    : "downvote";
  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
      <IconButton
        aria-label="upvote post"
        icon="chevron-up"
        isActive={buttonActive === "upvote"}
        onClick={async () => {
          setLoadingState("upvote-loading");
          await vote({
            postId: post.id,
            isUpvote: true,
          });
          setLoadingState("not-loading");
        }}
        isLoading={loadingState === "upvote-loading"}
      />
      <Text textAlign="center">
        <strong>{post.point}</strong>
      </Text>
      <IconButton
        aria-label="down vote post"
        icon="chevron-down"
        isActive={buttonActive === "downvote"}
        isLoading={loadingState === "downvote-loading"}
        onClick={async () => {
          setLoadingState("downvote-loading");
          await vote({
            postId: post.id,
            isUpvote: false,
          });
          setLoadingState("not-loading");
        }}
      >
        {}
      </IconButton>
    </Flex>
  );
};
