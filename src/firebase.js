
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_KEY,
    authDomain: "assetmanagement-ee5ec.firebaseapp.com",
    projectId: "assetmanagement-ee5ec",
    storageBucket: "assetmanagement-ee5ec.appspot.com",
    messagingSenderId: "681001200551",
    appId: "1:681001200551:web:dcbeeea14cd1eb06aa6482",
    measurementId: "G-G6CXZHSNXP"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth()
const analytics = getAnalytics(app);