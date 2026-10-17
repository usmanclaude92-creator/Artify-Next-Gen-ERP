import React, { useState } from 'react';
import {
  Building2,
  Users,
  GitCommit,
  Calendar,
  Database,
  Bell,
  History,
  Globe2,
  HardDrive,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Lock,
  Zap,
  TrendingUp,
  Activity,
  CheckCircle2,
  Send,
  Loader2,
  HelpCircle
} from 'lucide-react';
import { useSystemManagement } from '../services/systemManagementStore';
import { MetricCard } from './common/MetricCard';
import { StatusBadge } from './common/StatusBadge';

interface SystemDashboardViewProps {
  onNavigate: (functionalAreaId: string, processId?: string, transactionId?: string) => void;
}

export const SystemDashboardView: React.FC<SystemDashboardViewProps> = ({ onNavigate }) => {
  const {
    companies,
    branches,
    users,
    sodRules,
    workflows,
    postingPeriods,
    mdmDefinitions,
    alerts,
    auditTrail,
    drStatus,
    securityPolicies,
    runAiSystemQuery
  } = useSystemManagement();

  // AI Assistant states
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<{
    answer: string;
    recommendedAction?: string;
    targetRoute?: any;
  } | null>(null);

  const handleAskAi = async (promptText: string) => {
    setAiLoading(true);
    setAiPrompt(promptText);
    try {
      const res = await runAiSystemQuery(promptText);
      setAiResponse(res);
    } finally {
      setAiLoading(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    handleAskAi(aiPrompt);
  };

  const quickPrompts = [
    'Analyze Segregation of Duties (SoD) risks and active waivers',
    'Audit user directory hygiene and locked accounts',
    'Evaluate workflow turnaround bottlenecks and SLA escalations',
    'Verify FY-2026 fiscal period locking status and sub-ledgers',
    'Inspect Disaster Recovery (DR) RPO/RTO readiness score',
    'Review Master Data quality and duplicate collision prevention'
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with AI Copilot Assistant */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/40 p-6 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Artify GenAI System Administrator Agent</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Module 01: System Governance & Master Administration
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Autonomous multi-entity organization engine, cryptographic audit trail, Segregation of Duties matrix, sub-ledger posting controls, and disaster recovery orchestration.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 text-center min-w-[110px]">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">System Health</div>
              <div className="text-lg font-bold text-emerald-400 mt-0.5">99.99%</div>
              <div className="text-[10px] text-slate-400">Nominal</div>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 text-center min-w-[110px]">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">DR Readiness</div>
              <div className="text-lg font-bold text-indigo-400 mt-0.5">{drStatus.drReadinessScore}%</div>
              <div className="text-[10px] text-slate-400">RPO: {drStatus.currentRpoMinutes}m</div>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 text-center min-w-[110px]">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Data Quality</div>
              <div className="text-lg font-bold text-emerald-400 mt-0.5">98.4%</div>
              <div className="text-[10px] text-slate-400">Golden Records</div>
            </div>
          </div>
        </div>

        {/* AI Query Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <form onSubmit={handleCustomSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Sparkles className="w-4 h-4 text-indigo-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                placeholder="Ask AI System Copilot: e.g. 'Audit SoD risks', 'Check fiscal period status', 'Review locked users'..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-slate-800 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={aiLoading || !aiPrompt.trim()}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-md cursor-pointer flex-shrink-0"
            >
              {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Diagnose</span>
            </button>
          </form>

          {/* Quick Prompts */}
          <div className="flex gap-2 flex-wrap mt-3">
            <span className="text-[11px] text-slate-400 font-medium py-1">Recommended Inquiries:</span>
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleAskAi(q)}
                className="px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700 text-[11px] text-indigo-200 transition-colors cursor-pointer text-left"
              >
                {q}
              </button>
            ))}
          </div>

          {/* AI Response Card */}
          {aiResponse && (
            <div className="mt-4 p-4 rounded-xl bg-indigo-950/70 border border-indigo-800/70 text-xs text-slate-200 animate-in fade-in duration-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-indigo-300">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>AI Diagnostic Report</span>
                </div>
                <button
                  onClick={() => setAiResponse(null)}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  Dismiss
                </button>
              </div>

              <div className="whitespace-pre-line leading-relaxed text-slate-200">
                {aiResponse.answer}
              </div>

              {aiResponse.recommendedAction && (
                <div className="pt-2 border-t border-indigo-900 flex items-center justify-between">
                  <span className="text-slate-400">Recommended Next Step:</span>
                  <button
                    onClick={() => {
                      if (aiResponse.targetRoute?.functionalAreaId) {
                        onNavigate(
                          aiResponse.targetRoute.functionalAreaId,
                          aiResponse.targetRoute.processId,
                          aiResponse.targetRoute.transactionId
                        );
                      }
                    }}
                    className="inline-flex items-center gap-1 font-semibold text-indigo-300 hover:text-indigo-100 cursor-pointer"
                  >
                    <span>{aiResponse.recommendedAction}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 10 Functional Area Direct Launch Tiles */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Module 01 Functional Areas & Control Domains
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">10 Sub-Modules Fully Configured</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
          {/* 01.01 */}
          <div
            onClick={() => onNavigate('org-setup', 'org-mgmt-proc', 'tx-company-setup')}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                <Building2 className="w-4.5 h-4.5" />
              </div>
              <div className="font-bold text-slate-900 dark:text-slate-100 text-xs">01.01 Organization Setup</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {companies.length} Companies • {branches.length} Branches
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
              <span>Manage Hierarchy</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 01.02 */}
          <div
            onClick={() => onNavigate('user-access-mgmt', 'access-control-proc', 'tx-user-mgmt')}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                <Users className="w-4.5 h-4.5" />
              </div>
              <div className="font-bold text-slate-900 dark:text-slate-100 text-xs">01.02 User & Access (RBAC)</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {users.length} Users • {sodRules.length} SoD Rules
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
              <span>Security & Roles</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 01.03 */}
          <div
            onClick={() => onNavigate('workflow-approval-mgmt', 'workflow-proc', 'tx-approval-workflows')}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                <GitCommit className="w-4.5 h-4.5" />
              </div>
              <div className="font-bold text-slate-900 dark:text-slate-100 text-xs">01.03 Workflow & Approval</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {workflows.length} Pipelines • DOA Proxies
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
              <span>Matrices & SLAs</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 01.04 */}
          <div
            onClick={() => onNavigate('fin-period-controls', 'period-ctrl-proc', 'tx-posting-periods')}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                <Calendar className="w-4.5 h-4.5" />
              </div>
              <div className="font-bold text-slate-900 dark:text-slate-100 text-xs">01.04 Financial Controls</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                FY-2026 Active • Sub-Ledger Locks
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
              <span>Posting Gates</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 01.05 */}
          <div
            onClick={() => onNavigate('master-data-mgmt', 'mdm-proc', 'tx-mdm-approval')}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                <Database className="w-4.5 h-4.5" />
              </div>
              <div className="font-bold text-slate-900 dark:text-slate-100 text-xs">01.05 Master Data (MDM)</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {mdmDefinitions.length} Domains • Fuzzy Deduplication
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
              <span>Golden Records</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 01.06 */}
          <div
            onClick={() => onNavigate('notifications-alerts', 'notif-proc', 'tx-alerts-dashboard')}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                <Bell className="w-4.5 h-4.5" />
              </div>
              <div className="font-bold text-slate-900 dark:text-slate-100 text-xs">01.06 Notifications & Alerts</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {alerts.filter(a => !a.read).length} Unread • Email / SMS Rules
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
              <span>Alert Feeds</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 01.07 */}
          <div
            onClick={() => onNavigate('audit-trail-monitoring', 'audit-proc', 'tx-audit-log')}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                <History className="w-4.5 h-4.5" />
              </div>
              <div className="font-bold text-slate-900 dark:text-slate-100 text-xs">01.07 Audit Trail & SIEM</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {auditTrail.length} Events • Field Diffs
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
              <span>Inspect Logs</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 01.08 */}
          <div
            onClick={() => onNavigate('integrations-api', 'api-proc', 'tx-api-tokens')}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                <Globe2 className="w-4.5 h-4.5" />
              </div>
              <div className="font-bold text-slate-900 dark:text-slate-100 text-xs">01.08 Integrations & APIs</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                SWIFT Host-to-Host • Webhooks
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
              <span>API Gateway</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 01.09 */}
          <div
            onClick={() => onNavigate('backup-recovery', 'backup-proc', 'tx-disaster-recovery')}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                <HardDrive className="w-4.5 h-4.5" />
              </div>
              <div className="font-bold text-slate-900 dark:text-slate-100 text-xs">01.09 Backup & DR</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                AES-256 Vault • Point-in-Time Restore
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
              <span>Snapshot Vault</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 01.10 */}
          <div
            onClick={() => onNavigate('security-mgmt', 'security-proc', 'tx-sec-logs')}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                <ShieldCheck className="w-4.5 h-4.5" />
              </div>
              <div className="font-bold text-slate-900 dark:text-slate-100 text-xs">01.10 Security Policies</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {securityPolicies.length} Policies • Session Remote Kill
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
              <span>Security Center</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Cryptographic Audit Stream & Pending Compliance Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Audit Stream */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Real-Time Audit Event Stream</span>
            </h4>
            <button
              onClick={() => onNavigate('audit-trail-monitoring', 'audit-proc', 'tx-audit-log')}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 font-semibold cursor-pointer"
            >
              Full Log
            </button>
          </div>

          <div className="space-y-3">
            {auditTrail.slice(0, 5).map(event => (
              <div key={event.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 rounded-lg text-xs">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {event.userName} • <span className="text-indigo-700 dark:text-indigo-300">{event.action}</span> {event.entity}
                  </div>
                  <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">{event.timestamp.split(' ')[1]}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-1 text-[11px]">{event.details}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Incident & Compliance Queue */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Priority Incident & Governance Alerts</span>
            </h4>
            <button
              onClick={() => onNavigate('notifications-alerts', 'notif-proc', 'tx-alerts-dashboard')}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 font-semibold cursor-pointer"
            >
              All Alerts
            </button>
          </div>

          <div className="space-y-3">
            {alerts.slice(0, 4).map(alert => (
              <div
                key={alert.id}
                className="p-3 bg-amber-50/50 dark:bg-amber-500/50 border border-amber-200 dark:border-amber-500/30 rounded-lg text-xs flex items-start gap-2.5"
              >
                <ShieldAlert className="w-4 h-4 text-amber-700 dark:text-amber-300 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{alert.title}</span>
                    <StatusBadge status={alert.priority} size="sm" />
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5 text-[11px]">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
