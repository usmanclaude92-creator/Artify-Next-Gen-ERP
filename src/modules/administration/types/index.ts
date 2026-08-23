export type WorkflowStatus =
  | 'Draft'
  | 'Submitted'
  | 'Pending Approval'
  | 'Approved'
  | 'Rejected'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled'
  | 'Archived';

export type RequestPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

// ==========================================
// 03.01 Office Administration Types
// ==========================================

export interface OfficeNotice {
  id: string;
  noticeNumber: string;
  title: string;
  category: 'General' | 'Security' | 'Maintenance' | 'Policy' | 'Executive';
  content: string;
  targetAudience: 'All Employees' | 'Muscat HQ' | 'Sohar Facility' | 'Salalah Depot' | 'Executives';
  publishedDate: string;
  expiryDate?: string;
  publishedBy: string;
  priority: 'Normal' | 'Important' | 'Critical';
  isPinned: boolean;
  status: 'Active' | 'Expired' | 'Draft';
}

export interface OfficeServiceOrder {
  id: string;
  orderNumber: string;
  serviceType: 'Catering & Hospitality' | 'Visitor Security Pass' | 'Access Badge Issuing' | 'Janitorial & Cleaning' | 'Courier & Mailroom Dispatch';
  title: string;
  requestedBy: string;
  department: string;
  location: string;
  scheduledDate: string;
  details: string;
  guestCount?: number;
  assignedVendor?: string;
  status: WorkflowStatus;
  createdAt: string;
}

export interface StationeryItem {
  id: string;
  itemCode: string;
  itemName: string;
  category: 'Paper & Notebooks' | 'Writing Instruments' | 'Desk Accessories' | 'Printer Toners & Cartridges' | 'Filing & Folders' | 'Packaging Materials';
  unitOfMeasure: 'Box' | 'Pack' | 'Piece' | 'Ream' | 'Carton';
  availableStock: number;
  reorderLevel: number;
  unitCostOMR: number;
  storageLocation: string;
}

export interface StationeryRequest {
  id: string;
  requestNumber: string;
  requesterName: string;
  department: string;
  requestDate: string;
  items: {
    itemId: string;
    itemCode: string;
    itemName: string;
    quantityRequested: number;
    quantityIssued: number;
    unitCostOMR: number;
  }[];
  totalCostOMR: number;
  purpose: string;
  status: WorkflowStatus;
  currentApprovalLevel?: number;
  totalApprovalLevels?: number;
  approvers?: {
    level: number;
    role: string;
    approverName: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Waiting' | 'Skipped';
    decisionDate?: string;
    comments?: string;
  }[];
  approvedBy?: string;
  issuedBy?: string;
  issuedAt?: string;
}

