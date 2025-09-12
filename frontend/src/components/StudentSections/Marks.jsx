import React from 'react';
import { Paper, Typography, Divider } from '@mui/material';

const Marks = ({ data }) => (
  <Paper sx={{ p: 3 }}>
    <Typography variant="h6">Marks</Typography>
    <Divider sx={{ my: 1 }} />
    {data.marks && data.marks.length > 0 ? (
      data.marks.map((m, i) => (
        <Typography key={i}>{m.subject}: {m.score}</Typography>
      ))
    ) : (
      <Typography>No marks available</Typography>
    )}
  </Paper>
);

export default Marks;
