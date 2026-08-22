import {
  Company,
  CurrencyDefinition,
  CompanyGroup,
  GroupMaster,
  GroupMembership,
  RelationshipHistoryRecord,
  Branch,
  Department,
  Location,
  OperatingUnit,
  UserAccount,
  UserRoleDefinition,
  UserGroup,
  SoDRule,
  AccessRestriction,
  ApprovalWorkflow,
  ApprovalMatrixRule,
  DelegationOfAuthority,
  ApprovalLimit,
  EscalationRule,
  FiscalYear,
  PostingPeriod,
  DocumentSequence,
  PostingControl,
  PeriodLockRecord,
  MasterDataDefinition,
  DuplicateRule,
  ValidationRule,
  MasterDataApprovalRequest,
  NotificationTemplate,
  NotificationRule,
  SystemAlertItem,
  AuditEvent,
  LoginHistoryEvent,
  ApiClient,
  ExternalIntegration,
  IntegrationLog,
  BackupConfiguration,
  RestorePoint,
  DisasterRecoveryStatus,
  SecurityPolicy,
  PasswordPolicy,
  ActiveSession,
  SecurityEvent
} from '../types';

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'comp-1',
    code: 'ART-HOLD',
    legalName: 'Artify Group Holdings SAOC',
    tradingName: 'Artify Holdings',
    shortName: 'Artify Holdings',
    companyType: 'Holding',
    legalStructure: 'Closed Joint Stock Company (SAOC)',
    industrySegment: 'Conglomerate & Investments',
    registrationNumber: 'CR-1092834',
    registrationDate: '2020-01-15',
    registrationExpiryDate: '2030-01-14',
    taxNumber: 'OM-VAT-10029384',
    taxAuthority: 'Oman Tax Authority (OTA)',
    commercialRegistryOffice: 'MOCIIP Muscat Office',
    chamberOfCommerceNumber: 'OCCI-98421',
    municipalLicenseNumber: 'MM-LIC-2020-00921',
    capitalAuthorized: 25000000,
    capitalPaidUp: 25000000,
    parValuePerShare: 1.000,
    totalShares: 25000000,
    country: 'Oman',
    state: 'Muscat Governorate',
    city: 'Muscat',
    address: 'Building 402, Al Qurum Commercial Complex, Way 2814',
    postalCode: 'PC 112',
    poBox: 'PO Box 184',
    buildingNumber: 'Bldg 402',
    wayStreet: 'Way 2814',
    phone: '+968 2481 9000',
    email: 'corp@artify-group.com',
    website: 'https://artify-group.com',
    contactPerson: 'Khalfan Al-Harthy (Corporate Secretary)',
    managingDirectorName: 'Eng. Salim Al-Rawahi',
    cfoName: 'Tariq Al-Balushi',
    statutoryAuditor: 'PricewaterhouseCoopers (PwC Oman)',
    currency: 'OMR',
    secondaryCurrency: 'USD',
    fiscalYearStart: '2026-01-01',
    fiscalYearStartMonth: 1,
    timeZone: 'Asia/Muscat (GMT+4)',
    dateFormat: 'YYYY-MM-DD',
    numberFormat: '1,234,567.890',
    decimalPrecision: 3,
    defaultRoundingMethod: 'Round Half Up',
    taxScheme: 'Standard VAT 5%',
    corporateTaxRate: 15,
    vatRate: 5,
    brandColor: '#4f46e5',
    brandSecondaryColor: '#06b6d4',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=128&auto=format&fit=crop&q=80',
    watermarkText: 'ARTIFY HOLDINGS CONFIDENTIAL',
    letterheadHeaderHtml: 'ARTIFY GROUP HOLDINGS SAOC | CR 1092834 | VAT OM-VAT-10029384',
    letterheadFooterHtml: 'Al Qurum Commercial Complex, Muscat, Sultanate of Oman | Tel: +968 2481 9000',
    status: 'Active',
    isParent: true,
    isHolding: true,
    ownershipPercentage: 100,
    version: 3,
    approvedAt: '2020-01-18',
    approvedBy: 'Eng. Salim Al-Rawahi',
    approvalComments: 'Incorporated under Ministerial Decision & Commercial Companies Law.',
    attachments: [
      {
        id: 'att-c1-1',
        name: 'Commercial_Registration_CR1092834.pdf',
        category: 'Commercial Registration (CR)',
        size: '3.8 MB',
        type: 'application/pdf',
        uploadedAt: '2020-01-15',
        uploadedBy: 'Corporate Secretariat',
        documentNumber: 'CR-1092834',
        expiryDate: '2030-01-14'
      },
      {
        id: 'att-c1-2',
        name: 'VAT_Registration_Certificate_OTA.pdf',
        category: 'Tax / VAT Certificate',
        size: '1.9 MB',
        type: 'application/pdf',
        uploadedAt: '2021-04-16',
        uploadedBy: 'Tax Compliance Dept',
        documentNumber: 'OM-VAT-10029384'
      },
      {
        id: 'att-c1-3',
        name: 'Articles_of_Association_SAOC.pdf',
        category: 'Articles of Association',
        size: '8.4 MB',
        type: 'application/pdf',
        uploadedAt: '2020-01-15',
        uploadedBy: 'Legal Counsel'
      }
    ],
    history: [
      {
        id: 'hist-c1-1',
        companyId: 'comp-1',
        fieldChanged: 'capitalPaidUp',
        oldValue: '15,000,000 OMR',
        newValue: '25,000,000 OMR',
        changeReason: 'Extraordinary General Meeting (EGM) capital injection resolution',
        changedBy: 'Eng. Salim Al-Rawahi',
        timestamp: '2023-04-15 10:30:00 UTC',
        documentRef: 'EGM-RES-2023-04'
      },
      {
        id: 'hist-c1-2',
        companyId: 'comp-1',
        fieldChanged: 'statutoryAuditor',
        oldValue: 'Ernst & Young Oman',
        newValue: 'PricewaterhouseCoopers (PwC Oman)',
        changeReason: 'Annual General Meeting (AGM) appointment of independent external auditor',
        changedBy: 'Tariq Al-Balushi',
        timestamp: '2024-03-20 09:15:00 UTC',
        documentRef: 'AGM-RES-2024-01'
      }
    ],
    createdAt: '2020-01-15',
    updatedAt: '2026-08-01'
  },
  {
    id: 'comp-2',
    code: 'ART-IND',
    legalName: 'Artify Industrial & EPC Solutions LLC',
    tradingName: 'Artify Industrial',
    shortName: 'Artify Industrial',
    companyType: 'Subsidiary',
    legalStructure: 'Limited Liability Company (LLC)',
    industrySegment: 'Industrial Manufacturing & EPC Contracts',
    registrationNumber: 'CR-2039481',
    registrationDate: '2021-03-10',
    registrationExpiryDate: '2031-03-09',
    taxNumber: 'OM-VAT-20039481',
    taxAuthority: 'Oman Tax Authority (OTA)',
    commercialRegistryOffice: 'MOCIIP Sohar Office',
    chamberOfCommerceNumber: 'OCCI-SOH-4819',
    municipalLicenseNumber: 'SZ-LIC-2021-891',
    capitalAuthorized: 10000000,
    capitalPaidUp: 10000000,
    parValuePerShare: 1.000,
    totalShares: 10000000,
    country: 'Oman',
    state: 'Al Batinah North Governorate',
    city: 'Sohar',
    address: 'Sohar Freezone, Heavy Industrial Phase II, Plot 89',
    postalCode: 'PC 322',
    poBox: 'PO Box 89 Sohar Port',
    buildingNumber: 'Plot 89-B',
    wayStreet: 'Port Access Road 4',
    phone: '+968 2685 4100',
    email: 'operations@artify-industrial.com',
    website: 'https://industrial.artify-group.com',
    contactPerson: 'Murtadha Al-Lawati (Plant General Manager)',
    managingDirectorName: 'Dr. Nasser Al-Kharusi',
    cfoName: 'Rajesh Sharma',
    statutoryAuditor: 'Deloitte & Touche Middle East',
    currency: 'OMR',
    secondaryCurrency: 'USD',
    fiscalYearStart: '2026-01-01',
    fiscalYearStartMonth: 1,
    timeZone: 'Asia/Muscat (GMT+4)',
    dateFormat: 'YYYY-MM-DD',
    numberFormat: '1,234,567.890',
    decimalPrecision: 3,
    defaultRoundingMethod: 'Round Half Up',
    taxScheme: 'Standard VAT 5%',
    corporateTaxRate: 15,
    vatRate: 5,
    brandColor: '#0284c7',
    brandSecondaryColor: '#f59e0b',
    logo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=128&auto=format&fit=crop&q=80',
    watermarkText: 'ARTIFY INDUSTRIAL INTERNAL USE',
    letterheadHeaderHtml: 'ARTIFY INDUSTRIAL & EPC SOLUTIONS LLC | CR 2039481 | SOHAR FREEZONE',
    letterheadFooterHtml: 'Sohar Freezone Phase II, Plot 89, Sultanate of Oman | Tel: +968 2685 4100',
    status: 'Active',
    isParent: false,
    parentId: 'comp-1',
    parentEntityId: 'comp-1',
    ownershipPercentage: 90,
    version: 2,
    approvedAt: '2021-03-15',
    approvedBy: 'Eng. Salim Al-Rawahi',
    approvalComments: 'Approved subsidiary formation and Sohar facility capital commitment.',
    attachments: [
      {
        id: 'att-c2-1',
        name: 'CR_Certificate_Sohar_2039481.pdf',
        category: 'Commercial Registration (CR)',
        size: '2.4 MB',
        type: 'application/pdf',
        uploadedAt: '2021-03-10',
        uploadedBy: 'Legal Dept',
        documentNumber: 'CR-2039481',
        expiryDate: '2031-03-09'
      },
      {
        id: 'att-c2-2',
        name: 'Sohar_Freezone_Industrial_Lease_Agreement.pdf',
        category: 'Municipality Permit',
        size: '5.1 MB',
        type: 'application/pdf',
        uploadedAt: '2021-03-12',
        uploadedBy: 'Operations Admin'
      }
    ],
    history: [
      {
        id: 'hist-c2-1',
        companyId: 'comp-2',
        fieldChanged: 'ownershipPercentage',
        oldValue: '100%',
        newValue: '90%',
        changeReason: 'Strategic JV allotment with Sohar Industrial Partner (10% minority equity)',
        changedBy: 'Eng. Salim Al-Rawahi',
        timestamp: '2022-06-01 11:00:00 UTC',
        documentRef: 'SHA-SOHAR-2022-01'
      }
    ],
    createdAt: '2021-03-10',
    updatedAt: '2026-08-10'
  },
  {
    id: 'comp-3',
    code: 'ART-CONT',
    legalName: 'Artify Contracting & Infrastructure LLC',
    tradingName: 'Artify Contracting',
    shortName: 'Artify Contracting',
    companyType: 'Subsidiary',
    legalStructure: 'Limited Liability Company (LLC)',
    industrySegment: 'Civil Infrastructure & General Contracting',
    registrationNumber: 'CR-3049182',
    registrationDate: '2021-06-20',
    registrationExpiryDate: '2031-06-19',
    taxNumber: 'OM-VAT-30049182',
    taxAuthority: 'Oman Tax Authority (OTA)',
    commercialRegistryOffice: 'MOCIIP Muscat Office',
    chamberOfCommerceNumber: 'OCCI-RUW-8931',
    municipalLicenseNumber: 'MM-LIC-2021-4412',
    capitalAuthorized: 5000000,
    capitalPaidUp: 5000000,
    parValuePerShare: 1.000,
    totalShares: 5000000,
    country: 'Oman',
    state: 'Muscat Governorate',
    city: 'Ruwi',
    address: 'Tower 3, Central Business District, Floor 8',
    postalCode: 'PC 114',
    poBox: 'PO Box 910 Ruwi',
    buildingNumber: 'Tower 3',
    wayStreet: 'CBD Street 10',
    phone: '+968 2470 3300',
    email: 'tenders@artify-contracting.com',
    website: 'https://contracting.artify-group.com',
    contactPerson: 'Suleiman Al-Habsi (Contracts Director)',
    managingDirectorName: 'Saud Al-Busaidi',
    cfoName: 'Farooq Al-Zadjali',
    statutoryAuditor: 'KPMG Lower Gulf',
    currency: 'OMR',
    secondaryCurrency: 'USD',
    fiscalYearStart: '2026-01-01',
    fiscalYearStartMonth: 1,
    timeZone: 'Asia/Muscat (GMT+4)',
    dateFormat: 'YYYY-MM-DD',
    numberFormat: '1,234,567.890',
    decimalPrecision: 3,
    defaultRoundingMethod: 'Round Half Up',
    taxScheme: 'Standard VAT 5%',
    corporateTaxRate: 15,
    vatRate: 5,
    brandColor: '#ea580c',
    brandSecondaryColor: '#eab308',
    logo: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=128&auto=format&fit=crop&q=80',
    watermarkText: 'ARTIFY CONTRACTING TENDER SPECIFICATION',
    letterheadHeaderHtml: 'ARTIFY CONTRACTING & INFRASTRUCTURE LLC | CR 3049182 | CBD RUWI',
    letterheadFooterHtml: 'Tower 3, CBD Ruwi, Muscat, Sultanate of Oman | Tel: +968 2470 3300',
    status: 'Active',
    isParent: false,
    parentId: 'comp-1',
    parentEntityId: 'comp-1',
    ownershipPercentage: 100,
    version: 1,
    approvedAt: '2021-06-25',
    approvedBy: 'Eng. Salim Al-Rawahi',
    approvalComments: 'Approved subsidiary formation for national infrastructure bids.',
    attachments: [
      {
        id: 'att-c3-1',
        name: 'CR_Certificate_Ruwi_3049182.pdf',
        category: 'Commercial Registration (CR)',
        size: '2.1 MB',
        type: 'application/pdf',
        uploadedAt: '2021-06-20',
        uploadedBy: 'Legal Dept',
        documentNumber: 'CR-3049182'
      }
    ],
    history: [],
    createdAt: '2021-06-20',
    updatedAt: '2026-08-12'
  },
  {
    id: 'comp-4',
    code: 'ART-TECH',
    legalName: 'Artify Tech Innovations FZ-LLC',
    tradingName: 'Artify Tech Dubai',
    shortName: 'Artify Tech',
    companyType: 'Subsidiary',
    legalStructure: 'Free Zone Entity (FZE/FZ-LLC)',
    industrySegment: 'Enterprise Cloud SaaS & AI Infrastructure',
    registrationNumber: 'CR-9048123',
    registrationDate: '2022-09-01',
    registrationExpiryDate: '2032-08-31',
    taxNumber: 'AE-TRN-10049382100003',
    taxAuthority: 'Federal Tax Authority (FTA - UAE)',
    commercialRegistryOffice: 'Dubai Development Authority (DDA)',
    chamberOfCommerceNumber: 'DCC-AE-98210',
    municipalLicenseNumber: 'DIC-LIC-2022-0914',
    capitalAuthorized: 1000000,
    capitalPaidUp: 1000000,
    parValuePerShare: 1.00,
    totalShares: 1000000,
    country: 'United Arab Emirates',
    state: 'Dubai Emirate',
    city: 'Dubai',
    address: 'Dubai Internet City, Building 14, Unit 402',
    postalCode: 'PO Box 50021',
    poBox: 'PO Box 50021 Dubai',
    buildingNumber: 'Bldg 14',
    wayStreet: 'Al Falak Street',
    phone: '+971 4 391 0000',
    email: 'cloud@artify-tech.ae',
    website: 'https://tech.artify-group.com',
    contactPerson: 'Zainab Mansoor (VP Product Operations)',
    managingDirectorName: 'Alexander Vance',
    cfoName: 'Samir Mansoor',
    statutoryAuditor: 'BDO UAE',
    currency: 'AED',
    secondaryCurrency: 'USD',
    fiscalYearStart: '2026-01-01',
    fiscalYearStartMonth: 1,
    timeZone: 'Asia/Dubai (GMT+4)',
    dateFormat: 'YYYY-MM-DD',
    numberFormat: '1,234,567.89',
    decimalPrecision: 2,
    defaultRoundingMethod: 'Round Half Up',
    taxScheme: 'Standard VAT 5%',
    corporateTaxRate: 9,
    vatRate: 5,
    brandColor: '#8b5cf6',
    brandSecondaryColor: '#ec4899',
    logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=128&auto=format&fit=crop&q=80',
    watermarkText: 'ARTIFY TECH PROPRIETARY IP',
    letterheadHeaderHtml: 'ARTIFY TECH INNOVATIONS FZ-LLC | TRN 10049382100003 | DUBAI INTERNET CITY',
    letterheadFooterHtml: 'Building 14, Dubai Internet City, Dubai, UAE | Tel: +971 4 391 0000',
    status: 'Active',
    isParent: false,
    parentId: 'comp-1',
    parentEntityId: 'comp-1',
    ownershipPercentage: 85,
    version: 2,
    approvedAt: '2022-09-05',
    approvedBy: 'Eng. Salim Al-Rawahi',
    approvalComments: 'Approved UAE tech hub establishment for regional digital products.',
    attachments: [
      {
        id: 'att-c4-1',
        name: 'DDA_Trade_License_FZLLC_9048123.pdf',
        category: 'Commercial Registration (CR)',
        size: '1.8 MB',
        type: 'application/pdf',
        uploadedAt: '2022-09-01',
        uploadedBy: 'HR & Legal UAE',
        documentNumber: 'CR-9048123',
        expiryDate: '2032-08-31'
      },
      {
        id: 'att-c4-2',
        name: 'UAE_VAT_Registration_Certificate_FTA.pdf',
        category: 'Tax / VAT Certificate',
        size: '1.2 MB',
        type: 'application/pdf',
        uploadedAt: '2022-09-10',
        uploadedBy: 'Finance Dept',
        documentNumber: 'AE-TRN-10049382100003'
      }
    ],
    history: [],
    createdAt: '2022-09-01',
    updatedAt: '2026-08-14'
  }
];

