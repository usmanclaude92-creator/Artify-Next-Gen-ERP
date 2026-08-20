import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  Database,
  ArrowRight,
  ShieldCheck,
  Zap,
  CornerDownLeft,
  CheckCircle2,
  FileText,
  Clock,
  Layers,
  Cpu,
  BarChart3,
  Search
} from 'lucide-react';
import { ERPRouteState } from '../../types/erp';

interface AICommandCenterViewProps {
  onNavigate: (route: ERPRouteState) => void;
}

interface SimulatedAIResponse {
  query: string;
  intent: string;
  targetedModules: string[];
  sqlPlan: string;
  insight: string;
  dataPoints: { label: string; value: string; status?: string }[];
  actionRecommendation: {
    title: string;
    description: string;
    route: ERPRouteState;
    buttonText: string;
  };
}

const PRESET_QUERIES = [
  {
    title: 'Executive Liquidity Analysis',
    query: 'What is our consolidated cash position across all 8 bank accounts and what is the 30-day forecasted cash outflow?',
    role: 'CFO Persona'
  },
  {
    title: 'Construction Cost Variance',
    query: 'Analyze material cost variance and IPC certified progress on Muscat Marina Tower project.',
    role: 'Project Director'
  },
  {
    title: 'Supplier Discount Optimization',
    query: 'Identify all Accounts Payable invoices eligible for 2%+ early settlement cash discount this week.',
    role: 'Treasury / AP'
  },
  {
    title: 'Overdue Receivables by Aging Bucket',
    query: 'Show customer receivables aged >90 days and calculate recommended bad debt provisioning under IFRS 9.',
    role: 'Credit Risk'
  }
];

