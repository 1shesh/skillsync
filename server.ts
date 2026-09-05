import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import type {
  Course,
  Opportunity,
  JobApplication,
  NetworkConnection,
  DiscussionPost,
  MentorshipSlot,
  AppNotification,
  ApiGatewayLog,
  PlatformModuleData,
  SkillAssessment,
  UserRole
} from './src/types.ts';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'sih-2026-codecrafters-industry-skill-jwt-key';
const PORT = 3000;

// Lazy initialization for Gemini client to prevent crashes if key is absent
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return geminiClient;
}

// In-Memory Durable Database Store
interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
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
  settings: {
    emailNotifications: boolean;
    smsAlerts: boolean;
    profileVisibility: 'public' | 'institute_only' | 'private';
    twoFactorAuth: boolean;
    themePreference: 'light' | 'dark' | 'system';
    smartMatchingOptIn: boolean;
  };
  stats: {
    skillScore?: number;
    coursesCompleted?: number;
    applicationsCount?: number;
    connectionsCount?: number;
    internshipsOffered?: number;
    studentsMentored?: number;
  };
}

interface DatabaseState {
  users: UserRecord[];
  skillAssessments: SkillAssessment[];
  courses: Course[];
  opportunities: Opportunity[];
  applications: JobApplication[];
  connections: NetworkConnection[];
  discussions: DiscussionPost[];
  mentorships: MentorshipSlot[];
  notifications: AppNotification[];
  platformModules: PlatformModuleData;
  gatewayLogs: ApiGatewayLog[];
}

