// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 09: HUMAN RESOURCES (HR)
// 09.06: Performance & Career Development View
// (Performance Appraisals, 9-Box Talent Matrix, Training Programs, Succession)
// ==========================================

import React, { useState } from 'react';
import { useHrStore } from '../../services/hrStore';
import { PerformanceReview, TrainingProgram, CareerDevelopmentPlan, ReviewStatus } from '../../types';
import { ERPRouteState } from '../../../../types/erp';
import {
  TrendingUp,
  Award,
  GraduationCap,
  Compass,
  Star,
  Search,
  Plus,
  CheckCircle,
  Clock,
  Sparkles,
  User,
  Building,
  Target,
  BarChart2,
  BookOpen,
  ChevronRight,
  X
} from 'lucide-react';
import { notify } from '@/src/components/common/Feedback';

interface PerformanceDevViewProps {
  initialTab?: 'reviews' | 'ninebox' | 'training' | 'succession';
  onNavigate: (route: ERPRouteState) => void;
}

export const PerformanceDevView: React.FC<PerformanceDevViewProps> = ({
  initialTab = 'reviews',
  onNavigate
}) => {
  const {
    employees,
    performanceReviews,
    trainingPrograms,
    careerPlans,
    submitReviewScore,
    enrollInTraining,
    addTrainingProgram
  } = useHrStore();

  const [activeTab, setActiveTab] = useState<'reviews' | 'ninebox' | 'training' | 'succession'>(initialTab);
  const [selectedReview, setSelectedReview] = useState<PerformanceReview | null>(null);
  const [showNewCourseModal, setShowNewCourseModal] = useState(false);

  // New Training Course Form
  const [courseForm, setCourseForm] = useState({
    title: '',
    code: 'TRN-2026-',
    category: 'TECHNICAL' as const,
    instructorOrProvider: 'Artify Industrial Academy',
    durationHours: 24,
    costPerParticipant: 3500,
    currency: 'AED',
    startDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 18 * 86400000).toISOString().split('T')[0],
    maxParticipants: 15,
    location: 'Dubai Engineering Learning Hub',
    status: 'ENROLLING' as const
  });

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    addTrainingProgram({
      ...courseForm,
      enrolledEmployeeIds: []
    });
    setShowNewCourseModal(false);
  };

  // 9-Box Grid Setup: Potential (High, Medium, Low) vs Performance (High, Medium, Low)
  const nineBoxMatrix = [
    { pos: '1,3', label: 'High Potential / Low Perf', tag: 'Enigma / Rough Diamond', color: 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400' },
    { pos: '2,3', label: 'High Potential / Med Perf', tag: 'High Potential / Growth', color: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400' },
    { pos: '3,3', label: 'High Potential / High Perf', tag: 'Star Performer / Future Leader', color: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-600 dark:text-emerald-400' },
    { pos: '1,2', label: 'Med Potential / Low Perf', tag: 'Dilemma / Inconsistent', color: 'bg-slate-100/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400' },
    { pos: '2,2', label: 'Med Potential / Med Perf', tag: 'Core Contributor / Key Player', color: 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400' },
    { pos: '3,2', label: 'Med Potential / High Perf', tag: 'High Professional / Subject Expert', color: 'bg-teal-500/10 border-teal-500/30 text-teal-600 dark:text-teal-400' },
    { pos: '1,1', label: 'Low Potential / Low Perf', tag: 'Underperformer / Risk', color: 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400' },
    { pos: '2,1', label: 'Low Potential / Med Perf', tag: 'Solid Performer / Effective Specialist', color: 'bg-slate-100/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300' },
    { pos: '3,1', label: 'Low Potential / High Perf', tag: 'Trusted Professional / Workhorse', color: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400' }
  ];

  return (
    <div className="space-y-6">
      {/* Sub-Navigation Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'reviews'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Appraisals & Scorecards ({performanceReviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ninebox')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'ninebox'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>9-Box Talent Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('training')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'training'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Training & Certifications ({trainingPrograms.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('succession')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'succession'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Succession & IDP Plans ({careerPlans.length})</span>
          </button>
        </div>

        {activeTab === 'training' && (
          <button
            onClick={() => setShowNewCourseModal(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Course</span>
          </button>
        )}
      </div>

      {/* TAB 1: PERFORMANCE REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {performanceReviews.map(rev => (
              <div key={rev.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                        {rev.cycleName}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1.5">{rev.employeeName}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{rev.designation} • {rev.department}</p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                      rev.status === 'CALIBRATED_FINAL'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
                    }`}>
                      {rev.status}
                    </span>
                  </div>

                  {/* Rating Summary */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-100/60 dark:bg-slate-800/60 border border-slate-300/60 dark:border-slate-700/60 text-xs mt-3">
                    <div>
                      <span className="text-slate-600 dark:text-slate-400 block text-[11px]">Self:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{rev.selfRating || '-'} / 5.0</span>
                    </div>
                    <div>
                      <span className="text-slate-600 dark:text-slate-400 block text-[11px]">Manager:</span>
                      <span className="font-bold text-cyan-600 dark:text-cyan-400">{rev.managerRating || '-'} / 5.0</span>
                    </div>
                    <div>
                      <span className="text-slate-600 dark:text-slate-400 block text-[11px]">Final Grade:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{rev.finalRating ? `${rev.finalRating} (${rev.calibratedGrade})` : 'In Review'}</span>
                    </div>
                  </div>

                  {/* Goals progress */}
                  <div className="mt-3 space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Strategic OKR Goals:</div>
                    {rev.goals.map(g => (
                      <div key={g.id} className="p-2 rounded-lg bg-slate-100/70 dark:bg-slate-800/40 text-xs">
                        <div className="flex items-center justify-between text-slate-800 dark:text-slate-200">
                          <span className="truncate pr-2 font-medium">{g.title}</span>
                          <span className="font-bold text-rose-600 dark:text-rose-400 shrink-0">{g.progressPercentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span>Reviewer: <strong className="text-slate-900 dark:text-white">{rev.reviewerName}</strong></span>
                  <button
                    onClick={() => setSelectedReview(rev)}
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-lg font-medium transition-all"
                  >
                    View Scorecard
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: 9-BOX TALENT MATRIX */}
      {activeTab === 'ninebox' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              Strategic 9-Box Grid Leadership & Talent Distribution
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Cross-evaluating sustained performance against long-term leadership potential across key managers and technical specialists.
            </p>
          </div>

          {/* 3x3 Grid Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {nineBoxMatrix.map(box => {
              // Filter employees classified into this quadrant
              const boxEmployees = employees.slice(0, 2); // Simulated mapping
              return (
                <div key={box.pos} className={`p-4 rounded-2xl border ${box.color} flex flex-col justify-between min-h-[160px]`}>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{box.tag}</span>
                    </div>
                    <p className="text-[11px] opacity-80 mt-1">{box.label}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-300/50 dark:border-slate-700/50 space-y-1">
                    {box.tag.includes('Star') && (
                      <div className="flex items-center gap-2 text-xs text-slate-900 dark:text-white font-medium bg-emerald-500/20 p-1.5 rounded-lg">
                        <Star className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 fill-amber-400" />
                        <span>Tariq Al-Hashimi, Eng. Mansoor</span>
                      </div>
                    )}
                    {box.tag.includes('Growth') && (
                      <div className="flex items-center gap-2 text-xs text-slate-900 dark:text-white font-medium bg-cyan-500/20 p-1.5 rounded-lg">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                        <span>Vikram Deshmukh, Elena V.</span>
                      </div>
                    )}
                    {!box.tag.includes('Star') && !box.tag.includes('Growth') && (
                      <span className="text-[11px] text-slate-600 dark:text-slate-400 italic">Identified in cohort review</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: TRAINING PROGRAMS */}
      {activeTab === 'training' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trainingPrograms.map(trn => (
              <div key={trn.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      {trn.code}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      trn.status === 'ENROLLING'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        : 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20'
                    }`}>
                      {trn.status}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-white mt-2">{trn.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{trn.instructorOrProvider} • {trn.category}</p>

                  <div className="mt-4 p-3 rounded-xl bg-slate-100/60 dark:bg-slate-800/60 border border-slate-300/60 dark:border-slate-700/60 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                      <span>Duration:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{trn.durationHours} Hours</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                      <span>Cost per Seat:</span>
                      <span className="font-bold text-rose-600 dark:text-rose-400">{trn.costPerParticipant.toLocaleString()} {trn.currency}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                      <span>Enrolled:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{trn.enrolledEmployeeIds.length} / {trn.maxParticipants} Seats</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span>Starts: <strong className="text-slate-900 dark:text-white">{trn.startDate}</strong></span>
                  <button
                    onClick={() => {
                      enrollInTraining(trn.id, employees[0]?.id || 'EMP-00101');
                      notify(`Successfully enrolled employee into ${trn.title}`);
                    }}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold"
                  >
                    Enroll Staff
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SUCCESSION & CAREER PLANS */}
      {activeTab === 'succession' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                Individual Development Plans (IDP) & Succession Readiness
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Identified next-in-line successors for critical corporate and manufacturing roles.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {careerPlans.map(plan => (
                <div key={plan.id} className="p-5 rounded-2xl bg-slate-100/60 dark:bg-slate-800/60 border border-slate-300/80 dark:border-slate-700/80 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">{plan.employeeName}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Current: <strong className="text-slate-800 dark:text-slate-200">{plan.currentRole}</strong></p>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                      {plan.readinessLevel.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 text-xs space-y-2">
                    <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                      <span>Target Next Role:</span>
                      <span className="font-bold text-rose-600 dark:text-rose-400">{plan.targetRole}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400">
                      Development Goals:
                      <ul className="list-disc pl-4 space-y-0.5 text-slate-700 dark:text-slate-300 mt-1">
                        {plan.developmentGoals.map((g, i) => (
                          <li key={i}>{g}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* NEW COURSE MODAL */}
      {showNewCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                Create Training Course
              </h3>
              <button onClick={() => setShowNewCourseModal(false)} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Lean Six Sigma Black Belt"
                  value={courseForm.title}
                  onChange={e => setCourseForm({ ...courseForm, title: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Category</label>
                  <select
                    value={courseForm.category}
                    onChange={e => setCourseForm({ ...courseForm, category: e.target.value as any })}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  >
                    <option value="TECHNICAL">Technical & Engineering</option>
                    <option value="MANAGEMENT">Leadership & Management</option>
                    <option value="SAFETY">EHS & Industrial Safety</option>
                    <option value="COMPLIANCE">Statutory Compliance</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Duration (Hours)</label>
                  <input
                    type="number"
                    value={courseForm.durationHours}
                    onChange={e => setCourseForm({ ...courseForm, durationHours: Number(e.target.value) })}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewCourseModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-rose-600 text-white font-bold"
                >
                  Publish Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
