import {
  OfficeNotice,
  OfficeServiceOrder,
  StationeryItem,
  StationeryRequest,
  FacilityWorkOrder,
  CorrespondenceRecord,
  DocumentRecord,
  InternalRequestRecord,
  EnterpriseTask,
  MeetingRecord,
  TravelRequestRecord,
  VehicleBookingRecord,
  FleetVehicleRecord,
  GeneralServiceRequest,
  ServiceVendorRecord,
  OfficeAssetRecord
} from '../types';

export const MOCK_NOTICES: OfficeNotice[] = [
  {
    id: 'not-01',
    noticeNumber: 'NOT-2026-081',
    title: 'Muscat HQ Annual Energy Conservation & Smart HVAC Scheduling',
    category: 'Policy',
    content: 'All departmental heads are requested to ensure auxiliary meeting room lighting and decentralized climate controllers are set to Eco-Mode (24°C) after 18:00 GST in alignment with Oman Vision 2040 corporate sustainability standards.',
    targetAudience: 'Muscat HQ',
    publishedDate: '2026-08-18',
    expiryDate: '2026-09-30',
    publishedBy: 'Eng. Khalid Al-Amri (Chief Administration Officer)',
    priority: 'Important',
    isPinned: true,
    status: 'Active'
  },
  {
    id: 'not-02',
    noticeNumber: 'NOT-2026-082',
    title: 'National Day Holiday Office Operations & On-Call Emergency Logistics',
    category: 'General',
    content: 'Corporate offices across Muscat, Sohar, and Salalah will operate on modified emergency standby rosters during the upcoming national holiday week. Emergency security access protocols remain active 24/7.',
    targetAudience: 'All Employees',
    publishedDate: '2026-08-15',
    expiryDate: '2026-08-31',
    publishedBy: 'Fatima Al-Balushi (Head of Corporate Services)',
    priority: 'Normal',
    isPinned: true,
    status: 'Active'
  },
  {
    id: 'not-03',
    noticeNumber: 'NOT-2026-083',
    title: 'Biometric Access Sensor Upgrade at Sohar EPC Plant Gate 4',
    category: 'Security',
    content: 'Contractor and staff RFID badge readers at Gate 4 will undergo firmware upgrades this Thursday from 22:00 to 02:00 GST. All staff should use Gate 1 during this maintenance window.',
    targetAudience: 'Sohar Facility',
    publishedDate: '2026-08-19',
    expiryDate: '2026-08-25',
    publishedBy: 'Ahmed Al-Harthy (Facility Security Lead)',
    priority: 'Critical',
    isPinned: false,
    status: 'Active'
  }
];

export const MOCK_OFFICE_SERVICES: OfficeServiceOrder[] = [
  {
    id: 'srv-01',
    orderNumber: 'SRV-2026-091',
    serviceType: 'Visitor Security Pass',
    title: 'Ministry of Energy Delegation Access Badges (5 VIP Delegates)',
    requestedBy: 'Tariq Al-Farsi',
    department: 'Government Relations',
    location: 'Muscat HQ — 8th Floor Boardroom',
    scheduledDate: '2026-08-22',
    details: 'Requires 5 VIP biometric parking badges and executive security escort for Dr. Salim and accompanying dignitaries.',
    guestCount: 5,
    assignedVendor: 'Al-Madina Security Services LLC',
    status: 'Approved',
    createdAt: '2026-08-18'
  },
  {
    id: 'srv-02',
    orderNumber: 'SRV-2026-092',
    serviceType: 'Catering & Hospitality',
    title: 'Q3 Board of Directors Luncheon & High-Tea Setup',
    requestedBy: 'Maryam Al-Kindi',
    department: 'Executive Secretariat',
    location: 'Executive Lounge — East Wing',
    scheduledDate: '2026-08-25',
    details: 'Traditional Omani buffet catering, coffee baristas, and diet-specific hors d’oeuvres for 18 board members.',
    guestCount: 18,
    assignedVendor: 'Bustan Royal Catering Services',
    status: 'In Progress',
    createdAt: '2026-08-17'
  },
  {
    id: 'srv-03',
    orderNumber: 'SRV-2026-093',
    serviceType: 'Janitorial & Cleaning',
    title: 'Deep Carpet Shampoo & Window Washing — 4th Floor Finance Wing',
    requestedBy: 'Nasser Al-Rawahi',
    department: 'Finance & Accounts',
    location: 'Muscat HQ — Level 4',
    scheduledDate: '2026-08-23',
    details: 'Weekend deep sanitization and extraction cleaning covering 850 sq meters.',
    assignedVendor: 'Oman Clean Facilities Co.',
    status: 'Approved',
    createdAt: '2026-08-19'
  }
];

export const MOCK_STATIONERY_ITEMS: StationeryItem[] = [
  { id: 'st-01', itemCode: 'STA-PAP-01', itemName: 'A4 Premium Copy Paper 80GSM (Box of 5 Reams)', category: 'Paper & Notebooks', unitOfMeasure: 'Box', availableStock: 140, reorderLevel: 30, unitCostOMR: 12.500, storageLocation: 'HQ Central Supply A-01' },
  { id: 'st-02', itemCode: 'STA-PAP-02', itemName: 'Executive Hardbound Ruled Notebooks A5', category: 'Paper & Notebooks', unitOfMeasure: 'Piece', availableStock: 85, reorderLevel: 25, unitCostOMR: 3.200, storageLocation: 'HQ Central Supply A-04' },
  { id: 'st-03', itemCode: 'STA-PEN-01', itemName: 'Uni-ball Eye Fine Rollerball Pen 0.7mm (Pack of 12)', category: 'Writing Instruments', unitOfMeasure: 'Pack', availableStock: 60, reorderLevel: 20, unitCostOMR: 5.400, storageLocation: 'HQ Central Supply B-02' },
  { id: 'st-04', itemCode: 'STA-TON-01', itemName: 'HP LaserJet High-Yield Toner Black (CF289X)', category: 'Printer Toners & Cartridges', unitOfMeasure: 'Piece', availableStock: 14, reorderLevel: 8, unitCostOMR: 48.000, storageLocation: 'HQ IT Vault C-01' },
  { id: 'st-05', itemCode: 'STA-FIL-01', itemName: 'Lever Arch Box Files Heavy Duty 75mm (Pack of 10)', category: 'Filing & Folders', unitOfMeasure: 'Pack', availableStock: 45, reorderLevel: 15, unitCostOMR: 9.800, storageLocation: 'HQ Central Supply D-02' }
];

