
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { toast } from "react-toastify";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSpvddWE7tKV6wqYrpmltvROtFNSk3xL0",
  authDomain: "netflix-clone-65a45.firebaseapp.com",
  projectId: "netflix-clone-65a45",
  storageBucket: "netflix-clone-65a45.firebasestorage.app",
  messagingSenderId: "506368602413",
  appId: "1:506368602413:web:16afe606695fe459bf63a4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Rate limiting variables
let isProcessing = false;
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2000; // 2 seconds between requests

const signup = async(name, email, password) => {
    // Rate limiting check
    if (isProcessing) {
        toast.warning("Please wait a moment before trying again");
        return;
    }
    
    const now = Date.now();
    if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
        toast.warning("Please wait 2 seconds before trying again");
        return;
    }
    
    isProcessing = true;
    lastRequestTime = now;
    
    try {
       const res = await createUserWithEmailAndPassword(auth, email, password);
       const user = res.user;
       await addDoc(collection(db, "user"), {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
       });
       toast.success("Registration successful!");
    } catch (error) {
        console.log(error);
        let errorMessage = "An error occurred during registration";
        
        switch(error.code) {
            case 'auth/email-already-in-use':
                errorMessage = "Email is already in use";
                break;
            case 'auth/weak-password':
                errorMessage = "Password is too weak (minimum 6 characters)";
                break;
            case 'auth/invalid-email':
                errorMessage = "Invalid email address";
                break;
            case 'auth/too-many-requests':
                errorMessage = "Too many requests. Please wait 5 minutes before trying again";
                break;
            default:
                errorMessage = error.message;
        }
        
        toast.error(errorMessage);
    } finally {
        isProcessing = false;
    }
}

const login = async (email, password) => {
    // Rate limiting check
    if (isProcessing) {
        toast.warning("Please wait a moment before trying again");
        return;
    }
    
    
    try {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Login successful!");
    } catch (error) {
        console.log(error);
        let errorMessage = "An error occurred during login";
        
        switch(error.code) {
            case 'auth/user-not-found':
                errorMessage = "No account found with this email";
                break;
            case 'auth/wrong-password':
                errorMessage = "Incorrect password";
                break;
            case 'auth/invalid-email':
                errorMessage = "Invalid email address";
                break;
            case 'auth/too-many-requests':
                errorMessage = "Too many requests. Please wait 5 minutes before trying again";
                break;
            default:
                errorMessage = error.message;
        }
        
        toast.error(errorMessage);
    } finally {
        isProcessing = false;
    }
}

const logout = () => {
    try {
        signOut(auth);
        toast.success("Logout successful!");
    } catch (error) {
        console.log(error);
        toast.error("Error during logout");
    }
}

export {auth, db, login, signup, logout}