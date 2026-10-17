// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 13: ASSET MANAGEMENT
// State Management Context & Real-Time Engines
// ==========================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  FixedAsset,
  AssetCategory,
  AssetClassification,
  AssetPurchaseRecord,
  CWIPProject,
  AssetOpeningBalanceUpload,
  AssetAssignment,
  AssetTransferOrder,
  CustodianProfile,
  DepreciationRun,
  AssetRevaluationRecord,
  AssetImpairmentTest,
  PreventiveMaintenancePlan,
  MaintenanceWorkOrder,
  AssetDisposalRecord,
  AssetSaleInvoice,
  PhysicalVerificationAudit,
  AssetInsurancePolicy,
  AssetAIInsight
} from '../types';
import { mockRandom } from '@/src/utils/mockRandom';

// Seed Categories
const INITIAL_CATEGORIES: AssetCategory[] = [
  {
    id: 'cat-bldg',
    code: 'CAT-100',
    name: 'Land & Buildings',
    assetClass: 'LAND_AND_BUILDING',
    defaultDepreciationMethod: 'STRAIGHT_LINE',
    usefulLifeYears: 25,
    salvageValuePercent: 10,
    assetGlAccount: '150100 - Buildings Cost',
    accumulatedDepGlAccount: '150200 - Accum Dep - Buildings',
    depreciationExpenseGlAccount: '550100 - Depr Exp - Buildings',
    gainLossOnDisposalGlAccount: '720100 - Gain/Loss on Asset Disposal',
    totalAssetsCount: 14,
    totalNBV: 12450000
  },
  {
    id: 'cat-mach',
    code: 'CAT-200',
    name: 'Plant & Heavy Machinery',
    assetClass: 'PLANT_AND_MACHINERY',
    defaultDepreciationMethod: 'STRAIGHT_LINE',
    usefulLifeYears: 10,
    salvageValuePercent: 5,
    assetGlAccount: '151100 - Plant & Machinery Cost',
    accumulatedDepGlAccount: '151200 - Accum Dep - Machinery',
    depreciationExpenseGlAccount: '550200 - Depr Exp - Machinery',
    gainLossOnDisposalGlAccount: '720100 - Gain/Loss on Asset Disposal',
    totalAssetsCount: 68,
    totalNBV: 6820000
  },
  {
    id: 'cat-veh',
    code: 'CAT-300',
    name: 'Vehicles & Commercial Fleet',
    assetClass: 'VEHICLES',
    defaultDepreciationMethod: 'DECLINING_BALANCE',
    usefulLifeYears: 5,
    salvageValuePercent: 10,
    assetGlAccount: '152100 - Motor Vehicles Cost',
    accumulatedDepGlAccount: '152200 - Accum Dep - Vehicles',
    depreciationExpenseGlAccount: '550300 - Depr Exp - Vehicles',
    gainLossOnDisposalGlAccount: '720100 - Gain/Loss on Asset Disposal',
    totalAssetsCount: 92,
    totalNBV: 1940000
  },
  {
    id: 'cat-it',
    code: 'CAT-400',
    name: 'IT Hardware & Infrastructure',
    assetClass: 'IT_HARDWARE',
    defaultDepreciationMethod: 'STRAIGHT_LINE',
    usefulLifeYears: 3,
    salvageValuePercent: 0,
    assetGlAccount: '153100 - IT Equipment Cost',
    accumulatedDepGlAccount: '153200 - Accum Dep - IT Equipment',
    depreciationExpenseGlAccount: '550400 - Depr Exp - IT Equipment',
    gainLossOnDisposalGlAccount: '720100 - Gain/Loss on Asset Disposal',
    totalAssetsCount: 340,
    totalNBV: 680000
  },
  {
    id: 'cat-furn',
    code: 'CAT-500',
    name: 'Furniture & Fixtures',
    assetClass: 'FURNITURE_AND_FIXTURES',
    defaultDepreciationMethod: 'STRAIGHT_LINE',
    usefulLifeYears: 7,
    salvageValuePercent: 5,
    assetGlAccount: '154100 - Furniture & Fixtures Cost',
    accumulatedDepGlAccount: '154200 - Accum Dep - Furniture',
    depreciationExpenseGlAccount: '550500 - Depr Exp - Furniture',
    gainLossOnDisposalGlAccount: '720100 - Gain/Loss on Asset Disposal',
    totalAssetsCount: 520,
    totalNBV: 250000
  }
];

// Seed Classifications
const INITIAL_CLASSIFICATIONS: AssetClassification[] = [
  {
    id: 'cls-1',
    code: 'IFRS-16-PPE',
    name: 'IAS 16 — Property, Plant & Equipment',
    level: 1,
    description: 'Tangible items held for use in production or supply of goods/services or rental.',
    ifrsStandard: 'IAS 16 / IFRS 13',
    taxDepreciationRatePercent: 15,
    active: true
  },
  {
    id: 'cls-2',
    code: 'IFRS-16-ROU',
    name: 'IFRS 16 — Right-of-Use Leased Assets',
    level: 1,
    description: 'Leased equipment and premises recognized under capital lease standards.',
    ifrsStandard: 'IFRS 16',
    taxDepreciationRatePercent: 20,
    active: true
  },
  {
    id: 'cls-3',
    code: 'IAS-38-INT',
    name: 'IAS 38 — Intangible Capitalized Assets',
    level: 1,
    description: 'Enterprise ERP software licenses, patents, and technical know-how.',
    ifrsStandard: 'IAS 38',
    taxDepreciationRatePercent: 33.33,
    active: true
  }
];

