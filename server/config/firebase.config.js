// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASAAbObievOck0hn4CtfnuHRR79-EQ_Nc",
  authDomain: "flexperience.firebaseapp.com",
  projectId: "flexperience",
  storageBucket: "flexperience.appspot.com",
  messagingSenderId: "135235188919",
  appId: "1:135235188919:web:8a662d3a25b9c57853b532",
  measurementId: "G-1KCE3J044G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);