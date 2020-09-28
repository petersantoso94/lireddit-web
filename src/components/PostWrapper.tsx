import React from "react";
import {
  SimpleGrid,
  Box,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/core";
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
          <AccordionItem key={x.title + idx + x.createdAt}>
            <AccordionHeader>
              <Box flex="1" textAlign="left">
                {x.title}
              </Box>
              <AccordionIcon />
            </AccordionHeader>
            <AccordionPanel pb={4}>{x.content}</AccordionPanel>
          </AccordionItem>
        ))}
      </SimpleGrid>
    </Accordion>
  );
};
