import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; 

const firebaseConfig = {
    apiKey: "AIzaSyCzk7lLo7VV15GgJ0w4E53cxqOsdJ1OqbQ",
    authDomain: "react-4a783.firebaseapp.com",
    projectId: "react-4a783",
    storageBucket: "react-4a783.appspot.com",
    messagingSenderId: "718876109425",
    appId: "1:718876109425:web:645b281b00115906c5c9d0",
    measurementId: "G-HV9XDM1WZF"
  };

  const firebaseApp = initializeApp(firebaseConfig);

  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);

  export { db, auth }; 