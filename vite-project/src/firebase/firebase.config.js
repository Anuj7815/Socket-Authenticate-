import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAdXawI9pqKo0LQ4BSFc8JTgUh3NtbPbfw",
    authDomain: "fir-login-f5032.firebaseapp.com",
    projectId: "fir-login-f5032",
    storageBucket: "fir-login-f5032.firebasestorage.app",
    messagingSenderId: "1032190561471",
    appId: "1:1032190561471:web:e5f3c801910403de174a0a",
    measurementId: "G-PTPPJ1FK04",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };

export default app;
