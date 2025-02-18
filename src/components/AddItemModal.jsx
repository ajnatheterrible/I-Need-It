import { useState } from "react";
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
import {
  FaTshirt,
  FaShoePrints,
  FaGlasses,
  FaVest,
  FaMale,
} from "react-icons/fa";
import CustomMenu from "./CustomMenu";
import FileUpload from "./FileUpload";

const AddItemModal = ({
  isOpen,
  onClose,
  addItem,
  userId,
  wishlists,
  fetchWishlists,
  uploadImage,
}) => {
  const [wishlistId, setWishlistId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [category, setCategory] = useState("");
  const [department, setDepartment] = useState("");
  const [imageFile, setImageFile] = useState("");

  const toast = useToast();

  const isSubmitDisabled =
    !wishlistId ||
    !name.trim() ||
    !price.trim() ||
    !size.trim() ||
    !color.trim() ||
    !category.trim() ||
    !department.trim();

  const handleSubmit = async () => {
    if (isSubmitDisabled) return;

    try {
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, userId, wishlistId);
      }

      await addItem(userId, wishlistId, {
        category,
        department,
        name,
        price,
        size,
        color,
        imageUrl,
      });

      toast({
        title: "Item added!",
        description: `Successfully added ${name}`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      setWishlistId("");
      setCategory("");
      setDepartment("");
      setName("");
      setPrice("");
      setSize("");
      setColor("");
      setImageFile("");

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
        <ModalHeader>Add an item</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <CustomMenu
              placeholder="Select Wishlist"
              options={wishlists.map((w) => w.name)} // Just the names for display
              selected={
                wishlistId
                  ? wishlists.find((w) => w.id === wishlistId)?.name
                  : null
              }
              onSelect={(name) => {
                const selectedWishlist = wishlists.find((w) => w.name === name);
                setWishlistId(selectedWishlist.id);
              }}
            />

            <CustomMenu
              placeholder="Category"
              options={["Menswear", "Womenswear"]}
              selected={category}
              onSelect={setCategory}
            />

            <CustomMenu
              placeholder="Department"
              options={[
                { name: "Tops", icon: FaTshirt },
                { name: "Bottoms", icon: FaMale },
                { name: "Outerwear", icon: FaVest },
                { name: "Footwear", icon: FaShoePrints },
                { name: "Accessories", icon: FaGlasses },
              ]}
              selected={department}
              onSelect={setDepartment}
            />

            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              bg="white"
              borderWidth="1px"
              borderColor="gray.200"
              _hover={{ borderColor: "gray.300" }}
              _focus={{ boxShadow: "outline" }}
              fontWeight="normal"
            />

            <Input
              placeholder="Price"
              type="text"
              inputMode="numeric" // Mobile keyboard shows only numbers
              pattern="[0-9]*"
              value={price}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d*$/.test(val)) {
                  setPrice(val);
                }
              }}
              bg="white"
              borderWidth="1px"
              borderColor="gray.200"
              _hover={{ borderColor: "gray.300" }}
              _focus={{ boxShadow: "outline" }}
              fontWeight="normal"
            />

            <CustomMenu
              placeholder="Size"
              options={["XS", "S", "M", "L", "XL"]}
              selected={size}
              onSelect={setSize}
            />

            <Input
              placeholder="Color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              bg="white"
              borderWidth="1px"
              borderColor="gray.200"
              _hover={{ borderColor: "gray.300" }}
              _focus={{ boxShadow: "outline" }}
              fontWeight="normal"
            />

            <FileUpload onFileSelect={setImageFile} />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isDisabled={isSubmitDisabled}
          >
            Add Item
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddItemModal;
