import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from '@mui/material';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function StudentsSection({ students }) {
  const [studentData, setStudentData] = useState(students);
  const [editMarksIndex, setEditMarksIndex] = useState(null);
  const [editAttendanceIndex, setEditAttendanceIndex] = useState(null);
  const [tempData, setTempData] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingSaveIndex, setPendingSaveIndex] = useState(null);

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const handleMarkChange = (subject, value) => {
    const updated = tempData.marks.map(m =>
      m.subject === subject ? { ...m, score: value } : m
    );
    setTempData({ ...tempData, marks: updated });
  };

  const handleAttendanceChange = (field, value) => {
    setTempData({
      ...tempData,
      attendanceSummary: {
        ...tempData.attendanceSummary,
        [field]: value
      }
    });
  };

  const confirmSave = (index) => {
    setPendingSaveIndex(index);
    setTempData(JSON.parse(JSON.stringify(studentData[index])));
    setConfirmOpen(true);
  };

  const handleSaveConfirmed = async () => {
    const index = pendingSaveIndex;
    const token = localStorage.getItem('token');

    try {
      if (editMarksIndex === index) {
        await fetch(`http://localhost:5000/api/teachers/update-marks/${tempData._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ marks: tempData.marks })
        });
        setEditMarksIndex(null);
      }

      if (editAttendanceIndex === index) {
        const { presentDays, totalDays } = tempData.attendanceSummary;
        await fetch(`http://localhost:5000/api/teachers/update-attendance/${tempData._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ presentDays: Number(presentDays), totalDays: Number(totalDays) })
        });
        setEditAttendanceIndex(null);
      }

      const updated = [...studentData];
      updated[index] = tempData;
      setStudentData(updated);

      setSnackbar({ open: true, message: 'Student updated successfully', severity: 'success' });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Error updating student', severity: 'error' });
    } finally {
      setConfirmOpen(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Students Overview
      </Typography>

      {studentData.map((student, index) => {
        const isEditingMarks = editMarksIndex === index;
        const isEditingAttendance = editAttendanceIndex === index;
        const dataToShow = isEditingMarks || isEditingAttendance ? tempData : student;
        const { presentDays = 0, totalDays = 0 } = dataToShow.attendanceSummary || {};

        const pieData = {
          labels: ['Present', 'Absent'],
          datasets: [
            {
              data: [presentDays, totalDays - presentDays],
              backgroundColor: ['#66bb6a', '#ef5350']
            }
          ]
        };

        return (
          <Paper key={student._id} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6">{student.name}</Typography>
            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {/* Marks */}
              <Box>
                <Typography fontWeight="bold">Marks:</Typography>
                {dataToShow.marks.map((mark, mIdx) => (
                  <Box key={mIdx} sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <Typography>{mark.subject}:</Typography>
                    {(isEditingMarks || isEditingAttendance) ? (
                      <TextField
                        size="small"
                        type="number"
                        value={mark.score}
                        onChange={(e) => handleMarkChange(mark.subject, e.target.value)}
                        sx={{ width: 80 }}
                      />
                    ) : (
                      <Typography>{mark.score}</Typography>
                    )}
                  </Box>
                ))}
                <Box mt={2}>
                  {isEditingMarks ? (
                    <>
                      <Button variant="contained" onClick={() => confirmSave(index)}>Save Marks</Button>
                      <Button sx={{ ml: 2 }} onClick={() => setEditMarksIndex(null)}>Cancel</Button>
                    </>
                  ) : (
                    <Button variant="outlined" onClick={() => { setEditMarksIndex(index); setTempData(JSON.parse(JSON.stringify(student))); }}>
                      Edit Marks
                    </Button>
                  )}
                </Box>
              </Box>

              {/* Attendance */}
              <Box>
                <Typography fontWeight="bold">Attendance:</Typography>
                <Box sx={{ mt: 1 }}>
                  {isEditingAttendance ? (
                    <>
                      <TextField
                        size="small"
                        label="Present"
                        type="number"
                        value={presentDays}
                        onChange={(e) => handleAttendanceChange('presentDays', e.target.value)}
                        sx={{ mr: 1 }}
                      />
                      <TextField
                        size="small"
                        label="Total"
                        type="number"
                        value={totalDays}
                        onChange={(e) => handleAttendanceChange('totalDays', e.target.value)}
                      />
                    </>
                  ) : (
                    <Typography>{presentDays}/{totalDays}</Typography>
                  )}
                </Box>
                <Box mt={2}>
                  {isEditingAttendance ? (
                    <>
                      <Button variant="contained" onClick={() => confirmSave(index)}>Save Attendance</Button>
                      <Button sx={{ ml: 2 }} onClick={() => setEditAttendanceIndex(null)}>Cancel</Button>
                    </>
                  ) : (
                    <Button variant="outlined" onClick={() => { setEditAttendanceIndex(index); setTempData(JSON.parse(JSON.stringify(student))); }}>
                      Edit Attendance
                    </Button>
                  )}
                </Box>
              </Box>

              {/* Pie Chart */}
              <Box sx={{ mt: 2, width: 200, height: 200 }}>
                <Pie
                  data={pieData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }}
                />
              </Box>
            </Box>
          </Paper>
        );
      })}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={handleSnackbarClose}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Confirm Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Save</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to save these changes?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveConfirmed}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default StudentsSection;
