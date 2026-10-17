// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 09: HUMAN RESOURCES (HR)
// Central Reactive State Store & Mock Database
// ==========================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Employee,
  EmployeeDocument,
  EmployeeContract,
  JobRequisition,
  Candidate,
  Interview,
  JobOffer,
  OnboardingWorkflow,
  CompanyAsset,
  AttendanceRecord,
  LeaveRequest,
  PublicHoliday,
  OvertimeClaim,
  BenefitPolicy,
  EmployeeLoan,
  SalaryAdvance,
  MedicalInsurancePlan,
  PerformanceReview,
  TrainingCourse,
  CareerDevelopmentPlan,
  SuccessionPlanningSlot,
  EmployeeTransfer,
  EmployeePromotion,
  DisciplinaryIncident,
  EmployeeSeparation,
  EndOfServiceSettlement,
  CandidateStage,
  LeaveStatus,
  OnboardingStage
} from '../types';
import { mockRandom } from '@/src/utils/mockRandom';

// ==========================================
// SEED DATA GENERATORS
// ==========================================

const initialEmployees: Employee[] = [
  {
    id: 'EMP-00101',
    employeeCode: 'ART-0101',
    firstName: 'Rashid',
    lastName: 'Al-Mansoor',
    fullName: 'Dr. Rashid Al-Mansoor',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    email: 'rashid.almansoor@artify.ae',
    phone: '+971 50 112 3456',
    gender: 'MALE',
    dateOfBirth: '1979-04-15',
    nationality: 'Emirati',
    maritalStatus: 'MARRIED',
    department: 'Executive Management',
    departmentId: 'dept-exec',
    designation: 'Chief Operating Officer (COO)',
    jobGrade: 'EXEC',
    employmentType: 'FULL_TIME',
    status: 'ACTIVE',
    joinDate: '2019-01-15',
    confirmationDate: '2019-04-15',
    reportingManagerName: 'Tariq Al-Hashimi (CEO)',
    reportingManagerTitle: 'Chief Executive Officer',
    branch: 'Dubai Corporate HQ',
    workLocation: 'HQ Executive Floor 32',
    costCenter: 'CC-1000-EXEC',
    basicSalary: 68000,
    totalCompensation: 92000,
    currency: 'AED',
    bankName: 'First Abu Dhabi Bank (FAB)',
    bankAccountNumber: '9845120034',
    iban: 'AE44033000009845120034',
    emergencyContactName: 'Fatima Al-Mansoor',
    emergencyContactRelation: 'Spouse',
    emergencyContactPhone: '+971 50 998 7766',
    leaveBalanceDays: 28,
    activeDocumentsCount: 6,
    assignedAssetsCount: 3,
    performanceScore: 4.9
  },
  {
    id: 'EMP-00102',
    employeeCode: 'ART-0102',
    firstName: 'Elena',
    lastName: 'Vostrikova',
    fullName: 'Elena Vostrikova',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    email: 'elena.v@artify.ae',
    phone: '+971 52 445 6789',
    gender: 'FEMALE',
    dateOfBirth: '1986-11-22',
    nationality: 'Russian',
    maritalStatus: 'SINGLE',
    department: 'Human Resources',
    departmentId: 'dept-hr',
    designation: 'Director of Talent & People Operations',
    jobGrade: 'G5',
    employmentType: 'EXPATRIATE',
    status: 'ACTIVE',
    joinDate: '2021-03-01',
    confirmationDate: '2021-06-01',
    reportingManagerId: 'EMP-00101',
    reportingManagerName: 'Dr. Rashid Al-Mansoor',
    reportingManagerTitle: 'Chief Operating Officer',
    branch: 'Dubai Corporate HQ',
    workLocation: 'HQ Level 18 HR Suite',
    costCenter: 'CC-1200-HR',
    basicSalary: 38000,
    totalCompensation: 52000,
    currency: 'AED',
    bankName: 'Emirates NBD',
    bankAccountNumber: '1029384756',
    iban: 'AE29026000001029384756',
    emergencyContactName: 'Dmitry Vostrikov',
    emergencyContactRelation: 'Brother',
    emergencyContactPhone: '+971 55 221 3344',
    leaveBalanceDays: 22,
    activeDocumentsCount: 5,
    assignedAssetsCount: 2,
    performanceScore: 4.8
  },
  {
    id: 'EMP-00103',
    employeeCode: 'ART-0103',
    firstName: 'Vikram',
    lastName: 'Deshmukh',
    fullName: 'Vikram Deshmukh',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    email: 'vikram.deshmukh@artify.ae',
    phone: '+971 54 887 1234',
    gender: 'MALE',
    dateOfBirth: '1984-08-10',
    nationality: 'Indian',
    maritalStatus: 'MARRIED',
    department: 'Manufacturing & Engineering',
    departmentId: 'dept-mfg',
    designation: 'Chief Plant Engineer',
    jobGrade: 'G5',
    employmentType: 'EXPATRIATE',
    status: 'ACTIVE',
    joinDate: '2020-07-15',
    confirmationDate: '2020-10-15',
    reportingManagerId: 'EMP-00101',
    reportingManagerName: 'Dr. Rashid Al-Mansoor',
    reportingManagerTitle: 'Chief Operating Officer',
    branch: 'Sohar Industrial Plant',
    workLocation: 'Plant Complex Bay 4',
    costCenter: 'CC-3000-MFG',
    basicSalary: 42000,
    totalCompensation: 56000,
    currency: 'AED',
    bankName: 'Abu Dhabi Commercial Bank (ADCB)',
    bankAccountNumber: '5566778899',
    iban: 'AE03003000005566778899',
    emergencyContactName: 'Ananya Deshmukh',
    emergencyContactRelation: 'Spouse',
    emergencyContactPhone: '+971 54 887 5544',
    leaveBalanceDays: 19,
    activeDocumentsCount: 5,
    assignedAssetsCount: 4,
    performanceScore: 4.7
  },
  {
    id: 'EMP-00104',
    employeeCode: 'ART-0104',
    firstName: 'Sarah',
    lastName: 'Al-Harthy',
    fullName: 'Eng. Sarah Al-Harthy',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    email: 'sarah.alharthy@artify.ae',
    phone: '+968 9123 4567',
    gender: 'FEMALE',
    dateOfBirth: '1991-03-29',
    nationality: 'Omani',
    maritalStatus: 'MARRIED',
    department: 'Quality Assurance & EHS',
    departmentId: 'dept-qa',
    designation: 'Lead Quality & Metallurgy Specialist',
    jobGrade: 'G4',
    employmentType: 'FULL_TIME',
    status: 'ACTIVE',
    joinDate: '2021-09-01',
    confirmationDate: '2021-12-01',
    reportingManagerId: 'EMP-00103',
    reportingManagerName: 'Vikram Deshmukh',
    reportingManagerTitle: 'Chief Plant Engineer',
    branch: 'Sohar Industrial Plant',
    workLocation: 'QA Metrology Testing Lab',
    costCenter: 'CC-3200-QA',
    basicSalary: 24000,
    totalCompensation: 33000,
    currency: 'AED',
    bankName: 'Bank Muscat',
    bankAccountNumber: '3322110099',
    iban: 'OM44001000003322110099',
    emergencyContactName: 'Khalid Al-Harthy',
    emergencyContactRelation: 'Brother',
    emergencyContactPhone: '+968 9456 7890',
    leaveBalanceDays: 24,
    activeDocumentsCount: 4,
    assignedAssetsCount: 3,
    performanceScore: 4.9
  },
  {
    id: 'EMP-00105',
    employeeCode: 'ART-0105',
    firstName: 'Marcus',
    lastName: 'Chen',
    fullName: 'Marcus Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    email: 'marcus.chen@artify.ae',
    phone: '+971 56 778 9900',
    gender: 'MALE',
    dateOfBirth: '1988-06-18',
    nationality: 'Singaporean',
    maritalStatus: 'MARRIED',
    department: 'Supply Chain & Procurement',
    departmentId: 'dept-sc',
    designation: 'Head of Global Strategic Sourcing',
    jobGrade: 'G4',
    employmentType: 'EXPATRIATE',
    status: 'ACTIVE',
    joinDate: '2022-01-10',
    confirmationDate: '2022-04-10',
    reportingManagerId: 'EMP-00101',
    reportingManagerName: 'Dr. Rashid Al-Mansoor',
    reportingManagerTitle: 'Chief Operating Officer',
    branch: 'Dubai Corporate HQ',
    workLocation: 'HQ Level 14 Supply Chain',
    costCenter: 'CC-2000-SCM',
    basicSalary: 32000,
    totalCompensation: 44000,
    currency: 'AED',
    bankName: 'Standard Chartered UAE',
    bankAccountNumber: '7788990011',
    iban: 'AE12024000007788990011',
    emergencyContactName: 'Jessica Tan',
    emergencyContactRelation: 'Spouse',
    emergencyContactPhone: '+971 56 778 1122',
    leaveBalanceDays: 16,
    activeDocumentsCount: 5,
    assignedAssetsCount: 2,
    performanceScore: 4.6
  },
  {
    id: 'EMP-00106',
    employeeCode: 'ART-0106',
    firstName: 'Zainab',
    lastName: 'Al-Qasim',
    fullName: 'Zainab Al-Qasim',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    email: 'zainab.alqasim@artify.ae',
    phone: '+966 50 334 5566',
    gender: 'FEMALE',
    dateOfBirth: '1994-10-05',
    nationality: 'Saudi',
    maritalStatus: 'SINGLE',
    department: 'Commercial Sales & CRM',
    departmentId: 'dept-sales',
    designation: 'Senior Enterprise Key Account Manager',
    jobGrade: 'G3',
    employmentType: 'FULL_TIME',
    status: 'ACTIVE',
    joinDate: '2023-02-01',
    confirmationDate: '2023-05-01',
    reportingManagerName: 'Faisal Al-Otaibi (Sales VP)',
    reportingManagerTitle: 'Vice President of Global Sales',
    branch: 'Riyadh Regional Office',
    workLocation: 'Riyadh Financial Plaza Tower 2',
    costCenter: 'CC-4000-SALES',
    basicSalary: 22000,
    totalCompensation: 31000,
    currency: 'AED',
    bankName: 'Al Rajhi Bank',
    bankAccountNumber: '4455667788',
    iban: 'SA558000004455667788',
    emergencyContactName: 'Hamad Al-Qasim',
    emergencyContactRelation: 'Father',
    emergencyContactPhone: '+966 50 112 9988',
    leaveBalanceDays: 20,
    activeDocumentsCount: 4,
    assignedAssetsCount: 3,
    performanceScore: 4.8
  },
  {
    id: 'EMP-00107',
    employeeCode: 'ART-0107',
    firstName: 'Jean-Luc',
    lastName: 'Moreau',
    fullName: 'Jean-Luc Moreau',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    email: 'jeanluc.moreau@artify.ae',
    phone: '+971 58 991 2233',
    gender: 'MALE',
    dateOfBirth: '1982-01-14',
    nationality: 'French',
    maritalStatus: 'MARRIED',
    department: 'Finance & Treasury',
    departmentId: 'dept-fin',
    designation: 'Corporate Financial Controller',
    jobGrade: 'G5',
    employmentType: 'EXPATRIATE',
    status: 'ACTIVE',
    joinDate: '2020-11-01',
    confirmationDate: '2021-02-01',
    reportingManagerName: 'Sultan Al-Nuaimi (CFO)',
    reportingManagerTitle: 'Chief Financial Officer',
    branch: 'Dubai Corporate HQ',
    workLocation: 'HQ Level 24 Finance',
    costCenter: 'CC-1100-FIN',
    basicSalary: 45000,
    totalCompensation: 60000,
    currency: 'AED',
    bankName: 'HSBC Middle East',
    bankAccountNumber: '9900112233',
    iban: 'AE88020000009900112233',
    emergencyContactName: 'Claire Moreau',
    emergencyContactRelation: 'Spouse',
    emergencyContactPhone: '+971 58 991 4455',
    leaveBalanceDays: 26,
    activeDocumentsCount: 5,
    assignedAssetsCount: 2,
    performanceScore: 4.7
  },
  {
    id: 'EMP-00108',
    employeeCode: 'ART-0108',
    firstName: 'Anil',
    lastName: 'Kumar',
    fullName: 'Anil Kumar',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    email: 'anil.kumar@artify.ae',
    phone: '+968 9555 1234',
    gender: 'MALE',
    dateOfBirth: '1993-07-12',
    nationality: 'Indian',
    maritalStatus: 'MARRIED',
    department: 'Manufacturing & Engineering',
    departmentId: 'dept-mfg',
    designation: 'CNC 5-Axis Lead Machinist',
    jobGrade: 'G2',
    employmentType: 'EXPATRIATE',
    status: 'ACTIVE',
    joinDate: '2022-05-15',
    confirmationDate: '2022-08-15',
    reportingManagerId: 'EMP-00103',
    reportingManagerName: 'Vikram Deshmukh',
    reportingManagerTitle: 'Chief Plant Engineer',
    branch: 'Sohar Industrial Plant',
    workLocation: 'Heavy Machining Cell 1',
    costCenter: 'CC-3100-SHOP',
    basicSalary: 12500,
    totalCompensation: 18000,
    currency: 'AED',
    bankName: 'National Bank of Oman',
    bankAccountNumber: '1234567890',
    iban: 'OM55002000001234567890',
    emergencyContactName: 'Pooja Kumar',
    emergencyContactRelation: 'Spouse',
    emergencyContactPhone: '+968 9555 9988',
    leaveBalanceDays: 14,
    activeDocumentsCount: 4,
    assignedAssetsCount: 2,
    performanceScore: 4.5
  },
  {
    id: 'EMP-00109',
    employeeCode: 'ART-0109',
    firstName: 'Layla',
    lastName: 'Bakir',
    fullName: 'Layla Bakir',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    email: 'layla.bakir@artify.ae',
    phone: '+971 50 665 4321',
    gender: 'FEMALE',
    dateOfBirth: '1995-12-03',
    nationality: 'Jordanian',
    maritalStatus: 'SINGLE',
    department: 'Human Resources',
    departmentId: 'dept-hr',
    designation: 'Senior HR Talent Acquisition Specialist',
    jobGrade: 'G3',
    employmentType: 'FULL_TIME',
    status: 'ACTIVE',
    joinDate: '2023-04-10',
    confirmationDate: '2023-07-10',
    reportingManagerId: 'EMP-00102',
    reportingManagerName: 'Elena Vostrikova',
    reportingManagerTitle: 'Director of Talent & People Operations',
    branch: 'Dubai Corporate HQ',
    workLocation: 'HQ Level 18 HR Suite',
    costCenter: 'CC-1200-HR',
    basicSalary: 18000,
    totalCompensation: 25000,
    currency: 'AED',
    bankName: 'Dubai Islamic Bank (DIB)',
    bankAccountNumber: '6677889900',
    iban: 'AE11025000006677889900',
    emergencyContactName: 'Tariq Bakir',
    emergencyContactRelation: 'Father',
    emergencyContactPhone: '+971 50 665 8899',
    leaveBalanceDays: 18,
    activeDocumentsCount: 5,
    assignedAssetsCount: 2,
    performanceScore: 4.8
  },
  {
    id: 'EMP-00110',
    employeeCode: 'ART-0110',
    firstName: 'Hamdan',
    lastName: 'Al-Suwaidi',
    fullName: 'Hamdan Al-Suwaidi',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    email: 'hamdan.suwaidi@artify.ae',
    phone: '+971 50 223 9911',
    gender: 'MALE',
    dateOfBirth: '1998-09-14',
    nationality: 'Emirati',
    maritalStatus: 'SINGLE',
    department: 'Information Technology',
    departmentId: 'dept-it',
    designation: 'Systems & Cloud Security Engineer',
    jobGrade: 'G3',
    employmentType: 'FULL_TIME',
    status: 'PROBATION',
    joinDate: '2026-06-01',
    confirmationDate: '2026-09-01',
    reportingManagerName: 'Tariq Al-Hashimi (CEO)',
    reportingManagerTitle: 'VP of Technology & Systems',
    branch: 'Dubai Corporate HQ',
    workLocation: 'HQ Level 8 Cloud NOC',
    costCenter: 'CC-1500-IT',
    basicSalary: 21000,
    totalCompensation: 30000,
    currency: 'AED',
    bankName: 'Abu Dhabi Islamic Bank (ADIB)',
    bankAccountNumber: '1122334455',
    iban: 'AE77028000001122334455',
    emergencyContactName: 'Mariam Al-Suwaidi',
    emergencyContactRelation: 'Mother',
    emergencyContactPhone: '+971 50 223 7788',
    leaveBalanceDays: 8,
    activeDocumentsCount: 4,
    assignedAssetsCount: 3,
    performanceScore: 4.4
  }
];

