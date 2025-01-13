// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBg9tn2LFUsrqF7mA60SAoTx0Z6NGG67Ao",
  authDomain: "educonnect-cc78d.firebaseapp.com",
  projectId: "educonnect-cc78d",
  storageBucket: "educonnect-cc78d.firebasestorage.app",
  messagingSenderId: "59438689496",
  appId: "1:59438689496:web:acee047f4a6d551ef5bbad",
  measurementId: "G-4KG40M0JZW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
