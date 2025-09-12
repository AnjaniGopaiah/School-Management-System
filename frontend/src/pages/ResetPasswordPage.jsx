import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { role, token } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:5000/api/auth/reset-password/${role}/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Reset failed');

      setMsg(data.msg || 'Password reset successfully');
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🎆 Particle Background
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

  return (
    <>
      {/* 🎨 Particle Background */}
      <Box sx={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
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

        {/* 📦 Password Reset Form */}
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
              Reset Password
            </Typography>

            {success ? (
  <Box textAlign="center" mt={2}>
    <CheckCircleIcon sx={{ fontSize: 60, color: 'lightgreen' }} />
    <Typography mt={1}>Password changed! Redirecting to login...</Typography>
  </Box>
) : (
  <form onSubmit={handleReset}>
    <TextField
      label="New Password"
      type="password"
      fullWidth
      required
      margin="normal"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
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
    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5 }}>
      <LockIcon fontSize="small" sx={{ color: 'lightgreen', mr: 1 }} />
      <Typography variant="caption" color="#ccc">
        Choose a strong password you can remember.
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
      {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
    </Button>
  </form>
)}
{error && (
  <Typography color="error" align="center" mt={2}>
    {error}
  </Typography>
)}

          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default ResetPasswordPage;
