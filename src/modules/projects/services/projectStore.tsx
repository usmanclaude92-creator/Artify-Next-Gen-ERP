// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 10: PROJECT MANAGEMENT & JOB COSTING
// Centralized React Context & State Store
// ==========================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ProjectMaster,
  ProjectClassification,
  ProjectPhase,
  ProjectActivity,
  ProjectScheduleItem,
  ResourceAllocation,
  ProjectBudgetLine,
  ProjectCashForecastMonth,
  CostCode,
  MaterialCostEntry,
  LaborCostEntry,
  EquipmentCostEntry,
  ProjectPurchaseRequisition,
  ProjectPurchaseOrder,
  ProjectSiteMaterialInventory,
  SubcontractorContract,
  RevenueRecognitionSchedule,
  ProgressPaymentCertificate,
  ProjectCustomerInvoice,
  ProjectEarnedValueMetrics,
  ProjectPnLStatement,
  ProjectCashFlowStatement
} from '../types';
import { mockRandom } from '@/src/utils/mockRandom';

// ==========================================
// SEED DATA
// ==========================================

const initialClassifications: ProjectClassification[] = [
  {
    id: 'class-01',
    code: 'EPC-IND',
    name: 'Industrial & EPC Turnkey Plant',
    sector: 'HEAVY_ENGINEERING',
    standardOverheadMarkupPercent: 12.5,
    standardRetentionRatePercent: 10.0,
    standardAdvanceRecoveryPercent: 15.0,
    description: 'Turnkey chemical, oil & gas and power generation facility execution.'
  },
  {
    id: 'class-02',
    code: 'CIV-INFRA',
    name: 'Civil Infrastructure & Marine Port',
    sector: 'GOVERNMENT_INFRA',
    standardOverheadMarkupPercent: 10.0,
    standardRetentionRatePercent: 10.0,
    standardAdvanceRecoveryPercent: 10.0,
    description: 'Road corridors, port breakwaters, water distribution pipelines.'
  },
  {
    id: 'class-03',
    code: 'COM-BUILD',
    name: 'Commercial High-Rise & Hospital Complex',
    sector: 'COMMERCIAL_BUILD',
    standardOverheadMarkupPercent: 15.0,
    standardRetentionRatePercent: 10.0,
    standardAdvanceRecoveryPercent: 20.0,
    description: 'Hospitality towers, tertiary healthcare hospitals, commercial shopping malls.'
  }
];

const initialCostCodes: CostCode[] = [
  { id: 'cc-101', codeNumber: 'CC-MAT-101', name: 'Structural Steel & Heavy Sections', category: 'MATERIAL', glAccountCode: '5010-01', description: 'Beams, columns, plates, welding consumables', isActive: true },
  { id: 'cc-102', codeNumber: 'CC-MAT-102', name: 'Ready-Mix Concrete & Reinforcement', category: 'MATERIAL', glAccountCode: '5010-02', description: 'C40/C50 concrete, epoxy rebar, formwork consumables', isActive: true },
  { id: 'cc-103', codeNumber: 'CC-MAT-103', name: 'Cryogenic Piping & Specialized Valves', category: 'MATERIAL', glAccountCode: '5010-03', description: 'Duplex stainless steel pipe spools and actuated valves', isActive: true },
  { id: 'cc-201', codeNumber: 'CC-LAB-201', name: 'Certified ASME IX Welders & Riggers', category: 'LABOR', glAccountCode: '5020-01', description: 'High-pressure pipe welding and structural erection labor', isActive: true },
  { id: 'cc-202', codeNumber: 'CC-LAB-202', name: 'Civil & Rebar Fixing Crews', category: 'LABOR', glAccountCode: '5020-02', description: 'Formwork, bar-bending and concrete pouring teams', isActive: true },
  { id: 'cc-203', codeNumber: 'CC-LAB-203', name: 'Site Supervisory & QA/QC Engineering', category: 'LABOR', glAccountCode: '5020-03', description: 'Site project managers, safety inspectors, NDT techs', isActive: true },
  { id: 'cc-301', codeNumber: 'CC-EQP-301', name: 'Heavy Mobile Cranes (50T - 250T)', category: 'EQUIPMENT_PLANT', glAccountCode: '5030-01', description: 'Lifting and heavy erection mobile cranes', isActive: true },
  { id: 'cc-302', codeNumber: 'CC-EQP-302', name: 'Earthmoving & Excavation Plant', category: 'EQUIPMENT_PLANT', glAccountCode: '5030-02', description: 'CAT 330D Excavators, wheel loaders, tippers', isActive: true },
  { id: 'cc-401', codeNumber: 'CC-SUB-401', name: 'Specialist Subcontract — MEP & HVAC', category: 'SUBCONTRACTOR', glAccountCode: '5040-01', description: 'Electrical substations, chillers, BMS automation', isActive: true },
  { id: 'cc-402', codeNumber: 'CC-SUB-402', name: 'Specialist Subcontract — Marine Piling', category: 'SUBCONTRACTOR', glAccountCode: '5040-02', description: 'Bored piles, diaphragm wall drilling, marine grouting', isActive: true }
];

