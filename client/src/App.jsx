import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import AppShell from "./components/AppShell.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Dashboard from "./pages/Dashboard.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-in/*" element={<SignIn />} />
        <Route path="/sign-up/*" element={<SignUp />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppShell>
                <Dashboard />
              </AppShell>
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route
          path="/*"
          element={
            <SignedIn>
              <AppShell>
                <div style={{ padding: "2rem" }}>
                  <h2>Page Under Construction</h2>
                  <p>This feature will be built in a future phase.</p>
                </div>
              </AppShell>
            </SignedIn>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