const db: DatabaseState = {
  users: [
    {
      id: 'usr-student-01',
      name: 'Aarav Sharma',
      email: 'student@sih.ac.in',
      passwordHash: 'password123',
      role: 'student' as const,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      institutionOrCompany: 'Indian Institute of Technology (BHU)',
      departmentOrIndustry: 'Computer Science & AI',
      headline: 'Pre-final Year B.Tech | Full Stack & ML Enthusiast',
      bio: 'Aspiring AI engineer passionate about building smart automation systems and scalable web platforms. Winner of Smart Campus Hackathon.',
      location: 'Varanasi, Uttar Pradesh',
      skills: ['React.js', 'Node.js', 'Python', 'Machine Learning', 'Docker', 'TypeScript', 'SQL'],
      verifiedStatus: 'verified' as const,
      phone: '+91 98765 43210',
      portfolioUrl: 'https://aaravsharma.dev',
      linkedinUrl: 'https://linkedin.com/in/aarav-sharma-sih',
      githubUrl: 'https://github.com/aaravsharma',
      settings: {
        emailNotifications: true,
        smsAlerts: false,
        profileVisibility: 'public' as const,
        twoFactorAuth: true,
        themePreference: 'light' as const,
        smartMatchingOptIn: true
      },
      stats: {
        skillScore: 88,
        coursesCompleted: 5,
        applicationsCount: 4,
        connectionsCount: 42
      }
    },
    {
      id: 'usr-teacher-01',
      name: 'Dr. Meenakshi Sundaram',
      email: 'teacher@sih.ac.in',
      passwordHash: 'password123',
      role: 'teacher' as const,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      institutionOrCompany: 'National Institute of Technology, Trichy',
      departmentOrIndustry: 'Industry Collaboration & Placement Cell',
      headline: 'Professor & Head of Corporate Relations | Skill Mapping Lead',
      bio: 'Leading curriculum modernization and industry partnerships across aerospace, IT, and manufacturing sectors. 15+ years in academia and mentoring.',
      location: 'Tiruchirappalli, Tamil Nadu',
      skills: ['Curriculum Design', 'Industry Alignment', 'Skill Assessment', 'Applied AI', 'Mentorship'],
      verifiedStatus: 'verified' as const,
      phone: '+91 98765 11223',
      linkedinUrl: 'https://linkedin.com/in/meenakshi-sundaram',
      settings: {
        emailNotifications: true,
        smsAlerts: true,
        profileVisibility: 'public' as const,
        twoFactorAuth: true,
        themePreference: 'light' as const,
        smartMatchingOptIn: true
      },
      stats: {
        studentsMentored: 128,
        coursesCompleted: 12,
        connectionsCount: 89
      }
    },
    {
      id: 'usr-company-01',
      name: 'TCS NextGen Labs (Ananya Verma)',
      email: 'company@sih.ac.in',
      passwordHash: 'password123',
      role: 'company' as const,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      institutionOrCompany: 'Tata Consultancy Services - Research & Innovation',
      departmentOrIndustry: 'Enterprise AI & Automation Practice',
      headline: 'Talent Acquisition Director & Industry Fellowship Lead',
      bio: 'Hiring for summer internships, R&D residencies, and campus placements. Collaborating with top institutes for automated skill-gap bridges.',
      location: 'Bengaluru, Karnataka',
      skills: ['Talent Sourcing', 'AI Hiring', 'Cloud Architecture', 'Full Stack Placement', 'Campus Outreach'],
      verifiedStatus: 'verified' as const,
      phone: '+91 80 6725 0000',
      portfolioUrl: 'https://tcs.com/careers',
      linkedinUrl: 'https://linkedin.com/company/tcs',
      settings: {
        emailNotifications: true,
        smsAlerts: true,
        profileVisibility: 'public' as const,
        twoFactorAuth: true,
        themePreference: 'light' as const,
        smartMatchingOptIn: true
      },
      stats: {
        internshipsOffered: 24,
        connectionsCount: 164
      }
    }
  ] as UserRecord[],

  skillAssessments: [
    {
      id: 'sa-01',
      skillName: 'React & Frontend Architecture',
      category: 'Technical',
      level: 'Advanced',
      score: 92,
      verifiedByTeacher: true,
      verifiedTeacherName: 'Dr. Meenakshi Sundaram',
      lastAssessedDate: '2026-08-20',
      assessmentQuestionsCount: 25,
      badgeUrl: 'badge-react'
    },
    {
      id: 'sa-02',
      skillName: 'Python for AI & Smart Automation',
      category: 'Technical',
      level: 'Advanced',
      score: 88,
      verifiedByTeacher: true,
      verifiedTeacherName: 'Prof. Rajesh Khanna',
      lastAssessedDate: '2026-08-15',
      assessmentQuestionsCount: 30,
      badgeUrl: 'badge-python'
    },
    {
      id: 'sa-03',
      skillName: 'API Gateway & Microservices (Node/Express)',
      category: 'Technical',
      level: 'Intermediate',
      score: 84,
      verifiedByTeacher: true,
      verifiedTeacherName: 'Dr. Meenakshi Sundaram',
      lastAssessedDate: '2026-08-10',
      assessmentQuestionsCount: 20,
      badgeUrl: 'badge-api'
    },
    {
      id: 'sa-04',
      skillName: 'Docker & Container Deployment',
      category: 'Tools',
      level: 'Intermediate',
      score: 76,
      verifiedByTeacher: false,
      lastAssessedDate: '2026-08-02',
      assessmentQuestionsCount: 15,
      badgeUrl: 'badge-docker'
    },
    {
      id: 'sa-05',
      skillName: 'Industrial IoT & Automation Protocols',
      category: 'Domain Knowledge',
      level: 'Beginner',
      score: 65,
      verifiedByTeacher: false,
      lastAssessedDate: '2026-07-28',
      assessmentQuestionsCount: 20,
      badgeUrl: 'badge-iot'
    }
  ],

  courses: [
    {
      id: 'crs-01',
      title: 'Industry 4.0: Smart Automation with AI & Edge IoT',
      instructor: 'Dr. Meenakshi Sundaram',
      instructorRole: 'Industry Collaboration Chair',
      instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      duration: '8 Weeks (Self-paced)',
      level: 'Intermediate',
      category: 'Smart Automation',
      description: 'Co-created with Siemens & TCS: Learn automated telemetry, PLC communication, microservices orchestration, and AI-driven quality checks.',
      skillsTaught: ['Smart Automation', 'Python', 'Edge IoT', 'Docker', 'Predictive Maintenance'],
      enrolledStudentsCount: 412,
      rating: 4.8,
      isEnrolled: true,
      progressPercent: 68,
      certificationOffered: true,
      modulesCount: 12,
      industryPartner: 'Siemens Industrial'
    },
    {
      id: 'crs-02',
      title: 'Full Stack Enterprise Systems: API Gateways & JWT Microservices',
      instructor: 'Prof. Arvind Nambiar',
      instructorRole: 'System Architecture Specialist',
      instructorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      duration: '6 Weeks',
      level: 'Advanced',
      category: 'Web & Cloud',
      description: 'Hands-on architectural mastery: JWT token lifecycle, rate-limiting API gateways, distributed auth, and PostgreSQL ORM mapping.',
      skillsTaught: ['Node.js', 'TypeScript', 'JWT', 'API Gateway', 'PostgreSQL'],
      enrolledStudentsCount: 650,
      rating: 4.9,
      isEnrolled: true,
      progressPercent: 90,
      certificationOffered: true,
      modulesCount: 10,
      industryPartner: 'RedHat / IBM'
    },
    {
      id: 'crs-03',
      title: 'Applied Generative AI for Industry Operations',
      instructor: 'Dr. Kavita Joshi',
      instructorRole: 'AI Lab Director',
      instructorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      duration: '4 Weeks',
      level: 'Intermediate',
      category: 'Artificial Intelligence',
      description: 'Build enterprise copilots, document synthesis workflows, and automated skill-mapping pipelines using state-of-the-art LLMs.',
      skillsTaught: ['Machine Learning', 'Gemini API', 'Prompt Engineering', 'Vector Embeddings'],
      enrolledStudentsCount: 780,
      rating: 4.9,
      isEnrolled: false,
      progressPercent: 0,
      certificationOffered: true,
      modulesCount: 8,
      industryPartner: 'Google Cloud'
    },
    {
      id: 'crs-04',
      title: 'Cloud DevOps, CI/CD & Kubernetes for Placements',
      instructor: 'Sanjay Deshmukh',
      instructorRole: 'DevOps Architect',
      instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      duration: '5 Weeks',
      level: 'Intermediate',
      category: 'Cloud & Infrastructure',
      description: 'Master automated container pipelines, GitHub Actions, AWS deploy strategies, and production observability for tech placement tests.',
      skillsTaught: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Linux'],
      enrolledStudentsCount: 520,
      rating: 4.7,
      isEnrolled: false,
      progressPercent: 0,
      certificationOffered: true,
      modulesCount: 7,
      industryPartner: 'AWS Academy'
    }
  ],

  opportunities: [
    {
      id: 'opp-01',
      companyName: 'TCS NextGen Labs',
      companyLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80',
      title: 'Smart Automation & AI Engineering Intern',
      type: 'internship' as const,
      workMode: 'Hybrid' as const,
      location: 'Bengaluru / Hybrid',
      stipendOrSalary: '₹45,000 / month',
      duration: '6 Months (PPO Eligible)',
      openings: 8,
      deadline: '2026-09-30',
      postedDate: '2026-08-25',
      requiredSkills: ['Python', 'Machine Learning', 'Docker', 'React.js'],
      preferredSkills: ['Smart Automation', 'API Gateway'],
      description: 'Join TCS NextGen Labs to architect autonomous industrial automation workflows. Build predictive maintenance triggers, integrate API gateways, and train vision models.',
      responsibilities: [
        'Develop smart microservices for plant floor telemetry monitoring',
        'Implement automated skill and equipment diagnostics algorithms',
        'Build responsive visualization dashboards in React'
      ],
      perks: ['Pre-Placement Offer (PPO) 14 LPA', 'Flexible Hybrid Schedule', 'Mentorship from TCS Fellows'],
      applicantsCount: 47,
      matchScore: 94,
      hasApplied: true
    },
    {
      id: 'opp-02',
      companyName: 'Infosys Innovation Network',
      companyLogo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=80',
      title: 'Full Stack Cloud Developer (Graduate Trainee)',
      type: 'job' as const,
      workMode: 'On-site' as const,
      location: 'Pune / Hyderabad',
      stipendOrSalary: '₹9.5 - 12.0 LPA',
      openings: 15,
      deadline: '2026-10-15',
      postedDate: '2026-08-28',
      requiredSkills: ['React.js', 'Node.js', 'TypeScript', 'SQL', 'Docker'],
      preferredSkills: ['JWT', 'Microservices'],
      description: 'Full-time graduate recruitment drive for high-performing engineering students. Work on mission-critical banking and automotive APIs.',
      responsibilities: [
        'Design secure REST and GraphQL endpoints backed by PostgreSQL',
        'Maintain 99.9% uptime for cloud transaction gateways',
        'Collaborate with global enterprise clients'
      ],
      perks: ['Relocation Allowance', 'Health Insurance', 'Higher Education Sponsorship'],
      applicantsCount: 112,
      matchScore: 91,
      hasApplied: false
    },
    {
      id: 'opp-03',
      companyName: 'L&T Technology Services',
      companyLogo: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=100&auto=format&fit=crop&q=80',
      title: 'Industrial Automation & Robotics Trainee',
      type: 'internship' as const,
      workMode: 'On-site' as const,
      location: 'Vadodara, Gujarat',
      stipendOrSalary: '₹35,000 / month',
      duration: '4 Months',
      openings: 5,
      deadline: '2026-09-20',
      postedDate: '2026-08-18',
      requiredSkills: ['Industrial IoT & Automation Protocols', 'Python', 'C++'],
      preferredSkills: ['Smart Automation'],
      description: 'Collaborate with automotive and heavy equipment manufacturing clients on automated testing rigs and digital twin integrations.',
      responsibilities: [
        'Collect and process high-frequency sensor streams',
        'Configure industrial communication gateways',
        'Write robust test automation scripts'
      ],
      perks: ['On-site Accommodation', 'Factory Access Clearance', 'Live Project Credit'],
      applicantsCount: 29,
      matchScore: 68,
      hasApplied: false
    },
    {
      id: 'opp-04',
      companyName: 'Cognizant AI Labs',
      companyLogo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&auto=format&fit=crop&q=80',
      title: 'GenAI & Cognitive Systems Research Intern',
      type: 'research' as const,
      workMode: 'Remote' as const,
      location: 'Pan India (Remote)',
      stipendOrSalary: '₹50,000 / month',
      duration: '6 Months',
      openings: 4,
      deadline: '2026-10-05',
      postedDate: '2026-09-01',
      requiredSkills: ['Python', 'Machine Learning', 'Gemini API'],
      preferredSkills: ['TypeScript', 'Docker'],
      description: 'Conduct applied research in automated skill curriculum synthesis, multi-agent student evaluations, and enterprise RAG systems.',
      responsibilities: [
        'Benchmark LLM reasoning for domain skill taxonomies',
        'Publish joint research papers with university mentors'
      ],
      perks: ['Publication Funding', 'High Performance Cloud GPU compute', 'Conference Sponsorship'],
      applicantsCount: 38,
      matchScore: 89,
      hasApplied: false
    }
  ],

  applications: [
    {
      id: 'app-01',
      opportunityId: 'opp-01',
      opportunityTitle: 'Smart Automation & AI Engineering Intern',
      companyName: 'TCS NextGen Labs',
      studentId: 'usr-student-01',
      studentName: 'Aarav Sharma',
      studentEmail: 'student@sih.ac.in',
      studentDepartment: 'Computer Science & AI',
      studentSkills: ['React.js', 'Node.js', 'Python', 'Machine Learning', 'Docker'],
      matchScore: 94,
      appliedDate: '2026-08-26',
      status: 'interview_scheduled' as const,
      notes: 'Strong alignment with automated telemetry and React dashboard requirements. Tech Round scheduled.',
      interviewDate: '2026-09-12 11:00 AM IST'
    },
    {
      id: 'app-02',
      opportunityId: 'opp-04',
      opportunityTitle: 'GenAI & Cognitive Systems Research Intern',
      companyName: 'Cognizant AI Labs',
      studentId: 'usr-student-01',
      studentName: 'Aarav Sharma',
      studentEmail: 'student@sih.ac.in',
      studentDepartment: 'Computer Science & AI',
      studentSkills: ['Python', 'Machine Learning', 'Docker'],
      matchScore: 89,
      appliedDate: '2026-09-02',
      status: 'under_review' as const,
      notes: 'Portfolio review in progress by research director.'
    },
    {
      id: 'app-03',
      opportunityId: 'opp-01',
      opportunityTitle: 'Smart Automation & AI Engineering Intern',
      companyName: 'TCS NextGen Labs',
      studentId: 'usr-student-02',
      studentName: 'Priya Iyer',
      studentEmail: 'priya.iyer@sih.ac.in',
      studentDepartment: 'Electronics & Instrumentation',
      studentSkills: ['Python', 'Docker', 'IoT', 'C++'],
      matchScore: 82,
      appliedDate: '2026-08-27',
      status: 'shortlisted' as const,
      notes: 'Candidate has notable hands-on IoT lab credentials.'
    }
  ],

  connections: [
    {
      id: 'conn-01',
      userId: 'usr-teacher-01',
      name: 'Dr. Meenakshi Sundaram',
      role: 'teacher' as const,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      title: 'Professor & Head of Corporate Relations',
      organization: 'NIT Trichy',
      mutualConnections: 14,
      status: 'connected' as const,
      skills: ['Curriculum Design', 'Industry Alignment', 'Applied AI']
    },
    {
      id: 'conn-02',
      userId: 'usr-company-01',
      name: 'Ananya Verma',
      role: 'company' as const,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      title: 'Talent Acquisition Director',
      organization: 'TCS NextGen Labs',
      mutualConnections: 28,
      status: 'connected' as const,
      skills: ['Talent Sourcing', 'AI Hiring', 'Campus Outreach']
    },
    {
      id: 'conn-03',
      userId: 'usr-student-03',
      name: 'Rohan Gupta',
      role: 'student' as const,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      title: 'Final Year CSE | Cloud Practitioner',
      organization: 'IIT BHU',
      mutualConnections: 19,
      status: 'connected' as const,
      skills: ['Kubernetes', 'AWS', 'Go', 'Docker']
    },
    {
      id: 'conn-04',
      userId: 'usr-teacher-02',
      name: 'Prof. Arvind Nambiar',
      role: 'teacher' as const,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      title: 'System Architecture Specialist',
      organization: 'IIIT Hyderabad',
      mutualConnections: 8,
      status: 'suggested' as const,
      skills: ['Node.js', 'JWT', 'API Gateway', 'PostgreSQL']
    }
  ],

  discussions: [
    {
      id: 'disc-01',
      authorId: 'usr-teacher-01',
      authorName: 'Dr. Meenakshi Sundaram',
      authorRole: 'teacher' as const,
      authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      authorOrg: 'NIT Trichy',
      title: 'Industry Skill Gap 2026: Why Docker & API Security are now baseline for freshers',
      content: 'In our recent roundtable with top recruiters (TCS, L&T, Infosys), 82% of hiring managers reported that theoretical data structures alone no longer guarantee high placement bands. Industry requires candidates who know how JWT authentication interacts with API Gateways, and how containerized workloads run in staging environments. Let us discuss how colleges should adapt semester curricula.',
      tags: ['Skill Mapping', 'Industry Collaboration', 'Placement Advice', 'API Gateway'],
      upvotes: 64,
      isUpvoted: true,
      commentsCount: 18,
      createdAt: '2026-09-02T10:30:00Z',
      pinned: true
    },
    {
      id: 'disc-02',
      authorId: 'usr-company-01',
      authorName: 'Ananya Verma (TCS Labs)',
      authorRole: 'company' as const,
      authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      authorOrg: 'TCS NextGen Labs',
      title: 'Smart Automation in Placement Screening: What our automated skill scoring looks for',
      content: 'Our automated candidate matching system cross-references teacher-verified lab skills with GitHub commits and practical project milestones. If your profile shows verified proficiency in Python + Cloud telemetry, you automatically jump to the top quartile for interview shortlisting.',
      tags: ['Smart Automation', 'Hiring Tips', 'TCS NextGen', 'Skill Scoring'],
      upvotes: 51,
      isUpvoted: false,
      commentsCount: 22,
      createdAt: '2026-09-03T14:15:00Z',
      pinned: false
    },
    {
      id: 'disc-03',
      authorId: 'usr-student-01',
      authorName: 'Aarav Sharma',
      authorRole: 'student' as const,
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      authorOrg: 'IIT BHU',
      title: 'How to prepare for Smart Automation live coding interviews? Sharing my roadmap',
      content: 'I recently cleared the preliminary round for the Smart Automation internship. The key is understanding message brokers, Express middleware pipelines, and how role claims are extracted from JWTs. Happy to share my project notes with anyone interested in mock interviews!',
      tags: ['Student Experience', 'Internship Prep', 'Mock Interview', 'Express'],
      upvotes: 39,
      isUpvoted: true,
      commentsCount: 14,
      createdAt: '2026-09-04T09:00:00Z',
      pinned: false
    }
  ],

  mentorships: [
    {
      id: 'mnt-01',
      mentorId: 'usr-teacher-01',
      mentorName: 'Dr. Meenakshi Sundaram',
      mentorRole: 'Professor & Placement Chair',
      mentorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      organization: 'NIT Trichy',
      expertise: ['Curriculum Mapping', 'Research Papers', 'Industry Tie-ups'],
      topic: 'Bridging Academic Labs to Corporate R&D Expectations',
      availableDates: ['Wed, 10 Sep • 4:00 PM', 'Fri, 12 Sep • 5:30 PM'],
      bookedSlotsCount: 14,
      rating: 4.9,
      status: 'available' as const
    },
    {
      id: 'mnt-02',
      mentorId: 'usr-company-01',
      mentorName: 'Ananya Verma',
      mentorRole: 'Talent Acquisition Director',
      mentorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      organization: 'TCS NextGen Labs',
      expertise: ['Resume Crafting', 'Mock Technical Interviews', 'Placement Strategy'],
      topic: '1-on-1 Placement Profile & Skill Mapping Review',
      availableDates: ['Thu, 11 Sep • 6:00 PM', 'Sat, 13 Sep • 11:00 AM'],
      bookedSlotsCount: 22,
      rating: 5.0,
      status: 'available' as const
    }
  ],

  notifications: [
    {
      id: 'notif-01',
      type: 'alert' as const,
      title: 'Interview Scheduled - TCS NextGen Labs',
      message: 'Your interview for Smart Automation & AI Engineering Intern is set for 12 Sep 2026 at 11:00 AM IST via Video Link.',
      timestamp: '10 mins ago',
      read: false,
      badgeColor: 'emerald'
    },
    {
      id: 'notif-02',
      type: 'update' as const,
      title: 'Teacher Verified Skill: React & Frontend Architecture',
      message: 'Dr. Meenakshi Sundaram verified your skill assessment score of 92%. A verifiable badge has been issued to your profile.',
      timestamp: '2 hours ago',
      read: false,
      badgeColor: 'blue'
    },
    {
      id: 'notif-03',
      type: 'message' as const,
      title: 'Dr. Meenakshi Sundaram posted in Discussions',
      message: '"Industry Skill Gap 2026: Why Docker & API Security are now baseline for freshers" has 18 new replies.',
      timestamp: '1 day ago',
      read: true,
      badgeColor: 'amber'
    },
    {
      id: 'notif-04',
      type: 'update' as const,
      title: 'New High-Match Job Posted',
      message: 'Cognizant AI Labs posted "GenAI & Cognitive Systems Research Intern" with an 89% skill match to your profile.',
      timestamp: '2 days ago',
      read: true,
      badgeColor: 'purple'
    }
  ],

  platformModules: {
    admission: {
      totalRegistrations: 1420,
      pendingApprovals: 38,
      verifiedStudents: 1382,
      recentRegistrations: [
        { id: 'REG-2026-891', name: 'Kabir Singhal', program: 'B.Tech AI & Data Engineering', appliedDate: '2026-09-04', status: 'pending' as const },
        { id: 'REG-2026-890', name: 'Tanvi Deshmukh', program: 'B.Tech Computer Science', appliedDate: '2026-09-03', status: 'approved' as const },
        { id: 'REG-2026-889', name: 'Devendra Patel', program: 'B.Tech Smart Manufacturing', appliedDate: '2026-09-02', status: 'approved' as const }
      ]
    },
    attendance: {
      overallRate: 91.4,
      totalLectures: 340,
      studentAttendance: [
        { course: 'Industry 4.0: Smart Automation with AI', rate: 94.5, lastPresentDate: '2026-09-04' },
        { course: 'Full Stack Enterprise Systems & Gateways', rate: 89.2, lastPresentDate: '2026-09-03' },
        { course: 'Applied Machine Learning Laboratory', rate: 92.0, lastPresentDate: '2026-09-02' }
      ]
    },
    examination: {
      upcomingExamsCount: 4,
      skillEvalsCompleted: 860,
      averageScore: 84.6,
      recentAssessments: [
        { title: 'National Industry Skill Mapping Benchmark 2026', date: '2026-08-28', averageMarks: 86.4, totalAttempted: 310 },
        { title: 'Automated Microservices & JWT Security Exam', date: '2026-08-14', averageMarks: 81.2, totalAttempted: 240 },
        { title: 'Industrial Robotics & Automation Diagnostic', date: '2026-08-05', averageMarks: 83.8, totalAttempted: 190 }
      ]
    },
    library: {
      totalDigitalAssets: 2450,
      industryCurricula: 64,
      papersAvailable: 1180,
      topResources: [
        { title: 'Siemens Industry 4.0 Standard Implementation Blueprint', type: 'Industrial Handbook', downloads: 820, author: 'Siemens Academy' },
        { title: 'NASSCOM IT-BPM Industry Skill Framework 2026', type: 'Curriculum Guide', downloads: 1450, author: 'NASSCOM' },
        { title: 'Designing High-Throughput JWT API Gateways in Node.js', type: 'Technical Whitepaper', downloads: 910, author: 'IIT Delhi / SIH' }
      ]
    },
    reports: {
      placementPercentage: 92.8,
      averagePackageLPA: 11.4,
      highestPackageLPA: 44.0,
      industryPartnerships: 48,
      skillCoverageRate: 88.5
    }
  },

  gatewayLogs: [] as Array<{
    id: string;
    timestamp: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    endpoint: string;
    serviceTarget: 'User Management' | 'Courses & Skills' | 'Opportunities' | 'Network & Community' | 'Notifications' | 'Platform Modules' | 'Smart Automation';
    jwtSubject: string;
    userRole: 'student' | 'teacher' | 'company' | 'admin';
    statusCode: number;
    latencyMs: number;
  }>
};

