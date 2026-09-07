import { UserButton } from "@clerk/clerk-react";
import { Link, useLocation } from "react-router-dom";

export default function AppShell({ children }) {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
  ];

  return (
    <div className="app-shell">
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/dashboard" className="nav-brand">
            SERP
          </Link>
          <div className="nav-links">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="nav-right">
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
