import React, { useState } from 'react';
import {
  ShieldCheck,
  Cpu,
  Bell,
  Layers,
  LogOut,
  User,
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  Activity,
  KeyRound
} from 'lucide-react';
import { UserProfile, UserRole, AppNotification } from '../types';

interface NavbarProps {
  user: UserProfile | null;
  activeTab: string;
  setActiveTab?: (tab: string) => void;
  onTabChange?: (tab: string) => void;
  onOpenLogin?: (role?: UserRole) => void;
  onOpenLoginModal?: (role?: UserRole) => void;
  onLogout?: () => void;
  onSwitchRole?: (role: UserRole) => void;
  onRoleSwitch?: (role: UserRole) => void;
  onOpenArchitecture?: () => void;
  onOpenArchitectureModal?: () => void;
  onOpenJwtInspector: () => void;
  notifications?: AppNotification[];
  notificationsCount?: number;
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  onTabChange,
  onOpenLogin,
  onOpenLoginModal,
  onLogout,
  onSwitchRole,
  onRoleSwitch,
  onOpenArchitecture,
  onOpenArchitectureModal,
  onOpenJwtInspector,
  notifications = [],
  notificationsCount,
  onOpenNotifications
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const handleTabSelect = (tab: string) => {
    if (onTabChange) onTabChange(tab);
    else if (setActiveTab) setActiveTab(tab);
  };
  const handleRoleChange = (role: UserRole) => {
    if (onRoleSwitch) onRoleSwitch(role);
    else if (onSwitchRole) onSwitchRole(role);
  };
  const handleLoginOpen = (role?: UserRole) => {
    if (onOpenLoginModal) onOpenLoginModal(role);
    else if (onOpenLogin) onOpenLogin(role);
  };
  const handleArchOpen = () => {
    if (onOpenArchitectureModal) onOpenArchitectureModal();
    else if (onOpenArchitecture) onOpenArchitecture();
  };

  const unreadCount = notificationsCount !== undefined 
    ? notificationsCount 
    : notifications.filter(n => !n.read).length;

  const rolePillColors: Record<UserRole, { active: string; border: string; text: string }> = {
    student: { active: 'bg-blue-600 text-white', border: 'border-blue-500/40', text: 'text-blue-400' },
    teacher: { active: 'bg-emerald-600 text-white', border: 'border-emerald-500/40', text: 'text-emerald-400' },
    company: { active: 'bg-indigo-600 text-white', border: 'border-indigo-500/40', text: 'text-indigo-400' },
    admin: { active: 'bg-purple-600 text-white', border: 'border-purple-500/40', text: 'text-purple-400' }
  };

