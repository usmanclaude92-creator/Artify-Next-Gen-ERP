// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 12: SUPPLY CHAIN MANAGEMENT (SCM)
// 12.01 — Demand Planning View
// ==========================================

import React, { useState } from 'react';
import { useScmStore } from '../../services/scmStore';
import { DemandForecastItem, DemandForecastMethod } from '../../types';
import {
  TrendingUp,
  BarChart3,
  Layers,
  Sparkles,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Calculator,
  RefreshCw,
  FileCheck,
  Building2,
  Calendar,
  Zap,
  Sliders,
  DollarSign
} from 'lucide-react';
import { BrandWatermark } from '@/src/components/common/BrandWatermark';

export const DemandPlanningView: React.FC = () => {
  const {
    demandForecasts,
    demandAnalysis,
    consolidationBatches,
    addDemandForecast,
    updateDemandForecast,
    recalculateStatisticalForecast,
    createConsolidationBatch,
    convertConsolidationToPr,
    currency
  } = useScmStore();

  const [activeSubTab, setActiveSubTab] = useState<'forecasting' | 'analysis' | 'consolidation'>('forecasting');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [showNewForecastModal, setShowNewForecastModal] = useState(false);
  const [showConsolidationModal, setShowConsolidationModal] = useState(false);

  // New Forecast Form
  const [newForecastForm, setNewForecastForm] = useState({
    sku: 'VALVE-CRYO-DN200',
    itemName: 'Cryogenic Butterfly Control Valve DN200',
    category: 'Valves & Flow Control',
    uom: 'Units',
    region: 'Muscat HQ' as DemandForecastItem['region'],
    period: '2026-Q4',
    historicalSalesQty: 320,
    baselineForecastQty: 350,
    seasonalityFactor: 1.10,
    promotionalUpliftQty: 30,
    consensusForecastQty: 415,
    forecastMethod: 'HOLT_WINTERS' as DemandForecastMethod,
    confidenceScore: 92,
    status: 'In Review' as DemandForecastItem['status'],
    updatedBy: 'Lead SCM Forecaster',
    notes: 'Planned for LNG downstream refinery hookup'
  });

  // Consolidation Selection
  const [consolidationPeriod, setConsolidationPeriod] = useState('2026-Q4');
  const [selectedConsolidationRegions, setSelectedConsolidationRegions] = useState<string[]>([
    'Muscat HQ',
    'Sohar Industrial',
    'Salalah Freezone'
  ]);

  const filteredForecasts = demandForecasts.filter(item => {
    const matchSearch =
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRegion = selectedRegion === 'ALL' || item.region === selectedRegion;
    return matchSearch && matchRegion;
  });

  const handleCreateForecast = (e: React.FormEvent) => {
    e.preventDefault();
    addDemandForecast(newForecastForm);
    setShowNewForecastModal(false);
  };

  const handleCreateConsolidation = (e: React.FormEvent) => {
    e.preventDefault();
    createConsolidationBatch(consolidationPeriod, selectedConsolidationRegions);
    setShowConsolidationModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner & Sub-Tabs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden isolate">
<BrandWatermark variant="mark" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 tracking-wider">
                12.01 DEMAND PLANNING
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Consensus & Statistical Modeling</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Enterprise Demand Forecasting & Consolidation Engine
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Multi-horizon statistical smoothing, regional consensus rollups, MAPE bias monitoring, and automatic PO requisition bridges.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeSubTab === 'forecasting' && (
              <button
                onClick={() => setShowNewForecastModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Demand Forecast</span>
              </button>
            )}

            {activeSubTab === 'consolidation' && (
              <button
                onClick={() => setShowConsolidationModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                <span>Consolidate Regional Demands</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub-Tabs Selector */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveSubTab('forecasting')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'forecasting'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Demand Forecasting (12.01.01)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('analysis')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'analysis'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Demand Analysis & ABC-XYZ (12.01.02)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('consolidation')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'consolidation'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Demand Consolidation & PR (12.01.03)</span>
          </button>
        </div>
      </div>

      {/* ----------------- SUB-TAB 1: DEMAND FORECASTING ----------------- */}
      {activeSubTab === 'forecasting' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500 dark:text-slate-400" />
                <input
                  type="text"
                  placeholder="Search SKU, component name, category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="ALL">All Hubs & Regions</option>
                <option value="Muscat HQ">Muscat HQ</option>
                <option value="Sohar Industrial">Sohar Industrial</option>
                <option value="Salalah Freezone">Salalah Freezone</option>
                <option value="Dubai Logistics Hub">Dubai Logistics Hub</option>
              </select>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
              <span className="font-mono font-bold text-slate-900 dark:text-white">{filteredForecasts.length}</span> Active Forecasting Models
            </div>
          </div>

          {/* Forecasting Cards Grid */}
          <div className="grid grid-cols-1 gap-4">
            {filteredForecasts.map((item) => (
              <div
                key={item.id}
                className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-lg"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 mt-1">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded border border-blue-800/50">
                          {item.sku}
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                          {item.region}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-mono">
                          Period: {item.period}
                        </span>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                            item.status === 'Approved'
                              ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5">{item.itemName}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        Category: {item.category} • Method: <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">{item.forecastMethod}</span> • Confidence: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{item.confidenceScore}%</span>
                      </p>
                    </div>
                  </div>

                  {/* Quantitative Demand Breakdown Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/80 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-3">
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Historical Run Rate</span>
                      <p className="text-xs sm:text-sm font-mono font-bold text-slate-700 dark:text-slate-300">
                        {item.historicalSalesQty.toLocaleString()} {item.uom}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Baseline Model</span>
                      <p className="text-xs sm:text-sm font-mono font-bold text-slate-800 dark:text-slate-200">
                        {item.baselineForecastQty.toLocaleString()} {item.uom}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Uplift / Season</span>
                      <p className="text-xs sm:text-sm font-mono font-bold text-cyan-600 dark:text-cyan-400">
                        +{item.promotionalUpliftQty} (x{item.seasonalityFactor})
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Consensus Demand</span>
                      <p className="text-xs sm:text-sm font-mono font-black text-emerald-600 dark:text-emerald-400">
                        {item.consensusForecastQty.toLocaleString()} {item.uom}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Simulation & Recalibration Bar */}
                <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 flex-wrap text-slate-600 dark:text-slate-400">
                    <span>Recalibrate Model:</span>
                    <button
                      onClick={() => recalculateStatisticalForecast(item.id, 'HOLT_WINTERS', 1.15)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium transition-colors cursor-pointer"
                    >
                      Holt-Winters (x1.15)
                    </button>
                    <button
                      onClick={() => recalculateStatisticalForecast(item.id, 'EXPONENTIAL_SMOOTHING', 1.0)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium transition-colors cursor-pointer"
                    >
                      Exp Smoothing
                    </button>
                    <button
                      onClick={() => recalculateStatisticalForecast(item.id, 'MACHINE_LEARNING', 1.2)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-900 font-medium transition-colors cursor-pointer"
                    >
                      AI Pattern Fit
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Updated: {item.lastUpdated}</span>
                    {item.status === 'In Review' && (
                      <button
                        onClick={() => updateDemandForecast(item.id, { status: 'Approved' })}
                        className="px-3 py-1 bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 hover:bg-emerald-600/30 rounded-lg font-bold transition-all cursor-pointer"
                      >
                        Approve Consensus
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------- SUB-TAB 2: DEMAND ANALYSIS (ABC-XYZ) ----------------- */}
      {activeSubTab === 'analysis' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Class A Items (Top 80% Value)</span>
              <p className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">3 SKUs</p>
              <span className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 block">Strict daily inventory monitoring</span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Average Forecast Error (MAPE)</span>
              <p className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400 mt-1">6.1%</p>
              <span className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 block">World-class accuracy (&lt;10%)</span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">High Stockout Risk SKUs</span>
              <p className="text-2xl font-black font-mono text-amber-700 dark:text-amber-400 mt-1">1 Item</p>
              <span className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 block">PUMP-CENTRIF-50KW (Class AZ)</span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Tracking Signal Stability</span>
              <p className="text-2xl font-black font-mono text-purple-600 dark:text-purple-400 mt-1">+0.42</p>
              <span className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 block">Within control limits [-4, +4]</span>
            </div>
          </div>

          {/* Analysis Data Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>SKU ABC-XYZ Matrix & Forecast Reliability Profiling</span>
              </h3>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-mono">5 Master Components Analyzed</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 dark:bg-slate-950/80 text-slate-600 dark:text-slate-400 uppercase font-bold border-b border-slate-200 dark:border-slate-800 text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Component / SKU</th>
                    <th className="py-3 px-4">ABC Class</th>
                    <th className="py-3 px-4">XYZ Volatility</th>
                    <th className="py-3 px-4 text-right">Avg Monthly Demand</th>
                    <th className="py-3 px-4 text-right">Std Dev</th>
                    <th className="py-3 px-4 text-right">MAPE %</th>
                    <th className="py-3 px-4 text-right">Tracking Signal</th>
                    <th className="py-3 px-4 text-center">Velocity Rank</th>
                    <th className="py-3 px-4 text-center">Stockout Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 font-mono">
                  {demandAnalysis.map((item) => (
                    <tr key={item.sku} className="hover:bg-slate-100/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-sans">
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400 block">{item.sku}</span>
                        <span className="text-slate-700 dark:text-slate-300 text-xs">{item.itemName}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded font-black text-xs ${
                          item.abcClass === 'A' ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' :
                          item.abcClass === 'B' ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800' :
                          'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}>
                          Class {item.abcClass}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded font-black text-xs ${
                          item.xyzClass === 'X' ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' :
                          item.xyzClass === 'Y' ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800' :
                          'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                        }`}>
                          {item.xyzClass} ({item.xyzClass === 'X' ? 'Predictable' : item.xyzClass === 'Y' ? 'Variable' : 'Sporadic'})
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">{item.avgMonthlyDemand} Units</td>
                      <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">±{item.demandVolatilityStdDev}</td>
                      <td className="py-3 px-4 text-right font-bold text-cyan-600 dark:text-cyan-400">{item.mapePercent}%</td>
                      <td className="py-3 px-4 text-right text-slate-700 dark:text-slate-300">{item.trackingSignal > 0 ? `+${item.trackingSignal}` : item.trackingSignal}</td>
                      <td className="py-3 px-4 text-center font-sans">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold">
                          {item.velocityRank}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-sans">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          item.stockoutRisk === 'Low' ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' :
                          item.stockoutRisk === 'Medium' ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800' :
                          'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                        }`}>
                          {item.stockoutRisk}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- SUB-TAB 3: DEMAND CONSOLIDATION ----------------- */}
      {activeSubTab === 'consolidation' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {consolidationBatches.map((batch) => (
              <div
                key={batch.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded border border-indigo-800/60">
                      {batch.batchNumber}
                    </span>
                    <h3 className="text-base font-black text-slate-900 dark:text-white mt-1.5">
                      Target Fulfillment: {batch.targetFulfillmentMonth} ({batch.period})
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      Included Hubs: {batch.regionsIncluded.join(', ')}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      batch.status === 'Converted to PR'
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                    }`}
                  >
                    {batch.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 bg-slate-50/80 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-3.5 mt-4 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold font-sans">Total SKUs</span>
                    <p className="font-bold text-slate-900 dark:text-white mt-0.5">{batch.totalSkus} Lines</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold font-sans">Aggregated Units</span>
                    <p className="font-bold text-cyan-600 dark:text-cyan-400 mt-0.5">{batch.totalDemandUnits.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold font-sans">Est. Purchase Value</span>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {batch.estimatedPurchasingValue.toLocaleString()} {batch.currency}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="text-slate-600 dark:text-slate-400">
                    {batch.generatedPrNumber ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold flex items-center gap-1.5">
                        <FileCheck className="w-4 h-4" />
                        Requisition: {batch.generatedPrNumber}
                      </span>
                    ) : (
                      <span>Created: {batch.createdDate}</span>
                    )}
                  </div>

                  {batch.status === 'Consolidated' && (
                    <button
                      onClick={() => convertConsolidationToPr(batch.id)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all cursor-pointer shadow-lg shadow-emerald-600/20"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Convert to Purchase Requisition</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------- MODAL 1: NEW DEMAND FORECAST ----------------- */}
      {showNewForecastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Create Consensus Demand Forecast</span>
              </h3>
              <button
                onClick={() => setShowNewForecastModal(false)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-bold"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleCreateForecast} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Component SKU</label>
                  <input
                    type="text"
                    required
                    value={newForecastForm.sku}
                    onChange={(e) => setNewForecastForm({ ...newForecastForm, sku: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Target Region / Hub</label>
                  <select
                    value={newForecastForm.region}
                    onChange={(e) => setNewForecastForm({ ...newForecastForm, region: e.target.value as DemandForecastItem['region'] })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  >
                    <option value="Muscat HQ">Muscat HQ</option>
                    <option value="Sohar Industrial">Sohar Industrial</option>
                    <option value="Salalah Freezone">Salalah Freezone</option>
                    <option value="Dubai Logistics Hub">Dubai Logistics Hub</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  value={newForecastForm.itemName}
                  onChange={(e) => setNewForecastForm({ ...newForecastForm, itemName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Historical Run Rate</label>
                  <input
                    type="number"
                    value={newForecastForm.historicalSalesQty}
                    onChange={(e) => setNewForecastForm({ ...newForecastForm, historicalSalesQty: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Seasonality Factor</label>
                  <input
                    type="number"
                    step="0.05"
                    value={newForecastForm.seasonalityFactor}
                    onChange={(e) => setNewForecastForm({ ...newForecastForm, seasonalityFactor: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Consensus Forecast Qty</label>
                  <input
                    type="number"
                    value={newForecastForm.consensusForecastQty}
                    onChange={(e) => setNewForecastForm({ ...newForecastForm, consensusForecastQty: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono font-bold text-emerald-600 dark:text-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1">Forecasting Method</label>
                <select
                  value={newForecastForm.forecastMethod}
                  onChange={(e) => setNewForecastForm({ ...newForecastForm, forecastMethod: e.target.value as DemandForecastMethod })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                >
                  <option value="HOLT_WINTERS">Holt-Winters Double Exponential Smoothing</option>
                  <option value="EXPONENTIAL_SMOOTHING">Single Exponential Smoothing</option>
                  <option value="MOVING_AVERAGE">12-Month Moving Average</option>
                  <option value="MACHINE_LEARNING">AI Demand Pattern Regression</option>
                  <option value="CONSENSUS">Cross-Functional Sales & Operations Consensus</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewForecastModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-600/30"
                >
                  Save & Publish Forecast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL 2: NEW DEMAND CONSOLIDATION ----------------- */}
      {showConsolidationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Consolidate Regional Demands into Purchasing Batch</span>
              </h3>
              <button
                onClick={() => setShowConsolidationModal(false)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-bold"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleCreateConsolidation} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1">Target Planning Period</label>
                <select
                  value={consolidationPeriod}
                  onChange={(e) => setConsolidationPeriod(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono"
                >
                  <option value="2026-Q3">2026-Q3 (July - Sept 2026)</option>
                  <option value="2026-Q4">2026-Q4 (Oct - Dec 2026)</option>
                  <option value="2027-Q1">2027-Q1 (Jan - Mar 2027)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-2 font-bold">Select Distribution Hubs to Aggregate:</label>
                <div className="space-y-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3">
                  {['Muscat HQ', 'Sohar Industrial', 'Salalah Freezone', 'Dubai Logistics Hub'].map((hub) => (
                    <label key={hub} className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={selectedConsolidationRegions.includes(hub)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedConsolidationRegions([...selectedConsolidationRegions, hub]);
                          } else {
                            setSelectedConsolidationRegions(selectedConsolidationRegions.filter(h => h !== hub));
                          }
                        }}
                        className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 focus:ring-0"
                      />
                      <span>{hub}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowConsolidationModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/30"
                >
                  Execute Consolidation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
