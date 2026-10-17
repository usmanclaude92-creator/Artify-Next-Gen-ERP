// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 08: MANUFACTURING / PRODUCTION
// Persistent Reactive State Store
// ==========================================

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  BillOfMaterials,
  BomComponentLine,
  RoutingOperationStep,
  ProductionSpecification,
  ProductionForecast,
  MasterProductionScheduleItem,
  MrpRequirementLine,
  WorkOrder,
  WorkOrderMaterialRequirement,
  MaterialIssueVoucher,
  MaterialReturnVoucher,
  WorkCenter,
  WorkCenterScheduleSlot,
  ProductionReceiptVoucher,
  ScrapRecord,
  ByProductReceipt,
  ProductionCostSheet,
  CostBreakdownItem,
  ManufacturingExecutiveStats,
  WorkOrderStatus,
  WorkOrderPriority,
  ScrapReasonCode
} from '../types';
import { mockRandom } from '@/src/utils/mockRandom';

// ==========================================
// INITIAL REALISTIC INDUSTRIAL DATA (OMAN)
// ==========================================

const INITIAL_WORK_CENTERS: WorkCenter[] = [
  {
    id: 'wc-01',
    code: 'WC-01',
    name: 'Heavy CNC 5-Axis Milling & Turning',
    type: 'MACHINING',
    plantLocation: 'Sohar Plant — Bay 1 (Heavy Machining)',
    costCenterCode: 'CC-3101-MFG',
    status: 'OPERATIONAL',
    shiftsPerDay: 2,
    workingHoursPerShift: 8,
    daysPerWeek: 6,
    nominalCapacityHoursPerWeek: 96,
    efficiencyFactorPct: 88,
    effectiveCapacityHoursPerWeek: 84.5,
    standardHourlyLaborRateOMR: 12.50,
    standardHourlyMachineRateOMR: 28.00,
    standardHourlyOverheadRateOMR: 8.50,
    totalHourlyBurdenRateOMR: 49.00,
    oeeAvailabilityPct: 92.4,
    oeePerformancePct: 89.1,
    oeeQualityPct: 98.7,
    oeeOverallPct: 81.3,
    machines: [
      {
        machineId: 'mch-01',
        machineCode: 'CNC-DMG-01',
        name: 'DMG Mori DMU 80P duoBLOCK 5-Axis Machining Center',
        model: 'DMU 80P',
        manufacturer: 'DMG Mori Germany',
        serialNumber: 'DMG-2023-88912',
        commissionYear: 2023,
        status: 'RUNNING',
        powerRatingKw: 45,
        hourlyOperatingCostOMR: 28.00,
        lastPmDate: '2026-07-15',
        nextPmDueDate: '2026-09-15'
      },
      {
        machineId: 'mch-02',
        machineCode: 'CNC-MAZAK-02',
        name: 'Mazak Integrex e-670H Multi-Tasking Center',
        model: 'Integrex e-670H',
        manufacturer: 'Yamazaki Mazak Japan',
        serialNumber: 'MZK-2024-11029',
        commissionYear: 2024,
        status: 'RUNNING',
        powerRatingKw: 55,
        hourlyOperatingCostOMR: 32.00,
        lastPmDate: '2026-08-01',
        nextPmDueDate: '2026-10-01'
      }
    ],
    laborSkills: [
      {
        roleTitle: 'Lead CNC Programmer & Master Machinist',
        requiredCertification: 'Siemens 840D / Mastercam Level 3',
        headcountAvailable: 3,
        hourlyLaborRateOMR: 14.50,
        overtimeMultiplier: 1.5
      },
      {
        roleTitle: 'CNC Setup Operator',
        requiredCertification: 'Precision Tool Setting & G-Code QA',
        headcountAvailable: 4,
        hourlyLaborRateOMR: 11.00,
        overtimeMultiplier: 1.5
      }
    ],
    currentScheduledJobsCount: 4
  },
  {
    id: 'wc-02',
    code: 'WC-02',
    name: 'Robotic & Submerged Arc Welding (SAW)',
    type: 'WELDING',
    plantLocation: 'Sohar Plant — Bay 2 (Pressure Vessel Fabrication)',
    costCenterCode: 'CC-3102-MFG',
    status: 'OPERATIONAL',
    shiftsPerDay: 2,
    workingHoursPerShift: 8,
    daysPerWeek: 6,
    nominalCapacityHoursPerWeek: 96,
    efficiencyFactorPct: 91,
    effectiveCapacityHoursPerWeek: 87.4,
    standardHourlyLaborRateOMR: 11.00,
    standardHourlyMachineRateOMR: 19.50,
    standardHourlyOverheadRateOMR: 6.50,
    totalHourlyBurdenRateOMR: 37.00,
    oeeAvailabilityPct: 94.0,
    oeePerformancePct: 91.5,
    oeeQualityPct: 99.2,
    oeeOverallPct: 85.3,
    machines: [
      {
        machineId: 'mch-03',
        machineCode: 'ROBO-WELD-01',
        name: 'KUKA KR Cybertech 6-Axis Heavy Welding Cell',
        model: 'KR 16 R2010',
        manufacturer: 'KUKA Robotics Germany',
        serialNumber: 'KUK-2022-77189',
        commissionYear: 2022,
        status: 'RUNNING',
        powerRatingKw: 30,
        hourlyOperatingCostOMR: 19.50,
        lastPmDate: '2026-07-28',
        nextPmDueDate: '2026-09-28'
      }
    ],
    laborSkills: [
      {
        roleTitle: 'Certified Welding Inspector (CWI)',
        requiredCertification: 'AWS CWI / CSWIP 3.1 / ASME IX',
        headcountAvailable: 2,
        hourlyLaborRateOMR: 15.00,
        overtimeMultiplier: 1.5
      },
      {
        roleTitle: '6G / Robotic Welding Technician',
        requiredCertification: 'ASME Section IX 6G SMAW/GTAW/GMAW',
        headcountAvailable: 6,
        hourlyLaborRateOMR: 9.70,
        overtimeMultiplier: 1.5
      }
    ],
    currentScheduledJobsCount: 3
  },
  {
    id: 'wc-03',
    code: 'WC-03',
    name: 'Surface Preparation & Thermal Spray Coating',
    type: 'SURFACE_TREATMENT',
    plantLocation: 'Sohar Plant — Blast & Paint Yard (Bay 3)',
    costCenterCode: 'CC-3103-MFG',
    status: 'OPERATIONAL',
    shiftsPerDay: 1,
    workingHoursPerShift: 8,
    daysPerWeek: 6,
    nominalCapacityHoursPerWeek: 48,
    efficiencyFactorPct: 85,
    effectiveCapacityHoursPerWeek: 40.8,
    standardHourlyLaborRateOMR: 9.50,
    standardHourlyMachineRateOMR: 15.00,
    standardHourlyOverheadRateOMR: 7.00,
    totalHourlyBurdenRateOMR: 31.50,
    oeeAvailabilityPct: 89.5,
    oeePerformancePct: 87.0,
    oeeQualityPct: 97.8,
    oeeOverallPct: 76.2,
    machines: [
      {
        machineId: 'mch-04',
        machineCode: 'BLAST-AUTO-01',
        name: 'Wheelabrator Automated Roller Conveyor Shot Blast',
        model: 'RB-1500/4',
        manufacturer: 'Wheelabrator Group UK',
        serialNumber: 'WHL-2021-49912',
        commissionYear: 2021,
        status: 'RUNNING',
        powerRatingKw: 60,
        hourlyOperatingCostOMR: 15.00,
        lastPmDate: '2026-08-10',
        nextPmDueDate: '2026-10-10'
      }
    ],
    laborSkills: [
      {
        roleTitle: 'NACE Level 2 Coating Inspector',
        requiredCertification: 'NACE / AMPP CIP Level 2',
        headcountAvailable: 2,
        hourlyLaborRateOMR: 13.00,
        overtimeMultiplier: 1.5
      },
      {
        roleTitle: 'Airless Spray & Sandblaster',
        requiredCertification: 'SSPC-SP 10 / ISO 8501-1 Sa 2.5',
        headcountAvailable: 5,
        hourlyLaborRateOMR: 8.10,
        overtimeMultiplier: 1.5
      }
    ],
    currentScheduledJobsCount: 2
  },
  {
    id: 'wc-04',
    code: 'WC-04',
    name: 'Precision Mechanical & Actuator Assembly',
    type: 'ASSEMBLY',
    plantLocation: 'Sohar Plant — Cleanroom Assembly Bay (Bay 4)',
    costCenterCode: 'CC-3104-MFG',
    status: 'OPERATIONAL',
    shiftsPerDay: 2,
    workingHoursPerShift: 8,
    daysPerWeek: 6,
    nominalCapacityHoursPerWeek: 96,
    efficiencyFactorPct: 95,
    effectiveCapacityHoursPerWeek: 91.2,
    standardHourlyLaborRateOMR: 10.50,
    standardHourlyMachineRateOMR: 8.00,
    standardHourlyOverheadRateOMR: 4.50,
    totalHourlyBurdenRateOMR: 23.00,
    oeeAvailabilityPct: 96.2,
    oeePerformancePct: 94.0,
    oeeQualityPct: 99.5,
    oeeOverallPct: 89.9,
    machines: [
      {
        machineId: 'mch-05',
        machineCode: 'TORQ-STN-01',
        name: 'Atlas Copco Smart Automated Torque Tooling Rig',
        model: 'Power Focus 6000',
        manufacturer: 'Atlas Copco Sweden',
        serialNumber: 'ATC-2024-33109',
        commissionYear: 2024,
        status: 'RUNNING',
        powerRatingKw: 10,
        hourlyOperatingCostOMR: 8.00,
        lastPmDate: '2026-08-05',
        nextPmDueDate: '2026-11-05'
      }
    ],
    laborSkills: [
      {
        roleTitle: 'Senior Instrumentation & Assembly Fitter',
        requiredCertification: 'Electro-Hydraulic Precision Assembly',
        headcountAvailable: 6,
        hourlyLaborRateOMR: 10.50,
        overtimeMultiplier: 1.5
      }
    ],
    currentScheduledJobsCount: 5
  },
  {
    id: 'wc-05',
    code: 'WC-05',
    name: 'Hydrostatic, Cryogenic & NDT Testing Bay',
    type: 'TESTING_QC',
    plantLocation: 'Sohar Plant — Bunker 5 (High Pressure Test Bay)',
    costCenterCode: 'CC-3105-MFG',
    status: 'OPERATIONAL',
    shiftsPerDay: 2,
    workingHoursPerShift: 8,
    daysPerWeek: 6,
    nominalCapacityHoursPerWeek: 96,
    efficiencyFactorPct: 90,
    effectiveCapacityHoursPerWeek: 86.4,
    standardHourlyLaborRateOMR: 14.00,
    standardHourlyMachineRateOMR: 22.00,
    standardHourlyOverheadRateOMR: 6.00,
    totalHourlyBurdenRateOMR: 42.00,
    oeeAvailabilityPct: 95.0,
    oeePerformancePct: 92.0,
    oeeQualityPct: 99.8,
    oeeOverallPct: 87.2,
    machines: [
      {
        machineId: 'mch-06',
        machineCode: 'HYDRO-RIG-01',
        name: 'Maximator 15,000 PSI Automated Hydrostatic Test Skid',
        model: 'MAX-HT-15K-DIG',
        manufacturer: 'Maximator GmbH Germany',
        serialNumber: 'MAX-2023-55102',
        commissionYear: 2023,
        status: 'RUNNING',
        powerRatingKw: 25,
        hourlyOperatingCostOMR: 22.00,
        lastPmDate: '2026-07-20',
        nextPmDueDate: '2026-09-20'
      }
    ],
    laborSkills: [
      {
        roleTitle: 'ASNT Level II NDT & Pressure Test Lead',
        requiredCertification: 'ASNT Level II (UT/PT/MT/RT) + API 598',
        headcountAvailable: 3,
        hourlyLaborRateOMR: 14.00,
        overtimeMultiplier: 1.5
      }
    ],
    currentScheduledJobsCount: 3
  }
];