export const MOCK_STATIONERY_REQUESTS: StationeryRequest[] = [
  {
    id: 'str-01',
    requestNumber: 'REQ-STA-2026-044',
    requesterName: 'Aisha Al-Hashmi',
    department: 'Legal & Corporate Affairs',
    requestDate: '2026-08-19',
    items: [
      { itemId: 'st-01', itemCode: 'STA-PAP-01', itemName: 'A4 Premium Copy Paper 80GSM (Box of 5 Reams)', quantityRequested: 4, quantityIssued: 4, unitCostOMR: 12.500 },
      { itemId: 'st-05', itemCode: 'STA-FIL-01', itemName: 'Lever Arch Box Files Heavy Duty 75mm (Pack of 10)', quantityRequested: 2, quantityIssued: 2, unitCostOMR: 9.800 }
    ],
    totalCostOMR: 69.600,
    purpose: 'Archival compilation for upcoming external regulatory audit.',
    status: 'Completed',
    approvedBy: 'Khalid Al-Amri',
    issuedBy: 'Hamood Al-Hajri',
    issuedAt: '2026-08-20'
  },
  {
    id: 'str-02',
    requestNumber: 'REQ-STA-2026-045',
    requesterName: 'Zahir Al-Suleimani',
    department: 'Project Engineering',
    requestDate: '2026-08-20',
    items: [
      { itemId: 'st-02', itemCode: 'STA-PAP-02', itemName: 'Executive Hardbound Ruled Notebooks A5', quantityRequested: 10, quantityIssued: 0, unitCostOMR: 3.200 },
      { itemId: 'st-03', itemCode: 'STA-PEN-01', itemName: 'Uni-ball Eye Fine Rollerball Pen 0.7mm (Pack of 12)', quantityRequested: 3, quantityIssued: 0, unitCostOMR: 5.400 }
    ],
    totalCostOMR: 48.200,
    purpose: 'New onboarding field engineering team stationery packs.',
    status: 'Pending Approval'
  }
];

export const MOCK_FACILITY_WORK_ORDERS: FacilityWorkOrder[] = [
  {
    id: 'fac-01',
    workOrderNumber: 'FAC-WO-2026-033',
    title: 'HVAC Temperature Sensor Calibration in Data Center 2',
    category: 'HVAC & Climate',
    facilityLocation: 'Muscat HQ — Basement B1 Server Room',
    requestedBy: 'Saeed Al-Ghafri (IT Infrastructure)',
    department: 'Information Technology',
    priority: 'Urgent',
    description: 'Chilled water airflow sensor reading 3°C deviation from standard tolerance; requires recalibration by Daikin technician.',
    assignedTechnician: 'Rashid Al-Mashani',
    assignedVendor: 'Daikin Middle East Service Center',
    estimatedCostOMR: 120.000,
    actualCostOMR: 110.000,
    targetCompletionDate: '2026-08-21',
    status: 'In Progress',
    createdAt: '2026-08-19',
    updatedAt: '2026-08-20'
  },
  {
    id: 'fac-02',
    workOrderNumber: 'FAC-WO-2026-034',
    title: 'Executive Conference Room Projector Ceiling Mount Replacement',
    category: 'Electrical',
    facilityLocation: 'Muscat HQ — Level 7 Boardroom A',
    requestedBy: 'Maryam Al-Kindi',
    department: 'Administration',
    priority: 'High',
    description: 'Motorized ceiling drop-down projector mount motor stalled; replace actuator switch prior to upcoming board session.',
    assignedTechnician: 'Salim Al-Busaidi',
    estimatedCostOMR: 75.000,
    targetCompletionDate: '2026-08-22',
    status: 'Approved',
    createdAt: '2026-08-18',
    updatedAt: '2026-08-18'
  },
  {
    id: 'fac-03',
    workOrderNumber: 'FAC-WO-2026-035',
    title: 'Plumbing Valve Overhaul in Level 3 Cafeteria Pantry',
    category: 'Plumbing',
    facilityLocation: 'Muscat HQ — Level 3 Pantry',
    requestedBy: 'Fatima Al-Balushi',
    department: 'Corporate Services',
    priority: 'Medium',
    description: 'Slow leak under central dishwashing unit; replace pressure gate valve.',
    assignedTechnician: 'Mubarak Al-Hassani',
    actualCostOMR: 45.000,
    targetCompletionDate: '2026-08-17',
    status: 'Completed',
    resolutionNotes: 'Replaced brass gate valve and flex pipe connector; pressure tested successfully.',
    createdAt: '2026-08-16',
    updatedAt: '2026-08-17'
  }
];