// Seed Fixed Assets
const INITIAL_ASSETS: FixedAsset[] = [
  {
    id: 'ast-001',
    assetTag: 'AST-OMN-2023-0101',
    name: 'Liebherr LTM 1250 All-Terrain Mobile Crane 250T',
    description: 'Heavy construction all-terrain hydraulic telescopic mobile crane with 72m boom.',
    categoryId: 'cat-mach',
    categoryName: 'Plant & Heavy Machinery',
    classificationId: 'cls-1',
    classificationName: 'IAS 16 — Property, Plant & Equipment',
    serialNumber: 'LBH-99281-CRN',
    barcode: '890123400101',
    rfidTag: 'RFID-CRN-8812',
    brand: 'Liebherr',
    model: 'LTM 1250-5.1',
    manufactureYear: 2023,
    supplierId: 'VND-LIEBHERR-ME',
    supplierName: 'Liebherr Middle East FZE',
    poNumber: 'PO-2023-0891',
    invoiceNumber: 'INV-LBH-4402',
    currency: 'OMR',
    acquisitionDate: '2023-03-15',
    placedInServiceDate: '2023-04-01',
    originalCost: 780000,
    additionalCosts: 24000, // Shipping & commissioning
    revaluationsTotal: 0,
    impairmentsTotal: 0,
    salvageValue: 75000,
    usefulLifeMonths: 120, // 10 Years
    depreciationMethod: 'STRAIGHT_LINE',
    accumulatedDepreciation: 188750,
    netBookValue: 615250,
    currentYearDepreciation: 72900,
    lastDepreciationDate: '2026-07-31',
    companyId: 'artify-corp',
    branch: 'Muscat Logistics Base',
    plant: 'Muscat Heavy Equipment Yard',
    costCenter: 'CC-OPS-HEAVY',
    department: 'Heavy Machinery & Fleet',
    locationId: 'loc-muscat-yard',
    locationName: 'Muscat Al Rusayl Industrial Yard',
    subLocation: 'Heavy Bay 4',
    gpsCoordinates: { lat: 23.5358, lng: 58.1724 },
    custodianId: 'emp-101',
    custodianName: 'Tariq Al-Balushi',
    custodianEmail: 'tariq.balushi@artify.om',
    custodianBadgeId: 'BDG-9902',
    status: 'IN_SERVICE',
    condition: 'EXCELLENT',
    meterReading: 4820,
    meterUnit: 'HOURS',
    isInsured: true,
    insurancePolicyId: 'POL-OMN-2026-091',
    lastPhysicalAuditDate: '2026-06-15',
    auditStatus: 'VERIFIED',
    createdDate: '2023-03-20',
    updatedDate: '2026-07-31'
  },
  {
    id: 'ast-002',
    assetTag: 'AST-OMN-2022-0245',
    name: 'Sohar Industrial Plant — Manufacturing Complex Bay A',
    description: 'Structural steel factory building, overhead 20T gantry cranes, and climate controlled offices.',
    categoryId: 'cat-bldg',
    categoryName: 'Land & Buildings',
    classificationId: 'cls-1',
    classificationName: 'IAS 16 — Property, Plant & Equipment',
    serialNumber: 'BLD-SOHAR-BAY-A',
    barcode: '890123400245',
    rfidTag: 'RFID-BLD-0104',
    brand: 'Artify Engineering',
    model: 'Heavy Industrial Bay A',
    manufactureYear: 2022,
    supplierId: 'VND-OMAN-CONSTRUCT',
    supplierName: 'Oman National Construction LLC',
    poNumber: 'PO-2022-0112',
    invoiceNumber: 'INV-ONC-9912',
    currency: 'OMR',
    acquisitionDate: '2022-01-10',
    placedInServiceDate: '2022-02-01',
    originalCost: 4500000,
    additionalCosts: 180000,
    revaluationsTotal: 350000, // Revaluation surplus
    impairmentsTotal: 0,
    salvageValue: 500000,
    usefulLifeMonths: 300, // 25 Years
    depreciationMethod: 'STRAIGHT_LINE',
    accumulatedDepreciation: 815000,
    netBookValue: 4215000,
    currentYearDepreciation: 181200,
    lastDepreciationDate: '2026-07-31',
    companyId: 'artify-corp',
    branch: 'Sohar Freezone Facility',
    plant: 'Sohar Manufacturing Plant 1',
    costCenter: 'CC-PLANT-MFG',
    department: 'Operations & Facilities',
    locationId: 'loc-sohar-freezone',
    locationName: 'Sohar Freezone Sector 4',
    subLocation: 'Building A-1',
    gpsCoordinates: { lat: 24.4218, lng: 56.6212 },
    custodianId: 'emp-204',
    custodianName: 'Khalfan Al-Mamari',
    custodianEmail: 'khalfan.mamari@artify.om',
    custodianBadgeId: 'BDG-1104',
    status: 'IN_SERVICE',
    condition: 'GOOD',
    isInsured: true,
    insurancePolicyId: 'POL-OMN-2026-091',
    lastPhysicalAuditDate: '2026-05-20',
    auditStatus: 'VERIFIED',
    createdDate: '2022-01-15',
    updatedDate: '2026-07-31'
  },
  {
    id: 'ast-003',
    assetTag: 'AST-OMN-2024-0312',
    name: 'Mazak Integrex i-450H 5-Axis Multi-Tasking CNC Center',
    description: 'High precision 5-axis simultaneous turning and milling center with 72-tool ATC.',
    categoryId: 'cat-mach',
    categoryName: 'Plant & Heavy Machinery',
    classificationId: 'cls-1',
    classificationName: 'IAS 16 — Property, Plant & Equipment',
    serialNumber: 'MZK-450H-99201',
    barcode: '890123400312',
    rfidTag: 'RFID-CNC-4412',
    brand: 'Yamazaki Mazak',
    model: 'Integrex i-450H S',
    manufactureYear: 2024,
    supplierId: 'VND-MAZAK-GULF',
    supplierName: 'Mazak Gulf Machinery FZCO',
    poNumber: 'PO-2024-0419',
    invoiceNumber: 'INV-MZK-8812',
    currency: 'OMR',
    acquisitionDate: '2024-05-10',
    placedInServiceDate: '2024-06-01',
    originalCost: 320000,
    additionalCosts: 18500,
    revaluationsTotal: 0,
    impairmentsTotal: 0,
    salvageValue: 25000,
    usefulLifeMonths: 120,
    depreciationMethod: 'STRAIGHT_LINE',
    accumulatedDepreciation: 61850,
    netBookValue: 276650,
    currentYearDepreciation: 31350,
    lastDepreciationDate: '2026-07-31',
    companyId: 'artify-corp',
    branch: 'Sohar Freezone Facility',
    plant: 'Sohar High Precision Workshop',
    costCenter: 'CC-MFG-PRECISION',
    department: 'Machining & Tooling',
    locationId: 'loc-sohar-freezone',
    locationName: 'Sohar Freezone Sector 4',
    subLocation: 'Cleanroom Machine Bay 2',
    gpsCoordinates: { lat: 24.4218, lng: 56.6212 },
    custodianId: 'emp-302',
    custodianName: 'Rashid Al-Farsi',
    custodianEmail: 'rashid.farsi@artify.om',
    custodianBadgeId: 'BDG-4491',
    status: 'IN_SERVICE',
    condition: 'EXCELLENT',
    meterReading: 3940,
    meterUnit: 'HOURS',
    isInsured: true,
    insurancePolicyId: 'POL-OMN-2026-091',
    lastPhysicalAuditDate: '2026-06-15',
    auditStatus: 'VERIFIED',
    createdDate: '2024-05-15',
    updatedDate: '2026-07-31'
  },
  {
    id: 'ast-004',
    assetTag: 'AST-OMN-2024-0518',
    name: 'Dell PowerEdge R760 Rack Server Cluster (x8 Nodes)',
    description: 'Enterprise ERP Tier-3 Virtualization and database storage cluster with dual Xeon Gold 6430.',
    categoryId: 'cat-it',
    categoryName: 'IT Hardware & Infrastructure',
    classificationId: 'cls-1',
    classificationName: 'IAS 16 — Property, Plant & Equipment',
    serialNumber: 'DLL-R760-CLUST-8N',
    barcode: '890123400518',
    rfidTag: 'RFID-SRV-9011',
    brand: 'Dell Technologies',
    model: 'PowerEdge R760 Dual 32C',
    manufactureYear: 2024,
    supplierId: 'VND-DELL-ME',
    supplierName: 'Dell Technologies Middle East',
    poNumber: 'PO-2024-0105',
    invoiceNumber: 'INV-DLL-9941',
    currency: 'OMR',
    acquisitionDate: '2024-02-15',
    placedInServiceDate: '2024-03-01',
    originalCost: 145000,
    additionalCosts: 8000,
    revaluationsTotal: 0,
    impairmentsTotal: 0,
    salvageValue: 0,
    usefulLifeMonths: 36, // 3 Years
    depreciationMethod: 'STRAIGHT_LINE',
    accumulatedDepreciation: 123222,
    netBookValue: 29778,
    currentYearDepreciation: 51000,
    lastDepreciationDate: '2026-07-31',
    companyId: 'artify-corp',
    branch: 'Muscat Corporate HQ',
    plant: 'Data Center Tier-3',
    costCenter: 'CC-IT-INFRA',
    department: 'Information Technology',
    locationId: 'loc-muscat-hq',
    locationName: 'Muscat Airport Heights Tower',
    subLocation: 'Server Room 4B',
    gpsCoordinates: { lat: 23.5880, lng: 58.3829 },
    custodianId: 'emp-501',
    custodianName: 'Salim Al-Harthy',
    custodianEmail: 'salim.harthy@artify.om',
    custodianBadgeId: 'BDG-0021',
    status: 'IN_SERVICE',
    condition: 'GOOD',
    isInsured: true,
    insurancePolicyId: 'POL-OMN-2026-091',
    lastPhysicalAuditDate: '2026-07-10',
    auditStatus: 'VERIFIED',
    createdDate: '2024-02-20',
    updatedDate: '2026-07-31'
  },
  {
    id: 'ast-005',
    assetTag: 'AST-OMN-2021-0899',
    name: 'Mercedes-Benz Actros 3340 Prime Mover Heavy Truck (6x4)',
    description: 'Heavy duty long-haul prime mover for container transit between Muscat, Sohar and Salalah.',
    categoryId: 'cat-veh',
    categoryName: 'Vehicles & Commercial Fleet',
    classificationId: 'cls-1',
    classificationName: 'IAS 16 — Property, Plant & Equipment',
    serialNumber: 'MB-WDB-96340-99',
    barcode: '890123400899',
    rfidTag: 'RFID-TRK-7712',
    brand: 'Mercedes-Benz',
    model: 'Actros 3340S OM501LA',
    manufactureYear: 2021,
    supplierId: 'VND-ZAWRA-MOTORS',
    supplierName: 'Zawawi Trading Company LLC',
    poNumber: 'PO-2021-0941',
    invoiceNumber: 'INV-ZTC-1102',
    currency: 'OMR',
    acquisitionDate: '2021-08-10',
    placedInServiceDate: '2021-09-01',
    originalCost: 58000,
    additionalCosts: 3200,
    revaluationsTotal: 0,
    impairmentsTotal: 0,
    salvageValue: 6000,
    usefulLifeMonths: 60, // 5 Years
    depreciationMethod: 'DECLINING_BALANCE',
    accumulatedDepreciation: 52140,
    netBookValue: 9060,
    currentYearDepreciation: 6800,
    lastDepreciationDate: '2026-07-31',
    companyId: 'artify-corp',
    branch: 'Muscat Logistics Base',
    plant: 'Fleet Transportation Hub',
    costCenter: 'CC-FLEET-LOGISTICS',
    department: 'Supply Chain Logistics',
    locationId: 'loc-muscat-yard',
    locationName: 'Muscat Al Rusayl Industrial Yard',
    subLocation: 'Truck Parking Bay 12',
    gpsCoordinates: { lat: 23.5358, lng: 58.1724 },
    custodianId: 'emp-604',
    custodianName: 'Nasir Al-Qasmi',
    custodianEmail: 'nasir.qasmi@artify.om',
    custodianBadgeId: 'BDG-7719',
    status: 'UNDER_MAINTENANCE',
    condition: 'FAIR',
    meterReading: 384200,
    meterUnit: 'KMS',
    isInsured: true,
    insurancePolicyId: 'POL-OMN-2026-091',
    lastPhysicalAuditDate: '2026-06-15',
    auditStatus: 'VERIFIED',
    createdDate: '2021-08-15',
    updatedDate: '2026-07-31'
  },
  {
    id: 'ast-006',
    assetTag: 'AST-OMN-2025-0199',
    name: 'Caterpillar 349D3 Hydraulic Heavy Excavator 48T',
    description: 'Heavy earthmoving tracked hydraulic excavator with 3.2 m3 heavy duty rock bucket.',
    categoryId: 'cat-mach',
    categoryName: 'Plant & Heavy Machinery',
    classificationId: 'cls-1',
    classificationName: 'IAS 16 — Property, Plant & Equipment',
    serialNumber: 'CAT-349D-8819',
    barcode: '890123400199',
    rfidTag: 'RFID-CAT-1109',
    brand: 'Caterpillar',
    model: '349D3 Excavator',
    manufactureYear: 2025,
    supplierId: 'VND-OASIS-CAT',
    supplierName: 'Oasis Trading & Equipment LLC',
    poNumber: 'PO-2025-0311',
    invoiceNumber: 'INV-OTE-9921',
    currency: 'OMR',
    acquisitionDate: '2025-02-14',
    placedInServiceDate: '2025-03-01',
    originalCost: 240000,
    additionalCosts: 9500,
    revaluationsTotal: 0,
    impairmentsTotal: 0,
    salvageValue: 25000,
    usefulLifeMonths: 120,
    depreciationMethod: 'STRAIGHT_LINE',
    accumulatedDepreciation: 31200,
    netBookValue: 218300,
    currentYearDepreciation: 22450,
    lastDepreciationDate: '2026-07-31',
    companyId: 'artify-corp',
    branch: 'Duqm EPC Project Site',
    plant: 'Duqm Refinery Site Package 2',
    costCenter: 'CC-PROJ-DUQM',
    department: 'Site Construction Ops',
    locationId: 'loc-duqm-port',
    locationName: 'Duqm Special Economic Zone',
    subLocation: 'Quarry Sector B',
    gpsCoordinates: { lat: 19.6644, lng: 57.7042 },
    custodianId: 'emp-709',
    custodianName: 'Mubarak Al-Saadi',
    custodianEmail: 'mubarak.saadi@artify.om',
    custodianBadgeId: 'BDG-6601',
    status: 'IN_SERVICE',
    condition: 'GOOD',
    meterReading: 2140,
    meterUnit: 'HOURS',
    isInsured: true,
    insurancePolicyId: 'POL-OMN-2026-091',
    lastPhysicalAuditDate: '2026-04-10',
    auditStatus: 'VERIFIED',
    createdDate: '2025-02-18',
    updatedDate: '2026-07-31'
  }
];