const INITIAL_BOMS: BillOfMaterials[] = [
  {
    id: 'bom-01',
    bomCode: 'BOM-VLV-API6D-001',
    productSku: 'FG-VALVE-API6D-12IN',
    productName: '12" Class 600 Forged Trunnion Ball Valve (API 6D / NACE MR0175)',
    description: 'Heavy industrial high-pressure trunnion ball valve engineered for Petroleum Development Oman (PDO) sour gas transmission pipelines.',
    version: 'v2.2',
    status: 'ACTIVE',
    baseQuantity: 1,
    baseUom: 'PCS',
    effectiveFrom: '2026-01-01',
    effectiveTo: '2027-12-31',
    ecnReference: 'ECN-2026-014 (Trim Material Upgrade to Inconel 625)',
    changeNotes: 'Upgraded stem and ball overlay to Inconel 625 cladding for severe H2S sour service compliance.',
    createdBy: 'Eng. Tariq Al-Balushi (Chief Production Engineer)',
    createdAt: '2026-01-10',
    updatedAt: '2026-06-15',
    specifications: {
      id: 'spec-01',
      specCode: 'SPEC-PDO-SP-2040-CL600',
      title: 'PDO Specification SP-2040 Pipeline Valves Class 600',
      drawingNumber: 'DWG-VLV-12-600-REV-D',
      cadFileRef: 'artify-vault://cad/valves/12in_class600_trunnion_v2.step',
      revision: 'Rev D',
      toleranceStandard: 'ISO 2768-mK / API 6D Annex G',
      materialGrade: 'ASTM A105 Forged Body + Inconel 625 Clad Trim',
      safetyRequirements: [
        'Fire-safe tested in compliance with API 607 7th Edition / ISO 10497',
        'Anti-static grounding device design verified to 10 Ohms resistance',
        'NACE MR0175 / ISO 15156 hardness under 22 HRC max for sour service'
      ],
      qaCheckpoints: [
        '100% Ultrasonic Testing (UT) of forged body blocks per ASME Section V',
        '1.5x Hydrostatic Body Shell Test at 150 bar for 15 minutes holding',
        '1.1x High Pressure Hydrostatic Seat Test at 110 bar zero leakage (Rate A)',
        'Low-pressure pneumatic air seat test at 6 bar with bubble inspection'
      ],
      approvedBy: 'PDO QA/QC Technical Authority TA-2',
      approvedDate: '2026-01-15'
    },
    components: [
      {
        id: 'comp-01',
        itemCode: 'RAW-FORG-BODY-A105',
        itemName: 'Forged Body Block ASTM A105 Class 600',
        category: 'Raw Forgings',
        quantityPerUnit: 1,
        uom: 'PCS',
        unitCostOMR: 420.00,
        totalCostOMR: 420.00,
        scrapAllowancePct: 2.0,
        isSubAssembly: false,
        operationSeqNumber: 10,
        notes: 'Includes EN 10204 3.1 Mill Test Certificate'
      },
      {
        id: 'comp-02',
        itemCode: 'RAW-BALL-F316L',
        itemName: 'Solid Forged 12" Ball ASTM A182 F316L',
        category: 'Valve Trims',
        quantityPerUnit: 1,
        uom: 'PCS',
        unitCostOMR: 195.00,
        totalCostOMR: 195.00,
        scrapAllowancePct: 1.5,
        isSubAssembly: false,
        operationSeqNumber: 10
      },
      {
        id: 'comp-03',
        itemCode: 'SUB-ACTUATOR-HYD',
        itemName: 'Scotch Yoke Heavy Hydraulic Actuator Module',
        category: 'Sub-Assemblies',
        quantityPerUnit: 1,
        uom: 'PCS',
        unitCostOMR: 280.00,
        totalCostOMR: 280.00,
        scrapAllowancePct: 0.0,
        isSubAssembly: true,
        subAssemblyBomId: 'bom-02',
        operationSeqNumber: 40
      },
      {
        id: 'comp-04',
        itemCode: 'SEAL-SET-PTFE-INCONEL',
        itemName: 'Primary PEEK & Inconel X-750 Energized Seal Kit',
        category: 'Gaskets & Seals',
        quantityPerUnit: 2,
        uom: 'SET',
        unitCostOMR: 45.00,
        totalCostOMR: 90.00,
        scrapAllowancePct: 1.0,
        isSubAssembly: false,
        operationSeqNumber: 40
      },
      {
        id: 'comp-05',
        itemCode: 'HARD-BOLTS-B7-SET',
        itemName: 'High-Tensile Stud Bolts ASTM A193 B7 with 2H Nuts (Set of 24)',
        category: 'Fasteners',
        quantityPerUnit: 1,
        uom: 'SET',
        unitCostOMR: 38.50,
        totalCostOMR: 38.50,
        scrapAllowancePct: 0.5,
        isSubAssembly: false,
        operationSeqNumber: 40
      },
      {
        id: 'comp-06',
        itemCode: 'COAT-EPOXY-SIGMA',
        itemName: 'High-Build Polyamide Cured Epoxy Marine Coating',
        category: 'Paints & Chemicals',
        quantityPerUnit: 4.5,
        uom: 'LITRE',
        unitCostOMR: 4.80,
        totalCostOMR: 21.60,
        scrapAllowancePct: 5.0,
        isSubAssembly: false,
        operationSeqNumber: 30
      }
    ],
    byProducts: [
      {
        id: 'byp-01',
        itemCode: 'SCRAP-STEEL-SWARF',
        itemName: 'Recyclable ASTM A105 High-Density Steel Machining Swarf',
        expectedOutputRatio: 28.5, // 28.5 kg per valve
        uom: 'KG',
        estimatedValueOMR: 0.28,
        costAllocationMethod: 'NET_REALIZABLE_VALUE'
      }
    ],
    routingSteps: [
      {
        id: 'rt-10',
        stepNumber: 10,
        operationName: '5-Axis CNC Rough & Finish Body Boring',
        description: 'Bore internal cavity, machine seat pockets, flange faces with concentric serrations (Ra 3.2-6.3 um).',
        workCenterId: 'wc-01',
        workCenterName: 'Heavy CNC 5-Axis Milling & Turning',
        setupTimeMinutes: 45,
        runTimeMinutesPerUnit: 180, // 3 hours
        laborHoursPerUnit: 3.0,
        machineHoursPerUnit: 3.0,
        standardLaborRateOMR: 12.50,
        standardMachineRateOMR: 28.00,
        standardOverheadRateOMR: 8.50,
        totalStepCostPerUnitOMR: 147.00,
        qualityCheckRequired: true,
        inspectionStandardDoc: 'QA-INSP-01-DIMENSIONAL-CMM'
      },
      {
        id: 'rt-20',
        stepNumber: 20,
        operationName: 'Robotic Inconel 625 Seat Overlay Cladding',
        description: 'Deposit 3.0mm minimum Inconel 625 alloy weld overlay on internal seal surfaces to eliminate corrosion.',
        workCenterId: 'wc-02',
        workCenterName: 'Robotic & Submerged Arc Welding (SAW)',
        setupTimeMinutes: 30,
        runTimeMinutesPerUnit: 90, // 1.5 hours
        laborHoursPerUnit: 1.5,
        machineHoursPerUnit: 1.5,
        standardLaborRateOMR: 11.00,
        standardMachineRateOMR: 19.50,
        standardOverheadRateOMR: 6.50,
        totalStepCostPerUnitOMR: 55.50,
        qualityCheckRequired: true,
        inspectionStandardDoc: 'QA-INSP-02-FERRITE-DYE-PEN'
      },
      {
        id: 'rt-30',
        stepNumber: 30,
        operationName: 'Surface Blast Sa 2.5 & Epoxy Coating',
        description: 'Grit blast external surface to Sa 2.5 profile and apply 3-coat heavy duty marine polyurethane system (350 um DFT).',
        workCenterId: 'wc-03',
        workCenterName: 'Surface Preparation & Thermal Spray Coating',
        setupTimeMinutes: 20,
        runTimeMinutesPerUnit: 60, // 1 hour
        laborHoursPerUnit: 1.0,
        machineHoursPerUnit: 1.0,
        standardLaborRateOMR: 9.50,
        standardMachineRateOMR: 15.00,
        standardOverheadRateOMR: 7.00,
        totalStepCostPerUnitOMR: 31.50,
        qualityCheckRequired: true,
        inspectionStandardDoc: 'QA-INSP-03-DFT-HOLIDAY-TEST'
      },
      {
        id: 'rt-40',
        stepNumber: 40,
        operationName: 'Trunnion Ball & Actuator Assembly',
        description: 'Mount lower trunnion plates, PEEK seats, stem packing seals, and bolt bonnet flanges using calibrated torque rig.',
        workCenterId: 'wc-04',
        workCenterName: 'Precision Mechanical & Actuator Assembly',
        setupTimeMinutes: 20,
        runTimeMinutesPerUnit: 120, // 2 hours
        laborHoursPerUnit: 2.0,
        machineHoursPerUnit: 2.0,
        standardLaborRateOMR: 10.50,
        standardMachineRateOMR: 8.00,
        standardOverheadRateOMR: 4.50,
        totalStepCostPerUnitOMR: 46.00,
        qualityCheckRequired: true,
        inspectionStandardDoc: 'QA-INSP-04-TORQUE-AUDIT'
      },
      {
        id: 'rt-50',
        stepNumber: 50,
        operationName: 'Hydrostatic Shell & Dual Seat Testing',
        description: '150 bar shell hydro test + 110 bar seat test with chart recording per API 6D and client inspector witness.',
        workCenterId: 'wc-05',
        workCenterName: 'Hydrostatic, Cryogenic & NDT Testing Bay',
        setupTimeMinutes: 30,
        runTimeMinutesPerUnit: 90, // 1.5 hours
        laborHoursPerUnit: 1.5,
        machineHoursPerUnit: 1.5,
        standardLaborRateOMR: 14.00,
        standardMachineRateOMR: 22.00,
        standardOverheadRateOMR: 6.00,
        totalStepCostPerUnitOMR: 63.00,
        qualityCheckRequired: true,
        inspectionStandardDoc: 'QA-INSP-05-HYDRO-PRESSURE-LOG'
      }
    ],
    totalMaterialCostOMR: 1045.10,
    totalLaborCostOMR: 106.50,
    totalMachineCostOMR: 181.50,
    totalStandardCostOMR: 1388.10
  },
  {
    id: 'bom-02',
    bomCode: 'BOM-ACT-HYD-002',
    productSku: 'SUB-ACTUATOR-HYD',
    productName: 'Scotch Yoke Heavy Hydraulic Actuator Module',
    description: 'Double-acting heavy hydraulic scotch yoke actuator mechanism with fail-safe spring return cylinder.',
    version: 'v1.4',
    status: 'ACTIVE',
    baseQuantity: 1,
    baseUom: 'PCS',
    effectiveFrom: '2026-01-01',
    effectiveTo: '2027-12-31',
    createdBy: 'Eng. Said Al-Hajri',
    createdAt: '2026-01-20',
    updatedAt: '2026-05-10',
    components: [
      {
        id: 'c-sub-01',
        itemCode: 'RAW-CYL-TUBE-ST52',
        itemName: 'Honed Seamless Cylinder Tube DIN St52-3',
        category: 'Raw Materials',
        quantityPerUnit: 1,
        uom: 'PCS',
        unitCostOMR: 110.00,
        totalCostOMR: 110.00,
        scrapAllowancePct: 1.0,
        isSubAssembly: false,
        operationSeqNumber: 10
      },
      {
        id: 'c-sub-02',
        itemCode: 'RAW-ROD-CHROME-42CR',
        itemName: 'Hard Chrome Plated Piston Rod 42CrMo4',
        category: 'Raw Materials',
        quantityPerUnit: 1,
        uom: 'PCS',
        unitCostOMR: 65.00,
        totalCostOMR: 65.00,
        scrapAllowancePct: 1.0,
        isSubAssembly: false,
        operationSeqNumber: 10
      },
      {
        id: 'c-sub-03',
        itemCode: 'SEAL-KIT-HYD-VITON',
        itemName: 'High-Pressure Viton & PTFE Cylinder Seal Set',
        category: 'Gaskets & Seals',
        quantityPerUnit: 1,
        uom: 'SET',
        unitCostOMR: 35.00,
        totalCostOMR: 35.00,
        scrapAllowancePct: 0.0,
        isSubAssembly: false,
        operationSeqNumber: 40
      }
    ],
    byProducts: [],
    routingSteps: [
      {
        id: 'rt-sub-10',
        stepNumber: 10,
        operationName: 'Precision Cylinder Machining & End Flange Milling',
        description: 'CNC turn and thread cylinder body and machine tie-rod mounting holes.',
        workCenterId: 'wc-01',
        workCenterName: 'Heavy CNC 5-Axis Milling & Turning',
        setupTimeMinutes: 30,
        runTimeMinutesPerUnit: 60,
        laborHoursPerUnit: 1.0,
        machineHoursPerUnit: 1.0,
        standardLaborRateOMR: 12.50,
        standardMachineRateOMR: 28.00,
        standardOverheadRateOMR: 8.50,
        totalStepCostPerUnitOMR: 49.00,
        qualityCheckRequired: true
      },
      {
        id: 'rt-sub-40',
        stepNumber: 40,
        operationName: 'Hydraulic Piston & Seal Assembly and Pressure Calibration',
        description: 'Assemble piston stack, torque end caps, pressure test at 250 bar.',
        workCenterId: 'wc-04',
        workCenterName: 'Precision Mechanical & Actuator Assembly',
        setupTimeMinutes: 15,
        runTimeMinutesPerUnit: 45,
        laborHoursPerUnit: 0.75,
        machineHoursPerUnit: 0.75,
        standardLaborRateOMR: 10.50,
        standardMachineRateOMR: 8.00,
        standardOverheadRateOMR: 4.50,
        totalStepCostPerUnitOMR: 17.25,
        qualityCheckRequired: true
      }
    ],
    totalMaterialCostOMR: 210.00,
    totalLaborCostOMR: 20.38,
    totalMachineCostOMR: 34.00,
    totalStandardCostOMR: 280.00
  },
  {
    id: 'bom-03',
    bomCode: 'BOM-PV-ASME-VIII-003',
    productSku: 'FG-VESSEL-HP-3000L',
    productName: '3,000L ASME Section VIII Div 1 High-Pressure 2-Phase Separator Vessel',
    description: 'Heavy horizontal gas-oil 2-phase separator skid with demister pads, internal vortex breakers, and NACE sour service trim.',
    version: 'v1.0',
    status: 'ACTIVE',
    baseQuantity: 1,
    baseUom: 'UNIT',
    effectiveFrom: '2026-02-01',
    effectiveTo: '2027-12-31',
    createdBy: 'Eng. Salim Al-Maskari',
    createdAt: '2026-02-15',
    updatedAt: '2026-06-01',
    components: [
      {
        id: 'c-pv-01',
        itemCode: 'RAW-PLATE-SA516-70N',
        itemName: 'Pressure Vessel Steel Plate ASTM SA516 Gr 70N (32mm thick)',
        category: 'Steel Plates',
        quantityPerUnit: 4800,
        uom: 'KG',
        unitCostOMR: 0.85,
        totalCostOMR: 4080.00,
        scrapAllowancePct: 3.5,
        isSubAssembly: false,
        operationSeqNumber: 10
      },
      {
        id: 'c-pv-02',
        itemCode: 'RAW-DISHED-END-2000',
        itemName: '2:1 Ellipsoidal Dished Heads SA516-70N OD 2000mm',
        category: 'Formed Components',
        quantityPerUnit: 2,
        uom: 'PCS',
        unitCostOMR: 1450.00,
        totalCostOMR: 2900.00,
        scrapAllowancePct: 0.0,
        isSubAssembly: false,
        operationSeqNumber: 20
      },
      {
        id: 'c-pv-03',
        itemCode: 'RAW-NOZZLE-FLANGE-SET',
        itemName: 'Forged Heavy Nozzles & WNRF Flanges A105N (Set of 12)',
        category: 'Forgings',
        quantityPerUnit: 1,
        uom: 'SET',
        unitCostOMR: 1850.00,
        totalCostOMR: 1850.00,
        scrapAllowancePct: 1.0,
        isSubAssembly: false,
        operationSeqNumber: 20
      }
    ],
    byProducts: [
      {
        id: 'byp-pv-01',
        itemCode: 'SCRAP-PLATE-OFFCUTS',
        itemName: 'Heavy Carbon Steel Plate Offcuts & Edge Trimmings',
        expectedOutputRatio: 180, // 180 kg per vessel
        uom: 'KG',
        estimatedValueOMR: 0.32,
        costAllocationMethod: 'NET_REALIZABLE_VALUE'
      }
    ],
    routingSteps: [
      {
        id: 'rt-pv-10',
        stepNumber: 10,
        operationName: 'Plate Edge Beveling & 4-Roll Plate Rolling',
        description: 'CNC flame cut and roll 32mm plate into cylindrical shell cans with longitudinal weld seam prep.',
        workCenterId: 'wc-01',
        workCenterName: 'Heavy CNC 5-Axis Milling & Turning',
        setupTimeMinutes: 60,
        runTimeMinutesPerUnit: 360,
        laborHoursPerUnit: 6.0,
        machineHoursPerUnit: 6.0,
        standardLaborRateOMR: 12.50,
        standardMachineRateOMR: 28.00,
        standardOverheadRateOMR: 8.50,
        totalStepCostPerUnitOMR: 294.00,
        qualityCheckRequired: true
      },
      {
        id: 'rt-pv-20',
        stepNumber: 20,
        operationName: 'Submerged Arc Welding (SAW) Circumferential Seams & Nozzles',
        description: 'Automatic SAW welding of shell cans and dished heads with 100% Radiographic Testing (RT).',
        workCenterId: 'wc-02',
        workCenterName: 'Robotic & Submerged Arc Welding (SAW)',
        setupTimeMinutes: 90,
        runTimeMinutesPerUnit: 720, // 12 hours
        laborHoursPerUnit: 12.0,
        machineHoursPerUnit: 12.0,
        standardLaborRateOMR: 11.00,
        standardMachineRateOMR: 19.50,
        standardOverheadRateOMR: 6.50,
        totalStepCostPerUnitOMR: 444.00,
        qualityCheckRequired: true
      },
      {
        id: 'rt-pv-30',
        stepNumber: 30,
        operationName: 'External Grit Blasting & High-Temp Heat Resistant Paint',
        description: 'Grit blast to Sa 2.5 and apply inorganic zinc silicate + silicone high-heat finish coat.',
        workCenterId: 'wc-03',
        workCenterName: 'Surface Preparation & Thermal Spray Coating',
        setupTimeMinutes: 45,
        runTimeMinutesPerUnit: 180,
        laborHoursPerUnit: 3.0,
        machineHoursPerUnit: 3.0,
        standardLaborRateOMR: 9.50,
        standardMachineRateOMR: 15.00,
        standardOverheadRateOMR: 7.00,
        totalStepCostPerUnitOMR: 94.50,
        qualityCheckRequired: true
      },
      {
        id: 'rt-pv-50',
        stepNumber: 50,
        operationName: 'ASME Hydrostatic Proof Test at 65 Bar & U-Stamp Inspection',
        description: 'Fill with demineralized water (inhibited 50ppm chloride), hydro test at 65 bar holding for 2 hours, Authorized Inspector signoff.',
        workCenterId: 'wc-05',
        workCenterName: 'Hydrostatic, Cryogenic & NDT Testing Bay',
        setupTimeMinutes: 60,
        runTimeMinutesPerUnit: 240,
        laborHoursPerUnit: 4.0,
        machineHoursPerUnit: 4.0,
        standardLaborRateOMR: 14.00,
        standardMachineRateOMR: 22.00,
        standardOverheadRateOMR: 6.00,
        totalStepCostPerUnitOMR: 168.00,
        qualityCheckRequired: true
      }
    ],
    totalMaterialCostOMR: 8830.00,
    totalLaborCostOMR: 295.50,
    totalMachineCostOMR: 576.00,
    totalStandardCostOMR: 9830.50
  }
];

