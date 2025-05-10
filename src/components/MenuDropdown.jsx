import { Box, VStack, Text, Link as ChakraLink, Grid } from "@chakra-ui/react";
import Container from "./Container";
import { Link as RouterLink } from "react-router-dom";
import { forwardRef } from "react";

const MenuDropdown = forwardRef(
  (
    {
      isOpen,
      title,
      items = [],
      columns = 4,
      seeAllHref,
      onClose,
      seeAllLabel,
    },
    ref
  ) => {
    const isGrouped =
      items.length && typeof items[0] === "object" && items[0].heading;

    return (
      <Box
        ref={ref}
        position="absolute"
        width="100vw"
        bg="white"
        borderTop="1px solid"
        borderColor="gray.200"
        py={8}
        zIndex="999"
        display={isOpen ? "block" : "none"}
        boxShadow="0 10px 15px -3px rgba(0,0,0,0.1)"
      >
        <Container>
          <VStack align="start" spacing={8} width="100%">
            {title && (
              <Text fontWeight="bold" fontSize="md">
                {title}
              </Text>
            )}
            <Grid
              templateColumns={`repeat(${
                isGrouped ? items.length : columns
              }, 1fr)`}
              gap={12}
              width="100%"
            >
              {isGrouped
                ? items.map((section, i) => (
                    <VStack key={i} align="start" spacing={3} flex="1" minW="0">
                      <Text fontWeight="bold" fontSize="sm">
                        {section.heading}
                      </Text>
                      {section.items.map((item, j) => (
                        <ChakraLink
                          as={RouterLink}
                          to="#"
                          fontSize="sm"
                          key={j}
                          onClick={onClose}
                        >
                          {item}
                        </ChakraLink>
                      ))}
                    </VStack>
                  ))
                : (() => {
                    const rows = Math.ceil(items.length / columns);
                    const verticalChunks = Array.from(
                      { length: columns },
                      (_, colIdx) =>
                        items.slice(colIdx * rows, colIdx * rows + rows)
                    );

                    return verticalChunks.map((chunk, colIdx) => (
                      <VStack
                        key={colIdx}
                        align="start"
                        spacing={3}
                        flex="1"
                        minW="0"
                      >
                        {chunk.map((item, i) => (
                          <ChakraLink
                            as={RouterLink}
                            to="#"
                            fontSize="sm"
                            key={i}
                            onClick={onClose}
                          >
                            {item}
                          </ChakraLink>
                        ))}
                      </VStack>
                    ));
                  })()}
            </Grid>
            {seeAllHref && (
              <ChakraLink
                as={RouterLink}
                to={seeAllHref}
                fontSize="xs"
                fontWeight="bold"
                textTransform="uppercase"
                _hover={{ textDecoration: "underline" }}
                onClick={onClose}
              >
                See all {seeAllLabel || "items"}
              </ChakraLink>
            )}
          </VStack>
        </Container>
      </Box>
    );
  }
);

export default MenuDropdown;
