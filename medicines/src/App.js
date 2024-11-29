import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import Navbar from './Components/Navbar';
import SignUp from './Components/SignUp';
import Login from './Components/Login';
import Home from './Components/Home'; 
import MedicineForm from './Components/MedicineForm';
import Summary from './Components/Summary';
import ViewMedicines from './Components/MedicineList';

// 404 Not Found Component
const NotFound = () => {
  return (
    <div className="text-center mt-5">
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <p>Redirect to <Link to="/">Home</Link></p> {/* Link to Home page */}
    </div>
  );
};

const App = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = decode(token);
      setUserId(decodedToken.userId);
    }
  }, []);

  const decode = (token) => {
    try {
      const [, payload] = token.split('.');
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = atob(base64);
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    setUserId(null); // Clear userId
    window.location.href = '/login'; // Redirect to login
  };

  return (
    <Router>
      <div>
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/add-medicine" element={<MedicineForm />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/view-medicines" element={<ViewMedicines />} />
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