// Seed CWIP Projects
const INITIAL_CWIP: CWIPProject[] = [
  {
    id: 'cwip-001',
    projectCode: 'CWIP-2026-SOLAR-01',
    projectName: 'Sohar Freezone 1.5MW Industrial Rooftop Solar Photovoltaic Plant',
    targetAssetCategory: 'Plant & Heavy Machinery',
    costCenter: 'CC-PLANT-MFG',
    startDate: '2026-01-15',
    estimatedCompletionDate: '2026-09-30',
    budgetAllocated: 650000,
    accumulatedMaterialCost: 380000,
    accumulatedContractorCost: 140000,
    accumulatedInternalLaborCost: 45000,
    accumulatedOverheadCost: 18000,
    totalCwipCost: 583000,
    status: 'IN_PROGRESS',
    completionCertificateNumber: 'CERT-SOHAR-SOLAR-901'
  },
  {
    id: 'cwip-002',
    projectCode: 'CWIP-2026-LAB-EXT',
    projectName: 'Nizwa Regional Distribution Depot — Cold Storage Extension',
    targetAssetCategory: 'Land & Buildings',
    costCenter: 'CC-DIST-NIZWA',
    startDate: '2025-11-01',
    estimatedCompletionDate: '2026-08-15',
    actualCompletionDate: '2026-08-10',
    budgetAllocated: 280000,
    accumulatedMaterialCost: 175000,
    accumulatedContractorCost: 72000,
    accumulatedInternalLaborCost: 21000,
    accumulatedOverheadCost: 8000,
    totalCwipCost: 276000,
    status: 'READY_FOR_CAPITALIZATION',
    completionCertificateNumber: 'MUNI-NIZWA-CC-8821'
  }
];

// Seed Assignments
const INITIAL_ASSIGNMENTS: AssetAssignment[] = [
  {
    id: 'asg-001',
    assignmentNumber: 'ASG-2024-0019',
    assetId: 'ast-001',
    assetTag: 'AST-OMN-2023-0101',
    assetName: 'Liebherr LTM 1250 All-Terrain Mobile Crane 250T',
    employeeId: 'emp-101',
    employeeName: 'Tariq Al-Balushi',
    employeeDepartment: 'Heavy Machinery & Fleet',
    employeeDesignation: 'Chief Crane Master Operator',
    assignedDate: '2023-04-01',
    conditionAtIssuance: 'EXCELLENT',
    signatureReceived: true,
    status: 'ACTIVE',
    acknowledgementNotes: 'Operator verified crane logbook, annual load test certificate, and computer safe load indicator (LMI).'
  },
  {
    id: 'asg-002',
    assignmentNumber: 'ASG-2024-0108',
    assetId: 'ast-005',
    assetTag: 'AST-OMN-2021-0899',
    assetName: 'Mercedes-Benz Actros 3340 Prime Mover Heavy Truck (6x4)',
    employeeId: 'emp-604',
    employeeName: 'Nasir Al-Qasmi',
    employeeDepartment: 'Supply Chain Logistics',
    employeeDesignation: 'Senior Heavy Transport Captain',
    assignedDate: '2021-09-01',
    conditionAtIssuance: 'EXCELLENT',
    signatureReceived: true,
    status: 'ACTIVE',
    acknowledgementNotes: 'Handover complete with dual fuel tanks, telematics tracker, and Oman ROP hazardous goods permit.'
  }
];

// Seed Custodians
const INITIAL_CUSTODIANS: CustodianProfile[] = [
  {
    id: 'cust-1',
    employeeId: 'emp-101',
    fullName: 'Tariq Al-Balushi',
    department: 'Heavy Machinery & Fleet',
    branch: 'Muscat Logistics Base',
    email: 'tariq.balushi@artify.om',
    activeAssetsCount: 2,
    totalAssetsValue: 840000,
    clearanceStatus: 'ASSETS_ASSIGNED'
  },
  {
    id: 'cust-2',
    employeeId: 'emp-204',
    fullName: 'Khalfan Al-Mamari',
    department: 'Operations & Facilities',
    branch: 'Sohar Freezone Facility',
    email: 'khalfan.mamari@artify.om',
    activeAssetsCount: 4,
    totalAssetsValue: 4780000,
    clearanceStatus: 'ASSETS_ASSIGNED'
  },
  {
    id: 'cust-3',
    employeeId: 'emp-501',
    fullName: 'Salim Al-Harthy',
    department: 'Information Technology',
    branch: 'Muscat Corporate HQ',
    email: 'salim.harthy@artify.om',
    activeAssetsCount: 18,
    totalAssetsValue: 215000,
    clearanceStatus: 'ASSETS_ASSIGNED'
  },
  {
    id: 'cust-4',
    employeeId: 'emp-809',
    fullName: 'Fatma Al-Lawati',
    department: 'Finance & Accounts',
    branch: 'Muscat Corporate HQ',
    email: 'fatma.lawati@artify.om',
    activeAssetsCount: 0,
    totalAssetsValue: 0,
    lastClearanceDate: '2026-05-15',
    clearanceStatus: 'CLEARED'
  }
];

