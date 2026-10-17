// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 14: QUALITY MANAGEMENT (QMS)
// 14.05 CAPA, 8D Problem Solving & FMEA Risk Analysis
// ==========================================

import React, { useState } from 'react';
import { useQualityStore } from '../../services/qualityStore';
import { CapaRecord, FmeaItem, EightDStage } from '../../types/qualityTypes';
import {
  Flame,
  GitBranch,
  ShieldAlert,
  CheckCircle2,
  Plus,
  Search,
  Users,
  Target,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Clock,
  AlertOctagon,
  X,
  FileText
} from 'lucide-react';

export const CapaManagementView: React.FC = () => {
  const { capas, fmeaRecords, addCapa, addFmeaItem } = useQualityStore();

  const [activeTab, setActiveTab] = useState<'8D_WORKBENCH' | 'FIVE_WHYS' | 'FISHBONE' | 'FMEA_MATRIX'>('8D_WORKBENCH');
  const [selectedCapa, setSelectedCapa] = useState<CapaRecord | null>(capas[0] || null);
  const [selectedEightDStep, setSelectedEightDStep] = useState<EightDStage>('D4_ROOT_CAUSE');

  // Modals
  const [showAddCapaModal, setShowAddCapaModal] = useState(false);
  const [showAddFmeaModal, setShowAddFmeaModal] = useState(false);

  // Form State for new CAPA
  const [capaForm, setCapaForm] = useState({
    title: '',
    sourceType: 'NCR_TRIGGER' as const,
    linkedNcrId: 'NCR-2024-001',
    championName: 'Eng. Salim Al-Rawahi',
    targetResolutionDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
    problemStatement: '',
    status: 'IN_PROGRESS' as const,
    d1Team: ['Salim Al-Rawahi', 'Ahmed Al-Harthy', 'Fatima Al-Balushi'],
    d2ProblemStatement: '',
    d3ContainmentAction: '100% sorting of warehouse inventory and quarantine of suspect lot.',
    d4RootCauseSummary: 'Tool wear vibration caused depth deviation during CNC pass.',
    d5PermanentCorrectiveAction: 'Installed high-rigidity carbide tooling with automatic tool life sensor.',
    d6ValidationResults: 'Zero dimensional defects across 3 consecutive batches.',
    d7PreventiveSystemChanges: 'Updated tooling maintenance SOP-MNT-44 and calibration interval.',
    d8ClosureNotes: 'Recognized machining shift team for rapid containment.'
  });

  // Form State for FMEA item
  const [fmeaForm, setFmeaForm] = useState({
    processStep: '',
    potentialFailureMode: '',
    potentialEffectOfFailure: '',
    severityScoreS: 7,
    potentialRootCause: '',
    occurrenceScoreO: 5,
    currentProcessControls: '',
    detectionScoreD: 4,
    recommendedAction: '',
    responsiblePerson: 'Lead Process Engineer',
    targetDate: new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString().split('T')[0]
  });

  const eightDStepsInfo: { key: EightDStage; title: string; num: string; desc: string }[] = [
    { key: 'D1_TEAM', num: 'D1', title: 'Team Formation', desc: 'Establish cross-functional team with process expertise' },
    { key: 'D2_PROBLEM_STATEMENT', num: 'D2', title: 'Problem Statement', desc: 'Define Is / Is Not 5W2H problem boundary' },
    { key: 'D3_CONTAINMENT', num: 'D3', title: 'Containment Action', desc: 'Quarantine and protect customer immediately' },
    { key: 'D4_ROOT_CAUSE', num: 'D4', title: 'Root Cause (5 Whys)', desc: 'Identify verified underlying root causes' },
    { key: 'D5_PERMANENT_CORRECTIVE_ACTIONS', num: 'D5', title: 'Permanent Actions', desc: 'Design proven corrective solutions' },
    { key: 'D6_VALIDATE_IMPLEMENTATION', num: 'D6', title: 'Validate & Run', desc: 'Measure statistical CPk & yield improvement' },
    { key: 'D7_PREVENT_RECURRENCE', num: 'D7', title: 'System Prevention', desc: 'Update FMEA, SOPs & Control Plans' },
    { key: 'D8_RECOGNIZE_TEAM', num: 'D8', title: 'Closure & Recognition', desc: 'Congratulate team and archive learnings' }
  ];

  const handleCreateCapa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!capaForm.title || !capaForm.problemStatement) return;
    addCapa({
      ...capaForm,
      currentEightDStage: 'D4_ROOT_CAUSE',
      d2ProblemStatement: capaForm.problemStatement,
      fiveWhys: [
        { whyNumber: 1, question: 'Why did the dimension drift?', answer: 'The CNC boring tool experienced micro-chatter.' },
        { whyNumber: 2, question: 'Why was there micro-chatter?', answer: 'Tool overhang exceeded recommended aspect ratio.' },
        { whyNumber: 3, question: 'Why did it exceed aspect ratio?', answer: 'Operator used standard tool holder instead of dampened extension.' },
        { whyNumber: 4, question: 'Why was the standard holder selected?', answer: 'Setup sheet did not specify vibration-dampened tooling requirement.' },
        { whyNumber: 5, question: 'Why was it omitted from setup sheet?', answer: 'Root Cause: Engineering change note ECN-2023-88 was not cascaded to shop floor documentation.' }
      ],
      ishikawaCategories: [
        { category: 'MAN', causes: ['Operator not briefed on new ECN update', 'Shift turnover gap'] },
        { category: 'MACHINE', causes: ['Spindle harmonic vibration at high RPM', 'Tool wear without telemetry'] },
        { category: 'MATERIAL', causes: ['Raw billet hardness variation within alloy spec'] },
        { category: 'METHOD', causes: ['Outdated CNC setup sheet', 'Patrol inspection interval too wide'] },
        { category: 'MEASUREMENT', causes: ['Bore micrometer calibration expired by 2 days'] },
        { category: 'ENVIRONMENT', causes: ['Ambient temperature shift during summer swing'] }
      ]
    });
    setShowAddCapaModal(false);
  };

  const handleCreateFmea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fmeaForm.processStep || !fmeaForm.potentialFailureMode) return;
    const rpn = fmeaForm.severityScoreS * fmeaForm.occurrenceScoreO * fmeaForm.detectionScoreD;
    addFmeaItem({
      ...fmeaForm,
      riskPriorityNumberRpn: rpn,
      status: 'OPEN'
    });
    setShowAddFmeaModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Sub-Header Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-2 p-1 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('8D_WORKBENCH')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === '8D_WORKBENCH'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>8D Problem Solving ({capas.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('FIVE_WHYS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'FIVE_WHYS'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>5-Whys Root Cause Tree</span>
          </button>

          <button
            onClick={() => setActiveTab('FISHBONE')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'FISHBONE'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Ishikawa Fishbone (6M)</span>
          </button>

          <button
            onClick={() => setActiveTab('FMEA_MATRIX')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'FMEA_MATRIX'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>FMEA Risk Matrix ({fmeaRecords.length})</span>
          </button>
        </div>

        {activeTab === 'FMEA_MATRIX' ? (
          <button
            onClick={() => setShowAddFmeaModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-teal-600/20 transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add FMEA Item</span>
          </button>
        ) : (
          <button
            onClick={() => setShowAddCapaModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-teal-600/20 transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Launch 8D CAPA</span>
          </button>
        )}
      </div>

      {/* TAB 1: 8D PROBLEM SOLVING WORKBENCH */}
      {activeTab === '8D_WORKBENCH' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CAPA list */}
          <div className="space-y-3">
            {capas.map(capa => {
              const isSelected = selectedCapa?.id === capa.id;
              return (
                <div
                  key={capa.id}
                  onClick={() => setSelectedCapa(capa)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-teal-500 shadow-xl shadow-teal-500/10'
                      : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
                      {capa.capaNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {(capa.currentEightDStage ?? 'D1_TEAM').replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">{capa.title}</h4>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Champion: {capa.championName}</div>

                  <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 mt-3 pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
                    <span className="text-amber-700 dark:text-amber-400 font-medium">Linked: {capa.linkedNcrId}</span>
                    <span className="font-mono text-slate-500 dark:text-slate-400">Target: {capa.targetResolutionDate}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 8D Stage Flow Detailed View */}
          {selectedCapa ? (
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2.5 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                      {selectedCapa.capaNumber}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      Source: {selectedCapa.sourceType}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">{selectedCapa.title}</h3>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Champion: {selectedCapa.championName} • Resolution Target: {selectedCapa.targetResolutionDate}</div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 shrink-0">
                  {selectedCapa.status}
                </span>
              </div>

              {/* 8D Stage Selector Pills */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                {eightDStepsInfo.map(step => (
                  <button
                    key={step.key}
                    onClick={() => setSelectedEightDStep(step.key)}
                    className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                      selectedEightDStep === step.key
                        ? 'bg-teal-600 border-teal-500 text-white shadow-lg shadow-teal-600/30'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-black font-mono">{step.num}</div>
                    <div className="text-[9px] truncate mt-0.5 font-medium">{step.title}</div>
                  </button>
                ))}
              </div>

              {/* Selected 8D Stage Detail Canvas */}
              <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-teal-600 dark:text-teal-400 font-mono">
                      {eightDStepsInfo.find(s => s.key === selectedEightDStep)?.num} -{' '}
                      {eightDStepsInfo.find(s => s.key === selectedEightDStep)?.title}
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {eightDStepsInfo.find(s => s.key === selectedEightDStep)?.desc}
                    </p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>

                {selectedEightDStep === 'D1_TEAM' && (
                  <div className="space-y-2 text-xs">
                    <span className="text-slate-600 dark:text-slate-400 font-bold uppercase">Assigned 8D Problem Solving Team:</span>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {(selectedCapa.d1Team ?? []).map((member, idx) => (
                        <span key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-medium">
                          <Users className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                          <span>{member}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedEightDStep === 'D2_PROBLEM_STATEMENT' && (
                  <div className="space-y-2 text-xs">
                    <span className="text-slate-600 dark:text-slate-400 font-bold uppercase">5W2H Problem Boundary Definition:</span>
                    <p className="text-slate-800 dark:text-slate-200 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                      {selectedCapa.d2ProblemStatement || selectedCapa.problemStatement}
                    </p>
                  </div>
                )}

                {selectedEightDStep === 'D3_CONTAINMENT' && (
                  <div className="space-y-2 text-xs">
                    <span className="text-slate-600 dark:text-slate-400 font-bold uppercase">Interim Containment Actions (ICA):</span>
                    <p className="text-amber-800 dark:text-amber-300 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                      {selectedCapa.d3ContainmentAction}
                    </p>
                  </div>
                )}

                {selectedEightDStep === 'D4_ROOT_CAUSE' && (
                  <div className="space-y-2 text-xs">
                    <span className="text-slate-600 dark:text-slate-400 font-bold uppercase">Verified Root Cause:</span>
                    <p className="text-rose-700 dark:text-rose-300 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                      {selectedCapa.d4RootCauseSummary}
                    </p>
                  </div>
                )}

                {selectedEightDStep === 'D5_PERMANENT_CORRECTIVE_ACTIONS' && (
                  <div className="space-y-2 text-xs">
                    <span className="text-slate-600 dark:text-slate-400 font-bold uppercase">Permanent Corrective Action (PCA):</span>
                    <p className="text-emerald-700 dark:text-emerald-300 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                      {selectedCapa.d5PermanentCorrectiveAction}
                    </p>
                  </div>
                )}

                {selectedEightDStep === 'D6_VALIDATE_IMPLEMENTATION' && (
                  <div className="space-y-2 text-xs">
                    <span className="text-slate-600 dark:text-slate-400 font-bold uppercase">Validation & CPk Capability:</span>
                    <p className="text-teal-700 dark:text-teal-300 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                      {selectedCapa.d6ValidationResults}
                    </p>
                  </div>
                )}

                {selectedEightDStep === 'D7_PREVENT_RECURRENCE' && (
                  <div className="space-y-2 text-xs">
                    <span className="text-slate-600 dark:text-slate-400 font-bold uppercase">Systemic Prevention & SOP Modifications:</span>
                    <p className="text-slate-800 dark:text-slate-200 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                      {selectedCapa.d7PreventiveSystemChanges}
                    </p>
                  </div>
                )}

                {selectedEightDStep === 'D8_RECOGNIZE_TEAM' && (
                  <div className="space-y-2 text-xs">
                    <span className="text-slate-600 dark:text-slate-400 font-bold uppercase">Team Recognition & Closure Signoff:</span>
                    <p className="text-slate-800 dark:text-slate-200 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                      {selectedCapa.d8ClosureNotes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
              Select an 8D CAPA project to view lifecycle gates.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: 5-WHYS ROOT CAUSE TREE */}
      {activeTab === 'FIVE_WHYS' && selectedCapa && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>5-Whys Root Cause Analytical Tree: {selectedCapa.capaNumber}</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">Drill down sequentially from symptom to fundamental systemic root cause</p>
          </div>

          <div className="space-y-3">
            {(selectedCapa.fiveWhys ?? []).map((w, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border space-y-2 ${
                  idx === selectedCapa.fiveWhys.length - 1
                    ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 shadow-lg shadow-rose-950/40'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400">
                    Why #{w.whyNumber}
                  </span>
                  {idx === selectedCapa.fiveWhys.length - 1 && (
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800">
                      ROOT CAUSE DISCOVERED
                    </span>
                  )}
                </div>

                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="text-slate-600 dark:text-slate-400">Q:</span>
                  <span>{w.question}</span>
                </div>

                <div className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2 pt-1 border-t border-slate-200/80 dark:border-slate-800/80">
                  <span className="text-teal-600 dark:text-teal-400 font-bold">A:</span>
                  <span className={idx === selectedCapa.fiveWhys.length - 1 ? 'font-bold text-rose-700 dark:text-rose-300' : ''}>
                    {w.answer}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ISHIKAWA FISHBONE DIAGRAM (6M) */}
      {activeTab === 'FISHBONE' && selectedCapa && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>Ishikawa Fishbone Cause & Effect Diagram (6M Framework)</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Target Defect: {selectedCapa.title}</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
              6M Method
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(selectedCapa.ishikawaCategories ?? []).map((cat, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider flex items-center justify-between">
                  <span>{cat.category}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{cat.causes.length} Factors</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {(cat.causes ?? []).map((c, cIdx) => (
                    <li key={cIdx} className="flex items-start gap-1.5">
                      <span className="text-teal-600 dark:text-teal-500">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: FMEA RISK MATRIX & RPN CALCULATOR */}
      {activeTab === 'FMEA_MATRIX' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>Failure Mode and Effects Analysis (FMEA Matrix)</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Risk Priority Number (RPN) = Severity (S) × Occurrence (O) × Detection (D)</p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-bold border border-rose-200 dark:border-rose-800">RPN &gt; 120 (High Risk)</span>
              <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 font-bold border border-amber-200 dark:border-amber-800">RPN 60-120 (Medium)</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 font-semibold">
                  <th className="py-3 px-3">Process Step</th>
                  <th className="py-3 px-3">Potential Failure Mode</th>
                  <th className="py-3 px-3">Failure Effect</th>
                  <th className="py-3 px-2 text-center">S (1-10)</th>
                  <th className="py-3 px-2 text-center">O (1-10)</th>
                  <th className="py-3 px-2 text-center">D (1-10)</th>
                  <th className="py-3 px-3 text-center">RPN Score</th>
                  <th className="py-3 px-3">Recommended Mitigation Action</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 font-sans">
                {fmeaRecords.map(item => (
                  <tr key={item.id} className="hover:bg-slate-100/70 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{item.processStep}</td>
                    <td className="py-3 px-3 text-slate-800 dark:text-slate-200">{item.potentialFailureMode}</td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{item.potentialEffectOfFailure}</td>
                    <td className="py-3 px-2 font-mono text-center text-rose-600 dark:text-rose-400 font-bold">{item.severityScoreS}</td>
                    <td className="py-3 px-2 font-mono text-center text-amber-700 dark:text-amber-400 font-bold">{item.occurrenceScoreO}</td>
                    <td className="py-3 px-2 font-mono text-center text-teal-600 dark:text-teal-400 font-bold">{item.detectionScoreD}</td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full font-mono font-black text-xs ${
                          item.riskPriorityNumberRpn >= 120
                            ? 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                            : item.riskPriorityNumberRpn >= 60
                            ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                            : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        }`}
                      >
                        {item.riskPriorityNumberRpn}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300 font-medium">{item.recommendedAction}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD FMEA RECORD */}
      {showAddFmeaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>Add Process FMEA Failure Mode</span>
              </h3>
              <button onClick={() => setShowAddFmeaModal(false)} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFmea} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Process Step *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Automated Robotic TIG Welding"
                    value={fmeaForm.processStep}
                    onChange={e => setFmeaForm({ ...fmeaForm, processStep: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Potential Failure Mode *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shielding gas flow loss during weld"
                    value={fmeaForm.potentialFailureMode}
                    onChange={e => setFmeaForm({ ...fmeaForm, potentialFailureMode: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1">Potential Effect on Product / Customer</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Porosity causing hydraulic pressure drop in service"
                  value={fmeaForm.potentialEffectOfFailure}
                  onChange={e => setFmeaForm({ ...fmeaForm, potentialEffectOfFailure: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1 text-[11px] font-bold">Severity (S: 1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={fmeaForm.severityScoreS}
                    onChange={e => setFmeaForm({ ...fmeaForm, severityScoreS: parseInt(e.target.value) || 1 })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white font-mono text-center"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1 text-[11px] font-bold">Occurrence (O: 1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={fmeaForm.occurrenceScoreO}
                    onChange={e => setFmeaForm({ ...fmeaForm, occurrenceScoreO: parseInt(e.target.value) || 1 })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white font-mono text-center"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1 text-[11px] font-bold">Detection (D: 1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={fmeaForm.detectionScoreD}
                    onChange={e => setFmeaForm({ ...fmeaForm, detectionScoreD: parseInt(e.target.value) || 1 })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white font-mono text-center"
                  />
                </div>
              </div>

              <div className="text-center font-mono text-xs font-bold text-teal-600 dark:text-teal-400">
                Calculated RPN = {fmeaForm.severityScoreS * fmeaForm.occurrenceScoreO * fmeaForm.detectionScoreD}
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1">Recommended Corrective Action / Poka-Yoke</label>
                <textarea
                  rows={2}
                  value={fmeaForm.recommendedAction}
                  onChange={e => setFmeaForm({ ...fmeaForm, recommendedAction: e.target.value })}
                  placeholder="Install digital flow sensor interlock that auto-shuts torch when gas pressure drops..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddFmeaModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold shadow-lg shadow-teal-600/30 cursor-pointer"
                >
                  Save FMEA Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
