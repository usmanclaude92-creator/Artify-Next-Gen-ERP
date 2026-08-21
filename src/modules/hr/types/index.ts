// ==========================================
// ARTIFY ERP — MODULE 09: HUMAN RESOURCES (HR)
// Domain Types and Interfaces
// ==========================================

export type EmployeeStatus = 'ACTIVE' | 'PROBATION' | 'ON_LEAVE' | 'RESIGNED' | 'TERMINATED' | 'SUSPENDED';
export type EmploymentType = 'FULL_TIME' | 'CONTRACT' | 'EXPATRIATE' | 'PART_TIME' | 'INTERN';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type MaritalStatus = 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED';

// ==========================================
// 09.01 — EMPLOYEE MANAGEMENT
// ==========================================

export interface EmployeeDocument {
  id: string;
  employeeId: string;
  documentType: 'PASSPORT' | 'NATIONAL_ID' | 'VISA_WORK_PERMIT' | 'LABOR_CARD' | 'DRIVING_LICENSE' | 'EDUCATION_DEGREE' | 'MEDICAL_FITNESS' | 'NDA_CONTRACT';
  documentNumber: string;
  title: string;
  issuingAuthority: string;
  issueDate: string;
  expiryDate: string;
  status: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED' | 'PENDING_VERIFICATION';
  fileUrl?: string;
  fileName: string;
  fileSize: string;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
}

export interface EmployeeContract {
  id: string;
  employeeId: string;
  employeeName: string;
  contractNumber: string;
  contractType: 'UNLIMITED' | 'FIXED_TERM' | 'EXECUTIVE' | 'CONSULTANCY' | 'PROBATIONARY';
  startDate: string;
  endDate?: string;
  probationMonths: number;
  probationEndDate: string;
  noticePeriodDays: number;
  basicSalary: number;
  housingAllowance: number;
  transportAllowance: number;
  otherAllowances: number;
  currency: string;
  status: 'ACTIVE' | 'UNDER_RENEWAL' | 'EXPIRED' | 'TERMINATED';
  signedDate: string;
  renewalDueNoticeSent: boolean;
}

export interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatarUrl?: string;
  email: string;
  phone: string;
  gender: Gender;
  dateOfBirth: string;
  nationality: string;
  maritalStatus: MaritalStatus;
  
  // Employment Details
  department: string;
  departmentId: string;
  designation: string;
  jobGrade: string; // e.g. 'G1', 'G2', 'G3', 'G4', 'G5', 'EXEC'
  employmentType: EmploymentType;
  status: EmployeeStatus;
  joinDate: string;
  confirmationDate?: string;
  
  // Hierarchy
  reportingManagerId?: string;
  reportingManagerName?: string;
  reportingManagerTitle?: string;
  branch: string;
  workLocation: string; // e.g., 'HQ Tower Dubai', 'Sohar Industrial Plant', 'Riyadh Tech Center'
  costCenter: string;
  
  // Compensation & Bank
  basicSalary: number;
  totalCompensation: number;
  currency: string;
  bankName: string;
  bankAccountNumber: string;
  iban: string;
  
  // Emergency Contact
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;

  // Counts & Stats
  leaveBalanceDays: number;
  activeDocumentsCount: number;
  assignedAssetsCount: number;
  performanceScore?: number;
}

// Org Hierarchy Node
export interface OrgHierarchyNode {
  id: string;
  name: string;
  title: string;
  department: string;
  avatarUrl?: string;
  email: string;
  directReportsCount: number;
  children?: OrgHierarchyNode[];
}

// ==========================================
// 09.02 — RECRUITMENT
// ==========================================

export type RequisitionStatus = 'DRAFT' | 'SUBMITTED' | 'HR_APPROVED' | 'FINANCE_APPROVED' | 'PUBLISHED' | 'FILLED' | 'CANCELLED';
export type CandidateStage = 'APPLIED' | 'SCREENING' | 'SHORTLISTED' | 'INTERVIEW_ROUND_1' | 'TECHNICAL_ASSESSMENT' | 'FINAL_PANEL' | 'OFFER_EXTENDED' | 'HIRED' | 'REJECTED';

export interface JobRequisition {
  id: string;
  reqNumber: string;
  jobTitle: string;
  department: string;
  headcount: number;
  filledCount: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  employmentType: EmploymentType;
  experienceLevel: 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD' | 'DIRECTOR';
  minSalary: number;
  maxSalary: number;
  currency: string;
  targetHireDate: string;
  hiringManager: string;
  jobDescription: string;
  requiredSkills: string[];
  status: RequisitionStatus;
  createdAt: string;
  approvedBy?: string;
  applicationsCount: number;
}

