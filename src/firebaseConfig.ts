import * as firebase from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

//config to connect to firestore database
const firebaseConfig={
    apiKey: "AIzaSyCHzYKSfA0fZXMLT5s6DZJSkwPw-DrmPFc",
    authDomain: "vozz1-ce312.firebaseapp.com",
    projectId: "vozz1-ce312",
    storageBucket: "vozz1-ce312.appspot.com",
    messagingSenderId: "1076365253821",
    appId: "1:1076365253821:web:39b8180ac010edfb026bd4",
    measurementId: "G-FRPF7DLJDB",
}
const app = initializeApp(firebaseConfig);
const firebaseApp=firebase.initializeApp(firebaseConfig);
const firebaseDb = getFirestore(firebaseApp);

export { firebaseApp, firebaseDb, app };