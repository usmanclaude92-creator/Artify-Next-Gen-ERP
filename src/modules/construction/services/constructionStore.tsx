// ==========================================
// ARTIFY ERP — MODULE 15: CONSTRUCTION & CONTRACT MANAGEMENT
// State Management & Reactive Store Engine
// ==========================================

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  ContractMaster,
  ClientContractAgreement,
  SubcontractPackage,
  ContractClauseTerm,
  BOQItem,
  BOQRevision,
  BOQRateAnalysis,
  SiteProfile,
  SiteWorkOrder,
  ProjectMilestone,
  SiteDailyActivityLog,
  JointProgressMeasurement,
  InterimPaymentCertificate,
  ProgressTaxInvoice,
  SubcontractorPaymentCertificate,
  RetentionLedgerEntry,
  AdvancePaymentRecoverySchedule,
  ContractCostingBreakdown,
  ContractProfitabilitySummary,
  BondGuaranteeRecord,
  VariationOrderRecord,
  ContractClaimRecord,
  ExtensionOfTimeRecord,
  LiquidatedDamagesAssessment,
  FinalAccountStatement,
  ContractCompletionCertificate,
  RetentionReleaseRecord,
  ContractCloseoutFormalRecord,
  ConstructionModuleKPIs
} from '../types/constructionTypes';

// ==========================================
// SEED DATA INITIALIZATION
// ==========================================

const INITIAL_CONTRACTS: ContractMaster[] = [
  {
    id: 'CNT-001',
    contractNumber: 'CON-2023-OM-008',
    title: 'Muscat Waterfront Commercial & Residential Tower (38-Storey)',
    projectCode: 'PRJ-MCT-38',
    projectName: 'Muscat Waterfront Heights',
    contractType: 'FIDIC_RED_BOOK',
    clientName: 'Oman Waterfront Real Estate Development SAOC',
    mainContractor: 'Artify Engineering & Construction LLC',
    supervisingConsultant: 'Khatib & Alami International',
    currency: 'OMR',
    originalContractValue: 28500000,
    approvedVariationsValue: 1450000,
    revisedContractValue: 29950000,
    contractStartDate: '2023-03-01',
    contractualCompletionDate: '2025-08-31',
    revisedCompletionDate: '2025-11-15',
    siteLocation: 'Al Mouj Marina Waterfront, Sector 4, Muscat',
    status: 'ACTIVE',
    progressPhysicalPct: 68.5,
    progressFinancialPct: 64.2,
    scopeSummary: 'Turnkey construction of 38-storey luxury residential and retail development with 3 basement levels, diaphragm wall, podium retail, and infinity sky terrace.',
    advancePaymentPercentage: 10,
    advanceRecoveryStartPct: 20,
    advanceRecoveryEndPct: 80,
    retentionPercentage: 10,
    retentionCapPercentage: 5,
    defectLiabilityPeriodMonths: 24,
    liquidatedDamagesPerDay: 5000,
    maxLiquidatedDamagesPct: 10
  },
  {
    id: 'CNT-002',
    contractNumber: 'CON-2023-OM-014',
    title: 'Sohar Industrial Polymer Production Facility Phase 2',
    projectCode: 'PRJ-SHR-02',
    projectName: 'Sohar Petrochemical Complex Exp.',
    contractType: 'FIDIC_YELLOW_BOOK',
    clientName: 'Sohar Advanced Chemicals Company LLC',
    mainContractor: 'Artify Industrial EPC Joint Venture',
    supervisingConsultant: 'WorleyParsons Oman',
    currency: 'OMR',
    originalContractValue: 42000000,
    approvedVariationsValue: 2300000,
    revisedContractValue: 44300000,
    contractStartDate: '2023-01-15',
    contractualCompletionDate: '2025-04-30',
    revisedCompletionDate: '2025-06-30',
    siteLocation: 'Sohar Industrial Port Zone, Plot B-12',
    status: 'ACTIVE',
    progressPhysicalPct: 81.0,
    progressFinancialPct: 78.4,
    scopeSummary: 'EPC engineering, procurement, structural steel erection, pipe racks, reactor foundations, and electrical substation for polymer processing plant.',
    advancePaymentPercentage: 15,
    advanceRecoveryStartPct: 15,
    advanceRecoveryEndPct: 85,
    retentionPercentage: 5,
    retentionCapPercentage: 5,
    defectLiabilityPeriodMonths: 12,
    liquidatedDamagesPerDay: 8500,
    maxLiquidatedDamagesPct: 10
  },
  {
    id: 'CNT-003',
    contractNumber: 'CON-2024-OM-002',
    title: 'Duqm Logistics Multi-Modal Cargo Terminal & Warehouses',
    projectCode: 'PRJ-DQM-09',
    projectName: 'Duqm Port Logistics Zone',
    contractType: 'ITEM_RATE_REMEASURABLE',
    clientName: 'Special Economic Zone Authority at Duqm (SEZAD)',
    mainContractor: 'Artify Infra & Earthworks Division',
    supervisingConsultant: 'Renardet SA & Partners',
    currency: 'OMR',
    originalContractValue: 16800000,
    approvedVariationsValue: 350000,
    revisedContractValue: 17150000,
    contractStartDate: '2024-02-01',
    contractualCompletionDate: '2025-10-31',
    revisedCompletionDate: '2025-10-31',
    siteLocation: 'SEZAD Duqm Logistics District, Zone C',
    status: 'ACTIVE',
    progressPhysicalPct: 34.0,
    progressFinancialPct: 29.8,
    scopeSummary: 'Civil earthworks, heavy-duty asphalt container yard pavements, stormwater box culverts, 4 pre-engineered logistics warehouses, and perimeter security grid.',
    advancePaymentPercentage: 10,
    advanceRecoveryStartPct: 20,
    advanceRecoveryEndPct: 80,
    retentionPercentage: 10,
    retentionCapPercentage: 5,
    defectLiabilityPeriodMonths: 12,
    liquidatedDamagesPerDay: 3000,
    maxLiquidatedDamagesPct: 10
  }
];

const INITIAL_CLIENT_AGREEMENTS: ClientContractAgreement[] = [
  {
    id: 'CCA-001',
    contractId: 'CNT-001',
    employerName: 'Oman Waterfront Real Estate Development SAOC',
    employerAddress: 'P.O. Box 889, PC 112, Ruwi, Muscat, Sultanate of Oman',
    paymentCycleDays: 30,
    ipcSubmissionDayOfMonth: 25,
    engineerName: 'Khatib & Alami International (Eng. Salim Al-Rawahi)',
    vatTaxRegistrationNumber: 'OM1100234891',
    governingLaw: 'Laws of the Sultanate of Oman (Royal Decree 29/2013)',
    arbitrationVenue: 'Oman Commercial Arbitration Centre (OAC), Muscat'
  }
];

