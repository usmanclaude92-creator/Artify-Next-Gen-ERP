import { ERPModule } from '../../types/erp';

export const MODULES_01_05: ERPModule[] = [
  {
    id: 'system-management',
    code: '01',
    name: '01 — SYSTEM MANAGEMENT',
    shortName: 'System Management',
    category: 'Enterprise Management',
    description: 'Enterprise governance, security policies, multi-company structure, role-based access control, workflow matrices, and audit logging.',
    icon: 'ShieldAlert',
    color: 'emerald',
    accentColor: 'text-emerald-500',
    phase: 'Phase 2 — System Management',
    phaseNumber: 2,
    kpiPlaceholders: [
      { label: 'Active Companies', value: '4 Operating Entities', status: 'normal' },
      { label: 'Licensed Users', value: '450 / 500 Seats', status: 'normal' },
      { label: 'System Security Health', value: '99.98%', trend: '+0.02%', status: 'positive' },
      { label: 'Pending Workflow Configs', value: '3 Workflows', status: 'warning' }
    ],
    aiSuggestions: [
      'Detect anomalous login locations across subsidiary networks',
      'Audit segregation of duties conflicts between AP Clerks and Approvers',
      'Generate quarterly access privilege review for ISO 27001 audit'
    ],
    functionalAreas: [
      {
        id: 'company-organization-setup',
        code: '01.01',
        name: 'Company & Organization Setup',
        description: 'Manage companies, branches, locations, organizational structures, fiscal years and posting periods.',
        icon: 'Building2',
        phase: 'Phase 2 — System Management',
        processes: [
          {
            id: 'company-setup',
            code: '01.01.01',
            name: 'Company Setup',
            description: 'Create and manage companies and company configuration.',
            phase: 'Phase 2 — System Management',
            transactions: [
              { id: 'tx-company-creation', code: '01.01.01.01', name: 'Company Creation', description: 'Incorporate and register new legal entities in the ERP master registry.', phase: 'Phase 2 — System Management', actionType: 'master', requiredPermissions: ['VIEW', 'CREATE', 'ADMIN'] },
              { id: 'tx-company-profile', code: '01.01.01.02', name: 'Company Profile', description: 'Maintain trade names, commercial registration (CR), and legal structure.', phase: 'Phase 2 — System Management', actionType: 'master', requiredPermissions: ['VIEW', 'EDIT', 'ADMIN'] },
              { id: 'tx-company-info', code: '01.01.01.03', name: 'Company Information', description: 'Statutory address, corporate tax ID, TRN, contact details, and executive leadership.', phase: 'Phase 2 — System Management', actionType: 'master', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-company-branding', code: '01.01.01.04', name: 'Company Logo & Branding', description: 'Brand assets, high-res corporate logos, theme colors, and statutory letterheads.', phase: 'Phase 2 — System Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT', 'ADMIN'] },
              { id: 'tx-company-params', code: '01.01.01.05', name: 'Company Parameters', description: 'Base functional currency, decimal precision, tax scheme, and fiscal start parameters.', phase: 'Phase 2 — System Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT', 'ADMIN'] }
            ]
          },
          {
            id: 'branch-location-setup',
            code: '01.01.02',
            name: 'Branch & Location Setup',
            description: 'Manage branches, locations and sites.',
            phase: 'Phase 2 — System Management',
            transactions: [
              { id: 'tx-branch-creation', code: '01.01.02.01', name: 'Branch Creation', description: 'Define operational branches, commercial offices, and regional service hubs.', phase: 'Phase 2 — System Management', actionType: 'master', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-location-creation', code: '01.01.02.02', name: 'Location Creation', description: 'Physical corporate locations, GPS coordinates, facilities, and regional zones.', phase: 'Phase 2 — System Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-site-creation', code: '01.01.02.03', name: 'Site Creation', description: 'Industrial plants, project construction sites, storage yards, and depots.', phase: 'Phase 2 — System Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-branch-location-assign', code: '01.01.02.04', name: 'Branch/Location Assignment', description: 'Cross-assign operational locations and facility hubs to legal branches.', phase: 'Phase 2 — System Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT', 'ADMIN'] }
            ]
          },
          {
            id: 'org-structure',
            code: '01.01.03',
            name: 'Organizational Structure',
            description: 'Manage divisions, departments and sections.',
            phase: 'Phase 2 — System Management',
            transactions: [
              { id: 'tx-dept-setup', code: '01.01.03.01', name: 'Department Setup', description: 'Cost centers, functional departments, and operational teams.', phase: 'Phase 2 — System Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-division-setup', code: '01.01.03.02', name: 'Division Setup', description: 'Strategic business divisions and segmental P&L reporting units.', phase: 'Phase 2 — System Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-section-setup', code: '01.01.03.03', name: 'Section Setup', description: 'Sub-department functional sections, project squads, and operational cells.', phase: 'Phase 2 — System Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-reporting-structure', code: '01.01.03.04', name: 'Reporting Structure', description: 'Hierarchical organogram, reporting matrix, and line-manager escalation chains.', phase: 'Phase 2 — System Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT', 'ADMIN'] }
            ]
          },
          {
            id: 'fiscal-year',
            code: '01.01.04',
            name: 'Fiscal Year',
            description: 'Manage fiscal years and year-end settings.',
            phase: 'Phase 2 — System Management',
            transactions: [
              { id: 'tx-fy-creation', code: '01.01.04.01', name: 'Fiscal Year Creation', description: 'Create and define statutory accounting years for each legal entity.', phase: 'Phase 2 — System Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'CREATE', 'ADMIN'] },
              { id: 'tx-fy-opening', code: '01.01.04.02', name: 'Fiscal Year Opening', description: 'Initialize beginning ledger balances and open new accounting calendar.', phase: 'Phase 2 — System Management', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST', 'ADMIN'] },
              { id: 'tx-fy-closing', code: '01.01.04.03', name: 'Fiscal Year Closing', description: 'Year-end financial close, audit adjustments, and retained earnings rollover.', phase: 'Phase 2 — System Management', actionType: 'transaction', requiredPermissions: ['VIEW', 'ADMIN'] },
              { id: 'tx-ye-config', code: '01.01.04.04', name: 'Year-End Configuration', description: 'GL retained earnings mapping, depreciation auto-run, and P13 adjustment setup.', phase: 'Phase 2 — System Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT', 'ADMIN'] }
            ]
          },
          {
            id: 'posting-periods',
            code: '01.01.05',
            name: 'Posting Periods',
            description: 'Manage financial posting periods.',
            phase: 'Phase 2 — System Management',
            transactions: [
              { id: 'tx-period-creation', code: '01.01.05.01', name: 'Period Creation', description: 'Generate monthly accounting periods (P01–P12 + Special Closing P13).', phase: 'Phase 2 — System Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'CREATE', 'ADMIN'] },
              { id: 'tx-period-opening', code: '01.01.05.02', name: 'Period Opening', description: 'Authorize and open posting periods across company sub-ledgers.', phase: 'Phase 2 — System Management', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST', 'ADMIN'] },
              { id: 'tx-period-closing', code: '01.01.05.03', name: 'Period Closing', description: 'Perform month-end sub-ledger cutoffs and period closing routines.', phase: 'Phase 2 — System Management', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST', 'ADMIN'] },
              { id: 'tx-period-locking', code: '01.01.05.04', name: 'Period Locking', description: 'Sub-ledger lock matrix (GL, AP, AR, Inventory, Fixed Assets, Payroll) with emergency unlock.', phase: 'Phase 2 — System Management', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST', 'ADMIN'] }
            ]
          }
        ]
      },
      {
        id: 'user-access-mgmt',
        code: '01.02',
        name: 'User & Access Management',
        description: 'Identity lifecycle management, role definitions, permission sets, and segregation of duties (SoD).',
        icon: 'Users',
        phase: 'Phase 2 — System Management',
        processes: [
          {
            id: 'access-control-proc',
            code: '01.02.01',
            name: 'User & Access Controls',
            description: 'User provisioning, cryptographic authentication, role matrices, and granular authorization rules.',
            phase: 'Phase 2 — System Management',
            transactions: [
              { id: 'tx-user-mgmt', code: '01.02.01.01', name: 'User Management', description: 'Provision user accounts, identity federation, and active status controls.', phase: 'Phase 2 — System Management', actionType: 'master', requiredPermissions: ['VIEW', 'CREATE', 'EDIT', 'ADMIN'] },
              { id: 'tx-roles-perms', code: '01.02.01.02', name: 'Roles & Permissions', description: 'Define functional role profiles, granular action privileges, and view scopes.', phase: 'Phase 2 — System Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT', 'ADMIN'] },
              { id: 'tx-user-groups', code: '01.02.01.03', name: 'User Groups', description: 'Cluster users into security pools for collective permission assignment.', phase: 'Phase 2 — System Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-sod', code: '01.02.01.04', name: 'Segregation of Duties', description: 'Define conflicting role combinations and automatic authorization blocks.', phase: 'Phase 2 — System Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'ADMIN'] },
              { id: 'tx-access-restrictions', code: '01.02.01.05', name: 'Access Restrictions', description: 'IP whitelisting, device binding, and time-based login access windows.', phase: 'Phase 2 — System Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'ADMIN'] }
            ]
          }
        ]
      },
      {
        id: 'workflow-approval-mgmt',
        code: '01.03',
        name: 'Workflow & Approval Management',
        description: 'Multi-tiered dynamic approval engines, delegation matrices, financial limits, and escalation rules.',
        icon: 'GitPullRequest',
        phase: 'Phase 2 — System Management',
        processes: [
          {
            id: 'workflow-proc',
            code: '01.03.01',
            name: 'Approval Engines & Matrices',
            description: 'Document approval routing logic, monetary delegation thresholds, and hierarchy chains.',
            phase: 'Phase 2 — System Management',
            transactions: [
              { id: 'tx-approval-workflows', code: '01.03.01.01', name: 'Approval Workflows', description: 'Visual pipeline builder for multi-step document and requisition approvals.', phase: 'Phase 2 — System Management', actionType: 'workflow', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-approval-matrix', code: '01.03.01.02', name: 'Approval Matrix', description: 'Define department and threshold conditional authorization tables.', phase: 'Phase 2 — System Management', actionType: 'workflow', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-doa', code: '01.03.01.03', name: 'Delegation of Authority', description: 'Temporary proxy and delegation rules during executive leave or travel.', phase: 'Phase 2 — System Management', actionType: 'workflow', requiredPermissions: ['VIEW', 'CREATE', 'APPROVE'] },
              { id: 'tx-approval-limits', code: '01.03.01.04', name: 'Approval Limits', description: 'Monetary spending and commitment thresholds categorized by management tier.', phase: 'Phase 2 — System Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT', 'ADMIN'] },
              { id: 'tx-escalation-rules', code: '01.03.01.05', name: 'Escalation Rules', description: 'Time-elapsed auto-escalation paths for stalled requisitions.', phase: 'Phase 2 — System Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] }
            ]
          }
        ]
      },
      {
        id: 'fin-period-controls',
        code: '01.04',
        name: 'Financial & Period Controls',
        description: 'Fiscal calendars, posting period boundaries, document numbering sequences, and closing locks.',
        icon: 'CalendarClock',
        phase: 'Phase 2 — System Management',
        processes: [
          {
            id: 'period-ctrl-proc',
            code: '01.04.01',
            name: 'Posting & Period Governance',
            description: 'Fiscal sequence controls, open/close monthly ledger posting locks, and document numbering series.',
            phase: 'Phase 2 — System Management',
            transactions: [
              { id: 'tx-fiscal-year', code: '01.04.01.01', name: 'Fiscal Year', description: 'Configure financial accounting years and special audit periods.', phase: 'Phase 2 — System Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT', 'ADMIN'] },
              { id: 'tx-posting-periods', code: '01.04.01.02', name: 'Posting Periods', description: 'Manage monthly calendar splits and sub-ledger posting permissions.', phase: 'Phase 2 — System Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-doc-numbering', code: '01.04.01.03', name: 'Document Numbering', description: 'Automated prefix, suffix, and sequential series for all transaction types.', phase: 'Phase 2 — System Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT', 'ADMIN'] },
              { id: 'tx-posting-controls', code: '01.04.01.04', name: 'Posting Controls', description: 'Back-dating and future-dating validation parameters for general ledger.', phase: 'Phase 2 — System Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-period-lock', code: '01.04.01.05', name: 'Period Lock / Unlock', description: 'Hard and soft period locking mechanisms across AP, AR, GL, and Inventory.', phase: 'Phase 2 — System Management', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST', 'ADMIN'] }
            ]
          }
        ]
      },
      {
        id: 'master-data-mgmt',
        code: '01.05',
        name: 'Master Data Management',
        description: 'Centralized master data governance, deduplication algorithms, and approval workflows for golden records.',
        icon: 'Database',
        phase: 'Phase 2 — System Management',
        processes: [
          {
            id: 'mdm-proc',
            code: '01.05.01',
            name: 'Master Data Governance',
            description: 'Entity schemas, validation rules, golden record curation, and master creation workflows.',
            phase: 'Phase 2 — System Management',
            transactions: [
              { id: 'tx-mdm-defs', code: '01.05.01.01', name: 'Master Data Definitions', description: 'Standard field attributes and taxonomy rules for corporate masters.', phase: 'Phase 2 — System Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-mdm-gov', code: '01.05.01.02', name: 'Master Data Governance', description: 'Ownership assignments, change policies, and lifecycle stages for master data.', phase: 'Phase 2 — System Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'ADMIN'] },
              { id: 'tx-duplicate-ctrl', code: '01.05.01.03', name: 'Duplicate Controls', description: 'Fuzzy matching parameters to prevent duplicate customers, vendors, and items.', phase: 'Phase 2 — System Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-data-val', code: '01.05.01.04', name: 'Data Validation', description: 'Regex validation, mandatory document rules, and format enforcers.', phase: 'Phase 2 — System Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-mdm-approval', code: '01.05.01.05', name: 'Master Data Approval', description: 'Workflow verification prior to activating newly requested master records.', phase: 'Phase 2 — System Management', actionType: 'workflow', requiredPermissions: ['VIEW', 'APPROVE'] }
            ]
          }
        ]
      },
      {
        id: 'notifications-alerts',
        code: '01.06',
        name: 'Notifications & System Alerts',
        description: 'Omnichannel message delivery, push notifications, threshold event triggers, and escalation broadcasts.',
        icon: 'Bell',
        phase: 'Phase 2 — System Management',
        processes: [
          {
            id: 'notif-proc',
            code: '01.06.01',
            name: 'Notification Engines',
            description: 'Alert templates, notification matrices, and delivery channel subscriptions.',
            phase: 'Phase 2 — System Management',
            transactions: [
              { id: 'tx-email-notif', code: '01.06.01.01', name: 'Email Notifications', description: 'SMTP configuration, email templating, and dispatch queues.', phase: 'Phase 2 — System Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-inapp-notif', code: '01.06.01.02', name: 'In-App Notifications', description: 'Real-time WebSocket toast and notification center stream rules.', phase: 'Phase 2 — System Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-approval-alerts', code: '01.06.01.03', name: 'Approval Alerts', description: 'Targeted alerts sent immediately to designated signers upon queue assignment.', phase: 'Phase 2 — System Management', actionType: 'workflow', requiredPermissions: ['VIEW'] },
              { id: 'tx-due-date-alerts', code: '01.06.01.04', name: 'Due Date Alerts', description: 'Scheduled alerts for contract expirations, visa renewals, and overdue invoices.', phase: 'Phase 2 — System Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-exception-alerts', code: '01.06.01.05', name: 'Exception Alerts', description: 'Instant warnings for budget breaches, inventory stockouts, or unauthorized edits.', phase: 'Phase 2 — System Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] }
            ]
          }
        ]
      },
      {
        id: 'audit-trail-monitoring',
        code: '01.07',
        name: 'Audit Trail & Activity Monitoring',
        description: 'Immutable ledger of system changes, forensic user session monitoring, and data modification logs.',
        icon: 'FileText',
        phase: 'Phase 2 — System Management',
        processes: [
          {
            id: 'audit-proc',
            code: '01.07.01',
            name: 'Forensic Audit Logging',
            description: 'Tamper-evident chronological logs of record states, authentications, and system actions.',
            phase: 'Phase 2 — System Management',
            transactions: [
              { id: 'tx-audit-trail', code: '01.07.01.01', name: 'Audit Trail', description: 'Universal search interface for all entity lifecycle modifications.', phase: 'Phase 2 — System Management', actionType: 'report', requiredPermissions: ['VIEW', 'ADMIN'] },
              { id: 'tx-user-activity-logs', code: '01.07.01.02', name: 'User Activity Logs', description: 'Chronological timeline of page views, record queries, and button triggers.', phase: 'Phase 2 — System Management', actionType: 'report', requiredPermissions: ['VIEW', 'ADMIN'] },
              { id: 'tx-login-hist', code: '01.07.01.03', name: 'Login History', description: 'IP, geolocation, device fingerprint, and status of all authentication attempts.', phase: 'Phase 2 — System Management', actionType: 'report', requiredPermissions: ['VIEW', 'ADMIN'] },
              { id: 'tx-rec-change-hist', code: '01.07.01.04', name: 'Record Change History', description: 'Deep diff viewer displaying before and after values for every table field.', phase: 'Phase 2 — System Management', actionType: 'report', requiredPermissions: ['VIEW', 'ADMIN'] },
              { id: 'tx-trans-hist', code: '01.07.01.05', name: 'Transaction History', description: 'Financial posting sequence records and sub-ledger journal linkage traces.', phase: 'Phase 2 — System Management', actionType: 'report', requiredPermissions: ['VIEW', 'ADMIN'] }
            ]
          }
        ]
      },
      {
        id: 'integration-api-mgmt',
        code: '01.08',
        name: 'Integration & API Management',
        description: 'OpenAPI endpoints, webhook triggers, banking protocols, tax gateway connections, and interchange monitoring.',
        icon: 'Cpu',
        phase: 'Phase 2 — System Management',
        processes: [
          {
            id: 'api-proc',
            code: '01.08.01',
            name: 'API Gateways & Integrations',
            description: 'External data pipelines, webhook event buses, and banking API handshake management.',
            phase: 'Phase 2 — System Management',
            transactions: [
              { id: 'tx-api-mgmt', code: '01.08.01.01', name: 'API Management', description: 'API key issuing, rate limiting, scopes, and OpenAPI documentation.', phase: 'Phase 2 — System Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT', 'ADMIN'] },
              { id: 'tx-ext-integration', code: '01.08.01.02', name: 'External System Integration', description: 'Connectors for legacy databases, third-party logistics, and CRM platforms.', phase: 'Phase 2 — System Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT', 'ADMIN'] },
              { id: 'tx-banking-integration', code: '01.08.01.03', name: 'Banking Integration', description: 'Host-to-host Swift, ISO 20022, and Open Banking direct API pipelines.', phase: 'Phase 2 — System Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT', 'ADMIN'] },
              { id: 'tx-tax-gov-integration', code: '01.08.01.04', name: 'Tax / Government Integration', description: 'Direct e-invoicing gateways (ZATCA, Peppol, GSTN) and tax authority APIs.', phase: 'Phase 2 — System Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT', 'ADMIN'] },
              { id: 'tx-integration-logs', code: '01.08.01.05', name: 'Integration Logs', description: 'Payload inspection, HTTP error statuses, and retry queues for failed syncs.', phase: 'Phase 2 — System Management', actionType: 'report', requiredPermissions: ['VIEW', 'ADMIN'] }
            ]
          }
        ]
      },
      {
        id: 'backup-recovery',
        code: '01.09',
        name: 'Backup & Recovery',
        description: 'Point-in-time recovery configurations, snapshot schedules, cloud storage replication, and disaster failovers.',
        icon: 'HardDrive',
        phase: 'Phase 2 — System Management',
        processes: [
          {
            id: 'backup-proc',
            code: '01.09.01',
            name: 'Disaster Recovery & Snapshots',
            description: 'Automated database backups, geo-replicated archives, and restoration drills.',
            phase: 'Phase 2 — System Management',
            transactions: [
              { id: 'tx-db-backup', code: '01.09.01.01', name: 'Database Backup', description: 'Trigger on-demand encrypted database dumps and state snapshots.', phase: 'Phase 2 — System Management', actionType: 'transaction', requiredPermissions: ['VIEW', 'ADMIN'] },
              { id: 'tx-scheduled-backup', code: '01.09.01.02', name: 'Scheduled Backup', description: 'Configure cron schedules for full, differential, and transaction log dumps.', phase: 'Phase 2 — System Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT', 'ADMIN'] },
              { id: 'tx-restore-mgmt', code: '01.09.01.03', name: 'Restore Management', description: 'Sandbox data restoration and rollback execution protocols.', phase: 'Phase 2 — System Management', actionType: 'transaction', requiredPermissions: ['VIEW', 'ADMIN'] },
              { id: 'tx-disaster-recovery', code: '01.09.01.04', name: 'Disaster Recovery', description: 'Multi-region failover cluster parameters and hot-standby replication.', phase: 'Phase 2 — System Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'ADMIN'] },
              { id: 'tx-recovery-logs', code: '01.09.01.05', name: 'Recovery Logs', description: 'Integrity verification logs and checksum validation audit history.', phase: 'Phase 2 — System Management', actionType: 'report', requiredPermissions: ['VIEW', 'ADMIN'] }
            ]
          }
        ]
      },
      {
        id: 'security-mgmt',
        code: '01.10',
        name: 'Security Management',
        description: 'Zero-trust policies, MFA enforcement, password hygiene, session revocation, and threat intelligence.',
        icon: 'Lock',
        phase: 'Phase 2 — System Management',
        processes: [
          {
            id: 'security-proc',
            code: '01.10.01',
            name: 'Security Governance & Policies',
            description: 'Authentication safeguards, MFA policies, active session inspection, and incident mitigation.',
            phase: 'Phase 2 — System Management',
            transactions: [
              { id: 'tx-sec-policies', code: '01.10.01.01', name: 'Security Policies', description: 'Define company-wide data encryption, TLS requirements, and compliance baselines.', phase: 'Phase 2 — System Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT', 'ADMIN'] },
              { id: 'tx-pwd-policies', code: '01.10.01.02', name: 'Password Policies', description: 'Enforce complexity, entropy, rotation cycles, and breached-password blocks.', phase: 'Phase 2 — System Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT', 'ADMIN'] },
              { id: 'tx-auth-mgmt', code: '01.10.01.03', name: 'Authentication', description: 'Configure SAML 2.0, OIDC SSO, FIDO2 WebAuthn keys, and TOTP MFA.', phase: 'Phase 2 — System Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT', 'ADMIN'] },
              { id: 'tx-session-mgmt', code: '01.10.01.04', name: 'Session Management', description: 'Monitor live connected sessions and execute remote session terminations.', phase: 'Phase 2 — System Management', actionType: 'transaction', requiredPermissions: ['VIEW', 'ADMIN'] },
              { id: 'tx-sec-logs', code: '01.10.01.05', name: 'Security Logs', description: 'Real-time SIEM event stream for unauthorized authorization attempts.', phase: 'Phase 2 — System Management', actionType: 'report', requiredPermissions: ['VIEW', 'ADMIN'] }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'business-intelligence',
    code: '02',
    name: '02 — BUSINESS INTELLIGENCE & REPORTING',
    shortName: 'BI & Reporting',
    category: 'Governance & Analytics',
    description: 'Executive KPI dashboards, real-time multidimensional financial reporting, operational analytics, variance analyzers, and custom query builders.',
    icon: 'BarChart3',
    color: 'blue',
    accentColor: 'text-blue-500',
    phase: 'Phase 3 — BI & Reporting',
    phaseNumber: 3,
    kpiPlaceholders: [
      { label: 'Executive Reports Deployed', value: '84 Dashboards', status: 'normal' },
      { label: 'Automated Schedules', value: '142 Active Jobs', status: 'normal' },
      { label: 'Query Compute Latency', value: '180 ms', trend: '-25ms', status: 'positive' },
      { label: 'KPI Target Health', value: '91.4%', trend: '+3.2%', status: 'positive' }
    ],
    aiSuggestions: [
      'Explain current quarter gross margin variance against budget targets',
      'Generate natural language executive summary for monthly board review',
      'Detect top 5 operational cost drivers in project logistics'
    ],
    functionalAreas: [
      {
        id: 'management-dashboards',
        code: '02.01',
        name: 'Management Dashboards',
        description: 'Tiered executive cockpits providing real-time visibility across strategic, functional, and departmental operations.',
        icon: 'LayoutDashboard',
        phase: 'Phase 3 — BI & Reporting',
        processes: [
          {
            id: 'mgmt-dash-proc',
            code: '02.01.01',
            name: 'Executive & Departmental Dashboards',
            description: 'Pre-built and customizable visual cockpits for C-level and business unit leads.',
            phase: 'Phase 3 — BI & Reporting',
            transactions: [
              { id: 'tx-exec-dash', code: '02.01.01.01', name: 'Executive Dashboard', description: 'High-level strategic cockpit showing EBITDA, working capital, and enterprise liquidity.', phase: 'Phase 3 — BI & Reporting', actionType: 'report', requiredPermissions: ['VIEW', 'ADMIN'] },
              { id: 'tx-mgmt-dash', code: '02.01.01.02', name: 'Management Dashboard', description: 'Business unit performance, operating margin metrics, and regional revenue.', phase: 'Phase 3 — BI & Reporting', actionType: 'report', requiredPermissions: ['VIEW'] },
              { id: 'tx-dept-dash', code: '02.01.01.03', name: 'Department Dashboard', description: 'Granular departmental utilization, budget burns, and throughput trackers.', phase: 'Phase 3 — BI & Reporting', actionType: 'report', requiredPermissions: ['VIEW'] },
              { id: 'tx-ops-dash', code: '02.01.01.04', name: 'Operational Dashboard', description: 'Real-time manufacturing lines, order queue counts, and logistics statuses.', phase: 'Phase 3 — BI & Reporting', actionType: 'report', requiredPermissions: ['VIEW'] }
            ]
          }
        ]
      },
      {
        id: 'kpi-management',
        code: '02.02',
        name: 'KPI Management',
        description: 'Enterprise balanced scorecards, strategic objectives, target thresholds, and automated alerting on deviation.',
        icon: 'Target',
        phase: 'Phase 3 — BI & Reporting',
        processes: [
          {
            id: 'kpi-mgmt-proc',
            code: '02.02.01',
            name: 'Target Definition & Scorecards',
            description: 'Organizational KPI formulation, quarterly targets, and performance scorecards.',
            phase: 'Phase 3 — BI & Reporting',
            transactions: [
              { id: 'tx-kpi-def', code: '02.02.01.01', name: 'KPI Definition', description: 'Mathematical formulas, unit dimensions, and source ledger queries for indicators.', phase: 'Phase 3 — BI & Reporting', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-kpi-targets', code: '02.02.01.02', name: 'KPI Targets', description: 'Assign baseline, stretch, and threshold milestones per fiscal timeframe.', phase: 'Phase 3 — BI & Reporting', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-kpi-monitoring', code: '02.02.01.03', name: 'KPI Monitoring', description: 'Live tracking against goal bands with automated breach notifications.', phase: 'Phase 3 — BI & Reporting', actionType: 'report', requiredPermissions: ['VIEW'] },
              { id: 'tx-kpi-scorecards', code: '02.02.01.04', name: 'KPI Scorecards', description: 'Balanced scorecard views segmented by Financial, Customer, Process, and Growth.', phase: 'Phase 3 — BI & Reporting', actionType: 'report', requiredPermissions: ['VIEW'] }
            ]
          }
        ]
      },
      {
        id: 'financial-reporting',
        code: '02.03',
        name: 'Financial Reporting',
        description: 'Multi-entity consolidated financial statements, statutory reporting, and deep drill-down analytics.',
        icon: 'TrendingUp',
        phase: 'Phase 3 — BI & Reporting',
        processes: [
          {
            id: 'fin-rep-proc',
            code: '02.03.01',
            name: 'Statutory & Management Accounts',
            description: 'Standardized P&L, balance sheets, cash flows, and multidimensional financial variance.',
            phase: 'Phase 3 — BI & Reporting',
            transactions: [
              { id: 'tx-pnl-rep', code: '02.03.01.01', name: 'Profit & Loss', description: 'Comprehensive income statement with segment and cost center drill-downs.', phase: 'Phase 3 — BI & Reporting', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT', 'PRINT'] },
              { id: 'tx-balance-sheet-rep', code: '02.03.01.02', name: 'Balance Sheet', description: 'Statement of financial position detailing assets, liabilities, and equity.', phase: 'Phase 3 — BI & Reporting', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT', 'PRINT'] },
              { id: 'tx-cashflow-rep', code: '02.03.01.03', name: 'Cash Flow', description: 'Operating, investing, and financing cash flow schedules.', phase: 'Phase 3 — BI & Reporting', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT', 'PRINT'] },
              { id: 'tx-fin-analysis', code: '02.03.01.04', name: 'Financial Analysis', description: 'DuPont analysis, liquidity ratios, gearing, and profitability metrics.', phase: 'Phase 3 — BI & Reporting', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] }
            ]
          }
        ]
      },
      {
        id: 'operational-reporting',
        code: '02.04',
        name: 'Operational Reporting',
        description: 'Cross-functional operational reports spanning sales order intake, procurement pipelines, stock turns, and project burn rates.',
        icon: 'Layers',
        phase: 'Phase 3 — BI & Reporting',
        processes: [
          {
            id: 'ops-rep-proc',
            code: '02.04.01',
            name: 'Functional Domain Reports',
            description: 'Detailed operational data extracts across sales, purchasing, inventory, HR, and projects.',
            phase: 'Phase 3 — BI & Reporting',
            transactions: [
              { id: 'tx-sales-rep', code: '02.04.01.01', name: 'Sales Reports', description: 'Order book, pipeline conversion ratios, territory revenue, and rep commissions.', phase: 'Phase 3 — BI & Reporting', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] },
              { id: 'tx-purchase-rep', code: '02.04.01.02', name: 'Purchase Reports', description: 'Spend by commodity, supplier lead-time adherence, and open PO commitments.', phase: 'Phase 3 — BI & Reporting', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] },
              { id: 'tx-inventory-rep', code: '02.04.01.03', name: 'Inventory Reports', description: 'Stock turn ratios, dead stock identification, and safety stock shortfalls.', phase: 'Phase 3 — BI & Reporting', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] },
              { id: 'tx-hr-rep', code: '02.04.01.04', name: 'HR Reports', description: 'Headcount movements, overtime cost heatmaps, and turnover analysis.', phase: 'Phase 3 — BI & Reporting', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] },
              { id: 'tx-project-rep', code: '02.04.01.05', name: 'Project Reports', description: 'Earned Value Analysis (EVA), schedule variance, and cost-to-complete trends.', phase: 'Phase 3 — BI & Reporting', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] }
            ]
          }
        ]
      },
      {
        id: 'management-analysis',
        code: '02.05',
        name: 'Management Analysis',
        description: 'Deep profit pool analytics, customer lifetime value, supplier scorecards, and cost breakdown structures.',
        icon: 'PieChart',
        phase: 'Phase 3 — BI & Reporting',
        processes: [
          {
            id: 'mgmt-analysis-proc',
            code: '02.05.01',
            name: 'Strategic Profitability & Analytics',
            description: 'Multidimensional cost allocations and margin contributor analytics.',
            phase: 'Phase 3 — BI & Reporting',
            transactions: [
              { id: 'tx-profit-analysis', code: '02.05.01.01', name: 'Profitability Analysis', description: 'Gross and net margin analysis sliced by product line, region, and channel.', phase: 'Phase 3 — BI & Reporting', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] },
              { id: 'tx-cost-analysis', code: '02.05.01.02', name: 'Cost Analysis', description: 'Activity-based costing analysis, direct vs overhead absorption breakdowns.', phase: 'Phase 3 — BI & Reporting', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] },
              { id: 'tx-customer-analytics', code: '02.05.01.03', name: 'Customer Analytics', description: 'Customer concentration risk, buying frequency, and churn probability.', phase: 'Phase 3 — BI & Reporting', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] },
              { id: 'tx-supplier-analytics', code: '02.05.01.04', name: 'Supplier Analytics', description: 'Pricing trends, defect rates, and vendor delivery consistency metrics.', phase: 'Phase 3 — BI & Reporting', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] }
            ]
          }
        ]
      },
      {
        id: 'variance-aging-analysis',
        code: '02.06',
        name: 'Variance & Aging Analysis',
        description: 'Budget vs Actual variance investigations, accounts receivable aging buckets, and vendor payable aging schedules.',
        icon: 'Clock',
        phase: 'Phase 3 — BI & Reporting',
        processes: [
          {
            id: 'variance-aging-proc',
            code: '02.06.01',
            name: 'Variance & Aging Schedules',
            description: 'Aging distribution analysis and budget variance root-cause inspection.',
            phase: 'Phase 3 — BI & Reporting',
            transactions: [
              { id: 'tx-budget-vs-actual', code: '02.06.01.01', name: 'Budget vs Actual', description: 'Line-by-line departmental variance with percentage thresholds and notes.', phase: 'Phase 3 — BI & Reporting', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] },
              { id: 'tx-cust-aging-rep', code: '02.06.01.02', name: 'Customer Aging', description: 'AR aging matrices across 30, 60, 90, and 120+ days with collection history.', phase: 'Phase 3 — BI & Reporting', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] },
              { id: 'tx-supp-aging-rep', code: '02.06.01.03', name: 'Supplier Aging', description: 'AP aging breakdown to optimize working capital payment timing.', phase: 'Phase 3 — BI & Reporting', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] },
              { id: 'tx-variance-analysis', code: '02.06.01.04', name: 'Variance Analysis', description: 'Standard cost vs actual purchase price and production efficiency variances.', phase: 'Phase 3 — BI & Reporting', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] }
            ]
          }
        ]
      },
      {
        id: 'report-builder',
        code: '02.07',
        name: 'Report Builder',
        description: 'Drag-and-drop semantic query designer, scheduled automated distribution, and multi-format export engines.',
        icon: 'FileCode',
        phase: 'Phase 3 — BI & Reporting',
        processes: [
          {
            id: 'rep-builder-proc',
            code: '02.07.01',
            name: 'Ad-Hoc Design & Delivery',
            description: 'Visual report designer, custom aggregations, and email burst schedules.',
            phase: 'Phase 3 — BI & Reporting',
            transactions: [
              { id: 'tx-custom-rep-builder', code: '02.07.01.01', name: 'Custom Report Builder', description: 'Visual semantic model builder to join ERP tables without writing SQL.', phase: 'Phase 3 — BI & Reporting', actionType: 'configuration', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-drilldown-rep', code: '02.07.01.02', name: 'Drill-Down Reports', description: 'Hierarchical reports allowing drill from balance sheet line to source voucher.', phase: 'Phase 3 — BI & Reporting', actionType: 'report', requiredPermissions: ['VIEW'] },
              { id: 'tx-sched-reports', code: '02.07.01.03', name: 'Scheduled Reports', description: 'Cron distributions sending automated PDF/Excel digests to management.', phase: 'Phase 3 — BI & Reporting', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-export-distribution', code: '02.07.01.04', name: 'Export & Distribution', description: 'Bulk rendering engines supporting CSV, XLSX, PDF, and secure SFTP pushes.', phase: 'Phase 3 — BI & Reporting', actionType: 'transaction', requiredPermissions: ['VIEW', 'EXPORT'] }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'administration',
    code: '03',
    name: '03 — ADMINISTRATION & GENERAL BUSINESS MANAGEMENT',
    shortName: 'Administration',
    category: 'Enterprise Management',
    description: 'Corporate office administration, digital mailroom & correspondence tracking, document version archiving, meeting management, and internal request routing.',
    icon: 'Briefcase',
    color: 'slate',
    accentColor: 'text-slate-500',
    phase: 'Phase 4 — Administration',
    phaseNumber: 4,
    kpiPlaceholders: [
      { label: 'Open Internal Requests', value: '23 Requests', status: 'normal' },
      { label: 'Registered Documents', value: '1,420 Files', status: 'normal' },
      { label: 'Scheduled Board Meetings', value: '4 Upcoming', status: 'normal' },
      { label: 'Avg Request Resolution', value: '1.8 Days', trend: '-0.4d', status: 'positive' }
    ],
    aiSuggestions: [
      'Extract metadata and recipient routing from scanned incoming correspondence',
      'Generate action items summary from uploaded board meeting minutes',
      'Optimize company travel booking itineraries against corporate expense policies'
    ],
    functionalAreas: [
      {
        id: 'office-admin',
        code: '03.01',
        name: 'Office Administration',
        description: 'Facility maintenance, office supplies replenishment, administrative services, and stationery registers.',
        icon: 'Home',
        phase: 'Phase 4 — Administration',
        processes: [
          {
            id: 'office-admin-proc',
            code: '03.01.01',
            name: 'Facility & Office Services',
            description: 'Daily office operation trackers, consumable logs, and maintenance requests.',
            phase: 'Phase 4 — Administration',
            transactions: [
              { id: 'tx-gen-admin', code: '03.01.01.01', name: 'General Administration', description: 'Administrative notices, executive office calendar, and facilities hub.', phase: 'Phase 4 — Administration', actionType: 'master', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-office-services', code: '03.01.01.02', name: 'Office Services', description: 'Catering, security passes, access badge issuing, and janitorial schedules.', phase: 'Phase 4 — Administration', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE'] },
              { id: 'tx-stationery-mgmt', code: '03.01.01.03', name: 'Stationery Management', description: 'Consumables inventory, office supply orders, and stock allocation by dept.', phase: 'Phase 4 — Administration', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-facility-requests', code: '03.01.01.04', name: 'Facility Requests', description: 'Work orders for office repairs, HVAC maintenance, and workstation setups.', phase: 'Phase 4 — Administration', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'APPROVE'] }
            ]
          }
        ]
      },
      {
        id: 'correspondence-mgmt',
        code: '03.02',
        name: 'Correspondence Management',
        description: 'Inbound and outbound official letters, government decrees, courier logs, and digital letter registries.',
        icon: 'Mail',
        phase: 'Phase 4 — Administration',
        processes: [
          {
            id: 'corresp-proc',
            code: '03.02.01',
            name: 'Official Mail & Letters',
            description: 'Barcode tracking, recipient routing, and confidential dispatch logs.',
            phase: 'Phase 4 — Administration',
            transactions: [
              { id: 'tx-incoming-corresp', code: '03.02.01.01', name: 'Incoming Correspondence', description: 'Log inbound official letters, scan attachments, and assign to departments.', phase: 'Phase 4 — Administration', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-outgoing-corresp', code: '03.02.01.02', name: 'Outgoing Correspondence', description: 'Draft, review, approve, and record outward official communications.', phase: 'Phase 4 — Administration', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'APPROVE'] },
              { id: 'tx-internal-corresp', code: '03.02.01.03', name: 'Internal Correspondence', description: 'Inter-departmental memos, policy circulars, and executive announcements.', phase: 'Phase 4 — Administration', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE'] },
              { id: 'tx-corresp-tracking', code: '03.02.01.04', name: 'Correspondence Tracking', description: 'Timeline tracking of responses to time-sensitive external inquiries.', phase: 'Phase 4 — Administration', actionType: 'report', requiredPermissions: ['VIEW'] }
            ]
          }
        ]
      },
      {
        id: 'document-mgmt',
        code: '03.03',
        name: 'Document Management',
        description: 'Enterprise DMS with metadata indexing, OCR scanning, version control, and legal archival policies.',
        icon: 'Folder',
        phase: 'Phase 4 — Administration',
        processes: [
          {
            id: 'doc-mgmt-proc',
            code: '03.03.01',
            name: 'DMS & Digital Archiving',
            description: 'Secure document repository, version control, and automated retention policies.',
            phase: 'Phase 4 — Administration',
            transactions: [
              { id: 'tx-doc-reg', code: '03.03.01.01', name: 'Document Registration', description: 'Upload, tag with metadata taxonomy, and assign access tiers.', phase: 'Phase 4 — Administration', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE'] },
              { id: 'tx-doc-control', code: '03.03.01.02', name: 'Document Control', description: 'Checkout/checkin lock management, watermarking, and classification.', phase: 'Phase 4 — Administration', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT', 'ADMIN'] },
              { id: 'tx-doc-versioning', code: '03.03.01.03', name: 'Document Versioning', description: 'Chronological version history and rollback capabilities for SOPs and policies.', phase: 'Phase 4 — Administration', actionType: 'transaction', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-doc-archiving', code: '03.03.01.04', name: 'Document Archiving', description: 'Long-term immutable cold storage compliant with regulatory retention periods.', phase: 'Phase 4 — Administration', actionType: 'configuration', requiredPermissions: ['VIEW', 'ADMIN'] }
            ]
          }
        ]
      },
      {
        id: 'internal-requests',
        code: '03.04',
        name: 'Internal Requests',
        description: 'Employee helpdesk, internal service requisitions, departmental resource requests, and approval routing.',
        icon: 'Inbox',
        phase: 'Phase 4 — Administration',
        processes: [
          {
            id: 'internal-req-proc',
            code: '03.04.01',
            name: 'Service Ticketing & Approvals',
            description: 'Centralized portal for all non-IT and general administrative requests.',
            phase: 'Phase 4 — Administration',
            transactions: [
              { id: 'tx-employee-req', code: '03.04.01.01', name: 'Employee Requests', description: 'Salary certificates, visa letters, experience letters, and parking passes.', phase: 'Phase 4 — Administration', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE'] },
              { id: 'tx-dept-req', code: '03.04.01.02', name: 'Department Requests', description: 'Departmental resource allocation, temporary equipment, and event support.', phase: 'Phase 4 — Administration', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE'] },
              { id: 'tx-admin-requests', code: '03.04.01.03', name: 'Administrative Requests', description: 'General business service tickets and courier dispatch bookings.', phase: 'Phase 4 — Administration', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE'] },
              { id: 'tx-request-approvals', code: '03.04.01.04', name: 'Request Approvals', description: 'Management decision portal for pending administrative requisitions.', phase: 'Phase 4 — Administration', actionType: 'workflow', requiredPermissions: ['VIEW', 'APPROVE', 'REJECT'] }
            ]
          }
        ]
      },
      {
        id: 'task-activity-mgmt',
        code: '03.05',
        name: 'Task & Activity Management',
        description: 'Enterprise task allocation, cross-departmental milestone tracking, and SLA completion metrics.',
        icon: 'CheckSquare',
        phase: 'Phase 4 — Administration',
        processes: [
          {
            id: 'task-mgmt-proc',
            code: '03.05.01',
            name: 'Task Orchestration & Tracking',
            description: 'Action item assignments, priority matrices, and team completion dashboards.',
            phase: 'Phase 4 — Administration',
            transactions: [
              { id: 'tx-task-create', code: '03.05.01.01', name: 'Task Creation', description: 'Create structured tasks linked to ERP records, clients, or projects.', phase: 'Phase 4 — Administration', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE'] },
              { id: 'tx-task-assign', code: '03.05.01.02', name: 'Task Assignment', description: 'Delegate tasks across team members with estimated effort and due dates.', phase: 'Phase 4 — Administration', actionType: 'transaction', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-task-tracking', code: '03.05.01.03', name: 'Task Tracking', description: 'Kanban board and Gantt schedule view of operational activities.', phase: 'Phase 4 — Administration', actionType: 'report', requiredPermissions: ['VIEW'] },
              { id: 'tx-task-completion', code: '03.05.01.04', name: 'Task Completion', description: 'Verify deliverables, attach output artifacts, and sign off completion.', phase: 'Phase 4 — Administration', actionType: 'transaction', requiredPermissions: ['VIEW', 'APPROVE'] }
            ]
          }
        ]
      },
      {
        id: 'meeting-mgmt',
        code: '03.06',
        name: 'Meeting Management',
        description: 'Executive committee scheduling, agenda distribution, attendee tracking, and automated MoM action items.',
        icon: 'Calendar',
        phase: 'Phase 4 — Administration',
        processes: [
          {
            id: 'meeting-mgmt-proc',
            code: '03.06.01',
            name: 'Meetings & Minutes of Meeting (MoM)',
            description: 'Executive calendar coordination, voting records, and action tracking.',
            phase: 'Phase 4 — Administration',
            transactions: [
              { id: 'tx-meeting-sched', code: '03.06.01.01', name: 'Meeting Scheduling', description: 'Room reservation, video link generation, and recurrence setup.', phase: 'Phase 4 — Administration', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE'] },
              { id: 'tx-participants', code: '03.06.01.02', name: 'Participants', description: 'Manage internal and external attendee rosters and RSVP confirmations.', phase: 'Phase 4 — Administration', actionType: 'transaction', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-agenda', code: '03.06.01.03', name: 'Agenda', description: 'Build structured agendas with discussion time allocations and prep documents.', phase: 'Phase 4 — Administration', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-minutes-actions', code: '03.06.01.04', name: 'Minutes & Actions', description: 'Record official minutes and automatically create assigned task tickets.', phase: 'Phase 4 — Administration', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'APPROVE'] }
            ]
          }
        ]
      },
      {
        id: 'travel-transport-admin',
        code: '03.07',
        name: 'Travel & Transportation Administration',
        description: 'Corporate travel requests, flight/hotel bookings, pool vehicle dispatches, and fuel card logs.',
        icon: 'Navigation',
        phase: 'Phase 4 — Administration',
        processes: [
          {
            id: 'travel-proc',
            code: '03.07.01',
            name: 'Business Travel & Fleet Pooling',
            description: 'Travel itineraries, per-diem allowances, and company vehicle dispatches.',
            phase: 'Phase 4 — Administration',
            transactions: [
              { id: 'tx-travel-requests', code: '03.07.01.01', name: 'Travel Requests', description: 'Submit mission objectives, dates, estimated expenses, and visa requests.', phase: 'Phase 4 — Administration', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE'] },
              { id: 'tx-travel-approvals', code: '03.07.01.02', name: 'Travel Approvals', description: 'Managerial signoff and policy compliance validation for corporate trips.', phase: 'Phase 4 — Administration', actionType: 'workflow', requiredPermissions: ['VIEW', 'APPROVE'] },
              { id: 'tx-vehicle-requests', code: '03.07.01.03', name: 'Vehicle Requests', description: 'Book pool vehicles or chauffeur services for site visits and client transit.', phase: 'Phase 4 — Administration', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE'] },
              { id: 'tx-transport-mgmt', code: '03.07.01.04', name: 'Transportation Management', description: 'Fleet maintenance schedules, odometer logs, and fuel expense audit.', phase: 'Phase 4 — Administration', actionType: 'transaction', requiredPermissions: ['VIEW', 'EDIT'] }
            ]
          }
        ]
      },
      {
        id: 'general-business-services',
        code: '03.08',
        name: 'General Business Services',
        description: 'Vendor contract tracking for office cleaning, catering, security services, and administrative reporting.',
        icon: 'Briefcase',
        phase: 'Phase 4 — Administration',
        processes: [
          {
            id: 'gen-services-proc',
            code: '03.08.01',
            name: 'Office Facilities & Services',
            description: 'Vendor service agreements and administrative expense analysis.',
            phase: 'Phase 4 — Administration',
            transactions: [
              { id: 'tx-service-requests', code: '03.08.01.01', name: 'Service Requests', description: 'Submit requirements for specialized office services and event setups.', phase: 'Phase 4 — Administration', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE'] },
              { id: 'tx-vendor-service-mgmt', code: '03.08.01.02', name: 'Vendor Service Management', description: 'Manage contracts for cleaning, catering, waste, and facility security.', phase: 'Phase 4 — Administration', actionType: 'master', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-office-assets', code: '03.08.01.03', name: 'Office Assets', description: 'Track non-depreciating low-value office furnishings and appliances.', phase: 'Phase 4 — Administration', actionType: 'master', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-admin-reporting', code: '03.08.01.04', name: 'Administrative Reporting', description: 'Summary analysis of administrative overhead, requests, and consumables.', phase: 'Phase 4 — Administration', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'banking-treasury',
    code: '04',
    name: '04 — BANKING & TREASURY MANAGEMENT',
    shortName: 'Banking & Treasury',
    category: 'Core Finance',
    description: 'Corporate bank accounts, electronic payment pipelines, cash forecasting, AI automated statement reconciliation, and post-dated cheque vaults.',
    icon: 'Landmark',
    color: 'amber',
    accentColor: 'text-amber-500',
    phase: 'Phase 5 — Banking & Treasury',
    phaseNumber: 5,
    kpiPlaceholders: [
      { label: 'Consolidated Cash Balance', value: 'OMR 4,820,500', trend: '+12.4%', status: 'positive' },
      { label: 'Unreconciled Bank Lines', value: '14 Items', status: 'warning' },
      { label: 'PDC Vault Under Custody', value: 'OMR 940,000', status: 'normal' },
      { label: '30-Day Liquidity Forecast', value: '+OMR 1.2M Surplus', status: 'positive' }
    ],
    aiSuggestions: [
      'Auto-match 14 unmatched bank statement rows against open AP/AR vouchers',
      'Optimize cash transfers between operating accounts to minimize overdraft interest',
      'Predict 60-day cash pinch points based on milestone billing and supplier terms'
    ],
    functionalAreas: [
      {
        id: 'bank-management',
        code: '04.01',
        name: 'Bank Management',
        description: 'Master record of partner banks, IBAN configurations, signatory mandates, and credit facility limits.',
        icon: 'Building',
        phase: 'Phase 5 — Banking & Treasury',
        processes: [
          {
            id: 'bank-master-proc',
            code: '04.01.01',
            name: 'Bank Master & Mandates',
            description: 'Institution profiles, SWIFT/BIC codes, multi-currency accounts, and signing authority limits.',
            phase: 'Phase 5 — Banking & Treasury',
            transactions: [
              { id: 'tx-bank-master', code: '04.01.01.01', name: 'Bank Master', description: 'Financial institutions, routing numbers, and relationship managers.', phase: 'Phase 5 — Banking & Treasury', actionType: 'master', requiredPermissions: ['VIEW', 'EDIT', 'ADMIN'] },
              { id: 'tx-bank-accounts', code: '04.01.01.02', name: 'Bank Accounts', description: 'Configure GL-linked accounts with IBAN, currency, and overdraft terms.', phase: 'Phase 5 — Banking & Treasury', actionType: 'master', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-bank-signatories', code: '04.01.01.03', name: 'Bank Account Signatories', description: 'Define dual-authorization tiers, power of attorney, and specimen cards.', phase: 'Phase 5 — Banking & Treasury', actionType: 'master', requiredPermissions: ['VIEW', 'ADMIN'] },
              { id: 'tx-bank-limits', code: '04.01.01.04', name: 'Bank Limits', description: 'Overdraft ceilings, daily electronic transfer caps, and currency limits.', phase: 'Phase 5 — Banking & Treasury', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] }
            ]
          }
        ]
      },
      {
        id: 'cash-management',
        code: '04.02',
        name: 'Cash Management',
        description: 'Physical vault management, branch till registers, cash in transit, and daily liquidity position.',
        icon: 'DollarSign',
        phase: 'Phase 5 — Banking & Treasury',
        processes: [
          {
            id: 'cash-mgmt-proc',
            code: '04.02.01',
            name: 'Physical Cash & Positions',
            description: 'Daily cash register reconciliation, vault transfers, and cash collections.',
            phase: 'Phase 5 — Banking & Treasury',
            transactions: [
              { id: 'tx-cash-accounts', code: '04.02.01.01', name: 'Cash Accounts', description: 'Configure physical cash drawers, safe vaults, and till ledger accounts.', phase: 'Phase 5 — Banking & Treasury', actionType: 'master', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-cash-receipts', code: '04.02.01.02', name: 'Cash Receipts', description: 'Issue official numbered cash receipts for counter sales and collections.', phase: 'Phase 5 — Banking & Treasury', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'PRINT'] },
              { id: 'tx-cash-payments', code: '04.02.01.03', name: 'Cash Payments', description: 'Disburse verified cash vouchers with dual counter-signatures.', phase: 'Phase 5 — Banking & Treasury', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] },
              { id: 'tx-cash-position', code: '04.02.01.04', name: 'Cash Position', description: 'Real-time multi-location daily cash balance and till summary.', phase: 'Phase 5 — Banking & Treasury', actionType: 'report', requiredPermissions: ['VIEW'] }
            ]
          }
        ]
      },
      {
        id: 'payment-management',
        code: '04.03',
        name: 'Payment Management',
        description: 'Batch vendor disbursements, printed cheques with micr encoding, ISO electronic wire runs, and multi-tier payment signoffs.',
        icon: 'CreditCard',
        phase: 'Phase 5 — Banking & Treasury',
        processes: [
          {
            id: 'payment-proc',
            code: '04.03.01',
            name: 'Disbursements & Payment Runs',
            description: 'Electronic wire batching, cheque printing runs, and payment authorization queues.',
            phase: 'Phase 5 — Banking & Treasury',
            transactions: [
              { id: 'tx-bank-payments', code: '04.03.01.01', name: 'Bank Payments', description: 'Process direct bank transfers against approved supplier invoices.', phase: 'Phase 5 — Banking & Treasury', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] },
              { id: 'tx-cheque-payments', code: '04.03.01.02', name: 'Cheque Payments', description: 'Print and register serial-numbered corporate cheques.', phase: 'Phase 5 — Banking & Treasury', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'PRINT'] },
              { id: 'tx-elec-payments', code: '04.03.01.03', name: 'Electronic Payments', description: 'Generate NACHA / SEPA / WPS electronic payment batch files.', phase: 'Phase 5 — Banking & Treasury', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'EXPORT'] },
              { id: 'tx-payment-approvals', code: '04.03.01.04', name: 'Payment Approvals', description: 'Executive two-person authorization portal for payment batch releases.', phase: 'Phase 5 — Banking & Treasury', actionType: 'workflow', requiredPermissions: ['VIEW', 'APPROVE', 'REJECT'] }
            ]
          }
        ]
      },
      {
        id: 'receipt-management',
        code: '04.04',
        name: 'Receipt Management',
        description: 'Customer payment collections, direct wire receipts, deposit slips, and automated invoice line allocation.',
        icon: 'ArrowDownLeft',
        phase: 'Phase 5 — Banking & Treasury',
        processes: [
          {
            id: 'receipt-proc',
            code: '04.04.01',
            name: 'Receipting & Collections',
            description: 'Collection logging, unearned revenue booking, and automatic invoice settlement.',
            phase: 'Phase 5 — Banking & Treasury',
            transactions: [
              { id: 'tx-cust-receipts', code: '04.04.01.01', name: 'Customer Receipts', description: 'Record collections against outstanding customer accounts receivable.', phase: 'Phase 5 — Banking & Treasury', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] },
              { id: 'tx-other-receipts', code: '04.04.01.02', name: 'Other Receipts', description: 'Record miscellaneous receipts, interest credits, and asset disposal funds.', phase: 'Phase 5 — Banking & Treasury', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] },
              { id: 'tx-deposits', code: '04.04.01.03', name: 'Deposits', description: 'Batch cheque and cash deposits to create physical bank deposit slips.', phase: 'Phase 5 — Banking & Treasury', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'PRINT'] },
              { id: 'tx-receipt-allocation', code: '04.04.01.04', name: 'Receipt Allocation', description: 'Allocate bulk customer receipts against specific invoice line items and tax.', phase: 'Phase 5 — Banking & Treasury', actionType: 'transaction', requiredPermissions: ['VIEW', 'EDIT', 'POST'] }
            ]
          }
        ]
      },
      {
        id: 'bank-reconciliation',
        code: '04.05',
        name: 'Bank Reconciliation',
        description: 'MT940/CAMT.053 statement import, algorithmic rule-based matching, manual reconciliation, and interest adjustments.',
        icon: 'CheckCircle',
        phase: 'Phase 5 — Banking & Treasury',
        processes: [
          {
            id: 'bank-recon-proc',
            code: '04.05.01',
            name: 'Statement Matching & Reconciliation',
            description: 'Automated bank feed intake, match rules, and reconciliation signoffs.',
            phase: 'Phase 5 — Banking & Treasury',
            transactions: [
              { id: 'tx-bank-stmt-import', code: '04.05.01.01', name: 'Bank Statement Import', description: 'Upload MT940, CSV, and OFX electronic statement feeds.', phase: 'Phase 5 — Banking & Treasury', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE'] },
              { id: 'tx-auto-matching', code: '04.05.01.02', name: 'Automatic Matching', description: 'Rule-based matching engine pairing statement lines to ERP ledger vouchers.', phase: 'Phase 5 — Banking & Treasury', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST'] },
              { id: 'tx-manual-recon', code: '04.05.01.03', name: 'Manual Reconciliation', description: 'Side-by-side reconciliation interface for exception resolution.', phase: 'Phase 5 — Banking & Treasury', actionType: 'transaction', requiredPermissions: ['VIEW', 'EDIT', 'POST'] },
              { id: 'tx-recon-adjustments', code: '04.05.01.04', name: 'Reconciliation Adjustments', description: 'Book bank charges, interest credits, and FX exchange differences on the fly.', phase: 'Phase 5 — Banking & Treasury', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] }
            ]
          }
        ]
      },
      {
        id: 'petty-cash',
        code: '04.06',
        name: 'Petty Cash',
        description: 'Imprest fund administration, staff expense claims, float advances, and monthly reconciliation.',
        icon: 'Coins',
        phase: 'Phase 5 — Banking & Treasury',
        processes: [
          {
            id: 'petty-cash-proc',
            code: '04.06.01',
            name: 'Imprest Funds & Petty Cash',
            description: 'Custodian floats, expense voucher registers, and top-up reimbursements.',
            phase: 'Phase 5 — Banking & Treasury',
            transactions: [
              { id: 'tx-petty-cash-accts', code: '04.06.01.01', name: 'Petty Cash Accounts', description: 'Configure imprest float limits and custodian user linkages.', phase: 'Phase 5 — Banking & Treasury', actionType: 'master', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-petty-cash-adv', code: '04.06.01.02', name: 'Petty Cash Advances', description: 'Disburse temporary employee floats with settlement due dates.', phase: 'Phase 5 — Banking & Treasury', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] },
              { id: 'tx-petty-cash-exp', code: '04.06.01.03', name: 'Petty Cash Expenses', description: 'Register receipts for office consumables, local travel, and emergency repairs.', phase: 'Phase 5 — Banking & Treasury', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] },
              { id: 'tx-petty-cash-recon', code: '04.06.01.04', name: 'Petty Cash Reconciliation', description: 'Reconcile physical cash on hand against vouchers to trigger replenishment.', phase: 'Phase 5 — Banking & Treasury', actionType: 'transaction', requiredPermissions: ['VIEW', 'APPROVE', 'POST'] }
            ]
          }
        ]
      },
      {
        id: 'treasury-mgmt',
        code: '04.07',
        name: 'Treasury Management',
        description: 'Multi-currency liquidity forecasts, post-dated cheque vaults, credit line utilizations, and interest optimization.',
        icon: 'Briefcase',
        phase: 'Phase 5 — Banking & Treasury',
        processes: [
          {
            id: 'treasury-proc',
            code: '04.07.01',
            name: 'Liquidity & PDC Vault',
            description: 'Cash flow forecasting, PDC tracking, and credit facility covenants.',
            phase: 'Phase 5 — Banking & Treasury',
            transactions: [
              { id: 'tx-cash-flow-forecast', code: '04.07.01.01', name: 'Cash Flow Forecast', description: 'Rolling 13-week operational cash forecast modeling receivables and payables.', phase: 'Phase 5 — Banking & Treasury', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] },
              { id: 'tx-treasury-position', code: '04.07.01.02', name: 'Treasury Position', description: 'Consolidated view of bank balances, short-term investments, and borrowings.', phase: 'Phase 5 — Banking & Treasury', actionType: 'report', requiredPermissions: ['VIEW'] },
              { id: 'tx-bank-facilities', code: '04.07.01.03', name: 'Bank Facilities', description: 'Track Letters of Credit (LC), Bank Guarantees (BG), and overdraft lines.', phase: 'Phase 5 — Banking & Treasury', actionType: 'master', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-bank-charges', code: '04.07.01.04', name: 'Bank Charges', description: 'Audit monthly bank service fees and transaction commissions against agreements.', phase: 'Phase 5 — Banking & Treasury', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST'] },
              { id: 'tx-pdc', code: '04.07.01.05', name: 'Post-Dated Cheques', description: 'Vault management for issued and received PDCs with maturity alert triggers.', phase: 'Phase 5 — Banking & Treasury', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'procurement',
    code: '05',
    name: '05 — PROCUREMENT & PURCHASING',
    shortName: 'Procurement & Purchasing',
    category: 'Operations & Supply',
    description: 'Strategic sourcing, purchase requisition approvals, RFQ bidding matrices, 3-way invoice matching, and supplier performance scorecards.',
    icon: 'ShoppingCart',
    color: 'teal',
    accentColor: 'text-teal-500',
    phase: 'Phase 6 — Procurement',
    phaseNumber: 6,
    kpiPlaceholders: [
      { label: 'Active Purchase Orders', value: 'OMR 2,410,000', status: 'normal' },
      { label: 'Pending Requisitions', value: '18 Requisitions', status: 'warning' },
      { label: 'Active Qualified Vendors', value: '312 Vendors', status: 'normal' },
      { label: 'Avg RFQ Turnaround', value: '4.2 Days', trend: '-1.1d', status: 'positive' }
    ],
    aiSuggestions: [
      'Compare 3 supplier quotations for steel rebar and recommend best total cost of ownership',
      'Detect price variances exceeding 5% between PO unit prices and historical contracts',
      'Auto-generate standard RFQ document package based on engineering requisition specs'
    ],
    functionalAreas: [
      {
        id: 'purchase-planning',
        code: '05.01',
        name: 'Purchase Planning',
        description: 'Annual procurement plans, purchase forecast models, and commodity budget allocations.',
        icon: 'Calendar',
        phase: 'Phase 6 — Procurement',
        processes: [
          {
            id: 'purchase-plan-proc',
            code: '05.01.01',
            name: 'Procurement Strategy & Forecasting',
            description: 'Demand aggregation and corporate purchasing budget alignment.',
            phase: 'Phase 6 — Procurement',
            transactions: [
              { id: 'tx-proc-plan', code: '05.01.01.01', name: 'Procurement Plan', description: 'Define strategic quarterly procurement schedules linked to projects and ops.', phase: 'Phase 6 — Procurement', actionType: 'configuration', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-purchase-forecast', code: '05.01.01.02', name: 'Purchase Forecast', description: 'Forecast material requirements based on historical consumption and sales pipelines.', phase: 'Phase 6 — Procurement', actionType: 'report', requiredPermissions: ['VIEW'] },
              { id: 'tx-proc-budget', code: '05.01.01.03', name: 'Procurement Budget', description: 'Category-level purchasing budget limits and commitment checkpoints.', phase: 'Phase 6 — Procurement', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] }
            ]
          }
        ]
      },
      {
        id: 'purchase-requisition',
        code: '05.02',
        name: 'Purchase Requisition',
        description: 'Internal purchase requests, multi-tier budget check approvals, and requisition conversion.',
        icon: 'FilePlus',
        phase: 'Phase 6 — Procurement',
        processes: [
          {
            id: 'pr-proc',
            code: '05.02.01',
            name: 'Requisitions & Approval Routing',
            description: 'Departmental PR entry, budget validations, and buyer assignment.',
            phase: 'Phase 6 — Procurement',
            transactions: [
              { id: 'tx-pr-create', code: '05.02.01.01', name: 'Requisition Creation', description: 'Submit material/service requisitions with required delivery dates and specs.', phase: 'Phase 6 — Procurement', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE'] },
              { id: 'tx-pr-approval', code: '05.02.01.02', name: 'Requisition Approval', description: 'Review, check budget availability, and approve PRs via workflow engine.', phase: 'Phase 6 — Procurement', actionType: 'workflow', requiredPermissions: ['VIEW', 'APPROVE', 'REJECT'] },
              { id: 'tx-pr-tracking', code: '05.02.01.03', name: 'Requisition Tracking', description: 'Track lifecycle from PR creation through RFQ, PO, and goods delivery.', phase: 'Phase 6 — Procurement', actionType: 'report', requiredPermissions: ['VIEW'] }
            ]
          }
        ]
      },
      {
        id: 'rfq-mgmt',
        code: '05.03',
        name: 'Request for Quotation',
        description: 'Sourcing events, automated vendor invitations, digital document packages, and bid submissions.',
        icon: 'Send',
        phase: 'Phase 6 — Procurement',
        processes: [
          {
            id: 'rfq-proc',
            code: '05.03.01',
            name: 'Tenders & RFQ Sourcing',
            description: 'Issue RFQs to vetted vendor pools and collect commercial/technical bids.',
            phase: 'Phase 6 — Procurement',
            transactions: [
              { id: 'tx-rfq-create', code: '05.03.01.01', name: 'RFQ Creation', description: 'Assemble technical specifications, delivery terms, and bidding deadlines.', phase: 'Phase 6 — Procurement', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE'] },
              { id: 'tx-supp-invitation', code: '05.03.01.02', name: 'Supplier Invitation', description: 'Select and dispatch encrypted RFQ invites to qualified suppliers.', phase: 'Phase 6 — Procurement', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE'] },
              { id: 'tx-rfq-response', code: '05.03.01.03', name: 'RFQ Response', description: 'Log received supplier bids, commercial terms, and compliance declarations.', phase: 'Phase 6 — Procurement', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] }
            ]
          }
        ]
      },
      {
        id: 'supplier-quotation',
        code: '05.04',
        name: 'Supplier Quotation',
        description: 'Commercial bid tabulation, technical scoring, comparative evaluation matrices, and supplier selection signoff.',
        icon: 'Columns',
        phase: 'Phase 6 — Procurement',
        processes: [
          {
            id: 'supp-quote-proc',
            code: '05.04.01',
            name: 'Bid Comparison & Award',
            description: 'Side-by-side bid analysis, landed cost comparisons, and award recommendations.',
            phase: 'Phase 6 — Procurement',
            transactions: [
              { id: 'tx-quote-entry', code: '05.04.01.01', name: 'Quotation Entry', description: 'Enter detailed line item pricing, payment terms, and validity dates from bids.', phase: 'Phase 6 — Procurement', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE'] },
              { id: 'tx-quote-comparison', code: '05.04.01.02', name: 'Quotation Comparison', description: 'Comparative price matrix with freight, duties, discounts, and delivery dates.', phase: 'Phase 6 — Procurement', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] },
              { id: 'tx-supp-selection', code: '05.04.01.03', name: 'Supplier Selection', description: 'Record procurement committee justification and final supplier award signoff.', phase: 'Phase 6 — Procurement', actionType: 'workflow', requiredPermissions: ['VIEW', 'APPROVE'] }
            ]
          }
        ]
      },
      {
        id: 'purchase-orders',
        code: '05.05',
        name: 'Purchase Orders',
        description: 'Standard and blanket purchase agreements, legally binding terms, electronic PO dispatch, and revision history.',
        icon: 'FileCheck',
        phase: 'Phase 6 — Procurement',
        processes: [
          {
            id: 'po-proc',
            code: '05.05.01',
            name: 'Purchase Order Execution',
            description: 'Contractual commitment documents, approval routing, and vendor acknowledgments.',
            phase: 'Phase 6 — Procurement',
            transactions: [
              { id: 'tx-std-po', code: '05.05.01.01', name: 'Standard Purchase Order', description: 'Generate binding PO vouchers specifying terms, Incoterms, and schedules.', phase: 'Phase 6 — Procurement', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-blanket-po', code: '05.05.01.02', name: 'Blanket Purchase Order', description: 'Establish long-term rate contracts with periodic release orders.', phase: 'Phase 6 — Procurement', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-po-approval', code: '05.05.01.03', name: 'Purchase Order Approval', description: 'Authorizer workflow signoff based on financial delegation matrix.', phase: 'Phase 6 — Procurement', actionType: 'workflow', requiredPermissions: ['VIEW', 'APPROVE', 'REJECT'] },
              { id: 'tx-po-tracking', code: '05.05.01.04', name: 'Purchase Order Tracking', description: 'Monitor order acknowledgment, manufacturing status, and shipping updates.', phase: 'Phase 6 — Procurement', actionType: 'report', requiredPermissions: ['VIEW'] }
            ]
          }
        ]
      },
      {
        id: 'purchasing-receipts',
        code: '05.06',
        name: 'Purchasing Receipts',
        description: 'Warehouse goods receipt notes (GRN), service completion signoffs, and quality receipt inspections.',
        icon: 'PackageCheck',
        phase: 'Phase 6 — Procurement',
        processes: [
          {
            id: 'grn-proc',
            code: '05.06.01',
            name: 'Receiving & Inspection',
            description: 'Physical receipt against PO quantities, batch tracking, and discrepancy handling.',
            phase: 'Phase 6 — Procurement',
            transactions: [
              { id: 'tx-goods-receipt', code: '05.06.01.01', name: 'Goods Receipt', description: 'Receive physical materials into warehouse stock against active purchase orders.', phase: 'Phase 6 — Procurement', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] },
              { id: 'tx-service-receipt', code: '05.06.01.02', name: 'Service Receipt', description: 'Sign off completion of contracted services, consulting, or site labor.', phase: 'Phase 6 — Procurement', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] },
              { id: 'tx-receipt-inspection', code: '05.06.01.03', name: 'Receipt Inspection', description: 'Record QC pass/fail checks before releasing items into available inventory.', phase: 'Phase 6 — Procurement', actionType: 'transaction', requiredPermissions: ['VIEW', 'EDIT', 'POST'] }
            ]
          }
        ]
      },
      {
        id: 'purchase-invoice',
        code: '05.07',
        name: 'Purchase Invoice',
        description: 'Vendor bill entry, automated 3-way matching (PO vs GRN vs Invoice), tax calculation, and payment authorization.',
        icon: 'Receipt',
        phase: 'Phase 6 — Procurement',
        processes: [
          {
            id: 'pi-proc',
            code: '05.07.01',
            name: 'Accounts Payable Invoicing',
            description: 'Invoice verification, 3-way tolerance matching, and financial ledger posting.',
            phase: 'Phase 6 — Procurement',
            transactions: [
              { id: 'tx-supp-invoice', code: '05.07.01.01', name: 'Supplier Invoice', description: 'Register vendor tax invoices with tax codes and payment due dates.', phase: 'Phase 6 — Procurement', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE'] },
              { id: 'tx-inv-verification', code: '05.07.01.02', name: 'Invoice Verification', description: 'Verify invoice mathematical accuracy, tax registration numbers, and currency.', phase: 'Phase 6 — Procurement', actionType: 'transaction', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-inv-matching', code: '05.07.01.03', name: 'Invoice Matching', description: 'Automated 3-way matching of quantities and unit rates within preset tolerances.', phase: 'Phase 6 — Procurement', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST'] },
              { id: 'tx-inv-approval', code: '05.07.01.04', name: 'Invoice Approval', description: 'Final AP approval for ledger posting and payment queue insertion.', phase: 'Phase 6 — Procurement', actionType: 'workflow', requiredPermissions: ['VIEW', 'APPROVE', 'POST'] }
            ]
          }
        ]
      },
      {
        id: 'purchase-returns',
        code: '05.08',
        name: 'Purchase Returns',
        description: 'Damaged or non-conforming goods return notes, supplier debit memos, and inventory value reversals.',
        icon: 'RotateCcw',
        phase: 'Phase 6 — Procurement',
        processes: [
          {
            id: 'purchase-ret-proc',
            code: '05.08.01',
            name: 'Vendor Returns & Debit Notes',
            description: 'Rejection logistics, vendor RMA tracking, and accounting debit notes.',
            phase: 'Phase 6 — Procurement',
            transactions: [
              { id: 'tx-goods-return', code: '05.08.01.01', name: 'Goods Return', description: 'Dispatch rejected goods back to vendor with Return Material Authorization (RMA).', phase: 'Phase 6 — Procurement', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] },
              { id: 'tx-service-return', code: '05.08.01.02', name: 'Service Return', description: 'Dispute unsatisfactory service deliverables and reverse service accruals.', phase: 'Phase 6 — Procurement', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] },
              { id: 'tx-supp-debit-note', code: '05.08.01.03', name: 'Supplier Debit Note', description: 'Issue commercial debit note reducing vendor payable balance and VAT.', phase: 'Phase 6 — Procurement', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] }
            ]
          }
        ]
      },
      {
        id: 'supplier-mgmt',
        code: '05.09',
        name: 'Supplier Management',
        description: 'Vendor master directory, onboarding compliance, ESG qualification, SLA evaluations, and contract archives.',
        icon: 'Users',
        phase: 'Phase 6 — Procurement',
        processes: [
          {
            id: 'supp-mgmt-proc',
            code: '05.09.01',
            name: 'Vendor Lifecycle & Evaluation',
            description: 'Supplier profiles, qualification audits, and ongoing SLA scorecards.',
            phase: 'Phase 6 — Procurement',
            transactions: [
              { id: 'tx-supp-master', code: '05.09.01.01', name: 'Supplier Master', description: 'Comprehensive vendor directory with bank details, tax numbers, and addresses.', phase: 'Phase 6 — Procurement', actionType: 'master', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-supp-eval', code: '05.09.01.02', name: 'Supplier Evaluation', description: 'Score supplier performance on on-time delivery, defect rate, and price competitiveness.', phase: 'Phase 6 — Procurement', actionType: 'report', requiredPermissions: ['VIEW', 'CREATE'] },
              { id: 'tx-supp-contracts', code: '05.09.01.03', name: 'Supplier Contracts', description: 'Archive master service agreements, NDAs, rate contracts, and renewal dates.', phase: 'Phase 6 — Procurement', actionType: 'master', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-supp-perf', code: '05.09.01.04', name: 'Supplier Performance', description: 'Historical dashboard of supplier order fulfillment metrics and risk tiering.', phase: 'Phase 6 — Procurement', actionType: 'report', requiredPermissions: ['VIEW'] }
            ]
          }
        ]
      }
    ]
  }
];
