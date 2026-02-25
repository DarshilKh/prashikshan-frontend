// src/pages/industry/Profile.jsx
import React from "react";
import { useOutletContext } from "react-router-dom";
import ProfilePage from "../Profile";

const IndustryProfile = () => {
  const { userRole, navigate } = useOutletContext();
  return <ProfilePage userRole={userRole} navigate={navigate} />;
};

export default IndustryProfile;