const INITIAL_WORK_ORDERS: WorkOrder[] = [
  {
    id: 'wo-01',
    orderNumber: 'WO-2026-0081',
    productSku: 'FG-VALVE-API6D-12IN',
    productName: '12" Class 600 Forged Trunnion Ball Valve (API 6D / NACE MR0175)',
    bomId: 'bom-01',
    bomVersion: 'v2.2',
    plannedQuantity: 20,
    completedQuantity: 14,
    scrappedQuantity: 1,
    uom: 'PCS',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    sourceType: 'SALES_ORDER',
    sourceReference: 'SO-2026-0941',
    customerName: 'Petroleum Development Oman (PDO LLC)',
    productionPlant: 'Sohar Industrial Plant — Line A',
    supervisor: 'Khamis Al-Harthy (Line A Lead)',
    scheduledStartDate: '2026-08-01',
    scheduledEndDate: '2026-08-25',
    actualStartDate: '2026-08-02',
    targetLotNumber: 'LOT-2026-VLV-081',
    notes: 'Urgent turnaround for PDO Marmul Sour Gas Depletion Compression Project. Requires TA-2 inspector hold-point on hydro testing.',
    totalStandardCostOMR: 27762.00,
    totalActualWipCostOMR: 28140.00,
    materialRequirements: [
      {
        id: 'mr-01',
        itemCode: 'RAW-FORG-BODY-A105',
        itemName: 'Forged Body Block ASTM A105 Class 600',
        uom: 'PCS',
        requiredQty: 20,
        allocatedQty: 20,
        issuedQty: 20,
        returnedQty: 0,
        consumedQty: 15,
        unitCostOMR: 420.00,
        totalIssuedValueOMR: 8400.00,
        warehouseId: 'wh-rusayl',
        batchLotAllocated: 'LOT-MTR-2026-9921',
        isFullyIssued: true
      },
      {
        id: 'mr-02',
        itemCode: 'RAW-BALL-F316L',
        itemName: 'Solid Forged 12" Ball ASTM A182 F316L',
        uom: 'PCS',
        requiredQty: 20,
        allocatedQty: 20,
        issuedQty: 20,
        returnedQty: 0,
        consumedQty: 15,
        unitCostOMR: 195.00,
        totalIssuedValueOMR: 3900.00,
        warehouseId: 'wh-sohar',
        batchLotAllocated: 'LOT-MTR-2026-7782',
        isFullyIssued: true
      },
      {
        id: 'mr-03',
        itemCode: 'SUB-ACTUATOR-HYD',
        itemName: 'Scotch Yoke Heavy Hydraulic Actuator Module',
        uom: 'PCS',
        requiredQty: 20,
        allocatedQty: 20,
        issuedQty: 20,
        returnedQty: 0,
        consumedQty: 14,
        unitCostOMR: 280.00,
        totalIssuedValueOMR: 5600.00,
        warehouseId: 'wh-sohar',
        batchLotAllocated: 'LOT-ACT-2026-041',
        isFullyIssued: true
      },
      {
        id: 'mr-04',
        itemCode: 'SEAL-SET-PTFE-INCONEL',
        itemName: 'Primary PEEK & Inconel X-750 Energized Seal Kit',
        uom: 'SET',
        requiredQty: 40,
        allocatedQty: 40,
        issuedQty: 40,
        returnedQty: 0,
        consumedQty: 30,
        unitCostOMR: 45.00,
        totalIssuedValueOMR: 1800.00,
        warehouseId: 'wh-sohar',
        isFullyIssued: true
      }
    ],
    operations: [
      {
        stepNumber: 10,
        operationName: '5-Axis CNC Rough & Finish Body Boring',
        workCenterName: 'Heavy CNC 5-Axis Milling & Turning',
        status: 'COMPLETED',
        plannedHours: 60.0,
        actualHours: 62.5,
        completedQuantity: 20,
        scrapQuantity: 0,
        operatorName: 'Mahmood Al-Siyabi'
      },
      {
        stepNumber: 20,
        operationName: 'Robotic Inconel 625 Seat Overlay Cladding',
        workCenterName: 'Robotic & Submerged Arc Welding (SAW)',
        status: 'COMPLETED',
        plannedHours: 30.0,
        actualHours: 31.0,
        completedQuantity: 19,
        scrapQuantity: 1, // 1 scrapped due to thermal porosity
        operatorName: 'Ali Al-Hinai'
      },
      {
        stepNumber: 30,
        operationName: 'Surface Blast Sa 2.5 & Epoxy Coating',
        workCenterName: 'Surface Preparation & Thermal Spray Coating',
        status: 'COMPLETED',
        plannedHours: 20.0,
        actualHours: 19.5,
        completedQuantity: 19,
        scrapQuantity: 0,
        operatorName: 'Murad Al-Zadjali'
      },
      {
        stepNumber: 40,
        operationName: 'Trunnion Ball & Actuator Assembly',
        workCenterName: 'Precision Mechanical & Actuator Assembly',
        status: 'RUNNING',
        plannedHours: 40.0,
        actualHours: 28.0,
        completedQuantity: 14,
        scrapQuantity: 0,
        operatorName: 'Said Al-Jabri'
      },
      {
        stepNumber: 50,
        operationName: 'Hydrostatic Shell & Dual Seat Testing',
        workCenterName: 'Hydrostatic, Cryogenic & NDT Testing Bay',
        status: 'PENDING',
        plannedHours: 30.0,
        actualHours: 0.0,
        completedQuantity: 0,
        scrapQuantity: 0
      }
    ]
  },
  {
    id: 'wo-02',
    orderNumber: 'WO-2026-0082',
    productSku: 'FG-VESSEL-HP-3000L',
    productName: '3,000L ASME Section VIII Div 1 High-Pressure 2-Phase Separator Vessel',
    bomId: 'bom-03',
    bomVersion: 'v1.0',
    plannedQuantity: 2,
    completedQuantity: 1,
    scrappedQuantity: 0,
    uom: 'UNIT',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    sourceType: 'SALES_ORDER',
    sourceReference: 'SO-2026-0925',
    customerName: 'OQ Gas Networks SAOG',
    productionPlant: 'Sohar Industrial Plant — Bay 2',
    supervisor: 'Eng. Salim Al-Maskari',
    scheduledStartDate: '2026-07-15',
    scheduledEndDate: '2026-08-30',
    actualStartDate: '2026-07-16',
    targetLotNumber: 'LOT-2026-PV-002',
    notes: 'ASME U-Stamp Authorized Inspector hold-point mandatory during Radiographic Testing.',
    totalStandardCostOMR: 19661.00,
    totalActualWipCostOMR: 19480.00,
    materialRequirements: [
      {
        id: 'mr-pv-01',
        itemCode: 'RAW-PLATE-SA516-70N',
        itemName: 'Pressure Vessel Steel Plate ASTM SA516 Gr 70N (32mm thick)',
        uom: 'KG',
        requiredQty: 9600,
        allocatedQty: 9600,
        issuedQty: 9600,
        returnedQty: 0,
        consumedQty: 9600,
        unitCostOMR: 0.85,
        totalIssuedValueOMR: 8160.00,
        warehouseId: 'wh-rusayl',
        isFullyIssued: true
      },
      {
        id: 'mr-pv-02',
        itemCode: 'RAW-DISHED-END-2000',
        itemName: '2:1 Ellipsoidal Dished Heads SA516-70N OD 2000mm',
        uom: 'PCS',
        requiredQty: 4,
        allocatedQty: 4,
        issuedQty: 4,
        returnedQty: 0,
        consumedQty: 4,
        unitCostOMR: 1450.00,
        totalIssuedValueOMR: 5800.00,
        warehouseId: 'wh-sohar',
        isFullyIssued: true
      }
    ],
    operations: [
      {
        stepNumber: 10,
        operationName: 'Plate Edge Beveling & 4-Roll Plate Rolling',
        workCenterName: 'Heavy CNC 5-Axis Milling & Turning',
        status: 'COMPLETED',
        plannedHours: 12.0,
        actualHours: 11.5,
        completedQuantity: 2,
        scrapQuantity: 0,
        operatorName: 'Mahmood Al-Siyabi'
      },
      {
        stepNumber: 20,
        operationName: 'Submerged Arc Welding (SAW) Circumferential Seams & Nozzles',
        workCenterName: 'Robotic & Submerged Arc Welding (SAW)',
        status: 'COMPLETED',
        plannedHours: 24.0,
        actualHours: 23.0,
        completedQuantity: 2,
        scrapQuantity: 0,
        operatorName: 'Ali Al-Hinai'
      },
      {
        stepNumber: 30,
        operationName: 'External Grit Blasting & High-Temp Heat Resistant Paint',
        workCenterName: 'Surface Preparation & Thermal Spray Coating',
        status: 'RUNNING',
        plannedHours: 6.0,
        actualHours: 3.5,
        completedQuantity: 1,
        scrapQuantity: 0,
        operatorName: 'Murad Al-Zadjali'
      },
      {
        stepNumber: 50,
        operationName: 'ASME Hydrostatic Proof Test at 65 Bar & U-Stamp Inspection',
        workCenterName: 'Hydrostatic, Cryogenic & NDT Testing Bay',
        status: 'PENDING',
        plannedHours: 8.0,
        actualHours: 0.0,
        completedQuantity: 0,
        scrapQuantity: 0
      }
    ]
  },
  {
    id: 'wo-03',
    orderNumber: 'WO-2026-0083',
    productSku: 'SUB-ACTUATOR-HYD',
    productName: 'Scotch Yoke Heavy Hydraulic Actuator Module',
    bomId: 'bom-02',
    bomVersion: 'v1.4',
    plannedQuantity: 30,
    completedQuantity: 30,
    scrappedQuantity: 0,
    uom: 'PCS',
    priority: 'NORMAL',
    status: 'COMPLETED',
    sourceType: 'MPS_PLAN',
    sourceReference: 'MPS-2026-W32',
    productionPlant: 'Sohar Industrial Plant — Cleanroom Bay',
    supervisor: 'Eng. Said Al-Hajri',
    scheduledStartDate: '2026-07-20',
    scheduledEndDate: '2026-08-10',
    actualStartDate: '2026-07-20',
    actualEndDate: '2026-08-08',
    targetLotNumber: 'LOT-ACT-2026-041',
    totalStandardCostOMR: 8400.00,
    totalActualWipCostOMR: 8250.00,
    materialRequirements: [],
    operations: []
  },
  {
    id: 'wo-04',
    orderNumber: 'WO-2026-0084',
    productSku: 'FG-VALVE-API6D-12IN',
    productName: '12" Class 600 Forged Trunnion Ball Valve (API 6D / NACE MR0175)',
    bomId: 'bom-01',
    bomVersion: 'v2.2',
    plannedQuantity: 15,
    completedQuantity: 0,
    scrappedQuantity: 0,
    uom: 'PCS',
    priority: 'EMERGENCY_RUSH',
    status: 'RELEASED',
    sourceType: 'SALES_ORDER',
    sourceReference: 'SO-2026-0960',
    customerName: 'OXY Oman (Occidental of Oman Inc.)',
    productionPlant: 'Sohar Industrial Plant — Line A',
    supervisor: 'Khamis Al-Harthy',
    scheduledStartDate: '2026-08-22',
    scheduledEndDate: '2026-09-08',
    targetLotNumber: 'LOT-2026-VLV-084',
    totalStandardCostOMR: 20821.50,
    totalActualWipCostOMR: 0.00,
    materialRequirements: [],
    operations: []
  }
];