export const INITIAL_GROUPS: GroupMaster[] = [
  {
    id: 'grp-1',
    code: 'GRP-ARTIFY-HOLD',
    name: 'Artify Enterprise Conglomerate Group',
    shortName: 'Artify Group',
    groupType: 'Holding Group',
    parentCompanyId: 'comp-1', // Artify Group Holdings SAOC
    currency: 'OMR',
    description: 'Consolidated multi-entity industrial, EPC, technology, infrastructure and commercial conglomerate across GCC jurisdictions.',
    status: 'Active',
    effectiveFrom: '2020-01-01',
    consolidationMethod: 'Full Consolidation (IFRS 10)',
    fiscalYearStartMonth: 1,
    createdBy: 'usr-admin',
    createdAt: '2020-01-15',
    updatedBy: 'usr-admin',
    updatedAt: '2026-08-01',
    version: 4,
    approvedAt: '2020-01-18',
    approvedBy: 'Eng. Salim Al-Rawahi',
    approvalComments: 'Corporate board approved consolidation structure as per Commercial Companies Law (RD 18/2019).',
    attachments: [
      {
        id: 'att-1',
        name: 'Artify_Group_Holding_Articles_of_Association.pdf',
        type: 'application/pdf',
        size: '3.4 MB',
        uploadedAt: '2020-01-15',
        uploadedBy: 'Legal Dept (Muscat)',
        category: 'Articles of Association'
      },
      {
        id: 'att-2',
        name: 'Ministry_Commerce_Group_Consolidation_Gazette.pdf',
        type: 'application/pdf',
        size: '1.8 MB',
        uploadedAt: '2020-01-20',
        uploadedBy: 'Corporate Governance',
        category: 'Commercial Registry'
      }
    ]
  },
  {
    id: 'grp-2',
    code: 'GRP-TECH-INNOV',
    name: 'Artify Digital & Frontier Technologies Group',
    shortName: 'Artify Digital',
    groupType: 'Corporate Group',
    parentCompanyId: 'comp-4', // Artify Tech Innovations FZ-LLC
    currency: 'AED',
    description: 'Regional technology incubation and software solutions division for Middle East & North Africa.',
    status: 'Active',
    effectiveFrom: '2022-09-01',
    consolidationMethod: 'Full Consolidation (IFRS 10)',
    fiscalYearStartMonth: 1,
    createdBy: 'usr-admin',
    createdAt: '2022-09-01',
    updatedBy: 'usr-admin',
    updatedAt: '2026-08-14',
    version: 2,
    approvedAt: '2022-09-10',
    approvedBy: 'Elena Rostova',
    approvalComments: 'FZ-LLC Dubai Digital incubator consolidation approved.'
  },
  {
    id: 'grp-3',
    code: 'GRP-VENTURES-SAUDI',
    name: 'Artify Gulf Industrial Expansion Consortium',
    shortName: 'Artify KSA Consortium',
    groupType: 'Investment Group',
    parentCompanyId: 'comp-1',
    currency: 'SAR',
    description: 'Special purpose cross-border entity group for Saudi Vision 2030 industrial and EPC ventures.',
    status: 'Draft',
    effectiveFrom: '2026-09-01',
    consolidationMethod: 'Equity Method (IAS 28)',
    fiscalYearStartMonth: 1,
    createdBy: 'usr-admin',
    createdAt: '2026-08-15',
    updatedBy: 'usr-admin',
    updatedAt: '2026-08-20',
    version: 1
  }
];

export const INITIAL_GROUP_MEMBERSHIPS: GroupMembership[] = [
  {
    id: 'gmem-1',
    groupId: 'grp-1',
    companyId: 'comp-1',
    companyCode: 'ART-HOLD',
    companyName: 'Artify Group Holdings SAOC',
    relationshipType: 'Parent',
    ownershipPercentage: 100.0,
    votingPercentage: 100.0,
    acquisitionDate: '2020-01-01',
    effectiveFrom: '2020-01-01',
    controlType: 'Wholly Owned (100%)',
    consolidationTreatment: 'Consolidated',
    status: 'Active',
    notes: 'Ultimate Parent Holding Entity incorporated in Sultanate of Oman.',
    createdBy: 'usr-admin',
    createdAt: '2020-01-15',
    updatedBy: 'usr-admin',
    updatedAt: '2026-08-01',
    version: 1
  },
  {
    id: 'gmem-2',
    groupId: 'grp-1',
    companyId: 'comp-2',
    companyCode: 'ART-IND',
    companyName: 'Artify Industrial & EPC Solutions LLC',
    relationshipType: 'Subsidiary',
    ownershipPercentage: 90.0,
    votingPercentage: 90.0,
    acquisitionDate: '2021-03-10',
    effectiveFrom: '2021-03-10',
    controlType: 'Direct Control (>50%)',
    consolidationTreatment: 'Consolidated',
    status: 'Active',
    notes: '10% minority shareholding retained by Sohar Port Industrial Development Trust.',
    createdBy: 'usr-admin',
    createdAt: '2021-03-10',
    updatedBy: 'usr-admin',
    updatedAt: '2026-08-10',
    version: 2
  },
  {
    id: 'gmem-3',
    groupId: 'grp-1',
    companyId: 'comp-3',
    companyCode: 'ART-CONT',
    companyName: 'Artify Contracting & Infrastructure LLC',
    relationshipType: 'Wholly Owned Subsidiary',
    ownershipPercentage: 100.0,
    votingPercentage: 100.0,
    acquisitionDate: '2021-06-20',
    effectiveFrom: '2021-06-20',
    controlType: 'Wholly Owned (100%)',
    consolidationTreatment: 'Consolidated',
    status: 'Active',
    notes: '100% owned operational infrastructure entity for civil EPC contracting.',
    createdBy: 'usr-admin',
    createdAt: '2021-06-20',
    updatedBy: 'usr-admin',
    updatedAt: '2026-08-12',
    version: 1
  },
  {
    id: 'gmem-4',
    groupId: 'grp-1',
    companyId: 'comp-4',
    companyCode: 'ART-TECH',
    companyName: 'Artify Tech Innovations FZ-LLC',
    relationshipType: 'Subsidiary',
    ownershipPercentage: 85.0,
    votingPercentage: 85.0,
    acquisitionDate: '2022-09-01',
    effectiveFrom: '2022-09-01',
    controlType: 'Direct Control (>50%)',
    consolidationTreatment: 'Consolidated',
    status: 'Active',
    notes: '15% ESOP reserved for key UAE engineering leadership.',
    createdBy: 'usr-admin',
    createdAt: '2022-09-01',
    updatedBy: 'usr-admin',
    updatedAt: '2026-08-14',
    version: 2
  }
];

