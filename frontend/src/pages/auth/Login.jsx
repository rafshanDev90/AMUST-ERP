import React, { useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [mode, setMode] = useState("admin"); // admin | teacher | student | parent
  const [email, setEmail] = useState("");
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [parentLoginId, setParentLoginId] = useState("");
  const [password, setPassword] = useState("");

  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      let body = {};

      if (mode === "admin" || mode === "teacher") {
        body = { email, password };
      } else if (mode === "student") {
        body = { loginId: email, password };
      } else if (mode === "parent") {
        body = { parentPhone: email, password };
      }

      const { data } = await api.post("/auth/login", body);

      // Save token & user in localStorage so app can read them
      sessionStorage.setItem("token", data.token);
sessionStorage.setItem("user", JSON.stringify(data.user));

      // Decide destination route based on role (but ensure studentId is present before using it)
      let dest = "/";

      if (data.user.role === "admin") {
        dest = "/admin/dashboard";
      } else if (data.user.role === "teacher") {
        dest = "/teacher/dashboard";
      } else if (data.user.role === "student") {
        dest = "/student/profile";
      } 
      if (data.user.role === "student") {
  if (data.user.studentId) {
    dest = `/student/${data.user.studentId}/overview`;
  }
}
if (data.user.role === "student") {
  if (data.user.studentId) {
    dest = `/student/${data.user.studentId}/overview`;
  }
}


      nav(dest);
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="center">
      <form onSubmit={submit} className="card">
        <h2>Login</h2>

        {/* mode tabs */}
        <div style={{ marginBottom: 12 }}>
          {["admin", "teacher", "student", "parent"].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              style={{
                marginRight: 6,
                padding: "4px 8px",
                background: mode === m ? "#3b82f6" : "#ddd",
                color: mode === m ? "#fff" : "#000",
                border: "none",
                cursor: "pointer",
              }}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Admin/Teacher login */}
        {(mode === "admin" || mode === "teacher") && (
          <>
            <input
              type="email"
              placeholder="Email (Admin / Teacher)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </>
        )}

        {/* Student login input — use same email state for the value */}
        {mode === "student" && (
          <input
            placeholder="Student Login ID"
            value={email} // use `email` state as shared input
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        )}

        {/* Parent login input — use same email state to take phone */}
        {mode === "parent" && (
          <input
            placeholder="Parent Phone Number"
            value={email} // use `email` state as phone
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        )}

        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button>Login</button>
      </form>
    </div>
  );
}
