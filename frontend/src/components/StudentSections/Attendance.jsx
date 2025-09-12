import React from 'react';
import { Paper, Typography, Divider } from '@mui/material';

const Attendance = ({ data }) => (
  <Paper sx={{ p: 3 }}>
    <Typography variant="h6">Attendance</Typography>
    <Divider sx={{ my: 1 }} />
    {data.attendanceSummary ? (
      <Typography>
        Present Days: {data.attendanceSummary.presentDays} / {data.attendanceSummary.totalDays}
      </Typography>
    ) : (
      <Typography>No attendance data</Typography>
    )}
  </Paper>
);

export default Attendance;
