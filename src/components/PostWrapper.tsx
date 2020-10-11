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
  SimpleGrid,
  Text,
} from "@chakra-ui/core";
import moment from "moment";
import React from "react";
import { MdArrowDownward, MdArrowUpward } from "react-icons/md";
import { Post } from "../generated/graphql";

type Prop = {
  posts: Post[];
  column: number;
  spacing: number;
};

export const PostWrapper = (prop: Prop) => {
  const { column, posts, spacing } = prop;
  return (
    <Accordion allowToggle>
      <SimpleGrid columns={column} spacing={spacing}>
        {posts.map((x, idx) => (
          <Flex w="100%" key={"flex" + x.title + idx + x.createdAt}>
            <Box w="5%" mr={4}>
              <Button
                leftIcon={MdArrowUpward}
                variantColor="red"
                variant="outline"
                pr={-2}
                onClick={() => {}}
              >
                {}
              </Button>
              <Text textAlign="center">
                <strong>{x.point}</strong>
              </Text>
              <Button
                leftIcon={MdArrowDownward}
                variantColor="red"
                variant="outline"
                pr={-2}
                onClick={() => {}}
              >
                {}
              </Button>
            </Box>
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
        ))}
      </SimpleGrid>
    </Accordion>
  );
};
