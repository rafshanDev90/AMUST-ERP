import React from "react";
import { Outlet, NavLink, useParams } from "react-router-dom";

export default function Layout() {
  const { id } = useParams();

  return (
    <div className="container">
      <nav>
        <NavLink to={`/student/${id}/overview`}>Overview</NavLink>
        <NavLink to={`/student/${id}/attendance`}>Attendance</NavLink>
        <NavLink to={`/student/${id}/fees`}>Fees</NavLink>
        <NavLink to={`/student/${id}/notices`}>Notices</NavLink>
        <NavLink to={`/student/${id}/report`}>Report</NavLink>
      </nav>

      <hr />

      {/* Iss jagah nested student pages render honge */}
      <Outlet />
    </div>
  );
}
