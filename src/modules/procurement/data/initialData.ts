import {
  ProcurementPlan,
  PurchaseForecastItem,
  ProcurementBudgetCategory,
  PurchaseRequisition,
  RequestForQuotation,
  SupplierQuotation,
  SupplierSelectionRecord,
  PurchaseOrder,
  BlanketPurchaseOrder,
  GoodsReceiptNote,
  ReceiptInspectionRecord,
  PurchaseInvoice,
  PurchaseReturn,
  SupplierDebitNote,
  SupplierMaster,
  SupplierContract,
  SupplierEvaluationRecord,
  ServiceEntrySheet
} from '../types';

export const initialSuppliers: SupplierMaster[] = [
  {
    id: 'supp-01',
    supplierCode: 'VND-OM-1001',
    name: 'Oman Cables Industry SAOG',
    commercialRegistrationNo: 'CR-1049281',
    taxIdentificationNumber: 'OM1100028481',
    category: 'Raw Materials',
    rating: 'Tier 1 Strategic',
    country: 'Oman',
    city: 'Rusayl Industrial City, Muscat',
    address: 'Plot 42, Road 3, Rusayl, Oman',
    primaryContactName: 'Khalfan Al-Harthy (Enterprise Key Account)',
    primaryEmail: 'khalfan.harthy@omancables.com',
    primaryPhone: '+968 2444 6100',
    paymentTerms: 'Net 60 Days',
    currency: 'OMR',
    bankName: 'Bank Muscat SAOG',
    bankAccountNumber: '0315-088192-001',
    bankIban: 'OM68BMUS0315088192001001',
    bankSwiftCode: 'BMUSOMRX',
    creditLimitOMR: 450000,
    outstandingPayableOMR: 128450,
    qualityScore: 98,
    onTimeDeliveryRate: 96,
    esgScore: 92,
    isOmaniSME: false,
    activeContractsCount: 2,
    status: 'Active',
    onboardingDate: '2022-01-15'
  },
  {
    id: 'supp-02',
    supplierCode: 'VND-OM-1002',
    name: 'Voltamp Transformers Oman LLC',
    commercialRegistrationNo: 'CR-2091844',
    taxIdentificationNumber: 'OM1100039182',
    category: 'Capital Equipment',
    rating: 'Tier 1 Strategic',
    country: 'Oman',
    city: 'Sohar Industrial Estate',
    address: 'Phase 2, Heavy Industry Zone, Sohar',
    primaryContactName: 'Eng. Tariq Al-Balushi',
    primaryEmail: 'tariq.b@voltamptransformers.com',
    primaryPhone: '+968 2675 1900',
    paymentTerms: 'Net 45 Days',
    currency: 'OMR',
    bankName: 'National Bank of Oman (NBO)',
    bankAccountNumber: '1099-281944-002',
    bankIban: 'OM44NBOM1099281944002001',
    bankSwiftCode: 'NBOMOMRX',
    creditLimitOMR: 600000,
    outstandingPayableOMR: 215000,
    qualityScore: 95,
    onTimeDeliveryRate: 92,
    esgScore: 88,
    isOmaniSME: false,
    activeContractsCount: 1,
    status: 'Active',
    onboardingDate: '2021-06-10'
  },
  {
    id: 'supp-03',
    supplierCode: 'VND-OM-1003',
    name: 'Bahwan IT Solutions & Services',
    commercialRegistrationNo: 'CR-1009283',
    taxIdentificationNumber: 'OM1100010992',
    category: 'IT & Telecom',
    rating: 'Tier 2 Preferred',
    country: 'Oman',
    city: 'Al Khuwair, Muscat',
    address: 'Bahwan Complex, Al Khuwair, Muscat',
    primaryContactName: 'Sanjay Sharma (Director Enterprise Solutions)',
    primaryEmail: 'sanjay.sharma@bahwanit.com',
    primaryPhone: '+968 2470 0000',
    paymentTerms: 'Net 30 Days',
    currency: 'OMR',
    bankName: 'Ahli Bank SAOG',
    bankAccountNumber: '0101-998811-001',
    bankIban: 'OM22AHLI0101998811001001',
    bankSwiftCode: 'AHLIOMRX',
    creditLimitOMR: 250000,
    outstandingPayableOMR: 48900,
    qualityScore: 94,
    onTimeDeliveryRate: 98,
    esgScore: 85,
    isOmaniSME: false,
    activeContractsCount: 3,
    status: 'Active',
    onboardingDate: '2020-03-20'
  },
  {
    id: 'supp-04',
    supplierCode: 'VND-OM-1004',
    name: 'Al-Madina Logistics Services SAOC',
    commercialRegistrationNo: 'CR-1908221',
    taxIdentificationNumber: 'OM1100091823',
    category: 'Logistics',
    rating: 'Tier 2 Preferred',
    country: 'Oman',
    city: 'Barkaa Logistics Hub',
    address: 'Muscat Dry Port & Logistics Park, Barkaa',
    primaryContactName: 'Nasir Al-Maawali',
    primaryEmail: 'nasir.m@almadinalogistics.om',
    primaryPhone: '+968 2450 8800',
    paymentTerms: 'Net 30 Days',
    currency: 'OMR',
    bankName: 'Bank Sohar International',
    bankAccountNumber: '0020-449911-001',
    bankIban: 'OM19BKSI0020449911001001',
    bankSwiftCode: 'BKSIOMRX',
    creditLimitOMR: 150000,
    outstandingPayableOMR: 19400,
    qualityScore: 91,
    onTimeDeliveryRate: 94,
    esgScore: 87,
    isOmaniSME: false,
    activeContractsCount: 1,
    status: 'Active',
    onboardingDate: '2022-09-01'
  },
  {
    id: 'supp-05',
    supplierCode: 'VND-OM-1005',
    name: 'Riyada Gulf Smart Tech SME LLC',
    commercialRegistrationNo: 'CR-3829104',
    taxIdentificationNumber: 'OM1100078219',
    category: 'Facilities & Services',
    rating: 'Tier 2 Preferred',
    country: 'Oman',
    city: 'Knowledge Oasis Muscat (KOM)',
    address: 'Building 4, Office 201, KOM, Muscat',
    primaryContactName: 'Aisha Al-Riyami (Managing Director)',
    primaryEmail: 'aisha.riyami@riyadagulftech.om',
    primaryPhone: '+968 9988 1234',
    paymentTerms: 'Net 15 Days (SME Fast-Track)',
    currency: 'OMR',
    bankName: 'Oman Arab Bank (OAB)',
    bankAccountNumber: '2100-334455-001',
    bankIban: 'OM55OABO2100334455001001',
    bankSwiftCode: 'OABOOMRX',
    creditLimitOMR: 80000,
    outstandingPayableOMR: 12500,
    qualityScore: 96,
    onTimeDeliveryRate: 95,
    esgScore: 94,
    isOmaniSME: true,
    activeContractsCount: 1,
    status: 'Active',
    onboardingDate: '2023-04-12'
  }
];

