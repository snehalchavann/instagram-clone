// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDb_MJ_p7DePVEuDqdW_faOJIiUUytiKaQ",
  authDomain: "instagram-clone-cb1d2.firebaseapp.com",
  projectId: "instagram-clone-cb1d2",
  storageBucket: "instagram-clone-cb1d2.appspot.com",
  messagingSenderId: "69092117181",
  appId: "1:69092117181:web:342cb2d00025927443c5d4"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export {app, db, storage};