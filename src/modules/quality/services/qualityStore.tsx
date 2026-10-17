// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 14: QUALITY MANAGEMENT (QMS)
// Central Store & React Context
// ==========================================

import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  QualityStandard,
  QualityPolicy,
  QualitySpecification,
  QualityPlan,
  InspectionPlan,
  QualityChecklist,
  SamplingPlan,
  InspectionRecord,
  MaterialTestReport,
  NonConformanceReport,
  DefectClassification,
  CAPARecord,
  FMEARiskEntry,
  QualityAudit,
  SupplierQualityScorecard,
  QualityCertificate,
  QualityKPIs,
  QualityAIInsight,
  NCRStatus,
  MRBDisposition,
  CAPAStatus
} from '../types/qualityTypes';

// Initial Mock Data: 14.01 Standards & Specifications
const initialStandards: QualityStandard[] = [
  {
    id: 'STD-001',
    code: 'ISO-9001:2015',
    name: 'Quality Management Systems — Requirements',
    category: 'ISO',
    version: '2015 Rev 3',
    effectiveDate: '2024-01-01',
    reviewCycleMonths: 12,
    nextReviewDate: '2025-01-01',
    ownerDepartment: 'Quality Assurance & Compliance',
    status: 'COMPLIANT',
    clausesCount: 10,
    description: 'Mandatory standard governing operational consistency, risk-based thinking, and customer satisfaction.',
    certificationBody: 'Bureau Veritas',
    certificateExpiry: '2027-04-30'
  },
  {
    id: 'STD-002',
    code: 'ASTM-A36/A36M',
    name: 'Standard Specification for Carbon Structural Steel',
    category: 'ASTM',
    version: '2023 Edition',
    effectiveDate: '2023-06-15',
    reviewCycleMonths: 24,
    nextReviewDate: '2025-06-15',
    ownerDepartment: 'Materials Engineering',
    status: 'COMPLIANT',
    clausesCount: 14,
    description: 'Covers carbon steel shapes, plates, and bars of structural quality for use in riveted, bolted, or welded construction.'
  },
  {
    id: 'STD-003',
    code: 'API-SPEC-Q1',
    name: 'Specification for Quality Management System in Petroleum and Gas',
    category: 'API',
    version: '10th Edition',
    effectiveDate: '2024-03-01',
    reviewCycleMonths: 12,
    nextReviewDate: '2025-03-01',
    ownerDepartment: 'Oil & Gas Fabrications',
    status: 'COMPLIANT',
    clausesCount: 22,
    description: 'Strict specification for manufacturing organizations in the upstream energy sector.'
  },
  {
    id: 'STD-004',
    code: 'ISO-14001:2015',
    name: 'Environmental Management Systems',
    category: 'ISO',
    version: '2015 Rev 2',
    effectiveDate: '2023-09-01',
    reviewCycleMonths: 12,
    nextReviewDate: '2024-09-01',
    ownerDepartment: 'HSE & QA',
    status: 'NEEDS_REVIEW',
    clausesCount: 10,
    description: 'Standard for resource efficiency, waste reduction, and measurement of environmental impact.'
  }
];

const initialPolicies: QualityPolicy[] = [
  {
    id: 'POL-001',
    code: 'POL-QMS-01',
    title: 'Zero Defect Quality Charter',
    scope: 'Enterprise-wide manufacturing, engineering, and logistics facilities',
    targetObjective: 'Maintain First Pass Yield > 98.5% and Customer Defect PPM < 150',
    currentScorePct: 98.6,
    approvedBy: 'Dr. Tariq Al-Busaidi (Chief Operating Officer)',
    approvalDate: '2024-01-15',
    revisionNumber: 'Rev 4.0',
    mandatoryDepartments: ['Production', 'Warehouse', 'Procurement', 'Project QA/QC'],
    status: 'ACTIVE'
  },
  {
    id: 'POL-002',
    code: 'POL-QMS-02',
    title: 'Incoming Supplier Quality & Batch Traceability Policy',
    scope: 'All external raw material, hardware, and subcontracted component procurements',
    targetObjective: '100% CoA compliance and maximum 24h quarantine turnaround',
    currentScorePct: 96.2,
    approvedBy: 'Eng. Salem Al-Kiyumi (Head of Quality)',
    approvalDate: '2024-02-10',
    revisionNumber: 'Rev 2.1',
    mandatoryDepartments: ['Procurement', 'Receiving Inspection', 'Inventory'],
    status: 'ACTIVE'
  }
];

const initialSpecifications: QualitySpecification[] = [
  {
    id: 'SPEC-001',
    code: 'SPEC-STL-316L',
    itemCode: 'RM-STL-316L-PLT',
    itemName: 'Stainless Steel Plate 316L (12mm)',
    category: 'RAW_MATERIAL',
    revision: 'Rev C',
    effectiveDate: '2024-01-01',
    samplingStandard: 'ISO 2859-1 Level II',
    aqlLevel: '0.65 Normal',
    approvedBy: 'Senior Metallurgist',
    status: 'ACTIVE',
    parameters: [
      {
        id: 'p1',
        name: 'Tensile Strength',
        unit: 'MPa',
        targetNominal: 550,
        lowerSpecLimit: 485,
        upperSpecLimit: 620,
        toleranceType: 'BILATERAL',
        testMethod: 'ASTM E8 / E8M Tensile Test',
        criticality: 'CRITICAL_TO_QUALITY'
      },
      {
        id: 'p2',
        name: 'Thickness Uniformity',
        unit: 'mm',
        targetNominal: 12.0,
        lowerSpecLimit: 11.75,
        upperSpecLimit: 12.25,
        toleranceType: 'BILATERAL',
        testMethod: 'Digital Ultrasonic Micrometer 5-Point',
        criticality: 'MAJOR'
      },
      {
        id: 'p3',
        name: 'Carbon (C) Content',
        unit: '%',
        targetNominal: 0.02,
        lowerSpecLimit: 0.0,
        upperSpecLimit: 0.03,
        toleranceType: 'UNILATERAL_MAX',
        testMethod: 'Optical Emission Spectroscopy (OES)',
        criticality: 'CRITICAL_TO_QUALITY'
      }
    ]
  },
  {
    id: 'SPEC-002',
    code: 'SPEC-VLV-BALL-6IN',
    itemCode: 'FG-VLV-6IN-CL600',
    itemName: '6" Class 600 Forged Ball Valve (API 6D)',
    category: 'FINISHED_GOODS',
    revision: 'Rev E',
    effectiveDate: '2024-02-15',
    samplingStandard: '100% Hydrostatic Proof Test',
    aqlLevel: 'Zero Defects (c=0)',
    approvedBy: 'Lead Valve Design Engineer',
    status: 'ACTIVE',
    parameters: [
      {
        id: 'p4',
        name: 'Hydrostatic Shell Pressure',
        unit: 'bar',
        targetNominal: 153.0,
        lowerSpecLimit: 150.0,
        upperSpecLimit: 160.0,
        toleranceType: 'UNILATERAL_MIN',
        testMethod: 'API 598 Hydro Test (10 min hold)',
        criticality: 'CRITICAL_TO_QUALITY'
      },
      {
        id: 'p5',
        name: 'Stem Operating Torque',
        unit: 'N·m',
        targetNominal: 420,
        lowerSpecLimit: 350,
        upperSpecLimit: 480,
        toleranceType: 'BILATERAL',
        testMethod: 'Calibrated Torque Transducer',
        criticality: 'MAJOR'
      }
    ]
  }
];

