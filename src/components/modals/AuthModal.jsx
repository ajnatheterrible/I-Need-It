import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  Input,
  VStack,
  HStack,
  Divider,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import validator from "validator";
import useAuthStore from "../../store/authStore";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

export default function AuthModal({
  isOpen,
  onClose,
  view = "login",
  setView,
}) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [focusedField, setFocusedField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const login = useAuthStore((state) => state.login);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrorMessage("");

    if (name === "username") {
      const cleaned = value.replace(/[^a-zA-Z0-9]/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: cleaned,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const isValidUsername =
    validator.isAlphanumeric(formData.username) &&
    formData.username.length >= 3 &&
    formData.username.length <= 30;

  const isValidEmail = validator.isEmail(formData.email);

  const isStrongPassword = validator.isStrongPassword(formData.password, {
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  });

  const isFormValid =
    isValidEmail && isStrongPassword && (view === "login" || isValidUsername);

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch(`/api/auth/${view}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.user, data.token);
        window.scrollTo({ top: 0, behavior: "smooth" });
        onClose();
      } else {
        setErrorMessage(data.message || "Something went wrong");
      }
    } catch (err) {
      setErrorMessage("Network error. Please try again.");
    }

    setLoading(false);
  };

  const toggleView = () => {
    setView(view === "login" ? "register" : "login");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{view === "login" ? "Log In" : "Sign Up"}</ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            {view === "register" && (
              <>
                <Input
                  placeholder="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField(null)}
                />
                {focusedField === "username" && (
                  <Text
                    fontSize="xs"
                    color={!isValidUsername ? "red.500" : "gray.500"}
                  >
                    3–30 characters, letters and numbers only. No symbols or
                    spaces.
                  </Text>
                )}
              </>
            )}

            <Input
              placeholder="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
            />
            {focusedField === "email" && (
              <Text
                fontSize="xs"
                color={!isValidEmail ? "red.500" : "gray.500"}
              >
                Enter a valid email address.
              </Text>
            )}

            <Input
              placeholder="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
            />
            {focusedField === "password" && (
              <Text
                fontSize="xs"
                color={!isStrongPassword ? "red.500" : "gray.500"}
              >
                Minimum 6 characters, with uppercase, number, and symbol.
              </Text>
            )}

            {errorMessage && (
              <Text fontSize="sm" color="red.500" textAlign="center">
                {errorMessage}
              </Text>
            )}

            <Button
              width="100%"
              colorScheme="blackAlpha"
              onClick={handleSubmit}
              isLoading={loading}
              isDisabled={!isFormValid}
            >
              {view === "login" ? "Log In" : "Sign Up"}
            </Button>

            <Text fontSize="sm" color="gray.500" textAlign="center">
              {view === "login"
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              <Button
                variant="link"
                colorScheme="blackAlpha"
                onClick={toggleView}
              >
                {view === "login" ? "Sign up" : "Log in"}
              </Button>
            </Text>

            <HStack align="center" justify="center" my={4}>
              <Divider />
              <Text px={2} fontSize="sm" color="gray.500">
                OR
              </Text>
              <Divider />
            </HStack>

            <Button
              width="100%"
              variant="outline"
              leftIcon={<FcGoogle />}
              as="a"
              href="http://localhost:5000/api/auth/google"
            >
              Continue with Google
            </Button>

            <Button
              w="full"
              bg="black"
              color="white"
              _hover={{ bg: "#2c2c2c" }}
              leftIcon={<FaApple />}
              justifyContent="center"
              fontWeight="semibold"
            >
              Continue with Apple
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
