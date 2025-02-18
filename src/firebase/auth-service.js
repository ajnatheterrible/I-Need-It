import { auth } from "./firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useAuthStore } from "../store/auth-store";

export const initializeAuthListener = () => {
  const setUser = useAuthStore.getState().setUser; // Zustand's setUser
  const setLoading = useAuthStore.getState().setLoading;

  onAuthStateChanged(auth, (user) => {
    setUser(user); // Update Zustand with the current user (or null)
    setLoading(false); // Stop loading after we have the auth state
  });
};

// Function to sign up a user
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Function to sign in a user
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Function to sign out a user
export const logout = async () => {
  const clearUser = useAuthStore.getState().clearUser; // Zustand's clearUser
  try {
    await signOut(auth);
    clearUser(); // Clear the user from Zustand
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

// Function to sign in with Google
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    throw error;
  }
};

// Function to listen for authentication state changes
export const authStateListener = (callback) => {
  return onAuthStateChanged(auth, callback);
};
