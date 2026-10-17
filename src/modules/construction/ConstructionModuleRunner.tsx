// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 15: CONSTRUCTION & CONTRACT MANAGEMENT
// Main Entry Module Runner
// ==========================================

import React, { useState } from 'react';
import { ConstructionProvider, useConstructionStore } from './services/constructionStore';
import { ContractManagementView } from './components/contracts/ContractManagementView';
import { BOQManagementView } from './components/boq/BOQManagementView';
import { SiteWorkManagementView } from './components/site/SiteWorkManagementView';
import { ProgressBillingView } from './components/progress/ProgressBillingView';
import { ContractFinancialView } from './components/finance/ContractFinancialView';
import { BondsGuaranteesView } from './components/bonds/BondsGuaranteesView';
import { VariationsClaimsView } from './components/variations/VariationsClaimsView';
import { ContractCloseoutView } from './components/closeout/ContractCloseoutView';
import { ConstructionAICopilotModal } from './components/ai/ConstructionAICopilotModal';
import {
  HardHat,
  FileText,
  List,
  MapPin,
  Receipt,
  DollarSign,
  ShieldCheck,
  GitPullRequest,
  CheckCircle,
  Sparkles,
  Building,
  Activity,
  Layers,
  ChevronRight,
  Filter
} from 'lucide-react';

