// ==========================================
// 15.03 SITE & WORK MANAGEMENT VIEW
// Site Profiles, Work Orders, Project Milestones & Daily Site Diary (DSR)
// ==========================================

import React, { useState } from 'react';
import { useConstructionStore } from '../../services/constructionStore';
import { SiteProfile, SiteWorkOrder, ProjectMilestone, SiteDailyActivityLog } from '../../types/constructionTypes';
import {
  MapPin,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  HardHat,
  Calendar,
  Truck,
  Sun,
  ShieldCheck,
  CheckSquare,
  Users,
  Activity,
  FileText
} from 'lucide-react';

export const SiteWorkManagementView: React.FC = () => {
  const {
    sites,
    workOrders,
    milestones,
    siteLogs,
    selectedContractId,
    contracts,
    currency,
    addSiteWorkOrder,
    addSiteDailyLog
  } = useConstructionStore();

  const [activeTab, setActiveTab] = useState<'sites' | 'work-orders' | 'milestones' | 'daily-diary'>('daily-diary');
  const [selectedSiteId, setSelectedSiteId] = useState<string>('SITE-001');

  // Modals
  const [showAddWorkOrderModal, setShowAddWorkOrderModal] = useState(false);
  const [showAddDailyLogModal, setShowAddDailyLogModal] = useState(false);

  // New Work Order Form State
  const [newWoNumber, setNewWoNumber] = useState('');
  const [newWoTitle, setNewWoTitle] = useState('');
  const [newWoTrade, setNewWoTrade] = useState('Reinforced Concrete Structure');
  const [newWoCrew, setNewWoCrew] = useState('');
  const [newWoZone, setNewWoZone] = useState('');
  const [newWoStart, setNewWoStart] = useState('2024-08-22');
  const [newWoEnd, setNewWoEnd] = useState('2024-09-05');

  // New Daily Log Form State
  const [newDsrNumber, setNewDsrNumber] = useState('');
  const [newDsrDate, setNewDsrDate] = useState(new Date().toISOString().split('T')[0]);
  const [newDsrWeather, setNewDsrWeather] = useState<'CLEAR_SUNNY' | 'EXTREME_HEAT' | 'SAND_STORM' | 'RAIN_WIND'>('CLEAR_SUNNY');
  const [newDsrTemp, setNewDsrTemp] = useState<number>(37);
  const [newDsrHeadcount, setNewDsrHeadcount] = useState<number>(340);
  const [newDsrActivities, setNewDsrActivities] = useState('');

  const selectedSite = sites.find(s => s.id === selectedSiteId) || sites[0];
  const contractWorkOrders = workOrders.filter(w => w.contractId === selectedContractId);
  const contractMilestones = milestones.filter(m => m.contractId === selectedContractId);
  const contractSiteLogs = siteLogs.filter(l => l.contractId === selectedContractId);

  const handleCreateWorkOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWoNumber || !newWoTitle) return;

    addSiteWorkOrder({
      workOrderNumber: newWoNumber,
      siteId: selectedSiteId,
      contractId: selectedContractId,
      title: newWoTitle,
      tradePackage: newWoTrade,
      assignedCrewOrSubcontractor: newWoCrew || 'Artify Site Operations Crew',
      zoneLocation: newWoZone || 'Zone A',
      scheduledStartDate: newWoStart,
      scheduledEndDate: newWoEnd,
      actualStartDate: newWoStart,
      progressPercent: 0,
      inspectionStatus: 'IN_PROGRESS',
      status: 'ACTIVE'
    });

    setShowAddWorkOrderModal(false);
    setNewWoNumber('');
    setNewWoTitle('');
  };

  const handleCreateDailyLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDsrNumber) return;

    addSiteDailyLog({
      reportDate: newDsrDate,
      siteId: selectedSiteId,
      contractId: selectedContractId,
      reportNumber: newDsrNumber,
      weatherCondition: newDsrWeather,
      ambientTemperatureHighC: Number(newDsrTemp),
      manpowerLog: {
        engineers: 12,
        foremen: 20,
        skilledCarpentersSteelFixers: 140,
        mepTechnicians: 80,
        helpersGeneralLabor: 88,
        totalHeadcount: Number(newDsrHeadcount)
      },
      equipmentLog: [
        { equipmentName: 'Tower Cranes (2 Units)', quantity: 2, hoursWorked: 10, hoursIdleBreakdown: 0 },
        { equipmentName: 'Concrete Boom Pumps', quantity: 2, hoursWorked: 6, hoursIdleBreakdown: 4 }
      ],
      activitiesExecuted: newDsrActivities ? newDsrActivities.split('\n') : ['Executed structural concreting and MEP first fix.'],
      materialsReceivedSummary: ['Concrete batch delivery: 240 m3', 'Rebar bundles: 35 Tons'],
      safetyObservations: 'Conducted mandatory morning safety briefing. Zero incidents.',
      visitorsConsultantComments: 'Consultant engineer performed routine site walk at 11:00 AM.',
      sitePhotosAttached: 6,
      loggedBy: 'Site Engineer'
    });

    setShowAddDailyLogModal(false);
    setNewDsrNumber('');
    setNewDsrActivities('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <HardHat className="w-3.5 h-3.5" />
            Module 15.03 — Site & Work Management
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Site Operations, Work Orders & Daily Site Diary</h2>
          <p className="text-sm text-slate-400">
            Real-time daily site progress logging (DSR), manpower headcount, equipment utilization hours, task work orders, and critical path milestones.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowAddWorkOrderModal(true)}
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs px-4 py-2.5 rounded-xl shadow transition-all"
          >
            <Plus className="w-4 h-4" />
            Issue Work Order
          </button>
          <button
            onClick={() => setShowAddDailyLogModal(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all"
          >
            <Calendar className="w-4 h-4" />
            Post Daily Site Diary (DSR)
          </button>
        </div>
      </div>

      {/* Live Site Header Metric Bar */}
      {selectedSite && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm grid grid-cols-2 md:grid-cols-5 gap-4 text-xs">
          <div>
            <span className="text-slate-500 dark:text-slate-400">Site Location</span>
            <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{selectedSite.siteName}</p>
            <p className="text-[11px] text-slate-400 font-mono">{selectedSite.locationCoordinates}</p>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400">Active Headcount Today</span>
            <p className="font-bold font-mono text-slate-900 dark:text-white text-base mt-0.5">
              {selectedSite.totalHeadcountToday} Personnel
            </p>
            <p className="text-[11px] text-emerald-600">Full shift deployed</p>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400">Safe Man-Hours (No LTI)</span>
            <p className="font-bold font-mono text-emerald-600 dark:text-emerald-400 text-base mt-0.5">
              {selectedSite.safeManHoursSinceLTI.toLocaleString()} Hrs
            </p>
            <p className="text-[11px] text-slate-400">HSE Gold Milestone</p>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400">Active Plant & Cranes</span>
            <p className="font-bold font-mono text-slate-900 dark:text-white text-base mt-0.5">
              {selectedSite.activeEquipmentUnits} Units Operating
            </p>
            <p className="text-[11px] text-slate-400">Staging: {selectedSite.stagingYardCapacityPct}% full</p>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400">Key Personnel</span>
            <p className="font-semibold text-slate-900 dark:text-white mt-0.5">PM: {selectedSite.projectManager}</p>
            <p className="text-[11px] text-slate-400">RE: {selectedSite.residentEngineer}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('daily-diary')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'daily-diary'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Daily Site Diary / Logs ({contractSiteLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('work-orders')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'work-orders'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Site Work Orders ({contractWorkOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('milestones')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'milestones'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Project Milestones ({contractMilestones.length})
          </button>
          <button
            onClick={() => setActiveTab('sites')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'sites'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Site Infrastructure Profiles ({sites.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Daily Diary */}
      {activeTab === 'daily-diary' && (
        <div className="space-y-4">
          {contractSiteLogs.map(log => (
            <div
              key={log.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                      {log.reportNumber}
                    </span>
                    <span className="text-xs text-slate-500">Date: <strong>{log.reportDate}</strong></span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 font-medium">
                      {log.weatherCondition.replace(/_/g, ' ')} ({log.ambientTemperatureHighC}°C)
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    Site Daily Activity Report — {selectedSite?.siteName}
                  </h4>
                </div>

                <div className="text-xs text-slate-500">
                  Logged by: <span className="font-semibold text-slate-700 dark:text-slate-300">{log.loggedBy}</span>
                </div>
              </div>

              {/* Manpower and Equipment Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex justify-between items-center font-bold text-slate-900 dark:text-white">
                    <span>Manpower Deployment</span>
                    <span className="font-mono text-emerald-600">{log.manpowerLog.totalHeadcount} Workers Total</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-400 text-[11px] pt-1">
                    <div>Engineers: <strong>{log.manpowerLog.engineers}</strong></div>
                    <div>Foremen: <strong>{log.manpowerLog.foremen}</strong></div>
                    <div>Carpenters/Steel Fixers: <strong>{log.manpowerLog.skilledCarpentersSteelFixers}</strong></div>
                    <div>MEP Techs: <strong>{log.manpowerLog.mepTechnicians}</strong></div>
                    <div className="col-span-2">General Labor: <strong>{log.manpowerLog.helpersGeneralLabor}</strong></div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex justify-between items-center font-bold text-slate-900 dark:text-white">
                    <span>Heavy Plant & Equipment Hours</span>
                    <span className="font-mono text-blue-600">{log.equipmentLog.length} Key Units</span>
                  </div>
                  <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                    {log.equipmentLog.map((eq, i) => (
                      <div key={i} className="flex justify-between">
                        <span>{eq.equipmentName} ({eq.quantity} unit):</span>
                        <span className="font-mono font-semibold">{eq.hoursWorked}h operating / {eq.hoursIdleBreakdown}h idle</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Activities Executed */}
              <div className="space-y-2 text-xs">
                <h5 className="font-bold text-slate-900 dark:text-white">Key Works Executed Today:</h5>
                <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                  {log.activitiesExecuted.map((act, i) => (
                    <li key={i}>{act}</li>
                  ))}
                </ul>
              </div>

              {/* Safety & Consultant Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl">
                  <strong className="text-emerald-700 dark:text-emerald-400">HSE & Safety Observations:</strong>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">{log.safetyObservations}</p>
                </div>
                <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-xl">
                  <strong className="text-blue-700 dark:text-blue-400">Consultant / Visitor Comments:</strong>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">{log.visitorsConsultantComments}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Work Orders */}
      {activeTab === 'work-orders' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {contractWorkOrders.map(wo => (
            <div
              key={wo.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                  {wo.workOrderNumber}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600">
                  {wo.status}
                </span>
              </div>

              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                {wo.title}
              </h4>
              <p className="text-xs text-slate-500">
                <strong>Trade:</strong> {wo.tradePackage} • <strong>Zone:</strong> {wo.zoneLocation}
              </p>
              <p className="text-xs text-slate-500">
                <strong>Assigned:</strong> {wo.assignedCrewOrSubcontractor}
              </p>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Scheduled:</span>
                  <span className="text-slate-700 dark:text-slate-300">{wo.scheduledStartDate} → {wo.scheduledEndDate}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-500">
                    <span>Task Progress</span>
                    <span className="font-bold text-emerald-600">{wo.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${wo.progressPercent}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Milestones */}
      {activeTab === 'milestones' && (
        <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Milestone Code</th>
                <th className="py-3 px-4">Milestone Description</th>
                <th className="py-3 px-4">Target Date</th>
                <th className="py-3 px-4">Actual Date</th>
                <th className="py-3 px-4 text-center">Weightage</th>
                <th className="py-3 px-4 text-right">Payment Release Value</th>
                <th className="py-3 px-4 text-center">Critical Path</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {contractMilestones.map(ms => (
                <tr key={ms.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {ms.milestoneCode}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white max-w-sm">
                    {ms.title}
                  </td>
                  <td className="py-3.5 px-4 font-mono">{ms.targetDate}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">{ms.actualDate || '—'}</td>
                  <td className="py-3.5 px-4 text-center font-bold">{ms.weightagePct}%</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                    {currency} {ms.associatedPaymentRelease.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {ms.isCriticalPath ? (
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100/60 dark:bg-rose-950 text-rose-700 dark:text-rose-400">
                        Critical Path
                      </span>
                    ) : (
                      <span className="text-slate-400">Standard</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                      {ms.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 4: Sites */}
      {activeTab === 'sites' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sites.map(site => (
            <div key={site.id} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-1 rounded">
                  {site.siteCode}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                  {site.siteOfficeStatus}
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">{site.siteName}</h4>
              <p className="text-xs text-slate-500">Permit: {site.accessPermitNumber}</p>
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400">Headcount</span>
                  <p className="font-bold text-slate-900 dark:text-white">{site.totalHeadcountToday}</p>
                </div>
                <div>
                  <span className="text-slate-400">Equipments</span>
                  <p className="font-bold text-slate-900 dark:text-white">{site.activeEquipmentUnits} Units</p>
                </div>
                <div>
                  <span className="text-slate-400">LTI-Free Hours</span>
                  <p className="font-bold text-emerald-600">{site.safeManHoursSinceLTI.toLocaleString()} h</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: New Work Order */}
      {showAddWorkOrderModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Issue Site Work Order</h3>
              <button onClick={() => setShowAddWorkOrderModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateWorkOrder} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Work Order Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SWO-MCT-L29-02"
                  value={newWoNumber}
                  onChange={e => setNewWoNumber(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pouring Level 29 Column Concrete C60"
                  value={newWoTitle}
                  onChange={e => setNewWoTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Trade Package</label>
                  <input
                    type="text"
                    value={newWoTrade}
                    onChange={e => setNewWoTrade(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Zone Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Level 29 Tower Core"
                    value={newWoZone}
                    onChange={e => setNewWoZone(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newWoStart}
                    onChange={e => setNewWoStart(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">End Date</label>
                  <input
                    type="date"
                    value={newWoEnd}
                    onChange={e => setNewWoEnd(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddWorkOrderModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
                >
                  Issue Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Daily Log */}
      {showAddDailyLogModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Post Daily Site Diary (DSR)</h3>
              <button onClick={() => setShowAddDailyLogModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateDailyLog} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">DSR Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DSR-2024-0522"
                    value={newDsrNumber}
                    onChange={e => setNewDsrNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Report Date</label>
                  <input
                    type="date"
                    value={newDsrDate}
                    onChange={e => setNewDsrDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Weather</label>
                  <select
                    value={newDsrWeather}
                    onChange={e => setNewDsrWeather(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="CLEAR_SUNNY">Clear Sunny</option>
                    <option value="EXTREME_HEAT">Extreme Heat</option>
                    <option value="SAND_STORM">Sand Storm</option>
                    <option value="RAIN_WIND">Rain / Wind</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">High Temp (°C)</label>
                  <input
                    type="number"
                    value={newDsrTemp}
                    onChange={e => setNewDsrTemp(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Total Workers</label>
                  <input
                    type="number"
                    value={newDsrHeadcount}
                    onChange={e => setNewDsrHeadcount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Activities Completed (One per line)</label>
                <textarea
                  rows={3}
                  placeholder="Poured Level 29 columns...&#10;Installed HVAC ductwork..."
                  value={newDsrActivities}
                  onChange={e => setNewDsrActivities(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddDailyLogModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
                >
                  Submit Daily Diary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
