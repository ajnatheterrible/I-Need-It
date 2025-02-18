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
  Text,
  Link,
  useToast,
  Box,
} from "@chakra-ui/react";
import { useState } from "react";

const EditWishlistModal = ({ isOpen, onClose, userId, wishlist }) => {
  const [wishlistId, setWishlistId] = useState(""); // ✅ Store selected wishlist
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [department, setDepartment] = useState("");
  const [category, setCategory] = useState("");

  const handleEditItem = () => {};

  const handleEditWishlist = () => {};

  const handleDeleteItem = () => {};

  const handleDeleteWishlist = () => {};

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{wishlist && wishlist.name} </ModalHeader>
        <Text>ID: {wishlist && wishlist.id}</Text>
        {wishlist?.items?.map(
          (
            { name, category, department, price, size, color, imageUrl },
            index
          ) => (
            <Box mb={4} key={index}>
              {name && <Text>{name}</Text>}
              {category && <Text>Category: {category}</Text>}
              {department && <Text>Department: {department}</Text>}
              {price && <Text>Price: ${price}</Text>}
              {size && <Text>Size: {size}</Text>}
              {color && <Text>Color: {color}</Text>}
            </Box>
          )
        )}
        <ModalCloseButton />
      </ModalContent>
    </Modal>
  );
};

export default EditWishlistModal;