export const initialProcurementPlans: ProcurementPlan[] = [
  {
    id: 'plan-2026-01',
    planNumber: 'PLAN-FY2026-HQ',
    planTitle: 'FY2026 Enterprise Capital & Operational Procurement Schedule',
    fiscalYear: 2026,
    department: 'Central Procurement & Supply Chain',
    preparedBy: 'Mazin Al-Hinai (Chief Procurement Officer)',
    approvalDate: '2025-12-28',
    totalEstimatedBudgetOMR: 2850000,
    committedAmountOMR: 1140000,
    utilizedAmountOMR: 620000,
    status: 'Active',
    remarks: 'Approved by Executive Management Committee under Board Resolution B-2025/11.',
    lines: [
      {
        id: 'pline-01',
        category: 'Raw Materials',
        itemDescription: 'High-Voltage XLPE Underground Copper Cables (11kV & 33kV)',
        estimatedQuantity: 24000,
        unitOfMeasure: 'Meters',
        estimatedUnitPriceOMR: 35.0,
        estimatedTotalOMR: 840000,
        targetQuarter: 'Q1',
        targetMonth: '2026-02',
        procurementMethod: 'Direct Framework Agreement',
        linkedDepartment: 'Infrastructure & Projects',
        status: 'Committed'
      },
      {
        id: 'pline-02',
        category: 'Capital Equipment',
        itemDescription: '1500 kVA Step-Down Industrial Power Distribution Transformers',
        estimatedQuantity: 12,
        unitOfMeasure: 'Units',
        estimatedUnitPriceOMR: 38000.0,
        estimatedTotalOMR: 456000,
        targetQuarter: 'Q2',
        targetMonth: '2026-05',
        procurementMethod: 'Selective RFQ',
        linkedDepartment: 'Engineering Operations',
        status: 'In Sourcing'
      },
      {
        id: 'pline-03',
        category: 'IT & Telecom',
        itemDescription: 'Enterprise Tier-3 Cloud Server Cluster & High-Density SAN Storage Expansion',
        estimatedQuantity: 1,
        unitOfMeasure: 'Package',
        estimatedUnitPriceOMR: 280000.0,
        estimatedTotalOMR: 280000,
        targetQuarter: 'Q1',
        targetMonth: '2026-03',
        procurementMethod: 'Open Public Tender',
        linkedDepartment: 'Information Technology',
        status: 'Completed'
      },
      {
        id: 'pline-04',
        category: 'Facilities & Services',
        itemDescription: 'Corporate Headquarters Annual Smart Energy & Facility Maintenance',
        estimatedQuantity: 12,
        unitOfMeasure: 'Months',
        estimatedUnitPriceOMR: 8500.0,
        estimatedTotalOMR: 102000,
        targetQuarter: 'Q1',
        targetMonth: '2026-01',
        procurementMethod: 'Direct Framework Agreement',
        linkedDepartment: 'Administration & HR',
        status: 'Committed'
      }
    ]
  }
];

export const initialPurchaseForecasts: PurchaseForecastItem[] = [
  {
    id: 'fc-01',
    itemCode: 'MAT-ELC-11KV',
    itemName: '11kV Cu XLPE Underground Cable',
    category: 'Raw Materials',
    currentStockLevel: 4200,
    reorderPoint: 5000,
    leadTimeDays: 45,
    historicalRunRateMonthly: 1800,
    forecastQ1Qty: 5400,
    forecastQ2Qty: 6200,
    forecastQ3Qty: 5800,
    forecastQ4Qty: 4900,
    recommendedOrderQty: 6000,
    estimatedCostOMR: 210000,
    confidenceScore: 94
  },
  {
    id: 'fc-02',
    itemCode: 'EQP-TRF-1500KVA',
    itemName: 'Industrial Distribution Transformer 1500 kVA',
    category: 'Capital Equipment',
    currentStockLevel: 2,
    reorderPoint: 3,
    leadTimeDays: 90,
    historicalRunRateMonthly: 1,
    forecastQ1Qty: 3,
    forecastQ2Qty: 4,
    forecastQ3Qty: 3,
    forecastQ4Qty: 2,
    recommendedOrderQty: 4,
    estimatedCostOMR: 152000,
    confidenceScore: 89
  },
  {
    id: 'fc-03',
    itemCode: 'IT-SVR-BLADE-01',
    itemName: 'Enterprise Dual Xeon Server Blades',
    category: 'IT & Telecom',
    currentStockLevel: 4,
    reorderPoint: 4,
    leadTimeDays: 30,
    historicalRunRateMonthly: 2,
    forecastQ1Qty: 6,
    forecastQ2Qty: 6,
    forecastQ3Qty: 4,
    forecastQ4Qty: 4,
    recommendedOrderQty: 8,
    estimatedCostOMR: 36000,
    confidenceScore: 92
  }
];

