import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  ItemMaster,
  ItemCategory,
  UnitOfMeasure,
  ItemAttribute,
  Warehouse,
  BinLocation,
  WarehouseZone,
  StockTransaction,
  StockTransactionLine,
  StockReturn,
  StockReturnLine,
  StockReservation,
  InventoryCount,
  InventoryCountLine,
  BatchLot,
  SerialNumberRecord,
  StockAgingBucket,
  StockMovementLedgerEntry,
  InventoryStats,
  InventoryAiRecommendation,
  TransactionType,
  ValuationMethod
} from '../types';

// ============================================================================
// INITIAL SEED DATA — OMANI ENTERPRISE OPERATIONS
// ============================================================================

const INITIAL_UOMS: UnitOfMeasure[] = [
  { code: 'PCS', name: 'Pieces', category: 'Count', isBaseUnit: true, conversionFactor: 1 },
  { code: 'BOX', name: 'Box (24 Pcs)', category: 'Packaging', isBaseUnit: false, baseUnitCode: 'PCS', conversionFactor: 24 },
  { code: 'SET', name: 'Complete Assembly Set', category: 'Count', isBaseUnit: true, conversionFactor: 1 },
  { code: 'MTR', name: 'Meters', category: 'Length', isBaseUnit: true, conversionFactor: 1 },
  { code: 'KG', name: 'Kilograms', category: 'Weight', isBaseUnit: true, conversionFactor: 1 },
  { code: 'TON', name: 'Metric Tons', category: 'Weight', isBaseUnit: false, baseUnitCode: 'KG', conversionFactor: 1000 },
  { code: 'DRUM', name: 'Chemical Drum (200L)', category: 'Volume', isBaseUnit: true, conversionFactor: 1 },
  { code: 'PALLET', name: 'Standard Industrial Pallet', category: 'Packaging', isBaseUnit: false, baseUnitCode: 'PCS', conversionFactor: 120 }
];

const INITIAL_CATEGORIES: ItemCategory[] = [
  {
    id: 'cat-valves',
    code: 'CAT-VALVES',
    name: 'Industrial Valves & Actuators',
    description: 'High-pressure ball valves, butterfly valves, gate valves, and pneumatic actuators for oil, gas, and water infrastructure.',
    defaultValuationMethod: 'FIFO',
    glAssetAccount: '1300-01 Raw Materials & Valves Inventory',
    glCogsAccount: '5000-01 Cost of Goods Sold — Mechanical',
    glInventoryAdjustmentAccount: '5200-01 Inventory Variance & Adjustments',
    taxRatePercent: 5,
    itemCount: 42
  },
  {
    id: 'cat-electrical',
    code: 'CAT-ELECTRICAL',
    name: 'Electrical, Drives & Automation',
    description: 'Variable Speed Drives (VSD), MCC panels, circuit breakers, and industrial control cables.',
    defaultValuationMethod: 'WEIGHTED_AVERAGE',
    glAssetAccount: '1300-02 Electrical & Automation Inventory',
    glCogsAccount: '5000-02 Cost of Goods Sold — Electrical',
    glInventoryAdjustmentAccount: '5200-01 Inventory Variance & Adjustments',
    taxRatePercent: 5,
    itemCount: 38
  },
  {
    id: 'cat-pipes',
    code: 'CAT-PIPES',
    name: 'Pipes, Fittings & Flanges',
    description: 'Carbon steel seamless pipes, stainless steel flanges, elbows, and gasket kits.',
    defaultValuationMethod: 'WEIGHTED_AVERAGE',
    glAssetAccount: '1300-03 Piping & Flanges Inventory',
    glCogsAccount: '5000-03 Cost of Goods Sold — Piping',
    glInventoryAdjustmentAccount: '5200-01 Inventory Variance & Adjustments',
    taxRatePercent: 5,
    itemCount: 65
  },
  {
    id: 'cat-chemicals',
    code: 'CAT-CHEMICALS',
    name: 'Industrial Chemicals & Demulsifiers',
    description: 'Drilling fluids, corrosion inhibitors, scale preventatives, and water treatment biocides.',
    defaultValuationMethod: 'FIFO',
    glAssetAccount: '1300-04 Industrial Chemicals Inventory',
    glCogsAccount: '5000-04 Cost of Goods Sold — Chemicals',
    glInventoryAdjustmentAccount: '5200-01 Inventory Variance & Adjustments',
    taxRatePercent: 5,
    itemCount: 19
  },
  {
    id: 'cat-solar',
    code: 'CAT-SOLAR',
    name: 'Solar PV & Renewable Equipment',
    description: 'Monocrystalline PV modules, grid-tied solar inverters, and battery energy storage racks.',
    defaultValuationMethod: 'FIFO',
    glAssetAccount: '1300-05 Renewable Energy Inventory',
    glCogsAccount: '5000-05 Cost of Goods Sold — Solar Energy',
    glInventoryAdjustmentAccount: '5200-01 Inventory Variance & Adjustments',
    taxRatePercent: 5,
    itemCount: 24
  },
  {
    id: 'cat-ppe',
    code: 'CAT-PPE',
    name: 'HSE, Safety Gear & Consumables',
    description: 'Fire-resistant coveralls, safety boots, gas detectors, helmets, and welding PPE.',
    defaultValuationMethod: 'STANDARD_COST',
    glAssetAccount: '1300-06 HSE Consumables Inventory',
    glCogsAccount: '5000-06 Cost of Goods Sold — Consumables',
    glInventoryAdjustmentAccount: '5200-01 Inventory Variance & Adjustments',
    taxRatePercent: 5,
    itemCount: 52
  }
];

const INITIAL_ATTRIBUTES: ItemAttribute[] = [
  { id: 'attr-1', attributeKey: 'pressureRating', attributeLabel: 'Pressure Rating (ANSI Class)', dataType: 'SELECT', options: ['Class 150', 'Class 300', 'Class 600', 'Class 900', 'Class 1500', 'Class 2500'], isRequired: false },
  { id: 'attr-2', attributeKey: 'materialGrade', attributeLabel: 'Material Metallurgy Grade', dataType: 'STRING', isRequired: true },
  { id: 'attr-3', attributeKey: 'voltageRating', attributeLabel: 'Voltage Rating (V / kV)', dataType: 'STRING', isRequired: false },
  { id: 'attr-4', attributeKey: 'storageTemp', attributeLabel: 'Recommended Storage Temperature Range', dataType: 'STRING', isRequired: false },
  { id: 'attr-5', attributeKey: 'unHazmatCode', attributeLabel: 'UN HazMat Classification', dataType: 'STRING', isRequired: false },
  { id: 'attr-6', attributeKey: 'certStandard', attributeLabel: 'Compliance Certification Standard (API, IEC, ISO)', dataType: 'STRING', isRequired: true }
];

