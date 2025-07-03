/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import firebase from '@react-native-firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyD--CPBI3XVZQJ2sN7jFnjS8n0dgTbxqCg",
  authDomain: "simplemoneymanager.firebaseapp.com",
  projectId: "simplemoneymanager",
  storageBucket: "simplemoneymanager.firebaseapp.com", // Catatan: Ada typo di gambar (firebaseapp.com), seharusnya firebasestorage.appspot.com
  messagingSenderId: "682401895537",
  appId: "1:682401895537:web:7a62b10ce0ffa5e6cab7d0"
}

if (!firebase.apps.length) {
  firebase.initializeApp({firebaseConfig});
  console.log('Firebase initialized successfully from index.js!'); // Tambahkan log untuk konfirmasi
} else {
  console.log('Firebase already initialized (from index.js).');
}

AppRegistry.registerComponent(appName, () => App);