export const initialBudgetCategories: ProcurementBudgetCategory[] = [
  {
    id: 'bcat-01',
    categoryCode: 'CAPEX-PROJ',
    categoryName: 'Capital Infrastructure & Plant Projects',
    department: 'Engineering & Infrastructure',
    fiscalYear: 2026,
    allocatedBudgetOMR: 1400000,
    committedPR_PO_OMR: 680000,
    invoicedActualOMR: 310000,
    remainingBudgetOMR: 410000,
    utilizationPercentage: 70.7,
    alertThresholdPercentage: 85.0
  },
  {
    id: 'bcat-02',
    categoryCode: 'OPEX-RAW',
    categoryName: 'Direct Raw Materials & Consumables',
    department: 'Manufacturing Operations',
    fiscalYear: 2026,
    allocatedBudgetOMR: 950000,
    committedPR_PO_OMR: 420000,
    invoicedActualOMR: 280000,
    remainingBudgetOMR: 250000,
    utilizationPercentage: 73.6,
    alertThresholdPercentage: 85.0
  },
  {
    id: 'bcat-03',
    categoryCode: 'IT-DIGITAL',
    categoryName: 'Digital Transformation & Hardware Assets',
    department: 'Information Technology',
    fiscalYear: 2026,
    allocatedBudgetOMR: 350000,
    committedPR_PO_OMR: 185000,
    invoicedActualOMR: 95000,
    remainingBudgetOMR: 70000,
    utilizationPercentage: 80.0,
    alertThresholdPercentage: 90.0
  },
  {
    id: 'bcat-04',
    categoryCode: 'CORP-SERVICES',
    categoryName: 'General Facilities, Logistics & Professional Services',
    department: 'Administration & HR',
    fiscalYear: 2026,
    allocatedBudgetOMR: 150000,
    committedPR_PO_OMR: 55000,
    invoicedActualOMR: 35000,
    remainingBudgetOMR: 60000,
    utilizationPercentage: 60.0,
    alertThresholdPercentage: 80.0
  }
];

export const initialPurchaseRequisitions: PurchaseRequisition[] = [
  {
    id: 'pr-2026-001',
    prNumber: 'PR-2026-0089',
    requestDate: '2026-02-10',
    requiredDeliveryDate: '2026-03-25',
    requestorId: 'emp-104',
    requestorName: 'Eng. Salim Al-Rawahi',
    department: 'Engineering & Projects',
    costCenter: 'CC-ENG-401',
    projectCode: 'PROJ-SOHAR-SUBSTATION',
    priority: 'High',
    currency: 'OMR',
    totalEstimatedAmount: 140000,
    totalEstimatedAmountOMR: 140000,
    status: 'Approved',
    assignedBuyer: 'Fatma Al-Hasani (Lead Buyer)',
    purpose: 'Procurement of medium-voltage underground cables for the Sohar Substation Upgrade Project Phase 2.',
    justification: 'Critical path milestone requirement under EPC Client agreement SLA penalty clause.',
    approverComments: 'Budget verified against Project Capex line CC-ENG-401. Approved.',
    approvedBy: 'Mazin Al-Hinai (CPO)',
    approvedDate: '2026-02-12',
    convertedPoNumber: 'PO-2026-0142',
    attachedDocCount: 3,
    lines: [
      {
        id: 'prline-01',
        itemCode: 'MAT-ELC-11KV',
        itemDescription: '11kV Cu XLPE 3-Core 300mm2 Armored Underground Cable',
        category: 'Raw Materials',
        quantity: 4000,
        unitOfMeasure: 'Meters',
        estimatedUnitPrice: 35.0,
        lineTotal: 140000,
        requiredByDate: '2026-03-25',
        glAccountCode: '1410-02-001',
        costCenter: 'CC-ENG-401',
        preferredSupplierId: 'supp-01',
        preferredSupplierName: 'Oman Cables Industry SAOG'
      }
    ]
  },
  {
    id: 'pr-2026-002',
    prNumber: 'PR-2026-0092',
    requestDate: '2026-02-14',
    requiredDeliveryDate: '2026-04-10',
    requestorId: 'emp-208',
    requestorName: 'Hamood Al-Kindi (IT Systems Lead)',
    department: 'Information Technology',
    costCenter: 'CC-IT-101',
    projectCode: 'PROJ-CLOUD-HYBRID-26',
    priority: 'Urgent / Critical',
    currency: 'OMR',
    totalEstimatedAmount: 64000,
    totalEstimatedAmountOMR: 64000,
    status: 'Pending Approval',
    assignedBuyer: 'Rashid Al-Habsi',
    purpose: 'Procurement of High-Throughput Core Switches and SAN Storage Blades for DR Site redundancy.',
    justification: 'Mandatory CBO Cybersecurity & Business Continuity Compliance Audit recommendation.',
    lines: [
      {
        id: 'prline-02',
        itemCode: 'IT-NET-SW-48P',
        itemDescription: 'Cisco Catalyst 9500 48-Port 10G Fiber Core Switch',
        category: 'IT & Telecom',
        quantity: 4,
        unitOfMeasure: 'Units',
        estimatedUnitPrice: 8500.0,
        lineTotal: 34000,
        requiredByDate: '2026-04-10',
        glAccountCode: '1520-01-003',
        costCenter: 'CC-IT-101',
        preferredSupplierId: 'supp-03',
        preferredSupplierName: 'Bahwan IT Solutions & Services'
      },
      {
        id: 'prline-03',
        itemCode: 'IT-SAN-EXP-100T',
        itemDescription: 'High-Density NVMe SAN Storage Expansion Shelf 100TB',
        category: 'IT & Telecom',
        quantity: 2,
        unitOfMeasure: 'Units',
        estimatedUnitPrice: 15000.0,
        lineTotal: 30000,
        requiredByDate: '2026-04-10',
        glAccountCode: '1520-01-004',
        costCenter: 'CC-IT-101'
      }
    ],
    attachedDocCount: 2
  },
  {
    id: 'pr-2026-003',
    prNumber: 'PR-2026-0095',
    requestDate: '2026-02-18',
    requiredDeliveryDate: '2026-03-30',
    requestorId: 'emp-315',
    requestorName: 'Zainab Al-Balushi',
    department: 'Administration & HR',
    costCenter: 'CC-ADM-001',
    priority: 'Standard',
    currency: 'OMR',
    totalEstimatedAmount: 18500,
    totalEstimatedAmountOMR: 18500,
    status: 'Submitted',
    purpose: 'HQ Ergonomic Workstations and Collaborative Soundproof Meeting Pods.',
    justification: 'Office modernization and expansion for new project management teams.',
    lines: [
      {
        id: 'prline-04',
        itemDescription: 'Acoustic Soundproof 4-Person Meeting Booth with Integrated AV',
        category: 'Facilities & Services',
        quantity: 2,
        unitOfMeasure: 'Units',
        estimatedUnitPrice: 6500.0,
        lineTotal: 13000,
        requiredByDate: '2026-03-30',
        glAccountCode: '1530-01-002',
        costCenter: 'CC-ADM-001'
      },
      {
        id: 'prline-05',
        itemDescription: 'Executive Motorized Sit-Stand Desks with Cable Trays',
        category: 'Facilities & Services',
        quantity: 10,
        unitOfMeasure: 'Units',
        estimatedUnitPrice: 550.0,
        lineTotal: 5500,
        requiredByDate: '2026-03-30',
        glAccountCode: '1530-01-001',
        costCenter: 'CC-ADM-001'
      }
    ],
    attachedDocCount: 1
  }
];