// Seed Transfers
const INITIAL_TRANSFERS: AssetTransferOrder[] = [
  {
    id: 'trf-001',
    transferOrderNumber: 'TRF-2026-0042',
    assetId: 'ast-006',
    assetTag: 'AST-OMN-2025-0199',
    assetName: 'Caterpillar 349D3 Hydraulic Heavy Excavator 48T',
    fromBranch: 'Muscat Logistics Base',
    toBranch: 'Duqm EPC Project Site',
    fromCostCenter: 'CC-OPS-HEAVY',
    toCostCenter: 'CC-PROJ-DUQM',
    fromLocation: 'Muscat Al Rusayl Industrial Yard',
    toLocation: 'Duqm Special Economic Zone',
    fromCustodian: 'Tariq Al-Balushi',
    toCustodian: 'Mubarak Al-Saadi',
    requestDate: '2026-03-01',
    effectiveDate: '2026-03-10',
    transferReason: 'Demobilization to Duqm Refinery earthworks expansion project phase 2.',
    requiresGatePass: true,
    gatePassNumber: 'GP-OMN-99120',
    status: 'COMPLETED',
    approvedBy: 'COO — Eng. Ahmed Al-Habsi',
    glReallocationJournalId: 'JV-TRF-2026-0042'
  }
];

// Seed Depreciation Runs
const INITIAL_DEPRECIATION_RUNS: DepreciationRun[] = [
  {
    id: 'dep-run-2026-07',
    runNumber: 'DEP-2026-M07',
    fiscalYear: 2026,
    periodMonth: 7,
    periodName: 'July 2026',
    runDate: '2026-07-31',
    totalAssetsDepreciated: 1840,
    totalDepreciationAmount: 145280,
    status: 'POSTED',
    glJournalVoucherNumber: 'JV-DEP-2026-0731',
    executedBy: 'Senior Asset Accountant',
    categoryBreakdown: [
      { categoryName: 'Land & Buildings', assetsCount: 14, totalDepreciation: 41500 },
      { categoryName: 'Plant & Heavy Machinery', assetsCount: 68, totalDepreciation: 56800 },
      { categoryName: 'Vehicles & Commercial Fleet', assetsCount: 92, totalDepreciation: 28400 },
      { categoryName: 'IT Hardware & Infrastructure', assetsCount: 340, totalDepreciation: 14200 },
      { categoryName: 'Furniture & Fixtures', assetsCount: 520, totalDepreciation: 4380 }
    ]
  },
  {
    id: 'dep-run-2026-06',
    runNumber: 'DEP-2026-M06',
    fiscalYear: 2026,
    periodMonth: 6,
    periodName: 'June 2026',
    runDate: '2026-06-30',
    totalAssetsDepreciated: 1836,
    totalDepreciationAmount: 144950,
    status: 'POSTED',
    glJournalVoucherNumber: 'JV-DEP-2026-0630',
    executedBy: 'Senior Asset Accountant',
    categoryBreakdown: [
      { categoryName: 'Land & Buildings', assetsCount: 14, totalDepreciation: 41500 },
      { categoryName: 'Plant & Heavy Machinery', assetsCount: 67, totalDepreciation: 56500 },
      { categoryName: 'Vehicles & Commercial Fleet', assetsCount: 92, totalDepreciation: 28400 },
      { categoryName: 'IT Hardware & Infrastructure', assetsCount: 338, totalDepreciation: 14170 },
      { categoryName: 'Furniture & Fixtures', assetsCount: 520, totalDepreciation: 4380 }
    ]
  }
];

// Seed Revaluations
const INITIAL_REVALUATIONS: AssetRevaluationRecord[] = [
  {
    id: 'rev-001',
    revaluationNumber: 'REV-2025-0012',
    assetId: 'ast-002',
    assetTag: 'AST-OMN-2022-0245',
    assetName: 'Sohar Industrial Plant — Manufacturing Complex Bay A',
    revaluationDate: '2025-12-15',
    appraiserName: 'Savills Middle East Chartered Surveyors',
    appraisalMethod: 'DEPRECIATED_REPLACEMENT_COST',
    historicalNBV: 3950000,
    newAppraisedFairValue: 4300000,
    revaluationSurplus: 350000,
    newUsefulLifeRemainingMonths: 260,
    effectiveDepreciationRate: 4.61,
    status: 'POSTED_TO_RESERVES',
    notes: 'Revaluation gain of OMR 350,000 credited to Equity Revaluation Reserve account #310500 in accordance with IAS 16.'
  }
];

// Seed Impairment Tests
const INITIAL_IMPAIRMENTS: AssetImpairmentTest[] = [
  {
    id: 'imp-001',
    testReference: 'IMP-2026-TEST-004',
    assetId: 'ast-005',
    assetTag: 'AST-OMN-2021-0899',
    assetName: 'Mercedes-Benz Actros 3340 Prime Mover Heavy Truck (6x4)',
    testDate: '2026-07-15',
    carryingAmount: 12500,
    fairValueLessCostsToSell: 9000,
    valueInUse: 9060,
    recoverableAmount: 9060,
    impairmentLoss: 3440,
    triggerEvent: 'Transmission gearbox seizure and high mileage exceeding 380,000 km.',
    status: 'IMPAIRMENT_CONFIRMED',
    assessor: 'Asset Valuation Committee & Fleet Director'
  }
];

// Seed PM Plans
const INITIAL_PM_PLANS: PreventiveMaintenancePlan[] = [
  {
    id: 'pm-001',
    planCode: 'PM-CRN-500H',
    assetId: 'ast-001',
    assetTag: 'AST-OMN-2023-0101',
    assetName: 'Liebherr LTM 1250 All-Terrain Mobile Crane 250T',
    planName: '500-Hour Hydraulic System & Wire Rope Safety Inspection',
    frequencyType: 'METER_HOURS',
    frequencyInterval: 500,
    lastExecutedDate: '2026-05-10',
    lastExecutedMeterReading: 4500,
    nextDueDate: '2026-08-30',
    nextDueMeterReading: 5000,
    tasksChecklist: [
      { taskName: 'Inspect main hoist and auxiliary wire ropes for broken strands / wear', mandatory: true },
      { taskName: 'Flush and replace hydraulic return line filter elements', mandatory: true },
      { taskName: 'Calibrate Crane Computer Safe Load Indicator (LMI/SLI sensor)', mandatory: true },
      { taskName: 'Grease outrigger cylinders and slew bearing gear teeth', mandatory: true }
    ],
    estimatedLaborHours: 12,
    estimatedCost: 1450,
    assignedTechnician: 'Master Heavy Equipment Specialist — Salim',
    status: 'ACTIVE'
  },
  {
    id: 'pm-002',
    planCode: 'PM-CNC-90D',
    assetId: 'ast-003',
    assetTag: 'AST-OMN-2024-0312',
    assetName: 'Mazak Integrex i-450H 5-Axis Multi-Tasking CNC Center',
    planName: 'Quarterly Spindle Runout & Ball Screw Laser Calibration',
    frequencyType: 'CALENDAR_DAYS',
    frequencyInterval: 90,
    lastExecutedDate: '2026-05-15',
    nextDueDate: '2026-08-15',
    tasksChecklist: [
      { taskName: 'Inspect high-pressure coolant pump and chiller temperature stability', mandatory: true },
      { taskName: 'Laser interferometer calibration of X/Y/Z linear glass scales', mandatory: true },
      { taskName: 'Measure spindle taper runout with dial test indicator (<0.002mm)', mandatory: true },
      { taskName: 'Test tool changer arm grip retention force and sensor interlocks', mandatory: true }
    ],
    estimatedLaborHours: 8,
    estimatedCost: 850,
    assignedTechnician: 'Precision Robotics Specialist — Mazak Certified',
    status: 'OVERDUE'
  }
];

