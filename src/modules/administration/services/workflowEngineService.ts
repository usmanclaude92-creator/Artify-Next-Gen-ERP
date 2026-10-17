import { mockRandom } from '@/src/utils/mockRandom';
// ============================================================================
// Artify Financial Ecosystem (AFE) Enterprise Workflow Engine & Validation Service
// Enforces Backend-Validated Approval Levels, Segregation of Duties (SoD),
// Sequential Authorization Tiers, and Centralized Audit Logging for Module 03.
// ============================================================================

export interface WorkflowApproverStage {
  level: number;
  role: string;
  approverName: string;
  approverUserId?: string;
  approvalLimitOMR?: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Waiting' | 'Skipped';
  decisionDate?: string;
  comments?: string;
  requiredSlaHours?: number;
}

export interface WorkflowEvaluationResult {
  workflowCode: string;
  workflowName: string;
  totalLevels: number;
  stages: WorkflowApproverStage[];
  sodRulesApplied: string[];
  requiresExecutiveSignoff: boolean;
}

export interface UserContext {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  department: string;
  approvalLimitOMR: number;
  employeeRef?: string;
  branch?: string;
}

// Pre-configured enterprise users for simulation and role switching
export const ENTERPRISE_ACTORS: UserContext[] = [
  {
    id: 'usr-1',
    userId: 'U1001',
    name: 'Sarah Jenkins',
    email: 's.jenkins@artify-group.com',
    role: 'CFO / Group Financial Officer',
    department: 'Corporate Finance & Treasury',
    approvalLimitOMR: 100000,
    employeeRef: 'EMP-00102',
    branch: 'Muscat HQ'
  },
  {
    id: 'usr-2',
    userId: 'U1002',
    name: 'Eng. Salim Al-Rawahi',
    email: 's.alrawahi@artify-group.com',
    role: 'Group Chief Executive Officer (CEO)',
    department: 'Executive Directorate',
    approvalLimitOMR: 500000,
    employeeRef: 'EMP-00001',
    branch: 'Muscat HQ'
  },
  {
    id: 'usr-mgr',
    userId: 'U1009',
    name: 'Eng. Khalid Al-Amri',
    email: 'k.alamri@artify-group.com',
    role: 'Line Manager / Operations Head',
    department: 'Office Administration & Corporate Services',
    approvalLimitOMR: 1500,
    employeeRef: 'EMP-00215',
    branch: 'Muscat HQ'
  },
  {
    id: 'usr-dir',
    userId: 'U1010',
    name: 'Tariq Al-Lawati',
    email: 't.lawati@artify-group.com',
    role: 'Director of Corporate Administration',
    department: 'Office Administration & Corporate Services',
    approvalLimitOMR: 10000,
    employeeRef: 'EMP-00088',
    branch: 'Muscat HQ'
  },
  {
    id: 'usr-hr',
    userId: 'U1011',
    name: 'Amina Al-Farsi',
    email: 'a.alfarsi@artify-group.com',
    role: 'VP Human Resources & Attestation',
    department: 'Human Capital Management',
    approvalLimitOMR: 5000,
    employeeRef: 'EMP-00119',
    branch: 'Muscat HQ'
  },
  {
    id: 'usr-requester',
    userId: 'U1012',
    name: 'Fatima Al-Riyami',
    email: 'f.riyami@artify-group.com',
    role: 'Senior Executive Officer (Requester)',
    department: 'Commercial Business Development',
    approvalLimitOMR: 200,
    employeeRef: 'EMP-00891',
    branch: 'Muscat HQ'
  }
];

