import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  OfficeNotice,
  OfficeServiceOrder,
  StationeryItem,
  StationeryRequest,
  FacilityWorkOrder,
  CorrespondenceRecord,
  DocumentRecord,
  DocumentVersion,
  InternalRequestRecord,
  EnterpriseTask,
  MeetingRecord,
  TravelRequestRecord,
  VehicleBookingRecord,
  FleetVehicleRecord,
  GeneralServiceRequest,
  ServiceVendorRecord,
  OfficeAssetRecord,
  AdminAnalyticsSummary,
  WorkflowStatus,
  TaskStatus
} from '../types';
import {
  MOCK_NOTICES,
  MOCK_OFFICE_SERVICES,
  MOCK_STATIONERY_ITEMS,
  MOCK_STATIONERY_REQUESTS,
  MOCK_FACILITY_WORK_ORDERS,
  MOCK_CORRESPONDENCE,
  MOCK_DOCUMENTS,
  MOCK_INTERNAL_REQUESTS,
  MOCK_TASKS,
  MOCK_MEETINGS,
  MOCK_TRAVEL_REQUESTS,
  MOCK_FLEET_VEHICLES,
  MOCK_VEHICLE_BOOKINGS,
  MOCK_GENERAL_SERVICES,
  MOCK_SERVICE_VENDORS,
  MOCK_OFFICE_ASSETS
} from '../data/mockAdministrationData';
import {
  WorkflowEngineService,
  UserContext,
  ENTERPRISE_ACTORS
} from './workflowEngineService';

export interface WorkflowNotificationBanner {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  violationCode?: string;
}

interface AdministrationContextType {
  // Enterprise User & SoD Simulation
  activeActor: UserContext;
  setActiveActor: (actor: UserContext) => void;
  enterpriseActors: UserContext[];
  workflowBanner: WorkflowNotificationBanner | null;
  setWorkflowBanner: (banner: WorkflowNotificationBanner | null) => void;
  clearWorkflowBanner: () => void;

  // 03.01 Office Administration
  notices: OfficeNotice[];
  addNotice: (notice: Partial<OfficeNotice>) => void;
  deleteNotice: (id: string) => void;
  officeServices: OfficeServiceOrder[];
  addOfficeService: (order: Partial<OfficeServiceOrder>) => { success: boolean; error?: string };
  updateOfficeServiceStatus: (id: string, status: WorkflowStatus) => void;
  stationeryItems: StationeryItem[];
  stationeryRequests: StationeryRequest[];
  addStationeryRequest: (req: Partial<StationeryRequest>) => { success: boolean; error?: string };
  approveStationeryRequest: (id: string, approverOverride?: UserContext | string) => { success: boolean; error?: string };
  issueStationeryRequest: (id: string, issuerOverride?: UserContext | string) => { success: boolean; error?: string };
  facilityWorkOrders: FacilityWorkOrder[];
  addFacilityWorkOrder: (order: Partial<FacilityWorkOrder>) => { success: boolean; error?: string };
  updateFacilityWorkOrderStatus: (id: string, status: WorkflowStatus, resolutionNotes?: string) => void;

  // 03.02 Correspondence Management
  correspondenceList: CorrespondenceRecord[];
  addCorrespondence: (cor: Partial<CorrespondenceRecord>) => void;
  updateCorrespondenceStatus: (id: string, status: CorrespondenceRecord['status']) => void;
  classifyCorrespondenceWithAI: (subject: string, body?: string) => { category: string; priority: 'Low' | 'Medium' | 'High' | 'Urgent'; suggestedDepartment: string; tags: string[] };

  // 03.03 Document Management
  documents: DocumentRecord[];
  addDocument: (doc: Partial<DocumentRecord>) => void;
  checkoutDocument: (id: string, userName: string) => void;
  checkinDocument: (id: string, versionNumber: string, changeSummary: string, userName: string) => void;
  archiveDocument: (id: string) => void;
  restoreDocument: (id: string) => void;

  // 03.04 Internal Requests
  internalRequests: InternalRequestRecord[];
  addInternalRequest: (req: Partial<InternalRequestRecord>) => { success: boolean; error?: string };
  approveInternalRequest: (id: string, approverOverride?: UserContext | string, comments?: string) => { success: boolean; error?: string };
  rejectInternalRequest: (id: string, approverOverride?: UserContext | string, comments?: string) => { success: boolean; error?: string };
  completeInternalRequest: (id: string, resolutionNotes?: string) => void;

  // 03.05 Task & Activity Management
  tasks: EnterpriseTask[];
  addTask: (task: Partial<EnterpriseTask>) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  updateTaskProgress: (id: string, progress: number) => void;
  toggleChecklistItem: (taskId: string, checkId: string) => void;
  completeTask: (id: string, notes?: string) => void;

  // 03.06 Meeting Management
  meetings: MeetingRecord[];
  addMeeting: (mtg: Partial<MeetingRecord>) => void;
  updateMeetingMoM: (id: string, mom: string, decisions: string[], actionItems: any[]) => void;
  convertMoMActionToTask: (meetingId: string, actionId: string) => void;

  // 03.07 Travel & Transportation
  travelRequests: TravelRequestRecord[];
  addTravelRequest: (trv: Partial<TravelRequestRecord>) => { success: boolean; error?: string };
  approveTravelRequest: (id: string, approverOverride?: UserContext | string, comments?: string) => { success: boolean; error?: string };
  rejectTravelRequest: (id: string, approverOverride?: UserContext | string, comments?: string) => { success: boolean; error?: string };
  fleetVehicles: FleetVehicleRecord[];
  vehicleBookings: VehicleBookingRecord[];
  addVehicleBooking: (booking: Partial<VehicleBookingRecord>) => { success: boolean; error?: string };
  updateFleetVehicleStatus: (id: string, status: FleetVehicleRecord['currentStatus']) => void;

  // 03.08 General Business Services
  generalServices: GeneralServiceRequest[];
  addGeneralService: (req: Partial<GeneralServiceRequest>) => { success: boolean; error?: string };
  approveGeneralService: (id: string, approverOverride?: UserContext | string, comments?: string) => { success: boolean; error?: string };
  rejectGeneralService: (id: string, approverOverride?: UserContext | string, comments?: string) => { success: boolean; error?: string };
  updateGeneralServiceStatus: (id: string, status: WorkflowStatus) => void;
  serviceVendors: ServiceVendorRecord[];
  officeAssets: OfficeAssetRecord[];
  addOfficeAsset: (asset: Partial<OfficeAssetRecord>) => void;

  // AI & Analytics
  analyticsSummary: AdminAnalyticsSummary;
  formatCurrency: (amount: number) => string;
  generateAdminBriefing: () => string;
}

const AdministrationContext = createContext<AdministrationContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'artify_erp_admin_';