export const AICommandCenterView: React.FC<AICommandCenterViewProps> = ({ onNavigate }) => {
  const [promptText, setPromptText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeResult, setActiveResult] = useState<SimulatedAIResponse | null>({
    query: 'What is our consolidated cash position across all 8 bank accounts and what is the 30-day forecasted cash outflow?',
    intent: 'Multi-Bank Liquidity Consolidation & Predictive Cashflow Run',
    targetedModules: ['04 — BANKING & TREASURY', '03 — ACCOUNTS PAYABLE', '02 — ACCOUNTS RECEIVABLE'],
    sqlPlan: `SELECT b.account_no, b.bank_name, b.currency, b.cleared_balance,
       (SELECT SUM(ap.due_amount) FROM ap_vouchers ap WHERE ap.due_date <= CURRENT_DATE + INTERVAL '30 days') as expected_outflow,
       (SELECT SUM(ar.expected_amount) FROM ar_invoices ar WHERE ar.due_date <= CURRENT_DATE + INTERVAL '30 days') as expected_inflow
FROM gl_bank_accounts b WHERE b.status = 'ACTIVE';`,
    insight:
      'Artify Group holds OMR 8,634,200 in cleared liquid treasury across 8 active accounts. 30-day scheduled AP vendor commitments total OMR 3,420,000, while projected client collections equal OMR 4,910,000. Net liquidity buffer remains safe at +OMR 10,124,200.',
    dataPoints: [
      { label: 'Cleared Treasury Balance', value: 'OMR 8,634,200', status: 'Optimal' },
      { label: '30-Day Scheduled Outflows', value: 'OMR 3,420,000', status: 'Payables' },
      { label: 'Expected 30-Day Inflows', value: 'OMR 4,910,000', status: 'Receivables' },
      { label: 'Forecasted End-of-Month Buffer', value: 'OMR 10,124,200', status: 'Safe' }
    ],
    actionRecommendation: {
      title: 'Authorize High-Yield Overnight Sweep',
      description: 'Transfer OMR 4.2M excess idle float from Bank Muscat operating current account to 5.2% Wakala/Fixed Deposit facility.',
      route: {
        view: 'transaction',
        moduleId: 'banking-treasury',
        functionalAreaId: 'treasury-operations',
        processId: 'treasury-proc',
        transactionId: 'tx-treasury-deal'
      },
      buttonText: 'Execute Treasury Placement'
    }
  });

  const handleExecutePrompt = (customQuery?: string) => {
    const q = customQuery || promptText;
    if (!q.trim()) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (q.toLowerCase().includes('construction') || q.toLowerCase().includes('marina')) {
        setActiveResult({
          query: q,
          intent: 'EPC Project Cost Sheet Audit & BOQ Variance Extraction',
          targetedModules: ['15 — CONSTRUCTION & EPC', '05 — PROCUREMENT', '07 — INVENTORY'],
          sqlPlan: `SELECT p.project_code, p.project_name, p.contract_sum, p.earned_value, p.actual_cost_incurred,
       (p.earned_value - p.actual_cost_incurred) as cost_variance,
       (p.earned_value / p.actual_cost_incurred) as cpi
FROM epc_projects p WHERE p.project_id = 'PRJ-MCT-001';`,
          insight:
            'Muscat Marina Tower Phase 2 is currently 64% complete with earned value of OMR 12.8M vs actual cost incurred of OMR 12.3M (CPI = 1.04). Material price escalation in structural rebar was successfully offset by early bulk procurement.',
          dataPoints: [
            { label: 'Contract Value', value: 'OMR 20,000,000' },
            { label: 'Cumulative Earned Value', value: 'OMR 12,800,000' },
            { label: 'Actual Cost (ACWP)', value: 'OMR 12,308,000' },
            { label: 'Cost Performance Index', value: '1.04 (Favorable)' }
          ],
          actionRecommendation: {
            title: 'Review IPC-14 Interim Payment Certificate',
            description: 'Consultant approved IPC-14 milestone for OMR 480,000. Ready for client invoice submission.',
            route: {
              view: 'transaction',
              moduleId: 'construction',
              functionalAreaId: 'ipc-management',
              processId: 'ipc-proc',
              transactionId: 'tx-ipc-cert'
            },
            buttonText: 'Inspect IPC Voucher'
          }
        });
      } else if (q.toLowerCase().includes('discount') || q.toLowerCase().includes('payable') || q.toLowerCase().includes('supplier')) {
        setActiveResult({
          query: q,
          intent: 'Dynamic AP Discount Opportunity Aggregation',
          targetedModules: ['03 — ACCOUNTS PAYABLE', '04 — BANKING & TREASURY'],
          sqlPlan: `SELECT s.vendor_name, inv.invoice_no, inv.amount, inv.discount_percent, inv.discount_expiry_date
FROM ap_invoices inv JOIN ap_vendors s ON inv.vendor_id = s.id
WHERE inv.status = 'APPROVED' AND inv.discount_expiry_date >= CURRENT_DATE;`,
          insight:
            '3 vendor invoices qualify for prompt payment cash discounts totaling OMR 4,180 in direct savings if paid within the next 48 hours.',
          dataPoints: [
            { label: 'Total Invoices Eligible', value: '3 Invoices' },
            { label: 'Total Payment Amount', value: 'OMR 184,200' },
            { label: 'Immediate Discount Savings', value: 'OMR 4,180' },
            { label: 'Effective Annualized Return', value: '36.5% APR' }
          ],
          actionRecommendation: {
            title: 'Authorize Early Settlement Payment Run',
            description: 'Generate payment batch with discount capture flag enabled for Al-Maha Steel and Oman Cables.',
            route: {
              view: 'transaction',
              moduleId: 'accounts-payable',
              functionalAreaId: 'ap-processing',
              processId: 'ap-proc-flow',
              transactionId: 'tx-ap-inv'
            },
            buttonText: 'Open AP Payment Queue'
          }
        });
      } else {
        setActiveResult({
          query: q,
          intent: 'General ERP Multi-Entity Intelligence Scan',
          targetedModules: ['16 — FINANCIAL ACCOUNTING', '01 — SYSTEM MANAGEMENT'],
          sqlPlan: `SELECT * FROM erp_audit_logs WHERE event_date >= CURRENT_DATE - 7;`,
          insight: `AI Assistant synthesized real-time operational status for "${q}". All transactional journals, subledger postings, and audit trails are verified compliant.`,
          dataPoints: [
            { label: 'Status', value: 'Verified Balanced' },
            { label: 'Confidence Score', value: '99.4%' },
            { label: 'Entities Analyzed', value: '4 Subsidiaries' }
          ],
          actionRecommendation: {
            title: 'Browse Module Navigation Hierarchy',
            description: 'Jump to the specific operational process screen to review line item vouchers.',
            route: { view: 'dashboard' },
            buttonText: 'Back to Executive Dashboard'
          }
        });
      }
    }, 400);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 rounded-2xl p-6 text-white shadow-xl border border-indigo-900/60 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-400/30">
              <Sparkles className="w-4 h-4 text-indigo-300" />
            </div>
            <span className="font-mono text-xs font-bold text-indigo-300 tracking-wider uppercase">
              Artify Future Generation AI Core
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            Natural Language ERP Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Query financial metrics, simulate treasury decisions, audit cost sheets, and orchestrate automated ERP transactions using plain business language.
          </p>
        </div>
      </div>

      {/* Input Prompt Box */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative">
          <textarea
            rows={3}
            value={promptText}
            onChange={e => setPromptText(e.target.value)}
            placeholder="Type any enterprise command or question (e.g. 'Show cash flow forecast for next 30 days', 'Check BOQ variance for Muscat Marina Tower', 'Draft batch payment for approved invoices')..."
            className="w-full p-3.5 pr-28 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all resize-none"
          />
          <div className="absolute right-3 bottom-3">
            <button
              onClick={() => handleExecutePrompt()}
              disabled={isProcessing || !promptText.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              {isProcessing ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Execute</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Suggested Queries Grid */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Suggested Executive Prompts & Decision Queries
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESET_QUERIES.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPromptText(preset.query);
                  handleExecutePrompt(preset.query);
                }}
                className="text-left p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-slate-100 text-xs transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 group-hover:text-indigo-700">
                    {preset.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{preset.role}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{preset.query}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Execution Output & Synthesis */}
      {activeResult && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-slate-900">Synthesized ERP Intelligence Report</h2>
                <p className="text-xs text-slate-500">Query Intent: {activeResult.intent}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {activeResult.targetedModules.map((mod, i) => (
                <span
                  key={i}
                  className="font-mono text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded"
                >
                  {mod}
                </span>
              ))}
            </div>
          </div>

          {/* Core Insight Box */}
          <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-950 leading-relaxed font-medium">
            <p className="font-semibold text-indigo-900 mb-1">Executive Summary & Analysis:</p>
            <p>{activeResult.insight}</p>
          </div>

          {/* Metric KPIs Generated */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {activeResult.dataPoints.map((dp, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-500 block truncate">{dp.label}</span>
                <span className="text-base font-bold text-slate-900 mt-1 block">{dp.value}</span>
                {dp.status && (
                  <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">
                    {dp.status}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Simulated SQL Query Execution Blueprint */}
          <div className="p-3 rounded-xl bg-slate-900 text-slate-300 font-mono text-[11px] overflow-x-auto">
            <div className="flex items-center justify-between text-slate-400 pb-1.5 mb-1.5 border-b border-slate-800 text-[10px] uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Database className="w-3 h-3 text-indigo-400" />
                <span>Generated Multi-Entity Relational Query Plan</span>
              </span>
              <span className="text-emerald-400">Execution Time: 18ms</span>
            </div>
            <pre className="text-indigo-300 whitespace-pre-wrap">{activeResult.sqlPlan}</pre>
          </div>

          {/* Recommended Action Card */}
          <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs text-emerald-950">
                  {activeResult.actionRecommendation.title}
                </h4>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  {activeResult.actionRecommendation.description}
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate(activeResult.actionRecommendation.route)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs whitespace-nowrap transition-colors flex items-center justify-center gap-2"
            >
              <span>{activeResult.actionRecommendation.buttonText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
