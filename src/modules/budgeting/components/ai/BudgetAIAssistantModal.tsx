// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 11: BUDGETING & FINANCIAL PLANNING
// Budgeting AI Copilot & Financial Intelligence Advisor
// ==========================================

import React, { useState } from 'react';
import { useBudgetStore } from '../../services/budgetStore';
import {
  Sparkles,
  X,
  Send,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Cpu
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const BudgetAIAssistantModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
    selectedBudget,
    costCenterSummaries,
    capexProposals,
    currency
  } = useBudgetStore();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; timestamp: string }>>([
    {
      role: 'assistant',
      text: `Hello! I am your AI Budget & Financial Planning Copilot for Artify Heavy Industries. I continuously analyze your fiscal allocations across all 5 cost centers, monitor burn rates, track CAPEX payback periods, and run real-time stress testing simulations. How can I assist your FP&A team today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim()) return;

    const userMsg = {
      role: 'user' as const,
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsAnalyzing(true);

    setTimeout(() => {
      let aiResponse = '';
      const lower = q.toLowerCase();

      if (lower.includes('burn') || lower.includes('cost center') || lower.includes('overspend')) {
        aiResponse = `📊 **Cost Center Burn Analysis:**\n- **CC-200 (Muscat Plant)** is currently at **78% utilization** with 1,840,000 ${currency} actual spent and 580,000 ${currency} committed.\n- **CC-400 (IT Operations)** is experiencing accelerated cloud consumption at **75% burn rate**.\n- **Recommendation:** Initiate a soft alert for CC-400 and evaluate a potential 30,000 ${currency} virement from CC-100 (Executive HQ Travel buffer) which has 85,000 ${currency} in unencumbered balance.`;
      } else if (lower.includes('capex') || lower.includes('irr') || lower.includes('investment') || lower.includes('payback')) {
        aiResponse = `💡 **CAPEX Investment Optimization:**\n- **Proposal CPX-2026-001 (Automated 12kW Laser Cutter):** Projected **IRR is 26.4%** with a **2.8-year payback period**.\n- **Proposal CPX-2026-003 (FEA Cluster):** Shows exceptional engineering yield with an estimated **31.2% IRR** and 1.9-year payback.\n- **FP&A Verdict:** Both proposals exceed the corporate hurdle rate of 15.0% and are recommended for immediate Board approval.`;
      } else if (lower.includes('stress') || lower.includes('inflation') || lower.includes('scenario') || lower.includes('steel')) {
        aiResponse = `⚡ **Commodity Inflation Stress Test:**\n- Under an **+18% structural steel price surge**, gross profit margin compresses by **3.8% (down to 39.4%)** unless partially hedged or passed through via EPC indexation clauses.\n- **Mitigation Strategy:** Artify's current 6-month fixed steel procurement contracts in Sohar provide hedge protection through Q3-2026, preserving 420,000 ${currency} in operating margin.`;
      } else {
        aiResponse = `✅ **Financial Planning Insights:**\n- Enterprise budget **${selectedBudget.budgetName}** is tracking at **62% total consumption** with 5,800,000 ${currency} in remaining buffer headroom.\n- Cash flow projections indicate healthy minimum liquidity surplus (>2.3M ${currency}) throughout all four quarters.\n- All debt service covenants (DSCR 2.35x) remain comfortably above statutory thresholds (1.30x).`;
      }

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: aiResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsAnalyzing(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl h-[650px] flex flex-col shadow-2xl animate-fadeIn">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                FP&A Financial Intelligence Copilot
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                  Gemini Flash 2.5
                </span>
              </h3>
              <p className="text-xs text-slate-400">Real-time budget governance, variance root-cause analysis, and predictive modeling</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Pills */}
        <div className="px-5 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => handleSendMessage('Analyze Cost Center burn rates and identify overspending risks')}
            className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium whitespace-nowrap cursor-pointer transition-colors"
          >
            🔥 Cost Center Burn Risk
          </button>
          <button
            onClick={() => handleSendMessage('Evaluate CAPEX proposals IRR and payback rankings')}
            className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium whitespace-nowrap cursor-pointer transition-colors"
          >
            💡 CAPEX Feasibility
          </button>
          <button
            onClick={() => handleSendMessage('Simulate +18% steel inflation impact on EBITDA')}
            className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium whitespace-nowrap cursor-pointer transition-colors"
          >
            ⚡ Steel Inflation Stress Test
          </button>
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none font-sans'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>
                <span className="block text-[10px] text-slate-400/80 mt-2 text-right">
                  {m.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isAnalyzing && (
            <div className="flex justify-start">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl rounded-tl-none p-3 text-xs text-slate-400 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                <span>Analyzing financial ledger & running mathematical simulations...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask FP&A Copilot (e.g. 'Can we afford a 150k PO in CC-200?')..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isAnalyzing}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-600/30"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BudgetAIAssistantModal;
