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
import { useEffect, useState } from "react";
import { FaRegHeart, FaRegClock } from "react-icons/fa";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Link as RouterLink, useParams } from "react-router-dom";
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
  const { id } = useParams();
  const [listing, setListing] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/listings/${id}`)
      .then((res) => res.json())
      .then((data) => setListing(data));
  }, [id]);

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

  const getTimestamp = (createdAt) => {
    console.log(createdAt);
    const createdAtMS = new Date(createdAt).getTime();
    const now = Date.now();
    const ms = now - createdAtMS;

    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "just now";
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  };

  if (!listing) return <Text>Loading...</Text>;

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
                <Heading size="md">{listing?.brand}</Heading>
                <Text>{listing?.title}</Text>
                <Text fontSize="sm">Size: {listing?.size}</Text>
                <Text fontSize="sm">Color: {listing?.color}</Text>
                <Text fontSize="sm">Condition: {listing?.condition}</Text>
              </Box>

              <Box>
                <Text fontSize="2xl" fontWeight="bold">
                  ${listing?.price?.toLocaleString()}
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
                <Text fontSize="sm" mb={1}>
                  {listing?.description}
                </Text>
              </Box>

              <Box>
                <Heading size="xs" mb={2}>
                  Tags
                </Heading>
                <HStack spacing={2} wrap="wrap">
                  {listing?.tags?.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      px={2}
                      py={1}
                      borderRadius="md"
                      fontSize="xs"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </HStack>
              </Box>

              <Box>
                <Text fontSize="xs" color="gray.500">
                  Posted to I Need It{" "}
                  {listing?.createdAt ? getTimestamp(listing.createdAt) : ""}
                </Text>
                <Text fontSize="xs" color="gray.400">
                  Listing ID: {listing?._id || "01234567"}
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
      </Container>

      <OfferModal isOpen={isOfferOpen} onClose={onOfferClose} />
      <MessageModal isOpen={isMessageOpen} onClose={onMessageClose} />
      <Footer />
    </>
  );
}
