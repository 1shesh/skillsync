import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  Calendar,
  Building2,
  DollarSign,
  Users,
  Send,
  ExternalLink,
  Plus,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { Opportunity, JobApplication, UserProfile } from '../types';

interface OpportunitiesViewProps {
  user: UserProfile;
  opportunities: Opportunity[];
  applications: JobApplication[];
  onApply: (opportunityId: string) => Promise<void>;
  onUpdateApplicationStatus?: (applicationId: string, status: string, notes?: string, interviewDate?: string) => Promise<void>;
  onPostOpportunity?: (opportunityData: any) => Promise<void>;
}

export const OpportunitiesView: React.FC<OpportunitiesViewProps> = ({
  user,
  opportunities,
  applications,
  onApply,
  onUpdateApplicationStatus,
  onPostOpportunity
}) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'applications'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'internship' | 'job' | 'research'>('all');
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  // Recruiter Status Update State
  const [selectedAppForReview, setSelectedAppForReview] = useState<JobApplication | null>(null);
  const [newStatus, setNewStatus] = useState<string>('shortlisted');
  const [recruiterNotes, setRecruiterNotes] = useState('');
  const [interviewSlot, setInterviewSlot] = useState('2026-09-18 10:00 AM IST');

  // Post Opportunity Modal State
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postType, setPostType] = useState<'internship' | 'job'>('internship');
  const [postLocation, setPostLocation] = useState('Bengaluru / Hybrid');
  const [postStipend, setPostStipend] = useState('₹45,000 / month');
  const [postSkills, setPostSkills] = useState('Python, Docker, Smart Automation');
  const [postDesc, setPostDesc] = useState('');

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.requiredSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = typeFilter === 'all' || opp.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleApplyClick = async (oppId: string) => {
    setApplyingId(oppId);
    await onApply(oppId);
    setApplyingId(null);
    setApplicationSuccess(true);
    setTimeout(() => setApplicationSuccess(false), 3000);
  };

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppForReview || !onUpdateApplicationStatus) return;
    await onUpdateApplicationStatus(selectedAppForReview.id, newStatus, recruiterNotes, interviewSlot);
    setSelectedAppForReview(null);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onPostOpportunity) return;
    await onPostOpportunity({
      title: postTitle,
      type: postType,
      location: postLocation,
      stipendOrSalary: postStipend,
      requiredSkills: postSkills.split(',').map(s => s.trim()),
      description: postDesc,
      openings: 5,
      deadline: '2026-11-30'
    });
    setIsPostModalOpen(false);
    setPostTitle('');
    setPostDesc('');
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
              Module: Opportunities & Placements
            </span>
            <span className="text-xs text-slate-400">• Automated Candidate Matching</span>
          </div>
          <h2 className="text-xl font-black text-slate-900">
            Industry Internships & Placement Gateway
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time job requisitions mapped against verified academic skill profiles
          </p>
        </div>

        <div className="flex items-center gap-2">
          {user.role === 'company' && (
            <button
              onClick={() => setIsPostModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-2 transition shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Opening</span>
            </button>
          )}

          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'browse' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Browse Openings
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'applications' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{user.role === 'company' ? 'ATS Candidate Review' : 'My Applications'}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                {applications.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. BROWSE OPPORTUNITIES TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs, skills, companies..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
              {(['all', 'internship', 'job', 'research'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition whitespace-nowrap ${
                    typeFilter === type
                      ? 'bg-amber-50 text-amber-800 font-bold border border-amber-200'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {type === 'all' ? 'All Roles' : `${type}s`}
                </button>
              ))}
            </div>
          </div>

          {/* Opportunities Grid */}
          <div className="grid md:grid-cols-2 gap-5">
            {filteredOpportunities.map((opp) => (
              <div
                key={opp.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={opp.companyLogo}
                        alt={opp.companyName}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-slate-900 leading-tight">
                            {opp.title}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-600 font-medium mt-0.5">
                          {opp.companyName}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-500" />
                        {opp.matchScore}% Match
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {opp.description}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {opp.location}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                      {opp.stipendOrSalary}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Due: {opp.deadline}
                    </span>
                  </div>

                  {/* Skills tags */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {opp.requiredSkills.map((sk, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedOpp(opp)}
                    className="text-xs font-semibold text-slate-700 hover:text-indigo-600 flex items-center gap-1"
                  >
                    <span>View Role Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  {user.role === 'student' && (
                    <button
                      onClick={() => handleApplyClick(opp.id)}
                      disabled={opp.hasApplied || applyingId === opp.id}
                      className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition shadow-xs flex items-center gap-1.5 ${
                        opp.hasApplied
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      <Send className="w-3 h-3" />
                      <span>
                        {opp.hasApplied
                          ? 'Applied ✓'
                          : applyingId === opp.id
                          ? 'Submitting via Gateway...'
                          : '1-Click Apply'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. APPLICATIONS MANAGEMENT / RECRUITER ATS TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'applications' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {user.role === 'company'
                  ? 'Recruiter ATS & Candidate Evaluation Board'
                  : 'Submitted Internship & Job Applications'}
              </h3>
              <p className="text-xs text-slate-500">
                {user.role === 'company'
                  ? 'Manage candidate progression and schedule technical interviews'
                  : 'Real-time updates delivered directly via Notification Microservice'}
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              Gateway Endpoint: /api/applications
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {applications.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-400">No applications on record yet.</p>
            ) : (
              applications.map((app) => (
                <div key={app.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-bold text-slate-900">
                        {user.role === 'company' ? app.studentName : app.opportunityTitle}
                      </h4>
                      <span className="text-[10px] text-slate-500">
                        {user.role === 'company' ? `for ${app.opportunityTitle}` : `at ${app.companyName}`}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                        {app.matchScore}% Match
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>Applied on: {app.appliedDate}</span>
                      <span>Department: {app.studentDepartment}</span>
                    </div>

                    {app.notes && (
                      <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                        Recruiter Note: "{app.notes}"
                      </p>
                    )}

                    {app.interviewDate && (
                      <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Interview Scheduled: {app.interviewDate}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                        app.status === 'interview_scheduled'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'shortlisted'
                          ? 'bg-blue-100 text-blue-800'
                          : app.status === 'selected'
                          ? 'bg-purple-100 text-purple-800'
                          : app.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {app.status.replace('_', ' ')}
                    </span>

                    {user.role === 'company' && (
                      <button
                        onClick={() => {
                          setSelectedAppForReview(app);
                          setNewStatus(app.status);
                          setRecruiterNotes(app.notes || '');
                        }}
                        className="px-3 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
                      >
                        Update Status
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* OPPORTUNITY DETAIL MODAL */}
      {/* ------------------------------------------------------------- */}
      {selectedOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedOpp.companyLogo}
                  alt={selectedOpp.companyName}
                  className="w-10 h-10 rounded-lg object-cover border border-slate-700"
                />
                <div>
                  <h3 className="text-sm font-bold text-white">{selectedOpp.title}</h3>
                  <p className="text-xs text-slate-300">{selectedOpp.companyName} • {selectedOpp.location}</p>
                </div>
              </div>
              <button onClick={() => setSelectedOpp(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-emerald-900">
                    Automated Candidate Skill Match Score:
                  </span>
                </div>
                <span className="text-base font-black text-emerald-700">
                  {selectedOpp.matchScore}% Match
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                  About the Role
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedOpp.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Key Responsibilities
                </h4>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  {selectedOpp.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Required & Verified Skills
                </h4>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {selectedOpp.requiredSkills.map((sk, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Perks & Compensation
                </h4>
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedOpp.perks.map((p, i) => (
                    <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      ✓ {p}
                    </span>
                  ))}
                </div>
              </div>

              {user.role === 'student' && (
                <div className="pt-3 border-t border-slate-200">
                  <button
                    onClick={() => {
                      handleApplyClick(selectedOpp.id);
                      setSelectedOpp(null);
                    }}
                    disabled={selectedOpp.hasApplied}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition disabled:opacity-50"
                  >
                    {selectedOpp.hasApplied ? 'Already Applied' : 'Submit Application via API Gateway'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* RECRUITER STATUS UPDATE MODAL */}
      {/* ------------------------------------------------------------- */}
      {selectedAppForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Review Candidate Application</h3>
              <button onClick={() => setSelectedAppForReview(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleStatusSubmit} className="p-6 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <p className="text-xs font-bold text-slate-900">{selectedAppForReview.studentName}</p>
                <p className="text-[11px] text-slate-500">
                  {selectedAppForReview.studentDepartment} • Score: {selectedAppForReview.matchScore}%
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Update Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="under_review">Under Review</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="interview_scheduled">Schedule Technical Interview</option>
                  <option value="selected">Select Candidate (Offer)</option>
                  <option value="rejected">Reject</option>
                </select>
              </div>

              {newStatus === 'interview_scheduled' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Interview Date & Time</label>
                  <input
                    type="text"
                    value={interviewSlot}
                    onChange={(e) => setInterviewSlot(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Feedback / Recruiter Notes</label>
                <textarea
                  value={recruiterNotes}
                  onChange={(e) => setRecruiterNotes(e.target.value)}
                  rows={3}
                  placeholder="Notes visible to candidate..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition"
              >
                Save Decision & Notify Candidate
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* POST OPPORTUNITY MODAL */}
      {/* ------------------------------------------------------------- */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Post Internship or Placement Opportunity</h3>
              <button onClick={() => setIsPostModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreatePost} className="p-6 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Role Title</label>
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="e.g. Smart Automation Engineer"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Type</label>
                  <select
                    value={postType}
                    onChange={(e) => setPostType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200"
                  >
                    <option value="internship">Internship</option>
                    <option value="job">Full-time Job</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Compensation</label>
                  <input
                    type="text"
                    value={postStipend}
                    onChange={(e) => setPostStipend(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Required Skills</label>
                <input
                  type="text"
                  value={postSkills}
                  onChange={(e) => setPostSkills(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Job Description</label>
                <textarea
                  value={postDesc}
                  onChange={(e) => setPostDesc(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition mt-2"
              >
                Publish Opportunity via Gateway
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
