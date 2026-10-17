import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  Key,
  Smartphone,
  ShieldCheck,
  AlertTriangle,
  Monitor,
  Trash2,
  Sliders,
  CheckCircle2,
  Clock,
  Globe
} from 'lucide-react';
import { useSystemManagement } from '../services/systemManagementStore';
import { DataTable, ColumnDef } from './common/DataTable';
import { StatusBadge } from './common/StatusBadge';
import { MetricCard } from './common/MetricCard';
import { SecurityPolicy, ActiveSession, SecurityEvent } from '../types';

export const SecurityManagementView: React.FC<{ activeTab?: string }> = ({ activeTab: initialTab = 'policies' }) => {
  const {
    securityPolicies,
    passwordPolicy,
    activeSessions,
    securityEvents,
    updatePasswordPolicy,
    toggleSecurityPolicy,
    terminateSession
  } = useSystemManagement();

  const [activeTab, setActiveTab] = useState<'policies' | 'passwords' | 'sessions' | 'events'>(
    (initialTab as any) || 'policies'
  );

  // Policy columns
  const policyColumns: ColumnDef<SecurityPolicy>[] = [
    {
      key: 'id',
      header: 'Policy ID',
      accessor: item => <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300">{item.id}</span>
    },
    {
      key: 'policyName',
      header: 'Policy Title & Scope',
      accessor: item => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-slate-100">{item.policyName}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.description}</div>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Category',
      accessor: item => (
        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-300 text-[11px]">
          {item.category}
        </span>
      )
    },
    {
      key: 'settingValue',
      header: 'Configuration Value',
      accessor: item => <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{item.settingValue}</span>
    },
    {
      key: 'status',
      header: 'Enforcement Status',
      accessor: item => <StatusBadge status={item.status} />
    }
  ];

  // Session columns
  const sessionColumns: ColumnDef<ActiveSession>[] = [
    {
      key: 'userName',
      header: 'User Account',
      accessor: item => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-slate-100">{item.userName}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">ID: {item.userId}</div>
        </div>
      )
    },
    {
      key: 'device',
      header: 'Device & Client Station',
      accessor: item => (
        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 text-xs">
          <Monitor className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>{item.device}</span>
        </div>
      )
    },
    {
      key: 'ipAddress',
      header: 'Source IP & Geo',
      accessor: item => (
        <div>
          <div className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">{item.ipAddress}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.location}</div>
        </div>
      )
    },
    {
      key: 'loginTime',
      header: 'Session Started',
      accessor: item => <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">{item.loginTime}</span>
    },
    {
      key: 'status',
      header: 'Status',
      accessor: item => <StatusBadge status={item.status} />
    }
  ];

  // Security event columns
  const secEventColumns: ColumnDef<SecurityEvent>[] = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      accessor: item => <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">{item.timestamp}</span>
    },
    {
      key: 'eventType',
      header: 'Threat / Security Event',
      accessor: item => <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">{item.eventType}</span>
    },
    {
      key: 'severity',
      header: 'Severity',
      accessor: item => <StatusBadge status={item.severity} />
    },
    {
      key: 'ipAddress',
      header: 'Origin IP',
      accessor: item => <span className="font-mono text-xs text-slate-700 dark:text-slate-300 font-semibold">{item.ipAddress}</span>
    },
    {
      key: 'details',
      header: 'Threat Narrative Details',
      accessor: item => <span className="text-slate-600 dark:text-slate-400 text-xs truncate max-w-sm block">{item.details}</span>
    },
    {
      key: 'actionTaken',
      header: 'Automated Action Taken',
      accessor: item => (
        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px] font-bold text-slate-800 dark:text-slate-200">
          {item.actionTaken}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Enforced Security Policies"
          value={securityPolicies.filter(p => p.status === 'Enforced').length}
          status="positive"
          description="Strict Zero-Trust Compliance"
          icon={<ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
        />
        <MetricCard
          label="Active Concurrent Sessions"
          value={activeSessions.length}
          status="neutral"
          description="Live Authenticated Nodes"
          icon={<Monitor className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
        />
        <MetricCard
          label="Password Expiration Horizon"
          value={`${passwordPolicy.expiryDays} Days`}
          status="positive"
          description="Periodic Rotation Policy"
          icon={<Key className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
        />
        <MetricCard
          label="Blocked Threat Incidents"
          value={securityEvents.length}
          status="warning"
          description="Mitigated in Real-Time"
          icon={<ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('policies')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'policies' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Enterprise Security Policies ({securityPolicies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('passwords')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'passwords' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Password Hygiene & Rotation Controls</span>
        </button>

        <button
          onClick={() => setActiveTab('sessions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'sessions' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Monitor className="w-4 h-4" />
          <span>Active Sessions & Remote Kill ({activeSessions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'events' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>SIEM Threat & Incident Log ({securityEvents.length})</span>
        </button>
      </div>

      {/* Tab 1: Policies */}
      {activeTab === 'policies' && (
        <DataTable
          title="Enterprise Cyber Security Policy Standards"
          subtitle="Mandatory baseline configurations governing authentication, data protection, and isolation"
          data={securityPolicies}
          columns={policyColumns}
          keyExtractor={item => item.id}
          searchPlaceholder="Search policy code, title, category..."
          exportFileName="artify-security-policies"
          actionRenderer={item => (
            <button
              onClick={() => toggleSecurityPolicy(item.id)}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 font-semibold cursor-pointer"
            >
              {item.status === 'Enforced' ? 'Set Draft' : 'Enforce'}
            </button>
          )}
        />
      )}

      {/* Tab 2: Passwords */}
      {activeTab === 'passwords' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Credential Complexity & Rotation Directives</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Governs local database authentication credentials and fallback administrative passwords
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-4">
              <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">Minimum Password Length</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Recommended standard: 12+ characters</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={passwordPolicy.minLength}
                    onChange={e => updatePasswordPolicy({ minLength: Number(e.target.value) })}
                    className="w-16 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded font-mono font-bold text-center"
                  />
                  <span className="text-slate-500 dark:text-slate-400">chars</span>
                </div>
              </div>

              <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">Password Expiry Window</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Mandatory rotation period</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={passwordPolicy.expiryDays}
                    onChange={e => updatePasswordPolicy({ expiryDays: Number(e.target.value) })}
                    className="w-16 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded font-mono font-bold text-center"
                  />
                  <span className="text-slate-500 dark:text-slate-400">days</span>
                </div>
              </div>

              <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">Prevent Password Reuse</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">History remembered by system</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={passwordPolicy.preventHistoryCount}
                    onChange={e => updatePasswordPolicy({ preventHistoryCount: Number(e.target.value) })}
                    className="w-16 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded font-mono font-bold text-center"
                  />
                  <span className="text-slate-500 dark:text-slate-400">histories</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">Failed Attempts Lockout Threshold</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Automatic isolation trigger</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={passwordPolicy.maxFailedAttempts}
                    onChange={e => updatePasswordPolicy({ maxFailedAttempts: Number(e.target.value) })}
                    className="w-16 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded font-mono font-bold text-center"
                  />
                  <span className="text-slate-500 dark:text-slate-400">attempts</span>
                </div>
              </div>

              <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-slate-100">Enforced Character Classes</h4>
                <div className="space-y-2 pt-1">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={passwordPolicy.requireUppercase}
                      onChange={e => updatePasswordPolicy({ requireUppercase: e.target.checked })}
                      className="rounded border-slate-300 dark:border-slate-600 text-indigo-600 dark:text-indigo-400"
                    />
                    <span className="text-slate-700 dark:text-slate-300">Require uppercase letters (A-Z)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={passwordPolicy.requireLowercase}
                      onChange={e => updatePasswordPolicy({ requireLowercase: e.target.checked })}
                      className="rounded border-slate-300 dark:border-slate-600 text-indigo-600 dark:text-indigo-400"
                    />
                    <span className="text-slate-700 dark:text-slate-300">Require lowercase letters (a-z)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={passwordPolicy.requireNumbers}
                      onChange={e => updatePasswordPolicy({ requireNumbers: e.target.checked })}
                      className="rounded border-slate-300 dark:border-slate-600 text-indigo-600 dark:text-indigo-400"
                    />
                    <span className="text-slate-700 dark:text-slate-300">Require numerical digits (0-9)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={passwordPolicy.requireSpecialChars}
                      onChange={e => updatePasswordPolicy({ requireSpecialChars: e.target.checked })}
                      className="rounded border-slate-300 dark:border-slate-600 text-indigo-600 dark:text-indigo-400"
                    />
                    <span className="text-slate-700 dark:text-slate-300">Require special symbols (!@#$%^&*)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Sessions */}
      {activeTab === 'sessions' && (
        <DataTable
          title="Active User Sessions & Remote Session Termination"
          subtitle="Real-time live user sessions connected to the cluster. Administrators can immediately invalidate tokens"
          data={activeSessions}
          columns={sessionColumns}
          keyExtractor={item => item.id}
          searchPlaceholder="Search user name, IP, device..."
          exportFileName="artify-active-sessions"
          actionRenderer={item => (
            <button
              onClick={() => terminateSession(item.id)}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 rounded text-xs font-semibold cursor-pointer"
              title="Invalidate session token"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Kill Session</span>
            </button>
          )}
        />
      )}

      {/* Tab 4: Events */}
      {activeTab === 'events' && (
        <DataTable
          title="Security Information & Event Management (SIEM) Log"
          subtitle="Automated intrusion detection, brute-force anomalies, and credential revocation events"
          data={securityEvents}
          columns={secEventColumns}
          keyExtractor={item => item.id}
          searchPlaceholder="Search event type, IP, details..."
          exportFileName="artify-security-events"
        />
      )}
    </div>
  );
};
