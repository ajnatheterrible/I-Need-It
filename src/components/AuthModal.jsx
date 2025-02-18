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
} from "@chakra-ui/react";
import { useState } from "react";
import { signIn, signUp } from "../firebase/auth-service";

const AuthModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const toast = useToast();

  const handleSubmit = async () => {
    try {
      if (isSignUp) {
        await signUp(email, password);
        toast({
          title: "Sign-up successful.",
          description: "Your account has been created successfully!",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        await signIn(email, password);
        toast({
          title: "Sign-in successful.",
          description: "You are now logged in.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
      onClose(); // Close the modal after successful login/signup
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isSignUp ? "Sign Up" : "Log In"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing="4">
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" width="full" onClick={handleSubmit}>
            {isSignUp ? "Sign Up" : "Log In"}
          </Button>
          <Text mt="2" fontSize="sm" textAlign="center" width="100%">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <Link color="blue.500" onClick={() => setIsSignUp((prev) => !prev)}>
              {isSignUp ? "Log In" : "Sign Up"}
            </Link>
          </Text>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AuthModal;