export interface Candidate {
  id: string;
  requisitionId: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  currentTitle: string;
  currentCompany: string;
  yearsOfExperience: number;
  expectedSalary: number;
  noticePeriodDays: number;
  stage: CandidateStage;
  aiMatchScore: number; // 0 to 100
  aiStrengths: string[];
  aiGaps: string[];
  rating: number; // 1 to 5
  resumeUrl?: string;
  appliedDate: string;
  interviewsCount: number;
  notes: string[];
}

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  jobTitle: string;
  interviewType: 'SCREENING' | 'TECHNICAL' | 'MANAGERIAL' | 'HR_CULTURE' | 'FINAL_EXECUTIVE';
  scheduledDate: string;
  scheduledTime: string;
  durationMinutes: number;
  interviewers: string[];
  format: 'VIDEO_CALL' | 'IN_PERSON_OFFICE' | 'PANEL' | 'ONLINE_ASSESSMENT';
  locationOrLink: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
  scorecard?: {
    technicalScore: number;
    problemSolvingScore: number;
    communicationScore: number;
    cultureFitScore: number;
    leadershipScore: number;
    overallRecommendation: 'STRONG_HIRE' | 'HIRE' | 'ON_HOLD' | 'REJECT';
    feedback: string;
    submittedBy: string;
    submittedAt: string;
  };
}

export interface JobOffer {
  id: string;
  offerNumber: string;
  candidateId: string;
  candidateName: string;
  requisitionId: string;
  jobTitle: string;
  department: string;
  grade: string;
  basicSalary: number;
  housingAllowance: number;
  transportAllowance: number;
  annualBonusTargetPercent: number;
  currency: string;
  offeredDate: string;
  joiningDate: string;
  expiryDate: string;
  status: 'DRAFT' | 'SENT_TO_CANDIDATE' | 'ACCEPTED' | 'DECLINED' | 'ONBOARDING_INITIATED';
  approvedBy: string;
}

// ==========================================
// 09.03 — EMPLOYEE ONBOARDING
// ==========================================

export type OnboardingStage = 'PRE_ARRIVAL' | 'DAY_ONE' | 'WEEK_ONE' | 'MONTH_ONE' | 'PROBATION_REVIEW' | 'COMPLETED';

export interface OnboardingTask {
  id: string;
  title: string;
  category: 'IT_PROVISIONING' | 'HR_ADMIN' | 'FACILITIES' | 'TRAINING' | 'MANAGER_CHECKIN';
  assignedToRole: string;
  isCompleted: boolean;
  completedAt?: string;
  completedBy?: string;
  dueDate: string;
}

export interface OnboardingWorkflow {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  joinDate: string;
  stage: OnboardingStage;
  mentorName: string;
  mentorTitle: string;
  tasks: OnboardingTask[];
  completionPercentage: number;
  buddyFeedback?: string;
  probationOutcome?: 'CONFIRMED' | 'EXTENDED' | 'TERMINATED';
}

export interface OnboardingDocumentRequirement {
  id: string;
  workflowId: string;
  documentName: string;
  isRequired: boolean;
  status: 'SUBMITTED' | 'VERIFIED' | 'PENDING' | 'REJECTED';
  uploadedFile?: string;
  verifiedAt?: string;
}

export interface CompanyAsset {
  id: string;
  assetTag: string;
  assetName: string;
  category: 'LAPTOP' | 'MONITOR' | 'MOBILE_PHONE' | 'SIM_CARD' | 'ACCESS_CARD' | 'VEHICLE' | 'SAFETY_EQUIPMENT' | 'TOOLS';
  serialNumber: string;
  assignedToEmployeeId?: string;
  assignedToEmployeeName?: string;
  issueDate?: string;
  expectedReturnDate?: string;
  condition: 'NEW' | 'EXCELLENT' | 'GOOD' | 'FAIR';
  status: 'IN_STORE' | 'ASSIGNED' | 'UNDER_MAINTENANCE' | 'WRITTEN_OFF';
  signedCustodyReceipt: boolean;
}

// ==========================================
// 09.04 — ATTENDANCE & LEAVE
// ==========================================

