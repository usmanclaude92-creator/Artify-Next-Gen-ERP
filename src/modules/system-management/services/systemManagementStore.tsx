import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Company,
  CompanyGroup,
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
  INITIAL_COMPANY_GROUP,
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

interface SystemManagementContextType {
  // 01.01 Org
  companies: Company[];
  companyGroup: CompanyGroup;
  branches: Branch[];
  departments: Department[];
  locations: Location[];
  operatingUnits: OperatingUnit[];
  addCompany: (comp: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCompany: (id: string, comp: Partial<Company>) => void;
  archiveCompany: (id: string) => void;
  addBranch: (br: Omit<Branch, 'id' | 'createdAt'>) => void;
  updateBranch: (id: string, br: Partial<Branch>) => void;
  addDepartment: (dept: Omit<Department, 'id'>) => void;
  updateDepartment: (id: string, dept: Partial<Department>) => void;
  addLocation: (loc: Omit<Location, 'id'>) => void;
  updateLocation: (id: string, loc: Partial<Location>) => void;
  addOperatingUnit: (ou: Omit<OperatingUnit, 'id'>) => void;
  updateOperatingUnit: (id: string, ou: Partial<OperatingUnit>) => void;

  // 01.02 User & Access
  users: UserAccount[];
  userGroups: UserGroup[];
  sodRules: SoDRule[];
  accessRestrictions: AccessRestriction[];
  addUser: (usr: Omit<UserAccount, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, usr: Partial<UserAccount>) => void;
  toggleUserLock: (id: string) => void;
  resetUserPassword: (id: string) => void;
  addUserGroup: (grp: Omit<UserGroup, 'id' | 'createdAt'>) => void;
  updateUserGroup: (id: string, grp: Partial<UserGroup>) => void;
  addSoDException: (ruleId: string, exception: { userId: string; userName: string; reason: string; expiresAt: string }) => void;
  toggleSoDRule: (ruleId: string) => void;
  addAccessRestriction: (ar: Omit<AccessRestriction, 'id'>) => void;
  updateAccessRestriction: (id: string, ar: Partial<AccessRestriction>) => void;

  // 01.03 Workflow & Approval
  workflows: ApprovalWorkflow[];
  approvalMatrices: ApprovalMatrixRule[];
  delegations: DelegationOfAuthority[];
  approvalLimits: ApprovalLimit[];
  escalationRules: EscalationRule[];
  addWorkflow: (wf: Omit<ApprovalWorkflow, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateWorkflow: (id: string, wf: Partial<ApprovalWorkflow>) => void;
  addApprovalMatrixRule: (rule: Omit<ApprovalMatrixRule, 'id'>) => void;
  updateApprovalMatrixRule: (id: string, rule: Partial<ApprovalMatrixRule>) => void;
  addDelegation: (del: Omit<DelegationOfAuthority, 'id'>) => void;
  revokeDelegation: (id: string) => void;
  addApprovalLimit: (limit: Omit<ApprovalLimit, 'id'>) => void;
  updateApprovalLimit: (id: string, limit: Partial<ApprovalLimit>) => void;
  addEscalationRule: (rule: Omit<EscalationRule, 'id'>) => void;
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
  addDocumentSequence: (seq: Omit<DocumentSequence, 'id'>) => void;
  updateDocumentSequence: (id: string, seq: Partial<DocumentSequence>) => void;
  updatePostingControls: (ctrl: Partial<PostingControl>) => void;
  requestPeriodUnlock: (periodId: string, reason: string) => void;
  approvePeriodUnlock: (lockId: string, requestId: string) => void;

  // 01.05 Master Data Management
  mdmDefinitions: MasterDataDefinition[];
  duplicateRules: DuplicateRule[];
  validationRules: ValidationRule[];
  mdmApprovals: MasterDataApprovalRequest[];
  addDuplicateRule: (rule: Omit<DuplicateRule, 'id'>) => void;
  updateDuplicateRule: (id: string, rule: Partial<DuplicateRule>) => void;
  addValidationRule: (rule: Omit<ValidationRule, 'id'>) => void;
  updateValidationRule: (id: string, rule: Partial<ValidationRule>) => void;
  processMdmApproval: (id: string, action: 'Approved' | 'Rejected', comments?: string) => void;

  // 01.06 Notifications & Alerts
  notificationTemplates: NotificationTemplate[];
  notificationRules: NotificationRule[];
  alerts: SystemAlertItem[];
  markAlertAsRead: (id: string) => void;
  markAllAlertsAsRead: () => void;
  addNotificationTemplate: (tmpl: Omit<NotificationTemplate, 'id'>) => void;
  updateNotificationTemplate: (id: string, tmpl: Partial<NotificationTemplate>) => void;

  // 01.07 Audit Trail & Monitoring
  auditTrail: AuditEvent[];
  loginHistory: LoginHistoryEvent[];
  logAuditEvent: (event: Omit<AuditEvent, 'id' | 'timestamp' | 'userAgent' | 'ipAddress'>) => void;

  // 01.08 Integrations & API
  apiClients: ApiClient[];
  integrations: ExternalIntegration[];
  integrationLogs: IntegrationLog[];
  addApiClient: (client: Omit<ApiClient, 'id' | 'createdAt' | 'maskedSecret' | 'dailyRequestCount'>) => void;
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
  // 01.01
  const [companies, setCompanies] = useState<Company[]>(() => {
    const saved = localStorage.getItem('artify_sm_companies');
    return saved ? JSON.parse(saved) : INITIAL_COMPANIES;
  });
  const [companyGroup] = useState<CompanyGroup>(INITIAL_COMPANY_GROUP);
  const [branches, setBranches] = useState<Branch[]>(INITIAL_BRANCHES);
  const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [locations, setLocations] = useState<Location[]>(INITIAL_LOCATIONS);
  const [operatingUnits, setOperatingUnits] = useState<OperatingUnit[]>(INITIAL_OPERATING_UNITS);

  // 01.02
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [userGroups, setUserGroups] = useState<UserGroup[]>(INITIAL_USER_GROUPS);
  const [sodRules, setSodRules] = useState<SoDRule[]>(INITIAL_SOD_RULES);
  const [accessRestrictions, setAccessRestrictions] = useState<AccessRestriction[]>(INITIAL_ACCESS_RESTRICTIONS);

  // 01.03
  const [workflows, setWorkflows] = useState<ApprovalWorkflow[]>(INITIAL_WORKFLOWS);
  const [approvalMatrices, setApprovalMatrices] = useState<ApprovalMatrixRule[]>(INITIAL_APPROVAL_MATRICES);
  const [delegations, setDelegations] = useState<DelegationOfAuthority[]>(INITIAL_DELEGATIONS);
  const [approvalLimits, setApprovalLimits] = useState<ApprovalLimit[]>(INITIAL_APPROVAL_LIMITS);
  const [escalationRules, setEscalationRules] = useState<EscalationRule[]>(INITIAL_ESCALATION_RULES);

  // 01.04
  const [fiscalYears, setFiscalYears] = useState<FiscalYear[]>(INITIAL_FISCAL_YEARS);
  const [postingPeriods, setPostingPeriods] = useState<PostingPeriod[]>(INITIAL_POSTING_PERIODS);
  const [documentSequences, setDocumentSequences] = useState<DocumentSequence[]>(INITIAL_DOC_SEQUENCES);
  const [postingControls, setPostingControls] = useState<PostingControl>(INITIAL_POSTING_CONTROLS);
  const [periodLocks, setPeriodLocks] = useState<PeriodLockRecord[]>(INITIAL_PERIOD_LOCKS);

  // 01.05
  const [mdmDefinitions] = useState<MasterDataDefinition[]>(INITIAL_MDM_DEFINITIONS);
  const [duplicateRules, setDuplicateRules] = useState<DuplicateRule[]>(INITIAL_DUPLICATE_RULES);
  const [validationRules, setValidationRules] = useState<ValidationRule[]>(INITIAL_VALIDATION_RULES);
  const [mdmApprovals, setMdmApprovals] = useState<MasterDataApprovalRequest[]>(INITIAL_MDM_APPROVALS);

  // 01.06
  const [notificationTemplates, setNotificationTemplates] = useState<NotificationTemplate[]>(INITIAL_NOTIF_TEMPLATES);
  const [notificationRules, setNotificationRules] = useState<NotificationRule[]>(INITIAL_NOTIF_RULES);
  const [alerts, setAlerts] = useState<SystemAlertItem[]>(INITIAL_ALERTS);

  // 01.07
  const [auditTrail, setAuditTrail] = useState<AuditEvent[]>(INITIAL_AUDIT_TRAIL);
  const [loginHistory] = useState<LoginHistoryEvent[]>(INITIAL_LOGIN_HISTORY);

  // 01.08
  const [apiClients, setApiClients] = useState<ApiClient[]>(INITIAL_API_CLIENTS);
  const [integrations, setIntegrations] = useState<ExternalIntegration[]>(INITIAL_INTEGRATIONS);
  const [integrationLogs, setIntegrationLogs] = useState<IntegrationLog[]>(INITIAL_INTEGRATION_LOGS);

  // 01.09
  const [backupConfig, setBackupConfig] = useState<BackupConfiguration>(INITIAL_BACKUP_CONFIG);
  const [restorePoints, setRestorePoints] = useState<RestorePoint[]>(INITIAL_RESTORE_POINTS);
  const [drStatus] = useState<DisasterRecoveryStatus>(INITIAL_DR_STATUS);

  // 01.10
  const [securityPolicies, setSecurityPolicies] = useState<SecurityPolicy[]>(INITIAL_SECURITY_POLICIES);
  const [passwordPolicy, setPasswordPolicy] = useState<PasswordPolicy>(INITIAL_PASSWORD_POLICY);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>(INITIAL_ACTIVE_SESSIONS);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>(INITIAL_SECURITY_EVENTS);

  // Banner
  const [bannerMessage, setBannerMessage] = useState<{ text: string; type: 'success' | 'info' | 'warning' | 'error' } | null>(null);

  const clearBanner = () => setBannerMessage(null);
  const setBanner = (msg: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    setBannerMessage({ text: msg, type });
    setTimeout(() => {
      setBannerMessage(prev => (prev?.text === msg ? null : prev));
    }, 6000);
  };

  // Sync companies to storage
  useEffect(() => {
    localStorage.setItem('artify_sm_companies', JSON.stringify(companies));
  }, [companies]);

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

  // 01.01 Handlers
  const addCompany = (comp: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newId = `comp-${companies.length + 1}`;
    const dateStr = new Date().toISOString().split('T')[0];
    const newComp: Company = {
      ...comp,
      id: newId,
      createdAt: dateStr,
      updatedAt: dateStr
    };
    setCompanies(prev => [...prev, newComp]);
    logAuditEvent({
      userId: 'usr-admin',
      userName: 'Administrator',
      userRole: 'Super Admin',
      action: 'CREATE',
      module: '01.01 Organization Setup',
      entity: 'Company',
      recordId: newId,
      newValue: `${newComp.code} (${newComp.legalName})`,
      result: 'SUCCESS',
      details: `Created new legal entity ${newComp.code} - ${newComp.legalName}`
    });
    setBanner(`Legal entity "${newComp.legalName}" (${newComp.code}) registered successfully.`);
  };

  const updateCompany = (id: string, patch: Partial<Company>) => {
    setCompanies(prev =>
      prev.map(c => {
        if (c.id === id) {
          const updated = { ...c, ...patch, updatedAt: new Date().toISOString().split('T')[0] };
          logAuditEvent({
            userId: 'usr-admin',
            userName: 'Administrator',
            userRole: 'Super Admin',
            action: 'UPDATE',
            module: '01.01 Organization Setup',
            entity: 'Company',
            recordId: id,
            previousValue: JSON.stringify({ code: c.code, status: c.status, taxNumber: c.taxNumber }),
            newValue: JSON.stringify({ code: updated.code, status: updated.status, taxNumber: updated.taxNumber }),
            result: 'SUCCESS',
            details: `Updated company master attributes for ${c.code}`
          });
          return updated;
        }
        return c;
      })
    );
    setBanner(`Company master record updated.`);
  };

  const archiveCompany = (id: string) => {
    setCompanies(prev =>
      prev.map(c => (c.id === id ? { ...c, status: 'Archived', updatedAt: new Date().toISOString().split('T')[0] } : c))
    );
    logAuditEvent({
      userId: 'usr-admin',
      userName: 'Administrator',
      userRole: 'Super Admin',
      action: 'UPDATE',
      module: '01.01 Organization Setup',
      entity: 'Company',
      recordId: id,
      newValue: 'status: Archived',
      result: 'SUCCESS',
      details: `Archived company record ${id}`
    });
    setBanner(`Company ${id} marked as Archived.`);
  };

  const addBranch = (br: Omit<Branch, 'id' | 'createdAt'>) => {
    const newId = `br-${branches.length + 1}`;
    const newBranch: Branch = {
      ...br,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0]
    };
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

  const addDepartment = (dept: Omit<Department, 'id'>) => {
    const newId = `dept-${departments.length + 1}`;
    const newDept: Department = { ...dept, id: newId };
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

  const addOperatingUnit = (ou: Omit<OperatingUnit, 'id'>) => {
    const newId = `ou-${operatingUnits.length + 1}`;
    const newOu: OperatingUnit = { ...ou, id: newId };
    setOperatingUnits(prev => [...prev, newOu]);
    setBanner(`Operating Unit "${newOu.name}" added.`);
  };

  const updateOperatingUnit = (id: string, patch: Partial<OperatingUnit>) => {
    setOperatingUnits(prev => prev.map(o => (o.id === id ? { ...o, ...patch } : o)));
    setBanner(`Operating unit ${id} updated.`);
  };

  // 01.02 User & Access Handlers
  const addUser = (usr: Omit<UserAccount, 'id' | 'createdAt'>) => {
    const newId = `usr-${users.length + 1}`;
    const newUser: UserAccount = {
      ...usr,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0]
    };
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

  const addAccessRestriction = (ar: Omit<AccessRestriction, 'id'>) => {
    const newId = `ar-${accessRestrictions.length + 1}`;
    setAccessRestrictions(prev => [...prev, { ...ar, id: newId }]);
    setBanner(`Access policy rule added.`);
  };

  const updateAccessRestriction = (id: string, patch: Partial<AccessRestriction>) => {
    setAccessRestrictions(prev => prev.map(a => (a.id === id ? { ...a, ...patch } : a)));
    setBanner(`Access policy updated.`);
  };

  // 01.03 Workflow Handlers
  const addWorkflow = (wf: Omit<ApprovalWorkflow, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newId = `wf-${workflows.length + 1}`;
    const dateStr = new Date().toISOString().split('T')[0];
    const newWorkflow: ApprovalWorkflow = {
      ...wf,
      id: newId,
      createdAt: dateStr,
      updatedAt: dateStr
    };
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

  const addApprovalMatrixRule = (rule: Omit<ApprovalMatrixRule, 'id'>) => {
    const newId = `am-${approvalMatrices.length + 1}`;
    setApprovalMatrices(prev => [...prev, { ...rule, id: newId }]);
    setBanner(`Approval matrix threshold tier registered.`);
  };

  const updateApprovalMatrixRule = (id: string, patch: Partial<ApprovalMatrixRule>) => {
    setApprovalMatrices(prev => prev.map(a => (a.id === id ? { ...a, ...patch } : a)));
    setBanner(`Approval matrix rule updated.`);
  };

  const addDelegation = (del: Omit<DelegationOfAuthority, 'id'>) => {
    const newId = `doa-${delegations.length + 1}`;
    const newDoa: DelegationOfAuthority = { ...del, id: newId };
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

  const addEscalationRule = (rule: Omit<EscalationRule, 'id'>) => {
    const newId = `esc-${escalationRules.length + 1}`;
    setEscalationRules(prev => [...prev, { ...rule, id: newId }]);
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

  const addDocumentSequence = (seq: Omit<DocumentSequence, 'id'>) => {
    const newId = `seq-${documentSequences.length + 1}`;
    setDocumentSequences(prev => [...prev, { ...seq, id: newId }]);
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
  const addDuplicateRule = (rule: Omit<DuplicateRule, 'id'>) => {
    const newId = `dup-${duplicateRules.length + 1}`;
    setDuplicateRules(prev => [...prev, { ...rule, id: newId }]);
    setBanner(`Duplicate matching rule configured.`);
  };

  const updateDuplicateRule = (id: string, patch: Partial<DuplicateRule>) => {
    setDuplicateRules(prev => prev.map(d => (d.id === id ? { ...d, ...patch } : d)));
    setBanner(`Duplicate control rule updated.`);
  };

  const addValidationRule = (rule: Omit<ValidationRule, 'id'>) => {
    const newId = `val-${validationRules.length + 1}`;
    setValidationRules(prev => [...prev, { ...rule, id: newId }]);
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

  const addNotificationTemplate = (tmpl: Omit<NotificationTemplate, 'id'>) => {
    const newId = `tmpl-${notificationTemplates.length + 1}`;
    setNotificationTemplates(prev => [...prev, { ...tmpl, id: newId }]);
    setBanner(`Notification template "${tmpl.title}" created.`);
  };

  const updateNotificationTemplate = (id: string, patch: Partial<NotificationTemplate>) => {
    setNotificationTemplates(prev => prev.map(t => (t.id === id ? { ...t, ...patch } : t)));
    setBanner(`Notification template updated.`);
  };

  // 01.08 Integration Handlers
  const addApiClient = (client: Omit<ApiClient, 'id' | 'createdAt' | 'maskedSecret' | 'dailyRequestCount'>) => {
    const newId = `api-${apiClients.length + 1}`;
    const newClient: ApiClient = {
      ...client,
      id: newId,
      maskedSecret: 'sec_live_' + Math.random().toString(36).substring(2, 8) + '*****************' + Math.random().toString(36).substring(2, 6),
      dailyRequestCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
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
      durationMs: Math.floor(Math.random() * 120) + 40,
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
        companyGroup,
        branches,
        departments,
        locations,
        operatingUnits,
        addCompany,
        updateCompany,
        archiveCompany,
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