export class WorkflowEngineService {
  /**
   * Determine the multi-tier approval hierarchy based on request parameters
   */
  public static evaluateWorkflowTiers(
    requestType: 'InternalRequest' | 'TravelRequest' | 'StationeryRequest' | 'GeneralService' | 'FacilityWorkOrder',
    categoryOrTitle: string,
    amountOMR: number,
    priority: 'Low' | 'Medium' | 'High' | 'Urgent' = 'Medium',
    department: string = 'General'
  ): WorkflowEvaluationResult {
    let stages: WorkflowApproverStage[] = [];
    let workflowCode = 'WF-ADM-01';
    let workflowName = 'Standard Administration Review Pipeline';
    let sodRulesApplied = ['SOD-ADM-01 (Prohibition of Self-Approval)'];
    let requiresExecutiveSignoff = false;

    if (requestType === 'InternalRequest') {
      const isEmployeeCert = [
        'Salary Certificate',
        'Experience Certificate',
        'Embassy / Visa Assistance Letter',
        'Embassy Visa Letter',
        'NOC Certificate',
        'Bank Attestation'
      ].some(c => categoryOrTitle.toLowerCase().includes(c.toLowerCase()));

      if (isEmployeeCert) {
        workflowCode = 'WF-ADM-CERT-01';
        workflowName = 'Employee Statutory Certificate Authorization';
        stages = [
          {
            level: 1,
            role: 'HR & Statutory Attestation Lead',
            approverName: 'Amina Al-Farsi',
            approverUserId: 'usr-hr',
            approvalLimitOMR: 5000,
            status: 'Pending',
            requiredSlaHours: 24
          }
        ];
      } else {
        // Department Service Requisition
        workflowCode = 'WF-ADM-DEPT-02';
        workflowName = 'Department Facility & Requisition Matrix';
        stages = [
          {
            level: 1,
            role: 'Direct Line Manager',
            approverName: 'Eng. Khalid Al-Amri',
            approverUserId: 'usr-mgr',
            approvalLimitOMR: 1500,
            status: 'Pending',
            requiredSlaHours: 24
          },
          {
            level: 2,
            role: 'Director of Corporate Administration',
            approverName: 'Tariq Al-Lawati',
            approverUserId: 'usr-dir',
            approvalLimitOMR: 10000,
            status: 'Waiting',
            requiredSlaHours: 48
          }
        ];

        if (priority === 'Urgent' || amountOMR > 2500) {
          requiresExecutiveSignoff = true;
          stages.push({
            level: 3,
            role: 'Chief Financial Officer (CFO)',
            approverName: 'Sarah Jenkins',
            approverUserId: 'usr-1',
            approvalLimitOMR: 100000,
            status: 'Waiting',
            requiredSlaHours: 72
          });
        }
      }
    } else if (requestType === 'TravelRequest') {
      workflowCode = 'WF-ADM-TRV-03';
      workflowName = 'Corporate Travel & Mission Authorization Pipeline';

      if (amountOMR <= 600) {
        stages = [
          {
            level: 1,
            role: 'Department Head / Line Manager',
            approverName: 'Eng. Khalid Al-Amri',
            approverUserId: 'usr-mgr',
            approvalLimitOMR: 1500,
            status: 'Pending',
            requiredSlaHours: 24
          }
        ];
      } else if (amountOMR <= 2000) {
        stages = [
          {
            level: 1,
            role: 'Department Head / Line Manager',
            approverName: 'Eng. Khalid Al-Amri',
            approverUserId: 'usr-mgr',
            approvalLimitOMR: 1500,
            status: 'Pending',
            requiredSlaHours: 24
          },
          {
            level: 2,
            role: 'Director of Administration & Corporate Services',
            approverName: 'Tariq Al-Lawati',
            approverUserId: 'usr-dir',
            approvalLimitOMR: 10000,
            status: 'Waiting',
            requiredSlaHours: 48
          }
        ];
      } else {
        requiresExecutiveSignoff = true;
        stages = [
          {
            level: 1,
            role: 'Department Head / Line Manager',
            approverName: 'Eng. Khalid Al-Amri',
            approverUserId: 'usr-mgr',
            approvalLimitOMR: 1500,
            status: 'Pending',
            requiredSlaHours: 24
          },
          {
            level: 2,
            role: 'Director of Administration & Corporate Services',
            approverName: 'Tariq Al-Lawati',
            approverUserId: 'usr-dir',
            approvalLimitOMR: 10000,
            status: 'Waiting',
            requiredSlaHours: 48
          },
          {
            level: 3,
            role: 'CFO / Group Financial Officer',
            approverName: 'Sarah Jenkins',
            approverUserId: 'usr-1',
            approvalLimitOMR: 100000,
            status: 'Waiting',
            requiredSlaHours: 72
          }
        ];
      }
    } else if (requestType === 'StationeryRequest') {
      workflowCode = 'WF-ADM-STAT-04';
      workflowName = 'Stationery & Consumables Requisition Chain';
      sodRulesApplied.push('SOD-ADM-02 (Requester cannot act as Store Custodian)');
      stages = [
        {
          level: 1,
          role: 'Department Line Manager',
          approverName: 'Eng. Khalid Al-Amri',
          approverUserId: 'usr-mgr',
          approvalLimitOMR: 500,
          status: 'Pending',
          requiredSlaHours: 12
        }
      ];
    } else if (requestType === 'GeneralService') {
      workflowCode = 'WF-ADM-GSR-05';
      workflowName = 'General Business Services Multi-Tier Procurement';
      if (amountOMR <= 500) {
        stages = [
          {
            level: 1,
            role: 'Facilities Manager',
            approverName: 'Eng. Khalid Al-Amri',
            approverUserId: 'usr-mgr',
            approvalLimitOMR: 1500,
            status: 'Pending',
            requiredSlaHours: 24
          }
        ];
      } else {
        stages = [
          {
            level: 1,
            role: 'Facilities Manager',
            approverName: 'Eng. Khalid Al-Amri',
            approverUserId: 'usr-mgr',
            approvalLimitOMR: 1500,
            status: 'Pending',
            requiredSlaHours: 24
          },
          {
            level: 2,
            role: 'Director of Administration & Corporate Services',
            approverName: 'Tariq Al-Lawati',
            approverUserId: 'usr-dir',
            approvalLimitOMR: 10000,
            status: 'Waiting',
            requiredSlaHours: 48
          }
        ];
      }
    } else {
      // Facility work order
      stages = [
        {
          level: 1,
          role: 'Facilities Supervisor',
          approverName: 'Eng. Khalid Al-Amri',
          approverUserId: 'usr-mgr',
          approvalLimitOMR: 1500,
          status: 'Pending',
          requiredSlaHours: 12
        }
      ];
    }

    return {
      workflowCode,
      workflowName,
      totalLevels: stages.length,
      stages,
      sodRulesApplied,
      requiresExecutiveSignoff
    };
  }

