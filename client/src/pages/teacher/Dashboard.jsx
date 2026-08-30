import React from "react";
import { Link } from "react-router-dom";

export default function TeacherDashboard() {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  return (
    <div className="container">
      <h2>Teacher Dashboard</h2>

      <nav className="card" style={{ padding: 16 }}>
        <ul>
          <li><Link to="/teacher/profile">My Profile</Link></li>
          <li><Link to="/teacher/attendance">Mark Attendance</Link></li>
          <li><Link to="/teacher/notices">Manage Notices</Link></li>
          <li><Link to="/teacher/fees">Student Fees</Link></li>
        </ul>
      </nav>
    </div>
  );
}
