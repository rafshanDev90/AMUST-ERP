// src/pages/Dashboard.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Not logged in
  if (!user.role) return <Navigate to="/login" />;

  // Role-based redirect
  if (user.role === "admin") return <Navigate to="/admin/dashboard" />;
  if (user.role === "teacher") return <Navigate to="/teacher/profile" />;
  if (user.role === "student") return <Navigate to={`/student/profile`} />;
  if (user.role === "parent") return <Navigate to={`/student/profile`} />;

  return <Navigate to="/login" />;
}
