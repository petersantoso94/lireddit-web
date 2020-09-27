import { Box, Button } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { createUrqlClient, toErrorMap } from "../utils/utils";
import { useCreatePostMutation } from "../generated/graphql";
import FormAlert, { AlertType } from "../components/FormAlert";

const CreatePost = () => {
  const [, createPostMutation] = useCreatePostMutation();
  const [userNotAuthenticated, setuserNotAuthenticated] = useState("");
  return (
    <Wrapper variant="small">
      {userNotAuthenticated && (
        <FormAlert message={userNotAuthenticated} type={AlertType.Error} />
      )}
      <Formik
        initialValues={{ title: "", content: "" }}
        onSubmit={async (value, { setErrors }) => {
          setuserNotAuthenticated("");
          const response = await createPostMutation(value);
          if (response.error != null) {
            setuserNotAuthenticated("User Not Authenticated");
            return;
          }
          const newPost = response.data.createPost.post;
          if (!response.data || !!response.data.createPost.errors) {
            setErrors(toErrorMap(response.data.createPost.errors));
          } else if (newPost) {
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="Title" label="Title" />
            <InputField
              isTextArea={true}
              name="content"
              placeholder="Post's content"
              label="Post's content"
            />
            <Box mt={5}>
              <Button
                type="submit"
                isLoading={isSubmitting}
                variantColor="teal"
              >
                Submit post
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
