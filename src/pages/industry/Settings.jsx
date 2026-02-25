// src/pages/industry/Settings.jsx
import React from "react";
import { useOutletContext } from "react-router-dom";
import SettingsPage from "../Settings";

const IndustrySettings = () => {
  const { userRole } = useOutletContext();
  return <SettingsPage userRole={userRole} />;
};

export default IndustrySettings;