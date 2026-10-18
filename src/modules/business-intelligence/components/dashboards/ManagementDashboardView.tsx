import React, { useState } from 'react';
import {
  LayoutGrid,
  Plus,
  RotateCcw,
  Sliders,
  Maximize2,
  Trash2,
  TrendingUp,
  BarChart2,
  DollarSign,
  Briefcase,
  AlertCircle,
  Clock,
  Sparkles,
  Check
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
import { useBI } from '../../services/biStore';
import { BiFilterBar } from '../common/BiFilterBar';
import { DemoDataBanner } from '../common/DemoDataBanner';
import { DashboardWidget } from '../../types';

export const ManagementDashboardView: React.FC = () => {
  const {
    managementWidgets,
    addWidgetToManagement,
    removeWidgetFromManagement,
    updateWidgetLayout,
    resetManagementLayout,
    monthlyTrends,
    revenueByBranch,
    customerAnalytics,
    supplierAnalytics,
    budgetVsActual,
    customerAging,
    supplierAging,
    aiInsights,
    formatCurrency,
    currencySymbol
  } = useBI();

  const [isCustomizeMode, setIsCustomizeMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);

  const handleSaveLayout = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
    setIsCustomizeMode(false);
  };

  const availableWidgetTemplates: Omit<DashboardWidget, 'id'>[] = [
    {
      title: 'Top Suppliers by Annual Spend',
      description: 'Spend concentration and on-time delivery rates',
      type: 'ranking_list',
      dataSourceId: 'ds-procurement-pos',
      width: '2',
      height: 'md',
      config: {}
    },
    {
      title: 'Department Budget Variance',
      description: 'Cost center budget vs actual variances (OMR)',
      type: 'bar_chart',
      dataSourceId: 'ds-budget-planning',
      width: '2',
      height: 'md',
      config: {}
    },
    {
      title: 'Customer AR Aging Distribution',
      description: 'Aging distribution across 30, 60, 90+ days',
      type: 'aging_bar',
      dataSourceId: 'ds-financial-gl',
      width: '2',
      height: 'md',
      config: {}
    }
  ];

  const handleAddWidget = (template: Omit<DashboardWidget, 'id'>) => {
    const newWidget: DashboardWidget = {
      ...template,
      id: `w-custom-${Date.now()}`
    };
    addWidgetToManagement(newWidget);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <DemoDataBanner moduleSource="Module 02.02 Management Dashboard & Custom Grid" />

      {/* Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Configurable Management Cockpit
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Personalize metrics, widget placement, and analytical dimensions for business unit reviews.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {savedNotification && (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-lg font-semibold animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              Layout Saved
            </span>
          )}

          <button
            onClick={() => setIsCustomizeMode(!isCustomizeMode)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
              isCustomizeMode
                ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-300 dark:border-indigo-500/40 text-indigo-700 dark:text-indigo-300'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            {isCustomizeMode ? 'Editing Layout...' : 'Customize Layout'}
          </button>

          {isCustomizeMode && (
            <>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Widget
              </button>

              <button
                onClick={resetManagementLayout}
                className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                title="Reset to Default Layout"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={handleSaveLayout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
              >
                Save Layout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Global BI Filter */}
      <BiFilterBar />

      {/* Dynamic Widget Grid (4 Column System) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {managementWidgets.map(widget => {
          // Calculate column span class
          let colSpan = 'lg:col-span-1';
          if (widget.width === '2') colSpan = 'lg:col-span-2';
          if (widget.width === '3') colSpan = 'lg:col-span-3';
          if (widget.width === '4' || widget.width === 'full') colSpan = 'lg:col-span-4';

          return (
            <div
              key={widget.id}
              className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-xs flex flex-col justify-between transition-all ${colSpan} ${
                isCustomizeMode ? 'ring-2 ring-indigo-400/50 border-indigo-300 dark:border-indigo-500/40' : ''
              }`}
            >
              {/* Widget Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">{widget.title}</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{widget.description}</p>
                </div>

                {isCustomizeMode && (
                  <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-1 rounded-lg">
                    {/* Width options */}
                    {(['1', '2', '3', '4'] as const).map(w => (
                      <button
                        key={w}
                        onClick={() => updateWidgetLayout(widget.id, w)}
                        className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${
                          widget.width === w ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {w}x
                      </button>
                    ))}
                    <button
                      onClick={() => removeWidgetFromManagement(widget.id)}
                      className="p-1 text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded"
                      title="Remove Widget"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Widget Body Renderer */}
              <div className="min-h-[160px] flex items-center justify-center">
                {widget.id === 'w-rev-trend' && (
                  <div className="w-full h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyTrends}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                        <YAxis stroke="#64748b" fontSize={11} tickFormatter={val => `${(val / 1000).toFixed(0)}k`} />
                        <Tooltip formatter={(val: any) => [`${currencySymbol} ${Number(val).toLocaleString()}`, '']} />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#4f46e5" strokeWidth={2.5} />
                        <Line type="monotone" dataKey="expenses" name="OPEX" stroke="#ef4444" strokeWidth={2} />
                        <Line type="monotone" dataKey="profit" name="Profit" stroke="#10b981" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {widget.id === 'w-ebitda-gauge' && (
                  <div className="text-center space-y-2">
                    <div className="relative inline-flex items-center justify-center">
                      <svg className="w-32 h-32">
                        <circle cx="64" cy="64" r="50" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
                        <circle
                          cx="64"
                          cy="64"
                          r="50"
                          stroke="#10b981"
                          strokeWidth="12"
                          fill="transparent"
                          strokeDasharray="314"
                          strokeDashoffset={314 - (314 * 16.99) / 25}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute text-center">
                        <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">16.99%</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Actual</span>
                      </div>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      Target: <strong className="text-slate-900 dark:text-slate-100">15.0%</strong> • Variance:{' '}
                      <strong className="text-emerald-600 dark:text-emerald-400">+1.99%</strong>
                    </div>
                  </div>
                )}

                {widget.id === 'w-branch-rev' && (
                  <div className="w-full h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueByBranch}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="branch" stroke="#64748b" fontSize={10} tickFormatter={val => val.split(' ')[0]} />
                        <YAxis stroke="#64748b" fontSize={11} tickFormatter={val => `${(val / 1000).toFixed(0)}k`} />
                        <Tooltip formatter={(val: any) => [`${currencySymbol} ${Number(val).toLocaleString()}`, 'Revenue']} />
                        <Bar dataKey="revenue" name="Revenue" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {widget.id === 'w-aging-summary' && (
                  <div className="w-full space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600 dark:text-slate-400">Current (Not Due)</span>
                      <div className="space-x-2 font-mono">
                        <span className="text-emerald-700 dark:text-emerald-300 font-bold">AR: {formatCurrency(2600000)}</span>
                        <span className="text-slate-500 dark:text-slate-400">|</span>
                        <span className="text-slate-700 dark:text-slate-300">AP: {formatCurrency(1680000)}</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden flex">
                      <div className="bg-emerald-500 h-full" style={{ width: '60%' }} />
                      <div className="bg-amber-500 h-full" style={{ width: '25%' }} />
                      <div className="bg-rose-500 h-full" style={{ width: '15%' }} />
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                      <div className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 p-1 rounded font-medium">1-30d: 945k</div>
                      <div className="bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-200 p-1 rounded font-medium">31-60d: 480k</div>
                      <div className="bg-rose-50 dark:bg-rose-500/10 text-rose-800 dark:text-rose-200 p-1 rounded font-medium">&gt;60d: 95k</div>
                    </div>
                  </div>
                )}

                {widget.id === 'w-top-customers' && (
                  <div className="w-full space-y-2">
                    {customerAnalytics.slice(0, 3).map((c, i) => (
                      <div key={c.customerCode} className="flex items-center justify-between text-xs p-1.5 rounded bg-slate-50 dark:bg-slate-800/50">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[60%]">
                          {i + 1}. {c.customerName}
                        </span>
                        <span className="font-mono font-bold text-indigo-900 dark:text-indigo-100">{formatCurrency(c.ytdRevenueOMR)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {widget.id === 'w-ai-radar' && (
                  <div className="w-full space-y-2">
                    {aiInsights.slice(0, 2).map(ins => (
                      <div key={ins.id} className="p-2 rounded bg-indigo-50/50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-xs">
                        <div className="font-bold text-indigo-950 truncate flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400 shrink-0" />
                          {ins.title}
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">{ins.summary}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Dynamic/Custom template renderers */}
                {widget.title.includes('Budget Variance') && (
                  <div className="w-full h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={budgetVsActual}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="accountOrDept" stroke="#64748b" fontSize={9} tickFormatter={v => v.split(' ')[0]} />
                        <YAxis stroke="#64748b" fontSize={10} />
                        <Tooltip formatter={(val: any) => [`${currencySymbol} ${Number(val).toLocaleString()}`, '']} />
                        <Bar dataKey="ytdBudgetOMR" name="Budget" fill="#94a3b8" />
                        <Bar dataKey="ytdActualOMR" name="Actual" fill="#4f46e5" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {widget.title.includes('Suppliers') && (
                  <div className="w-full space-y-2">
                    {supplierAnalytics.slice(0, 3).map((s, i) => (
                      <div key={s.supplierCode} className="flex items-center justify-between text-xs p-1.5 rounded bg-slate-50 dark:bg-slate-800/50">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[60%]">
                          {i + 1}. {s.supplierName}
                        </span>
                        <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{formatCurrency(s.ytdSpendOMR)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Widget Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Add Analytics Widget</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-400 text-xs font-semibold"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-3">
              {availableWidgetTemplates.map((tpl, i) => (
                <div
                  key={i}
                  onClick={() => handleAddWidget(tpl)}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/30 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{tpl.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{tpl.description}</p>
                  </div>
                  <Plus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