export const MOCK_CORRESPONDENCE: CorrespondenceRecord[] = [
  {
    id: 'cor-01',
    referenceNumber: 'COR-IN-2026-0088',
    externalReference: 'MOCIIP/IND/2026/8944',
    type: 'incoming',
    subject: 'Ministry Decree on Local Content (ICV) Target Allocation for Fiscal 2026-2027',
    senderEntity: 'Ministry of Commerce, Industry and Investment Promotion (MOCIIP)',
    senderContactPerson: 'Directorate of Industrial Development',
    recipientEntity: 'Artify Future Generation Holding Group SAOC',
    recipientDepartment: 'Legal & Executive Management',
    dateReceivedOrSent: '2026-08-17',
    dueDateForResponse: '2026-09-05',
    confidentialityLevel: 'Confidential',
    priority: 'High',
    category: 'Government Decree',
    summary: 'Official notification outlining updated ICV manufacturing criteria, in-country supply procurement minimums (42%), and semi-annual compliance reporting timelines.',
    fullBody: 'Dear Executive Committee, Pursuant to Ministerial Decision No. 142/2026, all Tier-1 industrial operating entities are directed to submit audited ICV compliance scorecards...',
    assignedOwner: 'Eng. Khalid Al-Amri',
    attachments: [
      { id: 'att-01', fileName: 'MOCIIP_Decree_142_2026_Official.pdf', fileSize: '2.4 MB', fileType: 'PDF', uploadedAt: '2026-08-17 09:30' }
    ],
    tags: ['MOCIIP', 'ICV', 'Regulatory', 'Legal', 'Executive'],
    requiresResponse: true,
    responseStatus: 'Pending Response',
    status: 'Assigned',
    timeline: [
      { id: 'tl-01', timestamp: '2026-08-17 09:15', action: 'Registered at Digital Mailroom', actor: 'Hamood Al-Hajri (Mail Clerk)' },
      { id: 'tl-02', timestamp: '2026-08-17 11:30', action: 'AI Auto-Classified as High-Priority Government Decree', actor: 'ERP AI Mail Classifier' },
      { id: 'tl-03', timestamp: '2026-08-17 14:00', action: 'Assigned to Legal & CAO Khalid Al-Amri', actor: 'Fatima Al-Balushi' }
    ]
  },
  {
    id: 'cor-02',
    referenceNumber: 'COR-OUT-2026-0041',
    type: 'outgoing',
    subject: 'Transmittal of EPC Milestone 3 Completion Certificate — Sohar Solar Station',
    senderEntity: 'Artify Group / Energy Engineering Division',
    recipientEntity: 'Petroleum Development Oman (PDO) — Contracts Directorate',
    recipientDepartment: 'Contracts & Procurement',
    dateReceivedOrSent: '2026-08-18',
    confidentialityLevel: 'Internal',
    priority: 'High',
    category: 'Commercial Contract',
    summary: 'Formal submission of third-party quality testing reports and civil handover package for the 45MW Sohar Solar Project.',
    assignedOwner: 'Tariq Al-Farsi',
    attachments: [
      { id: 'att-02', fileName: 'Artify_PDO_Solar_Milestone3_Transmittal.pdf', fileSize: '8.1 MB', fileType: 'PDF', uploadedAt: '2026-08-18 14:20' }
    ],
    tags: ['PDO', 'Solar', 'EPC', 'Handover', 'Commercial'],
    requiresResponse: true,
    responseStatus: 'Pending Response',
    status: 'Registered',
    timeline: [
      { id: 'tl-04', timestamp: '2026-08-18 10:00', action: 'Drafted by Project Director', actor: 'Tariq Al-Farsi' },
      { id: 'tl-05', timestamp: '2026-08-18 13:45', action: 'Executive Sign-off and Digital Seal Applied', actor: 'Eng. Khalid Al-Amri' },
      { id: 'tl-06', timestamp: '2026-08-18 14:30', action: 'Dispatched via Registered Courier & Secure Portal', actor: 'Mailroom Operations' }
    ]
  },
  {
    id: 'cor-03',
    referenceNumber: 'COR-INT-2026-0019',
    type: 'internal',
    subject: 'Executive Circular No. 08/2026: Implementation of Q3 Internal Audit Recommendations',
    senderEntity: 'Office of the Chief Executive Officer',
    recipientEntity: 'All Business Unit Heads & Departmental Directors',
    recipientDepartment: 'All Departments',
    dateReceivedOrSent: '2026-08-14',
    confidentialityLevel: 'Internal',
    priority: 'Medium',
    category: 'Internal Memo',
    summary: 'Mandatory guidelines for closing outstanding operational control items identified during the ISO 9001 and IFRS 16 compliance audits.',
    assignedOwner: 'Office of the CEO',
    attachments: [
      { id: 'att-03', fileName: 'CEO_Circular_08_2026.pdf', fileSize: '1.2 MB', fileType: 'PDF', uploadedAt: '2026-08-14 08:00' }
    ],
    tags: ['Audit', 'Compliance', 'CEO Office', 'Internal Circular'],
    requiresResponse: false,
    responseStatus: 'Not Required',
    status: 'Closed',
    timeline: [
      { id: 'tl-07', timestamp: '2026-08-14 08:00', action: 'Published and Broadcast to 34 Department Heads', actor: 'CEO Executive Assistant' }
    ]
  }
];