const INITIAL_SCHEDULE_SLOTS: WorkCenterScheduleSlot[] = [
  {
    id: 'slot-01',
    workCenterId: 'wc-01',
    workCenterName: 'Heavy CNC 5-Axis Milling & Turning',
    workOrderId: 'wo-01',
    workOrderNumber: 'WO-2026-0081',
    productName: '12" Valve Body Boring (Op 10)',
    operationStep: 10,
    operationName: '5-Axis CNC Rough & Finish Body Boring',
    startTime: '2026-08-20T08:00:00',
    endTime: '2026-08-20T16:00:00',
    durationHours: 8.0,
    colorTag: 'bg-indigo-600',
    isDowntime: false,
    operatorAssigned: 'Mahmood Al-Siyabi'
  },
  {
    id: 'slot-02',
    workCenterId: 'wc-02',
    workCenterName: 'Robotic & Submerged Arc Welding (SAW)',
    workOrderId: 'wo-01',
    workOrderNumber: 'WO-2026-0081',
    productName: 'Inconel 625 Cladding (Op 20)',
    operationStep: 20,
    operationName: 'Robotic Inconel 625 Seat Overlay Cladding',
    startTime: '2026-08-20T08:00:00',
    endTime: '2026-08-20T14:00:00',
    durationHours: 6.0,
    colorTag: 'bg-purple-600',
    isDowntime: false,
    operatorAssigned: 'Ali Al-Hinai'
  },
  {
    id: 'slot-03',
    workCenterId: 'wc-04',
    workCenterName: 'Precision Mechanical & Actuator Assembly',
    workOrderId: 'wo-01',
    workOrderNumber: 'WO-2026-0081',
    productName: 'Valve Assembly Rig (Op 40)',
    operationStep: 40,
    operationName: 'Trunnion Ball & Actuator Assembly',
    startTime: '2026-08-20T09:00:00',
    endTime: '2026-08-20T17:00:00',
    durationHours: 8.0,
    colorTag: 'bg-emerald-600',
    isDowntime: false,
    operatorAssigned: 'Said Al-Jabri'
  },
  {
    id: 'slot-04',
    workCenterId: 'wc-03',
    workCenterName: 'Surface Preparation & Thermal Spray Coating',
    workOrderId: 'wo-02',
    workOrderNumber: 'WO-2026-0082',
    productName: 'ASME Vessel Blast & Paint (Op 30)',
    operationStep: 30,
    operationName: 'External Grit Blasting & High-Temp Paint',
    startTime: '2026-08-20T10:00:00',
    endTime: '2026-08-20T15:00:00',
    durationHours: 5.0,
    colorTag: 'bg-amber-600',
    isDowntime: false,
    operatorAssigned: 'Murad Al-Zadjali'
  },
  {
    id: 'slot-05',
    workCenterId: 'wc-05',
    workCenterName: 'Hydrostatic, Cryogenic & NDT Testing Bay',
    workOrderId: 'wo-01',
    workOrderNumber: 'WO-2026-0081',
    productName: 'API 6D Hydrostatic Certification (Op 50)',
    operationStep: 50,
    operationName: 'Hydrostatic Shell & Dual Seat Testing',
    startTime: '2026-08-21T08:00:00',
    endTime: '2026-08-21T16:00:00',
    durationHours: 8.0,
    colorTag: 'bg-cyan-600',
    isDowntime: false,
    operatorAssigned: 'Tariq Al-Balushi'
  },
  {
    id: 'slot-06',
    workCenterId: 'wc-01',
    workCenterName: 'Heavy CNC 5-Axis Milling & Turning',
    workOrderId: 'pm-01',
    workOrderNumber: 'PM-CALIB-01',
    productName: 'Scheduled Spindle Laser Alignment & Calibration',
    operationStep: 0,
    operationName: 'Preventive Maintenance Spindle Audit',
    startTime: '2026-08-22T08:00:00',
    endTime: '2026-08-22T12:00:00',
    durationHours: 4.0,
    colorTag: 'bg-rose-700',
    isDowntime: true,
    downtimeReason: 'Renishaw Ballbar & Laser Geometric Verification',
    operatorAssigned: 'Maintenance Service Contractor'
  }
];

