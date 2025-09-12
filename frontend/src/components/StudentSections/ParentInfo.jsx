import React from 'react';
import { Paper, Typography, Divider } from '@mui/material';

const ParentInfo = ({ data }) => (
  <Paper sx={{ p: 3 }}>
    <Typography variant="h6">Parent Information</Typography>
    <Divider sx={{ my: 1 }} />
    <Typography>Name: {data.parent?.name || 'N/A'}</Typography>
    <Typography>Username: {data.parent?.username || 'N/A'}</Typography>
  </Paper>
);

export default ParentInfo;