export const AdministrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Active Simulated Enterprise User (Defaults to Line Manager Eng. Khalid Al-Amri)
  const [activeActor, setActiveActorState] = useState<UserContext>(() => {
    try {
      const saved = localStorage.getItem('artify_erp_active_actor');
      return saved ? JSON.parse(saved) : ENTERPRISE_ACTORS[2]; // Eng. Khalid Al-Amri
    } catch {
      return ENTERPRISE_ACTORS[2];
    }
  });

  const setActiveActor = (actor: UserContext) => {
    setActiveActorState(actor);
    try {
      localStorage.setItem('artify_erp_active_actor', JSON.stringify(actor));
    } catch (e) {
      console.warn('Failed to persist active actor', e);
    }
  };

  const [workflowBanner, setWorkflowBanner] = useState<WorkflowNotificationBanner | null>(null);
  const clearWorkflowBanner = () => setWorkflowBanner(null);

  // Helper to resolve approver context from input parameter
  const resolveActor = (approverOverride?: UserContext | string): UserContext => {
    if (!approverOverride) return activeActor;
    if (typeof approverOverride === 'object' && approverOverride.name) {
      return approverOverride;
    }
    if (typeof approverOverride === 'string') {
      const matched = ENTERPRISE_ACTORS.find(
        a => a.name.toLowerCase() === approverOverride.toLowerCase() || a.userId === approverOverride
      );
      if (matched) return matched;
      return {
        id: 'usr-custom',
        userId: 'U-CUST',
        name: approverOverride,
        email: `${approverOverride.toLowerCase().replace(/\s+/g, '.')}@artify-group.com`,
        role: 'Authorized Management Approver',
        department: 'Operations & Administration',
        approvalLimitOMR: 5000
      };
    }
    return activeActor;
  };

  // Helper to load persisted state or fallback
  const loadState = <T,>(key: string, defaultVal: T): T => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${key}`);
      return saved ? JSON.parse(saved) : defaultVal;
    } catch {
      return defaultVal;
    }
  };

  const [notices, setNotices] = useState<OfficeNotice[]>(() => loadState('notices', MOCK_NOTICES));
  const [officeServices, setOfficeServices] = useState<OfficeServiceOrder[]>(() => loadState('office_services', MOCK_OFFICE_SERVICES));
  const [stationeryItems, setStationeryItems] = useState<StationeryItem[]>(() => loadState('stationery_items', MOCK_STATIONERY_ITEMS));
  const [stationeryRequests, setStationeryRequests] = useState<StationeryRequest[]>(() => loadState('stationery_requests', MOCK_STATIONERY_REQUESTS));
  const [facilityWorkOrders, setFacilityWorkOrders] = useState<FacilityWorkOrder[]>(() => loadState('facility_work_orders', MOCK_FACILITY_WORK_ORDERS));
  const [correspondenceList, setCorrespondenceList] = useState<CorrespondenceRecord[]>(() => loadState('correspondence', MOCK_CORRESPONDENCE));
  const [documents, setDocuments] = useState<DocumentRecord[]>(() => loadState('documents', MOCK_DOCUMENTS));
  const [internalRequests, setInternalRequests] = useState<InternalRequestRecord[]>(() => loadState('internal_requests', MOCK_INTERNAL_REQUESTS));
  const [tasks, setTasks] = useState<EnterpriseTask[]>(() => loadState('tasks', MOCK_TASKS));
  const [meetings, setMeetings] = useState<MeetingRecord[]>(() => loadState('meetings', MOCK_MEETINGS));
  const [travelRequests, setTravelRequests] = useState<TravelRequestRecord[]>(() => loadState('travel_requests', MOCK_TRAVEL_REQUESTS));
  const [fleetVehicles, setFleetVehicles] = useState<FleetVehicleRecord[]>(() => loadState('fleet_vehicles', MOCK_FLEET_VEHICLES));
  const [vehicleBookings, setVehicleBookings] = useState<VehicleBookingRecord[]>(() => loadState('vehicle_bookings', MOCK_VEHICLE_BOOKINGS));
  const [generalServices, setGeneralServices] = useState<GeneralServiceRequest[]>(() => loadState('general_services', MOCK_GENERAL_SERVICES));
  const [serviceVendors] = useState<ServiceVendorRecord[]>(MOCK_SERVICE_VENDORS);
  const [officeAssets, setOfficeAssets] = useState<OfficeAssetRecord[]>(() => loadState('office_assets', MOCK_OFFICE_ASSETS));

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}notices`, JSON.stringify(notices));
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}office_services`, JSON.stringify(officeServices));
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}stationery_items`, JSON.stringify(stationeryItems));
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}stationery_requests`, JSON.stringify(stationeryRequests));
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}facility_work_orders`, JSON.stringify(facilityWorkOrders));
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}correspondence`, JSON.stringify(correspondenceList));
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}documents`, JSON.stringify(documents));
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}internal_requests`, JSON.stringify(internalRequests));
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}tasks`, JSON.stringify(tasks));
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}meetings`, JSON.stringify(meetings));
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}travel_requests`, JSON.stringify(travelRequests));
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}fleet_vehicles`, JSON.stringify(fleetVehicles));
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}vehicle_bookings`, JSON.stringify(vehicleBookings));
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}general_services`, JSON.stringify(generalServices));
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}office_assets`, JSON.stringify(officeAssets));
    } catch (e) {
      console.warn('LocalStorage persistence error in adminStore', e);
    }
  }, [
    notices, officeServices, stationeryItems, stationeryRequests, facilityWorkOrders,
    correspondenceList, documents, internalRequests, tasks, meetings, travelRequests,
    fleetVehicles, vehicleBookings, generalServices, officeAssets
  ]);

  const formatCurrency = (amount: number): string => {
    return `OMR ${(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`;
  };

  // -------------------------------------------------------------
  // 03.01 Office Administration Methods
  // -------------------------------------------------------------
  const addNotice = (item: Partial<OfficeNotice>) => {
    const newNotice: OfficeNotice = {
      id: `not-${Date.now()}`,
      noticeNumber: `NOT-2026-${String(notices.length + 1).padStart(3, '0')}`,
      title: item.title || 'General Administrative Notice',
      category: item.category || 'General',
      content: item.content || '',
      targetAudience: item.targetAudience || 'All Employees',
      publishedDate: new Date().toISOString().split('T')[0],
      expiryDate: item.expiryDate || '2026-12-31',
      publishedBy: item.publishedBy || activeActor.name,
      priority: item.priority || 'Normal',
      isPinned: !!item.isPinned,
      status: 'Active'
    };
    setNotices(prev => [newNotice, ...prev]);

    WorkflowEngineService.logAuditEvent({
      action: 'CREATE',
      module: 'Administration',
      entity: 'Office Notice',
      recordId: newNotice.noticeNumber,
      details: `Published corporate notice: "${newNotice.title}" for audience "${newNotice.targetAudience}"`,
      actor: activeActor,
      result: 'SUCCESS'
    });
  };

  const deleteNotice = (id: string) => {
    const target = notices.find(n => n.id === id);
    setNotices(prev => prev.filter(n => n.id !== id));
    if (target) {
      WorkflowEngineService.logAuditEvent({
        action: 'CREATE',
        module: 'Administration',
        entity: 'Office Notice',
        recordId: target.noticeNumber,
        details: `Deleted notice "${target.title}"`,
        actor: activeActor,
        result: 'SUCCESS'
      });
    }
  };

  const addOfficeService = (item: Partial<OfficeServiceOrder>): { success: boolean; error?: string } => {
    const validation = WorkflowEngineService.validateSubmission({
      title: item.title,
      requestedBy: item.requestedBy || activeActor.name,
      status: item.status
    });

    if (!validation.isValid) {
      setWorkflowBanner({
        message: validation.error!,
        type: 'error',
        violationCode: 'SEC-DIRECT-SUBMISSION-REJECTED'
      });
      return { success: false, error: validation.error };
    }

    const newService: OfficeServiceOrder = {
      id: `srv-${Date.now()}`,
      orderNumber: `SRV-2026-${String(officeServices.length + 1).padStart(3, '0')}`,
      serviceType: item.serviceType || 'Visitor Security Pass',
      title: item.title || 'Office Service Request',
      requestedBy: item.requestedBy || activeActor.name,
      department: item.department || activeActor.department,
      location: item.location || 'Muscat HQ',
      scheduledDate: item.scheduledDate || new Date().toISOString().split('T')[0],
      details: item.details || '',
      guestCount: item.guestCount,
      assignedVendor: item.assignedVendor,
      status: 'Submitted',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setOfficeServices(prev => [newService, ...prev]);

    WorkflowEngineService.logAuditEvent({
      action: 'SUBMIT',
      module: 'Administration',
      entity: 'Office Service Order',
      recordId: newService.orderNumber,
      details: `Submitted service order for "${newService.serviceType}" (${newService.title})`,
      actor: activeActor,
      result: 'SUCCESS'
    });

    setWorkflowBanner({
      message: `Office Service Order ${newService.orderNumber} successfully registered and queued for logistics fulfillment.`,
      type: 'success'
    });

    return { success: true };
  };

  const updateOfficeServiceStatus = (id: string, status: WorkflowStatus) => {
    setOfficeServices(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const addStationeryRequest = (item: Partial<StationeryRequest>): { success: boolean; error?: string } => {
    const validation = WorkflowEngineService.validateSubmission({
      requestedBy: item.requesterName || activeActor.name,
      status: item.status
    });

    if (!validation.isValid) {
      setWorkflowBanner({
        message: validation.error!,
        type: 'error',
        violationCode: 'SEC-DIRECT-SUBMISSION-REJECTED'
      });
      return { success: false, error: validation.error };
    }

    const wfEval = WorkflowEngineService.evaluateWorkflowTiers(
      'StationeryRequest',
      'Consumables Requisition',
      item.totalCostOMR || 0,
      'Medium',
      item.department || activeActor.department
    );

    const newReq: StationeryRequest = {
      id: `str-${Date.now()}`,
      requestNumber: `REQ-STA-2026-${String(stationeryRequests.length + 1).padStart(3, '0')}`,
      requesterName: item.requesterName || activeActor.name,
      department: item.department || activeActor.department,
      requestDate: new Date().toISOString().split('T')[0],
      items: item.items || [],
      totalCostOMR: item.totalCostOMR || 0,
      purpose: item.purpose || 'Daily departmental administrative activities.',
      status: 'Pending Approval',
      currentApprovalLevel: 1,
      totalApprovalLevels: wfEval.totalLevels,
      approvers: wfEval.stages
    };

    setStationeryRequests(prev => [newReq, ...prev]);

    WorkflowEngineService.logAuditEvent({
      action: 'SUBMIT',
      module: 'Administration',
      entity: 'Stationery Request',
      recordId: newReq.requestNumber,
      details: `Requisition submitted by ${newReq.requesterName} for ${newReq.items.length} items (Total: OMR ${newReq.totalCostOMR.toFixed(3)})`,
      actor: activeActor,
      result: 'SUCCESS'
    });

    WorkflowEngineService.dispatchAlert({
      title: `Stationery Requisition Pending: ${newReq.requestNumber}`,
      message: `${newReq.requesterName} has requested stationery consumables requiring authorization.`,
      severity: 'info',
      linkModule: '03.01 Office Administration'
    });

    setWorkflowBanner({
      message: `Stationery Requisition ${newReq.requestNumber} queued in Workflow ${wfEval.workflowCode}. Level 1 Line Manager review required.`,
      type: 'info'
    });

    return { success: true };
  };

  const approveStationeryRequest = (id: string, approverOverride?: UserContext | string): { success: boolean; error?: string } => {
    const actor = resolveActor(approverOverride);
    const target = stationeryRequests.find(r => r.id === id);

    if (!target) return { success: false, error: 'Requisition not found.' };

    const authCheck = WorkflowEngineService.validateApprovalAuthority(
      {
        requestedBy: target.requesterName,
        currentApprovalLevel: target.currentApprovalLevel || 1,
        totalApprovalLevels: target.totalApprovalLevels || 1,
        approvers: target.approvers,
        totalCostOMR: target.totalCostOMR
      },
      actor
    );

    if (!authCheck.isAuthorized) {
      WorkflowEngineService.logAuditEvent({
        action: 'SOD_VIOLATION_BLOCKED',
        module: 'Administration',
        entity: 'Stationery Request',
        recordId: target.requestNumber,
        details: `Unauthorized stationery approval attempt: ${authCheck.error}`,
        actor,
        result: 'BLOCKED_SOD_VIOLATION'
      });

      setWorkflowBanner({
        message: authCheck.error!,
        type: 'error',
        violationCode: authCheck.violationCode
      });

      return { success: false, error: authCheck.error };
    }

    setStationeryRequests(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: 'Approved',
          approvedBy: actor.name,
          currentApprovalLevel: 1,
          approvers: (r.approvers || []).map(a => ({
            ...a,
            status: 'Approved',
            decisionDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
            comments: `Authorized by ${actor.name} (${actor.role})`
          }))
        };
      }
      return r;
    }));

    WorkflowEngineService.logAuditEvent({
      action: 'APPROVE',
      module: 'Administration',
      entity: 'Stationery Request',
      recordId: target.requestNumber,
      details: `Approved stationery requisition for OMR ${target.totalCostOMR.toFixed(3)} by ${actor.name}`,
      actor,
      result: 'SUCCESS'
    });

    setWorkflowBanner({
      message: `Stationery Requisition ${target.requestNumber} approved by ${actor.name}. Central Store issuance unlocked.`,
      type: 'success'
    });

    return { success: true };
  };

  const issueStationeryRequest = (id: string, issuerOverride?: UserContext | string): { success: boolean; error?: string } => {
    const actor = resolveActor(issuerOverride);
    const target = stationeryRequests.find(r => r.id === id);

    if (!target) return { success: false, error: 'Requisition not found.' };

    if (target.status !== 'Approved') {
      const err = `Stock Issuance Blocked: Requisition ${target.requestNumber} must be in "Approved" status before store issuance.`;
      setWorkflowBanner({ message: err, type: 'error' });
      return { success: false, error: err };
    }

    // SOD-ADM-02: Requester cannot act as store custodian to issue items to self
    if (target.requesterName.trim().toLowerCase() === actor.name.trim().toLowerCase()) {
      const err = `Segregation of Duties Violation (SOD-ADM-02): Requester "${actor.name}" cannot act as Warehouse Store Custodian to issue physical inventory to themselves. A certified Store Officer must perform stock release.`;
      WorkflowEngineService.logAuditEvent({
        action: 'SOD_VIOLATION_BLOCKED',
        module: 'Administration',
        entity: 'Stationery Request',
        recordId: target.requestNumber,
        details: err,
        actor,
        result: 'BLOCKED_SOD_VIOLATION'
      });
      setWorkflowBanner({ message: err, type: 'error', violationCode: 'SOD-ADM-02' });
      return { success: false, error: err };
    }

    setStationeryRequests(prev => prev.map(r => {
      if (r.id === id) {
        // deduct stock from inventory
        r.items.forEach(reqItem => {
          setStationeryItems(items => items.map(it => {
            if (it.id === reqItem.itemId) {
              return { ...it, availableStock: Math.max(0, it.availableStock - reqItem.quantityRequested) };
            }
            return it;
          }));
        });
        return {
          ...r,
          status: 'Completed',
          issuedBy: actor.name,
          issuedAt: new Date().toISOString().split('T')[0],
          items: r.items.map(it => ({ ...it, quantityIssued: it.quantityRequested }))
        };
      }
      return r;
    }));

    WorkflowEngineService.logAuditEvent({
      action: 'COMPLETE',
      module: 'Administration',
      entity: 'Stationery Request',
      recordId: target.requestNumber,
      details: `Inventory issued and stock balance deducted by store custodian ${actor.name}`,
      actor,
      result: 'SUCCESS'
    });

    setWorkflowBanner({
      message: `Stationery items released and inventory balances updated by ${actor.name}.`,
      type: 'success'
    });

    return { success: true };
  };

  const addFacilityWorkOrder = (item: Partial<FacilityWorkOrder>): { success: boolean; error?: string } => {
    const validation = WorkflowEngineService.validateSubmission({
      title: item.title,
      requestedBy: item.requestedBy || activeActor.name,
      status: item.status
    });

    if (!validation.isValid) {
      setWorkflowBanner({ message: validation.error!, type: 'error' });
      return { success: false, error: validation.error };
    }

    const newOrder: FacilityWorkOrder = {
      id: `fac-${Date.now()}`,
      workOrderNumber: `FAC-WO-2026-${String(facilityWorkOrders.length + 1).padStart(3, '0')}`,
      title: item.title || 'Facility Work Order',
      category: item.category || 'Workstation & Furniture',
      facilityLocation: item.facilityLocation || 'Muscat HQ',
      requestedBy: item.requestedBy || activeActor.name,
      department: item.department || activeActor.department,
      priority: item.priority || 'Medium',
      description: item.description || '',
      assignedTechnician: item.assignedTechnician || 'Salim Al-Busaidi',
      assignedVendor: item.assignedVendor,
      estimatedCostOMR: item.estimatedCostOMR || 50,
      targetCompletionDate: item.targetCompletionDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      status: 'Submitted',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setFacilityWorkOrders(prev => [newOrder, ...prev]);

    WorkflowEngineService.logAuditEvent({
      action: 'SUBMIT',
      module: 'Administration',
      entity: 'Facility Work Order',
      recordId: newOrder.workOrderNumber,
      details: `Created maintenance work order for ${newOrder.category} at ${newOrder.facilityLocation}`,
      actor: activeActor,
      result: 'SUCCESS'
    });

    setWorkflowBanner({
      message: `Work Order ${newOrder.workOrderNumber} submitted and assigned to technician ${newOrder.assignedTechnician}.`,
      type: 'success'
    });

    return { success: true };
  };

  const updateFacilityWorkOrderStatus = (id: string, status: WorkflowStatus, resolutionNotes?: string) => {
    setFacilityWorkOrders(prev => prev.map(f => {
      if (f.id === id) {
        WorkflowEngineService.logAuditEvent({
          action: status === 'Completed' ? 'COMPLETE' : 'APPROVE',
          module: 'Administration',
          entity: 'Facility Work Order',
          recordId: f.workOrderNumber,
          details: `Transitioned work order status to "${status}". Notes: ${resolutionNotes || 'None'}`,
          actor: activeActor,
          previousValue: f.status,
          newValue: status,
          result: 'SUCCESS'
        });
        return {
          ...f,
          status,
          resolutionNotes: resolutionNotes || f.resolutionNotes,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return f;
    }));
  };

  // -------------------------------------------------------------
  // 03.02 Correspondence Methods
  // -------------------------------------------------------------
  const addCorrespondence = (item: Partial<CorrespondenceRecord>) => {
    const codePrefix = item.type === 'incoming' ? 'COR-IN' : item.type === 'outgoing' ? 'COR-OUT' : 'COR-INT';
    const newCor: CorrespondenceRecord = {
      id: `cor-${Date.now()}`,
      referenceNumber: `${codePrefix}-2026-${String(correspondenceList.length + 1).padStart(4, '0')}`,
      externalReference: item.externalReference,
      type: item.type || 'incoming',
      subject: item.subject || 'Official Correspondence',
      senderEntity: item.senderEntity || 'External Entity',
      senderContactPerson: item.senderContactPerson,
      recipientEntity: item.recipientEntity || 'Artify Group',
      recipientDepartment: item.recipientDepartment || 'General Administration',
      dateReceivedOrSent: item.dateReceivedOrSent || new Date().toISOString().split('T')[0],
      dueDateForResponse: item.dueDateForResponse,
      confidentialityLevel: item.confidentialityLevel || 'Internal',
      priority: item.priority || 'Medium',
      category: item.category || 'Commercial Contract',
      summary: item.summary || item.subject || '',
      fullBody: item.fullBody,
      assignedOwner: item.assignedOwner || activeActor.name,
      attachments: item.attachments || [],
      tags: item.tags || ['Administrative'],
      requiresResponse: !!item.requiresResponse,
      responseStatus: item.requiresResponse ? 'Pending Response' : 'Not Required',
      status: 'Registered',
      timeline: [
        {
          id: `tl-${Date.now()}`,
          timestamp: `${new Date().toISOString().split('T')[0]} 09:00`,
          action: 'Registered into Enterprise Mailroom & OCR Archive',
          actor: activeActor.name
        }
      ]
    };

    setCorrespondenceList(prev => [newCor, ...prev]);

    WorkflowEngineService.logAuditEvent({
      action: 'CREATE',
      module: 'Administration',
      entity: 'Correspondence',
      recordId: newCor.referenceNumber,
      details: `Registered ${newCor.type} correspondence from "${newCor.senderEntity}" regarding "${newCor.subject}"`,
      actor: activeActor,
      result: 'SUCCESS'
    });
  };

  const updateCorrespondenceStatus = (id: string, status: CorrespondenceRecord['status']) => {
    setCorrespondenceList(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status,
          responseStatus: status === 'Closed' ? 'Response Dispatched' : c.responseStatus,
          timeline: [
            ...c.timeline,
            {
              id: `tl-${Date.now()}`,
              timestamp: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
              action: `Status transitioned to ${status}`,
              actor: activeActor.name
            }
          ]
        };
      }
      return c;
    }));
  };

  const classifyCorrespondenceWithAI = (subject: string, body?: string) => {
    const text = `${subject} ${body || ''}`.toLowerCase();
    if (text.includes('decree') || text.includes('ministry') || text.includes('mociip') || text.includes('law') || text.includes('government')) {
      return {
        category: 'Government Decree',
        priority: 'High' as const,
        suggestedDepartment: 'Legal & Executive Management',
        tags: ['Government', 'Regulatory', 'Compliance', 'MOCIIP']
      };
    }
    if (text.includes('contract') || text.includes('tender') || text.includes('proposal') || text.includes('epc') || text.includes('milestone')) {
      return {
        category: 'Commercial Contract',
        priority: 'High' as const,
        suggestedDepartment: 'Contracts & Procurement',
        tags: ['Commercial', 'EPC', 'Vendor', 'Milestone']
      };
    }
    if (text.includes('audit') || text.includes('iso') || text.includes('ifrs') || text.includes('tax')) {
      return {
        category: 'Audit Request',
        priority: 'High' as const,
        suggestedDepartment: 'Finance & Compliance',
        tags: ['Audit', 'Tax', 'Financial', 'Governance']
      };
    }
    return {
      category: 'Internal Memo',
      priority: 'Medium' as const,
      suggestedDepartment: 'Corporate Administration',
      tags: ['General', 'Administrative']
    };
  };

  // -------------------------------------------------------------
  // 03.03 Document Management Methods
  // -------------------------------------------------------------
  const addDocument = (item: Partial<DocumentRecord>) => {
    const newDoc: DocumentRecord = {
      id: `doc-${Date.now()}`,
      documentNumber: `DOC-2026-${String(documents.length + 1).padStart(3, '0')}`,
      title: item.title || 'Untitled Document',
      category: item.category || 'Policy & SOP',
      ownerName: item.ownerName || activeActor.name,
      department: item.department || activeActor.department,
      classification: item.classification || 'Internal Use',
      currentVersion: 'v1.0',
      fileType: item.fileType || 'PDF',
      fileSize: item.fileSize || '2.5 MB',
      registrationDate: new Date().toISOString().split('T')[0],
      lastModifiedDate: new Date().toISOString().split('T')[0],
      tags: item.tags || ['Policy'],
      description: item.description || '',
      versions: [
        {
          version: 'v1.0',
          fileSize: item.fileSize || '2.5 MB',
          uploadedBy: item.ownerName || activeActor.name,
          uploadedAt: new Date().toISOString().split('T')[0],
          changeSummary: 'Initial document registration.'
        }
      ],
      isCheckedOut: false,
      isArchived: false,
      retentionYears: item.retentionYears || 10,
      retentionExpiryDate: new Date(Date.now() + 86400000 * 365 * (item.retentionYears || 10)).toISOString().split('T')[0],
      legalHold: !!item.legalHold,
      watermarkEnabled: !!item.watermarkEnabled,
      accessCount: 1
    };
    setDocuments(prev => [newDoc, ...prev]);

    WorkflowEngineService.logAuditEvent({
      action: 'CREATE',
      module: 'Administration',
      entity: 'Electronic Document',
      recordId: newDoc.documentNumber,
      details: `Registered controlled document "${newDoc.title}" (${newDoc.classification})`,
      actor: activeActor,
      result: 'SUCCESS'
    });
  };

  const checkoutDocument = (id: string, userName: string) => {
    setDocuments(prev => prev.map(d => d.id === id ? {
      ...d,
      isCheckedOut: true,
      checkedOutBy: userName || activeActor.name,
      checkedOutAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    } : d));
  };

  const checkinDocument = (id: string, versionNumber: string, changeSummary: string, userName: string) => {
    setDocuments(prev => prev.map(d => {
      if (d.id === id) {
        const newVer: DocumentVersion = {
          version: versionNumber,
          fileSize: '3.1 MB',
          uploadedBy: userName || activeActor.name,
          uploadedAt: new Date().toISOString().split('T')[0],
          changeSummary
        };
        return {
          ...d,
          isCheckedOut: false,
          checkedOutBy: undefined,
          checkedOutAt: undefined,
          currentVersion: versionNumber,
          lastModifiedDate: new Date().toISOString().split('T')[0],
          versions: [newVer, ...d.versions]
        };
      }
      return d;
    }));
  };

  const archiveDocument = (id: string) => {
    setDocuments(prev => prev.map(d => d.id === id ? {
      ...d,
      isArchived: true,
      archiveDate: new Date().toISOString().split('T')[0]
    } : d));
  };

  const restoreDocument = (id: string) => {
    setDocuments(prev => prev.map(d => d.id === id ? {
      ...d,
      isArchived: false,
      archiveDate: undefined
    } : d));
  };

  // -------------------------------------------------------------
  // 03.04 Internal Requests Methods (Multi-Tier & SoD Enforced)
  // -------------------------------------------------------------
  const addInternalRequest = (item: Partial<InternalRequestRecord>): { success: boolean; error?: string } => {
    const requesterName = item.requestedBy || activeActor.name;
    const requesterRef = item.employeeId || activeActor.employeeRef || 'EMP-9901';

    const validation = WorkflowEngineService.validateSubmission({
      title: item.title,
      requestedBy: requesterName,
      status: item.status
    });

    if (!validation.isValid) {
      WorkflowEngineService.logAuditEvent({
        action: 'SUBMIT',
        module: 'Administration',
        entity: 'Internal Request',
        recordId: 'UNAUTHORIZED_DIRECT_SUBMISSION',
        details: validation.error!,
        actor: activeActor,
        result: 'REJECTED_UNAUTHORIZED'
      });
      setWorkflowBanner({ message: validation.error!, type: 'error', violationCode: 'SEC-AUTH-04' });
      return { success: false, error: validation.error };
    }

    const priority = item.priority || 'Medium';
    const wfEval = WorkflowEngineService.evaluateWorkflowTiers(
      'InternalRequest',
      item.category || item.title || 'General Requisition',
      0,
      priority,
      item.department || activeActor.department
    );

    const newReq: InternalRequestRecord = {
      id: `req-${Date.now()}`,
      ticketNumber: `REQ-${(item.requestType || 'EMP').substring(0, 3).toUpperCase()}-2026-${String(internalRequests.length + 1).padStart(4, '0')}`,
      requestType: item.requestType || 'Employee',
      category: item.category || 'Salary Certificate',
      title: item.title || 'Internal Service Requisition',
      requestedBy: requesterName,
      employeeId: requesterRef,
      department: item.department || activeActor.department,
      branch: item.branch || 'Muscat HQ',
      requestDate: new Date().toISOString().split('T')[0],
      requiredByDate: item.requiredByDate || new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
      priority,
      justification: item.justification || 'Official departmental requirement.',
      status: 'Pending Approval',
      currentApprovalLevel: 1,
      totalApprovalLevels: wfEval.totalLevels,
      approvers: wfEval.stages
    };

    setInternalRequests(prev => [newReq, ...prev]);

    WorkflowEngineService.logAuditEvent({
      action: 'SUBMIT',
      module: 'Administration',
      entity: 'Internal Request',
      recordId: newReq.ticketNumber,
      details: `New request submitted by ${newReq.requestedBy} (${newReq.category}). Initialized workflow ${wfEval.workflowCode} with ${wfEval.totalLevels} approval tiers.`,
      actor: activeActor,
      result: 'SUCCESS'
    });

    const level1Approver = wfEval.stages[0]?.approverName || 'Line Management';
    WorkflowEngineService.dispatchAlert({
      title: `Approval Required: ${newReq.ticketNumber}`,
      message: `${newReq.requestedBy} submitted a ${newReq.priority} priority request for ${newReq.category}. Awaiting Level 1 review.`,
      severity: newReq.priority === 'Urgent' ? 'warning' : 'info',
      linkModule: '03.04 Internal Requests',
      targetRole: level1Approver
    });

    setWorkflowBanner({
      message: `Request ${newReq.ticketNumber} created and routed to ${level1Approver} for Tier-1 verification.`,
      type: 'info'
    });

    return { success: true };
  };

  const approveInternalRequest = (
    id: string,
    approverOverride?: UserContext | string,
    comments?: string
  ): { success: boolean; error?: string } => {
    const actor = resolveActor(approverOverride);
    const target = internalRequests.find(r => r.id === id);

    if (!target) {
      return { success: false, error: 'Request record not found in system repository.' };
    }

    // Backend-validated authorization & Segregation of Duties (SoD) check
    const authCheck = WorkflowEngineService.validateApprovalAuthority(
      {
        requestedBy: target.requestedBy,
        employeeId: target.employeeId,
        currentApprovalLevel: target.currentApprovalLevel,
        totalApprovalLevels: target.totalApprovalLevels,
        approvers: target.approvers
      },
      actor
    );

    if (!authCheck.isAuthorized) {
      WorkflowEngineService.logAuditEvent({
        action: 'SOD_VIOLATION_BLOCKED',
        module: 'Administration',
        entity: 'Internal Request',
        recordId: target.ticketNumber,
        details: `Rejected approval execution: ${authCheck.error}`,
        actor,
        result: 'BLOCKED_SOD_VIOLATION'
      });

      setWorkflowBanner({
        message: authCheck.error!,
        type: 'error',
        violationCode: authCheck.violationCode
      });

      return { success: false, error: authCheck.error };
    }

    // Process Level Progression
    const currentLevel = target.currentApprovalLevel;
    const isLastLevel = currentLevel >= target.totalApprovalLevels;
    const nextLevel = currentLevel + 1;

    setInternalRequests(prev => prev.map(r => {
      if (r.id === id) {
        const updatedStages = (r.approvers || []).map(a => {
          if (a.level === currentLevel) {
            return {
              ...a,
              status: 'Approved' as const,
              approverName: actor.name,
              decisionDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
              comments: comments || `Verified and approved by ${actor.name} (${actor.role})`
            };
          }
          if (a.level === nextLevel) {
            return {
              ...a,
              status: 'Pending' as const
            };
          }
          return a;
        });

        return {
          ...r,
          status: isLastLevel ? 'Approved' : 'Pending Approval',
          currentApprovalLevel: isLastLevel ? target.totalApprovalLevels : nextLevel,
          approvers: updatedStages
        };
      }
      return r;
    }));

    WorkflowEngineService.logAuditEvent({
      action: 'APPROVE',
      module: 'Administration',
      entity: 'Internal Request',
      recordId: target.ticketNumber,
      details: isLastLevel
        ? `Final approval granted by ${actor.name} (${actor.role}). Request is now fully authorized for administrative fulfillment.`
        : `Tier ${currentLevel} approval granted by ${actor.name}. Escalated to Tier ${nextLevel}.`,
      actor,
      result: 'SUCCESS'
    });

    if (isLastLevel) {
      WorkflowEngineService.dispatchAlert({
        title: `Request Approved: ${target.ticketNumber}`,
        message: `Your requisition "${target.title}" has been authorized and forwarded for processing.`,
        severity: 'info',
        linkModule: '03.04 Internal Requests'
      });

      setWorkflowBanner({
        message: `Request ${target.ticketNumber} is now fully Approved with digital management seal. Ready for fulfillment.`,
        type: 'success'
      });
    } else {
      setWorkflowBanner({
        message: `Tier ${currentLevel} approval logged by ${actor.name}. Request escalated to Level ${nextLevel}.`,
        type: 'info'
      });
    }

    return { success: true };
  };

  const rejectInternalRequest = (
    id: string,
    approverOverride?: UserContext | string,
    comments?: string
  ): { success: boolean; error?: string } => {
    const actor = resolveActor(approverOverride);
    const target = internalRequests.find(r => r.id === id);

    if (!target) return { success: false, error: 'Request not found.' };

    const reason = comments || 'Rejected as per departmental policy limits.';

    setInternalRequests(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: 'Rejected',
          approvers: (r.approvers || []).map(a => a.level === r.currentApprovalLevel ? {
            ...a,
            status: 'Rejected',
            approverName: actor.name,
            decisionDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
            comments: reason
          } : a)
        };
      }
      return r;
    }));

    WorkflowEngineService.logAuditEvent({
      action: 'REJECT',
      module: 'Administration',
      entity: 'Internal Request',
      recordId: target.ticketNumber,
      details: `Requisition rejected at Tier ${target.currentApprovalLevel} by ${actor.name}. Reason: ${reason}`,
      actor,
      result: 'SUCCESS'
    });

    WorkflowEngineService.dispatchAlert({
      title: `Request Rejected: ${target.ticketNumber}`,
      message: `Your request was rejected by ${actor.name}. Comments: ${reason}`,
      severity: 'warning',
      linkModule: '03.04 Internal Requests'
    });

    setWorkflowBanner({
      message: `Request ${target.ticketNumber} rejected by ${actor.name}. Audit entry recorded.`,
      type: 'warning'
    });

    return { success: true };
  };

  const completeInternalRequest = (id: string, resolutionNotes?: string) => {
    const target = internalRequests.find(r => r.id === id);
    if (!target) return;

    setInternalRequests(prev => prev.map(r => r.id === id ? {
      ...r,
      status: 'Completed',
      resolutionNotes: resolutionNotes || 'Processed and fulfilled by Corporate Administration.',
      completedAt: new Date().toISOString().split('T')[0]
    } : r));

    WorkflowEngineService.logAuditEvent({
      action: 'COMPLETE',
      module: 'Administration',
      entity: 'Internal Request',
      recordId: target.ticketNumber,
      details: `Completed and closed ticket. Notes: ${resolutionNotes || 'Fulfilled.'}`,
      actor: activeActor,
      result: 'SUCCESS'
    });

    setWorkflowBanner({
      message: `Ticket ${target.ticketNumber} marked as Completed.`,
      type: 'success'
    });
  };

  // -------------------------------------------------------------
  // 03.05 Task & Activity Methods
  // -------------------------------------------------------------
  const addTask = (item: Partial<EnterpriseTask>) => {
    const newTask: EnterpriseTask = {
      id: `tsk-${Date.now()}`,
      taskNumber: `TSK-2026-${String(tasks.length + 1).padStart(4, '0')}`,
      title: item.title || 'Untitled Task',
      description: item.description || '',
      department: item.department || activeActor.department,
      assigneeName: item.assigneeName || activeActor.name,
      reporterName: item.reporterName || 'Eng. Khalid Al-Amri',
      priority: item.priority || 'Medium',
      status: item.status || 'Todo',
      progressPercent: item.progressPercent || 0,
      estimatedHours: item.estimatedHours || 8,
      loggedHours: 0,
      startDate: item.startDate || new Date().toISOString().split('T')[0],
      dueDate: item.dueDate || new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      tags: item.tags || ['Administration'],
      checklist: item.checklist || [],
      activityLogs: [
        {
          id: `act-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          userName: activeActor.name,
          action: 'Task created.'
        }
      ]
    };
    setTasks(prev => [newTask, ...prev]);

    WorkflowEngineService.logAuditEvent({
      action: 'CREATE',
      module: 'Administration',
      entity: 'Task',
      recordId: newTask.taskNumber,
      details: `Assigned task "${newTask.title}" to ${newTask.assigneeName} with due date ${newTask.dueDate}`,
      actor: activeActor,
      result: 'SUCCESS'
    });
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const progress = status === 'Completed' ? 100 : (status === 'In Progress' && t.progressPercent === 0) ? 25 : t.progressPercent;
        return {
          ...t,
          status,
          progressPercent: progress,
          completedAt: status === 'Completed' ? new Date().toISOString().split('T')[0] : undefined,
          activityLogs: [
            ...t.activityLogs,
            {
              id: `act-${Date.now()}`,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
              userName: activeActor.name,
              action: `Status updated to ${status}`
            }
          ]
        };
      }
      return t;
    }));
  };

  const updateTaskProgress = (id: string, progress: number) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const clamped = Math.min(100, Math.max(0, progress));
        const autoStatus: TaskStatus = clamped === 100 ? 'Completed' : clamped > 0 ? 'In Progress' : 'Todo';
        return {
          ...t,
          progressPercent: clamped,
          status: autoStatus,
          activityLogs: [
            ...t.activityLogs,
            {
              id: `act-${Date.now()}`,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
              userName: activeActor.name,
              action: `Progress updated to ${clamped}%`
            }
          ]
        };
      }
      return t;
    }));
  };

  const toggleChecklistItem = (taskId: string, checkId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updatedList = t.checklist.map(c => c.id === checkId ? { ...c, isDone: !c.isDone } : c);
        const doneCount = updatedList.filter(c => c.isDone).length;
        const newProgress = updatedList.length > 0 ? Math.round((doneCount / updatedList.length) * 100) : t.progressPercent;
        return {
          ...t,
          checklist: updatedList,
          progressPercent: newProgress,
          status: newProgress === 100 ? 'Completed' : newProgress > 0 ? 'In Progress' : t.status
        };
      }
      return t;
    }));
  };

  const completeTask = (id: string, notes?: string) => {
    setTasks(prev => prev.map(t => t.id === id ? {
      ...t,
      status: 'Completed',
      progressPercent: 100,
      completedAt: new Date().toISOString().split('T')[0],
      activityLogs: [
        ...t.activityLogs,
        {
          id: `act-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          userName: activeActor.name,
          action: `Completed with sign-off: ${notes || 'Deliverables verified.'}`
        }
      ]
    } : t));
  };

  // -------------------------------------------------------------
  // 03.06 Meeting Management Methods
  // -------------------------------------------------------------
  const addMeeting = (item: Partial<MeetingRecord>) => {
    const newMtg: MeetingRecord = {
      id: `mtg-${Date.now()}`,
      meetingNumber: `MTG-2026-${String(meetings.length + 1).padStart(3, '0')}`,
      title: item.title || 'Corporate Meeting',
      meetingType: item.meetingType || 'Department Operational',
      organizerName: item.organizerName || activeActor.name,
      locationOrRoom: item.locationOrRoom || 'Muscat HQ — Meeting Room A',
      isVirtual: !!item.isVirtual,
      meetingLink: item.meetingLink,
      meetingDate: item.meetingDate || new Date().toISOString().split('T')[0],
      startTime: item.startTime || '10:00 AM',
      endTime: item.endTime || '11:00 AM',
      status: 'Scheduled',
      participants: item.participants || [],
      agenda: item.agenda || [],
      decisions: [],
      actionItems: [],
      attachments: item.attachments || []
    };
    setMeetings(prev => [newMtg, ...prev]);

    WorkflowEngineService.logAuditEvent({
      action: 'CREATE',
      module: 'Administration',
      entity: 'Corporate Meeting',
      recordId: newMtg.meetingNumber,
      details: `Scheduled ${newMtg.meetingType} on ${newMtg.meetingDate} (${newMtg.title})`,
      actor: activeActor,
      result: 'SUCCESS'
    });
  };

  const updateMeetingMoM = (id: string, minutesOfMeeting: string, decisions: string[], actionItems: any[]) => {
    setMeetings(prev => prev.map(m => m.id === id ? {
      ...m,
      minutesOfMeeting,
      decisions,
      actionItems,
      status: 'Completed'
    } : m));
  };

  const convertMoMActionToTask = (meetingId: string, actionId: string) => {
    const mtg = meetings.find(m => m.id === meetingId);
    if (!mtg) return;
    const act = mtg.actionItems.find(a => a.id === actionId);
    if (!act) return;

    const createdTask: EnterpriseTask = {
      id: `tsk-${Date.now()}`,
      taskNumber: `TSK-2026-${String(tasks.length + 1).padStart(4, '0')}`,
      title: `Action Item: ${act.actionDescription}`,
      description: `Arising from Meeting ${mtg.meetingNumber} ("${mtg.title}"). Responsible: ${act.responsiblePerson}.`,
      department: 'Corporate Administration',
      assigneeName: act.responsiblePerson,
      reporterName: mtg.organizerName,
      priority: act.priority,
      status: 'Todo',
      progressPercent: 0,
      estimatedHours: 8,
      loggedHours: 0,
      startDate: new Date().toISOString().split('T')[0],
      dueDate: act.dueDate,
      relatedModule: 'Meeting Management',
      relatedRecordId: mtg.id,
      relatedRecordTitle: `${mtg.meetingNumber} — ${mtg.title}`,
      tags: ['Meeting-Action', mtg.meetingType],
      checklist: [
        { id: `chk-${Date.now()}`, item: act.actionDescription, isDone: false }
      ],
      activityLogs: [
        {
          id: `act-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          userName: 'System',
          action: 'Auto-generated task from meeting action item.'
        }
      ]
    };

    setTasks(prev => [createdTask, ...prev]);

    setMeetings(prev => prev.map(m => {
      if (m.id === meetingId) {
        return {
          ...m,
          actionItems: m.actionItems.map(a => a.id === actionId ? {
            ...a,
            status: 'Transferred to Task' as const,
            linkedTaskId: createdTask.id
          } : a)
        };
      }
      return m;
    }));

    WorkflowEngineService.logAuditEvent({
      action: 'CREATE',
      module: 'Administration',
      entity: 'Task',
      recordId: createdTask.taskNumber,
      details: `Generated actionable task from Meeting ${mtg.meetingNumber} action item`,
      actor: activeActor,
      result: 'SUCCESS'
    });
  };

  // -------------------------------------------------------------
  // 03.07 Travel & Transportation Methods (Multi-Tier & SoD Enforced)
  // -------------------------------------------------------------
  const addTravelRequest = (item: Partial<TravelRequestRecord>): { success: boolean; error?: string } => {
    const flight = item.estimatedFlightCostOMR || 120;
    const hotel = item.estimatedHotelCostOMR || 180;
    const perDiem = item.perDiemAllowanceOMR || 90;
    const total = flight + hotel + perDiem;

    const travelerName = item.travelerName || activeActor.name;
    const employeeCode = item.employeeCode || activeActor.employeeRef || 'EMP-1024';

    const validation = WorkflowEngineService.validateSubmission({
      travelerName,
      status: item.status,
      totalEstimatedCostOMR: total
    });

    if (!validation.isValid) {
      WorkflowEngineService.logAuditEvent({
        action: 'SUBMIT',
        module: 'Administration',
        entity: 'Travel Request',
        recordId: 'UNAUTHORIZED_DIRECT_SUBMISSION',
        details: validation.error!,
        actor: activeActor,
        result: 'REJECTED_UNAUTHORIZED'
      });
      setWorkflowBanner({ message: validation.error!, type: 'error', violationCode: 'SEC-AUTH-04' });
      return { success: false, error: validation.error };
    }

    const wfEval = WorkflowEngineService.evaluateWorkflowTiers(
      'TravelRequest',
      item.travelPurpose || 'Corporate Travel',
      total,
      'Medium',
      item.department || activeActor.department
    );

    const newTrv: TravelRequestRecord = {
      id: `trv-${Date.now()}`,
      travelNumber: `TRV-2026-${String(travelRequests.length + 1).padStart(4, '0')}`,
      travelerName,
      employeeCode,
      department: item.department || activeActor.department,
      travelPurpose: item.travelPurpose || 'Project Site Inspection',
      destinationCity: item.destinationCity || 'Salalah',
      destinationCountry: item.destinationCountry || 'Oman',
      departureDate: item.departureDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      returnDate: item.returnDate || new Date(Date.now() + 86400000 * 6).toISOString().split('T')[0],
      travelClass: item.travelClass || 'Economy',
      hotelRequired: !!item.hotelRequired,
      hotelPreference: item.hotelPreference,
      visaAssistanceNeeded: !!item.visaAssistanceNeeded,
      estimatedFlightCostOMR: flight,
      estimatedHotelCostOMR: hotel,
      perDiemAllowanceOMR: perDiem,
      totalEstimatedCostOMR: total,
      status: 'Pending Approval',
      currentApprovalLevel: 1,
      totalApprovalLevels: wfEval.totalLevels,
      approvers: wfEval.stages,
      justification: item.justification || 'Official corporate business trip.',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setTravelRequests(prev => [newTrv, ...prev]);

    WorkflowEngineService.logAuditEvent({
      action: 'SUBMIT',
      module: 'Administration',
      entity: 'Travel Request',
      recordId: newTrv.travelNumber,
      details: `Travel authorization requested by ${travelerName} to ${newTrv.destinationCity} (Est: OMR ${total.toFixed(3)}). Routed into ${wfEval.workflowCode} (${wfEval.totalLevels} levels).`,
      actor: activeActor,
      result: 'SUCCESS'
    });

    WorkflowEngineService.dispatchAlert({
      title: `Travel Approval Required: ${newTrv.travelNumber}`,
      message: `${travelerName} requested business travel to ${newTrv.destinationCity}, ${newTrv.destinationCountry} (Total: OMR ${total.toFixed(3)}).`,
      severity: total > 1500 ? 'warning' : 'info',
      linkModule: '03.07 Travel & Transportation'
    });

    setWorkflowBanner({
      message: `Travel Request ${newTrv.travelNumber} submitted. Requires ${wfEval.totalLevels} sequential authorization tiers as per corporate travel policy.`,
      type: 'info'
    });

    return { success: true };
  };

  const approveTravelRequest = (
    id: string,
    approverOverride?: UserContext | string,
    comments?: string
  ): { success: boolean; error?: string } => {
    const actor = resolveActor(approverOverride);
    const target = travelRequests.find(t => t.id === id);

    if (!target) return { success: false, error: 'Travel record not found.' };

    const currentLevel = target.currentApprovalLevel || 1;
    const totalLevels = target.totalApprovalLevels || 1;

    // Validate Segregation of Duties & Delegation of Authority limits
    const authCheck = WorkflowEngineService.validateApprovalAuthority(
      {
        travelerName: target.travelerName,
        employeeCode: target.employeeCode,
        currentApprovalLevel: currentLevel,
        totalApprovalLevels: totalLevels,
        approvers: target.approvers,
        totalEstimatedCostOMR: target.totalEstimatedCostOMR
      },
      actor
    );

    if (!authCheck.isAuthorized) {
      WorkflowEngineService.logAuditEvent({
        action: 'SOD_VIOLATION_BLOCKED',
        module: 'Administration',
        entity: 'Travel Request',
        recordId: target.travelNumber,
        details: `Unauthorized travel approval: ${authCheck.error}`,
        actor,
        result: 'BLOCKED_SOD_VIOLATION'
      });

      setWorkflowBanner({
        message: authCheck.error!,
        type: 'error',
        violationCode: authCheck.violationCode
      });

      return { success: false, error: authCheck.error };
    }

    const isLastLevel = currentLevel >= totalLevels;
    const nextLevel = currentLevel + 1;

    setTravelRequests(prev => prev.map(t => {
      if (t.id === id) {
        const updatedStages = (t.approvers || []).map(a => {
          if (a.level === currentLevel) {
            return {
              ...a,
              status: 'Approved' as const,
              approverName: actor.name,
              decisionDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
              comments: comments || `Authorized by ${actor.name} (${actor.role})`
            };
          }
          if (a.level === nextLevel) {
            return {
              ...a,
              status: 'Pending' as const
            };
          }
          return a;
        });

        return {
          ...t,
          status: isLastLevel ? 'Approved' : 'Pending Approval',
          currentApprovalLevel: isLastLevel ? totalLevels : nextLevel,
          approvedBy: isLastLevel ? actor.name : t.approvedBy,
          bookingRef: isLastLevel ? `TKT-ART-${Math.floor(10000 + Math.random() * 90000)}` : t.bookingRef,
          approvers: updatedStages
        };
      }
      return t;
    }));

    WorkflowEngineService.logAuditEvent({
      action: 'APPROVE',
      module: 'Administration',
      entity: 'Travel Request',
      recordId: target.travelNumber,
      details: isLastLevel
        ? `Final travel authorization issued by ${actor.name}. Corporate ticket booking reference generated.`
        : `Tier ${currentLevel} travel approval stamped by ${actor.name}. Escalated to Tier ${nextLevel}.`,
      actor,
      result: 'SUCCESS'
    });

    if (isLastLevel) {
      WorkflowEngineService.dispatchAlert({
        title: `Travel Authorized: ${target.travelNumber}`,
        message: `Your travel request to ${target.destinationCity} has completed all approval tiers and is now Approved.`,
        severity: 'info',
        linkModule: '03.07 Travel & Transportation'
      });

      setWorkflowBanner({
        message: `Travel Request ${target.travelNumber} fully approved by ${actor.name}. Travel desk dispatch authorized.`,
        type: 'success'
      });
    } else {
      setWorkflowBanner({
        message: `Tier ${currentLevel} approval logged by ${actor.name}. Request escalated to Level ${nextLevel}.`,
        type: 'info'
      });
    }

    return { success: true };
  };

  const rejectTravelRequest = (
    id: string,
    approverOverride?: UserContext | string,
    comments?: string
  ): { success: boolean; error?: string } => {
    const actor = resolveActor(approverOverride);
    const target = travelRequests.find(t => t.id === id);

    if (!target) return { success: false, error: 'Travel request not found.' };

    const reason = comments || 'Travel budget exceeded or mission objectives declined by management.';

    setTravelRequests(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: 'Rejected',
          approvers: (t.approvers || []).map(a => a.level === t.currentApprovalLevel ? {
            ...a,
            status: 'Rejected',
            approverName: actor.name,
            decisionDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
            comments: reason
          } : a)
        };
      }
      return t;
    }));

    WorkflowEngineService.logAuditEvent({
      action: 'REJECT',
      module: 'Administration',
      entity: 'Travel Request',
      recordId: target.travelNumber,
      details: `Travel authorization rejected at Tier ${target.currentApprovalLevel} by ${actor.name}. Reason: ${reason}`,
      actor,
      result: 'SUCCESS'
    });

    setWorkflowBanner({
      message: `Travel Request ${target.travelNumber} marked as Rejected by ${actor.name}.`,
      type: 'warning'
    });

    return { success: true };
  };

  const addVehicleBooking = (item: Partial<VehicleBookingRecord>): { success: boolean; error?: string } => {
    const validation = WorkflowEngineService.validateSubmission({
      requestedBy: item.requestedBy || activeActor.name,
      status: item.status
    });

    if (!validation.isValid) {
      setWorkflowBanner({ message: validation.error!, type: 'error' });
      return { success: false, error: validation.error };
    }

    const newBooking: VehicleBookingRecord = {
      id: `vbk-${Date.now()}`,
      bookingNumber: `VEH-BK-2026-${String(vehicleBookings.length + 1).padStart(3, '0')}`,
      requestedBy: item.requestedBy || activeActor.name,
      department: item.department || activeActor.department,
      purpose: item.purpose || 'Client site meeting',
      vehicleAssigned: item.vehicleAssigned || 'Toyota Land Cruiser VXR (9042-AA)',
      plateNumber: item.plateNumber || '9042-AA',
      assignedDriver: item.requiresChauffeur ? (item.assignedDriver || 'Abdullah Al-Balushi') : undefined,
      pickupLocation: item.pickupLocation || 'Muscat HQ',
      dropoffLocation: item.dropoffLocation || 'Sohar Plant',
      tripStartDate: item.tripStartDate || new Date().toISOString().split('T')[0],
      tripStartTime: item.tripStartTime || '09:00 AM',
      tripEndDate: item.tripEndDate || new Date().toISOString().split('T')[0],
      tripEndTime: item.tripEndTime || '17:00 PM',
      passengerCount: item.passengerCount || 1,
      requiresChauffeur: !!item.requiresChauffeur,
      status: 'Approved',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setVehicleBookings(prev => [newBooking, ...prev]);

    WorkflowEngineService.logAuditEvent({
      action: 'SUBMIT',
      module: 'Administration',
      entity: 'Vehicle Booking',
      recordId: newBooking.bookingNumber,
      details: `Dispatched pool vehicle ${newBooking.plateNumber} to ${newBooking.dropoffLocation} for ${newBooking.requestedBy}`,
      actor: activeActor,
      result: 'SUCCESS'
    });

    setWorkflowBanner({
      message: `Vehicle booking ${newBooking.bookingNumber} confirmed and scheduled with Fleet Coordinator.`,
      type: 'success'
    });

    return { success: true };
  };

  const updateFleetVehicleStatus = (id: string, status: FleetVehicleRecord['currentStatus']) => {
    setFleetVehicles(prev => prev.map(v => v.id === id ? { ...v, currentStatus: status } : v));
  };

  // -------------------------------------------------------------
  // 03.08 General Business Services Methods (Multi-Tier & SoD Enforced)
  // -------------------------------------------------------------
  const addGeneralService = (item: Partial<GeneralServiceRequest>): { success: boolean; error?: string } => {
    const requesterName = item.requestedBy || activeActor.name;
    const budget = item.estimatedBudgetOMR || 250;

    const validation = WorkflowEngineService.validateSubmission({
      title: item.title,
      requestedBy: requesterName,
      status: item.status
    });

    if (!validation.isValid) {
      WorkflowEngineService.logAuditEvent({
        action: 'SUBMIT',
        module: 'Administration',
        entity: 'General Service Request',
        recordId: 'UNAUTHORIZED_DIRECT_SUBMISSION',
        details: validation.error!,
        actor: activeActor,
        result: 'REJECTED_UNAUTHORIZED'
      });
      setWorkflowBanner({ message: validation.error!, type: 'error', violationCode: 'SEC-AUTH-04' });
      return { success: false, error: validation.error };
    }

    const wfEval = WorkflowEngineService.evaluateWorkflowTiers(
      'GeneralService',
      item.serviceCategory || 'Facilities Requisition',
      budget,
      'Medium',
      item.department || activeActor.department
    );

    const newGSR: GeneralServiceRequest = {
      id: `gsr-${Date.now()}`,
      serviceRequestNumber: `GSR-2026-${String(generalServices.length + 1).padStart(3, '0')}`,
      serviceCategory: item.serviceCategory || 'Office Interior & Relocation',
      title: item.title || 'General Business Service Requisition',
      requestedBy: requesterName,
      department: item.department || activeActor.department,
      location: item.location || 'Muscat HQ',
      scheduledDate: item.scheduledDate || new Date().toISOString().split('T')[0],
      scopeOfWork: item.scopeOfWork || 'General administrative facility maintenance.',
      vendorAssigned: item.vendorAssigned,
      estimatedBudgetOMR: budget,
      status: 'Pending Approval',
      currentApprovalLevel: 1,
      totalApprovalLevels: wfEval.totalLevels,
      approvers: wfEval.stages,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setGeneralServices(prev => [newGSR, ...prev]);

    WorkflowEngineService.logAuditEvent({
      action: 'SUBMIT',
      module: 'Administration',
      entity: 'General Service Request',
      recordId: newGSR.serviceRequestNumber,
      details: `Service requisition submitted by ${requesterName} (Est. OMR ${budget.toFixed(3)}). Enrolled in ${wfEval.workflowCode}.`,
      actor: activeActor,
      result: 'SUCCESS'
    });

    setWorkflowBanner({
      message: `Service Requisition ${newGSR.serviceRequestNumber} created and awaiting Level 1 management approval.`,
      type: 'info'
    });

    return { success: true };
  };

  const approveGeneralService = (
    id: string,
    approverOverride?: UserContext | string,
    comments?: string
  ): { success: boolean; error?: string } => {
    const actor = resolveActor(approverOverride);
    const target = generalServices.find(g => g.id === id);

    if (!target) return { success: false, error: 'Service request not found.' };

    const currentLevel = target.currentApprovalLevel || 1;
    const totalLevels = target.totalApprovalLevels || 1;

    const authCheck = WorkflowEngineService.validateApprovalAuthority(
      {
        requestedBy: target.requestedBy,
        currentApprovalLevel: currentLevel,
        totalApprovalLevels: totalLevels,
        approvers: target.approvers,
        estimatedBudgetOMR: target.estimatedBudgetOMR
      },
      actor
    );

    if (!authCheck.isAuthorized) {
      WorkflowEngineService.logAuditEvent({
        action: 'SOD_VIOLATION_BLOCKED',
        module: 'Administration',
        entity: 'General Service Request',
        recordId: target.serviceRequestNumber,
        details: `Blocked unauthorized approval: ${authCheck.error}`,
        actor,
        result: 'BLOCKED_SOD_VIOLATION'
      });

      setWorkflowBanner({
        message: authCheck.error!,
        type: 'error',
        violationCode: authCheck.violationCode
      });

      return { success: false, error: authCheck.error };
    }

    const isLastLevel = currentLevel >= totalLevels;
    const nextLevel = currentLevel + 1;

    setGeneralServices(prev => prev.map(g => {
      if (g.id === id) {
        const updatedStages = (g.approvers || []).map(a => {
          if (a.level === currentLevel) {
            return {
              ...a,
              status: 'Approved' as const,
              approverName: actor.name,
              decisionDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
              comments: comments || `Approved by ${actor.name} (${actor.role})`
            };
          }
          if (a.level === nextLevel) {
            return {
              ...a,
              status: 'Pending' as const
            };
          }
          return a;
        });

        return {
          ...g,
          status: isLastLevel ? 'Approved' : 'Pending Approval',
          currentApprovalLevel: isLastLevel ? totalLevels : nextLevel,
          approvers: updatedStages
        };
      }
      return g;
    }));

    WorkflowEngineService.logAuditEvent({
      action: 'APPROVE',
      module: 'Administration',
      entity: 'General Service Request',
      recordId: target.serviceRequestNumber,
      details: isLastLevel
        ? `Fully authorized service contract by ${actor.name}. Dispatched to vendor.`
        : `Tier ${currentLevel} signed off by ${actor.name}. Escalated to Tier ${nextLevel}.`,
      actor,
      result: 'SUCCESS'
    });

    setWorkflowBanner({
      message: isLastLevel
        ? `Service Requisition ${target.serviceRequestNumber} fully Approved by ${actor.name}.`
        : `Tier ${currentLevel} approval registered. Escalated to Tier ${nextLevel}.`,
      type: 'success'
    });

    return { success: true };
  };

  const rejectGeneralService = (
    id: string,
    approverOverride?: UserContext | string,
    comments?: string
  ): { success: boolean; error?: string } => {
    const actor = resolveActor(approverOverride);
    const target = generalServices.find(g => g.id === id);

    if (!target) return { success: false, error: 'Service request not found.' };

    const reason = comments || 'Budget denied by administration.';

    setGeneralServices(prev => prev.map(g => {
      if (g.id === id) {
        return {
          ...g,
          status: 'Rejected',
          approvers: (g.approvers || []).map(a => a.level === g.currentApprovalLevel ? {
            ...a,
            status: 'Rejected',
            approverName: actor.name,
            decisionDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
            comments: reason
          } : a)
        };
      }
      return g;
    }));

    WorkflowEngineService.logAuditEvent({
      action: 'REJECT',
      module: 'Administration',
      entity: 'General Service Request',
      recordId: target.serviceRequestNumber,
      details: `Service requisition rejected by ${actor.name}. Reason: ${reason}`,
      actor,
      result: 'SUCCESS'
    });

    setWorkflowBanner({
      message: `Service Requisition ${target.serviceRequestNumber} marked as Rejected.`,
      type: 'warning'
    });

    return { success: true };
  };

  const updateGeneralServiceStatus = (id: string, status: WorkflowStatus) => {
    setGeneralServices(prev => prev.map(g => g.id === id ? { ...g, status } : g));
  };

  const addOfficeAsset = (item: Partial<OfficeAssetRecord>) => {
    const newAsset: OfficeAssetRecord = {
      id: `ast-${Date.now()}`,
      assetTag: `AST-OFF-${String(officeAssets.length + 945).padStart(4, '0')}`,
      itemName: item.itemName || 'Office Furnishing Item',
      category: item.category || 'Office Furniture',
      locationRoom: item.locationRoom || 'Muscat HQ — Floor 3',
      branch: item.branch || 'Muscat HQ',
      custodianEmployee: item.custodianEmployee || activeActor.name,
      purchaseDate: item.purchaseDate || new Date().toISOString().split('T')[0],
      purchaseValueOMR: item.purchaseValueOMR || 150,
      condition: item.condition || 'Good',
      serialNumber: item.serialNumber,
      status: 'In Service'
    };
    setOfficeAssets(prev => [newAsset, ...prev]);

    WorkflowEngineService.logAuditEvent({
      action: 'CREATE',
      module: 'Administration',
      entity: 'Office Asset',
      recordId: newAsset.assetTag,
      details: `Tagged and registered office physical asset "${newAsset.itemName}" (${newAsset.locationRoom})`,
      actor: activeActor,
      result: 'SUCCESS'
    });
  };

  // -------------------------------------------------------------
  // Analytics Summary
  // -------------------------------------------------------------
  const analyticsSummary: AdminAnalyticsSummary = {
    totalOpenRequests: internalRequests.filter(r => r.status === 'Pending Approval' || r.status === 'Submitted').length +
      facilityWorkOrders.filter(f => f.status === 'Submitted' || f.status === 'In Progress').length +
      officeServices.filter(s => s.status === 'Submitted' || s.status === 'In Progress').length,
    pendingApprovalsCount: internalRequests.filter(r => r.status === 'Pending Approval').length +
      travelRequests.filter(t => t.status === 'Pending Approval').length +
      stationeryRequests.filter(s => s.status === 'Pending Approval').length +
      generalServices.filter(g => g.status === 'Pending Approval').length,
    activeDocumentsCount: documents.filter(d => !d.isArchived).length,
    archivedDocumentsCount: documents.filter(d => d.isArchived).length,
    totalIncomingMailThisMonth: correspondenceList.filter(c => c.type === 'incoming').length,
    overdueTasksCount: tasks.filter(t => t.status !== 'Completed' && new Date(t.dueDate) < new Date()).length,
    upcomingMeetingsCount: meetings.filter(m => m.status === 'Scheduled').length,
    activeVehiclesInPool: fleetVehicles.filter(v => v.currentStatus === 'Available' || v.currentStatus === 'On Mission').length,
    totalMonthlyStationerySpendOMR: stationeryRequests.reduce((acc, curr) => acc + (curr.totalCostOMR || 0), 0),
    totalMonthlyTravelBudgetOMR: travelRequests.reduce((acc, curr) => acc + (curr.totalEstimatedCostOMR || 0), 0),
    avgRequestResolutionDays: 1.6
  };

  const generateAdminBriefing = (): string => {
    const pendingCount = analyticsSummary.pendingApprovalsCount;
    const meetingCount = analyticsSummary.upcomingMeetingsCount;
    const openTasks = tasks.filter(t => t.status !== 'Completed').length;
    return `Enterprise Administration status for today: ${pendingCount} pending requests require management authorization. ${meetingCount} scheduled corporate meetings on roster today. ${openTasks} operational tasks active with 98.2% on-time SLA completion. Facilities and fleet logistics operating within budgeted safety parameters.`;
  };

  return (
    <AdministrationContext.Provider
      value={{
        activeActor,
        setActiveActor,
        enterpriseActors: ENTERPRISE_ACTORS,
        workflowBanner,
        setWorkflowBanner,
        clearWorkflowBanner,
        notices,
        addNotice,
        deleteNotice,
        officeServices,
        addOfficeService,
        updateOfficeServiceStatus,
        stationeryItems,
        stationeryRequests,
        addStationeryRequest,
        approveStationeryRequest,
        issueStationeryRequest,
        facilityWorkOrders,
        addFacilityWorkOrder,
        updateFacilityWorkOrderStatus,
        correspondenceList,
        addCorrespondence,
        updateCorrespondenceStatus,
        classifyCorrespondenceWithAI,
        documents,
        addDocument,
        checkoutDocument,
        checkinDocument,
        archiveDocument,
        restoreDocument,
        internalRequests,
        addInternalRequest,
        approveInternalRequest,
        rejectInternalRequest,
        completeInternalRequest,
        tasks,
        addTask,
        updateTaskStatus,
        updateTaskProgress,
        toggleChecklistItem,
        completeTask,
        meetings,
        addMeeting,
        updateMeetingMoM,
        convertMoMActionToTask,
        travelRequests,
        addTravelRequest,
        approveTravelRequest,
        rejectTravelRequest,
        fleetVehicles,
        vehicleBookings,
        addVehicleBooking,
        updateFleetVehicleStatus,
        generalServices,
        addGeneralService,
        approveGeneralService,
        rejectGeneralService,
        updateGeneralServiceStatus,
        serviceVendors,
        officeAssets,
        addOfficeAsset,
        analyticsSummary,
        formatCurrency,
        generateAdminBriefing
      }}
    >
      {children}
    </AdministrationContext.Provider>
  );
};

export const useAdmin = (): AdministrationContextType => {
  const context = useContext(AdministrationContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdministrationProvider');
  }
  return context;
};
