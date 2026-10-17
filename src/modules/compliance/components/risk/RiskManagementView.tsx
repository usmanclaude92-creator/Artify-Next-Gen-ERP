// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 17: COMPLIANCE, RISK & AUDIT
// 17.04 — Risk Management View (ERM & 5x5 Heatmap)
// ==========================================

import React, { useState } from 'react';
import { useComplianceStore } from '../../services/complianceStore';
import { RiskItem, RiskLevel, RiskCategory } from '../../types';
import {
  AlertTriangle,
  Grid,
  Shield,
  Plus,
  Search,
  Filter,
  DollarSign,
  TrendingDown,
  Activity,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  X,
  Target
} from 'lucide-react';

export const RiskManagementView: React.FC = () => {
  const { riskItems, addRiskItem, updateRiskItem } = useComplianceStore();

  const [activeTab, setActiveTab] = useState<'register' | 'heatmap' | 'mitigation'>('register');
  const [riskSearch, setRiskSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');

  // Modals
  const [isAddRiskOpen, setIsAddRiskOpen] = useState(false);
  const [selectedRiskDetail, setSelectedRiskDetail] = useState<RiskItem | null>(null);

  // Form state
  const [riskForm, setRiskForm] = useState<Omit<RiskItem, 'id' | 'inherentScore' | 'residualScore'>>({
    code: '',
    title: '',
    category: 'OPERATIONAL',
    description: '',
    riskOwner: '',
    department: 'Operations',
    inherentLikelihood: 3,
    inherentImpact: 3,
    inherentLevel: 'MEDIUM',
    residualLikelihood: 2,
    residualImpact: 2,
    residualLevel: 'LOW',
    financialExposureOMR: 50000,
    riskAppetiteStatus: 'WITHIN_APPETITE',
    mitigationStrategy: 'TREAT',
    mitigationPlanSummary: '',
    kriIndicators: [
      { name: 'Operational Variance Index', threshold: '< 5%', currentValue: '2.1%', status: 'GREEN' }
    ],
    status: 'ACTIVE',
    lastAssessedDate: new Date().toISOString().split('T')[0]
  });

  const filteredRisks = riskItems.filter(r => {
    const matchesSearch =
      r.code.toLowerCase().includes(riskSearch.toLowerCase()) ||
      r.title.toLowerCase().includes(riskSearch.toLowerCase()) ||
      r.riskOwner.toLowerCase().includes(riskSearch.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || r.category === selectedCategory;
    const matchesLevel = selectedLevel === 'ALL' || r.residualLevel === selectedLevel;
    return matchesSearch && matchesCat && matchesLevel;
  });

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'CRITICAL':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">Critical</span>;
      case 'HIGH':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-300">High</span>;
      case 'MEDIUM':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">Medium</span>;
      case 'LOW':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Low</span>;
    }
  };

  const handleAddRiskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!riskForm.code || !riskForm.title || !riskForm.riskOwner) return;
    addRiskItem(riskForm);
    setIsAddRiskOpen(false);
    setRiskForm({
      code: '',
      title: '',
      category: 'OPERATIONAL',
      description: '',
      riskOwner: '',
      department: 'Operations',
      inherentLikelihood: 3,
      inherentImpact: 3,
      inherentLevel: 'MEDIUM',
      residualLikelihood: 2,
      residualImpact: 2,
      residualLevel: 'LOW',
      financialExposureOMR: 50000,
      riskAppetiteStatus: 'WITHIN_APPETITE',
      mitigationStrategy: 'TREAT',
      mitigationPlanSummary: '',
      kriIndicators: [
        { name: 'Operational Variance Index', threshold: '< 5%', currentValue: '2.1%', status: 'GREEN' }
      ],
      status: 'ACTIVE',
      lastAssessedDate: new Date().toISOString().split('T')[0]
    });
  };

  // 5x5 Heatmap plotting matrix
  // Likelihood (rows 5 down to 1), Impact (columns 1 across to 5)
  const renderHeatmapCell = (likelihood: number, impact: number) => {
    const cellScore = likelihood * impact;
    let bgColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    if (cellScore >= 15) bgColor = 'bg-rose-100/90 text-rose-900 border-rose-300';
    else if (cellScore >= 10) bgColor = 'bg-orange-100/80 text-orange-900 border-orange-300';
    else if (cellScore >= 5) bgColor = 'bg-amber-50 text-amber-900 border-amber-200';

    // Find risks with matching inherent or residual positions
    const inherentMatches = riskItems.filter(
      r => r.inherentLikelihood === likelihood && r.inherentImpact === impact
    );
    const residualMatches = riskItems.filter(
      r => r.residualLikelihood === likelihood && r.residualImpact === impact
    );

    return (
      <div
        key={`${likelihood}-${impact}`}
        className={`h-24 p-2 rounded-xl border flex flex-col justify-between transition relative ${bgColor}`}
      >
        <div className="flex items-center justify-between text-[10px] font-mono opacity-60">
          <span>L:{likelihood} × I:{impact}</span>
          <span className="font-bold">Score: {cellScore}</span>
        </div>

        <div className="flex flex-wrap gap-1 items-center justify-center">
          {inherentMatches.map(r => (
            <span
              key={`inh-${r.id}`}
              onClick={() => setSelectedRiskDetail(r)}
              title={`Inherent: ${r.code} - ${r.title}`}
              className="px-1.5 py-0.5 rounded bg-slate-900 text-white text-[10px] font-mono font-bold cursor-pointer hover:scale-110 shadow-xs"
            >
              {r.code}
            </span>
          ))}
          {residualMatches.map(r => (
            <span
              key={`res-${r.id}`}
              onClick={() => setSelectedRiskDetail(r)}
              title={`Residual (After Mitigation): ${r.code} - ${r.title}`}
              className="px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-mono font-bold cursor-pointer hover:scale-110 shadow-xs ring-1 ring-white"
            >
              ✓ {r.code}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Submodule Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
              17.04
            </span>
            <h2 className="text-xl font-bold text-slate-900">Enterprise Risk Management (ERM) & Heatmap</h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Qualitative and quantitative risk scoring, dynamic 5x5 Inherent vs Residual risk matrix, and Key Risk Indicators (KRIs).
          </p>
        </div>

        <button
          onClick={() => setIsAddRiskOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Enterprise Risk
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('register')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'register'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Shield className="w-4 h-4" /> Risk Register ({riskItems.length})
        </button>
        <button
          onClick={() => setActiveTab('heatmap')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'heatmap'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Grid className="w-4 h-4" /> Interactive 5×5 Heatmap
        </button>
        <button
          onClick={() => setActiveTab('mitigation')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'mitigation'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Target className="w-4 h-4" /> Mitigation & KRIs
        </button>
      </div>

      {/* 1. RISK REGISTER */}
      {activeTab === 'register' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="md:col-span-2 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search risk by code, title, owner, department..."
                value={riskSearch}
                onChange={e => setRiskSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">All Categories</option>
                <option value="STRATEGIC">Strategic</option>
                <option value="FINANCIAL">Financial</option>
                <option value="OPERATIONAL">Operational</option>
                <option value="CYBER_SECURITY">Cyber & InfoSec</option>
                <option value="LEGAL_REGULATORY">Legal & Regulatory</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Risk Code & Category</th>
                    <th className="px-4 py-3">Risk Title & Description</th>
                    <th className="px-4 py-3">Risk Owner</th>
                    <th className="px-4 py-3 text-center">Inherent Score</th>
                    <th className="px-4 py-3 text-center">Residual Score</th>
                    <th className="px-4 py-3">Exposure (OMR)</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredRisks.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50 transition">
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                          {r.code}
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-1 capitalize">
                          {r.category.toLowerCase().replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-4 max-w-sm">
                        <p className="font-semibold text-slate-900 text-xs">{r.title}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{r.description}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-xs font-medium text-slate-900">{r.riskOwner}</p>
                        <span className="text-[11px] text-slate-400">{r.department}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="font-mono font-bold text-xs text-slate-800">{r.inherentScore} / 25</span>
                          <span className="text-[10px] text-slate-400">L:{r.inherentLikelihood} × I:{r.inherentImpact}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          {getRiskBadge(r.residualLevel)}
                          <span className="font-mono text-[10px] text-emerald-700 font-bold mt-1">
                            Score: {r.residualScore}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-mono text-xs font-bold text-slate-900">
                        OMR {r.financialExposureOMR.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => setSelectedRiskDetail(r)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer"
                        >
                          View Plan
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. 5x5 HEATMAP */}
      {activeTab === 'heatmap' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Inherent vs. Residual 5×5 Risk Matrix</h3>
              <p className="text-xs text-slate-500">
                Visual plotting of organizational risks before and after active internal controls and mitigation strategies.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-900 inline-block" />
                <span className="font-medium text-slate-700">Black: Inherent Risk</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-600 inline-block" />
                <span className="font-medium text-slate-700">Green: Residual Position</span>
              </div>
            </div>
          </div>

          {/* 5x5 Grid */}
          <div className="space-y-2">
            <div className="grid grid-cols-5 gap-2 text-center text-xs font-bold text-slate-500 uppercase tracking-wider pb-1">
              <span>Impact 1 (Insignificant)</span>
              <span>Impact 2 (Minor)</span>
              <span>Impact 3 (Moderate)</span>
              <span>Impact 4 (Major)</span>
              <span>Impact 5 (Catastrophic)</span>
            </div>

            {[5, 4, 3, 2, 1].map(likelihood => (
              <div key={likelihood} className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map(impact => renderHeatmapCell(likelihood, impact))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. MITIGATION & KRIs */}
      {activeTab === 'mitigation' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {riskItems.map(r => (
            <div key={r.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                  {r.code}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Strategy: {r.mitigationStrategy}
                </span>
              </div>

              <h4 className="font-bold text-slate-900 text-sm">{r.title}</h4>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Mitigation Plan</span>
                <p className="text-slate-700 leading-relaxed">{r.mitigationPlanSummary}</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <strong className="text-xs font-bold text-slate-700 block">Key Risk Indicators (KRIs):</strong>
                {r.kriIndicators.map((kri, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                    <span className="text-slate-800 font-medium">{kri.name}</span>
                    <div className="text-right font-mono text-[11px]">
                      <span className="text-slate-400 mr-2">Limit: {kri.threshold}</span>
                      <strong className="text-emerald-700 font-bold">{kri.currentValue}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: ADD RISK */}
      {isAddRiskOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-lg">Add Enterprise Risk Assessment</h3>
              <button onClick={() => setIsAddRiskOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRiskSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Risk Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RSK-FIN-05"
                    value={riskForm.code}
                    onChange={e => setRiskForm({ ...riskForm, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={riskForm.category}
                    onChange={e => setRiskForm({ ...riskForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  >
                    <option value="FINANCIAL">Financial</option>
                    <option value="STRATEGIC">Strategic</option>
                    <option value="OPERATIONAL">Operational</option>
                    <option value="CYBER_SECURITY">Cyber Security</option>
                    <option value="LEGAL_REGULATORY">Legal & Regulatory</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Risk Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Foreign Exchange Exposure on Euro Equipment Imports"
                  value={riskForm.title}
                  onChange={e => setRiskForm({ ...riskForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Risk Description</label>
                <textarea
                  rows={2}
                  value={riskForm.description}
                  onChange={e => setRiskForm({ ...riskForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Risk Owner *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zaid Al-Habsi"
                    value={riskForm.riskOwner}
                    onChange={e => setRiskForm({ ...riskForm, riskOwner: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Financial Exposure (OMR)</label>
                  <input
                    type="number"
                    value={riskForm.financialExposureOMR}
                    onChange={e => setRiskForm({ ...riskForm, financialExposureOMR: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>

              {/* Inherent Scoring */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <strong className="text-xs font-bold text-slate-800 block">Inherent Risk (Pre-Controls)</strong>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Likelihood (1 - 5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={riskForm.inherentLikelihood}
                      onChange={e => setRiskForm({ ...riskForm, inherentLikelihood: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Impact (1 - 5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={riskForm.inherentImpact}
                      onChange={e => setRiskForm({ ...riskForm, inherentImpact: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Residual Scoring */}
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
                <strong className="text-xs font-bold text-emerald-900 block">Residual Risk (Target Post-Mitigation)</strong>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-emerald-700 mb-1">Residual Likelihood (1 - 5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={riskForm.residualLikelihood}
                      onChange={e => setRiskForm({ ...riskForm, residualLikelihood: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-1.5 border border-emerald-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-emerald-700 mb-1">Residual Impact (1 - 5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={riskForm.residualImpact}
                      onChange={e => setRiskForm({ ...riskForm, residualImpact: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-1.5 border border-emerald-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mitigation Action Plan</label>
                <textarea
                  rows={2}
                  placeholder="Specific operational steps and internal controls implemented..."
                  value={riskForm.mitigationPlanSummary}
                  onChange={e => setRiskForm({ ...riskForm, mitigationPlanSummary: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddRiskOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition cursor-pointer shadow-sm"
                >
                  Save to Risk Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