export const initialRFQs: RequestForQuotation[] = [
  {
    id: 'rfq-2026-001',
    rfqNumber: 'RFQ-2026-0441',
    title: 'Supply, Delivery, and Site Testing of 1500 kVA Step-Down Distribution Transformers',
    issueDate: '2026-01-20',
    closingDate: '2026-02-25',
    category: 'Capital Equipment',
    procurementSpecialist: 'Fatma Al-Hasani (Lead Buyer)',
    sourcePrNumber: 'PR-2026-0072',
    deliveryLocation: 'Sohar Central Distribution Yard, Gate 3',
    paymentTerms: '10% Advance, 80% on Delivery & GRN, 10% on Final Commissioning',
    status: 'Under Evaluation',
    bidSubmissionCount: 3,
    termsAndConditions: 'All bidders must comply with Oman Distribution Code standards (OES-11) and provide 5-year comprehensive manufacturer warranty.',
    lines: [
      {
        id: 'rfqline-01',
        itemCode: 'EQP-TRF-1500KVA',
        itemDescription: '1500 kVA 11/0.433 kV Oil-Immersed Hermetically Sealed Distribution Transformer',
        specification: 'Copper windings, Dyn11 vector group, ONAN cooling, built to IEC 60076 standards with integrated Buchholz relay and dial thermometer.',
        targetQuantity: 4,
        unitOfMeasure: 'Units',
        targetDeliveryDate: '2026-05-15'
      }
    ],
    invitedSuppliers: [
      {
        supplierId: 'supp-02',
        supplierName: 'Voltamp Transformers Oman LLC',
        supplierEmail: 'tariq.b@voltamptransformers.com',
        inviteStatus: 'Bid Submitted',
        invitedAt: '2026-01-20',
        submissionDeadline: '2026-02-25',
        responseRef: 'QUO-VOLT-2026-901'
      },
      {
        supplierId: 'supp-intl-01',
        supplierName: 'ABB Power Grids Gulf FZE',
        supplierEmail: 'bids.middleeast@abb.com',
        inviteStatus: 'Bid Submitted',
        invitedAt: '2026-01-20',
        submissionDeadline: '2026-02-25',
        responseRef: 'QUO-ABB-OM-4402'
      },
      {
        supplierId: 'supp-intl-02',
        supplierName: 'Schneider Electric Oman WLL',
        supplierEmail: 'tender.desk@se.com',
        inviteStatus: 'Bid Submitted',
        invitedAt: '2026-01-20',
        submissionDeadline: '2026-02-25',
        responseRef: 'QUO-SE-2026-118'
      }
    ]
  }
];

export const initialSupplierQuotations: SupplierQuotation[] = [
  {
    id: 'quote-01',
    quotationNumber: 'QUO-VOLT-2026-901',
    rfqId: 'rfq-2026-001',
    rfqNumber: 'RFQ-2026-0441',
    supplierId: 'supp-02',
    supplierName: 'Voltamp Transformers Oman LLC',
    supplierContact: 'Eng. Tariq Al-Balushi (+968 2675 1900)',
    quotationDate: '2026-02-18',
    validUntilDate: '2026-05-20',
    currency: 'OMR',
    subtotal: 148000,
    taxAmount: 7400,
    totalAmount: 155400,
    totalAmountOMR: 155400,
    paymentTerms: '10% Advance, 80% on Delivery, 10% post-commissioning',
    incoterms: 'DDP (Delivered Duty Paid)',
    deliveryLeadTimeWeeks: 10,
    warrantyPeriodMonths: 60,
    technicalScore: 96,
    commercialScore: 92,
    compositeScore: 94.4,
    status: 'Selected / Awarded',
    evaluationRemarks: 'Local Omani manufacturer with full in-country service workshop, zero import tariff, meets all OES-11 specs.',
    lines: [
      {
        id: 'qline-01',
        itemDescription: '1500 kVA 11/0.433 kV Oil-Immersed Distribution Transformer (Voltamp Brand)',
        offeredQuantity: 4,
        unitOfMeasure: 'Units',
        unitPrice: 37000,
        discountPercentage: 0,
        netUnitPrice: 37000,
        lineTotal: 148000,
        leadTimeDays: 70,
        brandOrOrigin: 'Voltamp (Oman)',
        technicalCompliance: 'Full Compliance'
      }
    ]
  },
  {
    id: 'quote-02',
    quotationNumber: 'QUO-ABB-OM-4402',
    rfqId: 'rfq-2026-001',
    rfqNumber: 'RFQ-2026-0441',
    supplierId: 'supp-intl-01',
    supplierName: 'ABB Power Grids Gulf FZE',
    supplierContact: 'Regional Bids Desk (+971 4 314 7500)',
    quotationDate: '2026-02-21',
    validUntilDate: '2026-04-30',
    currency: 'USD',
    subtotal: 410000,
    taxAmount: 20500,
    totalAmount: 430500,
    totalAmountOMR: 165742,
    paymentTerms: 'Letter of Credit (LC) at Sight',
    incoterms: 'CIF (Cost, Insurance & Freight)',
    deliveryLeadTimeWeeks: 14,
    warrantyPeriodMonths: 36,
    technicalScore: 95,
    commercialScore: 84,
    compositeScore: 89.5,
    status: 'Under Review',
    evaluationRemarks: 'Global Tier 1 quality but higher landed cost due to shipping freight and customs clearance.',
    lines: [
      {
        id: 'qline-02',
        itemDescription: '1500 kVA 11/0.433 kV Oil-Immersed Distribution Transformer (ABB TrafoStar)',
        offeredQuantity: 4,
        unitOfMeasure: 'Units',
        unitPrice: 102500,
        discountPercentage: 0,
        netUnitPrice: 102500,
        lineTotal: 410000,
        leadTimeDays: 98,
        brandOrOrigin: 'ABB (Sweden / Turkey Plant)',
        technicalCompliance: 'Full Compliance'
      }
    ]
  }
];

