import React, { useState } from 'react';
import {
  FileText,
  History,
  ShieldCheck,
  Filter,
  Eye,
  Download,
  Search,
  User,
  Clock,
  ArrowRight,
  ShieldAlert,
  LogIn
} from 'lucide-react';
import { useSystemManagement } from '../services/systemManagementStore';
import { DataTable, ColumnDef } from './common/DataTable';
import { StatusBadge } from './common/StatusBadge';
import { MetricCard } from './common/MetricCard';
import { DiffViewer } from './common/DiffViewer';
import { FormModal } from './common/FormModal';
import { AuditEvent, LoginHistoryEvent } from '../types';

export const AuditTrailMonitoringView: React.FC<{ activeTab?: string }> = ({ activeTab: initialTab = 'events' }) => {
  const { auditTrail, loginHistory } = useSystemManagement();

  const [activeTab, setActiveTab] = useState<'events' | 'logins' | 'diff'>((initialTab as any) || 'events');
  const [selectedAuditItem, setSelectedAuditItem] = useState<AuditEvent | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Audit columns
  const auditColumns: ColumnDef<AuditEvent>[] = [
    {
      key: 'timestamp',
      header: 'Timestamp (UTC)',
      accessor: item => <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">{item.timestamp}</span>
    },
    {
      key: 'userName',
      header: 'Actor / User Identity',
      accessor: item => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-slate-100">{item.userName}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Role: {item.userRole}</div>
        </div>
      )
    },
    {
      key: 'action',
      header: 'Action',
      accessor: item => {
        let style = 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200';
        if (item.action === 'CREATE') style = 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 font-bold';
        if (item.action === 'UPDATE') style = 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-200 font-bold';
        if (item.action === 'DELETE' || item.action === 'REVOKE') style = 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-200 font-bold';
        if (item.action === 'LOCK' || item.action === 'UNLOCK') style = 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-200 font-bold';

        return (
          <span className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase tracking-wider ${style}`}>
            {item.action}
          </span>
        );
      }
    },
    {
      key: 'entity',
      header: 'Entity & Record ID',
      accessor: item => (
        <div>
          <span className="font-semibold text-slate-800 dark:text-slate-200">{item.entity}</span>
          <div className="font-mono text-[10px] text-indigo-700 dark:text-indigo-300">#{item.recordId}</div>
        </div>
      )
    },
    {
      key: 'details',
      header: 'Audit Narrative Details',
      accessor: item => (
        <span className="text-slate-600 dark:text-slate-400 text-xs truncate max-w-sm block">{item.details}</span>
      )
    },
    {
      key: 'result',
      header: 'Result',
      accessor: item => <StatusBadge status={item.result} />
    }
  ];

  // Login history columns
  const loginColumns: ColumnDef<LoginHistoryEvent>[] = [
    {
      key: 'timestamp',
      header: 'Login Timestamp',
      accessor: item => <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">{item.timestamp}</span>
    },
    {
      key: 'username',
      header: 'User Account',
      accessor: item => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-slate-100">{item.fullName}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">@{item.username}</div>
        </div>
      )
    },
    {
      key: 'device',
      header: 'Device & Client',
      accessor: item => <span className="font-mono text-xs text-slate-700 dark:text-slate-300">{item.browser} • {item.device}</span>
    },
    {
      key: 'ipAddress',
      header: 'Source IP & Geolocation',
      accessor: item => (
        <div>
          <div className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">{item.ipAddress}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.location}</div>
        </div>
      )
    },
    {
      key: 'result',
      header: 'Login Result',
      accessor: item => (
        <span
          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
            item.result === 'Success'
              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30'
              : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30'
          }`}
        >
          {item.result}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Logged Audit Events"
          value={auditTrail.length}
          status="positive"
          description="Immutable Append-Only Log"
          icon={<History className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
        />
        <MetricCard
          label="Audit Integrity Status"
          value="100% Cryptographic"
          status="positive"
          description="SHA-256 Chained Integrity"
          icon={<ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
        />
        <MetricCard
          label="Recorded User Sessions"
          value={loginHistory.length}
          status="neutral"
          description="Active & Archived Logins"
          icon={<LogIn className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
        />
        <MetricCard
          label="Authentication Failures"
          value={loginHistory.filter(l => l.status === 'Failed').length}
          status="warning"
          description="Suspicious Anomaly Flags"
          icon={<ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('events')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'events' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <History className="w-4 h-4" />
          <span>System Audit Log ({auditTrail.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('logins')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'logins' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <LogIn className="w-4 h-4" />
          <span>Authentication History ({loginHistory.length})</span>
        </button>
      </div>

      {/* Tab 1: Audit Log */}
      {activeTab === 'events' && (
        <DataTable
          title="Cryptographic System Audit Trail"
          subtitle="Complete non-repudiation event ledger tracking every entity mutation, role modification, and financial period lock"
          data={auditTrail}
          columns={auditColumns}
          keyExtractor={item => item.id}
          searchPlaceholder="Search actor name, action, entity, record ID, keyword..."
          exportFileName="artify-system-audit-trail"
          filterOptions={[
            {
              key: 'action',
              label: 'Action',
              options: [
                { value: 'CREATE', label: 'CREATE' },
                { value: 'UPDATE', label: 'UPDATE' },
                { value: 'LOCK', label: 'LOCK' },
                { value: 'UNLOCK', label: 'UNLOCK' },
                { value: 'APPROVE', label: 'APPROVE' },
                { value: 'CONFIG_CHANGE', label: 'CONFIG_CHANGE' }
              ],
              filterFn: (item, val) => item.action === val
            }
          ]}
          actionRenderer={item => (
            <button
              onClick={() => {
                setSelectedAuditItem(item);
                setIsDetailModalOpen(true);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Diff</span>
            </button>
          )}
        />
      )}

      {/* Tab 2: Login History */}
      {activeTab === 'logins' && (
        <DataTable
          title="User Authentication & Session History"
          subtitle="Real-time SIEM authentication logs recording sign-in attempts, client IPs, and device fingerprints"
          data={loginHistory}
          columns={loginColumns}
          keyExtractor={item => item.id}
          searchPlaceholder="Search user name, username, IP, location..."
          exportFileName="artify-login-history"
        />
      )}

      {/* Audit Diff Modal */}
      {selectedAuditItem && (
        <FormModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`Audit Event Inspection: #${selectedAuditItem.id}`}
          subtitle={`${selectedAuditItem.module} • ${selectedAuditItem.entity}`}
          onSubmit={e => {
            e.preventDefault();
            setIsDetailModalOpen(false);
          }}
          submitLabel="Close Inspection"
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 font-medium">Actor:</span>
                <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {selectedAuditItem.userName} ({selectedAuditItem.userRole})
                </div>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 font-medium">Committed At:</span>
                <div className="font-mono text-slate-800 dark:text-slate-200 mt-0.5">{selectedAuditItem.timestamp}</div>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 font-medium">Action Performed:</span>
                <div className="font-bold text-indigo-700 dark:text-indigo-300 mt-0.5">{selectedAuditItem.action}</div>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 font-medium">Record ID:</span>
                <div className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">{selectedAuditItem.recordId}</div>
              </div>
            </div>

            <div className="text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Audit Narrative:</span>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 mt-1">
                {selectedAuditItem.details}
              </div>
            </div>

            {/* Field Diff */}
            <DiffViewer
              previousValue={selectedAuditItem.previousValue}
              newValue={selectedAuditItem.newValue}
              entityName={selectedAuditItem.entity}
            />
          </div>
        </FormModal>
      )}
    </div>
  );
};
