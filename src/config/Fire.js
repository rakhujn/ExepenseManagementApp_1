import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyCdRWr2QM8rs3OBVhkxU-pBl6qz-Samrvk",
    authDomain: "expensetracker-a9e54.firebaseapp.com",
    projectId: "expensetracker-a9e54",
    storageBucket: "expensetracker-a9e54.appspot.com",
    messagingSenderId: "271853384461",
    appId: "1:271853384461:web:e26138ce4ad573fe6bf644",
    measurementId: "G-HCSGXHN5MX"
}

const fire = firebase.initializeApp(config);
export default fire;