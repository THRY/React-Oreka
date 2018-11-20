import firebase from "firebase/app";
import "firebase/auth";
import 'firebase/firestore';

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

export const signUp = (email, password, callback) => {
  firebase.auth().createUserWithEmailAndPassword(email, password).then(function() {
    callback();
  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
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
    onError(errorMessage);
  });
}

export const signOut = (callback) => {
  firebase.auth().signOut().then(function() {
    console.log("Signout successfull");
    callback();
  }).catch(function(error) {
    console.log("Signout error");
  });
}