const initialProjects: ProjectMaster[] = [
  {
    id: 'PRJ-001',
    projectCode: 'PRJ-2026-OM-001',
    projectName: 'Sohar Industrial Port — Cryogenic Ethylene Terminal Phase 2',
    clientEntity: 'Oman National Petrochemicals Corp (ONPC)',
    clientContactPerson: 'Eng. Khalid Al-Rawahi',
    clientEmail: 'k.rawahi@onpc.om',
    clientPhone: '+968 2450 8899',
    contractNumber: 'ONPC-EPC-2025-992',
    contractValue: 4850000,
    currency: 'OMR',
    company: 'Oman Heavy Industries SAOC',
    department: 'EPC Project Delivery Directorate',
    costCenter: 'CC-PRJ-SOHAR-01 (EPC Sohar)',
    projectType: 'OIL_GAS_FACILITY',
    projectClassificationId: 'class-01',
    projectManager: 'Dr. Tarek Al-Ghamdi',
    siteEngineer: 'Eng. Salem Al-Maamari',
    location: 'Sohar Industrial Free Zone, Quay 4',
    branch: 'Sohar Industrial Port Regional Office',
    startDate: '2025-11-01',
    targetCompletionDate: '2026-12-31',
    status: 'ACTIVE_IN_PROGRESS',
    priority: 'HIGH',
    billingMethod: 'PROGRESS_PERCENT_COMPLETION',
    totalBudget: 3950000,
    totalCommitted: 2840000,
    totalActualCost: 2120000,
    totalBilledAmount: 2650000,
    totalReceivedAmount: 2385000,
    retentionWithheldPercent: 10,
    overallProgressPercent: 56.4,
    customTags: ['Petrochemical', 'Cryogenic Storage', 'API 620', 'Sohar Port'],
    phases: [
      {
        id: 'ph-01',
        phaseSequence: 1,
        phaseName: 'Phase 1: Soil Improvement & Deep Foundation',
        description: 'Vibro-replacement stone columns and precast marine piles.',
        startDate: '2025-11-01',
        endDate: '2026-02-28',
        budgetAllocated: 750000,
        actualSpent: 735000,
        weightagePercent: 20,
        completionPercent: 100,
        status: 'COMPLETED',
        activities: [
          { id: 'act-01', wbsCode: '1.1.01', activityName: 'Site Geotechnical Survey & Clearance', phaseId: 'ph-01', description: 'Cone penetration tests and explosive unexploded ordnance scan.', durationDays: 30, startDate: '2025-11-01', endDate: '2025-11-30', plannedCost: 80000, actualCost: 78000, progressPercent: 100, assignedTeamLeader: 'Eng. Salim Balushi', status: 'COMPLETED', isCriticalPath: true },
          { id: 'act-02', wbsCode: '1.1.02', activityName: 'Marine Piling (120 Bored Piles)', phaseId: 'ph-01', description: 'Installation of 1200mm diameter reinforced concrete piles to 32m bedrock.', durationDays: 90, startDate: '2025-12-01', endDate: '2026-02-28', plannedCost: 670000, actualCost: 657000, progressPercent: 100, assignedTeamLeader: 'Eng. Tariq Al-Sabahi', status: 'COMPLETED', isCriticalPath: true }
        ]
      },
      {
        id: 'ph-02',
        phaseSequence: 2,
        phaseName: 'Phase 2: Cryogenic Double-Wall Tank Erection',
        description: 'Outer pre-stressed concrete wall and 9% nickel steel inner vessel.',
        startDate: '2026-03-01',
        endDate: '2026-08-31',
        budgetAllocated: 2100000,
        actualSpent: 1145000,
        weightagePercent: 55,
        completionPercent: 62,
        status: 'ACTIVE',
        activities: [
          { id: 'act-03', wbsCode: '1.2.01', activityName: 'Outer Concrete Wall Slipforming', phaseId: 'ph-02', description: 'Continuous slipform pour for 38m high outer containment wall.', durationDays: 60, startDate: '2026-03-01', endDate: '2026-04-30', plannedCost: 620000, actualCost: 590000, progressPercent: 100, assignedTeamLeader: 'Foreman Yousuf Zadjali', status: 'COMPLETED', isCriticalPath: true },
          { id: 'act-04', wbsCode: '1.2.02', activityName: '9% Nickel Inner Tank Plate Welding', phaseId: 'ph-02', description: 'Specialized cryogenic submerged arc and TIG plate welding with 100% radiographic inspection.', durationDays: 90, startDate: '2026-05-01', endDate: '2026-07-31', plannedCost: 980000, actualCost: 425000, progressPercent: 48, assignedTeamLeader: 'Lead Welder Arshad Mehmood', status: 'IN_PROGRESS', isCriticalPath: true },
          { id: 'act-05', wbsCode: '1.2.03', activityName: 'Perlite Insulation & Dome Roof Air-Raise', phaseId: 'ph-02', description: 'Pneumatic air lifting of 450-tonne steel dome roof.', durationDays: 31, startDate: '2026-08-01', endDate: '2026-08-31', plannedCost: 500000, actualCost: 130000, progressPercent: 15, assignedTeamLeader: 'Eng. Salem Al-Maamari', status: 'IN_PROGRESS', isCriticalPath: true }
        ]
      },
      {
        id: 'ph-03',
        phaseSequence: 3,
        phaseName: 'Phase 3: Boil-off Gas Compressors & Commissioning',
        description: 'BOG reciprocating compressors, DCS automation, nitrogen purging, and cold testing.',
        startDate: '2026-09-01',
        endDate: '2026-12-31',
        budgetAllocated: 1100000,
        actualSpent: 240000,
        weightagePercent: 25,
        completionPercent: 12,
        status: 'UPCOMING',
        activities: [
          { id: 'act-06', wbsCode: '1.3.01', activityName: 'BOG Compressor Skids Installation', phaseId: 'ph-03', description: 'Heavy skid rigging, grouting, and shaft alignment.', durationDays: 60, startDate: '2026-09-01', endDate: '2026-10-31', plannedCost: 450000, actualCost: 160000, progressPercent: 20, assignedTeamLeader: 'Eng. Saeed Farooqi', status: 'IN_PROGRESS', isCriticalPath: false },
          { id: 'act-07', wbsCode: '1.3.02', activityName: 'Cryogenic Piping Hydrotest & Cold Run', phaseId: 'ph-03', description: 'LN2 pre-cooling, dryout, and performance trial runs.', durationDays: 61, startDate: '2026-11-01', endDate: '2026-12-31', plannedCost: 650000, actualCost: 80000, progressPercent: 5, assignedTeamLeader: 'Dr. Tarek Al-Ghamdi', status: 'NOT_STARTED', isCriticalPath: true }
        ]
      }
    ]
  },
  {
    id: 'PRJ-002',
    projectCode: 'PRJ-2026-DXB-008',
    projectName: 'Dubai Maritime City — Marine Shipyard Erection & Gantry Rails',
    clientEntity: 'Salalah Port Authority SAOC',
    clientContactPerson: 'Capt. Mansoor Al-Ketbi',
    clientEmail: 'm.ketbi@portauthority.om',
    clientPhone: '+968 2321 5500',
    contractNumber: 'SPA-MAR-2026-112',
    contractValue: 7200000,
    currency: 'OMR',
    company: 'Gulf Marine & Industrial Contracting WLL',
    department: 'Civil & Marine Infrastructure',
    costCenter: 'CC-MAR-SALALAH-04 (Salalah Marine Port)',
    projectType: 'INFRASTRUCTURE',
    projectClassificationId: 'class-02',
    projectManager: 'Eng. Tariq Al-Sabahi',
    siteEngineer: 'Eng. Amur Al-Habsi',
    location: 'Salalah Freezone Marine Port, Berth 7',
    branch: 'Salalah Freezone Marine Office',
    startDate: '2026-01-15',
    targetCompletionDate: '2027-03-30',
    status: 'ACTIVE_IN_PROGRESS',
    priority: 'CRITICAL_FAST_TRACK',
    billingMethod: 'MILESTONE_DELIVERABLE',
    totalBudget: 5800000,
    totalCommitted: 3900000,
    totalActualCost: 1950000,
    totalBilledAmount: 2880000,
    totalReceivedAmount: 2880000,
    retentionWithheldPercent: 10,
    overallProgressPercent: 38.0,
    customTags: ['Marine Piling', 'Gantry Crane', 'Drydock', 'High Load Rail'],
    phases: [
      {
        id: 'ph-0201',
        phaseSequence: 1,
        phaseName: 'Phase 1: Civil Quay Excavation & Heavy Pile Caps',
        description: 'Excavation to -14m CD and reinforced concrete gantry pile cap installation.',
        startDate: '2026-01-15',
        endDate: '2026-05-30',
        budgetAllocated: 2400000,
        actualSpent: 1250000,
        weightagePercent: 40,
        completionPercent: 75,
        status: 'ACTIVE',
        activities: [
          { id: 'act-0201', wbsCode: '2.1.01', activityName: 'Quayside Dredging & Sheet Piling', phaseId: 'ph-0201', description: 'Marine dredging and AZ-38 sheet pile wall installation.', durationDays: 75, startDate: '2026-01-15', endDate: '2026-03-30', plannedCost: 1100000, actualCost: 980000, progressPercent: 100, assignedTeamLeader: 'Eng. Amur Al-Habsi', status: 'COMPLETED', isCriticalPath: true },
          { id: 'act-0202', wbsCode: '2.1.02', activityName: 'Mass Concrete Rail Beam Construction', phaseId: 'ph-0201', description: 'Grade C50 concrete casting for 450-meter gantry rail foundation.', durationDays: 60, startDate: '2026-04-01', endDate: '2026-05-30', plannedCost: 1300000, actualCost: 270000, progressPercent: 50, assignedTeamLeader: 'Foreman Najeeb', status: 'IN_PROGRESS', isCriticalPath: true }
        ]
      }
    ]
  },
  {
    id: 'PRJ-003',
    projectCode: 'PRJ-2026-OM-003',
    projectName: 'Duqm Special Economic Zone — Seawater Reverse Osmosis Substation',
    clientEntity: 'Duqm Refinery & Petrochemical Industries (OQ8)',
    clientContactPerson: 'Dr. Sultan Al-Otaibi',
    clientEmail: 'sultan.otaibi@oq8.om',
    clientPhone: '+968 2560 2323',
    contractNumber: 'OQ8-SWRO-2026-09',
    contractValue: 6500000,
    currency: 'OMR',
    company: 'Petrochemical Infrastructure Services SAOC',
    department: 'Piping & Cryogenic Mechanical Works',
    costCenter: 'CC-PRJ-DUQM-02 (Duqm Refinery Hub)',
    projectType: 'EPC_COMMERCIAL',
    projectClassificationId: 'class-01',
    projectManager: 'Eng. Fahad Al-Busaidi (E&I Commissioning Lead)',
    siteEngineer: 'Eng. Khalid Al-Shibli',
    location: 'Duqm SEZAD Industrial Area, Plot 14',
    branch: 'Duqm Special Economic Zone Hub (SEZAD)',
    startDate: '2026-03-01',
    targetCompletionDate: '2027-08-15',
    status: 'ACTIVE_IN_PROGRESS',
    priority: 'HIGH',
    billingMethod: 'PROGRESS_PERCENT_COMPLETION',
    totalBudget: 5200000,
    totalCommitted: 3400000,
    totalActualCost: 1800000,
    totalBilledAmount: 2500000,
    totalReceivedAmount: 2250000,
    retentionWithheldPercent: 10,
    overallProgressPercent: 21.5,
    customTags: ['SWRO Desalination', 'Duqm', 'Titanium Piping', 'Zero Liquid Discharge'],
    phases: []
  },
  {
    id: 'PRJ-004',
    projectCode: 'PRJ-2026-OM-004',
    projectName: 'Sohar Steel Mill — Heavy Coke Drum Modular Skid Fabrication',
    clientEntity: 'Petroleum Development Oman (PDO)',
    clientContactPerson: 'Eng. Hilal Al-Hinai',
    clientEmail: 'h.hinai@pdo.co.om',
    clientPhone: '+968 2467 1122',
    contractNumber: 'PDO-FAB-2026-441',
    contractValue: 3100000,
    currency: 'OMR',
    company: 'Sohar Steel & EPC Fabrication LLC',
    department: 'Heavy Structural Steel Fabrication',
    costCenter: 'CC-PRJ-SOHAR-01 (EPC Sohar)',
    projectType: 'INDUSTRIAL_FABRICATION',
    projectClassificationId: 'class-01',
    projectManager: 'Eng. Salem Al-Maamari (Lead Structural)',
    siteEngineer: 'Eng. Sarah Al-Harthy',
    location: 'Sohar Industrial Workshop Yard 2',
    branch: 'Sohar Industrial Port Regional Office',
    startDate: '2026-04-01',
    targetCompletionDate: '2026-11-30',
    status: 'PLANNING',
    priority: 'MEDIUM',
    billingMethod: 'MILESTONE_DELIVERABLE',
    totalBudget: 2450000,
    totalCommitted: 1100000,
    totalActualCost: 320000,
    totalBilledAmount: 450000,
    totalReceivedAmount: 450000,
    retentionWithheldPercent: 10,
    overallProgressPercent: 12.0,
    customTags: ['Modular Skid', 'ASME VIII', 'Stress Relieving', 'Heavy Erection'],
    phases: []
  },
  {
    id: 'PRJ-005',
    projectCode: 'PRJ-2026-OM-005',
    projectName: 'Muscat Madinat Al Irfan — Sustainable Commercial Headquarters Tower',
    clientEntity: 'Muscat Municipal Infrastructure Council',
    clientContactPerson: 'Arch. Muna Al-Lawati',
    clientEmail: 'm.lawati@muscat.gov.om',
    clientPhone: '+968 2477 9900',
    contractNumber: 'MMC-IRF-2024-88',
    contractValue: 8900000,
    currency: 'OMR',
    company: 'Oman Heavy Industries SAOC',
    department: 'Civil & Marine Infrastructure',
    costCenter: 'CC-HQ-OPS-03 (Corporate Project Operations)',
    projectType: 'RESIDENTIAL_COMPLEX',
    projectClassificationId: 'class-03',
    projectManager: 'Eng. Sarah Al-Harthy (Senior Project Engineer)',
    siteEngineer: 'Eng. Salim Balushi',
    location: 'Madinat Al Irfan Urban Center, Plot 5B',
    branch: 'Muscat Corporate HQ (Madinat Al Irfan)',
    startDate: '2024-09-01',
    targetCompletionDate: '2026-07-31',
    status: 'SUBSTANTIALLY_COMPLETE',
    priority: 'HIGH',
    billingMethod: 'PROGRESS_PERCENT_COMPLETION',
    totalBudget: 7400000,
    totalCommitted: 7350000,
    totalActualCost: 7120000,
    totalBilledAmount: 8450000,
    totalReceivedAmount: 7605000,
    retentionWithheldPercent: 10,
    overallProgressPercent: 94.8,
    customTags: ['LEED Platinum', 'Curtain Wall', 'Smart BMS', 'Muscat HQ'],
    phases: []
  },
  {
    id: 'PRJ-006',
    projectCode: 'PRJ-2026-OM-006',
    projectName: 'Sur LNG Train 4 — Flare Header Replacement & Turnaround Shutdown',
    clientEntity: 'Oman LNG LLC',
    clientContactPerson: 'Eng. Ahmed Al-Araimi',
    clientEmail: 'a.araimi@omanlng.co.om',
    clientPhone: '+968 2554 1100',
    contractNumber: 'OLNG-TA-2026-03',
    contractValue: 1850000,
    currency: 'OMR',
    company: 'Petrochemical Infrastructure Services SAOC',
    department: 'Site Safety, Quality & Environmental (QHSE)',
    costCenter: 'CC-HQ-OPS-03 (Corporate Project Operations)',
    projectType: 'MAINTENANCE_SHUTDOWN',
    projectClassificationId: 'class-01',
    projectManager: 'Dr. Tarek Al-Ghamdi (PMP, EPC Director)',
    siteEngineer: 'Eng. Khalid Al-Shibli',
    location: 'Qalhat LNG Complex, Sur',
    branch: 'Muscat Corporate HQ (Madinat Al Irfan)',
    startDate: '2026-08-01',
    targetCompletionDate: '2026-09-15',
    status: 'PROPOSED',
    priority: 'CRITICAL_FAST_TRACK',
    billingMethod: 'FIXED_LUMP_SUM',
    totalBudget: 1400000,
    totalCommitted: 200000,
    totalActualCost: 0,
    totalBilledAmount: 0,
    totalReceivedAmount: 0,
    retentionWithheldPercent: 5,
    overallProgressPercent: 0,
    customTags: ['Turnaround', 'Hot Tapping', 'Flaring', 'Cryogenic Isolation'],
    phases: []
  },
  {
    id: 'PRJ-007',
    projectCode: 'PRJ-2026-OM-007',
    projectName: 'Salalah Port — Offshore Breakwater Extension & Armoring',
    clientEntity: 'Salalah Port Authority SAOC',
    clientContactPerson: 'Eng. Bader Al-Shanfari',
    clientEmail: 'b.shanfari@salalahport.com',
    clientPhone: '+968 2321 9911',
    contractNumber: 'SPA-BW-2025-19',
    contractValue: 5400000,
    currency: 'OMR',
    company: 'Gulf Marine & Industrial Contracting WLL',
    department: 'Civil & Marine Infrastructure',
    costCenter: 'CC-MAR-SALALAH-04 (Salalah Marine Port)',
    projectType: 'INFRASTRUCTURE',
    projectClassificationId: 'class-02',
    projectManager: 'Eng. Tariq Al-Sabahi (Marine Works Specialist)',
    siteEngineer: 'Eng. Amur Al-Habsi',
    location: 'Salalah Port Outer Breakwater',
    branch: 'Salalah Freezone Marine Office',
    startDate: '2025-06-01',
    targetCompletionDate: '2026-10-30',
    status: 'ON_HOLD',
    priority: 'MEDIUM',
    billingMethod: 'MILESTONE_DELIVERABLE',
    totalBudget: 4600000,
    totalCommitted: 3100000,
    totalActualCost: 2400000,
    totalBilledAmount: 2700000,
    totalReceivedAmount: 2430000,
    retentionWithheldPercent: 10,
    overallProgressPercent: 44.0,
    customTags: ['Accropode Blocks', 'Rock Armor', 'Marine Dredging', 'Bathymetry'],
    phases: []
  },
  {
    id: 'PRJ-008',
    projectCode: 'PRJ-2026-OM-008',
    projectName: 'Nizwa Industrial Estate — Structural Pre-Engineered Warehouse Complex',
    clientEntity: 'Muscat Municipal Infrastructure Council',
    clientContactPerson: 'Eng. Nasser Al-Kharusi',
    clientEmail: 'n.kharusi@madayn.om',
    clientPhone: '+968 2541 3344',
    contractNumber: 'MAD-NIZ-2024-05',
    contractValue: 1600000,
    currency: 'OMR',
    company: 'Sohar Steel & EPC Fabrication LLC',
    department: 'Heavy Structural Steel Fabrication',
    costCenter: 'CC-HQ-OPS-03 (Corporate Project Operations)',
    projectType: 'INDUSTRIAL_FABRICATION',
    projectClassificationId: 'class-03',
    projectManager: 'Eng. Salem Al-Maamari (Lead Structural)',
    siteEngineer: 'Eng. Sarah Al-Harthy',
    location: 'Nizwa Industrial City, Phase 3',
    branch: 'Muscat Corporate HQ (Madinat Al Irfan)',
    startDate: '2024-11-01',
    targetCompletionDate: '2025-12-15',
    status: 'CLOSED',
    priority: 'LOW',
    billingMethod: 'FIXED_LUMP_SUM',
    totalBudget: 1250000,
    totalCommitted: 1240000,
    totalActualCost: 1215000,
    totalBilledAmount: 1600000,
    totalReceivedAmount: 1600000,
    retentionWithheldPercent: 0,
    overallProgressPercent: 100,
    customTags: ['PEB Building', 'Logistics Warehouse', 'Overhead Cranes'],
    phases: []
  }
];

