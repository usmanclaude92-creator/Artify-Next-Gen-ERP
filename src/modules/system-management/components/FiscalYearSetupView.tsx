import React, { useState } from 'react';
import {
  Calendar,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Download,
  Edit2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
  FileCheck2,
  Settings,
  HelpCircle,
  X
} from 'lucide-react';
import { useSystemManagement } from '../services/systemManagementStore';
import { FiscalYear } from '../types';
import { notify } from '@/src/components/common/Feedback';

interface FiscalYearSetupViewProps {
  initialTransactionId?: string;
  initialTransactionCode?: string;
}

export const FiscalYearSetupView: React.FC<FiscalYearSetupViewProps> = ({
  initialTransactionId,
  initialTransactionCode
}) => {
  const {
    companies = [],
    fiscalYears = [],
    addFiscalYear
  } = useSystemManagement();

  const [activeTab, setActiveTab] = useState<'overview' | 'opening' | 'closing' | 'configuration'>('overview');

  React.useEffect(() => {
    if (initialTransactionId === 'tx-fy-creation' || initialTransactionCode === '01.01.04.01') {
      setActiveTab('overview');
    } else if (initialTransactionId === 'tx-fy-opening' || initialTransactionCode === '01.01.04.02') {
      setActiveTab('opening');
    } else if (initialTransactionId === 'tx-fy-closing' || initialTransactionCode === '01.01.04.03') {
      setActiveTab('closing');
    } else if (initialTransactionId === 'tx-ye-config' || initialTransactionCode === '01.01.04.04') {
      setActiveTab('configuration');
    }
  }, [initialTransactionId, initialTransactionCode]);
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState('ALL');
  const [isNewFyModalOpen, setIsNewFyModalOpen] = useState(false);

  // Form state for creating a new Fiscal Year
  const [fyForm, setFyForm] = useState({
    yearCode: 'FY 2027',
    companyId: companies?.[0]?.id || 'comp-1',
    startDate: '2027-01-01',
    endDate: '2027-12-31',
    totalPeriods: 12,
    openPeriodsCount: 12,
    status: 'Planning' as FiscalYear['status'],
    isCurrent: false
  });

  // Year End Closing Wizard State
  const [closingStep, setClosingStep] = useState(1);
  const [closingChecklist, setClosingChecklist] = useState({
    subLedgersReconciled: true,
    bankReconciliationComplete: true,
    fixedAssetsDepreciationPosted: true,
    foreignCurrencyRevaluationRun: true,
    inventoryStockCountAudited: true,
    taxReturnProvisionFinalized: true
  });

  // Year End Configuration State
  const [yeConfig, setYeConfig] = useState({
    retainedEarningsAccount: '310100 - Retained Earnings (Accumulated P&L)',
    currentYearEarningsAccount: '310200 - Current Year Net Surplus/Loss',
    autoDepreciationOnClose: true,
    enableAdjustmentPeriod13: true,
    blockPostingsToClosedYears: true,
    requireCfoSignoffForYearEnd: true
  });

  const handleCreateFY = (e: React.FormEvent) => {
    e.preventDefault();
    const comp = companies.find(c => c.id === fyForm.companyId);
    addFiscalYear({
      ...fyForm,
      companyName: comp?.legalName || 'Unknown Company'
    });
    setIsNewFyModalOpen(false);
  };

  const filteredFiscalYears = fiscalYears.filter(fy => {
    return selectedCompanyFilter === 'ALL' || fy.companyId === selectedCompanyFilter;
  });

  return (
    <div id="fiscal-year-setup-view" className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 font-semibold border border-amber-200 dark:border-amber-800">
                  01.01.04
                </span>
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Fiscal Year Setup
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
                  Statutory Calendar
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
                Manage statutory accounting years, fiscal calendar opening protocols, year-end financial close, and retained earnings mapping.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsNewFyModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Fiscal Year</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 mt-6 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>01.01.04.01 Fiscal Year Creation ({fiscalYears.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('opening')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'opening'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Unlock className="w-4 h-4" />
            <span>01.01.04.02 Fiscal Year Opening</span>
          </button>

          <button
            onClick={() => setActiveTab('closing')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'closing'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>01.01.04.03 Fiscal Year Closing</span>
          </button>

          <button
            onClick={() => setActiveTab('configuration')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'configuration'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>01.01.04.04 Year-End Configuration</span>
          </button>
        </div>
      </div>

      {/* Filter and Quick Stats */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Filter Company:</span>
          <select
            value={selectedCompanyFilter}
            onChange={e => setSelectedCompanyFilter(e.target.value)}
            className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-slate-800 dark:text-slate-200 font-medium shadow-xs focus:outline-none"
          >
            <option value="ALL">All Legal Entities</option>
            {companies.map(c => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.legalName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Current Active Calendar: <strong>FY 2026 (01 Jan 2026 – 31 Dec 2026)</strong></span>
        </div>
      </div>

      {/* Tab 1: Overview / Creation */}
      {activeTab === 'overview' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Statutory Fiscal Years Registry</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3">Fiscal Year Code</th>
                  <th className="px-4 py-3">Legal Company</th>
                  <th className="px-4 py-3">Start Date</th>
                  <th className="px-4 py-3">End Date</th>
                  <th className="px-4 py-3">Total Periods</th>
                  <th className="px-4 py-3">Open Periods</th>
                  <th className="px-4 py-3">Current Active</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredFiscalYears.map(fy => (
                  <tr
                    key={fy.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-5 py-3.5 font-bold font-mono text-slate-900 dark:text-slate-100 text-xs">
                      {fy.yearCode}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-800 dark:text-slate-200">
                      {fy.companyName}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-600 dark:text-slate-400">
                      {fy.startDate}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-600 dark:text-slate-400">
                      {fy.endDate}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-700 dark:text-slate-300">
                      {fy.totalPeriods} Monthly
                    </td>
                    <td className="px-4 py-3.5 font-bold text-indigo-600 dark:text-indigo-400">
                      {fy.openPeriodsCount} Open
                    </td>
                    <td className="px-4 py-3.5">
                      {fy.isCurrent ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 text-[10px] font-bold">
                          CURRENT FY
                        </span>
                      ) : (
                        <span className="text-slate-600 dark:text-slate-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          fy.status === 'Open'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:border-emerald-500/30 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : fy.status === 'Planning'
                            ? 'bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-500/30'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {fy.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Fiscal Year Opening */}
      {activeTab === 'opening' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs p-6 space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Unlock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Fiscal Year Opening Routine & Balance Carry-Forward</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Initialize next fiscal year accounting ledgers, carry forward balance sheet balances, and open Period 01 for transactional postings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>1. General Ledger Rollover</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Asset, liability, and equity account closing balances carried forward as beginning balances of FY 2027.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>2. Sub-Ledger Balances</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                AP vendor open items, AR customer outstanding receivables, and inventory stock valuations initialized.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>3. Period 01 Activation</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Period 01 (January 2027) status set to Open for all legal companies and operational branches.
              </p>
            </div>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                27
              </div>
              <div>
                <h4 className="font-bold text-xs text-indigo-950 dark:text-indigo-200">
                  Ready to Open FY 2027
                </h4>
                <p className="text-[11px] text-indigo-700 dark:text-indigo-400">
                  All prior period pre-conditions verified. Zero unposted draft batches detected in sub-ledgers.
                </p>
              </div>
            </div>

            <button
              onClick={() => notify('Fiscal Year 2027 opening routine initialized successfully!')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Execute Opening Protocol
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Fiscal Year Closing */}
      {activeTab === 'closing' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs p-6 space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span>Year-End Financial Closing Wizard</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Final audit reconciliation, profit/loss retained earnings closing entries, and statutory hard-lock.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Year-End Closing Pre-Audit Checklist
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(closingChecklist).map(([key, val]) => (
                <label
                  key={key}
                  className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={val}
                    onChange={e => setClosingChecklist({ ...closingChecklist, [key]: e.target.checked })}
                    className="rounded border-slate-300 dark:border-slate-600 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500"
                  />
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200 capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <div>
                <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  FY 2025 Audit Hard-Close Status
                </h4>
                <p className="text-[11px] text-amber-700 dark:text-amber-400">
                  Year closed and retained earnings of OMR 1,420,500 successfully transferred to GL #310100.
                </p>
              </div>
            </div>

            <span className="px-3 py-1 bg-amber-200 dark:bg-amber-500/30 text-amber-900 dark:text-amber-100 rounded-full font-bold text-xs">
              Closed & Archived
            </span>
          </div>
        </div>
      )}

      {/* Tab 4: Year-End Configuration */}
      {activeTab === 'configuration' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs p-6 space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Fiscal Year Parameters & General Ledger Mapping</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Retained Earnings Account (Equity Rollover) *
                </label>
                <input
                  type="text"
                  value={yeConfig.retainedEarningsAccount}
                  onChange={e => setYeConfig({ ...yeConfig, retainedEarningsAccount: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Current Year Net Surplus/Loss Account *
                </label>
                <input
                  type="text"
                  value={yeConfig.currentYearEarningsAccount}
                  onChange={e => setYeConfig({ ...yeConfig, currentYearEarningsAccount: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={yeConfig.autoDepreciationOnClose}
                  onChange={e => setYeConfig({ ...yeConfig, autoDepreciationOnClose: e.target.checked })}
                  className="rounded border-slate-300 dark:border-slate-600 text-indigo-600 dark:text-indigo-400"
                />
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  Auto-run final month depreciation batch during year-end close
                </span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={yeConfig.enableAdjustmentPeriod13}
                  onChange={e => setYeConfig({ ...yeConfig, enableAdjustmentPeriod13: e.target.checked })}
                  className="rounded border-slate-300 dark:border-slate-600 text-indigo-600 dark:text-indigo-400"
                />
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  Enable Special Period 13 (P13) for post-audit statutory adjustments
                </span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={yeConfig.blockPostingsToClosedYears}
                  onChange={e => setYeConfig({ ...yeConfig, blockPostingsToClosedYears: e.target.checked })}
                  className="rounded border-slate-300 dark:border-slate-600 text-indigo-600 dark:text-indigo-400"
                />
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  Strictly block all transactional postings to closed fiscal years
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* New Fiscal Year Modal */}
      {isNewFyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Create Statutory Fiscal Year</span>
              </h3>
              <button
                onClick={() => setIsNewFyModalOpen(false)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFY} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Fiscal Year Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={fyForm.yearCode}
                    onChange={e => setFyForm({ ...fyForm, yearCode: e.target.value })}
                    placeholder="e.g. FY 2027"
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Legal Company *
                  </label>
                  <select
                    value={fyForm.companyId}
                    onChange={e => setFyForm({ ...fyForm, companyId: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
                  >
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.code} - {c.legalName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={fyForm.startDate}
                    onChange={e => setFyForm({ ...fyForm, startDate: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={fyForm.endDate}
                    onChange={e => setFyForm({ ...fyForm, endDate: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewFyModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs cursor-pointer"
                >
                  Create Fiscal Year
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