export type AttendanceStatus = 'PRESENT' | 'LATE' | 'EARLY_DEPARTURE' | 'HALF_DAY' | 'ABSENT' | 'ON_LEAVE' | 'PUBLIC_HOLIDAY' | 'BUSINESS_TRIP';
export type LeaveType = 'ANNUAL' | 'SICK' | 'EMERGENCY' | 'MATERNITY' | 'PATERNITY' | 'HAJJ_PILGRIMAGE' | 'STUDY' | 'UNPAID';
export type LeaveStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  checkIn: string;
  checkOut: string;
  workHours: number;
  overtimeHours: number;
  status: AttendanceStatus;
  shiftName: string; // e.g. 'General Shift (08:00 - 17:00)', 'Night Plant Shift'
  location: string;
  biometricTerminalId: string;
  anomalyFlag?: boolean;
}

export interface LeaveRequest {
  id: string;
  requestNumber: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  relieverEmployeeId?: string;
  relieverEmployeeName?: string;
  status: LeaveStatus;
  appliedDate: string;
  approvedBy?: string;
  approvalRemarks?: string;
  attachmentUrl?: string;
}

export interface PublicHoliday {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  holidayType: 'STATUTORY_NATIONAL' | 'RELIGIOUS' | 'CORPORATE';
  applicableBranches: string[]; // e.g. ['ALL', 'UAE', 'OMAN', 'KSA']
  isRecurring: boolean;
}

export interface OvertimeClaim {
  id: string;
  claimNumber: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  overtimeType: 'NORMAL_DAY' | 'WEEKEND_REST' | 'PUBLIC_HOLIDAY';
  hours: number;
  multiplier: number; // 1.25, 1.5, 2.0, 2.5
  hourlyRate: number;
  totalPayable: number;
  currency: string;
  reason: string;
  status: 'PENDING_SUPERVISOR' | 'SUPERVISOR_APPROVED' | 'HR_POSTED' | 'REJECTED';
}

// ==========================================
// 09.05 — EMPLOYEE BENEFITS
// ==========================================

export type BenefitType = 'HOUSING_ALLOWANCE' | 'TRANSPORT_SUBSIDY' | 'FLIGHT_TICKETS' | 'EDUCATION_SUBSIDY' | 'MOBILE_ALLOWANCE' | 'EXECUTIVE_HEALTH_CLUB' | 'MEAL_VOUCHERS';

export interface BenefitPolicy {
  id: string;
  benefitName: string;
  name?: string;
  code?: string;
  type: BenefitType;
  eligibleGrades: string[];
  annualValue: number;
  annualAllowanceValue?: number;
  currency?: string;
  frequency: 'MONTHLY' | 'ANNUAL' | 'ONE_TIME';
  taxable: boolean;
  description: string;
  inclusions?: string[];
  enrolledCount: number;
}

export type BenefitPackage = BenefitPolicy;

export interface EmployeeLoan {
  id: string;
  loanNumber: string;
  employeeId: string;
  employeeName: string;
  department: string;
  loanType: 'PERSONAL_ASSISTANCE' | 'HOUSING_ADVANCE' | 'HOUSING_ASSISTANCE' | 'MARRIAGE_ASSISTANCE' | 'EMERGENCY_MEDICAL' | string;
  principalAmount: number;
  interestRatePercent?: number; // usually 0% in internal loans
  interestRate?: number;
  tenureMonths: number;
  monthlyDeduction: number;
  disbursementDate: string;
  repaidAmount: number;
  remainingBalance: number;
  currency?: string;
  reason?: string;
  deductionStartMonth?: string;
  status: 'SUBMITTED' | 'APPROVED' | 'DISBURSED' | 'FULLY_REPAID' | 'REJECTED' | 'REQUESTED' | 'ACTIVE_DISBURSED';
  approvedBy?: string;
}

export interface SalaryAdvance {
  id: string;
  advanceNumber?: string;
  requestNumber?: string;
  employeeId: string;
  employeeName: string;
  department?: string;
  requestDate: string;
  requestedAmount?: number;
  amount?: number;
  accruedEarnedSalary?: number;
  deductionPayrollMonth?: string; // e.g. 'September 2026'
  recoveryMonth?: string;
  currency?: string;
  reason: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'DISBURSED' | 'REJECTED' | 'DEDUCTED' | 'REQUESTED';
}

