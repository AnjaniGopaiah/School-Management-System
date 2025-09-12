// src/pages/VerifyOtpPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Paper } from '@mui/material';

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('resetEmail');
    if (!storedEmail) {
      setError('No email found. Please request OTP again.');
    } else {
      setEmail(storedEmail);
      console.log('📨 Email from localStorage:', storedEmail);
    }
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');

    console.log('🧪 Sending verification request with:', { email, otp });

    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Invalid OTP');

      // Save token and role to localStorage
      localStorage.setItem('resetToken', data.token);
      localStorage.setItem('resetRole', data.role);
      navigate(`/reset-password/${data.role}/${data.token}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <Paper sx={{ p: 4, width: 400 }}>
        <Typography variant="h6" gutterBottom>Verify OTP</Typography>
        <form onSubmit={handleVerify}>
          <TextField
            label="OTP"
            fullWidth
            required
            margin="normal"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Verify
          </Button>
        </form>
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      </Paper>
    </Box>
  );
};

export default VerifyOtpPage;