const INITIAL_WAREHOUSES: Warehouse[] = [
  {
    id: 'wh-rusayl',
    code: 'WH-RSL-01',
    name: 'Rusayl Central Distribution Hub',
    type: 'CENTRAL_HUB',
    location: 'Rusayl Industrial Estate, Phase 2, Muscat',
    governorate: 'Muscat',
    address: 'Plot 410-412, Way 5012, Rusayl, Sultanate of Oman',
    managerName: 'Salim Al-Harthy (Warehouse Operations Director)',
    managerPhone: '+968 2444 8900',
    managerEmail: 's.alharthy@artifyerp.om',
    totalFloorAreaSqm: 18500,
    totalStorageCapacityCbm: 42000,
    totalPalletPositions: 6500,
    occupiedPalletPositions: 5120,
    utilizationPercent: 78.8,
    zones: [
      { id: 'z-rsl-bulk', warehouseId: 'wh-rusayl', code: 'RSL-Z1-BULK', name: 'Heavy Industrial Bulk Storage', zoneType: 'BULK_STORAGE', isHazMatCertified: false, totalBins: 2400, occupiedBins: 1980 },
      { id: 'z-rsl-fast', warehouseId: 'wh-rusayl', code: 'RSL-Z2-FAST', name: 'High-Velocity Picking Mezzanine', zoneType: 'FAST_PICK', isHazMatCertified: false, totalBins: 1800, occupiedBins: 1450 },
      { id: 'z-rsl-cold', warehouseId: 'wh-rusayl', code: 'RSL-Z3-COLD', name: 'Climate-Controlled Electronics & Seals', zoneType: 'COLD_STORAGE', temperatureRangeCelsius: '18°C - 24°C', isHazMatCertified: false, totalBins: 1200, occupiedBins: 920 },
      { id: 'z-rsl-qc', warehouseId: 'wh-rusayl', code: 'RSL-Z4-QC', name: 'Quality Inspection & Quarantine Hold', zoneType: 'QUARANTINE_QC', isHazMatCertified: false, totalBins: 600, occupiedBins: 280 }
    ],
    isActive: true,
    allowsDirectShipping: true,
    glLocationCode: 'LOC-101-RSL'
  },
  {
    id: 'wh-sohar',
    code: 'WH-SOH-02',
    name: 'Sohar Freezone Logistics Terminal',
    type: 'REGIONAL_DEPOT',
    location: 'Sohar Port & Freezone, Al Batinah North',
    governorate: 'Al Batinah North',
    address: 'Zone 4, Terminal West, Sohar Freezone, Oman',
    managerName: 'Khalfan Al-Mamari (Logistics Superintendent)',
    managerPhone: '+968 2685 4100',
    managerEmail: 'k.almamari@artifyerp.om',
    totalFloorAreaSqm: 14000,
    totalStorageCapacityCbm: 31000,
    totalPalletPositions: 4800,
    occupiedPalletPositions: 3790,
    utilizationPercent: 79.0,
    zones: [
      { id: 'z-soh-bulk', warehouseId: 'wh-sohar', code: 'SOH-Z1-BULK', name: 'Bonded Port Pallet Racking', zoneType: 'BULK_STORAGE', isHazMatCertified: false, totalBins: 2200, occupiedBins: 1780 },
      { id: 'z-soh-haz', warehouseId: 'wh-sohar', code: 'SOH-Z2-HAZ', name: 'Certified HazMat Chemical Bunker', zoneType: 'HAZMAT_BUNKER', temperatureRangeCelsius: '20°C - 28°C', isHazMatCertified: true, totalBins: 1100, occupiedBins: 840 },
      { id: 'z-soh-stg', warehouseId: 'wh-sohar', code: 'SOH-Z3-STG', name: 'Export Container Cross-Dock Staging', zoneType: 'STAGING_RECEIVING', isHazMatCertified: false, totalBins: 1500, occupiedBins: 1170 }
    ],
    isActive: true,
    allowsDirectShipping: true,
    glLocationCode: 'LOC-102-SOH'
  },
  {
    id: 'wh-duqm',
    code: 'WH-DQM-03',
    name: 'Duqm EPC Project Staging Yard',
    type: 'EPC_STAGING_YARD',
    location: 'Special Economic Zone at Duqm (SEZAD), Al Wusta',
    governorate: 'Al Wusta',
    address: 'Heavy Industrial Zone, SEZAD Yard 14, Duqm, Oman',
    managerName: 'Eng. Rashid Al-Junaibi (Project Materials Lead)',
    managerPhone: '+968 2521 3300',
    managerEmail: 'r.aljunaibi@artifyerp.om',
    totalFloorAreaSqm: 22000,
    totalStorageCapacityCbm: 48000,
    totalPalletPositions: 7200,
    occupiedPalletPositions: 5180,
    utilizationPercent: 71.9,
    zones: [
      { id: 'z-dqm-yard', warehouseId: 'wh-duqm', code: 'DQM-Z1-YARD', name: 'Heavy EPC Structural Steel & Pipe Yard', zoneType: 'BULK_STORAGE', isHazMatCertified: false, totalBins: 3800, occupiedBins: 2900 },
      { id: 'z-dqm-rec', warehouseId: 'wh-duqm', code: 'DQM-Z2-REC', name: 'Direct Vessel Receiving Staging Dock', zoneType: 'STAGING_RECEIVING', isHazMatCertified: false, totalBins: 2000, occupiedBins: 1350 },
      { id: 'z-dqm-qc', warehouseId: 'wh-duqm', code: 'DQM-Z3-QC', name: 'Third-Party NDT & QC Holding Bay', zoneType: 'QUARANTINE_QC', isHazMatCertified: false, totalBins: 1400, occupiedBins: 930 }
    ],
    isActive: true,
    allowsDirectShipping: false,
    glLocationCode: 'LOC-103-DQM'
  },
  {
    id: 'wh-salalah',
    code: 'WH-SLL-04',
    name: 'Salalah Regional Logistics Center',
    type: 'REGIONAL_DEPOT',
    location: 'Raysut Industrial City, Salalah, Dhofar',
    governorate: 'Dhofar',
    address: 'Block B, Raysut Freezone, Salalah, Sultanate of Oman',
    managerName: 'Tariq Al-Shanfari (Southern Region Logistics Head)',
    managerPhone: '+968 2321 9020',
    managerEmail: 't.alshanfari@artifyerp.om',
    totalFloorAreaSqm: 9500,
    totalStorageCapacityCbm: 20000,
    totalPalletPositions: 3200,
    occupiedPalletPositions: 2280,
    utilizationPercent: 71.3,
    zones: [
      { id: 'z-sll-bulk', warehouseId: 'wh-salalah', code: 'SLL-Z1-BULK', name: 'General Spare Parts & Racking', zoneType: 'BULK_STORAGE', isHazMatCertified: false, totalBins: 1800, occupiedBins: 1320 },
      { id: 'z-sll-cold', warehouseId: 'wh-salalah', code: 'SLL-Z2-COLD', name: 'Southern Monsoon Climate Cold Storage', zoneType: 'COLD_STORAGE', temperatureRangeCelsius: '16°C - 22°C', isHazMatCertified: false, totalBins: 1400, occupiedBins: 960 }
    ],
    isActive: true,
    allowsDirectShipping: true,
    glLocationCode: 'LOC-104-SLL'
  },
  {
    id: 'wh-marmul',
    code: 'WH-MRL-05',
    name: 'Marmul Oilfield Transit Facility',
    type: 'TRANSIT_FACILITY',
    location: 'PDO South Oilfield Concession, Marmul',
    governorate: 'Dhofar',
    address: 'Main Contractor Support Depot, PDO Marmul Gate 3',
    managerName: 'Humaid Al-Mahri (Field Dispatch Coordinator)',
    managerPhone: '+968 2437 1144',
    managerEmail: 'h.almahri@artifyerp.om',
    totalFloorAreaSqm: 6500,
    totalStorageCapacityCbm: 14000,
    totalPalletPositions: 2100,
    occupiedPalletPositions: 1720,
    utilizationPercent: 81.9,
    zones: [
      { id: 'z-mrl-trans', warehouseId: 'wh-marmul', code: 'MRL-Z1-TRANS', name: 'Rig Dispatch Cross-Dock Staging', zoneType: 'DISPATCH_DOCK', isHazMatCertified: false, totalBins: 1200, occupiedBins: 1010 },
      { id: 'z-mrl-spares', warehouseId: 'wh-marmul', code: 'MRL-Z2-SPARES', name: 'Emergency Drilling Spares Bunker', zoneType: 'BULK_STORAGE', isHazMatCertified: false, totalBins: 900, occupiedBins: 710 }
    ],
    isActive: true,
    allowsDirectShipping: false,
    glLocationCode: 'LOC-105-MRL'
  }
];

const INITIAL_BINS: BinLocation[] = [
  {
    id: 'bin-rsl-a01-r01-s1',
    warehouseId: 'wh-rusayl',
    warehouseCode: 'WH-RSL-01',
    zoneId: 'z-rsl-bulk',
    zoneCode: 'RSL-Z1-BULK',
    binCode: 'RSL-Z1-A01-R01-S1',
    aisle: 'A01',
    rack: 'R01',
    shelf: 'S1',
    position: 'P01',
    barcode: 'BIN-RSL-01-01-1',
    maxWeightKg: 2500,
    currentWeightKg: 1850,
    maxVolumeCbm: 4.8,
    currentVolumeCbm: 3.6,
    maxPalletCount: 2,
    currentPalletCount: 2,
    isBlocked: false,
    isQuarantine: false,
    occupancyPercent: 75,
    storedItems: [
      { sku: 'SKU-VLV-99201', itemName: 'High-Pressure Ball Valve 6" CL600 API-6D', batchNumber: 'LOT-2026-VLV-8812', quantity: 24, uom: 'PCS' }
    ]
  },
  {
    id: 'bin-rsl-a02-r03-s2',
    warehouseId: 'wh-rusayl',
    warehouseCode: 'WH-RSL-01',
    zoneId: 'z-rsl-cold',
    zoneCode: 'RSL-Z3-COLD',
    binCode: 'RSL-Z3-A02-R03-S2',
    aisle: 'A02',
    rack: 'R03',
    shelf: 'S2',
    position: 'P02',
    barcode: 'BIN-RSL-03-02-2',
    maxWeightKg: 1200,
    currentWeightKg: 890,
    maxVolumeCbm: 3.2,
    currentVolumeCbm: 2.8,
    maxPalletCount: 1,
    currentPalletCount: 1,
    isBlocked: false,
    isQuarantine: false,
    occupancyPercent: 87.5,
    storedItems: [
      { sku: 'SKU-VSD-44102', itemName: 'Variable Speed Drive (VSD) 75kW 415V IP54', batchNumber: 'LOT-2026-VSD-0199', quantity: 12, uom: 'PCS' }
    ]
  },
  {
    id: 'bin-soh-b04-r02-s1',
    warehouseId: 'wh-sohar',
    warehouseCode: 'WH-SOH-02',
    zoneId: 'z-soh-haz',
    zoneCode: 'SOH-Z2-HAZ',
    binCode: 'SOH-Z2-B04-R02-S1',
    aisle: 'B04',
    rack: 'R02',
    shelf: 'S1',
    position: 'P01',
    barcode: 'BIN-SOH-02-04-1',
    maxWeightKg: 3000,
    currentWeightKg: 2400,
    maxVolumeCbm: 5.0,
    currentVolumeCbm: 4.2,
    maxPalletCount: 4,
    currentPalletCount: 3,
    isBlocked: false,
    isQuarantine: false,
    occupancyPercent: 84,
    storedItems: [
      { sku: 'SKU-CHM-11045', itemName: 'Oilfield Emulsion Breaker & Demulsifier Compound', batchNumber: 'LOT-2026-CHM-7731', quantity: 16, uom: 'DRUM' }
    ]
  },
  {
    id: 'bin-dqm-p08-r01-s1',
    warehouseId: 'wh-duqm',
    warehouseCode: 'WH-DQM-03',
    zoneId: 'z-dqm-yard',
    zoneCode: 'DQM-Z1-YARD',
    binCode: 'DQM-Z1-P08-R01-S1',
    aisle: 'P08',
    rack: 'R01',
    shelf: 'S1',
    position: 'P01',
    barcode: 'BIN-DQM-01-08-1',
    maxWeightKg: 8000,
    currentWeightKg: 6200,
    maxVolumeCbm: 12.0,
    currentVolumeCbm: 9.8,
    maxPalletCount: 6,
    currentPalletCount: 5,
    isBlocked: false,
    isQuarantine: false,
    occupancyPercent: 81.7,
    storedItems: [
      { sku: 'SKU-PIP-55019', itemName: 'Seamless Carbon Steel Pipe 12" SCH40 ASTM A106 Gr.B', batchNumber: 'LOT-2026-PIP-3021', quantity: 180, uom: 'MTR' }
    ]
  },
  {
    id: 'bin-rsl-qc-q01-s1',
    warehouseId: 'wh-rusayl',
    warehouseCode: 'WH-RSL-01',
    zoneId: 'z-rsl-qc',
    zoneCode: 'RSL-Z4-QC',
    binCode: 'RSL-Z4-Q01-R01-S1',
    aisle: 'Q01',
    rack: 'R01',
    shelf: 'S1',
    position: 'P01',
    barcode: 'BIN-RSL-04-01-1',
    maxWeightKg: 2000,
    currentWeightKg: 450,
    maxVolumeCbm: 4.0,
    currentVolumeCbm: 1.2,
    maxPalletCount: 2,
    currentPalletCount: 1,
    isBlocked: false,
    isQuarantine: true,
    occupancyPercent: 30,
    storedItems: [
      { sku: 'SKU-VLV-99201', itemName: 'High-Pressure Ball Valve 6" CL600 API-6D', batchNumber: 'LOT-2026-RET-901', quantity: 4, uom: 'PCS' }
    ]
  }
];

