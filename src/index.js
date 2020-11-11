import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import {BrowserRouter as Router} from 'react-router-dom';
import Data from './data.json';

//import and configure firebase here
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth'; 


var firebaseConfig = {
    apiKey: "AIzaSyDy7aauMjZK0xTCFQ2LYCSX0fU_E1bIUF0",
    authDomain: "package-tracker-2b88f.firebaseapp.com",
    databaseURL: "https://package-tracker-2b88f.firebaseio.com",
    projectId: "package-tracker-2b88f",
    storageBucket: "package-tracker-2b88f.appspot.com",
    messagingSenderId: "222840848012",
    appId: "1:222840848012:web:10dbc35fd89e59b1f105a9",
    measurementId: "G-7CDHSJ3JSR"
  };
  // Initialize Firebase

  firebase.initializeApp(firebaseConfig);

ReactDOM.render(<Router><App dat = {Data}/></Router>,document.getElementById('root'));
