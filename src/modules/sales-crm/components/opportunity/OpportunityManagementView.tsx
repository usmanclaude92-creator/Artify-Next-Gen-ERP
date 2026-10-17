import React, { useState } from 'react';
import {
  Layers,
  Search,
  Filter,
  Plus,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  DollarSign,
  ChevronRight,
  ArrowRight,
  BarChart2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useSalesCrm } from '../../services/salesCrmStore';
import { Opportunity, OpportunityStage } from '../../types';
import { ERPUserRole } from '../../../../types/erp';

interface OpportunityManagementViewProps {
  activeTransactionId?: string;
  onNavigate?: (route: any) => void;
  activeRole: ERPUserRole;
}

const STAGES: { id: OpportunityStage; label: string; prob: number; color: string; bg: string }[] = [
  {
    id: 'Discovery & Prospecting',
    label: '01. Discovery',
    prob: 10,
    color: 'border-slate-300 dark:border-slate-700',
    bg: 'bg-slate-50/50 dark:bg-slate-900/30'
  },
  {
    id: 'Technical Qualification',
    label: '02. Technical Gate',
    prob: 30,
    color: 'border-amber-300 dark:border-amber-800',
    bg: 'bg-amber-50/30 dark:bg-amber-950/20'
  },
  {
    id: 'Proposal & Commercial Quotation',
    label: '03. CPQ Proposal',
    prob: 60,
    color: 'border-blue-300 dark:border-blue-800',
    bg: 'bg-blue-50/30 dark:bg-blue-950/20'
  },
  {
    id: 'Negotiation & Review',
    label: '04. Negotiation',
    prob: 80,
    color: 'border-purple-300 dark:border-purple-800',
    bg: 'bg-purple-50/30 dark:bg-purple-950/20'
  },
  {
    id: 'Closed Won',
    label: '05. Closed Won',
    prob: 100,
    color: 'border-emerald-300 dark:border-emerald-800',
    bg: 'bg-emerald-50/30 dark:bg-emerald-950/20'
  },
  {
    id: 'Closed Lost',
    label: '06. Closed Lost',
    prob: 0,
    color: 'border-rose-300 dark:border-rose-800',
    bg: 'bg-rose-50/30 dark:bg-rose-950/20'
  }
];

