import React, { useState } from 'react';
import './login.css';
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const proceedLogin = (e) => {
    e.preventDefault();

    const loginData = { username, password };

    if (validate()) {
      fetch("https://ieltslisazaloapp.azurewebsites.net/Admin/LoginAuth?username=" + username + '&password=' + password, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      }).then((res) => res.json())
        .then((resp) => {
          if (resp.token) {
            sessionStorage.setItem('token', resp.token); // Store the token correctly
            navigate('/'); // Redirect after successful login
            toast.success('Login success');
          } else {
            toast.warning(resp.msg || 'Login failed, please try again.');
          }
        }).catch((err) => {
          toast.error('Login failed. Please try again.');
          console.error('Login error:', err); // Improved logging for errors
        });
    } else {
      toast.error('Please fill in all fields.');
    }
  };

  const validate = () => {
    return username && password;
  };

  return (
    <div className='background'>
      <video autoPlay loop muted>
        <source src="/assets/cliplogin.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className='wrapper'>
        <h1>Login</h1>
        <form onSubmit={proceedLogin}>
          <div className="input-login-box">
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder='Username' required />
            <FaUser className='icon' />
          </div>
          <div className="input-login-box">
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder='Password' required />
            <FaLock className='icon' />
          </div>
          <button className='login-submit' type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
