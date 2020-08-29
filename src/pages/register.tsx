import * as React from "react";
import { Formik, Form } from "formik";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/core";
import Wrapper from "../components/Wrapper";

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
              <FormControl>
                <FormLabel htmlFor="username">Username</FormLabel>
                <Input
                  id="username"
                  placeholder="username"
                  value={values.username}
                  onChange={handleChange}
                />
                {/* <FormErrorMessage>{form.errors.name}</FormErrorMessage> */}
              </FormControl>
            </Form>
          )}
        </Formik>
      </Wrapper>
    );
  }
}
