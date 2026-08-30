// frontend/src/pages/Teachers.jsx
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import api from "../../../api/api";

export default function Teachers() {
  // Teacher list
  const [teachers, setTeachers] = useState([]);
  // Add/edit form data
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    className: "",
    section: "",
    password: "",
  });
  // Agar edit mode me hain to yaha teacher ka id save hoga
  const [editingId, setEditingId] = useState(null);

  // Add hone ke baad admin ko credentials dikhane ke liye
  const [lastCreds, setLastCreds] = useState(null);

  useEffect(() => {
    loadTeachers();
  }, []);

  // Backend se teacher list laana
  const loadTeachers = async () => {
    const { data } = await api.get("/teachers");
    setTeachers(data);
  };

  // Add / Save button pe click
  const submit = async (e) => {
  e.preventDefault();

  try {
    const body = {
  name: form.name,
  email: form.email,
  phone: form.phone,
  subject: form.subject,
  class: form.className,     // ✅ FIX
  section: form.section,
  password: form.password
};


    const { data } = await api.post("/teachers", body);

    setLastCreds(data.credentials || null);

    // reset form
    setForm({
      name: "",
      email: "",
      phone: "",
      subject: "",
      className: "",
      section: "",
      password: ""
    });

    loadTeachers();

  } catch (err) {
    alert(
      err.response?.data?.message ||
      "Failed to add teacher"
    );
  }
};


  // Edit click -> form ko fill karo
  const startEdit = (t) => {
    setEditingId(t._id);
    setForm({
      name: t.name,
      email: t.email,    // edit ke time email change allowable ya nahi – abhi sirf display
      phone: t.phone || "",
      subject: t.subject,
      class: t.class,
      section: t.section,
      password: "",      // edit ke time password change nahi kar rahe
    });
  };

  // Delete teacher
  const removeTeacher = async (id) => {
    if (!window.confirm("Delete this teacher?")) return;
    await api.delete(`/teachers/${id}`);
    loadTeachers();
  };

  return (
    <div className="container">
      <h2>Teachers (Admin)</h2>

      {/* ADD / EDIT FORM */}
      <form onSubmit={submit} className="card" style={{ marginBottom: 16 }}>
        <h3>{editingId ? "Edit Teacher" : "Add Teacher"}</h3>

        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          type="email"
          placeholder="Email (Login ID)"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required={!editingId} // add ke time required, edit ke time optional
        />

        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input
          placeholder="Subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          required
        />

        <input
          placeholder="Class"
          value={form.className}
          onChange={(e) => setForm({ ...form, className: e.target.value })}
          required
        />

        <input
          placeholder="Section"
          value={form.section}
          onChange={(e) => setForm({ ...form, section: e.target.value })}
          required
        />

        {/* Password only while creating */}
        {!editingId && (
          <input
            type="password"
            placeholder="Password (for teacher login)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        )}

        <button type="submit">
          {editingId ? "Save Changes" : "Add Teacher"}
        </button>
      </form>

      {/* Last created teacher credentials */}
      {lastCreds && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h4>Last Created Teacher Credentials</h4>
          <p>
            Email (Login ID): <b>{lastCreds.email}</b>
          </p>
          <p>
            Password: <b>{lastCreds.password}</b>
          </p>
        </div>
      )}

      {/* TEACHER LIST */}
      <h3>All Teachers</h3>
      <ul>
        {teachers.map((t) => (
          <li
            key={t._id}
            style={{
              marginBottom: 8,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Teacher info */}
            <span>
              <Link to={`/admin/teachers/${t._id}`}>
                <b>{t.name}</b> — {t.email} — {t.subject} ({t.class} {t.section})
              </Link>
            </span>

            {/* Actions */}
            <span>
              <button onClick={() => startEdit(t)}>Edit</button>
              <button
                onClick={() => removeTeacher(t._id)}
                style={{ marginLeft: 8 }}
              >
                Delete
              </button>
            </span>
          </li>
        ))}
      </ul>

      {teachers.length === 0 && <p>No teachers found</p>}
    </div>
  );
}
