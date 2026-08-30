// import React from "react";
// import { Outlet, Link } from "react-router-dom";

// export default function AdminLayout() {
//   return (
//     <div style={{ display: "flex" }}>
//       {/* Sidebar */}
//       <aside style={{ width: 220, padding: 16, background: "#f3f4f6" }}>
//         <h3>Admin</h3>
//         <Link to="/admin/dashboard">Dashboard</Link><br /><br />
//         <Link to="/admin/students/create">Add Student</Link><br /><br />
//         <Link to="/admin/students/list">Students</Link><br />

//         <Link to="/admin/teachers/create">Add Teacher</Link><br /><br />
//         <Link to="/admin/teachers/list">Teachers</Link><br />

//         <Link to="/admin/fees">Fees</Link><br />
//         <Link to="/admin/notices">Notices</Link>
//       </aside>

//       {/* Main content */}
//       <main style={{ flex: 1, padding: 20 }}>
//         <Outlet />
//       </main>
//     </div>
//   );
// }
