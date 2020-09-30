import React from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
} from "@chakra-ui/core";

export enum AlertType {
  Error = "error",
  Success = "success",
  Warning = "warning",
  Information = "info",
}

type Prop = {
  type: AlertType;
  header?: string;
  message: string;
  closeAlert: () => void;
};

const FormAlert = ({ header, message, type, closeAlert }: Prop) => {
  return (
    <Alert status={type}>
      <AlertIcon />
      {header && <AlertTitle mr={2}>{header}</AlertTitle>}
      <AlertDescription>{message}</AlertDescription>
      <CloseButton
        position="absolute"
        right="8px"
        top="8px"
        onClick={closeAlert}
      />
    </Alert>
  );
};

export default FormAlert;
