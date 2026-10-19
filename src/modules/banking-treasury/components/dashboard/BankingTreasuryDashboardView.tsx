import React, { useState } from 'react';
import { useBankingTreasury } from '../../services/bankingTreasuryStore';
import {
  Landmark,
  DollarSign,
  TrendingUp,
  CreditCard,
  ArrowDownLeft,
  CheckCircle,
  Coins,
  Briefcase,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Calendar,
  Clock,
  ChevronRight,
  FileSpreadsheet,
  CheckCircle2,
  RefreshCw,
  Eye,
  Sliders
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface DashboardProps {
  onNavigateToSubView: (faCodeOrId: string) => void;
}

export const BankingTreasuryDashboardView: React.FC<DashboardProps> = ({ onNavigateToSubView }) => {
  const {
    bankAccounts,
    cashAccounts,
    approvalQueue,
    cashFlowForecast,
    bankFacilities,
    postDatedCheques,
    totalLiquidityOMR,
    totalFacilitiesHeadroomOMR,
    totalUnreconciledDifferenceOMR,
    pendingApprovalsCount,
    totalPdcReceivablesOMR,
    totalPdcPayablesOMR
  } = useBankingTreasury();

  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [selectedCurrencyView, setSelectedCurrencyView] = useState<'OMR' | 'USD' | 'ALL'>('OMR');

  const formatCurrency = (val: number, curr = 'OMR') => {
    return `${curr} ${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const chartData = cashFlowForecast.map((item) => ({
    name: item.weekLabel.split(' ')[1] || item.weekLabel,
    Inflows: item.projectedInflows.totalInflow,
    Outflows: item.projectedOutflows.totalOutflow,
    NetPosition: item.closingTreasuryBalance
  }));

  const maturingPDCs = postDatedCheques.filter((p) => p.status === 'In Vault' || p.status === 'Deposited').slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Executive Liquidity KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Consolidated Liquidity</span>
            <span className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Landmark className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(totalLiquidityOMR)}</h3>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+8.4% vs previous 30-day average</span>
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{bankAccounts.length} Bank Accounts</span>
            <span>{cashAccounts.length} Cash Vaults</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Credit Facility Headroom</span>
            <span className="p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Briefcase className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(totalFacilitiesHeadroomOMR)}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1 mt-1">
              <span>Sanctioned: {formatCurrency(7700000)}</span>
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{bankFacilities.length} Active Credit Lines</span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">57.4% Available</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Unreconciled Variance</span>
            <span className="p-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <CheckCircle className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400">{formatCurrency(totalUnreconciledDifferenceOMR)}</h3>
            <p className="text-xs text-amber-700 dark:text-amber-300 font-medium flex items-center gap-1 mt-1">
              <span>4 items awaiting statement matching</span>
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Last MT940 Import</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Today 06:30</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">PDC Vault Custody</span>
            <span className="p-2 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <CreditCard className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(totalPdcReceivablesOMR)}</h3>
            <p className="text-xs text-purple-600 dark:text-purple-400 font-medium flex items-center gap-1 mt-1">
              <span>Payables in Vault: {formatCurrency(totalPdcPayablesOMR)}</span>
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{postDatedCheques.length} Cheques Registered</span>
            <span className="text-purple-700 dark:text-purple-300 font-semibold">1 Maturing in 5d</span>
          </div>
        </div>
      </div>

      {/* AI Treasury Copilot & Actionable Insights */}
      <div className="bg-linear-to-r from-slate-50 dark:from-slate-900 via-slate-100 dark:via-slate-800 to-indigo-50 dark:to-indigo-950 text-slate-900 dark:text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>AI Autonomous Treasury Engine — Active</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Liquidity Optimization & Automated Cash Sweeping Briefing
            </h2>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Consolidated cash balance stands at <strong className="text-emerald-700 dark:text-emerald-300">{formatCurrency(totalLiquidityOMR)}</strong>. 
              The algorithm detects an overnight idle balance of OMR 1.2M in Bank Muscat operating account; sweeping to Sohar 30-day call account @ 5.15% pa will yield approximately <strong className="text-slate-900 dark:text-white">OMR 5,150</strong> monthly incremental interest with zero operational friction.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onNavigateToSubView('04.05')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Run Auto-Reconcile (4 Items)</span>
            </button>
            <button
              onClick={() => onNavigateToSubView('04.07')}
              className="px-4 py-2.5 rounded-xl bg-slate-900/10 dark:bg-white/10 hover:bg-slate-900/20 dark:hover:bg-white/20 text-slate-900 dark:text-white text-xs font-bold transition-all border border-slate-900/15 dark:border-white/15 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sliders className="w-4 h-4" />
              <span>13-Week Cash Simulator</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Cash Flow Forecast Chart + Live Bank Position */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Flow Forecast 13-Week View */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Rolling Operational Cash Flow Projections (13-Week)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Projected customer inflows vs vendor and salary disbursements</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 rounded-md border border-emerald-200 dark:border-emerald-500/30">
                Optimal Liquidity
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value: any) => [`OMR ${Number(value).toLocaleString()}`, '']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="Inflows" fill="#10b981" radius={[4, 4, 0, 0]} name="Projected Inflows" />
                <Bar dataKey="Outflows" fill="#ef4444" radius={[4, 4, 0, 0]} name="Projected Outflows" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Operating Bank Accounts Snapshot */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Landmark className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Operating Bank Balances</span>
              </h3>
              <button
                onClick={() => onNavigateToSubView('04.01')}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 font-semibold cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {bankAccounts.slice(0, 4).map((acc) => (
                <div key={acc.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[170px]">{acc.bankName}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{acc.iban.slice(0, 14)}...</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {formatCurrency(acc.currentBookBalance, acc.currency)}
                      </p>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        {acc.accountType}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Live Exchange Peg</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">1 USD = 0.38500 OMR</span>
          </div>
        </div>
      </div>

      {/* Module 04 Sub-Functional Areas Navigation Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-slate-700 dark:text-slate-300" />
          <span>Functional Area Direct Navigation (04.01 – 04.07)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigateToSubView('04.01')}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-400 hover:shadow-xs transition-all text-left bg-slate-50/50 dark:bg-slate-800/50 hover:bg-amber-50/30 dark:hover:bg-amber-500/30 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Landmark className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-700 dark:group-hover:text-amber-300">04.01 Bank Management</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Bank Master, Bank Accounts, Signatory Mandates, and Credit Limits.
            </p>
          </button>

          <button
            onClick={() => onNavigateToSubView('04.02')}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-400 hover:shadow-xs transition-all text-left bg-slate-50/50 dark:bg-slate-800/50 hover:bg-emerald-50/30 dark:hover:bg-emerald-500/30 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <DollarSign className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">04.02 Cash Management</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Physical Vaults, Till Drawers, Official Cash Receipts, and Cash Payments.
            </p>
          </button>

          <button
            onClick={() => onNavigateToSubView('04.03')}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:shadow-xs transition-all text-left bg-slate-50/50 dark:bg-slate-800/50 hover:bg-blue-50/30 dark:hover:bg-blue-500/30 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <CreditCard className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-300">04.03 Payment Management</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Bank Transfers, Cheque Printing, Electronic WPS Batches & Approvals.
            </p>
          </button>

          <button
            onClick={() => onNavigateToSubView('04.04')}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-400 hover:shadow-xs transition-all text-left bg-slate-50/50 dark:bg-slate-800/50 hover:bg-teal-50/30 dark:hover:bg-teal-500/30 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-teal-700 dark:group-hover:text-teal-300">04.04 Receipt Management</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Customer Collections, Other Receipts, Bank Deposit Slips & Allocation.
            </p>
          </button>

          <button
            onClick={() => onNavigateToSubView('04.05')}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:shadow-xs transition-all text-left bg-slate-50/50 dark:bg-slate-800/50 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/30 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <CheckCircle className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-300">04.05 Bank Reconciliation</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Statement Feeds (MT940/CSV), Auto-Matching Engine & Adjustments.
            </p>
          </button>

          <button
            onClick={() => onNavigateToSubView('04.06')}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-orange-400 hover:shadow-xs transition-all text-left bg-slate-50/50 dark:bg-slate-800/50 hover:bg-orange-50/30 dark:hover:bg-orange-500/30 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Coins className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-orange-700 dark:group-hover:text-orange-300">04.06 Petty Cash</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Imprest Fund Floats, Staff Advances (IOUs), Expense Claims & Audit.
            </p>
          </button>

          <button
            onClick={() => onNavigateToSubView('04.07')}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-purple-400 hover:shadow-xs transition-all text-left bg-slate-50/50 dark:bg-slate-800/50 hover:bg-purple-50/30 dark:hover:bg-purple-500/30 group cursor-pointer col-span-1 md:col-span-2"
          >
            <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-700 dark:group-hover:text-purple-300">04.07 Treasury Management</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Cash Flow Forecasts, Liquidity Positions, Credit Facilities (LC/BG), Bank Charges Audit & Post-Dated Cheque Vault.
            </p>
          </button>
        </div>
      </div>

      {/* Pending Payment Approvals & Maturing Post-Dated Cheques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending High-Value Approvals */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span>Pending Payment Sign-offs ({pendingApprovalsCount})</span>
            </h3>
            <button
              onClick={() => onNavigateToSubView('04.03')}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 font-semibold cursor-pointer"
            >
              Open Approvals Queue
            </button>
          </div>

          <div className="space-y-3">
            {approvalQueue.slice(0, 3).map((item) => (
              <div key={item.id} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                      {item.transactionRef}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-200">
                      {item.requiredApprovalLevel}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">{item.beneficiaryName}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Submitted by: {item.submittedBy}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{formatCurrency(item.amount, item.currency)}</p>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 justify-end mt-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>AML Clear</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Post-Dated Cheques Approaching Maturity */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Maturing Post-Dated Cheques</span>
            </h3>
            <button
              onClick={() => onNavigateToSubView('04.07')}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 font-semibold cursor-pointer"
            >
              Manage PDC Vault
            </button>
          </div>

          <div className="space-y-3">
            {maturingPDCs.map((pdc) => (
              <div key={pdc.id} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                      Chq #{pdc.chequeNumber}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-200">
                      {pdc.direction.startsWith('Rec') ? 'Receivable' : 'Payable'}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">{pdc.drawerOrPayeeName}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Maturity Date: {pdc.maturityDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{formatCurrency(pdc.amount, pdc.currency)}</p>
                  <span className="text-[10px] text-purple-700 dark:text-purple-300 font-bold bg-purple-50 dark:bg-purple-500/10 px-2 py-0.5 rounded-md inline-block mt-1">
                    {pdc.daysUntilMaturity} Days Left
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