export const INITIAL_RELATIONSHIP_HISTORY: RelationshipHistoryRecord[] = [
  {
    id: 'rhist-1',
    groupId: 'grp-1',
    groupName: 'Artify Enterprise Conglomerate Group',
    companyId: 'comp-2',
    companyName: 'Artify Industrial & EPC Solutions LLC',
    companyCode: 'ART-IND',
    previousOwnership: 100.0,
    newOwnership: 90.0,
    previousVoting: 100.0,
    newVoting: 90.0,
    previousRelationshipType: 'Wholly Owned Subsidiary',
    newRelationshipType: 'Subsidiary',
    changeReason: '10% strategic equity allotment to Sohar Industrial Development Authority for zone expansion rights.',
    effectiveDate: '2024-01-01',
    changedBy: 'Eng. Salim Al-Rawahi (CFO)',
    timestamp: '2024-01-02 09:30:00 UTC',
    documentRef: 'DOC-BR-2024-01-SOHAR'
  },
  {
    id: 'rhist-2',
    groupId: 'grp-1',
    groupName: 'Artify Enterprise Conglomerate Group',
    companyId: 'comp-4',
    companyName: 'Artify Tech Innovations FZ-LLC',
    companyCode: 'ART-TECH',
    previousOwnership: 100.0,
    newOwnership: 85.0,
    previousVoting: 100.0,
    newVoting: 85.0,
    previousRelationshipType: 'Wholly Owned Subsidiary',
    newRelationshipType: 'Subsidiary',
    changeReason: '15% equity pool allocation into Dubai Tech Employee Share Trust.',
    effectiveDate: '2025-06-01',
    changedBy: 'Corporate Secretariat',
    timestamp: '2025-06-05 14:15:00 UTC',
    documentRef: 'DOC-ESOP-2025-06-DIC'
  }
];

export const INITIAL_COMPANY_GROUP: CompanyGroup = INITIAL_GROUPS[0];

export const INITIAL_BRANCHES: Branch[] = [
  {
    id: 'br-1',
    code: 'BR-MCT-HQ',
    name: 'Muscat Corporate HQ',
    companyId: 'comp-1',
    companyName: 'Artify Group Holdings SAOC',
    locationId: 'loc-1',
    locationName: 'Muscat Executive Tower',
    manager: 'Eng. Salim Al-Rawahi',
    address: 'Al Qurum Commercial District, Muscat',
    phone: '+968 2481 9001',
    email: 'muscat.hq@artify-group.com',
    currency: 'OMR',
    isTaxBranch: true,
    status: 'Active',
    createdAt: '2020-01-20'
  },
  {
    id: 'br-2',
    code: 'BR-SHR-MFG',
    name: 'Sohar Heavy Fabrication Plant',
    companyId: 'comp-2',
    companyName: 'Artify Industrial & EPC Solutions LLC',
    locationId: 'loc-2',
    locationName: 'Sohar Industrial Zone II',
    manager: 'Rajesh Subramanian',
    address: 'Plot 89, Heavy Industry Sector, Sohar Port',
    phone: '+968 2685 4101',
    email: 'sohar.plant@artify-industrial.com',
    currency: 'OMR',
    isTaxBranch: true,
    status: 'Active',
    createdAt: '2021-03-15'
  },
  {
    id: 'br-3',
    code: 'BR-DXB-HUB',
    name: 'Dubai Digital & Regional Hub',
    companyId: 'comp-4',
    companyName: 'Artify Tech Innovations FZ-LLC',
    locationId: 'loc-3',
    locationName: 'Dubai Internet City Site',
    manager: 'Elena Rostova',
    address: 'DIC Building 14, Dubai, UAE',
    phone: '+971 4 391 0001',
    email: 'dubai.hub@artify-tech.ae',
    currency: 'AED',
    isTaxBranch: true,
    status: 'Active',
    createdAt: '2022-09-05'
  },
  {
    id: 'br-4',
    code: 'BR-RUW-OPS',
    name: 'Ruwi Commercial Projects Office',
    companyId: 'comp-3',
    companyName: 'Artify Contracting & Infrastructure LLC',
    locationId: 'loc-4',
    locationName: 'Ruwi Central Complex',
    manager: 'Tariq Al-Balushi',
    address: 'CBD Floor 8, Ruwi, Muscat',
    phone: '+968 2470 3301',
    email: 'ruwi.ops@artify-contracting.com',
    currency: 'OMR',
    isTaxBranch: false,
    status: 'Active',
    createdAt: '2021-06-25'
  }
];

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept-1',
    code: 'DEP-FIN',
    name: 'Corporate Finance & Treasury',
    companyId: 'comp-1',
    companyName: 'Artify Group Holdings SAOC',
    branchId: 'br-1',
    branchName: 'Muscat Corporate HQ',
    departmentHead: 'Sarah Jenkins (VP Finance)',
    costCenterCode: 'CC-100-FIN',
    status: 'Active',
    employeeCount: 24
  },
  {
    id: 'dept-2',
    code: 'DEP-SCM',
    name: 'Strategic Procurement & Supply Chain',
    companyId: 'comp-2',
    companyName: 'Artify Industrial & EPC Solutions LLC',
    branchId: 'br-2',
    branchName: 'Sohar Heavy Fabrication Plant',
    departmentHead: 'Mansoor Al-Harthy',
    costCenterCode: 'CC-200-SCM',
    status: 'Active',
    employeeCount: 38
  },
  {
    id: 'dept-3',
    code: 'DEP-ENG',
    name: 'EPC Engineering & Project Operations',
    companyId: 'comp-3',
    companyName: 'Artify Contracting & Infrastructure LLC',
    branchId: 'br-4',
    branchName: 'Ruwi Commercial Projects Office',
    departmentHead: 'Eng. Farooq Al-Mamari',
    costCenterCode: 'CC-300-ENG',
    status: 'Active',
    employeeCount: 142
  },
  {
    id: 'dept-4',
    code: 'DEP-IT',
    name: 'Enterprise IT, Cloud & Cybersecurity',
    companyId: 'comp-1',
    companyName: 'Artify Group Holdings SAOC',
    branchId: 'br-1',
    branchName: 'Muscat Corporate HQ',
    departmentHead: 'Dr. Tariq Al-Said (CIO)',
    costCenterCode: 'CC-100-IT',
    status: 'Active',
    employeeCount: 18
  },
  {
    id: 'dept-5',
    code: 'DEP-HR',
    name: 'Human Capital Management',
    companyId: 'comp-1',
    companyName: 'Artify Group Holdings SAOC',
    branchId: 'br-1',
    branchName: 'Muscat Corporate HQ',
    departmentHead: 'Amina Al-Farsi',
    costCenterCode: 'CC-100-HR',
    status: 'Active',
    employeeCount: 15
  },
  {
    id: 'dept-6',
    code: 'DEP-AUD',
    name: 'Internal Audit & Governance',
    companyId: 'comp-1',
    companyName: 'Artify Group Holdings SAOC',
    branchId: 'br-1',
    branchName: 'Muscat Corporate HQ',
    departmentHead: 'David Vance (Lead Auditor)',
    costCenterCode: 'CC-100-AUD',
    status: 'Active',
    employeeCount: 8
  }
];

export const INITIAL_LOCATIONS: Location[] = [
  {
    id: 'loc-1',
    code: 'LOC-MCT-01',
    name: 'Muscat Executive Tower',
    locationType: 'Headquarters',
    companyId: 'comp-1',
    companyName: 'Artify Group Holdings SAOC',
    country: 'Oman',
    region: 'Muscat Governorate',
    city: 'Muscat',
    address: 'Qurum Commercial Area, Building 402',
    coordinates: '23.6143° N, 58.5372° E',
    status: 'Active'
  },
  {
    id: 'loc-2',
    code: 'LOC-SHR-02',
    name: 'Sohar Industrial Zone II',
    locationType: 'Factory / Plant',
    companyId: 'comp-2',
    companyName: 'Artify Industrial & EPC Solutions LLC',
    country: 'Oman',
    region: 'Al Batinah',
    city: 'Sohar',
    address: 'Heavy Industrial Zone Phase 2, Plot 89',
    coordinates: '24.3644° N, 56.7468° E',
    status: 'Active'
  },
  {
    id: 'loc-3',
    code: 'LOC-DXB-03',
    name: 'Dubai Internet City Site',
    locationType: 'Regional Office',
    companyId: 'comp-4',
    companyName: 'Artify Tech Innovations FZ-LLC',
    country: 'UAE',
    region: 'Dubai',
    city: 'Dubai',
    address: 'Building 14, Unit 402, Internet City',
    coordinates: '25.0934° N, 55.1561° E',
    status: 'Active'
  },
  {
    id: 'loc-4',
    code: 'LOC-RUW-04',
    name: 'Ruwi Central Complex',
    locationType: 'Regional Office',
    companyId: 'comp-3',
    companyName: 'Artify Contracting & Infrastructure LLC',
    country: 'Oman',
    region: 'Muscat',
    city: 'Ruwi',
    address: 'CBD Floor 8, Ruwi',
    coordinates: '23.5932° N, 58.5421° E',
    status: 'Active'
  }
];

