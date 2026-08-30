// src/pages/student/Fees.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useParams } from "react-router-dom";

export default function Fees() {
  const { id } = useParams();
  const [fees, setFees] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data } = await api.get(`/students/${id}/profile`);
    setFees(data.fees);
  };

  return (
    <>
      <h2>Fees Records</h2>
      <ul>
        {fees.map(f => (
          <li key={f._id}>
            ₹{f.amount} — {f.paid ? "Paid" : "Pending"}
          </li>
        ))}
      </ul>
    </>
  );
}
