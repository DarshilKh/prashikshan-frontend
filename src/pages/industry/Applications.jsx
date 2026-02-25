// src/pages/industry/Applications.jsx
import React from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import ApplicationsPage from "../Applications";

const IndustryApplications = () => {
  const { userRole } = useOutletContext();
  const navigate = useNavigate();

  const handleViewApplication = (applicationId) => {
    navigate(`/industry/application/${applicationId}`);
  };

  return (
    <ApplicationsPage
      userRole={userRole}
      setSelectedInternship={(internship) => handleViewApplication(internship?.id)}
      navigate={(page) => navigate(`/industry/${page}`)}
    />
  );
};

export default IndustryApplications;