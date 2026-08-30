import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/common/Dashboard";

// ADMIN
import AdminLayout from "../layouts/AdminLayout.jsx";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminStudentCreate from "../pages/admin/students/Create.jsx";
import AdminTeacherCreate from "../pages/admin/teachers/Create.jsx";
import AdminNotices from "../pages/admin/Notices";
import AdminStudentList from "../pages/admin/students/List.jsx";
import AdminTeacherList from "../pages/admin/teachers/List.jsx";

// ADMIN → STUDENT PROFILE
import AdminStudentLayout from "../layouts/StudentLayout.jsx";
import StudentOverview from "../pages/student/Overview.jsx";
import StudentFees from "../pages/admin/students/AddFees.jsx";
import StudentReport from "../pages/student/Report.jsx";

// ADMIN → TEACHER PROFILE
import TeacherLayout from "../layouts/TeacherLayout.jsx";
// import TeacherDashboard from "../pages/teacher/Dashboard.jsx";  


// TEACHER
import AdminTeacherLayout from "../pages/teacher/Layout";
import TeacherDashboard from "../pages/teacher/Dashboard";
import TeacherAttendance from "../pages/teacher/Attendance";
import TeacherFees from "../pages/teacher/Fees";
import TeacherNotices from "../pages/teacher/Notices";
import TeacherProfile from "../pages/teacher/Profile";

// STUDENT
import StudentLayout from "../pages/student/Layout";
import Overview from "../pages/student/Overview";
import Attendance from "../pages/student/Attendance";
import Fees from "../pages/student/Fees";
import Notices from "../pages/student/Notices";
import Report from "../pages/student/Report";

export default function AppRoutes() {
  const token = localStorage.getItem("token");

  return (
    <Routes>

      <Route path="/login" element={<Login />} />

      <Route path="/" element={token ? <Dashboard /> : <Navigate to="/login" />} />

      {/* ADMIN */}
      <Route path="/admin" element={token ? <AdminLayout /> : <Navigate to="/login" />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="notices" element={<AdminNotices />} />
        <Route path="students/create" element={<AdminStudentCreate />} />
        <Route path="teachers/create" element={<AdminTeacherCreate />} />
        <Route path="students/list" element={<AdminStudentList />} />
        <Route path="teachers/list" element={<AdminTeacherList />} />
      </Route>

       {/* ADMIN → STUDENT PROFILE */}
<Route path="/admin/students/:id" element={<AdminStudentLayout />}>
  <Route path="overview" element={<StudentOverview />} />
  <Route path="fees" element={<StudentFees />} />
  <Route path="report" element={<StudentReport />} />
</Route>

{/* ADMIN → TEACHER PROFILE */}
<Route path="/admin/teachers/:id" element={<TeacherLayout />}>
  {/* <Route path="overview" element={<TeacherDashboard />} /> */}
  <Route path="fees" element={<StudentFees />} />
  <Route path="report" element={<StudentReport />} />
</Route>

      {/* TEACHER */}
      <Route path="/teacher" element={token ? <TeacherLayout /> : <Navigate to="/login" />}>
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="attendance" element={<TeacherAttendance />} />
        <Route path="fees" element={<TeacherFees />} />
        <Route path="notices" element={<TeacherNotices />} />
        <Route path="profile" element={<TeacherProfile />} />
        <Route path="students" element={<AdminStudentList />} />
        <Route path="teachers" element={<AdminTeacherList />} />
      </Route>

      {/* STUDENT */}
      <Route path="/student/:id" element={<StudentLayout/>}>
        <Route path="overview" element={<Overview />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="fees" element={<Fees />} />
        <Route path="notices" element={<Notices />} />
        <Route path="report" element={<Report />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