export const MOCK_DOCUMENTS: DocumentRecord[] = [
  {
    id: 'doc-01',
    documentNumber: 'DOC-POL-2026-001',
    title: 'Group Corporate Governance & Board Delegation of Authority (DoA) Manual',
    category: 'Policy & SOP',
    ownerName: 'Legal & Governance Directorate',
    department: 'Legal & Corporate Affairs',
    classification: 'Confidential',
    currentVersion: 'v3.2',
    fileType: 'PDF',
    fileSize: '4.8 MB',
    registrationDate: '2026-01-15',
    lastModifiedDate: '2026-07-20',
    tags: ['Governance', 'DoA', 'Board', 'Legal', 'Policy'],
    description: 'Defines financial sign-off thresholds, commercial commitment caps, banking mandates, and legal signing authority across all holding subsidiaries.',
    versions: [
      { version: 'v3.2', fileSize: '4.8 MB', uploadedBy: 'Aisha Al-Hashmi', uploadedAt: '2026-07-20', changeSummary: 'Updated procurement approval limits to OMR 500k for CAO.' },
      { version: 'v3.1', fileSize: '4.6 MB', uploadedBy: 'Aisha Al-Hashmi', uploadedAt: '2026-03-10', changeSummary: 'Added Treasury automated electronic transfer rules.' },
      { version: 'v3.0', fileSize: '4.5 MB', uploadedBy: 'Legal Team', uploadedAt: '2026-01-15', changeSummary: 'Comprehensive annual revision approved by the Board.' }
    ],
    isCheckedOut: false,
    isArchived: false,
    retentionYears: 99,
    retentionExpiryDate: '2125-01-01',
    legalHold: false,
    watermarkEnabled: true,
    accessCount: 384
  },
  {
    id: 'doc-02',
    documentNumber: 'DOC-SOP-2026-042',
    title: 'Standard Operating Procedure: Enterprise Fleet Operations & Defensive Driving Protocol',
    category: 'Policy & SOP',
    ownerName: 'Transport Logistics Lead',
    department: 'Office Administration',
    classification: 'Internal Use',
    currentVersion: 'v1.4',
    fileType: 'DOCX',
    fileSize: '1.9 MB',
    registrationDate: '2026-02-10',
    lastModifiedDate: '2026-06-15',
    tags: ['Logistics', 'Fleet', 'Safety', 'HSE', 'Transport'],
    description: 'Guidelines on vehicle checkout, IVMS telemetry logging, journey management plans (JMP), and fuel card management.',
    versions: [
      { version: 'v1.4', fileSize: '1.9 MB', uploadedBy: 'Rashid Al-Mashani', uploadedAt: '2026-06-15', changeSummary: 'Added PDO site journey management compliance criteria.' },
      { version: 'v1.0', fileSize: '1.5 MB', uploadedBy: 'Rashid Al-Mashani', uploadedAt: '2026-02-10', changeSummary: 'Initial policy baseline.' }
    ],
    isCheckedOut: true,
    checkedOutBy: 'Rashid Al-Mashani (Updating fuel consumption thresholds)',
    checkedOutAt: '2026-08-19 11:20',
    isArchived: false,
    retentionYears: 10,
    retentionExpiryDate: '2036-02-10',
    legalHold: false,
    watermarkEnabled: false,
    accessCount: 192
  },
  {
    id: 'doc-03',
    documentNumber: 'DOC-ARC-2021-009',
    title: 'Historical Land Lease Deed & Title Deeds — Sohar Industrial Port Zone (Phase 1)',
    category: 'Commercial Agreement',
    ownerName: 'Real Estate & Land Assets',
    department: 'Executive Management',
    classification: 'Restricted',
    currentVersion: 'v1.0',
    fileType: 'SCAN',
    fileSize: '18.4 MB',
    registrationDate: '2021-05-12',
    lastModifiedDate: '2021-05-12',
    tags: ['Sohar', 'Real Estate', 'Title Deed', 'Archive', 'Permanent'],
    description: 'Notarized Ministry of Housing and Urban Planning usufruct lease agreement for 120,000 sqm industrial plot in Sohar.',
    versions: [
      { version: 'v1.0', fileSize: '18.4 MB', uploadedBy: 'Archival Vault Officer', uploadedAt: '2021-05-12', changeSummary: 'Original scanned deed archived in immutable cold storage.' }
    ],
    isCheckedOut: false,
    isArchived: true,
    archiveDate: '2021-05-12',
    retentionYears: 99,
    retentionExpiryDate: '2120-05-12',
    legalHold: true,
    watermarkEnabled: true,
    accessCount: 42
  }
];

export const MOCK_INTERNAL_REQUESTS: InternalRequestRecord[] = [
  {
    id: 'req-01',
    ticketNumber: 'REQ-EMP-2026-0128',
    requestType: 'Employee',
    category: 'Salary Certificate',
    title: 'Salary Transfer Certificate addressed to Bank Muscat (Housing Loan Application)',
    requestedBy: 'Salem Al-Hinai',
    employeeId: 'EMP-9042',
    department: 'Operations',
    branch: 'Muscat HQ',
    requestDate: '2026-08-18',
    requiredByDate: '2026-08-22',
    priority: 'Medium',
    justification: 'Required by Bank Muscat for final residential mortgage disbursement.',
    status: 'Pending Approval',
    currentApprovalLevel: 1,
    totalApprovalLevels: 2,
    approvers: [
      { level: 1, role: 'HR Operations Manager', approverName: 'Huda Al-Riyami', status: 'Pending' },
      { level: 2, role: 'Head of Administration', approverName: 'Eng. Khalid Al-Amri', status: 'Pending' }
    ]
  },
  {
    id: 'req-02',
    ticketNumber: 'REQ-DEP-2026-0094',
    requestType: 'Department',
    category: 'Event Support & AV Setup',
    title: 'Annual Sustainability Forum Townhall Staging & AV Recording Rig',
    requestedBy: 'Nadia Al-Majrafi',
    department: 'Corporate Communications',
    branch: 'Muscat HQ',
    requestDate: '2026-08-16',
    requiredByDate: '2026-08-26',
    priority: 'High',
    justification: 'Live webcast and multi-camera recording setup in the Grand Auditorium for 150 live attendees.',
    status: 'Approved',
    currentApprovalLevel: 2,
    totalApprovalLevels: 2,
    approvers: [
      { level: 1, role: 'Facilities Manager', approverName: 'Salim Al-Busaidi', status: 'Approved', decisionDate: '2026-08-17 10:00', comments: 'Auditorium reserved; contractor scheduled.' },
      { level: 2, role: 'Chief Administration Officer', approverName: 'Eng. Khalid Al-Amri', status: 'Approved', decisionDate: '2026-08-17 15:30', comments: 'Approved within Q3 events budget.' }
    ]
  },
  {
    id: 'req-03',
    ticketNumber: 'REQ-ADM-2026-0052',
    requestType: 'Administrative',
    category: 'Corporate Courier Dispatch',
    title: 'Urgent Tender Bid Bond & Original Document Courier to PDO Mina Al-Fahal',
    requestedBy: 'Yousuf Al-Mamari',
    department: 'Tenders & Estimations',
    branch: 'Muscat HQ',
    requestDate: '2026-08-19',
    requiredByDate: '2026-08-20',
    priority: 'Urgent',
    justification: 'Hardcopy bank guarantee and sealed bids submission deadline: 14:00 GST.',
    status: 'Completed',
    currentApprovalLevel: 1,
    totalApprovalLevels: 1,
    approvers: [
      { level: 1, role: 'Mailroom Supervisor', approverName: 'Hamood Al-Hajri', status: 'Approved', decisionDate: '2026-08-19 11:00', comments: 'Special courier dispatched; POD #OM-8942 received.' }
    ],
    resolutionNotes: 'Delivered and stamped by PDO Tender Board officer at 12:45 GST.'
  }
];