export const initialSupplierSelections: SupplierSelectionRecord[] = [
  {
    id: 'award-2026-001',
    awardNumber: 'AWD-2026-019',
    rfqNumber: 'RFQ-2026-0441',
    awardDate: '2026-02-26',
    selectedSupplierId: 'supp-02',
    selectedSupplierName: 'Voltamp Transformers Oman LLC',
    selectedQuotationNumber: 'QUO-VOLT-2026-901',
    totalAwardValueOMR: 155400,
    savingsVsBudgetOMR: 14600,
    committeeChairman: 'Mazin Al-Hinai (CPO)',
    committeeMembers: ['Eng. Salim Al-Rawahi (Lead Technical Evaluator)', 'Fatma Al-Hasani (Lead Buyer)', 'Nasser Al-Balushi (Finance Observer)'],
    justificationNotes: 'Bidder demonstrated the highest composite score (94.4/100), offers the lowest landed price with local Omani ICV value-add and a superior 5-year warranty.',
    approvalStatus: 'Approved'
  }
];

export const initialPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po-2026-001',
    poNumber: 'PO-2026-0142',
    poType: 'Standard PO',
    orderDate: '2026-02-14',
    promisedDeliveryDate: '2026-03-25',
    supplierId: 'supp-01',
    supplierName: 'Oman Cables Industry SAOG',
    supplierContact: 'Khalfan Al-Harthy (+968 2444 6100)',
    supplierTaxNumber: 'OM1100028481',
    currency: 'OMR',
    exchangeRate: 1.0,
    subtotal: 140000,
    vatTotal: 7000,
    grandTotal: 147000,
    grandTotalOMR: 147000,
    sourcePrNumber: 'PR-2026-0089',
    paymentTerms: 'Net 60 Days from GRN',
    incoterms: 'DDP Site Delivery',
    deliveryAddress: 'Sohar Substation Project Site, North Batinah Governorate',
    buyerName: 'Fatma Al-Hasani (Lead Buyer)',
    status: 'Issued to Vendor',
    approvalLevel: 'Tier 3 (CFO / Director)',
    approvedBy: 'CEO & CFO Joint Signoff',
    approvedDate: '2026-02-14',
    specialInstructions: 'Inspect factory test certificates prior to dispatch. Material must be packaged on heavy-duty wooden cable drums.',
    lines: [
      {
        id: 'poline-01',
        itemCode: 'MAT-ELC-11KV',
        itemDescription: '11kV Cu XLPE 3-Core 300mm2 Armored Underground Cable',
        orderedQuantity: 4000,
        receivedQuantity: 4000,
        invoicedQuantity: 4000,
        unitOfMeasure: 'Meters',
        unitPrice: 35.0,
        discountPercentage: 0,
        vatRatePercentage: 5,
        lineTotal: 140000,
        glAccountCode: '1410-02-001',
        deliveryDate: '2026-03-25',
        lineStatus: 'Fully Received'
      }
    ]
  },
  {
    id: 'po-2026-002',
    poNumber: 'PO-2026-0145',
    poType: 'Standard PO',
    orderDate: '2026-02-28',
    promisedDeliveryDate: '2026-05-15',
    supplierId: 'supp-02',
    supplierName: 'Voltamp Transformers Oman LLC',
    supplierContact: 'Eng. Tariq Al-Balushi',
    supplierTaxNumber: 'OM1100039182',
    currency: 'OMR',
    exchangeRate: 1.0,
    subtotal: 148000,
    vatTotal: 7400,
    grandTotal: 155400,
    grandTotalOMR: 155400,
    sourceRfqNumber: 'RFQ-2026-0441',
    sourceQuotationNumber: 'QUO-VOLT-2026-901',
    paymentTerms: '10% Advance, 80% on Delivery, 10% on Commissioning',
    incoterms: 'DDP Sohar Central Yard',
    deliveryAddress: 'Sohar Central Distribution Yard, Gate 3',
    buyerName: 'Fatma Al-Hasani (Lead Buyer)',
    status: 'Approved',
    approvalLevel: 'Tier 3 (CFO / Director)',
    approvedBy: 'Mazin Al-Hinai (CPO)',
    approvedDate: '2026-02-28',
    specialInstructions: 'Witnessed factory routine acceptance test (FAT) required before release from factory.',
    lines: [
      {
        id: 'poline-02',
        itemCode: 'EQP-TRF-1500KVA',
        itemDescription: '1500 kVA 11/0.433 kV Oil-Immersed Distribution Transformer',
        orderedQuantity: 4,
        receivedQuantity: 0,
        invoicedQuantity: 0,
        unitOfMeasure: 'Units',
        unitPrice: 37000,
        discountPercentage: 0,
        vatRatePercentage: 5,
        lineTotal: 148000,
        glAccountCode: '1510-01-002',
        deliveryDate: '2026-05-15',
        lineStatus: 'Open'
      }
    ]
  },
  {
    id: 'po-2026-003',
    poNumber: 'PO-2026-0130',
    poType: 'Service Order',
    orderDate: '2026-01-15',
    promisedDeliveryDate: '2026-02-15',
    supplierId: 'supp-03',
    supplierName: 'Bahwan IT Solutions & Services',
    supplierContact: 'Sanjay Sharma',
    supplierTaxNumber: 'OM1100010992',
    currency: 'OMR',
    exchangeRate: 1.0,
    subtotal: 28500,
    vatTotal: 1425,
    grandTotal: 29925,
    grandTotalOMR: 29925,
    paymentTerms: 'Net 30 Days on Service Milestone Acceptance',
    incoterms: 'On-Site Delivery',
    deliveryAddress: 'Data Center HQ, Muscat',
    buyerName: 'Rashid Al-Habsi',
    status: 'Closed',
    approvalLevel: 'Tier 2 (Procurement Mgr)',
    approvedBy: 'Mazin Al-Hinai',
    approvedDate: '2026-01-16',
    specialInstructions: 'Service Level Agreement SLA response time < 2 hours for critical incidents.',
    lines: [
      {
        id: 'poline-03',
        itemDescription: 'Annual Enterprise Microsoft 365 & Azure Cloud Engineering Support',
        orderedQuantity: 1,
        receivedQuantity: 1,
        invoicedQuantity: 1,
        unitOfMeasure: 'Package',
        unitPrice: 28500,
        discountPercentage: 0,
        vatRatePercentage: 5,
        lineTotal: 28500,
        glAccountCode: '5020-01-004',
        deliveryDate: '2026-02-15',
        lineStatus: 'Invoiced'
      }
    ]
  }
];

