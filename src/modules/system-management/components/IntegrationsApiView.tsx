import React, { useState } from 'react';
import {
  Webhook,
  Key,
  Globe2,
  Activity,
  RefreshCw,
  Plus,
  Play,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Layers
} from 'lucide-react';
import { useSystemManagement } from '../services/systemManagementStore';
import { DataTable, ColumnDef } from './common/DataTable';
import { StatusBadge } from './common/StatusBadge';
import { MetricCard } from './common/MetricCard';
import { FormModal } from './common/FormModal';
import { ApiClient, ExternalIntegration, IntegrationLog } from '../types';
import { mockRandom } from '@/src/utils/mockRandom';

export const IntegrationsApiView: React.FC<{ activeTab?: string }> = ({ activeTab: initialTab = 'integrations' }) => {
  const {
    apiClients,
    integrations,
    integrationLogs,
    addApiClient,
    toggleApiClientStatus,
    triggerIntegrationSync
  } = useSystemManagement();

  const [activeTab, setActiveTab] = useState<'integrations' | 'clients' | 'logs'>((initialTab as any) || 'integrations');
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);

  const [clientForm, setClientForm] = useState({
    name: '',
    clientId: 'cli_live_' + mockRandom().toString(36).substring(2, 10),
    scopes: ['orders:read', 'inventory:write'],
    rateLimitPerMinute: 300,
    status: 'Active' as const
  });

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientForm.name) return;
    addApiClient(clientForm);
    setIsClientModalOpen(false);
  };

  // Integration columns
  const integrationColumns: ColumnDef<ExternalIntegration>[] = [
    {
      key: 'name',
      header: 'Integration Service',
      accessor: item => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-slate-100">{item.name}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{item.endpoint}</div>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Category & Auth',
      accessor: item => (
        <div>
          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-300 text-[11px]">
            {item.category}
          </span>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{item.authType}</div>
        </div>
      )
    },
    {
      key: 'syncSchedule',
      header: 'Synchronization Cadence',
      accessor: item => (
        <span className="text-slate-700 dark:text-slate-300 text-xs font-semibold">{item.syncSchedule}</span>
      )
    },
    {
      key: 'lastSync',
      header: 'Last Handshake',
      accessor: item => (
        <div className="text-[11px] text-slate-600 dark:text-slate-400">
          <span>{item.lastSync}</span>
          {item.errorCount24h > 0 && (
            <div className="text-rose-600 dark:text-rose-400 font-bold text-[10px]">{item.errorCount24h} errors (24h)</div>
          )}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Health Status',
      accessor: item => <StatusBadge status={item.status} />
    }
  ];

  // API Client columns
  const clientColumns: ColumnDef<ApiClient>[] = [
    {
      key: 'name',
      header: 'Client Application',
      accessor: item => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-slate-100">{item.name}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">ID: {item.clientId}</div>
        </div>
      )
    },
    {
      key: 'maskedSecret',
      header: 'Secret Key Token',
      accessor: item => (
        <span className="font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-[10px]">
          {item.maskedSecret}
        </span>
      )
    },
    {
      key: 'scopes',
      header: 'Authorized Scopes',
      accessor: item => (
        <div className="flex gap-1 flex-wrap">
          {item.scopes.map(s => (
            <span key={s} className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-mono text-[10px]">
              {s}
            </span>
          ))}
        </div>
      )
    },
    {
      key: 'rateLimitPerMinute',
      header: 'Rate Limit',
      accessor: item => (
        <span className="font-mono font-semibold text-slate-700 dark:text-slate-300 text-xs">
          {item.rateLimitPerMinute} req/min
        </span>
      )
    },
    {
      key: 'dailyRequestCount',
      header: '24h Request Volume',
      accessor: item => (
        <span className="font-mono text-slate-800 dark:text-slate-200 text-xs font-bold">
          {item.dailyRequestCount.toLocaleString()} calls
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      accessor: item => <StatusBadge status={item.status} />
    }
  ];

  // Integration log columns
  const logColumns: ColumnDef<IntegrationLog>[] = [
    {
      key: 'timestamp',
      header: 'Timestamp (UTC)',
      accessor: item => <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">{item.timestamp}</span>
    },
    {
      key: 'integrationName',
      header: 'Integration Endpoint',
      accessor: item => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-slate-100">{item.integrationName}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            {item.method} {item.endpoint}
          </div>
        </div>
      )
    },
    {
      key: 'statusCode',
      header: 'HTTP Status',
      accessor: item => (
        <span
          className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold ${
            item.statusCode === 200 ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200' : 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-200'
          }`}
        >
          {item.statusCode} OK
        </span>
      )
    },
    {
      key: 'durationMs',
      header: 'Latency',
      accessor: item => (
        <span className="font-mono text-xs text-slate-700 dark:text-slate-300">{item.durationMs} ms</span>
      )
    },
    {
      key: 'status',
      header: 'Result',
      accessor: item => <StatusBadge status={item.status} />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="External Integrations"
          value={integrations.length}
          status="positive"
          description="Banking, Tax, Shipping & Payroll"
          icon={<Globe2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
        />
        <MetricCard
          label="Active API Clients"
          value={apiClients.filter(c => c.status === 'Active').length}
          status="positive"
          description="OAuth2 & Secret Key Clients"
          icon={<Key className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
        />
        <MetricCard
          label="24h Integration Calls"
          value="45,980"
          status="positive"
          description="99.98% Success Delivery Rate"
          icon={<Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
        />
        <MetricCard
          label="Average API Latency"
          value="64 ms"
          status="positive"
          description="High-Throughput Gateway"
          icon={<RefreshCw className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('integrations')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'integrations' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Globe2 className="w-4 h-4" />
          <span>External Integrations & Gateways ({integrations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('clients')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'clients' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>API Clients & Credentials ({apiClients.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'logs' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Live API Request Logs</span>
        </button>
      </div>

      {/* Tab 1: Integrations */}
      {activeTab === 'integrations' && (
        <DataTable
          title="Enterprise Integration Gateway Connectors"
          subtitle="Direct machine-to-machine integrations for SWIFT Host-to-Host payments, tax compliance, and carrier logistics"
          data={integrations}
          columns={integrationColumns}
          keyExtractor={item => item.id}
          searchPlaceholder="Search integration service, endpoint, category..."
          exportFileName="artify-integrations"
          actionRenderer={item => (
            <button
              onClick={() => triggerIntegrationSync(item.id)}
              className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 rounded text-xs font-semibold cursor-pointer"
              title="Trigger real-time handshake check"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Test Handshake</span>
            </button>
          )}
        />
      )}

      {/* Tab 2: API Clients */}
      {activeTab === 'clients' && (
        <DataTable
          title="Inbound API Client Keys"
          subtitle="Provision and govern programmatic API keys with strict token scopes and rate limiting"
          data={apiClients}
          columns={clientColumns}
          keyExtractor={item => item.id}
          onAddClick={() => setIsClientModalOpen(true)}
          addLabel="Generate API Credentials"
          searchPlaceholder="Search client name, client ID..."
          exportFileName="artify-api-clients"
          actionRenderer={item => (
            <button
              onClick={() => toggleApiClientStatus(item.id)}
              className={`px-2.5 py-1 rounded text-xs font-semibold border cursor-pointer ${
                item.status === 'Active'
                  ? 'border-rose-300 dark:border-rose-500/40 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10'
                  : 'border-emerald-300 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
              }`}
            >
              {item.status === 'Active' ? 'Suspend Token' : 'Reactivate Token'}
            </button>
          )}
        />
      )}

      {/* Tab 3: Logs */}
      {activeTab === 'logs' && (
        <DataTable
          title="API Gateway Request & Telemetry Log"
          subtitle="Real-time request trace logs with response status codes, execution duration, and payload telemetry"
          data={integrationLogs}
          columns={logColumns}
          keyExtractor={item => item.id}
          searchPlaceholder="Search integration name, endpoint, status code..."
          exportFileName="artify-integration-logs"
        />
      )}

      {/* Modal: Create API Client */}
      <FormModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        title="Generate API Gateway Credentials"
        subtitle="Issue programmatic API credentials with scoped access policies and rate limits"
        onSubmit={handleCreateClient}
        submitLabel="Generate Key Pair"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Application / Client Name *</label>
            <input
              type="text"
              required
              value={clientForm.name}
              onChange={e => setClientForm({ ...clientForm, name: e.target.value })}
              placeholder="e.g. Mobile B2B Portal Gateway"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Rate Limit (Requests / Minute)</label>
            <input
              type="number"
              value={clientForm.rateLimitPerMinute}
              onChange={e => setClientForm({ ...clientForm, rateLimitPerMinute: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Authorized Scopes</label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {['orders:read', 'orders:write', 'inventory:read', 'inventory:write', 'payments:write', 'reports:read'].map(scope => (
                <label key={scope} className="flex items-center gap-2 p-2 rounded bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs">
                  <input
                    type="checkbox"
                    checked={clientForm.scopes.includes(scope)}
                    onChange={e => {
                      if (e.target.checked) {
                        setClientForm({ ...clientForm, scopes: [...clientForm.scopes, scope] });
                      } else {
                        setClientForm({ ...clientForm, scopes: clientForm.scopes.filter(s => s !== scope) });
                      }
                    }}
                    className="rounded border-slate-300 dark:border-slate-600 text-indigo-600 dark:text-indigo-400"
                  />
                  <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">{scope}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  );
};
