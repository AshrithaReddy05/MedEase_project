


import React, { useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Navbar from './Navbar';
import './Summary.css'; // Import a custom CSS file for additional styling
import { useNavigate } from 'react-router-dom';

const Summary = () => {
  const [summarizedText, setSummarizedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageUploaded, setImageUploaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // To track authentication state

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setIsAuthenticated(false);  // User is not logged in
      navigate('/login');  // Redirect to login page
      alert('You are not logged in. Please log in first.');
    } else {
      setIsAuthenticated(true);  // User is logged in
    }
  }, [navigate]);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        setImageUploaded(true);
      } catch (error) {
        setError(error.message);
      }
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSummarizeClick = async () => {
    try {
      setIsLoading(true);
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput.files.length > 0) {
        const imageURL = URL.createObjectURL(fileInput.files[0]);
        const ocrText = await recognizeText(imageURL);
        const isMedical = await checkIfMedical(ocrText);
        if (isMedical) {
          const summary = await summarizeMedicalText(ocrText);
          setSummarizedText(summary);
          setError('');
        } else {
          setSummarizedText('');
          setError('Please provide only medical-related text.');
        }
      } else {
        setError('Please select an image file.');
      }
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  const recognizeText = async (imageURL) => {
    try {
      const { data: { text } } = await Tesseract.recognize(
        imageURL,
        'eng',
        { logger: m => console.log(m) }
      );
      return text;
    } catch (error) {
      console.error('Error:', error);
      throw new Error('An error occurred while recognizing text from the image.');
    }
  };

  const checkIfMedical = async (text) => {
    const API_KEY = "AIzaSyDHxAqzkm71o5fUBCb9YCrKJsJ_PcyioX0";
    const genAI = new GoogleGenerativeAI(API_KEY);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const checkText = text + " whether it belongs to medical or not by sending text whether it belongs to medical or not , just say yes or no , only one word answer";
      const result = await model.generateContent(checkText);
      const response = await result.response;
      const responseText = response.text().toLowerCase();
      return responseText.includes('yes');
    } catch (error) {
      console.error('Error:', error);
      throw new Error('An error occurred while checking if the text is medical.');
    }
  };

  const summarizeMedicalText = async (text) => {
    const API_KEY = "YOUR_API_KEY";
    const genAI = new GoogleGenerativeAI(API_KEY);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const summary = text + "Think you are doctor or the only guide , give the insights and remarks on the report and alter the person based on the values and the problems that might be faced in points in each line in short";
      const result = await model.generateContent(summary);
      const response = await result.response;
      const summarized = response.text();
      return summarized;
    } catch (error) {
      console.error('Error:', error);
      throw new Error('An error occurred while summarizing the text.');
    }
  };

  if (!isAuthenticated) {
    return null;  // UI will not appear if not authenticated
  }

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Medical Report Summarizer</h2>
        <div className="card p-4 shadow-lg">
          <div className="text-center mb-4">
            <label className="custom-file-upload btn btn-primary">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <i className="fas fa-upload"></i> Select Image
            </label>
          </div>
          {error && (
            <div className="alert alert-danger mt-3 text-center">{error}</div>
          )}
          {imageUploaded && (
            <>
              {summarizedText && (
                <div className="alert alert-success mt-4">
                  <h3>Summary:</h3>
                  {summarizedText.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              )}
              <div className="text-center mt-4">
                <button
                  onClick={handleSummarizeClick}
                  disabled={isLoading}
                  className={`btn btn-info ${isLoading ? 'disabled' : ''}`}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Summarizing...
                    </>
                  ) : (
                    'Summarize'
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Summary;
