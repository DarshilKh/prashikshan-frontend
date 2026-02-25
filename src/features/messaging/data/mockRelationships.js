/**
 * Mock Relationships Data
 *
 * Defines faculty-student and company-intern relationships
 * DELETE THIS FILE WHEN BACKEND IS READY
 */

export const mockFacultyStudentRelationships = [
  {
    id: "rel_fs_001",
    facultyId: "faculty_001",
    facultyName: "Dr. Priya Mehta",
    studentId: "student_001",
    studentName: "Aarav Sharma",
    type: "MENTOR",
    status: "ACTIVE",
    internshipId: "active_intern_001",
    internshipTitle: "AI Resume Screener",
    companyName: "DataMind Analytics",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
  },
  {
    id: "rel_fs_002",
    facultyId: "faculty_001",
    facultyName: "Dr. Priya Mehta",
    studentId: "student_002",
    studentName: "Priya Patel",
    type: "MENTOR",
    status: "ACTIVE",
    internshipId: null, // No active internship yet
    startDate: "2023-08-01",
    endDate: null,
  },
];

export const mockCompanyStudentRelationships = [
  {
    id: "rel_cs_001",
    companyId: "company_datamind",
    companyName: "DataMind Analytics",
    studentId: "student_001",
    studentName: "Aarav Sharma",
    type: "INTERN",
    status: "ACTIVE",
    internshipId: "active_intern_001",
    internshipTitle: "AI Resume Screener",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    industryMentorId: "industry_mentor_001",
    industryMentorName: "Rajesh Kumar",
  },
];

/**
 * Get relationship between faculty and student
 */
export const getFacultyStudentRelationship = (facultyId, studentId) => {
  return mockFacultyStudentRelationships.find(
    (rel) => rel.facultyId === facultyId && rel.studentId === studentId,
  );
};

/**
 * Get all students for a faculty member
 */
export const getStudentsForFaculty = (facultyId) => {
  return mockFacultyStudentRelationships
    .filter((rel) => rel.facultyId === facultyId && rel.status === "ACTIVE")
    .map((rel) => ({
      studentId: rel.studentId,
      studentName: rel.studentName,
      internshipTitle: rel.internshipTitle,
      companyName: rel.companyName,
    }));
};

/**
 * Get relationship between company and student
 */
export const getCompanyStudentRelationship = (companyId, studentId) => {
  return mockCompanyStudentRelationships.find(
    (rel) => rel.companyId === companyId && rel.studentId === studentId,
  );
};

export default {
  mockFacultyStudentRelationships,
  mockCompanyStudentRelationships,
  getFacultyStudentRelationship,
  getStudentsForFaculty,
  getCompanyStudentRelationship,
};