export const OpportunityManagementView: React.FC<OpportunityManagementViewProps> = ({
  activeTransactionId,
  onNavigate,
  activeRole
}) => {
  const {
    opportunities,
    customers,
    addOpportunity,
    updateOpportunityStage,
    predictOpportunityWinAI,
    stats
  } = useSalesCrm();

  const [activeTab, setActiveTab] = useState<'pipeline' | 'table' | 'stages' | 'forecast'>(
    activeTransactionId === 'tx-sales-opps'
      ? 'table'
      : activeTransactionId === 'tx-opp-stages'
      ? 'stages'
      : activeTransactionId === 'tx-opp-forecast'
      ? 'forecast'
      : 'pipeline'
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRep, setSelectedRep] = useState<string>('ALL');

  // New Deal Modal State
  const [showNewDealModal, setShowNewDealModal] = useState(false);
  const [dealTitle, setDealTitle] = useState('');
  const [dealCustomer, setDealCustomer] = useState(customers[0]?.id || '');
  const [dealValue, setDealValue] = useState(250000);
  const [dealStage, setDealStage] = useState<OpportunityStage>('Discovery & Prospecting');
  const [dealCloseDate, setDealCloseDate] = useState('2026-10-31');
  const [dealProducts, setDealProducts] = useState('');
  const [dealNextStep, setDealNextStep] = useState('');

  // AI Prediction Details modal / card
  const [aiInsight, setAiInsight] = useState<{ oppCode: string; res: any } | null>(null);

  const filteredOpps = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.opportunityCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRep = selectedRep === 'ALL' || opp.ownerName === selectedRep;
    return matchesSearch && matchesRep;
  });

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealTitle || !dealCustomer) return;

    const cust = customers.find((c) => c.id === dealCustomer);

    addOpportunity({
      title: dealTitle,
      customerId: dealCustomer,
      customerName: cust?.legalName || 'Client',
      stage: dealStage,
      probabilityPercentage: STAGES.find((s) => s.id === dealStage)?.prob || 25,
      dealValueOMR: Number(dealValue),
      weightedValueOMR: (Number(dealValue) * (STAGES.find((s) => s.id === dealStage)?.prob || 25)) / 100,
      currency: 'OMR',
      ownerId: 'usr-rep-01',
      ownerName: 'Eng. Tariq Al-Habsi',
      expectedCloseDate: dealCloseDate,
      productLines: dealProducts ? dealProducts.split(',').map((p) => p.trim()) : ['Industrial Capital Equipment'],
      keyCompetitors: ['Schlumberger Middle East', 'Regional Suppliers'],
      nextStep: dealNextStep || 'Schedule commercial discovery session with procurement committee.',
      nextStepDueDate: '2026-09-05'
    });

    setShowNewDealModal(false);
    setDealTitle('');
    setDealNextStep('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 text-xs font-semibold">
                Functional Area 06.03
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Pipeline Governance & Revenue Projections</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
              Sales Pipeline, Opportunity Stages & Forecasts
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Interactive 6-stage Kanban board, stage probability weighting, competitor intelligence, and weighted 12-month revenue forecasting.
            </p>
          </div>

          <button
            onClick={() => setShowNewDealModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium shadow-md shadow-purple-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Deal Opportunity
          </button>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex flex-wrap gap-2 border-t border-slate-200 dark:border-slate-800 pt-4 mt-5">
          {[
            { id: 'pipeline', label: '06.03.02 Visual Pipeline Kanban', code: 'tx-sales-pipeline' },
            { id: 'table', label: '06.03.01 Opportunity Table', code: 'tx-sales-opps' },
            { id: 'forecast', label: '06.03.04 Revenue Forecast Analysis', code: 'tx-opp-forecast' },
            { id: 'stages', label: '06.03.03 Stage Gates & Criteria', code: 'tx-opp-stages' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Total Pipeline Value</div>
          <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
            OMR {stats.totalPipelineValueOMR.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">{opportunities.length} Registered Deals</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Weighted Forecast (EV)</div>
          <div className="text-lg sm:text-xl font-bold text-purple-600 dark:text-purple-400 mt-1">
            OMR {stats.weightedPipelineValueOMR.toLocaleString()}
          </div>
          <div className="text-[11px] text-purple-500 dark:text-purple-400 mt-0.5">Probability Adjusted</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Won Revenue (YTD)</div>
          <div className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            OMR {opportunities.filter((o) => o.stage === 'Closed Won').reduce((s, o) => s + o.dealValueOMR, 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-500 dark:text-emerald-400 mt-0.5">100% Milestone Reached</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Average Win Rate</div>
          <div className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {stats.avgWinRatePercentage}%
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Trailing 12 Months</div>
        </div>
      </div>

      {/* AI Prediction Flyout Banner */}
      {aiInsight && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-slate-900 border border-purple-500/30 text-xs sm:text-sm text-slate-200 shadow-md flex items-start justify-between gap-4 animate-fade-in">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white">
                AI Win Probability Analysis: {aiInsight.oppCode}
              </div>
              <div className="mt-1 text-slate-300">
                <span className="font-bold text-purple-300">Win Score: {aiInsight.res.probability}%</span> — {aiInsight.res.rationale}
              </div>
              <div className="mt-1 text-xs text-emerald-300">
                💡 <span className="font-semibold">Recommended Tactic:</span> {aiInsight.res.tacticalAdvice}
              </div>
            </div>
          </div>
          <button
            onClick={() => setAiInsight(null)}
            className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. KANBAN BOARD VIEW */}
      {activeTab === 'pipeline' && (
        <div className="overflow-x-auto pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 min-w-[1200px]">
            {STAGES.map((col) => {
              const stageOpps = filteredOpps.filter((o) => o.stage === col.id);
              const stageTotal = stageOpps.reduce((sum, o) => sum + o.dealValueOMR, 0);

              return (
                <div
                  key={col.id}
                  className={`rounded-2xl border ${col.color} ${col.bg} p-3.5 flex flex-col justify-between min-h-[520px]`}
                >
                  {/* Column Header */}
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {col.label}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                        {col.prob}%
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 flex items-center justify-between">
                      <span>{stageOpps.length} Deals</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        OMR {stageTotal.toLocaleString()}
                      </span>
                    </div>

                    {/* Deal Cards Container */}
                    <div className="mt-3 space-y-3">
                      {stageOpps.map((opp) => (
                        <div
                          key={opp.id}
                          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs hover:shadow-md transition-all text-left space-y-2.5"
                        >
                          <div>
                            <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold">
                              {opp.opportunityCode}
                            </span>
                            <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2 mt-0.5">
                              {opp.title}
                            </h4>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                              <Building2 className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
                              <span className="truncate">{opp.customerName}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                            <span className="font-bold text-slate-900 dark:text-white">
                              OMR {opp.dealValueOMR.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-slate-600 dark:text-slate-400">
                              {opp.expectedCloseDate.slice(5)}
                            </span>
                          </div>

                          {/* Quick Stage Shifters */}
                          <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                            <button
                              onClick={() => {
                                const res = predictOpportunityWinAI(opp.id);
                                setAiInsight({ oppCode: opp.opportunityCode, res });
                              }}
                              className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1 hover:underline cursor-pointer"
                            >
                              <Sparkles className="w-3 h-3" /> AI Score
                            </button>

                            {/* Stage progression dropdown */}
                            <select
                              value={opp.stage}
                              onChange={(e) => updateOpportunityStage(opp.id, e.target.value as any)}
                              className="text-[10px] font-medium py-0.5 px-1.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
                            >
                              {STAGES.map((s) => (
                                <option key={s.id} value={s.id}>
                                  Move: {s.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))}

                      {stageOpps.length === 0 && (
                        <div className="p-6 text-center text-[11px] text-slate-600 dark:text-slate-400 italic">
                          No deals in this stage
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. TABLE VIEW */}
      {activeTab === 'table' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Code / Opportunity Title</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3 text-right">Value (OMR)</th>
                  <th className="px-4 py-3 text-right">Weighted EV</th>
                  <th className="px-4 py-3">Expected Close</th>
                  <th className="px-4 py-3">Rep</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredOpps.map((opp) => (
                  <tr key={opp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">{opp.title}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 font-mono mt-0.5">{opp.opportunityCode}</div>
                    </td>
                    <td className="px-4 py-3.5 text-xs font-medium text-slate-800 dark:text-slate-200">
                      {opp.customerName}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                        {opp.stage} ({opp.probabilityPercentage}%)
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-bold text-slate-900 dark:text-white">
                      {opp.dealValueOMR.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 text-right text-xs font-bold text-purple-600 dark:text-purple-400">
                      {opp.weightedValueOMR.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-600 dark:text-slate-400">
                      {opp.expectedCloseDate}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-600 dark:text-slate-400">
                      {opp.ownerName}
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-1">
                      <button
                        onClick={() => {
                          const res = predictOpportunityWinAI(opp.id);
                          setAiInsight({ oppCode: opp.opportunityCode, res });
                        }}
                        className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-500/20 text-xs border border-purple-200 dark:border-purple-800 cursor-pointer"
                        title="Run AI Predictor"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. REVENUE FORECAST VIEW */}
      {activeTab === 'forecast' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Q3 2026 Commit</span>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                OMR 1,160,000
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">High-confidence deals with signed LPOs & tender award letters</p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Q4 2026 Best Case</span>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                OMR 2,450,000
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Includes active negotiations with OQ, Asyad and Galfar SEZAD</p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Pipeline Coverage Ratio</span>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                3.8x
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Exceeds recommended 3.0x quota benchmark for industrial capital sales</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. STAGES & GATE CRITERIA */}
      {activeTab === 'stages' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            06.03.03 Governance Stage Gate Verification Matrix
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Standard operating procedure mandatory validation checkpoints</p>

          <div className="space-y-3">
            {STAGES.map((s, idx) => (
              <div
                key={s.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{s.label}</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                      Standard Win Probability: {s.prob}%
                    </span>
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 mt-1">
                    Mandatory Checkpoint: Client technical specification signoff, credit verification, and formal quotation revision logs.
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="px-3 py-1 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 font-semibold">
                    Gate {idx + 1} Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create New Deal Opportunity Modal */}
      {showNewDealModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  06.03.01 Register New Sales Opportunity
                </h3>
              </div>
              <button
                onClick={() => setShowNewDealModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDeal} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Opportunity Deal Title *
                </label>
                <input
                  type="text"
                  required
                  value={dealTitle}
                  onChange={(e) => setDealTitle(e.target.value)}
                  placeholder="e.g. PDO Nimr Solar Water Injection Skid Package"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Customer Account *
                  </label>
                  <select
                    value={dealCustomer}
                    onChange={(e) => setDealCustomer(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.legalName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Estimated Deal Value (OMR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={dealValue}
                    onChange={(e) => setDealValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Pipeline Stage
                  </label>
                  <select
                    value={dealStage}
                    onChange={(e) => setDealStage(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    {STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label} ({s.prob}%)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Target Close Date
                  </label>
                  <input
                    type="date"
                    value={dealCloseDate}
                    onChange={(e) => setDealCloseDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Product Lines & Equipment Scope
                </label>
                <input
                  type="text"
                  value={dealProducts}
                  onChange={(e) => setDealProducts(e.target.value)}
                  placeholder="e.g. Submersible Pumps, High-Pressure Valves, SCADA Panels"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Immediate Next Step Action
                </label>
                <input
                  type="text"
                  value={dealNextStep}
                  onChange={(e) => setDealNextStep(e.target.value)}
                  placeholder="e.g. Submit preliminary technical compliance matrix"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewDealModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium shadow-md cursor-pointer"
                >
                  Save Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
