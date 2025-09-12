import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Divider,
  Grid,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const OtpAuthPage = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const count = Math.floor(window.innerWidth / 10);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: Math.random() * 0.6 - 0.3,
        speedY: Math.random() * 0.6 - 0.3,
        color: `rgba(255, 255, 255, ${Math.random() * 0.4 + 0.1})`,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    return () => window.removeEventListener('resize', () => {});
  }, []);

  useEffect(() => {
    if (step === 'otp' && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  const handleOtpChange = (e, index) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value.slice(-1);
    setOtp(newOtp);
    if (e.target.value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const clearOtp = () => setOtp(new Array(6).fill(''));

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Something went wrong');
      setStep('otp');
      setTimer(30);
      clearOtp();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const code = otp.join('');
    if (code.length !== 6) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Invalid OTP');
      clearOtp();
      setSuccess(true);
      setTimeout(() => {
        localStorage.setItem('resetToken', data.token);
        localStorage.setItem('resetRole', data.role);
        navigate(`/reset-password/${data.role}/${data.token}`);
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const maskEmail = (email) => {
    const [user, domain] = email.split('@');
    return user.slice(0, 2) + '***@' + domain;
  };

  return (
    <>
      <Box sx={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', top: 0, left: 0, zIndex: 0, width: '100%', height: '100%' }}
        />

        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'radial-gradient(circle at 30% 30%, #4f46e5 0%, #111827 100%)',
            px: 2,
          }}
        >
          <Paper
            elevation={8}
            sx={{
              width: '100%',
              maxWidth: 420,
              p: 4,
              borderRadius: 4,
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: '#fff',
              zIndex: 1,
            }}
          >
            <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
              {step === 'email' ? 'Request OTP' : 'Verify OTP'}
            </Typography>

            {step === 'email' ? (
              <>
                <form onSubmit={handleRequestOtp}>
                  <TextField
                    fullWidth
                    type="email"
                    label="Registered Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    InputProps={{ style: { color: '#fff', background: 'transparent' } }}
                    InputLabelProps={{ style: { color: '#ccc' } }}
                    sx={{
                      mt: 1,
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#666' },
                        '&:hover fieldset': { borderColor: '#888' },
                        '&.Mui-focused fieldset': { borderColor: '#aaa' },
                      },
                    }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5 }}>
                    <LockIcon fontSize="small" sx={{ color: 'lightgreen', mr: 1 }} />
                    <Typography variant="caption" color="#ccc">
                      256-bit Encryption. Your data is safe.
                    </Typography>
                  </Box>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{
                      mt: 3,
                      py: 1.2,
                      fontWeight: 600,
                      background: 'linear-gradient(to right, #6366F1, #8B5CF6)',
                      '&:hover': {
                        background: 'linear-gradient(to right, #4F46E5, #7C3AED)',
                      },
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Send OTP'}
                  </Button>
                </form>
                <Button
                  fullWidth
                  onClick={() => navigate('/login')}
                  sx={{ mt: 2, color: '#90caf9' }}
                >
                  ← Back to Login
                </Button>
              </>
            ) : success ? (
              <Box textAlign="center" mt={2}>
                <CheckCircleIcon sx={{ fontSize: 60, color: 'lightgreen' }} />
                <Typography mt={1}>OTP Verified! Redirecting...</Typography>
              </Box>
            ) : (
              <>
                <Typography textAlign="center" sx={{ mb: 1 }}>
                  Enter the 6-digit code sent to <strong>{maskEmail(email)}</strong>
                </Typography>
                <Grid container spacing={1} justifyContent="center" sx={{ mb: 2 }}>
                  {otp.map((digit, idx) => (
                    <Grid item key={idx}>
                      <TextField
                        id={`otp-${idx}`}
                        inputProps={{ maxLength: 1, style: { textAlign: 'center' } }}
                        value={digit}
                        onChange={(e) => handleOtpChange(e, idx)}
                        sx={{
                          width: 40,
                          input: { color: '#fff' },
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#666' },
                          },
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleVerifyOtp}
                  disabled={!otp.every((digit) => digit !== '') || loading}
                  sx={{
                    mb: 2,
                    py: 1.2,
                    fontWeight: 600,
                    background: !otp.every((digit) => digit !== '')
                      ? '#999'
                      : 'linear-gradient(to right, #6366F1, #8B5CF6)',
                    '&:hover': {
                      background: otp.every((digit) => digit !== '')
                        ? 'linear-gradient(to right, #4F46E5, #7C3AED)'
                        : '#999',
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify OTP'}
                </Button>
                <Typography variant="caption" textAlign="center" display="block" color="#ccc">
                  {timer > 0 ? `Resend OTP in ${timer}s` : (
                    <Button
                      variant="text"
                      size="small"
                      onClick={handleRequestOtp}
                      sx={{ color: '#90caf9', textTransform: 'none' }}
                    >
                      Resend OTP
                    </Button>
                  )}
                </Typography>
                <Button
                  onClick={() => {
                    setStep('email');
                    setError('');
                  }}
                  fullWidth
                  sx={{ mt: 2, color: '#90caf9' }}
                >
                  ⬅ Back
                </Button>
              </>
            )}

            {error && (
              <Typography
                align="center"
                mt={2}
                sx={{ color: '#ff4d4f', fontWeight: 'bold', fontSize: '0.95rem' }}
              >
                {error}
              </Typography>
            )}

            <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />
          </Paper>
        </Box>
      </Box>
      <Box
        sx={{
          py: 2,
          textAlign: 'center',
          backgroundColor: 'rgba(17, 24, 39, 0.7)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          fontSize: '0.9rem',
          color: 'rgba(255,255,255,0.7)',
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          zIndex: 2,
        }}
      >
        © 2025 MERN Schooling. All rights reserved.
      </Box>
    </>
  );
};

export default OtpAuthPage;
