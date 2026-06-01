import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDb9art3veWRKneq3PBx0L_JoBjGxu92Io",
  authDomain: "cekcustomer.firebaseapp.com",
  projectId: "cekcustomer",
  storageBucket: "cekcustomer.firebasestorage.app",
  messagingSenderId: "1025586940339",
  appId: "1:1025586940339:web:386ab6bcb2870c462a63c6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