const initialDocuments: EmployeeDocument[] = [
  {
    id: 'DOC-1001',
    employeeId: 'EMP-00102',
    documentType: 'VISA_WORK_PERMIT',
    documentNumber: 'DXB-WP-2024-99120',
    title: 'UAE Employment Residence Visa',
    issuingAuthority: 'GDRFA Dubai',
    issueDate: '2024-03-10',
    expiryDate: '2026-09-15',
    status: 'EXPIRING_SOON',
    fileName: 'elena_residence_visa_2026.pdf',
    fileSize: '1.4 MB',
    verifiedBy: 'HR Government Relations Officer',
    verifiedAt: '2024-03-11',
    notes: 'Renewal process initiated with Ministry of Human Resources.'
  },
  {
    id: 'DOC-1002',
    employeeId: 'EMP-00103',
    documentType: 'PASSPORT',
    documentNumber: 'Z8920144',
    title: 'Republic of India International Passport',
    issuingAuthority: 'Embassy of India, Muscat',
    issueDate: '2018-06-20',
    expiryDate: '2028-06-19',
    status: 'VALID',
    fileName: 'vikram_passport_scan.pdf',
    fileSize: '2.8 MB',
    verifiedBy: 'Elena Vostrikova',
    verifiedAt: '2020-07-16'
  },
  {
    id: 'DOC-1003',
    employeeId: 'EMP-00103',
    documentType: 'VISA_WORK_PERMIT',
    documentNumber: 'OM-WP-2024-88421',
    title: 'Sultanate of Oman Resident Card & Work Permit',
    issuingAuthority: 'Royal Oman Police / Ministry of Labour',
    issueDate: '2024-08-01',
    expiryDate: '2026-08-01',
    status: 'EXPIRING_SOON',
    fileName: 'vikram_oman_resident_card.pdf',
    fileSize: '890 KB',
    verifiedBy: 'PRO Sohar Office',
    verifiedAt: '2024-08-02',
    notes: 'Medical fitness test clearance passed. Renewal ready.'
  },
  {
    id: 'DOC-1004',
    employeeId: 'EMP-00104',
    documentType: 'EDUCATION_DEGREE',
    documentNumber: 'SQU-ENG-2013-889',
    title: 'BSc Materials & Metallurgical Engineering',
    issuingAuthority: 'Sultan Qaboos University',
    issueDate: '2013-06-15',
    expiryDate: '2099-12-31',
    status: 'VALID',
    fileName: 'sarah_harthy_degree_attested.pdf',
    fileSize: '3.1 MB',
    verifiedBy: 'Elena Vostrikova',
    verifiedAt: '2021-09-02'
  },
  {
    id: 'DOC-1005',
    employeeId: 'EMP-00107',
    documentType: 'PASSPORT',
    documentNumber: '19FRA998012',
    title: 'French Republic Passport',
    issuingAuthority: 'Préfecture de Police Paris',
    issueDate: '2021-04-10',
    expiryDate: '2031-04-09',
    status: 'VALID',
    fileName: 'jeanluc_french_passport.pdf',
    fileSize: '1.9 MB',
    verifiedBy: 'Elena Vostrikova',
    verifiedAt: '2021-04-12'
  }
];

const initialContracts: EmployeeContract[] = [
  {
    id: 'CTR-2024-001',
    employeeId: 'EMP-00101',
    employeeName: 'Dr. Rashid Al-Mansoor',
    contractNumber: 'ART-EXEC-CTR-01',
    contractType: 'EXECUTIVE',
    startDate: '2019-01-15',
    probationMonths: 3,
    probationEndDate: '2019-04-15',
    noticePeriodDays: 90,
    basicSalary: 68000,
    housingAllowance: 16000,
    transportAllowance: 8000,
    otherAllowances: 0,
    currency: 'AED',
    status: 'ACTIVE',
    signedDate: '2019-01-10',
    renewalDueNoticeSent: false
  },
  {
    id: 'CTR-2024-002',
    employeeId: 'EMP-00102',
    employeeName: 'Elena Vostrikova',
    contractNumber: 'ART-MOHRE-2021-092',
    contractType: 'UNLIMITED',
    startDate: '2021-03-01',
    probationMonths: 6,
    probationEndDate: '2021-09-01',
    noticePeriodDays: 60,
    basicSalary: 38000,
    housingAllowance: 10000,
    transportAllowance: 4000,
    otherAllowances: 0,
    currency: 'AED',
    status: 'ACTIVE',
    signedDate: '2021-02-25',
    renewalDueNoticeSent: false
  },
  {
    id: 'CTR-2024-003',
    employeeId: 'EMP-00108',
    employeeName: 'Anil Kumar',
    contractNumber: 'ART-SOHAR-2024-110',
    contractType: 'FIXED_TERM',
    startDate: '2024-05-15',
    endDate: '2026-05-14',
    probationMonths: 3,
    probationEndDate: '2024-08-15',
    noticePeriodDays: 30,
    basicSalary: 12500,
    housingAllowance: 3500,
    transportAllowance: 2000,
    otherAllowances: 0,
    currency: 'AED',
    status: 'UNDER_RENEWAL',
    signedDate: '2024-05-10',
    renewalDueNoticeSent: true
  }
];

const initialJobRequisitions: JobRequisition[] = [
  {
    id: 'REQ-2026-081',
    reqNumber: 'JR-MFG-081',
    jobTitle: 'Senior Thermal Cryogenic Systems Engineer',
    department: 'Manufacturing & Engineering',
    headcount: 2,
    filledCount: 0,
    priority: 'CRITICAL',
    employmentType: 'FULL_TIME',
    experienceLevel: 'SENIOR',
    minSalary: 28000,
    maxSalary: 36000,
    currency: 'AED',
    targetHireDate: '2026-09-30',
    hiringManager: 'Vikram Deshmukh (Chief Plant Engineer)',
    jobDescription: 'Lead thermodynamic simulation, vacuum-jacketed cryogenic valve testing, and ASME Section VIII compliance at the Sohar valve manufacturing facility.',
    requiredSkills: ['Cryogenic Engineering', 'FEA Thermal Stress Analysis', 'ASME B31.3 & B16.34', 'AutoCAD Plant 3D'],
    status: 'PUBLISHED',
    createdAt: '2026-08-01',
    approvedBy: 'Dr. Rashid Al-Mansoor (COO)',
    applicationsCount: 14
  },
  {
    id: 'REQ-2026-082',
    reqNumber: 'JR-QA-082',
    jobTitle: 'NDT Level III Inspection Specialist',
    department: 'Quality Assurance & EHS',
    headcount: 1,
    filledCount: 0,
    priority: 'HIGH',
    employmentType: 'FULL_TIME',
    experienceLevel: 'SENIOR',
    minSalary: 22000,
    maxSalary: 27000,
    currency: 'AED',
    targetHireDate: '2026-10-15',
    hiringManager: 'Eng. Sarah Al-Harthy',
    jobDescription: 'Oversee ultrasonic (UT), radiography (RT), and dye penetrant testing on subsea forged choke bodies and API 6A valves.',
    requiredSkills: ['ASNT NDT Level III', 'Phased Array Ultrasonic', 'Radiographic Interpretation', 'API Spec 6A & 6D'],
    status: 'PUBLISHED',
    createdAt: '2026-08-05',
    approvedBy: 'Elena Vostrikova (HR Director)',
    applicationsCount: 8
  },
  {
    id: 'REQ-2026-083',
    reqNumber: 'JR-FIN-083',
    jobTitle: 'Senior Cost & Treasury Analyst',
    department: 'Finance & Treasury',
    headcount: 1,
    filledCount: 0,
    priority: 'MEDIUM',
    employmentType: 'FULL_TIME',
    experienceLevel: 'MID',
    minSalary: 18000,
    maxSalary: 24000,
    currency: 'AED',
    targetHireDate: '2026-11-01',
    hiringManager: 'Jean-Luc Moreau',
    jobDescription: 'Conduct WIP job order cost absorptions, standard costing variances, and foreign currency hedging reconciliations.',
    requiredSkills: ['CMA / ACCA', 'Cost Accounting', 'ERP General Ledger', 'Forex Exposure Modeling'],
    status: 'HR_APPROVED',
    createdAt: '2026-08-10',
    approvedBy: 'Elena Vostrikova',
    applicationsCount: 4
  }
];