  /**
   * Validate new request submission.
   * Rejects direct bypass submissions (e.g. status === 'Approved' without passing through engine).
   */
  public static validateSubmission(payload: {
    title?: string;
    requestedBy?: string;
    travelerName?: string;
    requesterName?: string;
    status?: string;
    totalEstimatedCostOMR?: number;
  }): { isValid: boolean; error?: string } {
    if (payload.status === 'Approved' || payload.status === 'Completed') {
      return {
        isValid: false,
        error:
          'Security Policy Violation (SEC-AUTH-04): Direct creation of Approved/Completed transactional records is forbidden. All requisitions must be created as "Draft" or "Pending Approval" to undergo workflow validation.'
      };
    }

    const requester = payload.requestedBy || payload.travelerName || payload.requesterName;
    if (!requester || !requester.trim()) {
      return {
        isValid: false,
        error: 'Validation Error: Requester identity and employee attribution are mandatory.'
      };
    }

    return { isValid: true };
  }

  /**
   * Enforce Segregation of Duties (SoD) and Delegation of Authority (DoA) limits on approval execution.
   */
  public static validateApprovalAuthority(
    request: {
      requestedBy?: string;
      travelerName?: string;
      requesterName?: string;
      employeeId?: string;
      employeeCode?: string;
      currentApprovalLevel: number;
      totalApprovalLevels: number;
      approvers?: WorkflowApproverStage[];
      totalEstimatedCostOMR?: number;
      totalCostOMR?: number;
      estimatedBudgetOMR?: number;
    },
    approver: UserContext
  ): { isAuthorized: boolean; error?: string; violationCode?: string } {
    const requesterName = (request.requestedBy || request.travelerName || request.requesterName || '').trim().toLowerCase();
    const actorName = approver.name.trim().toLowerCase();
    const requesterRef = (request.employeeId || request.employeeCode || '').trim().toLowerCase();
    const actorRef = (approver.employeeRef || '').trim().toLowerCase();

    // 1. SEGREGATION OF DUTIES (SoD) CHECK
    // The requester CANNOT approve their own submission under any circumstances
    if (requesterName && actorName && (requesterName === actorName || (requesterRef && actorRef && requesterRef === actorRef))) {
      return {
        isAuthorized: false,
        violationCode: 'SOD-ADM-01',
        error: `Segregation of Duties Violation (SOD-ADM-01): Requester "${approver.name}" is prohibited from self-approving their own submission. The transaction must be reviewed and signed off by an authorized independent line manager or higher authority.`
      };
    }

    // 2. STAGE & SEQUENTIAL LEVEL VERIFICATION
    const currentLevel = request.currentApprovalLevel || 1;
    const stages = request.approvers || [];
    const activeStage = stages.find(s => s.level === currentLevel);

    if (activeStage && activeStage.status === 'Approved') {
      return {
        isAuthorized: false,
        error: `Approval Stage Error: Level ${currentLevel} has already been granted approval.`
      };
    }

    // 3. DELEGATION OF AUTHORITY (DoA) / FINANCIAL LIMIT VERIFICATION
    const amount = request.totalEstimatedCostOMR || request.totalCostOMR || request.estimatedBudgetOMR || 0;
    if (amount > 0 && approver.approvalLimitOMR < amount) {
      // Check if current user has an active executive delegation stored in systemManagement
      const delegations = this.getStoredDelegations();
      const activeDelegation = delegations.find(
        d =>
          d.delegateId === approver.id &&
          d.status === 'Active' &&
          d.maxApprovalLimitOMR >= amount
      );

      if (!activeDelegation) {
        return {
          isAuthorized: false,
          violationCode: 'DOA-LIMIT-EXCEEDED',
          error: `Approval Threshold Exceeded: Approver "${approver.name}" has an authorization limit of ${approver.approvalLimitOMR.toLocaleString()} OMR, but request total is ${amount.toLocaleString()} OMR. Escalation to higher authority or active DoA proxy is required.`
        };
      }
    }

    return { isAuthorized: true };
  }

