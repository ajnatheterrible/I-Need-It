import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "i-need-it-94a36.firebaseapp.com",
  projectId: "i-need-it-94a36",
  storageBucket: "i-need-it-94a36.firebasestorage.app",
  messagingSenderId: "115239461847",
  appId: "1:115239461847:web:830467fd8da7befa13e192",
  measurementId: "G-X7Z90JD689",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
export default app;
