import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/login_page.css';
import logo from '../assets/logo.svg';

const Login = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://171.244.16.229:8092/api/users/sign_in", {
      username: userName,
      password: password
    }).then(function(response) {
      console.log('Login response access token', response.data.accessToken);
      localStorage.setItem('token', response.data.accessToken);
      navigate('/');
    }).catch(function(err) {
      console.log('Login failed');
      setError('Wrong username or password');
    });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4">
        <div className="text-center mb-4">
          <img src={logo} alt="App Logo" className="logo-img" />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userName">Username</label>
            <input
              type="text"
              className="form-control"
              id="userName"
              placeholder="Enter username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          <button type="submit" className="btn btn-primary btn-block mt-3">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