const initialCandidates: Candidate[] = [
  {
    id: 'CAN-8810',
    requisitionId: 'REQ-2026-081',
    jobTitle: 'Senior Thermal Cryogenic Systems Engineer',
    fullName: 'Dr. Tariq Belkacem',
    email: 'tariq.belkacem@alumni.ec-lyon.fr',
    phone: '+971 52 918 4400',
    currentTitle: 'Lead Cryo Simulation Engineer',
    currentCompany: 'Technip Energies Middle East',
    yearsOfExperience: 11,
    expectedSalary: 34000,
    noticePeriodDays: 30,
    stage: 'FINAL_PANEL',
    aiMatchScore: 96,
    aiStrengths: ['11 years LNG and cryogenic piping design', 'ASME B16.34 certified', 'Ansys Fluent cryogenic boiling specialist'],
    aiGaps: ['Slightly higher salary expectation than midpoint (+5%)'],
    rating: 5,
    appliedDate: '2026-08-04',
    interviewsCount: 2,
    notes: ['Candidate demonstrated deep mastery of methane valve sealing at -196°C. Excellent panel communication.']
  },
  {
    id: 'CAN-8811',
    requisitionId: 'REQ-2026-081',
    jobTitle: 'Senior Thermal Cryogenic Systems Engineer',
    fullName: 'Mei-Ling Zhou',
    email: 'meiling.zhou@eng-connect.sg',
    phone: '+65 9812 3456',
    currentTitle: 'Thermal Design Specialist',
    currentCompany: 'Keppel Offshore & Marine',
    yearsOfExperience: 8,
    expectedSalary: 31000,
    noticePeriodDays: 60,
    stage: 'TECHNICAL_ASSESSMENT',
    aiMatchScore: 89,
    aiStrengths: ['Subsea cryogenic insulation expert', 'Strong CAD scripting capabilities'],
    aiGaps: ['Notice period is 60 days'],
    rating: 4,
    appliedDate: '2026-08-06',
    interviewsCount: 1,
    notes: ['Scored 92/100 on thermodynamic test problem. Scheduled for technical panel with Vikram Deshmukh.']
  },
  {
    id: 'CAN-8812',
    requisitionId: 'REQ-2026-082',
    jobTitle: 'NDT Level III Inspection Specialist',
    fullName: 'Saeed Al-Ghafri',
    email: 'saeed.ghafri@pdo.om',
    phone: '+968 9911 2233',
    currentTitle: 'Senior QA/QC Metallurgical Inspector',
    currentCompany: 'Petroleum Development Oman (PDO)',
    yearsOfExperience: 9,
    expectedSalary: 25000,
    noticePeriodDays: 30,
    stage: 'SHORTLISTED',
    aiMatchScore: 94,
    aiStrengths: ['ASNT Level III UT/RT/MT/PT certifications', 'Deep PDO and Shell DEP specifications background'],
    aiGaps: ['None identified'],
    rating: 5,
    appliedDate: '2026-08-12',
    interviewsCount: 0,
    notes: ['Profile matches requisition 100%. Resume screened by Eng. Sarah Al-Harthy.']
  }
];

const initialInterviews: Interview[] = [
  {
    id: 'INT-901',
    candidateId: 'CAN-8810',
    candidateName: 'Dr. Tariq Belkacem',
    jobTitle: 'Senior Thermal Cryogenic Systems Engineer',
    interviewType: 'FINAL_EXECUTIVE',
    scheduledDate: '2026-08-22',
    scheduledTime: '11:00 AM GST',
    durationMinutes: 60,
    interviewers: ['Dr. Rashid Al-Mansoor (COO)', 'Elena Vostrikova (HR Director)'],
    format: 'VIDEO_CALL',
    locationOrLink: 'https://meet.artify.ae/executive-panel-belkacem',
    status: 'SCHEDULED'
  },
  {
    id: 'INT-902',
    candidateId: 'CAN-8810',
    candidateName: 'Dr. Tariq Belkacem',
    jobTitle: 'Senior Thermal Cryogenic Systems Engineer',
    interviewType: 'TECHNICAL',
    scheduledDate: '2026-08-16',
    scheduledTime: '02:00 PM GST',
    durationMinutes: 90,
    interviewers: ['Vikram Deshmukh (Chief Plant Engineer)', 'Eng. Sarah Al-Harthy'],
    format: 'VIDEO_CALL',
    locationOrLink: 'https://meet.artify.ae/tech-interview-8810',
    status: 'COMPLETED',
    scorecard: {
      technicalScore: 5,
      problemSolvingScore: 5,
      communicationScore: 4,
      cultureFitScore: 5,
      leadershipScore: 4,
      overallRecommendation: 'STRONG_HIRE',
      feedback: 'Outstanding technical candidate. Solved cryogenic seal failure scenario in real time with precise thermal contraction calculations.',
      submittedBy: 'Vikram Deshmukh',
      submittedAt: '2026-08-16 16:00'
    }
  }
];

const initialJobOffers: JobOffer[] = [
  {
    id: 'OFF-2026-033',
    offerNumber: 'OFF-ART-2026-033',
    candidateId: 'CAN-8810',
    candidateName: 'Dr. Tariq Belkacem',
    requisitionId: 'REQ-2026-081',
    jobTitle: 'Senior Thermal Cryogenic Systems Engineer',
    department: 'Manufacturing & Engineering',
    grade: 'G4',
    basicSalary: 25000,
    housingAllowance: 6500,
    transportAllowance: 2500,
    annualBonusTargetPercent: 15,
    currency: 'AED',
    offeredDate: '2026-08-20',
    joiningDate: '2026-10-01',
    expiryDate: '2026-08-27',
    status: 'DRAFT',
    approvedBy: 'Elena Vostrikova (HR Director)'
  }
];

const initialOnboardingWorkflows: OnboardingWorkflow[] = [
  {
    id: 'ONB-2026-012',
    employeeId: 'EMP-00110',
    employeeName: 'Hamdan Al-Suwaidi',
    designation: 'Systems & Cloud Security Engineer',
    department: 'Information Technology',
    joinDate: '2026-06-01',
    stage: 'PROBATION_REVIEW',
    mentorName: 'Tariq Al-Hashimi (CEO)',
    mentorTitle: 'VP of Technology & Systems',
    completionPercentage: 88,
    buddyFeedback: 'Hamdan has demonstrated exceptional initiative, hardening AWS VPCs and automating SOC alerts within his first 60 days.',
    tasks: [
      { id: 'TSK-1', title: 'ERP & Azure AD Account Provisioning', category: 'IT_PROVISIONING', assignedToRole: 'IT Admin', isCompleted: true, completedAt: '2026-06-01', dueDate: '2026-06-01' },
      { id: 'TSK-2', title: 'Workstation & YubiKey Hardware Handover', category: 'IT_PROVISIONING', assignedToRole: 'IT Support', isCompleted: true, completedAt: '2026-06-01', dueDate: '2026-06-01' },
      { id: 'TSK-3', title: 'Sign HR Code of Conduct & IP Assignment', category: 'HR_ADMIN', assignedToRole: 'HR Generalist', isCompleted: true, completedAt: '2026-06-02', dueDate: '2026-06-03' },
      { id: 'TSK-4', title: 'ISO 27001 & Cyber Defense Orientation', category: 'TRAINING', assignedToRole: 'Security Lead', isCompleted: true, completedAt: '2026-06-08', dueDate: '2026-06-10' },
      { id: 'TSK-5', title: 'Day 30 Manager Milestone Review', category: 'MANAGER_CHECKIN', assignedToRole: 'Hiring Manager', isCompleted: true, completedAt: '2026-07-02', dueDate: '2026-07-05' },
      { id: 'TSK-6', title: 'Day 90 Final Probation Appraisal & Confirmation', category: 'HR_ADMIN', assignedToRole: 'HR Director', isCompleted: false, dueDate: '2026-09-01' }
    ]
  }
];

const initialCompanyAssets: CompanyAsset[] = [
  {
    id: 'AST-7701',
    assetTag: 'ART-IT-MBP-142',
    assetName: 'Apple MacBook Pro 16" M3 Max (64GB / 1TB)',
    category: 'LAPTOP',
    serialNumber: 'C02G894PLMD2',
    assignedToEmployeeId: 'EMP-00110',
    assignedToEmployeeName: 'Hamdan Al-Suwaidi',
    issueDate: '2026-06-01',
    expectedReturnDate: '2028-06-01',
    condition: 'NEW',
    status: 'ASSIGNED',
    signedCustodyReceipt: true
  },
  {
    id: 'AST-7702',
    assetTag: 'ART-IT-DELL-580',
    assetName: 'Dell Precision 7780 Mobile Workstation (RTX 4000 Ada)',
    category: 'LAPTOP',
    serialNumber: '88X99201LK',
    assignedToEmployeeId: 'EMP-00103',
    assignedToEmployeeName: 'Vikram Deshmukh',
    issueDate: '2023-08-10',
    condition: 'EXCELLENT',
    status: 'ASSIGNED',
    signedCustodyReceipt: true
  },
  {
    id: 'AST-7703',
    assetTag: 'ART-FAC-CARD-901',
    assetName: 'RFID High-Security Biometric Access Card',
    category: 'ACCESS_CARD',
    serialNumber: 'RF-88992-SEC',
    assignedToEmployeeId: 'EMP-00101',
    assignedToEmployeeName: 'Dr. Rashid Al-Mansoor',
    issueDate: '2019-01-15',
    condition: 'EXCELLENT',
    status: 'ASSIGNED',
    signedCustodyReceipt: true
  },
  {
    id: 'AST-7704',
    assetTag: 'ART-IT-MBP-149',
    assetName: 'Apple MacBook Pro 14" M3 Pro',
    category: 'LAPTOP',
    serialNumber: 'C02K998LM12',
    condition: 'NEW',
    status: 'IN_STORE',
    signedCustodyReceipt: false
  }
];

const initialAttendanceRecords: AttendanceRecord[] = [
  {
    id: 'ATT-20260820-01',
    employeeId: 'EMP-00101',
    employeeName: 'Dr. Rashid Al-Mansoor',
    department: 'Executive Management',
    date: '2026-08-20',
    checkIn: '07:45 AM',
    checkOut: '05:30 PM',
    workHours: 9.75,
    overtimeHours: 0,
    status: 'PRESENT',
    shiftName: 'Executive Flex Shift',
    location: 'Dubai Corporate HQ',
    biometricTerminalId: 'BIO-HQ-FL32'
  },
  {
    id: 'ATT-20260820-02',
    employeeId: 'EMP-00102',
    employeeName: 'Elena Vostrikova',
    department: 'Human Resources',
    date: '2026-08-20',
    checkIn: '08:12 AM',
    checkOut: '05:15 PM',
    workHours: 9.05,
    overtimeHours: 0,
    status: 'PRESENT',
    shiftName: 'General HQ Shift (08:00 - 17:00)',
    location: 'Dubai Corporate HQ',
    biometricTerminalId: 'BIO-HQ-FL18'
  },
  {
    id: 'ATT-20260820-03',
    employeeId: 'EMP-00103',
    employeeName: 'Vikram Deshmukh',
    department: 'Manufacturing & Engineering',
    date: '2026-08-20',
    checkIn: '06:50 AM',
    checkOut: '04:10 PM',
    workHours: 9.33,
    overtimeHours: 0.5,
    status: 'PRESENT',
    shiftName: 'Plant Shift Alpha (07:00 - 16:00)',
    location: 'Sohar Industrial Plant',
    biometricTerminalId: 'BIO-SOHAR-GATE1'
  },
  {
    id: 'ATT-20260820-04',
    employeeId: 'EMP-00108',
    employeeName: 'Anil Kumar',
    department: 'Manufacturing & Engineering',
    date: '2026-08-20',
    checkIn: '06:55 AM',
    checkOut: '06:00 PM',
    workHours: 11.08,
    overtimeHours: 2.0,
    status: 'PRESENT',
    shiftName: 'Machining Cell Shift (07:00 - 16:00)',
    location: 'Sohar Industrial Plant',
    biometricTerminalId: 'BIO-SOHAR-CNC'
  },
  {
    id: 'ATT-20260820-05',
    employeeId: 'EMP-00106',
    employeeName: 'Zainab Al-Qasim',
    department: 'Commercial Sales & CRM',
    date: '2026-08-20',
    checkIn: '08:35 AM',
    checkOut: '06:00 PM',
    workHours: 9.41,
    overtimeHours: 0,
    status: 'PRESENT',
    shiftName: 'Commercial Office Shift',
    location: 'Riyadh Regional Office',
    biometricTerminalId: 'BIO-RIYADH-01'
  }
];

