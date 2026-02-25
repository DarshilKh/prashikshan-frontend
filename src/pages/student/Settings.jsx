// src/pages/student/Settings.jsx
import React from "react";
import { useOutletContext } from "react-router-dom";
import SettingsPage from "../Settings";

const StudentSettings = () => {
  const { userRole } = useOutletContext();
  return <SettingsPage userRole={userRole} />;
};

export default StudentSettings;