export const INITIAL_OPERATING_UNITS: OperatingUnit[] = [
  {
    id: 'ou-1',
    code: 'OU-EPC-COR',
    name: 'Oil & Gas EPC Core Division',
    companyId: 'comp-2',
    companyName: 'Artify Industrial & EPC Solutions LLC',
    branchId: 'br-2',
    departmentId: 'dept-3',
    locationId: 'loc-2',
    manager: 'Eng. Khalid Al-Amri',
    unitType: 'Profit Center',
    status: 'Active'
  },
  {
    id: 'ou-2',
    code: 'OU-CIVIL-INF',
    name: 'Civil Infrastructure Division',
    companyId: 'comp-3',
    companyName: 'Artify Contracting & Infrastructure LLC',
    branchId: 'br-4',
    departmentId: 'dept-3',
    locationId: 'loc-4',
    manager: 'Sultan Al-Wahaibi',
    unitType: 'Profit Center',
    status: 'Active'
  },
  {
    id: 'ou-3',
    code: 'OU-CLOUD-DIG',
    name: 'Cloud & AI Innovation Unit',
    companyId: 'comp-4',
    companyName: 'Artify Tech Innovations FZ-LLC',
    branchId: 'br-3',
    departmentId: 'dept-4',
    locationId: 'loc-3',
    manager: 'Elena Rostova',
    unitType: 'Profit Center',
    status: 'Active'
  },
  {
    id: 'ou-4',
    code: 'OU-CORP-SERV',
    name: 'Shared Corporate Services Unit',
    companyId: 'comp-1',
    companyName: 'Artify Group Holdings SAOC',
    branchId: 'br-1',
    departmentId: 'dept-1',
    locationId: 'loc-1',
    manager: 'Sarah Jenkins',
    unitType: 'Cost Center',
    status: 'Active'
  }
];

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr-1',
    userId: 'U1001',
    username: 'cfo.sarah',
    fullName: 'Sarah Jenkins',
    email: 's.jenkins@artify-group.com',
    mobile: '+968 9123 4567',
    employeeRef: 'EMP-00102',
    companyId: 'comp-1',
    companyName: 'Artify Group Holdings SAOC',
    branchId: 'br-1',
    departmentId: 'dept-1',
    departmentName: 'Corporate Finance & Treasury',
    position: 'Chief Financial Officer (CFO)',
    roleId: 'role-cfo',
    roleName: 'CFO / Group Financial Officer',
    userGroupId: 'grp-fin-exec',
    userGroupName: 'Executive Finance Committee',
    status: 'Active',
    authMethod: 'MFA / TOTP',
    mfaEnabled: true,
    lastLogin: '2026-08-20 08:45 UTC',
    lastLoginIp: '185.190.24.12 (Muscat HQ)',
    createdAt: '2022-01-10'
  },
  {
    id: 'usr-2',
    userId: 'U1002',
    username: 'salim.ceo',
    fullName: 'Eng. Salim Al-Rawahi',
    email: 's.alrawahi@artify-group.com',
    mobile: '+968 9234 5678',
    employeeRef: 'EMP-00001',
    companyId: 'comp-1',
    companyName: 'Artify Group Holdings SAOC',
    branchId: 'br-1',
    departmentId: 'dept-1',
    departmentName: 'Executive Directorate',
    position: 'Group Chief Executive Officer (CEO)',
    roleId: 'role-ceo',
    roleName: 'Group Chief Executive Officer',
    userGroupId: 'grp-exec-board',
    userGroupName: 'Board of Directors & Executives',
    status: 'Active',
    authMethod: 'FIDO2 WebAuthn',
    mfaEnabled: true,
    lastLogin: '2026-08-20 07:15 UTC',
    lastLoginIp: '185.190.24.10 (Muscat HQ)',
    createdAt: '2020-01-15'
  },
  {
    id: 'usr-3',
    userId: 'U1003',
    username: 'mansoor.scm',
    fullName: 'Mansoor Al-Harthy',
    email: 'm.alharthy@artify-industrial.com',
    mobile: '+968 9345 6789',
    employeeRef: 'EMP-00412',
    companyId: 'comp-2',
    companyName: 'Artify Industrial & EPC Solutions LLC',
    branchId: 'br-2',
    departmentId: 'dept-2',
    departmentName: 'Strategic Procurement & Supply Chain',
    position: 'VP Supply Chain & Procurement',
    roleId: 'role-coo',
    roleName: 'COO / Operations Director',
    userGroupId: 'grp-proc-mgmt',
    userGroupName: 'Procurement Management',
    status: 'Active',
    authMethod: 'MFA / TOTP',
    mfaEnabled: true,
    lastLogin: '2026-08-19 16:30 UTC',
    lastLoginIp: '82.178.44.89 (Sohar Plant)',
    createdAt: '2021-04-01'
  },
  {
    id: 'usr-4',
    userId: 'U1004',
    username: 'david.auditor',
    fullName: 'David Vance',
    email: 'd.vance@artify-group.com',
    mobile: '+968 9456 7890',
    employeeRef: 'EMP-00789',
    companyId: 'comp-1',
    companyName: 'Artify Group Holdings SAOC',
    branchId: 'br-1',
    departmentId: 'dept-6',
    departmentName: 'Internal Audit & Governance',
    position: 'Senior Enterprise Auditor',
    roleId: 'role-auditor',
    roleName: 'Internal / External Auditor',
    userGroupId: 'grp-auditors',
    userGroupName: 'Audit & Compliance Committee',
    status: 'Active',
    authMethod: 'SAML SSO',
    mfaEnabled: true,
    lastLogin: '2026-08-20 09:12 UTC',
    lastLoginIp: '185.190.24.15 (Muscat HQ)',
    createdAt: '2023-02-15'
  },
  {
    id: 'usr-5',
    userId: 'U1005',
    username: 'rashid.fin',
    fullName: 'Rashid Al-Kiyumi',
    email: 'r.alkiyumi@artify-group.com',
    mobile: '+968 9567 8901',
    employeeRef: 'EMP-00554',
    companyId: 'comp-1',
    companyName: 'Artify Group Holdings SAOC',
    branchId: 'br-1',
    departmentId: 'dept-1',
    departmentName: 'Corporate Finance & Treasury',
    position: 'Senior Finance Manager',
    roleId: 'role-finmgr',
    roleName: 'Finance Manager',
    userGroupId: 'grp-fin-team',
    userGroupName: 'Finance Operations Team',
    status: 'Active',
    authMethod: 'MFA / TOTP',
    mfaEnabled: true,
    lastLogin: '2026-08-20 08:10 UTC',
    lastLoginIp: '185.190.24.22 (Muscat HQ)',
    createdAt: '2022-06-01'
  },
  {
    id: 'usr-6',
    userId: 'U1006',
    username: 'khalil.admin',
    fullName: 'Khalil Al-Zadjali',
    email: 'sysadmin@artify-group.com',
    mobile: '+968 9678 9012',
    employeeRef: 'EMP-00045',
    companyId: 'comp-1',
    companyName: 'Artify Group Holdings SAOC',
    branchId: 'br-1',
    departmentId: 'dept-4',
    departmentName: 'Enterprise IT, Cloud & Cybersecurity',
    position: 'Principal ERP Administrator',
    roleId: 'role-admin',
    roleName: 'System Administrator (Super Admin)',
    userGroupId: 'grp-sysadmins',
    userGroupName: 'ERP Global Administrators',
    status: 'Active',
    authMethod: 'FIDO2 WebAuthn',
    mfaEnabled: true,
    lastLogin: '2026-08-20 09:30 UTC',
    lastLoginIp: '185.190.24.01 (Admin VPN)',
    createdAt: '2020-01-10'
  },
  {
    id: 'usr-7',
    userId: 'U1007',
    username: 'fatima.ap',
    fullName: 'Fatima Al-Hinai',
    email: 'f.alhinai@artify-industrial.com',
    mobile: '+968 9789 0123',
    employeeRef: 'EMP-00892',
    companyId: 'comp-2',
    companyName: 'Artify Industrial & EPC Solutions LLC',
    branchId: 'br-2',
    departmentId: 'dept-1',
    departmentName: 'Finance & Accounts',
    position: 'AP Accountant',
    roleId: 'role-ap-clerk',
    roleName: 'Accounts Payable Clerk',
    userGroupId: 'grp-fin-team',
    userGroupName: 'Finance Operations Team',
    status: 'Active',
    authMethod: 'Password',
    mfaEnabled: true,
    lastLogin: '2026-08-19 14:20 UTC',
    lastLoginIp: '82.178.44.92 (Sohar Plant)',
    createdAt: '2023-05-15'
  },
  {
    id: 'usr-8',
    userId: 'U1008',
    username: 'samir.suspended',
    fullName: 'Samir Qureshi',
    email: 's.qureshi@artify-contracting.com',
    mobile: '+968 9890 1234',
    employeeRef: 'EMP-00331',
    companyId: 'comp-3',
    companyName: 'Artify Contracting & Infrastructure LLC',
    branchId: 'br-4',
    departmentId: 'dept-3',
    departmentName: 'EPC Engineering',
    position: 'Site Procurement Coordinator',
    roleId: 'role-proc-officer',
    roleName: 'Procurement Officer',
    userGroupId: 'grp-proc-team',
    userGroupName: 'Procurement Operations Team',
    status: 'Locked',
    authMethod: 'Password',
    mfaEnabled: false,
    lastLogin: '2026-08-10 11:05 UTC',
    lastLoginIp: '194.126.88.10 (Untrusted IP)',
    createdAt: '2022-11-20'
  }
];

export const INITIAL_USER_GROUPS: UserGroup[] = [
  {
    id: 'grp-sysadmins',
    code: 'GRP-SYSADMIN',
    name: 'ERP Global Administrators',
    description: 'Full administrative access across all 17 modules, security policies, and DB configurations.',
    memberCount: 3,
    members: ['usr-6'],
    assignedRoles: ['role-admin'],
    status: 'Active',
    createdAt: '2020-01-15'
  },
  {
    id: 'grp-exec-board',
    code: 'GRP-EXEC-BOARD',
    name: 'Board of Directors & Executives',
    description: 'Executive committee sign-off, group-level consolidation visibility, and strategic KPI access.',
    memberCount: 5,
    members: ['usr-2'],
    assignedRoles: ['role-ceo'],
    status: 'Active',
    createdAt: '2020-01-20'
  },
  {
    id: 'grp-fin-exec',
    code: 'GRP-FIN-EXEC',
    name: 'Executive Finance Committee',
    description: 'Statutory approvals, period closing, high-value disbursements, and banking authorizations.',
    memberCount: 4,
    members: ['usr-1'],
    assignedRoles: ['role-cfo'],
    status: 'Active',
    createdAt: '2022-01-12'
  },
  {
    id: 'grp-fin-team',
    code: 'GRP-FIN-OPS',
    name: 'Finance Operations Team',
    description: 'Day-to-day general ledger, AP/AR entries, bank reconciliation, and asset accounting.',
    memberCount: 22,
    members: ['usr-5', 'usr-7'],
    assignedRoles: ['role-finmgr', 'role-ap-clerk'],
    status: 'Active',
    createdAt: '2022-01-15'
  },
  {
    id: 'grp-auditors',
    code: 'GRP-AUDIT-COMP',
    name: 'Audit & Compliance Committee',
    description: 'Read-only immutable access to forensic logs, journal linkages, and change histories.',
    memberCount: 8,
    members: ['usr-4'],
    assignedRoles: ['role-auditor'],
    status: 'Active',
    createdAt: '2023-02-15'
  }
];

export const INITIAL_SOD_RULES: SoDRule[] = [
  {
    id: 'sod-1',
    code: 'SOD-PROC-01',
    title: 'Vendor Master Creation vs. Vendor Invoice Approval',
    description: 'A single user must not be permitted to create a vendor master record AND approve invoices or disbursement payments for that vendor.',
    severity: 'Critical',
    conflictingActionA: 'Vendor Master Creation (07.01.01.01)',
    conflictingActionB: 'Vendor Invoice Approval (07.03.01.03)',
    moduleA: '07 — Procurement',
    moduleB: '16 — Financial Accounting',
    status: 'Enforced',
    activeViolationsCount: 0,
    exceptions: []
  },
  {
    id: 'sod-2',
    code: 'SOD-FIN-02',
    title: 'Bank Master Setup vs. Electronic Fund Release',
    description: 'Treasury officers configuring bank accounts or IBAN details cannot execute final dual-authorization fund releases.',
    severity: 'Critical',
    conflictingActionA: 'Bank Account Master Setup (04.01.01.01)',
    conflictingActionB: 'EFT Payment Release (04.03.01.02)',
    moduleA: '04 — Banking & Treasury',
    moduleB: '04 — Banking & Treasury',
    status: 'Enforced',
    activeViolationsCount: 0,
    exceptions: []
  },
  {
    id: 'sod-3',
    code: 'SOD-GL-03',
    title: 'Manual Journal Creation vs. Posting Approval',
    description: 'Accountants preparing manual journal adjustments cannot authorize or post their own journal vouchers to the General Ledger.',
    severity: 'High',
    conflictingActionA: 'Journal Entry Creation (16.01.01.01)',
    conflictingActionB: 'Journal Posting & General Ledger Commit (16.01.01.03)',
    moduleA: '16 — Financial Accounting',
    moduleB: '16 — Financial Accounting',
    status: 'Enforced',
    activeViolationsCount: 1,
    exceptions: [
      {
        id: 'exc-101',
        userId: 'usr-5',
        userName: 'Rashid Al-Kiyumi',
        approvedBy: 'Sarah Jenkins (CFO)',
        reason: 'Temporary quarter-end closing emergency coverage for Sohar plant subsidiary.',
        expiresAt: '2026-08-31',
        status: 'Active'
      }
    ]
  },
  {
    id: 'sod-4',
    code: 'SOD-HR-04',
    title: 'Employee Master Creation vs. Payroll Batch Execution',
    description: 'HR personnel adding or editing employee salary bank details cannot trigger the monthly WPS payroll file generation.',
    severity: 'High',
    conflictingActionA: 'Employee Master Maintenance (10.01.01.01)',
    conflictingActionB: 'Payroll WPS Disbursement (11.02.01.03)',
    moduleA: '10 — Human Resources',
    moduleB: '11 — Payroll Management',
    status: 'Enforced',
    activeViolationsCount: 0,
    exceptions: []
  }
];

