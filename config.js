import firebase from "firebase";
var firebaseConfig = {
  apiKey: "AIzaSyAXVnvpQ81A67NK_heatmvkgojxjf3z0H8",
  authDomain: "smallpaw-5248b.firebaseapp.com",
  databaseURL: "https://smallpaw-5248b.firebaseio.com",
  projectId: "smallpaw-5248b",
  storageBucket: "smallpaw-5248b.appspot.com",
  messagingSenderId: "494857074681",
  appId: "1:494857074681:web:4b1daf3b568cd15cb32f28",
  measurementId: "G-KB416W51KH",
};

const firebaseKeys = firebase.initializeApp(firebaseConfig);

export default firebaseKeys;
