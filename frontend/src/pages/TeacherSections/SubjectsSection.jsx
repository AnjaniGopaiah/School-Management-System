import React from 'react';
import { Typography, Paper, Divider } from '@mui/material';

const SubjectsSection = ({ subjects }) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5">Subjects</Typography>
      <Divider sx={{ my: 1 }} />
      {subjects?.length > 0 ? (
        subjects.map((subj, idx) => (
          <Typography key={idx}>• {subj}</Typography>
        ))
      ) : (
        <Typography>No subjects assigned</Typography>
      )}
    </Paper>
  );
};

export default SubjectsSection;
