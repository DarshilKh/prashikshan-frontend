// src/pages/faculty/Reports.jsx
import React from "react";
import { useOutletContext } from "react-router-dom";
import ReportsPage from "../Reports";

const FacultyReports = () => {
  const { userRole } = useOutletContext();
  return <ReportsPage userRole={userRole} />;
};

export default FacultyReports;