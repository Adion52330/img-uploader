// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCkb0xQUr6lObbq6oZY_thD1oCnyWkstCo",
  authDomain: "img-uploader-45692.firebaseapp.com",
  projectId: "img-uploader-45692",
  storageBucket: "img-uploader-45692.appspot.com",
  messagingSenderId: "554853873677",
  appId: "1:554853873677:web:6a861eb7b1f00072cfbd44"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export default storage;