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

interface AdministrationContextType {
  // 03.01 Office Administration
  notices: OfficeNotice[];
  addNotice: (notice: Partial<OfficeNotice>) => void;
  deleteNotice: (id: string) => void;
  officeServices: OfficeServiceOrder[];
  addOfficeService: (order: Partial<OfficeServiceOrder>) => void;
  updateOfficeServiceStatus: (id: string, status: WorkflowStatus) => void;
  stationeryItems: StationeryItem[];
  stationeryRequests: StationeryRequest[];
  addStationeryRequest: (req: Partial<StationeryRequest>) => void;
  approveStationeryRequest: (id: string, approverName: string) => void;
  issueStationeryRequest: (id: string, issuerName: string) => void;
  facilityWorkOrders: FacilityWorkOrder[];
  addFacilityWorkOrder: (order: Partial<FacilityWorkOrder>) => void;
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
  addInternalRequest: (req: Partial<InternalRequestRecord>) => void;
  approveInternalRequest: (id: string, approverName: string, comments?: string) => void;
  rejectInternalRequest: (id: string, approverName: string, comments: string) => void;
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
  addTravelRequest: (trv: Partial<TravelRequestRecord>) => void;
  approveTravelRequest: (id: string, approverName: string) => void;
  rejectTravelRequest: (id: string, approverName: string) => void;
  fleetVehicles: FleetVehicleRecord[];
  vehicleBookings: VehicleBookingRecord[];
  addVehicleBooking: (booking: Partial<VehicleBookingRecord>) => void;
  updateFleetVehicleStatus: (id: string, status: FleetVehicleRecord['currentStatus']) => void;