const initialBudgets: ProjectBudgetLine[] = [
  { id: 'bgt-01', costCodeId: 'cc-101', costCodeNumber: 'CC-MAT-101', costCodeName: 'Structural Steel & Heavy Sections', category: 'MATERIAL', phaseId: 'ph-02', phaseName: 'Phase 2: Cryogenic Tank Erection', baselineBudget: 980000, revisedBudget: 1020000, committedCost: 890000, actualCost: 610000, varianceAmount: 410000, variancePercent: 40.2, forecastAtCompletion: 1010000 },
  { id: 'bgt-02', costCodeId: 'cc-102', costCodeNumber: 'CC-MAT-102', costCodeName: 'Ready-Mix Concrete & Reinforcement', category: 'MATERIAL', phaseId: 'ph-01', phaseName: 'Phase 1: Deep Foundation', baselineBudget: 550000, revisedBudget: 550000, committedCost: 540000, actualCost: 535000, varianceAmount: 15000, variancePercent: 2.7, forecastAtCompletion: 545000 },
  { id: 'bgt-03', costCodeId: 'cc-103', costCodeNumber: 'CC-MAT-103', costCodeName: 'Cryogenic Piping & Specialized Valves', category: 'MATERIAL', phaseId: 'ph-03', phaseName: 'Phase 3: BOG Compressors', baselineBudget: 420000, revisedBudget: 440000, committedCost: 380000, actualCost: 120000, varianceAmount: 320000, variancePercent: 72.7, forecastAtCompletion: 435000 },
  { id: 'bgt-04', costCodeId: 'cc-201', costCodeNumber: 'CC-LAB-201', costCodeName: 'Certified ASME IX Welders & Riggers', category: 'LABOR', phaseId: 'ph-02', phaseName: 'Phase 2: Cryogenic Tank Erection', baselineBudget: 480000, revisedBudget: 500000, committedCost: 340000, actualCost: 295000, varianceAmount: 205000, variancePercent: 41.0, forecastAtCompletion: 495000 },
  { id: 'bgt-05', costCodeId: 'cc-301', costCodeNumber: 'CC-EQP-301', costCodeName: 'Heavy Mobile Cranes (50T - 250T)', category: 'EQUIPMENT_PLANT', phaseId: 'ph-02', phaseName: 'Phase 2: Cryogenic Tank Erection', baselineBudget: 320000, revisedBudget: 320000, committedCost: 260000, actualCost: 210000, varianceAmount: 110000, variancePercent: 34.3, forecastAtCompletion: 315000 },
  { id: 'bgt-06', costCodeId: 'cc-401', costCodeNumber: 'CC-SUB-401', costCodeName: 'Specialist Subcontract — MEP & HVAC', category: 'SUBCONTRACTOR', phaseId: 'ph-03', phaseName: 'Phase 3: BOG Compressors', baselineBudget: 600000, revisedBudget: 600000, committedCost: 430000, actualCost: 350000, varianceAmount: 250000, variancePercent: 41.6, forecastAtCompletion: 590000 }
];

const initialMaterialCosts: MaterialCostEntry[] = [
  { id: 'mat-001', transactionNumber: 'MTR-PRJ-2026-081', projectId: 'PRJ-001', activityWbsCode: '1.2.02', costCodeNumber: 'CC-MAT-101', itemCode: 'RAW-STL-9NI-08', itemName: '9% Nickel Alloy Cryogenic Plates (24mm x 2.5m x 12m)', issueDate: '2026-05-10', quantityIssued: 48, uom: 'MT', unitCost: 4500, totalCost: 216000, currency: 'OMR', warehouseLocation: 'Sohar Central Yard A', issueDocReference: 'DN-SOH-2026-991', issuedBy: 'Storekeeper Murugan', receivedBySiteStaff: 'Lead Welder Arshad', status: 'POSTED_TO_JOB' },
  { id: 'mat-002', transactionNumber: 'MTR-PRJ-2026-082', projectId: 'PRJ-001', activityWbsCode: '1.2.01', costCodeNumber: 'CC-MAT-102', itemCode: 'CEMENT-SULPH-01', itemName: 'Sulphate Resistant Portland Cement Type V', issueDate: '2026-04-14', quantityIssued: 320, uom: 'MT', unitCost: 85, totalCost: 27200, currency: 'OMR', warehouseLocation: 'Sohar Silo 3', issueDocReference: 'DN-SOH-2026-782', issuedBy: 'Storekeeper Murugan', receivedBySiteStaff: 'Foreman Yousuf Zadjali', status: 'POSTED_TO_JOB' },
  { id: 'mat-003', transactionNumber: 'MTR-PRJ-2026-083', projectId: 'PRJ-001', activityWbsCode: '1.3.01', costCodeNumber: 'CC-MAT-103', itemCode: 'VLV-CRYO-12IN', itemName: '12" Class 300 Cryogenic Triple Offset Butterfly Valve', issueDate: '2026-06-02', quantityIssued: 6, uom: 'PCS', unitCost: 14500, totalCost: 87000, currency: 'OMR', warehouseLocation: 'Muscat Quarantine Store', issueDocReference: 'DN-MCT-2026-312', issuedBy: 'Store Mgr Hilal', receivedBySiteStaff: 'Eng. Saeed Farooqi', status: 'POSTED_TO_JOB' }
];

