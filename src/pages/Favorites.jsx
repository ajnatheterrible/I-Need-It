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
} from "@chakra-ui/react";
import { FaRegHeart, FaRegClock } from "react-icons/fa";
import Container from "../components/shared/Container";
import Footer from "../components/layout/Footer";

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

export default function Favorites() {
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
            <Select maxW="160px" defaultValue="date">
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
            {listings.map((item) => (
              <Box
                key={item.id}
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

                  <HStack justify="space-between" mt={4}>
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
          </SimpleGrid>
        </Box>
      </Container>
      <Footer />
    </>
  );
}
