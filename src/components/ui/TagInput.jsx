import { useState, useRef } from "react";
import {
  Box,
  Input,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  FormControl,
  FormLabel,
  SimpleGrid,
  Grid,
} from "@chakra-ui/react";

function TagInput({ tags, setTags }) {
  const [input, setInput] = useState("");
  const inputRef = useRef();

  const addTag = () => {
    const trimmed = input
      .trim()
      .replace(/\s+/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setInput("");
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <FormControl id="tags">
      <FormLabel fontSize="20px" fontWeight="bold" mb={4}>
        Tags
      </FormLabel>
      <SimpleGrid columns={8} spacing={4}>
        <Grid gridColumn="span 8">
          <Box
            w="100%"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            px={3}
            py={2}
            display="flex"
            flexWrap="wrap"
            gap={2}
            minH="44px"
            _focusWithin={{ borderColor: "gray.400" }}
          >
            {tags.map((tag) => (
              <Tag
                size="md"
                borderRadius="full"
                variant="solid"
                bg="gray.100"
                color="gray.800"
                px={3}
                py={1}
                fontWeight="medium"
              >
                <TagLabel>{tag}</TagLabel>
                <TagCloseButton
                  onClick={() => removeTag(tag)}
                  _hover={{ bg: "gray.300" }}
                />
              </Tag>
            ))}
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              border="none"
              boxShadow="none"
              outline="none"
              _focus={{ boxShadow: "none" }}
              _placeholder={{ color: "gray.400" }}
              placeholder={
                tags.length === 0 ? "Add tags (hit Enter or Tab)" : ""
              }
              flex="1"
              minW="100px"
            />
          </Box>
        </Grid>
      </SimpleGrid>
    </FormControl>
  );
}

export default TagInput;
