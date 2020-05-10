import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var firebaseConfig = {
    apiKey: "AIzaSyBK2RYnSCIHJWPbvRkx7I0deanBe-QqtZ8",
    authDomain: "react-chat-app-8275d.firebaseapp.com",
    databaseURL: "https://react-chat-app-8275d.firebaseio.com",
    projectId: "react-chat-app-8275d",
    storageBucket: "react-chat-app-8275d.appspot.com",
    messagingSenderId: "44944139422",
    appId: "1:44944139422:web:c8ffc09240a7ba728d478f",
    measurementId: "G-ZX7CC58PE8"
  };

  firebase.initializeApp(firebaseConfig);

  export default firebase;