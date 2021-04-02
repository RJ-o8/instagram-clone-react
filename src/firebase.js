// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from 'firebase';


const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBzf1XKoWN98qNJKYXC_oyDUSzOtfPJ608",
    authDomain: "instagram-clone-e4bff.firebaseapp.com",
    projectId: "instagram-clone-e4bff",
    storageBucket: "instagram-clone-e4bff.appspot.com",
    messagingSenderId: "1021554090387",
    appId: "1:1021554090387:web:302898b8b163f025128866",
    measurementId: "G-5TEHT68FL3"
  });

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db,auth,storage};