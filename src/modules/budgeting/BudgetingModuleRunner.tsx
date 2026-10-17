// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 11: BUDGETING & FINANCIAL PLANNING
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
import { BudgetProvider, useBudgetStore } from './services/budgetStore';
import { BudgetStructureView } from './components/structure/BudgetStructureView';
import { OperatingBudgetView } from './components/operating/OperatingBudgetView';
import { CapitalCashBudgetView } from './components/capital/CapitalCashBudgetView';
import { BudgetControlView } from './components/control/BudgetControlView';
import { ForecastingAnalysisView } from './components/forecasting/ForecastingAnalysisView';
import { BudgetAIAssistantModal } from './components/ai/BudgetAIAssistantModal';
import {
  ArrowLeft,
  Star,
  Layers,
  Calculator,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  PieChart,
  CheckCircle2,
  Lock,
  ChevronDown
} from 'lucide-react';

interface BudgetingModuleRunnerProps {
  module: ERPModule;
  functionalArea?: ERPFunctionalArea;
  process?: ERPProcess;
  transaction?: ERPTransaction;
  onNavigate: (route: ERPRouteState) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  activeRole: ERPUserRole;
}

const BudgetingRunnerInner: React.FC<BudgetingModuleRunnerProps> = ({
  module,
  functionalArea,
  process,
  transaction,
  onNavigate,
  isFavorite,
  onToggleFavorite,
  activeRole
}) => {
  const { budgets, selectedBudget, selectBudget, currency } = useBudgetStore();
  const [internalTab, setInternalTab] = useState<'11.01' | '11.02' | '11.03' | '11.04' | '11.05'>('11.01');
  const [showAiModal, setShowAiModal] = useState(false);

  // Map route functionalArea to tab
  const getActiveTab = (): '11.01' | '11.02' | '11.03' | '11.04' | '11.05' => {
    if (functionalArea) {
      if (functionalArea.code === '11.01' || functionalArea.id.includes('structure')) return '11.01';
      if (functionalArea.code === '11.02' || functionalArea.id.includes('operating')) return '11.02';
      if (functionalArea.code === '11.03' || functionalArea.id.includes('capital') || functionalArea.id.includes('cash')) return '11.03';
      if (functionalArea.code === '11.04' || functionalArea.id.includes('control') || functionalArea.id.includes('restriction')) return '11.04';
      if (functionalArea.code === '11.05' || functionalArea.id.includes('forecast') || functionalArea.id.includes('scenario')) return '11.05';
    }
    return internalTab;
  };

  const currentTab = getActiveTab();

  const handleTabClick = (tabCode: '11.01' | '11.02' | '11.03' | '11.04' | '11.05') => {
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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate({ view: 'dashboard' })}
              aria-label="Back to dashboard"
              className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <PieChart className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-950 text-emerald-400 border border-emerald-800 tracking-wider">
                  MODULE 11
                </span>
                <span className="text-xs text-slate-400 font-medium">{module.phase}</span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight mt-0.5">
                {module.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Active Budget Selector dropdown */}
            <div className="relative">
              <select
                value={selectedBudget.id}
                onChange={(e) => selectBudget(e.target.value)}
                aria-label="Select active enterprise budget"
                className="appearance-none bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 pr-9 text-xs font-bold text-white focus:outline-none focus:border-emerald-500 cursor-pointer shadow-lg"
              >
                {budgets.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.budgetCode} — {b.budgetName} ({b.status})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-slate-400 pointer-events-none" />
            </div>

            {/* AI Copilot Trigger */}
            <button
              onClick={() => setShowAiModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-200 animate-pulse" />
              <span>FP&A AI Copilot</span>
            </button>

            {/* Favorite button */}
            <button
              onClick={onToggleFavorite}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                isFavorite
                  ? 'bg-amber-950/60 border-amber-800 text-amber-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <Star className={`w-5 h-5 ${isFavorite ? 'fill-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Executive KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800">
          {module.kpiPlaceholders?.map((kpi, idx) => (
            <div key={idx} className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                {kpi.label}
              </span>
              <p className="text-sm sm:text-base font-black font-mono text-white mt-1">
                {kpi.value}
              </p>
            </div>
          ))}
        </div>

        {/* Functional Area Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800 overflow-x-auto pb-1">
          <button
            onClick={() => handleTabClick('11.01')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              currentTab === '11.01'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>11.01 Budget Structure</span>
          </button>

          <button
            onClick={() => handleTabClick('11.02')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              currentTab === '11.02'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>11.02 Operating Budget (OPEX)</span>
          </button>

          <button
            onClick={() => handleTabClick('11.03')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              currentTab === '11.03'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>11.03 Capital & Cash Budget (CAPEX)</span>
          </button>

          <button
            onClick={() => handleTabClick('11.04')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              currentTab === '11.04'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>11.04 Budget Control & Restrictions</span>
          </button>

          <button
            onClick={() => handleTabClick('11.05')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              currentTab === '11.05'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>11.05 Forecasting & Analysis</span>
          </button>
        </div>
      </div>

      {/* Main View Router */}
      <div className="space-y-6">
        {currentTab === '11.01' && <BudgetStructureView />}
        {currentTab === '11.02' && <OperatingBudgetView />}
        {currentTab === '11.03' && <CapitalCashBudgetView />}
        {currentTab === '11.04' && <BudgetControlView />}
        {currentTab === '11.05' && <ForecastingAnalysisView />}
      </div>

      {/* AI Financial Copilot Modal */}
      <BudgetAIAssistantModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
      />
    </div>
  );
};

export const BudgetingModuleRunner: React.FC<BudgetingModuleRunnerProps> = (props) => {
  return (
    <BudgetProvider>
      <BudgetingRunnerInner {...props} />
    </BudgetProvider>
  );
};

export default BudgetingModuleRunner;
