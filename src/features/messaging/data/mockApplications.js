/**
 * Mock Applications Data
 *
 * Links applications to messaging permissions.
 * DELETE THIS FILE WHEN BACKEND IS READY
 */

import { APPLICATION_STATUS } from "../config/applicationRules";

export const mockApplications = [
  {
    id: "app_001",
    studentId: "student_001",
    companyId: "company_001",
    internshipId: "intern_001",
    internshipTitle: "AI/ML Intern",
    companyName: "TechNova Solutions",
    status: APPLICATION_STATUS.INTERVIEW_SCHEDULED,
    appliedAt: "2024-01-10T09:00:00Z",
    lastUpdated: "2024-01-18T14:30:00Z",
    conversationId: "conv_001",
  },
  {
    id: "app_002",
    studentId: "student_001",
    companyId: "company_greenGrid",
    internshipId: "intern_002",
    internshipTitle: "IoT Energy Monitor",
    companyName: "GreenGrid Solutions",
    status: APPLICATION_STATUS.UNDER_REVIEW,
    appliedAt: "2024-01-12T10:00:00Z",
    lastUpdated: "2024-01-15T11:30:00Z",
    conversationId: "conv_003",
  },
  {
    id: "app_003",
    studentId: "student_001",
    companyId: "company_002",
    internshipId: "intern_003",
    internshipTitle: "Frontend Developer Intern",
    companyName: "WebCraft Studios",
    status: APPLICATION_STATUS.OFFER_MADE,
    appliedAt: "2024-01-05T09:00:00Z",
    lastUpdated: "2024-01-16T10:00:00Z",
    conversationId: "conv_004",
  },
  {
    id: "app_004",
    studentId: "student_001",
    companyId: "company_003",
    internshipId: "intern_004",
    internshipTitle: "Data Analyst Intern",
    companyName: "Analytics Pro Inc",
    status: APPLICATION_STATUS.PENDING,
    appliedAt: "2024-01-14T15:00:00Z",
    lastUpdated: "2024-01-14T15:00:00Z",
    conversationId: "conv_005",
  },
  {
    id: "app_005",
    studentId: "student_001",
    companyId: "company_004",
    internshipId: "intern_005",
    internshipTitle: "Backend Developer Intern",
    companyName: "CloudScale Systems",
    status: APPLICATION_STATUS.REJECTED,
    appliedAt: "2024-01-08T10:00:00Z",
    lastUpdated: "2024-01-12T09:00:00Z",
    conversationId: "conv_006",
  },
];

// Active internships (accepted offers)
export const mockActiveInternships = [
  {
    id: "active_intern_001",
    applicationId: "app_accepted_001",
    studentId: "student_001",
    companyId: "company_datamind",
    internshipTitle: "AI Resume Screener",
    companyName: "DataMind Analytics",
    status: "IN_PROGRESS",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    facultyMentorId: "faculty_001",
  },
];

export default mockApplications;