const INITIAL_ITEMS: ItemMaster[] = [
  {
    id: 'itm-01',
    sku: 'SKU-VLV-99201',
    name: 'High-Pressure Ball Valve 6" CL600 API-6D Trunnion Mounted',
    description: 'Forged carbon steel A105 body, 316SS trim, RTJ flanged ends, NACE MR0175 compliant for sour gas service.',
    categoryId: 'cat-valves',
    categoryName: 'Industrial Valves & Actuators',
    itemType: 'FINISHED_GOOD',
    baseUom: 'PCS',
    purchaseUom: 'PCS',
    salesUom: 'PCS',
    barcode: '6291104882019',
    valuationMethod: 'FIFO',
    defaultWarehouseId: 'wh-rusayl',
    defaultBinLocationId: 'bin-rsl-a01-r01-s1',
    unitCostOMR: 420.00,
    standardCostOMR: 415.00,
    weightedAvgCostOMR: 418.50,
    sellingPriceOMR: 620.00,
    totalStockOnHand: 148,
    totalReservedStock: 35,
    totalAvailableStock: 109,
    totalInTransitStock: 20,
    totalQuarantineStock: 4,
    reorderPoint: 40,
    safetyStock: 25,
    minStockLevel: 20,
    maxStockLevel: 250,
    economicOrderQty: 50,
    leadTimeDays: 28,
    isBatchManaged: true,
    isSerialManaged: true,
    isExpiryTracked: false,
    storageTempCelsius: 'Ambient (-10°C to +50°C)',
    hazardClass: 'Non-Hazardous',
    countryOfOrigin: 'Italy / Oman Assembly',
    hsCode: '8481.80.30',
    status: 'ACTIVE',
    customAttributes: {
      pressureRating: 'Class 600',
      materialGrade: 'ASTM A105 / 316SS Trim',
      certStandard: 'API-6D & ISO 15848-1'
    },
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-08-15T11:30:00Z'
  },
  {
    id: 'itm-02',
    sku: 'SKU-VSD-44102',
    name: 'Variable Speed Drive (VSD) 75kW 415V 3-Phase Heavy Duty',
    description: 'Vector control inverter with built-in EMC filter, Profinet communications module, and tropicalized conformal coating.',
    categoryId: 'cat-electrical',
    categoryName: 'Electrical, Drives & Automation',
    itemType: 'FINISHED_GOOD',
    baseUom: 'PCS',
    purchaseUom: 'PCS',
    salesUom: 'PCS',
    barcode: '6291104441024',
    valuationMethod: 'WEIGHTED_AVERAGE',
    defaultWarehouseId: 'wh-rusayl',
    defaultBinLocationId: 'bin-rsl-a02-r03-s2',
    unitCostOMR: 1850.00,
    standardCostOMR: 1800.00,
    weightedAvgCostOMR: 1842.00,
    sellingPriceOMR: 2650.00,
    totalStockOnHand: 34,
    totalReservedStock: 8,
    totalAvailableStock: 26,
    totalInTransitStock: 5,
    totalQuarantineStock: 0,
    reorderPoint: 12,
    safetyStock: 8,
    minStockLevel: 6,
    maxStockLevel: 60,
    economicOrderQty: 15,
    leadTimeDays: 35,
    isBatchManaged: true,
    isSerialManaged: true,
    isExpiryTracked: false,
    storageTempCelsius: '18°C - 24°C (Climate Controlled)',
    hazardClass: 'Non-Hazardous',
    countryOfOrigin: 'Germany',
    hsCode: '8504.40.90',
    status: 'ACTIVE',
    customAttributes: {
      voltageRating: '415V 3-Phase 50Hz',
      materialGrade: 'IP54 Enclosure with Conformal 3C3',
      certStandard: 'IEC 61800-5-1'
    },
    createdAt: '2026-01-15T09:15:00Z',
    updatedAt: '2026-08-16T14:20:00Z'
  },
  {
    id: 'itm-03',
    sku: 'SKU-PIP-55019',
    name: 'Seamless Carbon Steel Pipe 12" SCH40 ASTM A106 Gr.B 12m',
    description: 'High-temperature seamless pipe with 3LPE external anti-corrosion coating for refinery oilfield transit lines.',
    categoryId: 'cat-pipes',
    categoryName: 'Pipes, Fittings & Flanges',
    itemType: 'RAW_MATERIAL',
    baseUom: 'MTR',
    purchaseUom: 'TON',
    salesUom: 'MTR',
    barcode: '6291105501991',
    valuationMethod: 'WEIGHTED_AVERAGE',
    defaultWarehouseId: 'wh-duqm',
    defaultBinLocationId: 'bin-dqm-p08-r01-s1',
    unitCostOMR: 48.50,
    standardCostOMR: 47.00,
    weightedAvgCostOMR: 48.20,
    sellingPriceOMR: 72.00,
    totalStockOnHand: 2400,
    totalReservedStock: 650,
    totalAvailableStock: 1750,
    totalInTransitStock: 300,
    totalQuarantineStock: 0,
    reorderPoint: 800,
    safetyStock: 500,
    minStockLevel: 400,
    maxStockLevel: 4500,
    economicOrderQty: 1000,
    leadTimeDays: 45,
    isBatchManaged: true,
    isSerialManaged: false,
    isExpiryTracked: false,
    storageTempCelsius: 'Outdoor Staging Yard',
    hazardClass: 'Non-Hazardous',
    countryOfOrigin: 'Sultanate of Oman (Sohar Pipe Mill)',
    hsCode: '7304.19.00',
    status: 'ACTIVE',
    customAttributes: {
      materialGrade: 'ASTM A106 Grade B / API 5L X52',
      pressureRating: 'SCH 40 / 600 PSI',
      certStandard: 'EN 10204 3.1 MTR'
    },
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-08-18T09:45:00Z'
  },
  {
    id: 'itm-04',
    sku: 'SKU-CHM-11045',
    name: 'Oilfield Emulsion Breaker & Demulsifier Compound 200L Drum',
    description: 'High-performance surfactant blend formulated for rapid crude-oil water separation in Omani heavy oil reservoirs.',
    categoryId: 'cat-chemicals',
    categoryName: 'Industrial Chemicals & Demulsifiers',
    itemType: 'RAW_MATERIAL',
    baseUom: 'DRUM',
    purchaseUom: 'DRUM',
    salesUom: 'DRUM',
    barcode: '6291101104508',
    valuationMethod: 'FIFO',
    defaultWarehouseId: 'wh-sohar',
    defaultBinLocationId: 'bin-soh-b04-r02-s1',
    unitCostOMR: 380.00,
    standardCostOMR: 375.00,
    weightedAvgCostOMR: 378.00,
    sellingPriceOMR: 540.00,
    totalStockOnHand: 112,
    totalReservedStock: 40,
    totalAvailableStock: 72,
    totalInTransitStock: 25,
    totalQuarantineStock: 0,
    reorderPoint: 50,
    safetyStock: 30,
    minStockLevel: 25,
    maxStockLevel: 250,
    economicOrderQty: 60,
    leadTimeDays: 21,
    isBatchManaged: true,
    isSerialManaged: false,
    isExpiryTracked: true,
    shelfLifeDays: 540,
    storageTempCelsius: '20°C - 28°C (HazMat Bunker)',
    hazardClass: 'UN 1993 Flammable Liquid Class 3',
    countryOfOrigin: 'United Kingdom / Oman Blending',
    hsCode: '3824.99.90',
    status: 'ACTIVE',
    customAttributes: {
      unHazmatCode: 'UN 1993 PG III',
      storageTemp: 'Ventilated Fireproof HazMat Store',
      certStandard: 'PDO SP-1190 & ISO 9001'
    },
    createdAt: '2026-02-12T11:20:00Z',
    updatedAt: '2026-08-19T16:10:00Z'
  },
  {
    id: 'itm-05',
    sku: 'SKU-SLR-77033',
    name: 'Bifacial Solar PV Module 580W N-Type TOPCon Double Glass',
    description: 'High-efficiency 22.5% photovoltaic panel designed for high ambient temperatures and desert sand abrasion.',
    categoryId: 'cat-solar',
    categoryName: 'Solar PV & Renewable Equipment',
    itemType: 'FINISHED_GOOD',
    baseUom: 'PCS',
    purchaseUom: 'PALLET',
    salesUom: 'PCS',
    barcode: '6291107703312',
    valuationMethod: 'FIFO',
    defaultWarehouseId: 'wh-rusayl',
    defaultBinLocationId: 'bin-rsl-a01-r01-s1',
    unitCostOMR: 44.00,
    standardCostOMR: 42.00,
    weightedAvgCostOMR: 43.50,
    sellingPriceOMR: 68.00,
    totalStockOnHand: 1850,
    totalReservedStock: 600,
    totalAvailableStock: 1250,
    totalInTransitStock: 400,
    totalQuarantineStock: 0,
    reorderPoint: 500,
    safetyStock: 300,
    minStockLevel: 250,
    maxStockLevel: 4000,
    economicOrderQty: 800,
    leadTimeDays: 40,
    isBatchManaged: true,
    isSerialManaged: true,
    isExpiryTracked: false,
    storageTempCelsius: 'Covered Dry Warehouse',
    hazardClass: 'Non-Hazardous',
    countryOfOrigin: 'China / Oman Assembly',
    hsCode: '8541.43.00',
    status: 'ACTIVE',
    customAttributes: {
      voltageRating: 'Voc 51.4V / Isc 14.3A',
      materialGrade: 'Anodized Aluminum Frame IP68 Box',
      certStandard: 'IEC 61215 / IEC 61730 Desert Rated'
    },
    createdAt: '2026-03-05T08:30:00Z',
    updatedAt: '2026-08-17T12:00:00Z'
  },
  {
    id: 'itm-06',
    sku: 'SKU-PPE-33012',
    name: 'Fire-Retardant Anti-Static Coverall 220 GSM Nomex III A',
    description: 'Offshore oilfield certified arc-flash and flash-fire protective workwear with reflective high-visibility tape.',
    categoryId: 'cat-ppe',
    categoryName: 'HSE, Safety Gear & Consumables',
    itemType: 'CONSUMABLE',
    baseUom: 'PCS',
    purchaseUom: 'BOX',
    salesUom: 'PCS',
    barcode: '6291103301288',
    valuationMethod: 'STANDARD_COST',
    defaultWarehouseId: 'wh-rusayl',
    defaultBinLocationId: 'bin-rsl-a02-r03-s2',
    unitCostOMR: 26.50,
    standardCostOMR: 25.00,
    weightedAvgCostOMR: 26.20,
    sellingPriceOMR: 38.00,
    totalStockOnHand: 620,
    totalReservedStock: 150,
    totalAvailableStock: 470,
    totalInTransitStock: 100,
    totalQuarantineStock: 0,
    reorderPoint: 200,
    safetyStock: 120,
    minStockLevel: 100,
    maxStockLevel: 1200,
    economicOrderQty: 300,
    leadTimeDays: 14,
    isBatchManaged: true,
    isSerialManaged: false,
    isExpiryTracked: false,
    storageTempCelsius: 'Standard Dry Racking',
    hazardClass: 'Non-Hazardous',
    countryOfOrigin: 'Sultanate of Oman (Nizwa Garments)',
    hsCode: '6201.90.00',
    status: 'ACTIVE',
    customAttributes: {
      materialGrade: '93% Nomex / 5% Kevlar / 2% Carbon',
      certStandard: 'NFPA 2112 & EN ISO 11612'
    },
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-08-19T08:15:00Z'
  },
  {
    id: 'itm-07',
    sku: 'SKU-FLG-88091',
    name: 'Weld Neck Flange 8" Class 300 Raised Face A105N',
    description: 'Forged carbon steel flange normalized with serrated spiral finish 125-250 AARH for oilfield piping headers.',
    categoryId: 'cat-pipes',
    categoryName: 'Pipes, Fittings & Flanges',
    itemType: 'RAW_MATERIAL',
    baseUom: 'PCS',
    purchaseUom: 'BOX',
    salesUom: 'PCS',
    barcode: '6291108809105',
    valuationMethod: 'WEIGHTED_AVERAGE',
    defaultWarehouseId: 'wh-sohar',
    defaultBinLocationId: 'bin-soh-b04-r02-s1',
    unitCostOMR: 85.00,
    standardCostOMR: 82.00,
    weightedAvgCostOMR: 84.50,
    sellingPriceOMR: 128.00,
    totalStockOnHand: 310,
    totalReservedStock: 80,
    totalAvailableStock: 230,
    totalInTransitStock: 50,
    totalQuarantineStock: 0,
    reorderPoint: 100,
    safetyStock: 60,
    minStockLevel: 50,
    maxStockLevel: 600,
    economicOrderQty: 150,
    leadTimeDays: 24,
    isBatchManaged: true,
    isSerialManaged: false,
    isExpiryTracked: false,
    storageTempCelsius: 'Covered Warehouse Racking',
    hazardClass: 'Non-Hazardous',
    countryOfOrigin: 'Spain',
    hsCode: '7307.91.00',
    status: 'ACTIVE',
    customAttributes: {
      materialGrade: 'ASTM A105N Normalized',
      pressureRating: 'ASME B16.5 Class 300 RF',
      certStandard: 'EN 10204 3.1 & NACE MR0175'
    },
    createdAt: '2026-02-18T14:30:00Z',
    updatedAt: '2026-08-18T16:00:00Z'
  }
];

