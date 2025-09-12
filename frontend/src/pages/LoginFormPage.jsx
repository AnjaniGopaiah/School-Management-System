import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  Box,
  TextField,
  Paper,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { jwtDecode } from 'jwt-decode';
import { motion } from 'framer-motion';

function LoginFormPage({ role }) {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const roleRoutes = {
    admin: '/admin/dashboard',
    teacher: '/teacher/dashboard',
    student: '/student/dashboard',
    parent: '/parent/dashboard',
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username || !password) {
      setErrorMsg('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      const decoded = jwtDecode(data.token);
      localStorage.setItem('role', decoded.role);
      localStorage.setItem('userId', decoded.id);

      const route = roleRoutes[decoded.role];
      if (route) {
        navigate(route);
      } else {
        setErrorMsg('Unknown role in token');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ width: '100%', maxWidth: 420 }}
    >
      <Paper
        elevation={10}
        sx={{
          p: 4,
          width: '100%',
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 4,
          color: '#fff',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1,
            fontWeight: 'bold',
          }}
        >
          <LockIcon sx={{ color: '#fff' }} />
          {role
            ? `${role.charAt(0).toUpperCase()}${role.slice(1)} Login`
            : 'Login'}
        </Typography>

        <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="dense"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{
              input: { color: '#fff' },
              label: { color: 'rgba(255,255,255,0.7)' },
              '.MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                '&:hover fieldset': { borderColor: '#fff' },
              },
              mt: 1,
            }}
          />

          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            fullWidth
            margin="dense"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: '#fff' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              input: { color: '#fff' },
              label: { color: 'rgba(255,255,255,0.7)' },
              '.MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                '&:hover fieldset': { borderColor: '#fff' },
              },
              mt: 2,
            }}
          />

          <Typography
            variant="body2"
            sx={{
              mt: 1,
              cursor: 'pointer',
              color: '#90caf9',
              textAlign: 'right',
            }}
            onClick={() => navigate('/otp-auth')}
          >
            Forgot Password?
          </Typography>

          {/* ➖ Small vertical space added here */}
          <Box sx={{ height: 8 }} />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{
              py: 1.2,
              background: 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)',
              borderRadius: '12px',
              boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
              '&:hover': {
                background: 'linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)',
                boxShadow: '0 8px 30px rgba(99, 102, 241, 0.6)',
              },
              fontWeight: 'bold',
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>

          {errorMsg && (
            <Typography color="error" sx={{ mt: 2 }}>
              {errorMsg}
            </Typography>
          )}
        </Box>
      </Paper>
    </motion.div>
  );
}

export default LoginFormPage;