// Populate initial API Gateway telemetry logs
function seedGatewayLogs() {
  const targets: Array<{
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    endpoint: string;
    target: 'User Management' | 'Courses & Skills' | 'Opportunities' | 'Network & Community' | 'Notifications' | 'Platform Modules' | 'Smart Automation';
    sub: string;
    role: 'student' | 'teacher' | 'company';
  }> = [
    { method: 'POST', endpoint: '/api/auth/login', target: 'User Management', sub: 'student@sih.ac.in', role: 'student' },
    { method: 'GET', endpoint: '/api/courses/recommendations', target: 'Courses & Skills', sub: 'student@sih.ac.in', role: 'student' },
    { method: 'GET', endpoint: '/api/opportunities?match=smart', target: 'Opportunities', sub: 'student@sih.ac.in', role: 'student' },
    { method: 'POST', endpoint: '/api/skills/assessments/verify', target: 'Courses & Skills', sub: 'teacher@sih.ac.in', role: 'teacher' },
    { method: 'GET', endpoint: '/api/applications?status=active', target: 'Opportunities', sub: 'company@sih.ac.in', role: 'company' },
    { method: 'GET', endpoint: '/api/network/discussions', target: 'Network & Community', sub: 'student@sih.ac.in', role: 'student' },
    { method: 'GET', endpoint: '/api/modules/reports', target: 'Platform Modules', sub: 'teacher@sih.ac.in', role: 'teacher' },
    { method: 'POST', endpoint: '/api/smart-automation/match', target: 'Smart Automation', sub: 'student@sih.ac.in', role: 'student' }
  ];

  targets.forEach((t, i) => {
    db.gatewayLogs.push({
      id: `gw-${Date.now()}-${i}`,
      timestamp: new Date(Date.now() - (10 - i) * 60000).toISOString(),
      method: t.method,
      endpoint: t.endpoint,
      serviceTarget: t.target,
      jwtSubject: t.sub,
      userRole: t.role,
      statusCode: 200,
      latencyMs: Math.floor(12 + Math.random() * 28)
    });
  });
}
seedGatewayLogs();