// Initial Mock Data: 14.02 Quality Planning
const initialQualityPlans: QualityPlan[] = [
  {
    id: 'QP-001',
    code: 'QP-LNG-EXPANSION-2024',
    projectNameOrProduct: 'Duqm LNG Liquefaction Train Module 3',
    controlPlanType: 'PROJECT_SPECIFIC',
    version: 'Rev 2.0',
    stagesCount: 6,
    holdPointsCount: 3,
    leadQualityEngineer: 'Eng. Khalid Al-Amri',
    effectiveDate: '2024-02-01',
    approvalStatus: 'APPROVED',
    stages: [
      {
        stageNumber: 1,
        operationName: 'Mill Raw Plate Receipt & Positive Material Identification (PMI)',
        inspectionType: 'INCOMING',
        isHoldPoint: true,
        sampleSizeRule: '100% of heats via XRF Spectrometer',
        responsibleRole: 'Receiving QA Inspector'
      },
      {
        stageNumber: 2,
        operationName: 'Submerged Arc Longitudinal Welding',
        inspectionType: 'IN_PROCESS',
        isHoldPoint: false,
        sampleSizeRule: 'First piece + 10% sampling',
        responsibleRole: 'Welding Inspector CSWIP 3.1'
      },
      {
        stageNumber: 3,
        operationName: '100% Radiographic Testing (RT) on Critical Weld Seams',
        inspectionType: 'IN_PROCESS',
        isHoldPoint: true,
        sampleSizeRule: '100% of Class 1 Welds',
        responsibleRole: 'NDT Level III Specialist'
      },
      {
        stageNumber: 4,
        operationName: 'Hydrostatic Pressure & Helium Leak Test',
        inspectionType: 'FINAL',
        isHoldPoint: true,
        sampleSizeRule: '100% of finished pressure vessels',
        responsibleRole: 'Lead Hydrostatic Test Engineer'
      }
    ]
  },
  {
    id: 'QP-002',
    code: 'QP-ALUM-EXTRUSIONS-SERIES',
    projectNameOrProduct: 'Structural Architectural Aluminum Profiles',
    controlPlanType: 'MASS_PRODUCTION',
    version: 'Rev 1.4',
    stagesCount: 4,
    holdPointsCount: 1,
    leadQualityEngineer: 'Maryam Al-Hinai',
    effectiveDate: '2024-01-10',
    approvalStatus: 'APPROVED',
    stages: [
      {
        stageNumber: 1,
        operationName: 'Billet Homogenization & Spectrometry Assay',
        inspectionType: 'INCOMING',
        isHoldPoint: true,
        sampleSizeRule: '1 test per melt batch',
        responsibleRole: 'Foundry Metallurgist'
      },
      {
        stageNumber: 2,
        operationName: 'Extrusion Die Exit Dimensional Laser Gauging',
        inspectionType: 'IN_PROCESS',
        isHoldPoint: false,
        sampleSizeRule: 'Automated 100% continuous scan',
        responsibleRole: 'Line QC Operator'
      },
      {
        stageNumber: 3,
        operationName: 'Anodizing Coating Thickness (Eddy Current)',
        inspectionType: 'FINAL',
        isHoldPoint: false,
        sampleSizeRule: 'ISO 2859-1 Level S-4',
        responsibleRole: 'Finishing QC Inspector'
      }
    ]
  }
];

const initialInspectionPlans: InspectionPlan[] = [
  {
    id: 'IP-001',
    code: 'IP-REC-FASTENERS',
    title: 'Incoming Inspection Plan — High-Tensile Fasteners & Stud Bolts (Grade B7/2H)',
    targetCategory: 'Raw Materials & Hardware',
    inspectionType: 'INCOMING',
    mandatoryGauges: ['Optical Comparator', 'Rockwell Hardness Tester', 'Digital Pitch Micrometer'],
    frequency: 'BATCH_SAMPLING',
    sampleSizeFormula: 'MIL-STD-105E Normal Single Sampling (AQL 0.65)',
    criteriaSummary: 'Zero thread pitch distortion, Hardness 28-34 HRC, Zinc electroplating > 15 microns.',
    isActive: true
  },
  {
    id: 'IP-002',
    code: 'IP-CNC-MACHINING',
    title: 'In-Process Quality Plan — CNC 5-Axis Impeller Milling',
    targetCategory: 'Semi-Finished Precision Parts',
    inspectionType: 'IN_PROCESS',
    mandatoryGauges: ['Coordinate Measuring Machine (CMM)', 'Surface Roughness Tester (Ra)'],
    frequency: 'FIRST_LAST_PIECE',
    sampleSizeFormula: 'First Off Approval + 1 part every 2 hours',
    criteriaSummary: 'Blade contour profile within ±0.015mm, Surface finish Ra ≤ 0.8 µm.',
    isActive: true
  }
];

const initialChecklists: QualityChecklist[] = [
  {
    id: 'CHK-001',
    code: 'CHK-RECEIVING-STL',
    title: 'Receiving Dock Quality Verification Checklist',
    department: 'Central Warehouse Receiving',
    workCenter: 'Gate 4 Inbound QC Bay',
    revision: 'Rev 3',
    inspectorName: 'Fahad Al-Maskari',
    supervisorSignoff: true,
    items: [
      {
        id: 'ci-1',
        checkpoint: 'Supplier Certificate of Analysis (COA) & Heat Number Verification',
        specificationRequirement: 'Mill test certificate must match stamped heat number on physical plates',
        measurementType: 'PASS_FAIL',
        actualResult: 'PASS',
        notes: 'Heat # H-90822 matched mill test certificate from POSCO.'
      },
      {
        id: 'ci-2',
        checkpoint: 'Visual Inspection for Surface Rust, Pitting, or Transport Damage',
        specificationRequirement: 'No deep scratches, gouges, or severe oxidation',
        measurementType: 'PASS_FAIL',
        actualResult: 'PASS',
        notes: 'Clean surfaces, protective oil film intact.'
      },
      {
        id: 'ci-3',
        checkpoint: 'Plate Thickness (Nominal: 12.0 mm)',
        specificationRequirement: 'Tolerance: 11.75 mm - 12.25 mm',
        measurementType: 'NUMERIC_VALUE',
        unit: 'mm',
        minValue: 11.75,
        maxValue: 12.25,
        actualValue: 12.04,
        actualResult: 'PASS'
      },
      {
        id: 'ci-4',
        checkpoint: 'Plate Diagonal Squareness Measurement',
        specificationRequirement: 'Maximum allowable diagonal difference ≤ 3.0 mm',
        measurementType: 'NUMERIC_VALUE',
        unit: 'mm',
        minValue: 0,
        maxValue: 3.0,
        actualValue: 1.2,
        actualResult: 'PASS'
      }
    ]
  }
];

const initialSamplingPlans: SamplingPlan[] = [
  {
    id: 'SP-001',
    standard: 'ISO-2859-1',
    inspectionLevel: 'II',
    lotSizeMin: 151,
    lotSizeMax: 280,
    sampleCodeLetter: 'G',
    sampleSize: 32,
    aqlPercent: 0.65,
    acceptanceNumberAc: 0,
    rejectionNumberRe: 1,
    samplingType: 'NORMAL'
  },
  {
    id: 'SP-002',
    standard: 'ISO-2859-1',
    inspectionLevel: 'II',
    lotSizeMin: 501,
    lotSizeMax: 1200,
    sampleCodeLetter: 'J',
    sampleSize: 80,
    aqlPercent: 1.0,
    acceptanceNumberAc: 2,
    rejectionNumberRe: 3,
    samplingType: 'NORMAL'
  },
  {
    id: 'SP-003',
    standard: 'MIL-STD-105E',
    inspectionLevel: 'III',
    lotSizeMin: 1201,
    lotSizeMax: 3200,
    sampleCodeLetter: 'L',
    sampleSize: 200,
    aqlPercent: 0.4,
    acceptanceNumberAc: 1,
    rejectionNumberRe: 2,
    samplingType: 'TIGHTENED'
  }
];

