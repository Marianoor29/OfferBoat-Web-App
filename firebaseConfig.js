// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

// Your Firebase config object
const firebaseConfig = {
    apiKey: "AIzaSyARDiLS2HWcnvPB15M87l-8uLgu2KqKdNk",
    authDomain: "offerboat-54082.firebaseapp.com",
    projectId: "offerboat-54082",
    storageBucket: "offerboat-54082.appspot.com",
    messagingSenderId: "455920054389",
    appId: "1:455920054389:web:42412f8348439d2ac6083c",
    measurementId: "G-TNZJEY2DJZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Only initialize messaging if running in a browser
let messaging;
if (typeof window !== 'undefined') {
    messaging = getMessaging(app);
}

export { app, messaging };
