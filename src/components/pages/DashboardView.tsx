import React from 'react';
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  ShieldCheck,
  Building2,
  Truck,
  Users,
  HardHat,
  Cpu,
  Calendar
} from 'lucide-react';
import { ERP_MODULES } from '../../navigation/erpHierarchy';
import { ERPRouteState, ERPUserRole } from '../../types/erp';
import { IconRenderer } from '../common/IconRenderer';
import { BrandWatermark } from '@/src/components/common/BrandWatermark';

interface DashboardViewProps {
  onNavigate: (route: ERPRouteState) => void;
  activeRole: ERPUserRole;
  selectedCompanyId: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  activeRole
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-50 dark:from-slate-900 via-indigo-50 dark:via-indigo-950 to-slate-50 dark:to-slate-900 rounded-2xl p-6 text-slate-900 dark:text-white shadow-xl border border-slate-200 dark:border-slate-800 relative overflow-hidden isolate">
<BrandWatermark variant="mark" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-[11px] font-mono font-bold border border-indigo-400/30">
                ARTIFY ENTERPRISE CORE
              </span>
              <span className="text-slate-600 dark:text-slate-400 text-xs">• FY 2026 Consolidated View</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Executive Directorate Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1 max-w-2xl">
              Real-time multi-entity operations across 17 integrated modules, IFRS accounting standards, automated treasury feeds, and AI-driven predictive intelligence.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate({ view: 'ai' })}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>Launch AI Command Center</span>
            </button>
          </div>
        </div>

        {/* Subtle decorative grid background */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Group Revenue (YTD)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">OMR 28.45M</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +14.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">vs OMR 24.9M budget target</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Operating Expenses</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">OMR 19.82M</span>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center">
              <ArrowDownRight className="w-3 h-3" /> -2.4%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Operating margin: 30.3%</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Liquid Treasury & Cash</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">OMR 8.63M</span>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">8 Banks</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Automated daily balance sweep</p>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Project Backlog (EPC)</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <HardHat className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">OMR 84.20M</span>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">14 Sites</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Average CPI: 1.04 • SPI: 0.98</p>
        </div>
      </div>

      {/* Middle Section: AI Autonomous Insights & Urgent Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Insights Feed */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                AI Autonomous Intelligence & Anomaly Detection
              </h2>
            </div>
            <span className="text-[11px] font-mono font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/30">
              Continuous Scanning Active
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-500/10 border border-amber-200/80 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 dark:text-amber-100">Early Supplier Payment Discount Opportunity</span>
                  <span className="text-[10px] text-amber-700 dark:text-amber-300 font-mono">Module 03 — AP</span>
                </div>
                <p className="text-amber-800 dark:text-amber-200 mt-1">
                  Al-Maha Steel Mills invoice #INV-8819 (OMR 64,200) qualifies for 2.5% discount (OMR 1,605 savings) if authorized before Friday.
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() =>
                      onNavigate({
                        view: 'transaction',
                        moduleId: 'accounts-payable',
                        functionalAreaId: 'ap-processing',
                        processId: 'ap-proc-flow',
                        transactionId: 'tx-ap-inv'
                      })
                    }
                    className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-semibold"
                  >
                    Authorize Payment Batch
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-500/10 border border-indigo-200/80 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-900 dark:text-indigo-100">Material Cost Variance Detected on Muscat Marina Project</span>
                  <span className="text-[10px] text-indigo-700 dark:text-indigo-300 font-mono">Module 15 — Construction</span>
                </div>
                <p className="text-indigo-800 dark:text-indigo-200 mt-1">
                  Ready-mix concrete procurement variance reached +4.2% over BOQ baseline. AI predicts OMR 18,400 potential overrun if batching plant delivery route is not optimized.
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() =>
                      onNavigate({
                        view: 'module',
                        moduleId: 'construction'
                      })
                    }
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[11px] font-semibold"
                  >
                    View Project Cost Sheet
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200">VAT Reconciliation & IFRS 15 Revenue Audit Check</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Module 16 — Financials</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  All 1,420 tax invoices matched perfectly against input credit ledgers. 0 unmapped ledger anomalies found for Q2.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Pending Approvals & Tasks */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h2 className="font-bold text-sm text-slate-900 dark:text-slate-100">Executive Action Queue</h2>
              </div>
              <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded">
                3 Pending
              </span>
            </div>

            <div className="mt-4 space-y-2.5">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-colors">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <span>PO-2026-904 (Structural Steel)</span>
                  <span className="font-mono text-emerald-700 dark:text-emerald-300 font-bold">OMR 72,500</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Procurement • Awaiting CFO Signoff</p>
                <div className="mt-2 flex gap-1.5">
                  <button
                    onClick={() =>
                      onNavigate({
                        view: 'transaction',
                        moduleId: 'procurement',
                        functionalAreaId: 'purchase-orders',
                        processId: 'po-proc',
                        transactionId: 'tx-po-entry'
                      })
                    }
                    className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[10px] font-semibold"
                  >
                    Inspect Voucher
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-colors">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <span>Fixed Asset Capitalization #FA-04</span>
                  <span className="font-mono text-emerald-700 dark:text-emerald-300 font-bold">OMR 115,000</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Asset Management • CNC Machining Center</p>
                <div className="mt-2 flex gap-1.5">
                  <button
                    onClick={() =>
                      onNavigate({
                        view: 'transaction',
                        moduleId: 'fixed-assets',
                        functionalAreaId: 'asset-transactions',
                        processId: 'asset-trans-proc',
                        transactionId: 'tx-asset-cap'
                      })
                    }
                    className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[10px] font-semibold"
                  >
                    Inspect Voucher
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-colors">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <span>IPC-14 Marina Tower Subcontract</span>
                  <span className="font-mono text-emerald-700 dark:text-emerald-300 font-bold">OMR 480,000</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Construction • Consultant Approved</p>
                <div className="mt-2 flex gap-1.5">
                  <button
                    onClick={() =>
                      onNavigate({
                        view: 'transaction',
                        moduleId: 'construction',
                        functionalAreaId: 'ipc-management',
                        processId: 'ipc-proc',
                        transactionId: 'tx-ipc-cert'
                      })
                    }
                    className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[10px] font-semibold"
                  >
                    Inspect Voucher
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Signed as: <strong className="text-slate-700 dark:text-slate-300">{activeRole.title}</strong></span>
            <Clock className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* 17 ERP Modules Fast Jump Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="font-bold text-base text-slate-900 dark:text-slate-100">
                17 Enterprise Application Modules
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Complete Level-1 to Level-4 functional hierarchy, processes, and transactional screens.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
              17 Active Modules
            </span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {ERP_MODULES.map(mod => {
            return (
              <div
                key={mod.id}
                onClick={() => onNavigate({ view: 'module', moduleId: mod.id })}
                className="group p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer bg-slate-50/40 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-900 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 group-hover:bg-indigo-600 group-hover:text-white text-indigo-600 dark:text-indigo-400 flex items-center justify-center transition-colors">
                      <IconRenderer name={mod.icon} className="w-4 h-4" />
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {mod.code}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                    {mod.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {mod.description}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {mod.functionalAreas.length} Functional Areas
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