const initialLaborCosts: LaborCostEntry[] = [
  { id: 'lab-001', timesheetNumber: 'TS-2026-W22-01', projectId: 'PRJ-001', activityWbsCode: '1.2.02', costCodeNumber: 'CC-LAB-201', employeeId: 'EMP-00104', employeeName: 'Eng. Sarah Al-Harthy & NDT Crew', tradeOrRole: 'Senior NDT & Ultrasonic Weld Inspection', workDate: '2026-05-28', regularHoursWorked: 48, overtimeHoursWorked: 12, regularHourlyRate: 25, overtimeHourlyRate: 37.5, totalLaborCost: 1650, currency: 'OMR', approvedBySiteForeman: 'Dr. Tarek Al-Ghamdi', glPostingReference: 'JV-LAB-2026-05-99', status: 'APPROVED_AND_POSTED' },
  { id: 'lab-002', timesheetNumber: 'TS-2026-W22-02', projectId: 'PRJ-001', activityWbsCode: '1.2.02', costCodeNumber: 'CC-LAB-201', employeeId: 'EMP-00244', employeeName: 'Cryogenic Welding Gang A (12 Welders)', tradeOrRole: 'GTAW/SMAW Certified High-Pressure Welders', workDate: '2026-05-28', regularHoursWorked: 480, overtimeHoursWorked: 96, regularHourlyRate: 14, overtimeHourlyRate: 21, totalLaborCost: 8736, currency: 'OMR', approvedBySiteForeman: 'Eng. Salem Al-Maamari', glPostingReference: 'JV-LAB-2026-05-102', status: 'APPROVED_AND_POSTED' },
  { id: 'lab-003', timesheetNumber: 'TS-2026-W23-01', projectId: 'PRJ-001', activityWbsCode: '1.2.01', costCodeNumber: 'CC-LAB-202', employeeId: 'EMP-00310', employeeName: 'Slipform Concrete Shifting Gang (18 Men)', tradeOrRole: 'Continuous Concrete Pour & Vibrator Crew', workDate: '2026-06-04', regularHoursWorked: 720, overtimeHoursWorked: 180, regularHourlyRate: 9.5, overtimeHourlyRate: 14.25, totalLaborCost: 9405, currency: 'OMR', approvedBySiteForeman: 'Foreman Yousuf Zadjali', glPostingReference: 'JV-LAB-2026-06-014', status: 'APPROVED_AND_POSTED' }
];

const initialEquipmentCosts: EquipmentCostEntry[] = [
  { id: 'eqp-001', equipmentLogNumber: 'EQ-LOG-2026-091', projectId: 'PRJ-001', activityWbsCode: '1.2.02', costCodeNumber: 'CC-EQP-301', equipmentAssetId: 'EQ-CRN-250T', equipmentName: 'Liebherr LTM 1250-5.1 (250T Mobile Crane)', equipmentOwnership: 'INTERNAL_COMPANY_PLANT', usageDate: '2026-05-24', operatingHours: 10, idleHours: 2, hourlyOperatingRate: 120, hourlyIdleRate: 40, fuelAndMaintenanceCharge: 280, totalCost: 1560, currency: 'OMR', operatorName: 'Certified Crane Master Bipin', status: 'POSTED_TO_PROJECT' },
  { id: 'eqp-002', equipmentLogNumber: 'EQ-LOG-2026-092', projectId: 'PRJ-001', activityWbsCode: '1.2.03', costCodeNumber: 'CC-EQP-301', equipmentAssetId: 'EQ-CRN-50T', equipmentName: 'Tadano GR-500EX (50T Rough Terrain Crane)', equipmentOwnership: 'INTERNAL_COMPANY_PLANT', usageDate: '2026-06-01', operatingHours: 8, idleHours: 1, hourlyOperatingRate: 45, hourlyIdleRate: 20, fuelAndMaintenanceCharge: 110, totalCost: 490, currency: 'OMR', operatorName: 'Operator Rashid Al-Kindi', status: 'POSTED_TO_PROJECT' }
];

const initialRequisitions: ProjectPurchaseRequisition[] = [
  {
    id: 'pr-001',
    prNumber: 'PR-PRJ-2026-089',
    projectId: 'PRJ-001',
    projectName: 'Sohar Industrial Port — Cryogenic Ethylene Terminal Phase 2',
    requestedBy: 'Eng. Salem Al-Maamari',
    department: 'Site Engineering & Cryogenic QA',
    requestDate: '2026-05-18',
    priority: 'URGENT_SITE_STOPPAGE',
    requiredDeliveryLocation: 'Sohar Freezone Terminal Laydown 4',
    totalEstimatedAmount: 185000,
    currency: 'OMR',
    justification: 'Specialized stainless steel 304L expansion bellows and rupture discs for ethylene gas compressor manifold safety loop.',
    status: 'APPROVED_READY_FOR_PO',
    approvedBy: 'Dr. Tarek Al-Ghamdi',
    approvalDate: '2026-05-19',
    items: [
      { id: 'pri-01', itemCode: 'BEL-304L-16IN', itemDescription: '16" Stainless 304L Multi-ply Axial Expansion Bellows', costCodeNumber: 'CC-MAT-103', requiredQuantity: 8, uom: 'SET', estimatedUnitPrice: 12500, estimatedTotal: 100000, requiredByDate: '2026-07-01', budgetCheckPassed: true },
      { id: 'pri-02', itemCode: 'RUP-DISC-CRYO', itemDescription: 'Cryogenic Rupture Disc Safety Assemblies ASME Sec VIII', costCodeNumber: 'CC-MAT-103', requiredQuantity: 10, uom: 'EA', estimatedUnitPrice: 8500, estimatedTotal: 85000, requiredByDate: '2026-07-15', budgetCheckPassed: true }
    ]
  }
];

const initialPurchaseOrders: ProjectPurchaseOrder[] = [
  {
    id: 'po-001',
    poNumber: 'PO-PRJ-2026-042',
    projectId: 'PRJ-001',
    projectName: 'Sohar Industrial Port — Cryogenic Ethylene Terminal Phase 2',
    vendorId: 'VND-00109',
    vendorName: 'Mannesmann Stainless & Cryo Spool GmbH',
    costCodeNumber: 'CC-MAT-103',
    orderDate: '2026-05-22',
    expectedDeliveryDate: '2026-07-10',
    deliverySiteLocation: 'Sohar Freezone Terminal Gate 2',
    currency: 'OMR',
    subtotalAmount: 185000,
    taxVatAmount: 9250,
    totalPoAmount: 194250,
    paymentTerms: '30% Advance with Bank Guarantee, 60% upon FOB Bill of Lading, 10% on Site Inspection',
    status: 'ISSUED_TO_VENDOR',
    matchedPrNumber: 'PR-PRJ-2026-089'
  }
];

const initialSiteInventory: ProjectSiteMaterialInventory[] = [
  { id: 'inv-01', projectId: 'PRJ-001', itemCode: 'RAW-STL-9NI-08', itemName: '9% Nickel Alloy Plates', costCodeNumber: 'CC-MAT-101', totalReceivedToDate: 120, totalConsumedToDate: 48, currentStockOnSite: 72, uom: 'MT', unitValue: 4500, totalInventoryValuation: 324000, currency: 'OMR', siteStorageLocation: 'Sohar Yard Heavy Plate Rack #4', inspectionCertRef: 'MTC-EN10204-3.2-9981', qualityCondition: 'PASSED_QC_INSPECTED' },
  { id: 'inv-02', projectId: 'PRJ-001', itemCode: 'CEMENT-SULPH-01', itemName: 'Type V Sulphate Resistant Cement', costCodeNumber: 'CC-MAT-102', totalReceivedToDate: 800, totalConsumedToDate: 320, currentStockOnSite: 480, uom: 'MT', unitValue: 85, totalInventoryValuation: 40800, currency: 'OMR', siteStorageLocation: 'Dry Silo Bin #2', inspectionCertRef: 'QC-LAB-CEM-2026-11', qualityCondition: 'PASSED_QC_INSPECTED' }
];

const initialSubcontracts: SubcontractorContract[] = [
  {
    id: 'sub-01',
    subcontractNumber: 'SUB-2026-018',
    projectId: 'PRJ-001',
    subcontractorVendorId: 'VND-SUB-003',
    subcontractorName: 'Al-Hassan Electrical & Instrumentation EPC Co.',
    scopeOfWork: 'Complete hazardous zone electrical cabling, hazardous area intrinsically safe junction boxes, and DCS cable trays installation.',
    contractTotalValue: 520000,
    currency: 'OMR',
    retentionPercent: 10,
    advancePaid: 52000,
    totalCertifiedWorkDone: 260000,
    totalRetentionDeducted: 26000,
    netBilledToDate: 234000,
    totalPaidToDate: 182000,
    status: 'ACTIVE_AGREEMENT',
    siteEngineerSignoff: 'Eng. Saeed Farooqi'
  }
];

