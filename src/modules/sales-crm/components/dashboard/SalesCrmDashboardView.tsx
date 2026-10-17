import React, { useState } from 'react';
import {
  TrendingUp,
  Users,
  Target,
  DollarSign,
  FileText,
  ShoppingBag,
  Truck,
  HelpCircle,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Plus,
  Building2,
  Search,
  Filter,
  BarChart3,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useSalesCrm } from '../../services/salesCrmStore';
import { ERPUserRole } from '../../../../types/erp';

interface SalesCrmDashboardViewProps {
  onNavigate: (route: {
    view: 'module' | 'functional_area' | 'process' | 'transaction';
    moduleId: string;
    functionalAreaId?: string;
    processId?: string;
    transactionId?: string;
  }) => void;
  activeRole: ERPUserRole;
}

export const SalesCrmDashboardView: React.FC<SalesCrmDashboardViewProps> = ({
  onNavigate,
  activeRole
}) => {
  const {
    stats,
    leads,
    opportunities,
    quotations,
    salesOrders,
    arInvoices,
    complaints,
    scoreLeadAI,
    predictOpportunityWinAI
  } = useSalesCrm();

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);

  const handleRunAiCopilot = (customQuery?: string) => {
    const query = customQuery || aiPrompt;
    if (!query) return;

    setIsAiThinking(true);
    setTimeout(() => {
      if (query.toLowerCase().includes('win') || query.toLowerCase().includes('probability')) {
        setAiResponse(
          `**AI Deal Probability Analysis (Q3 2026):**\n- **PDO Marmul ESP Package (OMR 640k):** Win probability updated to **88%** due to 100% In-Country Value (ICV) local assembly advantage.\n- **OQ Aromatics CEMS (OMR 380k):** Win probability at **65%**. Recommendation: Offer 3-year local 24/7 SLA maintenance package to counter Yokogawa's bid.\n- **Nama Water (OMR 520k):** **Closed Won (100%)** — Advance receipt pending.`
        );
      } else if (query.toLowerCase().includes('credit') || query.toLowerCase().includes('risk')) {
        setAiResponse(
          `**AI Credit Risk & Exposure Assessment:**\n- **Galfar Engineering:** Credit limit utilization is at **88.2% (OMR 490k / 600k limit)**. Unbilled deliveries pending: OMR 80k. Recommend requiring 25% cash advance before releasing Duqm switchgear order.\n- **PDO & OQ:** Credit standing is **Exceptional (0.0% default risk)** with average payment turnaround of 42 days.`
        );
      } else {
        setAiResponse(
          `**AI Sales Intelligence Synthesis:**\n- **Pipeline Health:** Total active pipeline stands at **OMR ${stats.totalPipelineValueOMR.toLocaleString()}** with weighted revenue projection of **OMR ${stats.weightedPipelineValueOMR.toLocaleString()}**.\n- **Lead Conversion Rate:** Hot leads from Oil & Gas and Public Utilities convert at **62.5%**.\n- **Action Item:** 2 quotations (QUO-2026-00451) require commercial director discount sign-off to close before month-end.`
        );
      }
      setIsAiThinking(false);
    }, 600);
  };

  const quickPrompts = [
    'Predict deal win probability for open enterprise proposals > OMR 50k',
    'Assess customer credit limit exposure and delayed payment risks',
    'Summarize top Q3 pipeline opportunities and close dates'
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white border border-indigo-900/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider border border-indigo-500/30">
                Phase 06 • Module 06
              </span>
              <span className="text-xs text-slate-400 font-medium">Oman & GCC Commercial Edition</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mt-2 tracking-tight">
              06 — Sales & CRM Operations Cockpit
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-1 max-w-2xl">
              Omnichannel Lead Qualification, CPQ Quotation Engine, Sales Pipeline Kanban, Quote-to-Cash Execution, Delivery Notes & AR Tax Invoicing.
            </p>
          </div>

          {/* Quick Launch Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() =>
                onNavigate({
                  view: 'transaction',
                  moduleId: 'sales-crm',
                  functionalAreaId: 'lead-management',
                  processId: 'lead-proc',
                  transactionId: 'tx-lead-capture'
                })
              }
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Capture Lead
            </button>
            <button
              onClick={() =>
                onNavigate({
                  view: 'transaction',
                  moduleId: 'sales-crm',
                  functionalAreaId: 'sales-quotations',
                  processId: 'quote-proc',
                  transactionId: 'tx-quote-creation'
                })
              }
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs sm:text-sm border border-slate-700 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-indigo-400" />
              New Quotation
            </button>
            <button
              onClick={() =>
                onNavigate({
                  view: 'transaction',
                  moduleId: 'sales-crm',
                  functionalAreaId: 'opportunity-management',
                  processId: 'opp-mgmt-proc',
                  transactionId: 'tx-sales-pipeline'
                })
              }
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs sm:text-sm border border-slate-700 transition-all cursor-pointer"
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              Deal Pipeline
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Sales Pipeline
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              OMR {stats.totalPipelineValueOMR.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Weighted: OMR {stats.weightedPipelineValueOMR.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Booked Sales Orders
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              OMR {stats.ytdBookedSalesOrdersOMR.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span>{salesOrders.length} Confirmed LPOs</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Billed AR Revenue
            </span>
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              OMR {stats.ytdBilledRevenueOMR.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>AR Due: OMR {stats.outstandingReceivablesOMR.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Win Rate & CSAT
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats.avgWinRatePercentage}% / {stats.customerSatisfactionIndex}%
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{stats.activeOpportunitiesCount} Active Enterprise Deals</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Sales Copilot Assistant */}
      <div className="bg-gradient-to-br from-indigo-900/10 via-slate-900/5 to-slate-900/20 dark:from-indigo-950/40 dark:via-slate-900/60 dark:to-slate-950 border border-indigo-200/70 dark:border-indigo-800/50 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Artify AI Commercial & CRM Intelligence Copilot
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Predictive deal win scoring, credit limit breach warnings, and dynamic CPQ quotation recommendations.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800">
            Realtime Analytics
          </span>
        </div>

        {/* Query Input */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRunAiCopilot()}
              placeholder="Ask AI Copilot (e.g., 'Score win probability for open enterprise deals' or 'Assess credit risks')..."
              className="w-full pl-4 pr-10 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {aiPrompt && (
              <button
                onClick={() => setAiPrompt('')}
                className="absolute right-3 top-3 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
          <button
            onClick={() => handleRunAiCopilot()}
            disabled={isAiThinking}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            {isAiThinking ? 'Analyzing...' : 'Generate Insights'}
          </button>
        </div>

        {/* Quick prompt pills */}
        <div className="flex flex-wrap gap-2 mt-3">
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => {
                setAiPrompt(qp);
                handleRunAiCopilot(qp);
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              💡 {qp}
            </button>
          ))}
        </div>

        {/* AI Output Box */}
        {aiResponse && (
          <div className="mt-4 p-4 rounded-xl bg-white dark:bg-slate-800/90 border border-indigo-100 dark:border-indigo-900/60 shadow-sm text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
            {aiResponse}
          </div>
        )}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Opportunities & Funnel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Sales Opportunities Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  High-Value Enterprise Opportunities
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Pipeline deals prioritized by contract value and target close date
                </p>
              </div>
              <button
                onClick={() =>
                  onNavigate({
                    view: 'transaction',
                    moduleId: 'sales-crm',
                    functionalAreaId: 'opportunity-management',
                    processId: 'opp-mgmt-proc',
                    transactionId: 'tx-sales-pipeline'
                  })
                }
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                Open Kanban Pipeline <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Opportunity / Client</th>
                    <th className="px-4 py-3">Stage</th>
                    <th className="px-4 py-3 text-right">Value (OMR)</th>
                    <th className="px-4 py-3 text-center">Win Prob</th>
                    <th className="px-4 py-3">Target Close</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {opportunities.map((opp) => (
                    <tr key={opp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-900 dark:text-white">{opp.title}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Building2 className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
                          <span>{opp.customerName}</span>
                          <span className="text-slate-300 dark:text-slate-600">•</span>
                          <span>{opp.opportunityCode}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                            opp.stage === 'Closed Won'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : opp.stage === 'Negotiation & Review'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                              : opp.stage === 'Proposal & Commercial Quotation'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {opp.stage}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right font-bold text-slate-900 dark:text-white">
                        {opp.dealValueOMR.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="inline-flex items-center gap-1 font-semibold text-xs text-slate-800 dark:text-slate-200">
                          <span>{opp.probabilityPercentage}%</span>
                        </div>
                        <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mt-1 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              opp.probabilityPercentage >= 75
                                ? 'bg-emerald-500'
                                : opp.probabilityPercentage >= 50
                                ? 'bg-blue-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${opp.probabilityPercentage}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-600 dark:text-slate-400">
                        {opp.expectedCloseDate}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => {
                            const res = predictOpportunityWinAI(opp.id);
                            setAiResponse(
                              `**AI Win Predictor for ${opp.opportunityCode}:**\n- **Score:** ${res.probability}%\n- **Rationale:** ${res.rationale}\n- **Tactical Strategy:** ${res.tacticalAdvice}`
                            );
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 transition-colors cursor-pointer"
                        >
                          AI Predict
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Functional Areas Gateway */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                title: '06.01 Leads',
                desc: `${leads.length} Inbound inquiries`,
                icon: Users,
                fa: 'lead-management',
                color: 'text-indigo-500 dark:text-indigo-400'
              },
              {
                title: '06.02 Customers',
                desc: '360° Account Directory',
                icon: Building2,
                fa: 'customer-management',
                color: 'text-blue-500 dark:text-blue-400'
              },
              {
                title: '06.05 Quotations',
                desc: `${quotations.length} CPQ Proposals`,
                icon: FileText,
                fa: 'sales-quotations',
                color: 'text-emerald-500 dark:text-emerald-400'
              },
              {
                title: '06.06 Sales Orders',
                desc: `${salesOrders.length} Confirmed LPOs`,
                icon: ShoppingBag,
                fa: 'sales-orders',
                color: 'text-cyan-500 dark:text-cyan-400'
              },
              {
                title: '06.07 Delivery & Billing',
                desc: 'DN & Tax Invoicing',
                icon: Truck,
                fa: 'delivery-billing',
                color: 'text-amber-500 dark:text-amber-400'
              },
              {
                title: '06.08 Customer Care',
                desc: `${complaints.length} Service Tickets`,
                icon: HelpCircle,
                fa: 'customer-service',
                color: 'text-rose-500 dark:text-rose-400'
              },
              {
                title: '06.03 Pipeline',
                desc: 'Kanban Stages',
                icon: Layers,
                fa: 'opportunity-management',
                color: 'text-purple-500 dark:text-purple-400'
              },
              {
                title: '06.04 Activities',
                desc: 'Calls & Client Visits',
                icon: Calendar,
                fa: 'sales-activities',
                color: 'text-teal-500 dark:text-teal-400'
              }
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <button
                  key={i}
                  onClick={() =>
                    onNavigate({
                      view: 'functional_area',
                      moduleId: 'sales-crm',
                      functionalAreaId: card.fa
                    })
                  }
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-md transition-all text-left group cursor-pointer"
                >
                  <Icon className={`w-5 h-5 ${card.color} mb-2 group-hover:scale-110 transition-transform`} />
                  <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{card.title}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{card.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Recent Leads & Customer Health */}
        <div className="space-y-6">
          {/* Fresh Qualified Leads */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Recent Inbound Leads
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">BANT Qualified Prospects</p>
              </div>
              <button
                onClick={() =>
                  onNavigate({
                    view: 'functional_area',
                    moduleId: 'sales-crm',
                    functionalAreaId: 'lead-management'
                  })
                }
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {leads.slice(0, 4).map((lead) => (
                <div
                  key={lead.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-2"
                >
                  <div>
                    <div className="font-semibold text-xs text-slate-900 dark:text-white">
                      {lead.fullName}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {lead.companyName} • {lead.industry}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        BANT: {lead.bant.bantScore}/100
                      </span>
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        OMR {lead.estimatedDealValueOMR.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const res = scoreLeadAI(lead.id);
                      setAiResponse(
                        `**AI Lead Evaluation for ${lead.leadCode} (${lead.fullName}):**\n- **AI Fit Score:** ${res.score}/100\n- **Reasoning:** ${res.reasoning}\n- **Recommended Next Step:** ${res.action}`
                      );
                    }}
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 border border-slate-200 dark:border-slate-600 text-xs shadow-2xs cursor-pointer"
                    title="Score with AI"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Service & Ticket Status */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Active Service Tickets & Complaints
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">SLA Resolution Tracker</p>
              </div>
              <button
                onClick={() =>
                  onNavigate({
                    view: 'functional_area',
                    moduleId: 'sales-crm',
                    functionalAreaId: 'customer-service'
                  })
                }
                className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
              >
                Service Desk
              </button>
            </div>

            <div className="space-y-3">
              {complaints.map((comp) => (
                <div
                  key={comp.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900 dark:text-white">
                      {comp.ticketNumber}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        comp.urgency === 'High' || comp.urgency === 'Critical / Emergency'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {comp.urgency}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-slate-800 dark:text-slate-200 mt-1">
                    {comp.subject}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {comp.customerName} • Target: {comp.targetResolutionDate}
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
