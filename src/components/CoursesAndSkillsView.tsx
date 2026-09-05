import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Award,
  Sparkles,
  Search,
  Filter,
  Star,
  Clock,
  Users,
  ShieldCheck,
  Plus,
  Play,
  ArrowRight,
  ExternalLink,
  Cpu,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Course, SkillAssessment, UserProfile, SmartSkillGapAnalysis } from '../types';

interface CoursesAndSkillsViewProps {
  user: UserProfile;
  courses: Course[];
  assessments: SkillAssessment[];
  smartAnalysis: SmartSkillGapAnalysis | null;
  onEnrollCourse: (courseId: string) => Promise<void>;
  onSubmitAssessment: (assessment: { skillName: string; category: string; level: string; score: number }) => Promise<void>;
  onVerifySkill?: (id: string) => Promise<void>;
  onCreateCourse?: (newCourse: any) => Promise<void>;
}

export const CoursesAndSkillsView: React.FC<CoursesAndSkillsViewProps> = ({
  user,
  courses,
  assessments,
  smartAnalysis,
  onEnrollCourse,
  onSubmitAssessment,
  onVerifySkill,
  onCreateCourse
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'courses' | 'assessments' | 'recommendations'>('courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  // Skill Quiz Modal State
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [quizSkill, setQuizSkill] = useState('Industrial IoT & Automation Protocols');
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Teacher Course Creation Modal
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPartner, setNewPartner] = useState('Siemens Automation');
  const [newCategory, setNewCategory] = useState('Smart Automation');
  const [newDuration, setNewDuration] = useState('6 Weeks');
  const [newDesc, setNewDesc] = useState('');
  const [newSkills, setNewSkills] = useState('PLC, MQTT, Microservices');

  const categories = ['All', 'Smart Automation', 'Web & Cloud', 'Artificial Intelligence', 'Cloud & Infrastructure'];

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skillsTaught.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEnroll = async (courseId: string) => {
    setEnrollingId(courseId);
    await onEnrollCourse(courseId);
    setEnrollingId(null);
  };

  const sampleQuestions = [
    {
      q: 'In Smart Automation, what protocol is primarily used for lightweight machine-to-machine telemetry?',
      options: ['HTTP/1.1 REST', 'MQTT over WebSockets', 'FTP Plaintext', 'Telnet'],
      correct: 1
    },
    {
      q: 'When passing authentication context through an API Gateway to microservices, where should claims reside?',
      options: ['URL Query parameters', 'Cryptographic Signed JWT Claims in Authorization Header', 'Session Cookie on Root Domain', 'Plain Base64 in Request Body'],
      correct: 1
    },
    {
      q: 'What is the primary role of a PLC in Industry 4.0 automated workflows?',
      options: ['Store multi-gigabyte media files', 'Deterministic real-time control of actuators and sensor acquisition', 'Train deep transformer models on GPU', 'Render frontend React state'],
      correct: 1
    }
  ];

  const handleSelectQuizAnswer = (qIdx: number, oIdx: number) => {
    setQuizAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
  };

  const handleSubmitQuiz = async () => {
    let correctCount = 0;
    sampleQuestions.forEach((q, i) => {
      if (quizAnswers[i] === q.correct) correctCount += 1;
    });
    const calculatedScore = Math.round((correctCount / sampleQuestions.length) * 100);
    setQuizScore(calculatedScore);
    setQuizSubmitted(true);

    await onSubmitAssessment({
      skillName: quizSkill,
      category: 'Technical',
      level: 'Intermediate',
      score: calculatedScore
    });
  };

  const handleCreateCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onCreateCourse) return;
    await onCreateCourse({
      title: newTitle,
      industryPartner: newPartner,
      category: newCategory,
      duration: newDuration,
      description: newDesc,
      skillsTaught: newSkills.split(',').map(s => s.trim())
    });
    setIsCreateCourseOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              Module: Courses & Skills
            </span>
            <span className="text-xs text-slate-400">• Smart Automation Curricula</span>
          </div>
          <h2 className="text-xl font-black text-slate-900">
            Industry Skill Mapping & Course Catalog
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Bridging academic labs to corporate hiring benchmarks through automated gap diagnostics
          </p>
        </div>

        <div className="flex items-center gap-2">
          {user.role === 'student' && (
            <button
              onClick={() => {
                setQuizAnswers({});
                setQuizSubmitted(false);
                setIsQuizModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-2 transition shadow-xs"
            >
              <Award className="w-4 h-4" />
              <span>Take Skill Assessment</span>
            </button>
          )}

          {user.role === 'teacher' && (
            <button
              onClick={() => setIsCreateCourseOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-2 transition shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create Industry Course</span>
            </button>
          )}
        </div>
      </div>

      {/* Subtabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('courses')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeSubTab === 'courses'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Course Listings ({courses.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('assessments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeSubTab === 'assessments'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Skill Assessments ({assessments.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('recommendations')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeSubTab === 'recommendations'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Automated Recommendations</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. COURSES LISTING SUBTAB */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'courses' && (
        <div className="space-y-6">
          {/* Filters and Search Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses or skills (e.g. IoT, Docker)..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid md:grid-cols-2 gap-5">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {course.category}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-1 leading-snug">
                        {course.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold shrink-0">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{course.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {course.enrolledStudentsCount} Learners
                    </span>
                    <span className="text-emerald-700 font-medium">
                      Co-Partner: {course.industryPartner}
                    </span>
                  </div>

                  {/* Skills Taught Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {course.skillsTaught.map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Footer with Progress or Enroll Button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={course.instructorAvatar}
                      alt={course.instructor}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    />
                    <div className="text-left">
                      <p className="text-[11px] font-bold text-slate-800">{course.instructor}</p>
                      <p className="text-[10px] text-slate-400">{course.instructorRole}</p>
                    </div>
                  </div>

                  {course.isEnrolled ? (
                    <div className="text-right">
                      <span className="text-[10px] text-indigo-600 font-bold">
                        Enrolled • {course.progressPercent}%
                      </span>
                      <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden mt-1">
                        <div
                          className="bg-indigo-600 h-full rounded-full"
                          style={{ width: `${course.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEnroll(course.id)}
                      disabled={enrollingId === course.id}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{enrollingId === course.id ? 'Routing...' : 'Enroll Free'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. SKILL ASSESSMENTS SUBTAB */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'assessments' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Skill Assessment Matrix & Digital Verification
                </h3>
                <p className="text-xs text-slate-500">
                  Assessments are graded objectively and require faculty sign-off to produce verifiable tokens
                </p>
              </div>

              {user.role === 'student' && (
                <button
                  onClick={() => {
                    setQuizAnswers({});
                    setQuizSubmitted(false);
                    setIsQuizModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition"
                >
                  + New Skill Diagnostic
                </button>
              )}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {assessments.map((sa) => (
                <div
                  key={sa.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-300 transition space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">
                      {sa.skillName}
                    </h4>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold">
                      {sa.level}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-slate-500">Diagnostic Score</span>
                    <span className="text-lg font-black text-indigo-600">{sa.score}%</span>
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        sa.score >= 80 ? 'bg-emerald-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${sa.score}%` }}
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                    {sa.verifiedByTeacher ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Verified
                      </span>
                    ) : (
                      <span className="text-amber-700 font-medium">Pending Review</span>
                    )}

                    {user.role === 'teacher' && !sa.verifiedByTeacher && onVerifySkill && (
                      <button
                        onClick={() => onVerifySkill(sa.id)}
                        className="text-xs text-indigo-600 font-bold hover:underline"
                      >
                        Verify Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. AUTOMATED RECOMMENDATIONS SUBTAB */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'recommendations' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-6 rounded-2xl border border-indigo-800 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                AI & Smart Automation Engine
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-white">
              Personalized Skill Bridge Trajectory
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {smartAnalysis?.aiExecutiveSummary ||
                'Our smart matching engine continuously compares your assessment scores against hiring mandates from partner companies (TCS, Siemens, Cognizant) to generate bridge pathways.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {courses.slice(0, 2).map((course) => (
              <div
                key={course.id}
                className="p-5 rounded-2xl bg-white border border-amber-200 bg-amber-50/20 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                    High Priority Bridge Course
                  </span>
                  <span className="text-xs text-slate-400">Duration: {course.duration}</span>
                </div>

                <h4 className="text-sm font-bold text-slate-900">{course.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{course.description}</p>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-indigo-600 font-semibold">
                    Targeted Partner: {course.industryPartner}
                  </span>
                  <button
                    onClick={() => handleEnroll(course.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition"
                  >
                    {course.isEnrolled ? 'In Progress' : 'Start Bridging →'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SKILL ASSESSMENT QUIZ MODAL */}
      {/* ------------------------------------------------------------- */}
      {isQuizModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Award className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Interactive Skill Diagnostic</h3>
                  <p className="text-xs text-slate-400">{quizSkill}</p>
                </div>
              </div>
              <button
                onClick={() => setIsQuizModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
              {!quizSubmitted ? (
                <div className="space-y-4">
                  <p className="text-xs text-slate-600">
                    Answer these sample questions to test your proficiency. Scores will be routed through the API Gateway for faculty review.
                  </p>

                  {sampleQuestions.map((item, qIdx) => (
                    <div key={qIdx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5">
                      <p className="text-xs font-bold text-slate-900">
                        Q{qIdx + 1}: {item.q}
                      </p>
                      <div className="space-y-1.5">
                        {item.options.map((opt, oIdx) => {
                          const isSelected = quizAnswers[qIdx] === oIdx;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              onClick={() => handleSelectQuizAnswer(qIdx, oIdx)}
                              className={`w-full text-left p-2 rounded-lg text-xs transition border flex items-center gap-2 ${
                                isSelected
                                  ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-semibold'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[9px] ${
                                isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                              }`}>
                                {isSelected && '✓'}
                              </span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(quizAnswers).length < sampleQuestions.length}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition disabled:opacity-50 shadow-sm"
                  >
                    Submit Assessment to API Gateway
                  </button>
                </div>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">Assessment Submitted!</h4>
                  <p className="text-xs text-slate-600">
                    Your diagnostic score is <strong className="text-indigo-600 text-sm">{quizScore}%</strong>.
                  </p>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                    Submitted to Dr. Meenakshi Sundaram for faculty verification. A notification has been logged to your account.
                  </p>
                  <button
                    onClick={() => setIsQuizModalOpen(false)}
                    className="mt-3 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition"
                  >
                    Return to Dashboard
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TEACHER COURSE CREATION MODAL */}
      {/* ------------------------------------------------------------- */}
      {isCreateCourseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Create Industry-Aligned Course</h3>
              <button onClick={() => setIsCreateCourseOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateCourseSubmit} className="p-6 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Course Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Autonomous Factory Telemetry with Python"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Corporate Partner</label>
                  <input
                    type="text"
                    value={newPartner}
                    onChange={(e) => setNewPartner(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Skills Taught (comma-separated)</label>
                <input
                  type="text"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  placeholder="Docker, PLC, MQTT, Python"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Course Description & Outcomes</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={3}
                  placeholder="Explain how this course bridges practical industry placement needs..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition mt-2 shadow-sm"
              >
                Publish Course to API Gateway
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