export const INITIAL_ACCESS_RESTRICTIONS: AccessRestriction[] = [
  {
    id: 'ar-1',
    name: 'Corporate HQ Static IP Whitelist',
    type: 'IP Whitelist',
    targetType: 'Company',
    targetValue: 'Artify Group Holdings SAOC (All Entities)',
    ruleValue: '185.190.24.0/24, 82.178.44.0/24',
    enforceMfa: true,
    status: 'Active',
    description: 'Restricts executive finance and administration logins strictly to corporate HQ and plant fixed lease lines.'
  },
  {
    id: 'ar-2',
    name: 'Treasury Dual Authorization Weekend Restriction',
    type: 'Time Window',
    targetType: 'Role',
    targetValue: 'Finance Manager & AP Clerk',
    ruleValue: 'Sunday-Thursday 07:00 - 19:00 GST (GMT+4)',
    enforceMfa: true,
    status: 'Active',
    description: 'Prohibits off-hours financial disbursements without emergency executive override.'
  },
  {
    id: 'ar-3',
    name: 'Executive FIDO2 Hardware Key Enforcement',
    type: 'Device Binding',
    targetType: 'Role',
    targetValue: 'CEO, CFO, Group CIO, Senior Auditor',
    ruleValue: 'YubiKey 5C NFC / Apple TouchID Secure Enclave required',
    enforceMfa: true,
    status: 'Active',
    description: 'Enforces WebAuthn hardware token requirement for tier-1 authorization roles.'
  }
];

export const INITIAL_WORKFLOWS: ApprovalWorkflow[] = [
  {
    id: 'wf-1',
    code: 'WF-CAPEX-01',
    name: 'Major Capital Expenditure (CAPEX) Multi-Tier Workflow',
    module: '07 — Procurement',
    process: '07.03 Purchase Requisitions',
    triggerEvent: 'Document Submit',
    stages: [
      {
        stageNumber: 1,
        name: 'Technical & Scope Review',
        approverType: 'Department Head',
        approverValue: 'Department Head (Cost Center Owner)',
        timeoutHours: 24,
        allowDelegation: true
      },
      {
        stageNumber: 2,
        name: 'Budget & Commercial Verification',
        approverType: 'Role',
        approverValue: 'Finance Manager',
        approvalLimitOMR: 5000,
        timeoutHours: 48,
        allowDelegation: true
      },
      {
        stageNumber: 3,
        name: 'Executive & Board Sign-off',
        approverType: 'Role',
        approverValue: 'CFO / Group CEO',
        approvalLimitOMR: 50000,
        timeoutHours: 72,
        allowDelegation: false
      }
    ],
    status: 'Active',
    createdAt: '2022-03-01',
    updatedAt: '2026-08-01'
  },
  {
    id: 'wf-2',
    code: 'WF-IPC-02',
    name: 'Interim Payment Certificate (IPC) Certification Workflow',
    module: '15 — Construction & EPC Operations',
    process: '15.02 IPC Management',
    triggerEvent: 'Document Submit',
    stages: [
      {
        stageNumber: 1,
        name: 'Quantity Surveyor Site Verification',
        approverType: 'Role',
        approverValue: 'Lead Quantity Surveyor (QS)',
        timeoutHours: 48,
        allowDelegation: false
      },
      {
        stageNumber: 2,
        name: 'Project Director Certification',
        approverType: 'Role',
        approverValue: 'Project Director',
        timeoutHours: 48,
        allowDelegation: true
      },
      {
        stageNumber: 3,
        name: 'Corporate Commercial Release',
        approverType: 'Role',
        approverValue: 'VP Operations & CFO',
        timeoutHours: 72,
        allowDelegation: false
      }
    ],
    status: 'Active',
    createdAt: '2023-01-10',
    updatedAt: '2026-07-15'
  }
];

export const INITIAL_APPROVAL_MATRICES: ApprovalMatrixRule[] = [
  {
    id: 'am-1',
    companyId: 'comp-1',
    departmentId: 'dept-1',
    module: '16 — Financial Accounting',
    transactionType: 'Manual Journal Voucher / Debit Note',
    minAmount: 0,
    maxAmount: 500,
    currency: 'OMR',
    approvalLevels: ['Senior Accountant (Tier 1)'],
    effectiveDate: '2026-01-01',
    status: 'Active'
  },
  {
    id: 'am-2',
    companyId: 'comp-1',
    departmentId: 'dept-1',
    module: '16 — Financial Accounting',
    transactionType: 'Manual Journal Voucher / Debit Note',
    minAmount: 501,
    maxAmount: 5000,
    currency: 'OMR',
    approvalLevels: ['Department Head', 'Finance Manager (Tier 2)'],
    effectiveDate: '2026-01-01',
    status: 'Active'
  },
  {
    id: 'am-3',
    companyId: 'comp-1',
    departmentId: 'dept-1',
    module: '16 — Financial Accounting',
    transactionType: 'Manual Journal Voucher / Debit Note',
    minAmount: 5001,
    maxAmount: 50000,
    currency: 'OMR',
    approvalLevels: ['Department Head', 'Finance Manager', 'CFO (Tier 3)'],
    effectiveDate: '2026-01-01',
    status: 'Active'
  },
  {
    id: 'am-4',
    companyId: 'comp-1',
    departmentId: 'dept-1',
    module: '16 — Financial Accounting',
    transactionType: 'Manual Journal Voucher / Debit Note',
    minAmount: 50001,
    maxAmount: 9999999,
    currency: 'OMR',
    approvalLevels: ['Department Head', 'Finance Manager', 'CFO', 'Group CEO & Board (Tier 4)'],
    effectiveDate: '2026-01-01',
    status: 'Active'
  }
];

export const INITIAL_DELEGATIONS: DelegationOfAuthority[] = [
  {
    id: 'doa-1',
    delegatorId: 'usr-1',
    delegatorName: 'Sarah Jenkins',
    delegatorRole: 'CFO / Group Financial Officer',
    delegateId: 'usr-5',
    delegateName: 'Rashid Al-Kiyumi',
    delegateRole: 'Senior Finance Manager',
    startDate: '2026-08-25',
    endDate: '2026-09-05',
    scope: 'Financial Only',
    maxApprovalLimitOMR: 15000,
    reason: 'Scheduled executive leave during annual international audit summit.',
    status: 'Scheduled'
  }
];

export const INITIAL_APPROVAL_LIMITS: ApprovalLimit[] = [
  {
    id: 'lim-1',
    targetType: 'Role',
    targetName: 'Accounts Payable Clerk',
    companyId: 'comp-1',
    module: '07 — Procurement',
    transactionType: 'Purchase Order',
    limitAmount: 500,
    currency: 'OMR',
    effectiveDate: '2026-01-01',
    status: 'Active'
  },
  {
    id: 'lim-2',
    targetType: 'Role',
    targetName: 'Department Head / Cost Center Manager',
    companyId: 'comp-1',
    module: '07 — Procurement',
    transactionType: 'Purchase Order',
    limitAmount: 5000,
    currency: 'OMR',
    effectiveDate: '2026-01-01',
    status: 'Active'
  },
  {
    id: 'lim-3',
    targetType: 'Role',
    targetName: 'Finance Manager',
    companyId: 'comp-1',
    module: '07 — Procurement',
    transactionType: 'Purchase Order',
    limitAmount: 25000,
    currency: 'OMR',
    effectiveDate: '2026-01-01',
    status: 'Active'
  },
  {
    id: 'lim-4',
    targetType: 'Role',
    targetName: 'CFO / VP Finance',
    companyId: 'comp-1',
    module: '07 — Procurement',
    transactionType: 'Purchase Order',
    limitAmount: 100000,
    currency: 'OMR',
    effectiveDate: '2026-01-01',
    status: 'Active'
  },
  {
    id: 'lim-5',
    targetType: 'Role',
    targetName: 'Group Chief Executive Officer (CEO)',
    companyId: 'comp-1',
    module: '07 — Procurement',
    transactionType: 'Purchase Order',
    limitAmount: 500000,
    currency: 'OMR',
    effectiveDate: '2026-01-01',
    status: 'Active'
  }
];

export const INITIAL_ESCALATION_RULES: EscalationRule[] = [
  {
    id: 'esc-1',
    workflowId: 'wf-1',
    workflowName: 'Major Capital Expenditure (CAPEX) Multi-Tier Workflow',
    stageNumber: 1,
    waitingHours: 24,
    escalationRecipient: 'Deputy Department Head / Next Senior Lead',
    reminderFrequencyHours: 6,
    maxEscalations: 2,
    notifyMethod: 'Email & In-App',
    status: 'Active'
  },
  {
    id: 'esc-2',
    workflowId: 'wf-1',
    workflowName: 'Major Capital Expenditure (CAPEX) Multi-Tier Workflow',
    stageNumber: 2,
    waitingHours: 48,
    escalationRecipient: 'CFO (Direct Escalate)',
    reminderFrequencyHours: 12,
    maxEscalations: 1,
    notifyMethod: 'Email & In-App',
    status: 'Active'
  }
];

export const INITIAL_FISCAL_YEARS: FiscalYear[] = [
  {
    id: 'fy-2026',
    yearCode: 'FY-2026',
    companyId: 'comp-1',
    companyName: 'Artify Group Holdings SAOC',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    isCurrent: true,
    status: 'Open',
    totalPeriods: 12,
    openPeriodsCount: 1
  },
  {
    id: 'fy-2025',
    yearCode: 'FY-2025',
    companyId: 'comp-1',
    companyName: 'Artify Group Holdings SAOC',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    isCurrent: false,
    status: 'Closed',
    totalPeriods: 12,
    openPeriodsCount: 0
  },
  {
    id: 'fy-2027',
    yearCode: 'FY-2027',
    companyId: 'comp-1',
    companyName: 'Artify Group Holdings SAOC',
    startDate: '2027-01-01',
    endDate: '2027-12-31',
    isCurrent: false,
    status: 'Planning',
    totalPeriods: 12,
    openPeriodsCount: 0
  }
];