const INITIAL_SUBCONTRACTS: SubcontractPackage[] = [
  {
    id: 'SUB-001',
    subcontractNumber: 'SUB-MCT-MEP-01',
    contractId: 'CNT-001',
    tradePackage: 'HVAC Chilled Water & Ductwork Installation',
    subcontractorName: 'Bahwan Engineering Services LLC',
    contactPerson: 'Eng. R. Narayanan (+968 9988 1234)',
    subcontractValue: 3450000,
    awardedDate: '2023-06-15',
    targetStartDate: '2023-09-01',
    targetEndDate: '2025-06-30',
    retentionPercentage: 10,
    advancePercentage: 10,
    payWhenPaidClause: true,
    cumulativeBilled: 2150000,
    cumulativeCertified: 2080000,
    status: 'ACTIVE'
  },
  {
    id: 'SUB-002',
    subcontractNumber: 'SUB-MCT-FACADE-02',
    contractId: 'CNT-001',
    tradePackage: 'Unitized Curtain Wall & Double-Glazed Facade',
    subcontractorName: 'Alumco Aluminum & Glass Contracting SAOG',
    contactPerson: 'Fahad Al-Balushi (+968 9123 4567)',
    subcontractValue: 4100000,
    awardedDate: '2023-08-10',
    targetStartDate: '2024-01-15',
    targetEndDate: '2025-07-31',
    retentionPercentage: 10,
    advancePercentage: 15,
    payWhenPaidClause: true,
    cumulativeBilled: 2450000,
    cumulativeCertified: 2320000,
    status: 'ACTIVE'
  },
  {
    id: 'SUB-003',
    subcontractNumber: 'SUB-MCT-ELEV-03',
    contractId: 'CNT-001',
    tradePackage: 'High-Speed Destination Control Elevators (6 Units)',
    subcontractorName: 'KONE Elevator Oman LLC',
    contactPerson: 'Markus Lind (+968 9456 7890)',
    subcontractValue: 1250000,
    awardedDate: '2023-11-20',
    targetStartDate: '2024-06-01',
    targetEndDate: '2025-08-15',
    retentionPercentage: 10,
    advancePercentage: 20,
    payWhenPaidClause: false,
    cumulativeBilled: 620000,
    cumulativeCertified: 620000,
    status: 'ACTIVE'
  }
];

const INITIAL_CONTRACT_TERMS: ContractClauseTerm[] = [
  {
    id: 'TRM-001',
    contractId: 'CNT-001',
    clauseCode: 'FIDIC Cl. 14.2',
    clauseHeading: 'Advance Payment & Bank Guarantee Terms',
    clauseType: 'ADVANCE',
    standardText: 'Employer shall make an advance payment of 10% against submission of an unconditional Bank Guarantee.',
    customModifications: 'Recovery shall commence in the interim certificate following 20% certified work and complete at 80% certification.',
    complianceLevel: 'STANDARD'
  },
  {
    id: 'TRM-002',
    contractId: 'CNT-001',
    clauseCode: 'FIDIC Cl. 14.3 & 14.6',
    clauseHeading: 'Interim Payment Certificate & Retention Deductions',
    clauseType: 'RETENTION',
    standardText: 'Retention money shall be deducted at 10% from each IPC up to a maximum limit of 5% of Contract Value.',
    customModifications: '50% released upon issuance of Taking-Over Certificate (TOC); remaining 50% upon Defect Liability Certificate.',
    complianceLevel: 'STANDARD'
  },
  {
    id: 'TRM-003',
    contractId: 'CNT-001',
    clauseCode: 'FIDIC Cl. 8.7',
    clauseHeading: 'Delay Damages & Liquidated Damages Exposure',
    clauseType: 'LIQUIDATED_DAMAGES',
    standardText: 'If Contractor fails to comply with Time for Completion, liquidated damages of OMR 5,000 per day shall apply.',
    customModifications: 'Cumulative cap on Liquidated Damages is strictly limited to 10% of final accepted contract amount.',
    complianceLevel: 'MODIFIED_STRICT'
  },
  {
    id: 'TRM-004',
    contractId: 'CNT-001',
    clauseCode: 'FIDIC Cl. 20.1',
    clauseHeading: 'Contractor Claims & Notice Notification Deadlines',
    clauseType: 'EOT_CLAIM',
    standardText: 'Contractor must submit formal notice of any claim within 28 days of becoming aware of the event.',
    customModifications: 'Detailed contemporary substantiations required within 42 days, failing which claim is legally barred.',
    complianceLevel: 'STANDARD'
  }
];

const INITIAL_BOQ_ITEMS: BOQItem[] = [
  {
    id: 'BOQ-001',
    boqCode: '01.01.00',
    contractId: 'CNT-001',
    division: 'DIV_01_GENERAL_REQUIREMENTS',
    itemDescription: 'Contractor Preliminaries, Site Offices, Temporary Power, Water, HSE and Tower Crane Installations',
    unitOfMeasure: 'LS',
    tenderQuantity: 1,
    revisedQuantity: 1,
    executedQuantityToDate: 0.75,
    certifiedQuantityToDate: 0.70,
    unitRate: 1450000,
    totalTenderAmount: 1450000,
    totalRevisedAmount: 1450000,
    totalExecutedAmount: 1087500,
    rateBreakdown: {
      materialRate: 350000,
      laborRate: 400000,
      equipmentRate: 500000,
      subcontractorRate: 0,
      overheadProfitRate: 200000
    },
    reMeasurementRequired: false
  },
  {
    id: 'BOQ-002',
    boqCode: '02.01.01',
    contractId: 'CNT-001',
    division: 'DIV_02_EXISTING_CONDITIONS_EARTHWORKS',
    itemDescription: 'Bulk deep excavation in rocky and sandy strata for 3 basement levels including dewatering system',
    unitOfMeasure: 'm3',
    tenderQuantity: 85000,
    revisedQuantity: 91200,
    executedQuantityToDate: 91200,
    certifiedQuantityToDate: 91200,
    unitRate: 14.50,
    totalTenderAmount: 1232500,
    totalRevisedAmount: 1322400,
    totalExecutedAmount: 1322400,
    rateBreakdown: {
      materialRate: 1.20,
      laborRate: 3.50,
      equipmentRate: 7.80,
      subcontractorRate: 0,
      overheadProfitRate: 2.00
    },
    reMeasurementRequired: true
  },
  {
    id: 'BOQ-003',
    boqCode: '03.01.02',
    contractId: 'CNT-001',
    division: 'DIV_03_CONCRETE_WORKS',
    itemDescription: 'Reinforced concrete Grade 50/60 Microsilica for Raft Foundation slab (2.5m thickness) including waterstops',
    unitOfMeasure: 'm3',
    tenderQuantity: 12500,
    revisedQuantity: 12500,
    executedQuantityToDate: 12500,
    certifiedQuantityToDate: 12500,
    unitRate: 165.00,
    totalTenderAmount: 2062500,
    totalRevisedAmount: 2062500,
    totalExecutedAmount: 2062500,
    rateBreakdown: {
      materialRate: 110.00,
      laborRate: 25.00,
      equipmentRate: 12.00,
      subcontractorRate: 0,
      overheadProfitRate: 18.00
    },
    reMeasurementRequired: true
  },
  {
    id: 'BOQ-004',
    boqCode: '03.02.04',
    contractId: 'CNT-001',
    division: 'DIV_03_CONCRETE_WORKS',
    itemDescription: 'Reinforced concrete C60 self-compacting columns and shear core walls from Level 01 to Level 38',
    unitOfMeasure: 'm3',
    tenderQuantity: 18400,
    revisedQuantity: 18400,
    executedQuantityToDate: 13800,
    certifiedQuantityToDate: 12900,
    unitRate: 195.00,
    totalTenderAmount: 3588000,
    totalRevisedAmount: 3588000,
    totalExecutedAmount: 2691000,
    rateBreakdown: {
      materialRate: 128.00,
      laborRate: 32.00,
      equipmentRate: 15.00,
      subcontractorRate: 0,
      overheadProfitRate: 20.00
    },
    reMeasurementRequired: true
  },
  {
    id: 'BOQ-005',
    boqCode: '08.01.01',
    contractId: 'CNT-001',
    division: 'DIV_08_OPENINGS_DOORS_WINDOWS',
    itemDescription: 'Unitized structural double-glazed thermal-break low-E curtain wall facade system',
    unitOfMeasure: 'm2',
    tenderQuantity: 24500,
    revisedQuantity: 24500,
    executedQuantityToDate: 14200,
    certifiedQuantityToDate: 13100,
    unitRate: 185.00,
    totalTenderAmount: 4532500,
    totalRevisedAmount: 4532500,
    totalExecutedAmount: 2627000,
    rateBreakdown: {
      materialRate: 125.00,
      laborRate: 28.00,
      equipmentRate: 8.00,
      subcontractorRate: 0,
      overheadProfitRate: 24.00
    },
    reMeasurementRequired: true
  }
];