const INITIAL_TRANSACTIONS: StockTransaction[] = [
  {
    id: 'st-01',
    transactionNumber: 'ST-2026-00891',
    type: 'STOCK_TRANSFER',
    status: 'POSTED',
    transactionDate: '2026-08-18',
    postingDate: '2026-08-18',
    sourceDocumentType: 'INTERNAL_REQUISITION',
    sourceDocumentNumber: 'TR-2026-0412',
    fromWarehouseId: 'wh-rusayl',
    fromWarehouseName: 'Rusayl Central Distribution Hub',
    toWarehouseId: 'wh-duqm',
    toWarehouseName: 'Duqm EPC Project Staging Yard',
    carrierName: 'Oman National Transport & Heavy Haulage',
    driverName: 'Mohammed Al-Balushi',
    vehicleNo: 'OM-HVY-9921-A',
    waybillNumber: 'WB-OM-2026-904',
    totalQuantity: 20,
    totalValueOMR: 8400.00,
    notes: 'Urgent transfer of High-Pressure Ball Valves for Duqm Refinery Phase 2 installation.',
    approvedBy: 'Salim Al-Harthy',
    approvedAt: '2026-08-18T09:30:00Z',
    createdBy: 'Nasser Al-Rawahi',
    createdAt: '2026-08-18T08:15:00Z',
    lines: [
      {
        id: 'stl-01',
        itemId: 'itm-01',
        sku: 'SKU-VLV-99201',
        itemName: 'High-Pressure Ball Valve 6" CL600 API-6D',
        uom: 'PCS',
        quantity: 20,
        unitCostOMR: 420.00,
        totalCostOMR: 8400.00,
        fromWarehouseId: 'wh-rusayl',
        fromBinCode: 'RSL-Z1-A01-R01-S1',
        toWarehouseId: 'wh-duqm',
        toBinCode: 'DQM-Z1-P08-R01-S1',
        batchNumber: 'LOT-2026-VLV-8812',
        remarks: 'Transfer dispatch for Duqm project tie-in'
      }
    ]
  },
  {
    id: 'st-02',
    transactionNumber: 'ST-2026-00892',
    type: 'GOODS_RECEIPT',
    status: 'POSTED',
    transactionDate: '2026-08-19',
    postingDate: '2026-08-19',
    sourceDocumentType: 'PURCHASE_ORDER',
    sourceDocumentNumber: 'PO-2026-0811',
    toWarehouseId: 'wh-rusayl',
    toWarehouseName: 'Rusayl Central Distribution Hub',
    carrierName: 'DHL Global Forwarding Oman',
    driverName: 'Khamis Al-Ghafri',
    vehicleNo: 'OM-TRK-4401-B',
    waybillNumber: 'WB-DHL-88912',
    totalQuantity: 12,
    totalValueOMR: 22200.00,
    notes: 'Receipt of Variable Speed Drives from Siemens Germany via Muscat Air Cargo.',
    approvedBy: 'Salim Al-Harthy',
    approvedAt: '2026-08-19T11:00:00Z',
    createdBy: 'Ahmed Al-Kharusi',
    createdAt: '2026-08-19T10:20:00Z',
    lines: [
      {
        id: 'stl-02',
        itemId: 'itm-02',
        sku: 'SKU-VSD-44102',
        itemName: 'Variable Speed Drive (VSD) 75kW 415V',
        uom: 'PCS',
        quantity: 12,
        unitCostOMR: 1850.00,
        totalCostOMR: 22200.00,
        toWarehouseId: 'wh-rusayl',
        toBinCode: 'RSL-Z3-A02-R03-S2',
        batchNumber: 'LOT-2026-VSD-0199',
        remarks: 'Received in climate controlled zone 3'
      }
    ]
  },
  {
    id: 'st-03',
    transactionNumber: 'ST-2026-00893',
    type: 'GOODS_ISSUE',
    status: 'POSTED',
    transactionDate: '2026-08-19',
    postingDate: '2026-08-19',
    sourceDocumentType: 'MAINTENANCE_WORK_ORDER',
    sourceDocumentNumber: 'WO-MAINT-2026-088',
    fromWarehouseId: 'wh-sohar',
    fromWarehouseName: 'Sohar Freezone Logistics Terminal',
    costCenter: 'CC-PLANT-MAINT-SOHAR',
    reasonCode: 'PREVENTIVE_MAINTENANCE_CONSUMPTION',
    totalQuantity: 10,
    totalValueOMR: 3800.00,
    notes: 'Issue of Chemical Demulsifiers to Sohar Desalination Plant routine treatment.',
    approvedBy: 'Khalfan Al-Mamari',
    approvedAt: '2026-08-19T14:15:00Z',
    createdBy: 'Said Al-Farsi',
    createdAt: '2026-08-19T13:40:00Z',
    lines: [
      {
        id: 'stl-03',
        itemId: 'itm-04',
        sku: 'SKU-CHM-11045',
        itemName: 'Oilfield Emulsion Breaker & Demulsifier 200L',
        uom: 'DRUM',
        quantity: 10,
        unitCostOMR: 380.00,
        totalCostOMR: 3800.00,
        fromWarehouseId: 'wh-sohar',
        fromBinCode: 'SOH-Z2-B04-R02-S1',
        batchNumber: 'LOT-2026-CHM-7731',
        remarks: 'Dosed directly to plant separator train'
      }
    ]
  },
  {
    id: 'st-04',
    transactionNumber: 'ST-2026-00894',
    type: 'STOCK_ADJUSTMENT',
    status: 'PENDING_APPROVAL',
    transactionDate: '2026-08-20',
    postingDate: '2026-08-20',
    sourceDocumentType: 'CYCLE_COUNT_VARIANCE',
    sourceDocumentNumber: 'CC-2026-Q3-01',
    fromWarehouseId: 'wh-rusayl',
    fromWarehouseName: 'Rusayl Central Distribution Hub',
    costCenter: 'CC-INVENTORY-VARIANCE',
    reasonCode: 'COUNT_DISCREPANCY_RECONCILIATION',
    totalQuantity: 2,
    totalValueOMR: 840.00,
    notes: 'Found 2 units of Ball Valve in Bin RSL-Z1-A01-R01-S1 during Q3 perpetual count.',
    createdBy: 'Nasser Al-Rawahi',
    createdAt: '2026-08-20T08:00:00Z',
    lines: [
      {
        id: 'stl-04',
        itemId: 'itm-01',
        sku: 'SKU-VLV-99201',
        itemName: 'High-Pressure Ball Valve 6" CL600 API-6D',
        uom: 'PCS',
        quantity: 2,
        unitCostOMR: 420.00,
        totalCostOMR: 840.00,
        toWarehouseId: 'wh-rusayl',
        toBinCode: 'RSL-Z1-A01-R01-S1',
        batchNumber: 'LOT-2026-VLV-8812',
        remarks: 'Inventory Gain Write-up'
      }
    ]
  },
  {
    id: 'st-05',
    transactionNumber: 'ST-2026-00001',
    type: 'OPENING_STOCK',
    status: 'POSTED',
    transactionDate: '2026-01-01',
    postingDate: '2026-01-01',
    sourceDocumentType: 'LEGACY_SYSTEM_MIGRATION',
    sourceDocumentNumber: 'MIG-2026-INV-INIT',
    toWarehouseId: 'wh-rusayl',
    toWarehouseName: 'Rusayl Central Distribution Hub',
    costCenter: 'CC-EQUITY-OPENING-BALANCE',
    reasonCode: 'INITIAL_ERP_GO_LIVE_UPLOAD',
    totalQuantity: 2500,
    totalValueOMR: 358400.00,
    notes: 'Initial inventory master balances validated by Ernst & Young audit team.',
    approvedBy: 'Finance Director (CFO)',
    approvedAt: '2026-01-01T00:00:00Z',
    createdBy: 'ERP Migration Admin',
    createdAt: '2026-01-01T00:00:00Z',
    lines: [
      {
        id: 'stl-05',
        itemId: 'itm-01',
        sku: 'SKU-VLV-99201',
        itemName: 'High-Pressure Ball Valve 6" CL600',
        uom: 'PCS',
        quantity: 120,
        unitCostOMR: 420.00,
        totalCostOMR: 50400.00,
        toWarehouseId: 'wh-rusayl',
        toBinCode: 'RSL-Z1-A01-R01-S1',
        batchNumber: 'LOT-2026-VLV-8812'
      }
    ]
  }
];

