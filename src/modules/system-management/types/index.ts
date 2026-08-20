export interface Company {
  id: string;
  code: string;
  legalName: string;
  tradingName: string;
  companyType: 'Holding' | 'Subsidiary' | 'Joint Venture' | 'Branch' | 'Associate';
  registrationNumber: string;
  taxNumber: string;
  country: string;
  state: string;
  city: string;
  address: string;
  postalCode: string;
  phone: string;
  email: string;
  website: string;
  currency: string;
  fiscalYearStart: string;
  timeZone: string;
  dateFormat: string;
  status: 'Active' | 'Inactive' | 'Draft' | 'Archived';
  isParent: boolean;
  parentId?: string;
  ownershipPercentage?: number;
  logo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyGroup {
  id: string;
  name: string;
  code: string;
  holdingCompanyId: string;
  currency: string;
  description: string;
  subsidiaryIds: string[];
  status: 'Active' | 'Inactive';
}

export interface Branch {
  id: string;
  code: string;
  name: string;
  companyId: string;
  companyName: string;
  locationId: string;
  locationName: string;
  manager: string;
  address: string;
  phone: string;
  email: string;
  currency: string;
  isTaxBranch: boolean;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  companyId: string;
  companyName: string;
  branchId: string;
  branchName: string;
  parentDepartmentId?: string;
  parentDepartmentName?: string;
  departmentHead: string;
  costCenterCode: string;
  status: 'Active' | 'Inactive';
  employeeCount: number;
}

export interface Location {
  id: string;
  code: string;
  name: string;
  locationType: 'Headquarters' | 'Regional Office' | 'Factory / Plant' | 'Warehouse' | 'Project Site' | 'Yard';
  companyId: string;
  companyName: string;
  branchId?: string;
  country: string;
  region: string;
  city: string;
  address: string;
  coordinates: string;
  status: 'Active' | 'Inactive';
}

export interface OperatingUnit {
  id: string;
  code: string;
  name: string;
  companyId: string;
  companyName: string;
  branchId: string;
  departmentId: string;
  locationId: string;
  manager: string;
  unitType: 'Profit Center' | 'Cost Center' | 'Investment Center' | 'Revenue Center';
  status: 'Active' | 'Inactive';
}

// 01.02 User & Access Types
export interface UserAccount {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  email: string;
  mobile: string;
  employeeRef: string;
  companyId: string;
  companyName: string;
  branchId: string;
  departmentId: string;
  departmentName: string;
  position: string;
  roleId: string;
  roleName: string;
  userGroupId: string;
  userGroupName: string;
  status: 'Active' | 'Inactive' | 'Locked' | 'Suspended';
  authMethod: 'Password' | 'SAML SSO' | 'MFA / TOTP' | 'FIDO2 WebAuthn';
  mfaEnabled: boolean;
  lastLogin: string;
  lastLoginIp: string;
  createdAt: string;
}

export interface UserRoleDefinition {
  id: string;
  code: string;
  name: string;
  description: string;
  department: string;
  userCount: number;
  permissions: {
    module: string;
    functionalArea: string;
    page: string;
    actions: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
      approve: boolean;
      reject: boolean;
      export: boolean;
      print: boolean;
      post: boolean;
      reverse: boolean;
      admin: boolean;
    };
  }[];
  status: 'Active' | 'Inactive';
}