const INITIAL_BOQ_REVISIONS: BOQRevision[] = [
  {
    id: 'BREV-001',
    revisionCode: 'REV-IFC-01',
    contractId: 'CNT-001',
    title: 'Basement Diaphragm Wall & Bulk Excavation Deepening to Rock Strata',
    reason: 'IFC_DRAWING_UPDATE',
    dateIssued: '2023-05-18',
    issuedBy: 'Khatib & Alami Senior QS',
    approvedBy: 'Client Project Director',
    affectedItemsCount: 4,
    netFinancialImpact: 89900,
    status: 'APPROVED'
  },
  {
    id: 'BREV-002',
    revisionCode: 'REV-VE-02',
    contractId: 'CNT-001',
    title: 'Value Engineering Alternative for Podium Post-Tensioned Slabs',
    reason: 'CLIENT_SCOPE_CHANGE',
    dateIssued: '2023-10-04',
    issuedBy: 'Artify Technical Office',
    approvedBy: 'Supervising Consultant',
    affectedItemsCount: 6,
    netFinancialImpact: -145000,
    status: 'APPROVED'
  }
];

const INITIAL_SITES: SiteProfile[] = [
  {
    id: 'SITE-001',
    siteCode: 'SITE-MCT-TWR',
    siteName: 'Muscat Waterfront Tower Construction Site',
    contractId: 'CNT-001',
    locationCoordinates: '23.6143° N, 58.2866° E (Al Mouj)',
    projectManager: 'Eng. Tariq Al-Harthy',
    residentEngineer: 'Dr. Jean-Pierre Dupont (Consultant)',
    hseSafetyManager: 'Suleiman Al-Habsi',
    totalHeadcountToday: 348,
    activeEquipmentUnits: 14,
    safeManHoursSinceLTI: 1420500,
    siteOfficeStatus: 'OPERATIONAL',
    accessPermitNumber: 'MM-PERM-2023-8891',
    stagingYardCapacityPct: 78
  },
  {
    id: 'SITE-002',
    siteCode: 'SITE-SHR-PLANT',
    siteName: 'Sohar Polymer Petrochemical Site',
    contractId: 'CNT-002',
    locationCoordinates: '24.3644° N, 56.7468° E (Sohar Port)',
    projectManager: 'Eng. Vikram Sethi',
    residentEngineer: 'Eng. Abdullah Al-Shehhi',
    hseSafetyManager: 'Saif Al-Maamari',
    totalHeadcountToday: 512,
    activeEquipmentUnits: 28,
    safeManHoursSinceLTI: 2890000,
    siteOfficeStatus: 'OPERATIONAL',
    accessPermitNumber: 'SIPZ-EP-2023-014',
    stagingYardCapacityPct: 84
  }
];

const INITIAL_WORK_ORDERS: SiteWorkOrder[] = [
  {
    id: 'SWO-001',
    workOrderNumber: 'SWO-MCT-L28-01',
    siteId: 'SITE-001',
    contractId: 'CNT-001',
    title: 'Core Wall & Column Formwork & Concreting (Level 28 to 29)',
    tradePackage: 'Reinforced Concrete Structure',
    assignedCrewOrSubcontractor: 'Artify Civil Concrete Crew A',
    zoneLocation: 'Tower Core Zone A & B',
    scheduledStartDate: '2024-08-15',
    scheduledEndDate: '2024-08-23',
    actualStartDate: '2024-08-15',
    progressPercent: 85,
    inspectionStatus: 'IN_PROGRESS',
    status: 'ACTIVE'
  },
  {
    id: 'SWO-002',
    workOrderNumber: 'SWO-MCT-MEP-L18',
    siteId: 'SITE-001',
    contractId: 'CNT-001',
    title: 'First-Fix Chilled Water Piping & Fire Sprinkler Grid (Level 18)',
    tradePackage: 'MEP Services',
    assignedCrewOrSubcontractor: 'Bahwan Engineering Services',
    zoneLocation: 'Level 18 North Wing',
    scheduledStartDate: '2024-08-10',
    scheduledEndDate: '2024-08-25',
    actualStartDate: '2024-08-11',
    progressPercent: 90,
    inspectionStatus: 'PENDING_INSPECTION',
    qaInspectionRequestId: 'WIR-MEP-L18-04',
    status: 'ACTIVE'
  },
  {
    id: 'SWO-003',
    workOrderNumber: 'SWO-MCT-FACADE-L22',
    siteId: 'SITE-001',
    contractId: 'CNT-001',
    title: 'Curtain Wall Panel Glazing Installation (Level 22 Perimeter)',
    tradePackage: 'Facade & Glazing',
    assignedCrewOrSubcontractor: 'Alumco Aluminum & Glass',
    zoneLocation: 'Levels 21 to 22 East Elevation',
    scheduledStartDate: '2024-08-12',
    scheduledEndDate: '2024-08-28',
    actualStartDate: '2024-08-13',
    progressPercent: 70,
    inspectionStatus: 'IN_PROGRESS',
    status: 'ACTIVE'
  }
];

