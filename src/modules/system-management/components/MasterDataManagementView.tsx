import React, { useState } from 'react';
import {
  Database,
  Copy,
  CheckCheck,
  FileCheck,
  AlertCircle,
  Plus,
  ShieldCheck,
  Sliders,
  Sparkles,
  ArrowRight,
  GitMerge
} from 'lucide-react';
import { useSystemManagement } from '../services/systemManagementStore';
import { DataTable, ColumnDef } from './common/DataTable';
import { StatusBadge } from './common/StatusBadge';
import { MetricCard } from './common/MetricCard';
import { FormModal } from './common/FormModal';
import { MasterDataDefinition, DuplicateRule, ValidationRule, MasterDataApprovalRequest } from '../types';

export const MasterDataManagementView: React.FC<{ activeTab?: string }> = ({ activeTab: initialTab = 'catalog' }) => {
  const {
    mdmDefinitions,
    duplicateRules,
    validationRules,
    mdmApprovals,
    addDuplicateRule,
    addValidationRule,
    processMdmApproval
  } = useSystemManagement();

  const [activeTab, setActiveTab] = useState<'catalog' | 'duplicates' | 'validations' | 'approvals'>(
    (initialTab as any) || 'catalog'
  );

  const [isDupModalOpen, setIsDupModalOpen] = useState(false);
  const [isValModalOpen, setIsValModalOpen] = useState(false);

  const [dupForm, setDupForm] = useState({
    entity: 'Customer Master',
    ruleName: 'Corporate TRN & Mobile Match',
    matchFields: ['taxRegistrationNumber', 'primaryPhone'],
    thresholdScore: 90,
    action: 'Block' as const,
    status: 'Active' as const
  });

  const [valForm, setValForm] = useState({
    entity: 'Vendor Master',
    fieldName: 'ibanAccountNumber',
    ruleType: 'REGEX' as const,
    ruleExpression: '^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$',
    errorMessage: 'Must follow standard ISO-13616 IBAN format',
    status: 'Active' as const
  });

  const handleCreateDupRule = (e: React.FormEvent) => {
    e.preventDefault();
    addDuplicateRule({
      entityType: dupForm.entity,
      ruleName: dupForm.ruleName,
      fieldsChecked: dupForm.matchFields,
      matchType: 'Exact Match',
      similarityThresholdPercent: dupForm.thresholdScore,
      actionOnMatch: dupForm.action === 'Block' ? 'Block Creation' : 'Flag for Review',
      status: dupForm.status
    });
    setIsDupModalOpen(false);
  };

  const handleCreateValRule = (e: React.FormEvent) => {
    e.preventDefault();
    addValidationRule({
      entityType: valForm.entity,
      fieldName: valForm.fieldName,
      ruleType: 'Regex Format',
      ruleExpression: valForm.ruleExpression,
      errorMessage: valForm.errorMessage,
      severity: 'Error',
      status: valForm.status
    });
    setIsValModalOpen(false);
  };

  // Catalog columns
  const catalogColumns: ColumnDef<MasterDataDefinition>[] = [
    {
      key: 'code',
      header: 'Entity Code',
      accessor: item => <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300">{item.code}</span>
    },
    {
      key: 'entityName',
      header: 'Master Entity & Category',
      accessor: item => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-slate-100">{item.entityName}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.category} • Ver {item.version}</div>
        </div>
      )
    },
    {
      key: 'ownerDepartment',
      header: 'Data Governance Steward',
      accessor: item => (
        <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-medium text-[11px]">
          {item.ownerDepartment}
        </span>
      )
    },
    {
      key: 'goldenRecordCount',
      header: 'Master Records',
      accessor: item => (
        <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
          {item.goldenRecordCount.toLocaleString()} Golden
        </span>
      )
    },
    {
      key: 'approvalRequired',
      header: 'Dual Gate Approvals',
      accessor: item => (
        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${item.approvalRequired ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
          {item.approvalRequired ? 'Mandatory' : 'Auto-Approve'}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Governance',
      accessor: item => <StatusBadge status={item.status} />
    }
  ];

  // Duplicate rules columns
  const dupColumns: ColumnDef<DuplicateRule>[] = [
    {
      key: 'ruleName',
      header: 'Deduplication Rule & Domain',
      accessor: item => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-slate-100">{item.ruleName}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.entityType} • {item.matchType}</div>
        </div>
      )
    },
    {
      key: 'fieldsChecked',
      header: 'Fuzzy Matching Keys',
      accessor: item => (
        <div className="flex gap-1 flex-wrap">
          {item.fieldsChecked.map(f => (
            <span key={f} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px] text-slate-700 dark:text-slate-300">
              {f}
            </span>
          ))}
        </div>
      )
    },
    {
      key: 'similarityThresholdPercent',
      header: 'Similarity Threshold',
      accessor: item => (
        <span className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300">{item.similarityThresholdPercent}%</span>
      )
    },
    {
      key: 'actionOnMatch',
      header: 'Collision Action',
      accessor: item => (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            item.actionOnMatch.includes('Block') ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-200' : 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-200'
          }`}
        >
          {item.actionOnMatch}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      accessor: item => <StatusBadge status={item.status} />
    }
  ];

  // Approvals columns
  const approvalColumns: ColumnDef<MasterDataApprovalRequest>[] = [
    {
      key: 'recordIdentifier',
      header: 'Proposed Entity Code',
      accessor: item => <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300">{item.recordIdentifier}</span>
    },
    {
      key: 'entityType',
      header: 'Master Domain & Type',
      accessor: item => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-slate-100">{item.entityType}</div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-400">
            Approver: {item.assignedApprover}
          </span>
        </div>
      )
    },
    {
      key: 'submittedBy',
      header: 'Requested By',
      accessor: item => (
        <div>
          <div className="font-medium text-slate-800 dark:text-slate-200">{item.submittedBy}</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{item.submittedAt}</div>
        </div>
      )
    },
    {
      key: 'recordData',
      header: 'Committed Attributes',
      accessor: item => (
        <pre className="font-mono text-[10px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-1.5 rounded max-w-xs truncate">
          {JSON.stringify(item.recordData)}
        </pre>
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
          label="Governed Master Record Domains"
          value={mdmDefinitions.length}
          status="positive"
          description="Golden Records Architecture"
          icon={<Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
        />
        <MetricCard
          label="Average Master Quality Index"
          value="98.4%"
          status="positive"
          description="Across 18,300 Golden Records"
          icon={<Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
        />
        <MetricCard
          label="Deduplication Collision Rules"
          value={duplicateRules.length}
          status="positive"
          description="Fuzzy Match Engines"
          icon={<Copy className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
        />
        <MetricCard
          label="Pending Master Approvals"
          value={mdmApprovals.filter(a => a.status === 'Pending Review').length}
          status="warning"
          description="Awaiting Steward Sign-Off"
          icon={<FileCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'catalog' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Golden Record Catalogs ({mdmDefinitions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('duplicates')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'duplicates' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Copy className="w-4 h-4" />
          <span>Duplicate Matching Rules ({duplicateRules.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('validations')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'validations' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <CheckCheck className="w-4 h-4" />
          <span>Field Validation Schemas ({validationRules.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('approvals')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'approvals' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Steward Approval Queue ({mdmApprovals.length})</span>
        </button>
      </div>

      {/* Tab 1: Catalog */}
      {activeTab === 'catalog' && (
        <DataTable
          title="Master Data Domain Catalog"
          subtitle="Enterprise single source of truth (SSOT) registries with dedicated governance stewards"
          data={mdmDefinitions}
          columns={catalogColumns}
          keyExtractor={item => item.id}
          searchPlaceholder="Search master domain, code, steward..."
          exportFileName="artify-mdm-catalog"
        />
      )}

      {/* Tab 2: Duplicate Rules */}
      {activeTab === 'duplicates' && (
        <DataTable
          title="Fuzzy Deduplication & Collision Prevention Rules"
          subtitle="Real-time matching rules preventing creation of duplicate customers, suppliers, and items"
          data={duplicateRules}
          columns={dupColumns}
          keyExtractor={item => item.id}
          onAddClick={() => setIsDupModalOpen(true)}
          addLabel="Add Duplicate Rule"
          searchPlaceholder="Search duplicate rule name, entity..."
          exportFileName="artify-duplicate-rules"
        />
      )}

      {/* Tab 3: Validations */}
      {activeTab === 'validations' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Attribute Validation Schemas</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Strict Regex, Range, and Format validations enforced across master record attributes
              </p>
            </div>
            <button
              onClick={() => setIsValModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Validation Rule</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {validationRules.map(vr => (
              <div key={vr.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50/60 dark:bg-slate-800/60 shadow-2xs space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300">{vr.fieldName}</span>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">{vr.entityType}</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-200 text-[10px] font-mono font-bold">
                    {vr.ruleType}
                  </span>
                </div>

                <div className="text-xs space-y-1.5">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2 rounded font-mono text-[11px] text-slate-800 dark:text-slate-200 truncate">
                    Expression: {vr.ruleExpression}
                  </div>
                  <div className="text-rose-700 dark:text-rose-300 font-medium text-[11px]">
                    Error Message: "{vr.errorMessage}"
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Approvals */}
      {activeTab === 'approvals' && (
        <DataTable
          title="Master Data Governance Approval Queue"
          subtitle="Pre-commitment validation queue for high-risk master data creations and modifications"
          data={mdmApprovals}
          columns={approvalColumns}
          keyExtractor={item => item.id}
          searchPlaceholder="Search record identifier, entity..."
          exportFileName="artify-mdm-approvals"
          actionRenderer={item => (
            item.status === 'Pending Review' ? (
              <div className="flex items-center justify-end gap-1.5">
                <button
                  onClick={() => processMdmApproval(item.id, 'Approved', 'Verified against official regulatory registry')}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold cursor-pointer shadow-2xs"
                >
                  Approve
                </button>
                <button
                  onClick={() => processMdmApproval(item.id, 'Rejected', 'Invalid tax documentation')}
                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-semibold cursor-pointer shadow-2xs"
                >
                  Reject
                </button>
              </div>
            ) : (
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Processed</span>
            )
          )}
        />
      )}

      {/* Modal: Duplicate Rule */}
      <FormModal
        isOpen={isDupModalOpen}
        onClose={() => setIsDupModalOpen(false)}
        title="Add Deduplication Rule"
        subtitle="Establish duplicate checking keys and collision policy"
        onSubmit={handleCreateDupRule}
        submitLabel="Save Rule"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Target Entity Domain</label>
            <select
              value={dupForm.entity}
              onChange={e => setDupForm({ ...dupForm, entity: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            >
              <option value="Customer Master">Customer Master</option>
              <option value="Vendor Master">Vendor Master</option>
              <option value="Item / Product Master">Item / Product Master</option>
              <option value="Chart of Accounts">Chart of Accounts</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Rule Name *</label>
            <input
              type="text"
              required
              value={dupForm.ruleName}
              onChange={e => setDupForm({ ...dupForm, ruleName: e.target.value })}
              placeholder="e.g. Exact Tax Registration Number Collision"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Similarity Threshold (%)</label>
            <input
              type="number"
              value={dupForm.thresholdScore}
              onChange={e => setDupForm({ ...dupForm, thresholdScore: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Collision Action</label>
            <select
              value={dupForm.action}
              onChange={e => setDupForm({ ...dupForm, action: e.target.value as any })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            >
              <option value="Block">Block Creation (Strict)</option>
              <option value="Warn">Warn User and Require Override Note</option>
              <option value="Merge Proposal">Create Merge Proposal for Data Steward</option>
            </select>
          </div>
        </div>
      </FormModal>

      {/* Modal: Validation Rule */}
      <FormModal
        isOpen={isValModalOpen}
        onClose={() => setIsValModalOpen(false)}
        title="Add Field Validation Schema"
        subtitle="Enforce format and syntax constraints on entity attributes"
        onSubmit={handleCreateValRule}
        submitLabel="Save Schema"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Master Entity Domain</label>
            <input
              type="text"
              value={valForm.entity}
              onChange={e => setValForm({ ...valForm, entity: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Field Name *</label>
            <input
              type="text"
              required
              value={valForm.fieldName}
              onChange={e => setValForm({ ...valForm, fieldName: e.target.value })}
              placeholder="e.g. taxRegistrationNumber"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Regex Expression *</label>
            <input
              type="text"
              required
              value={valForm.ruleExpression}
              onChange={e => setValForm({ ...valForm, ruleExpression: e.target.value })}
              placeholder="e.g. ^OM[0-9]{10}$"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Custom Error Message *</label>
            <input
              type="text"
              required
              value={valForm.errorMessage}
              onChange={e => setValForm({ ...valForm, errorMessage: e.target.value })}
              placeholder="e.g. Tax registration number must start with OM followed by 10 digits"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            />
          </div>
        </div>
      </FormModal>
    </div>
  );
};
