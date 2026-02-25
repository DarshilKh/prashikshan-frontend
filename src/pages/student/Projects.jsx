// src/pages/student/Projects.jsx
import React from "react";
import { useOutletContext } from "react-router-dom";
import ProjectsPage from "../Projects";

const StudentProjects = () => {
  const { userRole } = useOutletContext();
  return <ProjectsPage userRole={userRole} />;
};

export default StudentProjects;