// Initial Mock Data: 14.03 Inspection & Testing
const initialInspections: InspectionRecord[] = [
  {
    id: 'INSP-001',
    inspectionNumber: 'INSP-2024-0089',
    type: 'INCOMING',
    lotNumber: 'LOT-POSCO-98421',
    batchSize: 250,
    sampleSize: 32,
    itemCode: 'RM-STL-316L-PLT',
    itemName: 'Stainless Steel Plate 316L (12mm)',
    vendorOrWorkCenter: 'POSCO International Corp',
    grnOrJobOrderRef: 'GRN-2024-0198 (PO-88310)',
    inspectionDate: '2024-04-18',
    inspectorName: 'Fahad Al-Maskari',
    status: 'PASSED',
    defectsFound: 0,
    criticalDefects: 0,
    majorDefects: 0,
    minorDefects: 0,
    certificateOfAnalysisAttached: true,
    coaNumber: 'COA-POS-98421-C',
    measurements: [
      {
        parameter: 'Thickness (mm)',
        nominal: 12.0,
        lsl: 11.75,
        usl: 12.25,
        recordedValues: [12.02, 12.05, 11.98, 12.04, 12.01],
        average: 12.028,
        isWithinTolerance: true
      },
      {
        parameter: 'Hardness (HRB)',
        nominal: 88,
        lsl: 80,
        usl: 95,
        recordedValues: [87, 88, 89, 88, 87],
        average: 87.8,
        isWithinTolerance: true
      }
    ],
    remarks: 'Full dimensional check within specifications. Heat certificates stamped and release label applied.',
    dispositionAction: 'Accepted for Warehouse Stock Receipt'
  },
  {
    id: 'INSP-002',
    inspectionNumber: 'INSP-2024-0090',
    type: 'IN_PROCESS',
    lotNumber: 'WIP-JOB-2024-4410',
    batchSize: 45,
    sampleSize: 45,
    itemCode: 'SA-IMP-TURB-01',
    itemName: 'High-Pressure Turbine Impeller Casting',
    vendorOrWorkCenter: 'WorkCenter 03 — 5-Axis CNC Milling',
    grnOrJobOrderRef: 'JO-2024-0982',
    inspectionDate: '2024-04-19',
    inspectorName: 'Eng. Khalid Al-Amri',
    status: 'CONDITIONALLY_PASSED',
    defectsFound: 2,
    criticalDefects: 0,
    majorDefects: 1,
    minorDefects: 1,
    certificateOfAnalysisAttached: false,
    measurements: [
      {
        parameter: 'Blade Root Fillet Radius (mm)',
        nominal: 4.5,
        lsl: 4.35,
        usl: 4.65,
        recordedValues: [4.48, 4.32, 4.51, 4.49, 4.5],
        average: 4.46,
        isWithinTolerance: false
      }
    ],
    remarks: 'Blade #3 had minor tool deflection on root fillet (4.32mm vs LSL 4.35mm). Approved under engineering concession.',
    dispositionAction: 'Rework minor blend on blade #3 then proceed'
  },
  {
    id: 'INSP-003',
    inspectionNumber: 'INSP-2024-0091',
    type: 'FINAL',
    lotNumber: 'FG-VALVE-BATCH-12',
    batchSize: 20,
    sampleSize: 20,
    itemCode: 'FG-VLV-6IN-CL600',
    itemName: '6" Class 600 Forged Ball Valve',
    vendorOrWorkCenter: 'Assembly & Testing Cell B',
    grnOrJobOrderRef: 'SO-89201 (Customer: OQ Refineries)',
    inspectionDate: '2024-04-20',
    inspectorName: 'Sultan Al-Rawahi',
    status: 'PASSED',
    defectsFound: 0,
    criticalDefects: 0,
    majorDefects: 0,
    minorDefects: 0,
    certificateOfAnalysisAttached: true,
    coaNumber: 'COC-ART-2024-0891',
    measurements: [
      {
        parameter: 'Shell Hydro Test (bar / 10 min)',
        nominal: 153.0,
        lsl: 150.0,
        usl: 160.0,
        recordedValues: [153.5, 153.5, 153.4, 153.5],
        average: 153.47,
        isWithinTolerance: true
      },
      {
        parameter: 'Seat Nitrogen Low-Pressure Leak Rate (bubbles/min)',
        nominal: 0,
        lsl: 0,
        usl: 0,
        recordedValues: [0, 0, 0, 0],
        average: 0,
        isWithinTolerance: true
      }
    ],
    remarks: 'Zero pressure drop observed. Painting DFT measured at 320 µm. Ready for customer dispatch.',
    dispositionAction: 'Issued Certificate of Conformity for Dispatch'
  },
  {
    id: 'INSP-004',
    inspectionNumber: 'INSP-2024-0092',
    type: 'INCOMING',
    lotNumber: 'LOT-HYD-SEAL-771',
    batchSize: 500,
    sampleSize: 50,
    itemCode: 'RM-SEAL-VITON-80',
    itemName: 'Viton O-Ring High Temp Seal (80 Durometer)',
    vendorOrWorkCenter: 'Gulf Precision Polymers LLC',
    grnOrJobOrderRef: 'GRN-2024-0205',
    inspectionDate: '2024-04-21',
    inspectorName: 'Fahad Al-Maskari',
    status: 'REJECTED',
    defectsFound: 8,
    criticalDefects: 4,
    majorDefects: 4,
    minorDefects: 0,
    certificateOfAnalysisAttached: false,
    measurements: [
      {
        parameter: 'Durometer Hardness (Shore A)',
        nominal: 80,
        lsl: 75,
        usl: 85,
        recordedValues: [68, 71, 69, 70, 72],
        average: 70.0,
        isWithinTolerance: false
      }
    ],
    remarks: 'Durometer hardness severely below specification (70 Shore A vs 80 target). High blowout risk under operating pressure.',
    dispositionAction: 'Quarantined. NCR-2024-0034 logged for Return To Vendor (RTV).'
  }
];

const initialMaterialTests: MaterialTestReport[] = [
  {
    id: 'MTR-001',
    reportNumber: 'MTR-LAB-2024-0412',
    heatNumber: 'HEAT-98421',
    materialGrade: 'ASTM A240 Type 316L',
    sampleOrigin: 'Incoming Lot LOT-POSCO-98421',
    testStandard: 'ASTM E8 / ASTM E18',
    testingLab: 'INTERNAL_METALLURGY_LAB',
    testDate: '2024-04-18',
    tensileStrengthMpa: 574,
    yieldStrengthMpa: 288,
    elongationPct: 46.5,
    hardnessHrc: 22.4,
    chemicalComposition: [
      { element: 'Carbon (C)', observedPct: 0.022, minLimitPct: 0.0, maxLimitPct: 0.03, isCompliant: true },
      { element: 'Manganese (Mn)', observedPct: 1.45, minLimitPct: 0.0, maxLimitPct: 2.0, isCompliant: true },
      { element: 'Chromium (Cr)', observedPct: 17.2, minLimitPct: 16.0, maxLimitPct: 18.0, isCompliant: true },
      { element: 'Nickel (Ni)', observedPct: 11.4, minLimitPct: 10.0, maxLimitPct: 14.0, isCompliant: true },
      { element: 'Molybdenum (Mo)', observedPct: 2.15, minLimitPct: 2.0, maxLimitPct: 3.0, isCompliant: true },
      { element: 'Sulfur (S)', observedPct: 0.008, minLimitPct: 0.0, maxLimitPct: 0.03, isCompliant: true }
    ],
    verdict: 'CONFORMING',
    certifiedBy: 'Dr. Tariq Al-Busaidi (Chief Metallurgist)'
  },
  {
    id: 'MTR-002',
    reportNumber: 'MTR-LAB-2024-0415',
    heatNumber: 'HEAT-FLG-7710',
    materialGrade: 'ASTM A105 Carbon Steel Forging',
    sampleOrigin: 'High Pressure Flange Forging Lot #7710',
    testStandard: 'ASTM A105 / NACE MR0175',
    testingLab: 'THIRD_PARTY_SGS',
    testDate: '2024-04-19',
    tensileStrengthMpa: 520,
    yieldStrengthMpa: 295,
    elongationPct: 28.0,
    hardnessHrc: 18.5,
    chemicalComposition: [
      { element: 'Carbon (C)', observedPct: 0.28, minLimitPct: 0.0, maxLimitPct: 0.35, isCompliant: true },
      { element: 'Manganese (Mn)', observedPct: 0.85, minLimitPct: 0.6, maxLimitPct: 1.05, isCompliant: true },
      { element: 'Silicon (Si)', observedPct: 0.22, minLimitPct: 0.1, maxLimitPct: 0.35, isCompliant: true }
    ],
    verdict: 'CONFORMING',
    certifiedBy: 'SGS Oman Inspection Bureau'
  }
];

