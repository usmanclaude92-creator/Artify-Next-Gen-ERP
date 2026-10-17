// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 12: SUPPLY CHAIN MANAGEMENT (SCM)
// SCM AI Copilot & Optimizer Modal
// ==========================================

import React, { useState } from 'react';
import { useScmStore } from '../../services/scmStore';
import {
  Sparkles,
  Zap,
  ShieldAlert,
  Ship,
  Globe,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Bot,
  Layers,
  Calculator
} from 'lucide-react';

interface ScmAIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScmAIAssistantModal: React.FC<ScmAIAssistantModalProps> = ({ isOpen, onClose }) => {
  const { kpiMetrics, freightShipments, currency } = useScmStore();
  const [selectedTopic, setSelectedTopic] = useState<'congestion' | 'hscode' | 'safetystock' | 'freight'>('congestion');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const runSimulation = () => {
    setIsSimulating(true);
    setSimulationResult(null);

    setTimeout(() => {
      setIsSimulating(false);
      if (selectedTopic === 'congestion') {
        setSimulationResult(
          'AI Congestion Model detected low risk (2.1% chance of delay) at Sohar Port. Recommendation: Maintain current ETA 2026-09-02 for SHP-OCN-2026-001. No demurrage buffer extension required.'
        );
      } else if (selectedTopic === 'hscode') {
        setSimulationResult(
          'AI HS Classifier mapped component "Duplex Steel Subsea Ball Valve" to GCC Unified Tariff Code 8481.80.90 (5.0% standard duty, exempt from anti-dumping tariffs).'
        );
      } else if (selectedTopic === 'safetystock') {
        setSimulationResult(
          'Multi-Echelon Buffer Model advises shifting 15 units of safety stock from Muscat Central Hub to Sohar RDC to reduce inter-hub transfer transit time by 48 hours and improve OTIF to 98.4%.'
        );
      } else {
        setSimulationResult(
          'Carrier Optimization Solver recommends booking Maersk Direct Ocean FCL route for the upcoming Q4 LNG shipment, saving 1,850 OMR compared to air freight with zero critical path disruption.'
        );
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Artify SCM Intelligence Copilot</h3>
              <p className="text-xs text-slate-400">
                Predictive port analytics, tariff classification & multi-echelon optimization
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-800"
          >
            ✕ Close
          </button>
        </div>

        {/* Intelligence Selection */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => { setSelectedTopic('congestion'); setSimulationResult(null); }}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              selectedTopic === 'congestion'
                ? 'bg-indigo-950/60 border-indigo-500 text-white'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Ship className="w-4 h-4 text-sky-400 mb-1" />
            <span className="text-xs font-bold block">Port Congestion</span>
            <span className="text-[10px] text-slate-500">Demurrage risk</span>
          </button>

          <button
            onClick={() => { setSelectedTopic('hscode'); setSimulationResult(null); }}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              selectedTopic === 'hscode'
                ? 'bg-indigo-950/60 border-indigo-500 text-white'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4 text-teal-400 mb-1" />
            <span className="text-xs font-bold block">HS Tariff Match</span>
            <span className="text-[10px] text-slate-500">GCC Bayan duty</span>
          </button>

          <button
            onClick={() => { setSelectedTopic('safetystock'); setSimulationResult(null); }}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              selectedTopic === 'safetystock'
                ? 'bg-indigo-950/60 border-indigo-500 text-white'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-400 mb-1" />
            <span className="text-xs font-bold block">Multi-Echelon Buffer</span>
            <span className="text-[10px] text-slate-500">Inventory balance</span>
          </button>

          <button
            onClick={() => { setSelectedTopic('freight'); setSimulationResult(null); }}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              selectedTopic === 'freight'
                ? 'bg-indigo-950/60 border-indigo-500 text-white'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Calculator className="w-4 h-4 text-emerald-400 mb-1" />
            <span className="text-xs font-bold block">Freight Cost Solver</span>
            <span className="text-[10px] text-slate-500">Mode comparison</span>
          </button>
        </div>

        {/* Interactive Simulation Area */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              {selectedTopic === 'congestion' && 'Simulate Port Congestion & Free-Time Telemetry'}
              {selectedTopic === 'hscode' && 'Automatic HS Code Harmonization & Tariff Screening'}
              {selectedTopic === 'safetystock' && 'Multi-Node Safety Stock Optimization'}
              {selectedTopic === 'freight' && 'Multimodal Freight Rate vs Lead Time Trade-off'}
            </span>

            <button
              onClick={runSimulation}
              disabled={isSimulating}
              className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{isSimulating ? 'Analyzing Telemetry...' : 'Run Copilot Solver'}</span>
            </button>
          </div>

          {simulationResult ? (
            <div className="p-4 bg-indigo-950/40 border border-indigo-700/60 rounded-xl text-xs text-indigo-200 leading-relaxed animate-fadeIn">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <p>{simulationResult}</p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl text-xs text-slate-400 text-center">
              Click &quot;Run Copilot Solver&quot; to evaluate telemetry data, current orders, and real-time transit status.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
