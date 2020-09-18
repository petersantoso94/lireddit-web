import React from "react";
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from "@chakra-ui/core";

type Props = {
  cancelButtonText?: string;
  header: string;
  message: string;
  submitButtonText: string;
  submitButtonColor: string;
  showAlert: boolean;
  setShowAlert: (show: boolean) => void;
  onSubmit: () => void;
};

export const CAlertDialog = ({
  cancelButtonText,
  onSubmit,
  message,
  header,
  submitButtonText,
  submitButtonColor,
  showAlert,
  setShowAlert,
}: Props) => {
  const onClose = () => {
    onSubmit();
    setShowAlert(false);
  };
  const cancelRef = React.useRef();
  return (
    <div>
      <AlertDialog
        isOpen={showAlert}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {header}
          </AlertDialogHeader>

          <AlertDialogBody>{message}</AlertDialogBody>

          <AlertDialogFooter>
            {cancelButtonText && (
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button variantColor={submitButtonColor} onClick={onClose} ml={3}>
              {submitButtonText}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
