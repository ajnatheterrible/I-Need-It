import {
  Box,
  Heading,
  Text,
  Select,
  VStack,
  HStack,
  Image,
  Badge,
  IconButton,
  Button,
  Grid,
  Flex,
} from "@chakra-ui/react";
import { FaRegHeart, FaRegClock } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import Container from "../components/Container";
import Footer from "../components/Footer";
import FilterSidebar from "../components/FilterSidebar";

const listings = Array(19).fill({
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

export default function SearchResults() {
  return (
    <>
      <Container>
        <Heading size="lg" mb={4} mt={4}>
          Knee High Bogun
        </Heading>

        <Box position="sticky" top="70px" bg="white" zIndex={10} py={3}>
          <Flex justify="space-between" align="center">
            <HStack spacing={3}>
              <Text>
                19 listings for <b>“Knee High Bogun”</b>
              </Text>
              <Button size="xs" variant="ghost">
                Clear All
              </Button>
            </HStack>
            <Select size="sm" w="auto" defaultValue="default">
              <option value="default">Sort by: Default</option>
              <option value="price_low_high">Price: Low to High</option>
              <option value="price_high_low">Price: High to Low</option>
              <option value="recent">Most Recent</option>
            </Select>
          </Flex>
        </Box>

        <Flex align="start" gap={6} mt={6}>
          {/* Sidebar */}
          <FilterSidebar />

          {/* Main Content */}
          <Box flex="1">
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
        </Flex>
      </Container>
      <Footer />
    </>
  );
}
