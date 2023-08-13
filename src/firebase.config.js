// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCTt3dqheEsCMHhwA8sHaF_PF2678Fqe2Y",
  authDomain: "note-assignment.firebaseapp.com",
  projectId: "note-assignment",
  storageBucket: "note-assignment.appspot.com",
  messagingSenderId: "711064752969",
  appId: "1:711064752969:web:e9669b46ea02b216870098",
  measurementId: "G-DVNCG3YFPT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = await getFirestore(app);
export {app , db};