import {
  Box,
  Grid,
  GridItem,
  Text,
  Heading,
  Button,
  VStack,
  HStack,
  Divider,
  Badge,
  useDisclosure,
  Avatar,
  IconButton,
  Img,
  Flex,
} from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";
import { FaHeart, FaRegHeart } from "react-icons/fa";

import { useEffect, useState, useMemo } from "react";
import { Link as RouterLink, useParams, useNavigate } from "react-router-dom";

import useFetchFavorites from "../hooks/useFetchFavorites";
import { toggleFavorite } from "../utils/favoriteUtils";

import Container from "../components/shared/Container";
import Footer from "../components/layout/Footer";
import { PurchaseProtection } from "../components/ui/PurchaseProtection";
import KlarnaAffirmButton from "../components/ui/KlarnaAffirmButton";
import KlarnaAffirmModal from "../components/ui/KlarnaAffirmModal";
import OfferModal from "../components/modals/OfferModal";
import MessageModal from "../components/modals/MessageModal";
import ListingSkeleton from "../components/skeletons/ListingSkeleton";

import useAuthStore from "../store/authStore";
import { useAuthModal } from "../context/AuthModalContext";

export default function ListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const favorites = useAuthStore((s) => s.fetchedData?.favorites);
  const setFetchedData = useAuthStore((s) => s.setFetchedData);

  const onOpenAuthModal = useAuthModal();

  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isImageOpen, setIsImageOpen] = useState(false);

  const isViewerSeller =
    isLoggedIn && user?.username === listing?.seller?.username;

  useEffect(() => {
    const fetchListing = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/listings/${id}`);
        if (!res.ok) throw new Error("Listing not found");
        const data = await res.json();
        setListing(data);
      } catch {
        navigate("/404");
      } finally {
        setIsLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  useFetchFavorites();

  const favoriteIds = useMemo(() => {
    if (!Array.isArray(favorites)) return [];
    return favorites.map((f) => (f && typeof f === "object" ? f._id : f));
  }, [favorites]);

  const handleFavorite = async (listingId) => {
    if (!isLoggedIn) return onOpenAuthModal("register");
    const isFavorited = favoriteIds.includes(listingId);
    try {
      const data = await toggleFavorite(listingId, token, isFavorited);
      setFetchedData({ favorites: [...data.favorites] });
      const updated = data.favorites.find((f) => f._id === listingId);
      if (updated) {
        setListing(updated);
      } else {
        setListing((prev) => ({
          ...prev,
          favoritesCount: Math.max(0, (prev.favoritesCount || 1) - 1),
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const {
    isOpen: isOfferOpen,
    onOpen: onOfferOpen,
    onClose: onOfferClose,
  } = useDisclosure();

  const {
    isOpen: isMessageOpen,
    onOpen: onMessageOpen,
    onClose: onMessageClose,
  } = useDisclosure();

  const {
    isOpen: isKlarnaOpen,
    onOpen: onKlarnaOpen,
    onClose: onKlarnaClose,
  } = useDisclosure();

  const rotateNext = () => {
    if (listing.images.length > 1) {
      setActiveIndex((prev) => (prev + 1) % listing.images.length);
    }
  };

  const rotatePrev = () => {
    if (listing.images.length > 1) {
      setActiveIndex(
        (prev) => (prev - 1 + listing.images.length) % listing.images.length
      );
    }
  };

  const openImageModal = () => setIsImageOpen(true);
  const closeImageModal = () => setIsImageOpen(false);

  const getTimestamp = (createdAt) => {
    const createdAtMS = new Date(createdAt).getTime();
    const now = Date.now();
    const ms = now - createdAtMS;
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (seconds < 60) return "just now";
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  };

  const getPercentOff = (original, sale) => {
    if (!original || !sale || original <= sale) return 0;
    return Math.round(((original - sale) / original) * 100);
  };

  const handleGuestAction = () => onOpenAuthModal("register");

  return (
    <>
      {/* full component JSX stays same except action buttons below */}
      {!isLoading && listing && (
        <Container>
          {/* ...image grid and product info... */}
          {isViewerSeller ? (
            <VStack w="100%" spacing={2}>
              <Button w="100%" colorScheme="blackAlpha">
                DROP PRICE
              </Button>
              <Button w="100%" variant="outline">
                EDIT
              </Button>
              <Button w="100%" variant="outline">
                SEND OFFER
              </Button>
              <Button w="100%" variant="outline">
                DELETE
              </Button>
            </VStack>
          ) : (
            <VStack w="100%" spacing={2}>
              <KlarnaAffirmButton
                onOpen={isLoggedIn ? onKlarnaOpen : handleGuestAction}
                price={listing.price}
              />
              <HStack w="100%">
                <Button
                  colorScheme="blackAlpha"
                  flex="1"
                  onClick={
                    isLoggedIn ? () => navigate("/checkout") : handleGuestAction
                  }
                >
                  PURCHASE
                </Button>
              </HStack>
              <HStack w="100%">
                <Button
                  variant="outline"
                  flex="1"
                  onClick={isLoggedIn ? onOfferOpen : handleGuestAction}
                >
                  OFFER
                </Button>
                <Button
                  variant="outline"
                  flex="1"
                  onClick={isLoggedIn ? onMessageOpen : handleGuestAction}
                >
                  MESSAGE
                </Button>
              </HStack>
            </VStack>
          )}
          {/* ...rest of the component... */}
        </Container>
      )}
    </>
  );
}
