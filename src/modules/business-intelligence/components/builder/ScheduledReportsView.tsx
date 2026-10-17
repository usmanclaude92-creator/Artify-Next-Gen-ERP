import React, { useState } from 'react';
import { Clock, Plus, Mail, CheckCircle2, Play, Trash2, Calendar, FileText, Send } from 'lucide-react';
import { useBI } from '../../services/biStore';
import { DemoDataBanner } from '../common/DemoDataBanner';
import { ScheduledReportConfig } from '../../types';

export const ScheduledReportsView: React.FC = () => {
  const { scheduledReports, addScheduledReport } = useBI();
  const [showAddModal, setShowAddModal] = useState(false);
  const [dispatchAlert, setDispatchAlert] = useState<string | null>(null);

  const [newSchedule, setNewSchedule] = useState<Partial<ScheduledReportConfig>>({
    reportTitle: 'Executive Daily Flash Summary',
    frequency: 'Daily',
    deliveryTime: '07:00 AM',
    recipients: ['ceo@artify-group.com', 'cfo@artify-group.com'],
    format: 'PDF',
    status: 'Active',
    deliveryMethod: 'Email'
  });

  const handleManualDispatch = (id: string, title: string) => {
    setDispatchAlert(`Report "${title}" was dispatched immediately to all assigned stakeholders.`);
    setTimeout(() => setDispatchAlert(null), 4000);
  };

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const created: ScheduledReportConfig = {
      id: `sched-${Date.now()}`,
      reportId: 'rep-01',
      reportTitle: newSchedule.reportTitle || 'Untitled Schedule',
      frequency: (newSchedule.frequency as any) || 'Daily',
      deliveryTime: newSchedule.deliveryTime || '08:00 AM',
      deliveryMethod: (newSchedule.deliveryMethod as any) || 'Email',
      startDate: '2026-08-20',
      recipients: Array.isArray(newSchedule.recipients)
        ? newSchedule.recipients
        : String(newSchedule.recipients || '').split(',').map(s => s.trim()),
      format: (newSchedule.format as any) || 'PDF',
      status: 'Active',
      lastRunAt: 'Never',
      nextRunAt: '2026-08-21 07:00 AM'
    };
    addScheduledReport(created);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <DemoDataBanner moduleSource="Module 02.27 Automated Report Distribution & Dispatch Scheduler" />

      {/* Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Automated Report Distribution Schedules
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure periodic email broadcasts of financial, operational, and executive briefing dossiers.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create New Schedule
        </button>
      </div>

      {dispatchAlert && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-900 dark:text-emerald-100 rounded-xl text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{dispatchAlert}</span>
        </div>
      )}

      {/* Scheduled Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400">
                <th className="py-2.5 px-3 font-semibold">Report Package</th>
                <th className="py-2.5 px-3 font-semibold">Cadence & Time</th>
                <th className="py-2.5 px-3 font-semibold">Recipient Group</th>
                <th className="py-2.5 px-3 font-semibold text-center">Format</th>
                <th className="py-2.5 px-3 font-mono text-center">Last Run</th>
                <th className="py-2.5 px-3 font-mono text-center">Next Scheduled</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {scheduledReports.map(sched => (
                <tr key={sched.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900 dark:text-slate-100 block">{sched.reportTitle}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300 font-medium">
                    {sched.frequency} at {sched.deliveryTime}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                    {sched.recipients.join(', ')}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="font-mono text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded">
                      {sched.format}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-center text-slate-500 dark:text-slate-400">{sched.lastRunAt || 'Never'}</td>
                  <td className="py-3 px-3 font-mono text-center text-indigo-900 dark:text-indigo-100 font-semibold">{sched.nextRunAt}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200">
                      {sched.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleManualDispatch(sched.id, sched.reportTitle)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-lg transition-colors"
                      title="Trigger immediate email dispatch"
                    >
                      <Send className="w-3 h-3" />
                      Run Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Schedule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Schedule Automatic Report Dispatch</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-500 dark:text-slate-400 text-xs">
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateSchedule} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Report Package Title</label>
                <input
                  type="text"
                  required
                  value={newSchedule.reportTitle}
                  onChange={e => setNewSchedule(prev => ({ ...prev, reportTitle: e.target.value }))}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Frequency Cadence</label>
                  <select
                    value={newSchedule.frequency}
                    onChange={e => setNewSchedule(prev => ({ ...prev, frequency: e.target.value as any }))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Dispatch Time (GST)</label>
                  <input
                    type="text"
                    value={newSchedule.deliveryTime}
                    onChange={e => setNewSchedule(prev => ({ ...prev, deliveryTime: e.target.value }))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Recipient Email List (comma-separated)</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. board@artify-group.com, cfo@artify-group.com"
                  value={
                    Array.isArray(newSchedule.recipients)
                      ? newSchedule.recipients.join(', ')
                      : newSchedule.recipients
                  }
                  onChange={e =>
                    setNewSchedule(prev => ({
                      ...prev,
                      recipients: e.target.value.split(',').map(s => s.trim())
                    }))
                  }
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Attachment Format</label>
                <select
                  value={newSchedule.format}
                  onChange={e => setNewSchedule(prev => ({ ...prev, format: e.target.value as any }))}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  <option value="PDF">Formatted Executive PDF</option>
                  <option value="Excel">Raw Data Excel Workbook (.xlsx)</option>
                  <option value="CSV">Delimited Data Stream (.csv)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Create Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
