import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Company,
  CurrencyDefinition,
  CompanyAttachment,
  CompanyHistoryRecord,
  CompanyGroup,
  GroupMaster,
  GroupMembership,
  RelationshipHistoryRecord,
  GroupAttachment,
  Branch,
  Department,
  Location,
  OperatingUnit,
  UserAccount,
  UserRoleDefinition,
  UserGroup,
  SoDRule,
  AccessRestriction,
  ApprovalWorkflow,
  ApprovalMatrixRule,
  DelegationOfAuthority,
  ApprovalLimit,
  EscalationRule,
  FiscalYear,
  PostingPeriod,
  DocumentSequence,
  PostingControl,
  PeriodLockRecord,
  MasterDataDefinition,
  DuplicateRule,
  ValidationRule,
  MasterDataApprovalRequest,
  NotificationTemplate,
  NotificationRule,
  SystemAlertItem,
  AuditEvent,
  LoginHistoryEvent,
  ApiClient,
  ExternalIntegration,
  IntegrationLog,
  BackupConfiguration,
  RestorePoint,
  DisasterRecoveryStatus,
  SecurityPolicy,
  PasswordPolicy,
  ActiveSession,
  SecurityEvent
} from '../types';

import {
  INITIAL_COMPANIES,
  INITIAL_CURRENCIES,
  INITIAL_COMPANY_GROUP,
  INITIAL_GROUPS,
  INITIAL_GROUP_MEMBERSHIPS,
  INITIAL_RELATIONSHIP_HISTORY,
  INITIAL_BRANCHES,
  INITIAL_DEPARTMENTS,
  INITIAL_LOCATIONS,
  INITIAL_OPERATING_UNITS,
  INITIAL_USERS,
  INITIAL_USER_GROUPS,
  INITIAL_SOD_RULES,
  INITIAL_ACCESS_RESTRICTIONS,
  INITIAL_WORKFLOWS,
  INITIAL_APPROVAL_MATRICES,
  INITIAL_DELEGATIONS,
  INITIAL_APPROVAL_LIMITS,
  INITIAL_ESCALATION_RULES,
  INITIAL_FISCAL_YEARS,
  INITIAL_POSTING_PERIODS,
  INITIAL_DOC_SEQUENCES,
  INITIAL_POSTING_CONTROLS,
  INITIAL_PERIOD_LOCKS,
  INITIAL_MDM_DEFINITIONS,
  INITIAL_DUPLICATE_RULES,
  INITIAL_VALIDATION_RULES,
  INITIAL_MDM_APPROVALS,
  INITIAL_NOTIF_TEMPLATES,
  INITIAL_NOTIF_RULES,
  INITIAL_ALERTS,
  INITIAL_AUDIT_TRAIL,
  INITIAL_LOGIN_HISTORY,
  INITIAL_API_CLIENTS,
  INITIAL_INTEGRATIONS,
  INITIAL_INTEGRATION_LOGS,
  INITIAL_BACKUP_CONFIG,
  INITIAL_RESTORE_POINTS,
  INITIAL_DR_STATUS,
  INITIAL_SECURITY_POLICIES,
  INITIAL_PASSWORD_POLICY,
  INITIAL_ACTIVE_SESSIONS,
  INITIAL_SECURITY_EVENTS
} from '../config/initialData';
import { mockRandom } from '@/src/utils/mockRandom';

interface SystemManagementContextType {
  // 01.01 Org & 01.01.02 Group / Holding Master Data
  companies: Company[];
  currencies: CurrencyDefinition[];
  groups: GroupMaster[];
  groupMemberships: GroupMembership[];
  relationshipHistory: RelationshipHistoryRecord[];
  companyGroup: CompanyGroup;
  selectedGroupId: string;
  setSelectedGroupId: (id: string) => void;
  branches: Branch[];
  departments: Department[];
  locations: Location[];
  operatingUnits: OperatingUnit[];

  addCurrency: (currency: Omit<CurrencyDefinition, 'id'>) => { success: boolean; id?: string; error?: string };
  updateCurrency: (id: string, patch: Partial<CurrencyDefinition>) => { success: boolean; error?: string };

  addCompany: (comp: Partial<Omit<Company, 'id' | 'createdAt' | 'updatedAt' | 'version'>>, user?: { id: string; name: string; role?: string }) => { success: boolean; id?: string; error?: string };
  updateCompany: (id: string, comp: Partial<Company>, reason?: string, user?: { id: string; name: string; role?: string }) => { success: boolean; error?: string };
  archiveCompany: (id: string, user?: { id: string; name: string }) => { success: boolean; error?: string };
  submitCompanyForApproval: (id: string, user: { id: string; name: string; role: string }) => { success: boolean; error?: string };
  approveCompany: (id: string, approver: { id: string; name: string; role: string }, comments?: string) => { success: boolean; error?: string };
  rejectCompany: (id: string, rejector: { id: string; name: string; role: string }, reason: string) => { success: boolean; error?: string };
  toggleCompanyStatus: (id: string, newStatus: Company['status'], user?: { id: string; name: string }) => { success: boolean; error?: string };
  addCompanyAttachment: (companyId: string, attachment: Omit<CompanyAttachment, 'id' | 'uploadedAt'>, user?: { id: string; name: string }) => { success: boolean; error?: string };
  removeCompanyAttachment: (companyId: string, attachmentId: string, user?: { id: string; name: string }) => { success: boolean; error?: string };
  checkDuplicateCompany: (field: 'code' | 'taxNumber' | 'registrationNumber' | 'legalName', value: string, excludeCompanyId?: string) => { isDuplicate: boolean; matchedCompany?: Company };
  extractCompanyWithAI: (rawTextOrDocument: string) => Promise<Partial<Company>>;
  generateCompanyProfileSummaryAI: (companyId: string) => Promise<string>;

  // 01.01.02 Group / Holding Company Operations
  addGroup: (group: Partial<Omit<GroupMaster, 'id' | 'createdAt' | 'updatedAt' | 'version'>>, user?: { id: string; name: string; role?: string }) => { success: boolean; id?: string; error?: string };
  updateGroup: (id: string, patch: Partial<GroupMaster>, user?: { id: string; name: string }) => { success: boolean; error?: string };
  archiveGroup: (id: string, user?: { id: string; name: string }) => { success: boolean; error?: string };
  submitGroupForApproval: (id: string, user: { id: string; name: string; role: string }) => { success: boolean; error?: string };
  approveGroup: (id: string, approver: { id: string; name: string; role: string }, comments?: string) => { success: boolean; error?: string };
  rejectGroup: (id: string, rejector: { id: string; name: string; role: string }, reason: string) => { success: boolean; error?: string };
  toggleGroupStatus: (id: string, newStatus: GroupMaster['status']) => void;
  addGroupAttachment: (groupId: string, attachment: Omit<GroupAttachment, 'id' | 'uploadedAt'>) => void;

  // Group Memberships
  addGroupMember: (member: Partial<Omit<GroupMembership, 'id' | 'createdAt' | 'updatedAt' | 'version'>>, user?: { id: string; name: string }) => { success: boolean; id?: string; error?: string };
  updateGroupMember: (id: string, patch: Partial<GroupMembership>, reason?: string, changedBy?: string) => { success: boolean; error?: string };
  removeGroupMember: (id: string, reason?: string, removedBy?: string) => { success: boolean; error?: string };

  // Validation & Graph Analysis
  checkCircularRelationship: (parentCompanyId: string, targetCompanyId: string, excludeMembershipId?: string) => { isCircular: boolean; path: string[]; message?: string };
  checkDuplicateMembership: (groupId: string, companyId: string, excludeMembershipId?: string) => boolean;

  // AI Assistance for Corporate Structures
  extractCorporateStructureWithAI: (docTextOrMetadata: string) => Promise<any>;
  generateStructureExplanationAI: (groupId: string) => Promise<string>;
  validateStructureWithAI: (groupId: string) => Promise<{ score: number; recommendations: string[]; anomalies: string[] }>;

  addBranch: (br: Partial<Omit<Branch, 'id' | 'createdAt'>>) => void;
  updateBranch: (id: string, br: Partial<Branch>) => void;
  addDepartment: (dept: Partial<Omit<Department, 'id'>>) => void;
  updateDepartment: (id: string, dept: Partial<Department>) => void;
  addLocation: (loc: Omit<Location, 'id'>) => void;
  updateLocation: (id: string, loc: Partial<Location>) => void;
  addOperatingUnit: (ou: Partial<Omit<OperatingUnit, 'id'>>) => void;
  updateOperatingUnit: (id: string, ou: Partial<OperatingUnit>) => void;

  // 01.02 User & Access
  users: UserAccount[];
  userGroups: UserGroup[];
  sodRules: SoDRule[];
  accessRestrictions: AccessRestriction[];
  addUser: (usr: Partial<Omit<UserAccount, 'id' | 'createdAt'>>) => void;
  updateUser: (id: string, usr: Partial<UserAccount>) => void;
  toggleUserLock: (id: string) => void;
  resetUserPassword: (id: string) => void;
  addUserGroup: (grp: Omit<UserGroup, 'id' | 'createdAt'>) => void;
  updateUserGroup: (id: string, grp: Partial<UserGroup>) => void;
  addSoDException: (ruleId: string, exception: { userId: string; userName: string; reason: string; expiresAt: string }) => void;
  toggleSoDRule: (ruleId: string) => void;
  addAccessRestriction: (ar: Partial<Omit<AccessRestriction, 'id'>>) => void;
  updateAccessRestriction: (id: string, ar: Partial<AccessRestriction>) => void;

  // 01.03 Workflow & Approval
  workflows: ApprovalWorkflow[];
  approvalMatrices: ApprovalMatrixRule[];
  delegations: DelegationOfAuthority[];
  approvalLimits: ApprovalLimit[];
  escalationRules: EscalationRule[];
  addWorkflow: (wf: Partial<Omit<ApprovalWorkflow, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  updateWorkflow: (id: string, wf: Partial<ApprovalWorkflow>) => void;
  addApprovalMatrixRule: (rule: Partial<Omit<ApprovalMatrixRule, 'id'>>) => void;
  updateApprovalMatrixRule: (id: string, rule: Partial<ApprovalMatrixRule>) => void;
  addDelegation: (del: Partial<Omit<DelegationOfAuthority, 'id'>>) => void;
  revokeDelegation: (id: string) => void;
  addApprovalLimit: (limit: Omit<ApprovalLimit, 'id'>) => void;
  updateApprovalLimit: (id: string, limit: Partial<ApprovalLimit>) => void;
  addEscalationRule: (rule: Partial<Omit<EscalationRule, 'id'>>) => void;
  updateEscalationRule: (id: string, rule: Partial<EscalationRule>) => void;

  // 01.04 Financial & Period Controls
  fiscalYears: FiscalYear[];
  postingPeriods: PostingPeriod[];
  documentSequences: DocumentSequence[];
  postingControls: PostingControl;
  periodLocks: PeriodLockRecord[];
  addFiscalYear: (fy: Omit<FiscalYear, 'id'>) => void;
  togglePostingPeriodSubLedger: (periodId: string, ledgerKey: 'gl' | 'ap' | 'ar' | 'inventory' | 'fixedAssets' | 'payroll', newStatus: 'Open' | 'Closed' | 'Locked') => void;
  lockOrUnlockPeriod: (periodId: string, action: 'lock' | 'unlock', reason: string) => void;
  addDocumentSequence: (seq: Partial<Omit<DocumentSequence, 'id'>>) => void;
  updateDocumentSequence: (id: string, seq: Partial<DocumentSequence>) => void;
  updatePostingControls: (ctrl: Partial<PostingControl>) => void;
  requestPeriodUnlock: (periodId: string, reason: string) => void;
  approvePeriodUnlock: (lockId: string, requestId: string) => void;

  // 01.05 Master Data Management
  mdmDefinitions: MasterDataDefinition[];
  duplicateRules: DuplicateRule[];
  validationRules: ValidationRule[];
  mdmApprovals: MasterDataApprovalRequest[];
  addDuplicateRule: (rule: Partial<Omit<DuplicateRule, 'id'>>) => void;
  updateDuplicateRule: (id: string, rule: Partial<DuplicateRule>) => void;
  addValidationRule: (rule: Partial<Omit<ValidationRule, 'id'>>) => void;
  updateValidationRule: (id: string, rule: Partial<ValidationRule>) => void;
  processMdmApproval: (id: string, action: 'Approved' | 'Rejected', comments?: string) => void;

  // 01.06 Notifications & Alerts
  notificationTemplates: NotificationTemplate[];
  notificationRules: NotificationRule[];
  alerts: SystemAlertItem[];
  markAlertAsRead: (id: string) => void;
  markAllAlertsAsRead: () => void;
  addNotificationTemplate: (tmpl: Partial<Omit<NotificationTemplate, 'id'>>) => void;
  updateNotificationTemplate: (id: string, tmpl: Partial<NotificationTemplate>) => void;

  // 01.07 Audit Trail & Monitoring
  auditTrail: AuditEvent[];
  loginHistory: LoginHistoryEvent[];
  logAuditEvent: (event: Omit<AuditEvent, 'id' | 'timestamp' | 'userAgent' | 'ipAddress'>) => void;

  // 01.08 Integrations & API
  apiClients: ApiClient[];
  integrations: ExternalIntegration[];
  integrationLogs: IntegrationLog[];
  addApiClient: (client: Partial<Omit<ApiClient, 'id' | 'createdAt' | 'maskedSecret' | 'dailyRequestCount'>>) => void;
  toggleApiClientStatus: (id: string) => void;
  triggerIntegrationSync: (id: string) => void;

  // 01.09 Backup & Recovery
  backupConfig: BackupConfiguration;
  restorePoints: RestorePoint[];
  drStatus: DisasterRecoveryStatus;
  triggerManualBackup: () => void;
  testSandboxRestore: (restorePointId: string) => void;
  updateBackupConfig: (cfg: Partial<BackupConfiguration>) => void;

  // 01.10 Security Management
  securityPolicies: SecurityPolicy[];
  passwordPolicy: PasswordPolicy;
  activeSessions: ActiveSession[];
  securityEvents: SecurityEvent[];
  updatePasswordPolicy: (policy: Partial<PasswordPolicy>) => void;
  toggleSecurityPolicy: (id: string) => void;
  terminateSession: (sessionId: string) => void;

  // AI Assistant Engine
  runAiSystemQuery: (promptText: string) => Promise<{ answer: string; recommendedAction?: string; targetRoute?: any }>;

  // Feedback Notification banner
  bannerMessage: { text: string; type: 'success' | 'info' | 'warning' | 'error' } | null;
  clearBanner: () => void;
  setBanner: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

const SystemManagementContext = createContext<SystemManagementContextType | undefined>(undefined);

export const SystemManagementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 01.01 Organization Setup & 01.01.02 Group / Holding Master Data
  const [companies, setCompanies] = useState<Company[]>(() => {
    const saved = localStorage.getItem('artify_sm_companies');
    return saved ? JSON.parse(saved) : INITIAL_COMPANIES;
  });

  const [currencies, setCurrencies] = useState<CurrencyDefinition[]>(() => {
    const saved = localStorage.getItem('artify_sm_currencies');
    return saved ? JSON.parse(saved) : INITIAL_CURRENCIES;
  });

  useEffect(() => {
    localStorage.setItem('artify_sm_currencies', JSON.stringify(currencies));
  }, [currencies]);

  const addCurrency = (currData: Omit<CurrencyDefinition, 'id'>) => {
    const newCurr: CurrencyDefinition = {
      ...currData,
      id: `curr-${Date.now()}`
    };
    setCurrencies(prev => [...prev, newCurr]);
    return { success: true, id: newCurr.id };
  };

  const updateCurrency = (id: string, patch: Partial<CurrencyDefinition>) => {
    setCurrencies(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));
    return { success: true };
  };