const INITIAL_PRODUCTION_RECEIPTS: ProductionReceiptVoucher[] = [
  {
    id: 'pr-01',
    receiptNumber: 'PR-2026-0092',
    workOrderId: 'wo-03',
    workOrderNumber: 'WO-2026-0083',
    productSku: 'SUB-ACTUATOR-HYD',
    productName: 'Scotch Yoke Heavy Hydraulic Actuator Module',
    receivedQuantity: 30,
    uom: 'PCS',
    lotBatchNumber: 'LOT-ACT-2026-041',
    manufactureDate: '2026-08-08',
    expiryDate: '2036-08-08',
    targetWarehouse: 'Sohar Central Finished Goods Warehouse (WH-SOHAR)',
    targetBinLocation: 'ZONE-A / AISLE-02 / BIN-A02-04',
    inspectedBy: 'Eng. Tariq Al-Balushi (Lead QA/QC)',
    qcReleaseStatus: 'RELEASED_PRIME',
    unitCostOMR: 275.00,
    totalInventoryValuationOMR: 8250.00,
    receivedDate: '2026-08-08',
    createdByName: 'Said Al-Rawahi'
  },
  {
    id: 'pr-02',
    receiptNumber: 'PR-2026-0093',
    workOrderId: 'wo-01',
    workOrderNumber: 'WO-2026-0081',
    productSku: 'FG-VALVE-API6D-12IN',
    productName: '12" Class 600 Forged Trunnion Ball Valve (API 6D / NACE MR0175)',
    receivedQuantity: 8,
    uom: 'PCS',
    lotBatchNumber: 'LOT-2026-VLV-081-A',
    manufactureDate: '2026-08-16',
    expiryDate: '2046-08-16',
    targetWarehouse: 'Sohar Central Finished Goods Warehouse (WH-SOHAR)',
    targetBinLocation: 'ZONE-B / AISLE-01 / BIN-B01-01',
    inspectedBy: 'PDO Third Party Inspector (Bureau Veritas)',
    qcReleaseStatus: 'RELEASED_PRIME',
    unitCostOMR: 1395.00,
    totalInventoryValuationOMR: 11160.00,
    receivedDate: '2026-08-16',
    createdByName: 'Said Al-Rawahi'
  }
];

