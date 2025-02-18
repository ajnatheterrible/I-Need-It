import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";

const WishlistForm = ({
  isOpen,
  onClose,
  createNewWishlist,
  fetchWishlists,
  userId,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const toast = useToast();

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please provide a name for the wishlist.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    try {
      await createNewWishlist(userId, name, description); // Create wishlist in Firestore

      toast({
        title: "Wishlist created!",
        description: `Successfully created the wishlist: ${name}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Reset form and close modal
      setName("");
      setDescription("");
      onClose();

      // Immediately fetch updated wishlists after closing modal
      await fetchWishlists(userId);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Wishlist</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Input
              placeholder="Wishlist Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Save Wishlist
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WishlistForm;