  const [groups, setGroups] = useState<GroupMaster[]>(() => {
    const saved = localStorage.getItem('artify_sm_groups');
    return saved ? JSON.parse(saved) : INITIAL_GROUPS;
  });

  const [groupMemberships, setGroupMemberships] = useState<GroupMembership[]>(() => {
    const saved = localStorage.getItem('artify_sm_group_memberships');
    return saved ? JSON.parse(saved) : INITIAL_GROUP_MEMBERSHIPS;
  });

  const [relationshipHistory, setRelationshipHistory] = useState<RelationshipHistoryRecord[]>(() => {
    const saved = localStorage.getItem('artify_sm_rel_history');
    return saved ? JSON.parse(saved) : INITIAL_RELATIONSHIP_HISTORY;
  });

  const [selectedGroupId, setSelectedGroupId] = useState<string>(() => {
    return (INITIAL_GROUPS[0] && INITIAL_GROUPS[0].id) || 'grp-1';
  });

  const companyGroup = groups.find(g => g.id === selectedGroupId) || groups[0] || INITIAL_COMPANY_GROUP;

  // Safe storage helper
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  };

  const [branches, setBranches] = useState<Branch[]>(() => loadStored('artify_sm_branches', INITIAL_BRANCHES));
  const [departments, setDepartments] = useState<Department[]>(() => loadStored('artify_sm_departments', INITIAL_DEPARTMENTS));
  const [locations, setLocations] = useState<Location[]>(() => loadStored('artify_sm_locations', INITIAL_LOCATIONS));
  const [operatingUnits, setOperatingUnits] = useState<OperatingUnit[]>(() => loadStored('artify_sm_operating_units', INITIAL_OPERATING_UNITS));

  // 01.02 User & Access
  const [users, setUsers] = useState<UserAccount[]>(() => loadStored('artify_sm_users', INITIAL_USERS));
  const [userGroups, setUserGroups] = useState<UserGroup[]>(() => loadStored('artify_sm_user_groups', INITIAL_USER_GROUPS));
  const [sodRules, setSodRules] = useState<SoDRule[]>(() => loadStored('artify_sm_sod_rules', INITIAL_SOD_RULES));
  const [accessRestrictions, setAccessRestrictions] = useState<AccessRestriction[]>(() => loadStored('artify_sm_access_restrictions', INITIAL_ACCESS_RESTRICTIONS));

  // 01.03 Workflow & Approval
  const [workflows, setWorkflows] = useState<ApprovalWorkflow[]>(() => loadStored('artify_sm_workflows', INITIAL_WORKFLOWS));
  const [approvalMatrices, setApprovalMatrices] = useState<ApprovalMatrixRule[]>(() => loadStored('artify_sm_approval_matrices', INITIAL_APPROVAL_MATRICES));
  const [delegations, setDelegations] = useState<DelegationOfAuthority[]>(() => loadStored('artify_sm_delegations', INITIAL_DELEGATIONS));
  const [approvalLimits, setApprovalLimits] = useState<ApprovalLimit[]>(() => loadStored('artify_sm_approval_limits', INITIAL_APPROVAL_LIMITS));
  const [escalationRules, setEscalationRules] = useState<EscalationRule[]>(() => loadStored('artify_sm_escalation_rules', INITIAL_ESCALATION_RULES));

  // 01.04 Financial & Period Controls
  const [fiscalYears, setFiscalYears] = useState<FiscalYear[]>(() => loadStored('artify_sm_fiscal_years', INITIAL_FISCAL_YEARS));
  const [postingPeriods, setPostingPeriods] = useState<PostingPeriod[]>(() => loadStored('artify_sm_posting_periods', INITIAL_POSTING_PERIODS));
  const [documentSequences, setDocumentSequences] = useState<DocumentSequence[]>(() => loadStored('artify_sm_doc_sequences', INITIAL_DOC_SEQUENCES));
  const [postingControls, setPostingControls] = useState<PostingControl>(() => loadStored('artify_sm_posting_controls', INITIAL_POSTING_CONTROLS));
  const [periodLocks, setPeriodLocks] = useState<PeriodLockRecord[]>(() => loadStored('artify_sm_period_locks', INITIAL_PERIOD_LOCKS));

  // 01.05 Master Data Management
  const [mdmDefinitions] = useState<MasterDataDefinition[]>(INITIAL_MDM_DEFINITIONS);
  const [duplicateRules, setDuplicateRules] = useState<DuplicateRule[]>(() => loadStored('artify_sm_duplicate_rules', INITIAL_DUPLICATE_RULES));
  const [validationRules, setValidationRules] = useState<ValidationRule[]>(() => loadStored('artify_sm_validation_rules', INITIAL_VALIDATION_RULES));
  const [mdmApprovals, setMdmApprovals] = useState<MasterDataApprovalRequest[]>(() => loadStored('artify_sm_mdm_approvals', INITIAL_MDM_APPROVALS));

  // 01.06 Notifications & Alerts
  const [notificationTemplates, setNotificationTemplates] = useState<NotificationTemplate[]>(() => loadStored('artify_sm_notif_templates', INITIAL_NOTIF_TEMPLATES));
  const [notificationRules, setNotificationRules] = useState<NotificationRule[]>(() => loadStored('artify_sm_notif_rules', INITIAL_NOTIF_RULES));
  const [alerts, setAlerts] = useState<SystemAlertItem[]>(() => loadStored('artify_sm_alerts', INITIAL_ALERTS));

  // 01.07 Audit Trail & Monitoring
  const [auditTrail, setAuditTrail] = useState<AuditEvent[]>(() => loadStored('artify_sm_audit_trail', INITIAL_AUDIT_TRAIL));
  const [loginHistory] = useState<LoginHistoryEvent[]>(INITIAL_LOGIN_HISTORY);

  // 01.08 Integrations & API
  const [apiClients, setApiClients] = useState<ApiClient[]>(() => loadStored('artify_sm_api_clients', INITIAL_API_CLIENTS));
  const [integrations, setIntegrations] = useState<ExternalIntegration[]>(() => loadStored('artify_sm_integrations', INITIAL_INTEGRATIONS));
  const [integrationLogs, setIntegrationLogs] = useState<IntegrationLog[]>(() => loadStored('artify_sm_integration_logs', INITIAL_INTEGRATION_LOGS));

  // 01.09 Backup & Recovery
  const [backupConfig, setBackupConfig] = useState<BackupConfiguration>(() => loadStored('artify_sm_backup_config', INITIAL_BACKUP_CONFIG));
  const [restorePoints, setRestorePoints] = useState<RestorePoint[]>(() => loadStored('artify_sm_restore_points', INITIAL_RESTORE_POINTS));
  const [drStatus] = useState<DisasterRecoveryStatus>(INITIAL_DR_STATUS);

  // 01.10 Security Management
  const [securityPolicies, setSecurityPolicies] = useState<SecurityPolicy[]>(() => loadStored('artify_sm_security_policies', INITIAL_SECURITY_POLICIES));
  const [passwordPolicy, setPasswordPolicy] = useState<PasswordPolicy>(() => loadStored('artify_sm_password_policy', INITIAL_PASSWORD_POLICY));
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>(() => loadStored('artify_sm_active_sessions', INITIAL_ACTIVE_SESSIONS));
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>(() => loadStored('artify_sm_security_events', INITIAL_SECURITY_EVENTS));

  // Banner
  const [bannerMessage, setBannerMessage] = useState<{ text: string; type: 'success' | 'info' | 'warning' | 'error' } | null>(null);

  const clearBanner = () => setBannerMessage(null);
  const setBanner = (msg: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    setBannerMessage({ text: msg, type });
    setTimeout(() => {
      setBannerMessage(prev => (prev?.text === msg ? null : prev));
    }, 6000);
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('artify_sm_companies', JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem('artify_sm_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('artify_sm_group_memberships', JSON.stringify(groupMemberships));
  }, [groupMemberships]);

  useEffect(() => {
    localStorage.setItem('artify_sm_rel_history', JSON.stringify(relationshipHistory));
  }, [relationshipHistory]);

  useEffect(() => {
    localStorage.setItem('artify_sm_branches', JSON.stringify(branches));
  }, [branches]);

  useEffect(() => {
    localStorage.setItem('artify_sm_departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('artify_sm_locations', JSON.stringify(locations));
  }, [locations]);

  useEffect(() => {
    localStorage.setItem('artify_sm_operating_units', JSON.stringify(operatingUnits));
  }, [operatingUnits]);

  useEffect(() => {
    localStorage.setItem('artify_sm_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('artify_sm_user_groups', JSON.stringify(userGroups));
  }, [userGroups]);

  useEffect(() => {
    localStorage.setItem('artify_sm_sod_rules', JSON.stringify(sodRules));
  }, [sodRules]);

  useEffect(() => {
    localStorage.setItem('artify_sm_access_restrictions', JSON.stringify(accessRestrictions));
  }, [accessRestrictions]);

  useEffect(() => {
    localStorage.setItem('artify_sm_workflows', JSON.stringify(workflows));
  }, [workflows]);

  useEffect(() => {
    localStorage.setItem('artify_sm_approval_matrices', JSON.stringify(approvalMatrices));
  }, [approvalMatrices]);

  useEffect(() => {
    localStorage.setItem('artify_sm_delegations', JSON.stringify(delegations));
  }, [delegations]);

  useEffect(() => {
    localStorage.setItem('artify_sm_approval_limits', JSON.stringify(approvalLimits));
  }, [approvalLimits]);

  useEffect(() => {
    localStorage.setItem('artify_sm_escalation_rules', JSON.stringify(escalationRules));
  }, [escalationRules]);

  useEffect(() => {
    localStorage.setItem('artify_sm_fiscal_years', JSON.stringify(fiscalYears));
  }, [fiscalYears]);

  useEffect(() => {
    localStorage.setItem('artify_sm_posting_periods', JSON.stringify(postingPeriods));
  }, [postingPeriods]);

  useEffect(() => {
    localStorage.setItem('artify_sm_doc_sequences', JSON.stringify(documentSequences));
  }, [documentSequences]);

  useEffect(() => {
    localStorage.setItem('artify_sm_posting_controls', JSON.stringify(postingControls));
  }, [postingControls]);

  useEffect(() => {
    localStorage.setItem('artify_sm_period_locks', JSON.stringify(periodLocks));
  }, [periodLocks]);

  useEffect(() => {
    localStorage.setItem('artify_sm_duplicate_rules', JSON.stringify(duplicateRules));
  }, [duplicateRules]);

  useEffect(() => {
    localStorage.setItem('artify_sm_validation_rules', JSON.stringify(validationRules));
  }, [validationRules]);

  useEffect(() => {
    localStorage.setItem('artify_sm_mdm_approvals', JSON.stringify(mdmApprovals));
  }, [mdmApprovals]);

  useEffect(() => {
    localStorage.setItem('artify_sm_notif_templates', JSON.stringify(notificationTemplates));
  }, [notificationTemplates]);

  useEffect(() => {
    localStorage.setItem('artify_sm_notif_rules', JSON.stringify(notificationRules));
  }, [notificationRules]);

  useEffect(() => {
    localStorage.setItem('artify_sm_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('artify_sm_audit_trail', JSON.stringify(auditTrail));
  }, [auditTrail]);

  useEffect(() => {
    localStorage.setItem('artify_sm_api_clients', JSON.stringify(apiClients));
  }, [apiClients]);

  useEffect(() => {
    localStorage.setItem('artify_sm_integrations', JSON.stringify(integrations));
  }, [integrations]);

  useEffect(() => {
    localStorage.setItem('artify_sm_integration_logs', JSON.stringify(integrationLogs));
  }, [integrationLogs]);

  useEffect(() => {
    localStorage.setItem('artify_sm_backup_config', JSON.stringify(backupConfig));
  }, [backupConfig]);

  useEffect(() => {
    localStorage.setItem('artify_sm_restore_points', JSON.stringify(restorePoints));
  }, [restorePoints]);

  useEffect(() => {
    localStorage.setItem('artify_sm_security_policies', JSON.stringify(securityPolicies));
  }, [securityPolicies]);

  useEffect(() => {
    localStorage.setItem('artify_sm_password_policy', JSON.stringify(passwordPolicy));
  }, [passwordPolicy]);

  useEffect(() => {
    localStorage.setItem('artify_sm_active_sessions', JSON.stringify(activeSessions));
  }, [activeSessions]);

  useEffect(() => {
    localStorage.setItem('artify_sm_security_events', JSON.stringify(securityEvents));
  }, [securityEvents]);

  // Central audit event appender
  const logAuditEvent = (event: Omit<AuditEvent, 'id' | 'timestamp' | 'userAgent' | 'ipAddress'>) => {
    const newEntry: AuditEvent = {
      ...event,
      id: `aud-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      ipAddress: '185.190.24.01 (Admin Station)',
      userAgent: navigator.userAgent.slice(0, 60)
    };
    setAuditTrail(prev => [newEntry, ...prev]);
  };

  // ─────────────────────────────────────────────────────────────
  // 01.01.02 Graph & Circular Relationship Engine
  // ─────────────────────────────────────────────────────────────
  const checkCircularRelationship = (
    parentCompanyId: string,
    targetCompanyId: string,
    excludeMembershipId?: string
  ): { isCircular: boolean; path: string[]; message?: string } => {
    if (!parentCompanyId || !targetCompanyId) {
      return { isCircular: false, path: [] };
    }

    if (parentCompanyId === targetCompanyId) {
      const compName = companies.find(c => c.id === parentCompanyId)?.legalName || parentCompanyId;
      return {
        isCircular: true,
        path: [compName, compName],
        message: `Self-referential validation failure: Entity "${compName}" cannot hold or be a subsidiary of itself.`
      };
    }

    // Build directed ownership graph: child company -> parent companies
    const ownershipGraph = new Map<string, string[]>();

    // Add company master parent relationships
    companies.forEach(c => {
      if (c.parentId) {
        const parents = ownershipGraph.get(c.id) || [];
        if (!parents.includes(c.parentId)) {
          parents.push(c.parentId);
          ownershipGraph.set(c.id, parents);
        }
      }
    });

    // Add group memberships: member company is owned by group's parentCompanyId
    groupMemberships.forEach(gm => {
      if (excludeMembershipId && gm.id === excludeMembershipId) return;
      if (gm.status === 'Archived' || gm.status === 'Inactive') return;

      const grp = groups.find(g => g.id === gm.groupId);
      if (grp && grp.parentCompanyId && grp.parentCompanyId !== gm.companyId) {
        const parents = ownershipGraph.get(gm.companyId) || [];
        if (!parents.includes(grp.parentCompanyId)) {
          parents.push(grp.parentCompanyId);
          ownershipGraph.set(gm.companyId, parents);
        }
      }
    });

    // Check if targetCompanyId is an upstream ancestor of parentCompanyId
    const queue: { current: string; path: string[] }[] = [{ current: parentCompanyId, path: [parentCompanyId] }];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const { current, path } = queue.shift()!;
      if (current === targetCompanyId) {
        const namedPath = path.map(id => companies.find(c => c.id === id)?.legalName || id);
        return {
          isCircular: true,
          path: namedPath,
          message: `Circular ownership loop blocked! "${companies.find(c => c.id === targetCompanyId)?.legalName || targetCompanyId}" is already an upstream holding entity of "${companies.find(c => c.id === parentCompanyId)?.legalName || parentCompanyId}". Cycle path: ${namedPath.join(' → ')}`
        };
      }

      if (!visited.has(current)) {
        visited.add(current);
        const directParents = ownershipGraph.get(current) || [];
        for (const p of directParents) {
          queue.push({ current: p, path: [...path, p] });
        }
      }
    }

    return { isCircular: false, path: [] };
  };

  const checkDuplicateMembership = (
    groupId: string,
    companyId: string,
    excludeMembershipId?: string
  ): boolean => {
    return groupMemberships.some(
      gm =>
        gm.groupId === groupId &&
        gm.companyId === companyId &&
        gm.id !== excludeMembershipId &&
        gm.status !== 'Archived'
    );
  };

  // ─────────────────────────────────────────────────────────────
  // 01.01.02 Group / Holding Master Operations
  // ─────────────────────────────────────────────────────────────
  const addGroup = (
    groupData: Partial<Omit<GroupMaster, 'id' | 'createdAt' | 'updatedAt' | 'version'>>,
    user?: { id: string; name: string; role?: string }
  ): { success: boolean; id?: string; error?: string } => {
    const trimmedCode = groupData.code.trim().toUpperCase();
    if (groups.some(g => g.code.toUpperCase() === trimmedCode)) {
      return { success: false, error: `Group code "${trimmedCode}" already exists. Must be unique across all corporate groups.` };
    }

    const parentComp = companies.find(c => c.id === groupData.parentCompanyId);
    if (!parentComp) {
      return { success: false, error: `Selected Parent Holding Company is invalid or does not exist in authoritative Company Master.` };
    }

    const newId = `grp-${Date.now().toString().slice(-4)}`;
    const dateStr = new Date().toISOString().split('T')[0];
    const newGroup = {
      ...groupData,
      id: newId,
      code: trimmedCode,
      version: 1,
      createdAt: dateStr,
      updatedAt: dateStr,
      createdBy: user?.name || 'usr-admin',
      updatedBy: user?.name || 'usr-admin'
    } as GroupMaster;

    setGroups(prev => [...prev, newGroup]);
    setSelectedGroupId(newId);

    // Auto-create Parent membership record
    const parentMemId = `gmem-${Date.now().toString().slice(-4)}`;
    const parentMembership: GroupMembership = {
      id: parentMemId,
      groupId: newId,
      companyId: parentComp.id,
      companyCode: parentComp.code,
      companyName: parentComp.legalName,
      relationshipType: 'Parent',
      ownershipPercentage: 100.0,
      votingPercentage: 100.0,
      acquisitionDate: groupData.effectiveFrom || dateStr,
      effectiveFrom: groupData.effectiveFrom || dateStr,
      controlType: 'Wholly Owned (100%)',
      consolidationTreatment: 'Consolidated',
      status: 'Active',
      notes: `Designated ultimate parent holding entity for ${newGroup.name}.`,
      createdBy: user?.name || 'usr-admin',
      createdAt: dateStr,
      updatedBy: user?.name || 'usr-admin',
      updatedAt: dateStr,
      version: 1
    };
    setGroupMemberships(prev => [...prev, parentMembership]);

    logAuditEvent({
      userId: user?.id || 'usr-admin',
      userName: user?.name || 'Administrator',
      userRole: user?.role || 'Super Admin',
      action: 'CREATE',
      module: '01.01.02 Group / Holding Master',
      entity: 'GroupMaster',
      recordId: newId,
      newValue: `${newGroup.code} (${newGroup.name})`,
      result: 'SUCCESS',
      details: `Created new Group / Holding structure ${newGroup.code} under parent ${parentComp.code}`
    });

    setBanner(`Corporate Group "${newGroup.name}" (${newGroup.code}) created successfully.`);
    return { success: true, id: newId };
  };

  const updateGroup = (
    id: string,
    patch: Partial<GroupMaster>,
    user?: { id: string; name: string }
  ): { success: boolean; error?: string } => {
    const existing = groups.find(g => g.id === id);
    if (!existing) return { success: false, error: 'Group record not found.' };

    if (patch.code && patch.code.toUpperCase() !== existing.code.toUpperCase()) {
      const trimmedCode = patch.code.trim().toUpperCase();
      if (groups.some(g => g.id !== id && g.code.toUpperCase() === trimmedCode)) {
        return { success: false, error: `Group code "${trimmedCode}" is already in use by another group.` };
      }
    }

    const dateStr = new Date().toISOString().split('T')[0];
    const updatedGroup: GroupMaster = {
      ...existing,
      ...patch,
      version: (existing.version || 1) + 1,
      updatedAt: dateStr,
      updatedBy: user?.name || 'usr-admin'
    };

    setGroups(prev => prev.map(g => (g.id === id ? updatedGroup : g)));

    logAuditEvent({
      userId: user?.id || 'usr-admin',
      userName: user?.name || 'Administrator',
      userRole: 'Super Admin',
      action: 'UPDATE',
      module: '01.01.02 Group / Holding Master',
      entity: 'GroupMaster',
      recordId: id,
      previousValue: JSON.stringify({ name: existing.name, status: existing.status, parentCompanyId: existing.parentCompanyId }),
      newValue: JSON.stringify({ name: updatedGroup.name, status: updatedGroup.status, parentCompanyId: updatedGroup.parentCompanyId }),
      result: 'SUCCESS',
      details: `Updated Group / Holding Master attributes for ${existing.code}`
    });

    setBanner(`Group master record "${updatedGroup.name}" updated.`);
    return { success: true };
  };

  const archiveGroup = (id: string, user?: { id: string; name: string }): { success: boolean; error?: string } => {
    const target = groups.find(g => g.id === id);
    if (!target) return { success: false, error: 'Group not found.' };

    setGroups(prev =>
      prev.map(g => (g.id === id ? { ...g, status: 'Archived', updatedAt: new Date().toISOString().split('T')[0] } : g))
    );

    logAuditEvent({
      userId: user?.id || 'usr-admin',
      userName: user?.name || 'Administrator',
      userRole: 'Super Admin',
      action: 'UPDATE',
      module: '01.01.02 Group / Holding Master',
      entity: 'GroupMaster',
      recordId: id,
      newValue: 'status: Archived',
      result: 'SUCCESS',
      details: `Archived Corporate Group ${target.code}`
    });

    setBanner(`Corporate Group ${target.code} marked as Archived.`);
    return { success: true };
  };

  const submitGroupForApproval = (
    id: string,
    user: { id: string; name: string; role: string }
  ): { success: boolean; error?: string } => {
    const group = groups.find(g => g.id === id);
    if (!group) return { success: false, error: 'Group record not found.' };

    const members = groupMemberships.filter(m => m.groupId === id && m.status !== 'Archived');
    if (members.length === 0) {
      return { success: false, error: 'Cannot submit group for approval: At least one member entity must be defined in the hierarchy.' };
    }

    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    const updated: GroupMaster = {
      ...group,
      status: 'Pending Approval',
      submittedAt: timestamp,
      submittedBy: user.name,
      rejectionReason: undefined,
      updatedAt: new Date().toISOString().split('T')[0],
      updatedBy: user.name
    };

    setGroups(prev => prev.map(g => (g.id === id ? updated : g)));

    // Emit in-app alert for Approvers
    const newAlert: SystemAlertItem = {
      id: `alt-grp-${Date.now().toString().slice(-4)}`,
      title: `Group Hierarchy Approval Required: ${group.name}`,
      type: 'approval',
      priority: 'medium',
      message: `Corporate Group "${group.name}" (${group.code}) was submitted for governance approval by ${user.name}.`,
      timestamp: 'Just now',
      read: false,
      moduleRef: '01.01 Organization Setup',
      actionUrl: '/system-management/org-setup'
    };
    setAlerts(prev => [newAlert, ...prev]);

    logAuditEvent({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'CONFIG_CHANGE',
      module: '01.01.02 Group / Holding Master',
      entity: 'GroupMaster',
      recordId: id,
      newValue: 'status: Pending Approval',
      result: 'SUCCESS',
      details: `Submitted corporate group structure ${group.code} for executive board/governance approval.`
    });

    setBanner(`Corporate Group "${group.name}" submitted for approval.`);
    return { success: true };
  };

  const approveGroup = (
    id: string,
    approver: { id: string; name: string; role: string },
    comments?: string
  ): { success: boolean; error?: string } => {
    const group = groups.find(g => g.id === id);
    if (!group) return { success: false, error: 'Group record not found.' };

    // Segregation of Duties (SoD) Enforcement: Submitter cannot approve their own group submission
    if (group.submittedBy && group.submittedBy.toLowerCase() === approver.name.toLowerCase()) {
      return {
        success: false,
        error: `Segregation of Duties (SoD) Violation: Submitter (${group.submittedBy}) cannot approve their own corporate group structure.`
      };
    }

    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    const updated: GroupMaster = {
      ...group,
      status: 'Active',
      approvedAt: timestamp,
      approvedBy: approver.name,
      approvalComments: comments || 'Approved in compliance with Corporate Governance and Consolidation Standards.',
      updatedAt: new Date().toISOString().split('T')[0],
      updatedBy: approver.name
    };

    setGroups(prev => prev.map(g => (g.id === id ? updated : g)));

    logAuditEvent({
      userId: approver.id,
      userName: approver.name,
      userRole: approver.role,
      action: 'APPROVE',
      module: '01.01.02 Group / Holding Master',
      entity: 'GroupMaster',
      recordId: id,
      newValue: 'status: Active (Approved)',
      result: 'SUCCESS',
      details: `Approved corporate group ${group.code}. Comments: ${comments || 'None'}`
    });

    setBanner(`Corporate Group "${group.name}" has been Approved and Activated.`);
    return { success: true };
  };

  const rejectGroup = (
    id: string,
    rejector: { id: string; name: string; role: string },
    reason: string
  ): { success: boolean; error?: string } => {
    const group = groups.find(g => g.id === id);
    if (!group) return { success: false, error: 'Group record not found.' };

    if (!reason || reason.trim().length === 0) {
      return { success: false, error: 'A specific rejection reason must be provided.' };
    }

    const updated: GroupMaster = {
      ...group,
      status: 'Draft',
      rejectionReason: reason,
      updatedAt: new Date().toISOString().split('T')[0],
      updatedBy: rejector.name
    };

    setGroups(prev => prev.map(g => (g.id === id ? updated : g)));

    logAuditEvent({
      userId: rejector.id,
      userName: rejector.name,
      userRole: rejector.role,
      action: 'REJECT',
      module: '01.01.02 Group / Holding Master',
      entity: 'GroupMaster',
      recordId: id,
      newValue: `status: Draft (Rejected: ${reason})`,
      result: 'SUCCESS',
      details: `Rejected corporate group submission ${group.code}. Reason: ${reason}`
    });

    setBanner(`Corporate Group "${group.name}" was returned to Draft with feedback.`, 'warning');
    return { success: true };
  };

  const toggleGroupStatus = (id: string, newStatus: GroupMaster['status']) => {
    setGroups(prev =>
      prev.map(g => (g.id === id ? { ...g, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] } : g))
    );
    setBanner(`Group status updated to ${newStatus}.`);
  };

  const addGroupAttachment = (groupId: string, attachment: Omit<GroupAttachment, 'id' | 'uploadedAt'>) => {
    const attId = `att-${Date.now().toString().slice(-4)}`;
    const fullAttachment: GroupAttachment = {
      ...attachment,
      id: attId,
      uploadedAt: new Date().toISOString().split('T')[0]
    };

    setGroups(prev =>
      prev.map(g => {
        if (g.id === groupId) {
          const currentAtts = g.attachments || [];
          return { ...g, attachments: [...currentAtts, fullAttachment] };
        }
        return g;
      })
    );

    logAuditEvent({
      userId: 'usr-admin',
      userName: 'Administrator',
      userRole: 'Super Admin',
      action: 'CREATE',
      module: '01.01.02 Group / Holding Master',
      entity: 'GroupAttachment',
      recordId: attId,
      newValue: fullAttachment.name,
      result: 'SUCCESS',
      details: `Attached governance document "${fullAttachment.name}" (${fullAttachment.category}) to Group ${groupId}`
    });

    setBanner(`Document "${fullAttachment.name}" attached successfully.`);
  };

  // ─────────────────────────────────────────────────────────────
  // 01.01.02 Group Memberships & Shareholding Management
  // ─────────────────────────────────────────────────────────────
  const addGroupMember = (
    memberData: Partial<Omit<GroupMembership, 'id' | 'createdAt' | 'updatedAt' | 'version'>>,
    user?: { id: string; name: string }
  ): { success: boolean; id?: string; error?: string } => {
    const group = groups.find(g => g.id === memberData.groupId);
    if (!group) return { success: false, error: 'Group record not found.' };

    const comp = companies.find(c => c.id === memberData.companyId);
    if (!comp) return { success: false, error: 'Selected Legal Entity does not exist in authoritative Company Master.' };

    // Duplicate membership check
    if (checkDuplicateMembership(memberData.groupId, memberData.companyId)) {
      return {
        success: false,
        error: `Entity "${comp.legalName}" (${comp.code}) is already an active member of Group "${group.name}".`
      };
    }

    // Ownership percentage check
    if (memberData.ownershipPercentage < 0 || memberData.ownershipPercentage > 100) {
      return { success: false, error: 'Ownership percentage must be between 0.00% and 100.00%.' };
    }
    if (memberData.votingPercentage < 0 || memberData.votingPercentage > 100) {
      return { success: false, error: 'Voting rights percentage must be between 0.00% and 100.00%.' };
    }

    // Circular relationship check
    const circularCheck = checkCircularRelationship(group.parentCompanyId, memberData.companyId);
    if (circularCheck.isCircular) {
      return { success: false, error: circularCheck.message };
    }

    const newId = `gmem-${Date.now().toString().slice(-4)}`;
    const dateStr = new Date().toISOString().split('T')[0];
    const newMembership = {
      ...memberData,
      id: newId,
      companyCode: comp.code,
      companyName: comp.legalName,
      version: 1,
      createdAt: dateStr,
      updatedAt: dateStr,
      createdBy: user?.name || 'usr-admin',
      updatedBy: user?.name || 'usr-admin'
    } as GroupMembership;

    setGroupMemberships(prev => [...prev, newMembership]);

    // Record initial history snapshot
    const histId = `rhist-${Date.now().toString().slice(-4)}`;
    const historyEntry: RelationshipHistoryRecord = {
      id: histId,
      groupId: group.id,
      groupName: group.name,
      companyId: comp.id,
      companyName: comp.legalName,
      companyCode: comp.code,
      previousOwnership: 0,
      newOwnership: memberData.ownershipPercentage,
      previousVoting: 0,
      newVoting: memberData.votingPercentage,
      previousRelationshipType: 'None',
      newRelationshipType: memberData.relationshipType,
      changeReason: memberData.notes || 'Initial entity induction into corporate group structure.',
      effectiveDate: memberData.effectiveFrom || dateStr,
      changedBy: user?.name || 'Administrator',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC'
    };
    setRelationshipHistory(prev => [historyEntry, ...prev]);

    logAuditEvent({
      userId: user?.id || 'usr-admin',
      userName: user?.name || 'Administrator',
      userRole: 'Super Admin',
      action: 'CREATE',
      module: '01.01.02 Group / Holding Master',
      entity: 'GroupMembership',
      recordId: newId,
      newValue: `${comp.code} (${memberData.relationshipType} - ${memberData.ownershipPercentage}%)`,
      result: 'SUCCESS',
      details: `Added ${comp.code} to Group ${group.code} with ${memberData.ownershipPercentage}% equity shareholding.`
    });

    setBanner(`Entity "${comp.legalName}" added to Group structure.`);
    return { success: true, id: newId };
  };

  const updateGroupMember = (
    id: string,
    patch: Partial<GroupMembership>,
    reason?: string,
    changedBy?: string
  ): { success: boolean; error?: string } => {
    const existing = groupMemberships.find(m => m.id === id);
    if (!existing) return { success: false, error: 'Membership record not found.' };

    const group = groups.find(g => g.id === existing.groupId);
    const comp = companies.find(c => c.id === existing.companyId);

    if (patch.ownershipPercentage !== undefined) {
      if (patch.ownershipPercentage < 0 || patch.ownershipPercentage > 100) {
        return { success: false, error: 'Ownership percentage must be between 0.00% and 100.00%.' };
      }
    }
    if (patch.votingPercentage !== undefined) {
      if (patch.votingPercentage < 0 || patch.votingPercentage > 100) {
        return { success: false, error: 'Voting rights percentage must be between 0.00% and 100.00%.' };
      }
    }

    const dateStr = new Date().toISOString().split('T')[0];
    const updatedMember: GroupMembership = {
      ...existing,
      ...patch,
      version: (existing.version || 1) + 1,
      updatedAt: dateStr,
      updatedBy: changedBy || 'Administrator'
    };

    setGroupMemberships(prev => prev.map(m => (m.id === id ? updatedMember : m)));

    // Track ownership or relationship change history
    const ownershipChanged = patch.ownershipPercentage !== undefined && patch.ownershipPercentage !== existing.ownershipPercentage;
    const typeChanged = patch.relationshipType !== undefined && patch.relationshipType !== existing.relationshipType;

    if (ownershipChanged || typeChanged) {
      const histId = `rhist-${Date.now().toString().slice(-4)}`;
      const historyEntry: RelationshipHistoryRecord = {
        id: histId,
        groupId: existing.groupId,
        groupName: group?.name || 'Group',
        companyId: existing.companyId,
        companyName: comp?.legalName || existing.companyName || 'Company',
        companyCode: comp?.code || existing.companyCode || 'COMP',
        previousOwnership: existing.ownershipPercentage,
        newOwnership: patch.ownershipPercentage ?? existing.ownershipPercentage,
        previousVoting: existing.votingPercentage,
        newVoting: patch.votingPercentage ?? existing.votingPercentage,
        previousRelationshipType: existing.relationshipType,
        newRelationshipType: patch.relationshipType ?? existing.relationshipType,
        changeReason: reason || 'Shareholding / equity structure adjustment.',
        effectiveDate: patch.effectiveFrom || dateStr,
        changedBy: changedBy || 'Administrator',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC'
      };
      setRelationshipHistory(prev => [historyEntry, ...prev]);
    }

    logAuditEvent({
      userId: 'usr-admin',
      userName: changedBy || 'Administrator',
      userRole: 'Super Admin',
      action: 'UPDATE',
      module: '01.01.02 Group / Holding Master',
      entity: 'GroupMembership',
      recordId: id,
      previousValue: JSON.stringify({ ownership: existing.ownershipPercentage, type: existing.relationshipType }),
      newValue: JSON.stringify({ ownership: updatedMember.ownershipPercentage, type: updatedMember.relationshipType }),
      result: 'SUCCESS',
      details: `Updated shareholding parameters for entity ${existing.companyCode} in Group ${group?.code}`
    });

    setBanner(`Membership and shareholding parameters updated.`);
    return { success: true };
  };

  const removeGroupMember = (id: string, reason?: string, removedBy?: string): { success: boolean; error?: string } => {
    const existing = groupMemberships.find(m => m.id === id);
    if (!existing) return { success: false, error: 'Membership record not found.' };

    if (existing.relationshipType === 'Parent') {
      return { success: false, error: 'Cannot remove the primary Parent / Holding Entity from the group. Reassign parentage first.' };
    }

    const group = groups.find(g => g.id === existing.groupId);
    const comp = companies.find(c => c.id === existing.companyId);
    const dateStr = new Date().toISOString().split('T')[0];

    // Log history record of divestment/removal
    const histId = `rhist-${Date.now().toString().slice(-4)}`;
    const historyEntry: RelationshipHistoryRecord = {
      id: histId,
      groupId: existing.groupId,
      groupName: group?.name || 'Group',
      companyId: existing.companyId,
      companyName: comp?.legalName || existing.companyName || 'Company',
      companyCode: comp?.code || existing.companyCode || 'COMP',
      previousOwnership: existing.ownershipPercentage,
      newOwnership: 0,
      previousVoting: existing.votingPercentage,
      newVoting: 0,
      previousRelationshipType: existing.relationshipType,
      newRelationshipType: 'Divested / Removed',
      changeReason: reason || 'Entity divested or unlinked from corporate group.',
      effectiveDate: dateStr,
      changedBy: removedBy || 'Administrator',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC'
    };
    setRelationshipHistory(prev => [historyEntry, ...prev]);

    setGroupMemberships(prev => prev.filter(m => m.id !== id));

    logAuditEvent({
      userId: 'usr-admin',
      userName: removedBy || 'Administrator',
      userRole: 'Super Admin',
      action: 'DELETE',
      module: '01.01.02 Group / Holding Master',
      entity: 'GroupMembership',
      recordId: id,
      newValue: 'REMOVED',
      result: 'SUCCESS',
      details: `Removed entity ${existing.companyCode} from Group ${group?.code}. Reason: ${reason || 'Divestment'}`
    });

    setBanner(`Entity removed from group structure.`);
    return { success: true };
  };

  // ─────────────────────────────────────────────────────────────
  // AI Assistive Intelligence for Corporate Holding Master
  // ─────────────────────────────────────────────────────────────
  const extractCorporateStructureWithAI = async (docTextOrMetadata: string): Promise<any> => {
    // Grounded mock parser for corporate charters, articles of association, or shareholder resolutions
    await new Promise(r => setTimeout(r, 900));
    return {
      extractedGroupName: 'Gulf Horizon Holdings PJSC',
      suggestedCode: 'GRP-GH-HOLD',
      detectedType: 'Holding Group',
      baseCurrency: 'AED',
      consolidationStandard: 'Full Consolidation (IFRS 10)',
      entities: [
        { code: 'GH-ENERGY', name: 'Gulf Horizon Clean Energy LLC', role: 'Subsidiary', ownership: 80.0, control: 'Direct Control (>50%)' },
        { code: 'GH-LOGIST', name: 'Horizon Supply Chain Logistics FZE', role: 'Subsidiary', ownership: 100.0, control: 'Wholly Owned (100%)' },
        { code: 'GH-TECH', name: 'Horizon AI Ventures LLC', role: 'Associate', ownership: 35.0, control: 'Significant Influence (20-50%)' }
      ],
      legalComplianceNote: 'Entity structure compliant with GCC Commercial Companies Law.'
    };
  };

  const generateStructureExplanationAI = async (groupId: string): Promise<string> => {
    const targetGroup = groups.find(g => g.id === groupId) || groups[0];
    const members = groupMemberships.filter(m => m.groupId === targetGroup.id && m.status !== 'Archived');
    const parentComp = companies.find(c => c.id === targetGroup.parentCompanyId);

    const subsidiaries = members.filter(m => m.relationshipType === 'Subsidiary' || m.relationshipType === 'Wholly Owned Subsidiary');
    const associates = members.filter(m => m.relationshipType === 'Associate');
    const jvs = members.filter(m => m.relationshipType === 'Joint Venture');

    let explanation = `**Executive Governance & Consolidation Summary for ${targetGroup.name} (${targetGroup.code})**:\n\n`;
    explanation += `• **Ultimate Holding Entity**: **${parentComp?.legalName || 'N/A'}** (${parentComp?.code || 'N/A'}) incorporated in ${parentComp?.country || 'GCC'} operates as the apex entity.\n`;
    explanation += `• **Consolidation Framework**: Governed under **${targetGroup.consolidationMethod || 'Full Consolidation (IFRS 10)'}** with consolidated base currency **${targetGroup.currency}**.\n`;
    explanation += `• **Direct Subsidiaries (${subsidiaries.length})**: ${subsidiaries.map(s => `${s.companyName} (${s.ownershipPercentage}%)`).join(', ') || 'None'}.\n`;
    if (associates.length > 0) {
      explanation += `• **Associates (${associates.length})**: ${associates.map(a => `${a.companyName} (${a.ownershipPercentage}% - IAS 28 Equity Method)`).join(', ')}.\n`;
    }
    if (jvs.length > 0) {
      explanation += `• **Joint Ventures (${jvs.length})**: ${jvs.map(j => `${j.companyName} (${j.ownershipPercentage}%)`).join(', ')}.\n`;
    }
    explanation += `• **Governance Status**: Current status is **${targetGroup.status}** with version **${targetGroup.version || 1}**. Total active corporate entities linked: **${members.length}**.`;

    return explanation;
  };

  const validateStructureWithAI = async (groupId: string): Promise<{ score: number; recommendations: string[]; anomalies: string[] }> => {
    const targetGroup = groups.find(g => g.id === groupId) || groups[0];
    const members = groupMemberships.filter(m => m.groupId === targetGroup.id && m.status !== 'Archived');

    const anomalies: string[] = [];
    const recommendations: string[] = [];

    // Check parent presence
    const hasParent = members.some(m => m.relationshipType === 'Parent');
    if (!hasParent) {
      anomalies.push('Missing explicit Parent holding entity definition in group membership list.');
    }

    // Check ownership vs voting rights variance
    members.forEach(m => {
      if (m.votingPercentage !== m.ownershipPercentage) {
        recommendations.push(`Dual-class share structure detected for ${m.companyName}: Ownership is ${m.ownershipPercentage}% while Voting Rights are ${m.votingPercentage}%. Ensure disclosure under IFRS 12.`);
      }
      if (m.ownershipPercentage < 50 && (m.relationshipType === 'Subsidiary' || m.relationshipType === 'Wholly Owned Subsidiary')) {
        anomalies.push(`Classification anomaly: ${m.companyName} is designated as "${m.relationshipType}" but holds only ${m.ownershipPercentage}% equity. Confirm de facto control under IFRS 10.`);
      }
    });

    if (targetGroup.status === 'Draft') {
      recommendations.push('Structure is currently in Draft state. Submit for Board Governance approval once final shareholding audits are completed.');
    }

    const score = anomalies.length === 0 ? 98 : Math.max(70, 98 - anomalies.length * 12);

    return {
      score,
      anomalies,
      recommendations: recommendations.length > 0 ? recommendations : ['Structure conforms strictly to IFRS 10, IAS 28, and regional GCC corporate registries.']
    };
  };

  // ─────────────────────────────────────────────────────────────
  // 01.01.01 Company Setup & Legal Entity Master Operations
  // ─────────────────────────────────────────────────────────────
  const checkDuplicateCompany = (
    field: 'code' | 'taxNumber' | 'registrationNumber' | 'legalName',
    value: string,
    excludeCompanyId?: string
  ): { isDuplicate: boolean; matchedCompany?: Company } => {
    if (!value || !value.trim()) return { isDuplicate: false };
    const normalized = value.trim().toLowerCase();

    const matched = companies.find(c => {
      if (excludeCompanyId && c.id === excludeCompanyId) return false;
      if (field === 'code') return c.code.toLowerCase() === normalized;
      if (field === 'taxNumber') return c.taxNumber && c.taxNumber.toLowerCase() === normalized;
      if (field === 'registrationNumber') return c.registrationNumber && c.registrationNumber.toLowerCase() === normalized;
      if (field === 'legalName') return c.legalName.toLowerCase() === normalized;
      return false;
    });

    return {
      isDuplicate: !!matched,
      matchedCompany: matched
    };
  };

  const addCompany = (
    compData: Partial<Omit<Company, 'id' | 'createdAt' | 'updatedAt' | 'version'>>,
    user?: { id: string; name: string; role?: string }
  ): { success: boolean; id?: string; error?: string } => {
    // 1. Mandatory Code validation
    if (!compData.code || !compData.code.trim()) {
      return { success: false, error: 'Company Code is required.' };
    }
    const cleanCode = compData.code.trim().toUpperCase();

    // 2. Uniqueness check for Company Code
    const dupCode = checkDuplicateCompany('code', cleanCode);
    if (dupCode.isDuplicate) {
      return { success: false, error: `Company Code "${cleanCode}" is already in use by "${dupCode.matchedCompany?.legalName}".` };
    }

    // 3. Legal Name validation & duplicate warning check
    if (!compData.legalName || !compData.legalName.trim()) {
      return { success: false, error: 'Legal Entity Name is mandatory.' };
    }
    const dupName = checkDuplicateCompany('legalName', compData.legalName);
    if (dupName.isDuplicate) {
      return { success: false, error: `A legal entity with the name "${compData.legalName}" is already registered (${dupName.matchedCompany?.code}).` };
    }

    // 4. Registration Number (CR) uniqueness check
    if (compData.registrationNumber && compData.registrationNumber.trim()) {
      const dupCR = checkDuplicateCompany('registrationNumber', compData.registrationNumber);
      if (dupCR.isDuplicate) {
        return { success: false, error: `Commercial Registration number "${compData.registrationNumber}" is already registered to "${dupCR.matchedCompany?.legalName}" (${dupCR.matchedCompany?.code}).` };
      }
    }

    // 5. Tax Identification / VAT TRN check
    if (compData.taxNumber && compData.taxNumber.trim()) {
      const dupTax = checkDuplicateCompany('taxNumber', compData.taxNumber);
      if (dupTax.isDuplicate) {
        return { success: false, error: `Tax Registration Number (TRN) "${compData.taxNumber}" is already assigned to "${dupTax.matchedCompany?.legalName}".` };
      }
    }

    // 6. Financial & Capital constraints
    if (compData.capitalAuthorized && compData.capitalPaidUp && compData.capitalPaidUp > compData.capitalAuthorized) {
      return { success: false, error: 'Paid-up Capital cannot exceed Authorized Share Capital.' };
    }

    const newId = `comp-${Date.now().toString().slice(-4)}`;
    const dateStr = new Date().toISOString().split('T')[0];

    const initialHistory: CompanyHistoryRecord[] = [
      {
        id: `hist-${Date.now().toString().slice(-4)}-1`,
        companyId: newId,
        fieldChanged: 'Entity Inception',
        oldValue: 'None',
        newValue: `${cleanCode} - ${compData.legalName}`,
        changeReason: 'Initial statutory company incorporation in ERP master',
        changedBy: user?.name || 'Administrator',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
        documentRef: compData.registrationNumber || 'INCORP-INIT'
      }
    ];

    const newCompany = {
      ...compData,
      id: newId,
      code: cleanCode,
      version: 1,
      history: initialHistory,
      attachments: compData.attachments || [],
      status: compData.status || 'Active',
      createdAt: dateStr,
      updatedAt: dateStr
    } as Company;

    setCompanies(prev => [...prev, newCompany]);

    logAuditEvent({
      userId: user?.id || 'usr-admin',
      userName: user?.name || 'Administrator',
      userRole: user?.role || 'Super Admin',
      action: 'CREATE',
      module: '01.01.01 Company Setup',
      entity: 'Company',
      recordId: newId,
      newValue: `${newCompany.code} (${newCompany.legalName}) [${newCompany.country}]`,
      result: 'SUCCESS',
      details: `Registered legal entity ${newCompany.code} (${newCompany.companyType}, ${newCompany.currency}, CR: ${newCompany.registrationNumber || 'N/A'})`
    });

    setBanner(`Legal Entity "${newCompany.legalName}" (${newCompany.code}) registered successfully.`);
    return { success: true, id: newId };
  };

  const updateCompany = (
    id: string,
    patch: Partial<Company>,
    reason?: string,
    user?: { id: string; name: string; role?: string }
  ): { success: boolean; error?: string } => {
    const existing = companies.find(c => c.id === id);
    if (!existing) return { success: false, error: 'Company record not found.' };

    // Code change check
    if (patch.code && patch.code.trim().toUpperCase() !== existing.code.toUpperCase()) {
      const cleanCode = patch.code.trim().toUpperCase();
      const dupCode = checkDuplicateCompany('code', cleanCode, id);
      if (dupCode.isDuplicate) {
        return { success: false, error: `Company Code "${cleanCode}" is already in use by "${dupCode.matchedCompany?.legalName}".` };
      }
    }

    // CR Number duplicate check
    if (patch.registrationNumber && patch.registrationNumber.trim() !== existing.registrationNumber) {
      const dupCR = checkDuplicateCompany('registrationNumber', patch.registrationNumber, id);
      if (dupCR.isDuplicate) {
        return { success: false, error: `Commercial Registration "${patch.registrationNumber}" is already in use by "${dupCR.matchedCompany?.legalName}".` };
      }
    }

    // Tax Number duplicate check
    if (patch.taxNumber && patch.taxNumber.trim() !== existing.taxNumber) {
      const dupTax = checkDuplicateCompany('taxNumber', patch.taxNumber, id);
      if (dupTax.isDuplicate) {
        return { success: false, error: `Tax Number "${patch.taxNumber}" is already in use by "${dupTax.matchedCompany?.legalName}".` };
      }
    }

    // Capital check
    const newAuthCap = patch.capitalAuthorized !== undefined ? patch.capitalAuthorized : existing.capitalAuthorized;
    const newPaidCap = patch.capitalPaidUp !== undefined ? patch.capitalPaidUp : existing.capitalPaidUp;
    if (newAuthCap && newPaidCap && newPaidCap > newAuthCap) {
      return { success: false, error: 'Paid-up capital cannot exceed authorized capital.' };
    }

    const dateStr = new Date().toISOString().split('T')[0];
    const timestampStr = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

    // Generate history records for critical fields
    const historyDeltas: CompanyHistoryRecord[] = [];
    const fieldsToTrack: (keyof Company)[] = [
      'legalName',
      'tradingName',
      'registrationNumber',
      'taxNumber',
      'currency',
      'fiscalYearStartMonth',
      'capitalAuthorized',
      'capitalPaidUp',
      'statutoryAuditor',
      'taxScheme',
      'brandColor',
      'status'
    ];

    fieldsToTrack.forEach(field => {
      if (patch[field] !== undefined && patch[field] !== existing[field]) {
        historyDeltas.push({
          id: `hist-${Date.now().toString().slice(-4)}-${Math.floor(mockRandom() * 900 + 100)}`,
          companyId: id,
          fieldChanged: String(field),
          oldValue: String(existing[field] || 'None'),
          newValue: String(patch[field] || 'None'),
          changeReason: reason || 'Statutory/Operational update via Company Setup master console',
          changedBy: user?.name || 'Administrator',
          timestamp: timestampStr
        });
      }
    });

    const updatedCompany: Company = {
      ...existing,
      ...patch,
      code: patch.code ? patch.code.trim().toUpperCase() : existing.code,
      version: (existing.version || 1) + 1,
      history: [...historyDeltas, ...(existing.history || [])],
      updatedAt: dateStr
    };

    setCompanies(prev => prev.map(c => (c.id === id ? updatedCompany : c)));

    logAuditEvent({
      userId: user?.id || 'usr-admin',
      userName: user?.name || 'Administrator',
      userRole: user?.role || 'Super Admin',
      action: 'UPDATE',
      module: '01.01.01 Company Setup',
      entity: 'Company',
      recordId: id,
      previousValue: JSON.stringify({ legalName: existing.legalName, code: existing.code, status: existing.status, currency: existing.currency }),
      newValue: JSON.stringify({ legalName: updatedCompany.legalName, code: updatedCompany.code, status: updatedCompany.status, currency: updatedCompany.currency }),
      result: 'SUCCESS',
      details: `Updated company master attributes for ${existing.code} (${historyDeltas.length} tracked fields updated)`
    });

    setBanner(`Legal entity "${updatedCompany.legalName}" (${updatedCompany.code}) updated.`);
    return { success: true };
  };

  const archiveCompany = (id: string, user?: { id: string; name: string }): { success: boolean; error?: string } => {
    const comp = companies.find(c => c.id === id);
    if (!comp) return { success: false, error: 'Company not found.' };

    if (comp.isParent || comp.isHolding) {
      return { success: false, error: 'Apex Holding entity cannot be archived while holding group is active.' };
    }

    // Check if company has active branches
    const activeBranches = branches.filter(b => b.companyId === id && b.status === 'Active');
    if (activeBranches.length > 0) {
      return { success: false, error: `Cannot archive entity "${comp.code}" with ${activeBranches.length} active operational branches. Deactivate branches first.` };
    }

    const dateStr = new Date().toISOString().split('T')[0];
    const timestampStr = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

    const archiveHistory: CompanyHistoryRecord = {
      id: `hist-${Date.now().toString().slice(-4)}-arch`,
      companyId: id,
      fieldChanged: 'status',
      oldValue: comp.status,
      newValue: 'Archived',
      changeReason: 'Entity formally marked as Archived / Decommissioned',
      changedBy: user?.name || 'Administrator',
      timestamp: timestampStr
    };

    setCompanies(prev =>
      prev.map(c =>
        c.id === id
          ? {
              ...c,
              status: 'Archived',
              version: (c.version || 1) + 1,
              history: [archiveHistory, ...(c.history || [])],
              updatedAt: dateStr
            }
          : c
      )
    );

    logAuditEvent({
      userId: user?.id || 'usr-admin',
      userName: user?.name || 'Administrator',
      userRole: 'Super Admin',
      action: 'UPDATE',
      module: '01.01.01 Company Setup',
      entity: 'Company',
      recordId: id,
      newValue: 'status: Archived',
      result: 'SUCCESS',
      details: `Archived company record ${comp.code} - ${comp.legalName}`
    });

    setBanner(`Legal entity "${comp.legalName}" marked as Archived.`);
    return { success: true };
  };

  const submitCompanyForApproval = (
    id: string,
    user: { id: string; name: string; role: string }
  ): { success: boolean; error?: string } => {
    const comp = companies.find(c => c.id === id);
    if (!comp) return { success: false, error: 'Company not found.' };

    if (comp.status !== 'Draft') {
      return { success: false, error: `Only Draft legal entities can be submitted for approval. Current status is ${comp.status}.` };
    }

    const dateStr = new Date().toISOString().split('T')[0];
    const timestampStr = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

    const submitHistory: CompanyHistoryRecord = {
      id: `hist-${Date.now().toString().slice(-4)}-sub`,
      companyId: id,
      fieldChanged: 'status',
      oldValue: 'Draft',
      newValue: 'Pending Approval',
      changeReason: 'Submitted for Corporate Board / Statutory Officer Review',
      changedBy: user.name,
      timestamp: timestampStr
    };

    setCompanies(prev =>
      prev.map(c =>
        c.id === id
          ? {
              ...c,
              status: 'Pending Approval',
              submittedAt: dateStr,
              submittedBy: user.name,
              history: [submitHistory, ...(c.history || [])],
              updatedAt: dateStr
            }
          : c
      )
    );

    logAuditEvent({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'UPDATE',
      module: '01.01.01 Company Setup',
      entity: 'Company',
      recordId: id,
      newValue: 'status: Pending Approval',
      result: 'SUCCESS',
      details: `Submitted legal entity registration ${comp.code} for statutory approval`
    });

    setBanner(`Company "${comp.legalName}" submitted for governance approval.`);
    return { success: true };
  };

  const approveCompany = (
    id: string,
    approver: { id: string; name: string; role: string },
    comments?: string
  ): { success: boolean; error?: string } => {
    const comp = companies.find(c => c.id === id);
    if (!comp) return { success: false, error: 'Company not found.' };

    // Segregation of Duties (SoD) check: submitter cannot self-approve
    if (comp.submittedBy && comp.submittedBy.toLowerCase() === approver.name.toLowerCase()) {
      return {
        success: false,
        error: 'Segregation of Duties (SoD) Violation: The user who submitted the company setup cannot approve it. A separate compliance or financial officer must approve.'
      };
    }

    const dateStr = new Date().toISOString().split('T')[0];
    const timestampStr = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

    const approveHistory: CompanyHistoryRecord = {
      id: `hist-${Date.now().toString().slice(-4)}-appr`,
      companyId: id,
      fieldChanged: 'status',
      oldValue: comp.status,
      newValue: 'Active',
      changeReason: `Statutory approval granted: ${comments || 'Commercial registration & tax parameters validated.'}`,
      changedBy: approver.name,
      timestamp: timestampStr
    };

    setCompanies(prev =>
      prev.map(c =>
        c.id === id
          ? {
              ...c,
              status: 'Active',
              approvedAt: dateStr,
              approvedBy: approver.name,
              approvalComments: comments || 'Approved',
              rejectionReason: undefined,
              history: [approveHistory, ...(c.history || [])],
              updatedAt: dateStr
            }
          : c
      )
    );

    logAuditEvent({
      userId: approver.id,
      userName: approver.name,
      userRole: approver.role,
      action: 'APPROVE',
      module: '01.01.01 Company Setup',
      entity: 'Company',
      recordId: id,
      newValue: 'status: Active (Approved)',
      result: 'SUCCESS',
      details: `Approved company master ${comp.code} (${comp.legalName}). Comments: ${comments || 'None'}`
    });

    setBanner(`Legal entity "${comp.legalName}" (${comp.code}) has been approved and activated.`);
    return { success: true };
  };

  const rejectCompany = (
    id: string,
    rejector: { id: string; name: string; role: string },
    reason: string
  ): { success: boolean; error?: string } => {
    const comp = companies.find(c => c.id === id);
    if (!comp) return { success: false, error: 'Company not found.' };

    if (!reason || !reason.trim()) {
      return { success: false, error: 'Rejection reason is mandatory.' };
    }

    const dateStr = new Date().toISOString().split('T')[0];
    const timestampStr = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

    const rejectHistory: CompanyHistoryRecord = {
      id: `hist-${Date.now().toString().slice(-4)}-rej`,
      companyId: id,
      fieldChanged: 'status',
      oldValue: comp.status,
      newValue: 'Draft (Returned)',
      changeReason: `Submission rejected: ${reason}`,
      changedBy: rejector.name,
      timestamp: timestampStr
    };

    setCompanies(prev =>
      prev.map(c =>
        c.id === id
          ? {
              ...c,
              status: 'Draft',
              rejectionReason: reason,
              history: [rejectHistory, ...(c.history || [])],
              updatedAt: dateStr
            }
          : c
      )
    );

    logAuditEvent({
      userId: rejector.id,
      userName: rejector.name,
      userRole: rejector.role,
      action: 'REJECT',
      module: '01.01.01 Company Setup',
      entity: 'Company',
      recordId: id,
      newValue: `status: Draft (Rejected: ${reason})`,
      result: 'SUCCESS',
      details: `Returned company submission ${comp.code} to Draft. Reason: ${reason}`
    });

    setBanner(`Company submission "${comp.legalName}" returned to Draft with feedback.`, 'warning');
    return { success: true };
  };

  const toggleCompanyStatus = (
    id: string,
    newStatus: Company['status'],
    user?: { id: string; name: string }
  ): { success: boolean; error?: string } => {
    const comp = companies.find(c => c.id === id);
    if (!comp) return { success: false, error: 'Company not found.' };

    const dateStr = new Date().toISOString().split('T')[0];
    const timestampStr = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

    const statusHistory: CompanyHistoryRecord = {
      id: `hist-${Date.now().toString().slice(-4)}-st`,
      companyId: id,
      fieldChanged: 'status',
      oldValue: comp.status,
      newValue: newStatus,
      changeReason: `Status toggled to ${newStatus}`,
      changedBy: user?.name || 'Administrator',
      timestamp: timestampStr
    };

    setCompanies(prev =>
      prev.map(c =>
        c.id === id
          ? {
              ...c,
              status: newStatus,
              history: [statusHistory, ...(c.history || [])],
              updatedAt: dateStr
            }
          : c
      )
    );

    logAuditEvent({
      userId: user?.id || 'usr-admin',
      userName: user?.name || 'Administrator',
      userRole: 'Super Admin',
      action: 'UPDATE',
      module: '01.01.01 Company Setup',
      entity: 'Company',
      recordId: id,
      previousValue: `status: ${comp.status}`,
      newValue: `status: ${newStatus}`,
      result: 'SUCCESS',
      details: `Changed status of ${comp.code} from ${comp.status} to ${newStatus}`
    });

    setBanner(`Company "${comp.legalName}" status updated to ${newStatus}.`);
    return { success: true };
  };

  const addCompanyAttachment = (
    companyId: string,
    attachment: Omit<CompanyAttachment, 'id' | 'uploadedAt'>,
    user?: { id: string; name: string }
  ): { success: boolean; error?: string } => {
    const comp = companies.find(c => c.id === companyId);
    if (!comp) return { success: false, error: 'Company not found.' };

    const attId = `att-${Date.now().toString().slice(-4)}`;
    const dateStr = new Date().toISOString().split('T')[0];

    const fullAttachment: CompanyAttachment = {
      ...attachment,
      id: attId,
      uploadedAt: dateStr,
      uploadedBy: user?.name || attachment.uploadedBy || 'Administrator'
    };

    setCompanies(prev =>
      prev.map(c => {
        if (c.id === companyId) {
          const current = c.attachments || [];
          return {
            ...c,
            attachments: [...current, fullAttachment],
            updatedAt: dateStr
          };
        }
        return c;
      })
    );

    logAuditEvent({
      userId: user?.id || 'usr-admin',
      userName: user?.name || 'Administrator',
      userRole: 'Super Admin',
      action: 'CREATE',
      module: '01.01.01 Company Setup',
      entity: 'CompanyAttachment',
      recordId: attId,
      newValue: fullAttachment.name,
      result: 'SUCCESS',
      details: `Uploaded filing document "${fullAttachment.name}" (${fullAttachment.category}) for ${comp.code}`
    });

    setBanner(`Document "${fullAttachment.name}" attached successfully.`);
    return { success: true };
  };

  const removeCompanyAttachment = (
    companyId: string,
    attachmentId: string,
    user?: { id: string; name: string }
  ): { success: boolean; error?: string } => {
    const comp = companies.find(c => c.id === companyId);
    if (!comp) return { success: false, error: 'Company not found.' };

    const targetAtt = (comp.attachments || []).find(a => a.id === attachmentId);

    setCompanies(prev =>
      prev.map(c => {
        if (c.id === companyId) {
          return {
            ...c,
            attachments: (c.attachments || []).filter(a => a.id !== attachmentId),
            updatedAt: new Date().toISOString().split('T')[0]
          };
        }
        return c;
      })
    );

    logAuditEvent({
      userId: user?.id || 'usr-admin',
      userName: user?.name || 'Administrator',
      userRole: 'Super Admin',
      action: 'DELETE',
      module: '01.01.01 Company Setup',
      entity: 'CompanyAttachment',
      recordId: attachmentId,
      newValue: 'REMOVED',
      result: 'SUCCESS',
      details: `Removed filing document "${targetAtt?.name || attachmentId}" from ${comp.code}`
    });

    setBanner(`Document removed.`);
    return { success: true };
  };

  const extractCompanyWithAI = async (rawTextOrDocument: string): Promise<Partial<Company>> => {
    await new Promise(r => setTimeout(r, 800));
    return {
      code: 'GH-CLEAN-ENERGY',
      legalName: 'Gulf Horizon Clean Energy SAOC',
      tradingName: 'Horizon Clean Energy',
      shortName: 'Horizon Energy',
      companyType: 'Subsidiary',
      legalStructure: 'Closed Joint Stock Company (SAOC)',
      industrySegment: 'Renewable Power & Clean Utility Solutions',
      registrationNumber: 'CR-4829103',
      registrationDate: '2023-01-10',
      taxNumber: 'OM-VAT-40082910',
      taxAuthority: 'Oman Tax Authority (OTA)',
      commercialRegistryOffice: 'MOCIIP Muscat Office',
      chamberOfCommerceNumber: 'OCCI-MUS-5820',
      capitalAuthorized: 15000000,
      capitalPaidUp: 15000000,
      parValuePerShare: 1.000,
      totalShares: 15000000,
      country: 'Oman',
      state: 'Muscat Governorate',
      city: 'Muscat',
      address: 'Way 2110, Knowledge Oasis Muscat (KOM 4), Office 204',
      postalCode: 'PC 130',
      phone: '+968 2415 6700',
      email: 'info@horizon-energy.om',
      website: 'https://cleanenergy.horizon.om',
      currency: 'OMR',
      secondaryCurrency: 'USD',
      fiscalYearStart: '2026-01-01',
      fiscalYearStartMonth: 1,
      timeZone: 'Asia/Muscat (GMT+4)',
      dateFormat: 'YYYY-MM-DD',
      taxScheme: 'Standard VAT 5%',
      corporateTaxRate: 15,
      vatRate: 5,
      managingDirectorName: 'Eng. Badar Al-Kiyumi',
      cfoName: 'Huda Al-Mamari',
      statutoryAuditor: 'Ernst & Young (EY Oman)',
      brandColor: '#059669',
      brandSecondaryColor: '#10b981'
    };
  };

  const generateCompanyProfileSummaryAI = async (companyId: string): Promise<string> => {
    const comp = companies.find(c => c.id === companyId) || companies[0];
    const compBranches = branches.filter(b => b.companyId === comp.id);
    const compDepts = departments.filter(d => d.companyId === comp.id);

    let summary = `**Executive Profile & Statutory Master Briefing: ${comp.legalName} (${comp.code})**\n\n`;
    summary += `• **Statutory Identity**: Registered under **${comp.legalStructure || comp.companyType}** with CR Number **${comp.registrationNumber}** (${comp.taxAuthority || 'Tax Authority'}). Tax TRN is **${comp.taxNumber}**.\n`;
    summary += `• **Capital Structure**: Authorized Share Capital of **${comp.capitalAuthorized ? comp.capitalAuthorized.toLocaleString() : 'N/A'} ${comp.currency}** (Paid-up: ${comp.capitalPaidUp ? comp.capitalPaidUp.toLocaleString() : 'N/A'} ${comp.currency} across ${comp.totalShares ? comp.totalShares.toLocaleString() : 'N/A'} shares @ ${comp.parValuePerShare || 1} ${comp.currency}/share).\n`;
    summary += `• **Financial & Fiscal Regimen**: Base Operating Currency **${comp.currency}** (Secondary: ${comp.secondaryCurrency || 'USD'}). Fiscal calendar begins month **${comp.fiscalYearStartMonth || 1}** with **${comp.taxScheme || 'Standard VAT 5%'}** (Corporate Tax: ${comp.corporateTaxRate || 15}%, VAT: ${comp.vatRate || 5}%).\n`;
    summary += `• **Operational Footprint**: **${compBranches.length} Active Branches** (${compBranches.map(b => b.name).join(', ') || 'Head Office only'}) and **${compDepts.length} Segment Cost Center Departments**.\n`;
    summary += `• **Governance & Leadership**: Managing Director: **${comp.managingDirectorName || 'Executive Board'}**, CFO: **${comp.cfoName || 'Unassigned'}**, Independent Statutory Auditor: **${comp.statutoryAuditor || 'Appointed Auditor'}**.\n`;
    summary += `• **Lifecycle Status**: Currently **${comp.status}** (Version ${comp.version || 1}). ${comp.attachments?.length || 0} statutory regulatory filings archived.`;

    return summary;
  };

  const addBranch = (br: Partial<Omit<Branch, 'id' | 'createdAt'>>) => {
    const newId = `br-${branches.length + 1}`;
    const newBranch = {
      ...br,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0]
    } as Branch;
    setBranches(prev => [...prev, newBranch]);
    logAuditEvent({
      userId: 'usr-admin',
      userName: 'Administrator',
      userRole: 'Super Admin',
      action: 'CREATE',
      module: '01.01 Organization Setup',
      entity: 'Branch',
      recordId: newId,
      newValue: `${newBranch.code} - ${newBranch.name}`,
      result: 'SUCCESS',
      details: `Provisioned branch ${newBranch.code} under ${newBranch.companyName}`
    });
    setBanner(`Branch "${newBranch.name}" created successfully.`);
  };

  const updateBranch = (id: string, patch: Partial<Branch>) => {
    setBranches(prev => prev.map(b => (b.id === id ? { ...b, ...patch } : b)));
    setBanner(`Branch ${id} updated.`);
  };

  const addDepartment = (dept: Partial<Omit<Department, 'id'>>) => {
    const newId = `dept-${departments.length + 1}`;
    const newDept = { ...dept, id: newId } as Department;
    setDepartments(prev => [...prev, newDept]);
    logAuditEvent({
      userId: 'usr-admin',
      userName: 'Administrator',
      userRole: 'Super Admin',
      action: 'CREATE',
      module: '01.01 Organization Setup',
      entity: 'Department',
      recordId: newId,
      newValue: `${newDept.code} - ${newDept.name}`,
      result: 'SUCCESS',
      details: `Created department ${newDept.code} with Cost Center ${newDept.costCenterCode}`
    });
    setBanner(`Department "${newDept.name}" registered.`);
  };

  const updateDepartment = (id: string, patch: Partial<Department>) => {
    setDepartments(prev => prev.map(d => (d.id === id ? { ...d, ...patch } : d)));
    setBanner(`Department ${id} updated.`);
  };

  const addLocation = (loc: Omit<Location, 'id'>) => {
    const newId = `loc-${locations.length + 1}`;
    const newLoc: Location = { ...loc, id: newId };
    setLocations(prev => [...prev, newLoc]);
    setBanner(`Location "${newLoc.name}" configured.`);
  };

  const updateLocation = (id: string, patch: Partial<Location>) => {
    setLocations(prev => prev.map(l => (l.id === id ? { ...l, ...patch } : l)));
    setBanner(`Location ${id} updated.`);
  };

  const addOperatingUnit = (ou: Partial<Omit<OperatingUnit, 'id'>>) => {
    const newId = `ou-${operatingUnits.length + 1}`;
    const newOu = { ...ou, id: newId } as OperatingUnit;
    setOperatingUnits(prev => [...prev, newOu]);
    setBanner(`Operating Unit "${newOu.name}" added.`);
  };

  const updateOperatingUnit = (id: string, patch: Partial<OperatingUnit>) => {
    setOperatingUnits(prev => prev.map(o => (o.id === id ? { ...o, ...patch } : o)));
    setBanner(`Operating unit ${id} updated.`);
  };

  // 01.02 User & Access Handlers
  const addUser = (usr: Partial<Omit<UserAccount, 'id' | 'createdAt'>>) => {
    const newId = `usr-${users.length + 1}`;
    const newUser = {
      ...usr,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0]
    } as UserAccount;
    setUsers(prev => [...prev, newUser]);
    logAuditEvent({
      userId: 'usr-admin',
      userName: 'Administrator',
      userRole: 'Super Admin',
      action: 'CREATE',
      module: '01.02 User & Access Management',
      entity: 'UserAccount',
      recordId: newId,
      newValue: `${newUser.username} (${newUser.fullName}) - Role: ${newUser.roleName}`,
      result: 'SUCCESS',
      details: `Provisioned user ${newUser.username} with ${newUser.authMethod} authentication.`
    });
    setBanner(`User account "${newUser.fullName}" (${newUser.username}) created.`);
  };

  const updateUser = (id: string, patch: Partial<UserAccount>) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === id) {
          const updated = { ...u, ...patch };
          logAuditEvent({
            userId: 'usr-admin',
            userName: 'Administrator',
            userRole: 'Super Admin',
            action: 'UPDATE',
            module: '01.02 User & Access Management',
            entity: 'UserAccount',
            recordId: id,
            previousValue: `Role: ${u.roleName}, Status: ${u.status}`,
            newValue: `Role: ${updated.roleName}, Status: ${updated.status}`,
            result: 'SUCCESS',
            details: `Modified access permissions or status for user ${u.username}`
          });
          return updated;
        }
        return u;
      })
    );
    setBanner(`User profile updated.`);
  };

  const toggleUserLock = (id: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === id) {
          const newStatus = u.status === 'Locked' ? 'Active' : 'Locked';
          logAuditEvent({
            userId: 'usr-admin',
            userName: 'Administrator',
            userRole: 'Super Admin',
            action: newStatus === 'Locked' ? 'LOCK' : 'UNLOCK',
            module: '01.02 User & Access Management',
            entity: 'UserAccount',
            recordId: id,
            newValue: `status: ${newStatus}`,
            result: 'SUCCESS',
            details: `${newStatus === 'Locked' ? 'Locked' : 'Unlocked'} user account ${u.username}`
          });
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
    setBanner(`User account status updated.`);
  };

  const resetUserPassword = (id: string) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    logAuditEvent({
      userId: 'usr-admin',
      userName: 'Administrator',
      userRole: 'Super Admin',
      action: 'UPDATE',
      module: '01.02 User & Access Management',
      entity: 'UserAccount',
      recordId: id,
      newValue: 'Temporary credential reset token generated',
      result: 'SUCCESS',
      details: `Dispatched secure password reset link to ${user.email}`
    });
    setBanner(`Secure credential reset email dispatched to ${user.email}.`);
  };

  const addUserGroup = (grp: Omit<UserGroup, 'id' | 'createdAt'>) => {
    const newId = `grp-${userGroups.length + 1}`;
    const newGroup: UserGroup = {
      ...grp,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUserGroups(prev => [...prev, newGroup]);
    setBanner(`User group "${newGroup.name}" created.`);
  };

  const updateUserGroup = (id: string, patch: Partial<UserGroup>) => {
    setUserGroups(prev => prev.map(g => (g.id === id ? { ...g, ...patch } : g)));
    setBanner(`User group updated.`);
  };

  const addSoDException = (ruleId: string, exception: { userId: string; userName: string; reason: string; expiresAt: string }) => {
    setSodRules(prev =>
      prev.map(r => {
        if (r.id === ruleId) {
          const newExc = {
            id: `exc-${Date.now().toString().slice(-4)}`,
            userId: exception.userId,
            userName: exception.userName,
            approvedBy: 'Sarah Jenkins (CFO Approval)',
            reason: exception.reason,
            expiresAt: exception.expiresAt,
            status: 'Active' as const
          };
          logAuditEvent({
            userId: 'usr-admin',
            userName: 'Administrator',
            userRole: 'Super Admin',
            action: 'APPROVE',
            module: '01.02 User & Access Management',
            entity: 'SoDRule',
            recordId: ruleId,
            newValue: `Granted exception to ${exception.userName} until ${exception.expiresAt}`,
            result: 'SUCCESS',
            details: `Approved Segregation of Duties waiver for ${r.code}: ${exception.reason}`
          });
          return {
            ...r,
            exceptions: [...r.exceptions, newExc]
          };
        }
        return r;
      })
    );
    setBanner(`SoD Exception recorded and logged in compliance audit trail.`);
  };

  const toggleSoDRule = (ruleId: string) => {
    setSodRules(prev =>
      prev.map(r => (r.id === ruleId ? { ...r, status: r.status === 'Enforced' ? 'Warning Only' : 'Enforced' } : r))
    );
    setBanner(`SoD enforcement rule policy toggled.`);
  };

  const addAccessRestriction = (ar: Partial<Omit<AccessRestriction, 'id'>>) => {
    const newId = `ar-${accessRestrictions.length + 1}`;
    setAccessRestrictions(prev => [...prev, { ...ar, id: newId } as AccessRestriction]);
    setBanner(`Access policy rule added.`);
  };

  const updateAccessRestriction = (id: string, patch: Partial<AccessRestriction>) => {
    setAccessRestrictions(prev => prev.map(a => (a.id === id ? { ...a, ...patch } : a)));
    setBanner(`Access policy updated.`);
  };

  // 01.03 Workflow Handlers
  const addWorkflow = (wf: Partial<Omit<ApprovalWorkflow, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const newId = `wf-${workflows.length + 1}`;
    const dateStr = new Date().toISOString().split('T')[0];
    const newWorkflow = {
      ...wf,
      id: newId,
      createdAt: dateStr,
      updatedAt: dateStr
    } as ApprovalWorkflow;
    setWorkflows(prev => [...prev, newWorkflow]);
    logAuditEvent({
      userId: 'usr-admin',
      userName: 'Administrator',
      userRole: 'Super Admin',
      action: 'CREATE',
      module: '01.03 Workflow & Approval Management',
      entity: 'ApprovalWorkflow',
      recordId: newId,
      newValue: `${newWorkflow.code} - ${newWorkflow.name}`,
      result: 'SUCCESS',
      details: `Configured new approval pipeline with ${newWorkflow.stages.length} stages for ${newWorkflow.module}`
    });
    setBanner(`Approval workflow "${newWorkflow.name}" activated.`);
  };

  const updateWorkflow = (id: string, patch: Partial<ApprovalWorkflow>) => {
    setWorkflows(prev => prev.map(w => (w.id === id ? { ...w, ...patch, updatedAt: new Date().toISOString().split('T')[0] } : w)));
    setBanner(`Workflow definition updated.`);
  };

  const addApprovalMatrixRule = (rule: Partial<Omit<ApprovalMatrixRule, 'id'>>) => {
    const newId = `am-${approvalMatrices.length + 1}`;
    setApprovalMatrices(prev => [...prev, { ...rule, id: newId } as ApprovalMatrixRule]);
    setBanner(`Approval matrix threshold tier registered.`);
  };

  const updateApprovalMatrixRule = (id: string, patch: Partial<ApprovalMatrixRule>) => {
    setApprovalMatrices(prev => prev.map(a => (a.id === id ? { ...a, ...patch } : a)));
    setBanner(`Approval matrix rule updated.`);
  };

  const addDelegation = (del: Partial<Omit<DelegationOfAuthority, 'id'>>) => {
    const newId = `doa-${delegations.length + 1}`;
    const newDoa = { ...del, id: newId } as DelegationOfAuthority;
    setDelegations(prev => [...prev, newDoa]);
    logAuditEvent({
      userId: 'usr-admin',
      userName: 'Administrator',
      userRole: 'Super Admin',
      action: 'APPROVE',
      module: '01.03 Workflow & Approval Management',
      entity: 'DelegationOfAuthority',
      recordId: newId,
      newValue: `${newDoa.delegatorName} -> ${newDoa.delegateName} (${newDoa.startDate} to ${newDoa.endDate})`,
      result: 'SUCCESS',
      details: `Approved authority proxy delegation up to ${newDoa.maxApprovalLimitOMR} OMR: ${newDoa.reason}`
    });
    setBanner(`Authority delegation from ${newDoa.delegatorName} to ${newDoa.delegateName} scheduled.`);
  };

  const revokeDelegation = (id: string) => {
    setDelegations(prev => prev.map(d => (d.id === id ? { ...d, status: 'Revoked' } : d)));
    logAuditEvent({
      userId: 'usr-admin',
      userName: 'Administrator',
      userRole: 'Super Admin',
      action: 'REVOKE',
      module: '01.03 Workflow & Approval Management',
      entity: 'DelegationOfAuthority',
      recordId: id,
      newValue: 'status: Revoked',
      result: 'SUCCESS',
      details: `Revoked authority proxy delegation ${id}`
    });
    setBanner(`Delegation ${id} revoked immediately.`);
  };

  const addApprovalLimit = (lim: Omit<ApprovalLimit, 'id'>) => {
    const newId = `lim-${approvalLimits.length + 1}`;
    setApprovalLimits(prev => [...prev, { ...lim, id: newId }]);
    setBanner(`Approval threshold limit configured.`);
  };

  const updateApprovalLimit = (id: string, patch: Partial<ApprovalLimit>) => {
    setApprovalLimits(prev => prev.map(l => (l.id === id ? { ...l, ...patch } : l)));
    setBanner(`Approval limit updated.`);
  };

  const addEscalationRule = (rule: Partial<Omit<EscalationRule, 'id'>>) => {
    const newId = `esc-${escalationRules.length + 1}`;
    setEscalationRules(prev => [...prev, { ...rule, id: newId } as EscalationRule]);
    setBanner(`Workflow escalation SLA rule added.`);
  };

  const updateEscalationRule = (id: string, patch: Partial<EscalationRule>) => {
    setEscalationRules(prev => prev.map(e => (e.id === id ? { ...e, ...patch } : e)));
    setBanner(`Escalation rule updated.`);
  };

  // 01.04 Financial Controls Handlers
  const addFiscalYear = (fy: Omit<FiscalYear, 'id'>) => {
    const newId = `fy-${fy.yearCode.toLowerCase()}`;
    const newFy: FiscalYear = { ...fy, id: newId };
    setFiscalYears(prev => [...prev, newFy]);
    logAuditEvent({
      userId: 'usr-admin',
      userName: 'Administrator',
      userRole: 'Super Admin',
      action: 'CREATE',
      module: '01.04 Financial & Period Controls',
      entity: 'FiscalYear',
      recordId: newId,
      newValue: `${newFy.yearCode} (${newFy.startDate} - ${newFy.endDate})`,
      result: 'SUCCESS',
      details: `Configured financial accounting year ${newFy.yearCode}`
    });
    setBanner(`Fiscal Year ${newFy.yearCode} created.`);
  };

  const togglePostingPeriodSubLedger = (
    periodId: string,
    ledgerKey: 'gl' | 'ap' | 'ar' | 'inventory' | 'fixedAssets' | 'payroll',
    newStatus: 'Open' | 'Closed' | 'Locked'
  ) => {
    setPostingPeriods(prev =>
      prev.map(p => {
        if (p.id === periodId) {
          const updatedLedgers = { ...p.subLedgers, [ledgerKey]: newStatus };
          const allClosed = Object.values(updatedLedgers).every(s => s === 'Closed');
          const allLocked = Object.values(updatedLedgers).every(s => s === 'Locked');
          const updatedOverall = allLocked ? 'Locked' : allClosed ? 'Closed' : 'Open';

          logAuditEvent({
            userId: 'usr-cfo',
            userName: 'Sarah Jenkins',
            userRole: 'CFO / Group Financial Officer',
            action: newStatus === 'Open' ? 'UNLOCK' : 'LOCK',
            module: '01.04 Financial & Period Controls',
            entity: 'PostingPeriod',
            recordId: periodId,
            previousValue: `${ledgerKey}: ${p.subLedgers[ledgerKey]}`,
            newValue: `${ledgerKey}: ${newStatus}`,
            result: 'SUCCESS',
            details: `Modified sub-ledger ${ledgerKey.toUpperCase()} posting status for ${p.periodName} to ${newStatus}`
          });

          return {
            ...p,
            subLedgers: updatedLedgers,
            overallStatus: updatedOverall
          };
        }
        return p;
      })
    );
    setBanner(`Sub-ledger ${ledgerKey.toUpperCase()} updated for period ${periodId}.`);
  };

  const lockOrUnlockPeriod = (periodId: string, action: 'lock' | 'unlock', reason: string) => {
    setPostingPeriods(prev =>
      prev.map(p => {
        if (p.id === periodId) {
          const newStatus = action === 'lock' ? 'Locked' : 'Open';
          const newLedgerStatus = action === 'lock' ? 'Locked' : 'Open';
          logAuditEvent({
            userId: 'usr-cfo',
            userName: 'Sarah Jenkins',
            userRole: 'CFO / Group Financial Officer',
            action: action === 'lock' ? 'LOCK' : 'UNLOCK',
            module: '01.04 Financial & Period Controls',
            entity: 'PostingPeriod',
            recordId: periodId,
            newValue: `overallStatus: ${newStatus}`,
            result: 'SUCCESS',
            details: `${action.toUpperCase()} period ${p.periodName}. Reason: ${reason}`
          });
          return {
            ...p,
            overallStatus: newStatus,
            subLedgers: {
              gl: newLedgerStatus,
              ap: newLedgerStatus,
              ar: newLedgerStatus,
              inventory: newLedgerStatus,
              fixedAssets: newLedgerStatus,
              payroll: newLedgerStatus
            }
          };
        }
        return p;
      })
    );
    setBanner(`Period ${periodId} successfully ${action === 'lock' ? 'locked' : 'unlocked'}.`);
  };

  const addDocumentSequence = (seq: Partial<Omit<DocumentSequence, 'id'>>) => {
    const newId = `seq-${documentSequences.length + 1}`;
    setDocumentSequences(prev => [...prev, { ...seq, id: newId } as DocumentSequence]);
    setBanner(`Numbering sequence for ${seq.documentTypeName} created.`);
  };

  const updateDocumentSequence = (id: string, patch: Partial<DocumentSequence>) => {
    setDocumentSequences(prev => prev.map(s => (s.id === id ? { ...s, ...patch } : s)));
    setBanner(`Numbering series updated.`);
  };

  const updatePostingControls = (patch: Partial<PostingControl>) => {
    setPostingControls(prev => {
      const updated = { ...prev, ...patch };
      logAuditEvent({
        userId: 'usr-cfo',
        userName: 'Sarah Jenkins',
        userRole: 'CFO / Group Financial Officer',
        action: 'CONFIG_CHANGE',
        module: '01.04 Financial & Period Controls',
        entity: 'PostingControl',
        recordId: prev.id,
        newValue: JSON.stringify(patch),
        result: 'SUCCESS',
        details: `Updated General Ledger posting control policies.`
      });
      return updated;
    });
    setBanner(`General Ledger posting controls updated.`);
  };

  const requestPeriodUnlock = (periodId: string, reason: string) => {
    const period = postingPeriods.find(p => p.id === periodId);
    const newReqId = `ur-${Date.now().toString().slice(-4)}`;
    const newRecord: PeriodLockRecord = {
      id: `plock-${Date.now().toString().slice(-4)}`,
      periodId,
      periodName: period?.periodName || periodId,
      companyId: 'comp-1',
      companyName: 'Artify Group Holdings SAOC',
      lockedBy: 'System Audit Schedule',
      lockedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      lockReason: 'Period audit lock enforced.',
      unlockRequests: [
        {
          id: newReqId,
          requestedBy: 'Senior Finance Manager',
          requestedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
          reason,
          status: 'Pending'
        }
      ]
    };
    setPeriodLocks(prev => [newRecord, ...prev]);
    logAuditEvent({
      userId: 'usr-finmgr',
      userName: 'Rashid Al-Kiyumi',
      userRole: 'Senior Finance Manager',
      action: 'UPDATE',
      module: '01.04 Financial & Period Controls',
      entity: 'PeriodLockRecord',
      recordId: periodId,
      newValue: `Unlock Request #${newReqId}`,
      result: 'SUCCESS',
      details: `Submitted unlock authorization request for ${periodId}. Reason: ${reason}`
    });
    setBanner(`Period unlock authorization request submitted for CFO sign-off.`);
  };

  const approvePeriodUnlock = (lockId: string, requestId: string) => {
    setPeriodLocks(prev =>
      prev.map(l => {
        if (l.id === lockId) {
          return {
            ...l,
            unlockRequests: l.unlockRequests.map(r =>
              r.id === requestId
                ? {
                    ...r,
                    status: 'Approved',
                    approvedBy: 'Sarah Jenkins (CFO)',
                    approvedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC'
                  }
                : r
            )
          };
        }
        return l;
      })
    );
    // Also unlock the corresponding period
    const lockObj = periodLocks.find(l => l.id === lockId);
    if (lockObj) {
      lockOrUnlockPeriod(lockObj.periodId, 'unlock', 'CFO authorized period unlock request.');
    }
    setBanner(`Unlock request approved and posting window opened.`);
  };

  // 01.05 MDM Handlers
  const addDuplicateRule = (rule: Partial<Omit<DuplicateRule, 'id'>>) => {
    const newId = `dup-${duplicateRules.length + 1}`;
    setDuplicateRules(prev => [...prev, { ...rule, id: newId } as DuplicateRule]);
    setBanner(`Duplicate matching rule configured.`);
  };

  const updateDuplicateRule = (id: string, patch: Partial<DuplicateRule>) => {
    setDuplicateRules(prev => prev.map(d => (d.id === id ? { ...d, ...patch } : d)));
    setBanner(`Duplicate control rule updated.`);
  };

  const addValidationRule = (rule: Partial<Omit<ValidationRule, 'id'>>) => {
    const newId = `val-${validationRules.length + 1}`;
    setValidationRules(prev => [...prev, { ...rule, id: newId } as ValidationRule]);
    setBanner(`Validation schema rule created.`);
  };

  const updateValidationRule = (id: string, patch: Partial<ValidationRule>) => {
    setValidationRules(prev => prev.map(v => (v.id === id ? { ...v, ...patch } : v)));
    setBanner(`Validation rule updated.`);
  };

  const processMdmApproval = (id: string, action: 'Approved' | 'Rejected', comments?: string) => {
    setMdmApprovals(prev =>
      prev.map(a => {
        if (a.id === id) {
          logAuditEvent({
            userId: 'usr-cfo',
            userName: 'Sarah Jenkins',
            userRole: 'CFO / Group Financial Officer',
            action: action === 'Approved' ? 'APPROVE' : 'REJECT',
            module: '01.05 Master Data Management',
            entity: 'MasterDataApproval',
            recordId: id,
            newValue: `status: ${action}, comments: ${comments || 'None'}`,
            result: 'SUCCESS',
            details: `${action} master data golden record creation request for ${a.recordIdentifier}`
          });
          return {
            ...a,
            status: action,
            comments: comments || a.comments
          };
        }
        return a;
      })
    );
    setBanner(`Master data request ${id} marked as ${action}.`);
  };

  // 01.06 Notification Handlers
  const markAlertAsRead = (id: string) => {
    setAlerts(prev => prev.map(a => (a.id === id ? { ...a, read: true } : a)));
  };

  const markAllAlertsAsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
    setBanner(`All system alerts marked as read.`);
  };

  const addNotificationTemplate = (tmpl: Partial<Omit<NotificationTemplate, 'id'>>) => {
    const newId = `tmpl-${notificationTemplates.length + 1}`;
    setNotificationTemplates(prev => [...prev, { ...tmpl, id: newId } as NotificationTemplate]);
    setBanner(`Notification template "${tmpl.title}" created.`);
  };

  const updateNotificationTemplate = (id: string, patch: Partial<NotificationTemplate>) => {
    setNotificationTemplates(prev => prev.map(t => (t.id === id ? { ...t, ...patch } : t)));
    setBanner(`Notification template updated.`);
  };

  // 01.08 Integration Handlers
  const addApiClient = (client: Partial<Omit<ApiClient, 'id' | 'createdAt' | 'maskedSecret' | 'dailyRequestCount'>>) => {
    const newId = `api-${apiClients.length + 1}`;
    const newClient = {
      ...client,
      id: newId,
      maskedSecret: 'sec_live_' + mockRandom().toString(36).substring(2, 8) + '*****************' + mockRandom().toString(36).substring(2, 6),
      dailyRequestCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    } as ApiClient;
    setApiClients(prev => [...prev, newClient]);
    logAuditEvent({
      userId: 'usr-admin',
      userName: 'Administrator',
      userRole: 'Super Admin',
      action: 'CREATE',
      module: '01.08 Integration & API Management',
      entity: 'ApiClient',
      recordId: newId,
      newValue: `${newClient.name} (${newClient.clientId})`,
      result: 'SUCCESS',
      details: `Issued new API credentials for integration client ${newClient.name} with rate limit ${newClient.rateLimitPerMinute} req/min`
    });
    setBanner(`API credentials for "${newClient.name}" generated.`);
  };

  const toggleApiClientStatus = (id: string) => {
    setApiClients(prev =>
      prev.map(c => {
        if (c.id === id) {
          const newStatus = c.status === 'Active' ? 'Suspended' : 'Active';
          logAuditEvent({
            userId: 'usr-admin',
            userName: 'Administrator',
            userRole: 'Super Admin',
            action: 'UPDATE',
            module: '01.08 Integration & API Management',
            entity: 'ApiClient',
            recordId: id,
            newValue: `status: ${newStatus}`,
            result: 'SUCCESS',
            details: `Toggled API client ${c.name} status to ${newStatus}`
          });
          return { ...c, status: newStatus };
        }
        return c;
      })
    );
    setBanner(`API client token status changed.`);
  };

  const triggerIntegrationSync = (id: string) => {
    const target = integrations.find(i => i.id === id);
    if (!target) return;
    const newLog: IntegrationLog = {
      id: `ilog-${Date.now().toString().slice(-5)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      integrationName: target.name,
      endpoint: target.endpoint.replace('https://', '/api/'),
      method: 'POST',
      statusCode: 200,
      durationMs: Math.floor(mockRandom() * 120) + 40,
      status: 'Success'
    };
    setIntegrationLogs(prev => [newLog, ...prev]);
    setIntegrations(prev =>
      prev.map(i => (i.id === id ? { ...i, lastSync: 'Just now (Handshake OK)', errorCount24h: 0 } : i))
    );
    logAuditEvent({
      userId: 'usr-admin',
      userName: 'Administrator',
      userRole: 'Super Admin',
      action: 'UPDATE',
      module: '01.08 Integration & API Management',
      entity: 'ExternalIntegration',
      recordId: id,
      newValue: 'Manual ping handshake successful (HTTP 200)',
      result: 'SUCCESS',
      details: `Executed manual health-check handshake with ${target.name}`
    });
    setBanner(`Handshake with "${target.name}" completed with 0 errors (HTTP 200 OK).`);
  };

  // 01.09 Backup Handlers
  const triggerManualBackup = () => {
    const dateStr = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    const newRestorePoint: RestorePoint = {
      id: `rp-${Date.now()}`,
      timestamp: dateStr,
      backupType: 'Manual On-Demand Database Snapshot (Full State)',
      sizeFormatted: '14.86 GB',
      checksumSha256: 'a1b2c3d4e5f678901234567890abcdef1234567890abcdef1234567890abcdef',
      location: 'eu-central-1 (Multi-Region Glacier Vault)',
      verified: true,
      status: 'Ready for Sandbox'
    };
    setRestorePoints(prev => [newRestorePoint, ...prev]);
    setBackupConfig(prev => ({
      ...prev,
      lastBackupAt: dateStr,
      lastBackupStatus: 'Success'
    }));
    logAuditEvent({
      userId: 'usr-admin',
      userName: 'Administrator',
      userRole: 'Super Admin',
      action: 'CREATE',
      module: '01.09 Backup & Recovery',
      entity: 'DatabaseBackup',
      recordId: newRestorePoint.id,
      newValue: `Snapshot size: 14.86 GB, Checksum: verified`,
      result: 'SUCCESS',
      details: `Generated on-demand encrypted database snapshot archived to immutable vault.`
    });
    setBanner(`Full database snapshot created (14.86 GB) with verified SHA-256 integrity.`);
  };

  const testSandboxRestore = (restorePointId: string) => {
    logAuditEvent({
      userId: 'usr-admin',
      userName: 'Administrator',
      userRole: 'Super Admin',
      action: 'UPDATE',
      module: '01.09 Backup & Recovery',
      entity: 'RestoreManagement',
      recordId: restorePointId,
      newValue: 'Sandbox verification drill pass',
      result: 'SUCCESS',
      details: `Executed automated sandbox restoration drill for restore point ${restorePointId}. All tables and constraints verified.`
    });
    setBanner(`Sandbox restore drill for ${restorePointId} completed with 100% integrity score.`);
  };

  const updateBackupConfig = (patch: Partial<BackupConfiguration>) => {
    setBackupConfig(prev => ({ ...prev, ...patch }));
    setBanner(`Backup schedule & retention configuration saved.`);
  };

  // 01.10 Security Handlers
  const updatePasswordPolicy = (patch: Partial<PasswordPolicy>) => {
    setPasswordPolicy(prev => {
      const updated = { ...prev, ...patch };
      logAuditEvent({
        userId: 'usr-admin',
        userName: 'Administrator',
        userRole: 'Super Admin',
        action: 'CONFIG_CHANGE',
        module: '01.10 Security Management',
        entity: 'PasswordPolicy',
        recordId: 'pwd-policy-global',
        newValue: JSON.stringify(patch),
        result: 'SUCCESS',
        details: `Updated enterprise password complexity and rotation policies.`
      });
      return updated;
    });
    setBanner(`Password security policy updated.`);
  };

  const toggleSecurityPolicy = (id: string) => {
    setSecurityPolicies(prev =>
      prev.map(p => {
        if (p.id === id) {
          const newStatus = p.status === 'Enforced' ? 'Draft' : 'Enforced';
          logAuditEvent({
            userId: 'usr-admin',
            userName: 'Administrator',
            userRole: 'Super Admin',
            action: 'CONFIG_CHANGE',
            module: '01.10 Security Management',
            entity: 'SecurityPolicy',
            recordId: id,
            newValue: `status: ${newStatus}`,
            result: 'SUCCESS',
            details: `Toggled policy "${p.policyName}" enforcement to ${newStatus}`
          });
          return { ...p, status: newStatus };
        }
        return p;
      })
    );
    setBanner(`Security policy enforcement changed.`);
  };

  const terminateSession = (sessionId: string) => {
    const session = activeSessions.find(s => s.id === sessionId);
    setActiveSessions(prev => prev.filter(s => s.id !== sessionId));
    const newSecEvt: SecurityEvent = {
      id: `sec-evt-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      eventType: 'Session Revoked',
      severity: 'Medium',
      ipAddress: session?.ipAddress || '185.190.24.01',
      userId: session?.userId,
      userName: session?.userName,
      details: `Administrator remotely terminated active session on device ${session?.device || 'Unknown'}`,
      actionTaken: 'Session Terminated'
    };
    setSecurityEvents(prev => [newSecEvt, ...prev]);
    logAuditEvent({
      userId: 'usr-admin',
      userName: 'Administrator',
      userRole: 'Super Admin',
      action: 'REVOKE',
      module: '01.10 Security Management',
      entity: 'ActiveSession',
      recordId: sessionId,
      newValue: 'Session Terminated (Token Invalidated)',
      result: 'SUCCESS',
      details: `Force-terminated active login session for ${session?.userName}`
    });
    setBanner(`Active session for ${session?.userName} terminated.`);
  };

  // AI Assistant Engine
  const runAiSystemQuery = async (promptText: string): Promise<{ answer: string; recommendedAction?: string; targetRoute?: any }> => {
    const clean = promptText.toLowerCase().trim();

    if (clean.includes('permission') || clean.includes('excessive') || clean.includes('sod') || clean.includes('conflict')) {
      const activeExceptions = sodRules.flatMap(r => r.exceptions.filter(e => e.status === 'Active')).length;
      return {
        answer: `**Segregation of Duties (SoD) & Access Analysis**:\n• **Total Enforced SoD Rules**: ${sodRules.length} rules active.\n• **Active Waiver Exceptions**: ${activeExceptions} temporary waiver currently active for Senior Finance Manager (Rashid Al-Kiyumi on rule \`SOD-GL-03\`, expires 2026-08-31).\n• **Flagged Risks**: Zero critical unauthorized dual-privilege violations detected across 450 active enterprise seats. All AP clerks and vendor creators are strictly partitioned.`,
        recommendedAction: 'Inspect Segregation of Duties matrix & exception waivers',
        targetRoute: { view: 'transaction', moduleId: 'system-management', functionalAreaId: 'user-access-mgmt', processId: 'access-control-proc', transactionId: 'tx-sod' }
      };
    }

    if (clean.includes('inactive') || clean.includes('locked') || clean.includes('user')) {
      const lockedCount = users.filter(u => u.status === 'Locked').length;
      const inactiveCount = users.filter(u => u.status === 'Inactive').length;
      return {
        answer: `**User Directory Hygiene Report**:\n• **Total Provisioned Users**: ${users.length} accounts.\n• **Active Accounts**: ${users.filter(u => u.status === 'Active').length}\n• **Locked Accounts**: ${lockedCount} user (\`samir.suspended\` locked after 5 failed logins from untrusted IP).\n• **MFA Enrollment**: 87.5% of accounts have hardware WebAuthn or TOTP enabled.`,
        recommendedAction: 'Review locked and inactive user accounts',
        targetRoute: { view: 'transaction', moduleId: 'system-management', functionalAreaId: 'user-access-mgmt', processId: 'access-control-proc', transactionId: 'tx-user-mgmt' }
      };
    }

    if (clean.includes('workflow') || clean.includes('bottleneck') || clean.includes('approval')) {
      return {
        answer: `**Workflow Efficiency & SLA Audit**:\n• **Active Pipelines**: ${workflows.length} workflows running.\n• **Identified Bottlenecks**: Major CAPEX workflow stage 2 (Finance Manager review) has an average turnaround of 34.2 hours against a 48-hour SLA threshold.\n• **Escalations Triggered (Last 30 Days)**: 2 auto-escalations to deputy department heads.\n• **Recommended Optimization**: Consider setting up an automated delegation rule during quarter-end peak loads.`,
        recommendedAction: 'Manage multi-stage approval workflows',
        targetRoute: { view: 'transaction', moduleId: 'system-management', functionalAreaId: 'workflow-approval-mgmt', processId: 'workflow-proc', transactionId: 'tx-approval-workflows' }
      };
    }

    if (clean.includes('period') || clean.includes('fiscal') || clean.includes('posting') || clean.includes('lock')) {
      const currentPeriod = postingPeriods.find(p => p.overallStatus === 'Open');
      return {
        answer: `**Fiscal Period Governance Status**:\n• **Active Fiscal Year**: \`FY-2026\` (12 calendar periods).\n• **Current Open Period**: **${currentPeriod?.periodName || 'Period 08 (August 2026)'}**.\n• **Prior Periods (01 to 07)**: Hard locked with verified double-entry balances.\n• **Future Periods (09 to 12)**: Locked to prevent unbudgeted commitments.\n• **Backdated Posting Rules**: Enforcing maximum 5-day tolerance with mandatory Finance Manager approval.`,
        recommendedAction: 'View posting periods & sub-ledger locks',
        targetRoute: { view: 'transaction', moduleId: 'system-management', functionalAreaId: 'fin-period-controls', processId: 'period-ctrl-proc', transactionId: 'tx-posting-periods' }
      };
    }

    if (clean.includes('backup') || clean.includes('disaster') || clean.includes('recovery') || clean.includes('rpo') || clean.includes('rto')) {
      return {
        answer: `**Disaster Recovery (DR) Readiness**:\n• **Disaster Recovery Score**: **${drStatus.drReadinessScore}%** (Optimal).\n• **Current RPO**: **${drStatus.currentRpoMinutes} minutes** (Target: ≤ 15 mins).\n• **Estimated RTO**: **${drStatus.currentRtoEstimateMinutes} minutes** (Target: ≤ 60 mins).\n• **Last Successful Backup**: ${backupConfig.lastBackupAt} (14.84 GB, AES-256 encrypted, multi-region replicated to Frankfurt).\n• **Integrity Verification**: 100% of restore points cryptographically verified with SHA-256.`,
        recommendedAction: 'Inspect Disaster Recovery dashboard',
        targetRoute: { view: 'transaction', moduleId: 'system-management', functionalAreaId: 'backup-recovery', processId: 'backup-proc', transactionId: 'tx-disaster-recovery' }
      };
    }

    if (clean.includes('security') || clean.includes('login') || clean.includes('threat') || clean.includes('policy')) {
      return {
        answer: `**Enterprise Security & Compliance Overview**:\n• **Security Health Baseline**: **99.98%**.\n• **Active Policies**: ${securityPolicies.filter(p => p.status === 'Enforced').length} mandatory policies enforced.\n• **Password Hygiene**: Minimum length 12 characters, 90-day expiry, 5-history prevent rule.\n• **Suspicious Events**: 1 brute-force anomaly blocked on 2026-08-20 from IP \`194.126.88.10\` with automatic account isolation.`,
        recommendedAction: 'Review Security Policies & SIEM event log',
        targetRoute: { view: 'transaction', moduleId: 'system-management', functionalAreaId: 'security-mgmt', processId: 'security-proc', transactionId: 'tx-sec-logs' }
      };
    }

    if (clean.includes('duplicate') || clean.includes('master') || clean.includes('mdm') || clean.includes('quality')) {
      return {
        answer: `**Master Data Governance & Quality Score**:\n• **Overall Data Quality Score**: **98.4%** across 18,300 corporate golden records.\n• **Pending Approvals**: ${mdmApprovals.filter(a => a.status === 'Pending Review').length} vendor/GL master requests in queue.\n• **Deduplication Engine**: Active fuzzy matching across TRN/VAT numbers and IBAN accounts.\n• **Duplicate Block Rate**: 100% of duplicate VAT registration attempts blocked in real-time.`,
        recommendedAction: 'Open Master Data Governance queue',
        targetRoute: { view: 'transaction', moduleId: 'system-management', functionalAreaId: 'master-data-mgmt', processId: 'mdm-proc', transactionId: 'tx-mdm-approval' }
      };
    }

    // Default summary
    return {
      answer: `**Artify System Management Executive Summary**:\n• **Organization Scope**: ${companies.length} legal entities, ${branches.length} operational branches, ${departments.length} departments, and ${operatingUnits.length} operating P&L units.\n• **Access Layer**: ${users.length} users, ${userGroups.length} security groups, and ${sodRules.length} enforced SoD conflict rules.\n• **Period Controls**: FY-2026 Period 08 (August 2026) active with strict sub-ledger gates.\n• **Integrations**: Banking (CBO SWIFT Host-to-Host) and Tax Gateways (OTA VAT & ZATCA) operating with zero errors.\n• **System Health**: All services nominal, database backups replicated, and audit logging active.`,
      recommendedAction: 'Open System Management Central Hub',
      targetRoute: { view: 'module', moduleId: 'system-management' }
    };
  };

  return (
    <SystemManagementContext.Provider
      value={{
        companies,
        currencies,
        groups,
        groupMemberships,
        relationshipHistory,
        companyGroup,
        selectedGroupId,
        setSelectedGroupId,
        branches,
        departments,
        locations,
        operatingUnits,
        addCurrency,
        updateCurrency,
        addCompany,
        updateCompany,
        archiveCompany,
        submitCompanyForApproval,
        approveCompany,
        rejectCompany,
        toggleCompanyStatus,
        addCompanyAttachment,
        removeCompanyAttachment,
        checkDuplicateCompany,
        extractCompanyWithAI,
        generateCompanyProfileSummaryAI,

        // 01.01.02 Group / Holding Master Operations
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
        extractCorporateStructureWithAI,
        generateStructureExplanationAI,
        validateStructureWithAI,

        addBranch,
        updateBranch,
        addDepartment,
        updateDepartment,
        addLocation,
        updateLocation,
        addOperatingUnit,
        updateOperatingUnit,

        users,
        userGroups,
        sodRules,
        accessRestrictions,
        addUser,
        updateUser,
        toggleUserLock,
        resetUserPassword,
        addUserGroup,
        updateUserGroup,
        addSoDException,
        toggleSoDRule,
        addAccessRestriction,
        updateAccessRestriction,

        workflows,
        approvalMatrices,
        delegations,
        approvalLimits,
        escalationRules,
        addWorkflow,
        updateWorkflow,
        addApprovalMatrixRule,
        updateApprovalMatrixRule,
        addDelegation,
        revokeDelegation,
        addApprovalLimit,
        updateApprovalLimit,
        addEscalationRule,
        updateEscalationRule,

        fiscalYears,
        postingPeriods,
        documentSequences,
        postingControls,
        periodLocks,
        addFiscalYear,
        togglePostingPeriodSubLedger,
        lockOrUnlockPeriod,
        addDocumentSequence,
        updateDocumentSequence,
        updatePostingControls,
        requestPeriodUnlock,
        approvePeriodUnlock,

        mdmDefinitions,
        duplicateRules,
        validationRules,
        mdmApprovals,
        addDuplicateRule,
        updateDuplicateRule,
        addValidationRule,
        updateValidationRule,
        processMdmApproval,

        notificationTemplates,
        notificationRules,
        alerts,
        markAlertAsRead,
        markAllAlertsAsRead,
        addNotificationTemplate,
        updateNotificationTemplate,

        auditTrail,
        loginHistory,
        logAuditEvent,

        apiClients,
        integrations,
        integrationLogs,
        addApiClient,
        toggleApiClientStatus,
        triggerIntegrationSync,

        backupConfig,
        restorePoints,
        drStatus,
        triggerManualBackup,
        testSandboxRestore,
        updateBackupConfig,

        securityPolicies,
        passwordPolicy,
        activeSessions,
        securityEvents,
        updatePasswordPolicy,
        toggleSecurityPolicy,
        terminateSession,

        runAiSystemQuery,
        bannerMessage,
        clearBanner,
        setBanner
      }}
    >
      {children}
    </SystemManagementContext.Provider>
  );
};

export const useSystemManagement = () => {
  const ctx = useContext(SystemManagementContext);
  if (!ctx) {
    throw new Error('useSystemManagement must be used within a SystemManagementProvider');
  }
  return ctx;
};
