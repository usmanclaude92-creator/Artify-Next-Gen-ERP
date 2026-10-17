// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 14: QUALITY MANAGEMENT (QMS)
// 14.03 Inspection & Material Laboratory Testing
// ==========================================

import React, { useState } from 'react';
import { useQualityStore } from '../../services/qualityStore';
import { InspectionRecord, MaterialTestReport, InspectionType } from '../../types/qualityTypes';
import {
  CheckSquare,
  FlaskConical,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ShieldCheck,
  Award,
  Layers,
  ArrowRight,
  Printer,
  X,
  FileText,
  Clock,
  Activity,
  Check,
  Download
} from 'lucide-react';
import { notify } from '@/src/components/common/Feedback';

export const InspectionTestingView: React.FC = () => {
  const { inspections, materialTests, addInspectionRecord, addMaterialTestReport } = useQualityStore();

  const [activeTab, setActiveTab] = useState<'INSPECTIONS' | 'LAB_TESTS' | 'CERT_PRINT'>('INSPECTIONS');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInspection, setSelectedInspection] = useState<InspectionRecord | null>(inspections[0] || null);
  const [selectedLabTest, setSelectedLabTest] = useState<MaterialTestReport | null>(materialTests[0] || null);

  // Modals
  const [showAddInspModal, setShowAddInspModal] = useState(false);
  const [showAddLabModal, setShowAddLabModal] = useState(false);

  // Form State for Inspection
  const [inspForm, setInspForm] = useState({
    type: 'INCOMING' as InspectionType,
    lotNumber: '',
    batchSize: 100,
    sampleSize: 20,
    itemCode: '',
    itemName: '',
    vendorOrWorkCenter: '',
    grnOrJobOrderRef: '',
    inspectionDate: new Date().toISOString().split('T')[0],
    inspectorName: 'Fahad Al-Maskari',
    status: 'PASSED' as const,
    defectsFound: 0,
    criticalDefects: 0,
    majorDefects: 0,
    minorDefects: 0,
    certificateOfAnalysisAttached: true,
    coaNumber: 'COA-2024-VEND-01',
    remarks: 'Sample measurements compliant with drawing tolerances.',
    dispositionAction: 'Approved for production issuance.'
  });

  // Form State for Lab Test
  const [labForm, setLabForm] = useState({
    heatNumber: '',
    materialGrade: 'ASTM A240 Type 316L',
    sampleOrigin: '',
    testStandard: 'ASTM E8 / ASTM E18',
    testingLab: 'INTERNAL_METALLURGY_LAB' as const,
    testDate: new Date().toISOString().split('T')[0],
    tensileStrengthMpa: 560,
    yieldStrengthMpa: 290,
    elongationPct: 45,
    hardnessHrc: 22,
    verdict: 'CONFORMING' as const,
    certifiedBy: 'Dr. Tariq Al-Busaidi (Chief Metallurgist)'
  });

  const filteredInspections = inspections.filter(i => {
    const matchesFilter = filterType === 'ALL' || i.type === filterType;
    const matchesSearch =
      i.inspectionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.lotNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.vendorOrWorkCenter.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCreateInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspForm.itemName || !inspForm.lotNumber) return;
    addInspectionRecord({
      ...inspForm,
      measurements: [
        {
          parameter: 'Critical Dimension / Test',
          nominal: 10.0,
          lsl: 9.8,
          usl: 10.2,
          recordedValues: [10.02, 10.01, 9.99, 10.04],
          average: 10.015,
          isWithinTolerance: true
        }
      ]
    });
    setShowAddInspModal(false);
  };

  const handleCreateLabTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!labForm.heatNumber || !labForm.materialGrade) return;
    addMaterialTestReport({
      ...labForm,
      chemicalComposition: [
        { element: 'Carbon (C)', observedPct: 0.024, minLimitPct: 0.0, maxLimitPct: 0.03, isCompliant: true },
        { element: 'Chromium (Cr)', observedPct: 17.4, minLimitPct: 16.0, maxLimitPct: 18.0, isCompliant: true },
        { element: 'Nickel (Ni)', observedPct: 11.2, minLimitPct: 10.0, maxLimitPct: 14.0, isCompliant: true }
      ]
    });
    setShowAddLabModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Sub-Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-2 p-1 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('INSPECTIONS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'INSPECTIONS'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Inspection Workbench ({inspections.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('LAB_TESTS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'LAB_TESTS'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Lab & Material Reports ({materialTests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('CERT_PRINT')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'CERT_PRINT'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Release Certificates (CoA / CoC)</span>
          </button>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search lots, items, vendors..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 w-52"
            />
          </div>

          {activeTab === 'INSPECTIONS' && (
            <button
              onClick={() => setShowAddInspModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-teal-600/20 transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Inspection</span>
            </button>
          )}

          {activeTab === 'LAB_TESTS' && (
            <button
              onClick={() => setShowAddLabModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-teal-600/20 transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Lab Report</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: INSPECTION WORKBENCH */}
      {activeTab === 'INSPECTIONS' && (
        <div className="space-y-4">
          {/* Inspection Type Filter Pills */}
          <div className="flex items-center gap-2">
            {[
              { id: 'ALL', label: 'All Inspections' },
              { id: 'INCOMING', label: 'Incoming (Receiving QC)' },
              { id: 'IN_PROCESS', label: 'In-Process (Line QC)' },
              { id: 'FINAL', label: 'Final (Pre-Dispatch PSI)' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterType === f.id
                    ? 'bg-teal-600 text-white'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List */}
            <div className="space-y-3">
              {filteredInspections.map(insp => {
                const isSelected = selectedInspection?.id === insp.id;
                return (
                  <div
                    key={insp.id}
                    onClick={() => setSelectedInspection(insp)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white dark:bg-slate-900 border-teal-500 shadow-xl shadow-teal-500/10'
                        : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
                        {insp.inspectionNumber}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                          insp.status === 'PASSED'
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                            : insp.status === 'CONDITIONALLY_PASSED'
                            ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                            : 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                        }`}
                      >
                        {insp.status}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-900 dark:text-white">{insp.itemName}</div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 font-mono mt-0.5">Lot: {insp.lotNumber}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{insp.vendorOrWorkCenter}</div>

                    <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 mt-3 pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
                      <span>Sample: {insp.sampleSize} / {insp.batchSize}</span>
                      <span className="text-slate-600 dark:text-slate-400 font-mono">{insp.inspectionDate}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detail View */}
            {selectedInspection ? (
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2.5 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                        {selectedInspection.inspectionNumber}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {selectedInspection.type}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">{selectedInspection.itemName}</h3>
                    <div className="text-xs text-slate-600 dark:text-slate-400 font-mono">Item Code: {selectedInspection.itemCode} • Ref: {selectedInspection.grnOrJobOrderRef}</div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black border ${
                        selectedInspection.status === 'PASSED'
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                          : selectedInspection.status === 'CONDITIONALLY_PASSED'
                          ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                          : 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                      }`}
                    >
                      {selectedInspection.status}
                    </span>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-1">{selectedInspection.inspectionDate}</div>
                  </div>
                </div>

                {/* Key Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Batch Lot Size</span>
                    <span className="font-bold font-mono text-slate-900 dark:text-white text-base">{selectedInspection.batchSize} Units</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Sample Tested</span>
                    <span className="font-bold font-mono text-teal-600 dark:text-teal-400 text-base">{selectedInspection.sampleSize} Units</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Defects Found</span>
                    <span className={`font-bold font-mono text-base ${selectedInspection.defectsFound > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {selectedInspection.defectsFound} Defects
                    </span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Inspector</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">{selectedInspection.inspectorName}</span>
                  </div>
                </div>

                {/* Recorded Parameter Measurements */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>Recorded Dimensional & Physical Measurements</span>
                  </h4>

                  <div className="space-y-3">
                    {selectedInspection.measurements.map((m, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900 dark:text-white">{m.parameter}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${m.isWithinTolerance ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' : 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'}`}>
                            {m.isWithinTolerance ? 'WITHIN TOLERANCE' : 'OUT OF SPEC'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                          <span>Target: <strong className="text-slate-800 dark:text-slate-200">{m.nominal}</strong> (LSL: {m.lsl} / USL: {m.usl})</span>
                          <span>Average: <strong className="font-mono text-teal-600 dark:text-teal-400">{m.average}</strong></span>
                        </div>

                        <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 shrink-0">Sample Points:</span>
                          {m.recordedValues.map((val, vIdx) => (
                            <span
                              key={vIdx}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                val >= m.lsl && val <= m.usl
                                  ? 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                                  : 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                              }`}
                            >
                              #{vIdx + 1}: {val}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Remarks and Disposition */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Inspector Remarks:</span>
                    {selectedInspection.certificateOfAnalysisAttached && (
                      <span className="text-teal-600 dark:text-teal-400 font-mono text-[11px]">CoA Verified: {selectedInspection.coaNumber}</span>
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{selectedInspection.remarks}</p>
                  {selectedInspection.dispositionAction && (
                    <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Disposition: {selectedInspection.dispositionAction}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
                Select an inspection record to view telemetry data.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: LAB & MATERIAL TEST REPORTS */}
      {activeTab === 'LAB_TESTS' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            {materialTests.map(mtr => {
              const isSelected = selectedLabTest?.id === mtr.id;
              return (
                <div
                  key={mtr.id}
                  onClick={() => setSelectedLabTest(mtr)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-teal-500 shadow-xl shadow-teal-500/10'
                      : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
                      {mtr.reportNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      {mtr.verdict}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{mtr.materialGrade}</div>
                  <div className="text-[11px] text-teal-600 dark:text-teal-400 font-mono mt-0.5">Heat: {mtr.heatNumber}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-1">Lab: {mtr.testingLab}</div>
                </div>
              );
            })}
          </div>

          {/* Lab Test Analysis Matrix */}
          {selectedLabTest ? (
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2.5 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                      {selectedLabTest.reportNumber}
                    </span>
                    <span className="text-xs font-mono text-slate-600 dark:text-slate-400">Heat: {selectedLabTest.heatNumber}</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">{selectedLabTest.materialGrade}</h3>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Test Standard: {selectedLabTest.testStandard} • Origin: {selectedLabTest.sampleOrigin}</div>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    {selectedLabTest.verdict}
                  </span>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-1">{selectedLabTest.testDate}</div>
                </div>
              </div>

              {/* Mechanical Test Properties */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>Mechanical Tensile & Hardness Test Results</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Tensile Strength (Rm)</span>
                    <span className="font-black font-mono text-slate-900 dark:text-white text-base">{selectedLabTest.tensileStrengthMpa} MPa</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Yield Strength (Rp0.2)</span>
                    <span className="font-black font-mono text-teal-600 dark:text-teal-400 text-base">{selectedLabTest.yieldStrengthMpa} MPa</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Elongation (A5)</span>
                    <span className="font-black font-mono text-emerald-600 dark:text-emerald-400 text-base">{selectedLabTest.elongationPct}%</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Rockwell Hardness</span>
                    <span className="font-black font-mono text-amber-700 dark:text-amber-400 text-base">{selectedLabTest.hardnessHrc} HRC</span>
                  </div>
                </div>
              </div>

              {/* Chemical Assay Spectrometry */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>Chemical Composition Assay (Optical Emission Spectrometry)</span>
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950">
                        <th className="py-2.5 px-3">Element</th>
                        <th className="py-2.5 px-3">Observed %</th>
                        <th className="py-2.5 px-3">Min Limit %</th>
                        <th className="py-2.5 px-3">Max Limit %</th>
                        <th className="py-2.5 px-3">Verdict</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 font-mono">
                      {selectedLabTest.chemicalComposition.map((elem, idx) => (
                        <tr key={idx} className="hover:bg-slate-100/70 dark:hover:bg-slate-800/30">
                          <td className="py-2 px-3 font-sans font-bold text-slate-900 dark:text-white">{elem.element}</td>
                          <td className="py-2 px-3 text-teal-600 dark:text-teal-400 font-bold">{elem.observedPct}%</td>
                          <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{elem.minLimitPct}%</td>
                          <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{elem.maxLimitPct}%</td>
                          <td className="py-2 px-3 font-sans">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                              PASS
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">Certified by Chief Metallurgist:</span>
                <span className="font-bold text-teal-600 dark:text-teal-400">{selectedLabTest.certifiedBy}</span>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
              Select a lab report to view spectrometry data.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CERTIFICATES PRINT PREVIEW */}
      {activeTab === 'CERT_PRINT' && selectedInspection && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>Certificate of Conformity & Final QA Release</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Official release document for customer delivery and shipping clearance</p>
            </div>

            <button
              onClick={() => notify(`Certificate ${selectedInspection.coaNumber || 'COC-ART-2024'} sent to system printer!`)}
              className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-teal-600/30 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Certificate</span>
            </button>
          </div>

          {/* Certificate Canvas Mock */}
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl p-8 space-y-6 max-w-3xl mx-auto shadow-2xl border-4 border-teal-800/30">
            <div className="flex items-start justify-between border-b-2 border-slate-200 dark:border-slate-900 pb-4">
              <div>
                <div className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-100">ARTIFY GLOBAL ENGINEERING LLC</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Quality Assurance & Product Certification Directorate</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">ISO 9001:2015 & API Q1 Certified Facility • Muscat, Sultanate of Oman</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black font-mono text-teal-900 dark:text-teal-100">CERTIFICATE OF CONFORMITY</div>
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400">Doc No: {selectedInspection.coaNumber || 'COC-2024-00891'}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Date: {selectedInspection.inspectionDate}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">Product / Component Description:</span>
                <span className="font-black text-slate-900 dark:text-slate-100 text-sm">{selectedInspection.itemName}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">Item Code & Lot Batch:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{selectedInspection.itemCode} (Lot: {selectedInspection.lotNumber})</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">Customer / Job Order Reference:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{selectedInspection.grnOrJobOrderRef}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">Batch Quantity Released:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{selectedInspection.batchSize} Units (100% Certified)</span>
              </div>
            </div>

            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-600 text-xs space-y-2">
              <div className="font-bold text-slate-900 dark:text-slate-100">Quality Certification Statement:</div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                This is to certify that the materials and products referenced above have been manufactured, inspected, and tested in accordance with applicable engineering specifications, contractual drawings, and statutory quality standards. All recorded parameters conform strictly to approved tolerances.
              </p>
            </div>

            <div className="flex justify-between items-end pt-8 border-t border-slate-300 dark:border-slate-600 text-xs">
              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">{selectedInspection.inspectorName}</div>
                <div className="text-slate-500 dark:text-slate-400">Authorized QA/QC Lead Inspector</div>
                <div className="text-[11px] text-teal-700 dark:text-teal-300 font-mono">Digital Signature Hash: #8F90A-VERIFIED</div>
              </div>

              <div className="text-right">
                <div className="w-20 h-20 border-2 border-dashed border-teal-200 dark:border-teal-800 rounded-full flex items-center justify-center text-teal-900 dark:text-teal-100 font-black text-[10px] uppercase text-center p-1">
                  QA PASSED STAMP
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: LOG INSPECTION */}
      {showAddInspModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>Log Quality Inspection Record</span>
              </h3>
              <button onClick={() => setShowAddInspModal(false)} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInspection} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Inspection Type *</label>
                  <select
                    value={inspForm.type}
                    onChange={e => setInspForm({ ...inspForm, type: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:border-teal-500"
                  >
                    <option value="INCOMING">Incoming (Receiving QC)</option>
                    <option value="IN_PROCESS">In-Process (Line QC)</option>
                    <option value="FINAL">Final (Pre-Dispatch PSI)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Lot / Batch Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. LOT-2024-998"
                    value={inspForm.lotNumber}
                    onChange={e => setInspForm({ ...inspForm, lotNumber: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Item Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RM-STL-316L"
                    value={inspForm.itemCode}
                    onChange={e => setInspForm({ ...inspForm, itemCode: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Item Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Stainless Steel 316L Plates"
                    value={inspForm.itemName}
                    onChange={e => setInspForm({ ...inspForm, itemName: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Batch Size</label>
                  <input
                    type="number"
                    value={inspForm.batchSize}
                    onChange={e => setInspForm({ ...inspForm, batchSize: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Sample Size</label>
                  <input
                    type="number"
                    value={inspForm.sampleSize}
                    onChange={e => setInspForm({ ...inspForm, sampleSize: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Verdict Status</label>
                  <select
                    value={inspForm.status}
                    onChange={e => setInspForm({ ...inspForm, status: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  >
                    <option value="PASSED">Passed</option>
                    <option value="CONDITIONALLY_PASSED">Conditionally Passed</option>
                    <option value="REJECTED">Rejected (Issue NCR)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1">Inspector Remarks & Findings</label>
                <textarea
                  rows={2}
                  value={inspForm.remarks}
                  onChange={e => setInspForm({ ...inspForm, remarks: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddInspModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold shadow-lg shadow-teal-600/30 cursor-pointer"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
