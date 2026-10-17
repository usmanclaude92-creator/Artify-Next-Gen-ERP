// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 14: QUALITY MANAGEMENT (QMS)
// Quality AI Copilot & 8D Root Cause Intelligence
// ==========================================

import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Flame,
  Search,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Send,
  X,
  Copy,
  Check,
  Brain,
  ShieldCheck
} from 'lucide-react';

interface QualityAICopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QualityAICopilotModal: React.FC<QualityAICopilotModalProps> = ({ isOpen, onClose }) => {
  const [selectedPrompt, setSelectedPrompt] = useState<string>('Analyze root causes for CNC flange wall thickness variation');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const [aiOutput, setAiOutput] = useState<string>(`### 🤖 QMS AI Root Cause Analysis & 8D Formulation

**1. Defect Category:** Dimensional Wall-Thickness Deviation (Machining Center 04)
**2. Primary Fishbone Vectors (6M Analysis):**
* **Machine:** Harmonic spindle vibration during finish turning pass at >1,800 RPM.
* **Method:** Setup sheet missing mandated dampened boring bar extension for L/D > 4.
* **Measurement:** Bore micrometer calibration expired by 2 days without auto-lockout.

**3. Suggested 5-Whys Sequence:**
* *Why 1:* Wall thickness was 0.35mm under lower specification limit (LSL).
* *Why 2:* Boring tool flexed under cutting load during deep cavity pass.
* *Why 3:* Standard tool holder was utilized instead of heavy-metal dampened holder.
* *Why 4:* Operator used outdated setup sheet Rev B instead of Rev D.
* *Why 5 (Root Cause):* Engineering Change Notification (ECN-2023-88) was not automatically synchronized to line terminal HMI.

**4. Recommended Permanent Corrective Actions (PCA):**
* Interlock ERP digital work instruction terminal so machines only boot with latest approved CNC setup revision.
* Install high-rigidity carbide dampened tooling for all bores exceeding 120mm depth.
* Establish automated lockout for inspection gauges exceeding calibration due date.`);

  if (!isOpen) return null;

  const handleRunAi = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setAiOutput(`### 🤖 QMS AI Analysis for: "${selectedPrompt}"

**Executive Assessment:**
* **ISO 9001:2015 Clause Alignment:** Clause 8.5.1 (Control of Production) & Clause 10.2 (Nonconformity & Corrective Action).
* **Statistical Process Capability:** Estimated CPk = 0.94 (Process currently unstable; immediate containment recommended).

**Action Plan:**
1. **Immediate Containment (D3):** Place active production lot into Quarantine Bay Q1 with Red Tagging.
2. **Root Cause Confirmation (D4):** Conduct Ishikawa 6M brainstorm and calibrate test gauges.
3. **Poka-Yoke Solution (D5):** Implement physical go/no-go fixture prior to weld release.
4. **Validation (D6):** Run pilot trial of 50 units with 100% inspection to confirm CPk >= 1.67.`);
    }, 900);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(aiOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Quality Management AI Copilot</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-50 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 border border-teal-300 dark:border-teal-700">
                  Gemini QMS Core
                </span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Root cause discovery, 8D generation & ISO compliance advisor</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggested Prompts */}
        <div className="space-y-2">
          <label className="text-xs text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">Quick Analysis Prompts</label>
          <div className="flex flex-wrap gap-1.5">
            {[
              'Analyze root causes for CNC flange wall thickness variation',
              'Draft D3 & D4 stages for porosity in TIG weld seam',
              'Recommend AQL sampling scheme for batch of 1,200 forged shafts',
              'Generate ISO 9001:2015 audit checklist for calibration'
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPrompt(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border text-left transition-all cursor-pointer ${
                  selectedPrompt === p
                    ? 'bg-teal-600 border-teal-500 text-white'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input prompt */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={selectedPrompt}
            onChange={e => setSelectedPrompt(e.target.value)}
            placeholder="Ask Quality AI about defects, 8D CAPA, tolerances..."
            className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
          <button
            onClick={handleRunAi}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-teal-600/30 transition-all cursor-pointer shrink-0 disabled:opacity-50"
          >
            {isGenerating ? (
              <span>Analyzing...</span>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate</span>
              </>
            )}
          </button>
        </div>

        {/* Output canvas */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 max-h-72 overflow-y-auto space-y-2 relative">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5" />
              <span>Synthesized QMS Intelligence</span>
            </span>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed font-sans">
            {aiOutput}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>ISO 9001:2015 & IATF 16949 Grounded</span>
          </span>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