// Initial Mock Data: 14.04 Non-Conformance (NCR)
const initialNCRs: NonConformanceReport[] = [
  {
    id: 'NCR-001',
    ncrNumber: 'NCR-2024-0034',
    title: 'Substandard Durometer Hardness on Viton O-Rings',
    severity: 'CRITICAL',
    source: 'INCOMING_INSPECTION',
    referenceDoc: 'GRN-2024-0205 (PO-89104)',
    itemCode: 'RM-SEAL-VITON-80',
    itemName: 'Viton O-Ring High Temp Seal (80 Durometer)',
    supplierOrDepartment: 'Gulf Precision Polymers LLC',
    lotNumber: 'LOT-HYD-SEAL-771',
    quantityAffected: 500,
    unitOfMeasure: 'PCS',
    defectCategory: 'CHEMICAL_SPEC',
    defectDescription: 'Lot tested at 68-72 Shore A hardness vs mandatory 75-85 Shore A specification. Inadequate curing suspected at supplier facility.',
    reportedDate: '2024-04-21',
    reportedBy: 'Fahad Al-Maskari',
    status: 'MRB_REVIEW',
    quarantineLocation: 'Quarantine Cage Q-02 (Warehouse B)',
    quarantineTagId: 'QTAG-2024-0089',
    containmentAction: '100% of batch locked in quarantine with red physical tags. MRP allocation blocked in ERP.',
    containmentImplementedDate: '2024-04-21',
    mrbDisposition: 'RETURN_TO_VENDOR',
    mrbMembers: ['QA Manager', 'Procurement Lead', 'Production Superintendent'],
    mrbDecisionNotes: 'Vendor agreed to full credit note and replacement air shipment within 5 working days. SCAR-2024-0012 initiated.',
    reworkCostEstimated: 0,
    scrapCostEstimated: 0,
    financialImpactCopq: 4500,
    associatedCapaId: 'CAPA-2024-0012'
  },
  {
    id: 'NCR-002',
    ncrNumber: 'NCR-2024-0035',
    title: 'Porosity and Incomplete Fusion on Weld Joint W-14',
    severity: 'MAJOR',
    source: 'IN_PROCESS',
    referenceDoc: 'JO-2024-0982 (LNG Spool Header)',
    itemCode: 'WIP-SPOOL-16IN',
    itemName: '16" Cryogenic Pipe Spool Assembly',
    supplierOrDepartment: 'Heavy Fabrication Shop (Bay 2)',
    lotNumber: 'SPL-2024-041',
    quantityAffected: 2,
    unitOfMeasure: 'UNITS',
    defectCategory: 'WELDING_DEFECT',
    defectDescription: 'Radiographic testing revealed cluster porosity exceeding ASME Sec VIII Div 1 limits on weld root pass.',
    reportedDate: '2024-04-19',
    reportedBy: 'Eng. Khalid Al-Amri',
    status: 'CONTAINMENT_ACTIVE',
    quarantineLocation: 'Weld Rework Area #4',
    quarantineTagId: 'QTAG-2024-0091',
    containmentAction: 'Welder #W-104 suspended from cryogenic spools pending re-qualification. Spool quarantined.',
    containmentImplementedDate: '2024-04-19',
    mrbDisposition: 'REWORK',
    mrbMembers: ['Welding Engineer', 'QA Director', 'Plant Manager'],
    mrbDecisionNotes: 'Gouge out defective weld metal with carbon arc, re-weld under GTAW with 100% RT re-examination.',
    reworkCostEstimated: 1200,
    scrapCostEstimated: 0,
    financialImpactCopq: 1200,
    associatedCapaId: 'CAPA-2024-0014'
  },
  {
    id: 'NCR-003',
    ncrNumber: 'NCR-2024-0036',
    title: 'Paint Dry Film Thickness (DFT) Underspec on Skid Frame',
    severity: 'MINOR',
    source: 'FINAL_INSPECTION',
    referenceDoc: 'SO-89201',
    itemCode: 'FG-SKID-PUMP-01',
    itemName: 'Offshore Chemical Injection Skid Structure',
    supplierOrDepartment: 'Surface Coating & Blasting Booth',
    lotNumber: 'SKD-2024-008',
    quantityAffected: 1,
    unitOfMeasure: 'UNIT',
    defectCategory: 'SURFACE_FINISH',
    defectDescription: 'Topcoat polyurethane thickness measured at 180 µm vs 250 µm contractual C5-M marine spec.',
    reportedDate: '2024-04-17',
    reportedBy: 'Sultan Al-Rawahi',
    status: 'CLOSED',
    quarantineLocation: 'Blasting Bay Buffer',
    quarantineTagId: 'QTAG-2024-0082',
    containmentAction: 'Re-masked and applied additional polyurethane coat of 80 µm.',
    containmentImplementedDate: '2024-04-17',
    mrbDisposition: 'REWORK',
    mrbMembers: ['QA Lead', 'Painting Inspector (NACE II)'],
    mrbDecisionNotes: 'Re-tested at 265 µm total DFT. Adhesion cross-hatch test passed.',
    reworkCostEstimated: 350,
    scrapCostEstimated: 0,
    financialImpactCopq: 350,
    closedDate: '2024-04-19'
  }
];

const initialDefectClassifications: DefectClassification[] = [
  { code: 'DEF-DIM-01', name: 'Dimensional Out of Tolerance (LSL/USL)', category: 'Machining', standardSeverity: 'MAJOR', frequencyLast90Days: 14, avgCostPerOccurrence: 850 },
  { code: 'DEF-WLD-02', name: 'Weld Porosity / Slag Inclusion (RT Reject)', category: 'Fabrication', standardSeverity: 'CRITICAL', frequencyLast90Days: 8, avgCostPerOccurrence: 1600 },
  { code: 'DEF-CHM-03', name: 'Raw Material Hardness / Chemistry Deviation', category: 'Receiving', standardSeverity: 'CRITICAL', frequencyLast90Days: 5, avgCostPerOccurrence: 4200 },
  { code: 'DEF-SRF-04', name: 'Coating Blistering / Under-Thickness (DFT)', category: 'Finishing', standardSeverity: 'MINOR', frequencyLast90Days: 18, avgCostPerOccurrence: 320 },
  { code: 'DEF-DOC-05', name: 'Missing or Non-Compliant Mill Test Certificate', category: 'Documentation', standardSeverity: 'MINOR', frequencyLast90Days: 11, avgCostPerOccurrence: 150 }
];

