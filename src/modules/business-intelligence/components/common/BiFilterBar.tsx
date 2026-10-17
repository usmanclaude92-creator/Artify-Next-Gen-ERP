import React from 'react';
import { Calendar, Building2, MapPin, DollarSign, Filter, Printer, Download, RefreshCw } from 'lucide-react';
import { useBI } from '../../services/biStore';
import { PeriodFilter, CurrencyCode } from '../../types';

interface BiFilterBarProps {
  onRefresh?: () => void;
  onPrint?: () => void;
  onExport?: () => void;
  showComparison?: boolean;
}

export const BiFilterBar: React.FC<BiFilterBarProps> = ({
  onRefresh,
  onPrint,
  onExport,
  showComparison = true
}) => {
  const { filters, setFilters } = useBI();

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xs space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left Side: Filter Selectors */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Period Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5">
            <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <select
              value={filters.period}
              onChange={e => setFilters(prev => ({ ...prev, period: e.target.value as PeriodFilter }))}
              className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
            >
              <option value="this_month">This Month (August 2026)</option>
              <option value="last_month">Last Month (July 2026)</option>
              <option value="this_quarter">This Quarter (Q3 2026)</option>
              <option value="last_quarter">Last Quarter (Q2 2026)</option>
              <option value="this_year">This Fiscal Year (FY2026 YTD)</option>
              <option value="last_year">Last Fiscal Year (FY2025)</option>
              <option value="this_week">This Week</option>
              <option value="today">Today</option>
            </select>
          </div>

          {/* Company / Legal Entity */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5">
            <Building2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <select
              value={filters.companyId}
              onChange={e => setFilters(prev => ({ ...prev, companyId: e.target.value }))}
              className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
            >
              <option value="comp-all">All Consolidated Entities</option>
              <option value="comp-01">Artify Group Holdings SAOG</option>
              <option value="comp-02">Artify Manufacturing & Heavy Industries LLC</option>
              <option value="comp-03">Artify Engineering Contracting LLC</option>
            </select>
          </div>

          {/* Branch / Operating Site */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5">
            <MapPin className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <select
              value={filters.branchId || 'all'}
              onChange={e => setFilters(prev => ({ ...prev, branchId: e.target.value }))}
              className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Operating Branches</option>
              <option value="branch-01">Muscat HQ & Capital Region</option>
              <option value="branch-02">Sohar Industrial Freezone Plant</option>
              <option value="branch-03">Salalah Port Logistics Hub</option>
              <option value="branch-04">Nizwa Regional Distribution Center</option>
            </select>
          </div>

          {/* Reporting Currency */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5">
            <DollarSign className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <select
              value={filters.currency}
              onChange={e => setFilters(prev => ({ ...prev, currency: e.target.value as CurrencyCode }))}
              className="bg-transparent text-xs font-bold text-indigo-700 dark:text-indigo-300 focus:outline-hidden cursor-pointer"
            >
              <option value="OMR">OMR (Omani Rial - Base)</option>
              <option value="USD">USD ($ US Dollar @ 2.60)</option>
              <option value="AED">AED (UAE Dirham @ 9.54)</option>
              <option value="SAR">SAR (Saudi Riyal @ 9.75)</option>
              <option value="EUR">EUR (€ Euro @ 2.38)</option>
              <option value="GBP">GBP (£ British Pound @ 2.06)</option>
            </select>
          </div>

          {/* Comparison Baseline */}
          {showComparison && (
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Compare vs:</span>
              <select
                value={filters.comparisonPeriod || 'previous_period'}
                onChange={e => setFilters(prev => ({ ...prev, comparisonPeriod: e.target.value as any }))}
                className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
              >
                <option value="previous_period">Prior Period (Sequential)</option>
                <option value="previous_year">Prior Year Same Period (YoY)</option>
                <option value="budget">Approved Operating Budget</option>
                <option value="none">No Comparison</option>
              </select>
            </div>
          )}
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              title="Refresh Analytics Dataset"
              className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          {onPrint && (
            <button
              onClick={onPrint}
              title="Print Executive Statement"
              className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>
          )}

          {onExport && (
            <button
              onClick={onExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