const INITIAL_SCRAP_RECORDS: ScrapRecord[] = [
  {
    id: 'scrap-01',
    scrapVoucherNumber: 'SCRAP-2026-0033',
    workOrderId: 'wo-01',
    workOrderNumber: 'WO-2026-0081',
    productSku: 'FG-VALVE-API6D-12IN',
    productName: '12" Valve Body Seat Ring Sub-Component',
    operationStep: 20,
    operationName: 'Robotic Inconel 625 Seat Overlay Cladding',
    workCenterName: 'Robotic & Submerged Arc Welding (SAW)',
    scrappedQuantity: 1,
    uom: 'PCS',
    reasonCode: 'THERMAL_DISTORTION',
    defectDescription: 'Excessive thermal heat input during cladding pass 3 caused 0.8mm out-of-roundness ovality exceeding ASME machining tolerance.',
    rootCauseAnalysis: 'Why 1: Out-of-roundness on seat bore. Why 2: Localized overheating. Why 3: Shielding gas flow sensor pulsed intermittently. Why 4: Solenoid valve stuck. Why 5: Lack of scheduled pre-shift flow calibration check.',
    estimatedScrapValueLossOMR: 380.00,
    correctiveActionTaken: 'Replaced gas solenoid flow regulator and added digital pre-pass flow interlock to KUKA robot PLC controller.',
    recordedBy: 'Ali Al-Hinai (Welding Supervisor)',
    recordedDate: '2026-08-09',
    disposition: 'SCRAP_RECYCLE'
  },
  {
    id: 'scrap-02',
    scrapVoucherNumber: 'SCRAP-2026-0034',
    workOrderId: 'wo-02',
    workOrderNumber: 'WO-2026-0082',
    productSku: 'FG-VESSEL-HP-3000L',
    productName: 'Nozzle Flange Forging N3',
    operationStep: 20,
    operationName: 'Submerged Arc Welding (SAW) Circumferential Seams & Nozzles',
    workCenterName: 'Robotic & Submerged Arc Welding (SAW)',
    scrappedQuantity: 1,
    uom: 'PCS',
    reasonCode: 'RAW_MATERIAL_FLAW',
    defectDescription: 'Sub-surface laminar inclusion detected during 100% Radiographic Testing (RT) of nozzle neck forging.',
    rootCauseAnalysis: 'Material defect originated from raw forging supplier ingot casting stage. NDT certificate vendor claim initiated.',
    estimatedScrapValueLossOMR: 240.00,
    correctiveActionTaken: 'Material rejected under Supplier Warranty Claim NCR-2026-044; replacement forging expedited free of charge.',
    recordedBy: 'Eng. Salim Al-Maskari',
    recordedDate: '2026-08-12',
    disposition: 'REWORK_SECONDARY'
  }
];

const INITIAL_BY_PRODUCTS: ByProductReceipt[] = [
  {
    id: 'byp-rec-01',
    byProductNumber: 'BYP-2026-0015',
    workOrderId: 'wo-01',
    workOrderNumber: 'WO-2026-0081',
    itemCode: 'SCRAP-STEEL-SWARF',
    itemName: 'Recyclable ASTM A105 High-Density Steel Machining Swarf',
    quantityProduced: 420.0,
    uom: 'KG',
    allocatedUnitValueOMR: 0.28,
    totalCreditedValueOMR: 117.60,
    targetWarehouse: 'Sohar Scrap & Recycling Yard',
    targetBin: 'BIN-RECYCLE-STEEL-01',
    loggedDate: '2026-08-14'
  }
];

const INITIAL_COST_SHEETS: ProductionCostSheet[] = [
  {
    id: 'cost-01',
    workOrderId: 'wo-03',
    workOrderNumber: 'WO-2026-0083',
    productSku: 'SUB-ACTUATOR-HYD',
    productName: 'Scotch Yoke Heavy Hydraulic Actuator Module',
    producedQuantity: 30,
    uom: 'PCS',
    standardUnitCostOMR: 280.00,
    actualUnitCostOMR: 275.00,
    totalStandardCostOMR: 8400.00,
    totalActualCostOMR: 8250.00,
    netVarianceOMR: -150.00, // 150 OMR Favorable
    netVarianceType: 'FAVORABLE',
    costItems: [
      {
        category: 'DIRECT_MATERIAL',
        categoryLabel: 'Direct Raw Materials',
        standardCostOMR: 6300.00,
        actualCostOMR: 6240.00,
        varianceOMR: -60.00,
        variancePct: -0.95,
        type: 'FAVORABLE',
        explanation: 'Favorable bulk procurement discount on seamless honed tubes.'
      },
      {
        category: 'DIRECT_LABOR',
        categoryLabel: 'Direct Shop Floor Labor',
        standardCostOMR: 611.40,
        actualCostOMR: 580.00,
        varianceOMR: -31.40,
        variancePct: -5.14,
        type: 'FAVORABLE',
        explanation: 'Assembly cycle times reduced by 12% due to improved tooling jigs.'
      },
      {
        category: 'MACHINE_OVERHEAD',
        categoryLabel: 'Machine Operating & Energy Overhead',
        standardCostOMR: 1020.00,
        actualCostOMR: 980.00,
        varianceOMR: -40.00,
        variancePct: -3.92,
        type: 'FAVORABLE',
        explanation: 'Lower CNC spindle cycle runtime.'
      },
      {
        category: 'FACTORY_BURDEN',
        categoryLabel: 'General Plant Fixed Burden',
        standardCostOMR: 468.60,
        actualCostOMR: 450.00,
        varianceOMR: -18.60,
        variancePct: -3.97,
        type: 'FAVORABLE',
        explanation: 'Factory overhead absorbed across higher monthly volume.'
      }
    ],
    materialPriceVarianceOMR: -45.00,
    materialUsageVarianceOMR: -15.00,
    laborRateVarianceOMR: 0.00,
    laborEfficiencyVarianceOMR: -31.40,
    machineSpendingVarianceOMR: -25.00,
    machineEfficiencyVarianceOMR: -15.00,
    glJournalVoucherRef: 'JV-2026-MFG-0089',
    closedDate: '2026-08-10'
  }
];

const INITIAL_FORECASTS: ProductionForecast[] = [
  {
    id: 'fc-01',
    forecastCode: 'FC-2026-VLV-12',
    productSku: 'FG-VALVE-API6D-12IN',
    productName: '12" Class 600 Forged Trunnion Ball Valve (API 6D)',
    planningYear: 2026,
    baselineSafetyStockUnits: 8,
    leadTimeDays: 28,
    confidenceScorePct: 94.2,
    generatedByAi: true,
    buckets: [
      { month: '2026-08', monthName: 'Aug 2026', salesForecastUnits: 25, confirmedOrdersUnits: 20, totalDemandUnits: 25, plannedProductionUnits: 30, projectedEndingInventoryUnits: 13 },
      { month: '2026-09', monthName: 'Sep 2026', salesForecastUnits: 30, confirmedOrdersUnits: 18, totalDemandUnits: 30, plannedProductionUnits: 28, projectedEndingInventoryUnits: 11 },
      { month: '2026-10', monthName: 'Oct 2026', salesForecastUnits: 35, confirmedOrdersUnits: 12, totalDemandUnits: 35, plannedProductionUnits: 35, projectedEndingInventoryUnits: 11 },
      { month: '2026-11', monthName: 'Nov 2026', salesForecastUnits: 40, confirmedOrdersUnits: 8, totalDemandUnits: 40, plannedProductionUnits: 40, projectedEndingInventoryUnits: 11 },
      { month: '2026-12', monthName: 'Dec 2026', salesForecastUnits: 30, confirmedOrdersUnits: 5, totalDemandUnits: 30, plannedProductionUnits: 30, projectedEndingInventoryUnits: 11 },
      { month: '2027-01', monthName: 'Jan 2027', salesForecastUnits: 25, confirmedOrdersUnits: 0, totalDemandUnits: 25, plannedProductionUnits: 25, projectedEndingInventoryUnits: 11 }
    ]
  }
];

const INITIAL_MPS_PLANS: MasterProductionScheduleItem[] = [
  {
    id: 'mps-01',
    mpsCode: 'MPS-2026-W34-01',
    productSku: 'FG-VALVE-API6D-12IN',
    productName: '12" Class 600 Forged Trunnion Ball Valve',
    planWeek: '2026-W34',
    targetDate: '2026-08-25',
    plannedBatchQuantity: 20,
    uom: 'PCS',
    priority: 'HIGH',
    status: 'COMMITTED',
    assignedLine: 'Sohar Plant — Line A',
    workCenterDemandHours: {
      'wc-01': 60.0,
      'wc-02': 30.0,
      'wc-03': 20.0,
      'wc-04': 40.0,
      'wc-05': 30.0
    }
  },
  {
    id: 'mps-02',
    mpsCode: 'MPS-2026-W35-02',
    productSku: 'FG-VESSEL-HP-3000L',
    productName: '3,000L High-Pressure Separator Vessel',
    planWeek: '2026-W35',
    targetDate: '2026-08-30',
    plannedBatchQuantity: 2,
    uom: 'UNIT',
    priority: 'HIGH',
    status: 'FIRM_PLANNED',
    assignedLine: 'Sohar Plant — Bay 2',
    workCenterDemandHours: {
      'wc-01': 12.0,
      'wc-02': 24.0,
      'wc-03': 6.0,
      'wc-05': 8.0
    }
  },
  {
    id: 'mps-03',
    mpsCode: 'MPS-2026-W36-03',
    productSku: 'FG-VALVE-API6D-12IN',
    productName: '12" Class 600 Forged Trunnion Ball Valve',
    planWeek: '2026-W36',
    targetDate: '2026-09-08',
    plannedBatchQuantity: 15,
    uom: 'PCS',
    priority: 'EMERGENCY_RUSH',
    status: 'FIRM_PLANNED',
    assignedLine: 'Sohar Plant — Line A',
    workCenterDemandHours: {
      'wc-01': 45.0,
      'wc-02': 22.5,
      'wc-03': 15.0,
      'wc-04': 30.0,
      'wc-05': 22.5
    }
  }
];

// ==========================================
// CONTEXT INTERFACE
// ==========================================

interface ManufacturingContextType {
  boms: BillOfMaterials[];
  workCenters: WorkCenter[];
  workOrders: WorkOrder[];
  scheduleSlots: WorkCenterScheduleSlot[];
  productionReceipts: ProductionReceiptVoucher[];
  scrapRecords: ScrapRecord[];
  byProducts: ByProductReceipt[];
  costSheets: ProductionCostSheet[];
  costSummary: {
    materialStandardCostOMR: number;
    materialActualCostOMR: number;
    laborStandardCostOMR: number;
    laborActualCostOMR: number;
    machineStandardCostOMR: number;
    machineActualCostOMR: number;
    totalStandardCostOMR: number;
    totalActualCostOMR: number;
    totalVarianceOMR: number;
    variancePercentage: number;
  };
  forecasts: ProductionForecast[];
  mpsPlans: MasterProductionScheduleItem[];
  stats: ManufacturingExecutiveStats;

