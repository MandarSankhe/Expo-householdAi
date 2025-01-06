import * as Google from 'expo-auth-session/providers/google';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB4GlxlKT8ny1MvyFRwK0t61AR1nLIhg94",
  authDomain: "household-ai-f2de9.firebaseapp.com",
  projectId: "household-ai-f2de9",
  storageBucket: "household-ai-f2de9.appspot.com",
  messagingSenderId: "841673147525",
  appId: "1:841673147525:android:64b74486675faa3fdd95ec",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;

