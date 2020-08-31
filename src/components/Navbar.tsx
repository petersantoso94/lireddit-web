import React, { ReactElement } from "react";
import { Box, Link, Button, Flex } from "@chakra-ui/core";
import NextLink from "next/link";
import { useMeQuery } from "../generated/graphql";

interface Props {}

export default function Navbar({}: Props): ReactElement {
  const [{ data, fetching }] = useMeQuery();

  let body = null;
  let logout = null;
  //fetching the data
  if (fetching) {
  } else if (!data.me) {
    // user is not logged in
    body = (
      <>
        <NextLink href="/login">
          <Link color="white" mr={9}>
            Login
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link color="white">Register</Link>
        </NextLink>
      </>
    );
  } else {
    //user is logged in
    body = <label>{data.me.username}</label>;
    logout = <Button>Logout</Button>;
  }
  return (
    <Flex flexDirection="row" justifyContent="space-between" bg="tomato" p={4}>
      {body}
      {logout}
    </Flex>
  );
}
