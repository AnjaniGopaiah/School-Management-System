import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SubjectIcon from '@mui/icons-material/Subject';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import ProfileSection from './TeacherSections/ProfileSection';
import SubjectsSection from './TeacherSections/SubjectsSection';
import StudentsSection from './TeacherSections/StudentsSection';

function TeacherDashboard() {
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedSection, setSelectedSection] = useState('profile');
  const navigate = useNavigate();

  const fetchTeacherData = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setErrorMsg('No token found. Please log in again.');
      setLoading(false);
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/teachers/me', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`Error: ${res.status}`);

      const data = await res.json();
      setTeacherData(data);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to load teacher data');
      localStorage.clear();
      setTimeout(() => navigate('/login'), 2000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const drawerWidth = 240;

  const menuItems = [
    { key: 'profile', label: 'Profile', icon: <PersonIcon /> },
    { key: 'subjects', label: 'Subjects', icon: <SubjectIcon /> },
    { key: 'students', label: 'Students', icon: <GroupIcon /> },
  ];

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
        <Typography color="error" sx={{ mb: 2 }}>
          {errorMsg}
        </Typography>
        <Button variant="contained" onClick={fetchTeacherData}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#ffffff',
            borderRight: '1px solid #e0e0e0',
          },
        }}
      >
        <Box sx={{ p: 2, backgroundColor: '#1976d2', color: '#fff' }}>
          <Typography variant="h6">Hi, {teacherData.name}</Typography>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem
              key={item.key}
              button
              selected={selectedSection === item.key}
              onClick={() => setSelectedSection(item.key)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: '#e3f2fd',
                },
                '&:hover': {
                  backgroundColor: '#f1f1f1',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
          <Divider sx={{ my: 1 }} />
          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        {selectedSection === 'profile' && <ProfileSection teacher={teacherData} />}
        {selectedSection === 'subjects' && <SubjectsSection subjects={teacherData.subjects} />}
        {selectedSection === 'students' && <StudentsSection students={teacherData.students} />}
      </Box>
    </Box>
  );
}

export default TeacherDashboard;
