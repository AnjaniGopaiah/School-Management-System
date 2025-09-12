import React from 'react';
import { Typography, Paper } from '@mui/material';

const ProfileSection = ({ teacher }) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5">Profile</Typography>
      <Typography>Name: {teacher.name}</Typography>
      <Typography>Username: {teacher.username}</Typography>
      <Typography>Teacher ID: {teacher.teacherId}</Typography>
    </Paper>
  );
};

export default ProfileSection;