export interface MedicalInsurancePlan {
  id: string;
  policyNumber: string;
  providerName: string; // e.g., 'Oman Insurance / Sukoon', 'Bupa Global', 'Tawuniya'
  provider?: string;
  tierName: string; // 'VIP Platinum', 'Gold Tier', 'Silver Tier'
  planCategory?: string;
  eligibleGrades: string[];
  annualCoverageLimit: number;
  annualLimitPerMember?: number;
  currency?: string;
  coPayPercentage: number;
  coverageScope: string;
  enrolledEmployeesCount: number;
  enrolledDependentsCount: number;
  totalMembersCovered?: number;
  networkTier?: string;
  renewalDate: string;
  expiryDate?: string;
  status?: string;
}

export type InsurancePolicy = MedicalInsurancePlan;

// ==========================================
// 09.06 — PERFORMANCE & DEVELOPMENT
// ==========================================

export type AppraisalCycleStatus = 'PLANNING' | 'GOAL_SETTING' | 'SELF_EVALUATION' | 'MANAGER_REVIEW' | 'CALIBRATION' | 'CLOSED';
export type NineBoxPotential = 'HIGH' | 'MEDIUM' | 'LOW';
export type NineBoxPerformance = 'HIGH' | 'MEDIUM' | 'LOW';
export type ReviewStatus = 'DRAFT' | 'SELF_SUBMITTED' | 'MANAGER_SUBMITTED' | 'CALIBRATED' | 'CALIBRATED_FINAL' | 'SIGN_OFF_COMPLETED';

export interface PerformanceGoal {
  id: string;
  title?: string;
  objective: string;
  keyResults: string;
  weightagePercent: number;
  targetValue: string;
  achievedValue: string;
  progressPercentage?: number;
  ratingScore: number; // 1 to 5
}

export interface PerformanceReview {
  id: string;
  reviewNumber: string;
  cycleId: string;
  cycleName: string;
  employeeId: string;
  employeeName: string;
  department: string;
  jobTitle: string;
  designation?: string;
  reviewerId: string;
  reviewerName: string;
  selfRating?: number;
  selfRatingScore: number;
  managerRating?: number;
  managerRatingScore: number;
  finalRating?: number;
  finalCalibratedScore: number;
  calibratedGrade?: string;
  ratingLabel: 'EXCEEDS_EXPECTATIONS' | 'MEETS_HIGH_EXPECTATIONS' | 'MEETS_EXPECTATIONS' | 'NEEDS_IMPROVEMENT' | 'UNSATISFACTORY';
  nineBoxPerformance: NineBoxPerformance;
  nineBoxPotential: NineBoxPotential;
  goals: PerformanceGoal[];
  strengths: string;
  developmentAreas: string;
  status: ReviewStatus;
  completedDate?: string;
}

export interface TrainingCourse {
  id: string;
  code?: string;
  courseCode: string;
  title: string;
  category: 'TECHNICAL_ENGINEERING' | 'LEADERSHIP_MANAGEMENT' | 'QUALITY_ISO_EHS' | 'COMPLIANCE_LEGAL' | 'DIGITAL_IT' | 'TECHNICAL' | 'MANAGEMENT' | 'SAFETY' | 'COMPLIANCE';
  trainerProvider?: string;
  instructorOrProvider?: string;
  durationHours: number;
  costPerParticipant: number;
  currency: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  enrolledParticipantsCount: number;
  location?: string;
  status: 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'ENROLLING';
  enrolledEmployeeIds: string[];
}

export type TrainingProgram = TrainingCourse;

export interface CareerDevelopmentPlan {
  id: string;
  employeeId: string;
  employeeName: string;
  currentRole: string;
  targetRole: string;
  readinessLevel: 'READY_NOW' | 'READY_1_2_YEARS' | 'READY_3_5_YEARS';
  potentialScore: number;
  developmentGoals: string[];
  mentors?: string[];
}

export interface SuccessionPlanningSlot {
  id: string;
  criticalPosition: string;
  currentIncumbent: string;
  department: string;
  successors: {
    employeeId: string;
    employeeName: string;
    currentRole: string;
    readiness: 'READY_NOW' | 'READY_1_2_YEARS' | 'READY_3_5_YEARS';
    potentialScore: number;
  }[];
}

// ==========================================
// 09.07 — EMPLOYEE LIFECYCLE
// ==========================================

export interface EmployeeTransfer {
  id: string;
  transferNumber: string;
  employeeId: string;
  employeeName: string;
  effectiveDate: string;
  fromDepartment: string;
  toDepartment: string;
  fromBranch: string;
  toBranch: string;
  fromManager: string;
  toManager: string;
  fromCostCenter: string;
  toCostCenter: string;
  relocationAllowance: number;
  reason: string;
  status: 'REQUESTED' | 'DEPARTMENT_APPROVED' | 'HR_EXECUTED' | 'REJECTED' | 'APPROVED' | 'PENDING_APPROVAL' | 'EFFECTIVE';
}