const INITIAL_RETURNS: StockReturn[] = [
  {
    id: 'ret-01',
    returnNumber: 'RET-2026-00101',
    returnType: 'SALES_RETURN',
    status: 'PENDING_INSPECTION',
    returnDate: '2026-08-19',
    partnerId: 'cust-pdo-01',
    partnerName: 'Petroleum Development Oman (PDO LLC)',
    referenceDocType: 'DELIVERY_NOTE',
    referenceDocNumber: 'DN-2026-01201',
    warehouseId: 'wh-rusayl',
    warehouseName: 'Rusayl Central Distribution Hub',
    quarantineBinCode: 'RSL-Z4-Q01-R01-S1',
    totalQuantity: 4,
    totalValueOMR: 1680.00,
    notes: 'Customer returned 4 valves due to incorrect flange RTJ gasket face specification for Marmul station.',
    createdBy: 'Rashid Al-Hajri (Customer Service Lead)',
    createdAt: '2026-08-19T09:10:00Z',
    lines: [
      {
        id: 'retl-01',
        itemId: 'itm-01',
        sku: 'SKU-VLV-99201',
        itemName: 'High-Pressure Ball Valve 6" CL600 API-6D',
        returnedQuantity: 4,
        uom: 'PCS',
        unitCostOMR: 420.00,
        totalCostOMR: 1680.00,
        batchNumber: 'LOT-2026-RET-901',
        returnReason: 'Wrong Flange Face (Ordered RF instead of RTJ)',
        inspectionDisposition: undefined
      }
    ]
  },
  {
    id: 'ret-02',
    returnNumber: 'RET-2026-00102',
    returnType: 'PURCHASE_RETURN',
    status: 'APPROVED',
    returnDate: '2026-08-17',
    partnerId: 'sup-valv-01',
    partnerName: 'Valvitalia S.p.A. (Italy)',
    referenceDocType: 'GOODS_RECEIPT_NOTE',
    referenceDocNumber: 'GRN-2026-0442',
    warehouseId: 'wh-rusayl',
    warehouseName: 'Rusayl Central Distribution Hub',
    totalQuantity: 2,
    totalValueOMR: 840.00,
    inspectedBy: 'Eng. Hamed Al-Riyami (Senior QC Inspector)',
    inspectionDate: '2026-08-17',
    debitCreditNoteRef: 'V-DN-2026-00041',
    notes: 'Rejected 2 valves failing hydrostatic pressure testing at 1.5x test bar pressure. Supplier debit note raised.',
    createdBy: 'Hamed Al-Riyami',
    createdAt: '2026-08-17T11:00:00Z',
    lines: [
      {
        id: 'retl-02',
        itemId: 'itm-01',
        sku: 'SKU-VLV-99201',
        itemName: 'High-Pressure Ball Valve 6" CL600 API-6D',
        returnedQuantity: 2,
        uom: 'PCS',
        unitCostOMR: 420.00,
        totalCostOMR: 840.00,
        batchNumber: 'LOT-2026-QC-FAIL-02',
        returnReason: 'Hydrostatic Seal Gasket Micro-Leakage Under 900 PSI',
        inspectionDisposition: 'SUPPLIER_CLAIM',
        inspectionNotes: 'Defective internal stem packing. Dispatched to vendor for replacement.',
        passedQuantity: 0,
        rejectedQuantity: 2
      }
    ]
  }
];

const INITIAL_RESERVATIONS: StockReservation[] = [
  {
    id: 'rsv-01',
    reservationNumber: 'RSV-2026-00911',
    reservationType: 'SALES_ORDER',
    referenceDocNumber: 'SO-2026-0419',
    customerIdOrProject: 'OQ Gas Networks SAOG (Project EPC-South)',
    itemId: 'itm-01',
    sku: 'SKU-VLV-99201',
    itemName: 'High-Pressure Ball Valve 6" CL600 API-6D',
    warehouseId: 'wh-rusayl',
    warehouseName: 'Rusayl Central Distribution Hub',
    binLocationCode: 'RSL-Z1-A01-R01-S1',
    reservedQuantity: 35,
    issuedQuantity: 0,
    remainingQuantity: 35,
    uom: 'PCS',
    reservedDate: '2026-08-15',
    expiryDate: '2026-09-15',
    status: 'RESERVED',
    priority: 'CRITICAL',
    createdBy: 'Sales Operations'
  },
  {
    id: 'rsv-02',
    reservationNumber: 'RSV-2026-00912',
    reservationType: 'PROJECT_STAGING',
    referenceDocNumber: 'PRJ-DQM-SOLAR-08',
    customerIdOrProject: 'Duqm 100MW Solar Farm Phase 1',
    itemId: 'itm-05',
    sku: 'SKU-SLR-77033',
    itemName: 'Bifacial Solar PV Module 580W N-Type TOPCon',
    warehouseId: 'wh-rusayl',
    warehouseName: 'Rusayl Central Distribution Hub',
    binLocationCode: 'RSL-Z1-A01-R01-S1',
    reservedQuantity: 600,
    issuedQuantity: 200,
    remainingQuantity: 400,
    uom: 'PCS',
    reservedDate: '2026-08-10',
    expiryDate: '2026-09-30',
    status: 'PARTIALLY_ISSUED',
    priority: 'HIGH',
    createdBy: 'Project EPC Materials Lead'
  }
];

const INITIAL_COUNTS: InventoryCount[] = [
  {
    id: 'cc-01',
    countNumber: 'CC-2026-Q3-01',
    title: 'Q3 Fast-Moving High-Value ABC Cycle Count',
    countType: 'CYCLE_COUNT_ABC',
    warehouseId: 'wh-rusayl',
    warehouseName: 'Rusayl Central Distribution Hub',
    zoneCode: 'RSL-Z1-BULK',
    categoryFilter: 'CAT-VALVES',
    status: 'COUNTED',
    scheduledDate: '2026-08-19',
    countStartedAt: '2026-08-19T07:00:00Z',
    countCompletedAt: '2026-08-19T17:00:00Z',
    leadAuditor: 'Nasser Al-Rawahi (Lead Warehouse Auditor)',
    counters: ['Ahmed Al-Kharusi', 'Khamis Al-Ghafri', 'Tariq Al-Fazari'],
    totalSystemItems: 146,
    totalCountedItems: 148,
    totalVariancesFound: 2,
    totalVarianceValueOMR: 840.00,
    accuracyRatePercent: 98.63,
    adjustmentTransactionId: 'st-04',
    adjustmentTransactionNumber: 'ST-2026-00894',
    notes: 'Perpetual count completed. Physical count verified 2 extra units in secondary buffer rack.',
    createdAt: '2026-08-18T14:00:00Z',
    lines: [
      {
        id: 'ccl-01',
        itemId: 'itm-01',
        sku: 'SKU-VLV-99201',
        itemName: 'High-Pressure Ball Valve 6" CL600 API-6D',
        uom: 'PCS',
        warehouseId: 'wh-rusayl',
        binLocationCode: 'RSL-Z1-A01-R01-S1',
        batchNumber: 'LOT-2026-VLV-8812',
        systemQuantity: 146,
        countedQuantity: 148,
        varianceQuantity: 2,
        unitCostOMR: 420.00,
        varianceValueOMR: 840.00,
        recountRequired: false,
        notes: 'Recount confirmed 148 physical units.'
      }
    ]
  }
];

const INITIAL_BATCHES: BatchLot[] = [
  {
    id: 'batch-01',
    batchNumber: 'LOT-2026-VLV-8812',
    itemId: 'itm-01',
    sku: 'SKU-VLV-99201',
    itemName: 'High-Pressure Ball Valve 6" CL600 API-6D',
    warehouseId: 'wh-rusayl',
    warehouseName: 'Rusayl Central Distribution Hub',
    binLocationCode: 'RSL-Z1-A01-R01-S1',
    manufacturingDate: '2026-01-05',
    supplierBatchNumber: 'VALV-IT-2026-904',
    supplierPoNumber: 'PO-2026-0219',
    millTestCertNumber: 'MTR-EN10204-3.1-99812',
    initialQuantity: 150,
    currentQuantity: 148,
    allocatedQuantity: 35,
    availableQuantity: 113,
    uom: 'PCS',
    qcStatus: 'APPROVED',
    storageConditionNote: 'Ambient dry storage. Flange protective caps installed.'
  },
  {
    id: 'batch-02',
    batchNumber: 'LOT-2026-CHM-7731',
    itemId: 'itm-04',
    sku: 'SKU-CHM-11045',
    itemName: 'Oilfield Emulsion Breaker & Demulsifier Compound',
    warehouseId: 'wh-sohar',
    warehouseName: 'Sohar Freezone Logistics Terminal',
    binLocationCode: 'SOH-Z2-B04-R02-S1',
    manufacturingDate: '2026-02-10',
    expiryDate: '2027-08-10', // 1 Year from now
    supplierBatchNumber: 'CHM-UK-77310-A',
    supplierPoNumber: 'PO-2026-0340',
    millTestCertNumber: 'COA-PDO-CHM-2026-44',
    initialQuantity: 130,
    currentQuantity: 112,
    allocatedQuantity: 40,
    availableQuantity: 72,
    uom: 'DRUM',
    qcStatus: 'APPROVED',
    storageConditionNote: 'HazMat bunker temperature controlled below 28°C.'
  },
  {
    id: 'batch-03',
    batchNumber: 'LOT-2025-CHM-1190',
    itemId: 'itm-04',
    sku: 'SKU-CHM-11045',
    itemName: 'Oilfield Emulsion Breaker & Demulsifier Compound',
    warehouseId: 'wh-salalah',
    warehouseName: 'Salalah Regional Logistics Center',
    binLocationCode: 'SLL-Z1-BULK',
    manufacturingDate: '2025-09-01',
    expiryDate: '2026-09-15', // Near expiry alert!
    supplierBatchNumber: 'CHM-UK-11900-B',
    supplierPoNumber: 'PO-2025-1102',
    initialQuantity: 40,
    currentQuantity: 12,
    allocatedQuantity: 0,
    availableQuantity: 12,
    uom: 'DRUM',
    qcStatus: 'APPROVED',
    storageConditionNote: 'Priority FEFO dispatch required before expiry.'
  }
];

