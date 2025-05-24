import {
  Box,
  Text,
  HStack,
  VStack,
  Divider,
  Switch,
  Button,
  Collapse,
  Checkbox,
} from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useState } from "react";

export default function FilterSidebar() {
  const [showDepartment, setShowDepartment] = useState(true);
  const [showCategory, setShowCategory] = useState(true);
  const [showSize, setShowSize] = useState(false);
  const [showDesigner, setShowDesigner] = useState(false);
  const [showPrice, setShowPrice] = useState(false);
  const [showCondition, setShowCondition] = useState(false);
  const [showLocation, setShowLocation] = useState(false);

  const [menswearSelected, setMenswearSelected] = useState(false);
  const [womenswearSelected, setWomenswearSelected] = useState(false);

  const mensCategories = [
    "Tops",
    "Bottoms",
    "Outerwear",
    "Footwear",
    "Tailoring",
    "Accessories",
  ];
  const womensCategories = [
    "Tops",
    "Bottoms",
    "Outerwear",
    "Dresses",
    "Footwear",
    "Accessories",
  ];

  const [openMens, setOpenMens] = useState({});
  const [openWomens, setOpenWomens] = useState({});

  const toggleMens = (cat) =>
    setOpenMens((prev) => ({ ...prev, [cat]: !prev[cat] }));
  const toggleWomens = (cat) =>
    setOpenWomens((prev) => ({ ...prev, [cat]: !prev[cat] }));

  const toggleCategoryCollapse = (cat, toggleFn, openState) => (
    <HStack
      justify="space-between"
      w="100%"
      key={cat}
      cursor="pointer"
      onClick={() => toggleFn(cat)}
    >
      <Text>{cat}</Text>
      {openState[cat] ? <ChevronUpIcon /> : <ChevronDownIcon />}
    </HStack>
  );

  return (
    <Box
      position="sticky"
      top="140px"
      w="25%"
      bg="white"
      zIndex={1}
      alignSelf="flex-start"
      maxHeight="calc(100vh - 140px)"
      overflowY="auto"
      pr={2}
      sx={{
        "&::-webkit-scrollbar": { width: "8px" },
        "&::-webkit-scrollbar-thumb": { backgroundColor: "transparent" },
        "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
        scrollbarWidth: "thin",
        scrollbarColor: "transparent transparent",
      }}
    >
      <VStack align="start" spacing={6}>
        <Box
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          p={4}
          w="100%"
        >
          <HStack justify="space-between" w="100%">
            <Text fontWeight="bold">My Sizes</Text>
            <Switch />
          </HStack>
          <Text fontSize="sm" color="gray.600" mt={2}>
            Turn on to filter out listings that are not in your size.
          </Text>
          <Button size="xs" variant="link" mt={1}>
            Edit
          </Button>
        </Box>

        <Box w="100%">
          <HStack
            justify="space-between"
            onClick={() => setShowDepartment(!showDepartment)}
            cursor="pointer"
          >
            <Text fontWeight="bold">Department</Text>
            {showDepartment ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </HStack>
          <Collapse in={showDepartment} animateOpacity>
            <VStack align="start" spacing={2} mt={2}>
              <Checkbox
                isChecked={menswearSelected}
                onChange={(e) => setMenswearSelected(e.target.checked)}
              >
                Menswear
              </Checkbox>
              <Checkbox
                isChecked={womenswearSelected}
                onChange={(e) => setWomenswearSelected(e.target.checked)}
              >
                Womenswear
              </Checkbox>
            </VStack>
          </Collapse>
        </Box>

        <Divider />

        <Box w="100%">
          <HStack
            justify="space-between"
            onClick={() => setShowCategory(!showCategory)}
            cursor="pointer"
          >
            <Text fontWeight="bold">Category</Text>
            {showCategory ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </HStack>
          <Collapse in={showCategory} animateOpacity>
            <Box mt={2} w="100%">
              {(!womenswearSelected ||
                (!menswearSelected && !womenswearSelected)) && (
                <>
                  <Text fontWeight="bold" mb={2}>
                    Menswear
                  </Text>
                  <VStack align="start" spacing={2} pl={2}>
                    {mensCategories.map((cat) =>
                      toggleCategoryCollapse(cat, toggleMens, openMens)
                    )}
                  </VStack>
                </>
              )}
              {(!menswearSelected ||
                (!menswearSelected && !womenswearSelected)) && (
                <>
                  <Text fontWeight="bold" mt={4} mb={2}>
                    Womenswear
                  </Text>
                  <VStack align="start" spacing={2} pl={2}>
                    {womensCategories.map((cat) =>
                      toggleCategoryCollapse(cat, toggleWomens, openWomens)
                    )}
                  </VStack>
                </>
              )}
            </Box>
          </Collapse>
        </Box>

        <Divider />

        {[
          ["Size", showSize, setShowSize],
          ["Designer", showDesigner, setShowDesigner],
          ["Condition", showCondition, setShowCondition],
          ["Location", showLocation, setShowLocation],
        ].map(([label, state, toggle]) => (
          <Box w="100%" key={label}>
            <HStack
              justify="space-between"
              onClick={() => toggle(!state)}
              cursor="pointer"
            >
              <Text fontWeight="bold">{label}</Text>
              {state ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </HStack>
            <Collapse in={state} animateOpacity>
              <Text fontSize="sm" mt={2} color="gray.500">
                Example {label} option
              </Text>
            </Collapse>
            <Divider mt={3} />
          </Box>
        ))}

        <Box w="100%">
          <HStack
            justify="space-between"
            onClick={() => setShowPrice(!showPrice)}
            cursor="pointer"
          >
            <Text fontWeight="bold">Price</Text>
            {showPrice ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </HStack>
          <Collapse in={showPrice} animateOpacity>
            <HStack mt={3} spacing={4}>
              <HStack
                borderWidth="1px"
                borderColor="gray.300"
                borderRadius="md"
                px={3}
                py={1}
                spacing={2}
              >
                <Text color="gray.500" fontSize="sm">
                  $
                </Text>
                <input
                  type="number"
                  placeholder="Min"
                  style={{
                    outline: "none",
                    border: "none",
                    width: "60px",
                    fontSize: "0.875rem",
                    color: "#4A5568",
                    background: "transparent",
                  }}
                />
              </HStack>

              <HStack
                borderWidth="1px"
                borderColor="gray.300"
                borderRadius="md"
                px={3}
                py={1}
                spacing={2}
              >
                <Text color="gray.500" fontSize="sm">
                  $
                </Text>
                <input
                  type="number"
                  placeholder="Max"
                  style={{
                    outline: "none",
                    border: "none",
                    width: "60px",
                    fontSize: "0.875rem",
                    color: "#4A5568",
                    background: "transparent",
                  }}
                />
              </HStack>
            </HStack>
          </Collapse>
          <Divider mt={3} />
        </Box>
      </VStack>
    </Box>
  );
}
