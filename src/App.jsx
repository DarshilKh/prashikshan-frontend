// src/App.jsx
import React, { useEffect } from "react";
import AppRoutes from "./routes";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { user, logout } = useAuth();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return <AppRoutes />;
}

export default App;