import {
  Box,
  Text,
  Select,
  HStack,
  Grid,
  Image,
  Badge,
  Flex,
} from "@chakra-ui/react";
import { useState, useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";

import { hasFetchedFavoritesRef } from "../hooks/useFetchFavorites";
import useFetchFavorites from "../hooks/useFetchFavorites";
import useAuthStore from "../store/authStore";
import getTimestamp from "../utils/getTimestamp";

export default function UserFavorites() {
  const [sortOption, setSortOption] = useState("default");

  useFetchFavorites();
  const favorites = useAuthStore((s) => s.fetchedData?.favorites);

  const sortedFavorites = useMemo(() => {
    if (!favorites) return;
    return [...favorites].sort((a, b) => {
      if (sortOption === "price_low_high") return a.price - b.price;
      if (sortOption === "price_high_low") return b.price - a.price;
      if (sortOption === "recent")
        return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });
  }, [favorites, sortOption]);

  if (!hasFetchedFavoritesRef.current || !Array.isArray(favorites)) {
    return null;
  }

  return (
    <>
      <Box position="sticky" top="70px" bg="white" zIndex={10} py={6}>
        <Flex justify="space-between" align="center">
          <Text fontWeight="semibold">
            {sortedFavorites.length} favorited item
            {sortedFavorites.length !== 1 && "s"}
          </Text>
          <Select
            size="sm"
            w="auto"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="default">Sort by: Default</option>
            <option value="price_low_high">Price: Low to High</option>
            <option value="price_high_low">Price: High to Low</option>
            <option value="recent">Most Recent</option>
          </Select>
        </Flex>
      </Box>

      <Box mt={3}>
        {sortedFavorites.length === 0 ? (
          <Text textAlign="center" color="gray.500" mt={10}>
            You haven’t favorited anything yet.
          </Text>
        ) : (
          <Grid templateColumns="repeat(4, 1fr)" gap={6}>
            {sortedFavorites.map((item) => (
              <Box
                key={item._id}
                borderWidth="1px"
                borderRadius="md"
                overflow="hidden"
              >
                <Box
                  as={RouterLink}
                  to={`/listing/${item._id}`}
                  _hover={{ textDecoration: "none" }}
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
                  <Box p={3} pt={3} pb={0}>
                    <Text fontSize="xs" color="gray.500">
                      {getTimestamp(item.createdAt)}
                    </Text>
                    <Box
                      borderBottom="1px solid"
                      borderColor="gray.200"
                      my={2}
                    />
                  </Box>
                </Box>

                <Box px={3} pb={3}>
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
                  <Text fontSize="sm" fontWeight="bold" mt={4}>
                    ${item.price.toLocaleString()}
                  </Text>
                </Box>
              </Box>
            ))}
          </Grid>
        )}
      </Box>
    </>
  );
}
