/* eslint-disable import/no-extraneous-dependencies */
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAtMLfW-MzL-cmCJDjfQ8stK0J9suTMp94',
  authDomain: 'chat-web-app-50955.firebaseapp.com',
  projectId: 'chat-web-app-50955',
  storageBucket: 'chat-web-app-50955.appspot.com',
  messagingSenderId: '37683637791',
  appId: '1:37683637791:web:fbd318ea0667f39799ef2a',
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const auth = app.auth();
export const database = app.database();
export const storage = app.storage();
