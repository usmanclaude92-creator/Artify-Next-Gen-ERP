// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 11: BUDGETING & FINANCIAL PLANNING
// 11.03 — Capital & Cash Budget View (CAPEX, Cash Flow, Financing)
// ==========================================

import React, { useState } from 'react';
import { useBudgetStore } from '../../services/budgetStore';
import { CapexInvestmentProposal } from '../../types';
import {
  DollarSign,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Cpu,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Calendar,
  Layers,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Percent
} from 'lucide-react';

export const CapitalCashBudgetView: React.FC = () => {
  const {
    capexProposals,
    addCapexProposal,
    updateCapexStatus,
    cashFlowProjections,
    financingFacilities,
    currency
  } = useBudgetStore();

  const [activeSubTab, setActiveSubTab] = useState<'capex' | 'cash-flow' | 'financing'>('capex');
  const [showAddCapexModal, setShowAddCapexModal] = useState(false);

  // New CAPEX Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<CapexInvestmentProposal['category']>('Machinery & Equipment');
  const [newCostCenter, setNewCostCenter] = useState('CC-200');
  const [newDept, setNewDept] = useState('Manufacturing & Plant Operations');
  const [newEstimatedCost, setNewEstimatedCost] = useState<number>(500000);
  const [newContingency, setNewContingency] = useState<number>(25000);
  const [newUsefulLife, setNewUsefulLife] = useState<number>(8);
  const [newAnnualSavings, setNewAnnualSavings] = useState<number>(150000);
  const [newPriority, setNewPriority] = useState<CapexInvestmentProposal['priority']>('Strategic');
  const [newJustification, setNewJustification] = useState('');

  const totalCapexApproved = capexProposals
    .filter(c => c.status === 'Approved' || c.status === 'Procurement Initiated' || c.status === 'Commissioned')
    .reduce((sum, c) => sum + c.totalCapexRequired, 0);

  const totalFinancingPrincipal = financingFacilities.reduce((sum, f) => sum + f.principalFacilityAmount, 0);
  const totalFinancingOutstanding = financingFacilities.reduce((sum, f) => sum + f.currentOutstandingBalance, 0);
  const totalAnnualDebtService = financingFacilities.reduce((sum, f) => sum + f.annualDebtServicePrincipal + f.annualInterestService, 0);

  const handleAddCapexSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const total = Number(newEstimatedCost) + Number(newContingency);
    const payback = total / (newAnnualSavings || 1);
    const npv = (newAnnualSavings * newUsefulLife * 0.75) - total;
    const irr = Math.round((newAnnualSavings / total) * 100 * 1.1);

    addCapexProposal({
      proposalCode: `CPX-2026-00${capexProposals.length + 1}`,
      assetTitle: newTitle,
      category: newCategory,
      department: newDept,
      costCenterCode: newCostCenter,
      estimatedCost: Number(newEstimatedCost),
      contingency: Number(newContingency),
      totalCapexRequired: total,
      economicUsefulLifeYears: Number(newUsefulLife),
      salvageValue: Math.round(total * 0.1),
      depreciationMethod: 'Straight Line',
      estimatedAnnualSavingsOrRevenue: Number(newAnnualSavings),
      paybackPeriodYears: Number(payback.toFixed(1)),
      npvEstimated: Math.round(npv),
      irrPercent: Number(irr.toFixed(1)),
      priority: newPriority,
      status: 'Submitted',
      justification: newJustification || 'Strategic facility equipment enhancement',
      requestedBy: 'Current Engineering Lead',
      dateRequested: new Date().toISOString().split('T')[0],
      expectedCommissionDate: '2026-12-31'
    });

    setShowAddCapexModal(false);
    setNewTitle('');
    setNewJustification('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Sub-Nav */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                11.03 CAPITAL & CASH BUDGET
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400">Asset Proposals, Cash Liquidity & Debt Obligations</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Capital Expenditures (CAPEX), Cash Flow & Financing Plans
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Evaluate multi-year capital equipment investments (NPV/IRR), simulate 12-month rolling cash liquidity, and track credit facilities.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeSubTab === 'capex' && (
              <button
                onClick={() => setShowAddCapexModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Submit CAPEX Proposal</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub Nav Strip */}
        <div className="flex items-center gap-2 mt-6 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('capex')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'capex'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>11.03.01 CAPEX Budget</span>
          </button>
          <button
            onClick={() => setActiveSubTab('cash-flow')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'cash-flow'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>11.03.02 Cash Flow Budget</span>
          </button>
          <button
            onClick={() => setActiveSubTab('financing')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'financing'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>11.03.03 Financing & Debt Budget</span>
          </button>
        </div>
      </div>

      {/* 11.03.01: CAPEX Budget */}
      {activeSubTab === 'capex' && (
        <div className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Approved FY2026 CAPEX Envelopes</span>
              <p className="text-xl font-mono font-black text-slate-900 dark:text-white mt-1">
                {totalCapexApproved.toLocaleString()} <span className="text-xs font-normal text-slate-600 dark:text-slate-400">{currency}</span>
              </p>
              <span className="text-xs text-slate-600 dark:text-slate-400 mt-2 block">Heavy machinery & digital cluster</span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Average Portfolio IRR</span>
              <p className="text-xl font-mono font-black text-emerald-600 dark:text-emerald-400 mt-1">
                23.6% <span className="text-xs font-normal text-slate-600 dark:text-slate-400">Internal Rate of Return</span>
              </p>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 block font-semibold">+8.6% above Hurdle Rate (15%)</span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Average Payback Period</span>
              <p className="text-xl font-mono font-black text-cyan-600 dark:text-cyan-400 mt-1">
                3.2 <span className="text-xs font-normal text-slate-600 dark:text-slate-400">Years</span>
              </p>
              <span className="text-xs text-slate-600 dark:text-slate-400 mt-2 block">High operational efficiency yield</span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Active Proposals Under Review</span>
              <p className="text-xl font-mono font-black text-amber-700 dark:text-amber-400 mt-1">
                {capexProposals.filter(c => c.status === 'Under Technical Review' || c.status === 'Submitted').length} Proposals
              </p>
              <span className="text-xs text-slate-600 dark:text-slate-400 mt-2 block">Board packet pending review</span>
            </div>
          </div>

          {/* CAPEX Proposals Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Capital Investment Proposals & Feasibility Matrix</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-sans">
                    <th className="p-3 font-bold">Proposal & Asset Title</th>
                    <th className="p-3 font-bold">Category & Dept</th>
                    <th className="p-3 font-bold text-right">Total CAPEX</th>
                    <th className="p-3 font-bold text-right">Annual Savings</th>
                    <th className="p-3 font-bold text-right">Payback</th>
                    <th className="p-3 font-bold text-right">NPV</th>
                    <th className="p-3 font-bold text-right">IRR</th>
                    <th className="p-3 font-bold text-center">Priority</th>
                    <th className="p-3 font-bold text-center">Status</th>
                    <th className="p-3 font-bold text-center font-sans">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                  {capexProposals.map(cpx => (
                    <tr key={cpx.id} className="hover:bg-slate-100/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-sans max-w-xs">
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{cpx.proposalCode}</span>
                        <p className="text-slate-900 dark:text-white font-bold text-xs mt-0.5">{cpx.assetTitle}</p>
                        <p className="text-[10px] text-slate-600 dark:text-slate-400 line-clamp-1">{cpx.justification}</p>
                      </td>
                      <td className="p-3 font-sans">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{cpx.category}</span>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">{cpx.department} ({cpx.costCenterCode})</p>
                      </td>
                      <td className="p-3 text-right font-bold text-slate-900 dark:text-white">
                        {cpx.totalCapexRequired.toLocaleString()} {currency}
                      </td>
                      <td className="p-3 text-right text-emerald-600 dark:text-emerald-400">
                        {cpx.estimatedAnnualSavingsOrRevenue.toLocaleString()} {currency}/yr
                      </td>
                      <td className="p-3 text-right text-cyan-600 dark:text-cyan-400 font-bold">
                        {cpx.paybackPeriodYears} yrs
                      </td>
                      <td className="p-3 text-right text-slate-700 dark:text-slate-300">
                        {cpx.npvEstimated.toLocaleString()} {currency}
                      </td>
                      <td className="p-3 text-right font-bold text-purple-600 dark:text-purple-400">
                        {cpx.irrPercent}%
                      </td>
                      <td className="p-3 text-center font-sans">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          cpx.priority === 'Critical'
                            ? 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                            : cpx.priority === 'Strategic'
                            ? 'bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}>
                          {cpx.priority}
                        </span>
                      </td>
                      <td className="p-3 text-center font-sans">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          cpx.status === 'Approved' || cpx.status === 'Procurement Initiated'
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                            : cpx.status === 'Under Technical Review' || cpx.status === 'Submitted'
                            ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                          {cpx.status}
                        </span>
                      </td>
                      <td className="p-3 text-center font-sans">
                        {cpx.status === 'Under Technical Review' || cpx.status === 'Submitted' ? (
                          <button
                            onClick={() => updateCapexStatus(cpx.id, 'Approved')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold cursor-pointer transition-all"
                          >
                            Approve
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">Authorized</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 11.03.02: Cash Flow Budget */}
      {activeSubTab === 'cash-flow' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">12-Month Financial Liquidity & Cash Flow Projection</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Operating collections, vendor disbursements, debt servicing, and buffer liquidity</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 dark:text-slate-400">Minimum Liquidity Buffer:</span>
                <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800">
                  2,000,000 {currency}
                </span>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-sans">
                    <th className="p-3 font-bold">Month</th>
                    <th className="p-3 font-bold text-right">Beginning Cash</th>
                    <th className="p-3 font-bold text-right">Operating Inflows</th>
                    <th className="p-3 font-bold text-right">Operating Outflows</th>
                    <th className="p-3 font-bold text-right">Net Operating</th>
                    <th className="p-3 font-bold text-right">CAPEX Outflows</th>
                    <th className="p-3 font-bold text-right">Financing Flows</th>
                    <th className="p-3 font-bold text-right">Net Monthly</th>
                    <th className="p-3 font-bold text-right">Ending Cash</th>
                    <th className="p-3 font-bold text-center">Liquidity Surplus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                  {cashFlowProjections.map(cf => (
                    <tr key={cf.monthIndex} className="hover:bg-slate-100/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-sans font-bold text-slate-900 dark:text-white">{cf.monthName}</td>
                      <td className="p-3 text-right text-slate-700 dark:text-slate-300">{cf.beginningCashBalance.toLocaleString()}</td>
                      <td className="p-3 text-right text-emerald-600 dark:text-emerald-400">{cf.operatingInflows.totalOperatingInflows.toLocaleString()}</td>
                      <td className="p-3 text-right text-rose-600 dark:text-rose-400">({cf.operatingOutflows.totalOperatingOutflows.toLocaleString()})</td>
                      <td className="p-3 text-right font-bold text-cyan-600 dark:text-cyan-400">{cf.netOperatingCash.toLocaleString()}</td>
                      <td className="p-3 text-right text-purple-600 dark:text-purple-400">({Math.abs(cf.investingCashFlows.totalInvesting).toLocaleString()})</td>
                      <td className="p-3 text-right text-amber-700 dark:text-amber-400">({Math.abs(cf.financingCashFlows.totalFinancing).toLocaleString()})</td>
                      <td className={`p-3 text-right font-bold ${cf.netMonthlyCashChange >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {cf.netMonthlyCashChange >= 0 ? '+' : ''}{cf.netMonthlyCashChange.toLocaleString()}
                      </td>
                      <td className="p-3 text-right font-bold text-slate-900 dark:text-white bg-slate-50/40 dark:bg-slate-950/40">{cf.endingCashBalance.toLocaleString()}</td>
                      <td className="p-3 text-center font-sans">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          cf.liquiditySurplusOrDeficit > 1500000
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                        }`}>
                          +{cf.liquiditySurplusOrDeficit.toLocaleString()} {currency}
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

      {/* 11.03.03: Financing & Debt Budget */}
      {activeSubTab === 'financing' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Total Credit Facilities</span>
              <p className="text-xl font-mono font-black text-slate-900 dark:text-white mt-1">
                {totalFinancingPrincipal.toLocaleString()} <span className="text-xs font-normal text-slate-600 dark:text-slate-400">{currency}</span>
              </p>
              <span className="text-xs text-slate-600 dark:text-slate-400 mt-2 block">Bank loans, revolving credit, and Sukuk</span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Current Outstanding Balance</span>
              <p className="text-xl font-mono font-black text-amber-700 dark:text-amber-400 mt-1">
                {totalFinancingOutstanding.toLocaleString()} <span className="text-xs font-normal text-slate-600 dark:text-slate-400">{currency}</span>
              </p>
              <span className="text-xs text-slate-600 dark:text-slate-400 mt-2 block">
                {Math.round((totalFinancingOutstanding / totalFinancingPrincipal) * 100)}% Facility Utilization
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Annual Debt Service Obligation</span>
              <p className="text-xl font-mono font-black text-cyan-600 dark:text-cyan-400 mt-1">
                {totalAnnualDebtService.toLocaleString()} <span className="text-xs font-normal text-slate-600 dark:text-slate-400">{currency}</span>
              </p>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 block font-semibold">Covenants fully satisfied (DSCR &gt; 2.1x)</span>
            </div>
          </div>

          {/* Financing Facilities List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Corporate Debt Facilities & Covenant Matrix</h3>
            <div className="space-y-4">
              {financingFacilities.map(fac => (
                <div key={fac.id} className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                        {fac.facilityCode}
                      </span>
                      <span className="text-xs text-slate-600 dark:text-slate-400">• {fac.facilityType}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">Matures {fac.maturityDate}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">{fac.lenderOrInstitution}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Covenant: {fac.covenantRequirements}</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-sans font-bold">Principal</span>
                      <p className="font-bold text-slate-900 dark:text-white mt-0.5">{fac.principalFacilityAmount.toLocaleString()} {currency}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-sans font-bold">Outstanding</span>
                      <p className="font-bold text-amber-700 dark:text-amber-400 mt-0.5">{fac.currentOutstandingBalance.toLocaleString()} {currency}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-sans font-bold">Rate</span>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{fac.interestRateOrProfitRate}% ({fac.rateType})</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-sans font-bold">DSCR Ratio</span>
                      <p className="font-bold text-cyan-600 dark:text-cyan-400 mt-0.5">{fac.currentDscr}x</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add CAPEX Proposal */}
      {showAddCapexModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-fadeIn">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Submit Capital Investment Proposal (CAPEX)</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Submit business justification, cost breakdown and ROI metrics for executive approval.</p>

            <form onSubmit={handleAddCapexSubmit} className="space-y-4 mt-5">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Asset Title / Machinery Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Automated 5-Axis CNC Milling Center"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white mt-1 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white mt-1 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Machinery & Equipment">Machinery & Equipment</option>
                    <option value="IT Infrastructure">IT Infrastructure</option>
                    <option value="Fleet & Logistics">Fleet & Logistics</option>
                    <option value="Facilities & Real Estate">Facilities & Real Estate</option>
                    <option value="R&D Technology">R&D Technology</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Cost Center</label>
                  <select
                    value={newCostCenter}
                    onChange={(e) => setNewCostCenter(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white mt-1 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="CC-200">CC-200 (Muscat Plant)</option>
                    <option value="CC-300">CC-300 (Sohar Hub)</option>
                    <option value="CC-400">CC-400 (IT Operations)</option>
                    <option value="CC-100">CC-100 (Corporate HQ)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Estimated Cost ({currency})</label>
                  <input
                    type="number"
                    required
                    value={newEstimatedCost}
                    onChange={(e) => setNewEstimatedCost(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white mt-1 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Contingency Buffer ({currency})</label>
                  <input
                    type="number"
                    required
                    value={newContingency}
                    onChange={(e) => setNewContingency(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white mt-1 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Economic Useful Life (Years)</label>
                  <input
                    type="number"
                    required
                    value={newUsefulLife}
                    onChange={(e) => setNewUsefulLife(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white mt-1 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Estimated Annual Savings / Yield ({currency})</label>
                  <input
                    type="number"
                    required
                    value={newAnnualSavings}
                    onChange={(e) => setNewAnnualSavings(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white mt-1 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Business Case Justification</label>
                <textarea
                  rows={2}
                  value={newJustification}
                  onChange={(e) => setNewJustification(e.target.value)}
                  placeholder="Explain ROI drivers, scrap reduction, capacity bottlenecks..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white mt-1 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddCapexModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 cursor-pointer"
                >
                  Submit Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CapitalCashBudgetView;
