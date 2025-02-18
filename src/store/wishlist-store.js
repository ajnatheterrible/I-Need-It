import { create } from "zustand";
import {
  getWishlists,
  createWishlist,
  getItemsInWishlist,
  addItemToWishlist,
  deleteItem,
  deleteWishlist,
  uploadImageService,
} from "../firebase/wishlist-service";

export const useWishlistStore = create((set, get) => ({
  wishlists: [],
  loading: false,
  currentWishlistItems: [],

  fetchWishlists: async (userId) => {
    set({ loading: true });

    try {
      const wishlists = await getWishlists(userId);

      const wishlistsWithItems = await Promise.all(
        wishlists.map(async (wishlist) => {
          const items = await getItemsInWishlist(userId, wishlist.id);
          return { ...wishlist, items };
        })
      );

      set({ wishlists: wishlistsWithItems, loading: false });
    } catch (error) {
      console.error("Error fetching wishlists:", error);
      set({ loading: false });
    }
  },

  createNewWishlist: async (userId, name, description) => {
    try {
      const newWishlist = await createWishlist(userId, name, description);
      set((state) => ({ wishlists: [...state.wishlists, newWishlist] }));
    } catch (error) {
      console.error("Error creating wishlist:", error);
    }
  },

  addItem: async (userId, wishlistId, itemData) => {
    try {
      const newItem = await addItemToWishlist(userId, wishlistId, itemData); // ✅ Store returned item ID
      set((state) => ({
        wishlists: state.wishlists.map((wishlist) =>
          wishlist.id === wishlistId
            ? {
                ...wishlist,
                items: [
                  ...(wishlist.items || []),
                  { id: newItem.id, ...itemData },
                ],
              }
            : wishlist
        ),
      }));
    } catch (error) {
      console.error("Error adding item:", error);
    }
  },

  deleteWishlist: async (userId, wishlistId) => {
    try {
      await deleteWishlist(userId, wishlistId);
      set((state) => ({
        wishlists: state.wishlists.filter(
          (wishlist) => wishlist.id !== wishlistId
        ),
      }));
    } catch (error) {
      console.error("Error deleting wishlist:", error);
    }
  },

  deleteItem: async (userId, wishlistId, itemId) => {
    try {
      await deleteItem(userId, wishlistId, itemId);
      set((state) => ({
        wishlists: state.wishlists.map((wishlist) =>
          wishlist.id === wishlistId
            ? {
                ...wishlist,
                items: wishlist.items.filter((item) => item.id !== itemId),
              }
            : wishlist
        ),
      }));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  },

  uploadImage: async (file, userId, wishlistId) => {
    try {
      const imageUrl = await uploadImageService(file, userId, wishlistId);
      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  },
}));
