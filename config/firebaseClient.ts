import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

//TEMP CONFIG
//TODO: make environment variables
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDXiX9uYNHVvecgq2gUbV4KLUgqQg7EHaA",
  authDomain: "quesdom-5bf6a.firebaseapp.com",
  projectId: "quesdom-5bf6a",
  storageBucket: "quesdom-5bf6a.appspot.com",
  messagingSenderId: "1055374711990",
  appId: "1:1055374711990:web:7e5a03551b7c33c61d1a17",
};

//Checks if firebase is already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(FIREBASE_CONFIG);
}

console.log("Firebase initialized");

const app = firebase.app();
const db = firebase.firestore();
const auth = firebase.auth();

export { auth, db };
