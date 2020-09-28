import React, { ReactElement } from "react";
import { Box } from "@chakra-ui/core";

export type TWrapper = {
  children;
  variant?: "small" | "regular";
};

export default function Wrapper({ children, variant }: TWrapper): ReactElement {
  return (
    <Box
      maxW={variant === "regular" ? "800px" : "400px"}
      w="100%"
      mx="auto"
      mt={8}
    >
      {children}
    </Box>
  );
}
