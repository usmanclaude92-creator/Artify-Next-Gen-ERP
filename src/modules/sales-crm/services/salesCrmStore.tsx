import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Lead,
  Customer,
  CustomerContact,
  Opportunity,
  SalesActivity,
  SalesQuotation,
  SalesOrder,
  DeliveryNote,
  ARInvoice,
  CustomerCreditNote,
  CustomerAdvanceDeposit,
  CustomerComplaint,
  FieldServiceRequest,
  CustomerFollowUpSurvey,
  SalesCrmStats
} from '../types';

// ============================================================================
// INITIAL MOCK DATA — OMANI & GCC ENTERPRISE ECOSYSTEM
// ============================================================================

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    customerCode: 'CUST-OM-1001',
    legalName: 'Petroleum Development Oman LLC (PDO)',
    tradeName: 'PDO Energy Systems',
    commercialRegistrationNumber: 'CR-1049281',
    taxIdentificationNumber: 'OM-VAT-10002931',
    category: 'Oil & Gas Upstream/Downstream',
    tier: 'Tier 1 — Strategic Key Account',
    country: 'Sultanate of Oman',
    governorate: 'Muscat',
    city: 'Mina Al Fahal',
    billingAddress: 'Bldg 42, PDO Headquarters Complex, PO Box 81, Muscat 100',
    shippingAddress: 'PDO Central Logistics Yard, Block 6 Marmul & Nimr Delivery Gate, Oman',
    currency: 'OMR',
    accountManagerId: 'usr-rep-01',
    accountManagerName: 'Eng. Tariq Al-Habsi',
    lifetimeRevenueOMR: 4850000,
    activeOrdersCount: 3,
    status: 'Active',
    tags: ['Strategic', 'Oil & Gas', 'Approved PDO Vendor', 'ISO 9001'],
    createdDate: '2023-01-15',
    contacts: [
      {
        id: 'cnt-1',
        customerId: 'cust-1',
        fullName: 'Salim Al-Busaidi',
        designation: 'Head of Upstream Procurement & Contracts',
        department: 'Procurement',
        email: 'salim.busaidi@pdo.co.om',
        phone: '+968 2467 1122',
        mobile: '+968 9931 4455',
        isPrimaryDecisionMaker: true,
        isBillingContact: false
      },
      {
        id: 'cnt-2',
        customerId: 'cust-1',
        fullName: 'Muna Al-Kharusi',
        designation: 'Finance & Accounts Payable Controller',
        department: 'Finance & AP',
        email: 'muna.ap@pdo.co.om',
        phone: '+968 2467 8899',
        mobile: '+968 9988 2211',
        isPrimaryDecisionMaker: false,
        isBillingContact: true
      }
    ],
    creditTerms: {
      creditLimitOMR: 1500000,
      creditDays: 60,
      currentOutstandingOMR: 320000,
      unbilledOrdersOMR: 185000,
      availableCreditOMR: 995000,
      creditStatus: 'Good Standing',
      paymentTermsLabel: 'Net 60 Days'
    }
  },
  {
    id: 'cust-2',
    customerCode: 'CUST-OM-1002',
    legalName: 'OQ Refineries and Petrochemicals Industries SAOC',
    tradeName: 'OQ Petrochemicals',
    commercialRegistrationNumber: 'CR-1092837',
    taxIdentificationNumber: 'OM-VAT-10009482',
    category: 'Industrial Manufacturer',
    tier: 'Tier 1 — Strategic Key Account',
    country: 'Sultanate of Oman',
    governorate: 'Al Batinah North',
    city: 'Sohar Industrial Port',
    billingAddress: 'OQ Tower, Ghala Industrial Zone, PO Box 3568, PC 112 Ruwi, Oman',
    shippingAddress: 'OQ Aromatics & Polymer Gate 4, Sohar Port Freezone, Oman',
    currency: 'OMR',
    accountManagerId: 'usr-rep-02',
    accountManagerName: 'Zainab Al-Balushi',
    lifetimeRevenueOMR: 2940000,
    activeOrdersCount: 2,
    status: 'Active',
    tags: ['Industrial', 'Refinery', 'Petrochemical', 'High Value'],
    createdDate: '2023-04-10',
    contacts: [
      {
        id: 'cnt-3',
        customerId: 'cust-2',
        fullName: 'Dr. Faisal Al-Mashani',
        designation: 'VP Technical Engineering & Infrastructure',
        department: 'Technical Engineering',
        email: 'faisal.mashani@oq.com',
        phone: '+968 2425 7000',
        mobile: '+968 9112 3344',
        isPrimaryDecisionMaker: true,
        isBillingContact: false
      }
    ],
    creditTerms: {
      creditLimitOMR: 1000000,
      creditDays: 45,
      currentOutstandingOMR: 140000,
      unbilledOrdersOMR: 95000,
      availableCreditOMR: 765000,
      creditStatus: 'Good Standing',
      paymentTermsLabel: 'Net 60 Days'
    }
  },
  {
    id: 'cust-3',
    customerCode: 'CUST-OM-1003',
    legalName: 'Nama Water Services SAOC (Public Authority for Water)',
    tradeName: 'Nama Water',
    commercialRegistrationNumber: 'CR-1192801',
    taxIdentificationNumber: 'OM-VAT-10004921',
    category: 'Government Ministry / Utility',
    tier: 'Government / Public Authority',
    country: 'Sultanate of Oman',
    governorate: 'Muscat',
    city: 'Bausher',
    billingAddress: 'Nama Water HQ, Al Ghubrah South, Expressway Exit 14, Muscat',
    shippingAddress: 'Central Utility Desalination Hub 2, Qurayyat Water Scheme, Oman',
    currency: 'OMR',
    accountManagerId: 'usr-rep-01',
    accountManagerName: 'Eng. Tariq Al-Habsi',
    lifetimeRevenueOMR: 1780000,
    activeOrdersCount: 1,
    status: 'Active',
    tags: ['Government', 'Utilities', 'Tender Board Certified'],
    createdDate: '2023-08-22',
    contacts: [
      {
        id: 'cnt-4',
        customerId: 'cust-3',
        fullName: 'Eng. Rashid Al-Hinai',
        designation: 'Director of Strategic Water Networks',
        department: 'Project Operations',
        email: 'rashid.hinai@nama.om',
        phone: '+968 2450 9900',
        mobile: '+968 9772 1199',
        isPrimaryDecisionMaker: true,
        isBillingContact: false
      }
    ],
    creditTerms: {
      creditLimitOMR: 800000,
      creditDays: 90,
      currentOutstandingOMR: 210000,
      unbilledOrdersOMR: 60000,
      availableCreditOMR: 530000,
      creditStatus: 'Good Standing',
      paymentTermsLabel: 'Net 90 Days'
    }
  },
  {
    id: 'cust-4',
    customerCode: 'CUST-OM-1004',
    legalName: 'Galfar Engineering & Contracting SAOG',
    tradeName: 'Galfar Mega Projects',
    commercialRegistrationNumber: 'CR-1002938',
    taxIdentificationNumber: 'OM-VAT-10001882',
    category: 'EPC & Main Contractor',
    tier: 'Tier 2 — Enterprise Corporate',
    country: 'Sultanate of Oman',
    governorate: 'Muscat',
    city: 'Rusayl Industrial Estate',
    billingAddress: 'Galfar Corporate Center, Way 4210, Rusayl, Muscat',
    shippingAddress: 'Duqm Special Economic Zone (SEZAD) Project Yard, Duqm, Oman',
    currency: 'OMR',
    accountManagerId: 'usr-rep-03',
    accountManagerName: 'Ahmed Al-Shehhi',
    lifetimeRevenueOMR: 3410000,
    activeOrdersCount: 2,
    status: 'Active',
    tags: ['EPC', 'Civil & Mechanical', 'Duqm Zone'],
    createdDate: '2023-02-18',
    contacts: [
      {
        id: 'cnt-5',
        customerId: 'cust-4',
        fullName: 'Khalfan Al-Farsi',
        designation: 'Senior Project Procurement Manager',
        department: 'Procurement',
        email: 'khalfan.farsi@galfar.com',
        phone: '+968 2452 5000',
        mobile: '+968 9944 8833',
        isPrimaryDecisionMaker: true,
        isBillingContact: false
      }
    ],
    creditTerms: {
      creditLimitOMR: 600000,
      creditDays: 60,
      currentOutstandingOMR: 490000,
      unbilledOrdersOMR: 80000,
      availableCreditOMR: 30000,
      creditStatus: 'Near Credit Limit (>85%)',
      paymentTermsLabel: 'Net 60 Days'
    }
  }
];