  // Actions
  addBom: (bom: Omit<BillOfMaterials, 'id' | 'createdAt' | 'updatedAt'>) => BillOfMaterials;
  updateBom: (id: string, updates: Partial<BillOfMaterials>) => void;
  createWorkOrder: (order: Omit<WorkOrder, 'id' | 'orderNumber' | 'completedQuantity' | 'scrappedQuantity'>) => WorkOrder;
  updateWorkOrderStatus: (id: string, status: WorkOrderStatus) => void;
  updateWorkOrderOperation: (workOrderId: string, stepNumber: number, updates: any) => void;
  issueMaterialsToWorkOrder: (issue: Omit<MaterialIssueVoucher, 'id' | 'voucherNumber'>) => MaterialIssueVoucher;
  returnMaterialsFromWorkOrder: (ret: Omit<MaterialReturnVoucher, 'id' | 'returnVoucherNumber'>) => MaterialReturnVoucher;
  recordProductionReceipt: (receipt: Omit<ProductionReceiptVoucher, 'id' | 'receiptNumber'>) => ProductionReceiptVoucher;
  logScrapDefect: (scrap: Omit<ScrapRecord, 'id' | 'scrapVoucherNumber'>) => ScrapRecord;
  logByProduct: (byp: Omit<ByProductReceipt, 'id' | 'byProductNumber'>) => ByProductReceipt;
  updateWorkCenter: (id: string, updates: Partial<WorkCenter>) => void;
  addScheduleSlot: (slot: Omit<WorkCenterScheduleSlot, 'id'>) => WorkCenterScheduleSlot;
  deleteScheduleSlot: (id: string) => void;
  runMrpSimulation: (mpsIds: string[]) => MrpRequirementLine[];
  resetToDefaultData: () => void;
}

const ManufacturingContext = createContext<ManufacturingContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'artify_erp_manufacturing_state_v1';

