import {
  Box,
  Flex,
  HStack,
  Button,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
  Link as ChakraLink,
  VStack,
  Divider,
} from "@chakra-ui/react";
import { SearchIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { FaRegHeart, FaRegUser, FaRegCommentDots } from "react-icons/fa";
import {
  Link as RouterLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useState, useRef, useEffect } from "react";

import Container from "../shared/Container";
import useAuthStore from "../../store/authStore";
import { useAuthModal } from "../../context/AuthModalContext";
import NavSubMenu from "./NavSubMenu";

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams] = useSearchParams();

  const profileDropdownRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const query = searchParams.get("query");

  const user = useAuthStore((s) => s.user);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const logout = useAuthStore((s) => s.logout);
  const onOpenAuthModal = useAuthModal();

  useEffect(() => {
    setSearchTerm("");
    setIsModalOpen(false);
  }, [location.pathname, query]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsModalOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      navigate("/shop");
    } else {
      navigate(`/shop?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
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
    >
      <Container>
        <Flex align="center" justify="space-between" py={4}>
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
              onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
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

          {isLoggedIn ? (
            <Button
              size="sm"
              variant="outline"
              textTransform="uppercase"
              fontWeight="medium"
              minW="64px"
              h="40px"
              px="0"
              as={RouterLink}
              to="/sell"
            >
              SELL
            </Button>
          ) : (
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
              SELL
            </Button>
          )}

          <HStack spacing={4} position="relative">
            {isLoggedIn ? (
              <>
                <IconButton
                  icon={<FaRegCommentDots />}
                  aria-label="Messages"
                  variant="ghost"
                  as={RouterLink}
                  to="/messages"
                />
                <IconButton
                  icon={<FaRegHeart />}
                  aria-label="Favorites"
                  variant="ghost"
                  as={RouterLink}
                  to="/favorites"
                />
                <IconButton
                  icon={<FaRegUser />}
                  aria-label="Profile"
                  variant="ghost"
                  onClick={() => setIsModalOpen((prev) => !prev)}
                />
                {isModalOpen && (
                  <Box
                    ref={profileDropdownRef}
                    position="absolute"
                    top="48px"
                    right="0"
                    transform="translateX(40%)"
                    bg="white"
                    boxShadow="md"
                    borderRadius="md"
                    zIndex="1001"
                    px={6}
                    py={4}
                  >
                    <VStack align="start" spacing={4}>
                      <HStack justify="space-between" w="100%">
                        <ChakraLink
                          as={RouterLink}
                          to="/profile"
                          fontWeight="bold"
                          fontSize="md"
                          onClick={() => setIsModalOpen(false)}
                        >
                          {user.username}
                        </ChakraLink>
                        <ChevronRightIcon boxSize={4} color="gray.500" />
                      </HStack>
                      <ChakraLink
                        fontSize="xs"
                        as={RouterLink}
                        to="/profile/favorites"
                        onClick={() => setIsModalOpen(false)}
                      >
                        FAVORITES
                      </ChakraLink>
                      <ChakraLink
                        fontSize="xs"
                        as={RouterLink}
                        to="/purchases"
                        onClick={() => setIsModalOpen(false)}
                      >
                        ORDERS
                      </ChakraLink>
                      <Divider />
                      <HStack justify="space-between" w="100%">
                        <ChakraLink
                          as={RouterLink}
                          to="/for-sale"
                          fontWeight="bold"
                          fontSize="md"
                          onClick={() => setIsModalOpen(false)}
                        >
                          SELLING
                        </ChakraLink>
                        <ChevronRightIcon boxSize={3.5} color="gray.500" />
                      </HStack>
                      <ChakraLink
                        fontSize="xs"
                        as={RouterLink}
                        to="/for-sale"
                        onClick={() => setIsModalOpen(false)}
                      >
                        FOR SALE
                      </ChakraLink>
                      <ChakraLink
                        fontSize="xs"
                        as={RouterLink}
                        to="/sold"
                        onClick={() => setIsModalOpen(false)}
                      >
                        SOLD
                      </ChakraLink>
                      <ChakraLink
                        fontSize="xs"
                        as={RouterLink}
                        to="/drafts"
                        onClick={() => setIsModalOpen(false)}
                      >
                        DRAFTS
                      </ChakraLink>
                      <Divider />
                      <HStack justify="space-between" w="100%">
                        <ChakraLink
                          as={RouterLink}
                          to="/profile-settings"
                          fontWeight="bold"
                          fontSize="sm"
                          onClick={() => setIsModalOpen(false)}
                        >
                          SETTINGS
                        </ChakraLink>
                        <ChevronRightIcon boxSize={3.5} color="gray.500" />
                      </HStack>
                      <Text
                        as={ChakraLink}
                        fontSize="xs"
                        color="gray.400"
                        cursor="pointer"
                        _hover={{ color: "black" }}
                        onClick={handleLogout}
                      >
                        SIGN OUT
                      </Text>
                    </VStack>
                  </Box>
                )}
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => onOpenAuthModal("register")}
                >
                  Sign Up
                </Button>
                <Button
                  colorScheme="blackAlpha"
                  onClick={() => onOpenAuthModal("login")}
                >
                  Log In
                </Button>
              </>
            )}
          </HStack>
        </Flex>
      </Container>

      <Box borderBottom="1px solid" borderColor="gray.200" />
      <NavSubMenu />
    </Box>
  );
}
