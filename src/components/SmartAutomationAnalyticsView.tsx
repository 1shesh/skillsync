import React, { useState } from 'react';
import {
  Sparkles,
  BarChart3,
  TrendingUp,
  Cpu,
  RefreshCw,
  Zap,
  Activity,
  Award,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { SmartSkillGapAnalysis, UserProfile } from '../types';

interface SmartAutomationAnalyticsViewProps {
  user: UserProfile;
  analysis: SmartSkillGapAnalysis | null;
  onRefreshAnalysis: () => Promise<void>;
}

export const SmartAutomationAnalyticsView: React.FC<SmartAutomationAnalyticsViewProps> = ({
  user,
  analysis,
  onRefreshAnalysis
}) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefreshAnalysis();
    setRefreshing(false);
  };

  const skillGaps = analysis?.matchedSkills || [
    { name: 'React & Modern Frontend', studentProficiency: 92, industryDemand: 86, gap: 0 },
    { name: 'Python for Automation & AI', studentProficiency: 88, industryDemand: 92, gap: 4 },
    { name: 'API Gateway & JWT Security', studentProficiency: 84, industryDemand: 90, gap: 6 },
    { name: 'Docker & Containerization', studentProficiency: 65, industryDemand: 88, gap: 23 },
    { name: 'Industrial IoT & Automation Protocols', studentProficiency: 45, industryDemand: 85, gap: 40 }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Theme: Smart Automation & Automated Candidate Matching</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Smart India Hackathon 2026 Analytics Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Autonomous algorithms evaluate student lab diagnostics against live enterprise requisitions to eliminate manual placement friction.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Re-analyzing...' : 'Run Automated Skill Diagnostic'}</span>
          </button>
        </div>
      </div>

      {/* AI Executive Assessment Callout */}
      <div className="p-5 rounded-2xl bg-white border border-indigo-200 bg-indigo-50/30 shadow-2xs space-y-2">
        <div className="flex items-center gap-2 text-indigo-950 font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Automated Skill Gap & Placement Readiness Briefing</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          {analysis?.aiExecutiveSummary ||
            'Candidate Aarav Sharma demonstrates exceptional mastery in React, TypeScript, and microservice token routing. To achieve a 98% placement readiness score for Industrial IoT and Automation engineering roles at Siemens or TCS, completing the verified Docker and MQTT telemetry lab modules is recommended.'}
        </p>
      </div>

      {/* 3 High-Impact Automation Cards */}
      <div className="grid md:grid-cols-3 gap-5">
        {/* Overall Readiness Index */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Automated Match Index
            </span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900">
              {analysis?.overallReadinessScore || 88}%
            </span>
            <span className="text-xs text-emerald-600 font-bold">+8.4% above batch average</span>
          </div>
          <p className="text-xs text-slate-600">
            Computed by weighted comparison across verified competencies, coursework, and live hiring specs.
          </p>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${analysis?.overallReadinessScore || 88}%` }}
            />
          </div>
        </div>

        {/* Industry Skill Demand Velocity */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Fastest Rising Skill Demand
            </span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">
              Industrial IoT & MQTT
            </span>
            <span className="block text-xs text-indigo-600 font-bold mt-0.5">
              +42% hiring mandate surge this quarter
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Driven by Industry 4.0 automation adoption across manufacturing and smart grids.
          </p>
        </div>

        {/* Candidate Matching Speed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Candidate Matching Latency
            </span>
            <Cpu className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900">&lt; 150ms</span>
            <span className="text-xs text-amber-600 font-bold">API Gateway edge compute</span>
          </div>
          <p className="text-xs text-slate-600">
            Zero-latency role matching enables recruiters to evaluate pre-screened talent instantly upon job posting.
          </p>
        </div>
      </div>

      {/* Skill Mapping Comparison Visualizer */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Skill Mapping & Competency Differential (Student Proficiency vs Industry Demand)
            </h3>
            <p className="text-xs text-slate-500">
              Smart automated diagnosis identifying actionable curriculum intervention areas
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-indigo-700">
              <span className="w-3 h-3 rounded bg-indigo-600 inline-block" /> Student Proficiency
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded bg-slate-300 inline-block" /> Industry Benchmark Demand
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {skillGaps.map((sk, idx) => (
            <div key={idx} className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-slate-900 font-bold">{sk.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-indigo-600 font-bold">{sk.studentProficiency}% Proficient</span>
                  <span className="text-slate-400">vs</span>
                  <span className="text-slate-700">{sk.industryDemand}% Demanded</span>
                  {sk.gap > 15 && (
                    <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[10px]">
                      Bridge Needed (-{sk.gap}%)
                    </span>
                  )}
                </div>
              </div>

              {/* Dual Progress Bars */}
              <div className="space-y-1">
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden flex">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${sk.studentProficiency}%` }}
                  />
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden flex">
                  <div
                    className="bg-slate-400 h-full rounded-full opacity-70"
                    style={{ width: `${sk.industryDemand}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
