import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

export default function CompleteSignup() {
  const { user, setUser } = useAuthStore();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showHint, setShowHint] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (user && user.username) {
      navigate("/");
    }
  }, [user, navigate]);

  const isValid = /^[a-zA-Z0-9]{3,30}$/.test(username);

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/set-username", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Username is taken.");
        setLoading(false);
        return;
      }

      toast({
        title: "Username set!",
        description: "Your account is now complete",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setUser({ ...user, username });
      navigate("/");
    } catch (err) {
      console.error("🔥 Frontend fetch error:", err);
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex minH="100vh" bg="gray.50" align="center" justify="center" px={4}>
      <Box
        bg="white"
        p={8}
        rounded="xl"
        shadow="lg"
        w="full"
        maxW="lg"
        textAlign="center"
      >
        <Heading size="lg" mb={2}>
          Finish setting up
        </Heading>
        <Text mb={6} color="gray.600">
          Choose your username to complete your account
        </Text>

        <VStack spacing={4} align="stretch">
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => {
              const value = e.target.value;

              const filtered = value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 30);

              setUsername(filtered);
            }}
            onFocus={() => setShowHint(true)}
            onBlur={() => !username && setShowHint(false)}
            onKeyDown={(e) => e.key === "Enter" && isValid && handleSubmit()}
            isDisabled={loading}
            isInvalid={!isValid && username.length > 0}
          />

          {showHint && (
            <Text
              fontSize="sm"
              color={
                username.length === 0
                  ? "red.500"
                  : isValid
                  ? "gray.500"
                  : "red.500"
              }
              mt={-2}
            >
              3–30 characters, letters and numbers only. No symbols or spaces.
            </Text>
          )}

          <Button
            colorScheme="blue"
            w="full"
            onClick={handleSubmit}
            isLoading={loading}
            isDisabled={!isValid}
          >
            Continue
          </Button>

          {errorMsg && (
            <Text color="red.500" fontSize="sm" mt={-1}>
              {errorMsg}
            </Text>
          )}
        </VStack>
      </Box>
    </Flex>
  );
}
