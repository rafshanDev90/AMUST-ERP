import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/api";

export default function Students() {
  const [classes, setClasses] = useState([]);
  const [currentClass, setCurrentClass] = useState("");
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [lastCreds, setLastCreds] = useState(null);

  const [form, setForm] = useState({
  name: "",
  dob: "",              // ✅ ADD
  gender: "",           // ✅ ADD
  class: "",
  section: "",
  rollNumber: "",
  address: "",          // ✅ ADD

  loginId: "",
  studentPassword: "",

  parentName: "",
  parentPhone: "",
  parentPassword: ""
});


  const nav = useNavigate();

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    const { data } = await api.get("/students");
    const classList = [...new Set(data.map((s) => s.class))];
    setClasses(classList);
  };

  const loadStudentsByClass = async (className) => {
    setCurrentClass(className);
    const { data } = await api.get(`/students/class/${className}`);
    setStudents(data);
  };

  const add = async (e) => {
    e.preventDefault();
    console.log("ADD FUNCTION TRIGGERED", form); // DEBUG

    const body = {
      name: form.name,
      dob: form.dob,  
      gender: form.gender,
      address: form.address,
      class: form.class,
      section: form.section,
      rollNumber: form.rollNumber,
      loginId: form.loginId,
      studentPassword: form.studentPassword,
      parentName: form.parentName,
      parentPhone: form.parentPhone,
      parentPassword: form.parentPassword,
    };

    const { data } = await api.post("/students", body);

    setLastCreds(data.credentials || null);

    setForm({
  name: "",
  dob: "",
  gender: "",
  class: "",
  section: "",
  rollNumber: "",
  address: "",
  loginId: "",
  studentPassword: "",
  parentName: "",
  parentPhone: "",
  parentPassword: ""
});


    loadClasses();
  };

  const removeStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;
    await api.delete(`/students/${id}`);
    if (currentClass) loadStudentsByClass(currentClass);
    else loadClasses();
  };

  const filteredStudents = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      (s.rollNumber && s.rollNumber.toString().includes(q))
    );
  });

  return (
    <div className="container">
      <h2>Students</h2>

      {/* Add Student Form */}
      <form onSubmit={add} className="card">
        <input
          placeholder="Student Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          type="date"
          placeholder="Date of Birth"
          value={form.dob}
          onChange={(e) => setForm({ ...form, dob: e.target.value })}
          required
        />

        <select
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <input
          placeholder="Class"
          value={form.class}
          onChange={(e) => setForm({ ...form, class: e.target.value })}
          required
        />

        <input
          placeholder="Section"
          value={form.section}
          onChange={(e) => setForm({ ...form, section: e.target.value })}
          required
        />

        <input
          placeholder="Roll Number"
          value={form.rollNumber}
          onChange={(e) => setForm({ ...form, rollNumber: e.target.value })}
          required
        />

        <input
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          required
        />

        <input
          placeholder="Student Login ID"
          value={form.loginId}
          onChange={(e) => setForm({ ...form, loginId: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Student Password"
          value={form.studentPassword}
          onChange={(e) =>
            setForm({ ...form, studentPassword: e.target.value })
          }
          required
        />

        {/* Parent section */}
        <h4>Parent Information</h4>

        <input
          placeholder="Parent Name"
          value={form.parentName}
          onChange={(e) => setForm({ ...form, parentName: e.target.value })}
          required
        />

        <input
          placeholder="Parent Phone"
          value={form.parentPhone}
          onChange={(e) => setForm({ ...form, parentPhone: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Parent Password"
          value={form.parentPassword}
          onChange={(e) => setForm({ ...form, parentPassword: e.target.value })}
          required
        />

        <button type="submit">Add Student</button>
      </form>

      {/* Show last created credentials */}
      {lastCreds && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h4>Last Created Credentials</h4>
          <p>
            Student Enrollment: <b>{lastCreds.loginId}</b>
          </p>
          <p>
            Student Password: <b>{lastCreds.studentPassword}</b>
          </p>
          {lastCreds.parentLoginId && (
            <>
              <p>
                Parent Login Id: <b>{lastCreds.parentLoginId}</b>
              </p>
              <p>
                Parent Password: <b>{lastCreds.parentPassword}</b>
              </p>
            </>
          )}
        </div>
      )}

      <h3>Classes</h3>
      <div style={{ marginBottom: 15 }}>
        {classes.map((c) => (
          <button
            key={c}
            onClick={() => loadStudentsByClass(c)}
            style={{
              marginRight: 10,
              background: currentClass === c ? "#3b82f6" : "#ddd",
              color: currentClass === c ? "white" : "black",
            }}
          >
            Class {c}
          </button>
        ))}
      </div>

      {currentClass && (
        <>
          <h3>Students of Class {currentClass}</h3>
          <input
            placeholder="Search by name or roll number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginBottom: 10, padding: 6, width: "100%" }}
          />

          <ul>
            {filteredStudents.map((s) => (
              <li
                key={s._id}
                style={{
                  marginBottom: 8,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <button
                  onClick={() => nav(`/student/${s._id}`)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: 16,
                    cursor: "pointer",
                    color: "#007bff",
                  }}
                >
                  {s.rollNumber}. {s.name}
                </button>

                <button
                  onClick={() => removeStudent(s._id)}
                  style={{ marginLeft: 10 }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>

          {filteredStudents.length === 0 && <p>No students found</p>}
        </>
      )}
    </div>
  );
}
