import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const ViewMedicines = () => {
    const navigate = useNavigate();
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');

        // If no token is found, redirect to '/' and display an alert
        if (!token) {
            navigate('/login');
            alert('You are not logged in. Please log in first.');
            return;
        }

        const fetchMedicines = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/medicines', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMedicines(response.data);
            } catch (error) {
                alert('Failed to fetch medicines. Please log in again.');
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        fetchMedicines();
    }, [navigate]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this medicine?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/medicines/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMedicines(medicines.filter((medicine) => medicine._id !== id));
                alert('Medicine deleted successfully.');
            } catch (error) {
                alert('Failed to delete medicine. Please try again.');
            }
        }
    };

    // Prevent UI rendering until the token check is complete
    if (loading) {
        return null; // Render nothing while loading
    }

    return (
        <>
            <Navbar />
            <div className="container mt-4">
                <h2 className="text-center mb-4">Your Medicines</h2>

                {medicines.length === 0 ? (
                    <p className="text-center">No medicines found. Add some to get started!</p>
                ) : (
                    <table className="table table-hover table-bordered">
                        <thead className="thead-dark">
                            <tr>
                                <th>Name</th>
                                <th>Manufacturing Date</th>
                                <th>Expiry Date</th>
                                <th>Phone Number</th>
                                <th>Notification Times</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicines.map((medicine) => (
                                <tr key={medicine._id}>
                                    <td>{medicine.name}</td>
                                    <td>{new Date(medicine.manufacturingDate).toLocaleDateString()}</td>
                                    <td>{new Date(medicine.expiryDate).toLocaleDateString()}</td>
                                    <td>{medicine.phoneNumber}</td>
                                    <td>
                                        {medicine.notificationTimes.length > 0 ? (
                                            medicine.notificationTimes.map((notification, index) => (
                                                <div key={index}>
                                                    {notification.time} {notification.period}
                                                </div>
                                            ))
                                        ) : (
                                            <span>No notifications set</span>
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(medicine._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
};

export default ViewMedicines;
