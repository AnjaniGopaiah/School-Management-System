// src/pages/admin/AdminDashboard.jsx
import React, { useState } from 'react';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import AdminSidebar from '../components/admin/AdminSidebar';

import StudentsSection from '../components/admin/StudentsSection';
import TeachersSection from '../components/admin/TeachersSection';
import ParentsSection from '../components/admin/ParentsSection';

const AdminDashboard = () => {
  const adminName = JSON.parse(localStorage.getItem('user'))?.username || 'Admin';
  const [selectedSection, setSelectedSection] = useState('dashboard');

  const renderSection = () => {
    switch (selectedSection) {
      case 'dashboard':
        return (
          <Box>
            <h2>Welcome, {adminName} 👋</h2>
            <p>This is your admin dashboard overview.</p>
            <ul>
              <li>Manage students, teachers, and parents</li>
              <li>Generate reports and announcements</li>
            </ul>
          </Box>
        );
      case 'students':
        return <StudentsSection />;
      case 'teachers':
        return <TeachersSection />;
      case 'parents':
        return <ParentsSection />;
      default:
        return <Box><p>Page not found</p></Box>;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Sidebar */}
      <AdminSidebar selectedSection={selectedSection} onSelectSection={setSelectedSection} />

      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, p: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <Toolbar />
        {renderSection()}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
