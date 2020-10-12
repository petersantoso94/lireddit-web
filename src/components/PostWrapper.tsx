import {
  Accordion,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Grid,
  Icon,
  IconButton,
  SimpleGrid,
  Text,
} from "@chakra-ui/core";
import moment from "moment";
import React from "react";
import { MdArrowDownward, MdArrowUpward } from "react-icons/md";
import { GetVotesQuery, Post, Vote } from "../generated/graphql";
import { UpDownVote } from "./UpDownVote";

type Prop = {
  posts: Post[];
  votesData: Vote[];
  column: number;
  spacing: number;
};

export const PostWrapper = (prop: Prop) => {
  const { column, posts, spacing, votesData } = prop;
  return (
    <Accordion allowToggle>
      <SimpleGrid columns={column} spacing={spacing}>
        {posts.map((x, idx) => {
          const vote = votesData.find((y) => y.post.id === x.id);
          return (
            <Flex key={"flex" + x.title + idx + x.createdAt}>
              <UpDownVote
                post={x}
                votesData={vote}
                key={"upDown" + x.title + idx + x.createdAt}
              />
              <Box w="100%">
                <AccordionItem key={x.title + idx + x.createdAt}>
                  <AccordionHeader>
                    <Box flex="1" textAlign="left">
                      <Text color="black.200" isTruncated as="b">
                        {x.title}
                      </Text>
                      {` - Posted by ${x.user.username} 
                ${moment(new Date(parseFloat(x.createdAt))).fromNow()}`}
                    </Box>
                    <AccordionIcon />
                  </AccordionHeader>
                  <AccordionPanel pb={4}>{x.content}</AccordionPanel>
                </AccordionItem>
              </Box>
            </Flex>
          );
        })}
      </SimpleGrid>
    </Accordion>
  );
};