export interface FacilityWorkOrder {
  id: string;
  workOrderNumber: string;
  title: string;
  category: 'HVAC & Climate' | 'Electrical' | 'Plumbing' | 'Workstation & Furniture' | 'Civil & Painting' | 'Access & Locks';
  facilityLocation: string;
  requestedBy: string;
  department: string;
  priority: RequestPriority;
  description: string;
  assignedTechnician?: string;
  assignedVendor?: string;
  estimatedCostOMR?: number;
  actualCostOMR?: number;
  targetCompletionDate: string;
  status: WorkflowStatus;
  resolutionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 03.02 Correspondence Management Types
// ==========================================

export type CorrespondenceType = 'incoming' | 'outgoing' | 'internal';

export interface CorrespondenceAttachment {
  id: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  uploadedAt: string;
}

export interface CorrespondenceRecord {
  id: string;
  referenceNumber: string; // e.g. COR-IN-2026-0042
  externalReference?: string; // e.g. PDO-ADM-9941
  type: CorrespondenceType;
  subject: string;
  senderEntity: string; // e.g. Ministry of Commerce / PDO / Siemens
  senderContactPerson?: string;
  recipientEntity: string; // e.g. Artify Group / Dept of Legal
  recipientDepartment: string;
  dateReceivedOrSent: string;
  dueDateForResponse?: string;
  confidentialityLevel: 'Public' | 'Internal' | 'Confidential' | 'Strictly Secret';
  priority: RequestPriority;
  category: 'Government Decree' | 'Commercial Contract' | 'Client Inquiry' | 'Vendor Notice' | 'Audit Request' | 'Internal Memo';
  summary: string;
  fullBody?: string;
  assignedOwner: string;
  attachments: CorrespondenceAttachment[];
  tags: string[];
  requiresResponse: boolean;
  responseStatus?: 'Not Required' | 'Pending Response' | 'Response Dispatched' | 'Overdue';
  status: 'Registered' | 'Assigned' | 'Under Review' | 'Closed' | 'Archived';
  timeline: {
    id: string;
    timestamp: string;
    action: string;
    actor: string;
    comments?: string;
  }[];
}

// ==========================================
// 03.03 Document Management (DMS) Types
// ==========================================

export interface DocumentVersion {
  version: string; // e.g. 'v1.0', 'v1.1'
  fileSize: string;
  uploadedBy: string;
  uploadedAt: string;
  changeSummary: string;
  downloadUrl?: string;
}

export interface DocumentRecord {
  id: string;
  documentNumber: string; // e.g. DOC-SOP-2026-081
  title: string;
  category: 'Policy & SOP' | 'Board Resolution' | 'Commercial Agreement' | 'Compliance & Legal' | 'Engineering Spec' | 'Office Administration';
  ownerName: string;
  department: string;
  classification: 'Public' | 'Internal Use' | 'Confidential' | 'Restricted';
  currentVersion: string;
  fileType: 'PDF' | 'DOCX' | 'XLSX' | 'SCAN';
  fileSize: string;
  registrationDate: string;
  lastModifiedDate: string;
  tags: string[];
  description: string;
  versions: DocumentVersion[];
  isCheckedOut: boolean;
  checkedOutBy?: string;
  checkedOutAt?: string;
  isArchived: boolean;
  archiveDate?: string;
  retentionYears: number; // e.g. 5, 10, 99 (Permanent)
  retentionExpiryDate: string;
  legalHold: boolean;
  watermarkEnabled: boolean;
  accessCount: number;
}

// ==========================================
// 03.04 Internal Requests Types
// ==========================================

export type InternalRequestCategory =
  | 'Salary Certificate'
  | 'Experience Certificate'
  | 'Embassy / Visa Assistance Letter'
  | 'Staff Parking Permit'
  | 'Business Card Printing'
  | 'Department Asset Requisition'
  | 'Temporary Office Space Allocation'
  | 'Event Support & AV Setup'
  | 'Corporate Courier Dispatch'
  | 'Access Card Replacement';

export interface InternalRequestRecord {
  id: string;
  ticketNumber: string; // e.g. REQ-EMP-2026-0128
  requestType: 'Employee' | 'Department' | 'Administrative';
  category: InternalRequestCategory;
  title: string;
  requestedBy: string;
  employeeId?: string;
  department: string;
  branch: string;
  requestDate: string;
  requiredByDate: string;
  priority: RequestPriority;
  justification: string;
  status: WorkflowStatus;
  currentApprovalLevel: number;
  totalApprovalLevels: number;
  approvers: {
    level: number;
    role: string;
    approverName: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Waiting' | 'Skipped';
    decisionDate?: string;
    comments?: string;
  }[];
  attachments?: CorrespondenceAttachment[];
  resolutionNotes?: string;
  completedAt?: string;
}

// ==========================================
// 03.05 Task & Activity Management Types
// ==========================================

export type TaskStatus = 'Todo' | 'In Progress' | 'In Review' | 'Completed' | 'Blocked';

export interface EnterpriseTask {
  id: string;
  taskNumber: string; // e.g. TSK-2026-0312
  title: string;
  description: string;
  department: string;
  assigneeName: string;
  assigneeAvatar?: string;
  reporterName: string;
  priority: RequestPriority;
  status: TaskStatus;
  progressPercent: number; // 0 to 100
  estimatedHours: number;
  loggedHours: number;
  startDate: string;
  dueDate: string;
  completedAt?: string;
  relatedModule?: string;
  relatedRecordId?: string; // Links to meeting, request, correspondence, etc.
  relatedRecordTitle?: string;
  tags: string[];
  checklist: {
    id: string;
    item: string;
    isDone: boolean;
  }[];
  activityLogs: {
    id: string;
    timestamp: string;
    userName: string;
    action: string;
    notes?: string;
  }[];
}

// ==========================================
// 03.06 Meeting Management Types
// ==========================================

export interface MeetingParticipant {
  id: string;
  name: string;
  email: string;
  roleOrDesignation: string;
  isExternal: boolean;
  organization?: string;
  attendanceStatus: 'Invited' | 'Accepted' | 'Declined' | 'Tentative' | 'Attended' | 'Absent';
}

export interface AgendaItem {
  id: string;
  orderNumber: number;
  title: string;
  allocatedMinutes: number;
  presenterName: string;
  summaryNotes?: string;
  attachmentName?: string;
}

export interface MeetingActionItem {
  id: string;
  actionDescription: string;
  responsiblePerson: string;
  dueDate: string;
  priority: RequestPriority;
  status: 'Open' | 'Completed' | 'Transferred to Task';
  linkedTaskId?: string;
}

export interface MeetingRecord {
  id: string;
  meetingNumber: string; // e.g. MTG-EXCOM-2026-08
  title: string;
  meetingType: 'Executive Committee' | 'Board of Directors' | 'Department Operational' | 'Client Review' | 'Ad-hoc Taskforce';
  organizerName: string;
  locationOrRoom: string;
  isVirtual: boolean;
  meetingLink?: string;
  meetingDate: string;
  startTime: string;
  endTime: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  participants: MeetingParticipant[];
  agenda: AgendaItem[];
  minutesOfMeeting?: string;
  decisions: string[];
  actionItems: MeetingActionItem[];
  attachments: CorrespondenceAttachment[];
}

// ==========================================
// 03.07 Travel & Transportation Types
// ==========================================

export interface TravelRequestRecord {
  id: string;
  travelNumber: string; // e.g. TRV-2026-0089
  travelerName: string;
  employeeCode: string;
  department: string;
  travelPurpose: 'Client Executive Negotiation' | 'Project Site Inspection' | 'Industry Conference' | 'Branch Audit' | 'Technical Training';
  destinationCity: string;
  destinationCountry: string;
  departureDate: string;
  returnDate: string;
  travelClass: 'Economy' | 'Business Class';
  hotelRequired: boolean;
  hotelPreference?: string;
  visaAssistanceNeeded: boolean;
  estimatedFlightCostOMR: number;
  estimatedHotelCostOMR: number;
  perDiemAllowanceOMR: number;
  totalEstimatedCostOMR: number;
  status: WorkflowStatus;
  currentApprovalLevel?: number;
  totalApprovalLevels?: number;
  approvers?: {
    level: number;
    role: string;
    approverName: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Waiting' | 'Skipped';
    decisionDate?: string;
    comments?: string;
  }[];
  approvedBy?: string;
  bookingRef?: string;
  justification: string;
  createdAt: string;
}

export interface VehicleBookingRecord {
  id: string;
  bookingNumber: string; // e.g. VEH-BK-2026-015
  requestedBy: string;
  department: string;
  purpose: string;
  vehicleAssigned?: string;
  plateNumber?: string;
  assignedDriver?: string;
  pickupLocation: string;
  dropoffLocation: string;
  tripStartDate: string;
  tripStartTime: string;
  tripEndDate: string;
  tripEndTime: string;
  passengerCount: number;
  requiresChauffeur: boolean;
  status: WorkflowStatus;
  startOdometerKm?: number;
  endOdometerKm?: number;
  fuelExpenseOMR?: number;
  createdAt: string;
}

export interface FleetVehicleRecord {
  id: string;
  vehicleCode: string;
  plateNumber: string;
  makeModel: string;
  vehicleType: 'Sedan' | '4x4 SUV' | 'Passenger Van' | 'Light Utility Truck';
  assignedBranch: string;
  currentStatus: 'Available' | 'On Mission' | 'Scheduled Maintenance' | 'Reserved';
  currentOdometerKm: number;
  lastServiceDate: string;
  nextServiceDueKm: number;
  fuelCardNumber: string;
  defaultDriver?: string;
}

// ==========================================
// 03.08 General Business Services Types
// ==========================================

export interface GeneralServiceRequest {
  id: string;
  serviceRequestNumber: string; // e.g. GSR-2026-041
  serviceCategory: 'Office Interior & Relocation' | 'Pest Control & Sanitization' | 'Event Space & AV Staging' | 'Document Shredding & Disposal' | 'Executive Transportation Special';
  title: string;
  requestedBy: string;
  department: string;
  location: string;
  scheduledDate: string;
  scopeOfWork: string;
  vendorAssigned?: string;
  estimatedBudgetOMR: number;
  actualCostOMR?: number;
  status: WorkflowStatus;
  currentApprovalLevel?: number;
  totalApprovalLevels?: number;
  approvers?: {
    level: number;
    role: string;
    approverName: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Waiting' | 'Skipped';
    decisionDate?: string;
    comments?: string;
  }[];
  completionSignOffBy?: string;
  createdAt: string;
}

export interface ServiceVendorRecord {
  id: string;
  vendorCode: string; // e.g. VEND-ADM-01
  vendorName: string;
  serviceCategory: 'Facility Management' | 'Office Security' | 'Catering & Hospitality' | 'Commercial Printing' | 'Courier & Logistics' | 'Waste Management';
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  contractStartDate: string;
  contractEndDate: string;
  annualValueOMR: number;
  serviceRating: number; // 1 to 5 stars
  slaCompliancePercent: number; // e.g. 98%
  status: 'Active' | 'Under Review' | 'Expired' | 'Terminated';
}

export interface OfficeAssetRecord {
  id: string;
  assetTag: string; // e.g. AST-OFF-0941
  itemName: string;
  category: 'Office Furniture' | 'Meeting Room AV' | 'Pantry Appliance' | 'Security Equipment' | 'Office Machine';
  locationRoom: string;
  branch: string;
  custodianEmployee: string;
  purchaseDate: string;
  purchaseValueOMR: number;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Requires Repair';
  serialNumber?: string;
  status: 'In Service' | 'In Storage' | 'Under Repair' | 'Disposed';
}

export interface AdminAnalyticsSummary {
  totalOpenRequests: number;
  pendingApprovalsCount: number;
  activeDocumentsCount: number;
  archivedDocumentsCount: number;
  totalIncomingMailThisMonth: number;
  overdueTasksCount: number;
  upcomingMeetingsCount: number;
  activeVehiclesInPool: number;
  totalMonthlyStationerySpendOMR: number;
  totalMonthlyTravelBudgetOMR: number;
  avgRequestResolutionDays: number;
}
