import React, { useState, useEffect } from 'react';
import {
  Layers,
  ArrowRight,
  Database,
  Cpu,
  Shield,
  Server,
  Globe,
  Users,
  BookOpen,
  Briefcase,
  Share2,
  Bell,
  BarChart3,
  Cloud,
  CheckCircle2,
  Activity,
  Terminal,
  RefreshCw,
  Zap,
  Play
} from 'lucide-react';
import { ApiGatewayLog } from '../types';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTestGateway?: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeNode, setActiveNode] = useState<string>('gateway');
  const [gatewayLogs, setGatewayLogs] = useState<ApiGatewayLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [testingRoute, setTestingRoute] = useState(false);

  const fetchLogs = async () => {
    try {
      setLoadingLogs(true);
      const res = await fetch('/api/gateway/logs');
      if (res.ok) {
        const data = await res.json();
        setGatewayLogs(data.logs || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLogs();
      const interval = setInterval(fetchLogs, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const runTestGatewayRequest = async () => {
    setTestingRoute(true);
    try {
      await fetch('/api/smart-automation/analysis', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('skillsync_jwt') || ''}`
        }
      });
      await fetchLogs();
    } catch (e) {
      console.error(e);
    } finally {
      setTestingRoute(false);
    }
  };

  if (!isOpen) return null;

  const nodeDetails: Record<string, {
    title: string;
    category: string;
    description: string;
    endpoints: string[];
    techStack: string;
    status: string;
  }> = {
    users: {
      title: 'Users (Multi-Portal Roles)',
      category: 'Client Layer',
      description: 'Role-segregated ingress for Students, Teachers, and Companies with isolated permissions and tailored interfaces.',
      endpoints: ['POST /api/auth/login', 'POST /api/auth/register'],
      techStack: 'React.js, Tailwind CSS, Responsive Web UI',
      status: '3 Active Portal Profiles'
    },
    jwt: {
      title: 'Authentication Service (JWT)',
      category: 'Security Subsystem',
      description: 'Issues signed JSON Web Tokens (HMAC-SHA256) containing subject, role claims, and 7-day expiration for stateless verification.',
      endpoints: ['POST /api/auth/login', 'GET /api/auth/verify'],
      techStack: 'jsonwebtoken, Node.js Crypto, Bearer Token Auth',
      status: 'HS256 Signature Verified'
    },
    gateway: {
      title: 'API Gateway Router',
      category: 'Edge Infrastructure',
      description: 'Acts as reverse proxy & gatekeeper. Intercepts incoming requests, validates JWT authorization headers, enforces role policies, and routes traffic to microservices.',
      endpoints: ['/api/gateway/logs', '/api/users/*', '/api/courses/*', '/api/opportunities/*', '/api/network/*', '/api/notifications/*'],
      techStack: 'Express.js Reverse Proxy Middleware, Request Telemetry',
      status: 'Operational • Low Latency (<25ms)'
    },
    backend_services: {
      title: 'Core Backend Services',
      category: 'Microservices Layer',
      description: 'Decomposed functional domains: User Management, Courses & Skills, Opportunities, Network & Community, and Notifications.',
      endpoints: ['/api/users/me', '/api/courses/enroll', '/api/opportunities/apply', '/api/network/connect', '/api/notifications'],
      techStack: 'Node.js / Express.js Modular Handlers',
      status: '5/5 Microservices Healthy'
    },
    database: {
      title: 'Database & Models',
      category: 'Persistence Layer',
      description: 'Normalized schema housing student skill matrices, teacher evaluations, job postings, ATS pipelines, and community graph.',
      endpoints: ['PostgreSQL / MySQL Schema Models with Durable State'],
      techStack: 'Relational Database / In-Memory Seed Store',
      status: 'Schema Synchronized'
    },
    platform_modules: {
      title: 'Platform Academic Modules',
      category: 'Institutional Enterprise ERP',
      description: 'Institutional integration modules: Admission Approvals, Attendance Telemetry, Examination Diagnostics, Digital Library, and Placement Reporting.',
      endpoints: ['/api/modules/all', '/api/modules/admission/:id/status'],
      techStack: 'Institutional REST APIs, Attendance & Exam Trackers',
      status: 'Synced with Academic ERP'
    },
    analytics: {
      title: 'Reporting & Analytics (Smart Automation)',
      category: 'Intelligence & Insights',
      description: 'Calculates student-job skill match percentages, automated skill gap assessments, and generates placement readiness reports.',
      endpoints: ['GET /api/smart-automation/analysis', 'GET /api/modules/reports'],
      techStack: 'Chart.js / Dynamic Recharts / Gemini AI Summarizer',
      status: 'AI Matching Engine Active'
    }
  };

  const selectedNodeInfo = nodeDetails[activeNode] || nodeDetails.gateway;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 text-slate-100 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-900/50">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-white uppercase">
                  Technical Approach
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Smart India Hackathon 2026
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hidden sm:inline">
                  Team: Code Crafters
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Interactive Architectural Blueprint: Industry Collaboration, Skill Mapping & Automated Placements
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={runTestGatewayRequest}
              disabled={testingRoute}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{testingRoute ? 'Firing Request...' : 'Trigger Gateway Route'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Visual Architecture Flowchart (Re-creating the exact blueprint from the user photo) */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Live Architecture Diagram (Click any node to inspect telemetry)
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Status: Connected to Node.js Backend</span>
            </div>

            {/* Flow Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Column 1: Users & Auth Service */}
              <div className="space-y-3">
                {/* Users Node */}
                <button
                  onClick={() => setActiveNode('users')}
                  className={`w-full p-3.5 rounded-xl border text-left transition relative ${
                    activeNode === 'users'
                      ? 'bg-indigo-950/60 border-indigo-500 shadow-lg ring-1 ring-indigo-500'
                      : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Users</span>
                    <Users className="w-4 h-4 text-indigo-400" />
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1">Student • Teacher • Company</h4>
                  <p className="text-[11px] text-slate-400">3 Distinct Authentication Portals</p>
                </button>

                <div className="flex justify-center">
                  <div className="text-slate-500 text-xs flex items-center gap-1 font-mono">
                    ↓ Signup / Login
                  </div>
                </div>

                {/* Authentication Service (JWT) */}
                <button
                  onClick={() => setActiveNode('jwt')}
                  className={`w-full p-3.5 rounded-xl border text-left transition relative ${
                    activeNode === 'jwt'
                      ? 'bg-blue-950/60 border-blue-500 shadow-lg ring-1 ring-blue-500'
                      : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Auth Service</span>
                    <Shield className="w-4 h-4 text-blue-400" />
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1">JWT Token Service</h4>
                  <p className="text-[11px] text-slate-400">HS256 Secure Claims & Expiry</p>
                </button>

                <div className="flex justify-center">
                  <div className="text-slate-500 text-xs flex items-center gap-1 font-mono">
                    ↓ Bearer Token
                  </div>
                </div>

                {/* API Gateway */}
                <button
                  onClick={() => setActiveNode('gateway')}
                  className={`w-full p-3.5 rounded-xl border text-left transition relative ${
                    activeNode === 'gateway'
                      ? 'bg-cyan-950/60 border-cyan-500 shadow-lg ring-1 ring-cyan-500'
                      : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Gateway</span>
                    <Cpu className="w-4 h-4 text-cyan-400" />
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1">API Gateway Router</h4>
                  <p className="text-[11px] text-slate-400">Routes requests to respective modules</p>
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Reverse Proxy Active</span>
                  </div>
                </button>
              </div>

              {/* Column 2: Backend Services */}
              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                    Backend Services
                  </span>
                  <span className="text-[10px] text-slate-500">Target Microservices</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* User Management */}
                  <div
                    onClick={() => setActiveNode('backend_services')}
                    className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-slate-500 cursor-pointer transition"
                  >
                    <div className="flex items-center gap-2 mb-1 text-xs font-bold text-indigo-300">
                      <Users className="w-3.5 h-3.5" />
                      <span>User Management</span>
                    </div>
                    <ul className="text-[10px] text-slate-400 space-y-0.5 list-disc list-inside">
                      <li>Profile Management</li>
                      <li>Role Management</li>
                      <li>Account Settings</li>
                    </ul>
                  </div>

                  {/* Courses & Skills */}
                  <div
                    onClick={() => setActiveNode('backend_services')}
                    className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-slate-500 cursor-pointer transition"
                  >
                    <div className="flex items-center gap-2 mb-1 text-xs font-bold text-emerald-300">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Courses & Skills</span>
                    </div>
                    <ul className="text-[10px] text-slate-400 space-y-0.5 list-disc list-inside">
                      <li>Course Listings</li>
                      <li>Skill Assessment</li>
                      <li>Smart Recommendations</li>
                    </ul>
                  </div>

                  {/* Opportunities */}
                  <div
                    onClick={() => setActiveNode('backend_services')}
                    className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-slate-500 cursor-pointer transition"
                  >
                    <div className="flex items-center gap-2 mb-1 text-xs font-bold text-amber-300">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>Opportunities</span>
                    </div>
                    <ul className="text-[10px] text-slate-400 space-y-0.5 list-disc list-inside">
                      <li>Internship / Job Opportunities</li>
                      <li>Browse & Apply</li>
                      <li>Manage Applications</li>
                    </ul>
                  </div>

                  {/* Network & Community */}
                  <div
                    onClick={() => setActiveNode('backend_services')}
                    className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-slate-500 cursor-pointer transition"
                  >
                    <div className="flex items-center gap-2 mb-1 text-xs font-bold text-purple-300">
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Network & Community</span>
                    </div>
                    <ul className="text-[10px] text-slate-400 space-y-0.5 list-disc list-inside">
                      <li>Follow / Connect</li>
                      <li>Discussions Forum</li>
                      <li>Mentorship Sessions</li>
                    </ul>
                  </div>

                  {/* Notifications */}
                  <div
                    onClick={() => setActiveNode('backend_services')}
                    className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-slate-500 cursor-pointer transition sm:col-span-2"
                  >
                    <div className="flex items-center gap-2 mb-1 text-xs font-bold text-rose-300">
                      <Bell className="w-3.5 h-3.5" />
                      <span>Notifications Service</span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Dispatches Alerts, Messages, and Real-time Placement Updates
                    </p>
                  </div>
                </div>

                {/* Bottom Row: Database and Analytics */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    onClick={() => setActiveNode('database')}
                    className={`p-3 rounded-xl border text-left transition ${
                      activeNode === 'database'
                        ? 'bg-blue-950/60 border-blue-500'
                        : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1 text-xs font-bold text-blue-400">
                      <Database className="w-4 h-4" />
                      <span>Database</span>
                    </div>
                    <p className="text-[11px] text-slate-300">MySQL / PostgreSQL</p>
                    <p className="text-[10px] text-slate-500">Persistent Relational Entities</p>
                  </button>

                  <button
                    onClick={() => setActiveNode('analytics')}
                    className={`p-3 rounded-xl border text-left transition ${
                      activeNode === 'analytics'
                        ? 'bg-emerald-950/60 border-emerald-500'
                        : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1 text-xs font-bold text-emerald-400">
                      <BarChart3 className="w-4 h-4" />
                      <span>Reporting & Analytics</span>
                    </div>
                    <p className="text-[11px] text-slate-300">Smart Automation Insights</p>
                    <p className="text-[10px] text-slate-500">Placement & Skill Mapping</p>
                  </button>
                </div>
              </div>

              {/* Column 3: Platform Modules */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
                    Platform Modules
                  </span>
                  <span className="text-[10px] text-slate-500">Institutional ERP</span>
                </div>

                <div
                  onClick={() => setActiveNode('platform_modules')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition space-y-2.5 ${
                    activeNode === 'platform_modules'
                      ? 'bg-teal-950/60 border-teal-500 ring-1 ring-teal-500'
                      : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-teal-300">Admission</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">Manage Regs</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-300">Attendance</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">Track Rates</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-300">Examination</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">Conduct Exams</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-300">Library & Inventory</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">Assets & Docs</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-rose-300">Reports</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">Export & Audit</span>
                  </div>
                </div>

                {/* Hosting & Deployment Box from diagram */}
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-left">
                  <div className="flex items-center gap-2 mb-1 text-xs font-bold text-sky-400">
                    <Cloud className="w-4 h-4" />
                    <span>Hosting & Deployment</span>
                  </div>
                  <p className="text-[11px] text-slate-300">Cloud Run / AWS Container</p>
                  <p className="text-[10px] text-slate-500">Port 3000 Ingress Routing</p>
                </div>
              </div>
            </div>
          </div>

          {/* Node Detail Inspector & Telemetry Log Stream */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Inspector Panel for Selected Node */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Inspected Component
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
                  {selectedNodeInfo.category}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">{selectedNodeInfo.title}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {selectedNodeInfo.description}
                </p>
              </div>

              <div className="space-y-1.5 pt-1 border-t border-slate-800">
                <p className="text-[11px] font-semibold text-slate-300">Tech Stack & Framework:</p>
                <p className="text-xs font-mono text-emerald-400">{selectedNodeInfo.techStack}</p>
              </div>

              <div className="space-y-1.5 pt-1 border-t border-slate-800">
                <p className="text-[11px] font-semibold text-slate-300">Handled Endpoints:</p>
                <div className="space-y-1">
                  {selectedNodeInfo.endpoints.map((ep, i) => (
                    <div key={i} className="text-[11px] font-mono bg-slate-900 px-2 py-1 rounded text-slate-300 border border-slate-800">
                      {ep}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Live API Gateway Request Telemetry Stream */}
            <div className="md:col-span-2 bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    API Gateway Live Request Logs
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchLogs}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
                    title="Refresh logs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingLogs ? 'animate-spin text-emerald-400' : ''}`} />
                  </button>
                  <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800">
                    Live Telemetry
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-x-auto max-h-64 space-y-1 font-mono text-[11px]">
                {gatewayLogs.length === 0 ? (
                  <p className="text-slate-500 py-4 text-center">No telemetry logs recorded yet.</p>
                ) : (
                  gatewayLogs.slice(0, 10).map((log) => (
                    <div
                      key={log.id}
                      className="p-2 rounded bg-slate-900/80 border border-slate-800/80 flex items-center justify-between gap-2 hover:bg-slate-850"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            log.method === 'POST'
                              ? 'bg-amber-950 text-amber-400'
                              : log.method === 'PUT'
                              ? 'bg-blue-950 text-blue-400'
                              : 'bg-emerald-950 text-emerald-400'
                          }`}
                        >
                          {log.method}
                        </span>
                        <span className="text-slate-200 truncate">{log.endpoint}</span>
                        <span className="text-slate-500 text-[10px] hidden sm:inline">
                          → {log.serviceTarget}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 text-[10px]">
                        <span className="text-indigo-400 capitalize">{log.userRole}</span>
                        <span className="text-emerald-400 font-bold">{log.statusCode}</span>
                        <span className="text-slate-400">{log.latencyMs}ms</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer with SIH Tech Stack Overview (matching bottom of image) */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-bold text-white uppercase text-[11px]">Tech Stack:</span>
            <span>Frontend: <strong className="text-slate-200">React.js, Tailwind</strong></span>
            <span>Backend: <strong className="text-slate-200">Node.js, Express.js</strong></span>
            <span>Auth: <strong className="text-slate-200">JWT (HS256)</strong></span>
            <span>Analytics: <strong className="text-slate-200">Chart.js / Smart Automation</strong></span>
            <span>Hosting: <strong className="text-slate-200">Cloud Run / AWS</strong></span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition"
          >
            Close Diagram
          </button>
        </div>
      </div>
    </div>
  );
};
