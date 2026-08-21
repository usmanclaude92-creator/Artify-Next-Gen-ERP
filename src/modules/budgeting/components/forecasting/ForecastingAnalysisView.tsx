// ==========================================
// ARTIFY ERP — MODULE 11: BUDGETING & FINANCIAL PLANNING
// 11.05 — Forecasting & Analysis View (BvA, Rolling Forecast, Scenarios)
// ==========================================

import React, { useState } from 'react';
import { useBudgetStore } from '../../services/budgetStore';
import {
  TrendingUp,
  BarChart3,
  Sliders,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  RefreshCw,
  Layers,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Percent,
  Play,
  RotateCcw
} from 'lucide-react';

export const ForecastingAnalysisView: React.FC = () => {
  const {
    lineItems,
    scenarios,
    activeScenarioId,
    setActiveScenarioId,
    updateScenarioParameters,
    currency
  } = useBudgetStore();

  const activeScenario = scenarios.find(s => s.id === activeScenarioId) || scenarios[0];

  const [activeSubTab, setActiveSubTab] = useState<'bva' | 'forecasting' | 'rolling' | 'variance' | 'scenario'>('bva');

  // Slider State for Active Scenario Planning
  const [revenueDelta, setRevenueDelta] = useState(activeScenario.parameters.revenueGrowthPercent);
  const [cogsInflation, setCogsInflation] = useState(activeScenario.parameters.cogsInflationPercent);
  const [opexAdjustment, setOpexAdjustment] = useState(activeScenario.parameters.opexAdjustmentPercent);
  const [capexFactor, setCapexFactor] = useState(activeScenario.parameters.capexSpendingFactor);
  const [interestShiftBps, setInterestShiftBps] = useState(activeScenario.parameters.interestRateShiftBps);
  const [fxDelta, setFxDelta] = useState(activeScenario.parameters.fxExchangeRateImpactPercent);

  // Sync sliders when scenario changes
  const handleSelectScenario = (id: string) => {
    setActiveScenarioId(id);
    const sc = scenarios.find(s => s.id === id);
    if (sc) {
      setRevenueDelta(sc.parameters.revenueGrowthPercent);
      setCogsInflation(sc.parameters.cogsInflationPercent);
      setOpexAdjustment(sc.parameters.opexAdjustmentPercent);
      setCapexFactor(sc.parameters.capexSpendingFactor);
      setInterestShiftBps(sc.parameters.interestRateShiftBps);
      setFxDelta(sc.parameters.fxExchangeRateImpactPercent);
    }
  };

  const handleApplySliders = () => {
    updateScenarioParameters(activeScenario.id, {
      revenueGrowthPercent: revenueDelta,
      cogsInflationPercent: cogsInflation,
      opexAdjustmentPercent: opexAdjustment,
      capexSpendingFactor: capexFactor,
      interestRateShiftBps: interestShiftBps,
      fxExchangeRateImpactPercent: fxDelta
    });
  };

  const totalBudget = lineItems.reduce((sum, l) => sum + l.annualBudget, 0);
  const totalCommitted = lineItems.reduce((sum, l) => sum + l.committedAmount, 0);
  const totalActual = lineItems.reduce((sum, l) => sum + l.actualSpent, 0);
  const totalVariance = totalBudget - (totalCommitted + totalActual);
  const variancePct = Math.round((totalVariance / (totalBudget || 1)) * 100);

  return (
    <div className="space-y-6">
      {/* Header & Sub-Nav */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                11.05 FORECASTING & ANALYSIS
              </span>
              <span className="text-xs text-slate-400">Budget vs Actuals, Rolling Forecasts & Stress Testing</span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight mt-1">
              Financial Variance Intelligence & Scenario Simulations
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Analyze multi-period variances (Budget vs Actual), maintain dynamic rolling forecasts, and simulate macroeconomic stress tests.
            </p>
          </div>
        </div>

        {/* Sub Nav Strip */}
        <div className="flex items-center gap-2 mt-6 border-b border-slate-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('bva')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'bva'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>11.05.01 Budget vs Actual (BvA)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('forecasting')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'forecasting'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>11.05.02 Year-End Landing Forecast</span>
          </button>
          <button
            onClick={() => setActiveSubTab('rolling')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'rolling'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>11.05.03 Rolling 4Q Forecast</span>
          </button>
          <button
            onClick={() => setActiveSubTab('scenario')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'scenario'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>11.05.05 Scenario Simulator</span>
          </button>
        </div>
      </div>

      {/* 11.05.01: Budget vs Actual (BvA) */}
      {activeSubTab === 'bva' && (
        <div className="space-y-6">
          {/* Variance KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <span className="text-[10px] uppercase font-bold text-slate-500">Authorized Annual Budget</span>
              <p className="text-xl font-mono font-black text-white mt-1">
                {totalBudget.toLocaleString()} <span className="text-xs font-normal text-slate-400">{currency}</span>
              </p>
              <span className="text-xs text-slate-400 mt-2 block">100% Board Baseline</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <span className="text-[10px] uppercase font-bold text-slate-500">Actual Posted Incurred</span>
              <p className="text-xl font-mono font-black text-emerald-400 mt-1">
                {totalActual.toLocaleString()} <span className="text-xs font-normal text-slate-400">{currency}</span>
              </p>
              <span className="text-xs text-slate-400 mt-2 block">GL postings cleared</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <span className="text-[10px] uppercase font-bold text-slate-500">Committed / Encumbered</span>
              <p className="text-xl font-mono font-black text-amber-400 mt-1">
                {totalCommitted.toLocaleString()} <span className="text-xs font-normal text-slate-400">{currency}</span>
              </p>
              <span className="text-xs text-slate-400 mt-2 block">Open POs & approved contracts</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <span className="text-[10px] uppercase font-bold text-slate-500">Net Favorable Variance</span>
              <p className="text-xl font-mono font-black text-cyan-400 mt-1">
                +{totalVariance.toLocaleString()} <span className="text-xs font-normal text-slate-400">{currency}</span>
              </p>
              <span className="text-xs text-emerald-400 mt-2 block font-semibold">
                +{variancePct}% Headroom Remaining
              </span>
            </div>
          </div>

          {/* BvA Breakdown Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-white mb-4">Line-by-Line Budget vs Actuals Analysis</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 font-sans">
                    <th className="p-3 font-bold">GL Account & Line</th>
                    <th className="p-3 font-bold">Cost Center</th>
                    <th className="p-3 font-bold text-right">Authorized Budget</th>
                    <th className="p-3 font-bold text-right">Actual Incurred</th>
                    <th className="p-3 font-bold text-right">Committed POs</th>
                    <th className="p-3 font-bold text-right">Total Utilization</th>
                    <th className="p-3 font-bold text-right">Variance ($)</th>
                    <th className="p-3 font-bold text-center">Variance (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {lineItems.map(item => {
                    const totalUsed = item.committedAmount + item.actualSpent;
                    const variance = item.annualBudget - totalUsed;
                    const variancePercent = Math.round((variance / item.annualBudget) * 100);
                    const isFavorable = variance >= 0;

                    return (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 font-sans">
                          <span className="font-mono font-bold text-emerald-400">{item.accountCode}</span>
                          <p className="text-white font-bold text-xs mt-0.5">{item.accountName}</p>
                        </td>
                        <td className="p-3 font-sans text-slate-300">
                          <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono text-[10px] font-bold">
                            {item.costCenterCode}
                          </span>
                        </td>
                        <td className="p-3 text-right font-bold text-white">{item.annualBudget.toLocaleString()} {currency}</td>
                        <td className="p-3 text-right text-emerald-400">{item.actualSpent.toLocaleString()} {currency}</td>
                        <td className="p-3 text-right text-amber-400">{item.committedAmount.toLocaleString()} {currency}</td>
                        <td className="p-3 text-right font-bold text-slate-200">{totalUsed.toLocaleString()} {currency}</td>
                        <td className={`p-3 text-right font-bold ${isFavorable ? 'text-cyan-400' : 'text-rose-400'}`}>
                          {isFavorable ? '+' : ''}{variance.toLocaleString()} {currency}
                        </td>
                        <td className="p-3 text-center font-sans">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            isFavorable
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}>
                            {isFavorable ? `+${variancePercent}% Fav` : `${variancePercent}% Unfav`}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 11.05.02: Year-End Landing Forecast */}
      {activeSubTab === 'forecasting' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-white">Full-Year Projected Landing Model (Actuals + Run Rate)</h3>
            <p className="text-xs text-slate-400 mt-1">Combines Q1/Q2 posted actuals, open commitments, and linear weighted run-rate through Q4.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Projected Net Revenue Landing</span>
                <p className="text-2xl font-mono font-black text-emerald-400 mt-1">29,850,000 {currency}</p>
                <p className="text-xs text-emerald-400 mt-2 font-semibold">+6.6% over Budget Target (28.0M)</p>
              </div>

              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Projected Operating Expenses</span>
                <p className="text-2xl font-mono font-black text-amber-400 mt-1">11,280,000 {currency}</p>
                <p className="text-xs text-slate-400 mt-2">Within 1.8% of allocated envelope</p>
              </div>

              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Projected EBITDA Margin</span>
                <p className="text-2xl font-mono font-black text-purple-400 mt-1">22.4% (6,680,000 {currency})</p>
                <p className="text-xs text-purple-400 mt-2 font-semibold">Exceeds corporate hurdle by +140 bps</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 11.05.03: Rolling 4Q Forecast */}
      {activeSubTab === 'rolling' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-white">Rolling 4-Quarter Forward Financial Horizon</h3>
            <p className="text-xs text-slate-400 mt-1">Continuous rolling outlook dynamically updating with each fiscal quarter close.</p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 font-sans">
                    <th className="p-3 font-bold">Metric / Financial Line</th>
                    <th className="p-3 font-bold text-right">Q3-2026 (Forecast)</th>
                    <th className="p-3 font-bold text-right">Q4-2026 (Forecast)</th>
                    <th className="p-3 font-bold text-right">Q1-2027 (Rolling)</th>
                    <th className="p-3 font-bold text-right">Q2-2027 (Rolling)</th>
                    <th className="p-3 font-bold text-right">Rolling 4Q Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr className="hover:bg-slate-800/40">
                    <td className="p-3 font-sans font-bold text-white">Commercial Revenue</td>
                    <td className="p-3 text-right text-emerald-400">7,200,000 {currency}</td>
                    <td className="p-3 text-right text-emerald-400">7,650,000 {currency}</td>
                    <td className="p-3 text-right text-emerald-400">8,100,000 {currency}</td>
                    <td className="p-3 text-right text-emerald-400">8,400,000 {currency}</td>
                    <td className="p-3 text-right font-bold text-white">31,350,000 {currency}</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="p-3 font-sans font-bold text-white">Direct Production Cost (COGS)</td>
                    <td className="p-3 text-right text-rose-400">(4,100,000) {currency}</td>
                    <td className="p-3 text-right text-rose-400">(4,300,000) {currency}</td>
                    <td className="p-3 text-right text-rose-400">(4,500,000) {currency}</td>
                    <td className="p-3 text-right text-rose-400">(4,650,000) {currency}</td>
                    <td className="p-3 text-right font-bold text-rose-400">(17,550,000) {currency}</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="p-3 font-sans font-bold text-white">Gross Profit</td>
                    <td className="p-3 text-right font-bold text-cyan-400">3,100,000 {currency}</td>
                    <td className="p-3 text-right font-bold text-cyan-400">3,350,000 {currency}</td>
                    <td className="p-3 text-right font-bold text-cyan-400">3,600,000 {currency}</td>
                    <td className="p-3 text-right font-bold text-cyan-400">3,750,000 {currency}</td>
                    <td className="p-3 text-right font-black text-cyan-400">13,800,000 {currency}</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="p-3 font-sans font-bold text-white">Operating Expenses (OPEX)</td>
                    <td className="p-3 text-right text-amber-400">(1,450,000) {currency}</td>
                    <td className="p-3 text-right text-amber-400">(1,500,000) {currency}</td>
                    <td className="p-3 text-right text-amber-400">(1,550,000) {currency}</td>
                    <td className="p-3 text-right text-amber-400">(1,600,000) {currency}</td>
                    <td className="p-3 text-right font-bold text-amber-400">(6,100,000) {currency}</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40 bg-slate-950/60 font-bold">
                    <td className="p-3 font-sans text-purple-400">Operating EBITDA</td>
                    <td className="p-3 text-right text-purple-400">1,650,000 {currency}</td>
                    <td className="p-3 text-right text-purple-400">1,850,000 {currency}</td>
                    <td className="p-3 text-right text-purple-400">2,050,000 {currency}</td>
                    <td className="p-3 text-right text-purple-400">2,150,000 {currency}</td>
                    <td className="p-3 text-right font-black text-purple-400">7,700,000 {currency} (24.6%)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 11.05.05: Scenario Planning & Sensitivity Simulator */}
      {activeSubTab === 'scenario' && (
        <div className="space-y-6">
          {/* Scenario Selection Pills */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {scenarios.map(sc => {
              const isSelected = sc.id === activeScenario.id;
              const ebitdaMargin = Math.round((sc.projectedEbitda / (sc.projectedRevenue || 1)) * 100);
              return (
                <div
                  key={sc.id}
                  onClick={() => handleSelectScenario(sc.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xl'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                      {sc.scenarioCode}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      sc.covenantComplianceRisk === 'Low' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      sc.covenantComplianceRisk === 'Moderate' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}>
                      {sc.covenantComplianceRisk} Risk
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mt-3">{sc.scenarioName}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{sc.description}</p>

                  <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-sans font-bold">Revenue</span>
                      <p className="font-bold text-white">{sc.projectedRevenue.toLocaleString()} {currency}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-sans font-bold">EBITDA Margin</span>
                      <p className="font-bold text-purple-400">{ebitdaMargin}%</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Sliders & Live Recalculation Engine */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">Dynamic Sensitivity & Stress Testing Parameters</h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Adjust macro levers to calculate instant impact on Enterprise Revenue, COGS, EBITDA, and Working Capital.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleApplySliders}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-emerald-600/30"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Compute Financial Impact</span>
                </button>
              </div>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {/* Revenue Delta */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between text-xs mb-2">
                  <span className="font-bold text-slate-300">Sales Demand / Revenue Delta</span>
                  <span className={`font-mono font-bold ${revenueDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {revenueDelta >= 0 ? `+${revenueDelta}` : revenueDelta}%
                  </span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  step="1"
                  value={revenueDelta}
                  onChange={(e) => setRevenueDelta(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
                <span className="text-[10px] text-slate-500 block mt-1">Impacts top-line commercial contracts</span>
              </div>

              {/* Raw Material Inflation */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between text-xs mb-2">
                  <span className="font-bold text-slate-300">COGS & Raw Material Inflation</span>
                  <span className="font-mono font-bold text-rose-400">+{cogsInflation}%</span>
                </div>
                <input
                  type="range"
                  min="-10"
                  max="30"
                  step="1"
                  value={cogsInflation}
                  onChange={(e) => setCogsInflation(Number(e.target.value))}
                  className="w-full accent-rose-500"
                />
                <span className="text-[10px] text-slate-500 block mt-1">Directly increases manufacturing cost of goods</span>
              </div>

              {/* OPEX Adjustment */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between text-xs mb-2">
                  <span className="font-bold text-slate-300">OPEX Overhead Adjustment</span>
                  <span className={`font-mono font-bold ${opexAdjustment >= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {opexAdjustment >= 0 ? `+${opexAdjustment}` : opexAdjustment}%
                  </span>
                </div>
                <input
                  type="range"
                  min="-20"
                  max="20"
                  step="1"
                  value={opexAdjustment}
                  onChange={(e) => setOpexAdjustment(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <span className="text-[10px] text-slate-500 block mt-1">G&A, administrative overhead, and logistics</span>
              </div>

              {/* CAPEX Factor */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between text-xs mb-2">
                  <span className="font-bold text-slate-300">CAPEX Execution Factor</span>
                  <span className="font-mono font-bold text-cyan-400">{(capexFactor * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                  value={capexFactor}
                  onChange={(e) => setCapexFactor(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
                <span className="text-[10px] text-slate-500 block mt-1">Capital investment deployment pacing</span>
              </div>

              {/* Interest Rate Shift */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between text-xs mb-2">
                  <span className="font-bold text-slate-300">Benchmark Interest Rate Shift</span>
                  <span className={`font-mono font-bold ${interestShiftBps >= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {interestShiftBps >= 0 ? `+${interestShiftBps}` : interestShiftBps} bps
                  </span>
                </div>
                <input
                  type="range"
                  min="-150"
                  max="300"
                  step="25"
                  value={interestShiftBps}
                  onChange={(e) => setInterestShiftBps(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
                <span className="text-[10px] text-slate-500 block mt-1">Bank borrowing & Sukuk financing service cost</span>
              </div>

              {/* FX Fluctuation */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between text-xs mb-2">
                  <span className="font-bold text-slate-300">FX Rate Impact (USD / EUR)</span>
                  <span className={`font-mono font-bold ${fxDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {fxDelta >= 0 ? `+${fxDelta}` : fxDelta}%
                  </span>
                </div>
                <input
                  type="range"
                  min="-10"
                  max="10"
                  step="0.5"
                  value={fxDelta}
                  onChange={(e) => setFxDelta(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
                <span className="text-[10px] text-slate-500 block mt-1">Impacts imported steel & overseas sales</span>
              </div>
            </div>

            {/* Computed Scenario Results Dashboard */}
            <div className="mt-8 pt-6 border-t border-slate-800">
              <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-4">
                Simulated Financial Outcome for "{activeScenario.scenarioName}"
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Simulated Revenue</span>
                  <p className="text-lg font-mono font-black text-white mt-1">
                    {activeScenario.projectedRevenue.toLocaleString()} {currency}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Simulated Gross Margin</span>
                  <p className="text-lg font-mono font-black text-cyan-400 mt-1">
                    {activeScenario.projectedGrossProfit.toLocaleString()} {currency}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Operating EBITDA</span>
                  <p className="text-lg font-mono font-black text-purple-400 mt-1">
                    {activeScenario.projectedEbitda.toLocaleString()} {currency}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Projected Ending Cash</span>
                  <p className="text-lg font-mono font-black text-emerald-400 mt-1">
                    {activeScenario.projectedEndingCash.toLocaleString()} {currency}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForecastingAnalysisView;