export const initialBlanketPOs: BlanketPurchaseOrder[] = [
  {
    id: 'bpo-01',
    blanketPoNumber: 'BPO-2026-004',
    agreementTitle: 'Annual Framework Rate Contract for High-Voltage Copper Cables',
    supplierId: 'supp-01',
    supplierName: 'Oman Cables Industry SAOG',
    startDate: '2026-01-01',
    expiryDate: '2026-12-31',
    currency: 'OMR',
    agreedCeilingAmount: 850000,
    releasedAmount: 340000,
    remainingAmount: 510000,
    numberOfReleaseOrders: 3,
    status: 'Active',
    agreedTerms: 'Fixed unit prices locked for 12 months with quarterly LME copper indexation collar (±5%).',
    priceLockGuarantee: true
  },
  {
    id: 'bpo-02',
    blanketPoNumber: 'BPO-2026-008',
    agreementTitle: 'Logistics Transport & Heavy Haulage Call-Off Agreement',
    supplierId: 'supp-04',
    supplierName: 'Al-Madina Logistics Services SAOC',
    startDate: '2026-01-01',
    expiryDate: '2026-12-31',
    currency: 'OMR',
    agreedCeilingAmount: 120000,
    releasedAmount: 28500,
    remainingAmount: 91500,
    numberOfReleaseOrders: 5,
    status: 'Active',
    agreedTerms: 'Standard per-kilometer and heavy low-bed trailer rates covering all Sultanate regions.',
    priceLockGuarantee: true
  }
];

export const initialGoodsReceiptNotes: GoodsReceiptNote[] = [
  {
    id: 'grn-2026-001',
    grnNumber: 'GRN-2026-0094',
    grnType: 'Physical Goods (GRN)',
    receiptDate: '2026-02-22',
    poId: 'po-2026-001',
    poNumber: 'PO-2026-0142',
    supplierId: 'supp-01',
    supplierName: 'Oman Cables Industry SAOG',
    deliveryNoteNumber: 'DN-OCI-99412',
    carrierOrTransporter: 'Al-Madina Logistics Heavy Fleet',
    vehicleNumber: 'OM-4921-HD',
    receivedByWarehouseOfficer: 'Said Al-Ghafri (Chief Storekeeper)',
    warehouseLocation: 'Sohar Central Distribution Yard - Bay 4',
    status: 'Posted to Stock',
    totalDeliveredValueOMR: 140000,
    lines: [
      {
        id: 'grnline-01',
        poLineId: 'poline-01',
        itemDescription: '11kV Cu XLPE 3-Core 300mm2 Armored Underground Cable',
        orderedQty: 4000,
        previouslyReceivedQty: 0,
        deliveredQty: 4000,
        acceptedQty: 4000,
        rejectedQty: 0,
        unitOfMeasure: 'Meters',
        unitPrice: 35.0,
        lineTotal: 140000,
        batchNumber: 'BATCH-OCI-2026-K08',
        storageWarehouseId: 'WH-SOHAR-01',
        storageBinLocation: 'YARD-DRUM-ROW-12',
        inspectionResult: 'Passed'
      }
    ]
  },
  {
    id: 'grn-2026-002',
    grnNumber: 'SES-2026-0018',
    grnType: 'Service Entry Sheet (SES)',
    receiptDate: '2026-02-10',
    poId: 'po-2026-003',
    poNumber: 'PO-2026-0130',
    supplierId: 'supp-03',
    supplierName: 'Bahwan IT Solutions & Services',
    deliveryNoteNumber: 'SRV-SIGN-BIT-401',
    carrierOrTransporter: 'N/A - Digital Deliverable',
    receivedByWarehouseOfficer: 'Hamood Al-Kindi (IT Systems Lead)',
    warehouseLocation: 'HQ Virtual Asset Location',
    status: 'Accepted',
    totalDeliveredValueOMR: 28500,
    lines: [
      {
        id: 'grnline-02',
        poLineId: 'poline-03',
        itemDescription: 'Annual Enterprise Microsoft 365 & Azure Cloud Engineering Support Milestone 1',
        orderedQty: 1,
        previouslyReceivedQty: 0,
        deliveredQty: 1,
        acceptedQty: 1,
        rejectedQty: 0,
        unitOfMeasure: 'Package',
        unitPrice: 28500,
        lineTotal: 28500,
        storageWarehouseId: 'WH-HQ-VIRTUAL',
        storageBinLocation: 'SRV-ACC-01',
        inspectionResult: 'Passed'
      }
    ]
  }
];