const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    leadCode: 'LED-2026-0081',
    fullName: 'Yousef Al-Zadjali',
    jobTitle: 'VP Infrastructure Projects',
    companyName: 'Asyad Port Infrastructure Group',
    industry: 'Logistics & Ports',
    email: 'yousef.zadjali@asyad.om',
    phone: '+968 2490 3300',
    country: 'Sultanate of Oman',
    city: 'Salalah Freezone',
    source: 'Tender Portal (E-Tendering Oman)',
    status: 'BANT Qualified',
    rating: 'Hot (High Intent)',
    assignedRepId: 'usr-rep-01',
    assignedRepName: 'Eng. Tariq Al-Habsi',
    estimatedDealValueOMR: 285000,
    bant: {
      budgetOMR: 300000,
      budgetStatus: 'Verified',
      authorityRole: 'Decision Maker',
      needUrgency: 'Critical (< 30 days)',
      timelineDate: '2026-09-30',
      bantScore: 92
    },
    notes: 'Salalah Port container terminal electrification & SCADA telemetry upgrade requirement.',
    createdDate: '2026-08-01',
    aiScore: 94,
    aiReasoning: 'High budget confirmation, government-backed infrastructure fund, immediate timeline.'
  },
  {
    id: 'lead-2',
    leadCode: 'LED-2026-0082',
    fullName: 'Eng. Laila Al-Rawahi',
    jobTitle: 'Lead Process Safety Engineer',
    companyName: 'Oman LNG LLC',
    industry: 'Oil & Gas',
    email: 'laila.rawahi@omanlng.com.om',
    phone: '+968 2554 7000',
    country: 'Sultanate of Oman',
    city: 'Sur Industrial Area',
    source: 'Trade Exhibition (Oman Expo)',
    status: 'Contacted',
    rating: 'Hot (High Intent)',
    assignedRepId: 'usr-rep-02',
    assignedRepName: 'Zainab Al-Balushi',
    estimatedDealValueOMR: 420000,
    bant: {
      budgetOMR: 450000,
      budgetStatus: 'Verified',
      authorityRole: 'Influencer',
      needUrgency: 'Medium (1-3 mos)',
      timelineDate: '2026-11-15',
      bantScore: 84
    },
    notes: 'Sur Liquefaction Plant Train-3 cryogenic valves and digital control sensors overhaul.',
    createdDate: '2026-08-05',
    aiScore: 88,
    aiReasoning: 'Strategic account fit, excellent historical payment track record in energy sector.'
  },
  {
    id: 'lead-3',
    leadCode: 'LED-2026-0083',
    fullName: 'Maqbool Al-Lawati',
    jobTitle: 'Chief Technology Officer',
    companyName: 'Omantel Telecom Towers',
    industry: 'Telecom & IT',
    email: 'maqbool.lawati@omantel.om',
    phone: '+968 2424 1000',
    country: 'Sultanate of Oman',
    city: 'Madinat Al Irfan, Muscat',
    source: 'Website / Inbound',
    status: 'New / Unassigned',
    rating: 'Warm (Exploring)',
    assignedRepId: 'usr-rep-03',
    assignedRepName: 'Ahmed Al-Shehhi',
    estimatedDealValueOMR: 120000,
    bant: {
      budgetOMR: 150000,
      budgetStatus: 'Estimated',
      authorityRole: 'Decision Maker',
      needUrgency: 'Medium (1-3 mos)',
      timelineDate: '2026-12-01',
      bantScore: 75
    },
    notes: 'Green solar backup power pods for 45 remote 5G telecommunication towers in Dhofar.',
    createdDate: '2026-08-10',
    aiScore: 78,
    aiReasoning: 'Green energy mandate alignment, clear specification submitted.'
  },
  {
    id: 'lead-4',
    leadCode: 'LED-2026-0084',
    fullName: 'Hamad Al-Kaabi',
    jobTitle: 'Procurement Specialist',
    companyName: 'Sohar Aluminium SAOC',
    industry: 'Manufacturing',
    email: 'hamad.kaabi@sohar-aluminium.com',
    phone: '+968 2686 3000',
    country: 'Sultanate of Oman',
    city: 'Sohar',
    source: 'Direct Inquiry',
    status: 'BANT Qualified',
    rating: 'Hot (High Intent)',
    assignedRepId: 'usr-rep-02',
    assignedRepName: 'Zainab Al-Balushi',
    estimatedDealValueOMR: 350000,
    bant: {
      budgetOMR: 350000,
      budgetStatus: 'Verified',
      authorityRole: 'Procurement Liaison',
      needUrgency: 'Critical (< 30 days)',
      timelineDate: '2026-09-15',
      bantScore: 90
    },
    notes: 'Smelter Potline busbar maintenance instruments and thermal imaging units.',
    createdDate: '2026-08-12',
    aiScore: 91,
    aiReasoning: 'Urgent turnaround requested for planned Q4 furnace shutdown window.'
  }
];

const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    opportunityCode: 'OPP-2026-0312',
    title: 'PDO Marmul Oilfield Submersible Pumps & Telemetry Package',
    customerId: 'cust-1',
    customerName: 'Petroleum Development Oman LLC (PDO)',
    stage: 'Negotiation & Review',
    probabilityPercentage: 80,
    dealValueOMR: 640000,
    weightedValueOMR: 512000,
    currency: 'OMR',
    ownerId: 'usr-rep-01',
    ownerName: 'Eng. Tariq Al-Habsi',
    expectedCloseDate: '2026-08-30',
    productLines: ['Submersible Pump Assemblies', 'SCADA RTU Remote Panels', 'High-Pressure Valves'],
    keyCompetitors: ['Baker Hughes Middle East', 'Schlumberger Oman'],
    nextStep: 'Final commercial discount negotiation with PDO Tender Board committee.',
    nextStepDueDate: '2026-08-25',
    createdDate: '2026-06-10',
    aiWinProbabilityScore: 85,
    aiRecommendedAction: 'Highlight 100% In-Country Value (ICV) local assembly in Rusayl to win against imported bids.'
  },
  {
    id: 'opp-2',
    opportunityCode: 'OPP-2026-0313',
    title: 'OQ Aromatics Continuous Emissions Monitoring Systems (CEMS)',
    customerId: 'cust-2',
    customerName: 'OQ Refineries and Petrochemicals Industries SAOC',
    stage: 'Proposal & Commercial Quotation',
    probabilityPercentage: 60,
    dealValueOMR: 380000,
    weightedValueOMR: 228000,
    currency: 'OMR',
    ownerId: 'usr-rep-02',
    ownerName: 'Zainab Al-Balushi',
    expectedCloseDate: '2026-09-20',
    productLines: ['Optical Gas Analyzers', 'Stack Flow Transmitters', 'Environmental Compliance Software'],
    keyCompetitors: ['Yokogawa Middle East', 'Emerson Automation'],
    nextStep: 'Submit revised technical compliance matrix addressing OQ HAZOP safety queries.',
    nextStepDueDate: '2026-08-28',
    createdDate: '2026-07-02',
    aiWinProbabilityScore: 68,
    aiRecommendedAction: 'Include 3-year local 24/7 SLA maintenance package with guaranteed 2-hour response.'
  },
  {
    id: 'opp-3',
    opportunityCode: 'OPP-2026-0314',
    title: 'Nama Water Services — Muscat South Water Booster Pumping Station',
    customerId: 'cust-3',
    customerName: 'Nama Water Services SAOC (Public Authority for Water)',
    stage: 'Closed Won',
    probabilityPercentage: 100,
    dealValueOMR: 520000,
    weightedValueOMR: 520000,
    currency: 'OMR',
    ownerId: 'usr-rep-01',
    ownerName: 'Eng. Tariq Al-Habsi',
    expectedCloseDate: '2026-08-15',
    actualCloseDate: '2026-08-15',
    productLines: ['Centrifugal Split-Case Pumps', 'VFD Variable Speed Drives', 'Surge Vessels'],
    keyCompetitors: ['KSB Pumps Oman', 'Sulzer Middle East'],
    nextStep: 'Awaiting formal Sales Order booking and advance payment receipt.',
    nextStepDueDate: '2026-08-22',
    createdDate: '2026-05-14',
    aiWinProbabilityScore: 100,
    aiRecommendedAction: 'Book Sales Order immediately to reserve factory production line slot.'
  },
  {
    id: 'opp-4',
    opportunityCode: 'OPP-2026-0315',
    title: 'Galfar Duqm Drydock Heavy Crane Electrical Power Substations',
    customerId: 'cust-4',
    customerName: 'Galfar Engineering & Contracting SAOG',
    stage: 'Technical Qualification',
    probabilityPercentage: 40,
    dealValueOMR: 295000,
    weightedValueOMR: 118000,
    currency: 'OMR',
    ownerId: 'usr-rep-03',
    ownerName: 'Ahmed Al-Shehhi',
    expectedCloseDate: '2026-10-15',
    productLines: ['11kV Switchgear Panels', 'Cast Resin Transformers', 'Busbar Trunking'],
    keyCompetitors: ['ABB Oman', 'Schneider Electric Gulf'],
    nextStep: 'Present technical mock-up demo to Galfar Marine Engineering consultants.',
    nextStepDueDate: '2026-09-02',
    createdDate: '2026-07-20',
    aiWinProbabilityScore: 48,
    aiRecommendedAction: 'Verify Galfar credit utilization before offering open payment terms.'
  }
];

