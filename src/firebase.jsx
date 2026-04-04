import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// --- REPLACE THE VALUES BELOW WITH THE ONES FROM YOUR FIREBASE CONSOLE ---
const firebaseConfig = {
  apiKey: "AIzaSyAGapqnCWHt7jaI98eULpuvgDn4hKCJibo",
  authDomain: "nirantar-dbfae.firebaseapp.com",
  projectId: "nirantar-dbfae",
  storageBucket: "nirantar-dbfae.appspot.com",
  messagingSenderId: "618713558761", // Found in your Cloud Messaging settings
  appId: "1:618713558761:web:461c193a898c5d6decca78"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export ONLY the Database (Firestore)
// This remains on the free Spark plan and bypasses your billing error [OR_BACR2_44]
export const db = getFirestore(app);