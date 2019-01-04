import firebase from "firebase/app";
import "firebase/auth";
import 'firebase/firestore';
import 'firebase/storage';


import config from "./config";

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  signInSuccessUrl: "/",
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ]
};

export const auth = firebase.auth();

export const db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
})

export const signUp = (email, password, onsignup, onfail) => {
  firebase.auth().createUserWithEmailAndPassword(email, password).then(function() {
    onsignup();
  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
    if(onfail) {
      onfail(errorMessage, errorCode);
    } 
  });
} 

export const logIn = (email, password, onSuccess, onError) => {
  firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
    onSuccess();
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
    onError(errorMessage, errorCode);
  });
}

export const storageRef = firebase.storage().ref();

export const signOut = (callback) => {
  firebase.auth().signOut().then(function() {
    console.log("Signout successfull");
    callback();
  }).catch(function(error) {
    console.log("Signout error");
  });
}