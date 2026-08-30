import React, { useEffect, useState } from "react";
import api from "../../api/api";

export default function TeacherAttendance() {
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    const { data } = await api.get("/students");
    const classList = [...new Set(data.map((s) => s.class))];
    setSelectedClass(classList[0] || "");
    filterStudents(classList[0]);
  };

  const filterStudents = async (cls) => {
    const { data } = await api.get(`/students/class/${cls}`);
    setStudents(data);
  };

  const mark = async (id, status) => {
    await api.post("/attendance/mark", { studentId: id, status });
    alert("Attendance Updated");
  };

  return (
    <div className="container">
      <h2>Mark Attendance</h2>

      <select 
        value={selectedClass} 
        onChange={(e) => { setSelectedClass(e.target.value); filterStudents(e.target.value); }}
      >
        <option value="">Select Class</option>
        <option value="1">Class 1</option>
        <option value="2">Class 2</option>
        {/* dynamic mapping better hoga */}
      </select>

      <ul>
        {students.map(s => (
          <li key={s._id} style={{ marginBottom: 8 }}>
            {s.name} ({s.rollNumber})
            <button onClick={() => mark(s._id, "present")} style={{ marginLeft: 10 }}>Present</button>
            <button onClick={() => mark(s._id, "absent")} style={{ marginLeft: 10 }}>Absent</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
