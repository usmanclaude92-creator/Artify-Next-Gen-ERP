// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 12: SUPPLY CHAIN MANAGEMENT (SCM)
// Main Module Runner & View Router
// ==========================================

import React, { useState } from 'react';
import {
  ERPModule,
  ERPFunctionalArea,
  ERPProcess,
  ERPTransaction,
  ERPRouteState,
  ERPUserRole
} from '../../types/erp';
import { ScmProvider, useScmStore } from './services/scmStore';
import { DemandPlanningView } from './components/demand/DemandPlanningView';
import { SupplyPlanningView } from './components/supply/SupplyPlanningView';
import { MaterialPlanningView } from './components/material/MaterialPlanningView';
import { LogisticsManagementView } from './components/logistics/LogisticsManagementView';
import { ImportExportView } from './components/impex/ImportExportView';
import { DistributionView } from './components/distribution/DistributionView';
import { ScmAIAssistantModal } from './components/ai/ScmAIAssistantModal';
import {
  ArrowLeft,
  Star,
  TrendingUp,
  Sliders,
  Layers,
  Ship,
  Globe,
  Share2,
  Sparkles,
  Truck,
  Activity
} from 'lucide-react';

interface ScmModuleRunnerProps {
  module: ERPModule;
  functionalArea?: ERPFunctionalArea;
  process?: ERPProcess;
  transaction?: ERPTransaction;
  onNavigate: (route: ERPRouteState) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  activeRole: ERPUserRole;
}

const ScmRunnerInner: React.FC<ScmModuleRunnerProps> = ({
  module,
  functionalArea,
  process,
  transaction,
  onNavigate,
  isFavorite,
  onToggleFavorite,
  activeRole
}) => {
  const { kpiMetrics, currency } = useScmStore();
  const [internalTab, setInternalTab] = useState<'12.01' | '12.02' | '12.03' | '12.04' | '12.05' | '12.06'>('12.01');
  const [showAiModal, setShowAiModal] = useState(false);

  // Map route functionalArea code/id to active tab
  const getActiveTab = (): '12.01' | '12.02' | '12.03' | '12.04' | '12.05' | '12.06' => {
    if (functionalArea) {
      if (functionalArea.code === '12.01' || functionalArea.id.includes('demand')) return '12.01';
      if (functionalArea.code === '12.02' || functionalArea.id.includes('supply')) return '12.02';
      if (functionalArea.code === '12.03' || functionalArea.id.includes('material') || functionalArea.id.includes('mrp')) return '12.03';
      if (functionalArea.code === '12.04' || functionalArea.id.includes('logistics') || functionalArea.id.includes('shipment')) return '12.04';
      if (functionalArea.code === '12.05' || functionalArea.id.includes('import') || functionalArea.id.includes('customs') || functionalArea.id.includes('bayan')) return '12.05';
      if (functionalArea.code === '12.06' || functionalArea.id.includes('distribution') || functionalArea.id.includes('warehouse')) return '12.06';
    }
    return internalTab;
  };

  const currentTab = getActiveTab();

  const handleTabClick = (tabCode: '12.01' | '12.02' | '12.03' | '12.04' | '12.05' | '12.06') => {
    setInternalTab(tabCode);
    const targetFa = module.functionalAreas?.find(fa => fa.code === tabCode);
    if (targetFa) {
      onNavigate({
        view: 'functional_area',
        moduleId: module.id,
        functionalAreaId: targetFa.id
      });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Module Level Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate({ view: 'dashboard' })}
              aria-label="Back to dashboard"
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-sky-600/20 border border-sky-500/30 flex items-center justify-center shadow-lg shadow-sky-500/10">
              <Truck className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 tracking-wider">
                  MODULE 12
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">{module.phase}</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
                {module.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Real-time Health summary pills */}
            <div className="hidden sm:flex items-center gap-3 bg-slate-50/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs font-mono">
              <span className="text-slate-500 dark:text-slate-400">OTIF:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{kpiMetrics.onTimeInFullPercent}%</span>
              <span className="text-slate-700 dark:text-slate-300">|</span>
              <span className="text-slate-500 dark:text-slate-400">Inbound FCL:</span>
              <span className="font-bold text-cyan-600 dark:text-cyan-400">{kpiMetrics.inboundContainerCount}</span>
            </div>

            {/* AI Copilot Trigger */}
            <button
              onClick={() => setShowAiModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-600/30 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-sky-800 dark:text-sky-200 animate-pulse" />
              <span>SCM AI Copilot</span>
            </button>

            {/* Favorite button */}
            <button
              onClick={onToggleFavorite}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-800/80 text-amber-700 dark:text-amber-400'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Star className={`w-5 h-5 ${isFavorite ? 'fill-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Functional Area Navigation Bar (12.01 to 12.06) */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
          <button
            onClick={() => handleTabClick('12.01')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              currentTab === '12.01'
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>12.01 Demand Planning</span>
          </button>

          <button
            onClick={() => handleTabClick('12.02')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              currentTab === '12.02'
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>12.02 Supply Planning</span>
          </button>

          <button
            onClick={() => handleTabClick('12.03')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              currentTab === '12.03'
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>12.03 Material Planning</span>
          </button>

          <button
            onClick={() => handleTabClick('12.04')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              currentTab === '12.04'
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Ship className="w-4 h-4" />
            <span>12.04 Logistics Management</span>
          </button>

          <button
            onClick={() => handleTabClick('12.05')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              currentTab === '12.05'
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>12.05 Import & Export</span>
          </button>

          <button
            onClick={() => handleTabClick('12.06')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              currentTab === '12.06'
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>12.06 Distribution & Analytics</span>
          </button>
        </div>
      </div>

      {/* View Switcher based on Active Functional Area */}
      {currentTab === '12.01' && <DemandPlanningView />}
      {currentTab === '12.02' && <SupplyPlanningView />}
      {currentTab === '12.03' && <MaterialPlanningView />}
      {currentTab === '12.04' && <LogisticsManagementView />}
      {currentTab === '12.05' && <ImportExportView />}
      {currentTab === '12.06' && <DistributionView />}

      {/* AI Assistant Modal */}
      <ScmAIAssistantModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
      />
    </div>
  );
};

export const ScmModuleRunner: React.FC<ScmModuleRunnerProps> = (props) => {
  return (
    <ScmProvider>
      <ScmRunnerInner {...props} />
    </ScmProvider>
  );
};
