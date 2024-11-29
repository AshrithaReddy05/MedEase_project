import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/register', {
        username,
        email,
        password,
      });

      if (response.status === 201) {
        console.log('username :' + username + " email " + email);
        navigate('/');
      } else {
        alert('Registration failed: ' + response.data.message);
      }
    } catch (error) {
      alert('An error occurred while registering.');
      console.error(error);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4 text-primary">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Register</button>
        </form>
        <div className="text-center mt-3">
          <p>Already a user?</p>
          <button
            type="button"
            className="btn btn-link"
            onClick={handleLoginRedirect}
          >
            Login
          </button>
        </div>
      </div>
      <style jsx>{`
        .container {
          background-color: #f8f9fa;
        }
        .card {
          border-radius: 0.5rem;
        }
        .form-group label {
          font-weight: 500;
        }
        .btn-primary {
          background-color: #007bff;
          border: none;
        }
        .btn-link {
          color: #007bff;
          text-decoration: underline;
          cursor: pointer;
        }
        .btn-link:hover {
          text-decoration: none;
        }
      `}</style>
    </div>
  );
};

export default SignUp;
