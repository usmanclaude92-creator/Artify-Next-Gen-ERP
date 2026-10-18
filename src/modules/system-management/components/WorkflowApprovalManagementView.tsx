import React, { useState } from 'react';
import {
  GitCommit,
  GitPullRequest,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Shield,
  ArrowRight,
  UserCheck,
  Zap,
  Sliders,
  DollarSign
} from 'lucide-react';
import { useSystemManagement } from '../services/systemManagementStore';
import { DataTable, ColumnDef } from './common/DataTable';
import { StatusBadge } from './common/StatusBadge';
import { MetricCard } from './common/MetricCard';
import { FormModal } from './common/FormModal';
import { ApprovalWorkflow, ApprovalMatrixRule, DelegationOfAuthority, ApprovalLimit, EscalationRule } from '../types';

export const WorkflowApprovalManagementView: React.FC<{ activeTab?: string }> = ({ activeTab: initialTab = 'workflows' }) => {
  const {
    workflows,
    approvalMatrices,
    delegations,
    approvalLimits,
    escalationRules,
    addWorkflow,
    updateWorkflow,
    addApprovalMatrixRule,
    addDelegation,
    revokeDelegation,
    addApprovalLimit,
    addEscalationRule
  } = useSystemManagement();

  const [activeTab, setActiveTab] = useState<'workflows' | 'matrices' | 'delegations' | 'limits' | 'escalations'>(
    (initialTab as any) || 'workflows'
  );

  const [isWfModalOpen, setIsWfModalOpen] = useState(false);
  const [isDelegationModalOpen, setIsDelegationModalOpen] = useState(false);
  const [isMatrixModalOpen, setIsMatrixModalOpen] = useState(false);

  // Forms
  const [wfForm, setWfForm] = useState({
    code: '',
    name: '',
    module: 'Finance & Accounting',
    documentType: 'Vendor Payment Batch',
    status: 'Active' as const,
    requiresDualApprovalAboveOMR: 10000,
    stages: [
      {
        stageOrder: 1,
        stageName: 'Department Manager Review',
        approverRole: 'Department Head',
        timeoutHours: 24,
        escalateToRole: 'General Manager'
      },
      {
        stageOrder: 2,
        stageName: 'Finance Controller Verification',
        approverRole: 'Finance Manager',
        timeoutHours: 48,
        escalateToRole: 'CFO'
      }
    ]
  });

  const [delegationForm, setDelegationForm] = useState({
    delegatorId: 'usr-cfo',
    delegatorName: 'Sarah Jenkins',
    delegateId: 'usr-finmgr',
    delegateName: 'Rashid Al-Kiyumi',
    startDate: '2026-09-01',
    endDate: '2026-09-15',
    maxApprovalLimitOMR: 50000,
    reason: 'Annual Executive Leave - Financial Proxy'
  });

  const [matrixForm, setMatrixForm] = useState({
    module: 'Procurement',
    documentType: 'Purchase Order',
    minAmountOMR: 0,
    maxAmountOMR: 5000,
    requiredRole: 'Purchasing Manager',
    approverCountRequired: 1
  });

  const handleCreateWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wfForm.code || !wfForm.name) return;
    addWorkflow({
      code: wfForm.code,
      name: wfForm.name,
      module: wfForm.module,
      process: wfForm.documentType,
      triggerEvent: 'Document Submit',
      status: wfForm.status,
      stages: wfForm.stages.map((st, i) => ({
        stageNumber: st.stageOrder ?? i + 1,
        name: st.stageName,
        approverType: 'Role' as const,
        approverValue: st.approverRole,
        timeoutHours: st.timeoutHours,
        allowDelegation: true
      }))
    });
    setIsWfModalOpen(false);
  };

  const handleCreateDelegation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!delegationForm.reason) return;
    addDelegation({
      ...delegationForm,
      delegatorRole: '',
      delegateRole: '',
      scope: 'All Approvals',
      status: 'Active'
    });
    setIsDelegationModalOpen(false);
  };

  const handleCreateMatrix = (e: React.FormEvent) => {
    e.preventDefault();
    addApprovalMatrixRule({
      companyId: 'comp-1',
      departmentId: '',
      module: matrixForm.module,
      transactionType: matrixForm.documentType,
      minAmount: matrixForm.minAmountOMR,
      maxAmount: matrixForm.maxAmountOMR,
      currency: 'OMR',
      approvalLevels: Array.from({ length: Math.max(1, matrixForm.approverCountRequired) }, () => matrixForm.requiredRole),
      effectiveDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    });
    setIsMatrixModalOpen(false);
  };

  // Workflow columns
  const wfColumns: ColumnDef<ApprovalWorkflow>[] = [
    {
      key: 'code',
      header: 'Workflow Code',
      accessor: item => <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300">{item.code}</span>
    },
    {
      key: 'name',
      header: 'Pipeline Name & Document',
      accessor: item => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-slate-100">{item.name}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            {item.module} • <strong>{item.process}</strong>
          </div>
        </div>
      )
    },
    {
      key: 'stages',
      header: 'Approval Stages',
      accessor: item => (
        <div className="flex items-center gap-1">
          {item.stages.map((st, i) => (
            <React.Fragment key={st.stageNumber}>
              <span
                className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-medium"
                title={`${st.approverValue} (SLA: ${st.timeoutHours}h)`}
              >
                {st.stageNumber}. {st.name}
              </span>
              {i < item.stages.length - 1 && <ArrowRight className="w-3 h-3 text-slate-500 dark:text-slate-400" />}
            </React.Fragment>
          ))}
        </div>
      )
    },
    {
      key: 'triggerEvent',
      header: 'Trigger Event',
      accessor: item => (
        <span className="font-mono text-[11px] font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
          {item.triggerEvent}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      accessor: item => <StatusBadge status={item.status} />
    }
  ];

  // Delegation columns
  const delegationColumns: ColumnDef<DelegationOfAuthority>[] = [
    {
      key: 'delegatorName',
      header: 'Primary Authority (Delegator)',
      accessor: item => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-slate-100">{item.delegatorName}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">ID: {item.delegatorId}</div>
        </div>
      )
    },
    {
      key: 'delegateName',
      header: 'Proxy Holder (Delegate)',
      accessor: item => (
        <div>
          <div className="font-semibold text-indigo-700 dark:text-indigo-300">{item.delegateName}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">ID: {item.delegateId}</div>
        </div>
      )
    },
    {
      key: 'validity',
      header: 'Validity Period',
      accessor: item => (
        <div className="text-[11px] text-slate-600 dark:text-slate-400">
          <span>
            {item.startDate} to {item.endDate}
          </span>
        </div>
      )
    },
    {
      key: 'maxApprovalLimitOMR',
      header: 'Delegated Cap (OMR)',
      accessor: item => (
        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
          {item.maxApprovalLimitOMR.toLocaleString()} OMR
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      accessor: item => <StatusBadge status={item.status} />
    }
  ];

  // Matrix columns
  const matrixColumns: ColumnDef<ApprovalMatrixRule>[] = [
    {
      key: 'module',
      header: 'Module & Doc Type',
      accessor: item => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-slate-100">{item.module}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.transactionType}</div>
        </div>
      )
    },
    {
      key: 'threshold',
      header: 'Monetary Threshold Band (OMR)',
      accessor: item => (
        <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">
          {item.minAmount.toLocaleString()} OMR —{' '}
          {item.maxAmount ? `${item.maxAmount.toLocaleString()} OMR` : 'Unlimited (Executive Board)'}
        </span>
      )
    },
    {
      key: 'approvalLevels',
      header: 'Signatory Authority Required',
      accessor: item => (
        <div className="flex items-center gap-1 flex-wrap">
          {item.approvalLevels.map(lvl => (
            <span key={lvl} className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-medium text-[11px]">
              {lvl}
            </span>
          ))}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Active Approval Workflows"
          value={workflows.filter(w => w.status === 'Active').length}
          status="positive"
          description="Multi-Stage Business Pipelines"
          icon={<GitCommit className="w-5 h-5" />}
        />
        <MetricCard
          label="Authority Delegations (DOA)"
          value={delegations.filter(d => d.status === 'Active').length}
          status="neutral"
          description="Active Proxy Authorizations"
          icon={<UserCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
        />
        <MetricCard
          label="Matrix Threshold Bands"
          value={approvalMatrices.length}
          status="positive"
          description="Monetary Tier Controls"
          icon={<Sliders className="w-5 h-5" />}
        />
        <MetricCard
          label="Auto-Escalation SLA Rules"
          value={escalationRules.length}
          status="positive"
          description="Bottleneck Prevention"
          icon={<Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('workflows')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'workflows' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <GitCommit className="w-4 h-4" />
          <span>Approval Pipelines ({workflows.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('matrices')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'matrices' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Approval Matrix Tiers ({approvalMatrices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('delegations')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'delegations' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Delegation of Authority (DOA) ({delegations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('escalations')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'escalations' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>SLA Escalation Rules</span>
        </button>
      </div>

      {/* Tab 1: Workflows */}
      {activeTab === 'workflows' && (
        <DataTable
          title="Document Approval Workflows"
          subtitle="Sequential and parallel review pipelines with SLA timeouts, dual-sign thresholds, and dynamic role resolution"
          data={workflows}
          columns={wfColumns}
          keyExtractor={item => item.id}
          onAddClick={() => setIsWfModalOpen(true)}
          addLabel="Define New Workflow"
          searchPlaceholder="Search workflow code, module, document type..."
          exportFileName="artify-approval-workflows"
          actionRenderer={item => (
            <button
              onClick={() =>
                updateWorkflow(item.id, {
                  status: item.status === 'Active' ? 'Draft' : 'Active'
                })
              }
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 font-semibold cursor-pointer"
            >
              {item.status === 'Active' ? 'Deactivate' : 'Activate'}
            </button>
          )}
        />
      )}

      {/* Tab 2: Matrices */}
      {activeTab === 'matrices' && (
        <DataTable
          title="Approval Matrix Limits & Threshold Bands"
          subtitle="Tiered authorization boundaries dictating required signatories according to monetary impact"
          data={approvalMatrices}
          columns={matrixColumns}
          keyExtractor={item => item.id}
          onAddClick={() => setIsMatrixModalOpen(true)}
          addLabel="Add Matrix Tier"
          searchPlaceholder="Search module, document, role..."
          exportFileName="artify-approval-matrices"
        />
      )}

      {/* Tab 3: Delegations */}
      {activeTab === 'delegations' && (
        <DataTable
          title="Delegation of Authority (DOA) Proxies"
          subtitle="Time-bounded financial proxy authorizations with strict monetary caps and automatic revocation"
          data={delegations}
          columns={delegationColumns}
          keyExtractor={item => item.id}
          onAddClick={() => setIsDelegationModalOpen(true)}
          addLabel="Schedule Proxy Delegation"
          searchPlaceholder="Search delegator, delegate, reason..."
          exportFileName="artify-doa-delegations"
          actionRenderer={item => (
            item.status === 'Active' ? (
              <button
                onClick={() => revokeDelegation(item.id)}
                className="px-2.5 py-1 rounded text-xs font-semibold border border-rose-300 dark:border-rose-500/40 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer"
              >
                Revoke Proxy
              </button>
            ) : (
              <span className="text-xs text-slate-500 dark:text-slate-400">Revoked</span>
            )
          )}
        />
      )}

      {/* Tab 4: Escalations */}
      {activeTab === 'escalations' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4 mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">SLA Bottleneck Auto-Escalation Rules</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Automated re-routing and reminder dispatches when approval steps exceed defined turnaround windows
              </p>
            </div>
            <button
              onClick={() => {
                addEscalationRule({
                  workflowId: 'WF-CAPEX-01',
                  workflowName: 'CAPEX Approval',
                  stageNumber: 1,
                  waitingHours: 36,
                  escalationRecipient: 'General Manager',
                  reminderFrequencyHours: 12,
                  maxEscalations: 3,
                  notifyMethod: 'SMS Urgent',
                  status: 'Active'
                });
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Escalation Rule</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {escalationRules.map(esc => (
              <div key={esc.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50/60 dark:bg-slate-800/60 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300">{esc.workflowId}</span>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
                      Trigger SLA: Exceeds {esc.waitingHours} Hours
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-200 text-[11px] font-bold">
                    Active SLA
                  </span>
                </div>

                <div className="text-xs space-y-2">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Automatic Remediation:</span>
                    <div className="text-slate-800 dark:text-slate-200 font-semibold mt-0.5">{esc.notifyMethod}</div>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Escalates To:</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{esc.escalationRecipient}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Create Workflow */}
      <FormModal
        isOpen={isWfModalOpen}
        onClose={() => setIsWfModalOpen(false)}
        title="Define Approval Workflow Pipeline"
        subtitle="Establish multi-stage sign-off with mandatory reviewer roles and SLAs"
        onSubmit={handleCreateWorkflow}
        submitLabel="Activate Pipeline"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Workflow Code *</label>
            <input
              type="text"
              required
              value={wfForm.code}
              onChange={e => setWfForm({ ...wfForm, code: e.target.value.toUpperCase() })}
              placeholder="e.g. WF-PAYROLL-01"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Pipeline Name *</label>
            <input
              type="text"
              required
              value={wfForm.name}
              onChange={e => setWfForm({ ...wfForm, name: e.target.value })}
              placeholder="e.g. Monthly Executive Payroll Run"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Target ERP Module</label>
            <select
              value={wfForm.module}
              onChange={e => setWfForm({ ...wfForm, module: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            >
              <option value="Finance & Accounting">Finance & Accounting</option>
              <option value="Procurement">Procurement</option>
              <option value="Human Resources">Human Resources & Payroll</option>
              <option value="Sales & Distribution">Sales & Distribution</option>
              <option value="Manufacturing">Manufacturing</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Document Type</label>
            <input
              type="text"
              value={wfForm.documentType}
              onChange={e => setWfForm({ ...wfForm, documentType: e.target.value })}
              placeholder="e.g. Bank Payment Batch"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Dual Sign-Off Threshold (OMR)
            </label>
            <input
              type="number"
              value={wfForm.requiresDualApprovalAboveOMR}
              onChange={e => setWfForm({ ...wfForm, requiresDualApprovalAboveOMR: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-xs"
            />
          </div>
        </div>
      </FormModal>

      {/* Modal: Create Delegation */}
      <FormModal
        isOpen={isDelegationModalOpen}
        onClose={() => setIsDelegationModalOpen(false)}
        title="Schedule Authority Proxy (DOA)"
        subtitle="Temporarily delegate financial signing authority during executive absences"
        onSubmit={handleCreateDelegation}
        submitLabel="Authorize Delegation"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Primary Delegator *</label>
            <input
              type="text"
              disabled
              value={`${delegationForm.delegatorName} (${delegationForm.delegatorId})`}
              className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Proxy Delegate *</label>
            <input
              type="text"
              value={delegationForm.delegateName}
              onChange={e => setDelegationForm({ ...delegationForm, delegateName: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Start Date *</label>
            <input
              type="date"
              required
              value={delegationForm.startDate}
              onChange={e => setDelegationForm({ ...delegationForm, startDate: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">End Date *</label>
            <input
              type="date"
              required
              value={delegationForm.endDate}
              onChange={e => setDelegationForm({ ...delegationForm, endDate: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Maximum Financial Cap (OMR) *</label>
            <input
              type="number"
              required
              value={delegationForm.maxApprovalLimitOMR}
              onChange={e => setDelegationForm({ ...delegationForm, maxApprovalLimitOMR: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-xs"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Delegation Justification *</label>
            <textarea
              rows={2}
              required
              value={delegationForm.reason}
              onChange={e => setDelegationForm({ ...delegationForm, reason: e.target.value })}
              placeholder="e.g. Official overseas mission; financial approvals transferred to deputy."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            />
          </div>
        </div>
      </FormModal>

      {/* Modal: Create Matrix Tier */}
      <FormModal
        isOpen={isMatrixModalOpen}
        onClose={() => setIsMatrixModalOpen(false)}
        title="Add Approval Matrix Threshold"
        subtitle="Bind financial monetary ranges to specific authorization roles"
        onSubmit={handleCreateMatrix}
        submitLabel="Add Matrix Tier"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Target Module</label>
            <input
              type="text"
              value={matrixForm.module}
              onChange={e => setMatrixForm({ ...matrixForm, module: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Document Type</label>
            <input
              type="text"
              value={matrixForm.documentType}
              onChange={e => setMatrixForm({ ...matrixForm, documentType: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Min Threshold (OMR)</label>
            <input
              type="number"
              value={matrixForm.minAmountOMR}
              onChange={e => setMatrixForm({ ...matrixForm, minAmountOMR: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Max Threshold (OMR)</label>
            <input
              type="number"
              value={matrixForm.maxAmountOMR || ''}
              onChange={e => setMatrixForm({ ...matrixForm, maxAmountOMR: Number(e.target.value) || null })}
              placeholder="Leave blank for unlimited"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-xs"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Required Authority Role</label>
            <input
              type="text"
              value={matrixForm.requiredRole}
              onChange={e => setMatrixForm({ ...matrixForm, requiredRole: e.target.value })}
              placeholder="e.g. Chief Executive Officer"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold"
            />
          </div>
        </div>
      </FormModal>
    </div>
  );
};
