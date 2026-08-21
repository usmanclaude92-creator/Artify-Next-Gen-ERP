// ==========================================
// ARTIFY ERP — MODULE 13: ASSET MANAGEMENT
// 13.04 Asset Valuation, Depreciation, Revaluation & Impairment
// ==========================================

import React, { useState } from 'react';
import { useAssetStore } from '../../services/assetStore';
import {
  TrendingDown,
  Play,
  CheckCircle,
  FileSpreadsheet,
  Layers,
  Scale,
  AlertOctagon,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  DollarSign,
  Calendar,
  Eye,
  CheckCircle2,
  FileCheck
} from 'lucide-react';

export const AssetValuationView: React.FC = () => {
  const {
    assets,
    categories,
    depreciationRuns,
    revaluations,
    impairmentTests,
    currency,
    executeDepreciationRun,
    postRevaluation,
    postImpairment
  } = useAssetStore();

  const [activeTab, setActiveTab] = useState<'depreciation' | 'revaluation' | 'impairment' | 'schedule'>('depreciation');
  const [selectedPeriodMonth, setSelectedPeriodMonth] = useState(8); // August
  const [selectedFiscalYear, setSelectedFiscalYear] = useState(2026);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showRevalModal, setShowRevalModal] = useState(false);
  const [showImpairModal, setShowImpairModal] = useState(false);

  // Revaluation Form
  const [revalForm, setRevalForm] = useState({
    assetId: assets[0]?.id || '',
    appraiserName: 'Savills Middle East Chartered Surveyors',
    appraisalMethod: 'DEPRECIATED_REPLACEMENT_COST' as any,
    newAppraisedFairValue: 650000,
    newUsefulLifeMonths: 140,
    notes: 'Professional valuation conducted for audited interim financial statements.'
  });

  // Impairment Form
  const [impairForm, setImpairForm] = useState({
    assetId: assets[0]?.id || '',
    fairValueLessCostsToSell: 180000,
    valueInUse: 195000,
    triggerEvent: 'Significant market decline in equipment utilization rates in oil & gas sector.'
  });

  const handleRunDepreciation = () => {
    setIsExecuting(true);
    setTimeout(() => {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const periodName = `${monthNames[selectedPeriodMonth - 1]} ${selectedFiscalYear}`;
      executeDepreciationRun(selectedFiscalYear, selectedPeriodMonth, periodName);
      setIsExecuting(false);
      alert(`Depreciation for ${periodName} executed and posted to General Ledger successfully!`);
    }, 600);
  };

  const handleCreateRevaluation = (e: React.FormEvent) => {
    e.preventDefault();
    const targetAsset = assets.find(a => a.id === revalForm.assetId) || assets[0];
    const surplus = Number(revalForm.newAppraisedFairValue) - targetAsset.netBookValue;

    postRevaluation({
      assetId: targetAsset.id,
      assetTag: targetAsset.assetTag,
      assetName: targetAsset.name,
      revaluationDate: new Date().toISOString().split('T')[0],
      appraiserName: revalForm.appraiserName,
      appraisalMethod: revalForm.appraisalMethod,
      historicalNBV: targetAsset.netBookValue,
      newAppraisedFairValue: Number(revalForm.newAppraisedFairValue),
      revaluationSurplus: surplus,
      newUsefulLifeRemainingMonths: Number(revalForm.newUsefulLifeMonths),
      effectiveDepreciationRate: 8.5,
      notes: revalForm.notes
    });

    setShowRevalModal(false);
  };

  const handleCreateImpairment = (e: React.FormEvent) => {
    e.preventDefault();
    const targetAsset = assets.find(a => a.id === impairForm.assetId) || assets[0];
    const recoverable = Math.max(Number(impairForm.fairValueLessCostsToSell), Number(impairForm.valueInUse));
    const loss = Math.max(0, targetAsset.netBookValue - recoverable);

    postImpairment({
      assetId: targetAsset.id,
      assetTag: targetAsset.assetTag,
      assetName: targetAsset.name,
      testDate: new Date().toISOString().split('T')[0],
      carryingAmount: targetAsset.netBookValue,
      fairValueLessCostsToSell: Number(impairForm.fairValueLessCostsToSell),
      valueInUse: Number(impairForm.valueInUse),
      recoverableAmount: recoverable,
      impairmentLoss: loss,
      triggerEvent: impairForm.triggerEvent,
      assessor: 'Asset Impairment Assessment Committee'
    });

    setShowImpairModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-950 text-amber-400 border border-amber-800">
                13.04
              </span>
              <h2 className="text-xl font-black text-white">Asset Valuation, Depreciation & IAS 36</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Automated periodic depreciation engine, fair value revaluation reserve, and impairment write-down testing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowRevalModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition-all cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Asset Revaluation</span>
            </button>

            <button
              onClick={() => setShowImpairModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition-all cursor-pointer"
            >
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              <span>Impairment Test (IAS 36)</span>
            </button>
          </div>
        </div>

        {/* Sub Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('depreciation')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'depreciation'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>Monthly Depreciation Run Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('revaluation')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'revaluation'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Revaluation Reserve ({revaluations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('impairment')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'impairment'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
            <span>Impairment Testing ({impairmentTests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'schedule'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Comprehensive Valuation Matrix</span>
          </button>
        </div>
      </div>

      {/* VIEW: DEPRECIATION RUN ENGINE */}
      {activeTab === 'depreciation' && (
        <div className="space-y-6">
          {/* Execution Control Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <h3 className="text-base font-bold text-white">Execute Period Depreciation Batch</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Processes Straight-Line and Declining-Balance schedules across all {assets.length} active registered assets and generates GL Journal Vouchers.
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <select
                  value={selectedPeriodMonth}
                  onChange={e => setSelectedPeriodMonth(Number(e.target.value))}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value={8}>August (Period 8)</option>
                  <option value={9}>September (Period 9)</option>
                  <option value={10}>October (Period 10)</option>
                  <option value={11}>November (Period 11)</option>
                  <option value={12}>December (Period 12)</option>
                </select>

                <select
                  value={selectedFiscalYear}
                  onChange={e => setSelectedFiscalYear(Number(e.target.value))}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value={2026}>FY 2026</option>
                  <option value={2027}>FY 2027</option>
                </select>

                <button
                  onClick={handleRunDepreciation}
                  disabled={isExecuting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-amber-600/30 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{isExecuting ? 'Processing Batch Calculation...' : 'Execute & Post to GL'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Historical Depreciation Runs Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white">Historical Depreciation Ledger Runs</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Run Reference</th>
                    <th className="py-3 px-4">Accounting Period</th>
                    <th className="py-3 px-4">Execution Date</th>
                    <th className="py-3 px-4">Assets Depreciated</th>
                    <th className="py-3 px-4 text-right">Total Accrual Amount</th>
                    <th className="py-3 px-4">GL Journal Reference</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {depreciationRuns.map(run => (
                    <tr key={run.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-400">{run.runNumber}</td>
                      <td className="py-3.5 px-4 font-medium text-white">{run.periodName}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">{run.runDate}</td>
                      <td className="py-3.5 px-4 font-mono">{run.totalAssetsDepreciated} Fixed Assets</td>
                      <td className="py-3.5 px-4 text-right font-mono font-black text-rose-400">
                        {currency} {run.totalDepreciationAmount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-cyan-400">{run.glJournalVoucherNumber}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                          {run.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: REVALUATION RESERVE */}
      {activeTab === 'revaluation' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-white">IAS 16 Asset Revaluation Model & Equity Reserves</h3>
            <p className="text-xs text-slate-400">Track independent chartered appraisal increases credited to the Equity Revaluation Reserve.</p>
          </div>

          <div className="space-y-4">
            {revaluations.map(rev => (
              <div key={rev.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                        {rev.revaluationNumber}
                      </span>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                        {rev.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1">{rev.assetName}</h4>
                    <span className="font-mono text-xs text-slate-500">{rev.assetTag} • Appraiser: {rev.appraiserName}</span>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">Revaluation Surplus</div>
                    <div className="text-base font-black font-mono text-cyan-400">
                      +{currency} {rev.revaluationSurplus.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-slate-900/80 p-3 rounded-xl">
                    <div className="text-slate-500">Historical Net Book Value:</div>
                    <div className="font-mono font-bold text-slate-300">{currency} {rev.historicalNBV.toLocaleString()}</div>
                  </div>
                  <div className="bg-slate-900/80 p-3 rounded-xl">
                    <div className="text-slate-500">New Appraised Fair Value:</div>
                    <div className="font-mono font-bold text-emerald-400">{currency} {rev.newAppraisedFairValue.toLocaleString()}</div>
                  </div>
                  <div className="bg-slate-900/80 p-3 rounded-xl">
                    <div className="text-slate-500">Appraisal Method:</div>
                    <div className="text-slate-300 font-medium">{rev.appraisalMethod.replace(/_/g, ' ')}</div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 pt-1 italic">{rev.notes}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: IMPAIRMENT TESTING */}
      {activeTab === 'impairment' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-white">IAS 36 Impairment Testing & Write-down Register</h3>
            <p className="text-xs text-slate-400">
              Recoverable Amount = Max(Fair Value less Costs to Sell, Value in Use). When Carrying Value &gt; Recoverable Amount, an impairment loss is recognized.
            </p>
          </div>

          <div className="space-y-4">
            {impairmentTests.map(imp => (
              <div key={imp.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
                        {imp.testReference}
                      </span>
                      <span className="text-xs font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                        {imp.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1">{imp.assetName}</h4>
                    <span className="font-mono text-xs text-slate-500">{imp.assetTag} • Test Date: {imp.testDate}</span>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">Impairment Loss (P&L)</div>
                    <div className="text-base font-black font-mono text-rose-400">
                      -{currency} {imp.impairmentLoss.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-900/80 p-2.5 rounded-xl">
                    <div className="text-slate-500">Carrying Amount</div>
                    <div className="font-mono font-bold text-slate-300">{currency} {imp.carryingAmount.toLocaleString()}</div>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-xl">
                    <div className="text-slate-500">FV less Costs to Sell</div>
                    <div className="font-mono font-bold text-slate-300">{currency} {imp.fairValueLessCostsToSell.toLocaleString()}</div>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-xl">
                    <div className="text-slate-500">Value In Use</div>
                    <div className="font-mono font-bold text-slate-300">{currency} {imp.valueInUse.toLocaleString()}</div>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-xl">
                    <div className="text-slate-500">Recoverable Amount</div>
                    <div className="font-mono font-bold text-emerald-400">{currency} {imp.recoverableAmount.toLocaleString()}</div>
                  </div>
                </div>

                <div className="text-xs text-slate-400 pt-1">
                  <span className="text-slate-500">Trigger Event: </span> {imp.triggerEvent}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: COMPREHENSIVE VALUATION MATRIX */}
      {activeTab === 'schedule' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-white">Fixed Asset Valuation Matrix</h3>
            <p className="text-xs text-slate-400">Comparison of Historical Cost Basis vs. Net Book Value vs. Fair Value Assessment.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Asset Tag</th>
                  <th className="py-3 px-4">Asset Description</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Cost Basis</th>
                  <th className="py-3 px-4 text-right">Accum Depr</th>
                  <th className="py-3 px-4 text-right">Net Book Value</th>
                  <th className="py-3 px-4 text-right">Revaluation Adj</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {assets.map(a => (
                  <tr key={a.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400">{a.assetTag}</td>
                    <td className="py-3.5 px-4 font-medium text-white">{a.name}</td>
                    <td className="py-3.5 px-4 text-slate-400">{a.categoryName}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                      {currency} {(a.originalCost + a.additionalCosts).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-rose-400">
                      ({a.accumulatedDepreciation.toLocaleString()})
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-black text-emerald-400">
                      {currency} {a.netBookValue.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-cyan-400">
                      {a.revaluationsTotal > 0 ? `+${currency} ${a.revaluationsTotal.toLocaleString()}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: REVALUATION */}
      {showRevalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-black text-white">Asset Revaluation Under IAS 16</h3>
              <button
                onClick={() => setShowRevalModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRevaluation} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Select Asset to Revalue *</label>
                <select
                  value={revalForm.assetId}
                  onChange={e => setRevalForm({ ...revalForm, assetId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  {assets.map(a => (
                    <option key={a.id} value={a.id}>{a.assetTag} — {a.name} (NBV: {currency} {a.netBookValue.toLocaleString()})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Independent Valuation Firm / Appraiser *</label>
                <input
                  type="text"
                  required
                  value={revalForm.appraiserName}
                  onChange={e => setRevalForm({ ...revalForm, appraiserName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Appraised Fair Market Value ({currency}) *</label>
                  <input
                    type="number"
                    required
                    value={revalForm.newAppraisedFairValue}
                    onChange={e => setRevalForm({ ...revalForm, newAppraisedFairValue: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Remaining Useful Life (Months)</label>
                  <input
                    type="number"
                    value={revalForm.newUsefulLifeMonths}
                    onChange={e => setRevalForm({ ...revalForm, newUsefulLifeMonths: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Appraisal Basis / Notes</label>
                <textarea
                  rows={3}
                  value={revalForm.notes}
                  onChange={e => setRevalForm({ ...revalForm, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRevalModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold cursor-pointer"
                >
                  Post Revaluation to Reserves
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: IMPAIRMENT TEST */}
      {showImpairModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-black text-white">IAS 36 Impairment Write-Down Test</h3>
              <button
                onClick={() => setShowImpairModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateImpairment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Select Asset to Test *</label>
                <select
                  value={impairForm.assetId}
                  onChange={e => setImpairForm({ ...impairForm, assetId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  {assets.map(a => (
                    <option key={a.id} value={a.id}>{a.assetTag} — {a.name} (Carrying: {currency} {a.netBookValue.toLocaleString()})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Fair Value less Selling Costs ({currency})</label>
                  <input
                    type="number"
                    value={impairForm.fairValueLessCostsToSell}
                    onChange={e => setImpairForm({ ...impairForm, fairValueLessCostsToSell: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Discounted Value in Use ({currency})</label>
                  <input
                    type="number"
                    value={impairForm.valueInUse}
                    onChange={e => setImpairForm({ ...impairForm, valueInUse: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Impairment Trigger Event *</label>
                <textarea
                  rows={3}
                  required
                  value={impairForm.triggerEvent}
                  onChange={e => setImpairForm({ ...impairForm, triggerEvent: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowImpairModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold cursor-pointer"
                >
                  Confirm Impairment Write-Down
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
