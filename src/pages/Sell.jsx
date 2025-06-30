import {
  Box,
  Heading,
  Text,
  HStack,
  SimpleGrid,
  Input,
  Select,
  Textarea,
  FormControl,
  FormLabel,
  Button,
  Icon,
  Grid,
  GridItem,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { FaCamera } from "react-icons/fa";
import { PuffLoader } from "react-spinners";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

import Container from "../components/shared/Container";
import TagInput from "../components/ui/tagInput";
import designers from "../data/designers";
import categoryMap from "../data/categoryMap";
import {
  clothingSizes,
  footwearSizes,
  nonSizedCategories,
  colors,
  conditions,
} from "../data/listingFields";
import countries from "../data/countries";

import { formatCurrency, validatePrice } from "../utils/priceUtils";
import { handleImageUpload } from "../utils/imageUtils";
import { uploadListing, patchListing } from "../utils/uploadListingUtils";

export default function Sell() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const navigate = useNavigate();
  const { draftId } = useParams();

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedDesigner, setSelectedDesigner] = useState("");
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [countryOfOrigin, setCountryOfOrigin] = useState("");
  const [acceptOffers, setAcceptOffers] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState("");
  const [tags, setTags] = useState([]);

  const [showDesignerDropdown, setShowDesignerDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [designerInput, setDesignerInput] = useState("");
  const [countryInput, setCountryInput] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [priceError, setPriceError] = useState("");
  const [isPriceInvalid, setIsPriceInvalid] = useState(false);

  const [uploadedImageUrls, setUploadedImageUrls] = useState([
    null,
    null,
    null,
    null,
    null,
  ]);
  const [uploadingIndex, setUploadingIndex] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [missingItemName, setMissingItemName] = useState(false);
  const [isDraftEdit, setIsDraftEdit] = useState(false);

  const errorStyle = {
    borderWidth: "2px",
    borderColor: "red.500",
    borderStyle: "solid",
  };

  const availableSubcategories =
    selectedDepartment && selectedCategory
      ? categoryMap[selectedDepartment][selectedCategory] || []
      : [];
  const isOneSizeCategory =
    selectedCategory && nonSizedCategories.includes(selectedCategory);
  const isSizeCategory = !!selectedCategory;
  const isFootwearCategory = selectedCategory === "Footwear";
  const sizeOptions = isFootwearCategory ? footwearSizes : clothingSizes;

  const filteredDesigners = designerInput
    ? designers
        .filter((d) => d.toLowerCase().includes(designerInput.toLowerCase()))
        .slice(0, 10)
    : designers;

  const filteredCountries = countryInput
    ? countries
        .filter((c) =>
          c.toLowerCase().includes(countryInput.trim().toLowerCase())
        )
        .slice(0, 10)
    : countries;

  const handleCategorySelect = (value) => {
    const [dept, cat] = value.split("-");
    setSelectedDepartment(dept);
    setSelectedCategory(cat);
    setSelectedSubcategory("");
  };

  const handlePriceChange = (e) => {
    const raw = e.target.value.replace(/[^\d]/g, "").slice(0, 6);
    setPriceInput(formatCurrency(raw));

    const { isValid, error } = validatePrice(raw);
    setIsPriceInvalid(!isValid);
    setPriceError(error);
  };

  const handleSubmit = async () => {
    setHasSubmitted(true);

    const requiredFields = [
      selectedDepartment,
      selectedCategory,
      selectedSubcategory,
      selectedSize,
      selectedDesigner,
      itemName,
      selectedColor,
      selectedCondition,
      priceInput,
      countryOfOrigin,
    ];

    const hasMissingFields = requiredFields.some(
      (field) => field === undefined || field === null || field === ""
    );

    const hasNoImages = uploadedImageUrls.filter(Boolean).length === 0;

    if (hasMissingFields || hasNoImages) {
      return;
    }

    const formData = {
      selectedDepartment,
      selectedCategory,
      selectedSubcategory,
      selectedSize,
      selectedDesigner,
      itemName,
      description,
      selectedColor,
      selectedCondition,
      priceInput,
      acceptOffers,
      countryOfOrigin,
      tags,
      uploadedImageUrls: uploadedImageUrls.filter(Boolean),
    };

    try {
      setIsSubmitting(true);

      const listing = await uploadListing(formData, token);
      if (listing?._id) {
        navigate(`/listing/${listing._id}`);
        return;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    const formData = {
      selectedDepartment,
      selectedCategory,
      selectedSubcategory,
      selectedSize,
      selectedDesigner,
      itemName,
      description,
      selectedColor,
      selectedCondition,
      priceInput,
      acceptOffers,
      countryOfOrigin,
      tags,
      uploadedImageUrls: uploadedImageUrls.filter(Boolean),
      isDraft: true,
    };

    if (!itemName) {
      setMissingItemName(true);
      return;
    }

    try {
      setIsSubmitting(true);

      if (isDraftEdit) {
        const listing = await patchListing(formData, token, draftId);
        if (listing?._id) {
          navigate("/drafts");
          return;
        }
      } else {
        const listing = await uploadListing(formData, token);
        if (listing?._id) {
          navigate("/drafts");
          return;
        }
      }
    } catch (err) {
      console.error("Error saving draft:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!draftId) return;

    const fetchDraft = async () => {
      try {
        const res = await fetch(`/api/listings/${draftId}`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          setSelectedDepartment(data.department ?? undefined);
          setSelectedCategory(data.category ?? undefined);
          setSelectedSubcategory(data.subCategory ?? undefined);
          setDesignerInput(data.designer ?? undefined);
          setSelectedDesigner(data.designer ?? undefined);
          setItemName(data.title ?? undefined);
          setDescription(data.description ?? "");
          setSelectedSize(data.size ?? undefined);
          setCountryOfOrigin(data.countryOfOrigin ?? undefined);
          setAcceptOffers(data.canOffer ?? true);
          setSelectedColor(
            colors.find((c) => c.name === data.color) ?? undefined
          );
          setSelectedCondition(data.condition ?? undefined);
          setTags(data.tags ?? []);
          setPriceInput(data.price !== undefined ? `$${data.price}` : "");
          setUploadedImageUrls(
            data.images?.length
              ? [...data.images, null, null, null, null, null].slice(0, 5)
              : [null, null, null, null, null]
          );
        } else {
          console.error("Failed to load draft:", data?.error || data);
        }
      } catch (err) {
        console.error("Error fetching draft:", err);
      }

      setIsDraftEdit(true);
    };

    fetchDraft();
  }, [draftId]);

  return (
    <Container>
      <Box maxW="960px" mx="auto" py={10}>
        <HStack justify="space-between" mb={16}>
          <Heading fontSize="32px" fontWeight="bold">
            Add a new listing
          </Heading>
          <Text fontSize="sm" color="#DCEF31" fontWeight="semibold">
            HOW TO SELL GUIDE
          </Text>
        </HStack>

        <Box mb={16}>
          <Heading fontSize="20px" fontWeight="bold" mb={4}>
            Details
          </Heading>
          <SimpleGrid columns={8} spacing={4}>
            <Grid gridColumn="span 4">
              <FormControl
                id="department-category"
                isInvalid={hasSubmitted && !selectedDepartment}
              >
                <Select
                  placeholder="Department / Category"
                  value={
                    selectedDepartment && selectedCategory
                      ? `${selectedDepartment}-${selectedCategory}`
                      : ""
                  }
                  onChange={(e) => handleCategorySelect(e.target.value)}
                  sx={{
                    option: { backgroundColor: "white", fontStyle: "normal" },
                  }}
                >
                  {Object.entries(categoryMap).map(([dept, categories]) => (
                    <optgroup
                      key={dept}
                      label={dept}
                      style={{ fontStyle: "normal" }}
                    >
                      {Object.keys(categories).map((cat) => (
                        <option key={`${dept}-${cat}`} value={`${dept}-${cat}`}>
                          {cat}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid gridColumn="span 4">
              <FormControl
                id="subcategory"
                isInvalid={hasSubmitted && !selectedSubcategory}
              >
                <Select
                  placeholder="Sub-category (select category first)"
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  isDisabled={!selectedCategory}
                >
                  {availableSubcategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid gridColumn="span 4" position="relative">
              <FormControl
                id="designer"
                isInvalid={hasSubmitted && !selectedDesigner}
              >
                <Input
                  placeholder="Designer (select category first)"
                  value={selectedDesigner}
                  onFocus={() => {
                    if (designers.length > 0) setShowDesignerDropdown(true);
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    setDesignerInput(value);
                    setSelectedDesigner(null);
                    setShowDesignerDropdown(true);
                  }}
                  onBlur={() => {
                    setTimeout(() => setShowDesignerDropdown(false), 100);
                    const isValid = designers.some(
                      (d) =>
                        d.toLowerCase() === designerInput.trim().toLowerCase()
                    );
                    if (!isValid) setDesignerInput("");
                  }}
                  isDisabled={!selectedCategory}
                />
                {(designerInput || showDesignerDropdown) &&
                  !selectedDesigner &&
                  filteredDesigners.length > 0 && (
                    <Box
                      position="absolute"
                      top="100%"
                      left={0}
                      right={0}
                      bg="white"
                      border="1px solid #E2E8F0"
                      mt={1}
                      zIndex={10}
                      maxH="200px"
                      overflowY="auto"
                      borderRadius="md"
                      boxShadow="md"
                    >
                      {filteredDesigners.map((name) => (
                        <Box
                          key={name}
                          px={4}
                          py={2}
                          _hover={{ bg: "gray.100", cursor: "pointer" }}
                          onMouseDown={() => {
                            setDesignerInput(name);
                            setSelectedDesigner(name);
                          }}
                        >
                          {name}
                        </Box>
                      ))}
                    </Box>
                  )}
              </FormControl>
            </Grid>

            <Grid gridColumn="span 4">
              <FormControl id="size" isInvalid={hasSubmitted && !selectedSize}>
                <Select
                  placeholder="Size (select category first)"
                  onChange={(e) => setSelectedSize(e.target.value)}
                  isDisabled={!isSizeCategory}
                  value={selectedSize}
                >
                  {isOneSizeCategory
                    ? ["One Size"].map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))
                    : sizeOptions.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                </Select>
              </FormControl>
            </Grid>
          </SimpleGrid>
        </Box>

        <Box mb={16}>
          <FormControl
            id="item-name"
            isInvalid={
              (hasSubmitted && !itemName) || (missingItemName && !itemName)
            }
          >
            <FormLabel fontSize="20px" fontWeight="bold" mb={4}>
              Item name
            </FormLabel>
            <SimpleGrid columns={8} spacing={4}>
              <Grid gridColumn="span 4">
                <Input
                  placeholder="Item name"
                  value={itemName}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const cleaned = raw.replace(/[^a-zA-Z0-9' ]/g, "");
                    setItemName(cleaned);
                  }}
                />
              </Grid>
            </SimpleGrid>
          </FormControl>
        </Box>

        <Box mb={16}>
          <FormControl id="color" isInvalid={hasSubmitted && !selectedColor}>
            <FormLabel fontSize="20px" fontWeight="bold" mb={4}>
              Color
            </FormLabel>
            <SimpleGrid columns={8} spacing={4}>
              <Grid gridColumn="span 4">
                <Menu matchWidth>
                  <MenuButton
                    as={Button}
                    w="100%"
                    textAlign="left"
                    variant="outline"
                    bg="white"
                    fontWeight="normal"
                    _hover={{ bg: "gray.50" }}
                    _expanded={{ bg: "gray.100" }}
                    _focus={{ boxShadow: "outline" }}
                    {...(hasSubmitted && !selectedColor
                      ? errorStyle
                      : { border: "1px solid", borderColor: "gray.200" })}
                  >
                    {selectedColor ? (
                      <HStack spacing={3}>
                        <Box
                          w="14px"
                          h="14px"
                          borderRadius="full"
                          bg={selectedColor.hex}
                        />
                        <Text>{selectedColor.name}</Text>
                      </HStack>
                    ) : (
                      <Text color="gray.500">Select a color</Text>
                    )}
                  </MenuButton>
                  <MenuList maxH="200px" overflowY="auto" zIndex={20}>
                    {colors.map((color) => (
                      <MenuItem
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        _hover={{ bg: "gray.100" }}
                      >
                        <HStack spacing={3}>
                          <Box
                            w="14px"
                            h="14px"
                            borderRadius="full"
                            bg={color.hex}
                          />
                          <Text>{color.name}</Text>
                        </HStack>
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </Grid>
            </SimpleGrid>
          </FormControl>
        </Box>

        <Box mb={16}>
          <FormControl
            id="condition"
            isInvalid={hasSubmitted && !selectedCondition}
          >
            <FormLabel fontSize="20px" fontWeight="bold" mb={4}>
              Condition
            </FormLabel>
            <SimpleGrid columns={8} spacing={4}>
              <Grid gridColumn="span 4">
                <Select
                  placeholder="Select a condition"
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                >
                  {conditions.map((condition) => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </Select>
              </Grid>
            </SimpleGrid>
          </FormControl>
        </Box>

        <Box mb={16}>
          <FormControl id="description">
            <FormLabel fontSize="20px" fontWeight="bold" mb={4}>
              Description
            </FormLabel>
            <Textarea
              placeholder="Add details about condition..."
              onChange={(e) => {
                const value = e.target.value;
                setDescription(value);
              }}
              value={description}
            />
          </FormControl>
        </Box>

        <Box mb={16}>
          <TagInput tags={tags} setTags={setTags} />
        </Box>

        <Box mb={16} position="relative">
          <FormControl
            id="country-of-origin"
            isInvalid={hasSubmitted && !countryOfOrigin}
          >
            <FormLabel fontSize="20px" fontWeight="bold" mb={1}>
              Where was your item made?
            </FormLabel>
            <Text fontSize="sm" color="gray.500" mb={4}>
              Provide the{" "}
              <Text as="span" fontWeight="bold">
                country of origin for this product
              </Text>{" "}
              for customs
            </Text>

            <Input
              placeholder="Country name"
              value={countryOfOrigin}
              onChange={(e) => {
                setCountryInput(e.target.value);
                setShowCountryDropdown(true);
              }}
              onFocus={() => setShowCountryDropdown(true)}
              onBlur={() =>
                setTimeout(() => setShowCountryDropdown(false), 100)
              }
              w="50%"
              borderWidth={hasSubmitted && !countryOfOrigin ? "2px" : "1px"}
              borderColor={
                hasSubmitted && !countryOfOrigin ? "red.500" : "gray.200"
              }
            />

            {showCountryDropdown && (
              <Box
                position="absolute"
                width="50%"
                bg="white"
                border="1px solid #E2E8F0"
                mt={1}
                zIndex={20}
                maxH="200px"
                overflowY="auto"
                borderRadius="md"
                boxShadow="md"
              >
                {filteredCountries.map((c) => (
                  <Box
                    key={c}
                    px={4}
                    py={2}
                    _hover={{ bg: "gray.100", cursor: "pointer" }}
                    onMouseDown={() => {
                      setCountryInput(c);
                      setCountryOfOrigin(c);
                      setShowCountryDropdown(false);
                    }}
                  >
                    {c}
                  </Box>
                ))}
              </Box>
            )}
          </FormControl>
        </Box>

        <Box mb={8}>
          <FormControl
            id="price"
            isInvalid={isPriceInvalid && hasSubmitted && !priceInput}
          >
            <FormLabel fontSize="20px" fontWeight="bold" mb={4}>
              Price
            </FormLabel>
            <SimpleGrid columns={8} spacing={4}>
              <Grid gridColumn="span 4">
                <Input
                  placeholder="$ Price USD"
                  value={priceInput}
                  onChange={handlePriceChange}
                  onBlur={() => {
                    const clean = parseFloat(
                      priceInput.replace(/[^0-9.]/g, "")
                    );
                    if (isNaN(clean) || clean < 1 || clean > 200000) {
                      setPriceInput("");
                      setIsPriceInvalid(true);
                      setPriceError("Price must be between $1 and $200,000");
                    }
                  }}
                  textAlign="left"
                  fontWeight="semibold"
                  color={isPriceInvalid ? "red.500" : "gray.800"}
                  borderColor={isPriceInvalid ? "red.500" : "gray.200"}
                  {...(hasSubmitted && !priceInput
                    ? errorStyle
                    : { borderColor: "gray.200" })}
                  _placeholder={{
                    color: isPriceInvalid ? "red.300" : "gray.400",
                  }}
                />
              </Grid>
            </SimpleGrid>
            {priceError && (
              <Text fontSize="xs" mt={2} color={"red.500"} fontWeight={"bold"}>
                {priceError}
              </Text>
            )}
          </FormControl>
        </Box>

        <Box mb={16} w="50%">
          <FormControl id="accept-offers" display="flex" alignItems="center">
            <FormLabel
              htmlFor="accept-offers"
              mb="0"
              fontSize="md"
              fontWeight="bold"
            >
              Accept offers
            </FormLabel>
            <Box ml="auto">
              <input
                id="accept-offers"
                type="checkbox"
                style={{ display: "none" }}
                checked={acceptOffers || false}
                onChange={(e) =>
                  setAcceptOffers(e.target.checked ? true : false)
                }
              />
              <Box
                as="label"
                htmlFor="accept-offers"
                cursor="pointer"
                display="inline-block"
                w="42px"
                h="24px"
                bg={acceptOffers ? "gray.800" : "gray.300"}
                borderRadius="full"
                position="relative"
                transition="background-color 0.2s"
              >
                <Box
                  w="18px"
                  h="18px"
                  bg="white"
                  borderRadius="full"
                  position="absolute"
                  top="3px"
                  left={acceptOffers ? "20px" : "4px"}
                  transition="left 0.2s"
                  boxShadow="md"
                />
              </Box>
            </Box>
          </FormControl>
        </Box>

        <Box mb={16}>
          <Heading fontSize="20px" fontWeight="bold" mb={4}>
            Photos
          </Heading>

          {hasSubmitted && !uploadedImageUrls.some(Boolean) && (
            <Alert
              status="error"
              variant="left-accent"
              borderRadius="md"
              bg="red.50"
              mb={4}
            >
              <AlertIcon />
              <Text fontSize="sm">Please add at least one</Text>
            </Alert>
          )}

          <Grid templateColumns="repeat(8, 1fr)" gap={4}>
            {[0, 1, 2, 3, 4].map((index) => {
              const url = uploadedImageUrls[index];
              const isUploading = uploadingIndex === index;

              return (
                <GridItem
                  key={index}
                  colSpan={index === 0 ? 4 : 2}
                  rowSpan={index === 0 ? 2 : 1}
                >
                  <label
                    htmlFor={`photo-${index}`}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <Box
                      w="100%"
                      h="100%"
                      maxHeight="500px"
                      bg="gray.100"
                      borderRadius="md"
                      border="1px dashed gray"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      cursor="pointer"
                      overflow="hidden"
                      position="relative"
                      aspectRatio={index === 0 ? undefined : "1"}
                    >
                      {isUploading ? (
                        <PuffLoader size={40} color="#666" />
                      ) : url ? (
                        <>
                          <img
                            src={url}
                            alt={`Photo ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              objectPosition: "center center",
                            }}
                          />
                          <Button
                            size="xs"
                            position="absolute"
                            top="8px"
                            right="8px"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setUploadedImageUrls((prev) => {
                                const next = [...prev];
                                next[index] = null;
                                return next;
                              });
                            }}
                          >
                            Remove
                          </Button>
                        </>
                      ) : (
                        <Icon as={FaCamera} boxSize={5} color="gray.500" />
                      )}
                    </Box>
                    <input
                      id={`photo-${index}`}
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      hidden
                      onChange={(e) =>
                        handleImageUpload(
                          e.target.files[0],
                          index,
                          setUploadedImageUrls,
                          setUploadingIndex
                        )
                      }
                    />
                  </label>
                </GridItem>
              );
            })}
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
                  <Button
                    variant="outline"
                    colorScheme="gray"
                    onClick={handleSaveDraft}
                    isDisabled={isSubmitting}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    bg="#DCEF31"
                    color="black"
                    _hover={{ bg: "#C5E426" }}
                    onClick={handleSubmit}
                    isDisabled={isSubmitting}
                  >
                    Publish
                  </Button>
                </HStack>
              </Grid>
            </SimpleGrid>
          </Box>
        </Box>
      </Box>
      {isSubmitting && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(255,255,255,0.8)"
          zIndex={2000}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <PuffLoader size={60} color="#333" />
        </Box>
      )}
    </Container>
  );
}
