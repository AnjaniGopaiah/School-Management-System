import React from 'react';
import { Paper, Typography, Divider } from '@mui/material';
import { EventNote, Assignment } from '@mui/icons-material';

const Welcome = ({ data, events, assignments }) => (
  <>
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5">Hi, Welcome {data.name} 👋</Typography>
    </Paper>

    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6">
        <Assignment sx={{ verticalAlign: 'middle', mr: 1 }} />
        Upcoming Assignment Deadlines
      </Typography>
      <Divider sx={{ my: 1 }} />
      {assignments.map((a, i) => (
        <Typography key={i}>{a.subject} — Due: {a.due}</Typography>
      ))}
    </Paper>

    <Paper sx={{ p: 3 }}>
      <Typography variant="h6">
        <EventNote sx={{ verticalAlign: 'middle', mr: 1 }} />
        Upcoming Events
      </Typography>
      <Divider sx={{ my: 1 }} />
      {events.map((e, i) => (
        <Typography key={i}>{e.title} — {e.date}</Typography>
      ))}
    </Paper>
  </>
);

export default Welcome;
