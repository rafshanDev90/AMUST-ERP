import React from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  const logout = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="container">
      <header>
        <h1>Admin Panel</h1>
        <div>
          <span>{user.name}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      {/* Full ERP Navigation */}
      <nav>
        <Link to="/admin/students">Students</Link>
        <Link to="/admin/teachers">Teachers</Link>
        <Link to="attendance">Attendance</Link>
        <Link to="/notices">Notices</Link>
      </nav>

      <main>
        <h2>Welcome, {user.name}!</h2>
      </main>
    </div>
  );
}
