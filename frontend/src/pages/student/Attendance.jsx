// src/pages/student/Attendance.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useParams } from "react-router-dom";

export default function Attendance() {
  const { id } = useParams();
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data } = await api.get(`/students/${id}/profile`);
    setAttendance(data.attendance);
  };

  return (
    <>
      <h2>Attendance History</h2>
      {attendance.length === 0 ? <p>No data</p> : (
        <ul>
          {attendance.map(a => (
            <li key={a._id}>
              {new Date(a.date).toDateString()} — {a.status}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