  const navTabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'login-window', label: 'Login Window' },
    { id: 'courses-skills', label: 'Courses & Skills' },
    { id: 'opportunities', label: 'Opportunities' },
    { id: 'network', label: 'Network & Community' },
    { id: 'platform-modules', label: 'Platform Modules' },
    { id: 'profile-settings', label: 'Profile & Settings' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0D0D0D] border-b border-slate-800 shadow-md">
      {/* Top SIH Hackathon & Architecture Banner */}
      <div className="bg-[#0A0A0A] text-slate-300 text-xs px-4 sm:px-8 py-2 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <span className="font-mono font-bold tracking-wider text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/50 text-[10px]">
            SIH 2026
          </span>
          <span className="font-semibold text-slate-200 text-xs">Smart India Hackathon</span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-slate-400 hidden sm:inline text-xs">Theme: Smart Automation</span>
          <span className="text-slate-600 hidden md:inline">•</span>
          <span className="text-[10px] font-mono text-blue-400 bg-blue-950/40 border border-blue-800/40 px-2 py-0.5 rounded hidden md:inline">
            GATEWAY_ACTIVE : 24ms
          </span>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => handleLoginOpen(user?.role || 'student')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/70 hover:bg-blue-900/90 text-blue-300 hover:text-white transition text-[11px] font-mono font-bold border border-blue-500/50 shadow-xs"
            title="Open Login Window for Student, Teacher, and Company portals"
          >
            <KeyRound className="w-3 h-3 text-blue-400" />
            <span>Login Window (3 Users)</span>
          </button>

          <button
            onClick={onOpenJwtInspector}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 transition text-[11px] font-mono border border-slate-700"
            title="Inspect active signed JWT token and claims"
          >
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>JWT: HS256</span>
          </button>

          <button
            onClick={handleArchOpen}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold transition text-[11px] shadow-sm shadow-blue-900/30"
          >
            <Layers className="w-3 h-3" />
            <span>Architecture Blueprint</span>
            <Activity className="w-3 h-3 text-emerald-300 animate-pulse ml-0.5" />
          </button>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-600/25">
              N
            </div>
            <div>
              <div className="flex items-center">
                <h1 className="text-xl sm:text-2xl font-black tracking-tighter text-white">
                  SKILLSYNC
                  <span className="text-blue-500 font-light text-xs tracking-widest uppercase ml-2">
                    Industry Sync
                  </span>
                </h1>
              </div>
              <p className="text-[10px] text-slate-500 font-mono tracking-wide hidden sm:block">
                JWT API GATEWAY • AUTOMATED SKILL MAPPING
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navTabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabSelect(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* User Controls & Role Portal Switcher */}
          <div className="flex items-center gap-3">
            {/* Notifications Button */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition focus:outline-none"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-[9px] font-mono font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Role Switcher Pill Container */}
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLoginOpen(user.role)}
                  className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#141414] hover:bg-[#1c1c1c] text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition"
                  title="Open Login Window to switch between Student, Teacher, and Company"
                >
                  <KeyRound className="w-3.5 h-3.5 text-blue-400" />
                  <span>Login Window</span>
                </button>

                <div className="relative">
                  <div className="hidden sm:flex bg-slate-900 p-1 rounded-full border border-slate-800 items-center">
                    {(['student', 'teacher', 'company'] as UserRole[]).map((r) => {
                      const isCurrent = user.role === r;
                      return (
                        <button
                          key={r}
                          onClick={() => handleRoleChange(r)}
                          className={`px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition ${
                            isCurrent
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          {r === 'teacher' ? 'FACULTY' : r}
                        </button>
                      );
                    })}
                  </div>

                  {/* Mobile Role Switch Button */}
                  <div className="sm:hidden">
                    <button
                      onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold text-white"
                    >
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                      <span className="uppercase text-[11px]">{user.role}</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>

                    {roleDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-[#111111] rounded-2xl shadow-2xl border border-slate-800 p-2 z-50">
                        <div className="px-3 py-1.5 text-[10px] font-mono text-slate-500 uppercase">
                          Select Portal:
                        </div>
                        {(['student', 'teacher', 'company'] as UserRole[]).map((r) => (
                          <button
                            key={r}
                            onClick={() => {
                              handleRoleChange(r);
                              setRoleDropdownOpen(false);
                            }}
                            className={`w-full px-3 py-2 text-left text-xs font-bold rounded-xl uppercase tracking-wider transition ${
                              user.role === r ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            {r} Portal
                          </button>
                        ))}
                        <div className="border-t border-slate-800 my-1 pt-1">
                          <button
                            onClick={() => {
                              handleLoginOpen(user.role);
                              setRoleDropdownOpen(false);
                            }}
                            className="w-full px-3 py-2 text-left text-xs font-bold text-blue-400 hover:bg-slate-800 rounded-xl flex items-center gap-2"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                            <span>Open Login Window</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleLoginOpen('student')}
                className="px-4 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition shadow-sm shadow-blue-600/30"
              >
                Sign In
              </button>
            )}

            {/* Profile Avatar with Editorial ring */}
            {user && (
              <button
                onClick={() => handleTabSelect('profile-settings')}
                className="w-10 h-10 rounded-full border-2 border-blue-500/70 p-0.5 hover:border-blue-400 transition"
                title="Account Settings & Profile"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover bg-slate-800"
                />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex lg:hidden overflow-x-auto py-2.5 border-t border-slate-800/80 gap-1.5 no-scrollbar">
          {navTabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabSelect(tab.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold tracking-wide whitespace-nowrap transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

