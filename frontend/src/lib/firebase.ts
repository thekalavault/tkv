import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, browserSessionPersistence, setPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKey-ForDevelopmentUseOnly",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "kalavault-dev.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "kalavault-dev",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "kalavault-dev.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Set persistence to session so different tabs can run as different instances
setPersistence(auth, browserSessionPersistence).catch((error) => {
  console.error("Error setting session persistence:", error);
});

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
