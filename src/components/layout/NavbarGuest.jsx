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
import { useNavigate } from "react-router-dom";
import Container from "../shared/Container";
import { Link as RouterLink } from "react-router-dom";

export default function NavbarGuest({ onOpenAuthModal }) {
  const navigate = useNavigate();

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
            <Input placeholder="Search for anything" />
            <InputRightElement width="90px">
              <Button
                as={RouterLink}
                to="/search-results"
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
