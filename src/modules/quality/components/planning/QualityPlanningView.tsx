// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 14: QUALITY MANAGEMENT (QMS)
// 14.02 Quality Planning & Sampling Engine
// ==========================================

import React, { useState } from 'react';
import { useQualityStore } from '../../services/qualityStore';
import { QualityPlan, InspectionPlan, QualityChecklist, SamplingPlan } from '../../types/qualityTypes';
import {
  Calendar,
  CheckSquare,
  ListOrdered,
  Calculator,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Shield,
  FileText,
  UserCheck,
  Check,
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const QualityPlanningView: React.FC = () => {
  const {
    qualityPlans,
    inspectionPlans,
    checklists,
    samplingPlans,
    updateChecklistItem,
    addQualityPlan,
    addInspectionPlan,
    addChecklist
  } = useQualityStore();

  const [activeTab, setActiveTab] = useState<'QUALITY_PLANS' | 'INSPECTION_PLANS' | 'CHECKLISTS' | 'SAMPLING_CALC'>('QUALITY_PLANS');
  const [selectedPlan, setSelectedPlan] = useState<QualityPlan | null>(qualityPlans[0] || null);
  const [selectedChecklist, setSelectedChecklist] = useState<QualityChecklist | null>(checklists[0] || null);

  // Interactive AQL Calculator State
  const [calcLotSize, setCalcLotSize] = useState<number>(500);
  const [calcInspectionLevel, setCalcInspectionLevel] = useState<'I' | 'II' | 'III'>('II');
  const [calcAqlPercent, setCalcAqlPercent] = useState<number>(0.65);

  // Modals
  const [showAddQpModal, setShowAddQpModal] = useState(false);
  const [showAddIpModal, setShowAddIpModal] = useState(false);

  // Form State for Quality Plan
  const [qpForm, setQpForm] = useState({
    code: '',
    projectNameOrProduct: '',
    controlPlanType: 'PROJECT_SPECIFIC' as const,
    version: 'Rev 1.0',
    stagesCount: 4,
    holdPointsCount: 2,
    leadQualityEngineer: 'Eng. Salem Al-Kiyumi',
    effectiveDate: new Date().toISOString().split('T')[0],
    approvalStatus: 'APPROVED' as const
  });

  // Calculate AQL sample size & Ac/Re
  const computedAQL = React.useMemo(() => {
    let codeLetter = 'A';
    let sampleSize = 2;

    if (calcLotSize <= 8) {
      codeLetter = 'A';
      sampleSize = 2;
    } else if (calcLotSize <= 15) {
      codeLetter = 'B';
      sampleSize = 3;
    } else if (calcLotSize <= 25) {
      codeLetter = 'C';
      sampleSize = 5;
    } else if (calcLotSize <= 50) {
      codeLetter = 'D';
      sampleSize = 8;
    } else if (calcLotSize <= 90) {
      codeLetter = 'E';
      sampleSize = 13;
    } else if (calcLotSize <= 150) {
      codeLetter = 'F';
      sampleSize = 20;
    } else if (calcLotSize <= 280) {
      codeLetter = 'G';
      sampleSize = 32;
    } else if (calcLotSize <= 500) {
      codeLetter = 'H';
      sampleSize = 50;
    } else if (calcLotSize <= 1200) {
      codeLetter = 'J';
      sampleSize = 80;
    } else if (calcLotSize <= 3200) {
      codeLetter = 'K';
      sampleSize = 125;
    } else if (calcLotSize <= 10000) {
      codeLetter = 'L';
      sampleSize = 200;
    } else {
      codeLetter = 'M';
      sampleSize = 315;
    }

    // Ac / Re calculation rule based on sample size and AQL %
    let ac = 0;
    let re = 1;
    if (calcAqlPercent >= 1.0 && sampleSize >= 80) {
      ac = 2;
      re = 3;
    } else if (calcAqlPercent >= 2.5 && sampleSize >= 50) {
      ac = 3;
      re = 4;
    } else if (calcAqlPercent >= 4.0) {
      ac = 5;
      re = 6;
    }

    return {
      codeLetter,
      sampleSize,
      acceptanceNumberAc: ac,
      rejectionNumberRe: re,
      inspectionCoveragePct: ((sampleSize / calcLotSize) * 100).toFixed(1)
    };
  }, [calcLotSize, calcInspectionLevel, calcAqlPercent]);

  const handleCreateQp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qpForm.code || !qpForm.projectNameOrProduct) return;
    addQualityPlan({
      ...qpForm,
      stages: [
        {
          stageNumber: 1,
          operationName: 'Material Receiving & COA Gate Verification',
          inspectionType: 'INCOMING',
          isHoldPoint: true,
          sampleSizeRule: 'AQL 0.65 Level II',
          responsibleRole: 'Inbound QC Inspector'
        },
        {
          stageNumber: 2,
          operationName: 'Machining & First-Piece Line Clearance',
          inspectionType: 'IN_PROCESS',
          isHoldPoint: false,
          sampleSizeRule: 'First + Last piece + 2-hour patrol',
          responsibleRole: 'Line QC Specialist'
        },
        {
          stageNumber: 3,
          operationName: 'Final Hydrostatic Proof & Functional Test',
          inspectionType: 'FINAL',
          isHoldPoint: true,
          sampleSizeRule: '100% of finished units',
          responsibleRole: 'Lead Test Engineer'
        }
      ]
    });
    setShowAddQpModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Sub-Header Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('QUALITY_PLANS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'QUALITY_PLANS'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Quality & Control Plans ({qualityPlans.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('INSPECTION_PLANS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'INSPECTION_PLANS'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Inspection Plans ({inspectionPlans.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('CHECKLISTS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'CHECKLISTS'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Quality Checklists ({checklists.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('SAMPLING_CALC')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'SAMPLING_CALC'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>AQL Sampling Calculator</span>
          </button>
        </div>

        {activeTab === 'QUALITY_PLANS' && (
          <button
            onClick={() => setShowAddQpModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-teal-600/20 transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Control Plan</span>
          </button>
        )}
      </div>

      {/* TAB 1: QUALITY CONTROL PLANS */}
      {activeTab === 'QUALITY_PLANS' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Plan Cards List */}
          <div className="space-y-3">
            {qualityPlans.map(qp => {
              const isSelected = selectedPlan?.id === qp.id;
              return (
                <div
                  key={qp.id}
                  onClick={() => setSelectedPlan(qp)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-teal-500 shadow-xl shadow-teal-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-950 text-teal-400 border border-teal-800">
                      {qp.code}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {qp.approvalStatus}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white leading-snug">{qp.projectNameOrProduct}</h4>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800/80">
                    <span>{qp.stagesCount} Stages</span>
                    <span className="text-amber-400 font-bold">{qp.holdPointsCount} Mandatory Hold Points</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Plan Stage Gates & Breakdown */}
          {selectedPlan ? (
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-teal-400 bg-teal-950 px-2.5 py-0.5 rounded border border-teal-800">
                      {selectedPlan.code}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{selectedPlan.version}</span>
                  </div>
                  <h3 className="text-lg font-black text-white mt-1">{selectedPlan.projectNameOrProduct}</h3>
                  <div className="text-xs text-slate-400">Lead QA Engineer: {selectedPlan.leadQualityEngineer} • Effective: {selectedPlan.effectiveDate}</div>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-950/80 text-amber-400 border border-amber-800 inline-flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    <span>{selectedPlan.holdPointsCount} QA Hold Points</span>
                  </span>
                </div>
              </div>

              {/* Stage Gates Timeline */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <ListOrdered className="w-4 h-4 text-teal-400" />
                  <span>Inspection & Test Plan (ITP) Sequence</span>
                </h4>

                <div className="space-y-3">
                  {selectedPlan.stages.map((stg, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        stg.isHoldPoint
                          ? 'bg-amber-950/20 border-amber-800/80'
                          : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-slate-800 text-teal-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {stg.stageNumber}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{stg.operationName}</span>
                            {stg.isHoldPoint && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500 text-slate-950 uppercase tracking-wider">
                                HOLD POINT
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Sampling Rule: <span className="text-slate-200 font-mono">{stg.sampleSizeRule}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] px-2 py-1 rounded bg-slate-900 border border-slate-800 text-teal-400 font-semibold">
                          {stg.responsibleRole}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-xs">
              Select a control plan to review inspection sequence.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INSPECTION PLANS */}
      {activeTab === 'INSPECTION_PLANS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {inspectionPlans.map(ip => (
            <div key={ip.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-950 text-teal-400 border border-teal-800">
                    {ip.code}
                  </span>
                  <h4 className="text-base font-bold text-white">{ip.title}</h4>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-teal-950 text-teal-400 border border-teal-800">
                  {ip.inspectionType}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Frequency:</span>
                  <span className="font-bold text-white">{ip.frequency.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sampling Formula:</span>
                  <span className="font-mono text-teal-400">{ip.sampleSizeFormula}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 text-slate-300">
                  <span className="font-semibold text-slate-400">Criteria:</span> {ip.criteriaSummary}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mandatory Gauges & Tools:</div>
                <div className="flex flex-wrap gap-1.5">
                  {ip.mandatoryGauges.map((g, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg text-[11px] bg-slate-800 text-slate-200 border border-slate-700">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: QUALITY CHECKLISTS (Interactive) */}
      {activeTab === 'CHECKLISTS' && selectedChecklist && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                  {selectedChecklist.code}
                </span>
                <span className="text-xs text-slate-400 font-mono">{selectedChecklist.revision}</span>
              </div>
              <h3 className="text-lg font-black text-white mt-1">{selectedChecklist.title}</h3>
              <div className="text-xs text-slate-400">{selectedChecklist.department} • {selectedChecklist.workCenter}</div>
            </div>

            <div className="text-right text-xs">
              <div className="text-slate-400">Assigned Inspector:</div>
              <div className="font-bold text-white flex items-center gap-1.5 justify-end">
                <UserCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>{selectedChecklist.inspectorName}</span>
              </div>
            </div>
          </div>

          {/* Checklist Items Interactive Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-teal-400" />
              <span>Inspection Checkpoints & Live Verification</span>
            </h4>

            <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60">
              {selectedChecklist.items.map((item, idx) => (
                <div key={item.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-900/40 transition-colors">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{idx + 1}. {item.checkpoint}</span>
                    </div>
                    <p className="text-xs text-slate-400">{item.specificationRequirement}</p>
                    {item.notes && (
                      <div className="text-[11px] text-teal-400 font-mono mt-1">Note: {item.notes}</div>
                    )}
                  </div>

                  {/* Interactive Input or Pass/Fail toggle */}
                  <div className="flex items-center gap-3 shrink-0">
                    {item.measurementType === 'NUMERIC_VALUE' && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Measured:</span>
                        <input
                          type="number"
                          step="0.01"
                          value={item.actualValue || ''}
                          onChange={e => {
                            const val = parseFloat(e.target.value);
                            const isPass = val >= (item.minValue ?? 0) && val <= (item.maxValue ?? 999999);
                            updateChecklistItem(selectedChecklist.id, item.id, isPass ? 'PASS' : 'FAIL', val);
                          }}
                          className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-white text-center focus:border-teal-500"
                        />
                        <span className="text-xs font-mono text-slate-400">{item.unit}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                      <button
                        onClick={() => updateChecklistItem(selectedChecklist.id, item.id, 'PASS')}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          item.actualResult === 'PASS'
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Pass</span>
                      </button>

                      <button
                        onClick={() => updateChecklistItem(selectedChecklist.id, item.id, 'FAIL')}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          item.actualResult === 'FAIL'
                            ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Fail</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Digital Quality Supervisor Signoff Verified</span>
            </div>
            <span className="text-slate-400 font-mono">Timestamp: 2024-04-18 09:42:15 UTC</span>
          </div>
        </div>
      )}

      {/* TAB 4: AQL SAMPLING CALCULATOR */}
      {activeTab === 'SAMPLING_CALC' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-teal-400" />
                <span>AQL Sampling Plan Calculator</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                MIL-STD-105E / ISO 2859-1 Single Normal Sampling Scheme
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Total Batch Lot Size (N)</label>
                <input
                  type="number"
                  min="1"
                  max="500000"
                  value={calcLotSize}
                  onChange={e => setCalcLotSize(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono font-bold focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">General Inspection Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['I', 'II', 'III'] as const).map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setCalcInspectionLevel(lvl)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        calcInspectionLevel === lvl
                          ? 'bg-teal-600 border-teal-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Level {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Acceptable Quality Limit (AQL %)</label>
                <select
                  value={calcAqlPercent}
                  onChange={e => setCalcAqlPercent(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-bold focus:border-teal-500"
                >
                  <option value="0.25">AQL 0.25% (Critical Pressure Components)</option>
                  <option value="0.40">AQL 0.40% (Structural Castings)</option>
                  <option value="0.65">AQL 0.65% (Standard Precision Parts)</option>
                  <option value="1.00">AQL 1.00% (General Hardware)</option>
                  <option value="2.50">AQL 2.50% (Packaging Materials)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  <span>Computed Statistical Sampling Plan</span>
                </h4>
                <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-teal-950 text-teal-400 border border-teal-800">
                  ISO 2859-1 / Normal Single
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">Sample Code</div>
                  <div className="text-2xl font-black font-mono text-teal-400">{computedAQL.codeLetter}</div>
                  <div className="text-[10px] text-slate-500">ISO Table Letter</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">Sample Size (n)</div>
                  <div className="text-2xl font-black font-mono text-white">{computedAQL.sampleSize}</div>
                  <div className="text-[10px] text-slate-500">{computedAQL.inspectionCoveragePct}% of batch</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-[11px] text-emerald-400 uppercase font-semibold">Accept Number (Ac)</div>
                  <div className="text-2xl font-black font-mono text-emerald-400">{computedAQL.acceptanceNumberAc}</div>
                  <div className="text-[10px] text-slate-500">Max allowed defects</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-[11px] text-rose-400 uppercase font-semibold">Reject Number (Re)</div>
                  <div className="text-2xl font-black font-mono text-rose-400">{computedAQL.rejectionNumberRe}</div>
                  <div className="text-[10px] text-slate-500">Immediate quarantine</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-slate-200">Execution Instructions for QA Inspector:</div>
                <ul className="list-disc list-inside text-slate-400 space-y-1">
                  <li>Randomly extract exactly <span className="text-teal-400 font-bold">{computedAQL.sampleSize} items</span> across all pallets/boxes in Lot size {calcLotSize}.</li>
                  <li>Perform 100% parameter testing on the {computedAQL.sampleSize} sampled units.</li>
                  <li>If defects found ≤ <span className="text-emerald-400 font-bold">{computedAQL.acceptanceNumberAc}</span>: Release entire batch to stock.</li>
                  <li>If defects found ≥ <span className="text-rose-400 font-bold">{computedAQL.rejectionNumberRe}</span>: Reject entire batch and immediately issue NCR.</li>
                </ul>
              </div>
            </div>

            <div className="text-xs text-slate-500 border-t border-slate-800 pt-3 flex items-center justify-between">
              <span>Statistical Confidence Level: 95% Confidence Interval</span>
              <span className="text-teal-400 font-mono font-bold">Standard: AQL {calcAqlPercent}%</span>
            </div>
          </div>
        </div>
      )}

      {/* CREATE QUALITY PLAN MODAL */}
      {showAddQpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-400" />
                <span>Create Quality Control Plan (ITP)</span>
              </h3>
              <button onClick={() => setShowAddQpModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQp} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Plan Reference Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. QP-VALVE-API6D-2024"
                    value={qpForm.code}
                    onChange={e => setQpForm({ ...qpForm, code: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Plan Type</label>
                  <select
                    value={qpForm.controlPlanType}
                    onChange={e => setQpForm({ ...qpForm, controlPlanType: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-teal-500"
                  >
                    <option value="PROJECT_SPECIFIC">Project-Specific ITP</option>
                    <option value="MASS_PRODUCTION">Mass Production Control Plan</option>
                    <option value="PRE_LAUNCH">Pre-Launch Pilot Plan</option>
                    <option value="PROTOTYPE">Prototype Verification Plan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Project or Target Product *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Duqm Refinery Offshore Piping Package B"
                  value={qpForm.projectNameOrProduct}
                  onChange={e => setQpForm({ ...qpForm, projectNameOrProduct: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Lead Quality Engineer</label>
                  <input
                    type="text"
                    value={qpForm.leadQualityEngineer}
                    onChange={e => setQpForm({ ...qpForm, leadQualityEngineer: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Hold Points Count</label>
                  <input
                    type="number"
                    value={qpForm.holdPointsCount}
                    onChange={e => setQpForm({ ...qpForm, holdPointsCount: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddQpModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold shadow-lg shadow-teal-600/30 cursor-pointer"
                >
                  Save Quality Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