const initialLeaveRequests: LeaveRequest[] = [
  {
    id: 'LEV-2026-089',
    requestNumber: 'LR-2026-089',
    employeeId: 'EMP-00104',
    employeeName: 'Eng. Sarah Al-Harthy',
    department: 'Quality Assurance & EHS',
    leaveType: 'ANNUAL',
    startDate: '2026-09-10',
    endDate: '2026-09-20',
    totalDays: 8,
    reason: 'Annual family vacation to Salalah Khareef season.',
    relieverEmployeeId: 'EMP-00103',
    relieverEmployeeName: 'Vikram Deshmukh',
    status: 'APPROVED',
    appliedDate: '2026-08-14',
    approvedBy: 'Elena Vostrikova (HR Director)',
    approvalRemarks: 'Approved. Vikram Deshmukh designated for emergency metallurgical approvals.'
  },
  {
    id: 'LEV-2026-090',
    requestNumber: 'LR-2026-090',
    employeeId: 'EMP-00105',
    employeeName: 'Marcus Chen',
    department: 'Supply Chain & Procurement',
    leaveType: 'ANNUAL',
    startDate: '2026-10-01',
    endDate: '2026-10-08',
    totalDays: 6,
    reason: 'Attending Singapore International Energy & Procurement Week.',
    status: 'PENDING_APPROVAL',
    appliedDate: '2026-08-18'
  },
  {
    id: 'LEV-2026-091',
    requestNumber: 'LR-2026-091',
    employeeId: 'EMP-00108',
    employeeName: 'Anil Kumar',
    department: 'Manufacturing & Engineering',
    leaveType: 'EMERGENCY',
    startDate: '2026-08-25',
    endDate: '2026-08-27',
    totalDays: 3,
    reason: 'Family domestic emergency.',
    status: 'PENDING_APPROVAL',
    appliedDate: '2026-08-19'
  }
];

const initialHolidays: PublicHoliday[] = [
  {
    id: 'HOL-2026-01',
    title: 'New Year Day',
    startDate: '2026-01-01',
    endDate: '2026-01-01',
    totalDays: 1,
    holidayType: 'STATUTORY_NATIONAL',
    applicableBranches: ['ALL'],
    isRecurring: true
  },
  {
    id: 'HOL-2026-02',
    title: 'Eid Al Fitr Holidays',
    startDate: '2026-03-19',
    endDate: '2026-03-22',
    totalDays: 4,
    holidayType: 'RELIGIOUS',
    applicableBranches: ['ALL'],
    isRecurring: false
  },
  {
    id: 'HOL-2026-03',
    title: 'Arafat Day & Eid Al Adha',
    startDate: '2026-05-26',
    endDate: '2026-05-29',
    totalDays: 4,
    holidayType: 'RELIGIOUS',
    applicableBranches: ['ALL'],
    isRecurring: false
  },
  {
    id: 'HOL-2026-04',
    title: 'Oman National Day',
    startDate: '2026-11-18',
    endDate: '2026-11-19',
    totalDays: 2,
    holidayType: 'STATUTORY_NATIONAL',
    applicableBranches: ['OMAN', 'Sohar Industrial Plant'],
    isRecurring: true
  },
  {
    id: 'HOL-2026-05',
    title: 'UAE 55th National Day (Union Day)',
    startDate: '2026-12-02',
    endDate: '2026-12-03',
    totalDays: 2,
    holidayType: 'STATUTORY_NATIONAL',
    applicableBranches: ['UAE', 'Dubai Corporate HQ'],
    isRecurring: true
  }
];

const initialOvertimeClaims: OvertimeClaim[] = [
  {
    id: 'OT-2026-051',
    claimNumber: 'OTC-2026-051',
    employeeId: 'EMP-00108',
    employeeName: 'Anil Kumar',
    department: 'Manufacturing & Engineering',
    date: '2026-08-15',
    overtimeType: 'WEEKEND_REST',
    hours: 8,
    multiplier: 2.0,
    hourlyRate: 65,
    totalPayable: 1040,
    currency: 'AED',
    reason: 'Emergency cryogenic valve machining for Saudi Aramco urgent offshore turnaround order.',
    status: 'HR_POSTED'
  },
  {
    id: 'OT-2026-052',
    claimNumber: 'OTC-2026-052',
    employeeId: 'EMP-00108',
    employeeName: 'Anil Kumar',
    department: 'Manufacturing & Engineering',
    date: '2026-08-19',
    overtimeType: 'NORMAL_DAY',
    hours: 3.5,
    multiplier: 1.5,
    hourlyRate: 65,
    totalPayable: 341.25,
    currency: 'AED',
    reason: 'Completing 5-axis roughing cycle step 30 for Work Order WO-2026-0044.',
    status: 'SUPERVISOR_APPROVED'
  }
];

const initialBenefitPolicies: BenefitPolicy[] = [
  {
    id: 'BEN-001',
    benefitName: 'Executive Housing & Utility Allowance',
    type: 'HOUSING_ALLOWANCE',
    eligibleGrades: ['G5', 'EXEC'],
    annualValue: 192000,
    frequency: 'MONTHLY',
    taxable: false,
    description: 'Direct allowance for prime corporate housing in Dubai / Riyadh.',
    enrolledCount: 14
  },
  {
    id: 'BEN-002',
    benefitName: 'Annual Executive Business Class Family Flight Tickets',
    type: 'FLIGHT_TICKETS',
    eligibleGrades: ['G4', 'G5', 'EXEC'],
    annualValue: 35000,
    frequency: 'ANNUAL',
    taxable: false,
    description: 'Round-trip home country flights for employee, spouse, and up to 3 dependents.',
    enrolledCount: 42
  },
  {
    id: 'BEN-003',
    benefitName: 'Children Private Schooling Tuition Subsidy',
    type: 'EDUCATION_SUBSIDY',
    eligibleGrades: ['G3', 'G4', 'G5', 'EXEC'],
    annualValue: 40000,
    frequency: 'ANNUAL',
    taxable: false,
    description: 'Up to AED 40,000 per child per academic year for accredited international schools.',
    enrolledCount: 68
  },
  {
    id: 'BEN-004',
    benefitName: 'Corporate Unlimited 5G Data & Mobile Plan',
    type: 'MOBILE_ALLOWANCE',
    eligibleGrades: ['G2', 'G3', 'G4', 'G5', 'EXEC'],
    annualValue: 6000,
    frequency: 'MONTHLY',
    taxable: false,
    description: 'Unlimited global roaming and local data SIM for business communication.',
    enrolledCount: 185
  }
];

const initialLoans: EmployeeLoan[] = [
  {
    id: 'LN-2026-018',
    loanNumber: 'LOAN-2026-018',
    employeeId: 'EMP-00108',
    employeeName: 'Anil Kumar',
    department: 'Manufacturing & Engineering',
    loanType: 'PERSONAL_ASSISTANCE',
    principalAmount: 24000,
    interestRatePercent: 0,
    tenureMonths: 12,
    monthlyDeduction: 2000,
    disbursementDate: '2026-01-15',
    repaidAmount: 14000,
    remainingBalance: 10000,
    status: 'DISBURSED',
    approvedBy: 'Jean-Luc Moreau (Financial Controller)'
  }
];

const initialSalaryAdvances: SalaryAdvance[] = [
  {
    id: 'ADV-2026-042',
    advanceNumber: 'ADV-2026-042',
    employeeId: 'EMP-00109',
    employeeName: 'Layla Bakir',
    requestDate: '2026-08-17',
    requestedAmount: 5000,
    accruedEarnedSalary: 12000,
    deductionPayrollMonth: 'August 2026',
    reason: 'Emergency vehicle mechanical repairs.',
    status: 'APPROVED'
  }
];

const initialInsurancePlans: MedicalInsurancePlan[] = [
  {
    id: 'INS-VIP-01',
    policyNumber: 'SUKOON-VIP-99410',
    providerName: 'Oman Insurance / Sukoon & Bupa Global',
    tierName: 'VIP Platinum Worldwide',
    eligibleGrades: ['G5', 'EXEC'],
    annualCoverageLimit: 5000000,
    coPayPercentage: 0,
    coverageScope: 'Worldwide coverage including USA/Canada, direct billing at American Hospital, Mayo Clinic.',
    enrolledEmployeesCount: 18,
    enrolledDependentsCount: 44,
    renewalDate: '2027-01-01'
  },
  {
    id: 'INS-GLD-02',
    policyNumber: 'SUKOON-GLD-88210',
    providerName: 'Sukoon Health Care',
    tierName: 'Gold Comprehensive Regional',
    eligibleGrades: ['G3', 'G4'],
    annualCoverageLimit: 1000000,
    coPayPercentage: 10,
    coverageScope: 'GCC + Home Country, inpatient and outpatient, maternity up to AED 50,000.',
    enrolledEmployeesCount: 145,
    enrolledDependentsCount: 290,
    renewalDate: '2027-01-01'
  },
  {
    id: 'INS-SLV-03',
    policyNumber: 'SUKOON-SLV-77110',
    providerName: 'Sukoon Health Care',
    tierName: 'Silver Standard Network',
    eligibleGrades: ['G1', 'G2'],
    annualCoverageLimit: 250000,
    coPayPercentage: 20,
    coverageScope: 'UAE / Oman prime network clinics and general hospitals.',
    enrolledEmployeesCount: 249,
    enrolledDependentsCount: 310,
    renewalDate: '2027-01-01'
  }
];

