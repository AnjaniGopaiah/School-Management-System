import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Snackbar,
  CircularProgress,
  Collapse,
} from "@mui/material";
import {
  Edit,
  Delete,
  Save,
  Cancel,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import axios from "axios";

function StudentsSection() {
  const [students, setStudents] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState({ open: false, message: "" });
  const [expandedId, setExpandedId] = useState(null); // 👈 controls dropdown

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/students");
      setStudents(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setSnack({ open: true, message: "Failed to load students" });
    }
    setLoading(false);
  };

  const handleEdit = (student) => {
    setEditId(student._id);
    setEditData({ ...student });
  };

  const handleCancel = () => {
    setEditId(null);
    setEditData({});
  };

  const handleChange = (e, key) => {
    setEditData({ ...editData, [key]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(`/api/admin/students/${editId}`, editData);
      setStudents((prev) =>
        prev.map((s) => (s._id === editId ? res.data : s))
      );
      setSnack({ open: true, message: "Student updated successfully" });
    } catch (err) {
      console.error(err);
      setSnack({ open: true, message: "Update failed" });
    }
    handleCancel();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await axios.delete(`/api/admin/students/${id}`);
      setStudents((prev) => prev.filter((s) => s._id !== id));
      setSnack({ open: true, message: "Student deleted" });
    } catch (err) {
      console.error(err);
      setSnack({ open: true, message: "Delete failed" });
    }
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Manage Students
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#1976d2" }}>
              <TableRow>
                <TableCell sx={{ color: "white" }}>Student ID</TableCell>
                <TableCell sx={{ color: "white" }}>Username</TableCell>
                <TableCell sx={{ color: "white" }}>Email</TableCell>
                <TableCell sx={{ color: "white" }}>Roll No</TableCell>
                <TableCell sx={{ color: "white" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <React.Fragment key={student._id}>
                  <TableRow>
                    <TableCell>{student.studentId}</TableCell>
                    <TableCell>
                      {editId === student._id ? (
                        <TextField
                          value={editData.username}
                          onChange={(e) => handleChange(e, "username")}
                          size="small"
                        />
                      ) : (
                        student.username
                      )}
                    </TableCell>
                    <TableCell>
                      {editId === student._id ? (
                        <TextField
                          value={editData.email}
                          onChange={(e) => handleChange(e, "email")}
                          size="small"
                        />
                      ) : (
                        student.email
                      )}
                    </TableCell>
                    <TableCell>
                      {editId === student._id ? (
                        <TextField
                          value={editData.rollNo}
                          onChange={(e) => handleChange(e, "rollNo")}
                          size="small"
                        />
                      ) : (
                        student.rollNo
                      )}
                    </TableCell>
                    <TableCell>
                      {editId === student._id ? (
                        <>
                          <IconButton onClick={handleSave}>
                            <Save color="success" />
                          </IconButton>
                          <IconButton onClick={handleCancel}>
                            <Cancel color="error" />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton onClick={() => handleEdit(student)}>
                            <Edit />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(student._id)}>
                            <Delete color="error" />
                          </IconButton>
                          <IconButton onClick={() => toggleExpand(student._id)}>
                            {expandedId === student._id ? (
                              <ExpandLess />
                            ) : (
                              <ExpandMore />
                            )}
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>

                  {/* Dropdown Row */}
                  <TableRow>
                    <TableCell colSpan={5} sx={{ p: 0 }}>
                      <Collapse in={expandedId === student._id} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 2, bgcolor: "#f3f3f3" }}>
                          <Typography variant="subtitle1">Marks</Typography>
                          {student.marks?.length > 0 ? (
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Subject</TableCell>
                                  <TableCell>Score</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {student.marks.map((mark, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{mark.subject}</TableCell>
                                    <TableCell>{mark.score}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          ) : (
                            <Typography>No marks available.</Typography>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        message={snack.message}
        onClose={() => setSnack({ open: false, message: "" })}
      />
    </Box>
  );
}

export default StudentsSection;