const INITIAL_MILESTONES: ProjectMilestone[] = [
  {
    id: 'MS-001',
    contractId: 'CNT-001',
    milestoneCode: 'MS-01',
    title: 'Piling, Diaphragm Wall & 3-Level Basement Excavation Complete',
    targetDate: '2023-09-30',
    actualDate: '2023-09-24',
    weightagePct: 15,
    associatedPaymentRelease: 4275000,
    isCriticalPath: true,
    status: 'CERTIFIED',
    consultantSignoffDate: '2023-09-28'
  },
  {
    id: 'MS-002',
    contractId: 'CNT-001',
    milestoneCode: 'MS-02',
    title: 'Podium Structure Completion (Ground + 4 Podium Levels)',
    targetDate: '2024-02-28',
    actualDate: '2024-02-22',
    weightagePct: 18,
    associatedPaymentRelease: 5130000,
    isCriticalPath: true,
    status: 'CERTIFIED',
    consultantSignoffDate: '2024-03-02'
  },
  {
    id: 'MS-003',
    contractId: 'CNT-001',
    milestoneCode: 'MS-03',
    title: 'Tower Superstructure Topping-Out at Level 38 Roof',
    targetDate: '2024-11-30',
    weightagePct: 25,
    associatedPaymentRelease: 7125000,
    isCriticalPath: true,
    status: 'ON_SCHEDULE'
  },
  {
    id: 'MS-004',
    contractId: 'CNT-001',
    milestoneCode: 'MS-04',
    title: 'Facade Enclosure & MEP Testing and Commissioning',
    targetDate: '2025-06-30',
    weightagePct: 22,
    associatedPaymentRelease: 6270000,
    isCriticalPath: true,
    status: 'PENDING'
  },
  {
    id: 'MS-005',
    contractId: 'CNT-001',
    milestoneCode: 'MS-05',
    title: 'Civil Defense Clearance & Taking-Over Certificate (TOC)',
    targetDate: '2025-08-31',
    weightagePct: 20,
    associatedPaymentRelease: 5700000,
    isCriticalPath: true,
    status: 'PENDING'
  }
];

const INITIAL_SITE_LOGS: SiteDailyActivityLog[] = [
  {
    id: 'DSR-001',
    reportDate: '2024-08-20',
    siteId: 'SITE-001',
    contractId: 'CNT-001',
    reportNumber: 'DSR-2024-0521',
    weatherCondition: 'CLEAR_SUNNY',
    ambientTemperatureHighC: 38,
    manpowerLog: {
      engineers: 14,
      foremen: 22,
      skilledCarpentersSteelFixers: 145,
      mepTechnicians: 82,
      helpersGeneralLabor: 85,
      totalHeadcount: 348
    },
    equipmentLog: [
      { equipmentName: 'Tower Crane 01 (Potain 25T)', quantity: 1, hoursWorked: 11, hoursIdleBreakdown: 0 },
      { equipmentName: 'Tower Crane 02 (Liebherr 20T)', quantity: 1, hoursWorked: 10.5, hoursIdleBreakdown: 0.5 },
      { equipmentName: 'Concrete Placing Boom (Putzmeister 36m)', quantity: 1, hoursWorked: 6, hoursIdleBreakdown: 5 },
      { equipmentName: 'Passenger & Material Hoist Dual Cage', quantity: 2, hoursWorked: 12, hoursIdleBreakdown: 0 }
    ],
    activitiesExecuted: [
      'Poured 280 m3 of C60 concrete for Level 28 floor slab zone 2.',
      'Installed chilled water risers from Level 16 to Level 19 shaft.',
      'Fixed curtain wall brackets on Level 23 South Elevation.',
      'Conducted electrical continuity test for Level 12 distribution boards.'
    ],
    materialsReceivedSummary: [
      'Ready-mix concrete C60: 280 m3 (Oman Concrete LLC)',
      'High-yield debar steel: 42 Tons (Jindal Shadeed Iron)',
      'Curtain wall glazing units: 28 crates (Alumco)'
    ],
    safetyObservations: 'Conducted mandatory toolbox talk on working at heights and 100% tie-off compliance. Zero safety violations recorded.',
    visitorsConsultantComments: 'Consultant QA/QC engineer inspected post-pour concrete cube samples and signed WIR-STR-L28-02.',
    sitePhotosAttached: 8,
    loggedBy: 'Eng. Qasim Al-Zadjali (Site Engineer)'
  }
];

const INITIAL_IPCS: InterimPaymentCertificate[] = [
  {
    id: 'IPC-007',
    ipcNumber: 'IPC-07',
    contractId: 'CNT-001',
    periodStartDate: '2024-05-01',
    periodEndDate: '2024-05-31',
    submissionDate: '2024-06-02',
    certificationDate: '2024-06-18',
    clientName: 'Oman Waterfront Real Estate Development SAOC',
    grossWorkExecutedThisPeriod: 1280000,
    cumulativeGrossWorkExecuted: 16850000,
    materialsOnSiteAdvancement: 320000,
    approvedVariationsThisPeriod: 85000,
    cumulativeApprovedVariations: 740000,
    grossCertifiedCumulativeTotal: 17910000,
    advancePaymentRecoveryThisPeriod: 136500,
    cumulativeAdvanceRecovered: 1791000,
    retentionDeductedThisPeriod: 136500,
    cumulativeRetentionWithheld: 1425000, // capped at 5%
    previousCertificatesCumulativePaid: 13240000,
    netPayableBeforeVat: 1007000,
    vatTaxAmount: 50350,
    totalNetPayableWithVat: 1057350,
    certifiedByConsultantEngineer: 'Khatib & Alami (Resident Eng. Dr. Jean-Pierre Dupont)',
    engineerCertificateRefNumber: 'KA-MCT-IPC-07-CERT',
    status: 'PAID',
    paymentDueDate: '2024-07-18',
    paidDate: '2024-07-15'
  },
  {
    id: 'IPC-008',
    ipcNumber: 'IPC-08',
    contractId: 'CNT-001',
    periodStartDate: '2024-06-01',
    periodEndDate: '2024-06-30',
    submissionDate: '2024-07-02',
    certificationDate: '2024-07-20',
    clientName: 'Oman Waterfront Real Estate Development SAOC',
    grossWorkExecutedThisPeriod: 1350000,
    cumulativeGrossWorkExecuted: 18200000,
    materialsOnSiteAdvancement: 290000,
    approvedVariationsThisPeriod: 120000,
    cumulativeApprovedVariations: 860000,
    grossCertifiedCumulativeTotal: 19350000,
    advancePaymentRecoveryThisPeriod: 147000,
    cumulativeAdvanceRecovered: 1938000,
    retentionDeductedThisPeriod: 0, // Capped reached
    cumulativeRetentionWithheld: 1425000,
    previousCertificatesCumulativePaid: 14247000,
    netPayableBeforeVat: 1323000,
    vatTaxAmount: 66150,
    totalNetPayableWithVat: 1389150,
    certifiedByConsultantEngineer: 'Khatib & Alami (Resident Eng. Dr. Jean-Pierre Dupont)',
    engineerCertificateRefNumber: 'KA-MCT-IPC-08-CERT',
    status: 'PAID',
    paymentDueDate: '2024-08-20',
    paidDate: '2024-08-18'
  },
  {
    id: 'IPC-009',
    ipcNumber: 'IPC-09',
    contractId: 'CNT-001',
    periodStartDate: '2024-07-01',
    periodEndDate: '2024-07-31',
    submissionDate: '2024-08-03',
    certificationDate: '2024-08-19',
    clientName: 'Oman Waterfront Real Estate Development SAOC',
    grossWorkExecutedThisPeriod: 1420000,
    cumulativeGrossWorkExecuted: 19620000,
    materialsOnSiteAdvancement: 310000,
    approvedVariationsThisPeriod: 180000,
    cumulativeApprovedVariations: 1040000,
    grossCertifiedCumulativeTotal: 20970000,
    advancePaymentRecoveryThisPeriod: 160000,
    cumulativeAdvanceRecovered: 2098000,
    retentionDeductedThisPeriod: 0,
    cumulativeRetentionWithheld: 1425000,
    previousCertificatesCumulativePaid: 15570000,
    netPayableBeforeVat: 1440000,
    vatTaxAmount: 72000,
    totalNetPayableWithVat: 1512000,
    certifiedByConsultantEngineer: 'Khatib & Alami (Resident Eng. Dr. Jean-Pierre Dupont)',
    engineerCertificateRefNumber: 'KA-MCT-IPC-09-CERT',
    status: 'CERTIFIED',
    paymentDueDate: '2024-09-19'
  }
];

