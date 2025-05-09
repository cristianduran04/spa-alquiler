// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBKghYzNTDRIz3ua7xC-ThjY66pzCnNSqw",
  authDomain: "spa-proye.firebaseapp.com",
  projectId: "spa-proye",
  storageBucket: "spa-proye.firebasestorage.app",
  messagingSenderId: "414186685545",
  appId: "1:414186685545:web:b823978467cb02b4280ef8",
  measurementId: "G-NVGXS36JSW"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta Firestore
export const db = getFirestore(app);
