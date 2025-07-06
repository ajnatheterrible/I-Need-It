import {
  Box,
  Heading,
  Text,
  Select,
  SimpleGrid,
  VStack,
  HStack,
  Image,
  Badge,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { FaHeart } from "react-icons/fa";
import { useState, useMemo } from "react";

import Container from "../components/shared/Container";
import Footer from "../components/layout/Footer";

import useFetchFavorites, {
  hasFetchedFavoritesRef,
} from "../hooks/useFetchFavorites";
import useAuthStore from "../store/authStore";
import getTimestamp from "../utils/getTimestamp";
import { toggleFavorite } from "../utils/favoriteUtils";

export default function Favorites() {
  const [sortOption, setSortOption] = useState("date");
  const toast = useToast();

  useFetchFavorites();

  const token = useAuthStore((s) => s.token);
  const favorites = useAuthStore((s) => s.fetchedData?.favorites);
  const setFetchedData = useAuthStore((s) => s.setFetchedData);

  const sortedFavorites = useMemo(() => {
    if (!favorites) return [];

    return [...favorites].sort((a, b) => {
      if (sortOption === "price_low_high") return a.price - b.price;
      if (sortOption === "price_high_low") return b.price - a.price;
      if (sortOption === "date")
        return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });
  }, [favorites, sortOption]);

  const handleUnfavorite = async (listingId) => {
    try {
      await toggleFavorite(listingId, token, true);

      const updatedFavorites = favorites.filter((fav) => fav._id !== listingId);

      setFetchedData((prev) => ({ ...prev, favorites: updatedFavorites }));

      toast({
        title: "Removed from favorites.",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (!hasFetchedFavoritesRef.current || !Array.isArray(favorites)) {
    return null;
  }

  return (
    <>
      <Container>
        <Box py={10}>
          <VStack spacing={6} align="center" mb={6}>
            <Heading size="lg">Favorites</Heading>
            <Text fontSize="sm" color="gray.600">
              You’ll be notified when your favorite listings drop in price or
              are relisted
            </Text>
          </VStack>

          <HStack justify="center" spacing={4}>
            <Text fontWeight="semibold">Sort By</Text>
            <Select
              maxW="160px"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="date">Date Added</option>
              <option value="price_low_high">Price: Low to High</option>
              <option value="price_high_low">Price: High to Low</option>
            </Select>
          </HStack>

          <SimpleGrid
            columns={{ base: 2, md: 3, lg: 5 }}
            spacingY={10}
            spacingX={6}
            mt={16}
          >
            {sortedFavorites.map((item) => (
              <Box
                key={item._id}
                borderWidth="1px"
                borderRadius="md"
                overflow="hidden"
              >
                <Box position="relative" height="200px">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    height="100%"
                    width="100%"
                    objectFit="cover"
                  />
                  {item.isFreeShipping && (
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
                    {getTimestamp(item.createdAt)}
                  </Text>

                  <Box borderBottom="1px solid" borderColor="gray.200" my={2} />

                  <HStack justify="space-between" mt={1}>
                    <Text fontWeight="bold" fontSize="sm" noOfLines={1}>
                      {item.designer}
                    </Text>
                    <Text fontSize="xs" color="gray.600">
                      {item.size}
                    </Text>
                  </HStack>

                  <Text fontSize="xs" color="gray.600" noOfLines={1}>
                    {item.title}
                  </Text>

                  <HStack justify="space-between" mt={4}>
                    <Text fontSize="sm" fontWeight="bold">
                      ${item.price.toLocaleString()}
                    </Text>
                    // Favorite button logic
                    <IconButton
                      size="sm"
                      icon={<FaHeart color="black" />}
                      aria-label="Unfavorite"
                      onClick={() => handleUnfavorite(item._id)}
                    />
                  </HStack>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Container>
      <Footer />
    </>
  );
}
