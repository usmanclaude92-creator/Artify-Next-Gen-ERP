// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 14: QUALITY MANAGEMENT (QMS)
// Main Entry Module Runner
// ==========================================

import React, { useState } from 'react';
import { QualityProvider, useQualityStore } from './services/qualityStore';
import { QualityStandardsView } from './components/standards/QualityStandardsView';
import { QualityPlanningView } from './components/planning/QualityPlanningView';
import { InspectionTestingView } from './components/inspection/InspectionTestingView';
import { NonConformanceView } from './components/ncr/NonConformanceView';
import { CapaManagementView } from './components/capa/CapaManagementView';
import { QualityAuditView } from './components/audit/QualityAuditView';
import { QualityAICopilotModal } from './components/ai/QualityAICopilotModal';
import {
  ShieldCheck,
  BookOpen,
  Calendar,
  CheckSquare,
  AlertTriangle,
  Flame,
  FileSpreadsheet,
  Sparkles,
  Award,
  Activity,
  Percent,
  Layers,
  FlaskConical
} from 'lucide-react';

const QualityDashboardContent: React.FC<{ activeSection?: string }> = ({ activeSection = '14.01' }) => {
  const { standards, inspections, ncrs, capas, audits, kpiMetrics } = useQualityStore();
  const [selectedSection, setSelectedSection] = useState<string>(activeSection);
  const [showAiModal, setShowAiModal] = useState(false);

  const sections = [
    {
      id: '14.01',
      title: 'Standards & Policies',
      subtitle: 'ISO, ASTM & Specs',
      icon: BookOpen,
      count: `${standards.length} Standards`
    },
    {
      id: '14.02',
      title: 'Quality Planning',
      subtitle: 'Control Plans & AQL',
      icon: Calendar,
      count: 'Sampling Engine'
    },
    {
      id: '14.03',
      title: 'Inspection & Testing',
      subtitle: 'Incoming, Patrol & Lab',
      icon: CheckSquare,
      count: `${inspections.length} Inspections`
    },
    {
      id: '14.04',
      title: 'Non-Conformance & MRB',
      subtitle: 'Quarantine & Disposition',
      icon: AlertTriangle,
      count: `${ncrs.filter(n => n.status !== 'CLOSED').length} Open NCRs`
    },
    {
      id: '14.05',
      title: 'CAPA & 8D Analysis',
      subtitle: '5-Whys, Fishbone & FMEA',
      icon: Flame,
      count: `${capas.length} Active 8Ds`
    },
    {
      id: '14.06',
      title: 'Audits & Scorecards',
      subtitle: 'Vendor Quality & KPIs',
      icon: FileSpreadsheet,
      count: `${audits.length} Audits`
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-teal-600/20 text-teal-400 rounded-2xl border border-teal-500/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-teal-400 font-mono">
                    MODULE 14 • TOTAL QUALITY MANAGEMENT (QMS)
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-950 text-teal-400 border border-teal-800">
                    ISO 9001:2015 & API Q1
                  </span>
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight">Quality Assurance & Zero-Defect Control</h1>
              </div>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Closed-loop industrial quality ecosystem: sampling plans, digital inspections, lab spectrometry, MRB disposition quarantine, 8D problem solving, and supplier vendor ratings.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowAiModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold rounded-2xl shadow-xl shadow-teal-600/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Quality AI Copilot</span>
            </button>
          </div>
        </div>

        {/* Global Summary KPI Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">First Pass Yield (FPY)</span>
            <div className="text-xl font-black font-mono text-emerald-400">{kpiMetrics.firstPassYieldPct}%</div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Open Non-Conformances</span>
            <div className="text-xl font-black font-mono text-rose-400">
              {ncrs.filter(n => n.status !== 'CLOSED').length} Lots on Hold
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Active 8D CAPA Cases</span>
            <div className="text-xl font-black font-mono text-amber-400">{capas.length} In-Flight</div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Vendor Quality Index</span>
            <div className="text-xl font-black font-mono text-teal-400">{kpiMetrics.supplierQualityIndexScore}/100</div>
          </div>
        </div>
      </div>

      {/* Module Sub-Section Navigation Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {sections.map(sec => {
          const isSelected = selectedSection === sec.id;
          const Icon = sec.icon;
          return (
            <button
              key={sec.id}
              onClick={() => setSelectedSection(sec.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-teal-500 shadow-xl shadow-teal-500/10 ring-1 ring-teal-500'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`p-2 rounded-xl border ${
                    isSelected
                      ? 'bg-teal-600/20 border-teal-500 text-teal-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500">{sec.id}</span>
              </div>

              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white">{sec.title}</div>
                <div className="text-[10px] text-slate-400 truncate">{sec.subtitle}</div>
                <div className="text-[10px] font-mono text-teal-400 font-medium pt-1">{sec.count}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Render Active Functional Area */}
      <div className="transition-opacity duration-200">
        {selectedSection === '14.01' && <QualityStandardsView />}
        {selectedSection === '14.02' && <QualityPlanningView />}
        {selectedSection === '14.03' && <InspectionTestingView />}
        {selectedSection === '14.04' && <NonConformanceView />}
        {selectedSection === '14.05' && <CapaManagementView />}
        {selectedSection === '14.06' && <QualityAuditView />}
      </div>

      {/* Quality AI Copilot Modal */}
      <QualityAICopilotModal isOpen={showAiModal} onClose={() => setShowAiModal(false)} />
    </div>
  );
};

interface QualityModuleRunnerProps {
  module?: any;
  functionalArea?: any;
  process?: any;
  transaction?: any;
  onNavigate?: (route: any) => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  activeRole?: any;
  activeSection?: string;
}

export const QualityModuleRunner: React.FC<QualityModuleRunnerProps> = ({
  module,
  functionalArea,
  process,
  transaction,
  onNavigate,
  isFavorite,
  onToggleFavorite,
  activeRole,
  activeSection
}) => {
  // Determine initial active section from functional area code if available
  let initialSection = activeSection || '14.01';
  if (functionalArea?.code) {
    if (functionalArea.code.startsWith('14.01')) initialSection = '14.01';
    else if (functionalArea.code.startsWith('14.02')) initialSection = '14.02';
    else if (functionalArea.code.startsWith('14.03')) initialSection = '14.03';
    else if (functionalArea.code.startsWith('14.04')) initialSection = '14.04';
    else if (functionalArea.code.startsWith('14.05')) initialSection = '14.05';
    else if (functionalArea.code.startsWith('14.06')) initialSection = '14.06';
  } else if (process?.code) {
    if (process.code.startsWith('14.01')) initialSection = '14.01';
    else if (process.code.startsWith('14.02')) initialSection = '14.02';
    else if (process.code.startsWith('14.03')) initialSection = '14.03';
    else if (process.code.startsWith('14.04')) initialSection = '14.04';
    else if (process.code.startsWith('14.05')) initialSection = '14.05';
    else if (process.code.startsWith('14.06')) initialSection = '14.06';
  }

  return (
    <QualityProvider>
      <QualityDashboardContent activeSection={initialSection} />
    </QualityProvider>
  );
};

export default QualityModuleRunner;
