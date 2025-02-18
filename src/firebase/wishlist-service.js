import { db, storage } from "./firebase-config";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const createWishlist = async (userId, wishlistName) => {
  try {
    const wishlistRef = collection(db, "users", userId, "wishlists");
    const newWishlist = await addDoc(wishlistRef, {
      name: wishlistName,
      createdAt: new Date(),
    });
    return newWishlist.id;
  } catch (error) {
    console.error("Error creating wishlist:", error);
    throw error;
  }
};

export const addItemToWishlist = async (userId, wishlistId, itemData) => {
  try {
    console.log("🔍 Attempting to add item to Firestore...");
    console.log("User ID:", userId);
    console.log("Wishlist ID:", wishlistId);
    console.log("Item Data:", itemData);

    const itemsRef = collection(
      db,
      "users",
      userId,
      "wishlists",
      wishlistId,
      "items"
    );

    const newItem = await addDoc(itemsRef, {
      ...itemData,
      createdAt: new Date(),
    });

    console.log("✅ Item successfully added! Firestore ID:", newItem.id);
    return { id: newItem.id, ...itemData };
  } catch (error) {
    console.error("❌ Error adding item:", error);
    throw error;
  }
};

export const getWishlists = async (userId) => {
  try {
    const wishlistRef = collection(db, "users", userId, "wishlists");
    const snapshot = await getDocs(wishlistRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching wishlists:", error);
    throw error;
  }
};

export const getItemsInWishlist = async (userId, wishlistId) => {
  try {
    const itemsRef = collection(
      db,
      "users",
      userId,
      "wishlists",
      wishlistId,
      "items"
    );
    const snapshot = await getDocs(itemsRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const deleteWishlist = async (userId, wishlistId) => {
  try {
    await deleteDoc(doc(db, `users/${userId}/wishlists`, wishlistId));
    console.log(`Wishlist ${wishlistId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting wishlist:", error);
    throw error;
  }
};

export const deleteItem = async (userId, wishlistId, itemId) => {
  try {
    await deleteDoc(
      doc(db, `users/${userId}/wishlists/${wishlistId}/items`, itemId)
    );
    console.log(`Item ${itemId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
};

export const uploadImageService = async (file, userId, wishlistId) => {
  if (!file) return null;

  const sanitizedFileName = file.name.trim().replace(/[^a-zA-Z0-9_.-]/g, "_");

  const imageRef = ref(
    storage,
    `users/${userId}/wishlists/${wishlistId}/${sanitizedFileName}`
  );

  await uploadBytes(imageRef, file);
  const downloadURL = await getDownloadURL(imageRef);
  return downloadURL;
};
