import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// SUBSTITUA OS "..." PELOS DADOS QUE O FIREBASE TE DEU NO PASSO 1
const firebaseConfig = {
  apiKey: "AIzaSyDur7zaMLpDAN5D3uiG098qdVP-SouY3Ts",
  authDomain: "other-eyes-app.firebaseapp.com",
  projectId: "other-eyes-app",
  storageBucket: "other-eyes-app.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
