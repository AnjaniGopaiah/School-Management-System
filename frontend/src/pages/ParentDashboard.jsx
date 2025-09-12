import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, CircularProgress } from '@mui/material';

function ParentDashboard() {
  const [parentData, setParentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const fetchParentData = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setErrorMsg('No token found. Please log in again.');
      setLoading(false);
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    try {
      const res = await fetch('https://school-management-system-5anj.onrender.com/api/parents/me', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error(`Error: ${res.status}`);

      const data = await res.json();
      setParentData(data);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to load parent data');
      localStorage.clear();
      setTimeout(() => navigate('/login'), 2000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParentData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (errorMsg) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" sx={{ mb: 2 }}>{errorMsg}</Typography>
        <Button variant="contained" onClick={fetchParentData}>Retry</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4">Parent Dashboard</Typography>
        <Button variant="contained" color="error" onClick={handleLogout}>Logout</Button>
      </Box>

      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6">Welcome, {parentData.name}</Typography>
        <Typography>Username: {parentData.username}</Typography>
        <Typography>Parent ID: {parentData.parentId}</Typography>
      </Paper>

      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6">Child</Typography>
        {parentData.student ? (
          <>
            <Typography>Name: {parentData.student.name}</Typography>
            <Typography>Student ID: {parentData.student.studentId}</Typography>
            <Typography>Class: {parentData.student.class}</Typography>
          </>
        ) : (
          <Typography>No child linked</Typography>
        )}
      </Paper>
    </Box>
  );
}

export default ParentDashboard;
