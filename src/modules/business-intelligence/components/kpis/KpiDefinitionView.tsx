import React, { useState } from 'react';
import {
  Target,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Edit2,
  Trash2,
  Code,
  Layers,
  Sparkles
} from 'lucide-react';
import { useBI } from '../../services/biStore';
import { DemoDataBanner } from '../common/DemoDataBanner';
import { KPIDefinition } from '../../types';

export const KpiDefinitionView: React.FC = () => {
  const { kpis, addKpi, deleteKpi, updateKpi } = useBI();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New KPI Form State
  const [newKpi, setNewKpi] = useState<Partial<KPIDefinition>>({
    code: `KPI-GEN-${String(kpis.length + 1).padStart(2, '0')}`,
    name: '',
    description: '',
    category: 'Financial',
    module: 'Finance & Accounts',
    department: 'Corporate Finance',
    company: 'Artify Group Holdings',
    calculationDefinition: '',
    unit: '%',
    frequency: 'Monthly',
    direction: 'higher_is_better',
    owner: 'BI Administrator',
    status: 'Active',
    currentValue: 0,
    targetValue: 0,
    minThreshold: 0,
    maxThreshold: 100
  });

  const filteredKpis = kpis.filter(k => {
    const sTerm = (searchTerm || '').toLowerCase();
    const matchSearch =
      (k.name || '').toLowerCase().includes(sTerm) ||
      (k.code || '').toLowerCase().includes(sTerm) ||
      (k.department || '').toLowerCase().includes(sTerm);
    const matchCat = categoryFilter === 'all' || k.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKpi.name || !newKpi.calculationDefinition) return;

    const created: KPIDefinition = {
      id: `kpi-${Date.now()}`,
      code: newKpi.code || `KPI-${Date.now()}`,
      name: newKpi.name || 'Untitled KPI',
      description: newKpi.description || '',
      category: newKpi.category as any,
      module: newKpi.module || 'Enterprise Core',
      department: newKpi.department || 'General Management',
      company: newKpi.company || 'Artify Group',
      calculationDefinition: newKpi.calculationDefinition || '',
      unit: newKpi.unit || '%',
      frequency: newKpi.frequency as any,
      direction: newKpi.direction as any,
      owner: newKpi.owner || 'BI Admin',
      status: 'Active',
      currentValue: Number(newKpi.currentValue) || 0,
      targetValue: Number(newKpi.targetValue) || 0,
      minThreshold: Number(newKpi.minThreshold) || 0,
      maxThreshold: Number(newKpi.maxThreshold) || 100,
      historicalTrend: [
        { date: 'Q1', value: Number(newKpi.currentValue) * 0.9, target: Number(newKpi.targetValue) },
        { date: 'Q2', value: Number(newKpi.currentValue) * 0.95, target: Number(newKpi.targetValue) },
        { date: 'Q3', value: Number(newKpi.currentValue), target: Number(newKpi.targetValue) }
      ]
    };

    addKpi(created);
    setShowAddModal(false);
    setNewKpi({
      code: `KPI-GEN-${String(kpis.length + 2).padStart(2, '0')}`,
      name: '',
      description: '',
      category: 'Financial',
      module: 'Finance & Accounts',
      department: 'Corporate Finance',
      company: 'Artify Group Holdings',
      calculationDefinition: '',
      unit: '%',
      frequency: 'Monthly',
      direction: 'higher_is_better',
      owner: 'BI Administrator',
      status: 'Active',
      currentValue: 0,
      targetValue: 0,
      minThreshold: 0,
      maxThreshold: 100
    });
  };

  return (
    <div className="space-y-6">
      <DemoDataBanner moduleSource="Module 02.05 KPI Registry & Master Definitions" />

      {/* Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600" />
            Enterprise Key Performance Indicators (KPI) Registry
          </h2>
          <p className="text-xs text-slate-500">
            Define calculation algorithms, measurement units, collection frequencies, and target thresholds.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Define New KPI
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search KPI by code, title, or department..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-indigo-500 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
          >
            <option value="all">All KPI Categories</option>
            <option value="Financial">Financial</option>
            <option value="Operational">Operational</option>
            <option value="Customer">Customer</option>
            <option value="People">People & HR</option>
            <option value="Sustainability">Sustainability</option>
          </select>
        </div>
      </div>

      {/* KPI Definition Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredKpis.map(k => (
          <div
            key={k.id}
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  {k.code}
                </span>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                  {k.category}
                </span>
              </div>

              <h3 className="text-xs font-bold text-slate-900 leading-snug">{k.name}</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">{k.description}</p>

              <div className="mt-3 p-2 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-[10px] text-slate-400 font-mono uppercase">Formula</div>
                <div className="text-[11px] font-mono text-indigo-900 truncate mt-0.5">{k.calculationDefinition}</div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="text-[11px] text-slate-500">
                Owner: <strong className="text-slate-700">{k.owner}</strong> • Freq: <strong className="text-slate-700">{k.frequency}</strong>
              </div>

              <button
                onClick={() => deleteKpi(k.id)}
                className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                title="Delete KPI Definition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add KPI Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Create New Enterprise KPI Definition</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-semibold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">KPI Code</label>
                  <input
                    type="text"
                    required
                    value={newKpi.code}
                    onChange={e => setNewKpi(prev => ({ ...prev, code: e.target.value }))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Category</label>
                  <select
                    value={newKpi.category}
                    onChange={e => setNewKpi(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
                  >
                    <option value="Financial">Financial</option>
                    <option value="Operational">Operational</option>
                    <option value="Customer">Customer</option>
                    <option value="People">People & HR</option>
                    <option value="Sustainability">Sustainability</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">KPI Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Return on Capital Employed (ROCE)"
                  value={newKpi.name}
                  onChange={e => setNewKpi(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Description & Objective</label>
                <textarea
                  rows={2}
                  placeholder="Strategic objective and business context..."
                  value={newKpi.description}
                  onChange={e => setNewKpi(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Calculation Formula / Definition</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. (EBIT / (Total Assets - Current Liabilities)) * 100"
                  value={newKpi.calculationDefinition}
                  onChange={e => setNewKpi(prev => ({ ...prev, calculationDefinition: e.target.value }))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Unit</label>
                  <input
                    type="text"
                    value={newKpi.unit}
                    onChange={e => setNewKpi(prev => ({ ...prev, unit: e.target.value }))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Frequency</label>
                  <select
                    value={newKpi.frequency}
                    onChange={e => setNewKpi(prev => ({ ...prev, frequency: e.target.value as any }))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Target Direction</label>
                  <select
                    value={newKpi.direction}
                    onChange={e => setNewKpi(prev => ({ ...prev, direction: e.target.value as any }))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="higher_is_better">Higher is Better</option>
                    <option value="lower_is_better">Lower is Better</option>
                    <option value="target_exact">Target Exact</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Current Baseline</label>
                  <input
                    type="number"
                    step="any"
                    value={newKpi.currentValue}
                    onChange={e => setNewKpi(prev => ({ ...prev, currentValue: Number(e.target.value) }))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Target Value</label>
                  <input
                    type="number"
                    step="any"
                    value={newKpi.targetValue}
                    onChange={e => setNewKpi(prev => ({ ...prev, targetValue: Number(e.target.value) }))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Assigned Owner</label>
                  <input
                    type="text"
                    value={newKpi.owner}
                    onChange={e => setNewKpi(prev => ({ ...prev, owner: e.target.value }))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Register KPI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
