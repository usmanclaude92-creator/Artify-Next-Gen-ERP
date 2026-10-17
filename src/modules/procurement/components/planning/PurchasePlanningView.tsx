import React, { useState } from 'react';
import { useProcurement } from '../../services/procurementStore';
import { ProcurementPlan, ProcurementPlanLine } from '../../types';
import {
  Calendar,
  TrendingUp,
  DollarSign,
  Plus,
  Filter,
  Search,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

export const PurchasePlanningView: React.FC = () => {
  const {
    plans,
    forecasts,
    budgetCategories,
    addProcurementPlan,
    updatePlanStatus,
    refreshForecasts
  } = useProcurement();

  const [activeTab, setActiveTab] = useState<'plans' | 'forecasts' | 'budgets'>('plans');
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // New Plan form state
  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState('Central Procurement');
  const [newYear, setNewYear] = useState<number>(2026);
  const [newBudgetOMR, setNewBudgetOMR] = useState<number>(500000);
  const [newRemarks, setNewRemarks] = useState('');

  const formatOMR = (amt: number) =>
    `OMR ${amt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addProcurementPlan({
      planTitle: newTitle,
      fiscalYear: newYear,
      department: newDept,
      preparedBy: 'Senior Procurement Specialist',
      totalEstimatedBudgetOMR: Number(newBudgetOMR),
      committedAmountOMR: 0,
      utilizedAmountOMR: 0,
      status: 'Draft',
      remarks: newRemarks || 'Generated via Annual Corporate Procurement Planning Module.',
      lines: [
        {
          id: `line-${Date.now()}-1`,
          category: 'Direct Materials',
          itemDescription: 'Primary Material Requirement Package',
          estimatedQuantity: 100,
          unitOfMeasure: 'Lots',
          estimatedUnitPriceOMR: Number(newBudgetOMR) / 100,
          estimatedTotalOMR: Number(newBudgetOMR),
          targetQuarter: 'Q1',
          targetMonth: '2026-03',
          procurementMethod: 'Selective RFQ',
          linkedDepartment: newDept,
          status: 'Planned'
        }
      ]
    });

    setShowAddPlanModal(false);
    setNewTitle('');
    setNewRemarks('');
  };

  return (
    <div className="space-y-6">
      {/* Sub-Header & Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('plans')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'plans'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>05.01.01 Procurement Plans</span>
          </button>
          <button
            onClick={() => setActiveTab('forecasts')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'forecasts'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>05.01.02 Purchase Forecasts</span>
          </button>
          <button
            onClick={() => setActiveTab('budgets')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'budgets'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>05.01.03 Procurement Budgets</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'plans' && (
            <button
              onClick={() => setShowAddPlanModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Procurement Plan</span>
            </button>
          )}
          {activeTab === 'forecasts' && (
            <button
              onClick={refreshForecasts}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Refresh AI Demand Forecast</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: PROCUREMENT PLANS */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {plan.planNumber}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        plan.status === 'Active'
                          ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200'
                          : plan.status === 'Approved'
                          ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-200'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {plan.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">{plan.planTitle}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Fiscal Year {plan.fiscalYear} • {plan.department} • Prepared by {plan.preparedBy}
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400">Total Budget</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{formatOMR(plan.totalEstimatedBudgetOMR)}</div>
                  </div>
                  <div className="h-7 w-px bg-slate-200 dark:bg-slate-700" />
                  <div>
                    <div className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400">Committed</div>
                    <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{formatOMR(plan.committedAmountOMR)}</div>
                  </div>
                  <div className="h-7 w-px bg-slate-200 dark:bg-slate-700" />
                  <div>
                    <div className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400">Utilized</div>
                    <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatOMR(plan.utilizedAmountOMR)}</div>
                  </div>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-700">
                      <th className="py-2.5 px-3">Item Description</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3 text-right">Est. Quantity</th>
                      <th className="py-2.5 px-3 text-right">Unit Rate</th>
                      <th className="py-2.5 px-3 text-right">Total (OMR)</th>
                      <th className="py-2.5 px-3">Quarter</th>
                      <th className="py-2.5 px-3">Sourcing Method</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {plan.lines.map((line) => (
                      <tr key={line.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                        <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-slate-100">{line.itemDescription}</td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{line.category}</td>
                        <td className="py-2.5 px-3 text-right text-slate-700 dark:text-slate-300">
                          {line.estimatedQuantity.toLocaleString()} {line.unitOfMeasure}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-700 dark:text-slate-300">{formatOMR(line.estimatedUnitPriceOMR)}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-slate-100">{formatOMR(line.estimatedTotalOMR)}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                            {line.targetQuarter} ({line.targetMonth})
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{line.procurementMethod}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              line.status === 'Completed'
                                ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200'
                                : line.status === 'Committed'
                                ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-200'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {line.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer Remarks */}
              <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span>{plan.remarks}</span>
                {plan.status === 'Draft' && (
                  <button
                    onClick={() => updatePlanStatus(plan.id, 'Approved')}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 cursor-pointer"
                  >
                    Approve Plan Schedule →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: PURCHASE FORECASTS */}
      {activeTab === 'forecasts' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">AI-Powered Demand Forecasting & Run-Rate Analysis</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Machine learning forecast based on 24-month historical consumption, active EPC project milestones, and supplier lead-times.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-700">
                  <th className="py-2.5 px-3">Item Code & Name</th>
                  <th className="py-2.5 px-3">Current Stock</th>
                  <th className="py-2.5 px-3">Lead Time</th>
                  <th className="py-2.5 px-3 text-right">Run Rate (Mo)</th>
                  <th className="py-2.5 px-3 text-right">Q1 Forecast</th>
                  <th className="py-2.5 px-3 text-right">Q2 Forecast</th>
                  <th className="py-2.5 px-3 text-right">Rec. Order Qty</th>
                  <th className="py-2.5 px-3 text-right">Est. Budget (OMR)</th>
                  <th className="py-2.5 px-3 text-center">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {forecasts.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{f.itemName}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{f.itemCode} • {f.category}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                      <span className={f.currentStockLevel < f.reorderPoint ? 'text-rose-600 dark:text-rose-400 font-bold' : ''}>
                        {f.currentStockLevel.toLocaleString()} units
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{f.leadTimeDays} days</td>
                    <td className="py-2.5 px-3 text-right font-medium text-slate-900 dark:text-slate-100">{f.historicalRunRateMonthly} / mo</td>
                    <td className="py-2.5 px-3 text-right text-slate-700 dark:text-slate-300">{f.forecastQ1Qty}</td>
                    <td className="py-2.5 px-3 text-right text-slate-700 dark:text-slate-300">{f.forecastQ2Qty}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-indigo-600 dark:text-indigo-400">{f.recommendedOrderQty}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-slate-100">{formatOMR(f.estimatedCostOMR)}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200">
                        {f.confidenceScore}% AI Confidence
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PROCUREMENT BUDGETS */}
      {activeTab === 'budgets' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgetCategories.map((b) => (
              <div key={b.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">
                      {b.categoryCode}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">{b.categoryName}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{b.department} • FY{b.fiscalYear}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-bold text-slate-900 dark:text-slate-100">{formatOMR(b.allocatedBudgetOMR)}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Total Sanctioned Limit</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400">Committed (PR + PO):</span>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">{formatOMR(b.committedPR_PO_OMR)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400">Invoiced Actuals:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatOMR(b.invoicedActualOMR)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800 pt-1">
                    <span className="font-bold text-slate-900 dark:text-slate-100">Remaining Headroom:</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{formatOMR(b.remainingBudgetOMR)}</span>
                  </div>
                </div>

                {/* Meter Bar */}
                <div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        b.utilizationPercentage > b.alertThresholdPercentage
                          ? 'bg-rose-500'
                          : 'bg-slate-900'
                      }`}
                      style={{ width: `${Math.min(100, b.utilizationPercentage)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1.5">
                    <span>Utilization: {b.utilizationPercentage}%</span>
                    <span>Alert Ceiling: {b.alertThresholdPercentage}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE PLAN MODAL */}
      {showAddPlanModal && (
        <div className="fixed inset-0 z-50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-700 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Create FY2026 Procurement Plan</h3>
            <form onSubmit={handleCreatePlan} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Plan Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. FY2026 Project Infrastructure Procurement Plan"
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Department</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900"
                  >
                    <option value="Central Procurement">Central Procurement</option>
                    <option value="Engineering & Infrastructure">Engineering & Infrastructure</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Manufacturing Operations">Manufacturing Operations</option>
                    <option value="Administration & HR">Administration & HR</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Estimated Budget (OMR)</label>
                  <input
                    type="number"
                    required
                    min={1000}
                    value={newBudgetOMR}
                    onChange={(e) => setNewBudgetOMR(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Remarks & Strategic Justification</label>
                <textarea
                  rows={3}
                  value={newRemarks}
                  onChange={(e) => setNewRemarks(e.target.value)}
                  placeholder="Strategic purpose and alignment with corporate annual targets..."
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddPlanModal(false)}
                  className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-xs cursor-pointer"
                >
                  Create Plan Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
