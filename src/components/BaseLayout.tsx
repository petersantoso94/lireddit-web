import React from "react";
import Wrapper, { TWrapper } from "./Wrapper";
import Navbar from "./Navbar";

const BaseLayout = ({ children, variant }: TWrapper) => {
  return (
    <>
      <Navbar />
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};

export default BaseLayout;