  // 03.08 General Business Services
  generalServices: GeneralServiceRequest[];
  addGeneralService: (req: Partial<GeneralServiceRequest>) => void;
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
      publishedBy: item.publishedBy || 'Corporate Administration',
      priority: item.priority || 'Normal',
      isPinned: !!item.isPinned,
      status: 'Active'
    };
    setNotices(prev => [newNotice, ...prev]);
  };

  const deleteNotice = (id: string) => {
    setNotices(prev => prev.filter(n => n.id !== id));
  };

  const addOfficeService = (item: Partial<OfficeServiceOrder>) => {
    const newService: OfficeServiceOrder = {
      id: `srv-${Date.now()}`,
      orderNumber: `SRV-2026-${String(officeServices.length + 1).padStart(3, '0')}`,
      serviceType: item.serviceType || 'Visitor Security Pass',
      title: item.title || 'Office Service Request',
      requestedBy: item.requestedBy || 'Current User',
      department: item.department || 'Administration',
      location: item.location || 'Muscat HQ',
      scheduledDate: item.scheduledDate || new Date().toISOString().split('T')[0],
      details: item.details || '',
      guestCount: item.guestCount,
      assignedVendor: item.assignedVendor,
      status: 'Submitted',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setOfficeServices(prev => [newService, ...prev]);
  };

  const updateOfficeServiceStatus = (id: string, status: WorkflowStatus) => {
    setOfficeServices(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const addStationeryRequest = (item: Partial<StationeryRequest>) => {
    const newReq: StationeryRequest = {
      id: `str-${Date.now()}`,
      requestNumber: `REQ-STA-2026-${String(stationeryRequests.length + 1).padStart(3, '0')}`,
      requesterName: item.requesterName || 'Current User',
      department: item.department || 'Operations',
      requestDate: new Date().toISOString().split('T')[0],
      items: item.items || [],
      totalCostOMR: item.totalCostOMR || 0,
      purpose: item.purpose || 'Daily departmental administrative activities.',
      status: 'Pending Approval'
    };
    setStationeryRequests(prev => [newReq, ...prev]);
  };

  const approveStationeryRequest = (id: string, approverName: string) => {
    setStationeryRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved', approvedBy: approverName } : r));
  };

  const issueStationeryRequest = (id: string, issuerName: string) => {
    setStationeryRequests(prev => prev.map(r => {
      if (r.id === id) {
        // deduct stock
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
          issuedBy: issuerName,
          issuedAt: new Date().toISOString().split('T')[0],
          items: r.items.map(it => ({ ...it, quantityIssued: it.quantityRequested }))
        };
      }
      return r;
    }));
  };

  const addFacilityWorkOrder = (item: Partial<FacilityWorkOrder>) => {
    const newOrder: FacilityWorkOrder = {
      id: `fac-${Date.now()}`,
      workOrderNumber: `FAC-WO-2026-${String(facilityWorkOrders.length + 1).padStart(3, '0')}`,
      title: item.title || 'Facility Work Order',
      category: item.category || 'Workstation & Furniture',
      facilityLocation: item.facilityLocation || 'Muscat HQ',
      requestedBy: item.requestedBy || 'Current User',
      department: item.department || 'Office Administration',
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
  };

  const updateFacilityWorkOrderStatus = (id: string, status: WorkflowStatus, resolutionNotes?: string) => {
    setFacilityWorkOrders(prev => prev.map(f => f.id === id ? {
      ...f,
      status,
      resolutionNotes: resolutionNotes || f.resolutionNotes,
      updatedAt: new Date().toISOString().split('T')[0]
    } : f));
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
      assignedOwner: item.assignedOwner || 'Eng. Khalid Al-Amri',
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
          actor: 'Current User'
        }
      ]
    };
    setCorrespondenceList(prev => [newCor, ...prev]);
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
              actor: 'Current User'
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
      ownerName: item.ownerName || 'Current User',
      department: item.department || 'Administration',
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
          uploadedBy: item.ownerName || 'Current User',
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
  };

  const checkoutDocument = (id: string, userName: string) => {
    setDocuments(prev => prev.map(d => d.id === id ? {
      ...d,
      isCheckedOut: true,
      checkedOutBy: userName,
      checkedOutAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    } : d));
  };

  const checkinDocument = (id: string, versionNumber: string, changeSummary: string, userName: string) => {
    setDocuments(prev => prev.map(d => {
      if (d.id === id) {
        const newVer: DocumentVersion = {
          version: versionNumber,
          fileSize: d.fileSize,
          uploadedBy: userName,
          uploadedAt: new Date().toISOString().split('T')[0],
          changeSummary
        };
        return {
          ...d,
          currentVersion: versionNumber,
          isCheckedOut: false,
          checkedOutBy: undefined,
          checkedOutAt: undefined,
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
  // 03.04 Internal Requests Methods
  // -------------------------------------------------------------
  const addInternalRequest = (item: Partial<InternalRequestRecord>) => {
    const newReq: InternalRequestRecord = {
      id: `req-${Date.now()}`,
      ticketNumber: `REQ-${(item.requestType || 'EMP').substring(0, 3).toUpperCase()}-2026-${String(internalRequests.length + 1).padStart(4, '0')}`,
      requestType: item.requestType || 'Employee',
      category: item.category || 'Salary Certificate',
      title: item.title || 'Internal Service Requisition',
      requestedBy: item.requestedBy || 'Current User',
      employeeId: item.employeeId || 'EMP-9901',
      department: item.department || 'Operations',
      branch: item.branch || 'Muscat HQ',
      requestDate: new Date().toISOString().split('T')[0],
      requiredByDate: item.requiredByDate || new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
      priority: item.priority || 'Medium',
      justification: item.justification || '',
      status: 'Pending Approval',
      currentApprovalLevel: 1,
      totalApprovalLevels: item.requestType === 'Department' ? 2 : 1,
      approvers: [
        {
          level: 1,
          role: 'Line Manager / Dept Head',
          approverName: 'Eng. Khalid Al-Amri',
          status: 'Pending'
        }
      ]
    };
    setInternalRequests(prev => [newReq, ...prev]);
  };

  const approveInternalRequest = (id: string, approverName: string, comments?: string) => {
    setInternalRequests(prev => prev.map(r => {
      if (r.id === id) {
        const nextLevel = r.currentApprovalLevel + 1;
        const isFullyApproved = nextLevel > r.totalApprovalLevels;
        return {
          ...r,
          status: isFullyApproved ? 'Approved' : 'Pending Approval',
          currentApprovalLevel: isFullyApproved ? r.totalApprovalLevels : nextLevel,
          approvers: r.approvers.map(a => a.level === r.currentApprovalLevel ? {
            ...a,
            status: 'Approved',
            decisionDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
            comments
          } : a)
        };
      }
      return r;
    }));
  };

  const rejectInternalRequest = (id: string, approverName: string, comments: string) => {
    setInternalRequests(prev => prev.map(r => r.id === id ? {
      ...r,
      status: 'Rejected',
      approvers: r.approvers.map(a => a.level === r.currentApprovalLevel ? {
        ...a,
        status: 'Rejected',
        decisionDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
        comments
      } : a)
    } : r));
  };

  const completeInternalRequest = (id: string, resolutionNotes?: string) => {
    setInternalRequests(prev => prev.map(r => r.id === id ? {
      ...r,
      status: 'Completed',
      resolutionNotes: resolutionNotes || 'Processed and fulfilled by Administration.',
      completedAt: new Date().toISOString().split('T')[0]
    } : r));
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
      department: item.department || 'Office Administration',
      assigneeName: item.assigneeName || 'Current User',
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
          userName: 'Current User',
          action: 'Task created.'
        }
      ]
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const progress = status === 'Completed' ? 100 : (status === 'In Progress' && t.progressPercent === 0) ? 25 : t.progressPercent;
        return {
          ...t,
          status,
          progressPercent: progress,
          completedAt: status === 'Completed' ? new Date().toISOString().split('T')[0] : t.completedAt,
          activityLogs: [
            ...t.activityLogs,
            {
              id: `act-${Date.now()}`,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
              userName: 'Current User',
              action: `Status moved to ${status}`
            }
          ]
        };
      }
      return t;
    }));
  };

  const updateTaskProgress = (id: string, progressPercent: number) => {
    setTasks(prev => prev.map(t => t.id === id ? {
      ...t,
      progressPercent,
      status: progressPercent === 100 ? 'Completed' : progressPercent > 0 ? 'In Progress' : 'Todo',
      completedAt: progressPercent === 100 ? new Date().toISOString().split('T')[0] : undefined
    } : t));
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
          userName: 'Current User',
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
      organizerName: item.organizerName || 'Current User',
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

    // Create a new task linked to this action item
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
          action: `Auto-generated task from meeting action item.`
        }
      ]
    };

    setTasks(prev => [createdTask, ...prev]);

    // Update meeting action status
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
  };

  // -------------------------------------------------------------
  // 03.07 Travel & Transportation Methods
  // -------------------------------------------------------------
  const addTravelRequest = (item: Partial<TravelRequestRecord>) => {
    const flight = item.estimatedFlightCostOMR || 120;
    const hotel = item.estimatedHotelCostOMR || 180;
    const perDiem = item.perDiemAllowanceOMR || 90;
    const total = flight + hotel + perDiem;

    const newTrv: TravelRequestRecord = {
      id: `trv-${Date.now()}`,
      travelNumber: `TRV-2026-${String(travelRequests.length + 1).padStart(4, '0')}`,
      travelerName: item.travelerName || 'Current User',
      employeeCode: item.employeeCode || 'EMP-1024',
      department: item.department || 'Corporate Management',
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
      justification: item.justification || 'Official corporate business trip.',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTravelRequests(prev => [newTrv, ...prev]);
  };

  const approveTravelRequest = (id: string, approverName: string) => {
    setTravelRequests(prev => prev.map(t => t.id === id ? {
      ...t,
      status: 'Approved',
      approvedBy: approverName,
      bookingRef: `TKT-ART-${Math.floor(10000 + Math.random() * 90000)}`
    } : t));
  };

  const rejectTravelRequest = (id: string, approverName: string) => {
    setTravelRequests(prev => prev.map(t => t.id === id ? { ...t, status: 'Rejected' } : t));
  };

  const addVehicleBooking = (item: Partial<VehicleBookingRecord>) => {
    const newBooking: VehicleBookingRecord = {
      id: `vbk-${Date.now()}`,
      bookingNumber: `VEH-BK-2026-${String(vehicleBookings.length + 1).padStart(3, '0')}`,
      requestedBy: item.requestedBy || 'Current User',
      department: item.department || 'Operations',
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
  };

  const updateFleetVehicleStatus = (id: string, status: FleetVehicleRecord['currentStatus']) => {
    setFleetVehicles(prev => prev.map(v => v.id === id ? { ...v, currentStatus: status } : v));
  };

  // -------------------------------------------------------------
  // 03.08 General Business Services Methods
  // -------------------------------------------------------------
  const addGeneralService = (item: Partial<GeneralServiceRequest>) => {
    const newGSR: GeneralServiceRequest = {
      id: `gsr-${Date.now()}`,
      serviceRequestNumber: `GSR-2026-${String(generalServices.length + 1).padStart(3, '0')}`,
      serviceCategory: item.serviceCategory || 'Office Interior & Relocation',
      title: item.title || 'General Business Service Requisition',
      requestedBy: item.requestedBy || 'Current User',
      department: item.department || 'Administration',
      location: item.location || 'Muscat HQ',
      scheduledDate: item.scheduledDate || new Date().toISOString().split('T')[0],
      scopeOfWork: item.scopeOfWork || '',
      vendorAssigned: item.vendorAssigned,
      estimatedBudgetOMR: item.estimatedBudgetOMR || 250,
      status: 'Approved',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setGeneralServices(prev => [newGSR, ...prev]);
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
      custodianEmployee: item.custodianEmployee || 'Current User',
      purchaseDate: item.purchaseDate || new Date().toISOString().split('T')[0],
      purchaseValueOMR: item.purchaseValueOMR || 150,
      condition: item.condition || 'Good',
      serialNumber: item.serialNumber,
      status: 'In Service'
    };
    setOfficeAssets(prev => [newAsset, ...prev]);
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
      stationeryRequests.filter(s => s.status === 'Pending Approval').length,
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
