import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Paper,
} from '@mui/material';
import { School, Login as LoginIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

function HomePage() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

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

      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
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
      {/* Animated canvas background */}
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
          {/* Logo and name */}
          <Typography
            variant="h6"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: '#fff',
            }}
          >
            <School /> MERN Schooling
          </Typography>

          {/* Nav links */}
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Button
              color="inherit"
              sx={{ color: '#fff' }}
              onClick={() => navigate('/')}
            >
              Home
            </Button>
            <Button
              color="inherit"
              sx={{ color: '#fff' }}
              onClick={() => navigate('/about')}
            >
              About Us
            </Button>
            <Button
              color="inherit"
              sx={{ color: '#fff' }}
              onClick={() => navigate('/support')}
            >
              Support Us
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 64px)',
          p: 2,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          style={{ width: '100%', maxWidth: '900px' }}
        >
          <Paper
            elevation={10}
            sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              p: { xs: 3, sm: 5 },
              maxWidth: '900px',
              mx: 'auto',
              color: '#fff',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            }}
          >
            <Typography
              variant="h2"
              sx={{
                mb: 3,
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
                textShadow: '0 4px 20px rgba(0,0,0,0.5)',
              }}
            >
              <School sx={{ fontSize: { xs: 36, sm: 48, md: 60 } }} />
              Welcome to MERN Schooling
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                mb: 4,
                fontSize: { xs: '1.1rem', sm: '1.5rem' },
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Empowering education through modern technology — for students,
              teachers, and parents.
            </Typography>

            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 500 }}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<LoginIcon />}
                sx={{
                  px: { xs: 4, sm: 6 },
                  py: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '1rem', sm: '1.2rem' },
                  background: 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)',
                  borderRadius: '12px',
                  boxShadow: '0 6px 30px rgba(99, 102, 241, 0.5)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)',
                    boxShadow: '0 8px 40px rgba(99, 102, 241, 0.7)',
                  },
                }}
                onClick={() => navigate('/login')}
              >
                Get Started
              </Button>
            </motion.div>
          </Paper>
        </motion.div>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          py: 2,
          textAlign: 'center',
          backgroundColor: 'rgba(17, 24, 39, 0.7)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          fontSize: '0.9rem',
          color: 'rgba(255,255,255,0.7)',
          position: 'relative',
          zIndex: 2,
        }}
      >
        © 2025 MERN Schooling. All rights reserved.
      </Box>
    </Box>
  );
}

export default HomePage;
