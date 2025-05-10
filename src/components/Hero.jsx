import { Box, Image } from "@chakra-ui/react";

export default function Hero() {
  return (
    <Box as="section" w="100%" overflow="hidden">
      <Image
        src="/assets/hero.gif"
        alt="Brooding Hoes Hero"
        w="100%"
        maxH="320px"
        objectFit="cover"
      />
    </Box>
  );
}
