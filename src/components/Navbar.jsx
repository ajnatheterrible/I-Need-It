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
import Container from "./Container";
import MenuDropdown from "./MenuDropdown";

const navLinks = [
  { label: "DESIGNERS", path: "/designers" },
  { label: "MENSWEAR", path: "/menswear" },
  { label: "WOMENSWEAR", path: "/womenswear" },
  { label: "SNEAKERS", path: "/sneakers" },
  { label: "EDITORIAL", path: "/editorial" },
  { label: "COLLECTIONS", path: "/collections" },
];

const popularDesigners = [
  "Acne Studios",
  "Amiri",
  "Arc'teryx",
  "Balenciaga",
  "Bape",
  "Bottega Veneta",
  "Carhartt",
  "Celine",
  "Chanel",
  "Chrome Hearts",
  "Comme des Garçons",
  "Dior",
  "Enfants Riches Déprimés",
  "Gucci",
  "Kapital",
  "Louis Vuitton",
  "Maison Margiela",
  "Moncler",
  "Nike",
  "Polo Ralph Lauren",
  "Prada",
  "Raf Simons",
  "Rick Owens",
  "Saint Laurent Paris",
  "Stone Island",
  "Stussy",
  "Supreme",
  "Undercover",
  "Vetements",
  "Vintage",
  "Vivienne Westwood",
  "Yohji Yamamoto",
];

const menswearItems = [
  {
    heading: "Tops",
    items: [
      "Long Sleeve T-Shirts",
      "Polos",
      "Shirts (Button Ups)",
      "Short Sleeve T-Shirts",
      "Sweaters & Knitwear",
      "Sweatshirts & Hoodies",
      "Tank Tops & Sleeveless",
      "Jerseys",
    ],
  },
  {
    heading: "Bottoms",
    items: [
      "Casual Pants",
      "Cropped Pants",
      "Denim",
      "Leggings",
      "Overalls & Jumpsuits",
      "Shorts",
      "Sweatpants & Joggers",
      "Swimwear",
    ],
  },
  {
    heading: "Outerwear",
    items: [
      "Bombers",
      "Cloaks & Capes",
      "Denim Jackets",
      "Heavy Coats",
      "Leather Jackets",
      "Light Jackets",
      "Parkas",
      "Raincoats",
      "Vests",
    ],
  },
  {
    heading: "Footwear",
    items: [
      "Boots",
      "Casual Leather Shoes",
      "Formal Shoes",
      "Hi-Top Sneakers",
      "Low-Top Sneakers",
      "Sandals",
      "Slip Ons",
    ],
  },
  {
    heading: "Accessories",
    items: [
      "Bags & Luggage",
      "Belts",
      "Glasses",
      "Gloves & Scarves",
      "Hats",
      "Jewelry & Watches",
      "Wallets",
      "Miscellaneous",
      "Socks & Underwear",
      "Sunglasses",
      "Ties & Pocketsquares",
    ],
  },
  {
    heading: "Tailoring",
    items: [
      "Blazers",
      "Formal Shirting",
      "Formal Trousers",
      "Suits",
      "Tuxedos",
      "Vests",
    ],
  },
];

const womenswearItems = [
  {
    heading: "Tops",
    items: [
      "Blouses",
      "Bodysuits",
      "Button Ups",
      "Crop Tops",
      "Hoodies",
      "Long Sleeve T-Shirts",
      "Polos",
      "Short Sleeve T-Shirts",
      "Sweaters",
      "Sweatshirts",
      "Tank Tops",
    ],
  },
  {
    heading: "Bottoms",
    items: [
      "Jeans",
      "Jumpsuits",
      "Leggings",
      "Maxi Skirts",
      "Midi Skirts",
      "Mini Skirts",
      "Pants",
      "Shorts",
      "Dresses",
      "Mini Dresses",
      "Midi Dresses",
      "Maxi Dresses",
      "Gowns",
    ],
  },
  {
    heading: "Outerwear",
    items: [
      "Blazers",
      "Bombers",
      "Coats",
      "Denim Jackets",
      "Down Jackets",
      "Fur & Faux Fur",
      "Jackets",
      "Leather Jackets",
      "Rain Jackets",
      "Vests",
    ],
  },
  {
    heading: "Footwear",
    items: [
      "Boots",
      "Heels",
      "Platforms",
      "Mules",
      "Flats",
      "Hi-Top Sneakers",
      "Low-Top Sneakers",
      "Sandals",
      "Slip Ons",
    ],
  },
  {
    heading: "Accessories",
    items: [
      "Belts",
      "Glasses",
      "Gloves",
      "Hair Accessories",
      "Hats",
      "Miscellaneous",
      "Scarves",
      "Socks & Intimates",
      "Sunglasses",
      "Wallets",
      "Watches",
    ],
  },
  {
    heading: "Jewelry",
    items: ["Bracelets", "Earrings", "Necklaces", "Rings"],
  },
  {
    heading: "Bags & Luggage",
    items: [
      "Backpacks",
      "Belt Bags",
      "Bucket Bags",
      "Clutches",
      "Crossbody Bags",
      "Handle Bags",
      "Hobo Bags",
      "Luggage & Travel",
      "Messengers & Satchels",
      "Mini Bags",
      "Shoulder Bags",
      "Tote Bags",
      "Other",
    ],
  },
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
    setIsModalOpen((prev) => !prev); // Toggle the profile dropdown
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

            <InputGroup maxW="600px" flex="1">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.500" />
              </InputLeftElement>
              <Input
                placeholder="Search for anything"
                borderRadius="md"
                pr="90px"
                _focus={{
                  borderColor: "gray.300",
                  boxShadow: "0 0 0 1px #E2E8F0",
                }}
              />
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
                onClick={toggleProfileDropdown} // Toggle profile dropdown
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
                        test_user1
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
        items={popularDesigners}
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