export const INITIAL_POSTING_PERIODS: PostingPeriod[] = [
  {
    id: 'per-2026-01',
    fiscalYearId: 'fy-2026',
    fiscalYearCode: 'FY-2026',
    periodNumber: 1,
    periodName: 'Period 01 (January 2026)',
    startDate: '2026-01-01',
    endDate: '2026-01-31',
    subLedgers: { gl: 'Closed', ap: 'Closed', ar: 'Closed', inventory: 'Closed', fixedAssets: 'Closed', payroll: 'Closed' },
    overallStatus: 'Closed',
    closedBy: 'Sarah Jenkins',
    closedAt: '2026-02-05'
  },
  {
    id: 'per-2026-02',
    fiscalYearId: 'fy-2026',
    fiscalYearCode: 'FY-2026',
    periodNumber: 2,
    periodName: 'Period 02 (February 2026)',
    startDate: '2026-02-01',
    endDate: '2026-02-28',
    subLedgers: { gl: 'Closed', ap: 'Closed', ar: 'Closed', inventory: 'Closed', fixedAssets: 'Closed', payroll: 'Closed' },
    overallStatus: 'Closed',
    closedBy: 'Sarah Jenkins',
    closedAt: '2026-03-05'
  },
  {
    id: 'per-2026-03',
    fiscalYearId: 'fy-2026',
    fiscalYearCode: 'FY-2026',
    periodNumber: 3,
    periodName: 'Period 03 (March 2026)',
    startDate: '2026-03-01',
    endDate: '2026-03-31',
    subLedgers: { gl: 'Closed', ap: 'Closed', ar: 'Closed', inventory: 'Closed', fixedAssets: 'Closed', payroll: 'Closed' },
    overallStatus: 'Closed',
    closedBy: 'Sarah Jenkins',
    closedAt: '2026-04-05'
  },
  {
    id: 'per-2026-04',
    fiscalYearId: 'fy-2026',
    fiscalYearCode: 'FY-2026',
    periodNumber: 4,
    periodName: 'Period 04 (April 2026)',
    startDate: '2026-04-01',
    endDate: '2026-04-30',
    subLedgers: { gl: 'Closed', ap: 'Closed', ar: 'Closed', inventory: 'Closed', fixedAssets: 'Closed', payroll: 'Closed' },
    overallStatus: 'Closed',
    closedBy: 'Sarah Jenkins',
    closedAt: '2026-05-05'
  },
  {
    id: 'per-2026-05',
    fiscalYearId: 'fy-2026',
    fiscalYearCode: 'FY-2026',
    periodNumber: 5,
    periodName: 'Period 05 (May 2026)',
    startDate: '2026-05-01',
    endDate: '2026-05-31',
    subLedgers: { gl: 'Closed', ap: 'Closed', ar: 'Closed', inventory: 'Closed', fixedAssets: 'Closed', payroll: 'Closed' },
    overallStatus: 'Closed',
    closedBy: 'Sarah Jenkins',
    closedAt: '2026-06-05'
  },
  {
    id: 'per-2026-06',
    fiscalYearId: 'fy-2026',
    fiscalYearCode: 'FY-2026',
    periodNumber: 6,
    periodName: 'Period 06 (June 2026)',
    startDate: '2026-06-01',
    endDate: '2026-06-30',
    subLedgers: { gl: 'Closed', ap: 'Closed', ar: 'Closed', inventory: 'Closed', fixedAssets: 'Closed', payroll: 'Closed' },
    overallStatus: 'Closed',
    closedBy: 'Sarah Jenkins',
    closedAt: '2026-07-05'
  },
  {
    id: 'per-2026-07',
    fiscalYearId: 'fy-2026',
    fiscalYearCode: 'FY-2026',
    periodNumber: 7,
    periodName: 'Period 07 (July 2026)',
    startDate: '2026-07-01',
    endDate: '2026-07-31',
    subLedgers: { gl: 'Closed', ap: 'Closed', ar: 'Closed', inventory: 'Closed', fixedAssets: 'Closed', payroll: 'Closed' },
    overallStatus: 'Closed',
    closedBy: 'Sarah Jenkins',
    closedAt: '2026-08-05'
  },
  {
    id: 'per-2026-08',
    fiscalYearId: 'fy-2026',
    fiscalYearCode: 'FY-2026',
    periodNumber: 8,
    periodName: 'Period 08 (August 2026 — ACTIVE)',
    startDate: '2026-08-01',
    endDate: '2026-08-31',
    subLedgers: { gl: 'Open', ap: 'Open', ar: 'Open', inventory: 'Open', fixedAssets: 'Open', payroll: 'Open' },
    overallStatus: 'Open'
  },
  {
    id: 'per-2026-09',
    fiscalYearId: 'fy-2026',
    fiscalYearCode: 'FY-2026',
    periodNumber: 9,
    periodName: 'Period 09 (September 2026)',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    subLedgers: { gl: 'Locked', ap: 'Locked', ar: 'Locked', inventory: 'Locked', fixedAssets: 'Locked', payroll: 'Locked' },
    overallStatus: 'Locked'
  },
  {
    id: 'per-2026-10',
    fiscalYearId: 'fy-2026',
    fiscalYearCode: 'FY-2026',
    periodNumber: 10,
    periodName: 'Period 10 (October 2026)',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    subLedgers: { gl: 'Locked', ap: 'Locked', ar: 'Locked', inventory: 'Locked', fixedAssets: 'Locked', payroll: 'Locked' },
    overallStatus: 'Locked'
  },
  {
    id: 'per-2026-11',
    fiscalYearId: 'fy-2026',
    fiscalYearCode: 'FY-2026',
    periodNumber: 11,
    periodName: 'Period 11 (November 2026)',
    startDate: '2026-11-01',
    endDate: '2026-11-30',
    subLedgers: { gl: 'Locked', ap: 'Locked', ar: 'Locked', inventory: 'Locked', fixedAssets: 'Locked', payroll: 'Locked' },
    overallStatus: 'Locked'
  },
  {
    id: 'per-2026-12',
    fiscalYearId: 'fy-2026',
    fiscalYearCode: 'FY-2026',
    periodNumber: 12,
    periodName: 'Period 12 (December 2026)',
    startDate: '2026-12-01',
    endDate: '2026-12-31',
    subLedgers: { gl: 'Locked', ap: 'Locked', ar: 'Locked', inventory: 'Locked', fixedAssets: 'Locked', payroll: 'Locked' },
    overallStatus: 'Locked'
  }
];

export const INITIAL_DOC_SEQUENCES: DocumentSequence[] = [
  {
    id: 'seq-1',
    documentType: 'JV',
    documentTypeName: 'Journal Voucher (GL)',
    companyId: 'comp-1',
    companyName: 'Artify Group Holdings SAOC',
    prefix: 'JV-2026-',
    startingNumber: 1,
    currentNumber: 1482,
    numberLength: 6,
    fiscalYearReset: true,
    sampleFormatted: 'JV-2026-001482',
    status: 'Active'
  },
  {
    id: 'seq-2',
    documentType: 'PO',
    documentTypeName: 'Purchase Order',
    companyId: 'comp-2',
    companyName: 'Artify Industrial & EPC Solutions LLC',
    prefix: 'PO-2026-',
    startingNumber: 1,
    currentNumber: 849,
    numberLength: 6,
    fiscalYearReset: true,
    sampleFormatted: 'PO-2026-000849',
    status: 'Active'
  },
  {
    id: 'seq-3',
    documentType: 'INV',
    documentTypeName: 'Customer Tax Invoice (AR)',
    companyId: 'comp-1',
    companyName: 'Artify Group Holdings SAOC',
    prefix: 'INV-2026-',
    startingNumber: 1,
    currentNumber: 3912,
    numberLength: 6,
    fiscalYearReset: true,
    sampleFormatted: 'INV-2026-003912',
    status: 'Active'
  },
  {
    id: 'seq-4',
    documentType: 'IPC',
    documentTypeName: 'Interim Payment Certificate',
    companyId: 'comp-3',
    companyName: 'Artify Contracting & Infrastructure LLC',
    prefix: 'IPC-2026-',
    startingNumber: 1,
    currentNumber: 154,
    numberLength: 6,
    fiscalYearReset: true,
    sampleFormatted: 'IPC-2026-000154',
    status: 'Active'
  },
  {
    id: 'seq-5',
    documentType: 'PR',
    documentTypeName: 'Purchase Requisition',
    companyId: 'comp-1',
    companyName: 'Artify Group Holdings SAOC',
    prefix: 'PR-2026-',
    startingNumber: 1,
    currentNumber: 2190,
    numberLength: 6,
    fiscalYearReset: true,
    sampleFormatted: 'PR-2026-002190',
    status: 'Active'
  }
];

export const INITIAL_POSTING_CONTROLS: PostingControl = {
  id: 'ctrl-1',
  companyId: 'comp-1',
  companyName: 'Artify Group Holdings SAOC',
  allowedBackdatedDays: 5,
  allowedFutureDays: 0,
  requireFinanceManagerApprovalForBackdate: true,
  allowCrossYearPosting: false,
  unbalancedJournalBlock: true,
  status: 'Enforced'
};

export const INITIAL_PERIOD_LOCKS: PeriodLockRecord[] = [
  {
    id: 'plock-1',
    periodId: 'per-2026-07',
    periodName: 'Period 07 (July 2026)',
    companyId: 'comp-1',
    companyName: 'Artify Group Holdings SAOC',
    lockedBy: 'Sarah Jenkins (CFO)',
    lockedAt: '2026-08-05 18:00 UTC',
    lockReason: 'Monthly sub-ledger closing finalized and certified for board audit.',
    unlockRequests: [
      {
        id: 'ur-1',
        requestedBy: 'Rashid Al-Kiyumi',
        requestedAt: '2026-08-08 10:30 UTC',
        reason: 'Correction of misclassified withholding tax entry on vendor AP voucher #AP-9021',
        approvedBy: 'Sarah Jenkins',
        approvedAt: '2026-08-08 11:15 UTC',
        status: 'Approved'
      }
    ]
  }
];

export const INITIAL_MDM_DEFINITIONS: MasterDataDefinition[] = [
  {
    id: 'mdm-1',
    code: 'MDM-VEND',
    entityName: 'Vendor / Supplier Master',
    category: 'Supply Chain',
    ownerDepartment: 'Strategic Procurement',
    approvalRequired: true,
    duplicateCheckEnabled: true,
    goldenRecordCount: 420,
    version: 'v2.4',
    status: 'Active'
  },
  {
    id: 'mdm-2',
    code: 'MDM-CUST',
    entityName: 'Customer & Client Master',
    category: 'Sales',
    ownerDepartment: 'Commercial & Sales',
    approvalRequired: true,
    duplicateCheckEnabled: true,
    goldenRecordCount: 890,
    version: 'v2.1',
    status: 'Active'
  },
  {
    id: 'mdm-3',
    code: 'MDM-COA',
    entityName: 'Chart of Accounts (GL Master)',
    category: 'Finance',
    ownerDepartment: 'Corporate Finance',
    approvalRequired: true,
    duplicateCheckEnabled: true,
    goldenRecordCount: 650,
    version: 'v3.0',
    status: 'Active'
  },
  {
    id: 'mdm-4',
    code: 'MDM-ITEM',
    entityName: 'Material & Equipment Item Master',
    category: 'Supply Chain',
    ownerDepartment: 'Inventory & Warehousing',
    approvalRequired: true,
    duplicateCheckEnabled: true,
    goldenRecordCount: 14500,
    version: 'v4.2',
    status: 'Active'
  },
  {
    id: 'mdm-5',
    code: 'MDM-ASSET',
    entityName: 'Fixed Assets Master',
    category: 'Finance',
    ownerDepartment: 'Corporate Finance',
    approvalRequired: true,
    duplicateCheckEnabled: true,
    goldenRecordCount: 1840,
    version: 'v1.8',
    status: 'Active'
  }
];

export const INITIAL_DUPLICATE_RULES: DuplicateRule[] = [
  {
    id: 'dup-1',
    entityType: 'Vendor / Supplier Master',
    ruleName: 'Tax Registration Number (TRN / VAT) Exact Match',
    fieldsChecked: ['taxNumber', 'registrationNumber'],
    matchType: 'Normalized Tax ID',
    similarityThresholdPercent: 100,
    actionOnMatch: 'Block Creation',
    status: 'Active'
  },
  {
    id: 'dup-2',
    entityType: 'Vendor / Supplier Master',
    ruleName: 'Supplier Legal Name & IBAN Fuzzy Check',
    fieldsChecked: ['legalName', 'bankIban'],
    matchType: 'Fuzzy Partial',
    similarityThresholdPercent: 85,
    actionOnMatch: 'Flag for Review',
    status: 'Active'
  },
  {
    id: 'dup-3',
    entityType: 'Customer & Client Master',
    ruleName: 'Customer Email & Commercial Registration (CR)',
    fieldsChecked: ['email', 'registrationNumber'],
    matchType: 'Exact Match',
    similarityThresholdPercent: 100,
    actionOnMatch: 'Block Creation',
    status: 'Active'
  }
];