export const initialReceiptInspections: ReceiptInspectionRecord[] = [
  {
    id: 'insp-01',
    inspectionNumber: 'QC-INSP-2026-055',
    grnNumber: 'GRN-2026-0094',
    poNumber: 'PO-2026-0142',
    inspectionDate: '2026-02-22',
    inspectorName: 'Eng. Khalid Al-Amri (Senior QA/QC Inspector)',
    sampleSizeInspected: 4000,
    acceptedCount: 4000,
    defectCount: 0,
    defectType: 'None',
    overallStatus: 'Pass',
    qcCertAttachmentRef: 'QC-CERT-OCI-88910.pdf',
    correctiveActionRequired: false,
    remarks: 'Conductor resistance and insulation resistance tested in presence of third-party inspector. Fully compliant with IEC 60502-2 specs.'
  }
];

export const initialPurchaseInvoices: PurchaseInvoice[] = [
  {
    id: 'inv-2026-001',
    invoiceNumber: 'PINV-2026-0112',
    vendorInvoiceNumber: 'INV-OCI-2026-8841',
    invoiceDate: '2026-02-24',
    dueDate: '2026-04-25',
    supplierId: 'supp-01',
    supplierName: 'Oman Cables Industry SAOG',
    supplierVatNumber: 'OM1100028481',
    poNumber: 'PO-2026-0142',
    grnNumber: 'GRN-2026-0094',
    currency: 'OMR',
    exchangeRate: 1.0,
    netSubtotal: 140000,
    vatAmount: 7000,
    totalInvoiceAmount: 147000,
    totalInvoiceAmountOMR: 147000,
    threeWayMatchResult: 'Full 3-Way Match Passed',
    priceTolerancePercentage: 0,
    status: 'Approved for Payment',
    apGlAccount: '2010-01-001 (Trade Accounts Payable)',
    verifiedBy: 'Nasser Al-Balushi (Senior AP Accountant)',
    approvedBy: 'Mazin Al-Hinai (CPO)',
    notes: '3-Way Match 100% exact match between PO-2026-0142, GRN-2026-0094, and Vendor Bill INV-OCI-2026-8841.',
    lines: [
      {
        id: 'invline-01',
        poLineId: 'poline-01',
        grnLineId: 'grnline-01',
        itemDescription: '11kV Cu XLPE 3-Core 300mm2 Armored Underground Cable',
        invoicedQuantity: 4000,
        unitPrice: 35.0,
        vatPercentage: 5,
        vatAmount: 7000,
        lineTotal: 140000,
        poUnitPrice: 35.0,
        poQuantity: 4000,
        grnQuantity: 4000,
        variancePercentage: 0,
        matchStatus: 'Matched'
      }
    ]
  },
  {
    id: 'inv-2026-002',
    invoiceNumber: 'PINV-2026-0115',
    vendorInvoiceNumber: 'INV-BIT-2026-0419',
    invoiceDate: '2026-02-12',
    dueDate: '2026-03-14',
    supplierId: 'supp-03',
    supplierName: 'Bahwan IT Solutions & Services',
    supplierVatNumber: 'OM1100010992',
    poNumber: 'PO-2026-0130',
    grnNumber: 'SES-2026-0018',
    currency: 'OMR',
    exchangeRate: 1.0,
    netSubtotal: 28500,
    vatAmount: 1425,
    totalInvoiceAmount: 29925,
    totalInvoiceAmountOMR: 29925,
    threeWayMatchResult: 'Full 3-Way Match Passed',
    priceTolerancePercentage: 0,
    status: 'Posted to AP',
    apGlAccount: '2010-01-001 (Trade Accounts Payable)',
    verifiedBy: 'Nasser Al-Balushi',
    approvedBy: 'Mazin Al-Hinai',
    notes: 'Verified against SES-2026-0018 signoff certificate.',
    lines: [
      {
        id: 'invline-02',
        poLineId: 'poline-03',
        grnLineId: 'grnline-02',
        itemDescription: 'Annual Enterprise Microsoft 365 & Azure Cloud Engineering Support',
        invoicedQuantity: 1,
        unitPrice: 28500,
        vatPercentage: 5,
        vatAmount: 1425,
        lineTotal: 28500,
        poUnitPrice: 28500,
        poQuantity: 1,
        grnQuantity: 1,
        variancePercentage: 0,
        matchStatus: 'Matched'
      }
    ]
  }
];

export const initialPurchaseReturns: PurchaseReturn[] = [
  {
    id: 'ret-01',
    returnNumber: 'PRET-2026-0012',
    returnDate: '2026-01-25',
    returnType: 'Goods Return (RMA)',
    supplierId: 'supp-01',
    supplierName: 'Oman Cables Industry SAOG',
    poNumber: 'PO-2025-0891',
    grnNumber: 'GRN-2025-0711',
    rmaReferenceNumber: 'RMA-OCI-2026-014',
    carrierName: 'Al-Madina Logistics',
    gatePassNumber: 'GP-WH-2026-0091',
    totalReturnValueOMR: 4200,
    status: 'Debit Note Issued',
    debitNoteNumber: 'DBN-2026-0005',
    remarks: 'Drum #3 suffered outer jacket sheath abrasion during transport. Supplier accepted RMA for full credit.',
    lines: [
      {
        id: 'retline-01',
        itemDescription: '11kV Cu XLPE 3-Core 300mm2 Armored Cable (Drum #3)',
        returnQuantity: 120,
        unitOfMeasure: 'Meters',
        unitPrice: 35.0,
        returnTotal: 4200,
        reasonForReturn: 'Transit Damage',
        actionRequested: 'Debit Note / Refund'
      }
    ]
  }
];