export const MOCK_TASKS: EnterpriseTask[] = [
  {
    id: 'tsk-01',
    taskNumber: 'TSK-2026-0312',
    title: 'Finalize Q3 Office Ergonomics and Workstation Assessment Audit',
    description: 'Inspect 120 workstations across floors 3 to 6 for compliance with occupational health and safety standards; compile replacement requisitions.',
    department: 'Office Administration',
    assigneeName: 'Salim Al-Busaidi',
    reporterName: 'Eng. Khalid Al-Amri',
    priority: 'Medium',
    status: 'In Progress',
    progressPercent: 65,
    estimatedHours: 24,
    loggedHours: 16,
    startDate: '2026-08-15',
    dueDate: '2026-08-24',
    tags: ['HSE', 'Ergonomics', 'Facility', 'Audit'],
    checklist: [
      { id: 'chk-1', item: 'Level 3 Finance & Accounts completed', isDone: true },
      { id: 'chk-2', item: 'Level 4 Operations & Supply completed', isDone: true },
      { id: 'chk-3', item: 'Level 5 Engineering completed', isDone: false },
      { id: 'chk-4', item: 'Level 6 Executive Suites inspection', isDone: false }
    ],
    activityLogs: [
      { id: 'act-1', timestamp: '2026-08-15 08:30', userName: 'Salim Al-Busaidi', action: 'Task started; checklist created.' },
      { id: 'act-2', timestamp: '2026-08-18 16:00', userName: 'Salim Al-Busaidi', action: 'Updated progress to 65% after completing Level 4.' }
    ]
  },
  {
    id: 'tsk-02',
    taskNumber: 'TSK-2026-0313',
    title: 'Renew Corporate Vehicle Insurance & ROP Passing for Salalah Fleet',
    description: 'Coordinate with Oman Qatar Insurance Co. (OQIC) and Royal Oman Police (ROP) vehicle testing center in Salalah for 6 pool vehicles.',
    department: 'Logistics & Transport',
    assigneeName: 'Mubarak Al-Hassani',
    reporterName: 'Fatima Al-Balushi',
    priority: 'High',
    status: 'In Review',
    progressPercent: 90,
    estimatedHours: 16,
    loggedHours: 14,
    startDate: '2026-08-12',
    dueDate: '2026-08-22',
    tags: ['Fleet', 'Insurance', 'ROP', 'Compliance'],
    checklist: [
      { id: 'chk-5', item: 'Fleet inspection reports collected', isDone: true },
      { id: 'chk-6', item: 'OQIC premium quotes approved', isDone: true },
      { id: 'chk-7', item: 'ROP mulkiya registration cards printed', isDone: false }
    ],
    activityLogs: [
      { id: 'act-3', timestamp: '2026-08-19 14:00', userName: 'Mubarak Al-Hassani', action: 'Submitted mulkiya renewal package to ROP digital portal.' }
    ]
  },
  {
    id: 'tsk-03',
    taskNumber: 'TSK-2026-0314',
    title: 'Implement MoM Action: Prepare Executive Sub-Committee Terms of Reference',
    description: 'Arising from ExCom Meeting #08: Draft formal charter for the new Energy Transition Strategy Taskforce.',
    department: 'Legal & Corporate Affairs',
    assigneeName: 'Aisha Al-Hashmi',
    reporterName: 'Office of the CEO',
    priority: 'High',
    status: 'Todo',
    progressPercent: 0,
    estimatedHours: 12,
    loggedHours: 0,
    startDate: '2026-08-20',
    dueDate: '2026-08-27',
    relatedModule: 'Meeting Management',
    relatedRecordId: 'mtg-01',
    relatedRecordTitle: 'Executive Committee Meeting #08/2026',
    tags: ['Board', 'ExCom', 'Charter', 'Governance'],
    checklist: [
      { id: 'chk-8', item: 'Review GCC peer benchmarks', isDone: false },
      { id: 'chk-9', item: 'Draft membership composition', isDone: false },
      { id: 'chk-10', item: 'Legal review and submit to CEO', isDone: false }
    ],
    activityLogs: [
      { id: 'act-4', timestamp: '2026-08-20 09:00', userName: 'System', action: 'Task auto-generated from Meeting MoM #08 Action Item #1.' }
    ]
  }
];

