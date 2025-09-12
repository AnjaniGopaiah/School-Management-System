import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Paper,
} from '@mui/material';
import { School } from '@mui/icons-material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SchoolIcon from '@mui/icons-material/School';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import { motion } from 'framer-motion';
import LoginFormPage from './LoginFormPage';

function LoginRolePage() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = Math.floor(window.innerWidth / 12);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: Math.random() * 0.7 - 0.35,
        speedY: Math.random() * 0.7 - 0.35,
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

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const roles = [
    {
      key: 'admin',
      label: 'Admin Login',
      icon: <AdminPanelSettingsIcon sx={{ fontSize: 30, color: '#fff' }} />,
      color: 'primary',
    },
    {
      key: 'teacher',
      label: 'Teacher Login',
      icon: <PersonOutlineIcon sx={{ fontSize: 30, color: '#fff' }} />,
      color: 'success',
    },
    {
      key: 'student',
      label: 'Student Login',
      icon: <SchoolIcon sx={{ fontSize: 30, color: '#fff' }} />,
      color: 'secondary',
    },
    {
      key: 'parent',
      label: 'Parent Login',
      icon: <FamilyRestroomIcon sx={{ fontSize: 30, color: '#fff' }} />,
      color: 'error',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        position: 'relative',
        overflow: 'hidden',
        background:
          'radial-gradient(circle at 30% 30%, #4f46e5 0%, #111827 100%)',
      }}
    >
      {/* Canvas background */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      />

      {/* Navbar */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: 'rgba(17, 24, 39, 0.7)',
          backdropFilter: 'blur(10px)',
          boxShadow: 'none',
          zIndex: 2,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: '#fff',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            <School /> MERN Schooling
          </Typography>

          <Box sx={{ display: 'flex', gap: 3 }}>
            <Button sx={{ color: '#fff' }} onClick={() => navigate('/')}>
              Home
            </Button>
            <Button sx={{ color: '#fff' }} onClick={() => navigate('/about')}>
              About Us
            </Button>
            <Button sx={{ color: '#fff' }} onClick={() => navigate('/support')}>
              Support Us
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Layout */}
      <Box
        sx={{
          display: 'flex',
          height: 'calc(100vh - 64px)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Left: Role Buttons */}
       <Box
  sx={{
    width: '45%',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    rowGap: 0,               // reduce vertical gap between rows
    columnGap: 2,              // keep nice horizontal spacing
    justifyItems: 'center',
    alignItems: 'center',
    p: 3,
  }}
>
  {roles.map((role) => (
    <motion.div
      key={role.key}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 500 }}
      style={{ width: '95%' }}
    >
      <Button
        fullWidth
        variant={selectedRole === role.key ? 'contained' : 'outlined'}
        color={role.color}
        sx={{
          height: '130px',
          borderRadius: 3,
          fontWeight: 'bold',
          gap: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderColor: '#fff',
          color: '#fff',
          textTransform: 'none',
        }}
        onClick={() => setSelectedRole(role.key)}
      >
        {role.icon}
        {role.label}
      </Button>
    </motion.div>
  ))}
</Box>


        {/* Right: Form or Info */}
        <Box
          sx={{
            width: '55%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 5,
          }}
        >
          {selectedRole ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ width: '100%', maxWidth: 600 }} // optionally increased
            >
              <LoginFormPage role={selectedRole} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{ width: '100%', maxWidth: 600 }}
            >
              <Paper
                elevation={10}
                sx={{
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '20px',
                  p: { xs: 3, sm: 5 },
                  color: '#fff',
                  textAlign: 'center',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    mb: 3,
                    fontWeight: 'bold',
                    textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                  }}
                >
                  Welcome to MERN Schooling
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: 'rgba(255,255,255,0.9)', mb: 4 }}
                >
                  Empowering education through modern technology — for students,
                  teachers, and parents.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  Select your role on the left to login and explore your personalized dashboard.
                </Typography>
              </Paper>
            </motion.div>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default LoginRolePage;
