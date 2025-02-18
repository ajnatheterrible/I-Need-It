import { Box, Button, Flex, Text, useDisclosure } from "@chakra-ui/react";
import AuthModal from "./AuthModal";
import { useAuthStore } from "../store/auth-store";
import { logout } from "../firebase/auth-service";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentUser = useAuthStore((state) => state.currentUser);

  return (
    <>
      <Flex
        bg="white"
        color="black"
        alignItems="center"
        justifyContent="space-between"
        p="4"
      >
        <Text fontSize="xl" fontWeight="bold">
          I Need It
        </Text>

        <Flex gap="4">
          {currentUser ? (
            <Button colorScheme="red" size="sm" onClick={logout}>
              Log Out
            </Button>
          ) : (
            <Button colorScheme="blue" size="sm" onClick={onOpen}>
              Log In / Sign Up
            </Button>
          )}
        </Flex>
      </Flex>

      {/* Auth Modal */}
      {!currentUser && <AuthModal isOpen={isOpen} onClose={onClose} />}
    </>
  );
};

export default Navbar;