export interface EmployeePromotion {
  id: string;
  promotionNumber: string;
  employeeId: string;
  employeeName: string;
  effectiveDate: string;
  currentTitle: string;
  fromDesignation?: string;
  newTitle: string;
  toDesignation?: string;
  currentGrade: string;
  fromGrade?: string;
  newGrade: string;
  toGrade?: string;
  currentSalary: number;
  fromSalary?: number;
  newSalary: number;
  toSalary?: number;
  currency?: string;
  percentageHike: number;
  incrementPercentage?: number;
  justification: string;
  status: 'PROPOSED' | 'HR_REVIEWED' | 'BOARD_APPROVED' | 'POSTED_TO_PAYROLL' | 'APPROVED' | 'EFFECTIVE' | 'PENDING_APPROVAL';
}

export interface DisciplinaryIncident {
  id: string;
  caseNumber: string;
  employeeId: string;
  employeeName: string;
  department: string;
  incidentDate: string;
  reportedBy: string;
  conductedBy?: string;
  incidentCategory: 'ABSENTEEISM_LATENESS' | 'MISCONDUCT' | 'SAFETY_VIOLATION' | 'INSUBORDINATION' | 'DATA_BREACH' | 'POLICY_VIOLATION';
  infractionCategory?: string;
  severity: 'MINOR' | 'MODERATE' | 'SERIOUS' | 'CRITICAL' | string;
  actionTaken: 'VERBAL_WARNING' | 'WRITTEN_WARNING_1' | 'FINAL_WRITTEN_WARNING' | 'SUSPENSION' | 'TERMINATION' | 'CASE_DISMISSED' | string;
  warningLevel?: string;
  description: string;
  committeeFindings: string;
  pipAssigned: boolean;
  status: 'UNDER_INVESTIGATION' | 'COMMITTEE_REVIEW' | 'CLOSED_RESOLVED';
}

export type DisciplinaryRecord = DisciplinaryIncident;

export interface EmployeeSeparation {
  id: string;
  separationNumber: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  joinDate: string;
  separationType: 'RESIGNATION' | 'END_OF_CONTRACT' | 'MUTUAL_AGREEMENT' | 'RETIREMENT' | 'TERMINATION';
  noticeDate: string;
  lastWorkingDay: string;
  noticePeriodServedDays: number;
  yearsOfService?: number;
  endOfServiceGratuity?: number;
  unutilizedLeavePayout?: number;
  netSettlementAmount?: number;
  currency?: string;
  reason: string;
  exitInterviewCompleted: boolean;
  clearanceStatus: {
    itAssetsCleared: boolean;
    facilitiesAccessBadgeReturned: boolean;
    financeDuesSettled: boolean;
    operationsHandoverCompleted: boolean;
  };
  clearanceChecklist?: {
    it: boolean;
    finance: boolean;
    facilities: boolean;
    hrAdmin: boolean;
    lineManager: boolean;
  };
  status: 'NOTICE_PERIOD' | 'CLEARANCE_IN_PROGRESS' | 'EOSB_CALCULATED' | 'OFFBOARDED';
}

export interface EndOfServiceSettlement {
  id: string;
  settlementNumber: string;
  separationId: string;
  employeeId: string;
  employeeName: string;
  joinDate: string;
  lastWorkingDay: string;
  totalServiceYears: number;
  totalServiceMonths: number;
  lastBasicSalary: number;
  
  // Gratuity Calculations (Based on Labor Law)
  gratuityAmount: number;
  gratuityFormulaUsed: string; // e.g. '21 days basic/year for first 5 yrs, 30 days basic/year thereafter'
  
  // Leave Encashment
  unusedLeaveDays: number;
  leaveEncashmentAmount: number;
  
  // Prorated Final Month Salary
  proratedDays: number;
  proratedSalaryAmount: number;
  
  // Deductions
  outstandingLoanDeduction: number;
  noticeShortfallDeduction: number;
  otherDeductions: number;
  
  // Net Payable
  netSettlementPayable: number;
  currency: string;
  status: 'DRAFT_CALCULATION' | 'AUDIT_APPROVED' | 'FINANCE_DISBURSED' | 'CANCELLED';
  disbursementDate?: string;
  approvedBy?: string;
}
