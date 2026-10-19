// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 13: ASSET MANAGEMENT
// Main Entry Module Runner
// ==========================================

import React, { useState } from 'react';
import { AssetProvider, useAssetStore } from './services/assetStore';
import { AssetMasterView } from './components/master/AssetMasterView';
import { AssetAcquisitionView } from './components/acquisition/AssetAcquisitionView';
import { AssetTransferView } from './components/transfer/AssetTransferView';
import { AssetValuationView } from './components/valuation/AssetValuationView';
import { AssetMaintenanceView } from './components/maintenance/AssetMaintenanceView';
import { AssetDisposalView } from './components/disposal/AssetDisposalView';
import { AssetAIAssistantModal } from './components/ai/AssetAIAssistantModal';
import {
  Building2,
  BookOpen,
  PlusCircle,
  Repeat,
  Scale,
  Wrench,
  Trash2,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  DollarSign,
  PieChart,
  HardHat
} from 'lucide-react';

const AssetDashboardContent: React.FC<{ activeSection?: string }> = ({ activeSection = '13.01' }) => {
  const { assets, cwipProjects, workOrders, currency } = useAssetStore();
  const [selectedSection, setSelectedSection] = useState<string>(activeSection);
  const [showAiModal, setShowAiModal] = useState(false);

  // High level metrics
  const totalCostBasis = assets.reduce((acc, a) => acc + (a.originalCost + a.additionalCosts), 0);
  const totalAccumDepreciation = assets.reduce((acc, a) => acc + a.accumulatedDepreciation, 0);
  const totalNetBookValue = assets.reduce((acc, a) => acc + a.netBookValue, 0);
  const totalCwipValue = cwipProjects.reduce((acc, p) => acc + (p.status !== 'CAPITALIZED' ? p.totalCwipCost : 0), 0);
  const activeWorkOrdersCount = workOrders.filter(w => w.status !== 'COMPLETED').length;

  const sections = [
    {
      id: '13.01',
      title: 'Fixed Asset Master',
      subtitle: 'Register & Classes',
      icon: BookOpen,
      count: `${assets.length} Assets`
    },
    {
      id: '13.02',
      title: 'Acquisition & CWIP',
      subtitle: 'Capitalization & Projects',
      icon: PlusCircle,
      count: `${cwipProjects.length} Projects`
    },
    {
      id: '13.03',
      title: 'Transfer & Custody',
      subtitle: 'Issuance & Relocation',
      icon: Repeat,
      count: 'Gate Passes'
    },
    {
      id: '13.04',
      title: 'Valuation & Depr',
      subtitle: 'IAS 16 / IAS 36 Testing',
      icon: Scale,
      count: 'Depr Engine'
    },
    {
      id: '13.05',
      title: 'Asset Maintenance',
      subtitle: 'PM & Work Orders',
      icon: Wrench,
      count: `${activeWorkOrdersCount} Active WOs`
    },
    {
      id: '13.06',
      title: 'Disposal & Audits',
      subtitle: 'Sales & Physical Count',
      icon: Trash2,
      count: 'RFID & Policies'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 lg:p-8 space-y-8">
      {/* Top Banner with Key Financial Metrics */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-slate-50 dark:from-slate-900 via-slate-50 dark:via-slate-900 to-amber-50 dark:to-amber-950/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 rounded-2xl">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest bg-amber-50 dark:bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                  MODULE 13
                </span>
                <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Fixed Asset Management</h1>
              </div>
              <p className="text-xs lg:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Enterprise capital asset lifecycle, CWIP project tracking, IFRS/IAS 16 depreciation, maintenance work orders & RFID physical verification.
              </p>
            </div>
          </div>
        </div>

        {/* AI Copilot Button */}
        <div className="flex items-center gap-4 relative z-10">
          <button
            onClick={() => setShowAiModal(true)}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-100 dark:from-amber-600 via-amber-100 dark:via-amber-700 to-amber-100 dark:to-amber-800 hover:from-amber-500 hover:to-amber-600 text-slate-900 dark:text-white font-black text-xs lg:text-sm rounded-2xl shadow-xl shadow-amber-600/30 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Asset AI Copilot</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Asset Cost */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Gross Asset Cost Basis</span>
            <DollarSign className="w-4 h-4 text-amber-700 dark:text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
            {currency} {totalCostBasis.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Across <span className="text-slate-700 dark:text-slate-300 font-bold">{assets.length}</span> registered fixed assets
          </div>
        </div>

        {/* Accumulated Depreciation */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Accumulated Depreciation</span>
            <TrendingUp className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">
            ({currency} {totalAccumDepreciation.toLocaleString()})
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Depreciation Ratio: <span className="text-rose-600 dark:text-rose-400 font-bold">{Math.round((totalAccumDepreciation / totalCostBasis) * 100)}%</span>
          </div>
        </div>

        {/* Net Book Value (NBV) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Net Book Value (Carrying)</span>
            <PieChart className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {currency} {totalNetBookValue.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Balance Sheet Carrying Value (IAS 16)
          </div>
        </div>

        {/* Capital Work In Progress */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Active CWIP Projects</span>
            <HardHat className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div className="text-2xl font-black font-mono text-cyan-600 dark:text-cyan-400">
            {currency} {totalCwipValue.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            <span className="text-cyan-700 dark:text-cyan-300 font-bold">{cwipProjects.filter(p => p.status !== 'CAPITALIZED').length}</span> construction projects in progress
          </div>
        </div>
      </div>

      {/* Navigation Tabs for 13.01 - 13.06 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {sections.map(sec => {
          const Icon = sec.icon;
          const isActive = selectedSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setSelectedSection(sec.id)}
              className={`flex flex-col text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-600/15 border-amber-500 text-slate-900 dark:text-white shadow-xl shadow-amber-600/10'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {sec.id}
                </span>
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-700 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'}`} />
              </div>
              <div className="font-extrabold text-xs text-slate-900 dark:text-white line-clamp-1">{sec.title}</div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1 mt-0.5">{sec.subtitle}</div>
              <div className="text-[10px] font-mono font-semibold text-amber-700/80 dark:text-amber-400/80 mt-2">{sec.count}</div>
            </button>
          );
        })}
      </div>

      {/* Render Selected View */}
      <div className="transition-all duration-300">
        {selectedSection === '13.01' && <AssetMasterView />}
        {selectedSection === '13.02' && <AssetAcquisitionView />}
        {selectedSection === '13.03' && <AssetTransferView />}
        {selectedSection === '13.04' && <AssetValuationView />}
        {selectedSection === '13.05' && <AssetMaintenanceView />}
        {selectedSection === '13.06' && <AssetDisposalView />}
      </div>

      {/* AI Copilot Modal */}
      <AssetAIAssistantModal isOpen={showAiModal} onClose={() => setShowAiModal(false)} />
    </div>
  );
};

interface AssetModuleRunnerProps {
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

export const AssetModuleRunner: React.FC<AssetModuleRunnerProps> = ({
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
  let initialSection = activeSection || '13.01';
  if (functionalArea?.code) {
    if (functionalArea.code.startsWith('13.01')) initialSection = '13.01';
    else if (functionalArea.code.startsWith('13.02')) initialSection = '13.02';
    else if (functionalArea.code.startsWith('13.03')) initialSection = '13.03';
    else if (functionalArea.code.startsWith('13.04')) initialSection = '13.04';
    else if (functionalArea.code.startsWith('13.05')) initialSection = '13.05';
    else if (functionalArea.code.startsWith('13.06')) initialSection = '13.06';
  }

  return (
    <AssetProvider>
      <AssetDashboardContent activeSection={initialSection} />
    </AssetProvider>
  );
};

export default AssetModuleRunner;
