import React, { useState } from 'react';
import {
  Sparkles,
  Briefcase,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award,
  ArrowRight,
  Users,
  Building2,
  Activity,
  Layers,
  Search,
  ExternalLink,
  ShieldCheck,
  Check,
  Plus
} from 'lucide-react';
import {
  UserProfile,
  Opportunity,
  Course,
  SkillAssessment,
  JobApplication,
  SmartSkillGapAnalysis
} from '../types';

interface DashboardViewProps {
  user: UserProfile;
  opportunities: Opportunity[];
  courses: Course[];
  assessments: SkillAssessment[];
  applications: JobApplication[];
  smartAnalysis: SmartSkillGapAnalysis | null;
  onNavigateTab: (tab: string) => void;
  onOpenOpportunity: (opp: Opportunity) => void;
  onVerifySkill?: (id: string) => void;
  onPostOpportunityClick?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  opportunities,
  courses,
  assessments,
  applications,
  smartAnalysis,
  onNavigateTab,
  onOpenOpportunity,
  onVerifySkill,
  onPostOpportunityClick
}) => {
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const handleVerifySkillClick = async (id: string) => {
    if (!onVerifySkill) return;
    setVerifyingId(id);
    await onVerifySkill(id);
    setVerifyingId(null);
  };

  // -------------------------------------------------------------
  // STUDENT DASHBOARD
  // -------------------------------------------------------------
  if (user.role === 'student') {
    const readiness = smartAnalysis?.overallReadinessScore || 88;
    const topMatches = opportunities.filter(o => (o.matchScore || 0) >= 80).slice(0, 3);
    const inProgressCourses = courses.filter(c => c.isEnrolled).slice(0, 2);

    return (
      <div className="space-y-6">
        {/* Editorial Hero Placement Banner */}
        <div className="relative bg-gradient-to-br from-blue-900/20 via-[#0D0D0D] to-transparent border border-blue-500/30 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-600/10 blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 text-blue-400 border border-blue-800/50 text-[10px] font-mono tracking-widest uppercase">
                <Sparkles className="w-3 h-3 text-blue-400" />
                <span>Smart Automation • AI Gateway V1</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Industry <span className="text-blue-500">Placement</span> Ready.
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl">
                {smartAnalysis?.aiExecutiveSummary ||
                  'Your profile is currently being matched against 42 active roles in Smart Automation via our proprietary AI Gateway.'}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => onNavigateTab('opportunities')}
                  className="bg-white text-black px-6 py-2 rounded-xl text-xs font-bold hover:bg-slate-200 transition shadow-sm"
                >
                  Browse Internships
                </button>
                <button
                  onClick={() => onNavigateTab('network')}
                  className="bg-slate-800 text-white px-6 py-2 rounded-xl text-xs font-bold border border-slate-700 hover:bg-slate-700 transition"
                >
                  View Network
                </button>
              </div>
            </div>

            {/* Placement Readiness Score Gauge */}
            <div className="shrink-0 bg-[#111111]/90 backdrop-blur-md p-5 rounded-2xl border border-slate-800 text-center min-w-[200px]">
              <p className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold mb-1">
                Placement Readiness
              </p>
              <div className="my-1.5 flex items-baseline justify-center gap-1">
                <span className="text-4xl font-black text-emerald-400">{readiness}</span>
                <span className="text-xs font-mono text-slate-500">/ 100</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mb-2.5">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${readiness}%` }}
                />
              </div>
              <span className="text-[10px] font-mono tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60 block">
                TIER 1 (ELITE CANDIDATE)
              </span>
            </div>
          </div>
        </div>

        {/* 4 Key Metric Cards (Editorial Dark) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#111111] border border-slate-800 space-y-1">
            <span className="text-[10px] tracking-[0.2em] text-blue-400 font-bold uppercase block">Verified Skills</span>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-black text-white">
                {assessments.filter(a => a.verifiedByTeacher).length}
              </span>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-[11px] text-emerald-400 font-medium">Teacher Validated</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#111111] border border-slate-800 space-y-1">
            <span className="text-[10px] tracking-[0.2em] text-blue-400 font-bold uppercase block">Active Applications</span>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-black text-white">{applications.length}</span>
              <Briefcase className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-[11px] text-blue-400 font-medium">Routed via API Gateway</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#111111] border border-slate-800 space-y-1">
            <span className="text-[10px] tracking-[0.2em] text-blue-400 font-bold uppercase block">Enrolled Courses</span>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-black text-white">
                {courses.filter(c => c.isEnrolled).length}
              </span>
              <BookOpen className="w-5 h-5 text-indigo-400" />
            </div>
            <p className="text-[11px] text-indigo-400 font-medium">Industry Co-Designed</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#111111] border border-slate-800 space-y-1">
            <span className="text-[10px] tracking-[0.2em] text-blue-400 font-bold uppercase block">High-Match Roles</span>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-black text-white">
                {opportunities.filter(o => (o.matchScore || 0) >= 80).length}
              </span>
              <TrendingUp className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-[11px] text-amber-400 font-medium">&gt;80% Automated Alignment</p>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Smart Skill Map & High Match Internships */}
          <div className="lg:col-span-2 space-y-6">
            {/* Automated Skill Matrix 2.0 */}
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[10px] tracking-[0.2em] text-blue-400 font-bold uppercase">
                    Skill Matrix 2.0 & Automated Gap Radar
                  </h3>
                  <p className="text-xs text-slate-400">
                    Live candidate telemetry compared with verified enterprise requisitions
                  </p>
                </div>
                <button
                  onClick={() => onNavigateTab('courses-skills')}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                >
                  <span>Skill Assessments</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-4 pt-1">
                {(smartAnalysis?.matchedSkills || [
                  { name: 'Full Stack Dev & API Gateways', studentProficiency: 85, industryDemand: 90, gap: 5 },
                  { name: 'Data Engineering & Analytics', studentProficiency: 62, industryDemand: 80, gap: 18 },
                  { name: 'Smart Automation & PLC Integration', studentProficiency: 94, industryDemand: 88, gap: 0 },
                  { name: 'Docker & Microservices Orchestration', studentProficiency: 84, industryDemand: 88, gap: 4 }
                ]).map((sk, idx) => (
                  <div key={idx} className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between font-medium">
                      <span className="text-slate-300">{sk.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 text-[11px]">
                          Proficiency: <strong className="text-blue-400">{sk.studentProficiency}%</strong>
                        </span>
                        <span className="text-slate-500 text-[11px]">
                          Demand: <strong className="text-slate-300">{sk.industryDemand}%</strong>
                        </span>
                        {sk.gap > 20 ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Gap: {sk.gap}%
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Verified Match
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          sk.studentProficiency >= 90
                            ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]'
                            : sk.studentProficiency >= 75
                            ? 'bg-blue-500'
                            : 'bg-blue-400'
                        }`}
                        style={{ width: `${sk.studentProficiency}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Internships */}
            <div className="p-5 rounded-2xl bg-[#111111] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[10px] tracking-[0.2em] text-blue-400 font-bold uppercase">
                    Active Opportunities & Placement Matching
                  </h3>
                  <p className="text-xs text-slate-400">
                    Ranked by Automated Skill-Match Algorithm
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
                    LIVE
                  </span>
                  <button
                    onClick={() => onNavigateTab('opportunities')}
                    className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {topMatches.map((opp) => (
                  <div
                    key={opp.id}
                    onClick={() => onOpenOpportunity(opp)}
                    className="p-3.5 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-blue-500/40 hover:bg-slate-800/50 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={opp.companyLogo}
                        alt={opp.companyName}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0 bg-white p-0.5"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs font-bold text-white">{opp.title}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold capitalize border border-slate-700">
                            {opp.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {opp.companyName} • {opp.location}
                        </p>
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          {opp.requiredSkills.map((sk, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 font-mono"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 shrink-0 border-t border-slate-800 sm:border-t-0 pt-2 sm:pt-0">
                      <div className="text-right">
                        <span className="text-xs font-bold text-white block">
                          {opp.stipendOrSalary}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 inline-block mt-0.5 font-mono">
                          {opp.matchScore}% Match
                        </span>
                      </div>
                      <span className="text-xs font-bold text-blue-400 hover:text-blue-300">
                        {opp.hasApplied ? 'Applied ✓' : 'View & Apply →'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 1 Col: Editorial Notification Hub, Role Info & Pipelines */}
          <div className="space-y-6">
            {/* Notification Hub Banner */}
            <div className="bg-blue-600 rounded-2xl p-5 text-white flex flex-col justify-between min-h-[110px] shadow-lg shadow-blue-600/20">
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-bold tracking-widest uppercase opacity-80 font-mono">
                  Notification Hub
                </p>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
              <p className="text-xs font-semibold leading-relaxed mt-2">
                Automated Gateway: Internship matching updated for Smart Automation & AI Systems roles.
              </p>
            </div>

            {/* Role Management & Backend Node Info */}
            <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl space-y-4">
              <h3 className="text-[10px] tracking-[0.2em] text-blue-400 font-bold uppercase">
                Role Management
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Verification Level</span>
                  <span className="font-bold text-white font-mono">Tier 3 (Elite)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Placement Status</span>
                  <span className="font-bold text-emerald-400 font-mono">ACTIVE</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Assigned Mentor</span>
                  <span className="font-bold text-white">Dr. Meenakshi Sundaram</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <h4 className="text-[10px] text-slate-500 uppercase font-mono mb-2 tracking-wider">
                  Backend Node Info
                </h4>
                <div className="text-[10px] font-mono text-blue-400 space-y-1 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <p>&gt; AUTH: Bearer eyJhbGciOiJIUzI1Ni...</p>
                  <p>&gt; ENDPOINT: /api/smart-automation/analysis</p>
                  <p>&gt; LATENCY: 24ms • STATUS: 200 OK</p>
                </div>
              </div>
            </div>

            {/* Active Applications Status */}
            <div className="p-5 rounded-2xl bg-[#111111] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] tracking-[0.2em] text-blue-400 font-bold uppercase">
                  Application Pipeline
                </h3>
                <span className="text-xs font-mono text-slate-400">{applications.length} Active</span>
              </div>

              <div className="space-y-3">
                {applications.map((app) => (
                  <div key={app.id} className="p-3 rounded-xl bg-slate-800/30 border border-slate-700/50 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-white leading-tight">
                          {app.opportunityTitle}
                        </h4>
                        <p className="text-[11px] text-slate-400">{app.companyName}</p>
                      </div>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                          app.status === 'interview_scheduled'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : app.status === 'shortlisted'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {app.status.replace('_', ' ')}
                      </span>
                    </div>

                    {app.interviewDate && (
                      <div className="p-2 rounded bg-emerald-950/40 border border-emerald-800/50 text-[11px] text-emerald-300 font-medium">
                        🗓️ Interview: {app.interviewDate}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800">
                      <span>Match: {app.matchScore}%</span>
                      <span>Applied: {app.appliedDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // TEACHER / FACULTY DASHBOARD
  // -------------------------------------------------------------
  if (user.role === 'teacher') {
    return (
      <div className="space-y-6">
        {/* Teacher Header Banner */}
        <div className="relative bg-gradient-to-br from-blue-950/40 via-[#0D0D0D] to-transparent border border-blue-500/30 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 text-blue-400 border border-blue-800/50 text-[10px] font-mono tracking-widest uppercase">
                <Award className="w-3.5 h-3.5" />
                <span>Faculty Portal • Institutional Skill Mapping & Verification</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Welcome, {user.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                {user.departmentOrIndustry} • {user.institutionOrCompany}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigateTab('courses-skills')}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/20 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Industry Course</span>
              </button>
              <button
                onClick={() => onNavigateTab('platform-modules')}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold transition border border-slate-700"
              >
                <span>Academic Reports</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Faculty Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#111111] border border-slate-800 space-y-1">
            <span className="text-[10px] tracking-[0.2em] text-blue-400 font-bold uppercase block">Students Mentored</span>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-black text-white">{user.stats.studentsMentored || 128}</span>
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-[11px] text-blue-400 font-medium font-mono">Active Batch 2026</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#111111] border border-slate-800 space-y-1">
            <span className="text-[10px] tracking-[0.2em] text-blue-400 font-bold uppercase block">Placement Rate</span>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-black text-white">92.8%</span>
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-[11px] text-emerald-400 font-medium font-mono">+4.2% YoY Improvement</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#111111] border border-slate-800 space-y-1">
            <span className="text-[10px] tracking-[0.2em] text-blue-400 font-bold uppercase block">Industry Partners</span>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-black text-white">48</span>
              <Building2 className="w-5 h-5 text-indigo-400" />
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Siemens, TCS, Infosys, etc.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#111111] border border-slate-800 space-y-1">
            <span className="text-[10px] tracking-[0.2em] text-blue-400 font-bold uppercase block">Pending Verifications</span>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-black text-white">
                {assessments.filter(a => !a.verifiedByTeacher).length}
              </span>
              <AlertCircle className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-[11px] text-amber-400 font-medium font-mono">Requires Faculty Review</p>
          </div>
        </div>

        {/* Pending Skill Verification Queue */}
        <div className="p-5 rounded-2xl bg-[#111111] border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-[10px] tracking-[0.2em] text-blue-400 font-bold uppercase flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                Student Skill Assessment Verification Queue
              </h3>
              <p className="text-xs text-slate-400">
                Verify student lab results and diagnostic quiz scores to issue authenticated digital badges
              </p>
            </div>
            <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded bg-blue-950/60 text-blue-400 border border-blue-800/50 self-start sm:self-auto">
              PUT /api/skills/assessments/:id/verify
            </span>
          </div>

          <div className="divide-y divide-slate-800/80">
            {assessments.map((sa) => (
              <div key={sa.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs font-bold text-white">{sa.skillName}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono border border-slate-700">
                      {sa.category} • {sa.level}
                    </span>
                    {sa.verifiedByTeacher ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 flex items-center gap-1 font-mono">
                        <Check className="w-3 h-3" /> Verified by {sa.verifiedTeacherName}
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20 font-mono">
                        Pending Evaluation
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    Candidate: Aarav Sharma (B.Tech AI) • Score: <strong className="text-white">{sa.score}%</strong> ({sa.assessmentQuestionsCount} Questions Evaluated)
                  </p>
                </div>

                {!sa.verifiedByTeacher && (
                  <button
                    onClick={() => handleVerifySkillClick(sa.id)}
                    disabled={verifyingId === sa.id}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shrink-0 flex items-center gap-1.5 shadow-md shadow-blue-600/20"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{verifyingId === sa.id ? 'Approving...' : 'Approve & Issue Badge'}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // COMPANY / RECRUITER DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Company Header */}
      <div className="relative bg-gradient-to-br from-blue-950/30 via-[#0D0D0D] to-transparent border border-blue-500/30 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 text-blue-400 border border-blue-800/50 text-[10px] font-mono tracking-widest uppercase">
              <Building2 className="w-3.5 h-3.5" />
              <span>Corporate Recruiter Portal • Automated Talent Pipeline</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {user.institutionOrCompany}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Talent Sourcing & Smart Automation Placement Drive
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateTab('opportunities')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/20 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post New Internship / Job</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Recruiter Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#111111] border border-slate-800 space-y-1">
          <span className="text-[10px] tracking-[0.2em] text-blue-400 font-bold uppercase block">Active Openings</span>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-2xl font-black text-white">{opportunities.length}</span>
            <Briefcase className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-[11px] text-blue-400 font-medium font-mono">Summer & Fall 2026</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#111111] border border-slate-800 space-y-1">
          <span className="text-[10px] tracking-[0.2em] text-blue-400 font-bold uppercase block">Total Applicants</span>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-2xl font-black text-white">
              {opportunities.reduce((acc, o) => acc + o.applicantsCount, 0)}
            </span>
            <Users className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-[11px] text-slate-400 font-medium font-mono">Cross-Campus Registrations</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#111111] border border-slate-800 space-y-1">
          <span className="text-[10px] tracking-[0.2em] text-blue-400 font-bold uppercase block">Top Match Rate</span>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-2xl font-black text-white">94%</span>
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-[11px] text-emerald-400 font-medium font-mono">Smart Automated Filter</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#111111] border border-slate-800 space-y-1">
          <span className="text-[10px] tracking-[0.2em] text-blue-400 font-bold uppercase block">Interviews Scheduled</span>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-2xl font-black text-white">
              {applications.filter(a => a.status === 'interview_scheduled').length}
            </span>
            <Activity className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-[11px] text-amber-400 font-medium font-mono">Technical Rounds Set</p>
        </div>
      </div>

      {/* Recruiter Candidate Review ATS */}
      <div className="p-5 rounded-2xl bg-[#111111] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[10px] tracking-[0.2em] text-blue-400 font-bold uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              Automated Candidate Matching & ATS Pipeline
            </h3>
            <p className="text-xs text-slate-400">
              Candidates sorted by automated match between job requirements and verified student skills
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('opportunities')}
            className="text-xs text-blue-400 hover:text-blue-300 font-bold"
          >
            Manage All Applications →
          </button>
        </div>

        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-blue-500/40 hover:bg-slate-800/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white">{app.studentName}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono border border-slate-700">
                    {app.studentDepartment}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold border border-emerald-500/20">
                    {app.matchScore}% Match Score
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Applying for: <strong className="text-white">{app.opportunityTitle}</strong>
                </p>
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  {app.studentSkills.map((sk, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 font-mono">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase font-mono ${
                    app.status === 'interview_scheduled'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {app.status.replace('_', ' ')}
                </span>
                <button
                  onClick={() => onNavigateTab('opportunities')}
                  className="text-xs px-3.5 py-1.5 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 border border-slate-700 transition"
                >
                  Review Candidate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
