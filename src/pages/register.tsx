import * as React from "react";
import { Formik, Form } from "formik";
import { Button, Box } from "@chakra-ui/core";
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap, createUrqlClient } from "../utils/utils";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";

interface Props {}

function Register({}: Props): React.ReactElement {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <Wrapper variant="regular">
      <Formik
        initialValues={{ email: "", username: "", password: "" }}
        onSubmit={async (value, { setErrors }) => {
          const response = await register({ options: value });
          if (response.data.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data.register.user) {
            // register success
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              color="black"
              name="username"
              placeholder="Username"
              label="Username"
            />
            <InputField
              color="black" name="email" placeholder="Email" label="Email" />
            <InputField
              color="black"
              name="password"
              placeholder="Password"
              label="Password"
              type="password"
            />
            <Box mt={5}>
              <Button
                type="submit"
                isLoading={isSubmitting}
                variantColor="teal"
              >
                Register
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

export default withUrqlClient(createUrqlClient)(Register);
