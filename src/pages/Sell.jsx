import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Input,
  Select,
  Textarea,
  Switch,
  Checkbox,
  FormControl,
  FormLabel,
  Button,
  Icon,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { FaCamera } from "react-icons/fa";
import { CheckIcon } from "@chakra-ui/icons";
import Container from "../components/Container";

export default function Sell() {
  return (
    <>
      <Container>
        <Box maxW="960px" mx="auto" py={10}>
          {/* Header */}
          <HStack justify="space-between" mb={16}>
            <Heading fontSize="32px" fontWeight="bold">
              Add a new listing
            </Heading>
            <Text fontSize="sm" color="#DCEF31" fontWeight="semibold">
              HOW TO SELL GUIDE
            </Text>
          </HStack>

          {/* Details */}
          <Box mb={16}>
            <Heading fontSize="20px" fontWeight="bold" mb={4}>
              Details
            </Heading>
            <SimpleGrid columns={8} spacing={4}>
              <Grid gridColumn="span 4">
                <FormControl id="category">
                  <Select placeholder="Department / Category" />
                </FormControl>
              </Grid>
              <Grid gridColumn="span 4">
                <FormControl id="subcategory">
                  <Select placeholder="Sub-category (select category first)" />
                </FormControl>
              </Grid>
              <Grid gridColumn="span 4">
                <FormControl id="designer">
                  <Select placeholder="Designer (select category first)" />
                </FormControl>
              </Grid>
              <Grid gridColumn="span 4">
                <FormControl id="size">
                  <Select placeholder="Size (select category first)" />
                </FormControl>
              </Grid>
            </SimpleGrid>
          </Box>

          {/* Item Info */}
          <Box mb={16}>
            <FormControl id="item-name">
              <FormLabel fontSize="20px" fontWeight="bold" mb={4}>
                Item Name
              </FormLabel>
              <SimpleGrid columns={8} spacing={4}>
                <Grid gridColumn="span 4">
                  <Input placeholder="Item name" />
                </Grid>
              </SimpleGrid>
            </FormControl>
          </Box>

          <Box mb={16}>
            <FormControl id="color">
              <FormLabel fontSize="20px" fontWeight="bold" mb={4}>
                Color
              </FormLabel>
              <SimpleGrid columns={8} spacing={4}>
                <Grid gridColumn="span 4">
                  <Input placeholder="Color" />
                </Grid>
              </SimpleGrid>
            </FormControl>
          </Box>

          <Box mb={16}>
            <FormControl id="condition">
              <FormLabel fontSize="20px" fontWeight="bold" mb={4}>
                Condition
              </FormLabel>
              <SimpleGrid columns={8} spacing={4}>
                <Grid gridColumn="span 4">
                  <Input placeholder="Condition" />
                </Grid>
              </SimpleGrid>
            </FormControl>
          </Box>

          <Box mb={16}>
            <FormControl id="description">
              <FormLabel fontSize="20px" fontWeight="bold" mb={4}>
                Description
              </FormLabel>
              <Textarea placeholder="Add details about condition..." />
            </FormControl>
          </Box>

          <Box mb={16}>
            <FormControl id="tags">
              <FormLabel fontSize="20px" fontWeight="bold" mb={4}>
                Tags
              </FormLabel>
              <Input placeholder="Add a tag" />
            </FormControl>
          </Box>

          <Box mb={16}>
            <FormControl id="price">
              <FormLabel fontSize="20px" fontWeight="bold" mb={4}>
                Price
              </FormLabel>
              <SimpleGrid columns={8} spacing={4}>
                <Grid gridColumn="span 4">
                  <Input placeholder="$ Price USD" />
                </Grid>
              </SimpleGrid>
              <HStack mt={4}>
                <Text fontWeight="semibold">Accept Offers</Text>
                <Switch />
              </HStack>
            </FormControl>
          </Box>

          <Box mb={16}>
            <Heading fontSize="20px" fontWeight="bold" mb={4}>
              Shipping From
            </Heading>
            <Text fontSize="sm" color="gray.600">
              Shipping options vary depending on the address you're sending
              from.
            </Text>
          </Box>

          <Box mb={16}>
            <Heading fontSize="20px" fontWeight="bold" mb={4}>
              Shipping Regions
            </Heading>
            <Text fontSize="sm" color="gray.600" mb={8}>
              Select regions you are willing to ship to.
            </Text>

            <SimpleGrid columns={8} spacing={4}>
              <Grid gridColumn="span 4">
                <VStack align="start" spacing={1}>
                  <Text fontWeight="bold">United States</Text>
                  <Text fontSize="sm" color="gray.600">
                    You’ll receive a pre-paid shipping label instantly when your
                    item sells.
                  </Text>
                </VStack>
              </Grid>

              <Grid gridColumn="span 4">
                <VStack align="start" spacing={3}>
                  <HStack>
                    <CheckIcon color="black" boxSize={4} />
                    <Text fontSize="sm">
                      You offer expedited delivery via UPS
                    </Text>
                  </HStack>
                  <HStack>
                    <CheckIcon color="black" boxSize={4} />
                    <Text fontSize="sm">
                      Label automatically generated after sale
                    </Text>
                  </HStack>
                  <HStack>
                    <CheckIcon color="black" boxSize={4} />
                    <Text fontSize="sm">Buyer pays shipping cost</Text>
                  </HStack>
                  <Checkbox>
                    <Text fontWeight="semibold">
                      Offer Free Standard Shipping
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      Only applies if your Buyer selects Standard Shipping
                    </Text>
                  </Checkbox>
                </VStack>
              </Grid>

              <Grid gridColumn="span 8">
                <Box borderTop="1px solid" borderColor="gray.200" mt={6} />
              </Grid>

              <Grid gridColumn="span 8">
                <HStack spacing={4}>
                  <Switch size="md" />
                  <Text>Canada</Text>
                </HStack>
              </Grid>
              <Grid gridColumn="span 8">
                <Box borderTop="1px solid" borderColor="gray.200" mt={4} />
              </Grid>

              <Grid gridColumn="span 8">
                <HStack spacing={4}>
                  <Switch size="md" />
                  <Text>United Kingdom</Text>
                </HStack>
              </Grid>
              <Grid gridColumn="span 8">
                <Box borderTop="1px solid" borderColor="gray.200" mt={4} />
              </Grid>

              <Grid gridColumn="span 8">
                <HStack spacing={4}>
                  <Switch size="md" />
                  <Text>Europe</Text>
                </HStack>
              </Grid>
              <Grid gridColumn="span 8">
                <Box borderTop="1px solid" borderColor="gray.200" mt={4} />
              </Grid>
            </SimpleGrid>
          </Box>

          <Box mb={16}>
            <Heading fontSize="20px" fontWeight="bold" mb={4}>
              Photos
            </Heading>
            <Grid templateColumns="repeat(8, 1fr)" gap={4}>
              {/* Large left photo (spans 4 columns, 2 rows) */}
              <GridItem colSpan={4} rowSpan={2}>
                <label
                  htmlFor="photo-1"
                  style={{ width: "100%", height: "100%" }}
                >
                  <Box
                    w="100%"
                    h="100%"
                    bg="gray.100"
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    border="1px dashed gray"
                    cursor="pointer"
                  >
                    <Icon as={FaCamera} boxSize={5} color="gray.500" />
                  </Box>
                  <input
                    id="photo-1"
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) =>
                      console.log("Photo 1 selected:", e.target.files[0])
                    }
                  />
                </label>
              </GridItem>

              {/* Top right photos */}
              {[2, 3, 4, 5].map((id) => (
                <GridItem colSpan={2} key={id}>
                  <label htmlFor={`photo-${id}`} style={{ width: "100%" }}>
                    <Box
                      w="100%"
                      bg="gray.100"
                      borderRadius="md"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      border="1px dashed gray"
                      aspectRatio="1"
                      cursor="pointer"
                    >
                      <Icon as={FaCamera} boxSize={5} color="gray.500" />
                    </Box>
                    <input
                      id={`photo-${id}`}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) =>
                        console.log(`Photo ${id} selected:`, e.target.files[0])
                      }
                    />
                  </label>
                </GridItem>
              ))}
            </Grid>
          </Box>

          <Box
            position="fixed"
            bottom="0"
            left="0"
            right="0"
            zIndex="1000"
            bg="white"
            borderTop="1px solid"
            borderColor="gray.200"
            py={4}
          >
            <Box maxW="960px" mx="auto" px={4}>
              <SimpleGrid columns={8} spacing={4}>
                <Grid gridColumn="span 8">
                  <HStack justify="flex-end" spacing={4}>
                    <Button variant="outline" colorScheme="gray">
                      Save as Draft
                    </Button>
                    <Button
                      bg="#DCEF31"
                      color="black"
                      _hover={{ bg: "#C5E426" }}
                    >
                      Publish
                    </Button>
                  </HStack>
                </Grid>
              </SimpleGrid>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
}
