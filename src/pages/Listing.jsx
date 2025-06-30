import {
  Box,
  Grid,
  GridItem,
  Text,
  Heading,
  Button,
  VStack,
  HStack,
  Divider,
  Badge,
  useDisclosure,
  Avatar,
  Img,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link as RouterLink, useParams, useNavigate } from "react-router-dom";
import Container from "../components/shared/Container";
import Footer from "../components/layout/Footer";
import OfferModal from "../components/modals/OfferModal";
import MessageModal from "../components/modals/MessageModal";
import ListingSkeleton from "../components/skeletons/ListingSkeleton";

export default function ListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isImageOpen, setIsImageOpen] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/listings/${id}`);
        if (!res.ok) throw new Error("Listing not found");
        const data = await res.json();
        setListing(data);
      } catch {
        navigate("/404");
      } finally {
        setIsLoading(false);
      }
    };
    fetchListing();
  }, [id, navigate]);

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

  const rotateNext = () => {
    if (listing.images.length > 1) {
      setActiveIndex((prev) => (prev + 1) % listing.images.length);
    }
  };

  const rotatePrev = () => {
    if (listing.images.length > 1) {
      setActiveIndex(
        (prev) => (prev - 1 + listing.images.length) % listing.images.length
      );
    }
  };

  const openImageModal = () => setIsImageOpen(true);
  const closeImageModal = () => setIsImageOpen(false);

  const getTimestamp = (createdAt) => {
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

  return (
    <>
      {!isLoading && listing && (
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
                    <Button variant="ghost" fontSize="2xl" onClick={rotatePrev}>
                      ‹
                    </Button>
                  </Box>
                </GridItem>

                <GridItem colSpan={6}>
                  {listing.images?.length > 0 ? (
                    <Img
                      src={listing.images[activeIndex]}
                      style={{
                        width: "100%",
                        height: "600px",
                        objectFit: "cover",
                        objectPosition: "center center",
                        cursor: "zoom-in",
                      }}
                      borderRadius="md"
                      onClick={openImageModal}
                    />
                  ) : (
                    <Box bg="gray.100" w="100%" h="600px" borderRadius="md" />
                  )}
                </GridItem>

                <GridItem colSpan={1}>
                  <Box
                    h="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Button variant="ghost" fontSize="2xl" onClick={rotateNext}>
                      ›
                    </Button>
                  </Box>
                </GridItem>
              </Grid>

              <Grid templateColumns="repeat(8, 1fr)" gap={2} mt={2}>
                {listing.images?.length > 0
                  ? listing.images.map((img, i) => (
                      <GridItem colSpan={1} key={i}>
                        <Img
                          src={img}
                          style={{
                            width: "100%",
                            height: "80px",
                            objectFit: "cover",
                            objectPosition: "center center",
                            opacity: i === activeIndex ? 1 : 0.4,
                            transition: "opacity 0.2s",
                            cursor: "pointer",
                          }}
                          borderRadius="md"
                          onClick={() => setActiveIndex(i)}
                        />
                      </GridItem>
                    ))
                  : Array.from({ length: 5 }).map((_, i) => (
                      <GridItem colSpan={1} key={i}>
                        <Box bg="gray.200" h="80px" borderRadius="md" />
                      </GridItem>
                    ))}
              </Grid>
            </GridItem>

            <GridItem colSpan={[12, null, 4]}>
              <VStack align="start" spacing={5}>
                <Box>
                  <Heading size="md">{listing.brand}</Heading>
                  <Text>{listing.title}</Text>
                  <Text fontSize="sm">Size: {listing.size}</Text>
                  <Text fontSize="sm">Color: {listing.color}</Text>
                  <Text fontSize="sm">Condition: {listing.condition}</Text>
                </Box>

                <Box>
                  <Text fontSize="2xl" fontWeight="bold">
                    ${listing.price?.toLocaleString()}
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
                    {listing.description}
                  </Text>
                </Box>

                <Box>
                  <Heading size="xs" mb={2}>
                    Tags
                  </Heading>
                  <HStack spacing={2} wrap="wrap">
                    {listing.tags?.map((tag) => (
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
                    {listing.createdAt ? getTimestamp(listing.createdAt) : ""}
                  </Text>
                  <Text fontSize="xs" color="gray.400">
                    Listing ID: {listing._id || "01234567"}
                  </Text>
                </Box>
              </VStack>
            </GridItem>
          </Grid>
        </Container>
      )}

      <OfferModal isOpen={isOfferOpen} onClose={onOfferClose} />
      <MessageModal isOpen={isMessageOpen} onClose={onMessageClose} />

      {isLoading && <ListingSkeleton />}

      {isImageOpen && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(0, 0, 0, 0.85)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={9999}
          onClick={closeImageModal}
        >
          <Button
            position="absolute"
            left="20px"
            top="50%"
            transform="translateY(-50%)"
            zIndex={10000}
            onClick={(e) => {
              e.stopPropagation();
              rotatePrev();
            }}
            variant="ghost"
            fontSize="3xl"
            color="white"
            _hover={{ bg: "transparent", opacity: 0.7 }}
          >
            ‹
          </Button>

          <Box
            onClick={(e) => e.stopPropagation()}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Img
              src={listing.images[activeIndex]}
              maxW="90vw"
              maxH="90vh"
              objectFit="contain"
              borderRadius="md"
            />
          </Box>

          <Button
            position="absolute"
            right="20px"
            top="50%"
            transform="translateY(-50%)"
            zIndex={10000}
            onClick={(e) => {
              e.stopPropagation();
              rotateNext();
            }}
            variant="ghost"
            fontSize="3xl"
            color="white"
            _hover={{ bg: "transparent", opacity: 0.7 }}
          >
            ›
          </Button>
        </Box>
      )}
      <Footer />
    </>
  );
}
