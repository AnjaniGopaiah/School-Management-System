import React from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  Dashboard,
  School,
  Group,
  People,
  Logout,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const navItems = [
  { label: "Dashboard", icon: <Dashboard />, key: "dashboard" },
  { label: "Manage Students", icon: <School />, key: "students" },
  { label: "Manage Teachers", icon: <Group />, key: "teachers" },
  { label: "Manage Parents", icon: <People />, key: "parents" },
];

const AdminSidebar = ({ selectedSection, onSelectSection }) => {
  return (
    <motion.div
      initial={{ x: -240 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <Box
        sx={{
          width: 240,
          height: "100vh",
          backgroundColor: "#1f2937",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "fixed",
          left: 0,
          top: 0,
        }}
      >
        {/* Top Logo/Header */}
        <Box sx={{ p: 2 }}>
          <motion.h3
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ margin: 0 }}
          >
            Admin Panel
          </motion.h3>
        </Box>
        <Divider sx={{ backgroundColor: "#374151" }} />

        {/* Navigation Items */}
        <List>
          {navItems.map((item, index) => (
            <Tooltip title={item.label} placement="right" key={item.key}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <ListItemButton
                  selected={selectedSection === item.key}
                  onClick={() => onSelectSection(item.key)}
                  sx={{
                    color: "#e5e7eb",
                    "&.Mui-selected": {
                      backgroundColor: "#334155",
                      color: "#fff",
                    },
                    "&:hover": {
                      backgroundColor: "#475569",
                    },
                    transition: "all 0.3s",
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </motion.div>
            </Tooltip>
          ))}
        </List>

        {/* Logout Button at Bottom */}
        <Box sx={{ px: 2, mb: 2 }}>
          <Divider sx={{ backgroundColor: "#374151", mb: 1 }} />
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <ListItemButton
              onClick={() => onSelectSection("logout")}
              sx={{
                backgroundColor: "#7f1d1d",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#991b1b",
                },
              }}
            >
              <ListItemIcon sx={{ color: "#fff" }}>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </motion.div>
        </Box>
      </Box>
    </motion.div>
  );
};

export default AdminSidebar;
