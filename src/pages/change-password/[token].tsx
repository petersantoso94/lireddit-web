import { Box, Button } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useState } from "react";
import FormAlert, { AlertType } from "../../components/FormAlert";
import InputField from "../../components/InputField";
import Wrapper from "../../components/Wrapper";
import { QUERY_TOKEN } from "../../Constants";
import { useChangePasswordMutation } from "../../generated/graphql";
import { createUrqlClient, toErrorMap } from "../../utils/utils";

const ChangePassword = () => {
  const router = useRouter();
  const token = router.query[QUERY_TOKEN] as string;
  const [_, changePassword] = useChangePasswordMutation();
  const [tokenError, settokenError] = useState("");
  return (
    <Wrapper variant="regular">
      {tokenError && (
        <FormAlert
          closeAlert={() => settokenError("")}
          message={tokenError}
          type={AlertType.Error}
        />
      )}
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async ({ newPassword }, { setErrors }) => {
          const response = await changePassword({ newPassword, token });
          if (response.data.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);
            if ("token" in errorMap) {
              settokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (response.data.changePassword.user) {
            // change password success
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="newPassword"
              placeholder="New Password"
              label="New Password"
              type="password"
            />
            <Box mt={5}>
              <Button
                type="submit"
                isLoading={isSubmitting}
                variantColor="teal"
              >
                Change Password
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ChangePassword);
