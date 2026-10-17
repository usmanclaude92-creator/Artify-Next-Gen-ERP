// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 08: MANUFACTURING
// 08.04 — Work Centers, OEE & Scheduling Gantt View
// ==========================================

import React, { useState } from 'react';
import { useManufacturingStore } from '../../services/manufacturingStore';
import { WorkCenter } from '../../types';
import { ERPRouteState } from '../../../../types/erp';
import {
  Wrench,
  Cpu,
  Users,
  Calendar,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Activity,
  DollarSign,
  TrendingUp,
  Settings,
  ShieldCheck,
  Flame,
  ArrowRight
} from 'lucide-react';

interface WorkCentersViewProps {
  initialTab?: 'centers' | 'oee' | 'labor' | 'scheduling';
  onNavigate: (route: ERPRouteState) => void;
}

export const WorkCentersView: React.FC<WorkCentersViewProps> = ({
  initialTab = 'centers',
  onNavigate
}) => {
  const { workCenters, workOrders, updateWorkCenterOee } = useManufacturingStore();
  const [activeTab, setActiveTab] = useState<'centers' | 'oee' | 'labor' | 'scheduling'>(initialTab);
  const [selectedCenterId, setSelectedCenterId] = useState<string>(workCenters[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedCenter = workCenters.find((w) => w.id === selectedCenterId) || workCenters[0];

  const filteredCenters = workCenters.filter(
    (w) =>
      w.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.plantLocation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-orange-500/10 text-orange-700 dark:text-orange-400">
            <Wrench className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">08.04 — Work Centers, OEE Analytics & Shop Floor Dispatch</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Plant asset capacity, Overall Equipment Effectiveness (OEE), operator skill matrices, and finite visual dispatch Gantt.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('centers')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'centers'
              ? 'border-orange-500 text-orange-700 dark:text-orange-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Wrench className="w-4 h-4" />
          Work Centers Master ({workCenters.length})
        </button>
        <button
          onClick={() => setActiveTab('oee')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'oee'
              ? 'border-orange-500 text-orange-700 dark:text-orange-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          Machine Capacity & OEE Metrics
        </button>
        <button
          onClick={() => setActiveTab('labor')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'labor'
              ? 'border-orange-500 text-orange-700 dark:text-orange-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          Labor Capacity & Skill Matrix
        </button>
        <button
          onClick={() => setActiveTab('scheduling')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'scheduling'
              ? 'border-orange-500 text-orange-700 dark:text-orange-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Finite Scheduling & Dispatch Gantt
        </button>
      </div>

      {/* TAB 1: Work Centers Master */}
      {activeTab === 'centers' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left List */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500 dark:text-slate-400" />
              <input
                type="text"
                placeholder="Search work center, bay, machine..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="space-y-2">
              {filteredCenters.map((wc) => (
                <div
                  key={wc.id}
                  onClick={() => setSelectedCenterId(wc.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedCenter?.id === wc.id
                      ? 'bg-orange-500/10 border-orange-500/40 text-slate-900 dark:text-white'
                      : 'bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-orange-700 dark:text-orange-400">{wc.code}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {wc.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white mt-1">{wc.name}</h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 mt-2">
                    <span>{wc.plantLocation}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">OEE {wc.oeeOverallPct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Detail */}
          <div className="lg:col-span-2 space-y-4">
            {selectedCenter && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div>
                    <span className="font-mono text-xs font-bold text-orange-700 dark:text-orange-400">{selectedCenter.code}</span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{selectedCenter.name}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Plant: <strong className="text-slate-800 dark:text-slate-200">{selectedCenter.plantLocation}</strong> • Department:{' '}
                      <strong className="text-slate-800 dark:text-slate-200">{selectedCenter.department}</strong>
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-slate-600 dark:text-slate-400">Burden Hourly Rate</div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">
                      OMR {selectedCenter.totalHourlyBurdenRateOMR.toFixed(2)} / hr
                    </div>
                  </div>
                </div>

                {/* Capacity & Shift Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-center">
                    <div className="text-[10px] text-slate-600 dark:text-slate-400 uppercase font-medium">Shifts / Day</div>
                    <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{selectedCenter.shiftsPerDay} Shifts ({selectedCenter.hoursPerShift}h each)</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-center">
                    <div className="text-[10px] text-slate-600 dark:text-slate-400 uppercase font-medium">Capacity Efficiency</div>
                    <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{selectedCenter.efficiencyRatingPct}%</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-center">
                    <div className="text-[10px] text-slate-600 dark:text-slate-400 uppercase font-medium">Weekly Effective Hrs</div>
                    <div className="text-base font-bold text-cyan-600 dark:text-cyan-400 mt-0.5">{selectedCenter.effectiveCapacityHoursPerWeek} hrs</div>
                  </div>
                </div>

                {/* Installed Machines */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-orange-700 dark:text-orange-400" />
                    Installed Heavy Machinery & CNC Equipment ({selectedCenter.machines.length})
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedCenter.machines.map((m) => (
                      <div key={m.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-orange-700 dark:text-orange-400">{m.assetTag}</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                            {m.status}
                          </span>
                        </div>
                        <h5 className="font-semibold text-slate-900 dark:text-white">{m.name}</h5>
                        <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                          Model: {m.manufacturer} {m.modelNumber} ({m.spindlePowerKw} kW)
                        </p>
                        <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800">
                          <span>Next PM: {m.nextPmDueDate}</span>
                          <span>MTBF: {m.mtbfHours} hrs</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: OEE Metrics & Performance */}
      {activeTab === 'oee' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workCenters.map((wc) => (
              <div key={wc.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs text-orange-700 dark:text-orange-400 font-bold">{wc.code}</span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{wc.name}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-600 dark:text-slate-400">Target: 85.0%</span>
                    <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{wc.oeeOverallPct}%</div>
                  </div>
                </div>

                <div className="space-y-3 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                  {/* Availability */}
                  <div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                      <span>Availability (Uptime):</span>
                      <strong className="text-slate-900 dark:text-white">{wc.oeeAvailabilityPct}%</strong>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${wc.oeeAvailabilityPct}%` }} />
                    </div>
                  </div>

                  {/* Performance */}
                  <div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                      <span>Performance (Speed vs Nominal):</span>
                      <strong className="text-slate-900 dark:text-white">{wc.oeePerformancePct}%</strong>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: `${wc.oeePerformancePct}%` }} />
                    </div>
                  </div>

                  {/* Quality */}
                  <div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                      <span>Quality (First Pass Yield):</span>
                      <strong className="text-slate-900 dark:text-white">{wc.oeeQualityPct}%</strong>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${wc.oeeQualityPct}%` }} />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-400 pt-1">
                  <span>Hourly Machine Absorption:</span>
                  <strong className="text-slate-900 dark:text-white font-mono">OMR {wc.standardMachineRatePerHourOMR.toFixed(2)}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Labor Capacity & Skill Matrix */}
      {activeTab === 'labor' && selectedCenter && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Qualified Operators & Certified Skill Matrix — {selectedCenter.name}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                ASME IX weld certifications, API 6D assembly compliance, NDT Level-II inspection qualifications.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">Operator Name</th>
                  <th className="p-3">Designation / Role</th>
                  <th className="p-3">Direct Certifications</th>
                  <th className="p-3 text-center">Hourly Rate</th>
                  <th className="p-3 text-center">Assigned Shift</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {selectedCenter.qualifiedOperators.map((op) => (
                  <tr key={op.id} className="hover:bg-slate-100/70 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">{op.name}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">{op.role}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {op.certifications.map((c, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-500/20 text-[10px] font-bold"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      OMR {op.hourlyRateOMR.toFixed(2)}
                    </td>
                    <td className="p-3 text-center text-slate-700 dark:text-slate-300">{op.shift}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Scheduling & Dispatch Gantt */}
      {activeTab === 'scheduling' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-700 dark:text-orange-400" />
                Weekly Shop Floor Dispatch Matrix (Gantt Schedule)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Finite work order allocations mapped across critical work centers.
              </p>
            </div>
            <span className="text-xs text-orange-700 dark:text-orange-400 font-bold bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
              Current Week: W-34
            </span>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950">
            {/* Days header */}
            <div className="grid grid-cols-8 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 bg-white/80 dark:bg-slate-900/80 p-3">
              <div className="col-span-1">Work Center</div>
              {days.map((d) => (
                <div key={d} className="text-center">{d}</div>
              ))}
            </div>

            {/* Rows for each work center */}
            <div className="divide-y divide-slate-200/80 dark:divide-slate-800/80">
              {workCenters.map((wc, idx) => (
                <div key={wc.id} className="grid grid-cols-8 p-3 text-xs items-center hover:bg-white/40 dark:hover:bg-slate-900/40">
                  <div className="col-span-1 pr-2">
                    <span className="font-mono text-orange-700 dark:text-orange-400 font-bold">{wc.code}</span>
                    <div className="text-[11px] text-slate-900 dark:text-white truncate">{wc.name}</div>
                  </div>

                  {/* Gantt Bar mock across days */}
                  <div className="col-span-7 grid grid-cols-7 gap-1">
                    {idx === 0 && (
                      <>
                        <div className="col-span-3 bg-gradient-to-r from-orange-600 to-amber-600 rounded-lg p-2 text-white font-bold text-[10px] shadow-sm flex items-center justify-between">
                          <span>WO-2026-0081 (Forgings)</span>
                          <span className="bg-black/40 px-1 rounded text-[9px]">Run</span>
                        </div>
                        <div className="col-span-2 bg-purple-600/80 rounded-lg p-2 text-white font-bold text-[10px] flex items-center justify-between">
                          <span>WO-2026-0082</span>
                          <span className="bg-black/40 px-1 rounded text-[9px]">Setup</span>
                        </div>
                        <div className="col-span-2 bg-slate-100/70 dark:bg-slate-800/40 rounded-lg p-2 text-slate-500 dark:text-slate-400 text-[10px] text-center">
                          Free Slot
                        </div>
                      </>
                    )}

                    {idx === 1 && (
                      <>
                        <div className="col-span-1 bg-slate-100/70 dark:bg-slate-800/40 rounded-lg p-2 text-slate-500 dark:text-slate-400 text-[10px] text-center">
                          PM Maint
                        </div>
                        <div className="col-span-4 bg-cyan-600 rounded-lg p-2 text-white font-bold text-[10px] flex items-center justify-between">
                          <span>WO-2026-0081 (Inconel Clad)</span>
                          <span className="bg-black/40 px-1 rounded text-[9px]">Run</span>
                        </div>
                        <div className="col-span-2 bg-slate-100/70 dark:bg-slate-800/40 rounded-lg p-2 text-slate-500 dark:text-slate-400 text-[10px] text-center">
                          Available
                        </div>
                      </>
                    )}

                    {idx === 2 && (
                      <>
                        <div className="col-span-2 bg-slate-100/70 dark:bg-slate-800/40 rounded-lg p-2 text-slate-500 dark:text-slate-400 text-[10px] text-center">
                          Clean Prep
                        </div>
                        <div className="col-span-3 bg-emerald-600 rounded-lg p-2 text-white font-bold text-[10px] flex items-center justify-between">
                          <span>WO-2026-0083 (Actuators)</span>
                          <span className="bg-black/40 px-1 rounded text-[9px]">Run</span>
                        </div>
                        <div className="col-span-2 bg-emerald-700/80 rounded-lg p-2 text-white font-bold text-[10px] flex items-center justify-between">
                          <span>WO-2026-0084</span>
                          <span className="bg-black/40 px-1 rounded text-[9px]">QC</span>
                        </div>
                      </>
                    )}

                    {idx === 3 && (
                      <>
                        <div className="col-span-3 bg-slate-100/70 dark:bg-slate-800/40 rounded-lg p-2 text-slate-500 dark:text-slate-400 text-[10px] text-center">
                          Test Rig Calib
                        </div>
                        <div className="col-span-4 bg-rose-600 rounded-lg p-2 text-white font-bold text-[10px] flex items-center justify-between">
                          <span>WO-2026-0081 (API 6D Hydro)</span>
                          <span className="bg-black/40 px-1 rounded text-[9px]">Hold-Pt</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
