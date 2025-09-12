import React from 'react';
import { Box, Typography } from '@mui/material';

function AboutPage() {
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        About MERN Schooling
      </Typography>
      <Typography>
        MERN Schooling is a modern school management platform that helps schools, teachers, students, and parents collaborate effectively.
      </Typography>
    </Box>
  );
}

export default AboutPage;
