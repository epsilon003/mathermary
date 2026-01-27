// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDef_4Dq31F7VtC9FfgxelVYCXlHR2K_vE",
  authDomain: "mathventures-ecd30.firebaseapp.com",
  projectId: "mathventures-ecd30",
  storageBucket: "mathventures-ecd30.firebasestorage.app",
  messagingSenderId: "1047692077774",
  appId: "1:1047692077774:web:0dac496782c4f204d2fe9f"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();

console.log('Firebase initialized successfully');