import { Box, Button } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useState } from "react";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/utils";
import { CAlertDialog } from "../components/CAlertDialog";

const forgotPassword = () => {
  const router = useRouter();
  const [_, forgotPassword] = useForgotPasswordMutation();
  const [showAlert, setshowAlert] = useState(false);
  return (
    <>
      <CAlertDialog
        header="Success"
        message="Succesfully sent the next step to your email"
        submitButtonColor="green"
        submitButtonText="Go to login page"
        setShowAlert={setshowAlert}
        showAlert={showAlert}
        onSubmit={() => router.push("/login")}
      />
      <Wrapper variant="regular">
        <Formik
          initialValues={{ email: "" }}
          onSubmit={async ({ email }) => {
            await forgotPassword({ email });
            setshowAlert(true);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField name="email" placeholder="Email" label="Email" />
              <Box mt={5}>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  variantColor="teal"
                >
                  Reset Password
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(forgotPassword);