// Seed Work Orders
const INITIAL_WORK_ORDERS: MaintenanceWorkOrder[] = [
  {
    id: 'wo-001',
    workOrderNumber: 'WO-2026-0891',
    type: 'CORRECTIVE',
    priority: 'HIGH',
    assetId: 'ast-005',
    assetTag: 'AST-OMN-2021-0899',
    assetName: 'Mercedes-Benz Actros 3340 Prime Mover Heavy Truck (6x4)',
    location: 'Muscat Al Rusayl Industrial Yard',
    reportedDate: '2026-08-05',
    scheduledDate: '2026-08-06',
    completedDate: '2026-08-09',
    problemDescription: 'EPS Electronic Power Shift transmission error code 4301 and clutch slipping under heavy gradient load.',
    rootCauseAnalysis: 'Hydraulic clutch slave cylinder seal degradation caused pressure leak and overheating.',
    actionTaken: 'Replaced clutch kit, pressure plate, and master/slave actuators. Refilled synthetic transmission fluid.',
    technician: 'Senior Fleet Mechanic — Nasser',
    vendorId: 'VND-ZAWRA-MOTORS',
    vendorName: 'Zawawi Trading Company LLC',
    sparePartsCost: 1850,
    laborCost: 450,
    vendorServiceCost: 300,
    totalCost: 2600,
    sparePartsUsed: [
      { itemCode: 'SP-MB-CLUTCH-KIT', description: 'Genuine MB Actros Heavy Duty Dual Clutch Assembly', quantity: 1, unitCost: 1450, total: 1450 },
      { itemCode: 'SP-MB-ACTUATOR', description: 'EPS Transmission Slave Cylinder Kit', quantity: 1, unitCost: 400, total: 400 }
    ],
    downTimeHours: 42,
    status: 'COMPLETED'
  },
  {
    id: 'wo-002',
    workOrderNumber: 'WO-2026-0902',
    type: 'PREVENTIVE',
    priority: 'MEDIUM',
    assetId: 'ast-003',
    assetTag: 'AST-OMN-2024-0312',
    assetName: 'Mazak Integrex i-450H 5-Axis Multi-Tasking CNC Center',
    location: 'Sohar Freezone Sector 4',
    reportedDate: '2026-08-15',
    scheduledDate: '2026-08-22',
    problemDescription: 'Quarterly routine spindle vibration & laser interferometer alignment check.',
    technician: 'Lead Precision CNC Engineer',
    sparePartsCost: 350,
    laborCost: 500,
    vendorServiceCost: 0,
    totalCost: 850,
    sparePartsUsed: [
      { itemCode: 'SP-FILT-COOLANT', description: '5-Micron High Pressure Coolant Filter Cartridge', quantity: 2, unitCost: 175, total: 350 }
    ],
    downTimeHours: 8,
    status: 'SCHEDULED'
  }
];

// Seed Disposals & Sales
const INITIAL_DISPOSALS: AssetDisposalRecord[] = [
  {
    id: 'disp-001',
    disposalNumber: 'DSP-2026-0019',
    assetId: 'ast-old-091',
    assetTag: 'AST-OMN-2018-0091',
    assetName: 'Toyota Hilux 4x4 Double Cab Pick-up 2.7L (2018 Model)',
    disposalType: 'AUCTION',
    disposalDate: '2026-06-20',
    historicalCost: 11500,
    accumulatedDepreciation: 10350,
    netBookValueAtDisposal: 1150,
    salvageRealizedAmount: 2400,
    netGainLossOnDisposal: 1250, // Gain on disposal
    disposalReason: 'Vehicle reached 320,000 km lifecycle cap; auctioned via public bidding.',
    approver: 'Head of Fleet & CFO',
    status: 'POSTED_TO_GL'
  }
];

const INITIAL_SALES: AssetSaleInvoice[] = [
  {
    id: 'sale-001',
    saleInvoiceNumber: 'AST-INV-2026-0008',
    assetId: 'ast-old-091',
    assetTag: 'AST-OMN-2018-0091',
    assetName: 'Toyota Hilux 4x4 Double Cab Pick-up 2.7L (2018 Model)',
    customerName: 'Al-Batinah Equipment Trading LLC',
    customerTaxId: 'OM1100994411',
    saleDate: '2026-06-20',
    netBookValue: 1150,
    salePriceBeforeTax: 2400,
    vatRatePercent: 5,
    vatAmount: 120,
    totalSaleInvoiceAmount: 2520,
    gainOnSale: 1250,
    paymentReceived: true,
    status: 'PAID'
  }
];

// Seed Audits
const INITIAL_AUDITS: PhysicalVerificationAudit[] = [
  {
    id: 'aud-2026-01',
    auditReference: 'AUD-FA-2026-Q2',
    auditDate: '2026-06-15',
    locationName: 'Muscat Al Rusayl Industrial Yard & HQ',
    auditorName: 'KPMG External Audit Team & Internal Audit',
    totalExpectedAssets: 480,
    scannedAssetsCount: 476,
    missingAssetsCount: 2,
    discrepantLocationCount: 5,
    unrecordedAssetsFound: 1,
    reconciliationStatus: 'RECONCILED',
    scannedRecords: [
      {
        assetTag: 'AST-OMN-2023-0101',
        assetName: 'Liebherr LTM 1250 All-Terrain Mobile Crane 250T',
        expectedLocation: 'Muscat Al Rusayl Industrial Yard',
        actualLocation: 'Muscat Al Rusayl Industrial Yard',
        scannedCondition: 'EXCELLENT',
        status: 'FOUND_MATCH',
        scannedTimestamp: '2026-06-15 09:30:12'
      },
      {
        assetTag: 'AST-OMN-2024-0518',
        assetName: 'Dell PowerEdge R760 Rack Server Cluster',
        expectedLocation: 'Muscat Airport Heights Tower',
        actualLocation: 'Muscat Airport Heights Tower',
        scannedCondition: 'GOOD',
        status: 'FOUND_MATCH',
        scannedTimestamp: '2026-06-15 11:15:40'
      }
    ]
  }
];

// Seed Insurance
const INITIAL_INSURANCE: AssetInsurancePolicy[] = [
  {
    id: 'ins-001',
    policyNumber: 'POL-OMN-2026-091',
    insuranceProvider: 'Oman Qatar Insurance Company SAOG (OQIC)',
    policyType: 'ALL_RISK',
    coverageStartDate: '2026-01-01',
    coverageEndDate: '2026-12-31',
    totalInsuredValue: 24500000,
    annualPremium: 48500,
    deductibleAmount: 5000,
    coveredAssetsCount: 1840,
    policyStatus: 'ACTIVE',
    claims: [
      {
        claimNumber: 'CLM-2026-003',
        incidentDate: '2026-03-22',
        assetTag: 'AST-OMN-2021-0899',
        claimAmount: 4200,
        settledAmount: 3800,
        claimStatus: 'SETTLED'
      }
    ]
  }
];

// Seed AI Insights
const INITIAL_AI_INSIGHTS: AssetAIInsight[] = [
  {
    id: 'ai-ins-1',
    type: 'PREDICTIVE_FAILURE',
    title: 'High Breakdown Probability on Heavy Excavator CAT-349D3',
    severity: 'HIGH',
    affectedAssetTag: 'AST-OMN-2025-0199',
    affectedAssetName: 'Caterpillar 349D3 Hydraulic Heavy Excavator 48T',
    description: 'Vibration telematics and hydraulic oil temperature anomalies indicate impending hydraulic pump cavitation within 120 operating hours.',
    suggestedAction: 'Schedule priority PM order for main pump filter replacement and suction line O-ring inspection before scheduled Duqm shift.',
    financialImpact: 'Avoids estimated OMR 18,500 emergency replacement & 7-day jobsite downtime',
    confidenceScore: 94
  },
  {
    id: 'ai-ins-2',
    type: 'IMPAIRMENT_FLAG',
    title: 'IAS 36 Impairment Indicator on High-Mileage Prime Mover',
    severity: 'MEDIUM',
    affectedAssetTag: 'AST-OMN-2021-0899',
    affectedAssetName: 'Mercedes-Benz Actros 3340 Prime Mover Heavy Truck (6x4)',
    description: 'Vehicle NBV of OMR 9,060 exceeds estimated current fair market scrap/auction value of OMR 7,200 due to gearbox wear and high cumulative mileage.',
    suggestedAction: 'Review carrying amount and book an IAS 36 impairment write-down of OMR 1,860 to General Ledger before Q3 financial close.',
    financialImpact: 'OMR 1,860 P&L write-down compliance adjustment',
    confidenceScore: 89
  },
  {
    id: 'ai-ins-3',
    type: 'AUDIT_ANOMALY',
    title: '2 Unaudited Fixed Assets Detected at Duqm EPC Site',
    severity: 'MEDIUM',
    description: 'Physical RFID verification logs from Q2 indicate 2 mobile diesel generators operating at Duqm Port without registered barcode audit timestamps.',
    suggestedAction: 'Dispatch handheld RFID scanner terminal with site engineer to reconcile subledger tags.',
    financialImpact: 'Prevents statutory audit compliance qualification',
    confidenceScore: 92
  }
];