export const INITIAL_VALIDATION_RULES: ValidationRule[] = [
  {
    id: 'val-1',
    entityType: 'Vendor / Supplier Master',
    fieldName: 'taxNumber',
    ruleType: 'Regex Format',
    ruleExpression: '^(OM|AE|SA)-[A-Z0-9]{8,15}$',
    errorMessage: 'Tax/VAT identifier must comply with GCC regional tax authority syntax (e.g. OM-VAT-10029384).',
    severity: 'Error',
    status: 'Active'
  },
  {
    id: 'val-2',
    entityType: 'Chart of Accounts (GL Master)',
    fieldName: 'accountCode',
    ruleType: 'Unique Constraint',
    ruleExpression: 'COUNT(accountCode) == 1',
    errorMessage: 'GL Account code must be strictly unique across the corporate Chart of Accounts.',
    severity: 'Error',
    status: 'Active'
  },
  {
    id: 'val-3',
    entityType: 'Material & Equipment Item Master',
    fieldName: 'hsnCode',
    ruleType: 'Required',
    ruleExpression: 'LENGTH(hsnCode) >= 6',
    errorMessage: 'Harmonized System (HSN) tariff code is mandatory for cross-border customs declarations.',
    severity: 'Error',
    status: 'Active'
  }
];

export const INITIAL_MDM_APPROVALS: MasterDataApprovalRequest[] = [
  {
    id: 'mda-1',
    entityType: 'Vendor / Supplier Master',
    recordIdentifier: 'VEND-2026-089 (Al-Maha Valve Manufacturing Co)',
    recordData: {
      legalName: 'Al-Maha Valve Manufacturing Co LLC',
      country: 'Oman',
      taxNumber: 'OM-VAT-9048123',
      paymentTerms: 'Net 60 Days',
      category: 'Critical Piping Components'
    },
    submittedBy: 'Mansoor Al-Harthy',
    submittedAt: '2026-08-19 14:30 UTC',
    status: 'Pending Review',
    assignedApprover: 'Sarah Jenkins (CFO)',
    comments: 'Commercial registration and ISO 9001 certified. Requested expedited approval for Sohar refinery turnaround.'
  },
  {
    id: 'mda-2',
    entityType: 'Chart of Accounts (GL Master)',
    recordIdentifier: 'GL-54020 (Solar Photovoltaic Maintenance Expense)',
    recordData: {
      accountCode: '54020',
      accountName: 'Solar PV Maintenance & Inverter Expense',
      accountType: 'Expense',
      parentAccount: '54000 (Renewable Energy OpEx)'
    },
    submittedBy: 'Rashid Al-Kiyumi',
    submittedAt: '2026-08-18 09:15 UTC',
    status: 'Approved',
    assignedApprover: 'Sarah Jenkins (CFO)',
    comments: 'Approved for new green energy subsidiary reporting line.'
  }
];

export const INITIAL_NOTIF_TEMPLATES: NotificationTemplate[] = [
  {
    id: 'tmpl-1',
    code: 'NOTIF-APPR-REQ',
    title: 'Pending Document Approval Alert',
    channel: 'Email',
    category: 'Approval',
    subject: 'Action Required: Approval Request for {{documentType}} #{{documentNumber}} ({{amount}} {{currency}})',
    bodyTemplate: '<p>Dear {{approverName}},</p><p>A new <strong>{{documentType}}</strong> (Ref: <strong>{{documentNumber}}</strong>) submitted by <strong>{{submitterName}}</strong> requires your review and approval.</p><p><strong>Total Amount:</strong> {{amount}} {{currency}}<br/><strong>Cost Center:</strong> {{costCenter}}</p><p>Please log in to Artify ERP to approve or return this document.</p>',
    variables: ['approverName', 'documentType', 'documentNumber', 'submitterName', 'amount', 'currency', 'costCenter'],
    status: 'Active'
  },
  {
    id: 'tmpl-2',
    code: 'NOTIF-BUDGET-BREACH',
    title: 'Cost Center Budget Breach Exception',
    channel: 'In-App',
    category: 'Exception',
    subject: 'CRITICAL: Budget Cap Exceeded on Cost Center {{costCenterCode}}',
    bodyTemplate: 'Transaction {{transactionRef}} of {{amount}} {{currency}} pushes Cost Center {{costCenterCode}} to {{utilizationPercent}}% of annual cap.',
    variables: ['costCenterCode', 'transactionRef', 'amount', 'currency', 'utilizationPercent'],
    status: 'Active'
  }
];

export const INITIAL_NOTIF_RULES: NotificationRule[] = [
  {
    id: 'nrule-1',
    name: 'Instant Executive Push on High-Value Approvals (> 25,000 OMR)',
    triggerEvent: 'Document Submit (Value > 25,000 OMR)',
    channel: 'Multi-Channel',
    recipientGroup: 'Executive Finance Committee',
    priority: 'Critical',
    schedule: 'Immediate',
    status: 'Active'
  },
  {
    id: 'nrule-2',
    name: 'Daily Morning Digest for Pending Queue',
    triggerEvent: 'Daily Schedule at 08:00 AM',
    channel: 'Email',
    recipientGroup: 'All Managers with Pending Tasks',
    priority: 'Medium',
    schedule: 'Daily Morning (08:00)',
    status: 'Active'
  }
];

export const INITIAL_ALERTS: SystemAlertItem[] = [
  {
    id: 'alt-1',
    title: 'Emergency CAPEX Approval Pending',
    message: 'PO-2026-000849 (Compressor Upgrade for Sohar Plant, 48,500 OMR) awaiting CFO sign-off.',
    type: 'approval',
    priority: 'high',
    timestamp: '15 mins ago',
    read: false,
    moduleRef: '01.03',
    actionUrl: 'workflow'
  },
  {
    id: 'alt-2',
    title: 'Posting Period 07 Auto-Lock Reminder',
    message: 'July 2026 sub-ledgers scheduled for hard audit lock in 48 hours.',
    type: 'system',
    priority: 'medium',
    timestamp: '2 hours ago',
    read: false,
    moduleRef: '01.04',
    actionUrl: 'period'
  },
  {
    id: 'alt-3',
    title: 'Segregation of Duties Exception Expiring',
    message: 'Temporary SoD exception for Rashid Al-Kiyumi expires on 2026-08-31.',
    type: 'compliance',
    priority: 'high',
    timestamp: '5 hours ago',
    read: true,
    moduleRef: '01.02',
    actionUrl: 'sod'
  },
  {
    id: 'alt-4',
    title: 'Automated DB Geo-Snapshot Verified',
    message: 'Full backup snapshot (14.2 GB) successfully synced to Frankfurt DR cold vault.',
    type: 'security',
    priority: 'low',
    timestamp: '6 hours ago',
    read: true,
    moduleRef: '01.09',
    actionUrl: 'backup'
  }
];

export const INITIAL_AUDIT_TRAIL: AuditEvent[] = [
  {
    id: 'aud-1001',
    timestamp: '2026-08-20 09:28:14 UTC',
    userId: 'usr-6',
    userName: 'Khalil Al-Zadjali',
    userRole: 'Principal ERP Administrator',
    action: 'UPDATE',
    module: '01.04 Financial & Period Controls',
    entity: 'PostingPeriod',
    recordId: 'per-2026-08',
    previousValue: 'subLedgers.gl: Closed',
    newValue: 'subLedgers.gl: Open',
    ipAddress: '185.190.24.01',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4)',
    result: 'SUCCESS',
    details: 'Opened General Ledger sub-period for August 2026 month-end entries.'
  },
  {
    id: 'aud-1002',
    timestamp: '2026-08-20 08:45:02 UTC',
    userId: 'usr-1',
    userName: 'Sarah Jenkins',
    userRole: 'CFO / Group Financial Officer',
    action: 'APPROVE',
    module: '01.05 Master Data Management',
    entity: 'MasterDataApproval',
    recordId: 'mda-2',
    previousValue: 'status: Pending Review',
    newValue: 'status: Approved',
    ipAddress: '185.190.24.12',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    result: 'SUCCESS',
    details: 'Approved new GL account code GL-54020 for Solar PV OpEx.'
  },
  {
    id: 'aud-1003',
    timestamp: '2026-08-20 07:15:30 UTC',
    userId: 'usr-2',
    userName: 'Eng. Salim Al-Rawahi',
    userRole: 'Group Chief Executive Officer',
    action: 'LOGIN',
    module: '01.10 Security Management',
    entity: 'AuthSession',
    recordId: 'sess-ceo-991',
    ipAddress: '185.190.24.10',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4)',
    result: 'SUCCESS',
    details: 'Authenticated via FIDO2 WebAuthn Hardware Token.'
  },
  {
    id: 'aud-1004',
    timestamp: '2026-08-19 18:22:11 UTC',
    userId: 'usr-6',
    userName: 'Khalil Al-Zadjali',
    userRole: 'Principal ERP Administrator',
    action: 'CONFIG_CHANGE',
    module: '01.10 Security Management',
    entity: 'PasswordPolicy',
    recordId: 'pwd-policy-global',
    previousValue: 'minLength: 10, preventHistoryCount: 4',
    newValue: 'minLength: 12, preventHistoryCount: 5',
    ipAddress: '185.190.24.01',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4)',
    result: 'SUCCESS',
    details: 'Enhanced enterprise password complexity baselines to ISO 27001 standard.'
  },
  {
    id: 'aud-1005',
    timestamp: '2026-08-19 14:10:00 UTC',
    userId: 'usr-5',
    userName: 'Rashid Al-Kiyumi',
    userRole: 'Senior Finance Manager',
    action: 'CREATE',
    module: '01.01 Organization & Company Setup',
    entity: 'Branch',
    recordId: 'br-4',
    newValue: 'code: BR-RUW-OPS, name: Ruwi Commercial Projects Office',
    ipAddress: '185.190.24.22',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    result: 'SUCCESS',
    details: 'Provisioned new operational branch for Ruwi Contracting unit.'
  }
];

export const INITIAL_LOGIN_HISTORY: LoginHistoryEvent[] = [
  {
    id: 'lh-1',
    timestamp: '2026-08-20 09:30:11 UTC',
    username: 'khalil.admin',
    fullName: 'Khalil Al-Zadjali',
    result: 'Success',
    ipAddress: '185.190.24.01',
    location: 'Muscat, Oman',
    device: 'MacBook Pro 16" (M3 Max)',
    browser: 'Chrome 128.0 (macOS)'
  },
  {
    id: 'lh-2',
    timestamp: '2026-08-20 08:45:00 UTC',
    username: 'cfo.sarah',
    fullName: 'Sarah Jenkins',
    result: 'Success',
    ipAddress: '185.190.24.12',
    location: 'Muscat, Oman',
    device: 'ThinkPad X1 Carbon',
    browser: 'Edge 127.0 (Windows 11)'
  },
  {
    id: 'lh-3',
    timestamp: '2026-08-20 07:15:22 UTC',
    username: 'salim.ceo',
    fullName: 'Eng. Salim Al-Rawahi',
    result: 'Success',
    ipAddress: '185.190.24.10',
    location: 'Muscat, Oman',
    device: 'MacBook Air M2',
    browser: 'Safari 17.4 (macOS)'
  },
  {
    id: 'lh-4',
    timestamp: '2026-08-19 23:14:02 UTC',
    username: 'samir.suspended',
    fullName: 'Samir Qureshi',
    result: 'Account Locked',
    ipAddress: '194.126.88.10',
    location: 'Sofia, Bulgaria (VPN Anomaly)',
    device: 'Unknown Linux Client',
    browser: 'Firefox 120.0'
  },
  {
    id: 'lh-5',
    timestamp: '2026-08-19 16:30:10 UTC',
    username: 'mansoor.scm',
    fullName: 'Mansoor Al-Harthy',
    result: 'Success',
    ipAddress: '82.178.44.89',
    location: 'Sohar, Oman',
    device: 'Dell Latitude 7440',
    browser: 'Chrome 128.0 (Windows 11)'
  }
];

