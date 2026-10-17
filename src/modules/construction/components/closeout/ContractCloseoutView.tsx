// ==========================================
// 15.08 CONTRACT CLOSEOUT VIEW
// Final Account, Defect Liability (DLP), Retention Release & Commercial Closeout
// ==========================================

import React, { useState } from 'react';
import { useConstructionStore } from '../../services/constructionStore';
import {
  CheckCircle,
  FileCheck2,
  Calendar,
  DollarSign,
  ShieldCheck,
  Award,
  Layers,
  CheckSquare,
  AlertCircle,
  Building,
  CheckCircle2
} from 'lucide-react';

export const ContractCloseoutView: React.FC = () => {
  const {
    selectedContractId,
    contracts,
    currency
  } = useConstructionStore();

  const [activeTab, setActiveTab] = useState<'final-account' | 'dlp-warranty' | 'retention-release' | 'closeout-checklist'>('final-account');

  const selectedContract = contracts.find(c => c.id === selectedContractId) || contracts[0];

  const origVal = selectedContract?.originalContractValue || 28500000;
  const vosVal = selectedContract?.approvedVariationsValue || 1230000;
  const finalAgreedSum = origVal + vosVal;
  const totalRetention = finalAgreedSum * 0.05;
  const stage1Release = totalRetention * 0.5;
  const stage2Release = totalRetention * 0.5;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-slate-900 dark:text-white shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-400 text-xs font-semibold uppercase tracking-wider">
            <CheckCircle className="w-3.5 h-3.5" />
            Module 15.08 — Contract Closeout
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Contract Closeout & Final Account Settlement</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Taking-Over Certificates (TOC), Defect Liability Period (DLP) warranty obligations, dual-stage retention release, and final commercial handover.
          </p>
        </div>

        <div className="bg-slate-100/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 p-4 rounded-xl text-right">
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Final Account Agreed Sum</span>
          <p className="text-2xl font-bold text-teal-600 dark:text-teal-400 font-mono mt-0.5">
            {currency} {(finalAgreedSum / 1000000).toFixed(2)}M
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">100% Reconciled</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('final-account')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'final-account'
                ? 'bg-teal-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Final Account Statement
          </button>
          <button
            onClick={() => setActiveTab('dlp-warranty')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'dlp-warranty'
                ? 'bg-teal-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Defect Liability Period (DLP)
          </button>
          <button
            onClick={() => setActiveTab('retention-release')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'retention-release'
                ? 'bg-teal-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Dual-Stage Retention Release
          </button>
          <button
            onClick={() => setActiveTab('closeout-checklist')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'closeout-checklist'
                ? 'bg-teal-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Commercial Handover Checklist
          </button>
        </div>
      </div>

      {/* Tab 1: Final Account Statement */}
      {activeTab === 'final-account' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Final Account Reconciliation Statement
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Contract: <strong>{selectedContract?.contractNumber}</strong> — {selectedContract?.title}
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
              Jointly Agreed with Employer
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-slate-700 dark:text-slate-300">1. Original Contract Sum</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{currency} {origVal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-slate-700 dark:text-slate-300">2. Net Value of Approved Variation Orders (VO 01 to 03)</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">+{currency} {vosVal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-slate-700 dark:text-slate-300">3. Prime Cost & Provisional Sums Adjustments</span>
              <span className="font-mono font-semibold text-slate-500 dark:text-slate-400">{currency} 0.00</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-slate-700 dark:text-slate-300">4. Claims for Disruption / Acceleration</span>
              <span className="font-mono font-semibold text-slate-500 dark:text-slate-400">{currency} 0.00</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-slate-700 dark:text-slate-300">5. Less: Liquidated Damages / Penalties Deducted</span>
              <span className="font-mono font-semibold text-slate-500 dark:text-slate-400">({currency} 0.00)</span>
            </div>

            <div className="flex justify-between py-3 bg-teal-50/50 dark:bg-teal-950/40 px-4 rounded-xl font-bold text-sm text-slate-900 dark:text-white mt-4">
              <span>FINAL AGREED CONTRACT SETTLEMENT VALUE</span>
              <span className="font-mono text-teal-600 dark:text-teal-400">{currency} {finalAgreedSum.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: DLP */}
      {activeTab === 'dlp-warranty' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400">DLP Warranty Duration</span>
            <p className="text-xl font-bold font-mono text-slate-900 dark:text-white">
              {selectedContract?.defectLiabilityPeriodMonths} Months
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">Statutory FIDIC Warranty</p>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400">Taking-Over Date (TOC)</span>
            <p className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400">
              {selectedContract?.revisedCompletionDate}
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">Commencement of DLP</p>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400">Final Performance Certificate</span>
            <p className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              2028-03-31
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">Final Retention Stage 2 Release</p>
          </div>
        </div>
      )}

      {/* Tab 3: Retention Release */}
      {activeTab === 'retention-release' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold px-2 py-1 rounded bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">Stage 1 (50%)</span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Released upon TOC</span>
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Taking-Over Retention Release</h4>
            <p className="text-xl font-mono font-bold text-slate-900 dark:text-white">
              {currency} {stage1Release.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Released upon issuance of Taking-Over Certificate and clearance of minor snags.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Stage 2 (50%)</span>
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Scheduled at DLP Expiry</span>
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Final Retention Release</h4>
            <p className="text-xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
              {currency} {stage2Release.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Released upon issuance of the Final Performance Certificate after 24 months.
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: Commercial Handover Checklist */}
      {activeTab === 'closeout-checklist' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            Project Handover & Authority Compliance Checklist
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-500 shrink-0" />
              <div>
                <strong className="text-slate-900 dark:text-white">As-Built CAD & BIM 3D Models:</strong>
                <p className="text-slate-500 dark:text-slate-400">Submitted and approved by Lead Consultant.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-500 shrink-0" />
              <div>
                <strong className="text-slate-900 dark:text-white">Operation & Maintenance (O&M) Manuals:</strong>
                <p className="text-slate-500 dark:text-slate-400">Delivered in 4 hardcopy sets + cloud repository.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-500 shrink-0" />
              <div>
                <strong className="text-slate-900 dark:text-white">Civil Defence (CDD) Fire NOC:</strong>
                <p className="text-slate-500 dark:text-slate-400">Final inspection passed, certificate issued.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-500 shrink-0" />
              <div>
                <strong className="text-slate-900 dark:text-white">Municipality Occupancy Permit:</strong>
                <p className="text-slate-500 dark:text-slate-400">Building Completion Certificate stamped.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