export const initialDebitNotes: SupplierDebitNote[] = [
  {
    id: 'dbn-01',
    debitNoteNumber: 'DBN-2026-0005',
    issueDate: '2026-01-28',
    supplierId: 'supp-01',
    supplierName: 'Oman Cables Industry SAOG',
    originalInvoiceNumber: 'INV-OCI-2025-7791',
    originalPoNumber: 'PO-2025-0891',
    returnReferenceNumber: 'PRET-2026-0012',
    currency: 'OMR',
    debitSubtotal: 4200,
    vatReversalAmount: 210,
    totalDebitAmount: 4410,
    totalDebitAmountOMR: 4410,
    glAccountDebit: '2010-01-001 (AP Control Account)',
    glAccountCredit: '1410-02-001 (Inventory Value)',
    reason: 'Debit note issued for transit-damaged cable drum returned under RMA-OCI-2026-014.',
    status: 'Settled Against AP',
    approvedBy: 'Mazin Al-Hinai (CPO)'
  }
];

export const initialContracts: SupplierContract[] = [
  {
    id: 'cntr-01',
    contractNumber: 'CNT-2025-081',
    contractTitle: 'Master Supply Agreement for High-Voltage Cables & Accessories',
    supplierId: 'supp-01',
    supplierName: 'Oman Cables Industry SAOG',
    contractType: 'Annual Rate Contract (ARC)',
    startDate: '2025-01-01',
    expiryDate: '2026-12-31',
    valueOMR: 1200000,
    paymentMilestones: 'Quarterly reconciliations upon GRN delivery verification.',
    noticePeriodDays: 60,
    renewalAlertDays: 90,
    status: 'Active',
    custodianManager: 'Fatma Al-Hasani (Lead Buyer)',
    attachmentCount: 4
  },
  {
    id: 'cntr-02',
    contractNumber: 'CNT-2025-044',
    contractTitle: 'Enterprise IT Cloud Infrastructure & Managed Security SLA',
    supplierId: 'supp-03',
    supplierName: 'Bahwan IT Solutions & Services',
    contractType: 'Service Level Agreement (SLA)',
    startDate: '2025-03-01',
    expiryDate: '2026-02-28',
    valueOMR: 85000,
    paymentMilestones: 'Monthly fixed retainer billed at month end.',
    noticePeriodDays: 30,
    renewalAlertDays: 30,
    status: 'Expiring Soon',
    custodianManager: 'Hamood Al-Kindi',
    attachmentCount: 2
  }
];

export const initialEvaluations: SupplierEvaluationRecord[] = [
  {
    id: 'eval-01',
    evaluationNumber: 'EVAL-2025-Q4-01',
    supplierId: 'supp-01',
    supplierName: 'Oman Cables Industry SAOG',
    evaluationPeriod: 'Q4',
    evaluatedDate: '2026-01-10',
    evaluatedBy: 'Fatma Al-Hasani & Said Al-Ghafri',
    qualityMetricScore: 29.5, // Max 30
    deliveryPunctualityScore: 28.5, // Max 30
    priceCompetitivenessScore: 19.0, // Max 20
    afterSalesSupportScore: 9.5, // Max 10
    complianceAndEsgScore: 9.5, // Max 10
    totalScore: 96.0,
    evaluationGrade: 'A - Excellent',
    recommendation: 'Strategic Tier 1 partner. Highly recommended for multi-year contract renewal.'
  },
  {
    id: 'eval-02',
    evaluationNumber: 'EVAL-2025-Q4-02',
    supplierId: 'supp-03',
    supplierName: 'Bahwan IT Solutions & Services',
    evaluationPeriod: 'Q4',
    evaluatedDate: '2026-01-12',
    evaluatedBy: 'Hamood Al-Kindi',
    qualityMetricScore: 28.0,
    deliveryPunctualityScore: 29.0,
    priceCompetitivenessScore: 18.0,
    afterSalesSupportScore: 9.0,
    complianceAndEsgScore: 9.0,
    totalScore: 93.0,
    evaluationGrade: 'A - Excellent',
    recommendation: 'Maintains high SLA uptime. Recommended for upcoming cloud migration tenders.'
  }
];

export const initialServiceEntrySheets: ServiceEntrySheet[] = [
  {
    id: 'ses-001',
    sesNumber: 'SES-2026-0001',
    sesTitle: 'ERP Rollout Milestone 2: Finance & Procurement Configuration',
    poNumber: 'PO-2026-004',
    supplierName: 'Bahwan IT Solutions LLC',
    serviceStartDate: '2026-01-05',
    serviceEndDate: '2026-01-31',
    serviceHoursLogged: 240,
    serviceAmountClaimedOMR: 14400,
    serviceAmountApprovedOMR: 14400,
    serviceProviderLead: 'Anand Sundaram (Principal Consultant)',
    supervisingEngineer: 'Eng. Khalid Al-Farsi',
    status: 'Verified & Approved',
    verifiedDeliverables: 'GL, AP and AR configuration signed off; UAT scripts executed.'
  },
  {
    id: 'ses-002',
    sesNumber: 'SES-2026-0002',
    sesTitle: 'Plant Instrumentation Calibration (Q1 Campaign)',
    poNumber: 'PO-2026-006',
    supplierName: 'Gulf Calibration & Metrology Services',
    serviceStartDate: '2026-02-02',
    serviceEndDate: '2026-02-20',
    serviceHoursLogged: 96,
    serviceAmountClaimedOMR: 5280,
    serviceAmountApprovedOMR: 5280,
    serviceProviderLead: 'Eng. Saeed Al-Hinai',
    supervisingEngineer: 'Eng. Khalid Al-Farsi',
    status: 'Pending Verification',
    verifiedDeliverables: 'Calibration certificates issued for 38 of 40 instruments.'
  }
];
