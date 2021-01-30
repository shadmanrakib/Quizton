import firebase from 'firebase';
import 'firebase/auth';
// import 'firebase/firestore'
// import 'firebase/storage';

// TEMP CONFIG 
// Todo: make environment variables
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyDXiX9uYNHVvecgq2gUbV4KLUgqQg7EHaA",
    authDomain: "quesdom-5bf6a.firebaseapp.com",
    projectId: "quesdom-5bf6a",
    storageBucket: "quesdom-5bf6a.appspot.com",
    messagingSenderId: "1055374711990",
    appId: "1:1055374711990:web:7e5a03551b7c33c61d1a17"
};

if (!firebase.apps.length) {
    firebase.initializeApp(FIREBASE_CONFIG);
}

const app = firebase.app();
const auth = firebase.auth();

export { auth }