const INITIAL_PROGRESS_INVOICES: ProgressTaxInvoice[] = [
  {
    id: 'INV-008',
    invoiceNumber: 'INV-CON-2024-008',
    ipcId: 'IPC-008',
    contractId: 'CNT-001',
    clientName: 'Oman Waterfront Real Estate Development SAOC',
    invoiceDate: '2024-07-22',
    paymentDueDate: '2024-08-20',
    taxableCertifiedAmount: 1323000,
    vatRatePct: 5,
    vatAmount: 66150,
    totalInvoiceAmount: 1389150,
    paymentStatus: 'PAID',
    amountCollected: 1389150
  },
  {
    id: 'INV-009',
    invoiceNumber: 'INV-CON-2024-009',
    ipcId: 'IPC-009',
    contractId: 'CNT-001',
    clientName: 'Oman Waterfront Real Estate Development SAOC',
    invoiceDate: '2024-08-20',
    paymentDueDate: '2024-09-19',
    taxableCertifiedAmount: 1440000,
    vatRatePct: 5,
    vatAmount: 72000,
    totalInvoiceAmount: 1512000,
    paymentStatus: 'UNPAID',
    amountCollected: 0
  }
];

const INITIAL_BONDS: BondGuaranteeRecord[] = [
  {
    id: 'BG-001',
    instrumentNumber: 'BG-NBO-2023-8891',
    contractId: 'CNT-001',
    bondType: 'PERFORMANCE_BOND',
    title: 'Performance Bank Guarantee (10% of Contract Value)',
    issuingBank: 'National Bank of Oman (NBO) SAOG',
    beneficiaryName: 'Oman Waterfront Real Estate Development SAOC',
    instrumentValue: 2850000,
    currency: 'OMR',
    percentageOfContract: 10,
    issueDate: '2023-02-15',
    originalExpiryDate: '2025-09-30',
    currentExpiryDate: '2025-12-31',
    claimPeriodDays: 30,
    renewalAlertDaysBefore: 60,
    marginCashCollateralHeld: 285000,
    bankCommissionFeeAnnualPct: 0.75,
    status: 'ACTIVE',
    linkedMilestoneRelease: 'Issuance of Taking-Over Certificate (TOC)',
    physicalDocumentLocation: 'Corporate Treasury Vault #2 - Shelf B'
  },
  {
    id: 'BG-002',
    instrumentNumber: 'APG-BM-2023-4412',
    contractId: 'CNT-001',
    bondType: 'ADVANCE_PAYMENT_GUARANTEE',
    title: 'Advance Payment Bank Guarantee (10% of Contract)',
    issuingBank: 'Bank Muscat SAOG',
    beneficiaryName: 'Oman Waterfront Real Estate Development SAOC',
    instrumentValue: 2850000,
    currency: 'OMR',
    percentageOfContract: 10,
    issueDate: '2023-02-20',
    originalExpiryDate: '2024-12-31',
    currentExpiryDate: '2024-12-31',
    claimPeriodDays: 30,
    renewalAlertDaysBefore: 45,
    marginCashCollateralHeld: 142500,
    bankCommissionFeeAnnualPct: 0.65,
    status: 'ACTIVE',
    linkedMilestoneRelease: 'Full amortization of mobilization advance',
    physicalDocumentLocation: 'Corporate Treasury Vault #2 - Shelf B'
  },
  {
    id: 'BG-003',
    instrumentNumber: 'BG-AHLI-2023-1120',
    contractId: 'CNT-002',
    bondType: 'PERFORMANCE_BOND',
    title: 'Performance Guarantee - Sohar Polymer Project (10%)',
    issuingBank: 'Ahli Bank SAOG',
    beneficiaryName: 'Sohar Advanced Chemicals Company LLC',
    instrumentValue: 4200000,
    currency: 'OMR',
    percentageOfContract: 10,
    issueDate: '2023-01-10',
    originalExpiryDate: '2025-05-31',
    currentExpiryDate: '2025-07-31',
    claimPeriodDays: 30,
    renewalAlertDaysBefore: 60,
    marginCashCollateralHeld: 420000,
    bankCommissionFeeAnnualPct: 0.70,
    status: 'ACTIVE',
    linkedMilestoneRelease: 'Commercial Operations Acceptance Certificate',
    physicalDocumentLocation: 'Corporate Treasury Vault #1 - Shelf A'
  }
];

