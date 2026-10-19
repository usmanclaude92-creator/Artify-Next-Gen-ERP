import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  Layers,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  PieChart as PieIcon,
  CheckCircle2,
  Clock,
  AlertTriangle
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { useBI } from '../../services/biStore';
import { BiFilterBar } from '../common/BiFilterBar';
import { DemoDataBanner } from '../common/DemoDataBanner';
import { BiMetricCard } from '../common/BiMetricCard';
import { exportToCSV, triggerPrintReport } from '../../services/exportService';
import { BrandWatermark } from '@/src/components/common/BrandWatermark';

const PIE_COLORS = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6'];

export const ExecutiveDashboardView: React.FC = () => {
  const {
    executiveMetrics,
    monthlyTrends,
    revenueByBranch,
    expensesByDept,
    customerAnalytics,
    supplierAnalytics,
    projectData,
    aiInsights,
    formatCurrency,
    currencySymbol,
    inspectExplainability
  } = useBI();

  const handleExport = () => {
    exportToCSV('Executive_Cockpit_Monthly_Financials', [
      { key: 'month', label: 'Fiscal Month' },
      { key: 'revenue', label: 'Gross Revenue (OMR)' },
      { key: 'expenses', label: 'Operating Expenses (OMR)' },
      { key: 'profit', label: 'Operating Profit (OMR)' },
      { key: 'cash', label: 'Cash & Liquidity (OMR)' }
    ], monthlyTrends);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Filters */}
      <DemoDataBanner moduleSource="Module 02.01 Executive Cockpit" />
      <BiFilterBar
        onRefresh={() => {}}
        onPrint={() => triggerPrintReport('Executive Strategic Dashboard')}
        onExport={handleExport}
      />

      {/* Row 1: Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <BiMetricCard
          id="kpi-rev"
          title="Gross Operating Revenue (YTD)"
          value={formatCurrency(executiveMetrics.revenueYTD)}
          change={`+${executiveMetrics.revenueGrowthPercent}% YoY`}
          changeType="positive"
          target={formatCurrency(14500000)}
          achievementPercent={102.4}
          icon={<DollarSign className="w-4 h-4" />}
          onClickInfo={() => inspectExplainability(aiInsights[0])}
        />
        <BiMetricCard
          id="kpi-gp"
          title="Gross Margin & EBITDA"
          value={formatCurrency(executiveMetrics.grossProfitYTD)}
          change={`${executiveMetrics.grossMarginPercent}% GP Margin`}
          changeType="positive"
          target="35.0% GP Target"
          achievementPercent={108.5}
          icon={<TrendingUp className="w-4 h-4" />}
          onClickInfo={() => inspectExplainability(aiInsights[0])}
        />
        <BiMetricCard
          id="kpi-cash"
          title="Cash & Short-Term Liquidity"
          value={formatCurrency(executiveMetrics.cashPosition)}
          change="+14.4% vs Prior Year"
          changeType="positive"
          subtitle={`Current Ratio: 2.03x`}
          icon={<ShieldCheck className="w-4 h-4" />}
        />
        <BiMetricCard
          id="kpi-wc"
          title="Net Working Capital"
          value={formatCurrency(executiveMetrics.workingCapital)}
          change={`AR: ${formatCurrency(executiveMetrics.accountsReceivable)}`}
          changeType="neutral"
          subtitle={`AP: ${formatCurrency(executiveMetrics.accountsPayable)}`}
          icon={<Layers className="w-4 h-4" />}
        />
      </div>

      {/* Row 2: Secondary Operational Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Inventory Valuation</span>
          <span className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100 mt-1 block">
            {formatCurrency(executiveMetrics.inventoryValuation)}
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 block">Turnover: 6.2x</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Active Capital Projects</span>
          <span className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100 mt-1 block">
            {executiveMetrics.activeProjectsCount} Projects
          </span>
          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5 block">
            Avg Margin: {executiveMetrics.averageProjectMarginPercent}%
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">DSO (Collection Cycle)</span>
          <span className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100 mt-1 block">
            {executiveMetrics.daysSalesOutstanding} Days
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 block">Target: 45 Days</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">DPO (Payable Terms)</span>
          <span className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100 mt-1 block">
            {executiveMetrics.daysPayableOutstanding} Days
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5 block">Optimal Terms</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Strategic KPI Health</span>
          <span className="text-sm font-bold font-mono text-emerald-700 dark:text-emerald-300 mt-1 block">
            {executiveMetrics.kpiAchievementRate}%
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 block">91.4% Target Met</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Outstanding Approvals</span>
          <span className="text-sm font-bold font-mono text-amber-700 dark:text-amber-300 mt-1 block">
            {executiveMetrics.outstandingApprovalsCount} Pending
          </span>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5 block">Avg SLA: 3.2 hrs</span>
        </div>
      </div>

      {/* Row 3: Visual Trends & Department Allocations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue vs Expenses Chart (2 Columns) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Revenue, Operating Expenses & Profit Trajectory</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Monthly breakdown for FY2026 in {currencySymbol}</p>
            </div>
            <span className="text-xs font-mono font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded">
              Trend: +12.4% YoY
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={val => `${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(val: any) => [`${currencySymbol} ${Number(val).toLocaleString()}`, '']}
                  contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', border: 'none' }}
                />
                <Legend />
                <Area type="monotone" dataKey="revenue" name="Gross Revenue" stroke="#4f46e5" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                <Area type="monotone" dataKey="expenses" name="Operating Expenses" stroke="#f43f5e" fillOpacity={0} strokeWidth={2} />
                <Area type="monotone" dataKey="profit" name="Net Profit" stroke="#10b981" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Operating Expenses by Department (1 Column) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Operating Expenses by Department</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Distribution of OPEX allocations</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expensesByDept}
                  dataKey="amount"
                  nameKey="department"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                >
                  {expensesByDept.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => [`${currencySymbol} ${Number(val).toLocaleString()}`, 'Spend']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 space-y-1.5 text-xs">
            {expensesByDept.map((dept, i) => (
              <div key={dept.department} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-slate-600 dark:text-slate-400 truncate">{dept.department}</span>
                </div>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{dept.share}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Regional Revenue & Top Strategic Accounts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Branch Performance */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Regional Branch Revenue Contribution</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Performance across Sultanate operating hubs</p>
            </div>
            <Building2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </div>

          <div className="space-y-3.5">
            {revenueByBranch.map(branch => (
              <div key={branch.branch} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{branch.branch}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{formatCurrency(branch.revenue)}</span>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1 rounded">{branch.growth}</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${branch.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Strategic Client Accounts */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Top Strategic Client Partnerships</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Tier 1 accounts, revenue contribution and DSO</p>
            </div>
            <Briefcase className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </div>

          <div className="space-y-2.5">
            {customerAnalytics.slice(0, 4).map((cust, i) => (
              <div key={cust.customerCode} className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">#{i + 1}</span>
                    {cust.customerName}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Tier: <strong className="text-slate-700 dark:text-slate-300">{cust.tier}</strong> • Margin: <strong className="text-emerald-700 dark:text-emerald-300">{cust.ytdGrossMarginPercent}%</strong>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-indigo-900 dark:text-indigo-100">{formatCurrency(cust.ytdRevenueOMR)}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">DSO: {cust.daysSalesOutstanding}d</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 5: AI Executive Insights & Diagnostic Alerts */}
      <div className="bg-gradient-to-r from-indigo-50 dark:from-indigo-900 via-indigo-50 dark:via-indigo-950 to-slate-50 dark:to-slate-900 rounded-2xl p-6 text-slate-900 dark:text-white shadow-xl relative overflow-hidden">
<BrandWatermark />
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-400/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">AI Executive Intelligence & Anomaly Radar</h3>
              <p className="text-xs text-indigo-800 dark:text-indigo-200">Real-time diagnostic telemetry, margin drivers, and variance alerts</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-semibold bg-indigo-500/30 text-indigo-800 dark:text-indigo-200 border border-indigo-400/30 px-2.5 py-1 rounded-full">
            Autonomous Insights
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {aiInsights.map(insight => (
            <div
              key={insight.id}
              className="bg-slate-900/10 dark:bg-white/10 hover:bg-slate-900/15 dark:hover:bg-white/15 border border-slate-900/10 dark:border-white/10 rounded-xl p-4 transition-all duration-200 flex flex-col justify-between backdrop-blur-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-indigo-800 dark:text-indigo-200 flex items-center gap-1.5">
                    {insight.severity === 'positive' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                    {insight.severity === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />}
                    {insight.severity === 'info' && <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                    {insight.title}
                  </span>
                  <span className="text-[10px] font-mono text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/50 px-1.5 py-0.5 rounded">
                    Score: {(insight.confidenceScore * 100).toFixed(0)}%
                  </span>
                </div>

                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed mb-3">{insight.summary}</p>
              </div>

              <div className="pt-2 border-t border-slate-900/10 dark:border-white/10 flex items-center justify-between text-xs">
                <span className="text-[11px] text-indigo-700 dark:text-indigo-300 font-medium truncate max-w-[70%]">
                  Action: {insight.actionableRecommendation}
                </span>
                <button
                  onClick={() => inspectExplainability(insight)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-800 dark:text-indigo-200 hover:text-slate-900 dark:hover:text-white underline underline-offset-2 shrink-0"
                >
                  Explain
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
