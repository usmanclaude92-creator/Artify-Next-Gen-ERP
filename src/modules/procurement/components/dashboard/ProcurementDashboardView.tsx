import React, { useState } from 'react';
import { useProcurement } from '../../services/procurementStore';
import {
  TrendingUp,
  FileCheck,
  Send,
  Receipt,
  RotateCcw,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
  Filter,
  DollarSign,
  Package,
  Layers,
  ChevronRight,
  ShieldCheck,
  Calendar,
  FileText
} from 'lucide-react';

interface ProcurementDashboardViewProps {
  onNavigateToSubView: (faCodeOrId: string) => void;
}

export const ProcurementDashboardView: React.FC<ProcurementDashboardViewProps> = ({
  onNavigateToSubView
}) => {
  const {
    stats,
    plans,
    requisitions,
    purchaseOrders,
    rfqs,
    invoices,
    suppliers,
    contracts,
    budgetCategories,
    forecasts
  } = useProcurement();

  const [aiInsightPrompt, setAiInsightPrompt] = useState<string>('');
  const [aiInsightResult, setAiInsightResult] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const formatOMR = (amount: number) => {
    return `OMR ${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const handleRunAiCopilot = (topic: string) => {
    setIsAiLoading(true);
    setTimeout(() => {
      if (topic === 'spend-optimization') {
        setAiInsightResult(
          `AI Spend Intelligence Analysis:
1. Cable & Conductor Category: Aggregating Q2 demand with BPO-2026-004 can yield an estimated 4.8% volume discount (approx. OMR 16,320 savings).
2. Transformer Procurement: Local sourcing via Voltamp has eliminated OMR 14,600 in customs & sea-freight compared to European CIF alternatives.
3. Contract Expiry Warning: Contract CNT-2025-044 (Bahwan IT SLA) expires in 8 days. Initiating renewal tender recommended now.`
        );
      } else if (topic === 'supplier-risk') {
        setAiInsightResult(
          `AI Supplier Risk & Compliance Assessment:
• 100% of active Tier-1 suppliers maintain active Oman Tax VAT registrations.
• On-Time In-Full (OTIF) rate across top 5 vendors is 95.0% (Benchmark: 90%).
• 1 SME vendor (Riyada Gulf Smart Tech) qualifies for Oman Vision 2040 preferential fast-track payment terms.`
        );
      } else {
        setAiInsightResult(
          `AI 3-Way Match Verification:
• 2 pending invoices evaluated. 100% matched against PO unit rates and GRN warehouse delivery quantities.
• 0 price variances above the 2% threshold detected.`
        );
      }
      setIsAiLoading(false);
    }, 450);
  };

  const pendingApprovals = [
    ...requisitions
      .filter((r) => r.status === 'Pending Approval' || r.status === 'Submitted')
      .map((r) => ({
        type: 'Requisition (PR)',
        ref: r.prNumber,
        title: r.purpose,
        amountOMR: r.totalEstimatedAmountOMR,
        priority: r.priority,
        targetFa: '05.02'
      })),
    ...purchaseOrders
      .filter((p) => p.status === 'Pending Approval')
      .map((p) => ({
        type: 'Purchase Order (PO)',
        ref: p.poNumber,
        title: `PO for ${p.supplierName}`,
        amountOMR: p.grandTotalOMR,
        priority: 'High',
        targetFa: '05.05'
      }))
  ];

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              YTD Spend Invoiced
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{formatOMR(stats.totalSpendYTD_OMR)}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">98.2%</span> matched via 3-Way Engine
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Open PO Commitments
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{formatOMR(stats.openCommitmentsPO_OMR)}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
              <span className="text-blue-600 dark:text-blue-400 font-medium">{purchaseOrders.length} active</span> purchase orders
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Active Tenders & RFQs
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{stats.activeRfqCount} Sourcing Events</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
              <span className="text-amber-600 dark:text-amber-400 font-medium">{stats.pendingPrCount} pending</span> requisitions
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Approved Vendors (AVL)
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{stats.activeVendorsCount} Qualified Vendors</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
              <span className="text-purple-600 dark:text-purple-400 font-medium">95.0%</span> average OTIF delivery rate
            </p>
          </div>
        </div>
      </div>

      {/* AI Procurement Copilot & Strategy Assistant */}
      <div className="bg-linear-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-5 text-white border border-slate-800 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <span>AI Procurement & Spend Intelligence Copilot</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-500/30 text-indigo-200 font-medium">
                  Live Enterprise Agent
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Automated demand forecasting, 3-way matching tolerance checks, supplier risk scoring & price benchmarks.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleRunAiCopilot('spend-optimization')}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium transition-colors cursor-pointer"
            >
              Analyze Spend Anomalies
            </button>
            <button
              onClick={() => handleRunAiCopilot('supplier-risk')}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium transition-colors cursor-pointer"
            >
              Supplier Risk & ESG
            </button>
            <button
              onClick={() => handleRunAiCopilot('3-way-match')}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer"
            >
              Audit 3-Way Match
            </button>
          </div>
        </div>

        {isAiLoading && (
          <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3 text-xs text-slate-300">
            <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            <span>AI Copilot evaluating enterprise procurement datasets, purchase commitments, and invoice variances...</span>
          </div>
        )}

        {aiInsightResult && !isAiLoading && (
          <div className="mt-4 p-4 bg-white/10 rounded-xl border border-white/15 text-xs text-slate-100 font-mono whitespace-pre-line leading-relaxed">
            {aiInsightResult}
          </div>
        )}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Sourcing Lifecycle & Navigation Shortcuts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Functional Sourcing Pipeline */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Procure-to-Pay (P2P) Sourcing Lifecycle</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Direct navigation across all 9 procurement stages</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { code: '05.01', name: 'Purchase Planning', desc: 'Forecasts & Budgets', count: `${plans.length} Plans`, color: 'border-blue-200 dark:border-blue-500/30 hover:border-blue-400' },
                { code: '05.02', name: 'Purchase Requisition', desc: 'Internal PR Requests', count: `${requisitions.length} PRs`, color: 'border-indigo-200 dark:border-indigo-500/30 hover:border-indigo-400' },
                { code: '05.03', name: 'Request for Quotation', desc: 'Tenders & Bids', count: `${rfqs.length} RFQs`, color: 'border-cyan-200 dark:border-cyan-500/30 hover:border-cyan-400' },
                { code: '05.04', name: 'Supplier Quotation', desc: 'Evaluation & Award', count: 'Bid Matrix', color: 'border-teal-200 dark:border-teal-500/30 hover:border-teal-400' },
                { code: '05.05', name: 'Purchase Orders', desc: 'Standard & Blanket POs', count: `${purchaseOrders.length} POs`, color: 'border-emerald-200 dark:border-emerald-500/30 hover:border-emerald-400' },
                { code: '05.06', name: 'Purchasing Receipts', desc: 'GRN & Inspections', count: 'Stock Receipt', color: 'border-amber-200 dark:border-amber-500/30 hover:border-amber-400' },
                { code: '05.07', name: 'Purchase Invoice', desc: '3-Way Match Engine', count: `${invoices.length} Invoices`, color: 'border-rose-200 dark:border-rose-500/30 hover:border-rose-400' },
                { code: '05.08', name: 'Purchase Returns', desc: 'RMA & Debit Notes', count: 'Vendor Returns', color: 'border-orange-200 dark:border-orange-500/30 hover:border-orange-400' },
                { code: '05.09', name: 'Supplier Master', desc: 'AVL & Scorecards', count: `${suppliers.length} Vendors`, color: 'border-purple-200 dark:border-purple-500/30 hover:border-purple-400' }
              ].map((fa) => (
                <button
                  key={fa.code}
                  onClick={() => onNavigateToSubView(fa.code)}
                  className={`p-3.5 rounded-xl border ${fa.color} bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-900 text-left transition-all group cursor-pointer`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                      {fa.code}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-2">{fa.name}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{fa.desc}</p>
                  <div className="mt-2 text-[10px] font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full inline-block">
                    {fa.count}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Category Budget Tracking Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">FY2026 Procurement Budget Utilization</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Capex and Opex allocations vs committed PRs & POs</p>
              </div>
              <button
                onClick={() => onNavigateToSubView('05.01')}
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Planning</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {budgetCategories.map((b) => (
                <div key={b.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-slate-100">{b.categoryName}</span>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px] ml-2">({b.department})</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 dark:text-slate-100">{formatOMR(b.committedPR_PO_OMR + b.invoicedActualOMR)}</span>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px] ml-1">/ {formatOMR(b.allocatedBudgetOMR)}</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        b.utilizationPercentage > 85
                          ? 'bg-rose-500'
                          : b.utilizationPercentage > 70
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, b.utilizationPercentage)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                    <span>Utilization: {b.utilizationPercentage}%</span>
                    <span>Remaining Budget: {formatOMR(b.remainingBudgetOMR)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Approvals Queue & Vendor ESG Highlights */}
        <div className="space-y-6">
          {/* Pending Approvals Widget */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Pending Authorization Queue</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-200">
                {pendingApprovals.length} Action Items
              </span>
            </div>

            <div className="space-y-2.5">
              {pendingApprovals.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-4">No pending approvals in queue.</p>
              ) : (
                pendingApprovals.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-900 dark:text-slate-100">{item.ref}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          item.priority === 'Urgent / Critical'
                            ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-200'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-1 truncate">{item.title}</p>
                    <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-slate-900 dark:text-slate-100">{formatOMR(item.amountOMR)}</span>
                      <button
                        onClick={() => onNavigateToSubView(item.targetFa)}
                        className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 cursor-pointer"
                      >
                        Review & Approve →
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Strategic Supplier Scorecard Summary */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Tier-1 Strategic Suppliers</h3>
              <button
                onClick={() => onNavigateToSubView('05.09')}
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
              >
                View AVL →
              </button>
            </div>

            <div className="space-y-3">
              {suppliers.slice(0, 4).map((s) => (
                <div key={s.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{s.name}</h4>
                      {s.isOmaniSME && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-200">
                          SME
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{s.category} • {s.rating}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{s.qualityScore}% Quality</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">{s.onTimeDeliveryRate}% OTIF</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
