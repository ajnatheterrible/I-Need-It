import {
  Box,
  Grid,
  GridItem,
  Text,
  VStack,
  HStack,
  Button,
  Progress,
  SimpleGrid,
  Flex,
} from "@chakra-ui/react";
import Container from "../components/shared/Container";
import Footer from "../components/layout/Footer";
import SellerSidebar from "../components/sidebars/SellerSidebar";
import SellerProfileHeader from "../components/profile/SellerProfileHeader";

export default function Drafts() {
  const drafts = [
    {
      id: 1,
      title: "Oakley Paguro Slide Orange\nNew/Never Worn Size US 9 / EU 42",
      createdAt: "10 months ago",
    },
    {
      id: 2,
      title: "Team Flesh SS24\nNew/Never Worn Size US 9 / EU 42",
      createdAt: "10 months ago",
    },
  ];

  return (
    <>
      <Container>
        <VStack align="start" spacing={4} py={10}>
          <SellerProfileHeader />

          <Grid
            templateColumns="repeat(12, 1fr)"
            gap={6}
            pt={6}
            pb={10}
            w="full"
          >
            <GridItem colSpan={2}>
              <SellerSidebar active="DRAFTS" />
            </GridItem>

            <GridItem colSpan={10}>
              <VStack align="start" spacing={6} w="full">
                <Text fontSize="xl" fontWeight="bold">
                  Drafts
                </Text>

                <SimpleGrid columns={[1, null, 2]} spacing={8} w="full">
                  {drafts.map((item) => (
                    <Box key={item.id} w="full" maxW="400px">
                      <Flex align="start" gap={4}>
                        <Box
                          w="120px"
                          h="120px"
                          bg="gray.200"
                          borderRadius="md"
                          flexShrink={0}
                          mt="2px"
                        />

                        <VStack align="start" spacing={3} w="full">
                          <Text fontSize="xs" color="gray.500" mt={0.5}>
                            {item.createdAt}
                          </Text>

                          <Text
                            fontSize="sm"
                            fontWeight="medium"
                            whiteSpace="pre-wrap"
                          >
                            {item.title}
                          </Text>

                          <HStack spacing={2} w="full">
                            <Progress
                              value={100}
                              size="xs"
                              colorScheme="blue"
                              flex={1}
                            />
                            <Text
                              fontSize="xs"
                              color="gray.500"
                              whiteSpace="nowrap"
                            >
                              100% complete
                            </Text>
                          </HStack>
                        </VStack>
                      </Flex>

                      <VStack spacing={2} pt={3} w="full">
                        <Button
                          w="full"
                          size="sm"
                          bg="black"
                          color="white"
                          fontWeight="extrabold"
                          fontSize="xs"
                          textTransform="uppercase"
                          _hover={{ bg: "gray.800" }}
                        >
                          Review and Submit
                        </Button>
                        <Button
                          w="full"
                          size="sm"
                          variant="outline"
                          color="red.500"
                          borderColor="red.500"
                          fontWeight="extrabold"
                          fontSize="xs"
                          textTransform="uppercase"
                          _hover={{ bg: "red.50" }}
                        >
                          Discard
                        </Button>
                      </VStack>
                    </Box>
                  ))}
                </SimpleGrid>
              </VStack>
            </GridItem>
          </Grid>
        </VStack>
      </Container>
      <Footer />
    </>
  );
}
