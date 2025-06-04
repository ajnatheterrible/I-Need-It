import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  Text,
  Box,
  Collapse,
  IconButton,
  Checkbox,
  HStack,
  Button,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import useAuthStore from "../../store/authStore";

const SIZE_OPTIONS = {
  menswear: {
    Tops: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
    Bottoms: [
      "26",
      "27",
      "28",
      "29",
      "30",
      "31",
      "32",
      "33",
      "34",
      "36",
      "38",
      "40",
      "42",
      "44",
    ],
    Outerwear: ["XS", "S", "M", "L", "XL", "XXL"],
    Footwear: [
      "7",
      "7.5",
      "8",
      "8.5",
      "9",
      "9.5",
      "10",
      "10.5",
      "11",
      "11.5",
      "12",
    ],
    Tailoring: ["XS", "S", "M", "L", "XL"],
    Accessories: ["ONE SIZE"],
  },
  womenswear: {
    Tops: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
    Bottoms: ["24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34"],
    Outerwear: ["XS", "S", "M", "L", "XL", "XXL"],
    Dresses: ["XXS", "XS", "S", "M", "L", "XL"],
    Footwear: [
      "5",
      "5.5",
      "6",
      "6.5",
      "7",
      "7.5",
      "8",
      "8.5",
      "9",
      "9.5",
      "10",
    ],
    Accessories: ["ONE SIZE"],
    Bags: ["ONE SIZE"],
    Jewelry: ["ONE SIZE"],
  },
};

export default function EditSizesModal({ isOpen, onClose }) {
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState("menswear");
  const [sizes, setSizes] = useState({ menswear: {}, womenswear: {} });
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    if (user?.settings?.sizes) {
      setSizes(user.settings.sizes);
    }
  }, [user]);

  const toggleSize = (department, category, size) => {
    setSizes((prev) => {
      const current = prev[department][category] || [];
      const newSelection = current.includes(size)
        ? current.filter((s) => s !== size)
        : [...current, size];

      return {
        ...prev,
        [department]: {
          ...prev[department],
          [category]: newSelection,
        },
      };
    });
  };

  const toggleCollapse = (category) => {
    setExpanded((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/users/${user._id}/sizes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sizes),
      });

      const data = await res.json();

      if (res.ok) {
        useAuthStore.getState().setUser({
          ...user,
          settings: {
            ...user.settings,
            sizes: data.sizes,
          },
        });
        onClose();
      } else {
        console.error("Failed to save sizes:", data.message);
      }
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const renderSection = (department) =>
    Object.entries(SIZE_OPTIONS[department]).map(([category, options]) => (
      <Box key={category} w="100%">
        <HStack
          justify="space-between"
          align="center"
          py={2}
          px={1}
          onClick={() => toggleCollapse(category)}
          cursor="pointer"
        >
          <Text fontWeight="semibold">{category}</Text>
          <IconButton
            size="xs"
            icon={expanded[category] ? <ChevronUpIcon /> : <ChevronDownIcon />}
            variant="ghost"
            aria-label="Toggle"
          />
        </HStack>
        <Collapse in={expanded[category]}>
          <HStack wrap="wrap" spacing={3} px={2} pb={3}>
            {options.map((size) => (
              <Checkbox
                key={size}
                isChecked={(sizes[department]?.[category] || []).includes(size)}
                onChange={() => toggleSize(department, category, size)}
              >
                {size}
              </Checkbox>
            ))}
          </HStack>
        </Collapse>
      </Box>
    ));

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">My Sizes</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Text fontSize="sm" textAlign="center" mb={4} color="gray.600">
            Set up to filter out listings that are not in your size
          </Text>

          <Tabs
            isFitted
            variant="unstyled"
            onChange={(i) => setActiveTab(i === 0 ? "menswear" : "womenswear")}
          >
            <TabList mb={4}>
              <Tab _selected={{ borderBottom: "2px solid black" }}>
                MENSWEAR
              </Tab>
              <Tab _selected={{ borderBottom: "2px solid black" }}>
                WOMENSWEAR
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>{renderSection("menswear")}</TabPanel>
              <TabPanel>{renderSection("womenswear")}</TabPanel>
            </TabPanels>
          </Tabs>

          <Button
            colorScheme="blackAlpha"
            width="100%"
            mt={4}
            onClick={handleSave}
          >
            SAVE MY SIZES
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
