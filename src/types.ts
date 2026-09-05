export type UserRole = 'student' | 'teacher' | 'company' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  institutionOrCompany: string;
  departmentOrIndustry: string;
  bio: string;
  headline: string;
  location: string;
  skills: string[];
  verifiedStatus: 'verified' | 'pending' | 'unverified';
  phone?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  settings: AccountSettings;
  stats?: {
    skillScore?: number;
    coursesCompleted?: number;
    applicationsCount?: number;
    connectionsCount?: number;
    internshipsOffered?: number;
    studentsMentored?: number;
  };
}

export interface AccountSettings {
  emailNotifications: boolean;
  smsAlerts: boolean;
  profileVisibility: 'public' | 'institute_only' | 'private';
  twoFactorAuth: boolean;
  themePreference: 'light' | 'dark' | 'system';
  smartMatchingOptIn: boolean;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
  gatewayRoute: string;
  expiresIn: string;
}

export interface SkillAssessment {
  id: string;
  skillName: string;
  category: 'Technical' | 'Soft Skills' | 'Domain Knowledge' | 'Tools';
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  score: number; // 0 - 100
  verifiedByTeacher: boolean;
  verifiedTeacherName?: string;
  lastAssessedDate: string;
  assessmentQuestionsCount: number;
  badgeUrl?: string;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  instructorRole: string;
  instructorAvatar: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  description: string;
  skillsTaught: string[];
  enrolledStudentsCount: number;
  rating: number;
  isEnrolled?: boolean;
  progressPercent?: number;
  certificationOffered: boolean;
  modulesCount: number;
  industryPartner?: string;
}

export interface Opportunity {
  id: string;
  companyName: string;
  companyLogo: string;
  title: string;
  type: 'internship' | 'job' | 'research';
  workMode: 'Remote' | 'On-site' | 'Hybrid';
  location: string;
  stipendOrSalary: string;
  duration?: string;
  openings: number;
  deadline: string;
  postedDate: string;
  requiredSkills: string[];
  preferredSkills?: string[];
  description: string;
  responsibilities: string[];
  perks: string[];
  applicantsCount: number;
  matchScore?: number; // Automated skill mapping match score (0 - 100%)
  hasApplied?: boolean;
}

export interface JobApplication {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  companyName: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentDepartment: string;
  studentSkills: string[];
  matchScore: number;
  appliedDate: string;
  status: 'applied' | 'under_review' | 'shortlisted' | 'interview_scheduled' | 'selected' | 'rejected';
  notes?: string;
  interviewDate?: string;
}

export interface NetworkConnection {
  id: string;
  userId: string;
  name: string;
  role: UserRole;
  avatar: string;
  title: string;
  organization: string;
  mutualConnections: number;
  status: 'connected' | 'pending' | 'suggested';
  skills: string[];
}

export interface DiscussionPost {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar: string;
  authorOrg: string;
  title: string;
  content: string;
  tags: string[];
  upvotes: number;
  isUpvoted?: boolean;
  commentsCount: number;
  createdAt: string;
  pinned?: boolean;
}

export type DiscussionThread = DiscussionPost & {
  category?: string;
  likesCount?: number;
  repliesCount?: number;
};

export interface MentorshipSlot {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorRole: string;
  mentorAvatar: string;
  organization: string;
  expertise: string[];
  topic: string;
  availableDates: string[];
  bookedSlotsCount: number;
  rating: number;
  status: 'available' | 'booked';
}

export type MentorshipSession = MentorshipSlot & {
  mentorOrg?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  meetingLink?: string;
};

export interface AppNotification {
  id: string;
  userId?: string;
  type: 'alert' | 'message' | 'update';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  badgeColor?: string;
  actionUrl?: string;
}

export interface ApiGatewayLog {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  serviceTarget: 'User Management' | 'Courses & Skills' | 'Opportunities' | 'Network & Community' | 'Notifications' | 'Platform Modules' | 'Smart Automation';
  jwtSubject: string;
  userRole: UserRole;
  statusCode: number;
  latencyMs: number;
}

export interface PlatformModuleData {
  admission: {
    totalRegistrations: number;
    pendingApprovals: number;
    verifiedStudents: number;
    recentRegistrations: Array<{
      id: string;
      name: string;
      program: string;
      appliedDate: string;
      status: 'pending' | 'approved' | 'rejected';
    }>;
  };
  attendance: {
    overallRate: number;
    totalLectures: number;
    studentAttendance: Array<{
      course: string;
      rate: number;
      lastPresentDate: string;
    }>;
  };
  examination: {
    upcomingExamsCount: number;
    skillEvalsCompleted: number;
    averageScore: number;
    recentAssessments: Array<{
      title: string;
      date: string;
      averageMarks: number;
      totalAttempted: number;
    }>;
  };
  library: {
    totalDigitalAssets: number;
    industryCurricula: number;
    papersAvailable: number;
    topResources: Array<{
      title: string;
      type: string;
      downloads: number;
      author: string;
    }>;
  };
  reports: {
    placementPercentage: number;
    averagePackageLPA: number;
    highestPackageLPA: number;
    industryPartnerships: number;
    skillCoverageRate: number;
  };
}

export interface SmartSkillGapAnalysis {
  overallReadinessScore: number;
  matchedSkills: Array<{ name: string; studentProficiency: number; industryDemand: number; gap: number }>;
  missingHighDemandSkills: string[];
  recommendedCourses: Course[];
  recommendedInternships: Opportunity[];
  aiExecutiveSummary: string;
}
