// src/pages/faculty/Profile.jsx
import React from "react";
import { useOutletContext } from "react-router-dom";
import ProfilePage from "../Profile";

const FacultyProfile = () => {
  const { userRole, navigate } = useOutletContext();
  return <ProfilePage userRole={userRole} navigate={navigate} />;
};

export default FacultyProfile;