export interface UserGroup {
  id: string;
  code: string;
  name: string;
  description: string;
  memberCount: number;
  members: string[];
  assignedRoles: string[];
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface SoDRule {
  id: string;
  code: string;
  title: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  conflictingActionA: string;
  conflictingActionB: string;
  moduleA: string;
  moduleB: string;
  status: 'Enforced' | 'Warning Only' | 'Disabled';
  activeViolationsCount: number;
  exceptions: {
    id: string;
    userId: string;
    userName: string;
    approvedBy: string;
    reason: string;
    expiresAt: string;
    status: 'Active' | 'Expired' | 'Revoked';
  }[];
}

export interface AccessRestriction {
  id: string;
  name: string;
  type: 'IP Whitelist' | 'Time Window' | 'Device Binding' | 'Geofence' | 'Department Scope';
  targetType: 'Company' | 'Role' | 'User' | 'Global';
  targetValue: string;
  ruleValue: string;
  enforceMfa: boolean;
  status: 'Active' | 'Inactive';
  description: string;
}

// 01.03 Workflow & Approval Types
export interface ApprovalStage {
  stageNumber: number;
  name: string;
  approverType: 'Role' | 'User' | 'Department Head' | 'Hierarchy Level';
  approverValue: string;
  condition?: string;
  approvalLimitOMR?: number;
  timeoutHours: number;
  allowDelegation: boolean;
}

export interface ApprovalWorkflow {
  id: string;
  code: string;
  name: string;
  module: string;
  process: string;
  triggerEvent: 'Document Submit' | 'Budget Breach' | 'Payment Dispatch' | 'Master Creation' | 'Period Lock';
  stages: ApprovalStage[];
  status: 'Active' | 'Draft' | 'Suspended';
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalMatrixRule {
  id: string;
  companyId: string;
  departmentId: string;
  module: string;
  transactionType: string;
  minAmount: number;
  maxAmount: number;
  currency: string;
  approvalLevels: string[];
  effectiveDate: string;
  status: 'Active' | 'Inactive';
}

export interface DelegationOfAuthority {
  id: string;
  delegatorId: string;
  delegatorName: string;
  delegatorRole: string;
  delegateId: string;
  delegateName: string;
  delegateRole: string;
  startDate: string;
  endDate: string;
  scope: 'All Approvals' | 'Financial Only' | 'Procurement Only' | 'HR Only';
  maxApprovalLimitOMR: number;
  reason: string;
  status: 'Active' | 'Scheduled' | 'Expired' | 'Revoked';
}

export interface ApprovalLimit {
  id: string;
  targetType: 'User' | 'Role' | 'Management Tier';
  targetName: string;
  companyId: string;
  module: string;
  transactionType: string;
  limitAmount: number;
  currency: string;
  effectiveDate: string;
  expiryDate?: string;
  status: 'Active' | 'Inactive';
}

export interface EscalationRule {
  id: string;
  workflowId: string;
  workflowName: string;
  stageNumber: number;
  waitingHours: number;
  escalationRecipient: string;
  reminderFrequencyHours: number;
  maxEscalations: number;
  notifyMethod: 'Email & In-App' | 'SMS Urgent' | 'WhatsApp';
  status: 'Active' | 'Inactive';
}

// 01.04 Financial & Period Controls Types
export interface FiscalYear {
  id: string;
  yearCode: string;
  companyId: string;
  companyName: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  status: 'Open' | 'Closed' | 'Locked' | 'Planning';
  totalPeriods: number;
  openPeriodsCount: number;
}

export interface PostingPeriod {
  id: string;
  fiscalYearId: string;
  fiscalYearCode: string;
  periodNumber: number;
  periodName: string;
  startDate: string;
  endDate: string;
  subLedgers: {
    gl: 'Open' | 'Closed' | 'Locked';
    ap: 'Open' | 'Closed' | 'Locked';
    ar: 'Open' | 'Closed' | 'Locked';
    inventory: 'Open' | 'Closed' | 'Locked';
    fixedAssets: 'Open' | 'Closed' | 'Locked';
    payroll: 'Open' | 'Closed' | 'Locked';
  };
  overallStatus: 'Open' | 'Closed' | 'Locked';
  closedBy?: string;
  closedAt?: string;
}

export interface DocumentSequence {
  id: string;
  documentType: string;
  documentTypeName: string;
  companyId: string;
  companyName: string;
  branchId?: string;
  prefix: string;
  suffix?: string;
  startingNumber: number;
  currentNumber: number;
  numberLength: number;
  fiscalYearReset: boolean;
  sampleFormatted: string;
  status: 'Active' | 'Inactive';
}

export interface PostingControl {
  id: string;
  companyId: string;
  companyName: string;
  allowedBackdatedDays: number;
  allowedFutureDays: number;
  requireFinanceManagerApprovalForBackdate: boolean;
  allowCrossYearPosting: boolean;
  unbalancedJournalBlock: boolean;
  status: 'Enforced' | 'Custom';
}

export interface PeriodLockRecord {
  id: string;
  periodId: string;
  periodName: string;
  companyId: string;
  companyName: string;
  lockedBy: string;
  lockedAt: string;
  lockReason: string;
  unlockRequests: {
    id: string;
    requestedBy: string;
    requestedAt: string;
    reason: string;
    approvedBy?: string;
    approvedAt?: string;
    status: 'Pending' | 'Approved' | 'Rejected';
  }[];
}

// 01.05 Master Data Management Types
export interface MasterDataDefinition {
  id: string;
  code: string;
  entityName: string;
  category: 'Finance' | 'Supply Chain' | 'HR' | 'Projects' | 'Sales';
  ownerDepartment: string;
  approvalRequired: boolean;
  duplicateCheckEnabled: boolean;
  goldenRecordCount: number;
  version: string;
  status: 'Active' | 'Draft';
}

export interface DuplicateRule {
  id: string;
  entityType: string;
  ruleName: string;
  fieldsChecked: string[];
  matchType: 'Exact Match' | 'Fuzzy Partial' | 'Phonetic / Metaphone' | 'Normalized Tax ID';
  similarityThresholdPercent: number;
  actionOnMatch: 'Block Creation' | 'Flag for Review' | 'Warn User';
  status: 'Active' | 'Inactive';
}

export interface ValidationRule {
  id: string;
  entityType: string;
  fieldName: string;
  ruleType: 'Required' | 'Regex Format' | 'Unique Constraint' | 'Range' | 'Conditional Dependency';
  ruleExpression: string;
  errorMessage: string;
  severity: 'Error' | 'Warning';
  status: 'Active' | 'Inactive';
}

export interface MasterDataApprovalRequest {
  id: string;
  entityType: string;
  recordIdentifier: string;
  recordData: Record<string, any>;
  submittedBy: string;
  submittedAt: string;
  status: 'Pending Review' | 'Approved' | 'Rejected' | 'Draft';
  assignedApprover: string;
  comments?: string;
}

// 01.06 Notifications & Alerts Types
export interface NotificationTemplate {
  id: string;
  code: string;
  title: string;
  channel: 'Email' | 'In-App' | 'SMS' | 'Push Notification';
  category: 'Approval' | 'Due Date' | 'Exception' | 'System';
  subject: string;
  bodyTemplate: string;
  variables: string[];
  status: 'Active' | 'Inactive';
}

export interface NotificationRule {
  id: string;
  name: string;
  triggerEvent: string;
  channel: 'Email' | 'In-App' | 'Multi-Channel';
  recipientGroup: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  schedule: 'Immediate' | 'Hourly Digest' | 'Daily Morning (08:00)';
  status: 'Active' | 'Inactive';
}

export interface SystemAlertItem {
  id: string;
  title: string;
  message: string;
  type: 'approval' | 'system' | 'compliance' | 'security';
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  read: boolean;
  moduleRef: string;
  actionUrl?: string;
}

// 01.07 Audit Trail & Activity Monitoring Types
export interface AuditEvent {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT' | 'LOCK' | 'UNLOCK' | 'EXPORT' | 'LOGIN' | 'REVOKE' | 'CONFIG_CHANGE';
  module: string;
  entity: string;
  recordId: string;
  previousValue?: string;
  newValue?: string;
  ipAddress: string;
  userAgent: string;
  result: 'SUCCESS' | 'FAILED' | 'DENIED';
  details: string;
}

export interface LoginHistoryEvent {
  id: string;
  timestamp: string;
  username: string;
  fullName: string;
  result: 'Success' | 'Failed (Bad Password)' | 'Failed (MFA Required)' | 'Blocked (IP Restriction)' | 'Account Locked';
  ipAddress: string;
  location: string;
  device: string;
  browser: string;
}

// 01.08 Integration & API Management Types
export interface ApiClient {
  id: string;
  name: string;
  clientId: string;
  maskedSecret: string;
  scopes: string[];
  rateLimitPerMinute: number;
  dailyRequestCount: number;
  status: 'Active' | 'Suspended' | 'Revoked';
  expiresAt: string;
  createdAt: string;
}

export interface ExternalIntegration {
  id: string;
  name: string;
  provider: string;
  category: 'Banking / Treasury' | 'Tax & Government Portal' | 'WMS / Logistics' | 'Legacy ERP' | 'Payment Gateway';
  endpoint: string;
  authType: 'OAuth 2.0 MTLS' | 'API Key Header' | 'HMAC Signature' | 'AS2 Gateway';
  status: 'Connected / Healthy' | 'Degraded' | 'Offline' | 'Sandbox Mock';
  lastSync: string;
  errorCount24h: number;
  syncSchedule: string;
}

export interface IntegrationLog {
  id: string;
  timestamp: string;
  integrationName: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  statusCode: number;
  durationMs: number;
  status: 'Success' | 'Failed';
  errorMessage?: string;
}

// 01.09 Backup & Recovery Types
export interface BackupConfiguration {
  id: string;
  backupType: 'Full Database' | 'Incremental Transaction Logs' | 'Configuration & Masters Only';
  frequency: 'Daily at 02:00 UTC' | 'Every 6 Hours' | 'Real-time WAL Stream';
  retentionDays: number;
  storageDestination: string;
  encryptionAlgorithm: 'AES-256 GCM';
  lastBackupAt: string;
  lastBackupSizeBytes: number;
  lastBackupStatus: 'Success' | 'Warning' | 'Failed';
  isAutoReplicated: boolean;
}

export interface RestorePoint {
  id: string;
  timestamp: string;
  backupType: string;
  sizeFormatted: string;
  checksumSha256: string;
  location: string;
  verified: boolean;
  status: 'Ready for Sandbox' | 'Archived to Cold Storage';
}

export interface DisasterRecoveryStatus {
  rpoTargetMinutes: number;
  currentRpoMinutes: number;
  rtoTargetMinutes: number;
  currentRtoEstimateMinutes: number;
  primaryRegion: string;
  failoverRegion: string;
  clusterSyncStatus: 'Synchronous Streaming (Healthy)' | 'Catching Up' | 'Degraded';
  drReadinessScore: number;
  lastDrDrillDate: string;
}

// 01.10 Security Management Types
export interface SecurityPolicy {
  id: string;
  policyName: string;
  category: 'Encryption' | 'Network' | 'Session' | 'Data Protection';
  settingValue: string;
  description: string;
  isMandatory: boolean;
  status: 'Enforced' | 'Draft';
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  expiryDays: number;
  preventHistoryCount: number;
  maxFailedAttempts: number;
  lockoutDurationMinutes: number;
}

export interface ActiveSession {
  id: string;
  userId: string;
  userName: string;
  role: string;
  ipAddress: string;
  location: string;
  device: string;
  browser: string;
  loginTime: string;
  lastActiveTime: string;
  status: 'Active' | 'Idle';
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  eventType: 'Failed Login' | 'Privilege Escalation' | 'Multiple Failed MFAs' | 'Unauthorized Endpoint Access' | 'Session Revoked';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  ipAddress: string;
  userId?: string;
  userName?: string;
  details: string;
  actionTaken: 'Account Locked' | 'IP Blocked' | 'Alert Dispatched' | 'Session Terminated' | 'Logged';
}
