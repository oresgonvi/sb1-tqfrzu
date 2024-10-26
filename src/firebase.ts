import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "liga-recreos.firebaseapp.com",
  databaseURL: "https://liga-recreos-default-rtdb.firebaseio.com",
  projectId: "liga-recreos",
  storageBucket: "liga-recreos.appspot.com",
  messagingSenderId: "XXXXXXXXXXXX",
  appId: "1:XXXXXXXXXXXX:web:XXXXXXXXXXXXXXXXXXXXXXXX"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);