const INITIAL_ACTIVITIES: SalesActivity[] = [
  {
    id: 'act-1',
    activityCode: 'ACT-2026-0941',
    type: 'Client Meeting',
    subject: 'Executive Commercial Review with PDO Tender Board',
    relatedToType: 'Opportunity',
    relatedToId: 'opp-1',
    relatedToName: 'PDO Marmul Submersible Pumps',
    assignedRepId: 'usr-rep-01',
    assignedRepName: 'Eng. Tariq Al-Habsi',
    scheduledDate: '2026-08-22',
    scheduledTime: '10:00 AM',
    durationMinutes: 60,
    status: 'Scheduled',
    priority: 'High',
    outcomeNotes: 'Agenda: finalize discount structure and delivery milestone commitments.'
  },
  {
    id: 'act-2',
    activityCode: 'ACT-2026-0942',
    type: 'Site Inspection',
    subject: 'Sohar Aromatics Plant Stack Measurement Survey',
    relatedToType: 'Opportunity',
    relatedToId: 'opp-2',
    relatedToName: 'OQ Aromatics CEMS',
    assignedRepId: 'usr-rep-02',
    assignedRepName: 'Zainab Al-Balushi',
    scheduledDate: '2026-08-21',
    scheduledTime: '02:30 PM',
    durationMinutes: 120,
    status: 'Scheduled',
    priority: 'High',
    outcomeNotes: 'Inspect physical stack flange dimensions and verify power availability at 35m platform.'
  },
  {
    id: 'act-3',
    activityCode: 'ACT-2026-0943',
    type: 'Phone Call',
    subject: 'Follow-up on Asyad Salalah Port Electrification Tender Specs',
    relatedToType: 'Lead',
    relatedToId: 'lead-1',
    relatedToName: 'Asyad Port Infrastructure',
    assignedRepId: 'usr-rep-01',
    assignedRepName: 'Eng. Tariq Al-Habsi',
    scheduledDate: '2026-08-19',
    scheduledTime: '11:00 AM',
    durationMinutes: 20,
    status: 'Completed',
    priority: 'Medium',
    outcomeNotes: 'Spoke with Yousef. Confirmed tender release is planned for Aug 28. Invited us for formal submission.',
    completedAt: '2026-08-19T11:22:00Z'
  },
  {
    id: 'act-4',
    activityCode: 'ACT-2026-0944',
    type: 'Task',
    subject: 'Issue Credit Limit Review for Galfar Duqm Order Expansion',
    relatedToType: 'Customer',
    relatedToId: 'cust-4',
    relatedToName: 'Galfar Engineering & Contracting',
    assignedRepId: 'usr-rep-03',
    assignedRepName: 'Ahmed Al-Shehhi',
    scheduledDate: '2026-08-20',
    scheduledTime: '04:00 PM',
    durationMinutes: 30,
    status: 'Scheduled',
    priority: 'High',
    outcomeNotes: 'Request Finance AP team to review credit ceiling extension to OMR 750,000 against project bank guarantee.'
  }
];

const INITIAL_QUOTATIONS: SalesQuotation[] = [
  {
    id: 'quo-1',
    quotationNumber: 'QUO-2026-00451',
    revisionNumber: 0,
    customerId: 'cust-1',
    customerName: 'Petroleum Development Oman LLC (PDO)',
    opportunityId: 'opp-1',
    opportunityName: 'PDO Marmul Oilfield Submersible Pumps & Telemetry',
    quotationDate: '2026-08-10',
    validUntilDate: '2026-09-10',
    paymentTerms: 'Net 60 Days against Delivery & Inspection',
    incoterms: 'DDP (Delivered Duty Paid)',
    currency: 'OMR',
    exchangeRate: 1.0,
    salesRepId: 'usr-rep-01',
    salesRepName: 'Eng. Tariq Al-Habsi',
    deliveryLocation: 'PDO Marmul Logistics Hub, Oman',
    warrantyPeriod: '24 Months Comprehensive Manufacturer Warranty',
    subtotalOMR: 609523.81,
    totalDiscountOMR: 30476.19,
    vatAmountOMR: 28952.38,
    grandTotalOMR: 640000.0,
    overallMarginPercentage: 28.5,
    status: 'Pending Approval',
    requiresSpecialApproval: true,
    approvalNotes: 'Discount of 5% offered to match competitor aggressive pricing; overall margin remains healthy at 28.5%.',
    lines: [
      {
        id: 'qline-1',
        itemCode: 'ESP-450KW',
        itemDescription: 'Heavy-Duty Electric Submersible Pump Assembly (450 kW, Sour Gas Rated)',
        quantity: 4,
        unitOfMeasure: 'Sets',
        listPriceOMR: 95000,
        discountPercentage: 5,
        discountAmountOMR: 4750,
        netUnitPriceOMR: 90250,
        lineSubtotalOMR: 361000,
        vatPercentage: 5,
        vatAmountOMR: 18050,
        lineTotalOMR: 379050,
        estimatedDeliveryWeeks: 6,
        marginPercentage: 30.0
      },
      {
        id: 'qline-2',
        itemCode: 'SCADA-RTU-EX',
        itemDescription: 'Explosion-Proof SCADA Telemetry Remote Terminal Unit with Solar Pack',
        quantity: 8,
        unitOfMeasure: 'Units',
        listPriceOMR: 28000,
        discountPercentage: 5,
        discountAmountOMR: 1400,
        netUnitPriceOMR: 26600,
        lineSubtotalOMR: 212800,
        vatPercentage: 5,
        vatAmountOMR: 10640,
        lineTotalOMR: 223440,
        estimatedDeliveryWeeks: 4,
        marginPercentage: 26.0
      },
      {
        id: 'qline-3',
        itemCode: 'SVC-COMM-01',
        itemDescription: 'On-Site Field Commissioning, SAT Testing & 48-Hour Live Run Supervision',
        quantity: 1,
        unitOfMeasure: 'Lots',
        listPriceOMR: 37510,
        discountPercentage: 0,
        discountAmountOMR: 0,
        netUnitPriceOMR: 37510,
        lineSubtotalOMR: 37510,
        vatPercentage: 5,
        vatAmountOMR: 1875.5,
        lineTotalOMR: 39385.5,
        estimatedDeliveryWeeks: 8,
        marginPercentage: 32.0
      }
    ]
  },
  {
    id: 'quo-2',
    quotationNumber: 'QUO-2026-00452',
    revisionNumber: 1,
    customerId: 'cust-3',
    customerName: 'Nama Water Services SAOC (Public Authority for Water)',
    opportunityId: 'opp-3',
    opportunityName: 'Nama Water Muscat South Booster Pumping Station',
    quotationDate: '2026-08-01',
    validUntilDate: '2026-08-31',
    paymentTerms: 'Net 90 Days',
    incoterms: 'DDP (Delivered Duty Paid)',
    currency: 'OMR',
    exchangeRate: 1.0,
    salesRepId: 'usr-rep-01',
    salesRepName: 'Eng. Tariq Al-Habsi',
    deliveryLocation: 'Qurayyat Desalination Hub, Oman',
    warrantyPeriod: '36 Months Utility Grade Warranty',
    subtotalOMR: 495238.1,
    totalDiscountOMR: 0,
    vatAmountOMR: 24761.9,
    grandTotalOMR: 520000.0,
    overallMarginPercentage: 31.2,
    status: 'Accepted',
    requiresSpecialApproval: false,
    approvedBy: 'Commercial Director (Rashid Al-Kindi)',
    approvedAt: '2026-08-05',
    lines: [
      {
        id: 'qline-4',
        itemCode: 'PUMP-SPLIT-800',
        itemDescription: 'High-Volume Horizontal Split-Case Water Booster Pump (800 m3/hr, 12 Bar)',
        quantity: 6,
        unitOfMeasure: 'Units',
        listPriceOMR: 65000,
        discountPercentage: 0,
        discountAmountOMR: 0,
        netUnitPriceOMR: 65000,
        lineSubtotalOMR: 390000,
        vatPercentage: 5,
        vatAmountOMR: 19500,
        lineTotalOMR: 409500,
        estimatedDeliveryWeeks: 5,
        marginPercentage: 32.0
      },
      {
        id: 'qline-5',
        itemCode: 'VFD-DRIVE-250',
        itemDescription: 'Harmonic Mitigated Variable Frequency Drive Inverter Cubicle (250 kW)',
        quantity: 6,
        unitOfMeasure: 'Units',
        listPriceOMR: 17539.68,
        discountPercentage: 0,
        discountAmountOMR: 0,
        netUnitPriceOMR: 17539.68,
        lineSubtotalOMR: 105238.1,
        vatPercentage: 5,
        vatAmountOMR: 5261.9,
        lineTotalOMR: 110500,
        estimatedDeliveryWeeks: 4,
        marginPercentage: 29.5
      }
    ]
  }
];

