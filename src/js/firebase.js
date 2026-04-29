import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Konfigurasi asli dari Firebase Console kamu
const firebaseConfig = {
  apiKey: "AIzaSyBQ168sl6feOZKLaqDC97C6Dxj9uwZhjwU",
  authDomain: "travel-in-9adaf.firebaseapp.com",
  projectId: "travel-in-9adaf",
  storageBucket: "travel-in-9adaf.firebasestorage.app",
  messagingSenderId: "10436202001",
  appId: "1:10436202001:web:7d55a9293953bd0a6b2bb0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Inisialisasi Auth (untuk Login) dan Firestore (untuk Database)
const auth = getAuth(app);
const db = getFirestore(app);

// EXPORT biar bisa dipanggil di file app.js
export { auth, db };