const INITIAL_VARIATIONS: VariationOrderRecord[] = [
  {
    id: 'VO-001',
    voNumber: 'VO-MCT-001',
    contractId: 'CNT-001',
    title: 'Additional Basement Secant Piles & Dewatering Wells for West Boundary',
    originatingParty: 'SITE_CONDITION',
    dateInitiated: '2023-04-12',
    dateApproved: '2023-05-20',
    contractorProposedAmount: 385000,
    engineerEvaluatedAmount: 345000,
    finalAgreedAmount: 345000,
    extensionOfTimeDaysGranted: 14,
    scopeDescription: 'Unexpected high water table and fractured sandstone strata required 42 additional secant piles (800mm dia) and continuous deep-well pumping.',
    technicalJustification: 'Geotechnical investigation anomaly discovered during initial bulk excavation.',
    boqItemsAddedCount: 3,
    status: 'EXECUTED',
    ipcIncorporatedNumber: 'IPC-03'
  },
  {
    id: 'VO-002',
    voNumber: 'VO-MCT-002',
    contractId: 'CNT-001',
    title: 'Sky Infinity Pool Structural Modification & High-Load Glass Flooring',
    originatingParty: 'CLIENT_REQUEST',
    dateInitiated: '2023-11-15',
    dateApproved: '2024-01-10',
    contractorProposedAmount: 580000,
    engineerEvaluatedAmount: 520000,
    finalAgreedAmount: 520000,
    extensionOfTimeDaysGranted: 21,
    scopeDescription: 'Redesign of Level 38 roof terrace infinity pool cantilever structure with laminated structural glass flooring and dedicated surge tank.',
    technicalJustification: 'Employer luxury upgrade directive to enhance penthouse asset valuation.',
    boqItemsAddedCount: 5,
    status: 'EXECUTED',
    ipcIncorporatedNumber: 'IPC-06'
  },
  {
    id: 'VO-003',
    voNumber: 'VO-MCT-003',
    contractId: 'CNT-001',
    title: 'Smart Home Automation & KNX Low-Voltage Infrastructure Upgrade',
    originatingParty: 'CLIENT_REQUEST',
    dateInitiated: '2024-04-02',
    dateApproved: '2024-05-28',
    contractorProposedAmount: 620000,
    engineerEvaluatedAmount: 585000,
    finalAgreedAmount: 585000,
    extensionOfTimeDaysGranted: 0,
    scopeDescription: 'Integrated KNX lighting, motorized blinds, and smart energy metering for 180 luxury residential apartments.',
    technicalJustification: 'Green building sustainability rating enhancement (LEED Gold compliance).',
    boqItemsAddedCount: 8,
    status: 'EXECUTED',
    ipcIncorporatedNumber: 'IPC-08'
  },
  {
    id: 'VO-004',
    voNumber: 'VO-MCT-004',
    contractId: 'CNT-001',
    title: 'Façade LED Architectural Kinetic Lighting & Media Mesh Matrix',
    originatingParty: 'CLIENT_REQUEST',
    dateInitiated: '2024-07-10',
    contractorProposedAmount: 480000,
    engineerEvaluatedAmount: 420000,
    finalAgreedAmount: 0,
    extensionOfTimeDaysGranted: 10,
    scopeDescription: 'Installation of programmable exterior architectural lighting strips along the 38-storey vertical fin profiles.',
    technicalJustification: 'Landmark nighttime aesthetic illumination requested by client board.',
    boqItemsAddedCount: 4,
    status: 'UNDER_ENGINEER_REVIEW'
  }
];

const INITIAL_CLAIMS: ContractClaimRecord[] = [
  {
    id: 'CLM-001',
    claimNumber: 'CLM-MCT-2023-01',
    contractId: 'CNT-001',
    title: 'Delay & Prolongation Costs due to Late Handover of Marine Frontage Sector',
    fidicClauseReference: 'FIDIC Clause 2.1 [Right of Access to the Site] & Clause 20.1 [Contractor Claims]',
    claimCategory: 'DELAYED_DRAWINGS_ACCESS',
    noticeOfClaimDate: '2023-03-28',
    fullParticularsSubmissionDate: '2023-05-09',
    claimedFinancialQuantum: 340000,
    claimedTimeExtensionDays: 45,
    engineerDeterminedAmount: 210000,
    engineerDeterminedEOTDays: 32,
    narrativeSummary: 'Municipal permit clearances for marine shoreline buffer zone were delayed by 45 days, preventing mobilization of heavy piling rigs.',
    status: 'DETERMINED_SETTLED',
    disputeAdjudicationBoardInvolved: false
  },
  {
    id: 'CLM-002',
    claimNumber: 'CLM-MCT-2024-02',
    contractId: 'CNT-001',
    title: 'Global Supply Chain Freight Surcharge on High-Grade Structural Steel',
    fidicClauseReference: 'FIDIC Clause 13.7 [Adjustments for Changes in Legislation & Costs]',
    claimCategory: 'PRICE_MATERIAL_ESCALATION',
    noticeOfClaimDate: '2024-02-14',
    fullParticularsSubmissionDate: '2024-03-25',
    claimedFinancialQuantum: 275000,
    claimedTimeExtensionDays: 0,
    engineerDeterminedAmount: 185000,
    engineerDeterminedEOTDays: 0,
    narrativeSummary: 'Maritime rerouting and war risk insurance surcharges increased container freight rates for imported facade mullions by 140%.',
    status: 'UNDER_DETERMINATION',
    disputeAdjudicationBoardInvolved: false
  }
];

const INITIAL_EOTS: ExtensionOfTimeRecord[] = [
  {
    id: 'EOT-001',
    eotNumber: 'EOT-MCT-01',
    contractId: 'CNT-001',
    eventDescription: 'Late site access to shoreline boundary and municipal clearance delays',
    criticalPathActivityAffected: 'Basement Diaphragm Piling & Bulk Excavation',
    eventStartDate: '2023-03-01',
    eventEndDate: '2023-04-15',
    delayDaysClaimed: 45,
    delayDaysRecommendedByEngineer: 32,
    delayDaysApprovedByEmployer: 32,
    originalCompletionDate: '2025-08-31',
    revisedContractualCompletionDate: '2025-10-02',
    associatedProlongationCost: 210000,
    status: 'APPROVED'
  },
  {
    id: 'EOT-002',
    eotNumber: 'EOT-MCT-02',
    contractId: 'CNT-001',
    eventDescription: 'VO-002 Sky Infinity Pool Cantilever Structural Redesign and Reinforcement detailing',
    criticalPathActivityAffected: 'Level 38 Superstructure Roof Slabs & Enclosure',
    eventStartDate: '2023-11-15',
    eventEndDate: '2024-01-10',
    delayDaysClaimed: 28,
    delayDaysRecommendedByEngineer: 21,
    delayDaysApprovedByEmployer: 21,
    originalCompletionDate: '2025-10-02',
    revisedContractualCompletionDate: '2025-11-15',
    associatedProlongationCost: 145000,
    status: 'APPROVED'
  }
];

const INITIAL_FINAL_ACCOUNTS: FinalAccountStatement[] = [
  {
    id: 'FA-001',
    finalAccountNumber: 'FA-CON-2022-OM-004',
    contractId: 'CNT-003',
    originalContractSum: 16800000,
    netVariationsSummarySum: 350000,
    provisionalSumsReconciliation: -45000,
    claimsAndEotSettlementSum: 120000,
    totalFinalAgreedContractSum: 17225000,
    totalGrossIpcCertifiedToDate: 16400000,
    finalBalancePayableToContractor: 825000,
    contractorSignedAgreementDate: '2024-06-15',
    employerSignedAgreementDate: '2024-06-28',
    dateClosed: '2024-07-10',
    status: 'MUTUALLY_SIGNED'
  }
];

const INITIAL_COMPLETIONS: ContractCompletionCertificate[] = [
  {
    id: 'TOC-001',
    completionType: 'TAKING_OVER_CERTIFICATE_TOC',
    certificateNumber: 'TOC-2024-OM-004',
    contractId: 'CNT-003',
    effectiveTakingOverDate: '2024-06-30',
    snagPunchListTotalCount: 84,
    snagPunchListClearedCount: 84,
    dlpWarrantyStartDate: '2024-07-01',
    dlpWarrantyEndDate: '2025-06-30',
    supervisingEngineerSignature: 'Renardet SA & Partners (Eng. K. Al-Busaidi)',
    clientRepresentativeSignature: 'SEZAD Duqm Projects Director',
    status: 'ALL_SNAGS_CLEARED'
  }
];