const initialPerformanceReviews: PerformanceReview[] = [
  {
    id: 'REV-2026-001',
    reviewNumber: 'APR-2025-0103',
    cycleId: 'CYC-2025-ANNUAL',
    cycleName: 'Annual Performance Appraisal 2025-2026',
    employeeId: 'EMP-00103',
    employeeName: 'Vikram Deshmukh',
    department: 'Manufacturing & Engineering',
    jobTitle: 'Chief Plant Engineer',
    reviewerId: 'EMP-00101',
    reviewerName: 'Dr. Rashid Al-Mansoor',
    selfRatingScore: 4.8,
    managerRatingScore: 4.7,
    finalCalibratedScore: 4.75,
    ratingLabel: 'EXCEEDS_EXPECTATIONS',
    nineBoxPerformance: 'HIGH',
    nineBoxPotential: 'HIGH',
    strengths: 'Successfully commissioned the 5-axis CNC cell 2 weeks ahead of schedule. Reduced shop floor scrap from 3.2% to 1.1%.',
    developmentAreas: 'Expand coaching of junior Omani mechanical engineers to accelerate nationalization leadership targets.',
    status: 'SIGN_OFF_COMPLETED',
    completedDate: '2026-01-20',
    goals: [
      { id: 'G-1', objective: 'Commission 5-Axis CNC Cell with zero downtime', keyResults: 'OEE > 85% within 60 days of go-live', weightagePercent: 40, targetValue: '85% OEE', achievedValue: '88.4% OEE', ratingScore: 5 },
      { id: 'G-2', objective: 'Reduce Machining Scrap Rate', keyResults: 'Scrap below 1.5% on Inconel 625 valves', weightagePercent: 30, targetValue: '< 1.5%', achievedValue: '1.1%', ratingScore: 5 },
      { id: 'G-3', objective: 'Implement ISO 3834-2 Welding Certification', keyResults: 'Audit completed with 0 major non-conformances', weightagePercent: 30, targetValue: '0 NCRs', achievedValue: '0 NCRs', ratingScore: 4 }
    ]
  },
  {
    id: 'REV-2026-002',
    reviewNumber: 'APR-2025-0104',
    cycleId: 'CYC-2025-ANNUAL',
    cycleName: 'Annual Performance Appraisal 2025-2026',
    employeeId: 'EMP-00104',
    employeeName: 'Eng. Sarah Al-Harthy',
    department: 'Quality Assurance & EHS',
    jobTitle: 'Lead Quality & Metallurgy Specialist',
    reviewerId: 'EMP-00103',
    reviewerName: 'Vikram Deshmukh',
    selfRatingScore: 4.9,
    managerRatingScore: 4.9,
    finalCalibratedScore: 4.9,
    ratingLabel: 'EXCEEDS_EXPECTATIONS',
    nineBoxPerformance: 'HIGH',
    nineBoxPotential: 'HIGH',
    strengths: 'Peerless metallurgical analytical capabilities. Single-handedly resolved the subsea stress corrosion cracking defect.',
    developmentAreas: 'Ready for promotion to Quality Director role upon retirement of current incumbent.',
    status: 'SIGN_OFF_COMPLETED',
    completedDate: '2026-01-22',
    goals: [
      { id: 'G-10', objective: 'Zero Critical QC Escapes to Client Sites', keyResults: '100% FAT pass rate on Saudi Aramco orders', weightagePercent: 50, targetValue: '100%', achievedValue: '100%', ratingScore: 5 },
      { id: 'G-11', objective: 'Establish Automated Spectrometry QA Database', keyResults: 'Digital heat treatment certs integration', weightagePercent: 50, targetValue: 'Go-Live', achievedValue: 'Completed', ratingScore: 5 }
    ]
  }
];

const initialTrainingCourses: TrainingCourse[] = [
  {
    id: 'TRN-2026-01',
    courseCode: 'TRN-ASNT-NDT3',
    title: 'Advanced Phased Array Ultrasonic Testing (PAUT) & TOFD',
    category: 'QUALITY_ISO_EHS',
    trainerProvider: 'TWI Middle East (The Welding Institute)',
    durationHours: 40,
    costPerParticipant: 8500,
    currency: 'AED',
    startDate: '2026-09-15',
    endDate: '2026-09-19',
    maxParticipants: 12,
    enrolledParticipantsCount: 8,
    status: 'UPCOMING',
    enrolledEmployeeIds: ['EMP-00104', 'EMP-00108']
  },
  {
    id: 'TRN-2026-02',
    courseCode: 'TRN-EXEC-LEAD',
    title: 'Strategic Enterprise Leadership & Operational Scaling',
    category: 'LEADERSHIP_MANAGEMENT',
    trainerProvider: 'INSEAD Executive Education Dubai',
    durationHours: 32,
    costPerParticipant: 22000,
    currency: 'AED',
    startDate: '2026-10-05',
    endDate: '2026-10-08',
    maxParticipants: 15,
    enrolledParticipantsCount: 10,
    status: 'UPCOMING',
    enrolledEmployeeIds: ['EMP-00102', 'EMP-00103', 'EMP-00105']
  },
  {
    id: 'TRN-2026-03',
    courseCode: 'TRN-CYBER-SEC',
    title: 'ISO 27001:2022 Lead Implementer & Threat Modeling',
    category: 'COMPLIANCE_LEGAL',
    trainerProvider: 'BSI Middle East',
    durationHours: 35,
    costPerParticipant: 7500,
    currency: 'AED',
    startDate: '2026-07-10',
    endDate: '2026-07-14',
    maxParticipants: 20,
    enrolledParticipantsCount: 18,
    status: 'COMPLETED',
    enrolledEmployeeIds: ['EMP-00110']
  }
];

const initialSuccessionSlots: SuccessionPlanningSlot[] = [
  {
    id: 'SUC-01',
    criticalPosition: 'Chief Operating Officer (COO)',
    currentIncumbent: 'Dr. Rashid Al-Mansoor',
    department: 'Executive Management',
    successors: [
      { employeeId: 'EMP-00103', employeeName: 'Vikram Deshmukh', currentRole: 'Chief Plant Engineer', readiness: 'READY_1_2_YEARS', potentialScore: 92 },
      { employeeId: 'EMP-00102', employeeName: 'Elena Vostrikova', currentRole: 'Director of People Operations', readiness: 'READY_3_5_YEARS', potentialScore: 88 }
    ]
  },
  {
    id: 'SUC-02',
    criticalPosition: 'Director of Quality & Metallurgy',
    currentIncumbent: 'Vacant (Open for Promotion)',
    department: 'Quality Assurance & EHS',
    successors: [
      { employeeId: 'EMP-00104', employeeName: 'Eng. Sarah Al-Harthy', currentRole: 'Lead Quality Specialist', readiness: 'READY_NOW', potentialScore: 98 }
    ]
  }
];

const initialCareerPlans: CareerDevelopmentPlan[] = [
  {
    id: 'IDP-2026-001',
    employeeId: 'EMP-00104',
    employeeName: 'Eng. Sarah Al-Harthy',
    currentRole: 'Lead Quality & Metallurgy Specialist',
    targetRole: 'Director of Quality Assurance & Metallurgical Engineering',
    readinessLevel: 'READY_NOW',
    potentialScore: 98,
    developmentGoals: [
      'Complete Executive Leadership Academy at INSEAD Dubai',
      'Lead Saudi Aramco Supplier Quality Audit & Certification',
      'Establish Automated Digital Spectrometry QA Database'
    ],
    mentors: ['Dr. Rashid Al-Mansoor', 'Jean-Luc Moreau']
  },
  {
    id: 'IDP-2026-002',
    employeeId: 'EMP-00103',
    employeeName: 'Vikram Deshmukh',
    currentRole: 'Chief Plant Engineer',
    targetRole: 'VP of Manufacturing & Plant Operations',
    readinessLevel: 'READY_1_2_YEARS',
    potentialScore: 94,
    developmentGoals: [
      'Spearhead Sohar Phase 2 Cryogenic Testing Automation Expansion',
      'Cross-departmental rotation with Procurement and Supply Chain'
    ],
    mentors: ['Dr. Rashid Al-Mansoor']
  }
];

const initialTransfers: EmployeeTransfer[] = [
  {
    id: 'TRF-2026-004',
    transferNumber: 'TRF-ART-2026-004',
    employeeId: 'EMP-00106',
    employeeName: 'Zainab Al-Qasim',
    effectiveDate: '2026-06-01',
    fromDepartment: 'Commercial Sales & CRM',
    toDepartment: 'Commercial Sales & CRM',
    fromBranch: 'Dubai Corporate HQ',
    toBranch: 'Riyadh Regional Office',
    fromManager: 'Tariq Al-Hashimi (CEO)',
    toManager: 'Faisal Al-Otaibi (Sales VP)',
    fromCostCenter: 'CC-4000-SALES-DXB',
    toCostCenter: 'CC-4000-SALES-RUH',
    relocationAllowance: 15000,
    reason: 'Leading Saudi Aramco and SABIC key strategic account expansion in Riyadh.',
    status: 'HR_EXECUTED'
  }
];

const initialPromotions: EmployeePromotion[] = [
  {
    id: 'PRM-2026-008',
    promotionNumber: 'PRM-ART-2026-008',
    employeeId: 'EMP-00104',
    employeeName: 'Eng. Sarah Al-Harthy',
    effectiveDate: '2026-09-01',
    currentTitle: 'Lead Quality & Metallurgy Specialist',
    newTitle: 'Director of Quality Assurance & Metallurgical Engineering',
    currentGrade: 'G4',
    newGrade: 'G5',
    currentSalary: 24000,
    newSalary: 32000,
    percentageHike: 33.3,
    justification: 'Exemplary leadership on PDO and Saudi Aramco cryogenic valve certifications; zero defects recorded.',
    status: 'BOARD_APPROVED'
  }
];

const initialDisciplinaryIncidents: DisciplinaryIncident[] = [
  {
    id: 'DISC-2026-002',
    caseNumber: 'DISC-CASE-2026-002',
    employeeId: 'EMP-00108',
    employeeName: 'Anil Kumar',
    department: 'Manufacturing & Engineering',
    incidentDate: '2026-02-14',
    reportedBy: 'Plant Safety Officer',
    incidentCategory: 'SAFETY_VIOLATION',
    severity: 'MINOR',
    actionTaken: 'VERBAL_WARNING',
    description: 'Observed operating hydraulic crane hoist without high-visibility safety harness during late shift.',
    committeeFindings: 'Employee completed mandatory 4-hour EHS refresher module and safety harness checklist. No injury caused.',
    pipAssigned: false,
    status: 'CLOSED_RESOLVED'
  }
];

const initialSeparations: EmployeeSeparation[] = [
  {
    id: 'SEP-2026-007',
    separationNumber: 'SEP-ART-2026-007',
    employeeId: 'EMP-00088',
    employeeName: 'David K. O’Connor',
    department: 'Manufacturing & Engineering',
    designation: 'Senior CNC Programmer',
    joinDate: '2020-03-01',
    separationType: 'RESIGNATION',
    noticeDate: '2026-07-01',
    lastWorkingDay: '2026-08-31',
    noticePeriodServedDays: 60,
    reason: 'Relocating to home country (Australia) for personal family reasons.',
    exitInterviewCompleted: true,
    clearanceStatus: {
      itAssetsCleared: true,
      facilitiesAccessBadgeReturned: true,
      financeDuesSettled: true,
      operationsHandoverCompleted: true
    },
    status: 'EOSB_CALCULATED'
  }
];

const initialEosbSettlements: EndOfServiceSettlement[] = [
  {
    id: 'EOSB-2026-007',
    settlementNumber: 'EOSB-ART-2026-007',
    separationId: 'SEP-2026-007',
    employeeId: 'EMP-00088',
    employeeName: 'David K. O’Connor',
    joinDate: '2020-03-01',
    lastWorkingDay: '2026-08-31',
    totalServiceYears: 6.5,
    totalServiceMonths: 78,
    lastBasicSalary: 22000,
    gratuityFormulaUsed: 'UAE/Oman Labor Law: 21 days basic/year for first 5 yrs + 30 days basic/year thereafter',
    gratuityAmount: 110000,
    unusedLeaveDays: 14,
    leaveEncashmentAmount: 10266.67,
    proratedDays: 31,
    proratedSalaryAmount: 22000,
    outstandingLoanDeduction: 0,
    noticeShortfallDeduction: 0,
    otherDeductions: 0,
    netSettlementPayable: 142266.67,
    currency: 'AED',
    status: 'AUDIT_APPROVED',
    approvedBy: 'Jean-Luc Moreau (Financial Controller)'
  }
];

// ==========================================
// STORE INTERFACE DEFINITION
// ==========================================

interface HrStoreContextType {
  // Master Collections
  employees: Employee[];
  documents: EmployeeDocument[];
  contracts: EmployeeContract[];
  jobRequisitions: JobRequisition[];
  candidates: Candidate[];
  interviews: Interview[];
  jobOffers: JobOffer[];
  onboardingWorkflows: OnboardingWorkflow[];
  companyAssets: CompanyAsset[];
  attendanceRecords: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  publicHolidays: PublicHoliday[];
  overtimeClaims: OvertimeClaim[];
  benefitPolicies: BenefitPolicy[];
  benefitPackages: BenefitPolicy[];
  loans: EmployeeLoan[];
  employeeLoans: EmployeeLoan[];
  salaryAdvances: SalaryAdvance[];
  insurancePlans: MedicalInsurancePlan[];
  insurancePolicies: MedicalInsurancePlan[];
  performanceReviews: PerformanceReview[];
  trainingCourses: TrainingCourse[];
  trainingPrograms: TrainingCourse[];
  careerPlans: CareerDevelopmentPlan[];
  successionSlots: SuccessionPlanningSlot[];
  transfers: EmployeeTransfer[];
  promotions: EmployeePromotion[];
  disciplinaryIncidents: DisciplinaryIncident[];
  disciplinaryRecords: DisciplinaryIncident[];
  separations: EmployeeSeparation[];
  eosbSettlements: EndOfServiceSettlement[];