const initialRevenueRecognitions: RevenueRecognitionSchedule[] = [
  {
    id: 'rev-01',
    projectId: 'PRJ-001',
    fiscalPeriod: '2026-Q2 (Through June 2026)',
    contractValue: 4850000,
    cumulativeCostIncurred: 2120000,
    estimatedTotalCostAtCompletion: 3950000,
    calculatedCostToCostPercent: 53.67,
    cumulativeRecognizedRevenue: 2603000,
    priorRecognizedRevenue: 1750000,
    currentPeriodRevenueToRecognize: 853000,
    currency: 'OMR',
    methodApplied: 'PERCENTAGE_OF_COMPLETION',
    auditedBy: 'Deloitte Middle East / Jean-Luc Moreau',
    status: 'AUDITED_AND_POSTED'
  }
];

const initialPaymentCertificates: ProgressPaymentCertificate[] = [
  {
    id: 'ipc-004',
    certificateNumber: 'IPC-2026-004',
    projectId: 'PRJ-001',
    claimPeriodStart: '2026-05-01',
    claimPeriodEnd: '2026-05-31',
    submissionDate: '2026-06-03',
    grossAmountClaimed: 720000,
    certifiedWorkAmount: 690000,
    retentionDeductionPercent: 10,
    retentionDeductionAmount: 69000,
    mobilizationAdvanceRecoveryAmount: 51750,
    materialOnSiteCertifiedAmount: 45000,
    netPayableAmount: 614250,
    vatTaxAmount: 30712.5,
    totalClientPayable: 644962.5,
    currency: 'OMR',
    clientConsultantEngineer: 'WorleyParsons Oman / Eng. Malcolm Hughes',
    consultantSignoffDate: '2026-06-12',
    status: 'CONSULTANT_CERTIFIED'
  }
];

const initialCustomerInvoices: ProjectCustomerInvoice[] = [
  {
    id: 'inv-004',
    invoiceNumber: 'INV-PRJ-2026-004',
    projectId: 'PRJ-001',
    customerName: 'Oman National Petrochemicals Corp (ONPC)',
    linkedIpcNumber: 'IPC-2026-004',
    invoiceDate: '2026-06-14',
    paymentDueDate: '2026-07-14',
    netAmount: 614250,
    vatAmount: 30712.5,
    totalGrossInvoiceAmount: 644962.5,
    currency: 'OMR',
    paidAmount: 0,
    outstandingBalance: 644962.5,
    paymentStatus: 'UNPAID_PENDING_MATURITY'
  }
];

// ==========================================
// CONTEXT CONTRACT
// ==========================================

interface ProjectStoreContextType {
  // Enterprise Organizational Masters Reference
  companies: string[];
  branches: string[];
  departments: string[];
  costCenters: string[];
  clientEntities: string[];
  projectManagers: string[];
  siteEngineers: string[];
  currencies: string[];

  // Master & Setup
  projects: ProjectMaster[];
  classifications: ProjectClassification[];
  selectedProject: ProjectMaster;
  setSelectedProject: (proj: ProjectMaster) => void;
  createProject: (newProject: Omit<ProjectMaster, 'id' | 'projectCode' | 'totalCommitted' | 'totalActualCost' | 'totalBilledAmount' | 'totalReceivedAmount' | 'overallProgressPercent' | 'phases'>) => void;
  updateProject: (id: string, patch: Partial<ProjectMaster>) => void;
  deleteProject: (id: string) => void;
  selectProject: (id: string) => void;

  // Classification CRUD
  createClassification: (cls: Omit<ProjectClassification, 'id'>) => void;
  updateClassification: (id: string, patch: Partial<ProjectClassification>) => void;
  deleteClassification: (id: string) => void;

  // Phases & Activities CRUD
  addPhase: (projectId: string, phase: Omit<ProjectPhase, 'id' | 'actualSpent' | 'completionPercent' | 'activities'>) => void;
  updatePhase: (projectId: string, phaseId: string, patch: Partial<ProjectPhase>) => void;
  deletePhase: (projectId: string, phaseId: string) => void;
  addActivity: (projectId: string, phaseId: string, activity: Omit<ProjectActivity, 'id' | 'actualCost' | 'progressPercent' | 'status' | 'phaseId'>) => void;
  updateActivity: (projectId: string, phaseId: string, activityId: string, patch: Partial<ProjectActivity>) => void;
  deleteActivity: (projectId: string, phaseId: string, activityId: string) => void;
  updateActivityProgress: (projectId: string, phaseId: string, activityId: string, progress: number, status: ProjectActivity['status']) => void;

  // Planning & Schedules
  budgetLines: ProjectBudgetLine[];
  createBudgetLine: (line: Omit<ProjectBudgetLine, 'id' | 'committedCost' | 'actualCost' | 'varianceAmount' | 'variancePercent' | 'forecastAtCompletion'>) => void;
  resourceAllocations: ResourceAllocation[];
  allocateResource: (res: Omit<ResourceAllocation, 'id'>) => void;

  // Cost Codes & Direct Job Costs
  costCodes: CostCode[];
  createCostCode: (code: Omit<CostCode, 'id'>) => void;
  materialCosts: MaterialCostEntry[];
  postMaterialCost: (entry: Omit<MaterialCostEntry, 'id' | 'transactionNumber' | 'totalCost' | 'status'>) => void;
  laborCosts: LaborCostEntry[];
  postLaborCost: (entry: Omit<LaborCostEntry, 'id' | 'timesheetNumber' | 'totalLaborCost' | 'status'>) => void;
  equipmentCosts: EquipmentCostEntry[];
  postEquipmentCost: (entry: Omit<EquipmentCostEntry, 'id' | 'equipmentLogNumber' | 'totalCost' | 'status'>) => void;

  // Procurement & Subcontracts
  purchaseRequisitions: ProjectPurchaseRequisition[];
  createPurchaseRequisition: (req: Omit<ProjectPurchaseRequisition, 'id' | 'prNumber' | 'totalEstimatedAmount' | 'status'>) => void;
  approvePurchaseRequisition: (id: string, approver: string) => void;
  purchaseOrders: ProjectPurchaseOrder[];
  generatePurchaseOrderFromPr: (prId: string, vendorId: string, vendorName: string, paymentTerms: string) => void;
  siteInventory: ProjectSiteMaterialInventory[];
  subcontracts: SubcontractorContract[];
  createSubcontract: (sub: Omit<SubcontractorContract, 'id' | 'subcontractNumber' | 'totalCertifiedWorkDone' | 'totalRetentionDeducted' | 'netBilledToDate' | 'totalPaidToDate' | 'status'>) => void;

  // Billing & Progress Invoices
  revenueRecognitions: RevenueRecognitionSchedule[];
  calculateRevenueRecognition: (projectId: string, period: string) => void;
  paymentCertificates: ProgressPaymentCertificate[];
  submitPaymentCertificate: (cert: Partial<Omit<ProgressPaymentCertificate, 'id' | 'certificateNumber' | 'netPayableAmount' | 'vatTaxAmount' | 'totalClientPayable' | 'status'>>) => void;
  certifyPaymentCertificate: (id: string, consultantName: string) => void;
  customerInvoices: ProjectCustomerInvoice[];
  generateInvoiceFromCertificate: (certificateId: string) => void;

  // Performance & EVM Calculations
  getProjectEvmMetrics: (projectId: string) => ProjectEarnedValueMetrics;
  getProjectPnL: (projectId: string) => ProjectPnLStatement;
  getProjectCashFlow: (projectId: string) => ProjectCashFlowStatement;
}

const ProjectStoreContext = createContext<ProjectStoreContextType | undefined>(undefined);