const INITIAL_SERIALS: SerialNumberRecord[] = [
  {
    id: 'sn-01',
    serialNumber: 'SN-VSD-2026-00101',
    itemId: 'itm-02',
    sku: 'SKU-VSD-44102',
    itemName: 'Variable Speed Drive (VSD) 75kW 415V',
    currentWarehouseId: 'wh-rusayl',
    currentWarehouseName: 'Rusayl Central Distribution Hub',
    currentBinCode: 'RSL-Z3-A02-R03-S2',
    status: 'IN_STOCK',
    supplierPoNumber: 'PO-2026-0811',
    grnNumber: 'GRN-2026-0512',
    warrantyStartDate: '2026-08-19',
    warrantyEndDate: '2029-08-19',
    serviceHistoryCount: 0
  },
  {
    id: 'sn-02',
    serialNumber: 'SN-VSD-2026-00088',
    itemId: 'itm-02',
    sku: 'SKU-VSD-44102',
    itemName: 'Variable Speed Drive (VSD) 75kW 415V',
    status: 'DISPATCHED_TO_CUSTOMER',
    customerSoNumber: 'SO-2026-0390',
    deliveryNoteNumber: 'DN-2026-01180',
    customerName: 'Nama Water Services SAOC',
    supplierPoNumber: 'PO-2026-0410',
    grnNumber: 'GRN-2026-0380',
    warrantyStartDate: '2026-07-01',
    warrantyEndDate: '2029-07-01',
    commissioningDate: '2026-07-15',
    serviceHistoryCount: 1
  }
];

const INITIAL_AGING_BUCKETS: StockAgingBucket[] = [
  { range: '0-30 Days', skuCount: 142, totalValueOMR: 4850200, percentageOfInventory: 54.4, riskLevel: 'LOW' },
  { range: '31-60 Days', skuCount: 68, totalValueOMR: 2140500, percentageOfInventory: 24.0, riskLevel: 'LOW' },
  { range: '61-90 Days', skuCount: 32, totalValueOMR: 1050300, percentageOfInventory: 11.8, riskLevel: 'MEDIUM' },
  { range: '91-180 Days', skuCount: 18, totalValueOMR: 540200, percentageOfInventory: 6.0, riskLevel: 'MEDIUM' },
  { range: '181-365 Days', skuCount: 9, totalValueOMR: 245100, percentageOfInventory: 2.7, riskLevel: 'HIGH' },
  { range: '> 365 Days (Slow/Dead)', skuCount: 5, totalValueOMR: 94100, percentageOfInventory: 1.1, riskLevel: 'CRITICAL' }
];

const INITIAL_MOVEMENTS: StockMovementLedgerEntry[] = [
  {
    id: 'mov-01',
    timestamp: '2026-08-19 14:15:00',
    transactionNumber: 'ST-2026-00893',
    transactionType: 'GOODS_ISSUE',
    referenceDoc: 'WO-MAINT-2026-088',
    sku: 'SKU-CHM-11045',
    itemName: 'Oilfield Emulsion Breaker & Demulsifier 200L',
    warehouseName: 'Sohar Freezone Logistics Terminal',
    binCode: 'SOH-Z2-B04-R02-S1',
    quantityIn: 0,
    quantityOut: 10,
    balanceQuantity: 112,
    unitCostOMR: 380.00,
    totalMovementValueOMR: 3800.00,
    performedBy: 'Said Al-Farsi'
  },
  {
    id: 'mov-02',
    timestamp: '2026-08-19 10:20:00',
    transactionNumber: 'ST-2026-00892',
    transactionType: 'GOODS_RECEIPT',
    referenceDoc: 'PO-2026-0811',
    sku: 'SKU-VSD-44102',
    itemName: 'Variable Speed Drive (VSD) 75kW 415V',
    warehouseName: 'Rusayl Central Distribution Hub',
    binCode: 'RSL-Z3-A02-R03-S2',
    quantityIn: 12,
    quantityOut: 0,
    balanceQuantity: 34,
    unitCostOMR: 1850.00,
    totalMovementValueOMR: 22200.00,
    performedBy: 'Ahmed Al-Kharusi'
  },
  {
    id: 'mov-03',
    timestamp: '2026-08-18 08:15:00',
    transactionNumber: 'ST-2026-00891',
    transactionType: 'STOCK_TRANSFER',
    referenceDoc: 'TR-2026-0412',
    sku: 'SKU-VLV-99201',
    itemName: 'High-Pressure Ball Valve 6" CL600 API-6D',
    warehouseName: 'Rusayl Central Distribution Hub',
    binCode: 'RSL-Z1-A01-R01-S1',
    quantityIn: 0,
    quantityOut: 20,
    balanceQuantity: 148,
    unitCostOMR: 420.00,
    totalMovementValueOMR: 8400.00,
    performedBy: 'Nasser Al-Rawahi'
  }
];

const INITIAL_AI_RECOMMENDATIONS: InventoryAiRecommendation[] = [
  {
    id: 'ai-rec-01',
    type: 'STOCKOUT_PREVENTION',
    severity: 'CRITICAL',
    title: 'Stockout Risk: High-Pressure Ball Valves (SKU-VLV-99201)',
    description: 'Current available stock is 109 PCS. With open project reservations of 35 PCS and anticipated PDO tender award of 90 PCS, inventory will breach safety stock (25 PCS) in 12 days.',
    suggestedAction: 'Generate Purchase Requisition for 50 PCS to supplier Valvitalia S.p.A. with target delivery before Sept 15.',
    impactValueOMR: 31000,
    affectedSku: 'SKU-VLV-99201',
    confidenceScore: 94
  },
  {
    id: 'ai-rec-02',
    type: 'EXPIRY_ALERT',
    severity: 'WARNING',
    title: 'FEFO Expiry Alert: Chemical Demulsifier Lot (LOT-2025-CHM-1190)',
    description: '12 Drums of Demulsifier in Salalah Regional Center will reach expiration date on 15-Sept-2026. Material degradation risk.',
    suggestedAction: 'Reallocate 12 Drums immediately to Marmul Oilfield maintenance consumption before new batch dispatch.',
    impactValueOMR: 4560,
    affectedSku: 'SKU-CHM-11045',
    confidenceScore: 98
  },
  {
    id: 'ai-rec-03',
    type: 'BIN_RELOCATION',
    severity: 'OPPORTUNITY',
    title: 'Warehouse Travel Time Optimization: Mezzanine Fast-Pick',
    description: 'Bifacial Solar PV Modules (SKU-SLR-77033) have 4.8x higher pick frequency this month due to Duqm Solar EPC dispatches.',
    suggestedAction: 'Relocate 4 Pallets from Bulk Zone 1 to Ground-Level Staging Dock Z-DQM-REC to cut picker transit time by 42%.',
    confidenceScore: 89
  }
];

// ============================================================================
// CONTEXT INTERFACE
// ============================================================================

interface InventoryContextType {
  // Master Data
  items: ItemMaster[];
  categories: ItemCategory[];
  uoms: UnitOfMeasure[];
  attributes: ItemAttribute[];
  warehouses: Warehouse[];
  binLocations: BinLocation[];

  // Transactions & Workflows
  transactions: StockTransaction[];
  returns: StockReturn[];
  reservations: StockReservation[];
  counts: InventoryCount[];
  batches: BatchLot[];
  createBatch: (b: Partial<BatchLot> & Pick<BatchLot, 'batchNumber' | 'itemId' | 'sku' | 'itemName'>) => BatchLot;
  createSerial: (sn: Partial<SerialNumberRecord> & Pick<SerialNumberRecord, 'serialNumber' | 'itemId' | 'sku' | 'itemName'>) => SerialNumberRecord;
  serials: SerialNumberRecord[];

  // Analytics & Reports
  agingBuckets: StockAgingBucket[];
  movements: StockMovementLedgerEntry[];
  stats: InventoryStats;
  aiRecommendations: InventoryAiRecommendation[];

  // Action Handlers — Master Data
  createItem: (item: Omit<ItemMaster, 'id' | 'createdAt' | 'updatedAt'>) => ItemMaster;
  updateItem: (id: string, item: Partial<ItemMaster>) => void;
  deleteItem: (id: string) => void;
  createCategory: (cat: Omit<ItemCategory, 'id' | 'itemCount'>) => ItemCategory;
  createWarehouse: (wh: Omit<Warehouse, 'id' | 'utilizationPercent'>) => Warehouse;
  createBinLocation: (bin: Omit<BinLocation, 'id' | 'occupancyPercent'>) => BinLocation;

  // Action Handlers — Transactions
  createTransaction: (tx: Omit<StockTransaction, 'id' | 'transactionNumber' | 'createdAt'>) => StockTransaction;
  approveTransaction: (id: string, approvedBy: string) => void;
  postTransaction: (id: string) => void;
  cancelTransaction: (id: string) => void;

  // Action Handlers — Returns & Inspection
  createStockReturn: (ret: Omit<StockReturn, 'id' | 'returnNumber' | 'createdAt'>) => StockReturn;
  completeReturnInspection: (
    returnId: string,
    inspectedBy: string,
    lines: { lineId: string; disposition: any; notes: string; passedQty: number; rejectedQty: number }[]
  ) => void;

  // Action Handlers — Control & Counts
  createStockReservation: (res: Omit<StockReservation, 'id' | 'reservationNumber'>) => StockReservation;
  cancelReservation: (id: string) => void;
  createInventoryCount: (count: Omit<InventoryCount, 'id' | 'countNumber' | 'createdAt'>) => InventoryCount;
  submitCountResults: (countId: string, lines: { lineId: string; countedQty: number; notes?: string }[]) => void;
  reconcileAndAdjustCount: (countId: string, auditorName: string) => void;

  // Action Handlers — Traceability
  createBatchLot: (batch: Omit<BatchLot, 'id'>) => BatchLot;
  registerSerialNumber: (sn: Omit<SerialNumberRecord, 'id'>) => SerialNumberRecord;

  // AI Actions
  applyAiRecommendation: (recId: string) => void;
  recalculateValuation: (method: ValuationMethod) => void;
}

