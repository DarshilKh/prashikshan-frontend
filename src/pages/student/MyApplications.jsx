// src/pages/student/MyApplications.jsx
import React from "react";
import { useOutletContext } from "react-router-dom";
import MyApplicationsPage from "../MyApplications";

const StudentMyApplications = () => {
  const { userRole } = useOutletContext();
  return <MyApplicationsPage userRole={userRole} />;
};

export default StudentMyApplications;