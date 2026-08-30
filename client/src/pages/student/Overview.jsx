// src/pages/student/Overview.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useParams } from "react-router-dom";

export default function Overview() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data } = await api.get(`/students/${id}/profile`);
    setStudent(data.student);
  };

  if (!student) return <p>Loading...</p>;

  return (
    <>
      <h2>Student Overview</h2>
      <p><b>Name:</b> {student.name}</p>
      <p><b>Class:</b> {student.class}-{student.section}</p>
      <p><b>Roll:</b> {student.rollNumber}</p>
      <p><b>DOB:</b> {student.dob?.slice(0,10)}</p>
      <p><b>Address:</b> {student.address}</p>
    </>
  );
}
