import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCE7xZeFoavxdwAo5aiYq0Fkdx8XEGk7uE",
  authDomain: "charity-app-f2b04.firebaseapp.com",
  projectId: "charity-app-f2b04",
  storageBucket: "charity-app-f2b04.appspot.com",
  messagingSenderId: "1057236028951",
  appId: "1:1057236028951:web:be47c0f35aa6035b665652"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };