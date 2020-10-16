import {
  Avatar,
  AvatarBadge,
  Button,
  Flex,
  Link,
  theme,
} from "@chakra-ui/core";
import NextLink from "next/link";
import React, { ReactElement } from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isInServer } from "../utils/utils";

interface Props {}

export default function Navbar({}: Props): ReactElement {
  const [{ data, fetching }] = useMeQuery({ pause: isInServer() });
  const [{ fetching: logoutFetching }, logoutMutation] = useLogoutMutation();
  let body = null;
  let logout = null;
  //fetching the data
  if (fetching) {
  } else if (!data || !data.me) {
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
    body = (
      <Flex align="center">
        <Avatar mr={3} name={data.me.username} />
        <label>{data.me.username}</label>
      </Flex>
    );
    logout = (
      <Button onClick={() => logoutMutation()} isLoading={logoutFetching}>
        Logout
      </Button>
    );
  }
  return (
    <Flex
      flexDirection="row"
      justifyContent="space-between"
      bg={theme.colors.teal[400]}
      p={4}
    >
      {body}
      {logout}
    </Flex>
  );
}
