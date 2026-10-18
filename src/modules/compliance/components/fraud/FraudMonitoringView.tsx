// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 17: COMPLIANCE, RISK & AUDIT
// 17.08 — Fraud Detection, AI Anomaly Scanner & GRC Cockpit
// ==========================================

import React, { useState } from 'react';
import { useComplianceStore } from '../../services/complianceStore';
import { FraudRedFlagAlert, BenfordAnalysisItem, PolicyDeclaration, DocumentRetentionRule } from '../../types';
import {
  ShieldAlert,
  Sparkles,
  BarChart3,
  FileLock2,
  Users2,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  RefreshCw,
  X,
  FileSpreadsheet
} from 'lucide-react';

export const FraudMonitoringView: React.FC = () => {
  const {
    fraudAlerts,
    benfordData,
    policyDeclarations,
    retentionRules,
    updateFraudAlertStatus,
    runAiAnomalyScan,
    isAiScanning
  } = useComplianceStore();

  const [activeTab, setActiveTab] = useState<'fraud' | 'benford' | 'whistleblower' | 'retention'>('fraud');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');

  // Modal for alert investigation
  const [selectedAlert, setSelectedAlert] = useState<FraudRedFlagAlert | null>(null);
  const [investigationNotes, setInvestigationNotes] = useState('');

  const filteredAlerts = fraudAlerts.filter(a => {
    const matchesSearch =
      a.alertCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.entityInvolved.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.anomalyDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.transactionReference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSev = selectedSeverity === 'ALL' || a.severity === selectedSeverity;
    return matchesSearch && matchesSev;
  });

  const handleUpdateAlertStatus = (status: FraudRedFlagAlert['investigationStatus']) => {
    if (!selectedAlert) return;
    updateFraudAlertStatus(selectedAlert.id, status, investigationNotes);
    setSelectedAlert(null);
    setInvestigationNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Submodule Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              17.08
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Fraud Detection, AI Anomaly Scanner & GRC Cockpit</h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time red flag telemetry, Benford's Law distribution analysis, statutory record retention, and annual ethics declarations.
          </p>
        </div>

        <button
          onClick={runAiAnomalyScan}
          disabled={isAiScanning}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-sm font-bold rounded-xl hover:from-emerald-700 hover:to-teal-800 transition cursor-pointer shadow-md disabled:opacity-50"
        >
          <Sparkles className={`w-4 h-4 ${isAiScanning ? 'animate-spin' : ''}`} />
          {isAiScanning ? 'Running Deep Anomaly Scan...' : 'Trigger AI GRC Scan'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('fraud')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'fraud'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-500/10 rounded-t-xl'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <ShieldAlert className="w-4 h-4" /> AI Red Flag Alerts ({fraudAlerts.length})
        </button>
        <button
          onClick={() => setActiveTab('benford')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'benford'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-500/10 rounded-t-xl'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" /> Benford's Law Analysis
        </button>
        <button
          onClick={() => setActiveTab('whistleblower')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'whistleblower'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-500/10 rounded-t-xl'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <Users2 className="w-4 h-4" /> Policy & Conflict Declarations ({policyDeclarations.length})
        </button>
        <button
          onClick={() => setActiveTab('retention')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'retention'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-500/10 rounded-t-xl'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <FileLock2 className="w-4 h-4" /> Statutory Document Retention ({retentionRules.length})
        </button>
      </div>

      {/* 1. FRAUD RED FLAG ALERTS */}
      {activeTab === 'fraud' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="md:col-span-2 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500 dark:text-slate-400" />
              <input
                type="text"
                placeholder="Search alert code, entity, anomaly, transaction ref..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <select
                value={selectedSeverity}
                onChange={e => setSelectedSeverity(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">All Severities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredAlerts.map(alert => (
              <div
                key={alert.id}
                onClick={() => setSelectedAlert(alert)}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-emerald-500 transition cursor-pointer space-y-3"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                      {alert.alertCode}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        alert.severity === 'CRITICAL'
                          ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-500/40'
                          : alert.severity === 'HIGH'
                          ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-800 dark:text-orange-200 border border-orange-300 dark:border-orange-500/40'
                          : 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-500/40'
                      }`}
                    >
                      {alert.severity} Risk
                    </span>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400">[{alert.alertType.replace(/_/g, ' ')}]</span>
                  </div>

                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold self-start md:self-auto ${
                      alert.investigationStatus === 'RESOLVED' || alert.investigationStatus === 'FALSE_POSITIVE'
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30'
                        : alert.investigationStatus === 'UNDER_INVESTIGATION'
                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30'
                        : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30'
                    }`}
                  >
                    {alert.investigationStatus.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{alert.anomalyDescription}</h4>
                  {alert.amountOMR && (
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100">
                      OMR {alert.amountOMR.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Target Entity / Account</span>
                    <strong className="text-slate-800 dark:text-slate-200">{alert.entityInvolved}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">AI Anomaly Confidence</span>
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">{alert.aiRiskScore}% Score</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. BENFORD'S LAW ANALYSIS */}
      {activeTab === 'benford' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Benford's Law (First Digit Distribution Analysis)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evaluates 100% of vendor disbursement journal entries against the mathematical expected logarithmic frequency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-9 gap-3">
            {benfordData.map(item => (
              <div
                key={item.leadingDigit}
                className={`p-4 rounded-2xl border text-center space-y-2 ${
                  item.isAnomaly
                    ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-300 dark:border-rose-500/40 ring-2 ring-rose-200 dark:ring-rose-500/30'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                }`}
              >
                <span className="font-mono text-2xl font-black text-slate-900 dark:text-slate-100 block">
                  {item.leadingDigit}
                </span>
                <div className="space-y-0.5 text-xs">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Observed:</div>
                  <strong className={`font-mono text-sm block ${item.isAnomaly ? 'text-rose-700 dark:text-rose-300 font-bold' : 'text-slate-800 dark:text-slate-200'}`}>
                    {item.observedPercent}%
                  </strong>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Expected: {item.expectedBenfordPercent}%</div>
                </div>
                {item.isAnomaly && (
                  <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-200 dark:bg-rose-500/30 text-rose-900 dark:text-rose-100 uppercase">
                    Anomaly
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. POLICY & CONFLICT DECLARATIONS */}
      {activeTab === 'whistleblower' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Annual Ethics & Conflict of Interest Register</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Statutory employee declarations and gift hospitality disclosures.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Employee ID & Name</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Policy Type</th>
                  <th className="px-4 py-3">Signed Date</th>
                  <th className="px-4 py-3">Disclosures</th>
                  <th className="px-4 py-3">Compliance Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {policyDeclarations.map(dec => (
                  <tr key={dec.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="px-5 py-4 text-xs font-bold text-slate-900 dark:text-slate-100">
                      {dec.employeeName} <span className="font-mono text-slate-500 dark:text-slate-400 font-normal">({dec.employeeId})</span>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-600 dark:text-slate-400">{dec.department}</td>
                    <td className="px-4 py-4 font-mono text-xs text-slate-800 dark:text-slate-200">{dec.policyType.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-4 font-mono text-xs text-slate-600 dark:text-slate-400">{dec.signedDate}</td>
                    <td className="px-4 py-4 text-xs">
                      {dec.disclosuresMade ? (
                        <span className="px-2 py-0.5 rounded font-semibold bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-500/30">
                          {dec.disclosureDetails}
                        </span>
                      ) : (
                        <span className="text-slate-500 dark:text-slate-400 font-mono">None Declared</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. STATUTORY RETENTION RULES */}
      {activeTab === 'retention' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Corporate Records Retention Schedule</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Legal hold enforcement and mandatory statutory retention periods.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Record Category</th>
                  <th className="px-4 py-3">Mandatory Period</th>
                  <th className="px-4 py-3">Statutory Legal Mandate</th>
                  <th className="px-4 py-3">Storage Format</th>
                  <th className="px-4 py-3">Legal Hold</th>
                  <th className="px-4 py-3">Archived Records</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {retentionRules.map(rule => (
                  <tr key={rule.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="px-5 py-4 font-bold text-slate-900 dark:text-slate-100 text-xs">{rule.recordCategory}</td>
                    <td className="px-4 py-4 font-mono font-bold text-xs text-indigo-700 dark:text-indigo-300">{rule.mandatoryRetentionYears} Years</td>
                    <td className="px-4 py-4 text-xs text-slate-600 dark:text-slate-400">{rule.regulatoryMandate}</td>
                    <td className="px-4 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">{rule.storageFormat.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-4">
                      {rule.legalHoldActive ? (
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-500/40">
                          Active Legal Hold
                        </span>
                      ) : (
                        <span className="text-slate-500 dark:text-slate-400 text-xs">Standard</span>
                      )}
                    </td>
                    <td className="px-4 py-4 font-mono text-xs text-slate-900 dark:text-slate-100 font-semibold">
                      {rule.totalArchivedRecordsCount.toLocaleString()} Records
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: INVESTIGATE ALERT */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm bg-slate-100 px-2 py-0.5 rounded">
                  {selectedAlert.alertCode}
                </span>
                <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                  {selectedAlert.severity}
                </span>
              </div>
              <button onClick={() => setSelectedAlert(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 text-sm">{selectedAlert.anomalyDescription}</h4>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Transaction Reference:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedAlert.transactionReference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Entity:</span>
                  <strong className="text-slate-800">{selectedAlert.entityInvolved}</strong>
                </div>
              </div>

              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
                <span className="font-bold text-indigo-900 block mb-1">AI Recommendation:</span>
                <p className="text-indigo-950">{selectedAlert.aiSuggestedAction}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Investigator Disposition Notes</label>
                <textarea
                  rows={2}
                  placeholder="Record investigation findings or audit committee minutes..."
                  value={investigationNotes}
                  onChange={e => setInvestigationNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex flex-wrap justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleUpdateAlertStatus('FALSE_POSITIVE')}
                className="px-3 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Mark False Positive
              </button>
              <button
                type="button"
                onClick={() => handleUpdateAlertStatus('UNDER_INVESTIGATION')}
                className="px-3 py-2 font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition cursor-pointer"
              >
                Open Case Investigation
              </button>
              <button
                type="button"
                onClick={() => handleUpdateAlertStatus('RESOLVED')}
                className="px-4 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition cursor-pointer shadow-sm"
              >
                Resolve & Close Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
