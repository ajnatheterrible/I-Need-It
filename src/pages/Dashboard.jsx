import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Button,
  VStack,
  HStack,
  IconButton,
  List,
  ListItem,
  useToast,
  useDisclosure,
  Center,
  Image,
} from "@chakra-ui/react";
import { DeleteIcon, AddIcon, EditIcon } from "@chakra-ui/icons";
import { useAuthStore } from "../store/auth-store";
import { useWishlistStore } from "../store/wishlist-store";
import WishlistForm from "../components/WishlistForm";
import AddItemModal from "../components/AddItemModal";
import EditWishlistModal from "../components/EditWishlistModal";

const Dashboard = () => {
  const {
    isOpen: isWishlistOpen,
    onOpen: onWishlistOpen,
    onClose: onWishlistClose,
  } = useDisclosure();

  const {
    isOpen: isItemOpen,
    onOpen: onItemOpen,
    onClose: onItemClose,
  } = useDisclosure();

  const userId = useAuthStore((state) => state.currentUser?.uid);

  const {
    wishlists,
    fetchWishlists,
    createNewWishlist,
    deleteWishlist,
    addItem,
    deleteItem,
    uploadImage,
  } = useWishlistStore();

  const toast = useToast();

  const [selectedWishlist, setSelectedWishlist] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchWishlists(userId);
    }
  }, [userId]);

  return (
    <Box maxW="600px" mx="auto" mt={6} p={4} borderRadius="lg" shadow="md">
      <Button
        colorScheme="blue"
        leftIcon={<AddIcon />}
        onClick={onWishlistOpen}
        mb={4}
        mr={2}
      >
        Create Wishlist
      </Button>

      <WishlistForm
        isOpen={isWishlistOpen}
        onClose={onWishlistClose}
        createNewWishlist={createNewWishlist}
        fetchWishlists={fetchWishlists}
        userId={userId}
      />

      <AddItemModal
        isOpen={isItemOpen}
        onClose={onItemClose}
        addItem={addItem}
        fetchWishlists={fetchWishlists}
        userId={userId}
        wishlists={wishlists}
        uploadImage={uploadImage}
      />

      <EditWishlistModal
        isOpen={!!selectedWishlist}
        onClose={() => setSelectedWishlist(null)}
        wishlist={selectedWishlist}
        userId={userId}
      />

      <Button
        colorScheme="blue"
        leftIcon={<AddIcon />}
        onClick={onItemOpen}
        mb={4}
      >
        Add Item
      </Button>

      <List spacing={3}>
        {wishlists.length > 0 ? (
          wishlists.map((wishlist) => (
            <ListItem
              key={wishlist.id}
              p={3}
              gap={3}
              shadow="sm"
              borderWidth="1px"
              borderRadius="md"
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Text fontWeight="medium">{wishlist.name}</Text>

              {wishlist?.items?.length > 0 ? (
                wishlist.items.map(
                  (
                    {
                      id,
                      name,
                      price,
                      size,
                      color,
                      category,
                      department,
                      imageUrl,
                    },
                    index
                  ) => (
                    <Box
                      key={index}
                      p={3}
                      shadow="sm"
                      borderWidth="1px"
                      borderRadius="md"
                      display="flex"
                      flexDirection="column"
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      {name && <Text>{name}</Text>}
                      {category && <Text>Category: {category}</Text>}
                      {department && <Text>Department: {department}</Text>}
                      {price && <Text>Price: ${price}</Text>}
                      {size && <Text>Size: {size}</Text>}
                      {color && <Text>Color: {color}</Text>}
                      {imageUrl && <Image src={imageUrl} alt={name} />}
                      <IconButton
                        alignSelf="flex-end"
                        aria-label="Delete item"
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        mt={1}
                        onClick={() => deleteItem(userId, wishlist.id, id)}
                      />
                    </Box>
                  )
                )
              ) : (
                <Text color="gray.300">No items yet</Text>
              )}

              <IconButton
                alignSelf="flex-end"
                aria-label="Edit wishlist"
                icon={<EditIcon />}
                colorScheme="blue"
                onClick={() => setSelectedWishlist(wishlist)}
              />
            </ListItem>
          ))
        ) : (
          <Text color="gray.500">No wishlists yet. Start by creating one!</Text>
        )}
      </List>
    </Box>
  );
};

export default Dashboard;
