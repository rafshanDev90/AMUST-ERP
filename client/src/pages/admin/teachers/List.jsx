import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../api/api";

export default function TeacherList() {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      const { data } = await api.get("/teachers");
      setTeachers(data || []);
    } catch (err) {
      console.error("Failed to load teachers", err);
      setTeachers([]);
    }
  };

  // ✅ SAFE FILTERING (no crash)
  const filtered = teachers.filter((t) => {
    const nameMatch = t.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const subjectMatch = t.subject
      ?.toLowerCase()
      .includes(search.toLowerCase());

    return nameMatch || subjectMatch;
  });

  return (
    <div>
      <h2>Teacher List</h2>

      <input
        placeholder="Search by name / subject"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 20 }}
      />

      {filtered.length === 0 && <p>No teachers found</p>}

      <ul>
        {filtered.map((t) => (
          <li key={t._id}>
            <Link to={`/admin/teachers/${t._id}`}>
              {t.name} — {t.subject || "N/A"} (
              {t.class || "-"} {t.section || ""})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