// Context Type Definition
interface AssetStoreContextType {
  assets: FixedAsset[];
  categories: AssetCategory[];
  classifications: AssetClassification[];
  cwipProjects: CWIPProject[];
  assignments: AssetAssignment[];
  custodians: CustodianProfile[];
  transfers: AssetTransferOrder[];
  depreciationRuns: DepreciationRun[];
  revaluations: AssetRevaluationRecord[];
  impairmentTests: AssetImpairmentTest[];
  pmPlans: PreventiveMaintenancePlan[];
  workOrders: MaintenanceWorkOrder[];
  disposals: AssetDisposalRecord[];
  sales: AssetSaleInvoice[];
  audits: PhysicalVerificationAudit[];
  insurancePolicies: AssetInsurancePolicy[];
  aiInsights: AssetAIInsight[];
  currency: string;
  
  // Quick Financial Metrics
  totalNBV: number;
  totalAssetsCount: number;
  totalCostBasis: number;
  totalAccumDep: number;
  monthlyDepreciationAccrual: number;
  overdueMaintenanceCount: number;
  
  // Actions
  addAsset: (asset: Omit<FixedAsset, 'id' | 'createdDate' | 'updatedDate'>) => void;
  updateAsset: (id: string, updates: Partial<FixedAsset>) => void;
  deleteAsset: (id: string) => void;
  addCategory: (category: Omit<AssetCategory, 'id' | 'totalAssetsCount' | 'totalNBV'>) => void;
  createCWIPProject: (project: Omit<CWIPProject, 'id' | 'totalCwipCost'>) => void;
  capitalizeCWIP: (cwipId: string, assetName: string, categoryId: string, usefulLifeMonths: number) => void;
  assignAsset: (assignment: Omit<AssetAssignment, 'id' | 'assignmentNumber'>) => void;
  createTransferOrder: (order: Omit<AssetTransferOrder, 'id' | 'transferOrderNumber'>) => void;
  executeDepreciationRun: (fiscalYear: number, periodMonth: number, periodName: string) => DepreciationRun;
  postRevaluation: (reval: Omit<AssetRevaluationRecord, 'id' | 'revaluationNumber'>) => void;
  postImpairment: (test: Omit<AssetImpairmentTest, 'id' | 'testReference'>) => void;
  createPMPlan: (plan: Omit<PreventiveMaintenancePlan, 'id' | 'planCode'>) => void;
  createWorkOrder: (wo: Omit<MaintenanceWorkOrder, 'id' | 'workOrderNumber' | 'totalCost'>) => void;
  completeWorkOrder: (woId: string, actionTaken: string, actualCost: number) => void;
  disposeAsset: (disposal: Omit<AssetDisposalRecord, 'id' | 'disposalNumber'>) => void;
  recordAssetSale: (sale: Omit<AssetSaleInvoice, 'id' | 'saleInvoiceNumber'>) => void;
  recordPhysicalAudit: (audit: Omit<PhysicalVerificationAudit, 'id'>) => void;
  addInsurancePolicy: (policy: Omit<AssetInsurancePolicy, 'id'>) => void;
  refreshAiInsights: () => void;
}

const AssetContext = createContext<AssetStoreContextType | undefined>(undefined);