export const MOCK_MEETINGS: MeetingRecord[] = [
  {
    id: 'mtg-01',
    meetingNumber: 'MTG-EXCOM-2026-08',
    title: 'Executive Committee (ExCom) Q3 Performance & Growth Strategy Review',
    meetingType: 'Executive Committee',
    organizerName: 'Maryam Al-Kindi (Executive Assistant to CAO)',
    locationOrRoom: 'Muscat HQ — Level 8 Executive Boardroom',
    isVirtual: false,
    meetingDate: '2026-08-19',
    startTime: '10:00 AM',
    endTime: '12:30 PM',
    status: 'Completed',
    participants: [
      { id: 'p-1', name: 'Eng. Khalid Al-Amri', email: 'khalid.alamri@artify-group.com', roleOrDesignation: 'Chief Administration Officer', isExternal: false, attendanceStatus: 'Attended' },
      { id: 'p-2', name: 'Nasser Al-Rawahi', email: 'nasser.rawahi@artify-group.com', roleOrDesignation: 'Chief Financial Officer', isExternal: false, attendanceStatus: 'Attended' },
      { id: 'p-3', name: 'Tariq Al-Farsi', email: 'tariq.farsi@artify-group.com', roleOrDesignation: 'VP Engineering & EPC', isExternal: false, attendanceStatus: 'Attended' },
      { id: 'p-4', name: 'Dr. Salim Al-Maskari', email: 'salim.maskari@advisory-partners.om', roleOrDesignation: 'Senior Strategy Advisor', isExternal: true, organization: 'Gulf Advisory Partners', attendanceStatus: 'Attended' }
    ],
    agenda: [
      { id: 'ag-1', orderNumber: 1, title: 'Review & Adoption of Previous ExCom Minutes', allocatedMinutes: 15, presenterName: 'Eng. Khalid Al-Amri' },
      { id: 'ag-2', orderNumber: 2, title: 'Q3 Financial & Operational Cashflow Milestone Audit', allocatedMinutes: 45, presenterName: 'Nasser Al-Rawahi' },
      { id: 'ag-3', orderNumber: 3, title: 'Sohar EPC Solar Handover & Local Content Compliance', allocatedMinutes: 45, presenterName: 'Tariq Al-Farsi' },
      { id: 'ag-4', orderNumber: 4, title: 'General Administration: Facilities & Energy Reduction Update', allocatedMinutes: 20, presenterName: 'Maryam Al-Kindi' }
    ],
    minutesOfMeeting: 'The Executive Committee met at 10:00 GST. Financial reviews indicated strong performance with EBITDA margins holding at 26.4%. The Committee approved the creation of the Energy Transition Taskforce and mandated CAO Khalid Al-Amri to oversee the energy reduction schedule across Muscat and Sohar locations.',
    decisions: [
      'Approved Q3 Capital Expenditure budget allocation of OMR 420,000 for Sohar Solar Inverter array.',
      'Adopted mandatory Eco-Mode climate policy across all corporate office properties starting September 1st.'
    ],
    actionItems: [
      { id: 'act-item-1', actionDescription: 'Prepare Energy Transition Strategy Taskforce formal charter and terms of reference.', responsiblePerson: 'Aisha Al-Hashmi', dueDate: '2026-08-27', priority: 'High', status: 'Transferred to Task', linkedTaskId: 'tsk-03' },
      { id: 'act-item-2', actionDescription: 'Audit all corporate vendor contracts expiring in Q4 2026 and initiate RFP tenders.', responsiblePerson: 'Fatima Al-Balushi', dueDate: '2026-08-30', priority: 'Medium', status: 'Open' }
    ],
    attachments: [
      { id: 'att-m1', fileName: 'ExCom_08_Meeting_Presentation.pdf', fileSize: '5.2 MB', fileType: 'PDF', uploadedAt: '2026-08-19 09:45' }
    ]
  },
  {
    id: 'mtg-02',
    meetingNumber: 'MTG-OPS-2026-34',
    title: 'Weekly Cross-Functional Office Administration & Facilities Alignment',
    meetingType: 'Department Operational',
    organizerName: 'Salim Al-Busaidi',
    locationOrRoom: 'Meeting Room B2 / Microsoft Teams Hybrid',
    isVirtual: true,
    meetingLink: 'https://teams.microsoft.com/l/meetup-join/artify-ops-weekly',
    meetingDate: '2026-08-24',
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    status: 'Scheduled',
    participants: [
      { id: 'p-5', name: 'Salim Al-Busaidi', email: 'salim.busaidi@artify-group.com', roleOrDesignation: 'Facilities Lead', isExternal: false, attendanceStatus: 'Accepted' },
      { id: 'p-6', name: 'Hamood Al-Hajri', email: 'hamood.hajri@artify-group.com', roleOrDesignation: 'Mail & Stationery Supervisor', isExternal: false, attendanceStatus: 'Accepted' },
      { id: 'p-7', name: 'Mubarak Al-Hassani', email: 'mubarak.hassani@artify-group.com', roleOrDesignation: 'Fleet Coordinator', isExternal: false, attendanceStatus: 'Accepted' }
    ],
    agenda: [
      { id: 'ag-5', orderNumber: 1, title: 'Weekly Open Facility Work Orders Review', allocatedMinutes: 20, presenterName: 'Salim Al-Busaidi' },
      { id: 'ag-6', orderNumber: 2, title: 'Digital Mailroom & VIP Courier Dispatches', allocatedMinutes: 20, presenterName: 'Hamood Al-Hajri' },
      { id: 'ag-7', orderNumber: 3, title: 'Fleet Pool Vehicle Availability for Upcoming Audits', allocatedMinutes: 20, presenterName: 'Mubarak Al-Hassani' }
    ],
    decisions: [],
    actionItems: [],
    attachments: []
  }
];

export const MOCK_TRAVEL_REQUESTS: TravelRequestRecord[] = [
  {
    id: 'trv-01',
    travelNumber: 'TRV-2026-0089',
    travelerName: 'Tariq Al-Farsi',
    employeeCode: 'EMP-1024',
    department: 'Engineering & Projects',
    travelPurpose: 'Client Executive Negotiation',
    destinationCity: 'Doha',
    destinationCountry: 'Qatar',
    departureDate: '2026-08-28',
    returnDate: '2026-08-31',
    travelClass: 'Business Class',
    hotelRequired: true,
    hotelPreference: 'Sheraton Grand Doha Resort (Close to QatarEnergy HQ)',
    visaAssistanceNeeded: false,
    estimatedFlightCostOMR: 280.000,
    estimatedHotelCostOMR: 360.000,
    perDiemAllowanceOMR: 150.000,
    totalEstimatedCostOMR: 790.000,
    status: 'Approved',
    currentApprovalLevel: 2,
    totalApprovalLevels: 2,
    approvers: [
      { level: 1, role: 'Line Manager', approverName: 'Eng. Khalid Al-Amri', status: 'Approved', decisionDate: '2026-08-17 11:30', comments: 'Budget verified against client EPC project contract.' },
      { level: 2, role: 'Director of Corporate Administration', approverName: 'Tariq Al-Lawati', status: 'Approved', decisionDate: '2026-08-17 14:00', comments: 'Approved under executive travel policy.' }
    ],
    approvedBy: 'Tariq Al-Lawati',
    bookingRef: 'QR-89104-MCT',
    justification: 'Finalize bilateral JV technical agreement with Qatar Industrial Consortium for cross-border solar infrastructure.',
    createdAt: '2026-08-17'
  },
  {
    id: 'trv-02',
    travelNumber: 'TRV-2026-0090',
    travelerName: 'Zahir Al-Suleimani',
    employeeCode: 'EMP-3081',
    department: 'Project Engineering',
    travelPurpose: 'Project Site Inspection',
    destinationCity: 'Salalah',
    destinationCountry: 'Oman',
    departureDate: '2026-08-23',
    returnDate: '2026-08-25',
    travelClass: 'Economy',
    hotelRequired: true,
    hotelPreference: 'Crowne Plaza Resort Salalah',
    visaAssistanceNeeded: false,
    estimatedFlightCostOMR: 75.000,
    estimatedHotelCostOMR: 90.000,
    perDiemAllowanceOMR: 60.000,
    totalEstimatedCostOMR: 225.000,
    status: 'Pending Approval',
    currentApprovalLevel: 1,
    totalApprovalLevels: 1,
    approvers: [
      { level: 1, role: 'Department Head / Line Manager', approverName: 'Eng. Khalid Al-Amri', status: 'Pending' }
    ],
    justification: 'Conduct structural stress testing and warranty audit on Salalah Port container handling gantry crane.',
    createdAt: '2026-08-19'
  }
];

