import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function TeacherLayout() {
  return (
    <div style={{ display: "flex" }}>

      <aside style={{ width: 220, padding: 20, background: "#eef2ff" }}>
        <h3>Teacher Panel</h3>

        <Link to="/teacher/dashboard">Dashboard</Link><br />
        <Link to="/teacher/attendance">Attendance</Link><br />
        <Link to="/teacher/fees">Fees</Link><br />
        <Link to="/teacher/notices">Notices</Link><br />
        <Link to="/teacher/profile">Profile</Link><br />
      </aside>

      <main style={{ flex: 1, padding: 20 }}>
        <Outlet />
      </main>

    </div>
  );
}
