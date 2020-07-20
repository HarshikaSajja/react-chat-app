import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var firebaseConfig = {
    apiKey: "<apiKey>",
    authDomain: "<authDomain>",
    databaseURL: "<databaseURL>",
    projectId: "<projectId>",
    storageBucket: "<storageBucket>",
    messagingSenderId: "<messagingSenderId>",
    appId: "<appId>",
    measurementId: "<measurementId>"
  };

  firebase.initializeApp(firebaseConfig);

  export default firebase;