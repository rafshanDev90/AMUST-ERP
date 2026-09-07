import { useState, useEffect } from "react";
import useApi from "../hooks/useApi.js";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const { request, loading, error } = useApi();

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await request("/auth/me");
        setProfile(res.data.user);
      } catch (err) {
        // error is handled by useApi
      }
    }
    loadProfile();
  }, [request]);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  const cards = [
    { title: "Today's Classes", emoji: "📚", content: "Coming in Feature 1" },
    { title: "Urgent Deadlines", emoji: "⏰", content: "Coming in Feature 2" },
    { title: "Recent Grades", emoji: "📊", content: "Coming in Feature 2" },
    { title: "Quick Access Documents", emoji: "📁", content: "Coming in Feature 3" },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {profile?.name || "Student"}!</h1>
        <p className="subtitle">
          {profile?.email} • {profile?.role}
        </p>
      </div>

      <div className="card-grid">
        {cards.map((card) => (
          <div key={card.title} className="card">
            <div className="card-emoji">{card.emoji}</div>
            <h3>{card.title}</h3>
            <p>{card.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
