// src/pages/student/Profile.jsx
import React from "react";
import { useOutletContext } from "react-router-dom";
import ProfilePage from "../Profile";

const StudentProfile = () => {
  const { userRole, navigate } = useOutletContext();
  return <ProfilePage userRole={userRole} navigate={navigate} />;
};

export default StudentProfile;