import {
  Box,
  Flex,
  HStack,
  Button,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../shared/Container";

export default function NavbarGuest({ onOpenAuthModal }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      navigate("/shop");
    } else {
      navigate(`/shop?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <Box
      borderBottom="1px solid"
      borderColor="gray.200"
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex="1000"
      bg="white"
      mb={10}
    >
      <Container>
        <Flex align="center" justify="space-between" py={4} position="relative">
          <Text
            fontSize="xl"
            fontWeight="bold"
            cursor="pointer"
            onClick={() => navigate("/")}
            whiteSpace="nowrap"
          >
            I NEED IT
          </Text>

          <InputGroup maxW="600px" flex="1" mx={6}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.500" />
            </InputLeftElement>
            <Input
              placeholder="Search for anything"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(e);
                }
              }}
            />
            <InputRightElement width="90px">
              <Button
                onClick={handleSearch}
                h="70%"
                borderLeftRadius="0"
                borderRightRadius="0"
                colorScheme="blackAlpha"
                variant="solid"
                fontSize="sm"
                w="80%"
              >
                SEARCH
              </Button>
            </InputRightElement>
          </InputGroup>

          <Button
            size="sm"
            variant="outline"
            textTransform="uppercase"
            fontWeight="medium"
            minW="64px"
            h="40px"
            px="0"
            onClick={() => onOpenAuthModal("register")}
          >
            Sell
          </Button>

          <HStack spacing={4}>
            <Button variant="ghost" onClick={() => onOpenAuthModal("register")}>
              Sign Up
            </Button>
            <Button
              colorScheme="blackAlpha"
              onClick={() => onOpenAuthModal("login")}
            >
              Log In
            </Button>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
