import React, { useState } from 'react';
import {
  Share2,
  Users,
  MessageSquare,
  Sparkles,
  Search,
  UserCheck,
  UserPlus,
  ThumbsUp,
  MessageCircle,
  Calendar,
  Clock,
  Plus,
  Building2,
  GraduationCap,
  Send,
  ExternalLink,
  Award
} from 'lucide-react';
import {
  UserProfile,
  DiscussionThread,
  MentorshipSession
} from '../types';

interface NetworkAndCommunityViewProps {
  user: UserProfile;
  connections: UserProfile[];
  discussions: DiscussionThread[];
  mentorships: MentorshipSession[];
  onConnect: (targetUserId: string) => Promise<void>;
  onPostDiscussion: (title: string, content: string, tags: string[]) => Promise<void>;
  onLikeDiscussion: (threadId: string) => Promise<void>;
  onBookMentorship: (mentorName: string, mentorRole: string, mentorOrg: string, topic: string, date: string, time: string) => Promise<void>;
}

export const NetworkAndCommunityView: React.FC<NetworkAndCommunityViewProps> = ({
  user,
  connections,
  discussions,
  mentorships,
  onConnect,
  onPostDiscussion,
  onLikeDiscussion,
  onBookMentorship
}) => {
  const [subTab, setSubTab] = useState<'network' | 'discussions' | 'mentorship'>('network');
  const [searchQuery, setSearchQuery] = useState('');
  const [connectingId, setConnectingId] = useState<string | null>(null);

  // New Discussion Modal State
  const [isNewDiscussionOpen, setIsNewDiscussionOpen] = useState(false);
  const [threadTitle, setThreadTitle] = useState('');
  const [threadContent, setThreadContent] = useState('');
  const [threadTags, setThreadTags] = useState('Smart Automation, Industry 4.0');

  // Book Mentorship Modal State
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<{ name: string; role: string; org: string } | null>(null);
  const [mentorTopic, setMentorTopic] = useState('Skill Gap Analysis & Interview Prep');
  const [mentorDate, setMentorDate] = useState('2026-09-22');
  const [mentorTime, setMentorTime] = useState('11:00 AM IST');

  const handleConnectClick = async (targetId: string) => {
    setConnectingId(targetId);
    await onConnect(targetId);
    setConnectingId(null);
  };

  const handleCreateDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    await onPostDiscussion(
      threadTitle,
      threadContent,
      threadTags.split(',').map(t => t.trim())
    );
    setIsNewDiscussionOpen(false);
    setThreadTitle('');
    setThreadContent('');
  };

  const handleConfirmBookMentorship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentor) return;
    await onBookMentorship(
      selectedMentor.name,
      selectedMentor.role,
      selectedMentor.org,
      mentorTopic,
      mentorDate,
      mentorTime
    );
    setIsBookModalOpen(false);
    setSelectedMentor(null);
  };

  const sampleMentors = [
    {
      name: 'Dr. Meenakshi Sundaram',
      role: 'Head of Automation Labs',
      org: 'IIT Madras & Siemens Research',
      expertise: ['Smart Automation', 'PLC Programming', 'Industry Skill Alignment'],
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    },
    {
      name: 'Vikramaditya Roy',
      role: 'Principal Architect & Hiring Lead',
      org: 'TCS Digital Innovation Lab',
      expertise: ['API Gateway', 'Microservices', 'Distributed Systems'],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    {
      name: 'Rohit Kulkarni',
      role: 'VP of Engineering',
      org: 'RoboWorks India',
      expertise: ['Industrial IoT', 'Edge Computing', 'Automated Assembly'],
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    }
  ];

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200">
              Module: Network & Community
            </span>
            <span className="text-xs text-slate-400">• Tripartite Collaboration Hub</span>
          </div>
          <h2 className="text-xl font-black text-slate-900">
            Student • Faculty • Corporate Network
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Connect directly with mentors, collaborate on industrial problem statements, and discuss skill benchmarks
          </p>
        </div>

        <div className="flex items-center gap-2">
          {subTab === 'discussions' && (
            <button
              onClick={() => setIsNewDiscussionOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-2 transition shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Start Discussion</span>
            </button>
          )}

          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setSubTab('network')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                subTab === 'network' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Follow & Connect
            </button>
            <button
              onClick={() => setSubTab('discussions')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                subTab === 'discussions' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Discussions ({discussions.length})
            </button>
            <button
              onClick={() => setSubTab('mentorship')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                subTab === 'mentorship' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mentorships
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. FOLLOW & CONNECT SUBTAB */}
      {/* ------------------------------------------------------------- */}
      {subTab === 'network' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search mentors, professors, or corporate recruiters..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connections
              .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.institutionOrCompany.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((contact) => (
                <div
                  key={contact.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-purple-300 transition flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs font-bold text-slate-900">{contact.name}</h4>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                            contact.role === 'company'
                              ? 'bg-amber-100 text-amber-800'
                              : contact.role === 'teacher'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}
                        >
                          {contact.role}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{contact.departmentOrIndustry}</p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {contact.institutionOrCompany}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {contact.skills.map((s, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      {contact.stats.connectionsCount} Connections
                    </span>
                    <button
                      onClick={() => handleConnectClick(contact.id)}
                      disabled={contact.isConnected || connectingId === contact.id}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                        contact.isConnected
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      {contact.isConnected ? (
                        <>
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Connected</span>
                        </>
                      ) : connectingId === contact.id ? (
                        <span>Routing...</span>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Connect</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. DISCUSSIONS FORUM SUBTAB */}
      {/* ------------------------------------------------------------- */}
      {subTab === 'discussions' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Collaborative Problem Solving & Industry Threads
                </h3>
                <p className="text-xs text-slate-500">
                  Participate in technical discourse with verified industry researchers
                </p>
              </div>
              <button
                onClick={() => setIsNewDiscussionOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition"
              >
                + New Thread
              </button>
            </div>

            <div className="space-y-4">
              {discussions.map((th) => (
                <div
                  key={th.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-purple-300 transition space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={th.authorAvatar}
                        alt={th.authorName}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">{th.title}</h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span className="font-semibold text-slate-700">{th.authorName}</span>
                          <span>•</span>
                          <span className="capitalize">{th.authorRole}</span>
                          <span>•</span>
                          <span>{th.createdAt}</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 shrink-0">
                      {th.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{th.content}</p>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {th.tags.map((t, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                    <button
                      onClick={() => onLikeDiscussion(th.id)}
                      className="flex items-center gap-1.5 text-slate-600 hover:text-purple-600 font-semibold transition"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{th.likesCount} Upvotes</span>
                    </button>

                    <div className="flex items-center gap-1 text-slate-500">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{th.repliesCount} Responses</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. MENTORSHIPS SUBTAB */}
      {/* ------------------------------------------------------------- */}
      {subTab === 'mentorship' && (
        <div className="space-y-6">
          {/* Active Booked Sessions */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Your Scheduled Mentorship Sessions</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {mentorships.map((m) => (
                <div key={m.id} className="p-4 rounded-xl border border-slate-200 bg-purple-50/20 space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{m.topic}</h4>
                      <p className="text-xs text-slate-600">
                        Mentor: <strong className="text-slate-800">{m.mentorName}</strong> ({m.mentorOrg})
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-emerald-100 text-emerald-800">
                      {m.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-purple-600" />
                      {m.scheduledDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-purple-600" />
                      {m.scheduledTime}
                    </span>
                  </div>

                  {m.meetingLink && (
                    <div className="pt-2 border-t border-purple-100 flex items-center justify-between text-xs">
                      <span className="text-purple-700 font-semibold">Video Call Ready</span>
                      <a
                        href={m.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 bg-purple-600 text-white rounded-lg text-xs font-semibold hover:bg-purple-700 transition"
                      >
                        Join Room
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bookable Industry Fellows */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Book 1-on-1 Guidance with Industry Experts</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {sampleMentors.map((sm, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={sm.avatar}
                      alt={sm.name}
                      className="w-11 h-11 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{sm.name}</h4>
                      <p className="text-[11px] text-slate-600 leading-tight">{sm.role}</p>
                      <p className="text-[10px] text-slate-400">{sm.org}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-wrap">
                    {sm.expertise.map((ex, idx) => (
                      <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {ex}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedMentor({ name: sm.name, role: sm.role, org: sm.org });
                      setIsBookModalOpen(true);
                    }}
                    className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition"
                  >
                    Request Mentorship Slot
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* NEW DISCUSSION MODAL */}
      {/* ------------------------------------------------------------- */}
      {isNewDiscussionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Start Technical Discussion</h3>
              <button onClick={() => setIsNewDiscussionOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateDiscussion} className="p-6 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Thread Title</label>
                <input
                  type="text"
                  value={threadTitle}
                  onChange={(e) => setThreadTitle(e.target.value)}
                  placeholder="e.g. Best architecture for IoT sensor ingestion with Python"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Topic Tags (comma-separated)</label>
                <input
                  type="text"
                  value={threadTags}
                  onChange={(e) => setThreadTags(e.target.value)}
                  placeholder="Smart Automation, Python, Edge Computing"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Discussion Details & Questions</label>
                <textarea
                  value={threadContent}
                  onChange={(e) => setThreadContent(e.target.value)}
                  rows={4}
                  placeholder="Describe your technical inquiry or proposal..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition mt-2 shadow-sm"
              >
                Publish to Community via Gateway
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* BOOK MENTORSHIP MODAL */}
      {/* ------------------------------------------------------------- */}
      {isBookModalOpen && selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Book 1-on-1 Mentorship</h3>
              <button onClick={() => setIsBookModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleConfirmBookMentorship} className="p-6 space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xs font-bold text-slate-900">{selectedMentor.name}</p>
                <p className="text-[11px] text-slate-500">{selectedMentor.role} • {selectedMentor.org}</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Session Topic / Goal</label>
                <input
                  type="text"
                  value={mentorTopic}
                  onChange={(e) => setMentorTopic(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={mentorDate}
                    onChange={(e) => setMentorDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={mentorTime}
                    onChange={(e) => setMentorTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition mt-2 shadow-sm"
              >
                Confirm Session & Dispatch Calendar Invite
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
