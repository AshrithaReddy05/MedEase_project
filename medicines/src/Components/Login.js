import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const response = await axios.post('https://medease-project-backend.onrender.com/api/login', {
        email,
        password,
      });

      if (response.status === 200) {
        // Assuming the JWT token is sent in the response body
        const { token } = response.data;

        // Store JWT in localStorage (you can also use sessionStorage or cookies)
        localStorage.setItem('token', token);

        // Redirect to the 'add-medicine' page after successful login
        navigate('/add-medicine');
      } else {
        alert('Login failed: ' + response.data.message);
      }
    } catch (error) {
      setError('An error occurred while logging in.');
      console.error(error);
    }
  };

  const handleSignUpRedirect = () => {
    navigate('/register');
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4 text-primary">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
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
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <div className="text-center mt-3">
          <p>Don't have an account?</p>
          <button 
            type="button" 
            className="btn btn-link" 
            onClick={handleSignUpRedirect}
          >
            Sign Up
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

export default Login;