// Initial Mock Data: 14.05 Corrective & Preventive Actions (CAPA)
const initialCAPAs: CAPARecord[] = [
  {
    id: 'CAPA-001',
    capaNumber: 'CAPA-2024-0012',
    title: 'Recurrent Polymer Seal Curing Deficiencies from Supplier',
    type: 'SUPPLIER_SCAR',
    sourceNcrNumber: 'NCR-2024-0034',
    initiator: 'Fahad Al-Maskari (Incoming QA)',
    assignedChampion: 'Eng. Salem Al-Kiyumi',
    department: 'Procurement & Supplier Quality',
    targetCompletionDate: '2024-05-15',
    status: 'IMPLEMENTATION',
    riskPriorityNumberRpn: 280, // Severity: 7, Occurrence: 8, Detection: 5
    fiveWhy: {
      problemStatement: 'Viton O-Rings received with hardness 68-72 Shore A instead of 80 Shore A.',
      why1: 'Why did the hardness test fail? Because the polymer elastomer matrix did not reach complete cross-linking.',
      why2: 'Why was cross-linking incomplete? Because curing oven temperature in supplier Line 2 was 12°C below setpoint.',
      why3: 'Why was temperature below setpoint? Because thermocouple sensor was out of calibration by 18 months.',
      why4: 'Why was thermocouple calibration missed? Because supplier had no automated calibration maintenance schedule in their PM system.',
      why5RootCause: 'Lack of verified PM governance and automated temperature interlock on supplier vulcanization press.'
    },
    fishbone: [
      {
        category: 'MACHINERY',
        causes: ['Oven thermocouple out of calibration', 'Lack of automatic thermal safety cut-off']
      },
      {
        category: 'METHOD',
        causes: ['No batch pre-cure rheometer check prior to vulcanization run', 'Sampling frequency inadequate']
      },
      {
        category: 'MANPOWER',
        causes: ['New night-shift operator bypassed curing timer buzzer']
      },
      {
        category: 'MATERIAL',
        causes: ['Raw Viton polymer batch shelf life was within limits (not a root cause)']
      },
      {
        category: 'MEASUREMENT',
        causes: ['Durometer gauge at supplier had 5% drift against master block']
      },
      {
        category: 'ENVIRONMENT',
        causes: ['High ambient factory temperature caused premature resin tackiness']
      }
    ],
    eightDSteps: [
      { step: 'D1_TEAM', title: 'Cross-Functional Team Formation', description: 'Formed team: QA Lead, Supplier Plant Manager, Lead Polymer Engineer.', status: 'COMPLETED', completedDate: '2024-04-22', owner: 'Salem Al-Kiyumi' },
      { step: 'D2_PROBLEM_DESCRIPTION', title: 'Problem Description (5W2H)', description: '500 Viton seals failed hardness test, endangering high-pressure valve seals.', status: 'COMPLETED', completedDate: '2024-04-22', owner: 'Fahad Al-Maskari' },
      { step: 'D3_CONTAINMENT', title: 'Immediate Containment Actions', description: 'Quarantined 500 pcs in cage Q-02. Blocked batch usage in ERP.', status: 'COMPLETED', completedDate: '2024-04-22', owner: 'Fahad Al-Maskari' },
      { step: 'D4_ROOT_CAUSE', title: 'Root Cause Verification', description: 'Identified faulty thermocouple and lack of rheometer verification.', status: 'COMPLETED', completedDate: '2024-04-24', owner: 'Salem Al-Kiyumi' },
      { step: 'D5_CORRECTIVE_ACTIONS', title: 'Permanent Corrective Actions (PCA)', description: 'Install PLC thermal interlock and require COA rheometer curve with every delivery.', status: 'IN_PROGRESS', owner: 'Gulf Precision Polymers' },
      { step: 'D6_IMPLEMENT_VALIDATE', title: 'Implement & Validate PCA', description: 'Supplier completed sensor upgrade. Validated pilot batch of 200 pcs.', status: 'IN_PROGRESS', owner: 'QA Team' },
      { step: 'D7_PREVENT_RECURRENCE', title: 'Systemic Recurrence Prevention', description: 'Update Supplier Quality Manual to mandate monthly thermocouple calibration.', status: 'PENDING', owner: 'Procurement QA' },
      { step: 'D8_CLOSURE_RECOGNITION', title: 'Team Recognition & Closure', description: 'Formal CAPA closure signoff by QA Director.', status: 'PENDING', owner: 'Director QA' }
    ],
    actionItems: [
      { id: 'act-1', task: 'Issue formal Supplier Corrective Action Request (SCAR) to Gulf Precision Polymers', assignee: 'Salem Al-Kiyumi', dueDate: '2024-04-25', completed: true },
      { id: 'act-2', task: 'Supplier to install dual digital temperature controllers with auto-lockout', assignee: 'Vendor QA Director', dueDate: '2024-05-05', completed: true },
      { id: 'act-3', task: 'Conduct supplier on-site process audit to verify calibration logs', assignee: 'Lead Auditor', dueDate: '2024-05-12', completed: false },
      { id: 'act-4', task: 'Inspect 3 consecutive incoming shipments at 100% tightened sampling (Level III)', assignee: 'Fahad Al-Maskari', dueDate: '2024-05-25', completed: false }
    ]
  },
  {
    id: 'CAPA-002',
    capaNumber: 'CAPA-2024-0014',
    title: 'Welding Porosity Elimination on Cryogenic Pressure Spools',
    type: 'CORRECTIVE',
    sourceNcrNumber: 'NCR-2024-0035',
    initiator: 'Eng. Khalid Al-Amri',
    assignedChampion: 'Eng. Hamed Al-Jabri (Welding Specialist)',
    department: 'Manufacturing & Engineering',
    targetCompletionDate: '2024-05-10',
    status: 'ROOT_CAUSE_ANALYSIS',
    riskPriorityNumberRpn: 180,
    fiveWhy: {
      problemStatement: 'Radiographic testing detected cluster porosity on cryogenic pipe weld W-14.',
      why1: 'Why did porosity form? Moisture and shielding gas turbulence contaminated the molten weld pool.',
      why2: 'Why was shielding gas contaminated? Backing gas flow rate dropped below 8 L/min during root pass.',
      why3: 'Why did gas flow drop? The gas cylinder manifold regulator had ice buildup during high-volume welding.',
      why4: 'Why was regulator freezing? Cylinder heater was disconnected by night maintenance crew.',
      why5RootCause: 'Absence of electrical interlock and visual low-flow gas alarm on GTAW backing purge systems.'
    },
    fishbone: [
      { category: 'METHOD', causes: ['Backing gas purge time not verified with oxygen analyzer (<50 ppm)'] },
      { category: 'MACHINERY', causes: ['Manifold gas regulator heater disconnected'] },
      { category: 'MANPOWER', causes: ['Welder did not check flowmeter gauge before striking arc'] },
      { category: 'MATERIAL', causes: ['Argon gas 99.999% purity certified'] },
      { category: 'MEASUREMENT', causes: ['Purge oxygen meter sensor needed battery replacement'] },
      { category: 'ENVIRONMENT', causes: ['High ambient humidity in bay 2 during rain'] }
    ],
    eightDSteps: [
      { step: 'D1_TEAM', title: 'Team Formation', description: 'Welding Lead, NDT Inspector, Shop Supervisor.', status: 'COMPLETED', completedDate: '2024-04-20', owner: 'Hamed Al-Jabri' },
      { step: 'D2_PROBLEM_DESCRIPTION', title: 'Problem Description', description: 'Cluster porosity on 16" cryogenic pipe spool weld seam.', status: 'COMPLETED', completedDate: '2024-04-20', owner: 'Khalid Al-Amri' },
      { step: 'D3_CONTAINMENT', title: 'Containment Action', description: 'Gouge out weld, hold spools 41 & 42.', status: 'COMPLETED', completedDate: '2024-04-21', owner: 'Welding Team' },
      { step: 'D4_ROOT_CAUSE', title: '5-Why Root Cause', description: 'Regulator heater failure caused gas purge drop.', status: 'IN_PROGRESS', owner: 'Hamed Al-Jabri' },
      { step: 'D5_CORRECTIVE_ACTIONS', title: 'Corrective Action Plan', description: 'Install digital mass flow meters with acoustic cut-off.', status: 'PENDING', owner: 'Engineering' },
      { step: 'D6_IMPLEMENT_VALIDATE', title: 'Implementation', description: 'Retrofit 4 welding stations.', status: 'PENDING', owner: 'Maintenance' },
      { step: 'D7_PREVENT_RECURRENCE', title: 'Process Standardization', description: 'Mandate digital purge log prior to weld arc strike.', status: 'PENDING', owner: 'QA Lead' },
      { step: 'D8_CLOSURE_RECOGNITION', title: 'Closure', description: 'Final effectiveness review.', status: 'PENDING', owner: 'Plant Manager' }
    ],
    actionItems: [
      { id: 'act-5', task: 'Retrofit all GTAW purge manifolds with heated regulators and digital flow alarms', assignee: 'Hamed Al-Jabri', dueDate: '2024-05-02', completed: false },
      { id: 'act-6', task: 'Conduct refresher training for all GTAW pipe welders on backing gas monitoring', assignee: 'Training Coordinator', dueDate: '2024-05-08', completed: false }
    ]
  }
];

const initialFMEAs: FMEARiskEntry[] = [
  {
    id: 'FMEA-001',
    processStep: 'CNC Precision Milling of Impeller Vanes',
    potentialFailureMode: 'Tool wear causing vane thickness to exceed upper specification limit (USL)',
    potentialEffect: 'Rotor dynamic imbalance during 12,000 RPM operation, bearing premature failure',
    severityScore: 8,
    potentialCause: 'Carbide end-mill edge degradation after 40 hours continuous cutting',
    occurrenceScore: 5,
    currentControls: 'Operator manual micrometer check at end of shift',
    detectionScore: 6,
    calculatedRpn: 240, // 8 * 5 * 6
    mitigationAction: 'Implement automated in-spindle Renishaw touch probe tool-breakage detection after every 3 parts',
    revisedRpn: 48 // 8 * 2 * 3
  },
  {
    id: 'FMEA-002',
    processStep: 'Hydrostatic High Pressure Shell Proof Testing',
    potentialFailureMode: 'Sudden high-pressure seal blowout during 150 bar hold test',
    potentialEffect: 'Safety hazard to test technician and pressure loss false test failure',
    severityScore: 9,
    potentialCause: 'Damaged test flange O-ring or incorrect bolt torque sequence',
    occurrenceScore: 3,
    currentControls: 'Visual inspection of O-ring and manual torque wrench',
    detectionScore: 4,
    calculatedRpn: 108,
    mitigationAction: 'Install automated hydraulic clamping fixture with safety blast shield and automated pressure logging',
    revisedRpn: 27
  }
];

