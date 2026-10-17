import React from 'react';
import {
  Activity,
  AlertOctagon,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  RefreshCw,
  Truck,
  FileCheck,
  Zap,
  Server
} from 'lucide-react';
import { useBI } from '../../services/biStore';
import { BiFilterBar } from '../common/BiFilterBar';
import { DemoDataBanner } from '../common/DemoDataBanner';
import { BiMetricCard } from '../common/BiMetricCard';

export const OperationalDashboardView: React.FC = () => {
  const { formatCurrency } = useBI();

  const operationalQueues = [
    { name: 'Pending Vendor Invoices 3-Way Match', count: 14, slaAvgHours: 4.2, status: 'Normal', priority: 'Medium' },
    { name: 'Customer Sales Orders Awaiting Credit Check', count: 6, slaAvgHours: 1.8, status: 'Normal', priority: 'High' },
    { name: 'Engineering Purchase Requisitions > 50k OMR', count: 8, slaAvgHours: 12.5, status: 'Warning SLA', priority: 'Urgent' },
    { name: 'Warehouse Dispatch Staging Picklists', count: 23, slaAvgHours: 2.1, status: 'Normal', priority: 'Medium' },
    { name: 'Project Milestone Billing Inspection Sign-offs', count: 5, slaAvgHours: 28.0, status: 'Critical Delay', priority: 'Urgent' }
  ];

  const systemHealthTelemetry = [
    { service: 'Real-Time ERP Sync Gateway', uptime: '99.98%', latencyMs: 14, status: 'Optimal' },
    { service: 'Automated 3-Way Matching Engine', uptime: '100%', latencyMs: 38, status: 'Optimal' },
    { service: 'AI Forecasting & Anomaly Worker', uptime: '99.95%', latencyMs: 120, status: 'Optimal' },
    { service: 'Bank Open API Treasury Feeds', uptime: '99.90%', latencyMs: 85, status: 'Optimal' }
  ];

  return (
    <div className="space-y-6">
      <DemoDataBanner moduleSource="Module 02.04 Operational Cockpit & Real-time Queues" />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <BiMetricCard
          title="Active Operational Tasks"
          value="56 Pending"
          change="Across 5 Queues"
          changeType="neutral"
          icon={<Activity className="w-4 h-4" />}
        />
        <BiMetricCard
          title="SLA Compliance Rate"
          value="95.4%"
          change="+1.2% this week"
          changeType="positive"
          target=">= 95.0%"
          icon={<FileCheck className="w-4 h-4" />}
        />
        <BiMetricCard
          title="Average Approval Cycle"
          value="4.6 Hours"
          change="-0.8 hrs faster"
          changeType="positive"
          target="< 6.0 Hours"
          icon={<Clock className="w-4 h-4" />}
        />
        <BiMetricCard
          title="Critical Bottlenecks"
          value="2 Escalated"
          change="Milestone Sign-offs"
          changeType="negative"
          icon={<AlertOctagon className="w-4 h-4" />}
        />
      </div>

      <BiFilterBar />

      {/* Transaction Queues & Delays */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction Queue Table (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Enterprise Workload & Approval Queues</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Live operational transaction backlog and average turnaround</p>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
              Auto-refresh 30s
            </span>
          </div>

          <div className="space-y-3">
            {operationalQueues.map((q, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-wrap items-center justify-between gap-3 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        q.status === 'Critical Delay'
                          ? 'bg-rose-500'
                          : q.status === 'Warning SLA'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{q.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-3">
                    <span>
                      Avg SLA: <strong className="text-slate-700 dark:text-slate-300">{q.slaAvgHours} hrs</strong>
                    </span>
                    <span>
                      Priority: <strong className="text-slate-700 dark:text-slate-300">{q.priority}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg">
                    {q.count} items
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      q.status === 'Critical Delay'
                        ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-200'
                        : q.status === 'Warning SLA'
                        ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-200'
                        : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200'
                    }`}
                  >
                    {q.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System & Telemetry Health (1 col) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Engine & Microservice Health
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Core compute and integration telemetry</p>

            <div className="space-y-3">
              {systemHealthTelemetry.map(s => (
                <div key={s.service} className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{s.service}</span>
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">{s.uptime}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400">
                    <span>Latency: {s.latencyMs}ms</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{s.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 rounded-xl text-xs text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>Zero queued deadlock events detected in last 24-hour transaction log.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
