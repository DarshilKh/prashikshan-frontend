// src/pages/faculty/Settings.jsx
import React from "react";
import { useOutletContext } from "react-router-dom";
import SettingsPage from "../Settings";

const FacultySettings = () => {
  const { userRole } = useOutletContext();
  return <SettingsPage userRole={userRole} />;
};

export default FacultySettings;