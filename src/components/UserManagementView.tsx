import React, { useState } from 'react';
import {
  User,
  Shield,
  Settings,
  Key,
  Bell,
  Save,
  CheckCircle2,
  Lock,
  Building2,
  GraduationCap,
  Briefcase,
  Plus,
  X,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface UserManagementViewProps {
  user: UserProfile;
  token: string | null;
  onUpdateProfile: (updated: Partial<UserProfile>) => Promise<void>;
  onSwitchRole: (newRole: UserRole) => Promise<void>;
  onOpenJwtInspector: () => void;
  onOpenLoginWindow?: () => void;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  user,
  token,
  onUpdateProfile,
  onSwitchRole,
  onOpenJwtInspector,
  onOpenLoginWindow
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'roles' | 'settings'>('profile');
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [institution, setInstitution] = useState(user.institutionOrCompany);
  const [department, setDepartment] = useState(user.departmentOrIndustry);
  const [bio, setBio] = useState(user.bio);
  const [skills, setSkills] = useState<string[]>(user.skills);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Settings State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [recruiterVisibility, setRecruiterVisibility] = useState(true);
  const [apiGatewayTelemetry, setApiGatewayTelemetry] = useState(true);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
      setSkills([...skills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onUpdateProfile({
      name,
      email,
      institutionOrCompany: institution,
      departmentOrIndustry: department,
      bio,
      skills
    });
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              Module: User Management
            </span>
            <span className="text-xs text-slate-400">• Profile, Roles & Settings</span>
          </div>
          <h2 className="text-xl font-black text-slate-900">
            Account Governance & Role Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your personal profile, role permissions, and API Gateway security credentials
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenJwtInspector}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>Inspect JWT Token Claims</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile updated and synchronized across all microservices!</span>
        </div>
      )}

      {/* Tabs for Profile, Role, Settings */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeSubTab === 'profile'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Management</span>
        </button>

        <button
          onClick={() => setActiveSubTab('roles')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeSubTab === 'roles'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Role Management & Access Matrix</span>
        </button>

        <button
          onClick={() => setActiveSubTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeSubTab === 'settings'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Account Settings</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. PROFILE MANAGEMENT */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-200 shadow-xs"
            />
            <div>
              <h3 className="text-base font-bold text-slate-900">{user.name}</h3>
              <p className="text-xs text-slate-500 capitalize">{user.role} Portal Account • {user.email}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {user.role === 'company' ? 'Company / Organization' : 'Institution / University'}
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {user.role === 'company' ? 'Industry Sector' : 'Academic Department'}
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Professional Bio / Profile Summary</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Skill Tag Management */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Verified & Claimed Skills Matrix
            </label>
            <div className="flex items-center gap-1.5 flex-wrap mb-2">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200 font-medium"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-indigo-400 hover:text-indigo-700 p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2 max-w-sm">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                placeholder="Add a new skill (e.g. Docker, PLC)..."
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Add
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono">
              PUT /api/users/profile
            </span>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-2 transition shadow-sm disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Synchronizing...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. ROLE MANAGEMENT */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'roles' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Role-Based Access Control (RBAC)</h3>
              <p className="text-xs text-slate-500">
                The API Gateway dynamically enforces RBAC policies based on the JWT claims payload.
              </p>
            </div>
            {onOpenLoginWindow && (
              <button
                onClick={onOpenLoginWindow}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm w-fit"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Launch 3-User Login Window</span>
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {(['student', 'teacher', 'company'] as UserRole[]).map((r) => {
              const isActive = user.role === r;
              return (
                <div
                  key={r}
                  className={`p-4 rounded-xl border transition flex flex-col justify-between space-y-3 ${
                    isActive
                      ? 'border-indigo-500 bg-indigo-50/40 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold capitalize text-slate-900">{r} Portal</span>
                      {isActive && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-600 text-white">
                          Current Active Role
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {r === 'student' && 'Access courses, take skill assessments, apply for internships, book mentors.'}
                      {r === 'teacher' && 'Validate student skill badges, design industry curricula, monitor placement stats.'}
                      {r === 'company' && 'Post internships/jobs, review automated candidate match scores, schedule technical interviews.'}
                    </p>
                  </div>

                  {!isActive && (
                    <button
                      onClick={() => onSwitchRole(r)}
                      className="w-full py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition"
                    >
                      Switch to {r.toUpperCase()}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Access Permissions Matrix Table */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Gateway Endpoint Access Rules
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 text-[11px] font-bold uppercase">
                  <tr>
                    <th className="p-3">Microservice Action</th>
                    <th className="p-3">Student</th>
                    <th className="p-3">Teacher</th>
                    <th className="p-3">Company</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-mono text-[11px]">
                  <tr>
                    <td className="p-3 font-sans font-semibold text-slate-900">Take Skill Diagnostics</td>
                    <td className="p-3 text-emerald-600 font-bold">✓ Granted</td>
                    <td className="p-3 text-slate-400">—</td>
                    <td className="p-3 text-slate-400">—</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-sans font-semibold text-slate-900">Approve & Verify Badges</td>
                    <td className="p-3 text-slate-400">—</td>
                    <td className="p-3 text-emerald-600 font-bold">✓ Granted</td>
                    <td className="p-3 text-slate-400">—</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-sans font-semibold text-slate-900">Post Jobs & Internships</td>
                    <td className="p-3 text-slate-400">—</td>
                    <td className="p-3 text-slate-400">—</td>
                    <td className="p-3 text-emerald-600 font-bold">✓ Granted</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-sans font-semibold text-slate-900">1-Click Apply via Gateway</td>
                    <td className="p-3 text-emerald-600 font-bold">✓ Granted</td>
                    <td className="p-3 text-slate-400">—</td>
                    <td className="p-3 text-slate-400">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. ACCOUNT SETTINGS */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'settings' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-sm font-bold text-slate-900">Preferences & API Gateway Security</h3>
            <p className="text-xs text-slate-500">
              Configure communication alerts and gateway telemetry preferences
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Email & In-App Notification Dispatch</h4>
                <p className="text-[11px] text-slate-500">
                  Receive alerts when internships match &gt;85% or an interview is scheduled
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Recruiter Profile Discovery</h4>
                <p className="text-[11px] text-slate-500">
                  Allow partner companies to auto-discover your verified skill profile
                </p>
              </div>
              <input
                type="checkbox"
                checked={recruiterVisibility}
                onChange={(e) => setRecruiterVisibility(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div>
                <h4 className="text-xs font-bold text-slate-900">API Gateway Telemetry Logging</h4>
                <p className="text-[11px] text-slate-500">
                  Include request headers in the live architecture inspector for hackathon auditing
                </p>
              </div>
              <input
                type="checkbox"
                checked={apiGatewayTelemetry}
                onChange={(e) => setApiGatewayTelemetry(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
