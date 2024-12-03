import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const MedicineForm = () => {
  const navigate = useNavigate();
  const [medicine, setMedicine] = useState({
    name: '',
    manufacturingDate: '',
    expiryDate: '',
    phoneNumber: '',
    notificationTimes: [{ time: '', period: 'AM' }]
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      alert('You are not logged in. Please log in first.');
      return;
    }

    setLoading(false);
  }, [navigate]);

  const handleChange = (e) => {
    setMedicine({
      ...medicine,
      [e.target.name]: e.target.value
    });
  };

  const handleNotificationTimeChange = (index, field, value) => {
    const newNotificationTimes = medicine.notificationTimes.map((notification, i) =>
      i === index ? { ...notification, [field]: value } : notification
    );
    setMedicine({
      ...medicine,
      notificationTimes: newNotificationTimes
    });
  };

  const handleAddNotificationTime = () => {
    if (medicine.notificationTimes.length < 4) {
      setMedicine({
        ...medicine,
        notificationTimes: [...medicine.notificationTimes, { time: '', period: 'AM' }]
      });
    }
  };

  const handleDeleteNotificationTime = (index) => {
    const newNotificationTimes = medicine.notificationTimes.filter((_, i) => i !== index);
    setMedicine({
      ...medicine,
      notificationTimes: newNotificationTimes
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post('https://medease-project-backend.onrender.com/api/medicines', medicine, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Medicine added successfully');
      setMedicine({
        name: '',
        manufacturingDate: '',
        expiryDate: '',
        phoneNumber: '',
        notificationTimes: [{ time: '', period: 'AM' }]
      });
    } catch (error) {
      alert('Error adding medicine');
    }
  };

  if (loading) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="card shadow-lg p-4">
          <h2 className="text-center text-primary mb-4">Add New Medicine</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="name" className="form-label">Medicine Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                placeholder="Enter medicine name"
                value={medicine.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="manufacturingDate" className="form-label">Manufacturing Date</label>
              <input
                type="date"
                id="manufacturingDate"
                name="manufacturingDate"
                className="form-control"
                value={medicine.manufacturingDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="expiryDate" className="form-label">Expiry Date</label>
              <input
                type="date"
                id="expiryDate"
                name="expiryDate"
                className="form-control"
                value={medicine.expiryDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                className="form-control"
                placeholder="Enter phone number"
                value={medicine.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
            {medicine.notificationTimes.map((notification, index) => (
              <div className="form-group mb-3" key={index}>
                <label className="form-label">Notification Time {index + 1}</label>
                <div className="input-group">
                  <input
                    type="time"
                    className="form-control"
                    value={notification.time}
                    onChange={(e) => handleNotificationTimeChange(index, 'time', e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => handleDeleteNotificationTime(index)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {medicine.notificationTimes.length < 4 && (
              <button
                type="button"
                className="btn btn-outline-secondary w-100 mb-3"
                onClick={handleAddNotificationTime}
              >
                Add Another Notification Time
              </button>
            )}
            <button type="submit" className="btn btn-primary w-100">Add Medicine</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default MedicineForm;
