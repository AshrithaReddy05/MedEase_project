import React from 'react';
import { Link, useNavigate } from 'react-router-dom';  // Import useNavigate for redirection

import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  const navigate = useNavigate(); // For programmatic navigation

  const handleLogout = () => {
    // Remove the token from localStorage to log out the user
    localStorage.removeItem('token');

    // Redirect to the login page
    navigate('/login'); // Adjust the path based on your route setup
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light-blue">
      <Link className="navbar-brand" to="#">MediChrono</Link>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/add-medicine">Add Medicine</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/view-medicines">View Medicines</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/summary">Report Analysis</Link>
          </li>
        </ul>

        {/* Move Logout button to the right */}
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <button className="btn btn-primary" onClick={handleLogout}> {/* Blue color (btn-primary) */}
              Logout
            </button>
          </li>
        </ul>
      </div>

      <style jsx>{`
        .navbar {
          background-color: #ADD8E6;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
        }

        .navbar-brand {
          font-size: 1.75rem;
          font-weight: bold;
        }

        .nav-link {
          font-size: 1.2rem;
          padding: 0.5rem 1rem;
        }

        .nav-link:hover {
          color: #f8f9fa !important;
          background-color: #0056b3 !important;
        }

        .navbar-toggler {
          border: none;
        }

        .btn-primary { /* Change the button color to blue */
          font-size: 1rem;
          margin-left: 1rem;
        }

        /* Use ml-auto to push the Logout button to the right */
        .navbar-nav.ml-auto {
          margin-left: auto;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
