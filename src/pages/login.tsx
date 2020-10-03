import * as React from "react";
import { Formik, Form } from "formik";
import { Button, Box, Link, Flex } from "@chakra-ui/core";
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap, createUrqlClient } from "../utils/utils";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { REDIRECT_TO } from "../Constants";

interface Props {}

function Login({}: Props): React.ReactElement {
  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <Wrapper variant="regular">
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (value, { setErrors }) => {
          const response = await login(value);
          if (response.data.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data.login.user) {
            // login success
            const redirect = router.query[REDIRECT_TO] as string;
            router.push(redirect || "/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="usernameOrEmail"
              placeholder="Username or email"
              label="Username or Email"
            />
            <InputField
              name="password"
              placeholder="Password"
              label="Password"
              type="password"
            />
            <Flex mt={2}>
              <NextLink href="/forgot-password">
                <Link color="blue" ml="auto">
                  Forgot password?
                </Link>
              </NextLink>
            </Flex>
            <Box mt={5}>
              <Button
                type="submit"
                isLoading={isSubmitting}
                variantColor="teal"
              >
                Login
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

// dont need ssr here in login
export default withUrqlClient(createUrqlClient)(Login);
