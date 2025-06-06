import {
  Box,
  Text,
  Select,
  HStack,
  SimpleGrid,
  Image,
  Badge,
  Flex,
} from "@chakra-ui/react";
import { useState } from "react";
import FilterSidebar from "../../components/sidebars/FilterSidebar";

const listings = Array(12).fill({
  id: 1,
  brand: "THE VIRIDI-ANNE",
  title: "Leather mask hooded jacket",
  size: "M",
  price: 1200,
  timestamp: "about 5 hours ago",
  freeShipping: true,
  imageUrl: "/placeholder.jpg",
});

export default function Profile() {
  const [filters, setFilters] = useState({
    department: [],
    category: [],
    size: [],
    condition: [],
    priceMin: null,
    priceMax: null,
  });

  const [isUsingMySizes, setIsUsingMySizes] = useState(false);
  const [sortOption, setSortOption] = useState("default");

  const sortedListings = [...listings].sort((a, b) => {
    if (sortOption === "price_low_high") return a.price - b.price;
    if (sortOption === "price_high_low") return b.price - a.price;
    return 0;
  });

  return (
    <>
      <Box position="sticky" top="70px" bg="white" zIndex={10} py={6}>
        <Flex justify="space-between" align="center">
          <Text fontWeight="semibold">{listings.length} listings</Text>
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

      <HStack align="start" gap={6} pb={10}>
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          isUsingMySizes={isUsingMySizes}
          setIsUsingMySizes={setIsUsingMySizes}
        />

        <Box flex="1">
          <SimpleGrid columns={4} spacing={6} w="full">
            {sortedListings.map((item, i) => (
              <Box
                key={i}
                borderWidth="1px"
                borderRadius="md"
                overflow="hidden"
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
                  <Box borderBottom="1px solid" borderColor="gray.200" my={2} />
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
                  <Text fontSize="sm" fontWeight="bold" mt={2}>
                    ${item.price.toLocaleString()}
                  </Text>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </HStack>
    </>
  );
}