export const AssetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<FixedAsset[]>(INITIAL_ASSETS);
  const [categories, setCategories] = useState<AssetCategory[]>(INITIAL_CATEGORIES);
  const [classifications] = useState<AssetClassification[]>(INITIAL_CLASSIFICATIONS);
  const [cwipProjects, setCwipProjects] = useState<CWIPProject[]>(INITIAL_CWIP);
  const [assignments, setAssignments] = useState<AssetAssignment[]>(INITIAL_ASSIGNMENTS);
  const [custodians, setCustodians] = useState<CustodianProfile[]>(INITIAL_CUSTODIANS);
  const [transfers, setTransfers] = useState<AssetTransferOrder[]>(INITIAL_TRANSFERS);
  const [depreciationRuns, setDepreciationRuns] = useState<DepreciationRun[]>(INITIAL_DEPRECIATION_RUNS);
  const [revaluations, setRevaluations] = useState<AssetRevaluationRecord[]>(INITIAL_REVALUATIONS);
  const [impairmentTests, setImpairmentTests] = useState<AssetImpairmentTest[]>(INITIAL_IMPAIRMENTS);
  const [pmPlans, setPmPlans] = useState<PreventiveMaintenancePlan[]>(INITIAL_PM_PLANS);
  const [workOrders, setWorkOrders] = useState<MaintenanceWorkOrder[]>(INITIAL_WORK_ORDERS);
  const [disposals, setDisposals] = useState<AssetDisposalRecord[]>(INITIAL_DISPOSALS);
  const [sales, setSales] = useState<AssetSaleInvoice[]>(INITIAL_SALES);
  const [audits, setAudits] = useState<PhysicalVerificationAudit[]>(INITIAL_AUDITS);
  const [insurancePolicies, setInsurancePolicies] = useState<AssetInsurancePolicy[]>(INITIAL_INSURANCE);
  const [aiInsights, setAiInsights] = useState<AssetAIInsight[]>(INITIAL_AI_INSIGHTS);
  const currency = 'OMR';

  // Derived Financials
  const totalCostBasis = assets.reduce((sum, a) => sum + a.originalCost + a.additionalCosts, 0);
  const totalAccumDep = assets.reduce((sum, a) => sum + a.accumulatedDepreciation, 0);
  const totalNBV = assets.reduce((sum, a) => sum + a.netBookValue, 0);
  const totalAssetsCount = assets.length;
  const monthlyDepreciationAccrual = depreciationRuns.length > 0 ? depreciationRuns[0].totalDepreciationAmount : 145280;
  const overdueMaintenanceCount = pmPlans.filter(p => p.status === 'OVERDUE').length + workOrders.filter(w => w.status === 'IN_PROGRESS' || w.status === 'SCHEDULED').length;

  // Add Asset
  const addAsset = (newAssetData: Omit<FixedAsset, 'id' | 'createdDate' | 'updatedDate'>) => {
    const id = `ast-${Date.now().toString().slice(-6)}`;
    const cost = newAssetData.originalCost + (newAssetData.additionalCosts || 0);
    const nbv = Math.max(0, cost - (newAssetData.accumulatedDepreciation || 0));
    
    const asset: FixedAsset = {
      ...newAssetData,
      id,
      netBookValue: nbv,
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0]
    };
    
    setAssets(prev => [asset, ...prev]);
  };

  // Update Asset
  const updateAsset = (id: string, updates: Partial<FixedAsset>) => {
    setAssets(prev => prev.map(a => {
      if (a.id === id) {
        const updated = { ...a, ...updates, updatedDate: new Date().toISOString().split('T')[0] };
        // recalculate NBV
        const totalCost = updated.originalCost + (updated.additionalCosts || 0) + (updated.revaluationsTotal || 0) - (updated.impairmentsTotal || 0);
        updated.netBookValue = Math.max(0, totalCost - updated.accumulatedDepreciation);
        return updated;
      }
      return a;
    }));
  };

  // Delete Asset
  const deleteAsset = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  // Add Category
  const addCategory = (catData: Omit<AssetCategory, 'id' | 'totalAssetsCount' | 'totalNBV'>) => {
    const id = `cat-${Date.now().toString().slice(-4)}`;
    const category: AssetCategory = {
      ...catData,
      id,
      totalAssetsCount: 0,
      totalNBV: 0
    };
    setCategories(prev => [...prev, category]);
  };

  // Create CWIP
  const createCWIPProject = (projectData: Omit<CWIPProject, 'id' | 'totalCwipCost'>) => {
    const id = `cwip-${Date.now().toString().slice(-4)}`;
    const totalCost = projectData.accumulatedMaterialCost + projectData.accumulatedContractorCost + projectData.accumulatedInternalLaborCost + projectData.accumulatedOverheadCost;
    const project: CWIPProject = {
      ...projectData,
      id,
      totalCwipCost: totalCost
    };
    setCwipProjects(prev => [project, ...prev]);
  };

  // Capitalize CWIP
  const capitalizeCWIP = (cwipId: string, assetName: string, categoryId: string, usefulLifeMonths: number) => {
    const project = cwipProjects.find(p => p.id === cwipId);
    if (!project) return;

    const cat = categories.find(c => c.id === categoryId) || categories[0];
    const newAssetTag = `AST-CWIP-${new Date().getFullYear()}-${Math.floor(1000 + mockRandom() * 9000)}`;

    addAsset({
      assetTag: newAssetTag,
      name: assetName || project.projectName,
      description: `Capitalized from Construction-in-Progress ${project.projectCode}`,
      categoryId: cat.id,
      categoryName: cat.name,
      classificationId: 'cls-1',
      classificationName: 'IAS 16 — Property, Plant & Equipment',
      serialNumber: project.completionCertificateNumber || `CWIP-CAP-${project.projectCode}`,
      barcode: `890${Math.floor(100000000 + mockRandom() * 900000000)}`,
      brand: 'Internal Capitalization',
      model: 'Commissioned Project',
      manufactureYear: new Date().getFullYear(),
      supplierId: 'INTERNAL-CWIP',
      supplierName: 'Artify Engineering & Construction Div',
      currency: 'OMR',
      acquisitionDate: new Date().toISOString().split('T')[0],
      placedInServiceDate: new Date().toISOString().split('T')[0],
      originalCost: project.totalCwipCost,
      additionalCosts: 0,
      revaluationsTotal: 0,
      impairmentsTotal: 0,
      salvageValue: Math.round(project.totalCwipCost * 0.05),
      usefulLifeMonths: usefulLifeMonths || 240,
      depreciationMethod: cat.defaultDepreciationMethod,
      accumulatedDepreciation: 0,
      netBookValue: project.totalCwipCost,
      currentYearDepreciation: 0,
      companyId: 'artify-corp',
      branch: 'Sohar Freezone Facility',
      plant: 'Sohar Manufacturing Plant 1',
      costCenter: project.costCenter,
      department: 'Operations & Facilities',
      locationId: 'loc-sohar-freezone',
      locationName: 'Sohar Freezone Sector 4',
      status: 'IN_SERVICE',
      condition: 'EXCELLENT',
      isInsured: true
    });

    setCwipProjects(prev => prev.map(p => p.id === cwipId ? {
      ...p,
      status: 'CAPITALIZED',
      actualCompletionDate: new Date().toISOString().split('T')[0]
    } : p));
  };

  // Assign Asset
  const assignAsset = (assignmentData: Omit<AssetAssignment, 'id' | 'assignmentNumber'>) => {
    const id = `asg-${Date.now().toString().slice(-4)}`;
    const assignmentNumber = `ASG-${new Date().getFullYear()}-${Math.floor(1000 + mockRandom() * 9000)}`;
    const newAsg: AssetAssignment = {
      ...assignmentData,
      id,
      assignmentNumber
    };
    setAssignments(prev => [newAsg, ...prev]);

    // Update asset custodian
    updateAsset(assignmentData.assetId, {
      custodianId: assignmentData.employeeId,
      custodianName: assignmentData.employeeName,
      department: assignmentData.employeeDepartment
    });
  };

  // Create Transfer Order
  const createTransferOrder = (orderData: Omit<AssetTransferOrder, 'id' | 'transferOrderNumber'>) => {
    const id = `trf-${Date.now().toString().slice(-4)}`;
    const transferOrderNumber = `TRF-${new Date().getFullYear()}-${Math.floor(1000 + mockRandom() * 9000)}`;
    const newOrder: AssetTransferOrder = {
      ...orderData,
      id,
      transferOrderNumber,
      status: 'APPROVED',
      glReallocationJournalId: `JV-TRF-${Date.now().toString().slice(-6)}`
    };
    setTransfers(prev => [newOrder, ...prev]);

    // Update asset location & cost center
    updateAsset(orderData.assetId, {
      branch: orderData.toBranch,
      costCenter: orderData.toCostCenter,
      locationName: orderData.toLocation,
      custodianName: orderData.toCustodian
    });
  };

  // Execute Depreciation Run
  const executeDepreciationRun = (fiscalYear: number, periodMonth: number, periodName: string): DepreciationRun => {
    let totalRunAmount = 0;
    let assetsCount = 0;

    // Calculate monthly depreciation for every active asset
    const updatedAssets = assets.map(a => {
      if (a.status !== 'IN_SERVICE' && a.status !== 'UNDER_MAINTENANCE') {
        return a;
      }
      
      const depreciableBasis = (a.originalCost + a.additionalCosts + a.revaluationsTotal - a.impairmentsTotal) - a.salvageValue;
      let monthlyDep = 0;

      if (a.depreciationMethod === 'STRAIGHT_LINE') {
        monthlyDep = Math.max(0, depreciableBasis / Math.max(1, a.usefulLifeMonths));
      } else if (a.depreciationMethod === 'DECLINING_BALANCE' || a.depreciationMethod === 'DOUBLE_DECLINING') {
        const annualRate = (2 / (a.usefulLifeMonths / 12));
        monthlyDep = Math.max(0, (a.netBookValue * annualRate) / 12);
      } else {
        monthlyDep = Math.max(0, depreciableBasis / Math.max(1, a.usefulLifeMonths));
      }

      // Do not depreciate below salvage value
      const remainingDepreciable = Math.max(0, a.netBookValue - a.salvageValue);
      const actualMonthlyDep = Math.min(monthlyDep, remainingDepreciable);

      if (actualMonthlyDep > 0) {
        totalRunAmount += actualMonthlyDep;
        assetsCount += 1;
        const newAccum = a.accumulatedDepreciation + actualMonthlyDep;
        const newNbv = Math.max(a.salvageValue, (a.originalCost + a.additionalCosts + a.revaluationsTotal - a.impairmentsTotal) - newAccum);
        return {
          ...a,
          accumulatedDepreciation: Math.round(newAccum),
          netBookValue: Math.round(newNbv),
          currentYearDepreciation: Math.round(a.currentYearDepreciation + actualMonthlyDep),
          lastDepreciationDate: new Date().toISOString().split('T')[0]
        };
      }
      return a;
    });

    setAssets(updatedAssets);

    const newRun: DepreciationRun = {
      id: `dep-run-${Date.now().toString().slice(-6)}`,
      runNumber: `DEP-${fiscalYear}-M${periodMonth.toString().padStart(2, '0')}`,
      fiscalYear,
      periodMonth,
      periodName: periodName || `Period ${periodMonth} ${fiscalYear}`,
      runDate: new Date().toISOString().split('T')[0],
      totalAssetsDepreciated: assetsCount,
      totalDepreciationAmount: Math.round(totalRunAmount),
      status: 'POSTED',
      glJournalVoucherNumber: `JV-DEP-${fiscalYear}-${Math.floor(1000 + mockRandom() * 9000)}`,
      executedBy: 'Senior Asset Controller',
      categoryBreakdown: categories.map(cat => {
        const catAssets = updatedAssets.filter(a => a.categoryId === cat.id);
        const catDep = Math.round(catAssets.reduce((sum, a) => sum + (a.currentYearDepreciation / 12), 0));
        return {
          categoryName: cat.name,
          assetsCount: catAssets.length,
          totalDepreciation: catDep
        };
      })
    };

    setDepreciationRuns(prev => [newRun, ...prev]);
    return newRun;
  };

  // Post Revaluation
  const postRevaluation = (revalData: Omit<AssetRevaluationRecord, 'id' | 'revaluationNumber'>) => {
    const id = `rev-${Date.now().toString().slice(-4)}`;
    const revaluationNumber = `REV-${new Date().getFullYear()}-${Math.floor(1000 + mockRandom() * 9000)}`;
    const newRecord: AssetRevaluationRecord = {
      ...revalData,
      id,
      revaluationNumber,
      status: 'POSTED_TO_RESERVES'
    };
    setRevaluations(prev => [newRecord, ...prev]);

    // Update Asset NBV & Revaluations total
    const targetAsset = assets.find(a => a.id === revalData.assetId);
    if (targetAsset) {
      updateAsset(targetAsset.id, {
        revaluationsTotal: targetAsset.revaluationsTotal + revalData.revaluationSurplus,
        netBookValue: revalData.newAppraisedFairValue,
        usefulLifeMonths: revalData.newUsefulLifeRemainingMonths || targetAsset.usefulLifeMonths
      });
    }
  };

  // Post Impairment
  const postImpairment = (testData: Omit<AssetImpairmentTest, 'id' | 'testReference'>) => {
    const id = `imp-${Date.now().toString().slice(-4)}`;
    const testReference = `IMP-${new Date().getFullYear()}-${Math.floor(1000 + mockRandom() * 9000)}`;
    const newTest: AssetImpairmentTest = {
      ...testData,
      id,
      testReference,
      status: 'POSTED_TO_P_AND_L'
    };
    setImpairmentTests(prev => [newTest, ...prev]);

    // Update asset NBV
    const targetAsset = assets.find(a => a.id === testData.assetId);
    if (targetAsset && testData.impairmentLoss > 0) {
      updateAsset(targetAsset.id, {
        impairmentsTotal: targetAsset.impairmentsTotal + testData.impairmentLoss,
        netBookValue: testData.recoverableAmount
      });
    }
  };

  // Create PM Plan
  const createPMPlan = (planData: Omit<PreventiveMaintenancePlan, 'id' | 'planCode'>) => {
    const id = `pm-${Date.now().toString().slice(-4)}`;
    const planCode = `PM-${Date.now().toString().slice(-5)}`;
    const newPlan: PreventiveMaintenancePlan = {
      ...planData,
      id,
      planCode,
      status: 'ACTIVE'
    };
    setPmPlans(prev => [newPlan, ...prev]);
  };

  // Create Work Order
  const createWorkOrder = (woData: Omit<MaintenanceWorkOrder, 'id' | 'workOrderNumber' | 'totalCost'>) => {
    const id = `wo-${Date.now().toString().slice(-4)}`;
    const workOrderNumber = `WO-${new Date().getFullYear()}-${Math.floor(1000 + mockRandom() * 9000)}`;
    const totalCost = woData.sparePartsCost + woData.laborCost + (woData.vendorServiceCost || 0);
    const newWo: MaintenanceWorkOrder = {
      ...woData,
      id,
      workOrderNumber,
      totalCost,
      status: 'SCHEDULED'
    };
    setWorkOrders(prev => [newWo, ...prev]);

    // Set asset status to under maintenance
    updateAsset(woData.assetId, { status: 'UNDER_MAINTENANCE' });
  };

  // Complete Work Order
  const completeWorkOrder = (woId: string, actionTaken: string, actualCost: number) => {
    setWorkOrders(prev => prev.map(w => {
      if (w.id === woId) {
        // Return asset to in service
        updateAsset(w.assetId, { status: 'IN_SERVICE' });
        return {
          ...w,
          status: 'COMPLETED',
          actionTaken,
          completedDate: new Date().toISOString().split('T')[0],
          totalCost: actualCost || w.totalCost
        };
      }
      return w;
    }));
  };

  // Dispose Asset
  const disposeAsset = (dispData: Omit<AssetDisposalRecord, 'id' | 'disposalNumber'>) => {
    const id = `dsp-${Date.now().toString().slice(-4)}`;
    const disposalNumber = `DSP-${new Date().getFullYear()}-${Math.floor(1000 + mockRandom() * 9000)}`;
    const newDisposal: AssetDisposalRecord = {
      ...dispData,
      id,
      disposalNumber,
      status: 'POSTED_TO_GL'
    };
    setDisposals(prev => [newDisposal, ...prev]);

    // Mark asset as disposed
    updateAsset(dispData.assetId, {
      status: dispData.disposalType === 'SCRAP' ? 'SCRAPPED' : 'DISPOSED',
      netBookValue: 0
    });
  };

  // Record Asset Sale
  const recordAssetSale = (saleData: Omit<AssetSaleInvoice, 'id' | 'saleInvoiceNumber'>) => {
    const id = `sale-${Date.now().toString().slice(-4)}`;
    const saleInvoiceNumber = `AST-INV-${new Date().getFullYear()}-${Math.floor(1000 + mockRandom() * 9000)}`;
    const newSale: AssetSaleInvoice = {
      ...saleData,
      id,
      saleInvoiceNumber,
      status: 'PAID'
    };
    setSales(prev => [newSale, ...prev]);

    // Mark asset as disposed/sold
    updateAsset(saleData.assetId, {
      status: 'DISPOSED',
      netBookValue: 0
    });
  };

  // Record Physical Audit
  const recordPhysicalAudit = (auditData: Omit<PhysicalVerificationAudit, 'id'>) => {
    const id = `aud-${Date.now().toString().slice(-4)}`;
    const newAudit: PhysicalVerificationAudit = {
      ...auditData,
      id
    };
    setAudits(prev => [newAudit, ...prev]);
  };

  // Add Insurance Policy
  const addInsurancePolicy = (policyData: Omit<AssetInsurancePolicy, 'id'>) => {
    const id = `ins-${Date.now().toString().slice(-4)}`;
    const newPolicy: AssetInsurancePolicy = {
      ...policyData,
      id
    };
    setInsurancePolicies(prev => [newPolicy, ...prev]);
  };

  // Refresh AI Insights
  const refreshAiInsights = () => {
    // Generate fresh insights based on current assets and maintenance
    const generated: AssetAIInsight[] = [
      {
        id: `ai-${Date.now()}-1`,
        type: 'PREDICTIVE_FAILURE',
        title: 'Thermal Stress & Bearing Wear on Mazak CNC Spindle',
        severity: 'HIGH',
        affectedAssetTag: 'AST-OMN-2024-0312',
        affectedAssetName: 'Mazak Integrex i-450H 5-Axis Multi-Tasking CNC Center',
        description: 'Predictive sensor telemetry flags high continuous spindle rpm and 90-day overdue calibration.',
        suggestedAction: 'Execute PM order #PM-CNC-90D before next precision aerospace turbine run.',
        financialImpact: 'Saves OMR 24,000 in precision tool scrap and spindle rebuild costs',
        confidenceScore: 96
      },
      {
        id: `ai-${Date.now()}-2`,
        type: 'DEPRECIATION_OPTIMIZATION',
        title: 'Tax Depreciation Advantage on Leased IT Infrastructure',
        severity: 'LOW',
        description: 'Shifting IT server clusters to accelerated double-declining depreciation provides OMR 18,200 immediate tax savings in current fiscal year.',
        suggestedAction: 'Present depreciation tax simulation to Corporate Tax Director.',
        financialImpact: 'OMR 18,200 Cash tax deferral',
        confidenceScore: 91
      },
      {
        id: `ai-${Date.now()}-3`,
        type: 'REPLACEMENT_ROI',
        title: 'Fleet Vehicle Replacement ROI Breakeven reached on Actros 3340',
        severity: 'MEDIUM',
        affectedAssetTag: 'AST-OMN-2021-0899',
        affectedAssetName: 'Mercedes-Benz Actros 3340 Prime Mover Heavy Truck (6x4)',
        description: 'Cumulative 3-year maintenance cost (OMR 14,800) now exceeds 45% of acquisition cost. Replacement with Euro-6 model delivers 18% fuel reduction.',
        suggestedAction: 'Initiate asset disposal auction and draft purchase requisition for 2026 Euro-6 prime mover.',
        financialImpact: 'Net OMR 4,200 annual fuel & maintenance savings',
        confidenceScore: 88
      }
    ];
    setAiInsights(generated);
  };

  return (
    <AssetContext.Provider
      value={{
        assets,
        categories,
        classifications,
        cwipProjects,
        assignments,
        custodians,
        transfers,
        depreciationRuns,
        revaluations,
        impairmentTests,
        pmPlans,
        workOrders,
        disposals,
        sales,
        audits,
        insurancePolicies,
        aiInsights,
        currency,
        totalNBV,
        totalAssetsCount,
        totalCostBasis,
        totalAccumDep,
        monthlyDepreciationAccrual,
        overdueMaintenanceCount,
        addAsset,
        updateAsset,
        deleteAsset,
        addCategory,
        createCWIPProject,
        capitalizeCWIP,
        assignAsset,
        createTransferOrder,
        executeDepreciationRun,
        postRevaluation,
        postImpairment,
        createPMPlan,
        createWorkOrder,
        completeWorkOrder,
        disposeAsset,
        recordAssetSale,
        recordPhysicalAudit,
        addInsurancePolicy,
        refreshAiInsights
      }}
    >
      {children}
    </AssetContext.Provider>
  );
};

export const useAssetStore = () => {
  const context = useContext(AssetContext);
  if (!context) {
    throw new Error('useAssetStore must be used within an AssetProvider');
  }
  return context;
};