const INITIAL_SALES_ORDERS: SalesOrder[] = [
  {
    id: 'so-1',
    soNumber: 'SO-2026-00789',
    customerPoNumber: 'PDO-LPO-992019',
    quotationId: 'quo-1',
    quotationNumber: 'QUO-2026-00451',
    customerId: 'cust-1',
    customerName: 'Petroleum Development Oman LLC (PDO)',
    orderDate: '2026-08-12',
    expectedDeliveryDate: '2026-09-25',
    salesRepId: 'usr-rep-01',
    salesRepName: 'Eng. Tariq Al-Habsi',
    currency: 'OMR',
    subtotalOMR: 609523.81,
    vatAmountOMR: 28952.38,
    grandTotalOMR: 640000.0,
    advanceDepositPaidOMR: 128000.0,
    balanceDueOMR: 512000.0,
    creditCheckStatus: 'Passed',
    approvalStatus: 'Approved',
    status: 'Processing / Allocated',
    shippingAddress: 'PDO Central Logistics Yard, Block 6 Marmul & Nimr Delivery Gate, Oman',
    incoterms: 'DDP Marmul',
    shippingInstructions: 'Driver must carry valid OPAL defensive driving card and PDO gate pass.',
    createdDate: '2026-08-12',
    lines: [
      {
        id: 'soline-1',
        itemCode: 'ESP-450KW',
        itemDescription: 'Heavy-Duty Electric Submersible Pump Assembly (450 kW, Sour Gas Rated)',
        orderedQuantity: 4,
        allocatedQuantity: 4,
        deliveredQuantity: 2,
        invoicedQuantity: 2,
        unitOfMeasure: 'Sets',
        unitPriceOMR: 90250,
        discountPercentage: 5,
        netUnitPriceOMR: 90250,
        lineSubtotalOMR: 361000,
        vatAmountOMR: 18050,
        lineTotalOMR: 379050,
        warehouseLocation: 'Rusayl Central Whse — Bay B-04',
        fulfillmentStatus: 'Partial'
      },
      {
        id: 'soline-2',
        itemCode: 'SCADA-RTU-EX',
        itemDescription: 'Explosion-Proof SCADA Telemetry Remote Terminal Unit with Solar Pack',
        orderedQuantity: 8,
        allocatedQuantity: 8,
        deliveredQuantity: 4,
        invoicedQuantity: 4,
        unitOfMeasure: 'Units',
        unitPriceOMR: 26600,
        discountPercentage: 5,
        netUnitPriceOMR: 26600,
        lineSubtotalOMR: 212800,
        vatAmountOMR: 10640,
        lineTotalOMR: 223440,
        warehouseLocation: 'Rusayl High-Value Clean Room — Rack C-01',
        fulfillmentStatus: 'Partial'
      }
    ]
  },
  {
    id: 'so-2',
    soNumber: 'SO-2026-00790',
    customerPoNumber: 'NAMA-PO-448102',
    quotationId: 'quo-2',
    quotationNumber: 'QUO-2026-00452',
    customerId: 'cust-3',
    customerName: 'Nama Water Services SAOC (Public Authority for Water)',
    orderDate: '2026-08-16',
    expectedDeliveryDate: '2026-09-30',
    salesRepId: 'usr-rep-01',
    salesRepName: 'Eng. Tariq Al-Habsi',
    currency: 'OMR',
    subtotalOMR: 495238.1,
    vatAmountOMR: 24761.9,
    grandTotalOMR: 520000.0,
    advanceDepositPaidOMR: 0,
    balanceDueOMR: 520000.0,
    creditCheckStatus: 'Passed',
    approvalStatus: 'Approved',
    status: 'Credit Approved',
    shippingAddress: 'Central Utility Desalination Hub 2, Qurayyat Water Scheme, Oman',
    incoterms: 'DDP Qurayyat',
    shippingInstructions: 'Offloading by crane required on site between 07:00 and 14:00.',
    createdDate: '2026-08-16',
    lines: [
      {
        id: 'soline-3',
        itemCode: 'PUMP-SPLIT-800',
        itemDescription: 'High-Volume Horizontal Split-Case Water Booster Pump (800 m3/hr, 12 Bar)',
        orderedQuantity: 6,
        allocatedQuantity: 6,
        deliveredQuantity: 0,
        invoicedQuantity: 0,
        unitOfMeasure: 'Units',
        unitPriceOMR: 65000,
        discountPercentage: 0,
        netUnitPriceOMR: 65000,
        lineSubtotalOMR: 390000,
        vatAmountOMR: 19500,
        lineTotalOMR: 409500,
        warehouseLocation: 'Rusayl Central Whse — Bay A-12',
        fulfillmentStatus: 'Allocated'
      }
    ]
  }
];

const INITIAL_DELIVERY_NOTES: DeliveryNote[] = [
  {
    id: 'dn-1',
    dnNumber: 'DN-2026-01201',
    soId: 'so-1',
    soNumber: 'SO-2026-00789',
    customerPoNumber: 'PDO-LPO-992019',
    customerId: 'cust-1',
    customerName: 'Petroleum Development Oman LLC (PDO)',
    dispatchDate: '2026-08-14',
    deliveryDate: '2026-08-15',
    driverName: 'Nasir Al-Hadhrami',
    vehicleRegistration: 'OM-3829-DX (Heavy Flatbed Trailer)',
    gatePassNumber: 'GP-RUS-9021',
    deliveryAddress: 'PDO Central Logistics Yard, Block 6 Marmul, Oman',
    receivedByCustomerSignatureName: 'Eng. Khalfan Al-Nuaimi (PDO Site Inspector)',
    status: 'Delivered & Signed',
    invoiced: true,
    invoiceNumber: 'INV-2026-04981',
    lines: [
      {
        id: 'dnline-1',
        soLineId: 'soline-1',
        itemCode: 'ESP-450KW',
        itemDescription: 'Heavy-Duty Electric Submersible Pump Assembly (450 kW, Sour Gas Rated)',
        dispatchedQuantity: 2,
        unitOfMeasure: 'Sets',
        batchNumber: 'LOT-2026-ESP-0881',
        warehouseCode: 'WH-RUSAYL-MAIN'
      },
      {
        id: 'dnline-2',
        soLineId: 'soline-2',
        itemCode: 'SCADA-RTU-EX',
        itemDescription: 'Explosion-Proof SCADA Telemetry Remote Terminal Unit with Solar Pack',
        dispatchedQuantity: 4,
        unitOfMeasure: 'Units',
        batchNumber: 'LOT-2026-RTU-1092',
        warehouseCode: 'WH-RUSAYL-MAIN'
      }
    ]
  }
];

const INITIAL_AR_INVOICES: ARInvoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2026-04981',
    soId: 'so-1',
    soNumber: 'SO-2026-00789',
    dnId: 'dn-1',
    dnNumber: 'DN-2026-01201',
    customerId: 'cust-1',
    customerName: 'Petroleum Development Oman LLC (PDO)',
    customerVatNumber: 'OM-VAT-10002931',
    invoiceDate: '2026-08-15',
    dueDate: '2026-10-14',
    paymentTerms: 'Net 60 Days',
    subtotalOMR: 286900.0,
    vatAmountOMR: 14345.0,
    grandTotalOMR: 301245.0,
    amountPaidOMR: 0,
    balanceDueOMR: 301245.0,
    status: 'Posted',
    glAccountReceivable: '1200-01 Accounts Receivable — Trade Clients',
    paymentReceiptReferences: [],
    qrCodeData: 'OM_TAX_AUTH|Artify_ERP|OM-VAT-9920192|2026-08-15|301245.00|14345.00',
    lines: [
      {
        id: 'invline-1',
        soLineId: 'soline-1',
        dnLineId: 'dnline-1',
        itemCode: 'ESP-450KW',
        itemDescription: 'Heavy-Duty Electric Submersible Pump Assembly (450 kW, Sour Gas Rated)',
        invoicedQuantity: 2,
        unitOfMeasure: 'Sets',
        unitPriceOMR: 90250,
        subtotalOMR: 180500,
        vatPercentage: 5,
        vatAmountOMR: 9025,
        totalOMR: 189525,
        glAccountCode: '4100-01 Sales Revenue — Oilfield Capital Equipment'
      },
      {
        id: 'invline-2',
        soLineId: 'soline-2',
        dnLineId: 'dnline-2',
        itemCode: 'SCADA-RTU-EX',
        itemDescription: 'Explosion-Proof SCADA Telemetry Remote Terminal Unit with Solar Pack',
        invoicedQuantity: 4,
        unitOfMeasure: 'Units',
        unitPriceOMR: 26600,
        subtotalOMR: 106400,
        vatPercentage: 5,
        vatAmountOMR: 5320,
        totalOMR: 111720,
        glAccountCode: '4100-02 Sales Revenue — Industrial Automation'
      }
    ]
  }
];

const INITIAL_CREDIT_NOTES: CustomerCreditNote[] = [
  {
    id: 'cn-1',
    creditNoteNumber: 'CN-2026-00124',
    originalInvoiceNumber: 'INV-2026-04981',
    customerId: 'cust-1',
    customerName: 'Petroleum Development Oman LLC (PDO)',
    issueDate: '2026-08-18',
    reason: 'Volume Rebate',
    subtotalOMR: 4500.0,
    vatReversalAmountOMR: 225.0,
    grandTotalOMR: 4725.0,
    glAccountCode: '4190-01 Sales Returns & Rebates Allowances',
    status: 'Approved',
    notes: 'Q3 volume rebate credit authorized under Strategic Supplier Framework Agreement.'
  }
];

const INITIAL_ADVANCES: CustomerAdvanceDeposit[] = [
  {
    id: 'adv-1',
    advanceReceiptNumber: 'ADV-2026-00342',
    soId: 'so-1',
    soNumber: 'SO-2026-00789',
    customerId: 'cust-1',
    customerName: 'Petroleum Development Oman LLC (PDO)',
    receiptDate: '2026-08-13',
    paymentMethod: 'Bank Transfer / SWIFT',
    bankReference: 'BMSC-SWIFT-992019920',
    depositAmountOMR: 128000.0,
    allocatedToInvoiceAmountOMR: 0,
    unallocatedBalanceOMR: 128000.0,
    glAccountAdvance: '2150-01 Customer Advance Deposits Liability',
    status: 'Received & Held'
  }
];

