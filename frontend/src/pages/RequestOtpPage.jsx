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
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

const RequestOtpPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // 🟣 Particle background effect
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Something went wrong');

      localStorage.setItem('resetEmail', email);
      setMessage(data.msg || 'OTP sent to your email');

      setTimeout(() => navigate('/verify-otp'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
        {/* Canvas Background */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 0,
            width: '100%',
            height: '100%',
          }}
        />

        {/* Form Center */}
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
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <img
                src="/logo.svg"
                alt="Logo"
                onError={(e) => (e.target.style.display = 'none')}
                style={{ height: 60, marginBottom: 8 }}
              />
              <Typography variant="h5" fontWeight="bold">
                Request OTP
              </Typography>
              <Typography variant="body2" sx={{ color: '#ccc' }}>
                Enter your email to receive a verification code.
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                type="email"
                label="Registered Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                margin="normal"
                autoFocus
                InputProps={{ style: { color: '#fff' } }}
                InputLabelProps={{ style: { color: '#ccc' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#666' },
                    '&:hover fieldset': { borderColor: '#888' },
                    '&.Mui-focused fieldset': { borderColor: '#aaa' },
                  },
                }}
              />

              {/* ✅ Security Badge below input */}
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5, mb: 2 }}>
                <LockIcon fontSize="small" sx={{ color: 'lightgreen', mr: 1 }} />
                <Typography variant="caption" color="#ccc">
                  256-bit Encryption. Your data is safe.
                </Typography>
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  py: 1.2,
                  fontWeight: 600,
                  background: 'linear-gradient(to right, #6366F1, #8B5CF6)',
                  '&:hover': {
                    background: 'linear-gradient(to right, #4F46E5, #7C3AED)',
                  },
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Send OTP'}
              </Button>
            </form>

            {message && (
              <Typography color="success.main" align="center" mt={2}>
                {message}
              </Typography>
            )}
            {error && (
              <Typography color="error" align="center" mt={2}>
                {error}
              </Typography>
            )}

            <Button
              onClick={() => navigate('/login')}
              fullWidth
              sx={{ mt: 2, color: '#90caf9' }}
            >
              ⬅ Back to Login
            </Button>

            <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />
          </Paper>
        </Box>
      </Box>

      {/* ✅ Footer - styled like HomePage */}
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

export default RequestOtpPage;
