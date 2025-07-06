import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";

function DeleteDraftDialog({ onConfirm, isSubmitting }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  return (
    <>
      <Button
        variant="outline"
        colorScheme="red"
        onClick={onOpen}
        isDisabled={isSubmitting}
      >
        Discard
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent p={8}>
            <AlertDialogBody textAlign="center">
              Are you sure you want to permanently delete this draft? This
              action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter justifyContent="center">
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                ml={4}
                isLoading={isSubmitting}
              >
                Discard
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default DeleteDraftDialog;
