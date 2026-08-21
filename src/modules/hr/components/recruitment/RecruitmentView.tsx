// ==========================================
// ARTIFY ERP — MODULE 09: HUMAN RESOURCES (HR)
// 09.02: Recruitment & ATS View
// (Job Requisitions, Applicant Tracking, Interviews, Offers)
// ==========================================

import React, { useState } from 'react';
import { useHrStore } from '../../services/hrStore';
import { JobRequisition, Candidate, Interview, JobOffer, CandidateStage } from '../../types';
import { ERPRouteState } from '../../../../types/erp';
import {
  UserPlus,
  Briefcase,
  Layers,
  Calendar,
  FileCheck,
  Search,
  Plus,
  Filter,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
  User,
  Star,
  Award,
  DollarSign,
  ChevronRight,
  X,
  Send,
  Video
} from 'lucide-react';

interface RecruitmentViewProps {
  initialTab?: 'reqs' | 'ats' | 'interviews' | 'offers';
  onNavigate: (route: ERPRouteState) => void;
}

export const RecruitmentView: React.FC<RecruitmentViewProps> = ({
  initialTab = 'reqs',
  onNavigate
}) => {
  const {
    jobRequisitions,
    candidates,
    interviews,
    jobOffers,
    addJobRequisition,
    updateCandidateStage,
    addCandidate,
    scheduleInterview,
    submitInterviewScorecard,
    createJobOffer,
    updateJobOfferStatus
  } = useHrStore();

  const [activeTab, setActiveTab] = useState<'reqs' | 'ats' | 'interviews' | 'offers'>(initialTab);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showNewReqModal, setShowNewReqModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);

  // New Requisition Form State
  const [newReq, setNewReq] = useState({
    jobTitle: '',
    department: 'Manufacturing & Engineering',
    headcount: 1,
    priority: 'HIGH' as const,
    employmentType: 'FULL_TIME' as const,
    experienceLevel: 'SENIOR' as const,
    minSalary: 24000,
    maxSalary: 32000,
    currency: 'AED',
    targetHireDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    hiringManager: 'Vikram Deshmukh',
    jobDescription: '',
    requiredSkills: ['Engineering', 'Project Management'],
    status: 'PUBLISHED' as const
  });

  // Schedule Interview Form
  const [schedForm, setSchedForm] = useState({
    candidateId: '',
    candidateName: '',
    jobTitle: '',
    interviewType: 'TECHNICAL' as const,
    scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    scheduledTime: '10:00 AM GST',
    durationMinutes: 60,
    interviewers: ['Vikram Deshmukh', 'Elena Vostrikova'],
    format: 'VIDEO_CALL' as const,
    locationOrLink: 'https://meet.artify.ae/interview-room-1',
    status: 'SCHEDULED' as const
  });

  // New Offer Form
  const [offerForm, setOfferForm] = useState({
    candidateId: '',
    candidateName: '',
    requisitionId: '',
    jobTitle: '',
    department: 'Manufacturing & Engineering',
    grade: 'G4',
    basicSalary: 25000,
    housingAllowance: 6500,
    transportAllowance: 2500,
    annualBonusTargetPercent: 15,
    currency: 'AED',
    offeredDate: new Date().toISOString().split('T')[0],
    joiningDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    status: 'SENT_TO_CANDIDATE' as const,
    approvedBy: 'Elena Vostrikova (HR Director)'
  });

  const stages: { key: CandidateStage; label: string; color: string }[] = [
    { key: 'APPLIED', label: 'Applied', color: 'bg-slate-700' },
    { key: 'SCREENING', label: 'Screening', color: 'bg-blue-700' },
    { key: 'SHORTLISTED', label: 'Shortlisted', color: 'bg-indigo-700' },
    { key: 'INTERVIEW_ROUND_1', label: '1st Round', color: 'bg-cyan-700' },
    { key: 'TECHNICAL_ASSESSMENT', label: 'Tech Exam', color: 'bg-teal-700' },
    { key: 'FINAL_PANEL', label: 'Final Panel', color: 'bg-amber-700' },
    { key: 'OFFER_EXTENDED', label: 'Offer Extended', color: 'bg-purple-700' },
    { key: 'HIRED', label: 'Hired', color: 'bg-emerald-700' }
  ];

  const handleCreateReq = (e: React.FormEvent) => {
    e.preventDefault();
    addJobRequisition(newReq);
    setShowNewReqModal(false);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    scheduleInterview(schedForm);
    setShowScheduleModal(false);
  };

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createJobOffer(offerForm);
    setShowOfferModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Sub-Navigation Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('reqs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'reqs'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Job Requisitions ({jobRequisitions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ats')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'ats'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>ATS Candidate Pipeline ({candidates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('interviews')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'interviews'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Interviews & Scorecards ({interviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('offers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'offers'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Job Offers ({jobOffers.length})</span>
          </button>
        </div>

        {activeTab === 'reqs' && (
          <button
            onClick={() => setShowNewReqModal(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-rose-600/20 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Post Requisition</span>
          </button>
        )}
      </div>

      {/* TAB 1: JOB REQUISITIONS */}
      {activeTab === 'reqs' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobRequisitions.map(req => (
              <div
                key={req.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      {req.reqNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      req.status === 'PUBLISHED'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {req.status}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white mt-2 tracking-tight">{req.jobTitle}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{req.department} • {req.experienceLevel} Level</p>

                  <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                    {req.jobDescription}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {req.requiredSkills.map(skill => (
                      <span key={skill} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Budget: <strong className="text-rose-400">{req.minSalary.toLocaleString()} - {req.maxSalary.toLocaleString()} {req.currency}</strong></span>
                    <span>Target: <strong className="text-slate-200">{req.targetHireDate}</strong></span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-400 text-[11px]">{req.applicationsCount} Applicants</span>
                    <button
                      onClick={() => setActiveTab('ats')}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg font-medium transition-all text-xs flex items-center gap-1"
                    >
                      <span>View Pipeline</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ATS KANBAN PIPELINE */}
      {activeTab === 'ats' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-rose-400" />
                Applicant Pipeline & AI Resume Matcher
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Drag candidates across evaluation stages or trigger automated AI match scoring.</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">{candidates.length} Total Active Candidates</span>
            </div>
          </div>

          {/* Kanban Columns */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
            {stages.map(col => {
              const stageCandidates = candidates.filter(c => c.stage === col.key);
              return (
                <div key={col.key} className="w-72 shrink-0 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-col max-h-[70vh]">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${col.color}`}></span>
                      {col.label}
                    </span>
                    <span className="text-xs font-bold text-slate-400 px-1.5 py-0.5 rounded bg-slate-800">
                      {stageCandidates.length}
                    </span>
                  </div>

                  <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
                    {stageCandidates.length === 0 ? (
                      <div className="p-4 text-center text-slate-500 text-xs italic">
                        No candidates in this stage
                      </div>
                    ) : (
                      stageCandidates.map(cand => (
                        <div
                          key={cand.id}
                          onClick={() => setSelectedCandidate(cand)}
                          className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 cursor-pointer transition-all hover:shadow-md space-y-2"
                        >
                          <div className="flex items-start justify-between">
                            <h5 className="text-xs font-bold text-white tracking-tight">{cand.fullName}</h5>
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" />
                              {cand.aiMatchScore}%
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-400">
                            {cand.currentTitle} • {cand.yearsOfExperience}y exp
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-700/60">
                            <span>Exp: {cand.expectedSalary.toLocaleString()} AED</span>
                            <span className="text-rose-400 font-semibold">{cand.jobTitle.split(' ')[0]}</span>
                          </div>

                          {/* Quick Stage Change buttons */}
                          <div className="pt-1 flex items-center justify-end gap-1">
                            <select
                              value={cand.stage}
                              onClick={e => e.stopPropagation()}
                              onChange={e => updateCandidateStage(cand.id, e.target.value as CandidateStage)}
                              className="bg-slate-900 border border-slate-700 rounded text-[10px] text-slate-300 py-0.5 px-1 focus:outline-none"
                            >
                              {stages.map(s => (
                                <option key={s.key} value={s.key}>{s.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: INTERVIEW SCORECARDS */}
      {activeTab === 'interviews' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-rose-400" />
                  Interview Scheduling & Structured Scorecards
                </h3>
                <p className="text-xs text-slate-400 mt-1">Panel evaluations, rating matrix, and candidate recommendations.</p>
              </div>

              <button
                onClick={() => {
                  if (candidates.length > 0) {
                    setSchedForm(prev => ({
                      ...prev,
                      candidateId: candidates[0].id,
                      candidateName: candidates[0].fullName,
                      jobTitle: candidates[0].jobTitle
                    }));
                  }
                  setShowScheduleModal(true);
                }}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Schedule Interview</span>
              </button>
            </div>

            <div className="space-y-3">
              {interviews.map(int => (
                <div key={int.id} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{int.candidateName}</h4>
                        <span className="text-xs text-slate-400">({int.jobTitle})</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <Calendar className="w-3.5 h-3.5 text-rose-400" />
                        <span>{int.scheduledDate} at {int.scheduledTime}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-300">{int.interviewType}</span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border self-start ${
                      int.status === 'COMPLETED'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                    }`}>
                      {int.status}
                    </span>
                  </div>

                  {int.scorecard ? (
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/60 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4" />
                          Verdict: {int.scorecard.overallRecommendation}
                        </span>
                        <span className="text-slate-400 text-[11px]">Submitted by {int.scorecard.submittedBy}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed italic">
                        "{int.scorecard.feedback}"
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between pt-2 border-t border-slate-700/60 text-xs">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5 text-cyan-400" />
                        Room: <a href={int.locationOrLink} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">{int.locationOrLink}</a>
                      </span>
                      <button
                        onClick={() => {
                          submitInterviewScorecard(int.id, {
                            technicalScore: 5,
                            problemSolvingScore: 5,
                            communicationScore: 4,
                            cultureFitScore: 5,
                            leadershipScore: 4,
                            overallRecommendation: 'STRONG_HIRE',
                            feedback: 'Interview passed with exceptional marks. Highly recommended for immediate hiring.',
                            submittedBy: 'Elena Vostrikova (HR Director)',
                            submittedAt: new Date().toISOString()
                          });
                        }}
                        className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold"
                      >
                        Submit Scorecard
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: JOB OFFERS */}
      {activeTab === 'offers' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-rose-400" />
                  Executive & Staff Job Offer Letters
                </h3>
                <p className="text-xs text-slate-400 mt-1">Formal compensation proposals, allowance breakdowns, and digital acceptance status.</p>
              </div>

              <button
                onClick={() => {
                  if (candidates.length > 0) {
                    setOfferForm(prev => ({
                      ...prev,
                      candidateId: candidates[0].id,
                      candidateName: candidates[0].fullName,
                      requisitionId: candidates[0].requisitionId,
                      jobTitle: candidates[0].jobTitle
                    }));
                  }
                  setShowOfferModal(true);
                }}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Draft New Offer</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobOffers.map(offer => (
                <div key={offer.id} className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                        {offer.offerNumber}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1.5">{offer.candidateName}</h4>
                      <p className="text-xs text-slate-400">{offer.jobTitle} • {offer.department}</p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                      offer.status === 'ACCEPTED' || offer.status === 'ONBOARDING_INITIATED'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {offer.status}
                    </span>
                  </div>

                  {/* Compensation Breakdown */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Basic Salary:</span>
                      <span className="font-bold text-white">{offer.basicSalary.toLocaleString()} {offer.currency}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Housing:</span>
                      <span className="font-bold text-white">{offer.housingAllowance.toLocaleString()} {offer.currency}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Total Monthly:</span>
                      <span className="font-bold text-emerald-400">{(offer.basicSalary + offer.housingAllowance + offer.transportAllowance).toLocaleString()} {offer.currency}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span>Target Joining: <strong className="text-slate-200">{offer.joiningDate}</strong></span>
                    <span>Expires: <strong className="text-amber-400">{offer.expiryDate}</strong></span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-700/60">
                    {offer.status === 'DRAFT' && (
                      <button
                        onClick={() => updateJobOfferStatus(offer.id, 'SENT_TO_CANDIDATE')}
                        className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl flex items-center gap-1"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send to Candidate</span>
                      </button>
                    )}
                    {offer.status === 'SENT_TO_CANDIDATE' && (
                      <button
                        onClick={() => updateJobOfferStatus(offer.id, 'ACCEPTED')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Record Acceptance</span>
                      </button>
                    )}
                    {offer.status === 'ACCEPTED' && (
                      <button
                        onClick={() => {
                          updateJobOfferStatus(offer.id, 'ONBOARDING_INITIATED');
                          onNavigate({ view: 'functional_area', moduleId: 'hr', functionalAreaId: 'employee-onboarding' });
                        }}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl flex items-center gap-1"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Initiate Day 1 Onboarding</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CANDIDATE DETAIL MODAL */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">{selectedCandidate.fullName}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI Match: {selectedCandidate.aiMatchScore}%
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Applying for: <strong className="text-rose-400">{selectedCandidate.jobTitle}</strong></p>
              </div>

              <button onClick={() => setSelectedCandidate(null)} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-800 text-slate-300">
                <div>
                  <span className="text-slate-400 block text-[11px]">Current Company:</span>
                  <span className="font-semibold text-white">{selectedCandidate.currentCompany} ({selectedCandidate.currentTitle})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Experience:</span>
                  <span className="font-semibold text-white">{selectedCandidate.yearsOfExperience} Years</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Expected Salary:</span>
                  <span className="font-semibold text-emerald-400">{selectedCandidate.expectedSalary.toLocaleString()} AED</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Notice Period:</span>
                  <span className="font-semibold text-white">{selectedCandidate.noticePeriodDays} Days</span>
                </div>
              </div>

              {/* AI Strengths & Gaps */}
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-rose-500/20 space-y-2">
                <h4 className="font-bold text-white flex items-center gap-1.5 text-rose-400">
                  <Sparkles className="w-4 h-4" />
                  AI Candidate Fit Analysis
                </h4>
                <div className="space-y-1 text-slate-300">
                  <div className="font-semibold text-emerald-400">Key Strengths:</div>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-300">
                    {selectedCandidate.aiStrengths.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW REQUISITION MODAL */}
      {showNewReqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-rose-400" />
                Submit Job Requisition
              </h3>
              <button onClick={() => setShowNewReqModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReq} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Welding Metallurgy Engineer"
                  value={newReq.jobTitle}
                  onChange={e => setNewReq({ ...newReq, jobTitle: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Department</label>
                  <select
                    value={newReq.department}
                    onChange={e => setNewReq({ ...newReq, department: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Manufacturing & Engineering">Manufacturing & Engineering</option>
                    <option value="Quality Assurance & EHS">Quality Assurance & EHS</option>
                    <option value="Supply Chain & Procurement">Supply Chain & Procurement</option>
                    <option value="Commercial Sales & CRM">Commercial Sales & CRM</option>
                    <option value="Finance & Treasury">Finance & Treasury</option>
                    <option value="Human Resources">Human Resources</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Headcount Needed</label>
                  <input
                    type="number"
                    min="1"
                    value={newReq.headcount}
                    onChange={e => setNewReq({ ...newReq, headcount: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Job Description</label>
                <textarea
                  rows={3}
                  value={newReq.jobDescription}
                  onChange={e => setNewReq({ ...newReq, jobDescription: e.target.value })}
                  placeholder="Key responsibilities and qualifications..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewReqModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-rose-600 text-white font-bold"
                >
                  Publish Opening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
