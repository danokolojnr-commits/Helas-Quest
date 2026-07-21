import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "impactful-unity-9dw25",
  appId: "1:101016987852:web:824fb4a25ebbb7dc04fa69",
  apiKey: "AIzaSyBMMpnuGu_DgFcgzlGXfwQGrxo3tZ6c9GE",
  authDomain: "impactful-unity-9dw25.firebaseapp.com",
  storageBucket: "impactful-unity-9dw25.firebasestorage.app",
  messagingSenderId: "101016987852",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-eduquest-deb0e562-c26c-40ec-97d7-bf0739ca8d80");
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};
