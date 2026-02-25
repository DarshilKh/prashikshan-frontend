// src/pages/industry/Openings.jsx
import React from "react";
import { useOutletContext } from "react-router-dom";
import OpeningsPage from "../Openings";

const IndustryOpenings = () => {
  const { userRole } = useOutletContext();
  return <OpeningsPage userRole={userRole} />;
};

export default IndustryOpenings;