// API Gateway Logging Middleware
function recordGatewayLog(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  serviceTarget: 'User Management' | 'Courses & Skills' | 'Opportunities' | 'Network & Community' | 'Notifications' | 'Platform Modules' | 'Smart Automation',
  jwtSubject: string,
  userRole: 'student' | 'teacher' | 'company' | 'admin',
  statusCode: number,
  latencyMs: number
) {
  const log = {
    id: `gw-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    method,
    endpoint,
    serviceTarget,
    jwtSubject: jwtSubject || 'anonymous',
    userRole: userRole || 'student',
    statusCode,
    latencyMs
  };
  db.gatewayLogs.unshift(log);
  if (db.gatewayLogs.length > 50) {
    db.gatewayLogs.pop();
  }
}

// Authentication Middleware to verify JWT and attach user
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'student' | 'teacher' | 'company' | 'admin';
    name: string;
  };
}

function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // If no token is provided, use default student for seamless demo/testing or return 401
    const defaultUser = db.users[0];
    req.user = { id: defaultUser.id, email: defaultUser.email, role: defaultUser.role, name: defaultUser.name };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired JWT token' });
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // CORS / security headers
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
  });

  // Health Check Endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'SkillSync API Gateway',
      version: 'SIH 2026',
      timestamp: new Date().toISOString()
    });
  });

  // -------------------------------------------------------------
  // 1. AUTHENTICATION SERVICE (JWT Generation & Validation)
  // -------------------------------------------------------------
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const startTime = Date.now();
    const { email, role, password } = req.body;

    // Find user by email or fallback to persona by role
    let user = db.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
    if (!user && role) {
      user = db.users.find(u => u.role === role);
    }
    if (!user) {
      user = db.users[0];
    }

    // Generate real cryptographically signed JWT with standard claims
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      institutionOrCompany: user.institutionOrCompany
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    recordGatewayLog('POST', '/api/auth/login', 'User Management', user.email, user.role, 200, Date.now() - startTime);

    return res.json({
      token,
      user,
      gatewayRoute: `/api/gateway/v1/${user.role}`,
      expiresIn: '7 days',
      issuedAt: new Date().toISOString()
    });
  });

  app.post('/api/auth/register', (req: Request, res: Response) => {
    const startTime = Date.now();
    const { name, email, role, institutionOrCompany, departmentOrIndustry, skills } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ error: 'Name, email, and role are required' });
    }

    const newUser: UserRecord = {
      id: `usr-${Date.now()}`,
      name,
      email,
      passwordHash: 'hashedpassword',
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      institutionOrCompany: institutionOrCompany || (role === 'company' ? 'Industry Corp' : 'Institute of Technology'),
      departmentOrIndustry: departmentOrIndustry || (role === 'student' ? 'Computer Science' : 'Talent Acquisition'),
      bio: `Registered member of the Smart India Hackathon Skill Mapping Ecosystem.`,
      headline: `${role.toUpperCase()} | Collaborator`,
      location: 'India',
      skills: Array.isArray(skills) ? skills : ['Smart Automation', 'Industry 4.0'],
      verifiedStatus: role === 'company' ? 'verified' : 'pending',
      settings: {
        emailNotifications: true,
        smsAlerts: false,
        profileVisibility: 'public',
        twoFactorAuth: false,
        themePreference: 'light',
        smartMatchingOptIn: true
      },
      stats: {
        skillScore: 75,
        coursesCompleted: 1,
        applicationsCount: 0,
        connectionsCount: 5
      }
    };

    db.users.push(newUser);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    recordGatewayLog('POST', '/api/auth/register', 'User Management', newUser.email, newUser.role, 201, Date.now() - startTime);

    return res.status(201).json({
      token,
      user: newUser,
      gatewayRoute: `/api/gateway/v1/${newUser.role}`,
      expiresIn: '7 days'
    });
  });

  app.get('/api/auth/verify', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const user = db.users.find(u => u.id === req.user?.id) || db.users[0];
    return res.json({
      valid: true,
      user,
      tokenClaims: req.user
    });
  });

  // -------------------------------------------------------------
  // 2. API GATEWAY ROUTER & TELEMETRY
  // -------------------------------------------------------------
  app.get('/api/gateway/logs', (req: Request, res: Response) => {
    return res.json({
      status: 'operational',
      gatewayVersion: 'v2.6-sih',
      activeRoutes: [
        { route: '/api/users/*', targetService: 'User Management', status: 'healthy', load: '14%' },
        { route: '/api/courses/*', targetService: 'Courses & Skills', status: 'healthy', load: '22%' },
        { route: '/api/opportunities/*', targetService: 'Opportunities', status: 'healthy', load: '38%' },
        { route: '/api/network/*', targetService: 'Network & Community', status: 'healthy', load: '18%' },
        { route: '/api/notifications/*', targetService: 'Notifications', status: 'healthy', load: '9%' },
        { route: '/api/modules/*', targetService: 'Platform Modules', status: 'healthy', load: '12%' },
        { route: '/api/smart-automation/*', targetService: 'Smart Automation Engine', status: 'healthy', load: '41%' }
      ],
      logs: db.gatewayLogs
    });
  });

  // -------------------------------------------------------------
  // 3. USER MANAGEMENT SERVICE (Profile, Roles, Settings)
  // -------------------------------------------------------------
  app.get('/api/users/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const startTime = Date.now();
    const user = db.users.find(u => u.id === req.user?.id) || db.users[0];
    recordGatewayLog('GET', '/api/users/me', 'User Management', user.email, user.role, 200, Date.now() - startTime);
    return res.json(user);
  });

  app.put('/api/users/profile', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const startTime = Date.now();
    const user = db.users.find(u => u.id === req.user?.id) || db.users[0];
    const { name, headline, bio, location, skills, portfolioUrl, linkedinUrl, githubUrl, departmentOrIndustry } = req.body;

    if (name) user.name = name;
    if (headline) user.headline = headline;
    if (bio) user.bio = bio;
    if (location) user.location = location;
    if (departmentOrIndustry) user.departmentOrIndustry = departmentOrIndustry;
    if (Array.isArray(skills)) user.skills = skills;
    if (portfolioUrl !== undefined) user.portfolioUrl = portfolioUrl;
    if (linkedinUrl !== undefined) user.linkedinUrl = linkedinUrl;
    if (githubUrl !== undefined) user.githubUrl = githubUrl;

    recordGatewayLog('PUT', '/api/users/profile', 'User Management', user.email, user.role, 200, Date.now() - startTime);
    return res.json({ success: true, user });
  });

  app.put('/api/users/settings', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const startTime = Date.now();
    const user = db.users.find(u => u.id === req.user?.id) || db.users[0];
    if (req.body) {
      user.settings = { ...user.settings, ...req.body };
    }
    recordGatewayLog('PUT', '/api/users/settings', 'User Management', user.email, user.role, 200, Date.now() - startTime);
    return res.json({ success: true, settings: user.settings });
  });

  app.get('/api/users/all', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const startTime = Date.now();
    const sanitized = db.users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      avatar: u.avatar,
      institutionOrCompany: u.institutionOrCompany,
      departmentOrIndustry: u.departmentOrIndustry,
      headline: u.headline,
      skills: u.skills,
      verifiedStatus: u.verifiedStatus
    }));
    recordGatewayLog('GET', '/api/users/all', 'User Management', req.user?.email || 'admin', req.user?.role || 'admin', 200, Date.now() - startTime);
    return res.json(sanitized);
  });

  app.put('/api/users/:id/role', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { role, verifiedStatus } = req.body;
    const targetUser = db.users.find(u => u.id === id);
    if (!targetUser) return res.status(404).json({ error: 'User not found' });

    if (role) targetUser.role = role;
    if (verifiedStatus) targetUser.verifiedStatus = verifiedStatus;

    return res.json({ success: true, user: targetUser });
  });

  // -------------------------------------------------------------
  // 4. COURSES & SKILLS SERVICE (Listing, Assessment, Recommendations)
  // -------------------------------------------------------------
  app.get('/api/courses', (req: Request, res: Response) => {
    const startTime = Date.now();
    recordGatewayLog('GET', '/api/courses', 'Courses & Skills', 'public', 'student', 200, Date.now() - startTime);
    return res.json(db.courses);
  });

  app.post('/api/courses/enroll', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const startTime = Date.now();
    const { courseId } = req.body;
    const course = db.courses.find(c => c.id === courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    course.isEnrolled = true;
    course.enrolledStudentsCount += 1;
    course.progressPercent = 10;

    recordGatewayLog('POST', `/api/courses/enroll`, 'Courses & Skills', req.user?.email || 'student', req.user?.role || 'student', 200, Date.now() - startTime);
    return res.json({ success: true, course });
  });

  app.post('/api/courses/create', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const startTime = Date.now();
    const { title, duration, level, category, description, skillsTaught, industryPartner } = req.body;
    const newCourse = {
      id: `crs-${Date.now()}`,
      title: title || 'New Collaborative Industry Course',
      instructor: req.user?.name || 'Faculty Mentor',
      instructorRole: req.user?.role === 'teacher' ? 'Professor & Industry Lead' : 'Corporate Mentor',
      instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      duration: duration || '6 Weeks',
      level: level || 'Intermediate',
      category: category || 'Smart Automation',
      description: description || 'Course aligned with latest industry requirements.',
      skillsTaught: Array.isArray(skillsTaught) ? skillsTaught : ['Automation', 'Engineering'],
      enrolledStudentsCount: 1,
      rating: 5.0,
      isEnrolled: false,
      progressPercent: 0,
      certificationOffered: true,
      modulesCount: 8,
      industryPartner: industryPartner || 'Academic-Industry Alliance'
    };

    db.courses.unshift(newCourse);
    recordGatewayLog('POST', '/api/courses/create', 'Courses & Skills', req.user?.email || 'teacher', req.user?.role || 'teacher', 201, Date.now() - startTime);
    return res.status(201).json({ success: true, course: newCourse });
  });

  app.get('/api/skills/assessments', (req: Request, res: Response) => {
    const startTime = Date.now();
    recordGatewayLog('GET', '/api/skills/assessments', 'Courses & Skills', 'student@sih.ac.in', 'student', 200, Date.now() - startTime);
    return res.json(db.skillAssessments);
  });

  app.post('/api/skills/assessments/submit', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const startTime = Date.now();
    const { skillName, category, level, score } = req.body;

    const newAssessment = {
      id: `sa-${Date.now()}`,
      skillName: skillName || 'Custom Assessment',
      category: category || 'Technical',
      level: level || 'Intermediate',
      score: Number(score) || Math.floor(75 + Math.random() * 20),
      verifiedByTeacher: false,
      lastAssessedDate: new Date().toISOString().split('T')[0],
      assessmentQuestionsCount: 20,
      badgeUrl: `badge-${encodeURIComponent(skillName || 'skill')}`
    };

    db.skillAssessments.unshift(newAssessment);

    // Add notification to teachers about pending verification
    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      type: 'update',
      title: `Skill Verification Request: ${skillName}`,
      message: `${req.user?.name || 'Student'} completed assessment for ${skillName} with score ${newAssessment.score}%. Needs teacher approval.`,
      timestamp: 'Just now',
      read: false,
      badgeColor: 'blue'
    });

    recordGatewayLog('POST', '/api/skills/assessments/submit', 'Courses & Skills', req.user?.email || 'student', req.user?.role || 'student', 201, Date.now() - startTime);
    return res.status(201).json({ success: true, assessment: newAssessment });
  });

  app.put('/api/skills/assessments/:id/verify', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const startTime = Date.now();
    const { id } = req.params;
    const assessment = db.skillAssessments.find(s => s.id === id);
    if (!assessment) return res.status(404).json({ error: 'Assessment not found' });

    assessment.verifiedByTeacher = true;
    assessment.verifiedTeacherName = req.user?.name || 'Dr. Meenakshi Sundaram';

    recordGatewayLog('PUT', `/api/skills/assessments/${id}/verify`, 'Courses & Skills', req.user?.email || 'teacher', req.user?.role || 'teacher', 200, Date.now() - startTime);
    return res.json({ success: true, assessment });
  });

  // -------------------------------------------------------------
  // 5. OPPORTUNITIES SERVICE (Internships, Jobs, Applications)
  // -------------------------------------------------------------
  app.get('/api/opportunities', (req: Request, res: Response) => {
    const startTime = Date.now();
    recordGatewayLog('GET', '/api/opportunities', 'Opportunities', 'public', 'student', 200, Date.now() - startTime);
    return res.json(db.opportunities);
  });

  app.post('/api/opportunities/post', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const startTime = Date.now();
    const { title, type, workMode, location, stipendOrSalary, duration, openings, deadline, requiredSkills, preferredSkills, description, responsibilities, perks } = req.body;

    const newOpp = {
      id: `opp-${Date.now()}`,
      companyName: req.user?.name || 'Enterprise Partner',
      companyLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80',
      title: title || 'Full Stack / Automation Intern',
      type: (type || 'internship') as any,
      workMode: (workMode || 'Hybrid') as any,
      location: location || 'Bengaluru / Remote',
      stipendOrSalary: stipendOrSalary || '₹40,000 / month',
      duration: duration || '6 Months',
      openings: Number(openings) || 5,
      deadline: deadline || '2026-11-30',
      postedDate: new Date().toISOString().split('T')[0],
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : ['Smart Automation', 'Node.js'],
      preferredSkills: Array.isArray(preferredSkills) ? preferredSkills : ['React.js'],
      description: description || 'Exciting opportunity to build real-world systems with industry mentors.',
      responsibilities: Array.isArray(responsibilities) ? responsibilities : ['Design scalable architecture', 'Collaborate on campus initiatives'],
      perks: Array.isArray(perks) ? perks : ['Certificate of Completion', 'PPO Opportunity'],
      applicantsCount: 0,
      matchScore: 92,
      hasApplied: false
    };

    db.opportunities.unshift(newOpp);
    recordGatewayLog('POST', '/api/opportunities/post', 'Opportunities', req.user?.email || 'company', req.user?.role || 'company', 201, Date.now() - startTime);
    return res.status(201).json({ success: true, opportunity: newOpp });
  });

  app.post('/api/opportunities/:id/apply', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const startTime = Date.now();
    const { id } = req.params;
    const opp = db.opportunities.find(o => o.id === id);
    if (!opp) return res.status(404).json({ error: 'Opportunity not found' });

    opp.hasApplied = true;
    opp.applicantsCount += 1;

    const studentUser = db.users.find(u => u.id === req.user?.id) || db.users[0];

    // Smart Match Score calculation: count overlap of student skills and required skills
    const required = opp.requiredSkills.map(s => s.toLowerCase());
    const studentSkills = studentUser.skills.map(s => s.toLowerCase());
    const matched = required.filter(r => studentSkills.some(s => s.includes(r) || r.includes(s)));
    const matchScore = Math.min(98, Math.max(65, Math.round((matched.length / (required.length || 1)) * 100)));

    const newApp = {
      id: `app-${Date.now()}`,
      opportunityId: opp.id,
      opportunityTitle: opp.title,
      companyName: opp.companyName,
      studentId: studentUser.id,
      studentName: studentUser.name,
      studentEmail: studentUser.email,
      studentDepartment: studentUser.departmentOrIndustry,
      studentSkills: studentUser.skills,
      matchScore,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'applied' as const,
      notes: `Automated match calculated at ${matchScore}% based on verified skill profile.`
    };

    db.applications.unshift(newApp);

    // Create notification
    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      type: 'alert',
      title: `Application Submitted: ${opp.title}`,
      message: `Your application to ${opp.companyName} has been routed through API Gateway with match score ${matchScore}%.`,
      timestamp: 'Just now',
      read: false,
      badgeColor: 'emerald'
    });

    recordGatewayLog('POST', `/api/opportunities/${id}/apply`, 'Opportunities', studentUser.email, studentUser.role, 201, Date.now() - startTime);
    return res.status(201).json({ success: true, application: newApp });
  });

  app.get('/api/applications', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const startTime = Date.now();
    const userRole = req.user?.role || 'student';

    let filtered = db.applications;
    if (userRole === 'student') {
      filtered = db.applications.filter(a => a.studentId === req.user?.id || a.studentEmail === req.user?.email);
      // If none match student, show all for prototype richness
      if (filtered.length === 0) filtered = db.applications;
    }

    recordGatewayLog('GET', '/api/applications', 'Opportunities', req.user?.email || 'user', userRole, 200, Date.now() - startTime);
    return res.json(filtered);
  });

  app.put('/api/applications/:id/status', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const startTime = Date.now();
    const { id } = req.params;
    const { status, notes, interviewDate } = req.body;

    const application = db.applications.find(a => a.id === id);
    if (!application) return res.status(404).json({ error: 'Application not found' });

    if (status) application.status = status;
    if (notes) application.notes = notes;
    if (interviewDate) application.interviewDate = interviewDate;

    // Send notification to applicant
    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      type: 'alert',
      title: `Application Update: ${application.opportunityTitle}`,
      message: `Your status has been updated to "${status.replace('_', ' ').toUpperCase()}". Notes: ${notes || 'Action taken by recruiter.'}`,
      timestamp: 'Just now',
      read: false,
      badgeColor: status === 'selected' || status === 'interview_scheduled' ? 'emerald' : 'amber'
    });

    recordGatewayLog('PUT', `/api/applications/${id}/status`, 'Opportunities', req.user?.email || 'company', req.user?.role || 'company', 200, Date.now() - startTime);
    return res.json({ success: true, application });
  });

  // -------------------------------------------------------------
  // 6. NETWORK & COMMUNITY SERVICE (Follow/Connect, Discussions, Mentorship)
  // -------------------------------------------------------------
  app.get('/api/network/connections', (req: Request, res: Response) => {
    const startTime = Date.now();
    recordGatewayLog('GET', '/api/network/connections', 'Network & Community', 'user', 'student', 200, Date.now() - startTime);
    return res.json(db.connections);
  });

  app.post('/api/network/connect', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const startTime = Date.now();
    const { connectionId } = req.body;
    const conn = db.connections.find(c => c.id === connectionId);
    if (conn) {
      conn.status = conn.status === 'connected' ? 'pending' : 'connected';
    }
    recordGatewayLog('POST', '/api/network/connect', 'Network & Community', req.user?.email || 'user', req.user?.role || 'student', 200, Date.now() - startTime);
    return res.json({ success: true, connection: conn });
  });

  app.get('/api/network/discussions', (req: Request, res: Response) => {
    const startTime = Date.now();
    recordGatewayLog('GET', '/api/network/discussions', 'Network & Community', 'user', 'student', 200, Date.now() - startTime);
    return res.json(db.discussions);
  });

  app.post('/api/network/discussions', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const startTime = Date.now();
    const { title, content, tags } = req.body;
    const user = db.users.find(u => u.id === req.user?.id) || db.users[0];

    const newPost = {
      id: `disc-${Date.now()}`,
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
      authorAvatar: user.avatar,
      authorOrg: user.institutionOrCompany,
      title: title || 'Community Discussion on Skill Alignment',
      content: content || '',
      tags: Array.isArray(tags) ? tags : ['General', 'Skills'],
      upvotes: 1,
      isUpvoted: true,
      commentsCount: 0,
      createdAt: new Date().toISOString(),
      pinned: false
    };

    db.discussions.unshift(newPost);
    recordGatewayLog('POST', '/api/network/discussions', 'Network & Community', user.email, user.role, 201, Date.now() - startTime);
    return res.status(201).json({ success: true, discussion: newPost });
  });

  app.post('/api/network/discussions/:id/upvote', (req: Request, res: Response) => {
    const { id } = req.params;
    const post = db.discussions.find(d => d.id === id);
    if (post) {
      post.isUpvoted = !post.isUpvoted;
      post.upvotes += post.isUpvoted ? 1 : -1;
    }
    return res.json({ success: true, post });
  });

  app.get('/api/network/mentorships', (req: Request, res: Response) => {
    return res.json(db.mentorships);
  });

  app.post('/api/network/mentorships/book', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const startTime = Date.now();
    const { slotId } = req.body;
    const slot = db.mentorships.find(m => m.id === slotId);
    if (slot) {
      slot.bookedSlotsCount += 1;
    }

    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      type: 'message',
      title: 'Mentorship Confirmed',
      message: `You have successfully reserved a session with ${slot?.mentorName || 'Mentor'}. Details sent to your email.`,
      timestamp: 'Just now',
      read: false,
      badgeColor: 'emerald'
    });

    recordGatewayLog('POST', '/api/network/mentorships/book', 'Network & Community', req.user?.email || 'student', req.user?.role || 'student', 200, Date.now() - startTime);
    return res.json({ success: true, slot });
  });

  // -------------------------------------------------------------
  // 7. NOTIFICATIONS SERVICE (Alerts, Messages, Updates)
  // -------------------------------------------------------------
  app.get('/api/notifications', (req: Request, res: Response) => {
    const startTime = Date.now();
    recordGatewayLog('GET', '/api/notifications', 'Notifications', 'user', 'student', 200, Date.now() - startTime);
    return res.json(db.notifications);
  });

  app.put('/api/notifications/:id/read', (req: Request, res: Response) => {
    const { id } = req.params;
    const notif = db.notifications.find(n => n.id === id);
    if (notif) notif.read = true;
    return res.json({ success: true, notification: notif });
  });

  app.put('/api/notifications/read-all', (req: Request, res: Response) => {
    db.notifications.forEach(n => (n.read = true));
    return res.json({ success: true });
  });

  // -------------------------------------------------------------
  // 8. PLATFORM MODULES (Admission, Attendance, Exam, Library, Reports)
  // -------------------------------------------------------------
  app.get('/api/modules/all', (req: Request, res: Response) => {
    const startTime = Date.now();
    recordGatewayLog('GET', '/api/modules/all', 'Platform Modules', 'system', 'admin', 200, Date.now() - startTime);
    return res.json(db.platformModules);
  });

  app.put('/api/modules/admission/:id/status', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const reg = db.platformModules.admission.recentRegistrations.find(r => r.id === id);
    if (reg && status) {
      reg.status = status;
      if (status === 'approved') {
        db.platformModules.admission.pendingApprovals = Math.max(0, db.platformModules.admission.pendingApprovals - 1);
        db.platformModules.admission.verifiedStudents += 1;
      }
    }
    return res.json({ success: true, registration: reg });
  });

  // -------------------------------------------------------------
  // 9. SMART AUTOMATION & SKILL MAPPING ENGINE
  // -------------------------------------------------------------
  app.get('/api/smart-automation/analysis', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    const startTime = Date.now();
    const student = db.users.find(u => u.id === req.user?.id) || db.users[0];

    const studentSkills = student.skills || [];
    const highDemandIndustrySkills = [
      { name: 'Smart Automation & PLC Integration', demand: 95, taughtIn: 'Industry 4.0 Course' },
      { name: 'API Gateway & JWT Security', demand: 90, taughtIn: 'Enterprise Microservices Course' },
      { name: 'Python & Machine Learning', demand: 92, taughtIn: 'AI Systems' },
      { name: 'Docker & Microservices Orchestration', demand: 88, taughtIn: 'Cloud DevOps' },
      { name: 'Industrial IoT Protocols', demand: 85, taughtIn: 'Edge IoT Specialization' },
      { name: 'React.js & Frontend State Management', demand: 86, taughtIn: 'Full Stack Web' }
    ];

    const matched = highDemandIndustrySkills.map(sk => {
      const hasSkill = studentSkills.some(s => s.toLowerCase().includes(sk.name.toLowerCase()) || sk.name.toLowerCase().includes(s.toLowerCase()));
      const studentScore = hasSkill ? Math.floor(78 + Math.random() * 18) : Math.floor(30 + Math.random() * 25);
      return {
        name: sk.name,
        studentProficiency: studentScore,
        industryDemand: sk.demand,
        gap: Math.max(0, sk.demand - studentScore)
      };
    });

    const averageGap = matched.reduce((acc, curr) => acc + curr.gap, 0) / matched.length;
    const readinessScore = Math.max(50, Math.min(96, Math.round(100 - averageGap)));

    const missing = matched.filter(m => m.gap > 25).map(m => m.name);

    // AI Generated Insights using Gemini if available, or smart rule-based synthesis
    let aiExecutiveSummary = `Based on current industry placement benchmarks for 2026, ${student.name} demonstrates standout proficiency in React.js and Python (88%+ match). To reach top-tier placement brackets (14+ LPA) in automated enterprise engineering, candidate is recommended to bridge knowledge in Industrial IoT protocols and Docker containerization.`;

    const ai = getGeminiClient();
    if (ai) {
      try {
        const prompt = `As the AI Skill Mapping & Smart Automation Engine for Smart India Hackathon (SIH 2026), analyze this student profile:
Student Name: ${student.name}
Department: ${student.departmentOrIndustry}
Existing Skills: ${studentSkills.join(', ')}
Identified Skill Gaps: ${missing.join(', ')}
Readiness Score: ${readinessScore}/100

Provide a concise, 2-3 sentence executive recommendation for academic bridging and industry placement readiness.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt
        });

        if (response.text) {
          aiExecutiveSummary = response.text.trim();
        }
      } catch (err) {
        console.warn('Gemini API call skipped or errored, using high-fidelity fallback summary', err);
      }
    }

    recordGatewayLog('GET', '/api/smart-automation/analysis', 'Smart Automation', student.email, student.role, 200, Date.now() - startTime);

    return res.json({
      overallReadinessScore: readinessScore,
      matchedSkills: matched,
      missingHighDemandSkills: missing,
      recommendedCourses: db.courses.slice(0, 3),
      recommendedInternships: db.opportunities.filter(o => (o.matchScore || 0) > 80),
      aiExecutiveSummary
    });
  });

  // -------------------------------------------------------------
  // 10. VITE MIDDLEWARE (DEV) / STATIC SERVING (PROD)
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SkillSync API Gateway] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
