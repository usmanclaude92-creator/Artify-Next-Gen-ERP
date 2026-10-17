import React, { useState } from 'react';
import {
  Calendar,
  Phone,
  Users,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Filter,
  Building2,
  CheckSquare,
  AlertCircle,
  FileText
} from 'lucide-react';
import { useSalesCrm } from '../../services/salesCrmStore';
import { SalesActivity, ActivityType, ActivityPriority, ActivityStatus } from '../../types';
import { ERPUserRole } from '../../../../types/erp';

interface SalesActivitiesViewProps {
  activeTransactionId?: string;
  onNavigate?: (route: any) => void;
  activeRole: ERPUserRole;
}

export const SalesActivitiesView: React.FC<SalesActivitiesViewProps> = ({
  activeTransactionId,
  onNavigate,
  activeRole
}) => {
  const { activities, addActivity, updateActivityStatus, customers } = useSalesCrm();

  const [activeTab, setActiveTab] = useState<'all' | 'calls' | 'meetings' | 'followups' | 'tasks'>(
    activeTransactionId === 'tx-act-calls'
      ? 'calls'
      : activeTransactionId === 'tx-act-meetings'
      ? 'meetings'
      : activeTransactionId === 'tx-act-followups'
      ? 'followups'
      : activeTransactionId === 'tx-act-tasks'
      ? 'tasks'
      : 'all'
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);

  // Form states
  const [actType, setActType] = useState<ActivityType>('Client In-Person Meeting');
  const [actSubject, setActSubject] = useState('');
  const [actCustomer, setActCustomer] = useState(customers[0]?.id || '');
  const [actContactName, setActContactName] = useState('');
  const [actDueDate, setActDueDate] = useState('2026-08-25');
  const [actPriority, setActPriority] = useState<ActivityPriority>('High');
  const [actLocation, setActLocation] = useState('Client HQ, Muscat');
  const [actNotes, setActNotes] = useState('');

  const filteredActivities = activities.filter((act) => {
    const matchesSearch =
      act.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (act.customerName ?? act.relatedToName).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (act.contactName ?? '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'calls' && act.type === 'Phone Call') ||
      (activeTab === 'meetings' &&
        (act.type === 'Client In-Person Meeting' || act.type === 'Video Conference')) ||
      (activeTab === 'followups' && act.type === 'Follow-up Reminder') ||
      (activeTab === 'tasks' && act.type === 'Action Task / Proposal Draft');
    return matchesSearch && matchesTab;
  });

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actSubject || !actCustomer) return;

    const cust = customers.find((c) => c.id === actCustomer);

    addActivity({
      type: actType,
      subject: actSubject,
      customerId: actCustomer,
      customerName: cust?.legalName || 'Client',
      contactName: actContactName || 'Lead Focal Point',
      assignedToName: 'Eng. Tariq Al-Habsi',
      dueDate: actDueDate,
      priority: actPriority,
      status: 'Pending',
      location: actLocation,
      notes: actNotes
    });

    setShowNewModal(false);
    setActSubject('');
    setActNotes('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 text-xs font-semibold">
                Functional Area 06.04
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Commercial Engagements & Follow-ups</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
              Sales Activities, Client Meetings & Tasks
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Omnichannel communication logs, executive client meetings, automated follow-up reminders, and rep action task lists.
            </p>
          </div>

          <button
            onClick={() => setShowNewModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium shadow-md shadow-teal-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Schedule Activity
          </button>
        </div>

        {/* Process Tabs */}
        <div className="flex flex-wrap gap-2 border-t border-slate-200 dark:border-slate-800 pt-4 mt-5">
          {[
            { id: 'all', label: 'All Activities' },
            { id: 'calls', label: '06.04.01 Phone Calls', code: 'tx-act-calls' },
            { id: 'meetings', label: '06.04.02 Client Meetings', code: 'tx-act-meetings' },
            { id: 'followups', label: '06.04.03 Follow-up Reminders', code: 'tx-act-followups' },
            { id: 'tasks', label: '06.04.04 Rep Tasks & Checklists', code: 'tx-act-tasks' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-600 dark:text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activities by subject, client name, or contact..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Activities Timeline Cards */}
      <div className="space-y-3">
        {filteredActivities.map((act) => {
          const isCompleted = act.status === 'Completed';

          return (
            <div
              key={act.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                isCompleted
                  ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-80'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-teal-400 dark:hover:border-teal-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => updateActivityStatus(act.id, isCompleted ? 'Pending' : 'Completed')}
                    className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : 'border-2 border-slate-300 dark:border-slate-600 hover:border-teal-500'
                    }`}
                    title="Toggle Task Status"
                  >
                    {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-bold ${
                          isCompleted
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {act.subject}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          act.priority === 'High' || act.priority === 'Urgent'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        }`}
                      >
                        {act.priority}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                        <Building2 className="w-3.5 h-3.5 text-teal-500 dark:text-teal-400" />
                        {(act.customerName ?? act.relatedToName)}
                      </span>
                      <span>•</span>
                      <span>Contact: {(act.contactName ?? '')}</span>
                      {(act.location ?? '') && (
                        <>
                          <span>•</span>
                          <span>📍 {(act.location ?? '')}</span>
                        </>
                      )}
                    </div>

                    {(act.notes ?? act.outcomeNotes) && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                        {(act.notes ?? act.outcomeNotes)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0 space-y-1">
                  <div className="flex items-center sm:justify-end gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-teal-500 dark:text-teal-400" />
                    <span>Due: {(act.dueDate ?? act.scheduledDate)}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400">Owner: {(act.assignedToName ?? act.assignedRepName)}</div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredActivities.length === 0 && (
          <div className="p-12 text-center text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            No activities matching current filter criteria.
          </div>
        )}
      </div>

      {/* Schedule Activity Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Schedule Commercial Activity
                </h3>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Activity Type
                </label>
                <select
                  value={actType}
                  onChange={(e) => setActType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="Client In-Person Meeting">Client In-Person Meeting</option>
                  <option value="Phone Call">Phone Call / Discussion</option>
                  <option value="Video Conference">Video Conference (Teams/Zoom)</option>
                  <option value="Follow-up Reminder">Follow-up Reminder</option>
                  <option value="Action Task / Proposal Draft">Action Task / Proposal Draft</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Subject / Objective *
                </label>
                <input
                  type="text"
                  required
                  value={actSubject}
                  onChange={(e) => setActSubject(e.target.value)}
                  placeholder="e.g. Commercial discount negotiation with committee"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Customer Account *
                  </label>
                  <select
                    value={actCustomer}
                    onChange={(e) => setActCustomer(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.legalName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Contact Focal Point
                  </label>
                  <input
                    type="text"
                    value={actContactName}
                    onChange={(e) => setActContactName(e.target.value)}
                    placeholder="e.g. Salim Al-Ghafri"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Due / Scheduled Date
                  </label>
                  <input
                    type="date"
                    value={actDueDate}
                    onChange={(e) => setActDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Priority Level
                  </label>
                  <select
                    value={actPriority}
                    onChange={(e) => setActPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Location / Meeting Link
                </label>
                <input
                  type="text"
                  value={actLocation}
                  onChange={(e) => setActLocation(e.target.value)}
                  placeholder="e.g. Mina Al Fahal PDO HQ, Meeting Room 4"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Agenda & Discussion Notes
                </label>
                <textarea
                  rows={3}
                  value={actNotes}
                  onChange={(e) => setActNotes(e.target.value)}
                  placeholder="Key talking points, deliverables, or items to bring..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium shadow-md cursor-pointer"
                >
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