const ConstructionDashboardContent: React.FC<{ activeSection?: string }> = ({ activeSection = '15.01' }) => {
  const {
    contracts,
    sites,
    ipcs,
    bonds,
    variations,
    claims,
    selectedContractId,
    setSelectedContractId,
    currency,
    kpis
  } = useConstructionStore();

  const [selectedSection, setSelectedSection] = useState<string>(activeSection);
  const [showAiModal, setShowAiModal] = useState(false);

  const sections = [
    {
      id: '15.01',
      title: 'Contract Management',
      subtitle: 'Prime & Subcontracts',
      icon: FileText,
      count: `${contracts.length} Prime Contracts`
    },
    {
      id: '15.02',
      title: 'BOQ Management',
      subtitle: 'Rate Analysis & Qty Takeoff',
      icon: List,
      count: 'Multi-Division BOQ'
    },
    {
      id: '15.03',
      title: 'Site & Work Mgmt',
      subtitle: 'Daily Site Diary (DSR) & WOs',
      icon: MapPin,
      count: `${sites.length} Active Sites`
    },
    {
      id: '15.04',
      title: 'Progress & Billing',
      subtitle: 'Interim Certificates (IPC)',
      icon: Receipt,
      count: `${ipcs.length} Certified IPCs`
    },
    {
      id: '15.05',
      title: 'Financial Management',
      subtitle: 'Retention, EVM & Costing',
      icon: DollarSign,
      count: 'CPI 1.06 • EVM Active'
    },
    {
      id: '15.06',
      title: 'Bonds & Guarantees',
      subtitle: 'Performance & APG Bonds',
      icon: ShieldCheck,
      count: `${bonds.length} Active Guarantees`
    },
    {
      id: '15.07',
      title: 'Variations & Claims',
      subtitle: 'VOs, FIDIC Claims & EOT',
      icon: GitPullRequest,
      count: `${variations.length} VOs • ${claims.length} Claims`
    },
    {
      id: '15.08',
      title: 'Contract Closeout',
      subtitle: 'Final Account & DLP',
      icon: CheckCircle,
      count: 'TOC & 2-Stage Release'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Global KPI Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-orange-950/40 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-orange-600/20 text-orange-400 rounded-2xl border border-orange-500/30">
                <HardHat className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-orange-400 font-mono">
                    MODULE 15 • CONSTRUCTION & CONTRACT MANAGEMENT
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-950 text-orange-400 border border-orange-800">
                    FIDIC Red / Yellow / Silver
                  </span>
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight">Construction Lifecycle & FIDIC Contracts</h1>
              </div>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              EPC project contract administration: hierarchical BOQ takeoff, digital daily site diaries (DSR), surveyor Interim Payment Certificates (IPC), retention escrow accounting, and FIDIC dispute resolution.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Contract Selector */}
            <select
              value={selectedContractId}
              onChange={e => setSelectedContractId(e.target.value)}
              className="bg-slate-800 text-slate-100 border border-slate-700 text-xs rounded-xl px-3.5 py-2.5 font-medium focus:ring-2 focus:ring-orange-500"
            >
              {contracts.map(c => (
                <option key={c.id} value={c.id}>
                  {c.contractNumber} — {c.projectName}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowAiModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold rounded-2xl shadow-xl shadow-orange-600/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Construction AI Copilot</span>
            </button>
          </div>
        </div>

        {/* Global Summary KPI Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Total Active Portfolio Value</span>
            <div className="text-xl font-black font-mono text-white">
              {currency} {((kpis?.totalPortfolioContractValue || 0) / 1000000).toFixed(1)}M
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Certified Work Executed</span>
            <div className="text-xl font-black font-mono text-emerald-400">
              {currency} {((kpis?.totalCertifiedWipThisMonth || 0) / 1000000).toFixed(1)}M
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Retention Withheld in Escrow</span>
            <div className="text-xl font-black font-mono text-amber-400">
              {currency} {((kpis?.cumulativeRetentionHeldInPortfolio || 0) / 1000000).toFixed(2)}M
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Active Performance Bonds</span>
            <div className="text-xl font-black font-mono text-indigo-400">
              {currency} {((kpis?.activeBondsExposureValue || 0) / 1000000).toFixed(2)}M
            </div>
          </div>
        </div>
      </div>

      {/* Module Sub-Section Navigation Grid (8 Functional Areas) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {sections.map(sec => {
          const isSelected = selectedSection === sec.id;
          const Icon = sec.icon;
          return (
            <button
              key={sec.id}
              onClick={() => setSelectedSection(sec.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-white dark:bg-slate-900 border-orange-500 shadow-xl shadow-orange-500/10 ring-1 ring-orange-500'
                  : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`p-2 rounded-xl border ${
                    isSelected
                      ? 'bg-orange-600/20 border-orange-500 text-orange-700 dark:text-orange-400'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">{sec.id}</span>
              </div>

              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{sec.title}</div>
                <div className="text-[10px] text-slate-600 dark:text-slate-400 truncate">{sec.subtitle}</div>
                <div className="text-[10px] font-mono text-orange-700 dark:text-orange-400 font-medium pt-1 truncate">{sec.count}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Render Active Functional Area */}
      <div className="transition-opacity duration-200">
        {selectedSection === '15.01' && <ContractManagementView />}
        {selectedSection === '15.02' && <BOQManagementView />}
        {selectedSection === '15.03' && <SiteWorkManagementView />}
        {selectedSection === '15.04' && <ProgressBillingView />}
        {selectedSection === '15.05' && <ContractFinancialView />}
        {selectedSection === '15.06' && <BondsGuaranteesView />}
        {selectedSection === '15.07' && <VariationsClaimsView />}
        {selectedSection === '15.08' && <ContractCloseoutView />}
      </div>

      {/* Construction AI Copilot Modal */}
      <ConstructionAICopilotModal isOpen={showAiModal} onClose={() => setShowAiModal(false)} />
    </div>
  );
};

interface ConstructionModuleRunnerProps {
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

export const ConstructionModuleRunner: React.FC<ConstructionModuleRunnerProps> = ({
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
  let initialSection = activeSection || '15.01';
  if (functionalArea?.code) {
    if (functionalArea.code.startsWith('15.01')) initialSection = '15.01';
    else if (functionalArea.code.startsWith('15.02')) initialSection = '15.02';
    else if (functionalArea.code.startsWith('15.03')) initialSection = '15.03';
    else if (functionalArea.code.startsWith('15.04')) initialSection = '15.04';
    else if (functionalArea.code.startsWith('15.05')) initialSection = '15.05';
    else if (functionalArea.code.startsWith('15.06')) initialSection = '15.06';
    else if (functionalArea.code.startsWith('15.07')) initialSection = '15.07';
    else if (functionalArea.code.startsWith('15.08')) initialSection = '15.08';
  } else if (process?.code) {
    if (process.code.startsWith('15.01')) initialSection = '15.01';
    else if (process.code.startsWith('15.02')) initialSection = '15.02';
    else if (process.code.startsWith('15.03')) initialSection = '15.03';
    else if (process.code.startsWith('15.04')) initialSection = '15.04';
    else if (process.code.startsWith('15.05')) initialSection = '15.05';
    else if (process.code.startsWith('15.06')) initialSection = '15.06';
    else if (process.code.startsWith('15.07')) initialSection = '15.07';
    else if (process.code.startsWith('15.08')) initialSection = '15.08';
  }

  return (
    <ConstructionProvider>
      <ConstructionDashboardContent activeSection={initialSection} />
    </ConstructionProvider>
  );
};

export default ConstructionModuleRunner;