export const MOCK_FLEET_VEHICLES: FleetVehicleRecord[] = [
  { id: 'veh-01', vehicleCode: 'FLT-MCT-01', plateNumber: '9042-AA (Oman)', makeModel: 'Toyota Land Cruiser VXR 3.5TT', vehicleType: '4x4 SUV', assignedBranch: 'Muscat HQ', currentStatus: 'Available', currentOdometerKm: 42350, lastServiceDate: '2026-07-10', nextServiceDueKm: 50000, fuelCardNumber: 'Shell-Fuel-8901', defaultDriver: 'Abdullah Al-Balushi' },
  { id: 'veh-02', vehicleCode: 'FLT-MCT-02', plateNumber: '7188-B (Oman)', makeModel: 'Lexus ES 350 Executive Sedan', vehicleType: 'Sedan', assignedBranch: 'Muscat HQ', currentStatus: 'Reserved', currentOdometerKm: 28900, lastServiceDate: '2026-06-22', nextServiceDueKm: 35000, fuelCardNumber: 'Shell-Fuel-8902', defaultDriver: 'Said Al-Mamari' },
  { id: 'veh-03', vehicleCode: 'FLT-SOH-01', plateNumber: '4410-D (Oman)', makeModel: 'Toyota Hilux 4x4 Double Cab', vehicleType: 'Light Utility Truck', assignedBranch: 'Sohar Plant', currentStatus: 'On Mission', currentOdometerKm: 68100, lastServiceDate: '2026-08-02', nextServiceDueKm: 75000, fuelCardNumber: 'OmanOil-Fuel-3011', defaultDriver: 'Khamis Al-Alawi' },
  { id: 'veh-04', vehicleCode: 'FLT-MCT-03', plateNumber: '8321-K (Oman)', makeModel: 'Toyota HiAce 14-Seater Passenger Van', vehicleType: 'Passenger Van', assignedBranch: 'Muscat HQ', currentStatus: 'Available', currentOdometerKm: 51200, lastServiceDate: '2026-05-18', nextServiceDueKm: 60000, fuelCardNumber: 'Shell-Fuel-8903' }
];

export const MOCK_VEHICLE_BOOKINGS: VehicleBookingRecord[] = [
  {
    id: 'vbk-01',
    bookingNumber: 'VEH-BK-2026-015',
    requestedBy: 'Aisha Al-Hashmi',
    department: 'Legal & Corporate Affairs',
    purpose: 'Court of First Instance & Ministry of Justice Notarization Session',
    vehicleAssigned: 'Lexus ES 350 (7188-B)',
    plateNumber: '7188-B',
    assignedDriver: 'Said Al-Mamari',
    pickupLocation: 'Muscat HQ Main Lobby',
    dropoffLocation: 'Ministry of Justice & Legal Affairs, Al-Khuwair',
    tripStartDate: '2026-08-22',
    tripStartTime: '08:30 AM',
    tripEndDate: '2026-08-22',
    tripEndTime: '13:00 PM',
    passengerCount: 2,
    requiresChauffeur: true,
    status: 'Approved',
    createdAt: '2026-08-18'
  },
  {
    id: 'vbk-02',
    bookingNumber: 'VEH-BK-2026-016',
    requestedBy: 'Tariq Al-Farsi',
    department: 'Engineering & Projects',
    purpose: 'Client Site Inspection at PDO Mina Al Fahal Oil Depot',
    vehicleAssigned: 'Toyota Land Cruiser VXR (9042-AA)',
    plateNumber: '9042-AA',
    assignedDriver: 'Abdullah Al-Balushi',
    pickupLocation: 'Muscat HQ',
    dropoffLocation: 'PDO Coastal Office, Mina Al Fahal',
    tripStartDate: '2026-08-21',
    tripStartTime: '09:00 AM',
    tripEndDate: '2026-08-21',
    tripEndTime: '15:30 PM',
    passengerCount: 4,
    requiresChauffeur: true,
    status: 'Approved',
    createdAt: '2026-08-19'
  }
];