  // Employee Management Actions
  addEmployee: (employee: Omit<Employee, 'id' | 'employeeCode' | 'leaveBalanceDays' | 'activeDocumentsCount' | 'assignedAssetsCount'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  addDocument: (doc: Omit<EmployeeDocument, 'id'>) => void;
  addContract: (contract: Omit<EmployeeContract, 'id'>) => void;

  // Recruitment Actions
  addJobRequisition: (req: Omit<JobRequisition, 'id' | 'reqNumber' | 'filledCount' | 'applicationsCount' | 'createdAt'>) => void;
  updateCandidateStage: (candidateId: string, stage: CandidateStage) => void;
  addCandidate: (candidate: Omit<Candidate, 'id' | 'interviewsCount' | 'notes'>) => void;
  scheduleInterview: (interview: Omit<Interview, 'id'>) => void;
  submitInterviewScorecard: (interviewId: string, scorecard: Interview['scorecard']) => void;
  createJobOffer: (offer: Omit<JobOffer, 'id' | 'offerNumber'>) => void;
  updateJobOfferStatus: (offerId: string, status: JobOffer['status']) => void;

  // Onboarding Actions
  toggleOnboardingTask: (workflowId: string, taskId: string) => void;
  updateOnboardingStage: (workflowId: string, stage: OnboardingStage) => void;
  assignAsset: (assetId: string, employeeId: string, employeeName: string) => void;
  returnAsset: (assetId: string) => void;
  addCompanyAsset: (asset: Omit<CompanyAsset, 'id'>) => void;

  // Attendance & Leave Actions
  logBiometricAttendance: (employeeId: string, type: 'CHECK_IN' | 'CHECK_OUT') => void;
  submitLeaveRequest: (req: Omit<LeaveRequest, 'id' | 'requestNumber' | 'appliedDate' | 'status'>) => void;
  updateLeaveRequestStatus: (id: string, status: LeaveStatus, remarks?: string) => void;
  addPublicHoliday: (holiday: Omit<PublicHoliday, 'id'>) => void;
  submitOvertimeClaim: (claim: Omit<OvertimeClaim, 'id' | 'claimNumber' | 'status'>) => void;
  updateOvertimeStatus: (id: string, status: OvertimeClaim['status']) => void;

  // Benefits & Loans Actions
  submitEmployeeLoan: (loan: Omit<EmployeeLoan, 'id' | 'loanNumber' | 'repaidAmount' | 'remainingBalance' | 'status'>) => void;
  applyForLoan: (loan: any) => void;
  updateLoanStatus: (id: string, status: EmployeeLoan['status']) => void;
  submitSalaryAdvance: (advance: Omit<SalaryAdvance, 'id' | 'advanceNumber' | 'requestDate' | 'status'>) => void;
  requestSalaryAdvance: (advance: any) => void;
  updateSalaryAdvanceStatus: (id: string, status: SalaryAdvance['status']) => void;

  // Performance & Training Actions
  submitPerformanceReview: (review: Omit<PerformanceReview, 'id' | 'reviewNumber'>) => void;
  submitReviewScore: (reviewId: string, finalScore: number, grade?: string) => void;
  enrollInTraining: (courseId: string, employeeId: string) => void;
  addTrainingCourse: (course: Omit<TrainingCourse, 'id' | 'enrolledParticipantsCount' | 'enrolledEmployeeIds'>) => void;
  addTrainingProgram: (course: any) => void;

  // Lifecycle Actions
  submitTransfer: (transfer: Omit<EmployeeTransfer, 'id' | 'transferNumber' | 'status'>) => void;
  createTransferRequest: (transfer: any) => void;
  updateTransferStatus: (id: string, status: EmployeeTransfer['status']) => void;
  submitPromotion: (promotion: Omit<EmployeePromotion, 'id' | 'promotionNumber' | 'status'>) => void;
  createPromotionRequest: (promotion: any) => void;
  updatePromotionStatus: (id: string, status: EmployeePromotion['status']) => void;
  logDisciplinaryIncident: (incident: Omit<DisciplinaryIncident, 'id' | 'caseNumber' | 'status'>) => void;
  recordDisciplinaryAction: (incident: any) => void;
  initiateSeparation: (separation: any) => void;
  updateSeparationClearance: (separationId: string, department: string, cleared: boolean) => void;
  calculateAndPostEosb: (settlement: Omit<EndOfServiceSettlement, 'id' | 'settlementNumber' | 'status'>) => void;
}

const HrStoreContext = createContext<HrStoreContextType | null>(null);

export const HrProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('artify_erp_hr_employees');
    return saved ? JSON.parse(saved) : initialEmployees;
  });

  const [documents, setDocuments] = useState<EmployeeDocument[]>(() => {
    const saved = localStorage.getItem('artify_erp_hr_documents');
    return saved ? JSON.parse(saved) : initialDocuments;
  });

  const [contracts, setContracts] = useState<EmployeeContract[]>(() => {
    const saved = localStorage.getItem('artify_erp_hr_contracts');
    return saved ? JSON.parse(saved) : initialContracts;
  });

  const [jobRequisitions, setJobRequisitions] = useState<JobRequisition[]>(() => {
    const saved = localStorage.getItem('artify_erp_hr_requisitions');
    return saved ? JSON.parse(saved) : initialJobRequisitions;
  });

  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem('artify_erp_hr_candidates');
    return saved ? JSON.parse(saved) : initialCandidates;
  });

  const [interviews, setInterviews] = useState<Interview[]>(() => {
    const saved = localStorage.getItem('artify_erp_hr_interviews');
    return saved ? JSON.parse(saved) : initialInterviews;
  });

  const [jobOffers, setJobOffers] = useState<JobOffer[]>(() => {
    const saved = localStorage.getItem('artify_erp_hr_offers');
    return saved ? JSON.parse(saved) : initialJobOffers;
  });

  const [onboardingWorkflows, setOnboardingWorkflows] = useState<OnboardingWorkflow[]>(() => {
    const saved = localStorage.getItem('artify_erp_hr_onboarding');
    return saved ? JSON.parse(saved) : initialOnboardingWorkflows;
  });

  const [companyAssets, setCompanyAssets] = useState<CompanyAsset[]>(() => {
    const saved = localStorage.getItem('artify_erp_hr_assets');
    return saved ? JSON.parse(saved) : initialCompanyAssets;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('artify_erp_hr_attendance');
    return saved ? JSON.parse(saved) : initialAttendanceRecords;
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem('artify_erp_hr_leaves');
    return saved ? JSON.parse(saved) : initialLeaveRequests;
  });

  const [publicHolidays, setPublicHolidays] = useState<PublicHoliday[]>(() => {
    const saved = localStorage.getItem('artify_erp_hr_holidays');
    return saved ? JSON.parse(saved) : initialHolidays;
  });

  const [overtimeClaims, setOvertimeClaims] = useState<OvertimeClaim[]>(() => {
    const saved = localStorage.getItem('artify_erp_hr_overtime');
    return saved ? JSON.parse(saved) : initialOvertimeClaims;
  });

  const [benefitPolicies] = useState<BenefitPolicy[]>(initialBenefitPolicies);
  const [loans, setLoans] = useState<EmployeeLoan[]>(initialLoans);
  const [salaryAdvances, setSalaryAdvances] = useState<SalaryAdvance[]>(initialSalaryAdvances);
  const [insurancePlans] = useState<MedicalInsurancePlan[]>(initialInsurancePlans);
  const [performanceReviews, setPerformanceReviews] = useState<PerformanceReview[]>(initialPerformanceReviews);
  const [trainingCourses, setTrainingCourses] = useState<TrainingCourse[]>(initialTrainingCourses);
  const [careerPlans, setCareerPlans] = useState<CareerDevelopmentPlan[]>(initialCareerPlans);
  const [successionSlots] = useState<SuccessionPlanningSlot[]>(initialSuccessionSlots);
  const [transfers, setTransfers] = useState<EmployeeTransfer[]>(initialTransfers);
  const [promotions, setPromotions] = useState<EmployeePromotion[]>(initialPromotions);
  const [disciplinaryIncidents, setDisciplinaryIncidents] = useState<DisciplinaryIncident[]>(initialDisciplinaryIncidents);
  const [separations, setSeparations] = useState<EmployeeSeparation[]>(initialSeparations);
  const [eosbSettlements, setEosbSettlements] = useState<EndOfServiceSettlement[]>(initialEosbSettlements);

  // Persistence to local storage
  useEffect(() => {
    try {
      localStorage.setItem('artify_erp_hr_employees', JSON.stringify(employees));
    } catch {}
  }, [employees]);

  useEffect(() => {
    try {
      localStorage.setItem('artify_erp_hr_documents', JSON.stringify(documents));
    } catch {}
  }, [documents]);

  useEffect(() => {
    try {
      localStorage.setItem('artify_erp_hr_contracts', JSON.stringify(contracts));
    } catch {}
  }, [contracts]);

  useEffect(() => {
    try {
      localStorage.setItem('artify_erp_hr_requisitions', JSON.stringify(jobRequisitions));
    } catch {}
  }, [jobRequisitions]);

  useEffect(() => {
    try {
      localStorage.setItem('artify_erp_hr_candidates', JSON.stringify(candidates));
    } catch {}
  }, [candidates]);

  useEffect(() => {
    try {
      localStorage.setItem('artify_erp_hr_attendance', JSON.stringify(attendanceRecords));
    } catch {}
  }, [attendanceRecords]);

  useEffect(() => {
    try {
      localStorage.setItem('artify_erp_hr_leaves', JSON.stringify(leaveRequests));
    } catch {}
  }, [leaveRequests]);

  // Employee Management Functions
  const addEmployee = (empData: Omit<Employee, 'id' | 'employeeCode' | 'leaveBalanceDays' | 'activeDocumentsCount' | 'assignedAssetsCount'>) => {
    const newId = `EMP-${(100 + employees.length + 1).toString().padStart(5, '0')}`;
    const newCode = `ART-${(100 + employees.length + 1).toString().padStart(4, '0')}`;
    const newEmp: Employee = {
      ...empData,
      id: newId,
      employeeCode: newCode,
      leaveBalanceDays: 30,
      activeDocumentsCount: 0,
      assignedAssetsCount: 0,
      performanceScore: 4.5
    };
    setEmployees(prev => [newEmp, ...prev]);
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
  };

  const addDocument = (doc: Omit<EmployeeDocument, 'id'>) => {
    const newDoc: EmployeeDocument = {
      ...doc,
      id: `DOC-${Date.now()}`
    };
    setDocuments(prev => [newDoc, ...prev]);
    // update employee document count
    setEmployees(prev => prev.map(e => e.id === doc.employeeId ? { ...e, activeDocumentsCount: e.activeDocumentsCount + 1 } : e));
  };

  const addContract = (ctr: Omit<EmployeeContract, 'id'>) => {
    const newCtr: EmployeeContract = {
      ...ctr,
      id: `CTR-${Date.now()}`
    };
    setContracts(prev => [newCtr, ...prev]);
  };

  // Recruitment
  const addJobRequisition = (req: Omit<JobRequisition, 'id' | 'reqNumber' | 'filledCount' | 'applicationsCount' | 'createdAt'>) => {
    const newId = `REQ-${Date.now()}`;
    const newReq: JobRequisition = {
      ...req,
      id: newId,
      reqNumber: `JR-${req.department.substring(0, 3).toUpperCase()}-${Math.floor(100 + mockRandom() * 900)}`,
      filledCount: 0,
      applicationsCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setJobRequisitions(prev => [newReq, ...prev]);
  };

  const updateCandidateStage = (candidateId: string, stage: CandidateStage) => {
    setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, stage } : c));
  };

  const addCandidate = (cand: Omit<Candidate, 'id' | 'interviewsCount' | 'notes'>) => {
    const newCand: Candidate = {
      ...cand,
      id: `CAN-${Math.floor(8000 + mockRandom() * 2000)}`,
      interviewsCount: 0,
      notes: []
    };
    setCandidates(prev => [newCand, ...prev]);
    setJobRequisitions(prev => prev.map(r => r.id === cand.requisitionId ? { ...r, applicationsCount: r.applicationsCount + 1 } : r));
  };

  const scheduleInterview = (interview: Omit<Interview, 'id'>) => {
    const newInt: Interview = {
      ...interview,
      id: `INT-${Date.now()}`
    };
    setInterviews(prev => [newInt, ...prev]);
    setCandidates(prev => prev.map(c => c.id === interview.candidateId ? { ...c, interviewsCount: c.interviewsCount + 1 } : c));
  };

  const submitInterviewScorecard = (interviewId: string, scorecard: Interview['scorecard']) => {
    setInterviews(prev => prev.map(i => i.id === interviewId ? { ...i, status: 'COMPLETED', scorecard } : i));
  };

  const createJobOffer = (offer: Omit<JobOffer, 'id' | 'offerNumber'>) => {
    const newOffer: JobOffer = {
      ...offer,
      id: `OFF-${Date.now()}`,
      offerNumber: `OFF-ART-2026-${Math.floor(100 + mockRandom() * 900)}`
    };
    setJobOffers(prev => [newOffer, ...prev]);
    setCandidates(prev => prev.map(c => c.id === offer.candidateId ? { ...c, stage: 'OFFER_EXTENDED' } : c));
  };

  const updateJobOfferStatus = (offerId: string, status: JobOffer['status']) => {
    setJobOffers(prev => prev.map(o => o.id === offerId ? { ...o, status } : o));
    if (status === 'ACCEPTED' || status === 'ONBOARDING_INITIATED') {
      const targetOffer = jobOffers.find(o => o.id === offerId);
      if (targetOffer) {
        setCandidates(prev => prev.map(c => c.id === targetOffer.candidateId ? { ...c, stage: 'HIRED' } : c));
      }
    }
  };

  // Onboarding
  const toggleOnboardingTask = (workflowId: string, taskId: string) => {
    setOnboardingWorkflows(prev => prev.map(wf => {
      if (wf.id !== workflowId) return wf;
      const updatedTasks = wf.tasks.map(t => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          isCompleted: !t.isCompleted,
          completedAt: !t.isCompleted ? new Date().toISOString().split('T')[0] : undefined
        };
      });
      const completedCount = updatedTasks.filter(t => t.isCompleted).length;
      const pct = Math.round((completedCount / updatedTasks.length) * 100);
      return { ...wf, tasks: updatedTasks, completionPercentage: pct };
    }));
  };

  const updateOnboardingStage = (workflowId: string, stage: OnboardingStage) => {
    setOnboardingWorkflows(prev => prev.map(w => w.id === workflowId ? { ...w, stage } : w));
  };

  const assignAsset = (assetId: string, employeeId: string, employeeName: string) => {
    setCompanyAssets(prev => prev.map(a => a.id === assetId ? {
      ...a,
      status: 'ASSIGNED',
      assignedToEmployeeId: employeeId,
      assignedToEmployeeName: employeeName,
      issueDate: new Date().toISOString().split('T')[0],
      signedCustodyReceipt: true
    } : a));
    setEmployees(prev => prev.map(e => e.id === employeeId ? { ...e, assignedAssetsCount: e.assignedAssetsCount + 1 } : e));
  };

  const returnAsset = (assetId: string) => {
    const asset = companyAssets.find(a => a.id === assetId);
    if (asset?.assignedToEmployeeId) {
      setEmployees(prev => prev.map(e => e.id === asset.assignedToEmployeeId ? { ...e, assignedAssetsCount: Math.max(0, e.assignedAssetsCount - 1) } : e));
    }
    setCompanyAssets(prev => prev.map(a => a.id === assetId ? {
      ...a,
      status: 'IN_STORE',
      assignedToEmployeeId: undefined,
      assignedToEmployeeName: undefined,
      issueDate: undefined,
      signedCustodyReceipt: false
    } : a));
  };

  const addCompanyAsset = (asset: Omit<CompanyAsset, 'id'>) => {
    const newAsset: CompanyAsset = {
      ...asset,
      id: `AST-${Date.now()}`
    };
    setCompanyAssets(prev => [newAsset, ...prev]);
  };

  // Attendance & Leaves
  const logBiometricAttendance = (employeeId: string, type: 'CHECK_IN' | 'CHECK_OUT') => {
    const emp = employees.find(e => e.id === employeeId);
    if (!emp) return;
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setAttendanceRecords(prev => {
      const existing = prev.find(r => r.employeeId === employeeId && r.date === today);
      if (existing) {
        if (type === 'CHECK_OUT') {
          return prev.map(r => r.id === existing.id ? { ...r, checkOut: nowTime, workHours: 8.5 } : r);
        }
        return prev;
      } else {
        const newRecord: AttendanceRecord = {
          id: `ATT-${today}-${Date.now()}`,
          employeeId: emp.id,
          employeeName: emp.fullName,
          department: emp.department,
          date: today,
          checkIn: nowTime,
          checkOut: '--:--',
          workHours: 0,
          overtimeHours: 0,
          status: 'PRESENT',
          shiftName: 'General Corporate Shift',
          location: emp.workLocation,
          biometricTerminalId: 'BIO-APP-WEB'
        };
        return [newRecord, ...prev];
      }
    });
  };

  const submitLeaveRequest = (req: Omit<LeaveRequest, 'id' | 'requestNumber' | 'appliedDate' | 'status'>) => {
    const newReq: LeaveRequest = {
      ...req,
      id: `LEV-${Date.now()}`,
      requestNumber: `LR-2026-${Math.floor(100 + mockRandom() * 900)}`,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'PENDING_APPROVAL'
    };
    setLeaveRequests(prev => [newReq, ...prev]);
  };

  const updateLeaveRequestStatus = (id: string, status: LeaveStatus, remarks?: string) => {
    setLeaveRequests(prev => prev.map(l => {
      if (l.id !== id) return l;
      return {
        ...l,
        status,
        approvalRemarks: remarks || l.approvalRemarks,
        approvedBy: status === 'APPROVED' ? 'Elena Vostrikova (HR Director)' : l.approvedBy
      };
    }));

    if (status === 'APPROVED') {
      const target = leaveRequests.find(l => l.id === id);
      if (target) {
        setEmployees(prev => prev.map(e => e.id === target.employeeId ? { ...e, leaveBalanceDays: Math.max(0, e.leaveBalanceDays - target.totalDays) } : e));
      }
    }
  };

  const addPublicHoliday = (holiday: Omit<PublicHoliday, 'id'>) => {
    const newH: PublicHoliday = {
      ...holiday,
      id: `HOL-${Date.now()}`
    };
    setPublicHolidays(prev => [newH, ...prev]);
  };

  const submitOvertimeClaim = (claim: Omit<OvertimeClaim, 'id' | 'claimNumber' | 'status'>) => {
    const newClaim: OvertimeClaim = {
      ...claim,
      id: `OT-${Date.now()}`,
      claimNumber: `OTC-2026-${Math.floor(100 + mockRandom() * 900)}`,
      status: 'PENDING_SUPERVISOR'
    };
    setOvertimeClaims(prev => [newClaim, ...prev]);
  };

  const updateOvertimeStatus = (id: string, status: OvertimeClaim['status']) => {
    setOvertimeClaims(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  // Benefits & Loans
  const submitEmployeeLoan = (loan: Omit<EmployeeLoan, 'id' | 'loanNumber' | 'repaidAmount' | 'remainingBalance' | 'status'>) => {
    const newLoan: EmployeeLoan = {
      ...loan,
      id: `LN-${Date.now()}`,
      loanNumber: `LOAN-2026-${Math.floor(100 + mockRandom() * 900)}`,
      repaidAmount: 0,
      remainingBalance: loan.principalAmount,
      status: 'SUBMITTED'
    };
    setLoans(prev => [newLoan, ...prev]);
  };

  const applyForLoan = (loan: any) => {
    submitEmployeeLoan({
      employeeId: loan.employeeId,
      employeeName: loan.employeeName,
      department: loan.department,
      loanType: loan.loanType,
      principalAmount: loan.principalAmount,
      interestRatePercent: loan.interestRate || 0,
      interestRate: loan.interestRate || 0,
      tenureMonths: loan.tenureMonths,
      monthlyDeduction: loan.monthlyDeduction,
      disbursementDate: loan.disbursementDate || new Date().toISOString().split('T')[0],
      currency: loan.currency || 'AED',
      reason: loan.reason || '',
      deductionStartMonth: loan.deductionStartMonth
    });
  };

  const updateLoanStatus = (id: string, status: EmployeeLoan['status']) => {
    setLoans(prev => prev.map(l => l.id === id ? { ...l, status, approvedBy: 'Jean-Luc Moreau (Financial Controller)' } : l));
  };

  const submitSalaryAdvance = (advance: Omit<SalaryAdvance, 'id' | 'advanceNumber' | 'requestDate' | 'status'>) => {
    const newAdv: SalaryAdvance = {
      ...advance,
      id: `ADV-${Date.now()}`,
      advanceNumber: `ADV-2026-${Math.floor(100 + mockRandom() * 900)}`,
      requestNumber: `ADV-2026-${Math.floor(100 + mockRandom() * 900)}`,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'PENDING_APPROVAL'
    };
    setSalaryAdvances(prev => [newAdv, ...prev]);
  };

  const requestSalaryAdvance = (adv: any) => {
    submitSalaryAdvance({
      employeeId: adv.employeeId,
      employeeName: adv.employeeName,
      department: adv.department,
      requestedAmount: adv.amount || adv.requestedAmount || 5000,
      amount: adv.amount || adv.requestedAmount || 5000,
      accruedEarnedSalary: adv.accruedEarnedSalary || 15000,
      deductionPayrollMonth: adv.recoveryMonth || adv.deductionPayrollMonth || '2026-04',
      recoveryMonth: adv.recoveryMonth || adv.deductionPayrollMonth || '2026-04',
      currency: adv.currency || 'AED',
      reason: adv.reason || ''
    });
  };

  const updateSalaryAdvanceStatus = (id: string, status: SalaryAdvance['status']) => {
    setSalaryAdvances(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  // Performance & Training
  const submitPerformanceReview = (review: Omit<PerformanceReview, 'id' | 'reviewNumber'>) => {
    const newRev: PerformanceReview = {
      ...review,
      id: `REV-${Date.now()}`,
      reviewNumber: `APR-2026-${Math.floor(100 + mockRandom() * 900)}`
    };
    setPerformanceReviews(prev => [newRev, ...prev]);
  };

  const submitReviewScore = (reviewId: string, finalScore: number, grade?: string) => {
    setPerformanceReviews(prev => prev.map(r => r.id === reviewId ? {
      ...r,
      finalCalibratedScore: finalScore,
      finalRating: finalScore,
      calibratedGrade: grade || (finalScore >= 4.5 ? 'A+' : finalScore >= 3.8 ? 'A' : 'B'),
      status: 'CALIBRATED_FINAL'
    } : r));
  };

  const enrollInTraining = (courseId: string, employeeId: string) => {
    setTrainingCourses(prev => prev.map(c => {
      if (c.id !== courseId && c.courseCode !== courseId && c.code !== courseId) return c;
      if (c.enrolledEmployeeIds.includes(employeeId)) return c;
      return {
        ...c,
        enrolledEmployeeIds: [...c.enrolledEmployeeIds, employeeId],
        enrolledParticipantsCount: c.enrolledParticipantsCount + 1
      };
    }));
  };

  const addTrainingCourse = (course: Omit<TrainingCourse, 'id' | 'enrolledParticipantsCount' | 'enrolledEmployeeIds'>) => {
    const newC: TrainingCourse = {
      ...course,
      id: `TRN-${Date.now()}`,
      enrolledParticipantsCount: 0,
      enrolledEmployeeIds: []
    };
    setTrainingCourses(prev => [newC, ...prev]);
  };

  const addTrainingProgram = (course: any) => {
    addTrainingCourse({
      courseCode: course.code || course.courseCode || `TRN-${Date.now()}`,
      title: course.title,
      category: course.category || 'TECHNICAL_ENGINEERING',
      trainerProvider: course.instructorOrProvider || course.trainerProvider || 'Artify Academy',
      durationHours: course.durationHours || 16,
      costPerParticipant: course.costPerParticipant || 0,
      currency: course.currency || 'AED',
      startDate: course.startDate || new Date().toISOString().split('T')[0],
      endDate: course.endDate || new Date().toISOString().split('T')[0],
      maxParticipants: course.maxParticipants || 20,
      status: course.status === 'ENROLLING' ? 'UPCOMING' : (course.status || 'UPCOMING'),
      location: course.location
    });
  };

  // Lifecycle
  const submitTransfer = (transfer: Omit<EmployeeTransfer, 'id' | 'transferNumber' | 'status'>) => {
    const newTrf: EmployeeTransfer = {
      ...transfer,
      id: `TRF-${Date.now()}`,
      transferNumber: `TRF-ART-2026-${Math.floor(100 + mockRandom() * 900)}`,
      status: 'REQUESTED'
    };
    setTransfers(prev => [newTrf, ...prev]);
  };

  const createTransferRequest = (transfer: any) => {
    submitTransfer({
      employeeId: transfer.employeeId,
      employeeName: transfer.employeeName,
      effectiveDate: transfer.effectiveDate,
      fromDepartment: transfer.fromDepartment,
      toDepartment: transfer.toDepartment,
      fromBranch: transfer.fromBranch || 'Dubai HQ',
      toBranch: transfer.toBranch || 'Regional Plant',
      fromManager: transfer.fromManager || 'Department Manager',
      toManager: transfer.toManager || 'Receiving Manager',
      fromCostCenter: transfer.fromCostCenter || 'CC-BASE',
      toCostCenter: transfer.toCostCenter || 'CC-TARGET',
      relocationAllowance: transfer.relocationAllowance || 0,
      reason: transfer.reason || ''
    });
  };

  const updateTransferStatus = (id: string, status: EmployeeTransfer['status']) => {
    setTransfers(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const submitPromotion = (promotion: Omit<EmployeePromotion, 'id' | 'promotionNumber' | 'status'>) => {
    const newPrm: EmployeePromotion = {
      ...promotion,
      id: `PRM-${Date.now()}`,
      promotionNumber: `PRM-ART-2026-${Math.floor(100 + mockRandom() * 900)}`,
      status: 'PROPOSED'
    };
    setPromotions(prev => [newPrm, ...prev]);
  };

  const createPromotionRequest = (promotion: any) => {
    submitPromotion({
      employeeId: promotion.employeeId,
      employeeName: promotion.employeeName,
      effectiveDate: promotion.effectiveDate,
      currentTitle: promotion.fromDesignation || promotion.currentTitle || 'Staff',
      fromDesignation: promotion.fromDesignation,
      newTitle: promotion.toDesignation || promotion.newTitle || 'Senior Staff',
      toDesignation: promotion.toDesignation,
      currentGrade: promotion.fromGrade || promotion.currentGrade || 'G3',
      fromGrade: promotion.fromGrade,
      newGrade: promotion.toGrade || promotion.newGrade || 'G4',
      toGrade: promotion.toGrade,
      currentSalary: promotion.fromSalary || promotion.currentSalary || 20000,
      fromSalary: promotion.fromSalary,
      newSalary: promotion.toSalary || promotion.newSalary || 25000,
      toSalary: promotion.toSalary,
      currency: promotion.currency || 'AED',
      percentageHike: promotion.incrementPercentage || promotion.percentageHike || 15,
      incrementPercentage: promotion.incrementPercentage,
      justification: promotion.justification || ''
    });
  };

  const updatePromotionStatus = (id: string, status: EmployeePromotion['status']) => {
    setPromotions(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  const logDisciplinaryIncident = (incident: Omit<DisciplinaryIncident, 'id' | 'caseNumber' | 'status'>) => {
    const newDisc: DisciplinaryIncident = {
      ...incident,
      id: `DISC-${Date.now()}`,
      caseNumber: `DISC-CASE-2026-${Math.floor(100 + mockRandom() * 900)}`,
      status: 'UNDER_INVESTIGATION'
    };
    setDisciplinaryIncidents(prev => [newDisc, ...prev]);
  };

  const recordDisciplinaryAction = (incident: any) => {
    logDisciplinaryIncident({
      employeeId: incident.employeeId,
      employeeName: incident.employeeName,
      department: incident.department || 'Operations',
      incidentDate: incident.incidentDate || new Date().toISOString().split('T')[0],
      reportedBy: incident.conductedBy || incident.reportedBy || 'HR Compliance',
      incidentCategory: (incident.infractionCategory || incident.incidentCategory || 'POLICY_VIOLATION') as any,
      severity: (incident.severity === 'MEDIUM' ? 'MODERATE' : (incident.severity || 'MINOR')) as any,
      actionTaken: (incident.warningLevel === 'FIRST_WRITTEN_WARNING' ? 'WRITTEN_WARNING_1' : (incident.actionTaken || 'VERBAL_WARNING')) as any,
      description: incident.description || '',
      committeeFindings: incident.actionTaken || incident.committeeFindings || 'Action recorded.',
      pipAssigned: !!incident.pipAssigned
    });
  };

  const initiateSeparation = (sep: any) => {
    const newSep: EmployeeSeparation = {
      id: `SEP-${Date.now()}`,
      separationNumber: `SEP-ART-2026-${Math.floor(100 + mockRandom() * 900)}`,
      employeeId: sep.employeeId,
      employeeName: sep.employeeName,
      department: sep.department,
      designation: sep.designation,
      joinDate: sep.joinDate || '2022-01-01',
      separationType: sep.separationType || 'RESIGNATION',
      noticeDate: sep.resignationDate || sep.noticeDate || new Date().toISOString().split('T')[0],
      lastWorkingDay: sep.lastWorkingDay || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      noticePeriodServedDays: sep.noticePeriodServedDays || 30,
      yearsOfService: sep.yearsOfService || 3.0,
      endOfServiceGratuity: sep.endOfServiceGratuity || 0,
      unutilizedLeavePayout: sep.unutilizedLeavePayout || 0,
      netSettlementAmount: sep.netSettlementAmount || 0,
      currency: sep.currency || 'AED',
      reason: sep.reason || '',
      exitInterviewCompleted: !!sep.exitInterviewCompleted,
      clearanceStatus: sep.clearanceStatus || {
        itAssetsCleared: false,
        facilitiesAccessBadgeReturned: false,
        financeDuesSettled: false,
        operationsHandoverCompleted: false
      },
      clearanceChecklist: sep.clearanceChecklist || {
        it: false,
        finance: false,
        facilities: false,
        hrAdmin: false,
        lineManager: false
      },
      status: 'NOTICE_PERIOD'
    };
    setSeparations(prev => [newSep, ...prev]);
    setEmployees(prev => prev.map(e => e.id === sep.employeeId ? { ...e, status: 'RESIGNED' } : e));
  };

  const updateSeparationClearance = (separationId: string, department: string, cleared: boolean) => {
    setSeparations(prev => prev.map(s => {
      if (s.id !== separationId) return s;
      const currentChecklist = s.clearanceChecklist || {
        it: false,
        finance: false,
        facilities: false,
        hrAdmin: false,
        lineManager: false
      };
      const updatedChecklist = {
        ...currentChecklist,
        [department]: cleared
      };
      return {
        ...s,
        clearanceChecklist: updatedChecklist
      };
    }));
  };

  const calculateAndPostEosb = (eosb: Omit<EndOfServiceSettlement, 'id' | 'settlementNumber' | 'status'>) => {
    const newEosb: EndOfServiceSettlement = {
      ...eosb,
      id: `EOSB-${Date.now()}`,
      settlementNumber: `EOSB-ART-2026-${Math.floor(100 + mockRandom() * 900)}`,
      status: 'AUDIT_APPROVED',
      approvedBy: 'Jean-Luc Moreau (Financial Controller)'
    };
    setEosbSettlements(prev => [newEosb, ...prev]);
    setSeparations(prev => prev.map(s => s.id === eosb.separationId ? { ...s, status: 'EOSB_CALCULATED' } : s));
  };

  return (
    <HrStoreContext.Provider
      value={{
        employees,
        documents,
        contracts,
        jobRequisitions,
        candidates,
        interviews,
        jobOffers,
        onboardingWorkflows,
        companyAssets,
        attendanceRecords,
        leaveRequests,
        publicHolidays,
        overtimeClaims,
        benefitPolicies,
        benefitPackages: benefitPolicies.map((b) => ({
          ...b,
          name: b.name ?? b.benefitName,
          code: b.code ?? b.id,
          annualAllowanceValue: b.annualAllowanceValue ?? b.annualValue,
          currency: b.currency ?? 'OMR',
          inclusions: b.inclusions ?? [b.description]
        })),
        loans,
        employeeLoans: loans.map((l) => ({
          ...l,
          currency: l.currency ?? 'OMR',
          interestRate: l.interestRate ?? l.interestRatePercent ?? 0,
          reason: l.reason ?? l.loanType.replace(/_/g, ' ').toLowerCase()
        })),
        salaryAdvances: salaryAdvances.map((a) => ({
          ...a,
          requestNumber: a.requestNumber ?? a.advanceNumber ?? a.id,
          amount: a.amount ?? a.requestedAmount ?? 0,
          recoveryMonth: a.recoveryMonth ?? a.deductionPayrollMonth ?? '',
          currency: a.currency ?? 'OMR',
          department: a.department ?? employees.find((e) => e.id === a.employeeId)?.department ?? ''
        })),
        insurancePlans,
        insurancePolicies: insurancePlans.map((p) => ({
          ...p,
          provider: p.provider ?? p.providerName,
          planCategory: p.planCategory ?? p.tierName,
          annualLimitPerMember: p.annualLimitPerMember ?? p.annualCoverageLimit,
          currency: p.currency ?? 'OMR',
          totalMembersCovered: p.totalMembersCovered ?? p.enrolledEmployeesCount + p.enrolledDependentsCount,
          networkTier: p.networkTier ?? p.coverageScope,
          expiryDate: p.expiryDate ?? p.renewalDate,
          status: p.status ?? 'Active'
        })),
        performanceReviews,
        trainingCourses,
        trainingPrograms: trainingCourses,
        careerPlans,
        successionSlots,
        transfers,
        promotions,
        disciplinaryIncidents,
        disciplinaryRecords: disciplinaryIncidents,
        separations,
        eosbSettlements,

        addEmployee,
        updateEmployee,
        deleteEmployee,
        addDocument,
        addContract,

        addJobRequisition,
        updateCandidateStage,
        addCandidate,
        scheduleInterview,
        submitInterviewScorecard,
        createJobOffer,
        updateJobOfferStatus,

        toggleOnboardingTask,
        updateOnboardingStage,
        assignAsset,
        returnAsset,
        addCompanyAsset,

        logBiometricAttendance,
        submitLeaveRequest,
        updateLeaveRequestStatus,
        addPublicHoliday,
        submitOvertimeClaim,
        updateOvertimeStatus,

        submitEmployeeLoan,
        applyForLoan,
        updateLoanStatus,
        submitSalaryAdvance,
        requestSalaryAdvance,
        updateSalaryAdvanceStatus,

        submitPerformanceReview,
        submitReviewScore,
        enrollInTraining,
        addTrainingCourse,
        addTrainingProgram,

        submitTransfer,
        createTransferRequest,
        updateTransferStatus,
        submitPromotion,
        createPromotionRequest,
        updatePromotionStatus,
        logDisciplinaryIncident,
        recordDisciplinaryAction,
        initiateSeparation,
        updateSeparationClearance,
        calculateAndPostEosb
      }}
    >
      {children}
    </HrStoreContext.Provider>
  );
};

export const useHrStore = (): HrStoreContextType => {
  const context = useContext(HrStoreContext);
  if (!context) {
    throw new Error('useHrStore must be used within an HrProvider');
  }
  return context;
};