// Initial Mock Data: 14.06 Quality Audits, Supplier Quality & KPIs
const initialAudits: QualityAudit[] = [
  {
    id: 'AUD-001',
    auditNumber: 'AUD-2024-0015',
    title: 'ISO 9001:2015 Annual Internal QMS Surveillance Audit',
    type: 'INTERNAL_ISO',
    standardReference: 'ISO 9001:2015 Clauses 4 through 10',
    auditedDepartmentOrSupplier: 'Manufacturing, Procurement & Warehouse Operations',
    leadAuditor: 'Eng. Salem Al-Kiyumi (Lead Auditor IRCA Certified)',
    auditDate: '2024-03-18',
    closingMeetingDate: '2024-03-20',
    status: 'FINDINGS_OPEN',
    scorePct: 94.2,
    auditSummary: 'Overall QMS governance is strong and compliant. 1 Minor Non-Conformance logged in calibration log documentation, and 2 Opportunities for Improvement noted in warehouse shelf-life labeling.',
    findings: [
      {
        id: 'find-1',
        clauseReference: 'ISO 9001:2015 Clause 7.1.5.2 (Measurement Traceability)',
        findingType: 'MINOR_NC',
        description: 'Two torque wrenches in Assembly Cell 2 lacked current calibration sticker traceability to national standard.',
        evidence: 'Torque Wrench TW-04 & TW-09 calibration expired on 2024-02-15.',
        correctiveActionDeadline: '2024-04-30',
        capaReference: 'CAPA-2024-0010',
        isClosed: true
      },
      {
        id: 'find-2',
        clauseReference: 'ISO 9001:2015 Clause 8.5.4 (Preservation of Product)',
        findingType: 'OBSERVATION',
        description: 'Elastomer seal storage bin humidity was 68% (recommended maximum 60%).',
        evidence: 'Warehouse Hygrometer reading at Bay B.',
        correctiveActionDeadline: '2024-05-15',
        isClosed: false
      }
    ]
  },
  {
    id: 'AUD-002',
    auditNumber: 'AUD-2024-0018',
    title: 'Supplier Qualification & Process Capability Audit — POSCO Steel',
    type: 'SUPPLIER_AUDIT',
    standardReference: 'ISO 9001 / API Q1 Annex A',
    auditedDepartmentOrSupplier: 'POSCO International Corp (Pohang Mill)',
    leadAuditor: 'Dr. Tariq Al-Busaidi',
    auditDate: '2024-02-12',
    closingMeetingDate: '2024-02-14',
    status: 'CLOSED',
    scorePct: 98.5,
    auditSummary: 'World-class automated continuous casting and hot rolling facility. Direct optical spectrometry and automated ultrasonic defect scanning fully validated.',
    findings: []
  }
];

const initialSupplierScorecards: SupplierQualityScorecard[] = [
  {
    supplierId: 'SUP-001',
    supplierName: 'POSCO International Corp',
    vendorTier: 'STRATEGIC_A',
    lotsReceivedTotal: 48,
    lotsAccepted: 48,
    lotsRejected: 0,
    acceptanceRatePct: 100.0,
    defectPpm: 25,
    openNcrCount: 0,
    openScarCount: 0,
    overallQualityRatingScore: 99.2,
    isoCertified: true,
    lastAuditDate: '2024-02-12'
  },
  {
    supplierId: 'SUP-002',
    supplierName: 'Gulf Precision Polymers LLC',
    vendorTier: 'CONDITIONAL_C',
    lotsReceivedTotal: 24,
    lotsAccepted: 21,
    lotsRejected: 3,
    acceptanceRatePct: 87.5,
    defectPpm: 1250,
    openNcrCount: 2,
    openScarCount: 1,
    overallQualityRatingScore: 78.4,
    isoCertified: true,
    lastAuditDate: '2023-11-05'
  },
  {
    supplierId: 'SUP-003',
    supplierName: 'Al-Hassan Fasteners & Hardware Ltd',
    vendorTier: 'APPROVED_B',
    lotsReceivedTotal: 36,
    lotsAccepted: 35,
    lotsRejected: 1,
    acceptanceRatePct: 97.2,
    defectPpm: 210,
    openNcrCount: 0,
    openScarCount: 0,
    overallQualityRatingScore: 94.6,
    isoCertified: true,
    lastAuditDate: '2024-01-20'
  }
];

const initialCertificates: QualityCertificate[] = [
  {
    id: 'CERT-001',
    certNumber: 'BV-ISO9001-2024-OM',
    title: 'ISO 9001:2015 Enterprise Quality Management System Certificate',
    certType: 'ISO_CERTIFICATE',
    entityReference: 'Artify Global Engineering & Manufacturing LLC',
    issueDate: '2024-04-01',
    expiryDate: '2027-04-01',
    issuingAuthority: 'Bureau Veritas Quality International',
    documentRefNumber: 'DOC-ISO-9001-BV-2024',
    isValid: true
  },
  {
    id: 'CERT-002',
    certNumber: 'CAL-CMM-ZEISS-2024',
    title: 'Zeiss Prismo CMM Annual Laser Calibration Certificate',
    certType: 'CALIBRATION_GAUGE',
    entityReference: 'CMM Station 01 (Precision Metrology Lab)',
    issueDate: '2024-01-10',
    expiryDate: '2025-01-10',
    issuingAuthority: 'Carl Zeiss Metrology Middle East',
    documentRefNumber: 'DOC-CAL-ZEISS-0098',
    isValid: true
  },
  {
    id: 'CERT-003',
    certNumber: 'MTC-POSCO-98421',
    title: 'EN 10204 Type 3.1 Mill Test Certificate for 316L Plates',
    certType: 'MILL_TEST_CERT',
    entityReference: 'RM-STL-316L-PLT (Heat 98421)',
    issueDate: '2024-03-25',
    issuingAuthority: 'POSCO Quality Assurance Testing Center',
    documentRefNumber: 'MTC-POS-316L-98421',
    isValid: true
  }
];

const initialAIInsights: QualityAIInsight[] = [
  {
    id: 'INS-001',
    type: 'ROOT_CAUSE',
    title: 'Thermal Drift Anomaly in Welding Purging',
    description: 'Statistical correlation (p=0.014) detected between ambient morning humidity spikes and GTAW purge regulator freezing on Spool line.',
    recommendedAction: 'Automate ambient relative humidity compensation on GTAW preheat cycle.',
    relatedEntity: 'CAPA-2024-0014 (Cryogenic Spools)',
    confidenceScore: 94.8
  },
  {
    id: 'INS-002',
    type: 'PREDICTION',
    title: 'Supplier PPM Deterioration Warning',
    description: 'Gulf Precision Polymers defect PPM surged from 450 to 1250 in the last 45 days, primarily driven by elastomer curing variance.',
    recommendedAction: 'Switch upcoming purchase orders PO-89400 to Secondary Qualified Supplier (SealTech Emirates) while SCAR-2024-0012 is validated.',
    relatedEntity: 'Supplier: Gulf Precision Polymers LLC',
    confidenceScore: 91.2
  },
  {
    id: 'INS-003',
    type: 'OPTIMIZATION',
    title: 'First Pass Yield Optimization on 6" Ball Valves',
    description: 'Process capability index Cpk reached 1.62 on Hydrostatic Shell Testing. Opportunity to reduce sampling time by 15% with zero safety risk.',
    recommendedAction: 'Apply for ISO 2859-1 Reduced Sampling protocol on proven batch series.',
    relatedEntity: 'FG-VLV-6IN-CL600',
    confidenceScore: 88.5
  }
];

