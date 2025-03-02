import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './assets/Styles/index.css';
import App from './App';
import { AuthLogin } from './AuthComponents/AuthLogin';

ReactDOM.render(
  <AuthLogin>
    <App />
  </AuthLogin>
    ,document.getElementById('root'));