const InventoryContext = createContext<InventoryContextType | null>(null);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ItemMaster[]>(INITIAL_ITEMS);
  const [categories, setCategories] = useState<ItemCategory[]>(INITIAL_CATEGORIES);
  const [uoms, setUoms] = useState<UnitOfMeasure[]>(INITIAL_UOMS);
  const [attributes, setAttributes] = useState<ItemAttribute[]>(INITIAL_ATTRIBUTES);
  const [warehouses, setWarehouses] = useState<Warehouse[]>(INITIAL_WAREHOUSES);
  const [binLocations, setBinLocations] = useState<BinLocation[]>(INITIAL_BINS);

  const [transactions, setTransactions] = useState<StockTransaction[]>(INITIAL_TRANSACTIONS);
  const [returns, setReturns] = useState<StockReturn[]>(INITIAL_RETURNS);
  const [reservations, setReservations] = useState<StockReservation[]>(INITIAL_RESERVATIONS);
  const [counts, setCounts] = useState<InventoryCount[]>(INITIAL_COUNTS);
  const [batches, setBatches] = useState<BatchLot[]>(INITIAL_BATCHES);
  const [serials, setSerials] = useState<SerialNumberRecord[]>(INITIAL_SERIALS);

  const [agingBuckets, setAgingBuckets] = useState<StockAgingBucket[]>(INITIAL_AGING_BUCKETS);
  const [movements, setMovements] = useState<StockMovementLedgerEntry[]>(INITIAL_MOVEMENTS);
  const [aiRecommendations, setAiRecommendations] = useState<InventoryAiRecommendation[]>(INITIAL_AI_RECOMMENDATIONS);

  // Compute live statistics
  const stats: InventoryStats = useMemo(() => {
    const totalValuation = items.reduce(
      (sum, itm) => sum + itm.totalStockOnHand * (itm.weightedAvgCostOMR || itm.unitCostOMR),
      0
    );
    const totalUnits = items.reduce((sum, itm) => sum + itm.totalStockOnHand, 0);
    const belowSafety = items.filter((itm) => itm.totalStockOnHand <= itm.safetyStock).length;
    const totalPalletsCapacity = warehouses.reduce((sum, wh) => sum + wh.totalPalletPositions, 0);
    const occupiedPallets = warehouses.reduce((sum, wh) => sum + wh.occupiedPalletPositions, 0);
    const capacityUtil = totalPalletsCapacity > 0 ? (occupiedPallets / totalPalletsCapacity) * 100 : 0;
    const openRes = reservations.filter((r) => r.status === 'RESERVED' || r.status === 'PARTIALLY_ISSUED').length;
    const pendingInsp = returns.filter((r) => r.status === 'PENDING_INSPECTION').length;
    const nearExpiry = batches.filter((b) => {
      if (!b.expiryDate) return false;
      const days = (new Date(b.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24);
      return days <= 90;
    }).length;

    return {
      totalInventoryValuationOMR: totalValuation,
      totalSkuCount: items.length,
      totalPhysicalUnitsOnHand: totalUnits,
      warehouseCapacityUtilizationPercent: parseFloat(capacityUtil.toFixed(1)),
      itemsBelowSafetyStockCount: belowSafety,
      inventoryAccuracyRatePercent: 99.4,
      openReservationsCount: openRes,
      pendingInspectionsCount: pendingInsp,
      nearExpiryBatchesCount: nearExpiry,
      averageInventoryTurnoverRatio: 6.8,
      daysSalesOfInventory: 53.6
    };
  }, [items, warehouses, reservations, returns, batches]);

  // Master Data Actions
  const createItem = (itemData: Omit<ItemMaster, 'id' | 'createdAt' | 'updatedAt'>): ItemMaster => {
    const newItem: ItemMaster = {
      ...itemData,
      id: `itm-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setItems((prev) => [newItem, ...prev]);
    return newItem;
  };

  const updateItem = (id: string, partial: Partial<ItemMaster>) => {
    setItems((prev) =>
      prev.map((itm) => (itm.id === id ? { ...itm, ...partial, updatedAt: new Date().toISOString() } : itm))
    );
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((itm) => itm.id !== id));
  };

  const createCategory = (catData: Omit<ItemCategory, 'id' | 'itemCount'>): ItemCategory => {
    const newCat: ItemCategory = {
      ...catData,
      id: `cat-${Date.now()}`,
      itemCount: 0
    };
    setCategories((prev) => [...prev, newCat]);
    return newCat;
  };

  const createWarehouse = (whData: Omit<Warehouse, 'id' | 'utilizationPercent'>): Warehouse => {
    const util =
      whData.totalPalletPositions > 0
        ? (whData.occupiedPalletPositions / whData.totalPalletPositions) * 100
        : 0;
    const newWh: Warehouse = {
      ...whData,
      id: `wh-${Date.now()}`,
      utilizationPercent: parseFloat(util.toFixed(1))
    };
    setWarehouses((prev) => [...prev, newWh]);
    return newWh;
  };

  const createBinLocation = (binData: Omit<BinLocation, 'id' | 'occupancyPercent'>): BinLocation => {
    const occ = binData.maxPalletCount > 0 ? (binData.currentPalletCount / binData.maxPalletCount) * 100 : 0;
    const newBin: BinLocation = {
      ...binData,
      id: `bin-${Date.now()}`,
      occupancyPercent: parseFloat(occ.toFixed(1))
    };
    setBinLocations((prev) => [...prev, newBin]);
    return newBin;
  };

  // Transactions Actions
  const createTransaction = (
    txData: Omit<StockTransaction, 'id' | 'transactionNumber' | 'createdAt'>
  ): StockTransaction => {
    const count = transactions.length + 1;
    const txNumber = `ST-2026-${String(count).padStart(5, '0')}`;
    const newTx: StockTransaction = {
      ...txData,
      id: `st-${Date.now()}`,
      transactionNumber: txNumber,
      createdAt: new Date().toISOString()
    };
    setTransactions((prev) => [newTx, ...prev]);

    // If already POSTED, update stock ledger & item balances
    if (newTx.status === 'POSTED') {
      applyStockTransactionImpact(newTx);
    }

    return newTx;
  };

  const approveTransaction = (id: string, approvedBy: string) => {
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.id === id
          ? {
              ...tx,
              status: 'APPROVED',
              approvedBy,
              approvedAt: new Date().toISOString()
            }
          : tx
      )
    );
  };

  const postTransaction = (id: string) => {
    const tx = transactions.find((t) => t.id === id);
    if (!tx) return;

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: 'POSTED',
              postingDate: new Date().toISOString().split('T')[0]
            }
          : t
      )
    );

    applyStockTransactionImpact({ ...tx, status: 'POSTED' });
  };

  const cancelTransaction = (id: string) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? { ...tx, status: 'CANCELLED' } : tx))
    );
  };

  const applyStockTransactionImpact = (tx: StockTransaction) => {
    // Generate movement ledger entries
    const newMovements: StockMovementLedgerEntry[] = tx.lines.map((line) => {
      let qtyIn = 0;
      let qtyOut = 0;
      if (tx.type === 'GOODS_RECEIPT' || tx.type === 'OPENING_STOCK') {
        qtyIn = line.quantity;
      } else if (tx.type === 'GOODS_ISSUE') {
        qtyOut = line.quantity;
      } else if (tx.type === 'STOCK_TRANSFER') {
        qtyOut = line.quantity; // movement out of source WH
      } else if (tx.type === 'STOCK_ADJUSTMENT') {
        if (line.quantity >= 0) qtyIn = line.quantity;
        else qtyOut = Math.abs(line.quantity);
      }

      const item = items.find((i) => i.id === line.itemId || i.sku === line.sku);
      const currentStock = item ? item.totalStockOnHand : 100;
      const newBalance = currentStock + qtyIn - qtyOut;

      return {
        id: `mov-${Date.now()}-${line.id}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        transactionNumber: tx.transactionNumber,
        transactionType: tx.type,
        referenceDoc: tx.sourceDocumentNumber || tx.transactionNumber,
        sku: line.sku,
        itemName: line.itemName,
        warehouseName: tx.toWarehouseName || tx.fromWarehouseName || 'Central Warehouse',
        binCode: line.toBinCode || line.fromBinCode || 'DEFAULT-BIN',
        quantityIn: qtyIn,
        quantityOut: qtyOut,
        balanceQuantity: newBalance,
        unitCostOMR: line.unitCostOMR,
        totalMovementValueOMR: line.totalCostOMR,
        performedBy: tx.createdBy
      };
    });

    setMovements((prev) => [...newMovements, ...prev]);

    // Update Item master stock on hand balances
    setItems((prev) =>
      prev.map((itm) => {
        const matchingLines = tx.lines.filter((l) => l.itemId === itm.id || l.sku === itm.sku);
        if (matchingLines.length === 0) return itm;

        let delta = 0;
        matchingLines.forEach((l) => {
          if (tx.type === 'GOODS_RECEIPT' || tx.type === 'OPENING_STOCK') {
            delta += l.quantity;
          } else if (tx.type === 'GOODS_ISSUE') {
            delta -= l.quantity;
          } else if (tx.type === 'STOCK_ADJUSTMENT') {
            delta += l.quantity;
          }
        });

        const newOnHand = Math.max(0, itm.totalStockOnHand + delta);
        const newAvail = Math.max(0, newOnHand - itm.totalReservedStock);

        return {
          ...itm,
          totalStockOnHand: newOnHand,
          totalAvailableStock: newAvail,
          updatedAt: new Date().toISOString()
        };
      })
    );
  };

  // Return & Inspection Actions
  const createStockReturn = (
    retData: Omit<StockReturn, 'id' | 'returnNumber' | 'createdAt'>
  ): StockReturn => {
    const retNumber = `RET-2026-${String(returns.length + 1).padStart(5, '0')}`;
    const newRet: StockReturn = {
      ...retData,
      id: `ret-${Date.now()}`,
      returnNumber: retNumber,
      createdAt: new Date().toISOString()
    };
    setReturns((prev) => [newRet, ...prev]);
    return newRet;
  };

  const completeReturnInspection = (
    returnId: string,
    inspectedBy: string,
    inspectedLines: { lineId: string; disposition: any; notes: string; passedQty: number; rejectedQty: number }[]
  ) => {
    setReturns((prev) =>
      prev.map((ret) => {
        if (ret.id !== returnId) return ret;

        const updatedLines = ret.lines.map((line) => {
          const insp = inspectedLines.find((l) => l.lineId === line.id);
          if (!insp) return line;
          return {
            ...line,
            inspectionDisposition: insp.disposition,
            inspectionNotes: insp.notes,
            passedQuantity: insp.passedQty,
            rejectedQuantity: insp.rejectedQty
          };
        });

        const allPrime = updatedLines.every((l) => l.inspectionDisposition === 'RESTOCK_PRIME');
        const hasClaim = updatedLines.some((l) => l.inspectionDisposition === 'SUPPLIER_CLAIM');

        return {
          ...ret,
          status: allPrime ? 'RESTOCKED' : hasClaim ? 'SUPPLIER_CLAIM' : 'INSPECTED',
          inspectedBy,
          inspectionDate: new Date().toISOString().split('T')[0],
          lines: updatedLines
        };
      })
    );
  };

  // Stock Control & Count Actions
  const createStockReservation = (
    resData: Omit<StockReservation, 'id' | 'reservationNumber'>
  ): StockReservation => {
    const resNumber = `RSV-2026-${String(reservations.length + 1).padStart(5, '0')}`;
    const newRes: StockReservation = {
      ...resData,
      id: `rsv-${Date.now()}`,
      reservationNumber: resNumber
    };
    setReservations((prev) => [newRes, ...prev]);

    // Recalculate item available stock
    setItems((prev) =>
      prev.map((itm) => {
        if (itm.id === resData.itemId || itm.sku === resData.sku) {
          const newReserved = itm.totalReservedStock + resData.reservedQuantity;
          const newAvail = Math.max(0, itm.totalStockOnHand - newReserved);
          return {
            ...itm,
            totalReservedStock: newReserved,
            totalAvailableStock: newAvail
          };
        }
        return itm;
      })
    );

    return newRes;
  };

  const cancelReservation = (id: string) => {
    const res = reservations.find((r) => r.id === id);
    if (!res) return;

    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'CANCELLED' } : r))
    );

    // Release reserved quantity back to available stock
    setItems((prev) =>
      prev.map((itm) => {
        if (itm.id === res.itemId || itm.sku === res.sku) {
          const newReserved = Math.max(0, itm.totalReservedStock - res.remainingQuantity);
          const newAvail = Math.max(0, itm.totalStockOnHand - newReserved);
          return {
            ...itm,
            totalReservedStock: newReserved,
            totalAvailableStock: newAvail
          };
        }
        return itm;
      })
    );
  };

  const createInventoryCount = (
    countData: Omit<InventoryCount, 'id' | 'countNumber' | 'createdAt'>
  ): InventoryCount => {
    const countNumber = `CC-2026-${String(counts.length + 1).padStart(4, '0')}`;
    const newCount: InventoryCount = {
      ...countData,
      id: `cc-${Date.now()}`,
      countNumber,
      createdAt: new Date().toISOString()
    };
    setCounts((prev) => [newCount, ...prev]);
    return newCount;
  };

  const submitCountResults = (
    countId: string,
    countedLines: { lineId: string; countedQty: number; notes?: string }[]
  ) => {
    setCounts((prev) =>
      prev.map((c) => {
        if (c.id !== countId) return c;

        let totalSys = 0;
        let totalCounted = 0;
        let totalVar = 0;
        let totalVarVal = 0;

        const updatedLines = c.lines.map((line) => {
          const match = countedLines.find((l) => l.lineId === line.id);
          const countedQty = match !== undefined ? match.countedQty : line.countedQuantity;
          const varQty = countedQty - line.systemQuantity;
          const varVal = varQty * line.unitCostOMR;

          totalSys += line.systemQuantity;
          totalCounted += countedQty;
          if (varQty !== 0) totalVar += 1;
          totalVarVal += varVal;

          return {
            ...line,
            countedQuantity: countedQty,
            varianceQuantity: varQty,
            varianceValueOMR: varVal,
            recountRequired: Math.abs(varQty) > 5,
            notes: match?.notes || line.notes
          };
        });

        const accuracy = totalSys > 0 ? Math.max(0, 100 - (Math.abs(totalSys - totalCounted) / totalSys) * 100) : 100;

        return {
          ...c,
          status: 'COUNTED',
          countCompletedAt: new Date().toISOString(),
          lines: updatedLines,
          totalSystemItems: totalSys,
          totalCountedItems: totalCounted,
          totalVariancesFound: totalVar,
          totalVarianceValueOMR: totalVarVal,
          accuracyRatePercent: parseFloat(accuracy.toFixed(2))
        };
      })
    );
  };

  const reconcileAndAdjustCount = (countId: string, auditorName: string) => {
    const count = counts.find((c) => c.id === countId);
    if (!count) return;

    // Generate Stock Adjustment transaction for non-zero variances
    const varianceLines = count.lines.filter((l) => l.varianceQuantity !== 0);
    if (varianceLines.length > 0) {
      const adjTxLines: StockTransactionLine[] = varianceLines.map((vl) => ({
        id: `adj-l-${Date.now()}-${vl.id}`,
        itemId: vl.itemId,
        sku: vl.sku,
        itemName: vl.itemName,
        uom: vl.uom,
        quantity: vl.varianceQuantity,
        unitCostOMR: vl.unitCostOMR,
        totalCostOMR: vl.varianceValueOMR,
        toWarehouseId: count.warehouseId,
        toBinCode: vl.binLocationCode,
        batchNumber: vl.batchNumber,
        remarks: `Cycle Count reconciliation variance adjustment from ${count.countNumber}`
      }));

      const adjTx = createTransaction({
        type: 'STOCK_ADJUSTMENT',
        status: 'POSTED',
        transactionDate: new Date().toISOString().split('T')[0],
        postingDate: new Date().toISOString().split('T')[0],
        sourceDocumentType: 'CYCLE_COUNT_RECONCILIATION',
        sourceDocumentNumber: count.countNumber,
        toWarehouseId: count.warehouseId,
        toWarehouseName: count.warehouseName,
        costCenter: 'CC-INVENTORY-VARIANCE',
        reasonCode: 'PHYSICAL_COUNT_RECONCILIATION',
        lines: adjTxLines,
        totalQuantity: varianceLines.reduce((s, l) => s + Math.abs(l.varianceQuantity), 0),
        totalValueOMR: count.totalVarianceValueOMR,
        notes: `Automatically posted stock adjustment from approved cycle count audit by ${auditorName}.`,
        approvedBy: auditorName,
        approvedAt: new Date().toISOString(),
        createdBy: auditorName
      });

      setCounts((prev) =>
        prev.map((c) =>
          c.id === countId
            ? {
                ...c,
                status: 'ADJUSTED',
                adjustmentTransactionId: adjTx.id,
                adjustmentTransactionNumber: adjTx.transactionNumber
              }
            : c
        )
      );
    } else {
      setCounts((prev) =>
        prev.map((c) => (c.id === countId ? { ...c, status: 'RECONCILED' } : c))
      );
    }
  };

  // Traceability Actions
  const createBatchLot = (batchData: Omit<BatchLot, 'id'>): BatchLot => {
    const newBatch: BatchLot = {
      ...batchData,
      id: `batch-${Date.now()}`
    };
    setBatches((prev) => [newBatch, ...prev]);
    return newBatch;
  };

  const registerSerialNumber = (snData: Omit<SerialNumberRecord, 'id'>): SerialNumberRecord => {
    const newSn: SerialNumberRecord = {
      ...snData,
      id: `sn-${Date.now()}`
    };
    setSerials((prev) => [newSn, ...prev]);
    return newSn;
  };

  // AI Actions
  const applyAiRecommendation = (recId: string) => {
    const rec = aiRecommendations.find((r) => r.id === recId);
    if (!rec) return;

    if (rec.type === 'STOCKOUT_PREVENTION') {
      // Create stock reservation or trigger PR suggestion
      setAiRecommendations((prev) => prev.filter((r) => r.id !== recId));
    } else if (rec.type === 'EXPIRY_ALERT') {
      // Trigger FEFO transfer
      setAiRecommendations((prev) => prev.filter((r) => r.id !== recId));
    } else {
      setAiRecommendations((prev) => prev.filter((r) => r.id !== recId));
    }
  };

  const recalculateValuation = (method: ValuationMethod) => {
    setItems((prev) =>
      prev.map((itm) => {
        let newUnitCost = itm.unitCostOMR;
        if (method === 'STANDARD_COST') {
          newUnitCost = itm.standardCostOMR;
        } else if (method === 'WEIGHTED_AVERAGE') {
          newUnitCost = itm.weightedAvgCostOMR;
        }
        return {
          ...itm,
          valuationMethod: method,
          unitCostOMR: newUnitCost
        };
      })
    );
  };

  const createBatch = (b: Partial<BatchLot> & Pick<BatchLot, 'batchNumber' | 'itemId' | 'sku' | 'itemName'>): BatchLot => {
    const today = new Date().toISOString().split('T')[0];
    const onHand = b.quantityOnHand ?? b.currentQuantity ?? b.initialQuantity ?? 0;
    const reserved = b.quantityReserved ?? b.allocatedQuantity ?? 0;
    const created: BatchLot = {
      warehouseId: warehouses[0]?.id ?? '',
      warehouseName: warehouses[0]?.name ?? '',
      binLocationCode: '',
      manufacturingDate: today,
      supplierBatchNumber: '',
      supplierPoNumber: '',
      uom: 'EA',
      ...b,
      id: `batch-${Date.now()}`,
      initialQuantity: onHand,
      currentQuantity: onHand,
      allocatedQuantity: reserved,
      availableQuantity: b.quantityAvailable ?? onHand - reserved,
      qcStatus: b.qaApprovalStatus === 'PASSED' || !b.qcStatus ? 'APPROVED' : b.qcStatus
    };
    setBatches((prev) => [created, ...prev]);
    return created;
  };

  const createSerial = (
    sn: Partial<SerialNumberRecord> & Pick<SerialNumberRecord, 'serialNumber' | 'itemId' | 'sku' | 'itemName'>
  ): SerialNumberRecord => {
    const created: SerialNumberRecord = {
      status: 'IN_STOCK',
      supplierPoNumber: '',
      grnNumber: '',
      serviceHistoryCount: 0,
      ...sn,
      id: `sn-${Date.now()}`
    };
    setSerials((prev) => [created, ...prev]);
    return created;
  };

  return (
    <InventoryContext.Provider
      value={{
        items,
        categories,
        uoms,
        attributes,
        warehouses,
        binLocations,
        transactions,
        returns,
        reservations,
        counts,
        batches: batches.map((b) => ({
          ...b,
          quantityOnHand: b.quantityOnHand ?? b.currentQuantity,
          quantityReserved: b.quantityReserved ?? b.allocatedQuantity,
          quantityAvailable: b.quantityAvailable ?? b.availableQuantity,
          qaApprovalStatus: b.qaApprovalStatus ?? b.qcStatus,
          heatNumber: b.heatNumber ?? b.millTestCertNumber
        })),
        serials: serials.map((sn) => ({ ...sn, warrantyExpiryDate: sn.warrantyExpiryDate ?? sn.warrantyEndDate })),
        createBatch,
        createSerial,
        agingBuckets,
        movements,
        stats,
        aiRecommendations,
        createItem,
        updateItem,
        deleteItem,
        createCategory,
        createWarehouse,
        createBinLocation,
        createTransaction,
        approveTransaction,
        postTransaction,
        cancelTransaction,
        createStockReturn,
        completeReturnInspection,
        createStockReservation,
        cancelReservation,
        createInventoryCount,
        submitCountResults,
        reconcileAndAdjustCount,
        createBatchLot,
        registerSerialNumber,
        applyAiRecommendation,
        recalculateValuation
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventoryStore = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventoryStore must be used within an InventoryProvider');
  }
  return context;
};
