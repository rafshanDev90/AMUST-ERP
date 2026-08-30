// src/App.jsx
import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

/**
 * App.jsx
 * ----------
 * Ye application ka ROOT component hai
 * Yahin se routing system start hota hai
 */
export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
