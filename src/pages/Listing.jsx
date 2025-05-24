import {
  Box,
  Grid,
  GridItem,
  Text,
  Heading,
  Button,
  VStack,
  HStack,
  Flex,
  Divider,
  Image,
  IconButton,
  Badge,
  useDisclosure,
  Avatar,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaRegHeart, FaRegClock } from "react-icons/fa";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import Container from "../components/shared/Container";
import Footer from "../components/layout/Footer";
import OfferModal from "../components/modals/OfferModal";
import MessageModal from "../components/modals/MessageModal";

const listings = Array(4).fill({
  id: 1,
  brand: "THE VIRIDI-ANNE",
  title: "Leather mask hooded jacket",
  size: "M",
  price: "$1200",
  oldPrice: "$1300",
  timestamp: "about 5 hours ago",
  freeShipping: true,
  imageUrl: "/placeholder.jpg",
});

export default function ListingPage() {
  const {
    isOpen: isOfferOpen,
    onOpen: onOfferOpen,
    onClose: onOfferClose,
  } = useDisclosure();

  const {
    isOpen: isMessageOpen,
    onOpen: onMessageOpen,
    onClose: onMessageClose,
  } = useDisclosure();

  return (
    <>
      <Container>
        <Grid templateColumns="repeat(12, 1fr)" gap={6} mt={10}>
          <GridItem colSpan={[12, null, 8]}>
            <Grid templateColumns="repeat(8, 1fr)" gap={2}>
              <GridItem colSpan={1}>
                <Box
                  h="100%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Button variant="ghost" fontSize="2xl">
                    ‹
                  </Button>
                </Box>
              </GridItem>
              <GridItem colSpan={6}>
                <Box bg="gray.100" w="100%" h="500px" borderRadius="md" />
              </GridItem>
              <GridItem colSpan={1}>
                <Box
                  h="100%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Button variant="ghost" fontSize="2xl">
                    ›
                  </Button>
                </Box>
              </GridItem>
            </Grid>
            <Grid templateColumns="repeat(8, 1fr)" gap={2} mt={2}>
              {[...Array(4)].map((_, i) => (
                <GridItem colSpan={1} key={i}>
                  <Box bg="gray.200" h="80px" borderRadius="md" />
                </GridItem>
              ))}
            </Grid>
          </GridItem>

          <GridItem colSpan={[12, null, 4]}>
            <VStack align="start" spacing={5}>
              <Box>
                <Heading size="md">KMrii</Heading>
                <Text>KMrii belt bag</Text>
                <Text fontSize="sm">Size: ONE SIZE</Text>
                <Text fontSize="sm">Color: Black</Text>
                <Text fontSize="sm">Condition: Gently Used</Text>
              </Box>

              <Box>
                <Text fontSize="2xl" fontWeight="bold">
                  $620
                </Text>
                <Text fontSize="sm">+ $9 Shipping — US to United States</Text>
              </Box>

              <HStack w="100%">
                <Button
                  colorScheme="blackAlpha"
                  flex="1"
                  as={RouterLink}
                  to="/checkout"
                >
                  PURCHASE
                </Button>
              </HStack>

              <HStack w="100%">
                <Button variant="outline" flex="1" onClick={onOfferOpen}>
                  OFFER
                </Button>
                <Button variant="outline" flex="1" onClick={onMessageOpen}>
                  MESSAGE
                </Button>
              </HStack>

              <Divider />

              <Text fontWeight="bold">Authenticated</Text>

              <HStack spacing={4} align="center" w="100%">
                <Avatar
                  name="acrnmlvr60"
                  size="sm"
                  bg="gray.200"
                  color="black"
                />
                <Box>
                  <Text fontWeight="bold" fontSize="sm">
                    acrnmlvr60
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    4 items for sale
                  </Text>
                </Box>
                <Button size="sm" ml="auto" variant="outline">
                  FOLLOW
                </Button>
              </HStack>

              <Box>
                <Heading size="xs" mb={1}>
                  Seller Description
                </Heading>
                <Text fontSize="sm" mb={1}>
                  Size 24
                </Text>
                <Text fontSize="sm" mb={1}>
                  Yeah
                </Text>
                <Text fontSize="sm">Yuhhhhh</Text>
              </Box>

              <Box>
                <Heading size="xs" mb={2}>
                  Tags
                </Heading>
                <HStack spacing={2} wrap="wrap">
                  {["#OPIUM", "#RICKOWENS", "#AVANTGARDE", "#DARKWEAR"].map(
                    (tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        px={2}
                        py={1}
                        borderRadius="md"
                        fontSize="xs"
                      >
                        {tag}
                      </Badge>
                    )
                  )}
                </HStack>
              </Box>

              <Box>
                <Text fontSize="xs" color="gray.500">
                  Posted to I Need It 7 days ago
                </Text>
                <Text fontSize="xs" color="gray.400">
                  Listing ID: 01234567
                </Text>
              </Box>

              <HStack spacing={3}>
                <Button
                  size="xs"
                  variant="outline"
                  leftIcon={
                    <Box as="span" fontWeight="bold">
                      ⚠️
                    </Box>
                  }
                >
                  REPORT LISTING
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  leftIcon={
                    <Box as="span" fontWeight="bold">
                      📊
                    </Box>
                  }
                >
                  PRICE COMPARISON
                </Button>
              </HStack>

              <Divider />

              <Box
                w="100%"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                p={4}
              >
                <HStack spacing={2} mb={2}>
                  <Box as="span" fontSize="lg">
                    🛡
                  </Box>
                  <Text fontWeight="bold">I Need It Purchase Protection</Text>
                </HStack>
                <Text fontSize="sm" mb={2}>
                  We want you to feel safe buying and selling on I Need It.
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Qualifying orders are covered by our Purchase Protection in
                  the rare case something goes wrong.
                </Text>
                <Button
                  size="sm"
                  mt={2}
                  variant="link"
                  rightIcon={<ChevronDownIcon />}
                >
                  How You're Protected
                </Button>
              </Box>
            </VStack>
          </GridItem>
        </Grid>

        <Box mt={12}>
          <Heading size="md" mb={4}>
            Recently Viewed
          </Heading>
          <Grid templateColumns="repeat(4, 1fr)" gap={6}>
            {listings.map((item, index) => (
              <Box
                key={index}
                borderWidth="1px"
                borderRadius="md"
                overflow="hidden"
              >
                <Box
                  as={RouterLink}
                  to="/listing"
                  _hover={{ textDecoration: "none" }}
                >
                  <Box position="relative" height="200px">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      height="100%"
                      width="100%"
                      objectFit="cover"
                    />
                    {item.freeShipping && (
                      <Badge
                        position="absolute"
                        top="16px"
                        left="8px"
                        bg="#DCEF31"
                        color="black"
                        fontWeight="bold"
                        fontSize="0.7em"
                        px={2}
                        py={1}
                        borderRadius="sm"
                      >
                        FREE SHIPPING
                      </Badge>
                    )}
                  </Box>
                  <Box p={3}>
                    <Text fontSize="xs" color="gray.500">
                      {item.timestamp}
                    </Text>
                    <Box
                      borderBottom="1px solid"
                      borderColor="gray.200"
                      my={2}
                    />
                    <HStack justify="space-between" mt={1}>
                      <Text fontWeight="bold" fontSize="sm" noOfLines={1}>
                        {item.brand}
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        {item.size}
                      </Text>
                    </HStack>
                    <Text fontSize="xs" color="gray.600" noOfLines={1}>
                      {item.title}
                    </Text>
                  </Box>
                </Box>
                <Box px={3} pb={3}>
                  <HStack justify="space-between" mt={2}>
                    <HStack spacing={2}>
                      {item.oldPrice && (
                        <Text
                          fontSize="sm"
                          color="gray.500"
                          textDecoration="line-through"
                        >
                          {item.oldPrice}
                        </Text>
                      )}
                      <Text fontSize="sm" fontWeight="bold">
                        {item.price}
                      </Text>
                    </HStack>
                    <HStack>
                      <IconButton
                        size="sm"
                        icon={<FaRegClock />}
                        aria-label="Remind"
                      />
                      <IconButton
                        size="sm"
                        icon={<FaRegHeart />}
                        aria-label="Unfavorite"
                      />
                    </HStack>
                  </HStack>
                </Box>
              </Box>
            ))}
          </Grid>
        </Box>
      </Container>

      <OfferModal isOpen={isOfferOpen} onClose={onOfferClose} />
      <MessageModal isOpen={isMessageOpen} onClose={onMessageClose} />

      <Footer />
    </>
  );
}
