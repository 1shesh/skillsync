import React, { useState } from 'react';
import {
  GraduationCap,
  Briefcase,
  Building2,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
  KeyRound,
  Eye,
  EyeOff,
  Server,
  Cpu,
  UserCheck,
  ExternalLink,
  Sparkles,
  Info
} from 'lucide-react';
import { UserRole, UserProfile } from '../types';

interface LoginWindowProps {
  onLoginSuccess: (token: string, user: UserProfile, gatewayRoute: string) => void;
  onClose?: () => void;
  initialRole?: UserRole;
  isModal?: boolean;
}

export const LoginWindow: React.FC<LoginWindowProps> = ({
  onLoginSuccess,
  onClose,
  initialRole = 'student',
  isModal = false
}) => {
  const [activePortal, setActivePortal] = useState<UserRole>(initialRole);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(false);
  const [authStep, setAuthStep] = useState<'idle' | 'signing_jwt' | 'gateway_routing' | 'success'>('idle');
  const [error, setError] = useState<string | null>(null);

  const portalConfigs: Record<UserRole, {
    roleName: string;
    targetAudience: string;
    tagline: string;
    icon: React.ReactNode;
    colorHex: string;
    accentBorder: string;
    accentBg: string;
    badgeText: string;
    defaultEmail: string;
    personaName: string;
    personaRole: string;
    personaAvatar: string;
    features: string[];
    gatewayEndpoint: string;
    modules: string[];
  }> = {
    student: {
      roleName: 'Student Portal',
      targetAudience: 'Learners & Candidates',
      tagline: 'Automated Skill Gap Mapping, Assessments & Matched Internships',
      icon: <GraduationCap className="w-5 h-5 text-blue-400" />,
      colorHex: '#2563EB',
      accentBorder: 'border-blue-500',
      accentBg: 'bg-blue-600/15 text-blue-400 border-blue-500/30',
      badgeText: 'STUDENT ACCESS',
      defaultEmail: 'student@sih.ac.in',
      personaName: 'Aarav Sharma',
      personaRole: 'Pre-final B.Tech (IIT BHU / NIT)',
      personaAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      features: [
        'Automated AI Skill Gap Matrix vs Live Job Market',
        'Direct Assessment Submissions & Badges',
        'AI Match Score Filtering for Internships & Jobs',
        'Peer Connection & Industry Fellow Mentorship'
      ],
      gatewayEndpoint: 'GET /api/student/dashboard',
      modules: ['Skill Mapping', 'Courses', 'ATS Applications']
    },
    teacher: {
      roleName: 'Teacher / Faculty Portal',
      targetAudience: 'Academic Faculty & HODs',
      tagline: 'Curriculum Alignment, Skill Verification & Placement Analytics',
      icon: <Briefcase className="w-5 h-5 text-emerald-400" />,
      colorHex: '#10B981',
      accentBorder: 'border-emerald-500',
      accentBg: 'bg-emerald-600/15 text-emerald-400 border-emerald-500/30',
      badgeText: 'FACULTY ACCESS',
      defaultEmail: 'teacher@sih.ac.in',
      personaName: 'Dr. Meenakshi Sundaram',
      personaRole: 'Head of Industry Collaboration & Placement Cell',
      personaAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      features: [
        'Student Assessment Verification & Endorsement Queue',
        'Curriculum Mapping against Current Industry Standards',
        'Department-wide Placement Readiness Analytics',
        'Direct Collaboration with Hiring Enterprises'
      ],
      gatewayEndpoint: 'GET /api/teacher/dashboard',
      modules: ['Verification Queue', 'Curriculum Sync', 'Analytics']
    },
    company: {
      roleName: 'Company / Recruiter Portal',
      targetAudience: 'Industry Partners & Recruiters',
      tagline: 'Smart Automated ATS Matching, Talent Sourcing & Openings',
      icon: <Building2 className="w-5 h-5 text-amber-400" />,
      colorHex: '#F59E0B',
      accentBorder: 'border-amber-500',
      accentBg: 'bg-amber-600/15 text-amber-400 border-amber-500/30',
      badgeText: 'RECRUITER ACCESS',
      defaultEmail: 'company@sih.ac.in',
      personaName: 'Ananya Verma (TCS NextGen Labs)',
      personaRole: 'Talent Acquisition Director & Innovation Practice',
      personaAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      features: [
        'Automated Candidate Match Score Algorithm',
        'Post Internship & Full-time Job Opportunities',
        'Filter Applicants by Teacher-Verified Competencies',
        'Host Industry Challenges & Review Student Profiles'
      ],
      gatewayEndpoint: 'GET /api/company/dashboard',
      modules: ['Smart ATS Matching', 'Post Jobs', 'Talent Sourcing']
    },
    admin: {
      roleName: 'Platform Admin',
      targetAudience: 'System Administrator',
      tagline: 'API Gateway Routing, Health Metrics & System Telemetry',
      icon: <ShieldCheck className="w-5 h-5 text-purple-400" />,
      colorHex: '#8B5CF6',
      accentBorder: 'border-purple-500',
      accentBg: 'bg-purple-600/15 text-purple-400 border-purple-500/30',
      badgeText: 'ADMIN ACCESS',
      defaultEmail: 'admin@sih.ac.in',
      personaName: 'SIH Platform Architect',
      personaRole: 'System Infrastructure Admin',
      personaAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      features: [
        'API Gateway Reverse Proxy Log Monitoring',
        'Microservices Telemetry & Performance Gauges',
        'Role-Based Access Control (RBAC) Administration'
      ],
      gatewayEndpoint: 'GET /api/gateway/logs',
      modules: ['Gateway Telemetry', 'Microservice Logs']
    }
  };

  const currentConfig = portalConfigs[activePortal];

  const handleExecuteLogin = async (targetEmail?: string, targetRole?: UserRole) => {
    setLoading(true);
    setError(null);
    setAuthStep('signing_jwt');

    const roleToUse = targetRole || activePortal;
    const emailToUse = targetEmail || email || portalConfigs[roleToUse].defaultEmail;

    try {
      // Step 1: JWT Signing handshake
      await new Promise(r => setTimeout(r, 400));
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToUse, role: roleToUse, password })
      });

      if (!res.ok) {
        throw new Error('Authentication failed. Please verify credentials.');
      }

      const data = await res.json();
      setAuthStep('gateway_routing');

      // Step 2: API Gateway Route Resolution & Role Claim Check
      await new Promise(r => setTimeout(r, 450));
      setAuthStep('success');

      setTimeout(() => {
        onLoginSuccess(data.token, data.user, data.gatewayRoute);
        if (onClose) onClose();
      }, 400);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check details.');
      setAuthStep('idle');
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAuthStep('signing_jwt');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name || `${activePortal.toUpperCase()} User`,
          email: email || `${activePortal}_${Date.now()}@sih.ac.in`,
          role: activePortal,
          institutionOrCompany: institution || (activePortal === 'company' ? 'Enterprise Partner' : 'NIT Trichy'),
          departmentOrIndustry: department || 'Engineering & AI',
          skills: activePortal === 'student' ? ['React.js', 'Python', 'Node.js'] : ['Industry Collaboration']
        })
      });

      if (!res.ok) throw new Error('Registration failed');
      const data = await res.json();

      setAuthStep('gateway_routing');
      await new Promise(r => setTimeout(r, 400));
      setAuthStep('success');

      setTimeout(() => {
        onLoginSuccess(data.token, data.user, data.gatewayRoute);
        if (onClose) onClose();
      }, 400);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      setAuthStep('idle');
      setLoading(false);
    }
  };

  const rolesList: UserRole[] = ['student', 'teacher', 'company'];

  return (
    <div className="w-full text-slate-200 font-sans">
      {/* Container Card with Editorial Aesthetic */}
      <div className="bg-[#0D0D0D] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header Bar */}
        <div className="px-6 py-5 bg-[#0A0A0A] border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-600/30">
              SIH
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Login Window
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/80 text-blue-400 border border-blue-800/50 font-bold uppercase tracking-wider">
                  3 Role Portals
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 hidden sm:inline">
                  JWT + API GATEWAY
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Industry Collaboration for Skill Mapping, Internships & Placements
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:flex items-center gap-1 text-[11px] font-mono text-slate-500">
              <Server className="w-3.5 h-3.5 text-blue-400" />
              Auth Microservice Online
            </span>
            {isModal && onClose && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
                aria-label="Close modal"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Section 1: The 3 User Portal Cards (Student, Teacher, Company) */}
        <div className="p-6 bg-[#0A0A0A]/50 border-b border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-slate-400 uppercase">
              Step 1: Choose Login Portal for User Perspective
            </span>
            <span className="text-[10px] text-blue-400 font-mono">
              Role-Based Access Control (RBAC)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rolesList.map((r) => {
              const cfg = portalConfigs[r];
              const isSelected = activePortal === r;
              return (
                <div
                  key={r}
                  onClick={() => {
                    setActivePortal(r);
                    setEmail(cfg.defaultEmail);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#141414] border-blue-500 shadow-xl ring-1 ring-blue-500/40'
                      : 'bg-[#111111] border-slate-800 hover:border-slate-700 hover:bg-[#161616]'
                  }`}
                >
                  {/* Top Row: Icon + Badge */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                        isSelected
                          ? 'bg-blue-600/20 text-blue-400 border-blue-500/30'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}>
                        {cfg.icon}
                      </div>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                        isSelected ? cfg.accentBg : 'bg-slate-900 text-slate-500 border-slate-800'
                      }`}>
                        {cfg.badgeText}
                      </span>
                    </div>

                    {/* Titles */}
                    <h3 className={`text-sm font-bold leading-tight ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                      {cfg.roleName}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {cfg.tagline}
                    </p>

                    {/* Pre-configured Persona Snippet */}
                    <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-2.5">
                      <img
                        src={cfg.personaAvatar}
                        alt={cfg.personaName}
                        className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0"
                      />
                      <div className="truncate">
                        <p className="text-[11px] font-semibold text-slate-200 truncate">
                          {cfg.personaName}
                        </p>
                        <p className="text-[9px] text-slate-500 truncate font-mono">
                          {cfg.defaultEmail}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Fast Instant Login Button inside Card */}
                  <div className="mt-4 pt-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePortal(r);
                        handleExecuteLogin(cfg.defaultEmail, r);
                      }}
                      disabled={loading}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                        isSelected
                          ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-300" />
                      <span>Instant Demo Login</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Active Portal Detailed Console & Form */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column (5 Cols): Selected Portal Capabilities & Architecture Route */}
          <div className="lg:col-span-5 space-y-4 border-b lg:border-b-0 lg:border-r border-slate-800 pb-6 lg:pb-0 lg:pr-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 font-bold">
                  Active Portal Specification
                </span>
              </div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                {currentConfig.roleName}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {currentConfig.tagline}
              </p>
            </div>

            {/* Microservice Modules Included */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                Activated Microservice Modules
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {currentConfig.modules.map((m, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-slate-900 text-slate-300 border border-slate-800"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Capabilities Checklist */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                Role Features in SIH Prototype
              </span>
              {currentConfig.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{feat}</span>
                </div>
              ))}
            </div>

            {/* Gateway Ingress Target */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1 font-mono text-[11px]">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5 text-blue-400">
                  <Cpu className="w-3.5 h-3.5" />
                  API Gateway Dispatch:
                </span>
                <span className="text-[10px] text-emerald-400">ROUTE AUTHENTICATED</span>
              </div>
              <p className="text-slate-300 text-xs truncate">
                {currentConfig.gatewayEndpoint}
              </p>
            </div>
          </div>

          {/* Right Column (7 Cols): The Login Credentials Form & Live JWT Simulation */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Error Notification */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <Info className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Live JWT Handshake Animation Box when logging in */}
            {authStep !== 'idle' && (
              <div className="p-4 rounded-2xl bg-[#090909] text-slate-200 text-xs space-y-2.5 border border-blue-500/40 shadow-xl">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="flex items-center gap-2 text-emerald-400 font-bold">
                    <KeyRound className="w-4 h-4 animate-spin text-blue-400" />
                    {authStep === 'signing_jwt' && 'Step 1: Auth Service signing JWT (algorithm: HS256)...'}
                    {authStep === 'gateway_routing' && `Step 2: API Gateway validating role claim "${activePortal}"...`}
                    {authStep === 'success' && 'Step 3: Route verified! Launching portal...'}
                  </span>
                  <span className="text-slate-500 font-mono">200 OK</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full transition-all duration-300"
                    style={{
                      width: authStep === 'signing_jwt' ? '45%' : authStep === 'gateway_routing' ? '85%' : '100%'
                    }}
                  />
                </div>
                <p className="text-[10px] font-mono text-slate-500">
                  Payload Claim: sub="{email || currentConfig.defaultEmail}", role="{activePortal}", iat={Math.floor(Date.now()/1000)}
                </p>
              </div>
            )}

            {/* Credentials Mode vs Registration Mode */}
            {!isRegisterMode ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleExecuteLogin();
                }}
                className="space-y-3.5"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-300">
                      Registered Email Address
                    </label>
                    <span className="text-[10px] font-mono text-blue-400">
                      Preset: {currentConfig.defaultEmail}
                    </span>
                  </div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={email || currentConfig.defaultEmail}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={currentConfig.defaultEmail}
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-[#111111] text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-300">
                      Password / Passcode
                    </label>
                    <span className="text-[10px] text-slate-500">
                      Default: password123
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-[#111111] text-white font-mono"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    JWT Signed (HS256 with 7-Day Exp)
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsRegisterMode(true)}
                    className="text-blue-400 font-semibold hover:underline"
                  >
                    Register New Account
                  </button>
                </div>

                {/* Primary Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => handleExecuteLogin(currentConfig.defaultEmail, activePortal)}
                    disabled={loading}
                    className="w-full py-2.5 px-4 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-md bg-[#161616] hover:bg-[#202020] border border-slate-700"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Quick Demo ({activePortal.toUpperCase()})</span>
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-lg bg-blue-600 hover:bg-blue-500 shadow-blue-600/30"
                  >
                    <span>Authenticate & Enter</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : (
              /* Registration Mode Form */
              <form onSubmit={handleRegister} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Create New {currentConfig.roleName} Account</span>
                  <button
                    type="button"
                    onClick={() => setIsRegisterMode(false)}
                    className="text-xs text-blue-400 hover:underline"
                  >
                    Back to Login
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Rohit Deshmukh"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-800 focus:ring-1 focus:ring-blue-500 bg-[#111111] text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={`new_${activePortal}@sih.ac.in`}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-800 focus:ring-1 focus:ring-blue-500 bg-[#111111] text-white"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      {activePortal === 'company' ? 'Company Name' : 'Institute'}
                    </label>
                    <input
                      type="text"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      placeholder={activePortal === 'company' ? 'Infosys / Siemens' : 'IIT / NIT / State College'}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-800 focus:ring-1 focus:ring-blue-500 bg-[#111111] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      {activePortal === 'company' ? 'Domain / Industry' : 'Department'}
                    </label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="Artificial Intelligence & Data"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-800 focus:ring-1 focus:ring-blue-500 bg-[#111111] text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-md bg-blue-600 hover:bg-blue-500 mt-2"
                >
                  <span>Register & Generate JWT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Quick Evaluator Switcher Bar */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-400">
              <span className="text-slate-500 uppercase">Evaluator Presets:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setActivePortal('student');
                    handleExecuteLogin('student@sih.ac.in', 'student');
                  }}
                  className="px-2 py-0.5 rounded bg-blue-950/80 text-blue-400 border border-blue-800/60 hover:bg-blue-900/90 transition"
                >
                  Student Portal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActivePortal('teacher');
                    handleExecuteLogin('teacher@sih.ac.in', 'teacher');
                  }}
                  className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 hover:bg-emerald-900/90 transition"
                >
                  Faculty Portal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActivePortal('company');
                    handleExecuteLogin('company@sih.ac.in', 'company');
                  }}
                  className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-800/60 hover:bg-amber-900/90 transition"
                >
                  Recruiter Portal
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Technical Callout */}
        <div className="px-6 py-3 bg-[#0A0A0A] border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
          <div className="flex items-center gap-2 font-mono text-[10px]">
            <Server className="w-3.5 h-3.5 text-blue-400" />
            <span>Architecture: Microservices + Reverse Proxy API Gateway (JWT Bearer Auth)</span>
          </div>
          <span className="font-mono text-[10px] text-blue-400">SIH-2026-CC-AUTH-SERVICE</span>
        </div>
      </div>
    </div>
  );
};
