import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/login_page.css';
import logo from '../assets/logo.svg';

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const login = (e) => {
    e.preventDefault();
    axios.post("http://171.244.16.229:8092/api/users/sign_in", {
      username: username,
      password: password
    }).then(function(response) {
      console.log('Login response access token', response.data.accessToken);
      localStorage.setItem('token', response.data.accessToken);
      navigate('/');
      window.location.reload();
    }).catch(function(err) {
      console.log('Login failed');
      setError('Wrong username or password');
    });
  };

  return (
    <div className="bodyWrap" style={{ left: '145px' }}>
    <div className="contentLoginWrap">
      <div className="loginSide">
        <div className="loginWrap">
          <h1>Log in</h1>
          <div className="input-group">
            <input type="text" className="input" onChange={e => setUsername(e.target.value)} required="required"/>
            <label className={`${username.length > 0 ? "focusLabel" : ""}`}>Login</label>
          </div>
          <div className="input-group">
            <input type="text" className="input password" onChange={e => setPassword(e.target.value)} required="required"/>
            <label className={`${password.length > 0 ? "focusLabel" : ""}`}>Password</label>
          </div>
          <button onClick={login}>Login</button>
        </div>
      </div>
      <div className="infoSide">
        <div className="loginWrap">
          <h2>Hello again!</h2>
          <p>Log in to your account to get access to app.</p>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Login;