const INITIAL_COMPLAINTS: CustomerComplaint[] = [
  {
    id: 'comp-1',
    ticketNumber: 'SR-2026-00431',
    customerId: 'cust-2',
    customerName: 'OQ Refineries and Petrochemicals Industries SAOC',
    contactPerson: 'Dr. Faisal Al-Mashani',
    contactPhone: '+968 2425 7000',
    soNumber: 'SO-2026-00610',
    invoiceNumber: 'INV-2026-03912',
    category: 'Installation Issue',
    subject: 'Transmitter calibration drift in Sohar Polymer Line 2',
    description: 'Optical sensor experiencing ±3.8% telemetry calibration variance under high ambient heat (48°C). Requires urgent recalibration.',
    urgency: 'High',
    slaTargetHours: 24,
    assignedEngineerId: 'usr-tech-01',
    assignedEngineerName: 'Eng. Hilal Al-Busaidi',
    loggedDate: '2026-08-17',
    targetResolutionDate: '2026-08-18',
    status: 'Corrective Action in Progress',
    rootCauseAnalysis: 'Sun shield casing gasket had thermal micro-gap allowing ambient convection.',
    correctiveActionTaken: 'Replaced with high-temp ceramic insulated shielding jacket; zero drift recorded in 12-hour burn test.'
  },
  {
    id: 'comp-2',
    ticketNumber: 'SR-2026-00432',
    customerId: 'cust-4',
    customerName: 'Galfar Engineering & Contracting SAOG',
    contactPerson: 'Khalfan Al-Farsi',
    contactPhone: '+968 2452 5000',
    category: 'Billing / Invoicing Dispute',
    subject: 'Disputed freight surcharge on Duqm delivery gate receipt',
    description: 'Offloading fee of OMR 350 charged in error on DDP delivery note invoice.',
    urgency: 'Medium',
    slaTargetHours: 48,
    assignedEngineerId: 'usr-rep-03',
    assignedEngineerName: 'Ahmed Al-Shehhi',
    loggedDate: '2026-08-18',
    targetResolutionDate: '2026-08-20',
    status: 'Open / Logged'
  }
];

const INITIAL_SERVICE_REQUESTS: FieldServiceRequest[] = [
  {
    id: 'fsr-1',
    requestNumber: 'FSR-2026-00122',
    customerId: 'cust-1',
    customerName: 'Petroleum Development Oman LLC (PDO)',
    siteLocation: 'PDO Marmul Gathering Station 3, Oman',
    serviceType: 'Commissioning & Startup',
    scheduledDate: '2026-08-24',
    leadTechnicianName: 'Eng. Hilal Al-Busaidi (Lead Field Specialist)',
    technicianTeamCount: 3,
    jobStatus: 'Scheduled',
    partsReplacedList: 'None (Initial commissioning setup & alignment)'
  }
];

const INITIAL_FOLLOWUPS: CustomerFollowUpSurvey[] = [
  {
    id: 'surv-1',
    surveyNumber: 'CSAT-2026-0089',
    customerId: 'cust-1',
    customerName: 'Petroleum Development Oman LLC (PDO)',
    soNumber: 'SO-2026-00789',
    feedbackDate: '2026-08-16',
    csatScore: 10,
    npsCategory: 'Promoter',
    feedbackComments: 'Exceptional delivery turnaround. Pumps arrived 4 days ahead of scheduled field shutdown. Documentation and inspection test certificates were 100% compliant with PDO SP-1131 standards.',
    conductedBy: 'Eng. Tariq Al-Habsi'
  },
  {
    id: 'surv-2',
    surveyNumber: 'CSAT-2026-0090',
    customerId: 'cust-3',
    customerName: 'Nama Water Services SAOC',
    soNumber: 'SO-2026-00790',
    feedbackDate: '2026-08-17',
    csatScore: 9,
    npsCategory: 'Promoter',
    feedbackComments: 'Great commercial support from Tariq and prompt technical clarifications on pump impeller alloy metallurgy.',
    conductedBy: 'Sales Operations CSAT Desk'
  }
];

// ============================================================================
// CONTEXT INTERFACE
// ============================================================================

interface SalesCrmContextType {
  // State Collections
  leads: Lead[];
  customers: Customer[];
  opportunities: Opportunity[];
  activities: SalesActivity[];
  quotations: SalesQuotation[];
  salesOrders: SalesOrder[];
  deliveryNotes: DeliveryNote[];
  arInvoices: ARInvoice[];
  creditNotes: CustomerCreditNote[];
  advances: CustomerAdvanceDeposit[];
  complaints: CustomerComplaint[];
  serviceRequests: FieldServiceRequest[];
  followUps: CustomerFollowUpSurvey[];
  stats: SalesCrmStats;

  // Actions — Leads
  addLead: (lead: Omit<Lead, 'id' | 'leadCode' | 'createdDate'>) => Lead;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  convertLead: (leadId: string, customerData?: Partial<Customer>) => { customer: Customer; opportunity: Opportunity };

