// src/pages/student/Notices.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/api";

export default function StudentNotices() {
  const [list, setList] = useState([]);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await api.get("/notices");
    setList(data);
  };

  return (
    <>
      <h2>Notices</h2>
      {list.map(n => (
        <div key={n._id} className="card">
          <h4>{n.title}</h4>
          <p>{n.message}</p>
        </div>
      ))}
    </>
  );
}
