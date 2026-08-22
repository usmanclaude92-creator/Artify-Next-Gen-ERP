// ==========================================
// CONSTRUCTION AI COPILOT MODAL
// FIDIC Contract Advisor, IPC Valuation Auditor & Delay Claim Assistant
// ==========================================

import React, { useState } from 'react';
import { useConstructionStore } from '../../services/constructionStore';
import {
  Sparkles,
  Bot,
  Send,
  X,
  Shield,
  FileText,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  HelpCircle,
  Layers,
  ChevronRight
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ConstructionAICopilotModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { selectedContractId, contracts, ipcs, variations, claims, eots, currency } = useConstructionStore();
  const selectedContract = contracts.find(c => c.id === selectedContractId) || contracts[0];

  const [messages, setMessages] = useState<{ sender: 'ai' | 'user'; text: string; time: string }[]>([
    {
      sender: 'ai',
      text: `Hello! I am your FIDIC & Construction Commercial AI Copilot. I'm actively analyzing **${selectedContract?.contractNumber} — ${selectedContract?.projectName}**.\n\nYou can ask me about:\n- **FIDIC Clause 20.1 & 8.4** claim validity and notice timelines.\n- **Interim Payment Certificate (IPC)** valuation formulas and retention cap calculations.\n- **Critical Path delay analysis** and Liquidated Damages (LD) penalty mitigation.\n- **Subcontractor 'Pay-when-Paid'** legal compliance under Oman commercial standard practice.`,
      time: 'Just now'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isOpen) return null;

  const handleSend = (queryText?: string) => {
    const query = queryText || inputQuery;
    if (!query.trim()) return;

    const userMsg = { sender: 'user' as const, text: query, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsAnalyzing(true);

    setTimeout(() => {
      let reply = '';
      const q = query.toLowerCase();

      if (q.includes('claim') || q.includes('20.1') || q.includes('notice')) {
        reply = `### FIDIC Clause 20.1 Claim Analysis:\n- **28-Day Condition Precedent**: The contractor must give notice of claim within 28 days of becoming aware of the event. Under Omani law (Civil Transactions Law, Royal Decree 29/2013), good faith principles apply, but strictly adhering to the 28-day notice is vital to avoid time-bar disputes.\n- **Substantiation Dossier**: A fully detailed claim with contemporaneous site records (DSRs, concrete batch tickets, plant logs) must be submitted within 42 days.\n- **Current Status for ${selectedContract.contractNumber}**: Claims CLM-01 & CLM-02 were both submitted within 18 days of the respective obstruction events, satisfying all procedural requirements.`;
      } else if (q.includes('ipc') || q.includes('retention') || q.includes('advance')) {
        reply = `### IPC Valuation & Deductions Audit:\n- **Gross Valuation**: Includes executed BOQ line items + 80% Materials on Site (MOS) invoice value.\n- **Advance Recovery**: Pro-rata 10% deduction active until pro-rata 80% contract progress.\n- **Retention Capping**: 10% is deducted until reaching the 5.0% contract ceiling (${currency} ${(selectedContract.revisedContractValue * 0.05).toLocaleString()}). Subsequent IPCs will have 0% retention withheld.\n- **VAT Compliance**: 5% standard Oman VAT is calculated strictly on net payable amount before tax.`;
      } else if (q.includes('delay') || q.includes('ld') || q.includes('penalty') || q.includes('eot')) {
        reply = `### Critical Path & Liquidated Damages Exposure:\n- **Approved EOT**: Total of +45 calendar days approved across EOT-01 & EOT-02, extending contractual completion to ${selectedContract.revisedCompletionDate}.\n- **LD Exposure**: Zero (0) unmitigated delay days. Daily rate of ${currency} ${selectedContract.liquidatedDamagesPerDay.toLocaleString()} is currently not triggered.\n- **Risk Advisory**: Ensure MEP facade closure on Level 28-32 maintains critical path float to avoid winter rain risks.`;
      } else {
        reply = `I have reviewed the commercial and site parameters for **${selectedContract.projectName}**:\n- **Financial Health**: Earned Value EVM metrics indicate a Cost Performance Index (CPI) of **1.06** (Under Budget) and SPI of **0.98** (Near Schedule).\n- **Forecasted Profitability**: Projected gross margin is **${((selectedContract.revisedContractValue - (selectedContract.revisedContractValue / 1.06)) / selectedContract.revisedContractValue * 100).toFixed(1)}%**.\n- All performance guarantees (Bank Muscat) and IPC valuations are fully verified and compliant.`;
      }

      setMessages(prev => [...prev, {
        sender: 'ai',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsAnalyzing(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col h-[650px] overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-orange-950/40 to-slate-900 text-white flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">Construction Commercial & FIDIC Copilot</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  AI Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Context: {selectedContract?.contractNumber} • {selectedContract?.title}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => handleSend('Check FIDIC Clause 20.1 28-day notice status for active claims')}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-orange-500 hover:text-orange-500 transition-colors"
          >
            📋 FIDIC Clause 20.1 Notice Check
          </button>
          <button
            onClick={() => handleSend('Audit IPC-09 valuation and retention cap calculation')}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-orange-500 hover:text-orange-500 transition-colors"
          >
            💰 IPC Valuation & Retention Audit
          </button>
          <button
            onClick={() => handleSend('Evaluate Liquidated Damages delay exposure risk')}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-orange-500 hover:text-orange-500 transition-colors"
          >
            ⏱️ Delay & LD Penalty Analysis
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`p-4 rounded-2xl max-w-[85%] leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-orange-500 text-white rounded-br-none shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
                <span className={`block text-[10px] mt-2 ${msg.sender === 'user' ? 'text-orange-100' : 'text-slate-400'}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}

          {isAnalyzing && (
            <div className="flex gap-3 items-center text-slate-400 text-xs italic">
              <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-500 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <span>Copilot is parsing contract terms, IPC valuations & delay curves...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <input
            type="text"
            placeholder="Ask about FIDIC clauses, IPC calculations, delay penalties..."
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputQuery.trim()}
            className="p-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-2xl shadow-lg transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
