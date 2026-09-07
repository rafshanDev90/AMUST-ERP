import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App.jsx";
import "./styles/index.css";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in client/.env");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={publishableKey} afterSignInUrl="/dashboard" afterSignUpUrl="/dashboard">
      <App />
    </ClerkProvider>
  </StrictMode>
);
