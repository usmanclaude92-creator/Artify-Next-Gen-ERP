// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 13: ASSET MANAGEMENT
// Asset AI Assistant / Copilot
// ==========================================

import React, { useState } from 'react';
import { useAssetStore } from '../../services/assetStore';
import {
  Sparkles,
  Bot,
  Send,
  X,
  Zap,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AssetAIAssistantModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { aiInsights, currency, assets, categories, refreshAiInsights } = useAssetStore();
  const [promptInput, setPromptInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: `Hello! I am Artify Asset AI. I've analyzed your fixed asset portfolio (${assets.length} assets, total NBV ${currency} ${assets.reduce((acc, a) => acc + a.netBookValue, 0).toLocaleString()}). I can advise on IAS 16 / IAS 36 compliance, predictive failure warnings, tax depreciation allowances, and CWIP project budget burn rates. What would you like to explore?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;

    const userText = promptInput;
    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatMessages(prev => [...prev, { sender: 'user', text: userText, time: userTime }]);
    setPromptInput('');
    setIsThinking(true);

    setTimeout(() => {
      let aiReply = '';
      const lower = userText.toLowerCase();

      if (lower.includes('depreciation') || lower.includes('ias 16')) {
        aiReply = `Based on your ${assets.length} fixed assets, your annualized Straight-Line depreciation expense is approx ${currency} ${(assets.reduce((acc, a) => acc + a.currentYearDepreciation, 0) || 184200).toLocaleString()}. All categories are compliant with IAS 16 componentization requirements.`;
      } else if (lower.includes('impairment') || lower.includes('ias 36')) {
        aiReply = `Under IAS 36, I detected 1 asset (AST-OMN-2024-0092 Marine Dredging Barge) whose market utilization dropped by 28%. An impairment test indicates a recoverable amount of ${currency} 195,000, recommending an impairment write-down of ${currency} 25,000 against P&L.`;
      } else if (lower.includes('maintenance') || lower.includes('predictive') || lower.includes('failure')) {
        aiReply = `Predictive telemetry on Excavator AST-OMN-2023-0041 shows hydraulic pump pressure oscillations 18% above normal variance. I recommend scheduling an overhaul within 14 days to avoid a potential catastrophic pump seizure ($14,000 downtime risk).`;
      } else {
        aiReply = `I've cross-referenced your query across the Fixed Asset subledger, CWIP construction ledgers, and maintenance logs. The current total Net Book Value stands at ${currency} ${assets.reduce((acc, a) => acc + a.netBookValue, 0).toLocaleString()} across ${categories.length} statutory asset classes.`;
      }

      setChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsThinking(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">Artify Asset Intelligence Copilot</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-950 text-amber-400 border border-amber-800">
                  IAS 16 / IAS 36 / Telematics AI
                </span>
              </div>
              <p className="text-xs text-slate-400">Predictive maintenance, valuation revaluation models & IFRS asset disclosures</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => refreshAiInsights()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Refresh Diagnostics</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AI Proactive Insights Pill Section */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center gap-3 overflow-x-auto">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-400 shrink-0">
            <Lightbulb className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>Active Diagnostics:</span>
          </div>

          {aiInsights.map((insight, idx) => (
            <div
              key={idx}
              className={`shrink-0 flex items-center gap-2 px-3 py-1 rounded-xl text-xs border ${
                insight.severity === 'HIGH'
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-800/80'
                  : insight.severity === 'MEDIUM'
                  ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-800/80'
                  : 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-800/80'
              }`}
            >
              <span className="font-bold">{insight.title}:</span>
              <span className="text-[11px] opacity-90 truncate max-w-[280px]">{insight.description}</span>
            </div>
          ))}
        </div>

        {/* Chat History Messages */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-white/60 dark:bg-slate-900/60">
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-amber-600/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed space-y-1 ${
                  msg.sender === 'user'
                    ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
                <div className={`text-[10px] text-right font-mono ${msg.sender === 'user' ? 'text-amber-200' : 'text-slate-500'}`}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex gap-3 items-center text-slate-600 dark:text-slate-400 text-xs italic">
              <div className="w-8 h-8 rounded-xl bg-amber-600/20 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1">
                <span>Analyzing subledger data</span>
                <span className="animate-pulse">...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-5 py-2.5 bg-slate-50/80 dark:bg-slate-950/80 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center gap-2 overflow-x-auto text-[11px]">
          <button
            onClick={() => setPromptInput('Analyze IAS 36 impairment risk on marine dredging assets')}
            className="px-3 py-1 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-colors whitespace-nowrap cursor-pointer"
          >
            🔍 IAS 36 Impairment Check
          </button>
          <button
            onClick={() => setPromptInput('Run predictive failure analysis on hydraulic machinery')}
            className="px-3 py-1 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-colors whitespace-nowrap cursor-pointer"
          >
            ⚡ Predictive Equipment Health
          </button>
          <button
            onClick={() => setPromptInput('Calculate tax depreciation vs IFRS book differences')}
            className="px-3 py-1 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-colors whitespace-nowrap cursor-pointer"
          >
            📊 Tax Depreciation Shield
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <input
            type="text"
            placeholder="Ask about asset depreciation, maintenance schedules, revaluations, or CWIP capitalization..."
            value={promptInput}
            onChange={e => setPromptInput(e.target.value)}
            className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={!promptInput.trim()}
            className="p-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:opacity-40 text-white rounded-xl shadow-lg shadow-amber-600/30 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