export const ManufacturingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from LocalStorage if available
  const [boms, setBoms] = useState<BillOfMaterials[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_boms`);
      return saved ? JSON.parse(saved) : INITIAL_BOMS;
    } catch {
      return INITIAL_BOMS;
    }
  });

  const [workCenters, setWorkCenters] = useState<WorkCenter[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_workCenters`);
      return saved ? JSON.parse(saved) : INITIAL_WORK_CENTERS;
    } catch {
      return INITIAL_WORK_CENTERS;
    }
  });

  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_workOrders`);
      return saved ? JSON.parse(saved) : INITIAL_WORK_ORDERS;
    } catch {
      return INITIAL_WORK_ORDERS;
    }
  });

  const [scheduleSlots, setScheduleSlots] = useState<WorkCenterScheduleSlot[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_scheduleSlots`);
      return saved ? JSON.parse(saved) : INITIAL_SCHEDULE_SLOTS;
    } catch {
      return INITIAL_SCHEDULE_SLOTS;
    }
  });

  const [productionReceipts, setProductionReceipts] = useState<ProductionReceiptVoucher[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_receipts`);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTION_RECEIPTS;
    } catch {
      return INITIAL_PRODUCTION_RECEIPTS;
    }
  });

  const [scrapRecords, setScrapRecords] = useState<ScrapRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_scrap`);
      return saved ? JSON.parse(saved) : INITIAL_SCRAP_RECORDS;
    } catch {
      return INITIAL_SCRAP_RECORDS;
    }
  });

  const [byProducts, setByProducts] = useState<ByProductReceipt[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_byProducts`);
      return saved ? JSON.parse(saved) : INITIAL_BY_PRODUCTS;
    } catch {
      return INITIAL_BY_PRODUCTS;
    }
  });

  const [costSheets, setCostSheets] = useState<ProductionCostSheet[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_costSheets`);
      return saved ? JSON.parse(saved) : INITIAL_COST_SHEETS;
    } catch {
      return INITIAL_COST_SHEETS;
    }
  });

  const [forecasts] = useState<ProductionForecast[]>(INITIAL_FORECASTS);
  const [mpsPlans] = useState<MasterProductionScheduleItem[]>(INITIAL_MPS_PLANS);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_boms`, JSON.stringify(boms));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_workCenters`, JSON.stringify(workCenters));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_workOrders`, JSON.stringify(workOrders));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_scheduleSlots`, JSON.stringify(scheduleSlots));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_receipts`, JSON.stringify(productionReceipts));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_scrap`, JSON.stringify(scrapRecords));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_byProducts`, JSON.stringify(byProducts));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_costSheets`, JSON.stringify(costSheets));
    } catch (e) {
      console.error('Failed to sync manufacturing state to LocalStorage', e);
    }
  }, [boms, workCenters, workOrders, scheduleSlots, productionReceipts, scrapRecords, byProducts, costSheets]);

  // Dynamic Statistics
  const stats: ManufacturingExecutiveStats = useMemo(() => {
    const active = workOrders.filter((w) => w.status !== 'CLOSED' && w.status !== 'CANCELLED');
    const inProgress = workOrders.filter((w) => w.status === 'IN_PROGRESS');
    const released = workOrders.filter((w) => w.status === 'RELEASED');
    const completed = workOrders.filter((w) => w.status === 'COMPLETED');

    const totalWip = inProgress.reduce((sum, w) => sum + (w.totalActualWipCostOMR || w.totalStandardCostOMR * 0.7), 0);
    const finishedValue = productionReceipts.reduce((sum, r) => sum + r.totalInventoryValuationOMR, 0);

    const totalScrapLoss = scrapRecords.reduce((sum, s) => sum + s.estimatedScrapValueLossOMR, 0);
    const totalVolume = workOrders.reduce((sum, w) => sum + w.completedQuantity, 0);
    const totalScrapQty = workOrders.reduce((sum, w) => sum + w.scrappedQuantity, 0);
    const scrapRate = totalVolume + totalScrapQty > 0 ? (totalScrapQty / (totalVolume + totalScrapQty)) * 100 : 1.2;

    const avgOee = workCenters.reduce((sum, wc) => sum + wc.oeeOverallPct, 0) / (workCenters.length || 1);
    const avgUtil = 84.6; // average capacity utilization

    return {
      activeWorkOrdersCount: active.length,
      workOrdersInProgress: inProgress.length,
      workOrdersReleased: released.length,
      workOrdersCompletedMTD: completed.length,
      monthlyProductionVolumeUnits: totalVolume + 45,
      plantCapacityUtilizationPct: avgUtil,
      overallEquipmentEffectivenessPct: parseFloat(avgOee.toFixed(1)),
      totalWipValuationOMR: totalWip,
      finishedGoodsProducedValueOMR: finishedValue,
      totalProductionVarianceOMR: -480.00, // 480 OMR Favorable
      scrapRatePercentage: parseFloat(scrapRate.toFixed(2)),
      scheduledDowntimeHoursThisWeek: 4.0,
      activeWorkCentersCount: workCenters.filter((w) => w.status === 'OPERATIONAL').length
    };
  }, [workOrders, productionReceipts, scrapRecords, workCenters]);

  // Actions
  const addBom = (bomData: Omit<BillOfMaterials, 'id' | 'createdAt' | 'updatedAt'>): BillOfMaterials => {
    const id = `bom-${Date.now()}`;
    const now = new Date().toISOString().split('T')[0];
    const newBom: BillOfMaterials = {
      ...bomData,
      id,
      createdAt: now,
      updatedAt: now
    };
    setBoms((prev) => [newBom, ...prev]);
    return newBom;
  };

  const updateBom = (id: string, updates: Partial<BillOfMaterials>) => {
    setBoms((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : b))
    );
  };

  const createWorkOrder = (
    orderData: Omit<WorkOrder, 'id' | 'orderNumber' | 'completedQuantity' | 'scrappedQuantity'>
  ): WorkOrder => {
    const seq = workOrders.length + 85;
    const orderNumber = `WO-2026-00${seq}`;
    const id = `wo-${Date.now()}`;

    const newOrder: WorkOrder = {
      ...orderData,
      id,
      orderNumber,
      completedQuantity: 0,
      scrappedQuantity: 0,
      totalActualWipCostOMR: 0
    };

    setWorkOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateWorkOrderStatus = (id: string, status: WorkOrderStatus) => {
    setWorkOrders((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const updates: Partial<WorkOrder> = { status };
          if (status === 'IN_PROGRESS' && !w.actualStartDate) {
            updates.actualStartDate = new Date().toISOString().split('T')[0];
          }
          if (status === 'COMPLETED' && !w.actualEndDate) {
            updates.actualEndDate = new Date().toISOString().split('T')[0];
          }
          return { ...w, ...updates };
        }
        return w;
      })
    );
  };

  const updateWorkOrderOperation = (workOrderId: string, stepNumber: number, updates: any) => {
    setWorkOrders((prev) =>
      prev.map((w) => {
        if (w.id === workOrderId) {
          const updatedOps = w.operations.map((op) => (op.stepNumber === stepNumber ? { ...op, ...updates } : op));
          return { ...w, operations: updatedOps };
        }
        return w;
      })
    );
  };

  const issueMaterialsToWorkOrder = (issueData: Omit<MaterialIssueVoucher, 'id' | 'voucherNumber'>): MaterialIssueVoucher => {
    const seq = Math.floor(mockRandom() * 800) + 100;
    const voucherNumber = `MIV-2026-0${seq}`;
    const voucher: MaterialIssueVoucher = {
      ...issueData,
      id: `miv-${Date.now()}`,
      voucherNumber
    };

    // Update work order material lines and WIP cost
    setWorkOrders((prev) =>
      prev.map((wo) => {
        if (wo.id === issueData.workOrderId) {
          const updatedReqs = wo.materialRequirements.map((req) => {
            const issuedItem = issueData.items.find((i) => i.itemCode === req.itemCode);
            if (issuedItem) {
              const newIssuedQty = req.issuedQty + issuedItem.issuedQty;
              return {
                ...req,
                issuedQty: newIssuedQty,
                isFullyIssued: newIssuedQty >= req.requiredQty,
                totalIssuedValueOMR: newIssuedQty * req.unitCostOMR
              };
            }
            return req;
          });

          return {
            ...wo,
            materialRequirements: updatedReqs,
            totalActualWipCostOMR: (wo.totalActualWipCostOMR || 0) + issueData.totalValueOMR
          };
        }
        return wo;
      })
    );

    return voucher;
  };

  const returnMaterialsFromWorkOrder = (
    retData: Omit<MaterialReturnVoucher, 'id' | 'returnVoucherNumber'>
  ): MaterialReturnVoucher => {
    const seq = Math.floor(mockRandom() * 800) + 100;
    const returnVoucherNumber = `MRV-2026-0${seq}`;
    const voucher: MaterialReturnVoucher = {
      ...retData,
      id: `mrv-${Date.now()}`,
      returnVoucherNumber
    };

    // Deduct from WO WIP cost
    setWorkOrders((prev) =>
      prev.map((wo) => {
        if (wo.id === retData.workOrderId) {
          const updatedReqs = wo.materialRequirements.map((req) => {
            const returnedItem = retData.items.find((i) => i.itemCode === req.itemCode);
            if (returnedItem) {
              const newRetQty = req.returnedQty + returnedItem.returnedQty;
              return {
                ...req,
                returnedQty: newRetQty,
                totalIssuedValueOMR: Math.max(0, req.totalIssuedValueOMR - returnedItem.totalCreditValueOMR)
              };
            }
            return req;
          });

          return {
            ...wo,
            materialRequirements: updatedReqs,
            totalActualWipCostOMR: Math.max(0, (wo.totalActualWipCostOMR || 0) - retData.totalCreditValueOMR)
          };
        }
        return wo;
      })
    );

    return voucher;
  };

  const recordProductionReceipt = (
    receiptData: Omit<ProductionReceiptVoucher, 'id' | 'receiptNumber'>
  ): ProductionReceiptVoucher => {
    const seq = productionReceipts.length + 94;
    const receiptNumber = `PR-2026-00${seq}`;
    const newReceipt: ProductionReceiptVoucher = {
      ...receiptData,
      id: `pr-${Date.now()}`,
      receiptNumber
    };

    setProductionReceipts((prev) => [newReceipt, ...prev]);

    // Update completed quantity on Work Order
    setWorkOrders((prev) =>
      prev.map((wo) => {
        if (wo.id === receiptData.workOrderId) {
          const newCompleted = wo.completedQuantity + receiptData.receivedQuantity;
          const isFinished = newCompleted >= wo.plannedQuantity;
          return {
            ...wo,
            completedQuantity: newCompleted,
            status: isFinished ? 'COMPLETED' : wo.status
          };
        }
        return wo;
      })
    );

    return newReceipt;
  };

  const logScrapDefect = (scrapData: Omit<ScrapRecord, 'id' | 'scrapVoucherNumber'>): ScrapRecord => {
    const seq = scrapRecords.length + 35;
    const scrapVoucherNumber = `SCRAP-2026-00${seq}`;
    const newScrap: ScrapRecord = {
      ...scrapData,
      id: `scrap-${Date.now()}`,
      scrapVoucherNumber
    };

    setScrapRecords((prev) => [newScrap, ...prev]);

    // Increment scrapped quantity on Work Order
    setWorkOrders((prev) =>
      prev.map((wo) => {
        if (wo.id === scrapData.workOrderId) {
          return {
            ...wo,
            scrappedQuantity: wo.scrappedQuantity + scrapData.scrappedQuantity
          };
        }
        return wo;
      })
    );

    return newScrap;
  };

  const logByProduct = (bypData: Omit<ByProductReceipt, 'id' | 'byProductNumber'>): ByProductReceipt => {
    const seq = byProducts.length + 16;
    const byProductNumber = `BYP-2026-00${seq}`;
    const newByProduct: ByProductReceipt = {
      ...bypData,
      id: `byp-${Date.now()}`,
      byProductNumber
    };

    setByProducts((prev) => [newByProduct, ...prev]);
    return newByProduct;
  };

  const updateWorkCenter = (id: string, updates: Partial<WorkCenter>) => {
    setWorkCenters((prev) => prev.map((wc) => (wc.id === id ? { ...wc, ...updates } : wc)));
  };

  const addScheduleSlot = (slotData: Omit<WorkCenterScheduleSlot, 'id'>): WorkCenterScheduleSlot => {
    const newSlot: WorkCenterScheduleSlot = {
      ...slotData,
      id: `slot-${Date.now()}`
    };
    setScheduleSlots((prev) => [...prev, newSlot]);
    return newSlot;
  };

  const deleteScheduleSlot = (id: string) => {
    setScheduleSlots((prev) => prev.filter((s) => s.id !== id));
  };

  const runMrpSimulation = (mpsIds: string[]): MrpRequirementLine[] => {
    const selectedMps = mpsPlans.filter((m) => mpsIds.includes(m.id));
    const requirementMap: Record<string, MrpRequirementLine> = {};

    selectedMps.forEach((plan) => {
      const bom = boms.find((b) => b.productSku === plan.productSku) || boms[0];
      if (!bom) return;

      bom.components.forEach((comp) => {
        const grossQty = comp.quantityPerUnit * plan.plannedBatchQuantity * (1 + comp.scrapAllowancePct / 100);
        const onHand = comp.itemCode.includes('BODY') ? 14 : comp.itemCode.includes('BALL') ? 18 : 35;
        const allocated = comp.itemCode.includes('BODY') ? 20 : comp.itemCode.includes('BALL') ? 20 : 40;
        const scheduledReceipts = comp.itemCode.includes('BODY') ? 10 : 0;
        const freeStock = Math.max(0, onHand - allocated);
        const netQty = Math.max(0, grossQty - freeStock - scheduledReceipts);

        if (!requirementMap[comp.itemCode]) {
          requirementMap[comp.itemCode] = {
            id: `mrp-${comp.itemCode}`,
            materialSku: comp.itemCode,
            materialName: comp.itemName,
            uom: comp.uom,
            isPurchased: !comp.isSubAssembly,
            currentStockOnHand: onHand,
            allocatedInWip: allocated,
            freeAvailableStock: freeStock,
            grossRequirement: Math.ceil(grossQty),
            scheduledReceipts,
            netRequirement: Math.ceil(netQty),
            leadTimeDays: comp.isSubAssembly ? 7 : 21,
            recommendedOrderQuantity: Math.ceil(netQty > 0 ? Math.max(netQty, 10) : 0),
            suggestedAction:
              netQty <= 0
                ? 'STOCK_SUFFICIENT'
                : comp.isSubAssembly
                ? 'GENERATE_SUB_WORK_ORDER'
                : 'GENERATE_PURCHASE_REQUISITION',
            actionStatus: 'PENDING'
          };
        } else {
          requirementMap[comp.itemCode].grossRequirement += Math.ceil(grossQty);
          requirementMap[comp.itemCode].netRequirement += Math.ceil(netQty);
        }
      });
    });

    return Object.values(requirementMap);
  };

  const resetToDefaultData = () => {
    setBoms(INITIAL_BOMS);
    setWorkCenters(INITIAL_WORK_CENTERS);
    setWorkOrders(INITIAL_WORK_ORDERS);
    setScheduleSlots(INITIAL_SCHEDULE_SLOTS);
    setProductionReceipts(INITIAL_PRODUCTION_RECEIPTS);
    setScrapRecords(INITIAL_SCRAP_RECORDS);
    setByProducts(INITIAL_BY_PRODUCTS);
    setCostSheets(INITIAL_COST_SHEETS);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_boms`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_workCenters`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_workOrders`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_scheduleSlots`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_receipts`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_scrap`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_byProducts`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_costSheets`);
  };

  return (
    <ManufacturingContext.Provider
      value={{
        boms,
        workCenters,
        workOrders,
        scheduleSlots,
        productionReceipts,
        scrapRecords,
        byProducts,
        costSheets,
        costSummary: (() => {
          const sumBy = (cat: CostBreakdownItem['category'], key: 'standardCostOMR' | 'actualCostOMR') =>
            costSheets.reduce(
              (acc, sheet) => acc + sheet.costItems.filter((i) => i.category === cat).reduce((a, i) => a + i[key], 0),
              0
            );
          const totalStd = costSheets.reduce((a, c) => a + c.totalStandardCostOMR, 0);
          const totalAct = costSheets.reduce((a, c) => a + c.totalActualCostOMR, 0);
          return {
            materialStandardCostOMR: sumBy('DIRECT_MATERIAL', 'standardCostOMR'),
            materialActualCostOMR: sumBy('DIRECT_MATERIAL', 'actualCostOMR'),
            laborStandardCostOMR: sumBy('DIRECT_LABOR', 'standardCostOMR'),
            laborActualCostOMR: sumBy('DIRECT_LABOR', 'actualCostOMR'),
            machineStandardCostOMR: sumBy('MACHINE_OVERHEAD', 'standardCostOMR'),
            machineActualCostOMR: sumBy('MACHINE_OVERHEAD', 'actualCostOMR'),
            totalStandardCostOMR: totalStd,
            totalActualCostOMR: totalAct,
            totalVarianceOMR: totalAct - totalStd,
            variancePercentage: totalStd ? ((totalAct - totalStd) / totalStd) * 100 : 0
          };
        })(),
        forecasts,
        mpsPlans,
        stats,
        addBom,
        updateBom,
        createWorkOrder,
        updateWorkOrderStatus,
        updateWorkOrderOperation,
        issueMaterialsToWorkOrder,
        returnMaterialsFromWorkOrder,
        recordProductionReceipt,
        logScrapDefect,
        logByProduct,
        updateWorkCenter,
        addScheduleSlot,
        deleteScheduleSlot,
        runMrpSimulation,
        resetToDefaultData
      }}
    >
      {children}
    </ManufacturingContext.Provider>
  );
};

export const useManufacturingStore = () => {
  const context = useContext(ManufacturingContext);
  if (!context) {
    throw new Error('useManufacturingStore must be used within a ManufacturingProvider');
  }
  return context;
};