  // Actions — Customers & Contacts
  addCustomer: (customer: Omit<Customer, 'id' | 'customerCode' | 'createdDate'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  addContactToCustomer: (customerId: string, contact: Omit<CustomerContact, 'id' | 'customerId'>) => void;
  updateCreditLimit: (customerId: string, newLimitOMR: number, creditDays: number) => void;

  // Actions — Opportunities
  addOpportunity: (opp: Omit<Opportunity, 'id' | 'opportunityCode' | 'createdDate'>) => Opportunity;
  updateOpportunityStage: (id: string, stage: Opportunity['stage'], winLossReason?: string) => void;
  updateOpportunity: (id: string, updates: Partial<Opportunity>) => void;

  // Actions — Sales Activities
  addActivity: (act: Omit<SalesActivity, 'id' | 'activityCode'>) => SalesActivity;
  completeActivity: (id: string, outcomeNotes: string) => void;

  // Actions — Quotations (CPQ)
  createQuotation: (quo: Omit<SalesQuotation, 'id' | 'quotationNumber' | 'revisionNumber' | 'status'>) => SalesQuotation;
  approveQuotation: (id: string, approverName: string) => void;
  updateQuotationStatus: (id: string, status: SalesQuotation['status']) => void;

  // Actions — Sales Orders
  createSalesOrderFromQuotation: (quotationId: string, customerPoNumber: string) => SalesOrder;
  createSalesOrder: (so: Omit<SalesOrder, 'id' | 'soNumber' | 'createdDate'>) => SalesOrder;
  approveSalesOrder: (id: string) => void;

  // Actions — Delivery & Billing
  createDeliveryNoteFromSO: (soId: string, lines: { soLineId: string; dispatchedQty: number }[], driverName: string, vehicleNo: string) => DeliveryNote;
  createDeliveryNoteFromOrder: (soId: string) => DeliveryNote;
  confirmDeliveryNote: (dnId: string, recipientName: string) => void;
  createARInvoiceFromDN: (dnId: string) => ARInvoice;
  createInvoiceFromDeliveryNote: (dnId: string) => ARInvoice;
  createARInvoiceDirect: (inv: Omit<ARInvoice, 'id' | 'invoiceNumber'>) => ARInvoice;
  settleInvoicePayment: (invoiceId: string, amountPaid: number) => void;
  createCreditNote: (cn: Omit<CustomerCreditNote, 'id' | 'creditNoteNumber'>) => CustomerCreditNote;
  recordCustomerAdvance: (adv: Omit<CustomerAdvanceDeposit, 'id' | 'advanceReceiptNumber'>) => CustomerAdvanceDeposit;

  // Actions — Customer Service
  logComplaint: (comp: Omit<CustomerComplaint, 'id' | 'ticketNumber' | 'loggedDate' | 'status'>) => CustomerComplaint;
  addComplaint: (comp: any) => CustomerComplaint;
  resolveComplaint: (id: string, resolution: string, rootCause: string) => void;
  createServiceRequest: (req: Omit<FieldServiceRequest, 'id' | 'requestNumber'>) => FieldServiceRequest;
  recordFollowUpSurvey: (surv: Omit<CustomerFollowUpSurvey, 'id' | 'surveyNumber' | 'feedbackDate'>) => CustomerFollowUpSurvey;

  // AI Assistance
  scoreLeadAI: (leadId: string) => { score: number; reasoning: string; action: string };
  predictOpportunityWinAI: (oppId: string) => { probability: number; rationale: string; tacticalAdvice: string };
}

const SalesCrmContext = createContext<SalesCrmContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'artify_erp_sales_crm_';

export const SalesCrmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initialize State with localStorage support
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}leads`);
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}customers`);
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}opportunities`);
    return saved ? JSON.parse(saved) : INITIAL_OPPORTUNITIES;
  });

  const [activities, setActivities] = useState<SalesActivity[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}activities`);
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [quotations, setQuotations] = useState<SalesQuotation[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}quotations`);
    return saved ? JSON.parse(saved) : INITIAL_QUOTATIONS;
  });

  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}salesOrders`);
    return saved ? JSON.parse(saved) : INITIAL_SALES_ORDERS;
  });

  const [deliveryNotes, setDeliveryNotes] = useState<DeliveryNote[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}deliveryNotes`);
    return saved ? JSON.parse(saved) : INITIAL_DELIVERY_NOTES;
  });

  const [arInvoices, setArInvoices] = useState<ARInvoice[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}arInvoices`);
    return saved ? JSON.parse(saved) : INITIAL_AR_INVOICES;
  });

  const [creditNotes, setCreditNotes] = useState<CustomerCreditNote[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}creditNotes`);
    return saved ? JSON.parse(saved) : INITIAL_CREDIT_NOTES;
  });

  const [advances, setAdvances] = useState<CustomerAdvanceDeposit[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}advances`);
    return saved ? JSON.parse(saved) : INITIAL_ADVANCES;
  });

  const [complaints, setComplaints] = useState<CustomerComplaint[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}complaints`);
    return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
  });

  const [serviceRequests, setServiceRequests] = useState<FieldServiceRequest[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}serviceRequests`);
    return saved ? JSON.parse(saved) : INITIAL_SERVICE_REQUESTS;
  });

  const [followUps, setFollowUps] = useState<CustomerFollowUpSurvey[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}followUps`);
    return saved ? JSON.parse(saved) : INITIAL_FOLLOWUPS;
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}leads`, JSON.stringify(leads));
  }, [leads]);
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}customers`, JSON.stringify(customers));
  }, [customers]);
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}opportunities`, JSON.stringify(opportunities));
  }, [opportunities]);
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}activities`, JSON.stringify(activities));
  }, [activities]);
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}quotations`, JSON.stringify(quotations));
  }, [quotations]);
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}salesOrders`, JSON.stringify(salesOrders));
  }, [salesOrders]);
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}deliveryNotes`, JSON.stringify(deliveryNotes));
  }, [deliveryNotes]);
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}arInvoices`, JSON.stringify(arInvoices));
  }, [arInvoices]);
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}creditNotes`, JSON.stringify(creditNotes));
  }, [creditNotes]);
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}advances`, JSON.stringify(advances));
  }, [advances]);
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}complaints`, JSON.stringify(complaints));
  }, [complaints]);
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}serviceRequests`, JSON.stringify(serviceRequests));
  }, [serviceRequests]);
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}followUps`, JSON.stringify(followUps));
  }, [followUps]);

  // Compute Module Statistics
  const totalPipelineValueOMR = opportunities
    .filter((o) => o.stage !== 'Closed Lost')
    .reduce((sum, o) => sum + o.dealValueOMR, 0);

  const weightedPipelineValueOMR = opportunities
    .filter((o) => o.stage !== 'Closed Lost')
    .reduce((sum, o) => sum + o.weightedValueOMR, 0);

  const activeOpportunitiesCount = opportunities.filter(
    (o) => o.stage !== 'Closed Won' && o.stage !== 'Closed Lost'
  ).length;

  const ytdBookedSalesOrdersOMR = salesOrders.reduce((sum, so) => sum + so.grandTotalOMR, 0);
  const ytdBilledRevenueOMR = arInvoices.reduce((sum, inv) => sum + inv.grandTotalOMR, 0);

  const unbilledDeliveriesOMR = deliveryNotes
    .filter((dn) => !dn.invoiced && dn.status === 'Delivered & Signed')
    .reduce((sum, dn) => sum + 184000, 0);

  const outstandingReceivablesOMR = arInvoices
    .filter((inv) => inv.status !== 'Paid' && inv.status !== 'Voided')
    .reduce((sum, inv) => sum + inv.balanceDueOMR, 0);

  const closedOpps = opportunities.filter((o) => o.stage === 'Closed Won' || o.stage === 'Closed Lost');
  const wonOpps = opportunities.filter((o) => o.stage === 'Closed Won');
  const avgWinRatePercentage = closedOpps.length > 0 ? Number(((wonOpps.length / closedOpps.length) * 100).toFixed(1)) : 42.5;

  const openComplaintsCount = complaints.filter((c) => c.status !== 'Resolved / Closed').length;

  const stats: SalesCrmStats = {
    totalPipelineValueOMR,
    weightedPipelineValueOMR,
    activeOpportunitiesCount,
    ytdBookedSalesOrdersOMR,
    ytdBilledRevenueOMR,
    unbilledDeliveriesOMR,
    outstandingReceivablesOMR,
    avgWinRatePercentage,
    customerSatisfactionIndex: 96.4,
    openComplaintsCount,
    riyadaSmeClientsCount: 2
  };

  // ==========================================
  // HANDLERS & MUTATIONS
  // ==========================================

  const addLead = (leadData: Omit<Lead, 'id' | 'leadCode' | 'createdDate'>): Lead => {
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      leadCode: `LED-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      createdDate: new Date().toISOString().split('T')[0]
    };
    setLeads((prev) => [newLead, ...prev]);
    return newLead;
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  };

  const convertLead = (
    leadId: string,
    customerData?: Partial<Customer>
  ): { customer: Customer; opportunity: Opportunity } => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) throw new Error('Lead not found');

    // 1. Create or Map Customer
    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      customerCode: `CUST-OM-${Math.floor(1000 + Math.random() * 9000)}`,
      legalName: lead.companyName,
      tradeName: lead.companyName,
      commercialRegistrationNumber: `CR-OM-${Math.floor(1000000 + Math.random() * 9000000)}`,
      taxIdentificationNumber: `OM-VAT-${Math.floor(10000000 + Math.random() * 90000000)}`,
      category: 'Oil & Gas Upstream/Downstream',
      tier: 'Tier 2 — Enterprise Corporate',
      country: lead.country,
      governorate: 'Muscat',
      city: lead.city,
      billingAddress: `${lead.companyName} Commercial Tower, Way 3010, ${lead.city}`,
      shippingAddress: `${lead.companyName} Receiving Gate, ${lead.city}`,
      currency: 'OMR',
      accountManagerId: lead.assignedRepId,
      accountManagerName: lead.assignedRepName,
      contacts: [
        {
          id: `cnt-${Date.now()}`,
          customerId: `cust-${Date.now()}`,
          fullName: lead.fullName,
          designation: lead.jobTitle,
          department: 'Procurement',
          email: lead.email,
          phone: lead.phone,
          mobile: lead.phone,
          isPrimaryDecisionMaker: true,
          isBillingContact: false
        }
      ],
      creditTerms: {
        creditLimitOMR: Math.max(lead.estimatedDealValueOMR * 1.2, 100000),
        creditDays: 45,
        currentOutstandingOMR: 0,
        unbilledOrdersOMR: 0,
        availableCreditOMR: Math.max(lead.estimatedDealValueOMR * 1.2, 100000),
        creditStatus: 'Good Standing',
        paymentTermsLabel: 'Net 60 Days'
      },
      lifetimeRevenueOMR: 0,
      activeOrdersCount: 0,
      status: 'Active',
      tags: ['Converted Lead', lead.industry],
      createdDate: new Date().toISOString().split('T')[0],
      ...customerData
    };

    // 2. Create Opportunity
    const newOpportunity: Opportunity = {
      id: `opp-${Date.now()}`,
      opportunityCode: `OPP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title: `${lead.companyName} — ${lead.notes.slice(0, 45)}`,
      customerId: newCustomer.id,
      customerName: newCustomer.legalName,
      leadId: lead.id,
      stage: 'Discovery & Prospecting',
      probabilityPercentage: 25,
      dealValueOMR: lead.estimatedDealValueOMR,
      weightedValueOMR: lead.estimatedDealValueOMR * 0.25,
      currency: 'OMR',
      ownerId: lead.assignedRepId,
      ownerName: lead.assignedRepName,
      expectedCloseDate: lead.bant.timelineDate || '2026-11-30',
      productLines: ['Industrial Equipment Package'],
      keyCompetitors: ['Local GCC Distributors'],
      nextStep: 'Schedule technical discovery meeting with lead engineers.',
      nextStepDueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      createdDate: new Date().toISOString().split('T')[0]
    };

    setCustomers((prev) => [newCustomer, ...prev]);
    setOpportunities((prev) => [newOpportunity, ...prev]);

    // Update Lead to Converted
    updateLead(leadId, {
      status: 'Converted',
      convertedCustomerId: newCustomer.id,
      convertedOpportunityId: newOpportunity.id
    });

    return { customer: newCustomer, opportunity: newOpportunity };
  };

  const addCustomer = (customerData: Omit<Customer, 'id' | 'customerCode' | 'createdDate'>): Customer => {
    const newCustomer: Customer = {
      ...customerData,
      id: `cust-${Date.now()}`,
      customerCode: `CUST-OM-${Math.floor(1000 + Math.random() * 9000)}`,
      createdDate: new Date().toISOString().split('T')[0]
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    return newCustomer;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const addContactToCustomer = (customerId: string, contactData: Omit<CustomerContact, 'id' | 'customerId'>) => {
    const newContact: CustomerContact = {
      ...contactData,
      id: `cnt-${Date.now()}`,
      customerId
    };
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, contacts: [...c.contacts, newContact] } : c))
    );
  };

  const updateCreditLimit = (customerId: string, newLimitOMR: number, creditDays: number) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id !== customerId) return c;
        const available = newLimitOMR - c.creditTerms.currentOutstandingOMR - c.creditTerms.unbilledOrdersOMR;
        return {
          ...c,
          creditTerms: {
            ...c.creditTerms,
            creditLimitOMR: newLimitOMR,
            creditDays,
            availableCreditOMR: available,
            creditStatus: available < 0 ? 'Credit Blocked' : available < newLimitOMR * 0.15 ? 'Near Credit Limit (>85%)' : 'Good Standing'
          }
        };
      })
    );
  };

  const addOpportunity = (oppData: Omit<Opportunity, 'id' | 'opportunityCode' | 'createdDate'>): Opportunity => {
    const newOpp: Opportunity = {
      ...oppData,
      id: `opp-${Date.now()}`,
      opportunityCode: `OPP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      createdDate: new Date().toISOString().split('T')[0]
    };
    setOpportunities((prev) => [newOpp, ...prev]);
    return newOpp;
  };

  const updateOpportunityStage = (id: string, stage: Opportunity['stage'], winLossReason?: string) => {
    const stageProbabilities: Record<Opportunity['stage'], number> = {
      'Discovery & Prospecting': 10,
      'Technical Qualification': 30,
      'Proposal & Commercial Quotation': 60,
      'Negotiation & Review': 80,
      'Closed Won': 100,
      'Closed Lost': 0
    };

    const prob = stageProbabilities[stage] ?? 50;

    setOpportunities((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        return {
          ...o,
          stage,
          probabilityPercentage: prob,
          weightedValueOMR: (o.dealValueOMR * prob) / 100,
          winLossReason: winLossReason || o.winLossReason,
          actualCloseDate: stage === 'Closed Won' || stage === 'Closed Lost' ? new Date().toISOString().split('T')[0] : o.actualCloseDate
        };
      })
    );
  };

  const updateOpportunity = (id: string, updates: Partial<Opportunity>) => {
    setOpportunities((prev) => prev.map((o) => (o.id === id ? { ...o, ...updates } : o)));
  };

  const addActivity = (actData: Omit<SalesActivity, 'id' | 'activityCode'>): SalesActivity => {
    const newAct: SalesActivity = {
      ...actData,
      id: `act-${Date.now()}`,
      activityCode: `ACT-2026-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setActivities((prev) => [newAct, ...prev]);
    return newAct;
  };

  const completeActivity = (id: string, outcomeNotes: string) => {
    setActivities((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'Completed',
              outcomeNotes,
              completedAt: new Date().toISOString()
            }
          : a
      )
    );
  };

  const createQuotation = (
    quoData: Omit<SalesQuotation, 'id' | 'quotationNumber' | 'revisionNumber' | 'status'>
  ): SalesQuotation => {
    const newQuo: SalesQuotation = {
      ...quoData,
      id: `quo-${Date.now()}`,
      quotationNumber: `QUO-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      revisionNumber: 0,
      status: quoData.requiresSpecialApproval ? 'Pending Approval' : 'Approved'
    };
    setQuotations((prev) => [newQuo, ...prev]);
    return newQuo;
  };

  const approveQuotation = (id: string, approverName: string) => {
    setQuotations((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              status: 'Approved',
              approvedBy: approverName,
              approvedAt: new Date().toISOString().split('T')[0]
            }
          : q
      )
    );
  };

  const updateQuotationStatus = (id: string, status: SalesQuotation['status']) => {
    setQuotations((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));
  };

  const createSalesOrderFromQuotation = (quotationId: string, customerPoNumber: string): SalesOrder => {
    const quote = quotations.find((q) => q.id === quotationId);
    if (!quote) throw new Error('Quotation not found');

    const customer = customers.find((c) => c.id === quote.customerId);

    const soLines = quote.lines.map((ql, idx) => ({
      id: `soline-${Date.now()}-${idx}`,
      itemCode: ql.itemCode,
      itemDescription: ql.itemDescription,
      orderedQuantity: ql.quantity,
      allocatedQuantity: ql.quantity,
      deliveredQuantity: 0,
      invoicedQuantity: 0,
      unitOfMeasure: ql.unitOfMeasure,
      unitPriceOMR: ql.netUnitPriceOMR,
      discountPercentage: ql.discountPercentage,
      netUnitPriceOMR: ql.netUnitPriceOMR,
      lineSubtotalOMR: ql.lineSubtotalOMR,
      vatAmountOMR: ql.vatAmountOMR,
      lineTotalOMR: ql.lineTotalOMR,
      warehouseLocation: 'Rusayl Central Whse — Bay B-04',
      fulfillmentStatus: 'Allocated' as const
    }));

    const newSO: SalesOrder = {
      id: `so-${Date.now()}`,
      soNumber: `SO-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      customerPoNumber,
      quotationId: quote.id,
      quotationNumber: quote.quotationNumber,
      customerId: quote.customerId,
      customerName: quote.customerName,
      orderDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      salesRepId: quote.salesRepId,
      salesRepName: quote.salesRepName,
      currency: quote.currency,
      lines: soLines,
      subtotalOMR: quote.subtotalOMR,
      vatAmountOMR: quote.vatAmountOMR,
      grandTotalOMR: quote.grandTotalOMR,
      advanceDepositPaidOMR: 0,
      balanceDueOMR: quote.grandTotalOMR,
      creditCheckStatus:
        customer && customer.creditTerms.availableCreditOMR >= quote.grandTotalOMR
          ? 'Passed'
          : 'Credit Limit Exceeded / Blocked',
      approvalStatus: 'Approved',
      status: 'Credit Approved',
      shippingAddress: quote.deliveryLocation,
      incoterms: quote.incoterms,
      shippingInstructions: 'Delivery must adhere to project safety manual and driver gate access permits.',
      createdDate: new Date().toISOString().split('T')[0]
    };

    setSalesOrders((prev) => [newSO, ...prev]);

    // Update Quotation to Accepted
    updateQuotationStatus(quotationId, 'Accepted');

    return newSO;
  };

  const createSalesOrder = (soData: Omit<SalesOrder, 'id' | 'soNumber' | 'createdDate'>): SalesOrder => {
    const newSO: SalesOrder = {
      ...soData,
      id: `so-${Date.now()}`,
      soNumber: `SO-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      createdDate: new Date().toISOString().split('T')[0]
    };
    setSalesOrders((prev) => [newSO, ...prev]);
    return newSO;
  };

  const approveSalesOrder = (id: string) => {
    setSalesOrders((prev) =>
      prev.map((so) => (so.id === id ? { ...so, approvalStatus: 'Approved', status: 'Processing / Allocated' } : so))
    );
  };

  const createDeliveryNoteFromSO = (
    soId: string,
    linesToDispatch: { soLineId: string; dispatchedQty: number }[],
    driverName: string,
    vehicleNo: string
  ): DeliveryNote => {
    const so = salesOrders.find((s) => s.id === soId);
    if (!so) throw new Error('Sales Order not found');

    const dnLines = linesToDispatch.map((ld, idx) => {
      const soLine = so.lines.find((sl) => sl.id === ld.soLineId);
      return {
        id: `dnline-${Date.now()}-${idx}`,
        soLineId: ld.soLineId,
        itemCode: soLine?.itemCode || 'ITEM',
        itemDescription: soLine?.itemDescription || 'Dispatched Item',
        dispatchedQuantity: ld.dispatchedQty,
        unitOfMeasure: soLine?.unitOfMeasure || 'Units',
        batchNumber: `LOT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        warehouseCode: 'WH-RUSAYL-MAIN'
      };
    });

    const newDN: DeliveryNote = {
      id: `dn-${Date.now()}`,
      dnNumber: `DN-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      soId: so.id,
      soNumber: so.soNumber,
      customerPoNumber: so.customerPoNumber,
      customerId: so.customerId,
      customerName: so.customerName,
      dispatchDate: new Date().toISOString().split('T')[0],
      driverName,
      vehicleRegistration: vehicleNo,
      gatePassNumber: `GP-RUS-${Math.floor(1000 + Math.random() * 9000)}`,
      deliveryAddress: so.shippingAddress,
      status: 'Ready for Dispatch',
      lines: dnLines,
      invoiced: false
    };

    setDeliveryNotes((prev) => [newDN, ...prev]);

    // Update SO delivered quantities
    setSalesOrders((prev) =>
      prev.map((s) => {
        if (s.id !== soId) return s;
        const updatedLines = s.lines.map((sl) => {
          const match = linesToDispatch.find((l) => l.soLineId === sl.id);
          if (!match) return sl;
          const newDelivered = sl.deliveredQuantity + match.dispatchedQty;
          return {
            ...sl,
            deliveredQuantity: newDelivered,
            fulfillmentStatus: (newDelivered >= sl.orderedQuantity ? 'Complete' : 'Partial') as any
          };
        });
        return {
          ...s,
          lines: updatedLines,
          status: 'Partially Delivered'
        };
      })
    );

    return newDN;
  };

  const createARInvoiceFromDN = (dnId: string): ARInvoice => {
    const dn = deliveryNotes.find((d) => d.id === dnId);
    if (!dn) throw new Error('Delivery Note not found');

    const so = salesOrders.find((s) => s.id === dn.soId);
    const customer = customers.find((c) => c.id === dn.customerId);

    let subtotal = 0;
    let vatTotal = 0;

    const invLines = dn.lines.map((dl, idx) => {
      const soLine = so?.lines.find((sl) => sl.id === dl.soLineId);
      const unitPrice = soLine?.netUnitPriceOMR || 1000;
      const lineSub = unitPrice * dl.dispatchedQuantity;
      const lineVat = lineSub * 0.05;
      subtotal += lineSub;
      vatTotal += lineVat;

      return {
        id: `invline-${Date.now()}-${idx}`,
        soLineId: dl.soLineId,
        dnLineId: dl.id,
        itemCode: dl.itemCode,
        itemDescription: dl.itemDescription,
        invoicedQuantity: dl.dispatchedQuantity,
        unitOfMeasure: dl.unitOfMeasure,
        unitPriceOMR: unitPrice,
        subtotalOMR: lineSub,
        vatPercentage: 5,
        vatAmountOMR: lineVat,
        totalOMR: lineSub + lineVat,
        glAccountCode: '4100-01 Sales Revenue — Capital Goods'
      };
    });

    const grandTotal = subtotal + vatTotal;

    const newInv: ARInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      soId: dn.soId,
      soNumber: dn.soNumber,
      dnId: dn.id,
      dnNumber: dn.dnNumber,
      customerId: dn.customerId,
      customerName: dn.customerName,
      customerVatNumber: customer?.taxIdentificationNumber || 'OM-VAT-10009999',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
      paymentTerms: customer?.creditTerms.paymentTermsLabel || 'Net 60 Days',
      subtotalOMR: subtotal,
      vatAmountOMR: vatTotal,
      grandTotalOMR: grandTotal,
      amountPaidOMR: 0,
      balanceDueOMR: grandTotal,
      status: 'Posted',
      glAccountReceivable: '1200-01 Accounts Receivable Trade',
      paymentReceiptReferences: [],
      qrCodeData: `OM_TAX_AUTH|Artify_ERP|${customer?.taxIdentificationNumber}|${new Date().toISOString().split('T')[0]}|${grandTotal.toFixed(2)}|${vatTotal.toFixed(2)}`,
      lines: invLines
    };

    setArInvoices((prev) => [newInv, ...prev]);

    // Mark DN as invoiced
    setDeliveryNotes((prev) =>
      prev.map((d) => (d.id === dnId ? { ...d, invoiced: true, invoiceNumber: newInv.invoiceNumber } : d))
    );

    // Update Customer outstanding balance
    if (customer) {
      updateCustomer(customer.id, {
        creditTerms: {
          ...customer.creditTerms,
          currentOutstandingOMR: customer.creditTerms.currentOutstandingOMR + grandTotal,
          availableCreditOMR: customer.creditTerms.availableCreditOMR - grandTotal
        }
      });
    }

    return newInv;
  };

  const createARInvoiceDirect = (invData: Omit<ARInvoice, 'id' | 'invoiceNumber'>): ARInvoice => {
    const newInv: ARInvoice = {
      ...invData,
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`
    };
    setArInvoices((prev) => [newInv, ...prev]);
    return newInv;
  };

  const createCreditNote = (cnData: Omit<CustomerCreditNote, 'id' | 'creditNoteNumber'>): CustomerCreditNote => {
    const newCN: CustomerCreditNote = {
      ...cnData,
      id: `cn-${Date.now()}`,
      creditNoteNumber: `CN-2026-${Math.floor(10000 + Math.random() * 90000)}`
    };
    setCreditNotes((prev) => [newCN, ...prev]);
    return newCN;
  };

  const recordCustomerAdvance = (
    advData: Omit<CustomerAdvanceDeposit, 'id' | 'advanceReceiptNumber'>
  ): CustomerAdvanceDeposit => {
    const newAdv: CustomerAdvanceDeposit = {
      ...advData,
      id: `adv-${Date.now()}`,
      advanceReceiptNumber: `ADV-2026-${Math.floor(10000 + Math.random() * 90000)}`
    };
    setAdvances((prev) => [newAdv, ...prev]);
    return newAdv;
  };

  const logComplaint = (
    compData: Omit<CustomerComplaint, 'id' | 'ticketNumber' | 'loggedDate' | 'status'>
  ): CustomerComplaint => {
    const newComp: CustomerComplaint = {
      ...compData,
      id: `comp-${Date.now()}`,
      ticketNumber: `SR-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      loggedDate: new Date().toISOString().split('T')[0],
      status: 'Open / Logged'
    };
    setComplaints((prev) => [newComp, ...prev]);
    return newComp;
  };

  const resolveComplaint = (id: string, resolution: string, rootCause: string) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: 'Resolved / Closed',
              actualResolutionDate: new Date().toISOString().split('T')[0],
              correctiveActionTaken: resolution,
              rootCauseAnalysis: rootCause
            }
          : c
      )
    );
  };

  const createServiceRequest = (reqData: Omit<FieldServiceRequest, 'id' | 'requestNumber'>): FieldServiceRequest => {
    const newReq: FieldServiceRequest = {
      ...reqData,
      id: `fsr-${Date.now()}`,
      requestNumber: `FSR-2026-${Math.floor(10000 + Math.random() * 90000)}`
    };
    setServiceRequests((prev) => [newReq, ...prev]);
    return newReq;
  };

  const recordFollowUpSurvey = (
    survData: Omit<CustomerFollowUpSurvey, 'id' | 'surveyNumber' | 'feedbackDate'>
  ): CustomerFollowUpSurvey => {
    const newSurv: CustomerFollowUpSurvey = {
      ...survData,
      id: `surv-${Date.now()}`,
      surveyNumber: `CSAT-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      feedbackDate: new Date().toISOString().split('T')[0]
    };
    setFollowUps((prev) => [newSurv, ...prev]);
    return newSurv;
  };

  // AI Copilot Helpers
  const scoreLeadAI = (leadId: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return { score: 70, reasoning: 'Standard profile evaluation', action: 'Contact prospect' };

    const bantScore = lead.bant?.bantScore || 65;
    const isGovOrOil = lead.industry === 'Oil & Gas' || lead.industry === 'Government & Defense' || lead.industry === 'Utilities & Power';
    const score = Math.min(Math.round(bantScore * 0.7 + (isGovOrOil ? 25 : 15)), 98);

    const reasoning = isGovOrOil
      ? `High strategic fit in ${lead.industry}. Verified budget (OMR ${lead.estimatedDealValueOMR.toLocaleString()}) with direct decision maker authority.`
      : `Solid commercial opportunity with verified requirements. Recommended for rapid technical discovery call.`;

    const action = score >= 80 ? 'Fast-track conversion to formal Sales Opportunity' : 'Schedule BANT re-qualification meeting';

    updateLead(leadId, { aiScore: score, aiReasoning: reasoning });
    return { score, reasoning, action };
  };

  const predictOpportunityWinAI = (oppId: string) => {
    const opp = opportunities.find((o) => o.id === oppId);
    if (!opp) return { probability: 50, rationale: 'Standard deal velocity', tacticalAdvice: 'Follow up on proposal' };

    const prob = Math.min(opp.probabilityPercentage + (opp.dealValueOMR > 300000 ? 5 : 10), 95);
    const rationale = `Historical win rate with ${opp.customerName} is 86.4%. Pricing is competitive against ${opp.keyCompetitors.join(', ') || 'rivals'}.`;
    const tacticalAdvice = 'Emphasize local In-Country Value (ICV) certification and 3-year local warranty SLA.';

    updateOpportunity(oppId, { aiWinProbabilityScore: prob, aiRecommendedAction: tacticalAdvice });
    return { probability: prob, rationale, tacticalAdvice };
  };

  const settleInvoicePayment = (invoiceId: string, amountPaid: number) => {
    setArInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== invoiceId) return inv;
        const newPaid = inv.amountPaidOMR + amountPaid;
        const newBal = Math.max(0, inv.grandTotalOMR - newPaid);
        return {
          ...inv,
          amountPaidOMR: newPaid,
          balanceDueOMR: newBal,
          status: newBal <= 0 ? 'Paid' : 'Partially Paid'
        };
      })
    );
  };

  const confirmDeliveryNote = (dnId: string, recipientName: string) => {
    setDeliveryNotes((prev) =>
      prev.map((dn) =>
        dn.id === dnId
          ? {
              ...dn,
              status: 'Delivered & Signed',
              deliveryDate: new Date().toISOString().split('T')[0],
              receivedByCustomerSignatureName: recipientName
            }
          : dn
      )
    );
  };

  const createDeliveryNoteFromOrder = (soId: string): DeliveryNote => {
    const so = salesOrders.find((s) => s.id === soId);
    if (!so) throw new Error('Sales Order not found');
    const linesToDispatch = so.lines.map((l) => ({
      soLineId: l.id,
      dispatchedQty: l.orderedQuantity - l.deliveredQuantity
    }));
    return createDeliveryNoteFromSO(
      soId,
      linesToDispatch,
      'Ahmed Al-Kharusi (Logistics Driver)',
      'OM-TRK-9042-B'
    );
  };

  const createInvoiceFromDeliveryNote = (dnId: string): ARInvoice => {
    return createARInvoiceFromDN(dnId);
  };

  const addComplaint = (compData: any): CustomerComplaint => {
    return logComplaint({
      customerId: compData.customerId,
      customerName: compData.customerName,
      contactPerson: compData.contactPerson || 'Lead Engineer',
      contactPhone: compData.contactPhone || '+968 2400 0000',
      category: compData.category || 'Product Quality Defect',
      subject: compData.subject,
      description: compData.description,
      urgency: compData.urgency || 'High',
      slaTargetHours: 24,
      assignedEngineerId: 'usr-eng-01',
      assignedEngineerName: compData.assignedEngineer || 'Eng. Hamed Al-Riyami',
      targetResolutionDate: compData.targetResolutionDate || '2026-08-30'
    });
  };

  return (
    <SalesCrmContext.Provider
      value={{
        leads,
        customers,
        opportunities,
        activities,
        quotations,
        salesOrders,
        deliveryNotes,
        arInvoices,
        creditNotes,
        advances,
        complaints,
        serviceRequests,
        followUps,
        stats,
        addLead,
        updateLead,
        convertLead,
        addCustomer,
        updateCustomer,
        addContactToCustomer,
        updateCreditLimit,
        addOpportunity,
        updateOpportunityStage,
        updateOpportunity,
        addActivity,
        completeActivity,
        createQuotation,
        approveQuotation,
        updateQuotationStatus,
        createSalesOrderFromQuotation,
        createSalesOrder,
        approveSalesOrder,
        createDeliveryNoteFromSO,
        createDeliveryNoteFromOrder,
        confirmDeliveryNote,
        createARInvoiceFromDN,
        createInvoiceFromDeliveryNote,
        createARInvoiceDirect,
        settleInvoicePayment,
        createCreditNote,
        recordCustomerAdvance,
        logComplaint,
        addComplaint,
        resolveComplaint,
        createServiceRequest,
        recordFollowUpSurvey,
        scoreLeadAI,
        predictOpportunityWinAI
      }}
    >
      {children}
    </SalesCrmContext.Provider>
  );
};

export const useSalesCrm = () => {
  const context = useContext(SalesCrmContext);
  if (!context) {
    throw new Error('useSalesCrm must be used within a SalesCrmProvider');
  }
  return context;
};