const STORAGE_KEY = 'artify_erp_projects_master_state_v2';

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Enterprise Organizational Masters Reference Data
  const companies = [
    'Oman Heavy Industries SAOC',
    'Sohar Steel & EPC Fabrication LLC',
    'Gulf Marine & Industrial Contracting WLL',
    'Petrochemical Infrastructure Services SAOC'
  ];

  const branches = [
    'Sohar Industrial Port Regional Office',
    'Muscat Corporate HQ (Madinat Al Irfan)',
    'Salalah Freezone Marine Office',
    'Duqm Special Economic Zone Hub (SEZAD)'
  ];

  const departments = [
    'EPC Project Delivery Directorate',
    'Civil & Marine Infrastructure',
    'Heavy Structural Steel Fabrication',
    'Piping & Cryogenic Mechanical Works',
    'Electrical, Instrumentation & Telecom (E&I)',
    'Site Safety, Quality & Environmental (QHSE)'
  ];

  const costCenters = [
    'CC-PRJ-SOHAR-01 (EPC Sohar)',
    'CC-PRJ-DUQM-02 (Duqm Refinery Hub)',
    'CC-HQ-OPS-03 (Corporate Project Operations)',
    'CC-MAR-SALALAH-04 (Salalah Marine Port)'
  ];

  const clientEntities = [
    'Oman National Petrochemicals Corp (ONPC)',
    'Duqm Refinery & Petrochemical Industries (OQ8)',
    'Salalah Port Authority SAOC',
    'Oman LNG LLC',
    'Muscat Municipal Infrastructure Council',
    'Petroleum Development Oman (PDO)'
  ];

  const projectManagers = [
    'Dr. Tarek Al-Ghamdi (PMP, EPC Director)',
    'Eng. Salem Al-Maamari (Lead Structural)',
    'Eng. Sarah Al-Harthy (Senior Project Engineer)',
    'Eng. Salim Balushi (Geotech Lead)',
    'Eng. Tariq Al-Sabahi (Marine Works Specialist)',
    'Eng. Fahad Al-Busaidi (E&I Commissioning Lead)'
  ];

  const siteEngineers = [
    'Eng. Salem Al-Maamari',
    'Eng. Sarah Al-Harthy',
    'Eng. Tariq Al-Sabahi',
    'Eng. Salim Balushi',
    'Eng. Amur Al-Habsi',
    'Eng. Khalid Al-Shibli'
  ];

  const currencies = ['OMR', 'USD', 'SAR', 'AED', 'EUR'];

  // Initialize from localStorage or seed
  const [projects, setProjects] = useState<ProjectMaster[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_projects`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialProjects;
  });

  const [selectedProjectId, setSelectedProjectId] = useState<string>(() => {
    return initialProjects[0]?.id || '';
  });

  const [classifications, setClassifications] = useState<ProjectClassification[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_classifications`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialClassifications;
  });

  const [costCodes, setCostCodes] = useState<CostCode[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_costCodes`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialCostCodes;
  });

  const [budgetLines, setBudgetLines] = useState<ProjectBudgetLine[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_budgetLines`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialBudgets;
  });

  const [resourceAllocations, setResourceAllocations] = useState<ResourceAllocation[]>([
    { id: 'res-01', projectId: 'PRJ-001', resourceName: 'Eng. Sarah Al-Harthy', resourceRole: 'PROJECT_ENGINEER', resourceType: 'INTERNAL_STAFF', allocatedDailyHours: 8, hourlyBillingRate: 45, hourlyCostRate: 25, assignedWbsActivities: ['1.2.02'], startDate: '2026-05-01', endDate: '2026-07-31', utilizationPercent: 95 },
    { id: 'res-02', projectId: 'PRJ-001', resourceName: 'Lead Welder Arshad Mehmood', resourceRole: 'CERTIFIED_WELDER', resourceType: 'SITE_DIRECT_HIRE', allocatedDailyHours: 10, hourlyBillingRate: 28, hourlyCostRate: 16, assignedWbsActivities: ['1.2.02'], startDate: '2026-05-01', endDate: '2026-07-31', utilizationPercent: 100 }
  ]);

  const [materialCosts, setMaterialCosts] = useState<MaterialCostEntry[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_materialCosts`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialMaterialCosts;
  });

  const [laborCosts, setLaborCosts] = useState<LaborCostEntry[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_laborCosts`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialLaborCosts;
  });

  const [equipmentCosts, setEquipmentCosts] = useState<EquipmentCostEntry[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_equipmentCosts`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialEquipmentCosts;
  });

  const [purchaseRequisitions, setPurchaseRequisitions] = useState<ProjectPurchaseRequisition[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_purchaseRequisitions`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialRequisitions;
  });

  const [purchaseOrders, setPurchaseOrders] = useState<ProjectPurchaseOrder[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_purchaseOrders`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialPurchaseOrders;
  });

  const [siteInventory] = useState<ProjectSiteMaterialInventory[]>(initialSiteInventory);

  const [subcontracts, setSubcontracts] = useState<SubcontractorContract[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_subcontracts`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialSubcontracts;
  });

  const [revenueRecognitions, setRevenueRecognitions] = useState<RevenueRecognitionSchedule[]>(initialRevenueRecognitions);

  const [paymentCertificates, setPaymentCertificates] = useState<ProgressPaymentCertificate[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_paymentCertificates`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialPaymentCertificates;
  });

  const [customerInvoices, setCustomerInvoices] = useState<ProjectCustomerInvoice[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_customerInvoices`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialCustomerInvoices;
  });

  // Sync to localStorage on state changes
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_projects`, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to sync projects to localStorage', e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_classifications`, JSON.stringify(classifications));
    } catch (e) {
      console.error('Failed to sync classifications to localStorage', e);
    }
  }, [classifications]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_costCodes`, JSON.stringify(costCodes));
    } catch (e) {
      console.error('Failed to sync costCodes to localStorage', e);
    }
  }, [costCodes]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_budgetLines`, JSON.stringify(budgetLines));
    } catch (e) {
      console.error('Failed to sync budgetLines to localStorage', e);
    }
  }, [budgetLines]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_materialCosts`, JSON.stringify(materialCosts));
      localStorage.setItem(`${STORAGE_KEY}_laborCosts`, JSON.stringify(laborCosts));
      localStorage.setItem(`${STORAGE_KEY}_equipmentCosts`, JSON.stringify(equipmentCosts));
      localStorage.setItem(`${STORAGE_KEY}_purchaseRequisitions`, JSON.stringify(purchaseRequisitions));
      localStorage.setItem(`${STORAGE_KEY}_purchaseOrders`, JSON.stringify(purchaseOrders));
      localStorage.setItem(`${STORAGE_KEY}_subcontracts`, JSON.stringify(subcontracts));
      localStorage.setItem(`${STORAGE_KEY}_paymentCertificates`, JSON.stringify(paymentCertificates));
      localStorage.setItem(`${STORAGE_KEY}_customerInvoices`, JSON.stringify(customerInvoices));
    } catch (e) {
      console.error('Failed to sync transactions to localStorage', e);
    }
  }, [materialCosts, laborCosts, equipmentCosts, purchaseRequisitions, purchaseOrders, subcontracts, paymentCertificates, customerInvoices]);

  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0] || initialProjects[0];

  const setSelectedProject = (proj: ProjectMaster) => {
    setSelectedProjectId(proj.id);
  };

  // Create Project
  const createProject = (newProject: Omit<ProjectMaster, 'id' | 'projectCode' | 'totalCommitted' | 'totalActualCost' | 'totalBilledAmount' | 'totalReceivedAmount' | 'overallProgressPercent' | 'phases'>) => {
    const seq = projects.length + 1;
    const projectCode = `PRJ-2026-${newProject.currency === 'OMR' ? 'OM' : newProject.currency === 'SAR' ? 'KSA' : 'DXB'}-0${seq < 10 ? '0' + seq : seq}`;
    const fullProject: ProjectMaster = {
      ...newProject,
      id: `PRJ-00${seq}`,
      projectCode,
      company: newProject.company || companies[0],
      department: newProject.department || departments[0],
      costCenter: newProject.costCenter || costCenters[0],
      totalCommitted: 0,
      totalActualCost: 0,
      totalBilledAmount: 0,
      totalReceivedAmount: 0,
      overallProgressPercent: 0,
      phases: []
    };
    setProjects(prev => [fullProject, ...prev]);
    setSelectedProjectId(fullProject.id);
  };

  const updateProject = (id: string, patch: Partial<ProjectMaster>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => {
      const remaining = prev.filter(p => p.id !== id);
      if (selectedProjectId === id && remaining.length > 0) {
        setSelectedProjectId(remaining[0].id);
      }
      return remaining;
    });
  };

  // Classifications CRUD
  const createClassification = (cls: Omit<ProjectClassification, 'id'>) => {
    const newCls: ProjectClassification = {
      ...cls,
      id: `class-${Date.now()}`
    };
    setClassifications(prev => [...prev, newCls]);
  };

  const updateClassification = (id: string, patch: Partial<ProjectClassification>) => {
    setClassifications(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));
  };

  const deleteClassification = (id: string) => {
    setClassifications(prev => prev.filter(c => c.id !== id));
  };

  // Phases CRUD
  const addPhase = (projectId: string, phaseData: Omit<ProjectPhase, 'id' | 'actualSpent' | 'completionPercent' | 'activities'>) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const newPhase: ProjectPhase = {
        ...phaseData,
        id: `ph-${Date.now()}`,
        actualSpent: 0,
        completionPercent: 0,
        activities: []
      };
      return {
        ...p,
        phases: [...p.phases, newPhase]
      };
    }));
  };

  const updatePhase = (projectId: string, phaseId: string, patch: Partial<ProjectPhase>) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const updatedPhases = p.phases.map(ph => ph.id === phaseId ? { ...ph, ...patch } : ph);
      return { ...p, phases: updatedPhases };
    }));
  };

  const deletePhase = (projectId: string, phaseId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const updatedPhases = p.phases.filter(ph => ph.id !== phaseId);
      return { ...p, phases: updatedPhases };
    }));
  };

  // Activities CRUD
  const addActivity = (projectId: string, phaseId: string, actData: Omit<ProjectActivity, 'id' | 'actualCost' | 'progressPercent' | 'status' | 'phaseId'>) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const updatedPhases = p.phases.map(ph => {
        if (ph.id !== phaseId) return ph;
        const newAct: ProjectActivity = {
          ...actData,
          id: `act-${Date.now()}`,
          phaseId,
          actualCost: 0,
          progressPercent: 0,
          status: 'NOT_STARTED'
        };
        return {
          ...ph,
          activities: [...ph.activities, newAct]
        };
      });
      return {
        ...p,
        phases: updatedPhases
      };
    }));
  };

  const updateActivity = (projectId: string, phaseId: string, activityId: string, patch: Partial<ProjectActivity>) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const updatedPhases = p.phases.map(ph => {
        if (ph.id !== phaseId) return ph;
        const updatedActs = ph.activities.map(act => act.id === activityId ? { ...act, ...patch } : act);
        return { ...ph, activities: updatedActs };
      });
      return { ...p, phases: updatedPhases };
    }));
  };

  const deleteActivity = (projectId: string, phaseId: string, activityId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const updatedPhases = p.phases.map(ph => {
        if (ph.id !== phaseId) return ph;
        const updatedActs = ph.activities.filter(act => act.id !== activityId);
        return { ...ph, activities: updatedActs };
      });
      return { ...p, phases: updatedPhases };
    }));
  };

  const updateActivityProgress = (projectId: string, phaseId: string, activityId: string, progress: number, status: ProjectActivity['status']) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const updatedPhases = p.phases.map(ph => {
        if (ph.id !== phaseId) return ph;
        const updatedActivities = ph.activities.map(act => {
          if (act.id !== activityId) return act;
          return {
            ...act,
            progressPercent: progress,
            status
          };
        });
        const totalActProgress = updatedActivities.reduce((acc, curr) => acc + curr.progressPercent, 0);
        const phaseAvg = updatedActivities.length > 0 ? Math.round(totalActProgress / updatedActivities.length) : 0;
        return {
          ...ph,
          activities: updatedActivities,
          completionPercent: phaseAvg,
          status: (phaseAvg === 100 ? 'COMPLETED' : 'ACTIVE') as typeof ph.status
        };
      });

      // Recalculate overall project progress based on phase weightages
      let weightedProgress = 0;
      let totalWeight = 0;
      updatedPhases.forEach(ph => {
        weightedProgress += (ph.completionPercent * (ph.weightagePercent || 1));
        totalWeight += (ph.weightagePercent || 1);
      });
      const overall = totalWeight > 0 ? Math.round((weightedProgress / totalWeight) * 10) / 10 : 0;

      return {
        ...p,
        phases: updatedPhases,
        overallProgressPercent: overall
      };
    }));
  };

  // Cost Codes
  const createCostCode = (code: Omit<CostCode, 'id'>) => {
    const newCode: CostCode = {
      ...code,
      id: `cc-${Date.now()}`
    };
    setCostCodes(prev => [...prev, newCode]);
  };

  // Budget
  const createBudgetLine = (line: Omit<ProjectBudgetLine, 'id' | 'committedCost' | 'actualCost' | 'varianceAmount' | 'variancePercent' | 'forecastAtCompletion'>) => {
    const newLine: ProjectBudgetLine = {
      ...line,
      id: `bgt-${Date.now()}`,
      committedCost: 0,
      actualCost: 0,
      varianceAmount: line.revisedBudget,
      variancePercent: 100,
      forecastAtCompletion: line.revisedBudget
    };
    setBudgetLines(prev => [...prev, newLine]);
  };

  const allocateResource = (res: Omit<ResourceAllocation, 'id'>) => {
    const newRes: ResourceAllocation = {
      ...res,
      id: `res-${Date.now()}`
    };
    setResourceAllocations(prev => [...prev, newRes]);
  };

  // Direct Job Costs
  const postMaterialCost = (entry: Omit<MaterialCostEntry, 'id' | 'transactionNumber' | 'totalCost' | 'status'>) => {
    const totalCost = entry.quantityIssued * entry.unitCost;
    const newEntry: MaterialCostEntry = {
      ...entry,
      id: `mat-${Date.now()}`,
      transactionNumber: `MTR-PRJ-2026-${Math.floor(100 + mockRandom() * 900)}`,
      totalCost,
      status: 'POSTED_TO_JOB'
    };
    setMaterialCosts(prev => [newEntry, ...prev]);

    // Update actual cost on project
    setProjects(prev => prev.map(p => {
      if (p.id === entry.projectId) {
        return { ...p, totalActualCost: p.totalActualCost + totalCost };
      }
      return p;
    }));
  };

  const postLaborCost = (entry: Omit<LaborCostEntry, 'id' | 'timesheetNumber' | 'totalLaborCost' | 'status'>) => {
    const totalLaborCost = (entry.regularHoursWorked * entry.regularHourlyRate) + (entry.overtimeHoursWorked * entry.overtimeHourlyRate);
    const newEntry: LaborCostEntry = {
      ...entry,
      id: `lab-${Date.now()}`,
      timesheetNumber: `TS-2026-W${Math.floor(20 + mockRandom() * 10)}-${Math.floor(1 + mockRandom() * 9)}`,
      totalLaborCost,
      status: 'APPROVED_AND_POSTED'
    };
    setLaborCosts(prev => [newEntry, ...prev]);

    setProjects(prev => prev.map(p => {
      if (p.id === entry.projectId) {
        return { ...p, totalActualCost: p.totalActualCost + totalLaborCost };
      }
      return p;
    }));
  };

  const postEquipmentCost = (entry: Omit<EquipmentCostEntry, 'id' | 'equipmentLogNumber' | 'totalCost' | 'status'>) => {
    const totalCost = (entry.operatingHours * entry.hourlyOperatingRate) + (entry.idleHours * entry.hourlyIdleRate) + entry.fuelAndMaintenanceCharge;
    const newEntry: EquipmentCostEntry = {
      ...entry,
      id: `eqp-${Date.now()}`,
      equipmentLogNumber: `EQ-LOG-2026-${Math.floor(100 + mockRandom() * 900)}`,
      totalCost,
      status: 'POSTED_TO_PROJECT'
    };
    setEquipmentCosts(prev => [newEntry, ...prev]);

    setProjects(prev => prev.map(p => {
      if (p.id === entry.projectId) {
        return { ...p, totalActualCost: p.totalActualCost + totalCost };
      }
      return p;
    }));
  };

  // Requisitions & POs
  const createPurchaseRequisition = (req: Omit<ProjectPurchaseRequisition, 'id' | 'prNumber' | 'totalEstimatedAmount' | 'status'>) => {
    const totalEstimatedAmount = req.items.reduce((sum, item) => sum + item.estimatedTotal, 0);
    const newPr: ProjectPurchaseRequisition = {
      ...req,
      id: `pr-${Date.now()}`,
      prNumber: `PR-PRJ-2026-${Math.floor(100 + mockRandom() * 900)}`,
      totalEstimatedAmount,
      status: 'SUBMITTED_FOR_PM_APPROVAL'
    };
    setPurchaseRequisitions(prev => [newPr, ...prev]);
  };

  const approvePurchaseRequisition = (id: string, approver: string) => {
    setPurchaseRequisitions(prev => prev.map(pr => {
      if (pr.id === id) {
        return {
          ...pr,
          status: 'APPROVED_READY_FOR_PO',
          approvedBy: approver,
          approvalDate: new Date().toISOString().split('T')[0]
        };
      }
      return pr;
    }));
  };

  const generatePurchaseOrderFromPr = (prId: string, vendorId: string, vendorName: string, paymentTerms: string) => {
    const matchedPr = purchaseRequisitions.find(p => p.id === prId);
    if (!matchedPr) return;

    const subtotalAmount = matchedPr.totalEstimatedAmount;
    const taxVatAmount = subtotalAmount * 0.05;
    const totalPoAmount = subtotalAmount + taxVatAmount;

    const newPo: ProjectPurchaseOrder = {
      id: `po-${Date.now()}`,
      poNumber: `PO-PRJ-2026-${Math.floor(100 + mockRandom() * 900)}`,
      projectId: matchedPr.projectId,
      projectName: matchedPr.projectName,
      vendorId,
      vendorName,
      costCodeNumber: matchedPr.items[0]?.costCodeNumber || 'CC-MAT-101',
      orderDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: matchedPr.items[0]?.requiredByDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      deliverySiteLocation: matchedPr.requiredDeliveryLocation,
      currency: matchedPr.currency,
      subtotalAmount,
      taxVatAmount,
      totalPoAmount,
      paymentTerms,
      status: 'ISSUED_TO_VENDOR',
      matchedPrNumber: matchedPr.prNumber
    };

    setPurchaseOrders(prev => [newPo, ...prev]);
    setPurchaseRequisitions(prev => prev.map(p => p.id === prId ? { ...p, status: 'PO_GENERATED' } : p));

    // Increase committed cost on project
    setProjects(prev => prev.map(p => {
      if (p.id === matchedPr.projectId) {
        return { ...p, totalCommitted: p.totalCommitted + subtotalAmount };
      }
      return p;
    }));
  };

  const createSubcontract = (sub: Omit<SubcontractorContract, 'id' | 'subcontractNumber' | 'totalCertifiedWorkDone' | 'totalRetentionDeducted' | 'netBilledToDate' | 'totalPaidToDate' | 'status'>) => {
    const newSub: SubcontractorContract = {
      ...sub,
      id: `sub-${Date.now()}`,
      subcontractNumber: `SUB-2026-${Math.floor(100 + mockRandom() * 900)}`,
      totalCertifiedWorkDone: 0,
      totalRetentionDeducted: 0,
      netBilledToDate: 0,
      totalPaidToDate: sub.advancePaid,
      status: 'ACTIVE_AGREEMENT'
    };
    setSubcontracts(prev => [newSub, ...prev]);

    setProjects(prev => prev.map(p => {
      if (p.id === sub.projectId) {
        return { ...p, totalCommitted: p.totalCommitted + sub.contractTotalValue };
      }
      return p;
    }));
  };

  // Revenue Recognition & Billing
  const calculateRevenueRecognition = (projectId: string, period: string) => {
    const proj = projects.find(p => p.id === projectId);
    if (!proj) return;

    const cumulativeCost = proj.totalActualCost;
    const eac = proj.totalBudget > 0 ? proj.totalBudget : 1000000;
    const costToCostPct = Math.min(100, Math.round((cumulativeCost / eac) * 10000) / 100);
    const cumulativeRevenue = Math.round((proj.contractValue * (costToCostPct / 100)));
    const priorRecognized = revenueRecognitions.filter(r => r.projectId === projectId).reduce((acc, curr) => acc + curr.currentPeriodRevenueToRecognize, 0);
    const toRecognize = Math.max(0, cumulativeRevenue - priorRecognized);

    const newRev: RevenueRecognitionSchedule = {
      id: `rev-${Date.now()}`,
      projectId,
      fiscalPeriod: period,
      contractValue: proj.contractValue,
      cumulativeCostIncurred: cumulativeCost,
      estimatedTotalCostAtCompletion: eac,
      calculatedCostToCostPercent: costToCostPct,
      cumulativeRecognizedRevenue: cumulativeRevenue,
      priorRecognizedRevenue: priorRecognized,
      currentPeriodRevenueToRecognize: toRecognize,
      currency: proj.currency,
      methodApplied: 'PERCENTAGE_OF_COMPLETION',
      auditedBy: 'Deloitte Middle East / Jean-Luc Moreau',
      status: 'AUDITED_AND_POSTED'
    };

    setRevenueRecognitions(prev => [newRev, ...prev]);
  };

  const submitPaymentCertificate = (cert: Partial<Omit<ProgressPaymentCertificate, 'id' | 'certificateNumber' | 'netPayableAmount' | 'vatTaxAmount' | 'totalClientPayable' | 'status'>>) => {
    const retention = (cert.certifiedWorkAmount * cert.retentionDeductionPercent) / 100;
    const netPayableAmount = cert.certifiedWorkAmount - retention - cert.mobilizationAdvanceRecoveryAmount + cert.materialOnSiteCertifiedAmount;
    const vatTaxAmount = netPayableAmount * 0.05;
    const totalClientPayable = netPayableAmount + vatTaxAmount;

    const newIpc = {
      ...cert,
      id: `ipc-${Date.now()}`,
      certificateNumber: `IPC-2026-${Math.floor(100 + mockRandom() * 900)}`,
      retentionDeductionAmount: retention,
      netPayableAmount,
      vatTaxAmount,
      totalClientPayable,
      status: 'SUBMITTED_TO_CLIENT'
    } as ProgressPaymentCertificate;

    setPaymentCertificates(prev => [newIpc, ...prev]);
  };

  const certifyPaymentCertificate = (id: string, consultantName: string) => {
    setPaymentCertificates(prev => prev.map(ipc => {
      if (ipc.id === id) {
        return {
          ...ipc,
          status: 'CONSULTANT_CERTIFIED',
          clientConsultantEngineer: consultantName,
          consultantSignoffDate: new Date().toISOString().split('T')[0]
        };
      }
      return ipc;
    }));
  };

  const generateInvoiceFromCertificate = (certificateId: string) => {
    const ipc = paymentCertificates.find(c => c.id === certificateId);
    if (!ipc) return;

    const proj = projects.find(p => p.id === ipc.projectId);
    const invoiceNumber = `INV-PRJ-2026-${Math.floor(100 + mockRandom() * 900)}`;

    const newInv: ProjectCustomerInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber,
      projectId: ipc.projectId,
      customerName: proj?.clientEntity || 'Client Principal Entity',
      linkedIpcNumber: ipc.certificateNumber,
      invoiceDate: new Date().toISOString().split('T')[0],
      paymentDueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      netAmount: ipc.netPayableAmount,
      vatAmount: ipc.vatTaxAmount,
      totalGrossInvoiceAmount: ipc.totalClientPayable,
      currency: ipc.currency,
      paidAmount: 0,
      outstandingBalance: ipc.totalClientPayable,
      paymentStatus: 'UNPAID_PENDING_MATURITY'
    };

    setCustomerInvoices(prev => [newInv, ...prev]);

    // Update billed amount on project
    setProjects(prev => prev.map(p => {
      if (p.id === ipc.projectId) {
        return { ...p, totalBilledAmount: p.totalBilledAmount + ipc.netPayableAmount };
      }
      return p;
    }));
  };

  // EVM Calculations
  const getProjectEvmMetrics = (projectId: string): ProjectEarnedValueMetrics => {
    const proj = projects.find(p => p.id === projectId) || selectedProject;
    const bac = proj.totalBudget; // Budget at Completion
    const progressFraction = (proj.overallProgressPercent || 0) / 100;
    
    // Earned Value = BAC * Progress%
    const ev = Math.round(bac * progressFraction);
    
    // Planned Value based on time elapsed fraction (assume 60% planned duration passed)
    const pv = Math.round(bac * 0.58);
    
    // Actual Cost from direct bookings
    const ac = proj.totalActualCost;

    const sv = ev - pv;
    const cv = ev - ac;
    const spi = pv > 0 ? Math.round((ev / pv) * 100) / 100 : 1.0;
    const cpi = ac > 0 ? Math.round((ev / ac) * 100) / 100 : 1.0;

    const eac = cpi > 0 ? Math.round(bac / cpi) : bac;
    const etc = Math.max(0, eac - ac);
    const vac = bac - eac;
    const tcpi = (bac - ac) > 0 ? Math.round(((bac - ev) / (bac - ac)) * 100) / 100 : 1.0;

    let healthStatus: ProjectEarnedValueMetrics['healthStatus'] = 'ON_TRACK';
    if (cpi < 0.9 && spi < 0.9) healthStatus = 'CRITICAL_INTERVENTION_REQUIRED';
    else if (cpi < 0.95) healthStatus = 'COST_OVERRUN_RISK';
    else if (spi < 0.95) healthStatus = 'SCHEDULE_DELAY';

    return {
      projectId: proj.id,
      projectCode: proj.projectCode,
      projectName: proj.projectName,
      currency: proj.currency,
      budgetAtCompletion: bac,
      plannedValue: pv,
      earnedValue: ev,
      actualCost: ac,
      scheduleVariance: sv,
      costVariance: cv,
      schedulePerformanceIndex: spi,
      costPerformanceIndex: cpi,
      estimateAtCompletion: eac,
      estimateToComplete: etc,
      varianceAtCompletion: vac,
      toCompletePerformanceIndex: tcpi,
      healthStatus
    };
  };

  const getProjectPnL = (projectId: string): ProjectPnLStatement => {
    const proj = projects.find(p => p.id === projectId) || selectedProject;
    
    const matDirect = materialCosts.filter(m => m.projectId === proj.id).reduce((sum, m) => sum + m.totalCost, 0);
    const labDirect = laborCosts.filter(l => l.projectId === proj.id).reduce((sum, l) => sum + l.totalLaborCost, 0);
    const eqpDirect = equipmentCosts.filter(e => e.projectId === proj.id).reduce((sum, e) => sum + e.totalCost, 0);
    const subDirect = subcontracts.filter(s => s.projectId === proj.id).reduce((sum, s) => sum + s.totalCertifiedWorkDone, 0);
    const siteOverhead = Math.round((matDirect + labDirect + eqpDirect + subDirect) * 0.08);

    const totalCostOfWorkDone = matDirect + labDirect + eqpDirect + subDirect + siteOverhead;
    const revenueRecognized = revenueRecognitions.filter(r => r.projectId === proj.id).reduce((sum, r) => sum + r.currentPeriodRevenueToRecognize, 0) || Math.round(proj.contractValue * (proj.overallProgressPercent / 100));

    const grossProfit = revenueRecognized - totalCostOfWorkDone;
    const grossMarginPct = revenueRecognized > 0 ? Math.round((grossProfit / revenueRecognized) * 1000) / 10 : 0;
    const netMarginPct = Math.round((grossMarginPct - 4.5) * 10) / 10;

    return {
      projectId: proj.id,
      period: 'Cumulative Inception-to-Date 2026',
      contractRevenueRecognized: revenueRecognized,
      materialDirectCost: matDirect,
      laborDirectCost: labDirect,
      equipmentDirectCost: eqpDirect,
      subcontractorDirectCost: subDirect,
      siteOverheadAllocated: siteOverhead,
      totalCostOfWorkDone,
      grossProfitAmount: grossProfit,
      grossProfitMarginPercent: grossMarginPct,
      netMarginPercent: netMarginPct
    };
  };

  const getProjectCashFlow = (projectId: string): ProjectCashFlowStatement => {
    const proj = projects.find(p => p.id === projectId) || selectedProject;
    
    const progressClaims = customerInvoices.filter(i => i.projectId === proj.id).reduce((sum, i) => sum + i.paidAmount, 0) || proj.totalReceivedAmount;
    const advanceColl = Math.round(proj.contractValue * 0.10);
    const totalInflows = advanceColl + progressClaims;

    const vendorPay = materialCosts.filter(m => m.projectId === proj.id).reduce((sum, m) => sum + m.totalCost, 0);
    const labPay = laborCosts.filter(l => l.projectId === proj.id).reduce((sum, l) => sum + l.totalLaborCost, 0);
    const eqpPay = equipmentCosts.filter(e => e.projectId === proj.id).reduce((sum, e) => sum + e.totalCost, 0);
    const subPay = subcontracts.filter(s => s.projectId === proj.id).reduce((sum, s) => sum + s.totalPaidToDate, 0);
    const permitPay = Math.round(vendorPay * 0.04);
    const totalOutflows = vendorPay + labPay + eqpPay + subPay + permitPay;

    const netOperating = totalInflows - totalOutflows;

    return {
      projectId: proj.id,
      currency: proj.currency,
      inflows: {
        advancePaymentCollected: advanceColl,
        progressClaimsReceived: progressClaims,
        retentionReleased: 0,
        totalCashInflows: totalInflows
      },
      outflows: {
        vendorMaterialPayments: vendorPay,
        siteLaborPayroll: labPay,
        equipmentRentalPayments: eqpPay,
        subcontractorDisbursements: subPay,
        statutoryPermitsAndOverheads: permitPay,
        totalCashOutflows: totalOutflows
      },
      netOperatingCashFlow: netOperating,
      cumulativeProjectLiquidity: netOperating + 450000 // initial project float
    };
  };

  return (
    <ProjectStoreContext.Provider
      value={{
        deleteProject,
        createClassification,
        updateClassification,
        deleteClassification,
        updatePhase,
        deletePhase,
        updateActivity,
        deleteActivity,
        selectProject: (id: string) => {
          const target = projects.find((p) => p.id === id);
          if (target) setSelectedProject(target);
        },
        companies,
        branches,
        departments,
        costCenters,
        clientEntities,
        projectManagers,
        siteEngineers,
        currencies,
        projects,
        classifications,
        selectedProject,
        setSelectedProject,
        createProject,
        updateProject,
        addPhase,
        addActivity,
        updateActivityProgress,

        budgetLines,
        createBudgetLine,
        resourceAllocations,
        allocateResource,

        costCodes,
        createCostCode,
        materialCosts,
        postMaterialCost,
        laborCosts,
        postLaborCost,
        equipmentCosts,
        postEquipmentCost,

        purchaseRequisitions,
        createPurchaseRequisition,
        approvePurchaseRequisition,
        purchaseOrders,
        generatePurchaseOrderFromPr,
        siteInventory,
        subcontracts,
        createSubcontract,

        revenueRecognitions,
        calculateRevenueRecognition,
        paymentCertificates,
        submitPaymentCertificate,
        certifyPaymentCertificate,
        customerInvoices,
        generateInvoiceFromCertificate,

        getProjectEvmMetrics,
        getProjectPnL,
        getProjectCashFlow
      }}
    >
      {children}
    </ProjectStoreContext.Provider>
  );
};

export const useProjectStore = () => {
  const context = useContext(ProjectStoreContext);
  if (!context) {
    throw new Error('useProjectStore must be used within a ProjectProvider');
  }
  return context;
};
