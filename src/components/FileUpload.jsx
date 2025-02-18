import { Button, Input, Flex, Text } from "@chakra-ui/react";
import { useState, useRef } from "react";

const FileUpload = ({ onFileSelect }) => {
  const [imageFile, setImageFile] = useState(null);
  const inputRef = useRef(null);

  const handleClick = () => inputRef.current.click();

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const sanitizedFileName = file.name
        .replace(/\s+(?=\.[^.]+$)/, "")
        .replace(/[^a-zA-Z0-9._-]/g, "");
      setImageFile({ ...file, sanitizedName: sanitizedFileName });
      onFileSelect(file);
    }
  };

  return (
    <Flex
      align="center"
      justify="space-between"
      bg="white"
      width="100%"
      height="40px"
      borderWidth="1px"
      borderColor="gray.200"
      _hover={{ borderColor: "gray.300" }}
      _focusWithin={{ boxShadow: "outline" }}
      borderRadius="md"
      cursor="pointer"
      onClick={handleClick}
    >
      <Text p={4} color={imageFile ? "gray.800" : "gray.500"}>
        {imageFile ? imageFile.sanitizedName : "Select an image..."}
      </Text>
      <Button mr={1} size="sm" colorScheme="blue" onClick={handleClick}>
        Browse
      </Button>
      <Input
        type="file"
        accept="image/*"
        onChange={handleChange}
        ref={inputRef}
        display="none"
      />
    </Flex>
  );
};

export default FileUpload;