export const INITIAL_API_CLIENTS: ApiClient[] = [
  {
    id: 'api-1',
    name: 'ZATCA Phase 2 E-Invoicing Cryptographic Gateway',
    clientId: 'artify_zatca_prod_v2',
    maskedSecret: 'sec_live_9a*****************4f8b',
    scopes: ['invoices:read', 'invoices:sign', 'clearance:submit'],
    rateLimitPerMinute: 600,
    dailyRequestCount: 1420,
    status: 'Active',
    expiresAt: '2027-08-20',
    createdAt: '2024-08-20'
  },
  {
    id: 'api-2',
    name: 'CBO Host-to-Host Swift ISO 20022 Open Banking Pipe',
    clientId: 'artify_cbo_swift_h2h',
    maskedSecret: 'sec_live_7c*****************1e2a',
    scopes: ['banking:statements', 'payments:initiate', 'treasury:balances'],
    rateLimitPerMinute: 120,
    dailyRequestCount: 380,
    status: 'Active',
    expiresAt: '2027-01-15',
    createdAt: '2024-01-15'
  },
  {
    id: 'api-3',
    name: 'Third-Party Logistics (WMS / 3PL) Dispatch Webhook',
    clientId: 'artify_3pl_logistics',
    maskedSecret: 'sec_live_3d*****************8a9c',
    scopes: ['shipments:write', 'inventory:sync'],
    rateLimitPerMinute: 300,
    dailyRequestCount: 840,
    status: 'Active',
    expiresAt: '2026-12-31',
    createdAt: '2023-12-01'
  }
];

export const INITIAL_INTEGRATIONS: ExternalIntegration[] = [
  {
    id: 'ext-1',
    name: 'Central Bank of Oman (CBO) & Bank Muscat Direct Host-to-Host',
    provider: 'SWIFT Alliance Gateway & Bank Muscat Host-to-Host API',
    category: 'Banking / Treasury',
    endpoint: 'https://h2h.bankmuscat.com/api/v3/iso20022/pain001',
    authType: 'OAuth 2.0 MTLS',
    status: 'Connected / Healthy',
    lastSync: '2 mins ago (Real-time)',
    errorCount24h: 0,
    syncSchedule: 'Continuous Stream & Hourly Statement Pull'
  },
  {
    id: 'ext-2',
    name: 'Oman Tax Authority (OTA) VAT & Corporate Tax Gateway',
    provider: 'Oman Ministry of Finance Tax Authority Portal',
    category: 'Tax & Government Portal',
    endpoint: 'https://taxoman.gov.om/api/vat/v1/filing',
    authType: 'HMAC Signature',
    status: 'Connected / Healthy',
    lastSync: '1 hour ago',
    errorCount24h: 0,
    syncSchedule: 'Monthly Auto-Filing Batch'
  },
  {
    id: 'ext-3',
    name: 'Saudi ZATCA Fatoora Platform (Fatooranet Phase II)',
    provider: 'Zakat, Tax and Customs Authority (Saudi Arabia)',
    category: 'Tax & Government Portal',
    endpoint: 'https://gw-fatoora.zatca.gov.sa/e-invoicing/simulation/invoices/clearance/single',
    authType: 'OAuth 2.0 MTLS',
    status: 'Connected / Healthy',
    lastSync: '10 mins ago',
    errorCount24h: 0,
    syncSchedule: 'Instant per-invoice clearance'
  },
  {
    id: 'ext-4',
    name: 'Oracle Primavera P6 Project Management Connector',
    provider: 'Oracle Cloud Primavera EPPM',
    category: 'Legacy ERP',
    endpoint: 'https://p6.artify-group.com/p6ws/services/ActivityService',
    authType: 'API Key Header',
    status: 'Sandbox Mock',
    lastSync: '4 hours ago',
    errorCount24h: 0,
    syncSchedule: 'Daily 23:00 GST Sync'
  }
];

export const INITIAL_INTEGRATION_LOGS: IntegrationLog[] = [
  {
    id: 'ilog-1',
    timestamp: '2026-08-20 09:25:12 UTC',
    integrationName: 'Central Bank of Oman (CBO) & Bank Muscat Direct Host-to-Host',
    endpoint: '/api/v3/iso20022/camt053/statement/pull',
    method: 'GET',
    statusCode: 200,
    durationMs: 142,
    status: 'Success'
  },
  {
    id: 'ilog-2',
    timestamp: '2026-08-20 09:10:04 UTC',
    integrationName: 'Saudi ZATCA Fatoora Platform',
    endpoint: '/e-invoicing/clearance/single',
    method: 'POST',
    statusCode: 200,
    durationMs: 310,
    status: 'Success'
  },
  {
    id: 'ilog-3',
    timestamp: '2026-08-20 08:30:19 UTC',
    integrationName: 'Oman Tax Authority (OTA) VAT & Corporate Tax Gateway',
    endpoint: '/api/vat/v1/healthcheck',
    method: 'GET',
    statusCode: 200,
    durationMs: 88,
    status: 'Success'
  }
];

export const INITIAL_BACKUP_CONFIG: BackupConfiguration = {
  id: 'bk-cfg-1',
  backupType: 'Full Database',
  frequency: 'Daily at 02:00 UTC',
  retentionDays: 90,
  storageDestination: 'S3 Multi-Region Immutable Vault (Frankfurt / Muscat Cold Glacier)',
  encryptionAlgorithm: 'AES-256 GCM',
  lastBackupAt: '2026-08-20 02:00:15 UTC',
  lastBackupSizeBytes: 14839210000, // ~14.8 GB
  lastBackupStatus: 'Success',
  isAutoReplicated: true
};

export const INITIAL_RESTORE_POINTS: RestorePoint[] = [
  {
    id: 'rp-20260820-0200',
    timestamp: '2026-08-20 02:00:15 UTC',
    backupType: 'Full Scheduled DB Dump + WAL Logs',
    sizeFormatted: '14.84 GB',
    checksumSha256: '9f8a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a',
    location: 'eu-central-1 (Primary Cold Archive)',
    verified: true,
    status: 'Ready for Sandbox'
  },
  {
    id: 'rp-20260819-0200',
    timestamp: '2026-08-19 02:00:10 UTC',
    backupType: 'Full Scheduled DB Dump',
    sizeFormatted: '14.79 GB',
    checksumSha256: '3e4f5a6b7c8d9e0f1a9f8a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
    location: 'eu-central-1 (Secondary Glacier)',
    verified: true,
    status: 'Ready for Sandbox'
  },
  {
    id: 'rp-20260818-0200',
    timestamp: '2026-08-18 02:00:22 UTC',
    backupType: 'Full Scheduled DB Dump',
    sizeFormatted: '14.72 GB',
    checksumSha256: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    location: 'me-south-1 (Muscat Hot Replica)',
    verified: true,
    status: 'Archived to Cold Storage'
  }
];

export const INITIAL_DR_STATUS: DisasterRecoveryStatus = {
  rpoTargetMinutes: 15,
  currentRpoMinutes: 0.8, // 48 seconds WAL streaming
  rtoTargetMinutes: 60,
  currentRtoEstimateMinutes: 18,
  primaryRegion: 'Muscat Private Cloud DC (Tier III+)',
  failoverRegion: 'Frankfurt Equinix FR2 (Hot Standby)',
  clusterSyncStatus: 'Synchronous Streaming (Healthy)',
  drReadinessScore: 99.4,
  lastDrDrillDate: '2026-07-15 (Pass with zero data loss)'
};

export const INITIAL_SECURITY_POLICIES: SecurityPolicy[] = [
  {
    id: 'sp-1',
    policyName: 'Data-at-Rest & In-Transit Cryptography',
    category: 'Encryption',
    settingValue: 'AES-256-GCM / TLS 1.3 Strict Mode Required',
    description: 'Enforces end-to-end hardware encryption across all relational volumes and ingress traffic.',
    isMandatory: true,
    status: 'Enforced'
  },
  {
    id: 'sp-2',
    policyName: 'Mandatory Multi-Factor Authentication (MFA)',
    category: 'Data Protection',
    settingValue: 'Enforced for all users with Financial, Procurement, and System Admin roles.',
    description: 'Hardware key or TOTP token required on every login from untrusted networks.',
    isMandatory: true,
    status: 'Enforced'
  },
  {
    id: 'sp-3',
    policyName: 'Idle Session Automatic Termination',
    category: 'Session',
    settingValue: '15 Minutes Inactivity Timeout',
    description: 'Automatically revokes active session JWT tokens when no keyboard or mouse activity is detected.',
    isMandatory: true,
    status: 'Enforced'
  },
  {
    id: 'sp-4',
    policyName: 'Cross-Origin Resource Sharing (CORS) & CSP Strict Isolation',
    category: 'Network',
    settingValue: 'Strict Whitelist: *.artify-group.com',
    description: 'Blocks iframe embedding outside sanctioned enterprise portal domains and prevents XSS.',
    isMandatory: true,
    status: 'Enforced'
  }
];

export const INITIAL_PASSWORD_POLICY: PasswordPolicy = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  expiryDays: 90,
  preventHistoryCount: 5,
  maxFailedAttempts: 5,
  lockoutDurationMinutes: 30
};

export const INITIAL_ACTIVE_SESSIONS: ActiveSession[] = [
  {
    id: 'sess-1',
    userId: 'usr-6',
    userName: 'Khalil Al-Zadjali (Principal Admin)',
    role: 'System Administrator (Super Admin)',
    ipAddress: '185.190.24.01',
    location: 'Muscat Corporate HQ',
    device: 'MacBook Pro 16"',
    browser: 'Chrome 128.0',
    loginTime: '2026-08-20 09:30 UTC',
    lastActiveTime: 'Just now',
    status: 'Active'
  },
  {
    id: 'sess-2',
    userId: 'usr-1',
    userName: 'Sarah Jenkins (CFO)',
    role: 'CFO / Group Financial Officer',
    ipAddress: '185.190.24.12',
    location: 'Muscat Corporate HQ',
    device: 'ThinkPad X1 Carbon',
    browser: 'Edge 127.0',
    loginTime: '2026-08-20 08:45 UTC',
    lastActiveTime: '3 mins ago',
    status: 'Active'
  },
  {
    id: 'sess-3',
    userId: 'usr-2',
    userName: 'Eng. Salim Al-Rawahi (CEO)',
    role: 'Group Chief Executive Officer',
    ipAddress: '185.190.24.10',
    location: 'Muscat Executive Tower',
    device: 'MacBook Air M2',
    browser: 'Safari 17.4',
    loginTime: '2026-08-20 07:15 UTC',
    lastActiveTime: '12 mins ago',
    status: 'Idle'
  }
];

export const INITIAL_SECURITY_EVENTS: SecurityEvent[] = [
  {
    id: 'sec-evt-1',
    timestamp: '2026-08-20 04:12:00 UTC',
    eventType: 'Failed Login',
    severity: 'High',
    ipAddress: '194.126.88.10',
    userId: 'usr-8',
    userName: 'samir.suspended',
    details: 'Repeated 5 failed login attempts with invalid credentials from unauthorized geolocation (Bulgaria).',
    actionTaken: 'Account Locked'
  },
  {
    id: 'sec-evt-2',
    timestamp: '2026-08-19 14:02:11 UTC',
    eventType: 'Session Revoked',
    severity: 'Medium',
    ipAddress: '185.190.24.01',
    userId: 'usr-6',
    userName: 'Khalil Al-Zadjali',
    details: 'Administrator manually terminated stale mobile app session for user Fatima Al-Hinai.',
    actionTaken: 'Session Terminated'
  }
];

export const INITIAL_CURRENCIES: CurrencyDefinition[] = [
  { id: 'curr-omr', code: 'OMR', name: 'Omani Rial', symbol: 'ر.ع.', decimalPlaces: 3, exchangeRate: 1.000, isBase: true, status: 'Active' },
  { id: 'curr-aed', code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', decimalPlaces: 2, exchangeRate: 9.540, isBase: false, status: 'Active' },
  { id: 'curr-sar', code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', decimalPlaces: 2, exchangeRate: 9.740, isBase: false, status: 'Active' },
  { id: 'curr-usd', code: 'USD', name: 'US Dollar', symbol: '$', decimalPlaces: 2, exchangeRate: 2.600, isBase: false, status: 'Active' },
  { id: 'curr-eur', code: 'EUR', name: 'Euro', symbol: '€', decimalPlaces: 2, exchangeRate: 2.420, isBase: false, status: 'Active' },
  { id: 'curr-gbp', code: 'GBP', name: 'British Pound', symbol: '£', decimalPlaces: 2, exchangeRate: 2.050, isBase: false, status: 'Active' }
];