// Context Type Definition
interface QualityStoreContextType {
  standards: QualityStandard[];
  policies: QualityPolicy[];
  specifications: QualitySpecification[];
  qualityPlans: QualityPlan[];
  inspectionPlans: InspectionPlan[];
  checklists: QualityChecklist[];
  samplingPlans: SamplingPlan[];
  inspections: InspectionRecord[];
  materialTests: MaterialTestReport[];
  ncrs: NonConformanceReport[];
  defectClassifications: DefectClassification[];
  capas: CAPARecord[];
  fmeas: FMEARiskEntry[];
  fmeaRecords: FMEARiskEntry[];
  audits: QualityAudit[];
  supplierScorecards: SupplierQualityScorecard[];
  certificates: QualityCertificate[];
  aiInsights: QualityAIInsight[];
  kpis: QualityKPIs;
  kpiMetrics: QualityKPIs;
  currency: string;
  selectedFilterDepartment: string;
  setSelectedFilterDepartment: (dept: string) => void;
  // CRUD & Actions
  addStandard: (std: Omit<QualityStandard, 'id'>) => void;
  addPolicy: (pol: Omit<QualityPolicy, 'id'>) => void;
  addSpecification: (spec: Omit<QualitySpecification, 'id'>) => void;
  addQualityPlan: (plan: Omit<QualityPlan, 'id'>) => void;
  addInspectionPlan: (plan: Omit<InspectionPlan, 'id'>) => void;
  addChecklist: (chk: Omit<QualityChecklist, 'id'>) => void;
  updateChecklistItem: (checklistId: string, itemId: string, actualResult: 'PASS' | 'FAIL' | 'N/A', actualValue?: number, notes?: string) => void;
  addInspectionRecord: (record: Omit<InspectionRecord, 'id' | 'inspectionNumber'>) => void;
  addMaterialTestReport: (report: Omit<MaterialTestReport, 'id' | 'reportNumber'>) => void;
  addNCR: (ncr: Omit<NonConformanceReport, 'id' | 'ncrNumber'>) => void;
  addNcr: (ncr: Partial<Omit<NonConformanceReport, 'id' | 'ncrNumber'>>) => void;
  updateNCRStatus: (ncrId: string, status: NCRStatus, disposition?: MRBDisposition, mrbNotes?: string) => void;
  updateNcrDisposition: (ncrId: string, disposition: MRBDisposition, mrbNotes?: string) => void;
  addCAPA: (capa: Omit<CAPARecord, 'id' | 'capaNumber'>) => void;
  addCapa: (capa: Partial<Omit<CAPARecord, 'id' | 'capaNumber'>>) => void;
  updateCAPAStatus: (capaId: string, status: CAPAStatus) => void;
  toggleCAPAActionItem: (capaId: string, actionId: string) => void;
  addFmeaItem: (fmea: Omit<FMEARiskEntry, 'id' | 'calculatedRpn'>) => void;
  addAudit: (audit: Omit<QualityAudit, 'id' | 'auditNumber'>) => void;
  addSupplierScorecard: (scorecard: SupplierQualityScorecard) => void;
  addCertificate: (cert: Omit<QualityCertificate, 'id'>) => void;
  runAIDiagnostics: () => void;
}

const QualityStoreContext = createContext<QualityStoreContextType | undefined>(undefined);

