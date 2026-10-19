// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 11: BUDGETING & FINANCIAL PLANNING
// 11.01 — Budget Structure View
// ==========================================

import React, { useState } from 'react';
import { useBudgetStore } from '../../services/budgetStore';
import { BudgetMaster, BudgetLineItem, BudgetStatus } from '../../types';
import {
  Layers,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  Unlock,
  Building2,
  FolderKanban,
  FileSpreadsheet,
  TrendingUp,
  DollarSign,
  PieChart,
  Eye,
  Edit,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  Download,
  AlertTriangle
} from 'lucide-react';
import { BrandWatermark } from '@/src/components/common/BrandWatermark';

export const BudgetStructureView: React.FC = () => {
  const {
    budgets,
    selectedBudget,
    selectBudget,
    createBudget,
    updateBudgetStatus,
    lineItems,
    addLineItem,
    departmentSummaries,
    projectSummaries,
    costCenterSummaries,
    currency
  } = useBudgetStore();

  const [activeTab, setActiveTab] = useState<'annual' | 'department' | 'project' | 'cost-center'>('annual');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddLineModal, setShowAddLineModal] = useState(false);

  // Form State for new master budget
  const [newBudgetName, setNewBudgetName] = useState('');
  const [newBudgetCode, setNewBudgetCode] = useState('');
  const [newFiscalYear, setNewFiscalYear] = useState<number>(2026);
  const [newBudgetType, setNewBudgetType] = useState<BudgetMaster['type']>('Operating (OPEX)');
  const [newBudgetVersion, setNewBudgetVersion] = useState('V1.0 - Board Baseline');
  const [newTotalAllocated, setNewTotalAllocated] = useState<number>(15000000);
  const [newDescription, setNewDescription] = useState('');

  // Form State for new line item
  const [newLineAccountCode, setNewLineAccountCode] = useState('GL-6200');
  const [newLineAccountName, setNewLineAccountName] = useState('');
  const [newLineCategory, setNewLineCategory] = useState('Operating Expenses (OPEX)');
  const [newLineCostCenter, setNewLineCostCenter] = useState('CC-100');
  const [newLineDept, setNewLineDept] = useState('dept-admin');
  const [newLineAnnual, setNewLineAnnual] = useState<number>(100000);

  const filteredLineItems = lineItems.filter(item => {
    if (item.budgetId !== selectedBudget.id) return false;
    const matchesSearch = item.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.accountCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.costCenterName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'All' || item.category.includes(filterType);
    return matchesSearch && matchesFilter;
  });

  const handleCreateBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBudgetName || !newBudgetCode) return;

    createBudget({
      budgetCode: newBudgetCode,
      budgetName: newBudgetName,
      fiscalYear: newFiscalYear,
      version: newBudgetVersion,
      type: newBudgetType,
      entityId: 'ent-artify-hq',
      entityName: 'Artify Heavy Industries LLC',
      currency: currency,
      totalAllocated: Number(newTotalAllocated),
      totalCommitted: 0,
      totalActual: 0,
      status: 'Draft',
      preparedBy: 'Current FP&A Officer',
      effectiveStartDate: `${newFiscalYear}-01-01`,
      effectiveEndDate: `${newFiscalYear}-12-31`,
      description: newDescription || `Financial budget model for ${newFiscalYear}`,
      lineItemsCount: 0
    });

    setShowCreateModal(false);
    setNewBudgetName('');
    setNewBudgetCode('');
    setNewDescription('');
  };

  const handleAddLineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLineAccountName) return;

    const q = newLineAnnual / 4;
    addLineItem({
      budgetId: selectedBudget.id,
      accountCode: newLineAccountCode,
      accountName: newLineAccountName,
      category: newLineCategory,
      costCenterId: newLineCostCenter.toLowerCase(),
      costCenterCode: newLineCostCenter,
      costCenterName: newLineCostCenter === 'CC-200' ? 'Muscat Fabrication Bay' : newLineCostCenter === 'CC-400' ? 'IT Cloud Systems' : 'Executive HQ',
      departmentId: newLineDept,
      departmentName: newLineDept === 'dept-mfg' ? 'Manufacturing & Plant Operations' : 'Administration & HR',
      annualBudget: Number(newLineAnnual),
      q1Amount: q,
      q2Amount: q,
      q3Amount: q,
      q4Amount: q,
      committedAmount: 0,
      actualSpent: 0,
      tolerancePercent: 5,
      notes: 'Standard fiscal allocation'
    });

    setShowAddLineModal(false);
    setNewLineAccountName('');
  };

  return (
    <div className="space-y-6">
      {/* View Header & KPIs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden isolate">
<BrandWatermark variant="mark" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                11.01 BUDGET STRUCTURE
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400">Hierarchies, Envelopes & Dimensions</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Corporate Budget Framework & Envelope Architecture
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Establish multi-tier financial structures across legal entities, operating divisions, project portfolios, and general ledger cost centers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Budget Envelope</span>
            </button>
          </div>
        </div>

        {/* Sub Navigation Strip */}
        <div className="flex items-center gap-2 mt-6 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('annual')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'annual'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>11.01.01 Annual Budget</span>
          </button>
          <button
            onClick={() => setActiveTab('department')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'department'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>11.01.02 Department Budget</span>
          </button>
          <button
            onClick={() => setActiveTab('project')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'project'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>11.01.03 Project Budget</span>
          </button>
          <button
            onClick={() => setActiveTab('cost-center')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'cost-center'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
            }`}
          >
            <PieChart className="w-4 h-4" />
            <span>11.01.04 Cost Center Budget</span>
          </button>
        </div>
      </div>

      {/* 11.01.01: Annual Budget View */}
      {activeTab === 'annual' && (
        <div className="space-y-6">
          {/* Master Budget Cards Carousel / Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {budgets.map(b => {
              const isSelected = b.id === selectedBudget.id;
              const burnPercent = Math.round(((b.totalActual + b.totalCommitted) / b.totalAllocated) * 100) || 0;
              return (
                <div
                  key={b.id}
                  onClick={() => selectBudget(b.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xl'
                      : 'bg-white/70 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                      {b.budgetCode}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        b.status === 'Active'
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : b.status === 'Draft'
                          ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                          : 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-3 line-clamp-1">{b.budgetName}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{b.version} • FY{b.fiscalYear}</p>

                  <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">Allocated</span>
                      <p className="font-mono font-bold text-slate-900 dark:text-white">{b.totalAllocated.toLocaleString()} {b.currency}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">Burn Rate</span>
                      <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{burnPercent}%</p>
                    </div>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className={`h-full ${burnPercent > 90 ? 'bg-rose-500' : burnPercent > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(burnPercent, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Budget Deep-Dive & Line Items */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">{selectedBudget.budgetCode}</span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">• {selectedBudget.version}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">FY{selectedBudget.fiscalYear}</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">{selectedBudget.budgetName}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{selectedBudget.description}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateBudgetStatus(selectedBudget.id, selectedBudget.status === 'Locked' ? 'Active' : 'Locked')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    selectedBudget.status === 'Locked'
                      ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-900/60'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {selectedBudget.status === 'Locked' ? <Lock className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" /> : <Unlock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                  <span>{selectedBudget.status === 'Locked' ? 'Unlock Envelope' : 'Lock Baseline'}</span>
                </button>
                <button
                  onClick={() => setShowAddLineModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Line Item</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 p-4 rounded-xl bg-slate-50/80 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800/80">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Total Authorized Budget</span>
                <p className="text-base font-mono font-black text-slate-900 dark:text-white mt-0.5">
                  {selectedBudget.totalAllocated.toLocaleString()} <span className="text-xs font-normal text-slate-600 dark:text-slate-400">{selectedBudget.currency}</span>
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Committed / Encumbered</span>
                <p className="text-base font-mono font-black text-amber-700 dark:text-amber-400 mt-0.5">
                  {selectedBudget.totalCommitted.toLocaleString()} <span className="text-xs font-normal text-slate-600 dark:text-slate-400">{selectedBudget.currency}</span>
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Actual Incurred (Posted)</span>
                <p className="text-base font-mono font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {selectedBudget.totalActual.toLocaleString()} <span className="text-xs font-normal text-slate-600 dark:text-slate-400">{selectedBudget.currency}</span>
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Available Balance</span>
                <p className="text-base font-mono font-black text-cyan-600 dark:text-cyan-400 mt-0.5">
                  {(selectedBudget.totalAllocated - selectedBudget.totalCommitted - selectedBudget.totalActual).toLocaleString()} <span className="text-xs font-normal text-slate-600 dark:text-slate-400">{selectedBudget.currency}</span>
                </p>
              </div>
            </div>

            {/* Table Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500 dark:text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter GL accounts, cost centers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  aria-label="Filter line item categories"
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500"
                >
                  <option value="All">All Categories</option>
                  <option value="Cost of Goods">Direct COGS</option>
                  <option value="Operating Expenses">Operating Expenses (OPEX)</option>
                  <option value="Capital">Capital (CAPEX)</option>
                </select>
              </div>
            </div>

            {/* Line Items Matrix */}
            <div className="mt-4 overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <th className="p-3 font-bold">GL Account & Description</th>
                    <th className="p-3 font-bold">Cost Center</th>
                    <th className="p-3 font-bold">Department</th>
                    <th className="p-3 font-bold text-right">Annual Budget</th>
                    <th className="p-3 font-bold text-right">Q1</th>
                    <th className="p-3 font-bold text-right">Q2</th>
                    <th className="p-3 font-bold text-right">Q3</th>
                    <th className="p-3 font-bold text-right">Q4</th>
                    <th className="p-3 font-bold text-right">Committed</th>
                    <th className="p-3 font-bold text-right">Actual Spent</th>
                    <th className="p-3 font-bold text-center">Remaining</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 font-mono">
                  {filteredLineItems.map(item => {
                    const remaining = item.annualBudget - item.committedAmount - item.actualSpent;
                    const usedPct = Math.round(((item.committedAmount + item.actualSpent) / item.annualBudget) * 100);
                    return (
                      <tr key={item.id} className="hover:bg-slate-100/70 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 font-sans">
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{item.accountCode}</span>
                          <p className="text-slate-900 dark:text-white font-medium text-xs mt-0.5">{item.accountName}</p>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">{item.category}</span>
                        </td>
                        <td className="p-3">
                          <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded text-[11px] font-bold">
                            {item.costCenterCode}
                          </span>
                          <p className="text-[10px] text-slate-600 dark:text-slate-400 font-sans mt-0.5">{item.costCenterName}</p>
                        </td>
                        <td className="p-3 font-sans text-slate-700 dark:text-slate-300 text-xs">
                          {item.departmentName}
                        </td>
                        <td className="p-3 text-right font-bold text-slate-900 dark:text-white">
                          {item.annualBudget.toLocaleString()}
                        </td>
                        <td className="p-3 text-right text-slate-600 dark:text-slate-400">{item.q1Amount.toLocaleString()}</td>
                        <td className="p-3 text-right text-slate-600 dark:text-slate-400">{item.q2Amount.toLocaleString()}</td>
                        <td className="p-3 text-right text-slate-600 dark:text-slate-400">{item.q3Amount.toLocaleString()}</td>
                        <td className="p-3 text-right text-slate-600 dark:text-slate-400">{item.q4Amount.toLocaleString()}</td>
                        <td className="p-3 text-right text-amber-700 dark:text-amber-400">{item.committedAmount.toLocaleString()}</td>
                        <td className="p-3 text-right text-emerald-600 dark:text-emerald-400">{item.actualSpent.toLocaleString()}</td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            remaining < 0
                              ? 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                              : usedPct > 85
                              ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                              : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          }`}>
                            {remaining.toLocaleString()} ({100 - usedPct}%)
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

      {/* 11.01.02: Department Budget View */}
      {activeTab === 'department' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {departmentSummaries.map(dept => (
              <div key={dept.departmentId} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs uppercase font-bold text-slate-600 dark:text-slate-400">{dept.departmentName}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    {dept.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2">{dept.departmentName}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Head: <span className="text-slate-800 dark:text-slate-200">{dept.headOfDepartment}</span> • {dept.headcount} Team Members</p>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Authorized Budget</span>
                    <p className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">{dept.allocatedBudget.toLocaleString()} {currency}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Remaining Balance</span>
                    <p className="font-mono font-bold text-cyan-600 dark:text-cyan-400 mt-0.5">{dept.availableBalance.toLocaleString()} {currency}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 dark:text-slate-400 text-[11px]">Budget Burn Rate</span>
                    <span className={`font-mono font-bold text-[11px] ${dept.burnRatePercent > 75 ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {dept.burnRatePercent}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${dept.burnRatePercent > 85 ? 'bg-rose-500' : dept.burnRatePercent > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${dept.burnRatePercent}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Linked Cost Centers:</span>
                  <div className="flex gap-1.5">
                    {dept.costCenterCodes.map(cc => (
                      <span key={cc} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-mono text-[10px] font-bold">
                        {cc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 11.01.03: Project Budget View */}
      {activeTab === 'project' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Project Financial Portfolios & WBS Budgets</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Direct integration with Module 10 (Project Management & Job Costing)</p>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-sans">
                    <th className="p-3 font-bold">Project Code & Name</th>
                    <th className="p-3 font-bold">Project Manager</th>
                    <th className="p-3 font-bold text-right">Contract Value</th>
                    <th className="p-3 font-bold text-right">Allocated Budget</th>
                    <th className="p-3 font-bold text-right">Contingency Reserve</th>
                    <th className="p-3 font-bold text-right">Committed</th>
                    <th className="p-3 font-bold text-right">Actual Incurred</th>
                    <th className="p-3 font-bold text-right">EAC Forecast</th>
                    <th className="p-3 font-bold text-center">Health</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                  {projectSummaries.map(proj => (
                    <tr key={proj.projectId} className="hover:bg-slate-100/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-sans">
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{proj.projectCode}</span>
                        <p className="text-slate-900 dark:text-white font-bold text-xs mt-0.5">{proj.projectName}</p>
                      </td>
                      <td className="p-3 font-sans text-slate-700 dark:text-slate-300">{proj.projectManager}</td>
                      <td className="p-3 text-right font-bold text-slate-900 dark:text-white">{proj.totalContractValue.toLocaleString()} {currency}</td>
                      <td className="p-3 text-right text-emerald-600 dark:text-emerald-400">{proj.allocatedBudget.toLocaleString()} {currency}</td>
                      <td className="p-3 text-right text-slate-600 dark:text-slate-400">{proj.contingencyReserve.toLocaleString()} {currency}</td>
                      <td className="p-3 text-right text-amber-700 dark:text-amber-400">{proj.committedCost.toLocaleString()} {currency}</td>
                      <td className="p-3 text-right text-purple-600 dark:text-purple-400">{proj.actualIncurred.toLocaleString()} {currency}</td>
                      <td className="p-3 text-right font-bold text-cyan-600 dark:text-cyan-400">{proj.eacEstimatedAtCompletion.toLocaleString()} {currency}</td>
                      <td className="p-3 text-center font-sans">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          proj.health === 'On Track'
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                            : proj.health === 'At Risk'
                            ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                            : 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                        }`}>
                          {proj.health}
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

      {/* 11.01.04: Cost Center Budget View */}
      {activeTab === 'cost-center' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {costCenterSummaries.map(cc => (
              <div key={cc.costCenterId} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                    {cc.costCenterCode}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    cc.restrictionMode === 'Hard Block'
                      ? 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                      : cc.restrictionMode === 'Manager Override'
                      ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                      : 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                  }`}>
                    {cc.restrictionMode}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-3">{cc.costCenterName}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Manager: <span className="text-slate-800 dark:text-slate-200">{cc.managerName}</span> ({cc.departmentName})</p>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-sans font-bold">Allocated</span>
                    <p className="font-bold text-slate-900 dark:text-white mt-0.5">{cc.allocatedBudget.toLocaleString()} {currency}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-sans font-bold">Remaining</span>
                    <p className="font-bold text-cyan-600 dark:text-cyan-400 mt-0.5">{cc.remainingBudget.toLocaleString()} {currency}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 dark:text-slate-400 text-[11px]">Utilization</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-[11px]">{cc.utilizationPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${cc.utilizationPercent > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${cc.utilizationPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Create Master Budget */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-fadeIn">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create New Budget Envelope</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Define fiscal year envelope and operational structure.</p>

            <form onSubmit={handleCreateBudgetSubmit} className="space-y-4 mt-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Budget Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BM-2027-MAIN"
                    value={newBudgetCode}
                    onChange={(e) => setNewBudgetCode(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white mt-1 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Fiscal Year</label>
                  <input
                    type="number"
                    required
                    value={newFiscalYear}
                    onChange={(e) => setNewFiscalYear(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white mt-1 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Budget Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FY2027 Enterprise Operating Plan"
                  value={newBudgetName}
                  onChange={(e) => setNewBudgetName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white mt-1 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Budget Type</label>
                  <select
                    value={newBudgetType}
                    onChange={(e) => setNewBudgetType(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white mt-1 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Operating (OPEX)">Operating (OPEX)</option>
                    <option value="Capital (CAPEX)">Capital (CAPEX)</option>
                    <option value="Revenue">Revenue</option>
                    <option value="Cash Flow">Cash Flow</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Total Authorized Amount ({currency})</label>
                  <input
                    type="number"
                    required
                    value={newTotalAllocated}
                    onChange={(e) => setNewTotalAllocated(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white mt-1 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Description & Strategic Goals</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Notes on strategic drivers, assumptions, inflation rates..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white mt-1 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 cursor-pointer"
                >
                  Create Envelope
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Line Item */}
      {showAddLineModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-fadeIn">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add Budget Line Item</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Assign GL code and cost center allocation for {selectedBudget.budgetName}</p>

            <form onSubmit={handleAddLineSubmit} className="space-y-4 mt-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">GL Account Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GL-6450"
                    value={newLineAccountCode}
                    onChange={(e) => setNewLineAccountCode(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white mt-1 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Cost Center</label>
                  <select
                    value={newLineCostCenter}
                    onChange={(e) => setNewLineCostCenter(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white mt-1 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="CC-100">CC-100 (Executive HQ)</option>
                    <option value="CC-200">CC-200 (Muscat Plant)</option>
                    <option value="CC-300">CC-300 (Sohar Depot)</option>
                    <option value="CC-400">CC-400 (IT Operations)</option>
                    <option value="CC-500">CC-500 (Commercial Sales)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Line Item Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Plant Preventative Maintenance & Consumables"
                  value={newLineAccountName}
                  onChange={(e) => setNewLineAccountName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white mt-1 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category</label>
                  <select
                    value={newLineCategory}
                    onChange={(e) => setNewLineCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white mt-1 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Direct Cost of Goods Sold">Direct Cost of Goods Sold</option>
                    <option value="Operating Expenses (OPEX)">Operating Expenses (OPEX)</option>
                    <option value="Capital Expenditure (CAPEX)">Capital Expenditure (CAPEX)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Annual Budget Amount ({currency})</label>
                  <input
                    type="number"
                    required
                    value={newLineAnnual}
                    onChange={(e) => setNewLineAnnual(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white mt-1 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddLineModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 cursor-pointer"
                >
                  Save Line Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetStructureView;
