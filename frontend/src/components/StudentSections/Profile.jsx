import React from 'react';
import { Paper, Typography, Divider } from '@mui/material';

const Profile = ({ data }) => (
  <Paper sx={{ p: 3 }}>
    <Typography variant="h6">Student Profile</Typography>
    <Divider sx={{ my: 1 }} />
    <Typography>Name: {data.name}</Typography>
    <Typography>Student ID: {data.studentId}</Typography>
    <Typography>Class: {data.class}</Typography>
  </Paper>
);

export default Profile;
