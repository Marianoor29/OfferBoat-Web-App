import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyARDiLS2HWcnvPB15M87l-8uLgu2KqKdNk",
  authDomain: "offerboat-54082.firebaseapp.com",
  projectId: "offerboat-54082",
  storageBucket: "offerboat-54082.appspot.com",
  messagingSenderId: "455920054389",
  appId: "1:455920054389:web:42412f8348439d2ac6083c",
  measurementId: "G-TNZJEY2DJZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let messaging; 

// Initialize messaging only on the client
if (typeof window !== "undefined" && typeof navigator !== "undefined") {
  messaging = getMessaging(app);
}

export { app, auth, messaging };
