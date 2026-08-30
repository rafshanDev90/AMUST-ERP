import React, { useEffect, useState } from "react";
import api from "../../api/api";

export default function TeacherFees() {
  const [fees, setFees] = useState([]);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await api.get("/fees");
    setFees(data);
  };

  return (
    <div className="container">
      <h2>Student Fees Overview</h2>

      <ul>
        {fees.map(f => (
          <li key={f._id} className="card">
            {f.studentName} — ₹{f.amount} — {f.paid ? "Paid" : "Pending"}
          </li>
        ))}
      </ul>
    </div>
  );
}
