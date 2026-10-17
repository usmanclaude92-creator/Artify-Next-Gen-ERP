// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 11: BUDGETING & FINANCIAL PLANNING
// 11.02 — Operating Budget View (Revenue, Expense, Operating Cost)
// ==========================================

import React, { useState } from 'react';
import { useBudgetStore } from '../../services/budgetStore';
import { RevenueBudgetStream } from '../../types';
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Plus,
  BarChart3,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Wrench,
  Sparkles,
  PieChart,
  Calendar,
  CheckCircle2
} from 'lucide-react';

export const OperatingBudgetView: React.FC = () => {
  const {
    revenueStreams,
    addRevenueStream,
    lineItems,
    selectedBudget,
    currency
  } = useBudgetStore();

  const [activeSubTab, setActiveSubTab] = useState<'revenue' | 'expense' | 'cogs'>('revenue');
  const [showAddRevenueModal, setShowAddRevenueModal] = useState(false);

  // New Revenue Stream Form State
  const [newStreamCode, setNewStreamCode] = useState('REV-NEW-01');
  const [newStreamName, setNewStreamName] = useState('');
  const [newProductFamily, setNewProductFamily] = useState('Modular Fabrication');
  const [newTerritory, setNewTerritory] = useState('GCC Regional');
  const [newTargetUnits, setNewTargetUnits] = useState<number>(1000);
  const [newUnitPrice, setNewUnitPrice] = useState<number>(1500);

  const totalTargetRevenue = revenueStreams.reduce((sum, r) => sum + r.targetAnnualRevenue, 0);
  const totalActualRevenue = revenueStreams.reduce((sum, r) => sum + r.actualYtdRevenue, 0);
  const totalForecastRevenue = revenueStreams.reduce((sum, r) => sum + r.forecastYearEnd, 0);

  const opexItems = lineItems.filter(l => l.category.includes('Operating Expenses') || l.category.includes('OPEX'));
  const cogsItems = lineItems.filter(l => l.category.includes('Cost of Goods') || l.category.includes('Direct'));

  const totalOpexBudget = opexItems.reduce((sum, l) => sum + l.annualBudget, 0);
  const totalOpexSpent = opexItems.reduce((sum, l) => sum + l.actualSpent, 0);
  const totalOpexCommitted = opexItems.reduce((sum, l) => sum + l.committedAmount, 0);

  const totalCogsBudget = cogsItems.reduce((sum, l) => sum + l.annualBudget, 0);
  const totalCogsSpent = cogsItems.reduce((sum, l) => sum + l.actualSpent, 0);
  const totalCogsCommitted = cogsItems.reduce((sum, l) => sum + l.committedAmount, 0);

  const handleAddRevenueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreamName) return;

    const annual = newTargetUnits * newUnitPrice;
    const q = annual / 4;

    addRevenueStream({
      streamCode: newStreamCode,
      streamName: newStreamName,
      productFamily: newProductFamily,
      territory: newTerritory,
      targetUnits: Number(newTargetUnits),
      unitPrice: Number(newUnitPrice),
      targetAnnualRevenue: annual,
      actualYtdRevenue: 0,
      forecastYearEnd: annual,
      achievementPercent: 0,
      q1Target: q,
      q2Target: q,
      q3Target: q,
      q4Target: q
    });

    setShowAddRevenueModal(false);
    setNewStreamName('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Sub-Nav */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                11.02 OPERATING BUDGET
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400">Revenue, OPEX & Direct Manufacturing Cost</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Operational Income & Expenditure Budgeting
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Establish bottom-up revenue projections, departmental general expenses (OPEX), and direct production cost of goods sold.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeSubTab === 'revenue' && (
              <button
                onClick={() => setShowAddRevenueModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Revenue Quota</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub Nav Strip */}
        <div className="flex items-center gap-2 mt-6 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('revenue')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'revenue'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>11.02.01 Revenue Budget</span>
          </button>
          <button
            onClick={() => setActiveSubTab('expense')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'expense'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>11.02.02 Expense Budget (OPEX)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('cogs')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'cogs'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>11.02.03 Operating Cost Budget (COGS)</span>
          </button>
        </div>
      </div>

      {/* 11.02.01: Revenue Budget */}
      {activeSubTab === 'revenue' && (
        <div className="space-y-6">
          {/* Revenue KPI Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Target Annual Sales Quota</span>
              <p className="text-xl font-mono font-black text-slate-900 dark:text-white mt-1">
                {totalTargetRevenue.toLocaleString()} <span className="text-xs font-normal text-slate-600 dark:text-slate-400">{currency}</span>
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+8.4% vs FY2025 Actuals</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Actual YTD Recognized Sales</span>
              <p className="text-xl font-mono font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {totalActualRevenue.toLocaleString()} <span className="text-xs font-normal text-slate-600 dark:text-slate-400">{currency}</span>
              </p>
              <span className="text-xs text-slate-600 dark:text-slate-400 mt-2 block">
                {Math.round((totalActualRevenue / totalTargetRevenue) * 100)}% YTD Quota Attainment
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Full-Year Projected Forecast</span>
              <p className="text-xl font-mono font-black text-cyan-600 dark:text-cyan-400 mt-1">
                {totalForecastRevenue.toLocaleString()} <span className="text-xs font-normal text-slate-600 dark:text-slate-400">{currency}</span>
              </p>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 block font-semibold">
                +{(totalForecastRevenue - totalTargetRevenue).toLocaleString()} {currency} Favorable
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Gross Margin Target</span>
              <p className="text-xl font-mono font-black text-purple-600 dark:text-purple-400 mt-1">
                44.6% <span className="text-xs font-normal text-slate-600 dark:text-slate-400">(Blended)</span>
              </p>
              <span className="text-xs text-slate-600 dark:text-slate-400 mt-2 block">
                High-pressure vessel mix expanding
              </span>
            </div>
          </div>

          {/* Revenue Streams Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Revenue Budget by Product Line & Commercial Stream</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-sans">
                    <th className="p-3 font-bold">Revenue Stream Code & Name</th>
                    <th className="p-3 font-bold">Product Family & Region</th>
                    <th className="p-3 font-bold text-right">Target Volume</th>
                    <th className="p-3 font-bold text-right">Unit ASP</th>
                    <th className="p-3 font-bold text-right">Annual Target</th>
                    <th className="p-3 font-bold text-right">Actual YTD</th>
                    <th className="p-3 font-bold text-right">Forecast Year-End</th>
                    <th className="p-3 font-bold text-center">Attainment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                  {revenueStreams.map(stream => (
                    <tr key={stream.id} className="hover:bg-slate-100/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-sans">
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{stream.streamCode}</span>
                        <p className="text-slate-900 dark:text-white font-bold text-xs mt-0.5">{stream.streamName}</p>
                      </td>
                      <td className="p-3 font-sans">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{stream.productFamily}</span>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">{stream.territory}</p>
                      </td>
                      <td className="p-3 text-right text-slate-700 dark:text-slate-300">
                        {stream.targetUnits.toLocaleString()}
                      </td>
                      <td className="p-3 text-right text-slate-700 dark:text-slate-300">
                        {stream.unitPrice.toLocaleString()} {currency}
                      </td>
                      <td className="p-3 text-right font-bold text-slate-900 dark:text-white">
                        {stream.targetAnnualRevenue.toLocaleString()} {currency}
                      </td>
                      <td className="p-3 text-right text-emerald-600 dark:text-emerald-400">
                        {stream.actualYtdRevenue.toLocaleString()} {currency}
                      </td>
                      <td className="p-3 text-right font-bold text-cyan-600 dark:text-cyan-400">
                        {stream.forecastYearEnd.toLocaleString()} {currency}
                      </td>
                      <td className="p-3 text-center font-sans">
                        <div className="flex items-center justify-center gap-2">
                          <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            {stream.achievementPercent}%
                          </span>
                          <div className="w-16 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full" style={{ width: `${stream.achievementPercent}%` }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 11.02.02: Expense Budget (OPEX) */}
      {activeSubTab === 'expense' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Total Authorized OPEX</span>
              <p className="text-xl font-mono font-black text-slate-900 dark:text-white mt-1">
                {totalOpexBudget.toLocaleString()} <span className="text-xs font-normal text-slate-600 dark:text-slate-400">{currency}</span>
              </p>
              <span className="text-xs text-slate-600 dark:text-slate-400 mt-2 block">General & Administrative + IT + Commercial</span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Committed & Spent YTD</span>
              <p className="text-xl font-mono font-black text-amber-700 dark:text-amber-400 mt-1">
                {(totalOpexSpent + totalOpexCommitted).toLocaleString()} <span className="text-xs font-normal text-slate-600 dark:text-slate-400">{currency}</span>
              </p>
              <span className="text-xs text-slate-600 dark:text-slate-400 mt-2 block">
                {Math.round(((totalOpexSpent + totalOpexCommitted) / totalOpexBudget) * 100)}% Burn Rate
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Available OPEX Buffer</span>
              <p className="text-xl font-mono font-black text-cyan-600 dark:text-cyan-400 mt-1">
                {(totalOpexBudget - totalOpexSpent - totalOpexCommitted).toLocaleString()} <span className="text-xs font-normal text-slate-600 dark:text-slate-400">{currency}</span>
              </p>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 block font-semibold">Strict budget control active</span>
            </div>
          </div>

          {/* OPEX Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Operating Expense (OPEX) General Ledger Envelopes</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-sans">
                    <th className="p-3 font-bold">GL Account & Line</th>
                    <th className="p-3 font-bold">Cost Center</th>
                    <th className="p-3 font-bold text-right">Annual Budget</th>
                    <th className="p-3 font-bold text-right">Committed</th>
                    <th className="p-3 font-bold text-right">Actual Spent</th>
                    <th className="p-3 font-bold text-right">Remaining Balance</th>
                    <th className="p-3 font-bold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                  {opexItems.map(item => {
                    const remaining = item.annualBudget - item.committedAmount - item.actualSpent;
                    return (
                      <tr key={item.id} className="hover:bg-slate-100/70 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 font-sans">
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{item.accountCode}</span>
                          <p className="text-slate-900 dark:text-white font-bold text-xs mt-0.5">{item.accountName}</p>
                        </td>
                        <td className="p-3 font-sans text-slate-700 dark:text-slate-300">
                          <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-mono text-[10px] font-bold">
                            {item.costCenterCode}
                          </span>
                        </td>
                        <td className="p-3 text-right font-bold text-slate-900 dark:text-white">{item.annualBudget.toLocaleString()} {currency}</td>
                        <td className="p-3 text-right text-amber-700 dark:text-amber-400">{item.committedAmount.toLocaleString()} {currency}</td>
                        <td className="p-3 text-right text-emerald-600 dark:text-emerald-400">{item.actualSpent.toLocaleString()} {currency}</td>
                        <td className="p-3 text-right font-bold text-cyan-600 dark:text-cyan-400">{remaining.toLocaleString()} {currency}</td>
                        <td className="p-3 text-center font-sans">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            Normal
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

      {/* 11.02.03: Operating Cost Budget (COGS) */}
      {activeSubTab === 'cogs' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Direct Production Budget (COGS)</span>
              <p className="text-xl font-mono font-black text-slate-900 dark:text-white mt-1">
                {totalCogsBudget.toLocaleString()} <span className="text-xs font-normal text-slate-600 dark:text-slate-400">{currency}</span>
              </p>
              <span className="text-xs text-slate-600 dark:text-slate-400 mt-2 block">Direct Steel, Alloys & Certified Manpower</span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">COGS Incurred + Open Orders</span>
              <p className="text-xl font-mono font-black text-amber-700 dark:text-amber-400 mt-1">
                {(totalCogsSpent + totalCogsCommitted).toLocaleString()} <span className="text-xs font-normal text-slate-600 dark:text-slate-400">{currency}</span>
              </p>
              <span className="text-xs text-slate-600 dark:text-slate-400 mt-2 block">
                {Math.round(((totalCogsSpent + totalCogsCommitted) / totalCogsBudget) * 100)}% Consumed
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Available Production Balance</span>
              <p className="text-xl font-mono font-black text-cyan-600 dark:text-cyan-400 mt-1">
                {(totalCogsBudget - totalCogsSpent - totalCogsCommitted).toLocaleString()} <span className="text-xs font-normal text-slate-600 dark:text-slate-400">{currency}</span>
              </p>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 block font-semibold">Raw steel hedge locked</span>
            </div>
          </div>

          {/* COGS Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Direct Manufacturing & Operating Cost Lines</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-sans">
                    <th className="p-3 font-bold">Cost Code & Description</th>
                    <th className="p-3 font-bold">Cost Center</th>
                    <th className="p-3 font-bold text-right">Annual Allocation</th>
                    <th className="p-3 font-bold text-right">Committed POs</th>
                    <th className="p-3 font-bold text-right">Actual Incurred</th>
                    <th className="p-3 font-bold text-right">Remaining Balance</th>
                    <th className="p-3 font-bold text-center">Tolerance Mode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                  {cogsItems.map(item => {
                    const remaining = item.annualBudget - item.committedAmount - item.actualSpent;
                    return (
                      <tr key={item.id} className="hover:bg-slate-100/70 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 font-sans">
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{item.accountCode}</span>
                          <p className="text-slate-900 dark:text-white font-bold text-xs mt-0.5">{item.accountName}</p>
                        </td>
                        <td className="p-3 font-sans text-slate-700 dark:text-slate-300">
                          <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-mono text-[10px] font-bold">
                            {item.costCenterCode}
                          </span>
                        </td>
                        <td className="p-3 text-right font-bold text-slate-900 dark:text-white">{item.annualBudget.toLocaleString()} {currency}</td>
                        <td className="p-3 text-right text-amber-700 dark:text-amber-400">{item.committedAmount.toLocaleString()} {currency}</td>
                        <td className="p-3 text-right text-emerald-600 dark:text-emerald-400">{item.actualSpent.toLocaleString()} {currency}</td>
                        <td className="p-3 text-right font-bold text-cyan-600 dark:text-cyan-400">{remaining.toLocaleString()} {currency}</td>
                        <td className="p-3 text-center font-sans">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                            Hard Block (100%)
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

      {/* Modal: New Revenue Stream */}
      {showAddRevenueModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-fadeIn">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add Sales Revenue Quota Stream</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Define volume and ASP target for product line / territory.</p>

            <form onSubmit={handleAddRevenueSubmit} className="space-y-4 mt-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Stream Code</label>
                  <input
                    type="text"
                    required
                    value={newStreamCode}
                    onChange={(e) => setNewStreamCode(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white mt-1 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Product Family</label>
                  <input
                    type="text"
                    required
                    value={newProductFamily}
                    onChange={(e) => setNewProductFamily(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white mt-1 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Stream Description / Customer Segment</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EPC Subsea Manifold Assemblies"
                  value={newStreamName}
                  onChange={(e) => setNewStreamName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white mt-1 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Volume / Units</label>
                  <input
                    type="number"
                    required
                    value={newTargetUnits}
                    onChange={(e) => setNewTargetUnits(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white mt-1 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Average Unit Price ({currency})</label>
                  <input
                    type="number"
                    required
                    value={newUnitPrice}
                    onChange={(e) => setNewUnitPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white mt-1 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono">
                <span className="text-slate-600 dark:text-slate-400 font-sans">Calculated Annual Revenue Target: </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {(newTargetUnits * newUnitPrice).toLocaleString()} {currency}
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddRevenueModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 cursor-pointer"
                >
                  Save Revenue Stream
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperatingBudgetView;
