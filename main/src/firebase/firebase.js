// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, browserSessionPersistence } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyClZrXGoE95zvdI6WsPu5WvrxeogpJKUpI",
  authDomain: "reservationsystem-8036b.firebaseapp.com",
  databaseURL:
    "https://reservationsystem-8036b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "reservationsystem-8036b",
  storageBucket: "reservationsystem-8036b.appspot.com",
  messagingSenderId: "265268094180",
  appId: "1:265268094180:web:9ab8a1b456196adf9338f1",
  measurementId: "G-2TYEPV97GR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
auth.setPersistence(browserSessionPersistence);
export { db, auth };
