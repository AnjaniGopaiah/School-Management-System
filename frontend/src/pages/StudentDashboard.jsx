import React, { useEffect, useState } from 'react';
import {
  Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText,
  Divider, Paper, CssBaseline
} from '@mui/material';
import {
  AccountBox, Group, EventAvailable, Grade, Logout
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import Profile from '../components/StudentSections/Profile';
import ParentInfo from '../components/StudentSections/ParentInfo';
import Attendance from '../components/StudentSections/Attendance';
import Marks from '../components/StudentSections/Marks';
import Welcome from '../components/StudentSections/Welcome';

const drawerWidth = 240;

const StudentDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('home');
  const [studentData, setStudentData] = useState(null);
  const navigate = useNavigate();

  const fetchStudentData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    try {
      const res = await fetch('https://school-management-system-5anj.onrender.com/api/students/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStudentData(data);
    } catch (err) {
      localStorage.clear();
      navigate('/login');
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const menuItems = [
    { label: 'Profile', icon: <AccountBox />, key: 'profile' },
    { label: 'Parent Info', icon: <Group />, key: 'parent' },
    { label: 'Attendance', icon: <EventAvailable />, key: 'attendance' },
    { label: 'Marks', icon: <Grade />, key: 'marks' }
  ];

  const events = [
    { title: 'AI Workshop', date: 'July 12' },
    { title: 'Science Fair', date: 'July 15' },
  ];

  const assignments = [
    { subject: 'Math Project', due: 'July 10' },
    { subject: 'History Essay', due: 'July 13' },
  ];

  const renderContent = () => {
    if (!studentData) return <Typography>Loading...</Typography>;

    switch (selectedTab) {
      case 'profile': return <Profile data={studentData} />;
      case 'parent': return <ParentInfo data={studentData} />;
      case 'attendance': return <Attendance data={studentData} />;
      case 'marks': return <Marks data={studentData} />;
      default: return <Welcome data={studentData} events={events} assignments={assignments} />;
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            background: '#2e3b55',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          },
        }}
      >
        <Box>
          <Toolbar>
            <Typography variant="h6">Student Panel</Typography>
          </Toolbar>
          <Divider />
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.key}
                selected={selectedTab === item.key}
                onClick={() => setSelectedTab(item.key)}
              >
                <ListItemIcon sx={{ color: '#fff' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </Box>
        <List>
          <ListItem button onClick={handleLogout}>
            <ListItemIcon sx={{ color: '#fff' }}><Logout /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 4, overflowY: 'auto', backgroundColor: '#f5f7fb' }}>
        {renderContent()}
      </Box>
    </Box>
  );
};

export default StudentDashboard;
