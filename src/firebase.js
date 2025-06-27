import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB60NwnSMyj6mVidam8FIOysUG09nJGq-Q",
  authDomain: "task-manager-app-b7679.firebaseapp.com",
  projectId: "task-manager-app-b7679",
  storageBucket: "task-manager-app-b7679.firebasestorage.app",
  messagingSenderId: "651012176375",
  appId: "1:651012176375:web:4ca89581b0219a3e6756f2",
  measurementId: "G-9Y28C377LL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