export const MOCK_GENERAL_SERVICES: GeneralServiceRequest[] = [
  {
    id: 'gsr-01',
    serviceRequestNumber: 'GSR-2026-041',
    serviceCategory: 'Office Interior & Relocation',
    title: 'Executive Meeting Room Soundproofing & Acoustic Wall Panel Installation',
    requestedBy: 'Maryam Al-Kindi',
    department: 'Administration',
    location: 'Muscat HQ — Level 7 Boardroom B',
    scheduledDate: '2026-08-26',
    scopeOfWork: 'Supply and fit 48 acoustic baffle fabric tiles to eliminate reverberation for international video conference broadcasts.',
    vendorAssigned: 'Muscat Architectural Interiors LLC',
    estimatedBudgetOMR: 1450.000,
    status: 'In Progress',
    createdAt: '2026-08-14'
  },
  {
    id: 'gsr-02',
    serviceRequestNumber: 'GSR-2026-042',
    serviceCategory: 'Document Shredding & Disposal',
    title: 'Certified On-Site High-Security Confidential Document Shredding',
    requestedBy: 'Aisha Al-Hashmi',
    department: 'Legal & Corporate Affairs',
    location: 'Muscat HQ — Basement Archive B2',
    scheduledDate: '2026-08-29',
    scopeOfWork: 'Certified DIN 66399 Level P-4 micro-crosscut shredding of 120 archive boxes containing expired accounting records (FY2015-FY2017). Certificate of destruction required.',
    vendorAssigned: 'Oman Secure Destruction Services',
    estimatedBudgetOMR: 350.000,
    status: 'Approved',
    createdAt: '2026-08-18'
  }
];

export const MOCK_SERVICE_VENDORS: ServiceVendorRecord[] = [
  {
    id: 'vend-01',
    vendorCode: 'VEND-ADM-01',
    vendorName: 'Al-Madina Security Services SAOC',
    serviceCategory: 'Office Security',
    contactPerson: 'Col. (Retd) Yaqoob Al-Zadjali',
    contactEmail: 'security@almadina-oman.com',
    contactPhone: '+968 2481 0921',
    contractStartDate: '2025-01-01',
    contractEndDate: '2026-12-31',
    annualValueOMR: 48000.000,
    serviceRating: 4.8,
    slaCompliancePercent: 99.2,
    status: 'Active'
  },
  {
    id: 'vend-02',
    vendorCode: 'VEND-ADM-02',
    vendorName: 'Oman Clean Facilities Co. LLC',
    serviceCategory: 'Facility Management',
    contactPerson: 'Suresh Narayanan',
    contactEmail: 'ops@omanclean.com',
    contactPhone: '+968 2459 3300',
    contractStartDate: '2025-06-01',
    contractEndDate: '2027-05-31',
    annualValueOMR: 36000.000,
    serviceRating: 4.5,
    slaCompliancePercent: 97.8,
    status: 'Active'
  },
  {
    id: 'vend-03',
    vendorCode: 'VEND-ADM-03',
    vendorName: 'Bustan Royal Catering & Hospitality',
    serviceCategory: 'Catering & Hospitality',
    contactPerson: 'Chef Salim Al-Raisi',
    contactEmail: 'events@bustanroyal.om',
    contactPhone: '+968 2470 8822',
    contractStartDate: '2026-01-01',
    contractEndDate: '2026-12-31',
    annualValueOMR: 22500.000,
    serviceRating: 4.9,
    slaCompliancePercent: 99.5,
    status: 'Active'
  },
  {
    id: 'vend-04',
    vendorCode: 'VEND-ADM-04',
    vendorName: 'Bahwan DHL Express Logistics',
    serviceCategory: 'Courier & Logistics',
    contactPerson: 'Fatma Al-Lawati',
    contactEmail: 'corporate@dhl-oman.com',
    contactPhone: '+968 2451 0000',
    contractStartDate: '2025-03-01',
    contractEndDate: '2027-02-28',
    annualValueOMR: 18000.000,
    serviceRating: 4.7,
    slaCompliancePercent: 98.4,
    status: 'Active'
  }
];

export const MOCK_OFFICE_ASSETS: OfficeAssetRecord[] = [
  {
    id: 'ast-01',
    assetTag: 'AST-OFF-0941',
    itemName: 'Steelcase Gesture Ergonomic Executive High-Back Chair',
    category: 'Office Furniture',
    locationRoom: 'Muscat HQ — Room 801 (CAO Suite)',
    branch: 'Muscat HQ',
    custodianEmployee: 'Eng. Khalid Al-Amri',
    purchaseDate: '2025-02-15',
    purchaseValueOMR: 420.000,
    condition: 'Excellent',
    serialNumber: 'SC-GES-90411',
    status: 'In Service'
  },
  {
    id: 'ast-02',
    assetTag: 'AST-OFF-0942',
    itemName: 'Cisco Webex Room Panorama Dual 75" 4K Video Conference Hub',
    category: 'Meeting Room AV',
    locationRoom: 'Muscat HQ — Grand Boardroom Level 8',
    branch: 'Muscat HQ',
    custodianEmployee: 'Salim Al-Busaidi (Facilities)',
    purchaseDate: '2024-11-20',
    purchaseValueOMR: 6800.000,
    condition: 'Excellent',
    serialNumber: 'CSCO-WBX-77218',
    status: 'In Service'
  },
  {
    id: 'ast-03',
    assetTag: 'AST-OFF-0943',
    itemName: 'De’Longhi Magnifica S Bean-to-Cup Commercial Espresso Station',
    category: 'Pantry Appliance',
    locationRoom: 'Muscat HQ — Level 7 Executive Lounge',
    branch: 'Muscat HQ',
    custodianEmployee: 'Maryam Al-Kindi',
    purchaseDate: '2025-04-10',
    purchaseValueOMR: 650.000,
    condition: 'Good',
    serialNumber: 'DL-MAG-44019',
    status: 'In Service'
  },
  {
    id: 'ast-04',
    assetTag: 'AST-OFF-0944',
    itemName: 'Canon imageRUNNER ADVANCE DX C5860i Multi-Function Floor Copier',
    category: 'Office Machine',
    locationRoom: 'Muscat HQ — Level 4 Finance Copy Center',
    branch: 'Muscat HQ',
    custodianEmployee: 'Hamood Al-Hajri',
    purchaseDate: '2025-01-18',
    purchaseValueOMR: 2450.000,
    condition: 'Good',
    serialNumber: 'CN-IR-DX-88310',
    status: 'In Service'
  }
];