const INITIAL_RETENTION_RELEASES: RetentionReleaseRecord[] = [
  {
    id: 'RET-001',
    releaseNumber: 'RET-REL-2024-01',
    contractId: 'CNT-003',
    releaseStage: 'STAGE_1_TOC_50_PERCENT',
    totalRetentionWithheld: 840000,
    amountBeingReleased: 420000,
    deductionsForUnrepairedDefects: 0,
    netPaymentDisbursed: 420000,
    bankTransferRef: 'OM-RTGS-BM-2024-99812',
    releaseDate: '2024-07-15',
    approvedBy: 'Client Chief Financial Officer',
    status: 'DISBURSED'
  }
];

const INITIAL_CLOSEOUTS: ContractCloseoutFormalRecord[] = [
  {
    id: 'CLS-001',
    closeoutNumber: 'CLS-2024-OM-004',
    contractId: 'CNT-003',
    asBuiltDrawingsHandedOver: true,
    operationAndMaintenanceManualsDelivered: true,
    municipalityCompletionPermitsReceived: true,
    subcontractorFinalAccountsSettled: true,
    bankGuaranteesReturnedCancelled: false,
    finalRetentionFullyReleased: false,
    taxClearanceCertificateAttached: true,
    formalCloseoutDate: '2024-07-20',
    archivalStorageReference: 'ARCHIVE-OM-2024-BOX-44B',
    closeoutStatus: 'IN_PROGRESS'
  }
];

// ==========================================
// CONTEXT CREATION & HOOKS
// ==========================================

interface ConstructionStoreContextType {
  contracts: ContractMaster[];
  clientAgreements: ClientContractAgreement[];
  subcontracts: SubcontractPackage[];
  contractTerms: ContractClauseTerm[];
  boqItems: BOQItem[];
  boqRevisions: BOQRevision[];
  sites: SiteProfile[];
  workOrders: SiteWorkOrder[];
  milestones: ProjectMilestone[];
  siteLogs: SiteDailyActivityLog[];
  ipcs: InterimPaymentCertificate[];
  progressInvoices: ProgressTaxInvoice[];
  bonds: BondGuaranteeRecord[];
  variations: VariationOrderRecord[];
  claims: ContractClaimRecord[];
  eots: ExtensionOfTimeRecord[];
  finalAccounts: FinalAccountStatement[];
  completions: ContractCompletionCertificate[];
  retentionReleases: RetentionReleaseRecord[];
  closeouts: ContractCloseoutFormalRecord[];
  kpis: ConstructionModuleKPIs;
  selectedContractId: string;
  setSelectedContractId: (id: string) => void;
  currency: string;
  // CRUD & Action methods
  addContract: (contract: Omit<ContractMaster, 'id'>) => void;
  addSubcontract: (subcontract: Omit<SubcontractPackage, 'id'>) => void;
  addBOQItem: (item: Omit<BOQItem, 'id'>) => void;
  addBOQRevision: (rev: Omit<BOQRevision, 'id'>) => void;
  addSiteWorkOrder: (order: Omit<SiteWorkOrder, 'id'>) => void;
  addSiteDailyLog: (log: Omit<SiteDailyActivityLog, 'id'>) => void;
  createIPC: (ipc: Omit<InterimPaymentCertificate, 'id'>) => void;
  approveIPC: (ipcId: string) => void;
  addBondGuarantee: (bond: Omit<BondGuaranteeRecord, 'id'>) => void;
  addVariationOrder: (vo: Omit<VariationOrderRecord, 'id'>) => void;
  approveVariationOrder: (voId: string, approvedAmount: number) => void;
  addContractClaim: (claim: Omit<ContractClaimRecord, 'id'>) => void;
  addExtensionOfTime: (eot: Omit<ExtensionOfTimeRecord, 'id'>) => void;
  addFinalAccount: (fa: Omit<FinalAccountStatement, 'id'>) => void;
  addRetentionRelease: (rel: Omit<RetentionReleaseRecord, 'id'>) => void;
}

const ConstructionContext = createContext<ConstructionStoreContextType | null>(null);

