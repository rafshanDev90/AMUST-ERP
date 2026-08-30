import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../api/api";

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  // 🔹 Load students from backend
  const loadStudents = async () => {
    try {
      const { data } = await api.get("/students");
      setStudents(data || []);
    } catch (err) {
      console.error("Failed to load students", err);
      setStudents([]);
    }
  };

  // 🔹 Group students class-wise
  const groupedByClass = students.reduce((acc, student) => {
    const classKey = `${student.class}${student.section || ""}`;
    if (!acc[classKey]) acc[classKey] = [];
    acc[classKey].push(student);
    return acc;
  }, {});

  return (
    <div>
      <h2>Student List (Class-wise)</h2>

      {/* 🔍 Search */}
      <input
        placeholder="Search by name / roll"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 20 }}
      />

      {Object.keys(groupedByClass).length === 0 && (
        <p>No students found</p>
      )}

      {Object.keys(groupedByClass).map((className) => {
        // ✅ SAFE FILTERING
        const sortedStudents = groupedByClass[className]
          .filter((s) => {
            const nameMatch = s.name
              ?.toLowerCase()
              .includes(search.toLowerCase());

            const rollMatch = String(s.rollNumber || "").includes(search);

            return nameMatch || rollMatch;
          })
          .sort(
            (a, b) => Number(a.rollNumber) - Number(b.rollNumber)
          );

        if (sortedStudents.length === 0) return null;

        return (
          <div key={className} style={{ marginBottom: 25 }}>
            <h3 style={{ borderBottom: "1px solid #ccc" }}>
              Class {className}
            </h3>

            {sortedStudents.map((student) => (
              <div key={student._id}>
                <Link to={`/admin/students/${student._id}`}>
                  {student.rollNumber}. {student.name}
                </Link>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
