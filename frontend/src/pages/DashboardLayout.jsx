// DashboardLayout.js
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import StudentsSection from "./StudentsSection";
import MarksSection from "./MarksSection";
import AttendanceSection from "./AttendanceSection";

function DashboardLayout() {
  const [selectedSection, setSelectedSection] = useState("profile");

  const renderContent = () => {
    switch (selectedSection) {
      case "marks":
        return <MarksSection />;
      case "attendance":
        return <AttendanceSection />;
      case "profile":
        return <div>Student Profile View</div>;
      default:
        return <StudentsSection />;
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "250px" }}>
        <Sidebar onSelectSection={setSelectedSection} />
      </div>
      <div style={{ flex: 1, padding: "20px" }}>
        {renderContent()}
      </div>
    </div>
  );
}

export default DashboardLayout;
