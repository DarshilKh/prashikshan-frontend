/**
 * Mock Messages Data
 *
 * DELETE THIS FILE WHEN BACKEND IS READY
 */

import { MESSAGE_TYPES, SENDER_TYPES } from "../config/messageTypes";

export const mockMessages = {
  // ============================================
  // STUDENT CONVERSATIONS
  // ============================================

  // Messages for conversation conv_001 (Interview)
  conv_001: [
    {
      id: "msg_001_001",
      conversationId: "conv_001",
      type: MESSAGE_TYPES.STATUS_UPDATE.id,

      sender: {
        id: "company_001",
        type: SENDER_TYPES.INDUSTRY,
        name: "TechNova Solutions",
        role: "HR Team",
      },

      content: {
        subject: "Application Received",
        body: `Dear Aarav,

Thank you for applying to the AI/ML Intern position at TechNova Solutions.

We have received your application and our team will review it shortly. You will be notified of any updates to your application status.

Best regards,
HR Team
TechNova Solutions`,
        html: null,
      },

      attachments: [],

      metadata: {
        isSystemGenerated: true,
        applicationStatus: "PENDING",
      },

      status: {
        sent: true,
        delivered: true,
        read: true,
        readAt: "2024-01-10T09:30:00Z",
      },

      createdAt: "2024-01-10T09:00:00Z",
    },
    {
      id: "msg_001_002",
      conversationId: "conv_001",
      type: MESSAGE_TYPES.STATUS_UPDATE.id,

      sender: {
        id: "company_001",
        type: SENDER_TYPES.INDUSTRY,
        name: "TechNova Solutions",
        role: "HR Team",
      },

      content: {
        subject: "Application Shortlisted",
        body: `Dear Aarav,

We are pleased to inform you that your application for the AI/ML Intern position has been shortlisted.

Our team was impressed with your profile and we would like to proceed with the next steps of the selection process.

You will receive interview details shortly.

Best regards,
HR Team
TechNova Solutions`,
        html: null,
      },

      attachments: [],

      metadata: {
        isSystemGenerated: false,
        applicationStatus: "SHORTLISTED",
      },

      status: {
        sent: true,
        delivered: true,
        read: true,
        readAt: "2024-01-15T10:00:00Z",
      },

      createdAt: "2024-01-15T09:00:00Z",
    },
    {
      id: "msg_001_003",
      conversationId: "conv_001",
      type: MESSAGE_TYPES.INTERVIEW.id,

      sender: {
        id: "company_001",
        type: SENDER_TYPES.INDUSTRY,
        name: "TechNova Solutions",
        role: "HR Team",
      },

      content: {
        subject: "Interview Invitation - AI/ML Intern",
        body: `Dear Aarav,

Thank you for your application to the AI/ML Intern position at TechNova Solutions.

We are pleased to inform you that your profile has been shortlisted for an interview. Please find the details below:

📅 Date: Monday, January 22, 2024
⏰ Time: 3:00 PM IST
📍 Mode: Video Call (Google Meet)
🔗 Link: meet.google.com/abc-defg-hij

Interview Structure:
1. Technical Discussion (30 mins)
2. Problem Solving (20 mins)
3. Q&A Session (10 mins)

Please confirm your availability by replying to this message.

Best regards,
HR Team
TechNova Solutions`,
        html: null,
      },

      attachments: [
        {
          id: "att_001",
          name: "Interview_Details.ics",
          type: "text/calendar",
          size: 2048,
          url: "/mock/attachments/interview.ics",
        },
        {
          id: "att_002",
          name: "Company_Overview.pdf",
          type: "application/pdf",
          size: 1258291,
          url: "/mock/attachments/company.pdf",
        },
      ],

      metadata: {
        isSystemGenerated: false,
        applicationStatus: "INTERVIEW_SCHEDULED",
        requiresAction: true,
        actionType: "CONFIRM_INTERVIEW",
        actionDeadline: "2024-01-20T23:59:59Z",
      },

      status: {
        sent: true,
        delivered: true,
        read: false,
        readAt: null,
      },

      createdAt: "2024-01-18T14:30:00Z",
    },
  ],

  // Messages for conversation conv_002 (Faculty)
  conv_002: [
    {
      id: "msg_002_001",
      conversationId: "conv_002",
      type: MESSAGE_TYPES.ACADEMIC.id,

      sender: {
        id: "faculty_001",
        type: SENDER_TYPES.FACULTY,
        name: "Dr. Priya Mehta",
        role: "Faculty Mentor",
      },

      content: {
        subject: "Internship Progress Check-in",
        body: `Dear Aarav,

I hope your internship at DataMind Analytics is going well.

As your faculty mentor, I would like to schedule regular progress updates. Please submit your weekly progress reports every Friday by 5:00 PM.

Your first report (Week 3) is due this Friday. Please include:
- Tasks completed this week
- Challenges faced
- Learnings and skills developed
- Plans for next week

Let me know if you have any questions.

Best regards,
Dr. Priya Mehta
Department of Computer Science`,
        html: null,
      },

      attachments: [
        {
          id: "att_003",
          name: "Progress_Report_Template.docx",
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          size: 45056,
          url: "/mock/attachments/template.docx",
        },
      ],

      metadata: {
        isSystemGenerated: false,
      },

      status: {
        sent: true,
        delivered: true,
        read: true,
        readAt: "2024-01-15T11:00:00Z",
      },

      createdAt: "2024-01-15T10:00:00Z",
    },
    {
      id: "msg_002_002",
      conversationId: "conv_002",
      type: MESSAGE_TYPES.ASSIGNMENT.id,

      sender: {
        id: "faculty_001",
        type: SENDER_TYPES.FACULTY,
        name: "Dr. Priya Mehta",
        role: "Faculty Mentor",
      },

      content: {
        subject: "Weekly Progress Report - Week 3 Reminder",
        body: `Dear Aarav,

This is a reminder that your Week 3 progress report is due by Friday, January 19th at 5:00 PM.

Please include the updated metrics dashboard as discussed in our last meeting. Also, ensure you document any API integration challenges you mentioned.

If you need any guidance on the report format, refer to the template I shared earlier.

Best regards,
Dr. Priya Mehta`,
        html: null,
      },

      attachments: [
        {
          id: "att_004",
          name: "Metrics_Guidelines.pdf",
          type: "application/pdf",
          size: 128000,
          url: "/mock/attachments/metrics.pdf",
        },
        {
          id: "att_005",
          name: "Sample_Dashboard.png",
          type: "image/png",
          size: 256000,
          url: "/mock/attachments/dashboard.png",
        },
      ],

      metadata: {
        isSystemGenerated: false,
        requiresAction: true,
        actionType: "SUBMIT_REPORT",
        actionDeadline: "2024-01-19T17:00:00Z",
      },

      status: {
        sent: true,
        delivered: true,
        read: true,
        readAt: "2024-01-17T16:30:00Z",
      },

      createdAt: "2024-01-17T16:15:00Z",
    },
  ],

  // Messages for conversation conv_003 (System notification)
  conv_003: [
    {
      id: "msg_003_001",
      conversationId: "conv_003",
      type: MESSAGE_TYPES.STATUS_UPDATE.id,

      sender: {
        id: "system",
        type: SENDER_TYPES.SYSTEM,
        name: "Platform Notification",
        role: "System",
      },

      content: {
        subject: "Application Status Update",
        body: `Your application for "IoT Energy Monitor" at GreenGrid Solutions has been moved to "Under Review".

The company is currently reviewing your application. You will be notified of any updates.

No action is required at this time.

This is an automated notification. Please do not reply to this message.`,
        html: null,
      },

      attachments: [],

      metadata: {
        isSystemGenerated: true,
        applicationId: "app_002",
        previousStatus: "PENDING",
        newStatus: "UNDER_REVIEW",
      },

      status: {
        sent: true,
        delivered: true,
        read: true,
        readAt: "2024-01-15T12:00:00Z",
      },

      createdAt: "2024-01-15T11:30:00Z",
    },
  ],

  // Messages for conversation conv_004 (Offer)
  conv_004: [
    {
      id: "msg_004_001",
      conversationId: "conv_004",
      type: MESSAGE_TYPES.STATUS_UPDATE.id,

      sender: {
        id: "company_002",
        type: SENDER_TYPES.INDUSTRY,
        name: "WebCraft Studios",
        role: "Hiring Manager",
      },

      content: {
        subject: "Application Received",
        body: "Thank you for applying to the Frontend Developer Intern position. We will review your application shortly.",
        html: null,
      },

      attachments: [],

      metadata: {
        isSystemGenerated: true,
        applicationStatus: "PENDING",
      },

      status: {
        sent: true,
        delivered: true,
        read: true,
        readAt: "2024-01-05T10:00:00Z",
      },
      createdAt: "2024-01-05T09:00:00Z",
    },
    {
      id: "msg_004_002",
      conversationId: "conv_004",
      type: MESSAGE_TYPES.INTERVIEW.id,

      sender: {
        id: "company_002",
        type: SENDER_TYPES.INDUSTRY,
        name: "WebCraft Studios",
        role: "Hiring Manager",
      },

      content: {
        subject: "Interview Scheduled",
        body: "We would like to schedule an interview with you. Please confirm your availability for January 12th at 2:00 PM.",
        html: null,
      },

      attachments: [],

      metadata: {
        applicationStatus: "INTERVIEW_SCHEDULED",
        requiresAction: true,
      },

      status: {
        sent: true,
        delivered: true,
        read: true,
        readAt: "2024-01-10T11:00:00Z",
      },
      createdAt: "2024-01-10T10:00:00Z",
    },
    {
      id: "msg_004_003",
      conversationId: "conv_004",
      type: MESSAGE_TYPES.GENERAL.id,

      sender: {
        id: "student_001",
        type: SENDER_TYPES.STUDENT,
        name: "Aarav Sharma",
        role: "Student",
      },

      content: {
        subject: "Re: Interview Scheduled",
        body: `Dear Hiring Manager,

Thank you for the opportunity. I confirm my availability for the interview on January 12th at 2:00 PM.

I look forward to speaking with you.

Best regards,
Aarav Sharma`,
        html: null,
      },

      attachments: [],

      metadata: {},

      status: {
        sent: true,
        delivered: true,
        read: true,
        readAt: "2024-01-10T14:00:00Z",
      },
      createdAt: "2024-01-10T12:00:00Z",
    },
    {
      id: "msg_004_004",
      conversationId: "conv_004",
      type: MESSAGE_TYPES.OFFER.id,

      sender: {
        id: "company_002",
        type: SENDER_TYPES.INDUSTRY,
        name: "WebCraft Studios",
        role: "Hiring Manager",
      },

      content: {
        subject: "Internship Offer - Frontend Developer",
        body: `Dear Aarav,

We are pleased to offer you the Frontend Developer Internship position at WebCraft Studios!

Position Details:
- Role: Frontend Developer Intern
- Duration: 3 months (February - April 2024)
- Stipend: ₹15,000/month
- Location: Remote with occasional office visits

Please find the attached offer letter with complete terms and conditions.

To accept this offer, please reply to this message confirming your acceptance by January 23rd, 2024.

Congratulations!

Best regards,
Hiring Manager
WebCraft Studios`,
        html: null,
      },

      attachments: [
        {
          id: "att_006",
          name: "Offer_Letter_Aarav_Sharma.pdf",
          type: "application/pdf",
          size: 256000,
          url: "/mock/attachments/offer.pdf",
        },
      ],

      metadata: {
        applicationStatus: "OFFER_MADE",
        requiresAction: true,
        actionType: "ACCEPT_OFFER",
        actionDeadline: "2024-01-23T23:59:59Z",
      },

      status: { sent: true, delivered: true, read: false, readAt: null },
      createdAt: "2024-01-16T10:00:00Z",
    },
  ],

  // Messages for conversation conv_005 (Pending - no reply)
  conv_005: [
    {
      id: "msg_005_001",
      conversationId: "conv_005",
      type: MESSAGE_TYPES.STATUS_UPDATE.id,

      sender: {
        id: "company_003",
        type: SENDER_TYPES.INDUSTRY,
        name: "Analytics Pro Inc",
        role: "Recruitment Team",
      },

      content: {
        subject: "Application Received - Data Analyst Intern",
        body: `Dear Aarav,

Thank you for applying to the Data Analyst Intern position at Analytics Pro Inc.

We have received your application and it is currently under review. Our recruitment team will carefully evaluate your profile against our requirements.

You will be notified of any updates to your application status.

Best regards,
Recruitment Team
Analytics Pro Inc`,
        html: null,
      },

      attachments: [],

      metadata: {
        isSystemGenerated: true,
        applicationStatus: "PENDING",
      },

      status: {
        sent: true,
        delivered: true,
        read: true,
        readAt: "2024-01-14T15:30:00Z",
      },
      createdAt: "2024-01-14T15:00:00Z",
    },
  ],

  // Messages for conversation conv_006 (Rejected)
  conv_006: [
    {
      id: "msg_006_001",
      conversationId: "conv_006",
      type: MESSAGE_TYPES.STATUS_UPDATE.id,

      sender: {
        id: "company_004",
        type: SENDER_TYPES.INDUSTRY,
        name: "CloudScale Systems",
        role: "HR Department",
      },

      content: {
        subject: "Application Received",
        body: "Thank you for applying to the Backend Developer Intern position. Your application is being reviewed.",
        html: null,
      },

      attachments: [],

      metadata: { isSystemGenerated: true, applicationStatus: "PENDING" },

      status: {
        sent: true,
        delivered: true,
        read: true,
        readAt: "2024-01-08T11:00:00Z",
      },
      createdAt: "2024-01-08T10:00:00Z",
    },
    {
      id: "msg_006_002",
      conversationId: "conv_006",
      type: MESSAGE_TYPES.STATUS_UPDATE.id,

      sender: {
        id: "company_004",
        type: SENDER_TYPES.INDUSTRY,
        name: "CloudScale Systems",
        role: "HR Department",
      },

      content: {
        subject: "Application Update - Backend Developer Intern",
        body: `Dear Aarav,

Thank you for your interest in CloudScale Systems and for taking the time to apply for the Backend Developer Intern position.

After careful consideration, we regret to inform you that we will not be moving forward with your application at this time. We received many qualified candidates and the competition was very strong.

We encourage you to apply for future opportunities at CloudScale Systems that match your skills and interests.

We wish you the best in your career journey.

Best regards,
HR Department
CloudScale Systems`,
        html: null,
      },

      attachments: [],

      metadata: {
        isSystemGenerated: false,
        applicationStatus: "REJECTED",
      },

      status: {
        sent: true,
        delivered: true,
        read: true,
        readAt: "2024-01-12T10:00:00Z",
      },
      createdAt: "2024-01-12T09:00:00Z",
    },
  ],

  // ============================================
  // FACULTY CONVERSATIONS
  // ============================================

  // Messages for fconv_001 (Faculty <-> Student Priya Patel)
  fconv_001: [
    {
      id: "fmsg_001_001",
      conversationId: "fconv_001",
      type: MESSAGE_TYPES.ACADEMIC.id,

      sender: {
        id: "student_002",
        type: SENDER_TYPES.STUDENT,
        name: "Priya Patel",
        role: "Mentee",
      },

      content: {
        subject: "Weekly Progress Update",
        body: `Dear Dr. Mehta,

Here is my progress update for this week:

1. Completed the data preprocessing module
2. Started working on the feature extraction pipeline
3. Facing some challenges with the model training - accuracy is around 78%

I would appreciate your guidance on improving the model performance.

Also, I had a question about the project timeline - should I prioritize the documentation or the testing phase next?

Regards,
Priya Patel`,
        html: null,
      },

      attachments: [],

      metadata: {
        isSystemGenerated: false,
      },

      status: {
        sent: true,
        delivered: true,
        read: true,
        readAt: "2024-01-15T10:30:00Z",
      },

      createdAt: "2024-01-15T10:00:00Z",
    },
    {
      id: "fmsg_001_002",
      conversationId: "fconv_001",
      type: MESSAGE_TYPES.ACADEMIC.id,

      sender: {
        id: "faculty_001",
        type: SENDER_TYPES.FACULTY,
        name: "Dr. Priya Mehta",
        role: "Faculty Mentor",
      },

      content: {
        subject: "Re: Weekly Progress Update",
        body: `Dear Priya,

Thank you for the detailed update. Good progress on the preprocessing module!

Regarding the model accuracy:
1. Try using cross-validation (k=5) to get more reliable metrics
2. Consider feature selection - not all features may be relevant
3. Look into hyperparameter tuning with GridSearchCV

As for priorities, please focus on testing first - documentation can be done in parallel during the final week.

Please review the attached research paper on similar approaches. It should help with the accuracy issues.

Let's discuss this in detail during our next meeting on Wednesday at 2 PM.

Best regards,
Dr. Priya Mehta`,
        html: null,
      },

      attachments: [
        {
          id: "fatt_001",
          name: "ML_Best_Practices.pdf",
          type: "application/pdf",
          size: 524288,
          url: "/mock/attachments/ml_practices.pdf",
        },
      ],

      metadata: {
        isSystemGenerated: false,
      },

      status: {
        sent: true,
        delivered: true,
        read: true,
        readAt: "2024-01-16T09:00:00Z",
      },

      createdAt: "2024-01-15T14:30:00Z",
    },
    {
      id: "fmsg_001_003",
      conversationId: "fconv_001",
      type: MESSAGE_TYPES.ACADEMIC.id,

      sender: {
        id: "faculty_001",
        type: SENDER_TYPES.FACULTY,
        name: "Dr. Priya Mehta",
        role: "Faculty Mentor",
      },

      content: {
        subject: "Re: Weekly Progress Update - Follow Up",
        body: `Dear Priya,

Thank you for the update. Please focus on the machine learning module this week and try implementing the suggestions I mentioned earlier.

Specific tasks for this week:
1. Implement k-fold cross-validation
2. Run feature importance analysis
3. Document your findings in the progress report

Please submit your revised model results by Friday EOD.

Also, I've scheduled our Wednesday meeting room - it will be in Lab 204.

Best regards,
Dr. Priya Mehta`,
        html: null,
      },

      attachments: [],

      metadata: {
        isSystemGenerated: false,
        requiresAction: true,
        actionType: "SUBMIT_RESULTS",
        actionDeadline: "2024-01-19T17:00:00Z",
      },

      status: {
        sent: true,
        delivered: true,
        read: false,
        readAt: null,
      },

      createdAt: "2024-01-17T11:30:00Z",
    },
  ],

  // ============================================
  // INDUSTRY CONVERSATIONS
  // ============================================

  // Messages for iconversation_001 (TechNova <-> Aarav - Industry perspective)
  iconversation_001: [
    {
      id: "imsg_001_001",
      conversationId: "iconversation_001",
      type: MESSAGE_TYPES.STATUS_UPDATE.id,

      sender: {
        id: "company_001",
        type: SENDER_TYPES.INDUSTRY,
        name: "TechNova Solutions",
        role: "HR Team",
      },

      content: {
        subject: "Application Received - AI/ML Intern",
        body: `Dear Aarav,

Thank you for applying to the AI/ML Intern position at TechNova Solutions.

We have received your application and our team will review it shortly. You will be notified of any updates to your application status.

Best regards,
HR Team
TechNova Solutions`,
        html: null,
      },

      attachments: [],

      metadata: {
        isSystemGenerated: true,
        applicationStatus: "PENDING",
      },

      status: {
        sent: true,
        delivered: true,
        read: true,
        readAt: "2024-01-10T09:30:00Z",
      },

      createdAt: "2024-01-10T09:00:00Z",
    },
    {
      id: "imsg_001_002",
      conversationId: "iconversation_001",
      type: MESSAGE_TYPES.GENERAL.id,

      sender: {
        id: "student_001",
        type: SENDER_TYPES.STUDENT,
        name: "Aarav Sharma",
        role: "Applicant",
      },

      content: {
        subject: "Re: Application - AI/ML Intern",
        body: `Dear TechNova Team,

Thank you for the acknowledgment. I am very excited about this opportunity.

I wanted to mention that I have recently completed a project on Natural Language Processing that is directly relevant to this role. The project involved building a sentiment analysis pipeline using transformer models.

I would be happy to share more details or a demo if that would be helpful.

Looking forward to hearing from you.

Best regards,
Aarav Sharma
B.Tech CSE, 3rd Year`,
        html: null,
      },

      attachments: [
        {
          id: "iatt_001",
          name: "NLP_Project_Summary.pdf",
          type: "application/pdf",
          size: 356000,
          url: "/mock/attachments/nlp_project.pdf",
        },
      ],

      metadata: {},

      status: {
        sent: true,
        delivered: true,
        read: true,
        readAt: "2024-01-12T09:00:00Z",
      },

      createdAt: "2024-01-11T14:00:00Z",
    },
    {
      id: "imsg_001_003",
      conversationId: "iconversation_001",
      type: MESSAGE_TYPES.INTERVIEW.id,

      sender: {
        id: "company_001",
        type: SENDER_TYPES.INDUSTRY,
        name: "TechNova Solutions",
        role: "HR Team",
      },

      content: {
        subject: "Interview Scheduled - AI/ML Intern",
        body: `Dear Aarav,

Thank you for sharing the additional project details. We are impressed with your NLP work!

We would like to schedule a technical interview with you:

📅 Date: Monday, January 22, 2024
⏰ Time: 3:00 PM IST
📍 Mode: Video Call (Google Meet)
🔗 Link: meet.google.com/abc-defg-hij

Interview Structure:
1. Technical Discussion on ML/AI concepts (30 mins)
2. Live Problem Solving (20 mins)
3. Q&A about the role and team (10 mins)

Preparation Tips:
- Review fundamental ML algorithms
- Be ready to discuss your NLP project in detail
- Familiarize yourself with our product (technova.com/products)

Please confirm your availability by replying to this message.

Best regards,
HR Team
TechNova Solutions`,
        html: null,
      },

      attachments: [
        {
          id: "iatt_002",
          name: "Interview_Details.ics",
          type: "text/calendar",
          size: 2048,
          url: "/mock/attachments/interview.ics",
        },
        {
          id: "iatt_003",
          name: "TechNova_AI_Team_Overview.pdf",
          type: "application/pdf",
          size: 1048576,
          url: "/mock/attachments/team_overview.pdf",
        },
      ],

      metadata: {
        isSystemGenerated: false,
        applicationStatus: "INTERVIEW_SCHEDULED",
        requiresAction: true,
        actionType: "CONFIRM_INTERVIEW",
        actionDeadline: "2024-01-20T23:59:59Z",
      },

      status: {
        sent: true,
        delivered: true,
        read: false,
        readAt: null,
      },

      createdAt: "2024-01-18T14:30:00Z",
    },
  ],

  // ============================================
  // ADMIN DIRECT CONVERSATIONS
  // ============================================

  // Admin → Student (Profile Verification)
  admin_conv_001: [
    {
      id: "admin_msg_001_001",
      conversationId: "admin_conv_001",
      type: MESSAGE_TYPES.GENERAL.id,

      sender: {
        id: "admin_001",
        type: SENDER_TYPES.ADMIN,
        name: "Platform Admin",
        role: "Administrator",
      },

      content: {
        subject: "Profile Verification Required",
        body: `Dear Aarav,

We noticed that your profile is missing some required verification documents.

To maintain the quality and trust of our platform, we require all students to verify their identity. Please upload the following documents:

1. College ID Card (front and back)
2. Enrollment Certificate or Bonafide Certificate
3. A recent passport-size photograph

You can upload these from your Profile → Documents section.

If you face any issues, please reply to this message and we'll help you out.

Best regards,
Prashikshan Admin Team`,
        html: null,
      },

      attachments: [],

      metadata: {
        isAdminDirect: true,
        priority: "HIGH",
        category: "VERIFICATION",
      },

      status: {
        sent: true,
        delivered: true,
        read: true,
        readAt: "2024-01-18T10:00:00Z",
      },

      createdAt: "2024-01-18T09:00:00Z",
    },
    {
      id: "admin_msg_001_002",
      conversationId: "admin_conv_001",
      type: MESSAGE_TYPES.GENERAL.id,

      sender: {
        id: "admin_001",
        type: SENDER_TYPES.ADMIN,
        name: "Platform Admin",
        role: "Administrator",
      },

      content: {
        subject: "Re: Profile Verification Required - Reminder",
        body: `Dear Aarav,

This is a gentle reminder regarding the pending document verification.

Please upload your college ID card and enrollment certificate by January 25th to avoid any restrictions on your account.

If you've already uploaded them, please disregard this message. Our team will verify within 24 hours.

Thank you for your cooperation.

Best regards,
Prashikshan Admin Team`,
        html: null,
      },

      attachments: [],

      metadata: {
        isAdminDirect: true,
        priority: "HIGH",
        category: "VERIFICATION",
        requiresAction: true,
        actionDeadline: "2024-01-25T23:59:59Z",
      },

      status: {
        sent: true,
        delivered: true,
        read: false,
        readAt: null,
      },

      createdAt: "2024-01-19T10:00:00Z",
    },
  ],

  // Admin → Company (Profile Review)
  admin_conv_002: [
    {
      id: "admin_msg_002_001",
      conversationId: "admin_conv_002",
      type: MESSAGE_TYPES.GENERAL.id,

      sender: {
        id: "admin_001",
        type: SENDER_TYPES.ADMIN,
        name: "Platform Admin",
        role: "Administrator",
      },

      content: {
        subject: "Company Profile Review",
        body: `Dear TechNova Solutions Team,

Thank you for registering on Prashikshan. Before we can activate your company profile for posting internships, we need to verify a few details:

1. Please confirm your registered business name and GSTIN
2. Upload a company registration certificate
3. Provide the LinkedIn profile of your HR contact person

This is a one-time verification process to ensure student safety on our platform.

Best regards,
Prashikshan Admin Team`,
        html: null,
      },

      attachments: [],

      metadata: {
        isAdminDirect: true,
        category: "COMPANY_VERIFICATION",
      },

      status: {
        sent: true,
        delivered: true,
        read: true,
        readAt: "2024-01-15T10:00:00Z",
      },

      createdAt: "2024-01-15T09:00:00Z",
    },
    {
      id: "admin_msg_002_002",
      conversationId: "admin_conv_002",
      type: MESSAGE_TYPES.GENERAL.id,

      sender: {
        id: "company_001",
        type: SENDER_TYPES.INDUSTRY,
        name: "TechNova Solutions",
        role: "HR Team",
      },

      content: {
        subject: "Re: Company Profile Review",
        body: `Dear Admin Team,

Thank you for reaching out. Please find the requested information:

1. Registered Name: TechNova Solutions Pvt. Ltd.
   GSTIN: 07AABCT1234F1ZP

2. Company registration certificate is attached.

3. HR Contact LinkedIn: linkedin.com/in/rajesh-kumar-technova

Please let us know if you need anything else.

Best regards,
HR Team
TechNova Solutions`,
        html: null,
      },

      attachments: [
        {
          id: "admin_att_001",
          name: "TechNova_Registration_Certificate.pdf",
          type: "application/pdf",
          size: 1048576,
          url: "/mock/attachments/technova_cert.pdf",
        },
      ],

      metadata: {},

      status: {
        sent: true,
        delivered: true,
        read: true,
        readAt: "2024-01-16T09:00:00Z",
      },

      createdAt: "2024-01-15T14:30:00Z",
    },
    {
      id: "admin_msg_002_003",
      conversationId: "admin_conv_002",
      type: MESSAGE_TYPES.GENERAL.id,

      sender: {
        id: "admin_001",
        type: SENDER_TYPES.ADMIN,
        name: "Platform Admin",
        role: "Administrator",
      },

      content: {
        subject: "Re: Company Profile Review - Approved",
        body: `Dear TechNova Solutions Team,

Thank you for the update. Your company profile has been verified and approved.

You can now:
✅ Post internship openings
✅ Review student applications
✅ Message applicants directly

Welcome to Prashikshan! We're excited to have you on board.

Best regards,
Prashikshan Admin Team`,
        html: null,
      },

      attachments: [],

      metadata: {
        isAdminDirect: true,
        category: "COMPANY_VERIFICATION",
        verificationStatus: "APPROVED",
      },

      status: {
        sent: true,
        delivered: true,
        read: true,
        readAt: "2024-01-17T16:00:00Z",
      },

      createdAt: "2024-01-17T15:30:00Z",
    },
  ],

  // Admin → Faculty (Guidelines)
  admin_conv_003: [
    {
      id: "admin_msg_003_001",
      conversationId: "admin_conv_003",
      type: MESSAGE_TYPES.GENERAL.id,

      sender: {
        id: "admin_001",
        type: SENDER_TYPES.ADMIN,
        name: "Platform Admin",
        role: "Administrator",
      },

      content: {
        subject: "Updated Mentorship Program Guidelines",
        body: `Dear Dr. Mehta,

We have updated the mentorship program guidelines for the current semester. Key changes include:

1. Weekly progress reports are now mandatory (previously bi-weekly)
2. Faculty mentors should review reports within 48 hours
3. A new grading rubric has been introduced for internship evaluation
4. Monthly video check-ins with students are recommended

Please review the attached updated guidelines document and let us know if you have any questions.

Best regards,
Prashikshan Admin Team`,
        html: null,
      },

      attachments: [
        {
          id: "admin_att_002",
          name: "Mentorship_Guidelines_v2.pdf",
          type: "application/pdf",
          size: 524288,
          url: "/mock/attachments/mentorship_guidelines.pdf",
        },
      ],

      metadata: {
        isAdminDirect: true,
        category: "GUIDELINES",
      },

      status: {
        sent: true,
        delivered: true,
        read: true,
        readAt: "2024-01-14T11:00:00Z",
      },

      createdAt: "2024-01-14T10:00:00Z",
    },
    {
      id: "admin_msg_003_002",
      conversationId: "admin_conv_003",
      type: MESSAGE_TYPES.GENERAL.id,

      sender: {
        id: "faculty_001",
        type: SENDER_TYPES.FACULTY,
        name: "Dr. Priya Mehta",
        role: "Faculty Mentor",
      },

      content: {
        subject: "Re: Updated Mentorship Program Guidelines",
        body: `Dear Admin Team,

Thank you for the clarification. I will follow the updated guidelines for all my mentees starting this week.

One suggestion: It would be helpful to have a template for the weekly progress reports so that all faculty members can maintain consistency.

Best regards,
Dr. Priya Mehta
Department of Computer Science`,
        html: null,
      },

      attachments: [],

      metadata: {},

      status: {
        sent: true,
        delivered: true,
        read: true,
        readAt: "2024-01-16T12:00:00Z",
      },

      createdAt: "2024-01-16T11:00:00Z",
    },
  ],
};

export default mockMessages;