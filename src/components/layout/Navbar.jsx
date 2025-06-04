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
import {
  SearchIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { FaRegHeart, FaRegUser, FaRegCommentDots } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import Container from "../shared/Container";
import MenuDropdown from "../shared/MenuDropdown";
import designers from "../../data/designers";
import menswearItems from "../../data/menswearItems";
import womenswearItems from "../../data/womenswearItems";
import useAuthStore from "../../store/AuthStore";
import { useNavigate } from "react-router-dom";

const navLinks = [
  { label: "DESIGNERS", path: "/designers" },
  { label: "MENSWEAR", path: "/menswear" },
  { label: "WOMENSWEAR", path: "/womenswear" },
  { label: "SNEAKERS", path: "/sneakers" },
  { label: "EDITORIAL", path: "/editorial" },
  { label: "COLLECTIONS", path: "/collections" },
];

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const profileDropdownRef = useRef();
  const designersRef = useRef();
  const designersTriggerRef = useRef();
  const menswearRef = useRef();
  const menswearTriggerRef = useRef();
  const womenswearRef = useRef();
  const womenswearTriggerRef = useRef();
  const location = useLocation();

  const toggleMenu = (menuKey) => {
    setActiveMenu((prev) => (prev === menuKey ? null : menuKey));
  };

  const toggleProfileDropdown = () => {
    setIsModalOpen((prev) => !prev);
  };

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      navigate("/shop");
    } else {
      navigate(`/shop?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  useEffect(() => {
    setActiveMenu(null);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsModalOpen(false);
      }

      if (
        activeMenu === "designers" &&
        designersRef.current &&
        !designersRef.current.contains(event.target) &&
        designersTriggerRef.current &&
        !designersTriggerRef.current.contains(event.target)
      ) {
        setActiveMenu(null);
      }

      if (
        activeMenu === "menswear" &&
        menswearRef.current &&
        !menswearRef.current.contains(event.target) &&
        menswearTriggerRef.current &&
        !menswearTriggerRef.current.contains(event.target)
      ) {
        setActiveMenu(null);
      }

      if (
        activeMenu === "womenswear" &&
        womenswearRef.current &&
        !womenswearRef.current.contains(event.target) &&
        womenswearTriggerRef.current &&
        !womenswearTriggerRef.current.contains(event.target)
      ) {
        setActiveMenu(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeMenu]);

  return (
    <>
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
          <Flex
            align="center"
            justify="space-between"
            py={4}
            position="relative"
          >
            <Text
              fontSize="xl"
              fontWeight="bold"
              as={RouterLink}
              to="/"
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
                borderRadius="md"
                pr="90px"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(e);
                  }
                }}
                _focus={{
                  borderColor: "gray.300",
                  boxShadow: "0 0 0 1px #E2E8F0",
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
              as={RouterLink}
              to="/sell"
            >
              Sell
            </Button>

            <HStack spacing={6} position="relative">
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
                onClick={toggleProfileDropdown}
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
                      onClick={() => {
                        logout();
                        setIsModalOpen(false);
                      }}
                    >
                      SIGN OUT
                    </Text>
                  </VStack>
                </Box>
              )}
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Container>
        <HStack
          justify="space-between"
          py={4}
          fontSize="xs"
          fontWeight="semibold"
          mt="72px"
        >
          {navLinks.map(({ label, path }) => {
            const isDropdown =
              label === "DESIGNERS" ||
              label === "MENSWEAR" ||
              label === "WOMENSWEAR";
            const menuKey = label.toLowerCase();
            const triggerRef =
              label === "DESIGNERS"
                ? designersTriggerRef
                : label === "MENSWEAR"
                ? menswearTriggerRef
                : womenswearTriggerRef;

            if (isDropdown) {
              return (
                <Box key={label} position="relative">
                  <ChakraLink
                    ref={triggerRef}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleMenu(menuKey);
                    }}
                    display="flex"
                    alignItems="center"
                    fontWeight="semibold"
                    cursor="pointer"
                    _hover={{
                      textDecoration: "none",
                      textShadow: "0 0 8px #DCEF31",
                    }}
                  >
                    {label} <ChevronDownIcon ml={1} />
                  </ChakraLink>
                </Box>
              );
            }

            return (
              <ChakraLink
                key={label}
                as={RouterLink}
                to={path}
                _hover={{ textDecoration: "underline" }}
              >
                {label}
              </ChakraLink>
            );
          })}
        </HStack>
      </Container>

      <MenuDropdown
        isOpen={activeMenu === "designers"}
        title="Shop Popular Designers"
        items={designers}
        columns={4}
        seeAllHref="/designers"
        ref={designersRef}
        onClose={() => setActiveMenu(null)}
        seeAllLabel="Designers"
      />
      <MenuDropdown
        isOpen={activeMenu === "menswear"}
        title="Shop by Category"
        items={menswearItems}
        columns={4}
        seeAllHref="/menswear"
        ref={menswearRef}
        onClose={() => setActiveMenu(null)}
        seeAllLabel="Categories"
      />
      <MenuDropdown
        isOpen={activeMenu === "womenswear"}
        title="Shop by Category"
        items={womenswearItems}
        columns={4}
        seeAllHref="/womenswear"
        ref={womenswearRef}
        onClose={() => setActiveMenu(null)}
        seeAllLabel="Categories"
      />

      <Box borderBottom="1px solid" borderColor="gray.200" />
    </>
  );
}
