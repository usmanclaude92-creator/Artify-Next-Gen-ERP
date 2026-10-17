import React, { useState } from 'react';
import {
  HardDrive,
  ShieldCheck,
  RefreshCw,
  RotateCcw,
  Clock,
  CheckCircle2,
  Server,
  Cloud,
  Layers,
  ArrowRight,
  Database,
  Lock
} from 'lucide-react';
import { useSystemManagement } from '../services/systemManagementStore';
import { DataTable, ColumnDef } from './common/DataTable';
import { StatusBadge } from './common/StatusBadge';
import { MetricCard } from './common/MetricCard';
import { FormModal } from './common/FormModal';
import { RestorePoint, BackupConfiguration } from '../types';

export const BackupRecoveryView: React.FC<{ activeTab?: string }> = ({ activeTab: initialTab = 'snapshots' }) => {
  const {
    backupConfig,
    restorePoints,
    drStatus,
    triggerManualBackup,
    testSandboxRestore,
    updateBackupConfig
  } = useSystemManagement();

  const [activeTab, setActiveTab] = useState<'snapshots' | 'dr' | 'config'>((initialTab as any) || 'snapshots');
  const [isTriggering, setIsTriggering] = useState(false);

  const handleManualBackup = () => {
    setIsTriggering(true);
    setTimeout(() => {
      triggerManualBackup();
      setIsTriggering(false);
    }, 800);
  };

  // Restore point columns
  const rpColumns: ColumnDef<RestorePoint>[] = [
    {
      key: 'id',
      header: 'Snapshot ID',
      accessor: item => <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300">{item.id}</span>
    },
    {
      key: 'timestamp',
      header: 'Creation Timestamp (UTC)',
      accessor: item => <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400">{item.timestamp}</span>
    },
    {
      key: 'backupType',
      header: 'Backup Classification',
      accessor: item => (
        <span className="text-slate-800 dark:text-slate-200 text-xs font-semibold">{item.backupType}</span>
      )
    },
    {
      key: 'sizeFormatted',
      header: 'Snapshot Size',
      accessor: item => (
        <span className="font-mono font-semibold text-slate-700 dark:text-slate-300 text-xs">{item.sizeFormatted}</span>
      )
    },
    {
      key: 'checksumSha256',
      header: 'SHA-256 Integrity Verification',
      accessor: item => (
        <div className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-300 font-mono">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span className="truncate max-w-[140px]">{item.checksumSha256}</span>
        </div>
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
          label="DR Readiness Score"
          value={`${drStatus.drReadinessScore}%`}
          status="positive"
          description="RPO/RTO Fully Compliant"
          icon={<ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
        />
        <MetricCard
          label="Current Recovery Point (RPO)"
          value={`${drStatus.currentRpoMinutes} Mins`}
          status="positive"
          description={`Target SLA: ≤ ${drStatus.rpoTargetMinutes} mins`}
          icon={<Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
        />
        <MetricCard
          label="Recovery Time Objective (RTO)"
          value={`${drStatus.currentRtoEstimateMinutes} Mins`}
          status="positive"
          description={`Target SLA: ≤ ${drStatus.rtoTargetMinutes} mins`}
          icon={<RotateCcw className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
        />
        <MetricCard
          label="Encrypted Vault Snapshots"
          value={restorePoints.length}
          status="positive"
          description="AES-256 Multi-Region Replicated"
          icon={<HardDrive className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('snapshots')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'snapshots' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <HardDrive className="w-4 h-4" />
          <span>Encrypted Snapshot Vault ({restorePoints.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('dr')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'dr' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Disaster Recovery (DR) Readiness Drill</span>
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'config' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Backup Schedules & Retention Policies</span>
        </button>
      </div>

      {/* Tab 1: Snapshots */}
      {activeTab === 'snapshots' && (
        <DataTable
          title="Cryptographic Database Snapshots"
          subtitle="Point-in-time recovery images with automated SHA-256 hash validation and cold storage replication"
          data={restorePoints}
          columns={rpColumns}
          keyExtractor={item => item.id}
          onAddClick={handleManualBackup}
          addLabel={isTriggering ? 'Taking Snapshot...' : 'Take On-Demand Snapshot'}
          searchPlaceholder="Search snapshot ID, backup type..."
          exportFileName="artify-backup-snapshots"
          actionRenderer={item => (
            <button
              onClick={() => testSandboxRestore(item.id)}
              className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-500/40 rounded text-xs font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Test Sandbox Restore</span>
            </button>
          )}
        />
      )}

      {/* Tab 2: DR */}
      {activeTab === 'dr' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Multi-Region Disaster Recovery Topology</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Continuous cross-regional database replication between Primary DC (Muscat) and Secondary DR Vault (Frankfurt)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/40 dark:bg-indigo-500/40 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-indigo-700 dark:text-indigo-300" />
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{drStatus.primaryRegion}</h4>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200">
                  Active Primary
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Serving active transactional traffic across all 17 ERP modules with synchronous write journaling.
              </p>
              <div className="pt-2 border-t border-indigo-200 dark:border-indigo-500/30 flex justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Node Cluster:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">3x PostgreSQL High-Availability Nodes</span>
              </div>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{drStatus.failoverRegion}</h4>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-200">
                  Hot Standby
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Asynchronous streaming replication with continuous integrity checksum tests and instant DNS failover readiness.
              </p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Replication Lag:</span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">0.42 Seconds (Near-Zero Lag)</span>
              </div>
            </div>
          </div>

          {/* Drill info */}
          <div className="p-4 border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-500/40 rounded-xl flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-100">
                Last Disaster Recovery Drill: {drStatus.lastDrDrillDate}
              </h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                Outcome: <strong>{drStatus.clusterSyncStatus}</strong>. Full database restoration completed in 18 minutes.
              </p>
            </div>
            <button
              onClick={() => testSandboxRestore('dr-drill-live')}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
            >
              Simulate DR Drill
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Config */}
      {activeTab === 'config' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Automated Backup Cadence & Retention</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Governs automated daily and weekly database snapshot tasks and immutable retention policies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 space-y-3">
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500 dark:text-slate-400">Backup Frequency:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{backupConfig.frequency}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500 dark:text-slate-400">Scheduled Execution Window:</span>
                <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300">{backupConfig.frequency}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500 dark:text-slate-400">Retention Horizon:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{backupConfig.retentionDays} Days (Compliant with Statutory Law)</span>
              </div>
            </div>

            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 space-y-3">
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500 dark:text-slate-400">Encryption Standard:</span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> {backupConfig.encryptionAlgorithm}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500 dark:text-slate-400">Replication Vault:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{backupConfig.storageDestination}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500 dark:text-slate-400">Automatic Checksum Validation:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-300">Enabled (Every Cycle)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