export const QualityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [standards, setStandards] = useState<QualityStandard[]>(initialStandards);
  const [policies, setPolicies] = useState<QualityPolicy[]>(initialPolicies);
  const [specifications, setSpecifications] = useState<QualitySpecification[]>(initialSpecifications);
  const [qualityPlans, setQualityPlans] = useState<QualityPlan[]>(initialQualityPlans);
  const [inspectionPlans, setInspectionPlans] = useState<InspectionPlan[]>(initialInspectionPlans);
  const [checklists, setChecklists] = useState<QualityChecklist[]>(initialChecklists);
  const [samplingPlans, setSamplingPlans] = useState<SamplingPlan[]>(initialSamplingPlans);
  const [inspections, setInspections] = useState<InspectionRecord[]>(initialInspections);
  const [materialTests, setMaterialTests] = useState<MaterialTestReport[]>(initialMaterialTests);
  const [ncrs, setNcrs] = useState<NonConformanceReport[]>(initialNCRs);
  const [defectClassifications] = useState<DefectClassification[]>(initialDefectClassifications);
  const [capas, setCapas] = useState<CAPARecord[]>(initialCAPAs);
  const [fmeas, setFmeas] = useState<FMEARiskEntry[]>(initialFMEAs);
  const [audits, setAudits] = useState<QualityAudit[]>(initialAudits);
  const [supplierScorecards, setSupplierScorecards] = useState<SupplierQualityScorecard[]>(initialSupplierScorecards);
  const [certificates, setCertificates] = useState<QualityCertificate[]>(initialCertificates);
  const [aiInsights, setAiInsights] = useState<QualityAIInsight[]>(initialAIInsights);
  const [selectedFilterDepartment, setSelectedFilterDepartment] = useState<string>('ALL');

  const currency = 'OMR';

  // Dynamic Calculated KPIs
  const kpis: QualityKPIs = useMemo(() => {
    const totalInspectedLots = inspections.length;
    const passedLots = inspections.filter(i => i.status === 'PASSED' || i.status === 'CONDITIONALLY_PASSED').length;
    const firstPassYield = totalInspectedLots > 0 ? (passedLots / totalInspectedLots) * 100 : 98.5;
    const rejectedLots = inspections.filter(i => i.status === 'REJECTED' || i.status === 'QUARANTINED').length;
    const rejectionRate = totalInspectedLots > 0 ? (rejectedLots / totalInspectedLots) * 100 : 1.5;

    const openNcrs = ncrs.filter(n => n.status !== 'CLOSED' && n.status !== 'REJECTED').length;
    const activeCapas = capas.filter(c => c.status !== 'CLOSED').length;
    const totalCopq = ncrs.reduce((acc, n) => acc + (n.financialImpactCopq || 0), 0);

    const avgPpm = supplierScorecards.reduce((acc, s) => acc + s.defectPpm, 0) / (supplierScorecards.length || 1);

    return {
      firstPassYieldPct: Number(firstPassYield.toFixed(1)),
      overallRejectionRatePct: Number(rejectionRate.toFixed(1)),
      openNcrCount: openNcrs,
      activeCapasCount: activeCapas,
      supplierDefectPpm: Math.round(avgPpm),
      costOfPoorQualityCopq: totalCopq,
      costOfPoorQualityPct: 0.85,
      cpkProcessCapability: 1.58,
      auditCompliancePct: 96.4,
      supplierQualityIndexScore: 97.4,
      customerReturnRatePpm: 45
    };
  }, [inspections, ncrs, capas, supplierScorecards]);

  // Actions
  const addStandard = (std: Omit<QualityStandard, 'id'>) => {
    const newStd: QualityStandard = {
      ...std,
      id: `STD-${Date.now().toString().slice(-4)}`
    };
    setStandards(prev => [newStd, ...prev]);
  };

  const addPolicy = (pol: Omit<QualityPolicy, 'id'>) => {
    const newPol: QualityPolicy = {
      ...pol,
      id: `POL-${Date.now().toString().slice(-4)}`
    };
    setPolicies(prev => [newPol, ...prev]);
  };

  const addSpecification = (spec: Omit<QualitySpecification, 'id'>) => {
    const newSpec: QualitySpecification = {
      ...spec,
      id: `SPEC-${Date.now().toString().slice(-4)}`
    };
    setSpecifications(prev => [newSpec, ...prev]);
  };

  const addQualityPlan = (plan: Omit<QualityPlan, 'id'>) => {
    const newPlan: QualityPlan = {
      ...plan,
      id: `QP-${Date.now().toString().slice(-4)}`
    };
    setQualityPlans(prev => [newPlan, ...prev]);
  };

  const addInspectionPlan = (plan: Omit<InspectionPlan, 'id'>) => {
    const newPlan: InspectionPlan = {
      ...plan,
      id: `IP-${Date.now().toString().slice(-4)}`
    };
    setInspectionPlans(prev => [newPlan, ...prev]);
  };

  const addChecklist = (chk: Omit<QualityChecklist, 'id'>) => {
    const newChk: QualityChecklist = {
      ...chk,
      id: `CHK-${Date.now().toString().slice(-4)}`
    };
    setChecklists(prev => [newChk, ...prev]);
  };

  const updateChecklistItem = (
    checklistId: string,
    itemId: string,
    actualResult: 'PASS' | 'FAIL' | 'N/A',
    actualValue?: number,
    notes?: string
  ) => {
    setChecklists(prev =>
      prev.map(chk => {
        if (chk.id !== checklistId) return chk;
        return {
          ...chk,
          items: chk.items.map(item => {
            if (item.id !== itemId) return item;
            return {
              ...item,
              actualResult,
              actualValue: actualValue !== undefined ? actualValue : item.actualValue,
              notes: notes !== undefined ? notes : item.notes
            };
          })
        };
      })
    );
  };

  const addInspectionRecord = (record: Omit<InspectionRecord, 'id' | 'inspectionNumber'>) => {
    const count = inspections.length + 1;
    const newRecord: InspectionRecord = {
      ...record,
      id: `INSP-${Date.now().toString().slice(-4)}`,
      inspectionNumber: `INSP-2024-${String(count + 92).padStart(4, '0')}`
    };
    setInspections(prev => [newRecord, ...prev]);
  };

  const addMaterialTestReport = (report: Omit<MaterialTestReport, 'id' | 'reportNumber'>) => {
    const count = materialTests.length + 1;
    const newReport: MaterialTestReport = {
      ...report,
      id: `MTR-${Date.now().toString().slice(-4)}`,
      reportNumber: `MTR-LAB-2024-${String(count + 420).padStart(4, '0')}`
    };
    setMaterialTests(prev => [newReport, ...prev]);
  };

  const addNCR = (ncr: Omit<NonConformanceReport, 'id' | 'ncrNumber'>) => {
    const count = ncrs.length + 1;
    const newNcr: NonConformanceReport = {
      ...ncr,
      id: `NCR-${Date.now().toString().slice(-4)}`,
      ncrNumber: `NCR-2024-${String(count + 36).padStart(4, '0')}`
    };
    setNcrs(prev => [newNcr, ...prev]);
  };

  const updateNCRStatus = (ncrId: string, status: NCRStatus, disposition?: MRBDisposition, mrbNotes?: string) => {
    setNcrs(prev =>
      prev.map(n => {
        if (n.id !== ncrId) return n;
        return {
          ...n,
          status,
          mrbDisposition: disposition || n.mrbDisposition,
          mrbDecisionNotes: mrbNotes || n.mrbDecisionNotes,
          closedDate: status === 'CLOSED' ? new Date().toISOString().split('T')[0] : n.closedDate
        };
      })
    );
  };

  const addCAPA = (capa: Omit<CAPARecord, 'id' | 'capaNumber'>) => {
    const count = capas.length + 1;
    const newCapa: CAPARecord = {
      ...capa,
      id: `CAPA-${Date.now().toString().slice(-4)}`,
      capaNumber: `CAPA-2024-${String(count + 14).padStart(4, '0')}`
    };
    setCapas(prev => [newCapa, ...prev]);
  };

  const updateCAPAStatus = (capaId: string, status: CAPAStatus) => {
    setCapas(prev =>
      prev.map(c => {
        if (c.id !== capaId) return c;
        return {
          ...c,
          status,
          actualCompletionDate: status === 'CLOSED' ? new Date().toISOString().split('T')[0] : c.actualCompletionDate
        };
      })
    );
  };

  const toggleCAPAActionItem = (capaId: string, actionId: string) => {
    setCapas(prev =>
      prev.map(c => {
        if (c.id !== capaId) return c;
        return {
          ...c,
          actionItems: c.actionItems.map(act => {
            if (act.id !== actionId) return act;
            return { ...act, completed: !act.completed };
          })
        };
      })
    );
  };

  const updateNcrDisposition = (ncrId: string, disposition: MRBDisposition, mrbNotes?: string) => {
    updateNCRStatus(ncrId, 'DISPOSITIONED', disposition, mrbNotes);
  };

  const addFmeaItem = (fmea: Omit<FMEARiskEntry, 'id' | 'calculatedRpn'>) => {
    const calculatedRpn = fmea.severityScore * fmea.occurrenceScore * fmea.detectionScore;
    const newEntry: FMEARiskEntry = {
      ...fmea,
      id: `FMEA-${Date.now().toString().slice(-4)}`,
      calculatedRpn
    };
    setFmeas(prev => [newEntry, ...prev]);
  };

  const addSupplierScorecard = (scorecard: SupplierQualityScorecard) => {
    setSupplierScorecards(prev => {
      const idx = prev.findIndex(s => s.supplierId === scorecard.supplierId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = scorecard;
        return copy;
      }
      return [scorecard, ...prev];
    });
  };

  const addAudit = (audit: Omit<QualityAudit, 'id' | 'auditNumber'>) => {
    const count = audits.length + 1;
    const newAudit: QualityAudit = {
      ...audit,
      id: `AUD-${Date.now().toString().slice(-4)}`,
      auditNumber: `AUD-2024-${String(count + 20).padStart(4, '0')}`
    };
    setAudits(prev => [newAudit, ...prev]);
  };

  const addCertificate = (cert: Omit<QualityCertificate, 'id'>) => {
    const newCert: QualityCertificate = {
      ...cert,
      id: `CERT-${Date.now().toString().slice(-4)}`
    };
    setCertificates(prev => [newCert, ...prev]);
  };

  const runAIDiagnostics = () => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const freshInsights: QualityAIInsight[] = [
      {
        id: `INS-GEN-${Date.now()}`,
        type: 'ALERT',
        title: `Live QMS Telemetry Scan (${timestamp})`,
        description: `Evaluated ${inspections.length} inspection lots and ${ncrs.length} NCR logs. First Pass Yield stands at ${kpis.firstPassYieldPct}%. No critical safety breaches found.`,
        recommendedAction: 'Maintain current incoming sampling inspection level II for structural steel.',
        relatedEntity: 'Enterprise QMS Subsystem',
        confidenceScore: 96.2
      },
      {
        id: `INS-GEN-${Date.now() + 1}`,
        type: 'OPTIMIZATION',
        title: 'COPQ Cost Containment Opportunity',
        description: `Total estimated Cost of Poor Quality is ${currency} ${kpis.costOfPoorQualityCopq.toLocaleString()}. 74% of losses stem from supplier raw material hardness non-conformance.`,
        recommendedAction: 'Enforce pre-shipment COA verification gate in Procurement before GRN creation.',
        relatedEntity: 'Procurement & Inbound QC Gate',
        confidenceScore: 92.5
      }
    ];
    setAiInsights(freshInsights);
  };

  return (
    <QualityStoreContext.Provider
      value={{
        standards,
        policies,
        specifications,
        qualityPlans,
        inspectionPlans,
        checklists,
        samplingPlans,
        inspections,
        materialTests,
        ncrs,
        defectClassifications,
        capas,
        fmeas,
        fmeaRecords: fmeas,
        audits,
        supplierScorecards,
        certificates,
        aiInsights,
        kpis,
        kpiMetrics: kpis,
        currency,
        selectedFilterDepartment,
        setSelectedFilterDepartment,
        addStandard,
        addPolicy,
        addSpecification,
        addQualityPlan,
        addInspectionPlan,
        addChecklist,
        updateChecklistItem,
        addInspectionRecord,
        addMaterialTestReport,
        addNCR,
        addNcr: addNCR,
        updateNCRStatus,
        updateNcrDisposition,
        addCAPA,
        addCapa: addCAPA,
        updateCAPAStatus,
        toggleCAPAActionItem,
        addFmeaItem,
        addAudit,
        addSupplierScorecard,
        addCertificate,
        runAIDiagnostics
      }}
    >
      {children}
    </QualityStoreContext.Provider>
  );
};

export const useQualityStore = (): QualityStoreContextType => {
  const context = useContext(QualityStoreContext);
  if (!context) {
    throw new Error('useQualityStore must be used within a QualityProvider');
  }
  return context;
};
