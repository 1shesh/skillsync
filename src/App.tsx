import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { CoursesAndSkillsView } from './components/CoursesAndSkillsView';
import { OpportunitiesView } from './components/OpportunitiesView';
import { NetworkAndCommunityView } from './components/NetworkAndCommunityView';
import { PlatformModulesView } from './components/PlatformModulesView';
import { SmartAutomationAnalyticsView } from './components/SmartAutomationAnalyticsView';
import { UserManagementView } from './components/UserManagementView';
import { LoginModal } from './components/LoginModal';
import { LoginWindow } from './components/LoginWindow';
import { ArchitectureModal } from './components/ArchitectureModal';
import { JwtTokenInspector } from './components/JwtTokenInspector';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import {
  UserProfile,
  UserRole,
  Course,
  Opportunity,
  SkillAssessment,
  JobApplication,
  DiscussionThread,
  MentorshipSession,
  AppNotification,
  PlatformModuleData,
  SmartSkillGapAnalysis
} from './types';
import {
  Layers,
  Sparkles,
  ShieldCheck,
  Zap,
  KeyRound,
  ArrowRight,
  Server,
  Activity,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [user, setUser] = useState<UserProfile>({
    id: 'usr-student-01',
    name: 'Aarav Sharma',
    email: 'student@sih.ac.in',
    role: 'student',
    institutionOrCompany: 'NIT Trichy',
    departmentOrIndustry: 'B.Tech AI & Data Engineering',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Specializing in edge intelligence, API microservices and industrial robotics.',
    skills: ['React.js', 'Python', 'Docker', 'JWT Authentication', 'IoT Telemetry', 'REST APIs'],
    stats: {
      appliedJobsCount: 3,
      verifiedSkillsCount: 4,
      connectionsCount: 42,
      placementReadinessScore: 88
    },
    jwtTokenExpiresAt: '2026-09-12'
  });

  const [token, setToken] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [assessments, setAssessments] = useState<SkillAssessment[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [connections, setConnections] = useState<UserProfile[]>([]);
  const [discussions, setDiscussions] = useState<DiscussionThread[]>([]);
  const [mentorships, setMentorships] = useState<MentorshipSession[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [platformModules, setPlatformModules] = useState<PlatformModuleData | null>(null);
  const [smartAnalysis, setSmartAnalysis] = useState<SmartSkillGapAnalysis | null>(null);

  // Modals & Drawers
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isArchModalOpen, setIsArchModalOpen] = useState(false);
  const [isJwtInspectorOpen, setIsJwtInspectorOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [loginModalInitialRole, setLoginModalInitialRole] = useState<UserRole>('student');

  // Gateway Route Feedback Toast
  const [gatewayToast, setGatewayToast] = useState<{ message: string; endpoint: string } | null>(null);

  const showGatewayToast = (message: string, endpoint: string) => {
    setGatewayToast({ message, endpoint });
    setTimeout(() => setGatewayToast(null), 3500);
  };

  // 1. Initial Login & Seed Data Fetch
  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        // Automatically issue demo student JWT
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'student@sih.ac.in', role: 'student' })
        });
        if (res.ok) {
          const data = await res.json();
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem('skillsync_jwt', data.token);
        }
      } catch (e) {
        console.error('Initial login fetch error:', e);
      }
    };
    bootstrapAuth();
  }, []);

  // 2. Fetch Microservices Data
  const refreshAllData = async () => {
    try {
      const headers = {
        'Authorization': `Bearer ${token || localStorage.getItem('skillsync_jwt') || ''}`
      };

      const [
        coursesRes,
        oppRes,
        assessRes,
        appsRes,
        connRes,
        discRes,
        mentRes,
        notifRes,
        modRes,
        smartRes
      ] = await Promise.all([
        fetch('/api/courses', { headers }),
        fetch('/api/opportunities', { headers }),
        fetch('/api/skills/assessments', { headers }),
        fetch('/api/applications', { headers }),
        fetch('/api/network/connections', { headers }),
        fetch('/api/network/discussions', { headers }),
        fetch('/api/network/mentorships', { headers }),
        fetch('/api/notifications', { headers }),
        fetch('/api/modules/all', { headers }),
        fetch('/api/smart-automation/analysis', { headers })
      ]);

      if (coursesRes.ok) {
        const d = await coursesRes.json();
        setCourses(d.courses || []);
      }
      if (oppRes.ok) {
        const d = await oppRes.json();
        setOpportunities(d.opportunities || []);
      }
      if (assessRes.ok) {
        const d = await assessRes.json();
        setAssessments(d.assessments || []);
      }
      if (appsRes.ok) {
        const d = await appsRes.json();
        setApplications(d.applications || []);
      }
      if (connRes.ok) {
        const d = await connRes.json();
        setConnections(d.connections || []);
      }
      if (discRes.ok) {
        const d = await discRes.json();
        setDiscussions(d.discussions || []);
      }
      if (mentRes.ok) {
        const d = await mentRes.json();
        setMentorships(d.mentorships || []);
      }
      if (notifRes.ok) {
        const d = await notifRes.json();
        setNotifications(d.notifications || []);
      }
      if (modRes.ok) {
        const d = await modRes.json();
        setPlatformModules(d);
      }
      if (smartRes.ok) {
        const d = await smartRes.json();
        setSmartAnalysis(d);
      }
    } catch (err) {
      console.error('Error fetching microservices data:', err);
    }
  };

  useEffect(() => {
    if (token) {
      refreshAllData();
    }
  }, [token]);

  // Auth Handlers
  const handleLoginSuccess = (newToken: string, newUser: UserProfile, gatewayRoute: string) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('skillsync_jwt', newToken);
    showGatewayToast(`JWT Validated by Gateway → Routed to ${newUser.role.toUpperCase()} Portal`, gatewayRoute);
    refreshAllData();
  };

  const handleRoleSwitch = async (newRole: UserRole) => {
    try {
      const emailMap: Record<UserRole, string> = {
        student: 'student@sih.ac.in',
        teacher: 'teacher@sih.ac.in',
        company: 'company@sih.ac.in',
        admin: 'admin@sih.ac.in'
      };
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailMap[newRole], role: newRole })
      });
      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('skillsync_jwt', data.token);
        showGatewayToast(`JWT Reissued: Switched to ${newRole.toUpperCase()} Portal`, data.gatewayRoute);
        refreshAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Microservice Actions Handlers
  const handleEnrollCourse = async (courseId: string) => {
    try {
      const res = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ courseId })
      });
      if (res.ok) {
        showGatewayToast('Enrolled in Course via API Gateway', 'POST /api/courses/enroll');
        refreshAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleApplyOpportunity = async (opportunityId: string) => {
    try {
      const res = await fetch(`/api/opportunities/${opportunityId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          coverNote: 'Excited to apply! My verified skills align with this opening.'
        })
      });
      if (res.ok) {
        showGatewayToast('Application Submitted to ATS Microservice', `POST /api/opportunities/${opportunityId}/apply`);
        refreshAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitAssessment = async (newAssessment: {
    skillName: string;
    category: string;
    level: string;
    score: number;
  }) => {
    try {
      const res = await fetch('/api/skills/assessments/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newAssessment)
      });
      if (res.ok) {
        showGatewayToast('Diagnostic Graded & Routed to Faculty Queue', 'POST /api/skills/assessments/submit');
        refreshAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleVerifySkill = async (assessmentId: string) => {
    try {
      const res = await fetch(`/api/skills/assessments/${assessmentId}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        showGatewayToast('Skill Badge Verified by Faculty Member', `PUT /api/skills/assessments/${assessmentId}/verify`);
        refreshAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleConnect = async (targetUserId: string) => {
    try {
      const res = await fetch('/api/network/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ targetUserId })
      });
      if (res.ok) {
        showGatewayToast('Connection established via Network Microservice', 'POST /api/network/connect');
        refreshAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePostDiscussion = async (title: string, content: string, tags: string[]) => {
    try {
      const res = await fetch('/api/network/discussions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content, tags, category: 'Technical' })
      });
      if (res.ok) {
        showGatewayToast('Discussion Thread Broadcasted to Community', 'POST /api/network/discussions');
        refreshAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLikeDiscussion = async (threadId: string) => {
    try {
      const res = await fetch(`/api/network/discussions/${threadId}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        refreshAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleBookMentorship = async (
    mentorName: string,
    mentorRole: string,
    mentorOrg: string,
    topic: string,
    date: string,
    time: string
  ) => {
    try {
      const res = await fetch('/api/network/mentorships/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ mentorName, mentorRole, mentorOrg, topic, scheduledDate: date, scheduledTime: time })
      });
      if (res.ok) {
        showGatewayToast('Mentorship Session Scheduled & Dispatched', 'POST /api/network/mentorships/book');
        refreshAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateApplicationStatus = async (
    applicationId: string,
    status: string,
    notes?: string,
    interviewDate?: string
  ) => {
    try {
      const res = await fetch(`/api/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, notes, interviewDate })
      });
      if (res.ok) {
        showGatewayToast(`Applicant Status Updated to: ${status.toUpperCase()}`, `PUT /api/applications/${applicationId}/status`);
        refreshAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePostOpportunity = async (oppData: any) => {
    try {
      const res = await fetch('/api/opportunities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(oppData)
      });
      if (res.ok) {
        showGatewayToast('New Opening Published via Opportunity Microservice', 'POST /api/opportunities');
        refreshAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateCourse = async (newCourse: any) => {
    try {
      const res = await fetch('/api/courses/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newCourse)
      });
      if (res.ok) {
        showGatewayToast('Industry Course Created & Published', 'POST /api/courses/create');
        refreshAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleApproveAdmission = async (admissionId: string) => {
    try {
      const res = await fetch(`/api/modules/admission/${admissionId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'approved' })
      });
      if (res.ok) {
        showGatewayToast('Admission Approved in Academic ERP Module', `PUT /api/modules/admission/${admissionId}/status`);
        refreshAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateProfile = async (updated: Partial<UserProfile>) => {
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        const d = await res.json();
        setUser(d.user);
        showGatewayToast('Profile Synchronized Across User Management Module', 'PUT /api/users/profile');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkNotificationAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-200 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Architectural Ingress Banner */}
      <div className="bg-[#0D0D0D] text-slate-300 px-4 sm:px-8 py-2 text-xs border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="font-extrabold text-white tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            SIH 2026
          </span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400 font-medium hidden sm:inline text-xs">
            Smart Automation • Skill Mapping, Internships & Placements
          </span>
          <span className="px-2 py-0.5 rounded bg-blue-950/60 text-blue-400 border border-blue-800/50 font-mono text-[10px] tracking-wider uppercase">
            API Gateway Active
          </span>
        </div>

        {/* Evaluator Fast Portal Switcher & Inspectors */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-slate-400 font-medium text-[11px] hidden md:inline">
            Switch Portal Perspective:
          </span>
          <div className="inline-flex rounded-full bg-slate-900 p-1 border border-slate-800 text-[11px]">
            {(['student', 'teacher', 'company'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => handleRoleSwitch(r)}
                className={`px-3 py-1 rounded-full font-bold uppercase text-[10px] tracking-wider transition ${
                  user.role === r
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {r === 'teacher' ? 'Faculty' : r}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setLoginModalInitialRole(user.role);
              setIsLoginModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/80 hover:bg-blue-900 border border-blue-600/70 text-blue-300 hover:text-white font-medium text-[11px] font-mono transition shadow-xs"
            title="Open Login Window (Student, Teacher, Company portals)"
          >
            <KeyRound className="w-3.5 h-3.5 text-blue-400" />
            <span>Login Window</span>
          </button>

          <button
            onClick={() => setIsJwtInspectorOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-400 hover:text-amber-300 font-medium text-[11px] font-mono transition"
            title="Inspect JWT Claims"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>JWT Claims</span>
          </button>

          <button
            onClick={() => setIsArchModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/40 hover:bg-blue-800/60 border border-blue-700/60 text-blue-300 font-medium text-[11px] transition"
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>SIH Architecture</span>
          </button>
        </div>
      </div>

      {/* Primary Navigation Bar */}
      <Navbar
        user={user}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRoleSwitch={handleRoleSwitch}
        onOpenLoginModal={(role) => {
          setLoginModalInitialRole(role);
          setIsLoginModalOpen(true);
        }}
        onOpenArchitectureModal={() => setIsArchModalOpen(true)}
        onOpenJwtInspector={() => setIsJwtInspectorOpen(true)}
        notificationsCount={notifications.filter(n => !n.read).length}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Gateway Telemetry Floating Toast */}
        {gatewayToast && (
          <div className="fixed bottom-5 right-5 z-40 bg-[#111111] text-white p-4 rounded-2xl border border-blue-500/40 shadow-2xl animate-in slide-in-from-bottom-3 duration-200 flex items-center gap-3 max-w-md backdrop-blur-md">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
              <Activity className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-100">{gatewayToast.message}</p>
              <p className="text-[10px] font-mono text-blue-400 truncate tracking-wide">{gatewayToast.endpoint}</p>
            </div>
          </div>
        )}

        {/* Dedicated Login Window Tab */}
        {activeTab === 'login-window' && (
          <div className="max-w-4xl mx-auto py-2 space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#0D0D0D] border border-slate-800">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Three-User Login Window</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800/50">
                    RBAC + API GATEWAY
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select Student, Faculty, or Recruiter portal to simulate JWT authentication and API Gateway route dispatches.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition w-fit"
              >
                Go to Dashboard →
              </button>
            </div>
            <LoginWindow
              onLoginSuccess={(token, user, route) => {
                handleLoginSuccess(token, user, route);
                setActiveTab('dashboard');
              }}
              initialRole={user.role}
              isModal={false}
            />
          </div>
        )}

        {/* Tab Routing */}
        {activeTab === 'dashboard' && (
          <DashboardView
            user={user}
            opportunities={opportunities}
            courses={courses}
            assessments={assessments}
            applications={applications}
            smartAnalysis={smartAnalysis}
            onNavigateTab={setActiveTab}
            onOpenOpportunity={(opp) => {
              setActiveTab('opportunities');
            }}
            onVerifySkill={handleVerifySkill}
            onPostOpportunityClick={() => {
              setActiveTab('opportunities');
            }}
          />
        )}

        {activeTab === 'courses-skills' && (
          <CoursesAndSkillsView
            user={user}
            courses={courses}
            assessments={assessments}
            smartAnalysis={smartAnalysis}
            onEnrollCourse={handleEnrollCourse}
            onSubmitAssessment={handleSubmitAssessment}
            onVerifySkill={handleVerifySkill}
            onCreateCourse={handleCreateCourse}
          />
        )}

        {activeTab === 'opportunities' && (
          <OpportunitiesView
            user={user}
            opportunities={opportunities}
            applications={applications}
            onApply={handleApplyOpportunity}
            onUpdateApplicationStatus={handleUpdateApplicationStatus}
            onPostOpportunity={handlePostOpportunity}
          />
        )}

        {activeTab === 'network' && (
          <NetworkAndCommunityView
            user={user}
            connections={connections}
            discussions={discussions}
            mentorships={mentorships}
            onConnect={handleConnect}
            onPostDiscussion={handlePostDiscussion}
            onLikeDiscussion={handleLikeDiscussion}
            onBookMentorship={handleBookMentorship}
          />
        )}

        {activeTab === 'platform-modules' && (
          <PlatformModulesView
            user={user}
            moduleData={platformModules}
            onApproveAdmission={handleApproveAdmission}
          />
        )}

        {activeTab === 'automation-analytics' && (
          <SmartAutomationAnalyticsView
            user={user}
            analysis={smartAnalysis}
            onRefreshAnalysis={refreshAllData}
          />
        )}

        {(activeTab === 'user-mgmt' || activeTab === 'profile-settings') && (
          <UserManagementView
            user={user}
            token={token}
            onUpdateProfile={handleUpdateProfile}
            onSwitchRole={handleRoleSwitch}
            onOpenJwtInspector={() => setIsJwtInspectorOpen(true)}
            onOpenLoginWindow={() => setIsLoginModalOpen(true)}
          />
        )}
      </main>

      {/* Footer with Editorial Styling */}
      <footer className="border-t border-slate-800 bg-[#0D0D0D] px-6 sm:px-8 py-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-slate-400 tracking-[0.2em] uppercase">
              Gateway Status: Operational
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            <span>SIH 2026 PROTOTYPE</span>
            <span>•</span>
            <span>SYSTEM BUILD 1.0.4-EDITORIAL</span>
            <span>•</span>
            <button
              onClick={() => setIsArchModalOpen(true)}
              className="text-blue-400 hover:text-blue-300 font-bold transition"
            >
              BLUEPRINT
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialRole={loginModalInitialRole}
      />

      <ArchitectureModal
        isOpen={isArchModalOpen}
        onClose={() => setIsArchModalOpen(false)}
      />

      <JwtTokenInspector
        isOpen={isJwtInspectorOpen}
        onClose={() => setIsJwtInspectorOpen(false)}
        token={token}
        user={user}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationAsRead}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        onNavigateToTab={setActiveTab}
      />
    </div>
  );
}
