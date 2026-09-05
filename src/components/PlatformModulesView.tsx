import React, { useState } from 'react';
import {
  Layers,
  GraduationCap,
  CalendarCheck,
  FileCheck2,
  Library,
  Bell,
  FileSpreadsheet,
  CheckCircle2,
  Download,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
  Check
} from 'lucide-react';
import { PlatformModuleData, UserProfile } from '../types';

interface PlatformModulesViewProps {
  user: UserProfile;
  moduleData: PlatformModuleData | null;
  onApproveAdmission?: (id: string) => Promise<void>;
  onExportReport?: (format: string) => void;
}

export const PlatformModulesView: React.FC<PlatformModulesViewProps> = ({
  user,
  moduleData,
  onApproveAdmission,
  onExportReport
}) => {
  const [activeModule, setActiveModule] = useState<'admission' | 'attendance' | 'examination' | 'library' | 'reports'>('admission');
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    if (!onApproveAdmission) return;
    setApprovingId(id);
    await onApproveAdmission(id);
    setApprovingId(null);
  };

  const handleExport = (format: string) => {
    if (onExportReport) onExportReport(format);
    setDownloadSuccess(`Placement_Readiness_Report_2026.${format}`);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
              Module: Platform Academic ERP Modules
            </span>
            <span className="text-xs text-slate-400">• Institutional Sync Subsystem</span>
          </div>
          <h2 className="text-xl font-black text-slate-900">
            Academic ERP & Institutional Services
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Admission, Attendance, Examination, and Placement Reporting integrated directly with SkillSync
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('pdf')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Placement Report</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Report generated successfully: <strong>{downloadSuccess}</strong></span>
        </div>
      )}

      {/* Module Selector Tabs (matching the exact 5 items from the diagram) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <button
          onClick={() => setActiveModule('admission')}
          className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
            activeModule === 'admission'
              ? 'bg-teal-900 text-white border-teal-800 shadow-xs'
              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
          }`}
        >
          <GraduationCap className={`w-4 h-4 ${activeModule === 'admission' ? 'text-teal-300' : 'text-teal-600'}`} />
          <div>
            <p className="text-xs font-bold leading-tight">Admission</p>
            <p className="text-[10px] opacity-75">Regs & Approvals</p>
          </div>
        </button>

        <button
          onClick={() => setActiveModule('attendance')}
          className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
            activeModule === 'attendance'
              ? 'bg-teal-900 text-white border-teal-800 shadow-xs'
              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
          }`}
        >
          <CalendarCheck className={`w-4 h-4 ${activeModule === 'attendance' ? 'text-emerald-300' : 'text-emerald-600'}`} />
          <div>
            <p className="text-xs font-bold leading-tight">Attendance</p>
            <p className="text-[10px] opacity-75">Tracking Rates</p>
          </div>
        </button>

        <button
          onClick={() => setActiveModule('examination')}
          className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
            activeModule === 'examination'
              ? 'bg-teal-900 text-white border-teal-800 shadow-xs'
              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
          }`}
        >
          <FileCheck2 className={`w-4 h-4 ${activeModule === 'examination' ? 'text-indigo-300' : 'text-indigo-600'}`} />
          <div>
            <p className="text-xs font-bold leading-tight">Examination</p>
            <p className="text-[10px] opacity-75">Exams & Diagnostics</p>
          </div>
        </button>

        <button
          onClick={() => setActiveModule('library')}
          className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
            activeModule === 'library'
              ? 'bg-teal-900 text-white border-teal-800 shadow-xs'
              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
          }`}
        >
          <Library className={`w-4 h-4 ${activeModule === 'library' ? 'text-amber-300' : 'text-amber-600'}`} />
          <div>
            <p className="text-xs font-bold leading-tight">Library</p>
            <p className="text-[10px] opacity-75">Assets & Resources</p>
          </div>
        </button>

        <button
          onClick={() => setActiveModule('reports')}
          className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
            activeModule === 'reports'
              ? 'bg-teal-900 text-white border-teal-800 shadow-xs'
              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
          }`}
        >
          <FileSpreadsheet className={`w-4 h-4 ${activeModule === 'reports' ? 'text-rose-300' : 'text-rose-600'}`} />
          <div>
            <p className="text-xs font-bold leading-tight">Reports</p>
            <p className="text-[10px] opacity-75">Export & Audits</p>
          </div>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. ADMISSION MODULE */}
      {/* ------------------------------------------------------------- */}
      {activeModule === 'admission' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Student Admission & Registration Approvals</h3>
              <p className="text-xs text-slate-500">
                Incoming student verification and registration workflow (Total: {moduleData?.admission?.totalRegistrations || 1420})
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              API: /api/modules/admission
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {moduleData?.admission?.recentRegistrations.map((adm) => (
              <div key={adm.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900">{adm.name}</h4>
                    <span className="text-[10px] text-slate-500">• {adm.program}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        adm.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {adm.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Registration ID: <span className="font-mono text-slate-700">{adm.id}</span> • Applied: {adm.appliedDate}
                  </p>
                </div>

                {adm.status === 'pending' && user.role === 'teacher' && (
                  <button
                    onClick={() => handleApprove(adm.id)}
                    disabled={approvingId === adm.id}
                    className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition shrink-0 shadow-xs"
                  >
                    {approvingId === adm.id ? 'Approving...' : 'Approve Admission'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. ATTENDANCE MODULE */}
      {/* ------------------------------------------------------------- */}
      {activeModule === 'attendance' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Lab & Course Attendance Tracking</h3>
              <p className="text-xs text-slate-500">
                Participation telemetry across industry-aligned coursework (Overall: {moduleData?.attendance?.overallRate || 91.4}%)
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              API: /api/modules/attendance
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {moduleData?.attendance?.studentAttendance.map((att, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">{att.course}</h4>
                  <span className="text-xs font-extrabold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {att.rate}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-teal-600 h-full rounded-full"
                    style={{ width: `${att.rate}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Last present session logged on {att.lastPresentDate}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. EXAMINATION MODULE */}
      {/* ------------------------------------------------------------- */}
      {activeModule === 'examination' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Conduct Exams & Evaluations</h3>
              <p className="text-xs text-slate-500">
                Institutional semester exams and industry certification diagnostics (Avg: {moduleData?.examination?.averageScore || 84.6}%)
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              API: /api/modules/examination
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {moduleData?.examination?.recentAssessments.map((ex, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{ex.title}</h4>
                  <p className="text-xs text-slate-500">Date: {ex.date} • Total Attempted: {ex.totalAttempted} students</p>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Avg Score: {ex.averageMarks}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. LIBRARY & INVENTORY MODULE */}
      {/* ------------------------------------------------------------- */}
      {activeModule === 'library' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Digital Library & Lab Inventory</h3>
              <p className="text-xs text-slate-500">
                Industry whitepapers, PLC toolkits, and academic hardware assets ({moduleData?.library?.totalDigitalAssets || 2450} assets)
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              API: /api/modules/library
            </span>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {moduleData?.library?.topResources.map((item, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 space-y-2 bg-slate-50/40">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  {item.type}
                </span>
                <h4 className="text-xs font-bold text-slate-900 leading-snug">{item.title}</h4>
                <p className="text-xs text-slate-500">{item.downloads} downloads • By {item.author}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. REPORTS & EXPORTS MODULE */}
      {/* ------------------------------------------------------------- */}
      {activeModule === 'reports' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Generate & Export Placement Analytics</h3>
              <p className="text-xs text-slate-500">
                Export institutional accreditation and SIH evaluation dossiers
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              API: /api/modules/reports
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <h4 className="text-xs font-bold text-slate-900">
                Comprehensive SIH 2026 Skill Mapping Report
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Includes automated skill gap distributions, student readiness percentiles, company hiring alignments, and API Gateway telemetries.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExport('pdf')}
                  className="px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Dossier</span>
                </button>
                <button
                  onClick={() => handleExport('csv')}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV Raw Data</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <h4 className="text-xs font-bold text-slate-900">
                NAAC & NBA Accreditation Telemetry Export
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Aggregates teacher-verified student competencies, industry internship conversion ratios, and curriculum mapping benchmarks.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExport('xlsx')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Excel (XLSX)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
