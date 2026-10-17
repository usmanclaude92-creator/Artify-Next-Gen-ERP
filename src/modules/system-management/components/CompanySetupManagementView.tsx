import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Edit3,
  Archive,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Globe2,
  Sparkles,
  Download,
  Upload,
  Calendar,
  DollarSign,
  Coins,
  Palette,
  Landmark,
  Layers,
  History,
  Trash2,
  Eye,
  Check,
  X,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Printer,
  FileCheck2,
  Info,
  Clock,
  UserCheck,
  GitFork
} from 'lucide-react';
import { useSystemManagement } from '../services/systemManagementStore';
import { Company, CompanyAttachment, CompanyHistoryRecord } from '../types';
import { DataTable, ColumnDef } from './common/DataTable';
import { StatusBadge } from './common/StatusBadge';
import { MetricCard } from './common/MetricCard';
import { FormModal } from './common/FormModal';
import { CompanyBrandingStudio } from './CompanyBrandingStudio';
import { GroupHoldingManagementView } from './GroupHoldingManagementView';
import { notify } from '@/src/components/common/Feedback';

interface CompanySetupManagementViewProps {
  initialTransactionId?: string;
  initialTransactionCode?: string;
}

export const CompanySetupManagementView: React.FC<CompanySetupManagementViewProps> = ({
  initialTransactionId,
  initialTransactionCode
}) => {
  const {
    companies = [],
    groups = [],
    groupMemberships = [],
    branches = [],
    departments = [],
    addCompany,
    updateCompany,
    archiveCompany,
    submitCompanyForApproval,
    approveCompany,
    rejectCompany,
    toggleCompanyStatus,
    addCompanyAttachment,
    removeCompanyAttachment,
    checkDuplicateCompany,
    extractCompanyWithAI,
    generateCompanyProfileSummaryAI
  } = useSystemManagement();

  // Active Company Selection
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(companies[0]?.id || 'comp-1');
  const activeCompany = companies.find(c => c.id === selectedCompanyId) || companies[0];

  // Active sub-tab inside the inspector
  const [inspectorTab, setInspectorTab] = useState<
    'profile' | 'information' | 'branding' | 'parameters' | 'attachments' | 'history' | 'branches' | 'hierarchy'
  >('profile');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isHierarchyStudioOpen, setIsHierarchyStudioOpen] = useState(false);

  React.useEffect(() => {
    if (initialTransactionId === 'tx-company-creation' || initialTransactionCode === '01.01.01.01') {
      setIsCreateModalOpen(true);
    } else if (initialTransactionId === 'tx-company-profile' || initialTransactionCode === '01.01.01.02') {
      setInspectorTab('profile');
    } else if (initialTransactionId === 'tx-company-info' || initialTransactionCode === '01.01.01.03') {
      setInspectorTab('information');
    } else if (initialTransactionId === 'tx-company-branding' || initialTransactionCode === '01.01.01.04') {
      setInspectorTab('branding');
    } else if (initialTransactionId === 'tx-company-params' || initialTransactionCode === '01.01.01.05') {
      setInspectorTab('parameters');
    }
  }, [initialTransactionId, initialTransactionCode]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isGeneratingAiSummary, setIsGeneratingAiSummary] = useState(false);

  // Rejection reason state
  const [rejectionReason, setRejectionReason] = useState('');
  const [approvalComments, setApprovalComments] = useState('');
  const [editReason, setEditReason] = useState('');

  // Creation & Edit Form State
  const initialFormState: Omit<Company, 'id' | 'createdAt' | 'updatedAt' | 'version'> = {
    code: '',
    legalName: '',
    tradingName: '',
    shortName: '',
    companyType: 'Subsidiary',
    legalStructure: 'Limited Liability Company (LLC)',
    industrySegment: 'Industrial & Commercial',
    registrationNumber: '',
    registrationDate: new Date().toISOString().split('T')[0],
    registrationExpiryDate: '2036-01-01',
    taxNumber: '',
    taxAuthority: 'Oman Tax Authority (OTA)',
    commercialRegistryOffice: 'MOCIIP Commercial Registry',
    chamberOfCommerceNumber: '',
    municipalLicenseNumber: '',
    capitalAuthorized: 5000000,
    capitalPaidUp: 5000000,
    parValuePerShare: 1.0,
    totalShares: 5000000,
    country: 'Oman',
    state: 'Muscat Governorate',
    city: 'Muscat',
    address: 'Al Qurum Commercial Area, Way 2040',
    postalCode: 'PC 112',
    poBox: 'PO Box 500',
    buildingNumber: 'Bldg 12',
    wayStreet: 'Way 2040',
    phone: '+968 2400 0000',
    email: 'info@company.om',
    website: 'https://company.om',
    contactPerson: 'Corporate Secretary',
    managingDirectorName: 'Executive Director',
    cfoName: 'Chief Financial Officer',
    statutoryAuditor: 'PricewaterhouseCoopers (PwC)',
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
    watermarkText: 'CONFIDENTIAL CORPORATE DRAFT',
    watermarkEnabled: true,
    watermarkOpacity: 15,
    watermarkAngle: -30,
    letterheadTemplate: 'Default Standard',
    letterheadHeaderHtml: 'LEGAL ENTITY LETTERHEAD HEADER',
    letterheadFooterHtml: 'Registered Office: Sultanate of Oman | Commercial Register & Tax Compliant',
    headerTagline: 'Enterprise Commercial Solutions & Operations',
    footerBankDetails: 'Bank Muscat SAOG • IBAN: OM02BMUS00192837465001 • SWIFT: BMUSOMRX',
    arabicLegalName: 'شركة آرتفاي القابضة ش.م.ع.م',
    arabicAddress: 'مجمع القرم التجاري، مسقط، سلطنة عُمان',
    stampEnabled: true,
    signatureOfficerName: 'Eng. Salim Al-Rawahi',
    signatureOfficerTitle: 'Managing Director & CEO',
    status: 'Draft',
    isParent: false,
    isHolding: false,
    parentId: 'comp-1',
    parentEntityId: 'comp-1',
    ownershipPercentage: 100,
    attachments: [],
    history: []
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formStep, setFormStep] = useState<number>(1);

  // New Attachment State
  const [attachmentForm, setAttachmentForm] = useState({
    name: '',
    category: 'Commercial Registration (CR)' as CompanyAttachment['category'],
    size: '2.4 MB',
    type: 'application/pdf',
    documentNumber: '',
    expiryDate: '2030-01-01',
    uploadedBy: 'Compliance Dept'
  });

  // Real-time duplicate checking
  const handleCodeChange = (codeVal: string) => {
    const clean = codeVal.toUpperCase();
    setFormData(prev => ({ ...prev, code: clean }));
    if (!clean) {
      setFormErrors(prev => ({ ...prev, code: 'Company Code is mandatory.' }));
      return;
    }
    const dup = checkDuplicateCompany('code', clean, isEditModalOpen ? activeCompany?.id : undefined);
    if (dup.isDuplicate) {
      setFormErrors(prev => ({ ...prev, code: `Code already taken by ${dup.matchedCompany?.legalName}.` }));
    } else {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next.code;
        return next;
      });
    }
  };

  const handleCrChange = (crVal: string) => {
    setFormData(prev => ({ ...prev, registrationNumber: crVal }));
    if (crVal) {
      const dup = checkDuplicateCompany('registrationNumber', crVal, isEditModalOpen ? activeCompany?.id : undefined);
      if (dup.isDuplicate) {
        setFormErrors(prev => ({ ...prev, registrationNumber: `CR already registered to ${dup.matchedCompany?.legalName}.` }));
      } else {
        setFormErrors(prev => {
          const next = { ...prev };
          delete next.registrationNumber;
          return next;
        });
      }
    }
  };

  const handleTaxChange = (taxVal: string) => {
    setFormData(prev => ({ ...prev, taxNumber: taxVal }));
    if (taxVal) {
      const dup = checkDuplicateCompany('taxNumber', taxVal, isEditModalOpen ? activeCompany?.id : undefined);
      if (dup.isDuplicate) {
        setFormErrors(prev => ({ ...prev, taxNumber: `Tax Number (TRN) already assigned to ${dup.matchedCompany?.legalName}.` }));
      } else {
        setFormErrors(prev => {
          const next = { ...prev };
          delete next.taxNumber;
          return next;
        });
      }
    }
  };

  // Open Edit modal with pre-populated company data
  const handleOpenEdit = (comp: Company) => {
    setFormData({
      code: comp.code,
      legalName: comp.legalName,
      tradingName: comp.tradingName,
      shortName: comp.shortName || comp.tradingName,
      companyType: comp.companyType,
      legalStructure: comp.legalStructure || 'Limited Liability Company (LLC)',
      industrySegment: comp.industrySegment || 'General Commercial',
      registrationNumber: comp.registrationNumber,
      registrationDate: comp.registrationDate || '2020-01-01',
      registrationExpiryDate: comp.registrationExpiryDate || '2030-01-01',
      taxNumber: comp.taxNumber,
      taxAuthority: comp.taxAuthority || 'Tax Authority',
      commercialRegistryOffice: comp.commercialRegistryOffice || 'MOCIIP',
      chamberOfCommerceNumber: comp.chamberOfCommerceNumber || '',
      municipalLicenseNumber: comp.municipalLicenseNumber || '',
      capitalAuthorized: comp.capitalAuthorized || 1000000,
      capitalPaidUp: comp.capitalPaidUp || 1000000,
      parValuePerShare: comp.parValuePerShare || 1.0,
      totalShares: comp.totalShares || 1000000,
      country: comp.country,
      state: comp.state,
      city: comp.city,
      address: comp.address,
      postalCode: comp.postalCode,
      poBox: comp.poBox || '',
      buildingNumber: comp.buildingNumber || '',
      wayStreet: comp.wayStreet || '',
      phone: comp.phone,
      email: comp.email,
      website: comp.website,
      contactPerson: comp.contactPerson || '',
      managingDirectorName: comp.managingDirectorName || '',
      cfoName: comp.cfoName || '',
      statutoryAuditor: comp.statutoryAuditor || '',
      currency: comp.currency,
      secondaryCurrency: comp.secondaryCurrency || 'USD',
      fiscalYearStart: comp.fiscalYearStart,
      fiscalYearStartMonth: comp.fiscalYearStartMonth || 1,
      timeZone: comp.timeZone,
      dateFormat: comp.dateFormat,
      numberFormat: comp.numberFormat || '1,234,567.89',
      decimalPrecision: comp.decimalPrecision || 2,
      defaultRoundingMethod: comp.defaultRoundingMethod || 'Round Half Up',
      taxScheme: comp.taxScheme || 'Standard VAT 5%',
      corporateTaxRate: comp.corporateTaxRate || 15,
      vatRate: comp.vatRate || 5,
      brandColor: comp.brandColor || '#4f46e5',
      brandSecondaryColor: comp.brandSecondaryColor || '#06b6d4',
      logo: comp.logo || '',
      watermarkText: comp.watermarkText || `${comp.legalName.toUpperCase()} CONFIDENTIAL`,
      watermarkEnabled: comp.watermarkEnabled ?? true,
      watermarkOpacity: comp.watermarkOpacity ?? 15,
      watermarkAngle: comp.watermarkAngle ?? -30,
      letterheadTemplate: comp.letterheadTemplate || 'Default Standard',
      letterheadHeaderHtml: comp.letterheadHeaderHtml || '',
      letterheadFooterHtml: comp.letterheadFooterHtml || '',
      headerTagline: comp.headerTagline || '',
      footerBankDetails: comp.footerBankDetails || '',
      arabicLegalName: comp.arabicLegalName || '',
      arabicAddress: comp.arabicAddress || '',
      stampEnabled: comp.stampEnabled ?? true,
      signatureOfficerName: comp.signatureOfficerName || comp.managingDirectorName || '',
      signatureOfficerTitle: comp.signatureOfficerTitle || '',
      status: comp.status,
      isParent: comp.isParent,
      isHolding: comp.isHolding,
      parentId: comp.parentId,
      parentEntityId: comp.parentEntityId,
      ownershipPercentage: comp.ownershipPercentage || 100,
      attachments: comp.attachments || [],
      history: comp.history || []
    });
    setFormErrors({});
    setEditReason('');
    setIsEditModalOpen(true);
  };

  // Submit new company
  const handleSaveNewCompany = (asStatus: 'Draft' | 'Active') => {
    if (!formData.code || !formData.legalName) {
      setFormErrors({
        code: !formData.code ? 'Company Code is required.' : '',
        legalName: !formData.legalName ? 'Legal Entity Name is required.' : ''
      });
      return;
    }

    if (Object.keys(formErrors).length > 0) return;

    const res = addCompany(
      {
        ...formData,
        status: asStatus
      },
      { id: 'usr-admin', name: 'Eng. Salim Al-Rawahi', role: 'Super Admin' }
    );

    if (res.success && res.id) {
      setSelectedCompanyId(res.id);
      setIsCreateModalOpen(false);
      setFormData(initialFormState);
      setFormStep(1);
    }
  };

  // Save edited company
  const handleSaveEditCompany = () => {
    if (!activeCompany) return;
    const res = updateCompany(
      activeCompany.id,
      formData,
      editReason || 'Updated via Company Setup master console',
      { id: 'usr-admin', name: 'Eng. Salim Al-Rawahi', role: 'Super Admin' }
    );
    if (res.success) {
      setIsEditModalOpen(false);
    }
  };

  // AI OCR Extract
  const handleAiExtract = async () => {
    setIsAiScanning(true);
    try {
      const extracted = await extractCompanyWithAI('Raw CR Text sample');
      setFormData(prev => ({
        ...prev,
        ...extracted
      }));
    } finally {
      setIsAiScanning(false);
    }
  };

  // AI Profile Summary Generator
  const handleGenerateAiSummary = async () => {
    if (!activeCompany) return;
    setIsGeneratingAiSummary(true);
    try {
      const summary = await generateCompanyProfileSummaryAI(activeCompany.id);
      setAiSummary(summary);
    } finally {
      setIsGeneratingAiSummary(false);
    }
  };

  // Add Attachment Handler
  const handleAddAttachment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCompany || !attachmentForm.name) return;
    addCompanyAttachment(activeCompany.id, attachmentForm, { id: 'usr-admin', name: 'Administrator' });
    setIsAttachmentModalOpen(false);
    setAttachmentForm({
      name: '',
      category: 'Commercial Registration (CR)',
      size: '2.4 MB',
      type: 'application/pdf',
      documentNumber: '',
      expiryDate: '2030-01-01',
      uploadedBy: 'Compliance Dept'
    });
  };

  // Columns for the Company Master Directory Table
  const companyDirectoryColumns: ColumnDef<Company>[] = [
    {
      key: 'code',
      header: 'Code',
      accessor: item => (
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: item.brandColor || '#4f46e5' }}
            title={`Brand Color: ${item.brandColor}`}
          />
          <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300">{item.code}</span>
        </div>
      )
    },
    {
      key: 'legalName',
      header: 'Legal Entity & Structure',
      accessor: item => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            {item.legalName}
            {item.isParent && (
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold">
                Holding Apex
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
            <span>{item.legalStructure || item.companyType}</span>
            <span>•</span>
            <span className="text-slate-600 dark:text-slate-400 font-medium">{item.industrySegment || 'General'}</span>
          </div>
        </div>
      )
    },
    {
      key: 'country',
      header: 'Jurisdiction & Currency',
      accessor: item => (
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-800 dark:text-slate-200 font-medium">
            <Globe2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>{item.country}</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
            Base: <strong>{item.currency}</strong> (3 decimals: {item.decimalPrecision || 3})
          </div>
        </div>
      )
    },
    {
      key: 'taxNumber',
      header: 'Commercial & Tax Identifiers',
      accessor: item => (
        <div className="font-mono text-xs text-slate-600 dark:text-slate-400">
          <div>CR: <span className="font-bold text-slate-800 dark:text-slate-200">{item.registrationNumber}</span></div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">TRN: {item.taxNumber}</div>
        </div>
      )
    },
    {
      key: 'capital',
      header: 'Paid-up Capital',
      accessor: item => (
        <div className="font-mono text-xs">
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {item.capitalPaidUp ? item.capitalPaidUp.toLocaleString() : '—'} {item.currency}
          </span>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">
            Auth: {item.capitalAuthorized ? item.capitalAuthorized.toLocaleString() : '—'}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      accessor: item => <StatusBadge status={item.status} />
    }
  ];

  // Active company statistics
  const activeCompanyBranches = branches.filter(b => b.companyId === activeCompany?.id);
  const activeCompanyDepts = departments.filter(d => d.companyId === activeCompany?.id);
  const activeCompanyHistory = activeCompany?.history || [];
  const activeCompanyAttachments = activeCompany?.attachments || [];

  return (
    <div className="space-y-6">
      {/* Top Banner & Enterprise Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Registered Legal Entities"
          value={companies.length}
          change="+1 YTD"
          isPositive={true}
          description="Authoritative Multi-Company Master"
          icon={<Building2 className="w-5 h-5" />}
        />
        <MetricCard
          label="Active Status"
          value={companies.filter(c => c.status === 'Active').length}
          status="positive"
          description="Eligible for Operational Posting"
          icon={<CheckCircle2 className="w-5 h-5" />}
        />
        <MetricCard
          label="Governance / Draft"
          value={companies.filter(c => c.status === 'Draft' || c.status === 'Pending Approval').length}
          status={companies.some(c => c.status === 'Pending Approval') ? 'warning' : 'neutral'}
          description="Pending Board / Tax Officer Approval"
          icon={<ShieldCheck className="w-5 h-5" />}
        />
        <MetricCard
          label="Consolidated Capital Base"
          value={`${companies.reduce((sum, c) => sum + (c.capitalPaidUp || 0), 0) / 1000000}M OMR`}
          status="positive"
          description="Paid-up Group Equity"
          icon={<Landmark className="w-5 h-5" />}
        />
      </div>

      {/* Main Container: Split View (Directory Master Table + Deep Inspector & Setup Console) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Legal Entity Selector & Quick Table (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>01.01.01 Legal Entities Directory</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Authoritative organizational master register</p>
              </div>

              <button
                onClick={() => {
                  setFormData(initialFormState);
                  setFormErrors({});
                  setFormStep(1);
                  setIsCreateModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Entity</span>
              </button>
            </div>

            {/* Quick Entity List Cards */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[640px] overflow-y-auto">
              {companies.map(comp => {
                const isSelected = comp.id === selectedCompanyId;
                return (
                  <div
                    key={comp.id}
                    onClick={() => setSelectedCompanyId(comp.id)}
                    className={`p-4 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/80 dark:bg-indigo-500/80 border-l-4 border-indigo-600'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shadow-2xs"
                          style={{
                            backgroundColor: comp.brandColor ? `${comp.brandColor}15` : '#e0e7ff',
                            color: comp.brandColor || '#4338ca',
                            border: `1px solid ${comp.brandColor ? `${comp.brandColor}40` : '#c7d2fe'}`
                          }}
                        >
                          {comp.code.slice(0, 3)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100 text-xs flex items-center gap-1.5">
                            <span>{comp.legalName}</span>
                            {comp.isParent && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold">
                                Holding
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                            {comp.code} • {comp.country} ({comp.currency})
                          </div>
                        </div>
                      </div>

                      <StatusBadge status={comp.status} size="sm" />
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100/60 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>CR: <strong className="text-slate-700 dark:text-slate-300 font-mono">{comp.registrationNumber}</strong></span>
                      <span>VAT: <strong className="text-slate-700 dark:text-slate-300 font-mono">{comp.taxNumber}</strong></span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-0.5">
                        Inspect <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: 01.01.01 Functional Inspector & Setup Console (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs overflow-hidden">
            {/* Inspector Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-xs overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    style={{ borderColor: activeCompany?.brandColor || '#cbd5e1' }}
                  >
                    {activeCompany?.logo ? (
                      <img
                        src={activeCompany.logo}
                        alt="Logo"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <Building2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{activeCompany?.legalName}</h2>
                      <StatusBadge status={activeCompany?.status} />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                      <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300">{activeCompany?.code}</span>
                      <span>•</span>
                      <span>{activeCompany?.legalStructure || activeCompany?.companyType}</span>
                      <span>•</span>
                      <span>{activeCompany?.country}</span>
                    </p>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => handleOpenEdit(activeCompany)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                    <span>Edit Profile</span>
                  </button>

                  {activeCompany?.status === 'Draft' && (
                    <button
                      onClick={() => {
                        const res = submitCompanyForApproval(activeCompany.id, {
                          id: 'usr-admin',
                          name: 'Corporate Secretary',
                          role: 'Compliance Admin'
                        });
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Submit for Approval</span>
                    </button>
                  )}

                  {activeCompany?.status === 'Pending Approval' && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setIsApprovalModalOpen(true)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => setIsRejectModalOpen(true)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}

                  {activeCompany?.status === 'Active' && (
                    <button
                      onClick={() => toggleCompanyStatus(activeCompany.id, 'Inactive', { id: 'usr-admin', name: 'Administrator' })}
                      className="px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-500/40 hover:bg-amber-50 dark:hover:bg-amber-500/10 text-amber-800 dark:text-amber-200 text-xs font-medium transition-colors cursor-pointer"
                    >
                      Deactivate
                    </button>
                  )}

                  {activeCompany?.status === 'Inactive' && (
                    <button
                      onClick={() => toggleCompanyStatus(activeCompany.id, 'Active', { id: 'usr-admin', name: 'Administrator' })}
                      className="px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-500/40 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 text-xs font-medium transition-colors cursor-pointer"
                    >
                      Reactivate
                    </button>
                  )}

                  <button
                    onClick={() => setIsHierarchyStudioOpen(true)}
                    className="px-3 py-1.5 rounded-lg border border-purple-300 dark:border-purple-500/40 hover:bg-purple-50 dark:hover:bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Launch Enterprise Group & Holding Hierarchy Studio"
                  >
                    <GitFork className="w-3.5 h-3.5" />
                    <span>Manage Hierarchy</span>
                  </button>

                  <button
                    onClick={() => archiveCompany(activeCompany.id, { id: 'usr-admin', name: 'Administrator' })}
                    disabled={activeCompany?.isParent || activeCompany?.isHolding}
                    title={activeCompany?.isParent ? 'Apex holding parent cannot be archived' : 'Archive entity'}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-300 dark:hover:border-rose-500/40 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sub-Tabs Navigation for Level-4 Operations */}
              <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-700 mt-5 -mb-5 overflow-x-auto">
                {[
                  { key: 'profile', label: 'Company Profile', icon: Building2 },
                  { key: 'information', label: 'Statutory & Identification', icon: FileCheck2 },
                  { key: 'branding', label: 'Logo & Branding', icon: Palette },
                  { key: 'parameters', label: 'Fiscal Parameters', icon: Coins },
                  { key: 'hierarchy', label: 'Hierarchy & Holding', icon: GitFork },
                  { key: 'attachments', label: `Filings (${activeCompanyAttachments.length})`, icon: FileText },
                  { key: 'branches', label: `Branches (${activeCompanyBranches.length})`, icon: Landmark },
                  { key: 'history', label: `Change History (${activeCompanyHistory.length})`, icon: History }
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = inspectorTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setInspectorTab(tab.key as any)}
                      className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                        isActive
                          ? 'border-indigo-600 text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-900'
                          : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sub-Tab 1: Company Profile (Overview & AI Statutory Briefing) */}
            {inspectorTab === 'profile' && (
              <div className="p-6 space-y-6">
                {/* AI Executive Profile Assistant */}
                <div className="bg-linear-to-r from-indigo-50/70 dark:from-indigo-500/10 via-purple-50/40 dark:via-purple-500/10 to-slate-50 dark:to-slate-900 border border-indigo-100 dark:border-indigo-500/20 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 dark:text-indigo-100">
                      <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>AI Statutory Profile Briefing & Compliance Diagnosis</span>
                    </div>
                    <button
                      onClick={handleGenerateAiSummary}
                      disabled={isGeneratingAiSummary}
                      className="px-3 py-1 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-500/30 hover:border-indigo-300 dark:hover:border-indigo-500/40 rounded-lg text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-2xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      {isGeneratingAiSummary ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3" />
                      )}
                      <span>{aiSummary ? 'Refresh Briefing' : 'Generate Briefing'}</span>
                    </button>
                  </div>

                  {aiSummary ? (
                    <div className="mt-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-white/80 dark:bg-slate-900/80 p-3 rounded-lg border border-indigo-50">
                      {aiSummary}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Synthesizes statutory commercial registration, capital adequacy, VAT tax regimes, management roles, and branch topology for executive audit.
                    </p>
                  )}
                </div>

                {/* Statutory Quick Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50/70 dark:bg-slate-800/70 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      <span>Registration & Identification</span>
                    </h4>
                    <div className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
                      <div className="flex justify-between">
                        <span>Commercial Register (CR):</span>
                        <strong className="font-mono text-slate-900 dark:text-slate-100">{activeCompany?.registrationNumber}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax Registration (TRN):</span>
                        <strong className="font-mono text-slate-900 dark:text-slate-100">{activeCompany?.taxNumber}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax Authority:</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">{activeCompany?.taxAuthority || 'OTA'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Registration Date:</span>
                        <span>{activeCompany?.registrationDate || '2020-01-15'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>License Expiry Date:</span>
                        <span className="text-emerald-700 dark:text-emerald-300 font-semibold">{activeCompany?.registrationExpiryDate || '2030-01-14'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50/70 dark:bg-slate-800/70 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      <span>Capital Structure & Accounting</span>
                    </h4>
                    <div className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
                      <div className="flex justify-between">
                        <span>Authorized Capital:</span>
                        <strong className="font-mono text-slate-900 dark:text-slate-100">
                          {activeCompany?.capitalAuthorized ? activeCompany.capitalAuthorized.toLocaleString() : '0'} {activeCompany?.currency}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Paid-Up Capital:</span>
                        <strong className="font-mono text-emerald-800 dark:text-emerald-200">
                          {activeCompany?.capitalPaidUp ? activeCompany.capitalPaidUp.toLocaleString() : '0'} {activeCompany?.currency}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Shares & Par Value:</span>
                        <span>{activeCompany?.totalShares?.toLocaleString()} shares @ {activeCompany?.parValuePerShare} {activeCompany?.currency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Base Currency:</span>
                        <strong className="text-indigo-700 dark:text-indigo-300 font-bold">{activeCompany?.currency} (Decimals: {activeCompany?.decimalPrecision || 3})</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Fiscal Start Month:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">Month {activeCompany?.fiscalYearStartMonth || 1} (Jan)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Governance & Management Leadership */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span>Statutory Management & Appointed Auditors</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                      <div className="text-slate-500 dark:text-slate-400 text-[11px]">Managing Director / CEO</div>
                      <div className="font-bold text-slate-900 dark:text-slate-100 mt-1">{activeCompany?.managingDirectorName || 'Executive Board'}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                      <div className="text-slate-500 dark:text-slate-400 text-[11px]">Chief Financial Officer (CFO)</div>
                      <div className="font-bold text-slate-900 dark:text-slate-100 mt-1">{activeCompany?.cfoName || 'Financial Controller'}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                      <div className="text-slate-500 dark:text-slate-400 text-[11px]">Independent Statutory Auditor</div>
                      <div className="font-bold text-indigo-700 dark:text-indigo-300 mt-1">{activeCompany?.statutoryAuditor || 'Appointed Auditor'}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Tab 2: Company Information (Statutory, Addresses & Contacts) */}
            {inspectorTab === 'information' && (
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Official Head Office & Address Coordinates
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                      <div className="text-slate-500 dark:text-slate-400 font-medium">Physical Street Address</div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{activeCompany?.address}</div>
                      <div className="text-slate-600 dark:text-slate-400">
                        {activeCompany?.buildingNumber && `${activeCompany.buildingNumber}, `}
                        {activeCompany?.wayStreet && `${activeCompany.wayStreet}, `}
                        {activeCompany?.city}, {activeCompany?.state}
                      </div>
                      <div className="text-slate-600 dark:text-slate-400 font-mono">
                        Postal Code: {activeCompany?.postalCode} {activeCompany?.poBox && `• ${activeCompany.poBox}`}
                      </div>
                    </div>

                    <div className="space-y-2 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                      <div className="text-slate-500 dark:text-slate-400 font-medium">Official Communications</div>
                      <div className="flex justify-between">
                        <span>Official Phone:</span>
                        <strong className="font-mono text-slate-900 dark:text-slate-100">{activeCompany?.phone}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Official Email:</span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-medium">{activeCompany?.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Corporate Website:</span>
                        <a
                          href={activeCompany?.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          {activeCompany?.website} <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <div className="flex justify-between">
                        <span>Contact Officer:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{activeCompany?.contactPerson || 'Corporate Secretary'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Statutory Registry Offices & Licenses
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                      <div className="text-slate-500 dark:text-slate-400 text-[11px]">Commercial Registry Office</div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100 mt-1">{activeCompany?.commercialRegistryOffice || 'MOCIIP'}</div>
                    </div>
                    <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                      <div className="text-slate-500 dark:text-slate-400 text-[11px]">Chamber of Commerce #</div>
                      <div className="font-mono font-semibold text-slate-900 dark:text-slate-100 mt-1">{activeCompany?.chamberOfCommerceNumber || 'OCCI-98421'}</div>
                    </div>
                    <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                      <div className="text-slate-500 dark:text-slate-400 text-[11px]">Municipality Permit #</div>
                      <div className="font-mono font-semibold text-slate-900 dark:text-slate-100 mt-1">{activeCompany?.municipalLicenseNumber || 'MM-LIC-2020-00921'}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Tab 3: Logo & Branding */}
            {inspectorTab === 'branding' && activeCompany && (
              <CompanyBrandingStudio
                company={activeCompany}
                onSave={(fields, reason) => {
                  updateCompany(
                    activeCompany.id,
                    fields,
                    reason || 'Updated branding, logo, watermark, and letterhead template',
                    { id: 'usr-admin', name: 'Eng. Salim Al-Rawahi', role: 'Super Admin' }
                  );
                }}
              />
            )}

            {/* Sub-Tab 4: Fiscal & Financial Parameters */}
            {inspectorTab === 'parameters' && (
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      <span>Currency & Decimal Precisions</span>
                    </h4>
                    <div className="space-y-2 text-slate-600 dark:text-slate-400">
                      <div className="flex justify-between">
                        <span>Functional Base Currency:</span>
                        <strong className="font-mono font-bold text-indigo-700 dark:text-indigo-300">{activeCompany?.currency}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Secondary / Reporting Currency:</span>
                        <strong className="font-mono text-slate-800 dark:text-slate-200">{activeCompany?.secondaryCurrency || 'USD'}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Decimal Precision:</span>
                        <span className="font-mono font-semibold">{activeCompany?.decimalPrecision || 3} Decimal Places</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Number Mask:</span>
                        <span className="font-mono text-slate-800 dark:text-slate-200">{activeCompany?.numberFormat || '1,234,567.890'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rounding Rule:</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">{activeCompany?.defaultRoundingMethod || 'Round Half Up'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      <span>Statutory Tax & Fiscal Rules</span>
                    </h4>
                    <div className="space-y-2 text-slate-600 dark:text-slate-400">
                      <div className="flex justify-between">
                        <span>Tax Scheme:</span>
                        <strong className="text-slate-900 dark:text-slate-100">{activeCompany?.taxScheme || 'Standard VAT 5%'}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Standard VAT Rate:</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{activeCompany?.vatRate || 5}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Corporate Income Tax Rate:</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{activeCompany?.corporateTaxRate || 15}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fiscal Year Start Month:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">Month {activeCompany?.fiscalYearStartMonth || 1} (January)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>System Date Format:</span>
                        <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{activeCompany?.dateFormat || 'YYYY-MM-DD'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Tab: Group & Holding Hierarchy */}
            {inspectorTab === 'hierarchy' && (
              <div className="p-6 space-y-6">
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-purple-50/70 dark:bg-purple-500/70 border border-purple-200/80">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <GitFork className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                        Enterprise Group & Multi-Tier Holding Architecture
                      </h4>
                      <p className="text-xs text-purple-800/80 dark:text-purple-200/80 mt-0.5">
                        IFRS 10 Consolidated Financial Reporting • Parent-Subsidiary Equity Mapping
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsHierarchyStudioOpen(true)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <GitFork className="w-4 h-4" />
                    <span>Open Full Hierarchy Studio (01.01.06)</span>
                  </button>
                </div>

                {/* Corporate Position Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Entity Role */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 space-y-2">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Corporate Role
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        activeCompany?.isParent || activeCompany?.companyType === 'Holding'
                          ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-500/30'
                          : 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-500/30'
                      }`}>
                        {activeCompany?.isParent || activeCompany?.companyType === 'Holding'
                          ? '👑 Apex Holding Entity'
                          : `${activeCompany?.companyType || 'Operating Subsidiary'}`}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {activeCompany?.isParent
                        ? 'Serves as the apex parent entity with ultimate controlling interest across group subsidiaries.'
                        : 'Operating legal entity consolidated into enterprise holding financials.'}
                    </p>
                  </div>

                  {/* Parent Entity / Holding Group */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 space-y-2">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Parent Holding Group
                    </span>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {groups.find(g => g.parentCompanyId === activeCompany?.id)?.name ||
                       groups[0]?.name ||
                       'Artify Global Holdings'}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      Code: {groups.find(g => g.parentCompanyId === activeCompany?.id)?.code || groups[0]?.code || 'ART-HOLD-GRP'}
                    </div>
                  </div>

                  {/* Anti-Circular Validation */}
                  <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-500/40 space-y-2">
                    <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-200 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Hierarchy Integrity Valid</span>
                    </div>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                      No circular holding loops detected. Compliant with ISO 17442 LEI hierarchy & IFRS 10 consolidated governance.
                    </p>
                  </div>
                </div>

                {/* Subsidiary Relationships Matrix */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        Associated Group Memberships & Subsidiary Equity Holdings
                      </h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Direct ownership shares, voting rights, and financial consolidation classification
                      </p>
                    </div>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                      {groupMemberships.length} Entities in Group
                    </span>
                  </div>

                  <div className="divide-y divide-slate-200 dark:divide-slate-700">
                    {groupMemberships.map(mem => {
                      const memberComp = companies.find(c => c.id === mem.companyId);
                      const isCurrent = mem.companyId === activeCompany?.id;
                      return (
                        <div
                          key={mem.id}
                          className={`p-3.5 flex items-center justify-between text-xs transition-colors ${
                            isCurrent ? 'bg-purple-50/60 dark:bg-purple-500/60 font-semibold' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-[11px]">
                              {memberComp?.code?.slice(0, 2) || 'EN'}
                            </div>
                            <div>
                              <div className="text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                <span>{memberComp?.legalName || mem.companyId}</span>
                                {isCurrent && (
                                  <span className="px-2 py-0.2 rounded text-[10px] bg-purple-200 dark:bg-purple-500/30 text-purple-900 dark:text-purple-100 font-bold">
                                    Current Entity
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                                Tier {mem.tierLevel || 1} • Role: {mem.roleInGroup || 'Subsidiary'}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-right">
                            <div>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Equity Share</span>
                              <span className="font-bold text-slate-900 dark:text-slate-100">{mem.ownershipPercentage || 100}%</span>
                            </div>
                            <div>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Voting Control</span>
                              <span className="font-bold text-slate-900 dark:text-slate-100">{mem.votingPercentage || 100}%</span>
                            </div>
                            <div className="hidden sm:block">
                              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Method</span>
                              <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 font-semibold">
                                {mem.consolidationMethod || 'Full Consolidation'}
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedCompanyId(mem.companyId);
                                setInspectorTab('profile');
                              }}
                              className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-semibold transition-colors cursor-pointer"
                            >
                              Inspect
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Tab 5: Attachments & Statutory Filings */}
            {inspectorTab === 'attachments' && (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      Regulatory Filings & Governance Documents
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Commercial Registration certificates, Tax cards, Municipality licenses, and Articles of Association
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAttachmentModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Document</span>
                  </button>
                </div>

                {activeCompanyAttachments.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 text-xs">
                    No regulatory documents attached to this legal entity yet.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-200 dark:divide-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    {activeCompanyAttachments.map(att => (
                      <div key={att.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-700 dark:text-indigo-300">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs flex items-center gap-2">
                              <span>{att.name}</span>
                              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                                {att.category}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2 font-mono">
                              <span>{att.size}</span>
                              <span>•</span>
                              <span>Uploaded by {att.uploadedBy} on {att.uploadedAt}</span>
                              {att.documentNumber && <span>• Ref: {att.documentNumber}</span>}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => notify(`Simulated downloading document: ${att.name}`)}
                            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors cursor-pointer"
                            title="Download Document"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeCompanyAttachment(activeCompany.id, att.id, { id: 'usr-admin', name: 'Administrator' })}
                            className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-500/20 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                            title="Remove Document"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Sub-Tab 6: Associated Branches */}
            {inspectorTab === 'branches' && (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Associated Operational Branches ({activeCompanyBranches.length})
                  </h4>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Cross-referenced to 01.01.02 Branch Master
                  </span>
                </div>

                {activeCompanyBranches.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 text-xs">
                    No operating branches registered under this legal entity yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeCompanyBranches.map(br => (
                      <div key={br.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/50 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-bold text-slate-900 dark:text-slate-100 text-xs">{br.name}</div>
                            <div className="font-mono text-[11px] text-indigo-700 dark:text-indigo-300 mt-0.5">{br.code}</div>
                          </div>
                          <StatusBadge status={br.status} size="sm" />
                        </div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 pt-2 border-t border-slate-200 dark:border-slate-700">
                          <div>Address: {br.address}</div>
                          <div>Branch Manager: <strong>{br.manager || 'Unassigned'}</strong></div>
                          <div>Tax Status: <span className="font-semibold">{br.isTaxBranch ? 'Autonomous Tax Branch' : 'Operating Branch'}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Sub-Tab 7: Change History & Audit Trail */}
            {inspectorTab === 'history' && (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span>Immutable Change History & Audit Ledger</span>
                  </h4>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Entity Version: v{activeCompany?.version || 1}</span>
                </div>

                {activeCompanyHistory.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 text-xs">
                    No parameter changes logged yet for this entity.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeCompanyHistory.map(hist => (
                      <div key={hist.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-3.5 bg-slate-50/40 dark:bg-slate-800/40 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-indigo-900 dark:text-indigo-100 font-mono">{hist.fieldChanged}</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {hist.timestamp}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                          <span className="line-through text-slate-500 dark:text-slate-400">{hist.oldValue}</span>
                          <span className="text-slate-500 dark:text-slate-400">→</span>
                          <strong className="text-emerald-800 dark:text-emerald-200 font-semibold">{hist.newValue}</strong>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <span>Reason: <em>{hist.changeReason}</em></span>
                          <span>By: <strong>{hist.changedBy}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Legal Entity Master Register Table (Below Split Layout) */}
      <div className="mt-8">
        <DataTable
          title="01.01.01 Corporate Legal Entities Master Register"
          subtitle="Autonomous legal entities with independent statutory registrations, tax numbers, and fiscal parameters"
          data={companies}
          columns={companyDirectoryColumns}
          keyExtractor={item => item.id}
          onAddClick={() => {
            setFormData(initialFormState);
            setFormErrors({});
            setFormStep(1);
            setIsCreateModalOpen(true);
          }}
          addLabel="Register Legal Entity"
          searchPlaceholder="Search legal entity by code, name, CR number, VAT TRN, country..."
          exportFileName="artify-company-setup-register"
          filterOptions={[
            {
              key: 'status',
              label: 'Status',
              options: [
                { value: 'Active', label: 'Active' },
                { value: 'Draft', label: 'Draft' },
                { value: 'Pending Approval', label: 'Pending Approval' },
                { value: 'Inactive', label: 'Inactive' },
                { value: 'Archived', label: 'Archived' }
              ],
              filterFn: (item, val) => item.status === val
            },
            {
              key: 'country',
              label: 'Country',
              options: [
                { value: 'Oman', label: 'Oman' },
                { value: 'United Arab Emirates', label: 'United Arab Emirates' },
                { value: 'Saudi Arabia', label: 'Saudi Arabia' }
              ],
              filterFn: (item, val) => item.country === val
            }
          ]}
          actionRenderer={item => (
            <div className="flex items-center justify-end gap-1.5">
              <button
                onClick={() => {
                  setSelectedCompanyId(item.id);
                  setInspectorTab('profile');
                }}
                className="px-2.5 py-1 rounded text-xs font-semibold bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 transition-colors cursor-pointer"
              >
                Inspect
              </button>
              <button
                onClick={() => handleOpenEdit(item)}
                className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors cursor-pointer"
                title="Edit Entity"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        />
      </div>

      {/* Creation Modal (Multi-Step Wizard) */}
      <FormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Register New Legal Entity (01.01.01)"
        subtitle="Step-by-step corporate registration with real-time duplicate checks and AI statutory prefill"
        size="2xl"
      >
        <div className="space-y-5">
          {/* AI Pre-fill Action Banner */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-xs">
            <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-100 font-semibold">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Have a Trade License / CR Certificate? Use AI extraction</span>
            </div>
            <button
              onClick={handleAiExtract}
              disabled={isAiScanning}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md flex items-center gap-1 shadow-2xs cursor-pointer disabled:opacity-50"
            >
              {isAiScanning ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              <span>{isAiScanning ? 'Extracting...' : 'Auto-Fill with AI'}</span>
            </button>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3 text-xs overflow-x-auto gap-2">
            {[
              { num: 1, label: 'Identification & Structure' },
              { num: 2, label: 'Registration & Tax' },
              { num: 3, label: 'Capital & Currency' },
              { num: 4, label: 'Address & Leadership' },
              { num: 5, label: 'Logo, Watermark & Letterhead' }
            ].map(step => (
              <button
                key={step.num}
                onClick={() => setFormStep(step.num)}
                className={`flex items-center gap-2 font-semibold pb-1 cursor-pointer whitespace-nowrap ${
                  formStep === step.num
                    ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                  formStep === step.num ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}>
                  {step.num}
                </span>
                <span className="hidden md:inline">{step.label}</span>
              </button>
            ))}
          </div>

          {/* Step 1: Identification & Legal Structure */}
          {formStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Company Code <span className="text-rose-500 dark:text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={e => handleCodeChange(e.target.value)}
                    placeholder="e.g. ART-HOLD, GH-ENERGY"
                    className="w-full px-3 py-2 border rounded-lg text-xs font-mono font-bold uppercase focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                  {formErrors.code && <p className="text-rose-600 dark:text-rose-400 text-[11px] mt-1">{formErrors.code}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Legal Entity Name <span className="text-rose-500 dark:text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.legalName}
                    onChange={e => {
                      setFormData(prev => ({ ...prev, legalName: e.target.value }));
                      if (formErrors.legalName) {
                        setFormErrors(prev => {
                          const n = { ...prev };
                          delete n.legalName;
                          return n;
                        });
                      }
                    }}
                    placeholder="e.g. Gulf Horizon Energy SAOC"
                    className="w-full px-3 py-2 border rounded-lg text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                  {formErrors.legalName && <p className="text-rose-600 dark:text-rose-400 text-[11px] mt-1">{formErrors.legalName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Trading Name</label>
                  <input
                    type="text"
                    value={formData.tradingName}
                    onChange={e => setFormData(prev => ({ ...prev, tradingName: e.target.value }))}
                    placeholder="e.g. Horizon Energy"
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Legal Structure</label>
                  <select
                    value={formData.legalStructure}
                    onChange={e => setFormData(prev => ({ ...prev, legalStructure: e.target.value as any }))}
                    className="w-full px-3 py-2 border rounded-lg text-xs bg-white dark:bg-slate-900"
                  >
                    <option value="Closed Joint Stock Company (SAOC)">Closed Joint Stock Company (SAOC)</option>
                    <option value="Public Joint Stock Company (SAOG)">Public Joint Stock Company (SAOG)</option>
                    <option value="Limited Liability Company (LLC)">Limited Liability Company (LLC)</option>
                    <option value="Sole Proprietorship (SPC)">Sole Proprietorship (SPC)</option>
                    <option value="Free Zone Entity (FZE/FZ-LLC)">Free Zone Entity (FZE/FZ-LLC)</option>
                    <option value="Branch of Foreign Entity">Branch of Foreign Entity</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Entity Role</label>
                  <select
                    value={formData.companyType}
                    onChange={e => setFormData(prev => ({ ...prev, companyType: e.target.value as any }))}
                    className="w-full px-3 py-2 border rounded-lg text-xs bg-white dark:bg-slate-900"
                  >
                    <option value="Subsidiary">Subsidiary</option>
                    <option value="Holding">Holding Apex</option>
                    <option value="Joint Venture">Joint Venture</option>
                    <option value="Associate">Associate</option>
                    <option value="Branch">Branch Entity</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Industry Segment</label>
                  <input
                    type="text"
                    value={formData.industrySegment}
                    onChange={e => setFormData(prev => ({ ...prev, industrySegment: e.target.value }))}
                    placeholder="e.g. Clean Energy & Utilities"
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Statutory Registration & Tax */}
          {formStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Commercial Registration (CR) Number
                  </label>
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={e => handleCrChange(e.target.value)}
                    placeholder="e.g. CR-4829103"
                    className="w-full px-3 py-2 border rounded-lg text-xs font-mono font-semibold"
                  />
                  {formErrors.registrationNumber && <p className="text-rose-600 dark:text-rose-400 text-[11px] mt-1">{formErrors.registrationNumber}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    VAT Tax Identification Number (TRN)
                  </label>
                  <input
                    type="text"
                    value={formData.taxNumber}
                    onChange={e => handleTaxChange(e.target.value)}
                    placeholder="e.g. OM-VAT-40082910"
                    className="w-full px-3 py-2 border rounded-lg text-xs font-mono font-semibold"
                  />
                  {formErrors.taxNumber && <p className="text-rose-600 dark:text-rose-400 text-[11px] mt-1">{formErrors.taxNumber}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tax Authority</label>
                  <input
                    type="text"
                    value={formData.taxAuthority}
                    onChange={e => setFormData(prev => ({ ...prev, taxAuthority: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Registration Date</label>
                  <input
                    type="date"
                    value={formData.registrationDate}
                    onChange={e => setFormData(prev => ({ ...prev, registrationDate: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">License Expiry Date</label>
                  <input
                    type="date"
                    value={formData.registrationExpiryDate}
                    onChange={e => setFormData(prev => ({ ...prev, registrationExpiryDate: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Chamber of Commerce #</label>
                  <input
                    type="text"
                    value={formData.chamberOfCommerceNumber}
                    onChange={e => setFormData(prev => ({ ...prev, chamberOfCommerceNumber: e.target.value }))}
                    placeholder="e.g. OCCI-MUS-5820"
                    className="w-full px-3 py-2 border rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Municipal License #</label>
                  <input
                    type="text"
                    value={formData.municipalLicenseNumber}
                    onChange={e => setFormData(prev => ({ ...prev, municipalLicenseNumber: e.target.value }))}
                    placeholder="e.g. MM-LIC-2023-891"
                    className="w-full px-3 py-2 border rounded-lg text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Capital & Currency Parameters */}
          {formStep === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Authorized Capital</label>
                  <input
                    type="number"
                    value={formData.capitalAuthorized}
                    onChange={e => setFormData(prev => ({ ...prev, capitalAuthorized: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Paid-Up Capital</label>
                  <input
                    type="number"
                    value={formData.capitalPaidUp}
                    onChange={e => setFormData(prev => ({ ...prev, capitalPaidUp: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Base Currency</label>
                  <select
                    value={formData.currency}
                    onChange={e => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg text-xs bg-white dark:bg-slate-900 font-bold"
                  >
                    <option value="OMR">OMR (Omani Rial - 3 Decimals)</option>
                    <option value="AED">AED (UAE Dirham)</option>
                    <option value="SAR">SAR (Saudi Riyal)</option>
                    <option value="USD">USD (US Dollar)</option>
                    <option value="EUR">EUR (Euro)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Secondary Currency</label>
                  <select
                    value={formData.secondaryCurrency}
                    onChange={e => setFormData(prev => ({ ...prev, secondaryCurrency: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg text-xs bg-white dark:bg-slate-900"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Fiscal Year Start</label>
                  <select
                    value={formData.fiscalYearStartMonth}
                    onChange={e => setFormData(prev => ({ ...prev, fiscalYearStartMonth: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border rounded-lg text-xs bg-white dark:bg-slate-900"
                  >
                    <option value={1}>January (Standard Calendar)</option>
                    <option value={4}>April (Financial Year)</option>
                    <option value={7}>July (Mid-Year)</option>
                    <option value={10}>October</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tax Regime</label>
                  <select
                    value={formData.taxScheme}
                    onChange={e => setFormData(prev => ({ ...prev, taxScheme: e.target.value as any }))}
                    className="w-full px-3 py-2 border rounded-lg text-xs bg-white dark:bg-slate-900"
                  >
                    <option value="Standard VAT 5%">Standard VAT 5% (Oman / UAE)</option>
                    <option value="VAT 15%">Standard VAT 15% (Saudi Arabia)</option>
                    <option value="Zero-Rated / Exempt">Zero-Rated / Exempt</option>
                    <option value="Free Zone Tax Exempt">Free Zone Tax Exempt</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Corporate Tax Rate (%)</label>
                  <input
                    type="number"
                    value={formData.corporateTaxRate}
                    onChange={e => setFormData(prev => ({ ...prev, corporateTaxRate: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Address, Management & Leadership */}
          {formStep === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Country</label>
                  <select
                    value={formData.country}
                    onChange={e => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg text-xs bg-white dark:bg-slate-900"
                  >
                    <option value="Oman">Oman</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Qatar">Qatar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Muscat"
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Governorate / State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={e => setFormData(prev => ({ ...prev, state: e.target.value }))}
                    placeholder="Muscat Governorate"
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Physical Street Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Knowledge Oasis Muscat (KOM), Building 4"
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Managing Director / CEO</label>
                  <input
                    type="text"
                    value={formData.managingDirectorName}
                    onChange={e => setFormData(prev => ({ ...prev, managingDirectorName: e.target.value }))}
                    placeholder="Eng. Badar Al-Kiyumi"
                    className="w-full px-3 py-2 border rounded-lg text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Chief Financial Officer (CFO)</label>
                  <input
                    type="text"
                    value={formData.cfoName}
                    onChange={e => setFormData(prev => ({ ...prev, cfoName: e.target.value }))}
                    placeholder="Huda Al-Mamari"
                    className="w-full px-3 py-2 border rounded-lg text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Statutory Auditor</label>
                  <input
                    type="text"
                    value={formData.statutoryAuditor}
                    onChange={e => setFormData(prev => ({ ...prev, statutoryAuditor: e.target.value }))}
                    placeholder="Ernst & Young (EY)"
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Official Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Official Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Logo, Watermark & Letterhead Branding */}
          {formStep === 5 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Company Logo URL / Preset</label>
                  <input
                    type="text"
                    value={formData.logo}
                    onChange={e => setFormData(prev => ({ ...prev, logo: e.target.value }))}
                    placeholder="https://... or preset logo URL"
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                  <div className="flex gap-2 mt-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData(prev => ({
                          ...prev,
                          logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=128&auto=format&fit=crop&q=80'
                        }))
                      }
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
                    >
                      Preset Apex Crest
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData(prev => ({
                          ...prev,
                          logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&auto=format&fit=crop&q=80'
                        }))
                      }
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
                    >
                      Preset Tech Tower
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Primary Brand Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.brandColor || '#4f46e5'}
                      onChange={e => setFormData(prev => ({ ...prev, brandColor: e.target.value }))}
                      className="w-10 h-8 rounded border cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      value={formData.brandColor}
                      onChange={e => setFormData(prev => ({ ...prev, brandColor: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg text-xs font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Watermark Security Text</label>
                  <input
                    type="text"
                    value={formData.watermarkText}
                    onChange={e => setFormData(prev => ({ ...prev, watermarkText: e.target.value }))}
                    placeholder="e.g. CONFIDENTIAL CORPORATE DRAFT"
                    className="w-full px-3 py-2 border rounded-lg text-xs font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Header Layout Template</label>
                  <select
                    value={formData.letterheadTemplate || 'Default Standard'}
                    onChange={e => setFormData(prev => ({ ...prev, letterheadTemplate: e.target.value as any }))}
                    className="w-full px-3 py-2 border rounded-lg text-xs bg-white dark:bg-slate-900 font-medium"
                  >
                    <option value="Default Standard">Default Standard (Corporate Banner)</option>
                    <option value="Modern Minimalist">Modern Minimalist (Sleek Border)</option>
                    <option value="Executive Classic">Executive Classic (Boxed Header)</option>
                    <option value="Bilingual English/Arabic">Bilingual English/Arabic (Dual Crest)</option>
                    <option value="Centered Official">Centered Official (Formal Apex)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Letterhead Header Tagline</label>
                  <input
                    type="text"
                    value={formData.headerTagline}
                    onChange={e => setFormData(prev => ({ ...prev, headerTagline: e.target.value }))}
                    placeholder="e.g. Enterprise Commercial Solutions & Operations"
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Arabic Legal Entity Name</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={formData.arabicLegalName}
                    onChange={e => setFormData(prev => ({ ...prev, arabicLegalName: e.target.value }))}
                    placeholder="شركة آرتفاي القابضة ش.م.ع.م"
                    className="w-full px-3 py-2 border rounded-lg text-xs text-right"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Footer Bank & Wire Instructions</label>
                <input
                  type="text"
                  value={formData.footerBankDetails}
                  onChange={e => setFormData(prev => ({ ...prev, footerBankDetails: e.target.value }))}
                  placeholder="e.g. Bank Muscat SAOG • IBAN: OM02BMUS00192837465001 • SWIFT: BMUSOMRX"
                  className="w-full px-3 py-2 border rounded-lg text-xs font-mono"
                />
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
            <div>
              {formStep > 1 && (
                <button
                  type="button"
                  onClick={() => setFormStep(s => s - 1)}
                  className="px-4 py-2 border rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                >
                  Previous Step
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {formStep < 5 ? (
                <button
                  type="button"
                  onClick={() => setFormStep(s => s + 1)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Next Step
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleSaveNewCompany('Draft')}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Save as Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveNewCompany('Active')}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
                  >
                    Register & Activate
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </FormModal>

      {/* Edit Profile Modal */}
      <FormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Legal Entity Master: ${activeCompany?.legalName}`}
        subtitle="Update statutory parameters, contacts, branding, logo, watermark, and letterhead"
        size="2xl"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Legal Entity Name</label>
              <input
                type="text"
                value={formData.legalName}
                onChange={e => setFormData(prev => ({ ...prev, legalName: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Trading Name</label>
              <input
                type="text"
                value={formData.tradingName}
                onChange={e => setFormData(prev => ({ ...prev, tradingName: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">CR Number</label>
              <input
                type="text"
                value={formData.registrationNumber}
                onChange={e => handleCrChange(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-xs font-mono font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tax Number (VAT TRN)</label>
              <input
                type="text"
                value={formData.taxNumber}
                onChange={e => handleTaxChange(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-xs font-mono font-semibold"
              />
            </div>
          </div>

          {/* Branding, Logo & Colors in Edit Modal */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3">
            <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Branding, Logo & Watermark Settings
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Logo URL</label>
                <input
                  type="text"
                  value={formData.logo}
                  onChange={e => setFormData(prev => ({ ...prev, logo: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-2.5 py-1.5 border rounded-lg text-xs bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Primary Brand Accent Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.brandColor || '#4f46e5'}
                    onChange={e => setFormData(prev => ({ ...prev, brandColor: e.target.value }))}
                    className="w-8 h-8 rounded border cursor-pointer shrink-0"
                  />
                  <input
                    type="text"
                    value={formData.brandColor}
                    onChange={e => setFormData(prev => ({ ...prev, brandColor: e.target.value }))}
                    className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-mono uppercase font-bold bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Watermark Security Text</label>
                <input
                  type="text"
                  value={formData.watermarkText}
                  onChange={e => setFormData(prev => ({ ...prev, watermarkText: e.target.value }))}
                  placeholder="e.g. CONFIDENTIAL"
                  className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-mono uppercase bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Letterhead Layout Template</label>
                <select
                  value={formData.letterheadTemplate || 'Default Standard'}
                  onChange={e => setFormData(prev => ({ ...prev, letterheadTemplate: e.target.value as any }))}
                  className="w-full px-2.5 py-1.5 border rounded-lg text-xs bg-white dark:bg-slate-900 font-medium"
                >
                  <option value="Default Standard">Default Standard (Corporate Banner)</option>
                  <option value="Modern Minimalist">Modern Minimalist</option>
                  <option value="Executive Classic">Executive Classic</option>
                  <option value="Bilingual English/Arabic">Bilingual English/Arabic</option>
                  <option value="Centered Official">Centered Official</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Header Tagline</label>
                <input
                  type="text"
                  value={formData.headerTagline}
                  onChange={e => setFormData(prev => ({ ...prev, headerTagline: e.target.value }))}
                  placeholder="Enterprise Commercial Solutions"
                  className="w-full px-2.5 py-1.5 border rounded-lg text-xs bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Footer Bank / Wire Details</label>
                <input
                  type="text"
                  value={formData.footerBankDetails}
                  onChange={e => setFormData(prev => ({ ...prev, footerBankDetails: e.target.value }))}
                  placeholder="Bank Muscat SAOG • IBAN: OM02BMUS..."
                  className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-mono bg-white dark:bg-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Paid-up Capital</label>
              <input
                type="number"
                value={formData.capitalPaidUp}
                onChange={e => setFormData(prev => ({ ...prev, capitalPaidUp: Number(e.target.value) }))}
                className="w-full px-3 py-2 border rounded-lg text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Managing Director</label>
              <input
                type="text"
                value={formData.managingDirectorName}
                onChange={e => setFormData(prev => ({ ...prev, managingDirectorName: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Change Reason / Resolution Reference <span className="text-rose-500 dark:text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={editReason}
              onChange={e => setEditReason(e.target.value)}
              placeholder="e.g. Board Resolution #2026/04 branding & letterhead template revision"
              className="w-full px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 border rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEditCompany}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
            >
              Save Changes & Log Audit
            </button>
          </div>
        </div>
      </FormModal>

      {/* Board Approval Modal */}
      <FormModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        title="Statutory Board & Governance Approval (01.01.01)"
        subtitle={`Approve legal entity registration for ${activeCompany?.legalName}`}
        size="md"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-lg text-emerald-900 dark:text-emerald-100 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Segregation of Duties (SoD) Verified</span>
            </div>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
              Submitted by <strong>{activeCompany?.submittedBy || 'Corporate Secretariat'}</strong> on {activeCompany?.submittedAt || 'Today'}. You are approving as Independent Compliance / Financial Officer.
            </p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Approval Comments</label>
            <textarea
              rows={3}
              value={approvalComments}
              onChange={e => setApprovalComments(e.target.value)}
              placeholder="Commercial registration verified with MOCIIP and VAT certificate active."
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setIsApprovalModalOpen(false)}
              className="px-4 py-2 border rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!activeCompany) return;
                const res = approveCompany(
                  activeCompany.id,
                  { id: 'usr-cfo', name: 'Tariq Al-Balushi (CFO)', role: 'Chief Financial Officer' },
                  approvalComments
                );
                if (res.success) {
                  setIsApprovalModalOpen(false);
                } else if (res.error) {
                  notify(res.error);
                }
              }}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
            >
              Approve & Activate Entity
            </button>
          </div>
        </div>
      </FormModal>

      {/* Reject Modal */}
      <FormModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Return Submission to Draft"
        subtitle={`Provide feedback for returning ${activeCompany?.legalName}`}
        size="md"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Rejection / Feedback Reason <span className="text-rose-500 dark:text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              placeholder="e.g. Commercial registration expiry date requires renewal before activation."
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setIsRejectModalOpen(false)}
              className="px-4 py-2 border rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!activeCompany) return;
                const res = rejectCompany(
                  activeCompany.id,
                  { id: 'usr-cfo', name: 'Tariq Al-Balushi (CFO)', role: 'Chief Financial Officer' },
                  rejectionReason
                );
                if (res.success) {
                  setIsRejectModalOpen(false);
                  setRejectionReason('');
                }
              }}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
            >
              Return to Draft
            </button>
          </div>
        </div>
      </FormModal>

      {/* Upload Filing Document Modal */}
      <FormModal
        isOpen={isAttachmentModalOpen}
        onClose={() => setIsAttachmentModalOpen(false)}
        title="Upload Regulatory / Statutory Document"
        subtitle={`Attach official filing to ${activeCompany?.legalName}`}
        size="md"
      >
        <form onSubmit={handleAddAttachment} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Document Name / File</label>
            <input
              type="text"
              required
              value={attachmentForm.name}
              onChange={e => setAttachmentForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. MOCIIP_Commercial_Registration_2026.pdf"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <select
                value={attachmentForm.category}
                onChange={e => setAttachmentForm(prev => ({ ...prev, category: e.target.value as any }))}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900"
              >
                <option value="Commercial Registration (CR)">Commercial Registration (CR)</option>
                <option value="Tax / VAT Certificate">Tax / VAT Certificate</option>
                <option value="Chamber of Commerce">Chamber of Commerce</option>
                <option value="Municipality Permit">Municipality Permit</option>
                <option value="Articles of Association">Articles of Association</option>
                <option value="Audited Financials">Audited Financials</option>
                <option value="Board Resolution">Board Resolution</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Document / Serial #</label>
              <input
                type="text"
                value={attachmentForm.documentNumber}
                onChange={e => setAttachmentForm(prev => ({ ...prev, documentNumber: e.target.value }))}
                placeholder="CR-1092834"
                className="w-full px-3 py-2 border rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-center bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
            <Upload className="w-6 h-6 mx-auto mb-1 text-slate-500 dark:text-slate-400" />
            <div className="font-semibold">Drag and drop regulatory PDF or scan here</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Supports PDF, PNG, TIFF up to 25MB</div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setIsAttachmentModalOpen(false)}
              className="px-4 py-2 border rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
            >
              Attach Document
            </button>
          </div>
        </form>
      </FormModal>

      {/* Enterprise Group & Holding Hierarchy Studio Modal */}
      {isHierarchyStudioOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-7xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold">
                  <GitFork className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-semibold border border-purple-200">
                      01.01.06
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Group & Holding Multi-Tier Hierarchy Studio
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configure apex holding groups, equity holdings, consolidation rules, and multi-entity organograms
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsHierarchyStudioOpen(false)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Close Studio
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <GroupHoldingManagementView />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
