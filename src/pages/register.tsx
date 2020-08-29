import * as React from "react";
import { Formik, Form } from "formik";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  Box,
} from "@chakra-ui/core";
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";

export interface IRegisterProps {}

export default class Register extends React.Component<IRegisterProps> {
  public render() {
    return (
      <Wrapper variant="regular">
        <Formik
          initialValues={{ username: "", password: "" }}
          onSubmit={(value) => {
            console.log(value);
          }}
        >
          {({ values, handleChange }) => (
            <Form>
              <InputField
                name="username"
                placeholder="Username"
                label="Username"
              />
              <InputField
                name="password"
                placeholder="Password"
                label="Password"
              />
              <Box mt={5}>
                <Button type="submit">Register</Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Wrapper>
    );
  }
}
