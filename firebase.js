import AsyncStorage from '@react-native-async-storage/async-storage';
// Import the functions you need from the SDKs you need
import * as firebase from "firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0zYGm05BeyQwhyeIvVYV2cLY082u_mbA",
  authDomain: "foodapp-f2cbb.firebaseapp.com",
  projectId: "foodapp-f2cbb",
  storageBucket: "foodapp-f2cbb.appspot.com",
  messagingSenderId: "968289374149",
  appId: "1:968289374149:web:854ac13cedbc4d5eaa45ac",
  measurementId: "G-KERN0LMYGF"
};

let app;
if(firebase.apps.length === 0){
    app = firebase.initializeApp(firebaseConfig)
}else{
app = firebase.app();
}


const auth =  firebase.auth();
const database = firebase.database();

export { auth, database };