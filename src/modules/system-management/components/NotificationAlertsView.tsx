import React, { useState } from 'react';
import {
  Bell,
  Mail,
  Smartphone,
  Webhook,
  AlertTriangle,
  CheckCircle,
  Plus,
  Radio,
  Sliders,
  Send
} from 'lucide-react';
import { useSystemManagement } from '../services/systemManagementStore';
import { DataTable, ColumnDef } from './common/DataTable';
import { StatusBadge } from './common/StatusBadge';
import { MetricCard } from './common/MetricCard';
import { FormModal } from './common/FormModal';
import { NotificationTemplate, NotificationRule, SystemAlertItem } from '../types';

export const NotificationAlertsView: React.FC<{ activeTab?: string }> = ({ activeTab: initialTab = 'alerts' }) => {
  const {
    notificationTemplates,
    notificationRules,
    alerts,
    markAlertAsRead,
    markAllAlertsAsRead,
    addNotificationTemplate
  } = useSystemManagement();

  const [activeTab, setActiveTab] = useState<'alerts' | 'templates' | 'rules'>(
    (initialTab as any) || 'alerts'
  );

  const [isTmplModalOpen, setIsTmplModalOpen] = useState(false);

  const [tmplForm, setTmplForm] = useState({
    code: '',
    title: '',
    channel: 'EMAIL' as const,
    eventTrigger: 'Period.LockApplied',
    subjectTemplate: 'Notice: Financial Period Lock Enforced for {{periodName}}',
    bodyTemplate: 'Dear Finance Team,\n\nFinancial posting period {{periodName}} has been officially locked by {{lockedBy}}.',
    status: 'Active' as const
  });

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tmplForm.code || !tmplForm.title) return;
    addNotificationTemplate(tmplForm);
    setIsTmplModalOpen(false);
  };

  // Template columns
  const tmplColumns: ColumnDef<NotificationTemplate>[] = [
    {
      key: 'code',
      header: 'Template Code',
      accessor: item => <span className="font-mono font-bold text-indigo-700">{item.code}</span>
    },
    {
      key: 'title',
      header: 'Template Title & Category',
      accessor: item => (
        <div>
          <div className="font-semibold text-slate-900">{item.title}</div>
          <div className="text-[11px] text-slate-500 font-mono">Category: {item.category}</div>
        </div>
      )
    },
    {
      key: 'channel',
      header: 'Delivery Channel',
      accessor: item => (
        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-[11px] font-semibold text-slate-700">
          {item.channel}
        </span>
      )
    },
    {
      key: 'subject',
      header: 'Subject / Header',
      accessor: item => (
        <span className="text-slate-700 text-xs truncate max-w-xs block">{item.subject}</span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      accessor: item => <StatusBadge status={item.status} />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Unread System Alerts"
          value={alerts.filter(a => !a.read).length}
          status="warning"
          description="High & Critical Priority Alerts"
          icon={<Bell className="w-5 h-5 text-amber-600" />}
        />
        <MetricCard
          label="Configured Templates"
          value={notificationTemplates.length}
          status="positive"
          description="Email, SMS & Webhooks"
          icon={<Mail className="w-5 h-5 text-indigo-600" />}
        />
        <MetricCard
          label="Automated Dispatch Rules"
          value={notificationRules.length}
          status="neutral"
          description="Real-Time Event Triggers"
          icon={<Radio className="w-5 h-5 text-emerald-600" />}
        />
        <MetricCard
          label="Average Delivery Latency"
          value="420 ms"
          status="positive"
          description="Across Global Gateways"
          icon={<Send className="w-5 h-5 text-indigo-600" />}
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'alerts' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Active Alert Center ({alerts.filter(a => !a.read).length} Unread)</span>
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'templates' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Notification Templates ({notificationTemplates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'rules' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Event Dispatch Rules ({notificationRules.length})</span>
        </button>
      </div>

      {/* Tab 1: Alerts */}
      {activeTab === 'alerts' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">System Incident & Notification Center</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time stream of security, financial, and master data governance events
              </p>
            </div>
            <button
              onClick={markAllAlertsAsRead}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Mark All as Read
            </button>
          </div>

          <div className="space-y-3">
            {alerts.map(alert => (
              <div
                key={alert.id}
                onClick={() => markAlertAsRead(alert.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  !alert.read
                    ? 'bg-amber-50/40 border-amber-200 hover:bg-amber-50/70 shadow-2xs'
                    : 'bg-slate-50/40 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg mt-0.5 ${
                        alert.severity === 'Critical'
                          ? 'bg-rose-100 text-rose-700'
                          : alert.severity === 'Warning'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-indigo-100 text-indigo-700'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{alert.title}</h4>
                        {!alert.read && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600" />
                        )}
                        <StatusBadge status={alert.severity} size="sm" />
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{alert.message}</p>
                      <div className="text-[11px] text-slate-400 font-mono mt-2">
                        {alert.timestamp} • Category: {alert.category}
                      </div>
                    </div>
                  </div>

                  {!alert.read && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        markAlertAsRead(alert.id);
                      }}
                      className="text-xs text-slate-400 hover:text-slate-700 font-medium"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Templates */}
      {activeTab === 'templates' && (
        <DataTable
          title="Multi-Channel Notification Templates"
          subtitle="Configurable message bodies supporting dynamic parameter interpolation across email, SMS, and in-app feeds"
          data={notificationTemplates}
          columns={tmplColumns}
          keyExtractor={item => item.id}
          onAddClick={() => setIsTmplModalOpen(true)}
          addLabel="Add Template"
          searchPlaceholder="Search template code, title, event..."
          exportFileName="artify-notification-templates"
        />
      )}

      {/* Tab 3: Dispatch Rules */}
      {activeTab === 'rules' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="border-b border-slate-200 pb-4 mb-5">
            <h3 className="text-base font-bold text-slate-900">Event-Driven Notification Rules</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Binding system triggers to specific target recipient groups and escalation channels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notificationRules.map(rule => (
              <div key={rule.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 shadow-2xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{rule.name}</h4>
                    <span className="font-mono text-[11px] text-indigo-700">Trigger: {rule.triggerEvent}</span>
                  </div>
                  <StatusBadge status={rule.status} size="sm" />
                </div>

                <div className="text-xs space-y-1.5">
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Recipient Roles:</span>
                    <span className="font-semibold text-slate-800">{rule.recipientRoles.join(', ')}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Active Channels:</span>
                    <span className="font-mono font-bold text-indigo-700">{rule.channels.join(', ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Create Template */}
      <FormModal
        isOpen={isTmplModalOpen}
        onClose={() => setIsTmplModalOpen(false)}
        title="Add Notification Template"
        subtitle="Author template with dynamic handlebar placeholders (e.g. {{periodName}})"
        onSubmit={handleCreateTemplate}
        submitLabel="Save Template"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Template Code *</label>
            <input
              type="text"
              required
              value={tmplForm.code}
              onChange={e => setTmplForm({ ...tmplForm, code: e.target.value.toUpperCase() })}
              placeholder="e.g. TMPL-SO-APPROVAL"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Template Title *</label>
            <input
              type="text"
              required
              value={tmplForm.title}
              onChange={e => setTmplForm({ ...tmplForm, title: e.target.value })}
              placeholder="e.g. Sales Order Approval Request"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Delivery Channel</label>
            <select
              value={tmplForm.channel}
              onChange={e => setTmplForm({ ...tmplForm, channel: e.target.value as any })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            >
              <option value="EMAIL">Email</option>
              <option value="IN_APP">In-App Banner</option>
              <option value="SMS">SMS / WhatsApp</option>
              <option value="WEBHOOK">Webhook JSON Dispatch</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Event Trigger</label>
            <input
              type="text"
              value={tmplForm.eventTrigger}
              onChange={e => setTmplForm({ ...tmplForm, eventTrigger: e.target.value })}
              placeholder="e.g. Order.Submitted"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-700 font-semibold mb-1">Subject Line</label>
            <input
              type="text"
              value={tmplForm.subjectTemplate}
              onChange={e => setTmplForm({ ...tmplForm, subjectTemplate: e.target.value })}
              placeholder="Subject..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-700 font-semibold mb-1">Message Body Template</label>
            <textarea
              rows={4}
              value={tmplForm.bodyTemplate}
              onChange={e => setTmplForm({ ...tmplForm, bodyTemplate: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
            />
          </div>
        </div>
      </FormModal>
    </div>
  );
};