export const ConstructionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contracts, setContracts] = useState<ContractMaster[]>(INITIAL_CONTRACTS);
  const [clientAgreements, setClientAgreements] = useState<ClientContractAgreement[]>(INITIAL_CLIENT_AGREEMENTS);
  const [subcontracts, setSubcontracts] = useState<SubcontractPackage[]>(INITIAL_SUBCONTRACTS);
  const [contractTerms, setContractTerms] = useState<ContractClauseTerm[]>(INITIAL_CONTRACT_TERMS);
  const [boqItems, setBoqItems] = useState<BOQItem[]>(INITIAL_BOQ_ITEMS);
  const [boqRevisions, setBoqRevisions] = useState<BOQRevision[]>(INITIAL_BOQ_REVISIONS);
  const [sites, setSites] = useState<SiteProfile[]>(INITIAL_SITES);
  const [workOrders, setWorkOrders] = useState<SiteWorkOrder[]>(INITIAL_WORK_ORDERS);
  const [milestones, setMilestones] = useState<ProjectMilestone[]>(INITIAL_MILESTONES);
  const [siteLogs, setSiteLogs] = useState<SiteDailyActivityLog[]>(INITIAL_SITE_LOGS);
  const [ipcs, setIpcs] = useState<InterimPaymentCertificate[]>(INITIAL_IPCS);
  const [progressInvoices, setProgressInvoices] = useState<ProgressTaxInvoice[]>(INITIAL_PROGRESS_INVOICES);
  const [bonds, setBonds] = useState<BondGuaranteeRecord[]>(INITIAL_BONDS);
  const [variations, setVariations] = useState<VariationOrderRecord[]>(INITIAL_VARIATIONS);
  const [claims, setClaims] = useState<ContractClaimRecord[]>(INITIAL_CLAIMS);
  const [eots, setEots] = useState<ExtensionOfTimeRecord[]>(INITIAL_EOTS);
  const [finalAccounts, setFinalAccounts] = useState<FinalAccountStatement[]>(INITIAL_FINAL_ACCOUNTS);
  const [completions, setCompletions] = useState<ContractCompletionCertificate[]>(INITIAL_COMPLETIONS);
  const [retentionReleases, setRetentionReleases] = useState<RetentionReleaseRecord[]>(INITIAL_RETENTION_RELEASES);
  const [closeouts, setCloseouts] = useState<ContractCloseoutFormalRecord[]>(INITIAL_CLOSEOUTS);

  const [selectedContractId, setSelectedContractId] = useState<string>('CNT-001');
  const currency = 'OMR';

  // Compute live KPIs
  const kpis: ConstructionModuleKPIs = useMemo(() => {
    const totalContractVal = contracts.reduce((acc, c) => acc + c.revisedContractValue, 0);
    const totalWip = ipcs.reduce((acc, i) => acc + i.grossWorkExecutedThisPeriod, 0);
    const totalRetention = contracts.reduce((acc, c) => acc + (c.revisedContractValue * 0.05), 0);
    const pendingVOs = variations.filter(v => v.status === 'UNDER_ENGINEER_REVIEW' || v.status === 'PROPOSED').reduce((acc, v) => acc + v.contractorProposedAmount, 0);
    const bondsExposure = bonds.filter(b => b.status === 'ACTIVE').reduce((acc, b) => acc + b.instrumentValue, 0);
    const claimsExposure = claims.filter(c => c.status !== 'DETERMINED_SETTLED').reduce((acc, c) => acc + c.claimedFinancialQuantum, 0);

    return {
      activeContractsCount: contracts.filter(c => c.status === 'ACTIVE').length,
      totalPortfolioContractValue: totalContractVal,
      totalCertifiedWipThisMonth: totalWip,
      cumulativeRetentionHeldInPortfolio: totalRetention,
      pendingVariationOrdersValue: pendingVOs,
      activeBondsExposureValue: bondsExposure,
      averagePortfolioCostPerformanceIndexCPI: 1.06,
      averagePortfolioSchedulePerformanceIndexSPI: 0.98,
      activeClaimsTotalExposure: claimsExposure
    };
  }, [contracts, ipcs, variations, bonds, claims]);

  // Action implementations
  const addContract = (contractData: Omit<ContractMaster, 'id'>) => {
    const newId = `CNT-${(contracts.length + 1).toString().padStart(3, '0')}`;
    const newContract: ContractMaster = {
      ...contractData,
      id: newId
    };
    setContracts(prev => [newContract, ...prev]);
  };

  const addSubcontract = (subcontractData: Omit<SubcontractPackage, 'id'>) => {
    const newId = `SUB-${(subcontracts.length + 1).toString().padStart(3, '0')}`;
    const newSub: SubcontractPackage = {
      ...subcontractData,
      id: newId
    };
    setSubcontracts(prev => [newSub, ...prev]);
  };

  const addBOQItem = (itemData: Omit<BOQItem, 'id'>) => {
    const newId = `BOQ-${(boqItems.length + 1).toString().padStart(3, '0')}`;
    const newItem: BOQItem = {
      ...itemData,
      id: newId
    };
    setBoqItems(prev => [newItem, ...prev]);
  };

  const addBOQRevision = (revData: Omit<BOQRevision, 'id'>) => {
    const newId = `BREV-${(boqRevisions.length + 1).toString().padStart(3, '0')}`;
    const newRev: BOQRevision = {
      ...revData,
      id: newId
    };
    setBoqRevisions(prev => [newRev, ...prev]);
  };

  const addSiteWorkOrder = (orderData: Omit<SiteWorkOrder, 'id'>) => {
    const newId = `SWO-${(workOrders.length + 1).toString().padStart(3, '0')}`;
    const newOrder: SiteWorkOrder = {
      ...orderData,
      id: newId
    };
    setWorkOrders(prev => [newOrder, ...prev]);
  };

  const addSiteDailyLog = (logData: Omit<SiteDailyActivityLog, 'id'>) => {
    const newId = `DSR-${(siteLogs.length + 1).toString().padStart(3, '0')}`;
    const newLog: SiteDailyActivityLog = {
      ...logData,
      id: newId
    };
    setSiteLogs(prev => [newLog, ...prev]);
  };

  const createIPC = (ipcData: Omit<InterimPaymentCertificate, 'id'>) => {
    const newId = `IPC-${(ipcs.length + 1).toString().padStart(3, '0')}`;
    const newIpc: InterimPaymentCertificate = {
      ...ipcData,
      id: newId
    };
    setIpcs(prev => [newIpc, ...prev]);
  };

  const approveIPC = (ipcId: string) => {
    setIpcs(prev =>
      prev.map(i =>
        i.id === ipcId
          ? { ...i, status: 'CERTIFIED' as const, certificationDate: new Date().toISOString().split('T')[0] }
          : i
      )
    );
  };

  const addBondGuarantee = (bondData: Omit<BondGuaranteeRecord, 'id'>) => {
    const newId = `BG-${(bonds.length + 1).toString().padStart(3, '0')}`;
    const newBond: BondGuaranteeRecord = {
      ...bondData,
      id: newId
    };
    setBonds(prev => [newBond, ...prev]);
  };

  const addVariationOrder = (voData: Omit<VariationOrderRecord, 'id'>) => {
    const newId = `VO-${(variations.length + 1).toString().padStart(3, '0')}`;
    const newVo: VariationOrderRecord = {
      ...voData,
      id: newId
    };
    setVariations(prev => [newVo, ...prev]);
  };

  const approveVariationOrder = (voId: string, approvedAmount: number) => {
    setVariations(prev =>
      prev.map(v =>
        v.id === voId
          ? {
              ...v,
              status: 'APPROVED' as const,
              finalAgreedAmount: approvedAmount,
              dateApproved: new Date().toISOString().split('T')[0]
            }
          : v
      )
    );
  };

  const addContractClaim = (claimData: Omit<ContractClaimRecord, 'id'>) => {
    const newId = `CLM-${(claims.length + 1).toString().padStart(3, '0')}`;
    const newClaim: ContractClaimRecord = {
      ...claimData,
      id: newId
    };
    setClaims(prev => [newClaim, ...prev]);
  };

  const addExtensionOfTime = (eotData: Omit<ExtensionOfTimeRecord, 'id'>) => {
    const newId = `EOT-${(eots.length + 1).toString().padStart(3, '0')}`;
    const newEot: ExtensionOfTimeRecord = {
      ...eotData,
      id: newId
    };
    setEots(prev => [newEot, ...prev]);
  };

  const addFinalAccount = (faData: Omit<FinalAccountStatement, 'id'>) => {
    const newId = `FA-${(finalAccounts.length + 1).toString().padStart(3, '0')}`;
    const newFa: FinalAccountStatement = {
      ...faData,
      id: newId
    };
    setFinalAccounts(prev => [newFa, ...prev]);
  };

  const addRetentionRelease = (relData: Omit<RetentionReleaseRecord, 'id'>) => {
    const newId = `RET-${(retentionReleases.length + 1).toString().padStart(3, '0')}`;
    const newRel: RetentionReleaseRecord = {
      ...relData,
      id: newId
    };
    setRetentionReleases(prev => [newRel, ...prev]);
  };

  return (
    <ConstructionContext.Provider
      value={{
        contracts,
        clientAgreements,
        subcontracts,
        contractTerms,
        boqItems,
        boqRevisions,
        sites,
        workOrders,
        milestones,
        siteLogs,
        ipcs,
        progressInvoices,
        bonds,
        variations,
        claims,
        eots,
        finalAccounts,
        completions,
        retentionReleases,
        closeouts,
        kpis,
        selectedContractId,
        setSelectedContractId,
        currency,
        addContract,
        addSubcontract,
        addBOQItem,
        addBOQRevision,
        addSiteWorkOrder,
        addSiteDailyLog,
        createIPC,
        approveIPC,
        addBondGuarantee,
        addVariationOrder,
        approveVariationOrder,
        addContractClaim,
        addExtensionOfTime,
        addFinalAccount,
        addRetentionRelease
      }}
    >
      {children}
    </ConstructionContext.Provider>
  );
};

export const useConstructionStore = () => {
  const context = useContext(ConstructionContext);
  if (!context) {
    throw new Error('useConstructionStore must be used within a ConstructionProvider');
  }
  return context;
};
