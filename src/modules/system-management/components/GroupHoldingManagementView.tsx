import React, { useState, useMemo } from 'react';
import {
  GitFork,
  Building2,
  Layers,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  History,
  FileText,
  Sparkles,
  Download,
  Share2,
  ShieldCheck,
  Building,
  ChevronRight,
  TrendingUp,
  Percent,
  Search,
  Filter,
  Eye,
  Upload,
  Info,
  Clock,
  ArrowRight,
  ExternalLink,
  Crown
} from 'lucide-react';
import { useSystemManagement } from '../services/systemManagementStore';
import { DataTable, ColumnDef } from './common/DataTable';
import { StatusBadge } from './common/StatusBadge';
import { MetricCard } from './common/MetricCard';
import { FormModal } from './common/FormModal';
import { GroupMaster, GroupMembership, RelationshipType, ControlType, GroupAttachment } from '../types';
import { confirmAction } from '@/src/components/common/Feedback';

export const GroupHoldingManagementView: React.FC = () => {
  const {
    companies,
    groups,
    groupMemberships,
    relationshipHistory,
    selectedGroupId,
    setSelectedGroupId,
    addGroup,
    updateGroup,
    archiveGroup,
    submitGroupForApproval,
    approveGroup,
    rejectGroup,
    toggleGroupStatus,
    addGroupAttachment,
    addGroupMember,
    updateGroupMember,
    removeGroupMember,
    checkCircularRelationship,
    checkDuplicateMembership,
    generateStructureExplanationAI,
    validateStructureWithAI,
    setBanner
  } = useSystemManagement();

  // Active sub-tab inside Group & Holding Management
  const [viewMode, setViewMode] = useState<'visual' | 'table' | 'history' | 'documents'>('visual');

  // Modal controls
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupMaster | null>(null);

  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<GroupMembership | null>(null);

  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
  const [approvalComments, setApprovalComments] = useState('');

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<{
    score: number;
    explanation: string;
    recommendations: string[];
    anomalies: string[];
  } | null>(null);

  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);

  // Group Form state
  const [groupForm, setGroupForm] = useState<{
    code: string;
    name: string;
    shortName: string;
    groupType: GroupMaster['groupType'];
    parentCompanyId: string;
    currency: string;
    description: string;
    effectiveFrom: string;
    consolidationMethod: NonNullable<GroupMaster['consolidationMethod']>;
    fiscalYearStartMonth: number;
  }>({
    code: '',
    name: '',
    shortName: '',
    groupType: 'Holding Group',
    parentCompanyId: companies[0]?.id || 'comp-1',
    currency: 'OMR',
    description: '',
    effectiveFrom: new Date().toISOString().split('T')[0],
    consolidationMethod: 'Full Consolidation (IFRS 10)',
    fiscalYearStartMonth: 1
  });

  // Member Form state
  const [memberForm, setMemberForm] = useState<{
    companyId: string;
    relationshipType: RelationshipType;
    ownershipPercentage: number;
    votingPercentage: number;
    acquisitionDate: string;
    effectiveFrom: string;
    controlType: ControlType;
    consolidationTreatment: 'Consolidated' | 'Equity Accounting' | 'Fair Value' | 'Exempt';
    notes: string;
    status: 'Active' | 'Draft' | 'Pending Approval' | 'Inactive';
  }>({
    companyId: companies[1]?.id || companies[0]?.id || '',
    relationshipType: 'Subsidiary',
    ownershipPercentage: 100,
    votingPercentage: 100,
    acquisitionDate: new Date().toISOString().split('T')[0],
    effectiveFrom: new Date().toISOString().split('T')[0],
    controlType: 'Direct Control (>50%)',
    consolidationTreatment: 'Consolidated',
    notes: '',
    status: 'Active'
  });

  // Attachment form state
  const [attachmentForm, setAttachmentForm] = useState<{
    name: string;
    category: GroupAttachment['category'];
    size: string;
    type: string;
  }>({
    name: '',
    category: 'Articles of Association',
    size: '2.4 MB',
    type: 'application/pdf'
  });

  // Selected Group details
  const activeGroup: GroupMaster = useMemo(() => {
    return groups.find(g => g.id === selectedGroupId) || groups[0] || {
      id: 'grp-1',
      code: 'GRP-ARTIFY',
      name: 'Artify Enterprise Conglomerate Group',
      shortName: 'Artify Group',
      groupType: 'Holding Group',
      parentCompanyId: 'comp-1',
      currency: 'OMR',
      description: 'Default Group',
      status: 'Active',
      effectiveFrom: '2020-01-01',
      version: 1,
      createdAt: '2020-01-01',
      createdBy: 'usr-admin',
      updatedAt: '2026-08-01',
      updatedBy: 'usr-admin'
    };
  }, [groups, selectedGroupId]);

  // Current Group Memberships
  const activeMemberships = useMemo(() => {
    return groupMemberships.filter(m => m.groupId === activeGroup.id && m.status !== 'Archived');
  }, [groupMemberships, activeGroup.id]);

  // Parent Company of Active Group
  const parentCompany = useMemo(() => {
    return companies.find(c => c.id === activeGroup.parentCompanyId) || companies[0];
  }, [companies, activeGroup.parentCompanyId]);

  // Relationship history for active group
  const activeHistory = useMemo(() => {
    return relationshipHistory.filter(h => h.groupId === activeGroup.id);
  }, [relationshipHistory, activeGroup.id]);

  // Real-time validation warning for circular checks in member modal
  const circularCheckResult = useMemo(() => {
    if (!isMemberModalOpen || !memberForm.companyId || !activeGroup.parentCompanyId) {
      return { isCircular: false, path: [] as string[] };
    }
    return checkCircularRelationship(
      activeGroup.parentCompanyId,
      memberForm.companyId,
      editingMember ? editingMember.id : undefined
    );
  }, [isMemberModalOpen, memberForm.companyId, activeGroup.parentCompanyId, editingMember, checkCircularRelationship]);

  // Open Group Modal for Create
  const handleOpenCreateGroup = () => {
    setEditingGroup(null);
    setGroupForm({
      code: `GRP-${Date.now().toString().slice(-3)}`,
      name: '',
      shortName: '',
      groupType: 'Holding Group',
      parentCompanyId: companies[0]?.id || 'comp-1',
      currency: 'OMR',
      description: '',
      effectiveFrom: new Date().toISOString().split('T')[0],
      consolidationMethod: 'Full Consolidation (IFRS 10)',
      fiscalYearStartMonth: 1
    });
    setIsGroupModalOpen(true);
  };

  // Open Group Modal for Edit
  const handleOpenEditGroup = (group: GroupMaster) => {
    setEditingGroup(group);
    setGroupForm({
      code: group.code,
      name: group.name,
      shortName: group.shortName || group.name,
      groupType: group.groupType,
      parentCompanyId: group.parentCompanyId,
      currency: group.currency,
      description: group.description,
      effectiveFrom: group.effectiveFrom,
      consolidationMethod: group.consolidationMethod || 'Full Consolidation (IFRS 10)',
      fiscalYearStartMonth: group.fiscalYearStartMonth || 1
    });
    setIsGroupModalOpen(true);
  };

  // Save Group
  const handleSaveGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupForm.code || !groupForm.name) {
      setBanner('Group code and name are required.', 'error');
      return;
    }

    if (editingGroup) {
      const res = updateGroup(editingGroup.id, groupForm);
      if (res.success) {
        setIsGroupModalOpen(false);
      } else {
        setBanner(res.error || 'Failed to update group.', 'error');
      }
    } else {
      const res = addGroup({
        ...groupForm,
        status: 'Draft'
      });
      if (res.success) {
        setIsGroupModalOpen(false);
      } else {
        setBanner(res.error || 'Failed to create group.', 'error');
      }
    }
  };

  // Open Member Modal for Add
  const handleOpenAddMember = () => {
    setEditingMember(null);
    // Suggest first unassigned company
    const unassigned = companies.find(c => !activeMemberships.some(m => m.companyId === c.id));
    const targetCompId = unassigned ? unassigned.id : (companies[1]?.id || companies[0]?.id || '');

    setMemberForm({
      companyId: targetCompId,
      relationshipType: 'Subsidiary',
      ownershipPercentage: 100,
      votingPercentage: 100,
      acquisitionDate: new Date().toISOString().split('T')[0],
      effectiveFrom: new Date().toISOString().split('T')[0],
      controlType: 'Direct Control (>50%)',
      consolidationTreatment: 'Consolidated',
      notes: '',
      status: 'Active'
    });
    setIsMemberModalOpen(true);
  };

  // Open Member Modal for Edit
  const handleOpenEditMember = (member: GroupMembership) => {
    setEditingMember(member);
    setMemberForm({
      companyId: member.companyId,
      relationshipType: member.relationshipType,
      ownershipPercentage: member.ownershipPercentage,
      votingPercentage: member.votingPercentage,
      acquisitionDate: member.acquisitionDate,
      effectiveFrom: member.effectiveFrom,
      controlType: member.controlType,
      consolidationTreatment: member.consolidationTreatment,
      notes: member.notes || '',
      status: member.status
    });
    setIsMemberModalOpen(true);
  };

  // Save Member
  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (circularCheckResult.isCircular) {
      setBanner(circularCheckResult.message || 'Circular ownership detected. Cannot save.', 'error');
      return;
    }

    if (editingMember) {
      const res = updateGroupMember(
        editingMember.id,
        memberForm,
        memberForm.notes || 'Shareholding percentage / classification adjusted in governance console.'
      );
      if (res.success) {
        setIsMemberModalOpen(false);
      } else {
        setBanner(res.error || 'Failed to update member.', 'error');
      }
    } else {
      const res = addGroupMember({
        ...memberForm,
        groupId: activeGroup.id
      });
      if (res.success) {
        setIsMemberModalOpen(false);
      } else {
        setBanner(res.error || 'Failed to add member entity.', 'error');
      }
    }
  };

  // Handle Board Approval Trigger
  const handleTriggerApprovalFlow = (action: 'approve' | 'reject') => {
    setApprovalAction(action);
    setApprovalComments('');
    setIsApprovalModalOpen(true);
  };

  // Submit Approval / Rejection
  const handleSubmitApprovalDecision = () => {
    const approver = { id: 'usr-exec-cfo', name: 'Eng. Salim Al-Rawahi (Board & CFO)', role: 'Executive Approver' };
    if (approvalAction === 'approve') {
      const res = approveGroup(activeGroup.id, approver, approvalComments);
      if (res.success) {
        setIsApprovalModalOpen(false);
      } else {
        setBanner(res.error || 'Approval rejected by Segregation of Duties policy.', 'error');
      }
    } else {
      const res = rejectGroup(activeGroup.id, approver, approvalComments || 'Returned for structure and shareholding revision.');
      if (res.success) {
        setIsApprovalModalOpen(false);
      } else {
        setBanner(res.error || 'Failed to reject group.', 'error');
      }
    }
  };

  // Run AI Governance Analysis
  const handleRunAiAnalysis = async () => {
    setAiLoading(true);
    setIsAiModalOpen(true);
    try {
      const diag = await validateStructureWithAI(activeGroup.id);
      const explanation = await generateStructureExplanationAI(activeGroup.id);
      setAiAnalysisResult({
        score: diag.score,
        explanation,
        recommendations: diag.recommendations,
        anomalies: diag.anomalies
      });
    } catch (err) {
      setBanner('AI Analysis service timed out.', 'error');
    } finally {
      setAiLoading(false);
    }
  };

  // Save Attachment
  const handleSaveAttachment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attachmentForm.name) return;
    addGroupAttachment(activeGroup.id, {
      name: attachmentForm.name.endsWith('.pdf') ? attachmentForm.name : `${attachmentForm.name}.pdf`,
      type: attachmentForm.type,
      size: attachmentForm.size,
      uploadedBy: 'Corporate Secretariat',
      category: attachmentForm.category
    });
    setIsAttachmentModalOpen(false);
    setAttachmentForm({
      name: '',
      category: 'Articles of Association',
      size: '2.4 MB',
      type: 'application/pdf'
    });
  };

  // Export Consolidation Structure
  const handleExportTree = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      group: activeGroup,
      members: activeMemberships,
      history: activeHistory,
      exportedAt: new Date().toISOString()
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Consolidation_Tree_${activeGroup.code}_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setBanner(`Consolidation Tree for "${activeGroup.name}" exported successfully.`);
  };

  // Table Column Definitions for Memberships
  const memberColumns: ColumnDef<GroupMembership>[] = [
    {
      key: 'companyCode',
      header: 'Entity Code',
      accessor: item => (
        <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50/70 dark:bg-indigo-500/70 px-2 py-0.5 rounded border border-indigo-200/60">
          {item.companyCode || 'COMP'}
        </span>
      )
    },
    {
      key: 'companyName',
      header: 'Legal Entity Name',
      accessor: item => {
        const comp = companies.find(c => c.id === item.companyId);
        return (
          <div>
            <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              {item.companyName || comp?.legalName || item.companyId}
              {item.relationshipType === 'Parent' && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-500/30">
                  <Crown className="w-3 h-3" /> Apex Parent
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
              <span>{comp?.country || 'GCC Jurisdiction'}</span>
              <span>•</span>
              <span>TRN: {comp?.taxNumber || 'OM-VAT-100293'}</span>
            </div>
          </div>
        );
      }
    },
    {
      key: 'relationshipType',
      header: 'Classification',
      accessor: item => <StatusBadge status={item.relationshipType} />
    },
    {
      key: 'ownershipPercentage',
      header: 'Equity Ownership',
      accessor: item => (
        <div className="space-y-1 min-w-[120px]">
          <div className="flex justify-between text-xs font-bold text-slate-900 dark:text-slate-100">
            <span>{item.ownershipPercentage.toFixed(1)}%</span>
            <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
              {item.ownershipPercentage === 100 ? 'Wholly Owned' : item.ownershipPercentage >= 50 ? 'Majority' : 'Minority'}
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                item.ownershipPercentage === 100
                  ? 'bg-emerald-500'
                  : item.ownershipPercentage >= 50
                  ? 'bg-indigo-500'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${item.ownershipPercentage}%` }}
            />
          </div>
        </div>
      )
    },
    {
      key: 'votingPercentage',
      header: 'Voting Rights',
      accessor: item => (
        <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200 text-xs">
          <span>{item.votingPercentage.toFixed(1)}%</span>
          {item.votingPercentage !== item.ownershipPercentage && (
            <span className="text-[10px] bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-200 px-1 py-0.2 rounded font-mono" title="Dual-class share variance">
              Dual-Class
            </span>
          )}
        </div>
      )
    },
    {
      key: 'controlType',
      header: 'Control Mechanism',
      accessor: item => (
        <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
          {item.controlType}
        </span>
      )
    },
    {
      key: 'consolidationTreatment',
      header: 'IFRS Treatment',
      accessor: item => (
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          {item.consolidationTreatment}
        </span>
      )
    },
    {
      key: 'effectiveFrom',
      header: 'Acquisition / Effective',
      accessor: item => (
        <div className="text-xs text-slate-600 dark:text-slate-400">
          <div>{item.acquisitionDate}</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">Eff: {item.effectiveFrom}</div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      accessor: item => <StatusBadge status={item.status} />
    }
  ];

  // History Column Definitions
  const historyColumns: ColumnDef<any>[] = [
    {
      key: 'timestamp',
      header: 'Timestamp & Date',
      accessor: item => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs">{item.effectiveDate}</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{item.timestamp}</div>
        </div>
      )
    },
    {
      key: 'companyName',
      header: 'Target Legal Entity',
      accessor: item => (
        <div>
          <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300 text-xs mr-1.5">{item.companyCode}</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{item.companyName}</span>
        </div>
      )
    },
    {
      key: 'equityDelta',
      header: 'Shareholding Delta',
      accessor: item => {
        const delta = item.newOwnership - item.previousOwnership;
        return (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">{item.previousOwnership}%</span>
            <ArrowRight className="w-3 h-3 text-slate-500 dark:text-slate-400" />
            <span className="font-bold text-slate-900 dark:text-slate-100">{item.newOwnership}%</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                delta > 0
                  ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200'
                  : delta < 0
                  ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-200'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {delta > 0 ? `+${delta.toFixed(1)}%` : `${delta.toFixed(1)}%`}
            </span>
          </div>
        );
      }
    },
    {
      key: 'classification',
      header: 'Relationship Transition',
      accessor: item => (
        <div className="text-xs text-slate-700 dark:text-slate-300">
          <span className="text-slate-500 dark:text-slate-400 line-through mr-1">{item.previousRelationshipType}</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">{item.newRelationshipType}</span>
        </div>
      )
    },
    {
      key: 'changeReason',
      header: 'Change Reason & Reference',
      accessor: item => (
        <div>
          <div className="text-xs text-slate-800 dark:text-slate-200 font-medium">{item.changeReason}</div>
          {item.documentRef && (
            <div className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 mt-0.5">Ref: {item.documentRef}</div>
          )}
        </div>
      )
    },
    {
      key: 'changedBy',
      header: 'Authorized By',
      accessor: item => (
        <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
          {item.changedBy}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Corporate Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Corporate Groups Configured"
          value={groups.length}
          change={`${groups.filter(g => g.status === 'Active').length} Active`}
          isPositive={true}
          description="Multi-holding structures"
          icon={<GitFork className="w-5 h-5" />}
        />
        <MetricCard
          label="Consolidated Entities in Group"
          value={activeMemberships.length}
          status="positive"
          description={`Under ${activeGroup.shortName || activeGroup.name}`}
          icon={<Building2 className="w-5 h-5" />}
        />
        <MetricCard
          label="Apex Holding Entity"
          value={parentCompany?.code || 'N/A'}
          status="neutral"
          description={parentCompany?.legalName || 'Ultimate Parent Entity'}
          icon={<Crown className="w-5 h-5" />}
        />
        <MetricCard
          label="Consolidation Standard"
          value={activeGroup.currency}
          status="positive"
          description={activeGroup.consolidationMethod || 'Full Consolidation (IFRS 10)'}
          icon={<Percent className="w-5 h-5" />}
        />
      </div>

      {/* Group Selector & Header Information Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Group Switcher Tabs */}
          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Corporate Group</div>
            <div className="flex flex-wrap items-center gap-2">
              {groups.map(g => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGroupId(g.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedGroupId === g.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{g.shortName || g.name}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                    selectedGroupId === g.id ? 'bg-indigo-700/80 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {g.code}
                  </span>
                </button>
              ))}

              <button
                onClick={handleOpenCreateGroup}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Group</span>
              </button>
            </div>
          </div>

          {/* Action Control Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleRunAiAnalysis}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-purple-50 dark:bg-purple-500/10 hover:bg-purple-100 dark:hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Governance Diagnosis</span>
            </button>

            <button
              onClick={handleExportTree}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Structure</span>
            </button>

            <button
              onClick={handleOpenAddMember}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Member Entity</span>
            </button>
          </div>
        </div>

        {/* Selected Group Metadata Banner */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-100/70 dark:bg-indigo-500/70 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-500/30">
                {activeGroup.code}
              </span>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">{activeGroup.name}</h2>
              <StatusBadge status={activeGroup.status} />
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                Ver. {activeGroup.version || 1}.0
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-3xl">{activeGroup.description}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
              <span><strong>Parent Holding:</strong> {parentCompany?.legalName} ({parentCompany?.code})</span>
              <span>•</span>
              <span><strong>Base Consolidation Currency:</strong> {activeGroup.currency}</span>
              <span>•</span>
              <span><strong>Framework:</strong> {activeGroup.consolidationMethod || 'Full Consolidation (IFRS 10)'}</span>
              <span>•</span>
              <span><strong>Effective Since:</strong> {activeGroup.effectiveFrom}</span>
            </div>
          </div>

          {/* Workflow Status Controls */}
          <div className="flex items-center gap-2 self-start md:self-center">
            {activeGroup.status === 'Draft' && (
              <button
                onClick={() => {
                  const submitter = { id: 'usr-admin', name: 'Administrator', role: 'System Admin' };
                  const res = submitGroupForApproval(activeGroup.id, submitter);
                  if (!res.success) setBanner(res.error || 'Submission failed.', 'error');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-2xs transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Submit for Approval</span>
              </button>
            )}

            {activeGroup.status === 'Pending Approval' && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleTriggerApprovalFlow('approve')}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve</span>
                </button>
                <button
                  onClick={() => handleTriggerApprovalFlow('reject')}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-2xs transition-colors cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
              </div>
            )}

            <button
              onClick={() => handleOpenEditGroup(activeGroup)}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              title="Edit Group Master Attributes"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Sub-view Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 overflow-x-auto pb-1">
        <button
          onClick={() => setViewMode('visual')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            viewMode === 'visual'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <GitFork className="w-4 h-4" />
          <span>Interactive Hierarchy Tree</span>
        </button>

        <button
          onClick={() => setViewMode('table')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            viewMode === 'table'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Shareholding Master Table ({activeMemberships.length})</span>
        </button>

        <button
          onClick={() => setViewMode('history')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            viewMode === 'history'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Equity Change History ({activeHistory.length})</span>
        </button>

        <button
          onClick={() => setViewMode('documents')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            viewMode === 'documents'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Governance Documents ({activeGroup.attachments?.length || 0})</span>
        </button>
      </div>

      {/* VIEW 1: INTERACTIVE HIERARCHY TREE */}
      {viewMode === 'visual' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Multi-Tier Corporate Consolidation Graph</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Hierarchical shareholding relationships, voting powers, and statutory IFRS accounting treatments.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> 100% Wholly Owned
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> &gt;50% Subsidiary
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-500" /> 20-50% Associate
              </span>
            </div>
          </div>

          {/* Visual Org Graph Canvas */}
          <div className="p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-800/70 border border-slate-200/90 dark:border-slate-700/90 overflow-x-auto space-y-8 min-w-[700px]">
            {/* Level 0: Apex Parent Node */}
            <div className="flex flex-col items-center">
              <div className="relative group p-5 bg-white dark:bg-slate-900 rounded-2xl border-2 border-indigo-600 shadow-sm w-[380px] hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                      <Crown className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-extrabold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-500/30">
                          {parentCompany?.code}
                        </span>
                        <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-500/10 px-1.5 py-0.2 rounded border border-purple-200 dark:border-purple-500/30">
                          APEX HOLDING
                        </span>
                      </div>
                      <div className="font-extrabold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
                        {parentCompany?.legalName}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span>Jurisdiction: <strong>{parentCompany?.country}</strong></span>
                  <span>Currency: <strong>{parentCompany?.currency}</strong></span>
                  <StatusBadge status={parentCompany?.status || 'Active'} />
                </div>
              </div>

              {/* Vertical Branching Connector Line */}
              <div className="w-0.5 h-8 bg-indigo-300 my-1" />
              <div className="w-4/5 h-0.5 bg-indigo-200 dark:bg-indigo-500/30" />
            </div>

            {/* Level 1: Member Entities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
              {activeMemberships
                .filter(m => m.relationshipType !== 'Parent')
                .map(member => {
                  const comp = companies.find(c => c.id === member.companyId);
                  return (
                    <div
                      key={member.id}
                      className="relative p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-700/90 shadow-2xs hover:shadow-md transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-500/30">
                              {member.companyCode || comp?.code}
                            </span>
                            <StatusBadge status={member.relationshipType} />
                          </div>
                          <div className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-1">
                            {member.companyName || comp?.legalName}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {comp?.country} • {comp?.currency}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditMember(member)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
                            title="Adjust Shareholding"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={async () => {
                              if (await confirmAction(`Remove ${member.companyName} from group?`)) {
                                removeGroupMember(member.id, 'User removed from hierarchy view');
                              }
                            }}
                            className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                            title="Remove from Group"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Shareholding Progress Bar */}
                      <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-600 dark:text-slate-400 font-medium">Equity Ownership:</span>
                          <span className="font-extrabold text-slate-900 dark:text-slate-100">{member.ownershipPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              member.ownershipPercentage === 100
                                ? 'bg-emerald-500'
                                : member.ownershipPercentage >= 50
                                ? 'bg-indigo-500'
                                : 'bg-violet-500'
                            }`}
                            style={{ width: `${member.ownershipPercentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                          <span>Voting Rights: <strong>{member.votingPercentage.toFixed(1)}%</strong></span>
                          <span>Treatment: <strong>{member.consolidationTreatment}</strong></span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1">
                        <span>Control: {member.controlType}</span>
                        <StatusBadge status={member.status} />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: SHAREHOLDING MASTER DATATABLE */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Shareholding Register & Consolidation Schedule</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Detailed register of all entities assigned to {activeGroup.name}.
              </p>
            </div>
            <button
              onClick={handleOpenAddMember}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Member Entity</span>
            </button>
          </div>

          <DataTable
            data={activeMemberships}
            columns={memberColumns}
            keyExtractor={item => item.id}
            searchPlaceholder="Search legal entities by code, name, or jurisdiction..."
            actionRenderer={item => (
              <div className="flex items-center justify-end gap-1">
                <button
                  onClick={() => handleOpenEditMember(item)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
                  title="Edit Shareholding & Attributes"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                {item.relationshipType !== 'Parent' && (
                  <button
                    onClick={async () => {
                      if (await confirmAction(`Remove entity ${item.companyName} from group?`)) {
                        removeGroupMember(item.id, 'User removed from register');
                      }
                    }}
                    className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                    title="Remove from Group"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          />
        </div>
      )}

      {/* VIEW 3: EQUITY CHANGE HISTORY */}
      {viewMode === 'history' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Immutable Shareholding Audit Timeline</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Historical ledger of equity allocations, dilutions, divestments, and board resolution citations.
            </p>
          </div>

          <DataTable
            data={activeHistory}
            columns={historyColumns}
            keyExtractor={item => item.id}
            searchPlaceholder="Filter history by entity, change reason, or authorizer..."
          />
        </div>
      )}

      {/* VIEW 4: GOVERNANCE DOCUMENTS REPOSITORY */}
      {viewMode === 'documents' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Governance Charters & Regulatory Filings</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Official Shareholding Agreements, Articles of Association, and Ministry Commercial Gazette filings.
              </p>
            </div>
            <button
              onClick={() => setIsAttachmentModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Document</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(activeGroup.attachments || []).map(att => (
              <div
                key={att.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100 text-xs line-clamp-1">{att.name}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{att.category} • {att.size}</div>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex justify-between items-center">
                  <span>Uploaded: {att.uploadedAt}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer hover:underline">Download</span>
                </div>
              </div>
            ))}

            {(!activeGroup.attachments || activeGroup.attachments.length === 0) && (
              <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400 text-xs">
                No governance documents attached to this group yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: CREATE / EDIT CORPORATE GROUP                                    */}
      {/* ========================================================================= */}
      <FormModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        title={editingGroup ? `Edit Corporate Group: ${editingGroup.code}` : 'Register New Corporate Group'}
        onSubmit={handleSaveGroup}
        submitLabel={editingGroup ? 'Save Changes' : 'Create Group'}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Group Code *</label>
              <input
                type="text"
                value={groupForm.code}
                onChange={e => setGroupForm({ ...groupForm, code: e.target.value.toUpperCase() })}
                placeholder="e.g. GRP-HOLDINGS"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Group Structure Type</label>
              <select
                value={groupForm.groupType}
                onChange={e => setGroupForm({ ...groupForm, groupType: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Holding Group">Holding Group</option>
                <option value="Corporate Group">Corporate Group</option>
                <option value="Investment Group">Investment Group</option>
                <option value="Parent-Subsidiary Group">Parent-Subsidiary Group</option>
                <option value="Consolidation Group">Consolidation Group</option>
                <option value="Other Group">Other Group</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Legal Group Name *</label>
              <input
                type="text"
                value={groupForm.name}
                onChange={e => setGroupForm({ ...groupForm, name: e.target.value })}
                placeholder="e.g. Artify Enterprise Conglomerate Group"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Short / Display Name</label>
              <input
                type="text"
                value={groupForm.shortName}
                onChange={e => setGroupForm({ ...groupForm, shortName: e.target.value })}
                placeholder="e.g. Artify Group"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Apex Holding Entity (Company Master) *
              </label>
              <select
                value={groupForm.parentCompanyId}
                onChange={e => setGroupForm({ ...groupForm, parentCompanyId: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                {companies.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.legalName} ({c.country})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Base Consolidation Currency *</label>
              <select
                value={groupForm.currency}
                onChange={e => setGroupForm({ ...groupForm, currency: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
              >
                <option value="OMR">OMR — Omani Rial</option>
                <option value="AED">AED — UAE Dirham</option>
                <option value="SAR">SAR — Saudi Riyal</option>
                <option value="USD">USD — US Dollar</option>
                <option value="EUR">EUR — Euro</option>
                <option value="GBP">GBP — British Pound</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Consolidation Standard</label>
              <select
                value={groupForm.consolidationMethod}
                onChange={e => setGroupForm({ ...groupForm, consolidationMethod: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Full Consolidation (IFRS 10)">Full Consolidation (IFRS 10)</option>
                <option value="Proportional Consolidation">Proportional Consolidation</option>
                <option value="Equity Method (IAS 28)">Equity Method (IAS 28)</option>
                <option value="Cost Method (IFRS 9)">Cost Method (IFRS 9)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Effective Foundation Date</label>
              <input
                type="date"
                value={groupForm.effectiveFrom}
                onChange={e => setGroupForm({ ...groupForm, effectiveFrom: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Group Charter & Governance Scope</label>
            <textarea
              value={groupForm.description}
              onChange={e => setGroupForm({ ...groupForm, description: e.target.value })}
              rows={3}
              placeholder="Describe strategic holding purpose, cross-border consolidation scope, or board charter notes..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </FormModal>

      {/* ========================================================================= */}
      {/* MODAL 2: ADD / EDIT GROUP MEMBER & SHAREHOLDING                           */}
      {/* ========================================================================= */}
      <FormModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        title={editingMember ? `Adjust Shareholding: ${editingMember.companyCode}` : 'Induct Entity to Corporate Group'}
        onSubmit={handleSaveMember}
        submitLabel={editingMember ? 'Update Shareholding' : 'Add Entity'}
      >
        <div className="space-y-4">
          {/* Real-time Circular Reference Warning Banner */}
          {circularCheckResult.isCircular && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Circular Ownership Violation Detected:</strong>
                <span>{circularCheckResult.message}</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Legal Entity (Authoritative Master) *</label>
            <select
              value={memberForm.companyId}
              onChange={e => setMemberForm({ ...memberForm, companyId: e.target.value })}
              disabled={!!editingMember}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 dark:disabled:bg-slate-800"
              required
            >
              {companies.map(c => {
                const isCurrentParent = activeGroup.parentCompanyId === c.id;
                const isAlreadyMember = activeMemberships.some(m => m.companyId === c.id && (!editingMember || editingMember.companyId !== c.id));
                return (
                  <option key={c.id} value={c.id} disabled={isAlreadyMember}>
                    {c.code} — {c.legalName} ({c.country}) {isCurrentParent ? '(Current Parent)' : ''} {isAlreadyMember ? '(Already in group)' : ''}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Relationship Classification *</label>
              <select
                value={memberForm.relationshipType}
                onChange={e => {
                  const rel = e.target.value as RelationshipType;
                  let defOwnership = memberForm.ownershipPercentage;
                  let defTreatment = memberForm.consolidationTreatment;
                  let defControl = memberForm.controlType;

                  if (rel === 'Wholly Owned Subsidiary') {
                    defOwnership = 100;
                    defTreatment = 'Consolidated';
                    defControl = 'Wholly Owned (100%)';
                  } else if (rel === 'Associate') {
                    defOwnership = 35;
                    defTreatment = 'Equity Accounting';
                    defControl = 'Significant Influence (20-50%)';
                  } else if (rel === 'Joint Venture') {
                    defOwnership = 50;
                    defTreatment = 'Equity Accounting';
                    defControl = 'Joint Control (50/50)';
                  }

                  setMemberForm({
                    ...memberForm,
                    relationshipType: rel,
                    ownershipPercentage: defOwnership,
                    votingPercentage: defOwnership,
                    consolidationTreatment: defTreatment,
                    controlType: defControl
                  });
                }}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Subsidiary">Subsidiary (&gt;50% Direct Control)</option>
                <option value="Wholly Owned Subsidiary">Wholly Owned Subsidiary (100%)</option>
                <option value="Associate">Associate (20-50% Significant Influence)</option>
                <option value="Joint Venture">Joint Venture (50/50 Joint Control)</option>
                <option value="Affiliate">Affiliate / Related Party</option>
                <option value="Investment">Investment (&lt;20% Fair Value)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Control Mechanism</label>
              <select
                value={memberForm.controlType}
                onChange={e => setMemberForm({ ...memberForm, controlType: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Direct Control (>50%)">Direct Control (&gt;50%)</option>
                <option value="Wholly Owned (100%)">Wholly Owned (100%)</option>
                <option value="Joint Control (50/50)">Joint Control (50/50)</option>
                <option value="Significant Influence (20-50%)">Significant Influence (20-50%)</option>
                <option value="Minority Interest (<20%)">Minority Interest (&lt;20%)</option>
                <option value="Statutory Control">Statutory Control</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Equity Ownership % (0.00 – 100.00) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={memberForm.ownershipPercentage}
                onChange={e => setMemberForm({ ...memberForm, ownershipPercentage: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Voting Rights % (Dual-Class Stock Check) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={memberForm.votingPercentage}
                onChange={e => setMemberForm({ ...memberForm, votingPercentage: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">IFRS Consolidation Accounting</label>
              <select
                value={memberForm.consolidationTreatment}
                onChange={e => setMemberForm({ ...memberForm, consolidationTreatment: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Consolidated">Consolidated (Line-by-line IFRS 10)</option>
                <option value="Equity Accounting">Equity Accounting (IAS 28)</option>
                <option value="Fair Value">Fair Value (IFRS 9)</option>
                <option value="Exempt">Exempt / Non-Operating</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Acquisition / Effective Date</label>
              <input
                type="date"
                value={memberForm.acquisitionDate}
                onChange={e => setMemberForm({ ...memberForm, acquisitionDate: e.target.value, effectiveFrom: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Shareholding Notes / Change Justification
            </label>
            <textarea
              value={memberForm.notes}
              onChange={e => setMemberForm({ ...memberForm, notes: e.target.value })}
              rows={2}
              placeholder="Cite board resolution, commercial registry amendment, or strategic rationale..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </FormModal>

      {/* ========================================================================= */}
      {/* MODAL 3: BOARD GOVERNANCE APPROVAL & SOD ENFORCEMENT                     */}
      {/* ========================================================================= */}
      <FormModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        title={approvalAction === 'approve' ? 'Board Governance Approval' : 'Reject Group Submission'}
        onSubmit={e => {
          e.preventDefault();
          handleSubmitApprovalDecision();
        }}
        submitLabel={approvalAction === 'approve' ? 'Confirm & Activate Group' : 'Return to Draft'}
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
            <div className="font-bold text-slate-900 dark:text-slate-100">Governance & SoD Verification:</div>
            <div className="text-slate-600 dark:text-slate-400">
              • Submitting Officer: <strong>{activeGroup.submittedBy || 'Administrator'}</strong>
            </div>
            <div className="text-slate-600 dark:text-slate-400">
              • Approving Officer: <strong>Eng. Salim Al-Rawahi (CFO & Board Trustee)</strong>
            </div>
            <div className="text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Segregation of Duties (SoD) check passed: Creator and Approver are distinct principals.</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {approvalAction === 'approve' ? 'Approval Comments / Board Minutes Ref' : 'Rejection Reason *'}
            </label>
            <textarea
              value={approvalComments}
              onChange={e => setApprovalComments(e.target.value)}
              rows={3}
              placeholder={approvalAction === 'approve' ? 'Approved in compliance with GCC Commercial Companies Law and IFRS 10.' : 'Specify required adjustments...'}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required={approvalAction === 'reject'}
            />
          </div>
        </div>
      </FormModal>

      {/* ========================================================================= */}
      {/* MODAL 4: AI GOVERNANCE DIAGNOSIS & EXECUTIVE BRIEFING                    */}
      {/* ========================================================================= */}
      <FormModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        title="AI Group Structure & Consolidation Diagnosis"
        onSubmit={e => {
          e.preventDefault();
          setIsAiModalOpen(false);
        }}
        submitLabel="Acknowledge Briefing"
      >
        <div className="space-y-4">
          {aiLoading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Auditing corporate graph against IFRS 10 and regional regulations...</p>
            </div>
          ) : aiAnalysisResult ? (
            <div className="space-y-4">
              {/* Score Card */}
              <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-purple-900 dark:text-purple-100">Governance & Consolidation Health Score</div>
                  <div className="text-[11px] text-purple-700 dark:text-purple-300 mt-0.5">Automated algorithmic analysis of group hierarchy</div>
                </div>
                <div className="text-2xl font-extrabold text-purple-800 dark:text-purple-200">
                  {aiAnalysisResult.score}%
                </div>
              </div>

              {/* Natural Language Executive Briefing */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                {aiAnalysisResult.explanation}
              </div>

              {/* Recommendations */}
              {aiAnalysisResult.recommendations.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Recommended Governance Actions:</div>
                  <ul className="space-y-1">
                    {aiAnalysisResult.recommendations.map((rec, i) => (
                      <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </FormModal>

      {/* ========================================================================= */}
      {/* MODAL 5: UPLOAD GOVERNANCE DOCUMENT                                       */}
      {/* ========================================================================= */}
      <FormModal
        isOpen={isAttachmentModalOpen}
        onClose={() => setIsAttachmentModalOpen(false)}
        title="Upload Corporate Governance Filing"
        onSubmit={handleSaveAttachment}
        submitLabel="Attach Document"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Document Title / File Name *</label>
            <input
              type="text"
              value={attachmentForm.name}
              onChange={e => setAttachmentForm({ ...attachmentForm, name: e.target.value })}
              placeholder="e.g. Artify_Holding_Shareholder_Pact_2026.pdf"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Document Classification *</label>
            <select
              value={attachmentForm.category}
              onChange={e => setAttachmentForm({ ...attachmentForm, category: e.target.value as any })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Articles of Association">Articles of Association</option>
              <option value="Shareholding Agreement">Shareholding Agreement</option>
              <option value="Commercial Registry">Commercial Registry / Gazette Notice</option>
              <option value="Tax Clearance">Tax Clearance / Group TRN Certificate</option>
              <option value="Board Resolution">Board Resolution Minutes</option>
              <option value="Other">Other Regulatory Document</option>
            </select>
          </div>
        </div>
      </FormModal>
    </div>
  );
};