  /**
   * Retrieve delegations from localStorage
   */
  private static getStoredDelegations(): any[] {
    try {
      const saved = localStorage.getItem('artify_sm_delegations');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  /**
   * Central Audit Trail Logger (writes to artify_sm_audit_trail)
   */
  public static logAuditEvent(event: {
    action: 'CREATE' | 'SUBMIT' | 'APPROVE' | 'REJECT' | 'SOD_VIOLATION_BLOCKED' | 'COMPLETE' | 'DELEGATE';
    module: string;
    entity: string;
    recordId: string;
    details: string;
    actor: { id: string; name: string; role: string };
    previousValue?: string;
    newValue?: string;
    result: 'SUCCESS' | 'BLOCKED_SOD_VIOLATION' | 'REJECTED_UNAUTHORIZED' | 'FAILURE';
  }) {
    try {
      const key = 'artify_sm_audit_trail';
      const existing = localStorage.getItem(key);
      const trail = existing ? JSON.parse(existing) : [];

      const newEntry = {
        id: `aud-${Date.now().toString().slice(-6)}-${mockRandom().toString(36).substr(2, 4)}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
        userId: event.actor.id,
        userName: event.actor.name,
        userRole: event.actor.role,
        action: event.action,
        module: event.module,
        entity: event.entity,
        recordId: event.recordId,
        previousValue: event.previousValue,
        newValue: event.newValue,
        result: event.result,
        details: event.details,
        ipAddress: '185.190.24.12 (Enterprise VPN)',
        userAgent: 'Artify Financial Ecosystem (AFE) Enterprise Client Engine'
      };

      localStorage.setItem(key, JSON.stringify([newEntry, ...trail]));
    } catch (e) {
      console.warn('Failed to log audit event', e);
    }
  }

  /**
   * Central Notification / Alert Dispatcher (writes to artify_sm_alerts)
   */
  public static dispatchAlert(alert: {
    title: string;
    message: string;
    severity: 'info' | 'warning' | 'error' | 'critical';
    linkModule: string;
    targetRole?: string;
  }) {
    try {
      const key = 'artify_sm_alerts';
      const existing = localStorage.getItem(key);
      const alerts = existing ? JSON.parse(existing) : [];

      const newAlert = {
        id: `alt-${Date.now().toString().slice(-4)}-${mockRandom().toString(36).substr(2, 3)}`,
        title: alert.title,
        message: alert.message,
        severity: alert.severity,
        module: alert.linkModule,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
        read: false,
        actionRequired: alert.severity === 'warning' || alert.severity === 'critical',
        targetRole: alert.targetRole || 'Administration & Line Managers'
      };

      localStorage.setItem(key, JSON.stringify([newAlert, ...alerts]));
    } catch (e) {
      console.warn('Failed to dispatch alert', e);
    }
  }
}
