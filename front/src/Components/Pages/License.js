import React, { useState } from 'react';
import axios from 'axios';
import { data } from '@remix-run/router';

const LicenseUpload = () => {
  const [file, setFile] = useState(null);
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle userId input
  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !userId) {
      setMessage('Please provide a file and user ID.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsLoading(true);

    try {
      // Replace with your backend's upload route
      const response = await axios.post(
        `http://localhost:5100/api/users/upload-license/${userId}`,
        formData
      );

      setMessage(response.data.message);
    } catch (error) {
      setMessage(
        error.response?.data?.error || 'Something went wrong. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Upload License</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="userId">User ID:</label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={handleUserIdChange}
            required
            style={{ display: 'block', width: '100%', padding: '8px', margin: '5px 0' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="file">License Image:</label>
          <input
            type="file"
            id="file"
            accept="image/*"
            onChange={handleFileChange}
            required
            style={{ display: 'block', margin: '5px 0' }}
          />
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            cursor: 'pointer',
          }}
          disabled={isLoading}
        >
          {isLoading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {message && (
        <p
          style={{
            marginTop: '10px',
            color: message.includes('success') ? 'green' : 'red',
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default LicenseUpload;