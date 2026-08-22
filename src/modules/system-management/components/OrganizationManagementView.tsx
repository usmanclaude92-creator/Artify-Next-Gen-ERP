import React, { useState } from 'react';
import {
  Building2,
  GitFork,
  MapPin,
  Layers,
  ShieldCheck,
  Plus,
  Edit2,
  Archive,
  ChevronRight,
  TrendingUp,
  Globe2,
  CheckCircle2,
  Building,
  Landmark,
  Compass
} from 'lucide-react';
import { useSystemManagement } from '../services/systemManagementStore';
import { DataTable, ColumnDef } from './common/DataTable';
import { StatusBadge } from './common/StatusBadge';
import { MetricCard } from './common/MetricCard';
import { FormModal } from './common/FormModal';
import { GroupHoldingManagementView } from './GroupHoldingManagementView';
import { CompanySetupManagementView } from './CompanySetupManagementView';
import { Company, Branch, Department, Location, OperatingUnit } from '../types';

export const OrganizationManagementView: React.FC<{ activeTab?: string }> = ({ activeTab: initialTab = 'groups' }) => {
  const {
    companies,
    groups,
    companyGroup,
    branches,
    departments,
    locations,
    operatingUnits,
    addCompany,
    updateCompany,
    archiveCompany,
    addBranch,
    updateBranch,
    addDepartment,
    updateDepartment,
    addLocation,
    updateLocation,
    addOperatingUnit,
    updateOperatingUnit
  } = useSystemManagement();

  const [activeTab, setActiveTab] = useState<'groups' | 'companies' | 'hierarchy' | 'branches' | 'departments' | 'locations' | 'operating-units'>(
    (initialTab as any) || 'groups'
  );

  // Modal states
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  // Form states for company
  const [companyForm, setCompanyForm] = useState({
    code: '',
    legalName: '',
    tradeName: '',
    registrationNumber: '',
    taxNumber: '',
    country: 'Oman',
    currency: 'OMR',
    fiscalYearStartMonth: 1,
    parentEntityId: 'group-1',
    status: 'Active' as const,
    address: '',
    phone: '',
    email: '',
    industrySegment: 'Conglomerate'
  });

  // Form state for branch
  const [branchForm, setBranchForm] = useState({
    companyId: 'comp-1',
    companyName: 'Artify Group Holdings SAOC',
    code: '',
    name: '',
    type: 'Commercial Office' as const,
    city: 'Muscat',
    country: 'Oman',
    managerName: '',
    status: 'Active' as const,
    costCenterCode: 'CC-BR-01'
  });

  // Form state for department
  const [deptForm, setDeptForm] = useState({
    companyId: 'comp-1',
    code: '',
    name: '',
    headOfDepartment: '',
    costCenterCode: '',
    parentDeptId: '',
    status: 'Active' as const
  });

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyForm.code || !companyForm.legalName) return;
    addCompany({
      ...companyForm,
      isHolding: false
    });
    setIsCompanyModalOpen(false);
    setCompanyForm({
      code: '',
      legalName: '',
      tradeName: '',
      registrationNumber: '',
      taxNumber: '',
      country: 'Oman',
      currency: 'OMR',
      fiscalYearStartMonth: 1,
      parentEntityId: 'group-1',
      status: 'Active',
      address: '',
      phone: '',
      email: '',
      industrySegment: 'Conglomerate'
    });
  };

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchForm.code || !branchForm.name) return;
    const selectedComp = companies.find(c => c.id === branchForm.companyId);
    addBranch({
      ...branchForm,
      companyName: selectedComp ? selectedComp.legalName : branchForm.companyName
    });
    setIsBranchModalOpen(false);
  };

  const handleCreateDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptForm.code || !deptForm.name) return;
    addDepartment(deptForm);
    setIsDeptModalOpen(false);
  };

  // Company Columns
  const companyColumns: ColumnDef<Company>[] = [
    {
      key: 'code',
      header: 'Code',
      accessor: item => <span className="font-mono font-bold text-indigo-700">{item.code}</span>
    },
    {
      key: 'legalName',
      header: 'Legal Entity Name',
      accessor: item => (
        <div>
          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
            {item.legalName}
            {item.isParent && (
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-100 text-purple-700 font-bold">
                Holding Parent
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-500">{item.tradingName || item.companyType}</div>
        </div>
      )
    },
    {
      key: 'country',
      header: 'Jurisdiction & Currency',
      accessor: item => (
        <div className="flex items-center gap-1.5">
          <Globe2 className="w-3.5 h-3.5 text-slate-400" />
          <span>
            {item.country} (<strong className="text-slate-800">{item.currency}</strong>)
          </span>
        </div>
      )
    },
    {
      key: 'taxNumber',
      header: 'Tax / CR Number',
      accessor: item => (
        <div className="font-mono text-slate-600">
          <div>VAT: {item.taxNumber}</div>
          <div className="text-[10px] text-slate-400">CR: {item.registrationNumber}</div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      accessor: item => <StatusBadge status={item.status} />
    }
  ];

  // Branch Columns
  const branchColumns: ColumnDef<Branch>[] = [
    {
      key: 'code',
      header: 'Branch Code',
      accessor: item => <span className="font-mono font-bold text-indigo-700">{item.code}</span>
    },
    {
      key: 'name',
      header: 'Branch Name',
      accessor: item => (
        <div>
          <div className="font-semibold text-slate-900">{item.name}</div>
          <div className="text-[11px] text-slate-500">{item.companyName}</div>
        </div>
      )
    },
    {
      key: 'isTaxBranch',
      header: 'Branch Classification',
      accessor: item => (
        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
          {item.isTaxBranch ? 'Tax & Operational' : 'Operational Branch'}
        </span>
      )
    },
    {
      key: 'address',
      header: 'Location / Address',
      accessor: item => (
        <div className="flex items-center gap-1 text-slate-600">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span>{item.address}</span>
        </div>
      )
    },
    {
      key: 'manager',
      header: 'Branch Head',
      accessor: item => <span className="text-slate-700 font-medium">{item.manager || '—'}</span>
    },
    {
      key: 'status',
      header: 'Status',
      accessor: item => <StatusBadge status={item.status} />
    }
  ];

  // Department Columns
  const deptColumns: ColumnDef<Department>[] = [
    {
      key: 'code',
      header: 'Dept Code',
      accessor: item => <span className="font-mono font-bold text-indigo-700">{item.code}</span>
    },
    {
      key: 'name',
      header: 'Department Name',
      accessor: item => <span className="font-semibold text-slate-900">{item.name}</span>
    },
    {
      key: 'costCenterCode',
      header: 'Cost Center',
      accessor: item => (
        <span className="font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
          {item.costCenterCode}
        </span>
      )
    },
    {
      key: 'departmentHead',
      header: 'Department Head',
      accessor: item => <span className="text-slate-700 font-medium">{item.departmentHead || 'Unassigned'}</span>
    },
    {
      key: 'status',
      header: 'Status',
      accessor: item => <StatusBadge status={item.status} />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Legal Entities"
          value={companies.length}
          change="+1 YTD"
          isPositive={true}
          description="Multi-Company Group"
          icon={<Building2 className="w-5 h-5" />}
        />
        <MetricCard
          label="Operational Branches"
          value={branches.length}
          status="positive"
          description="Across 3 GCC Jurisdictions"
          icon={<Building className="w-5 h-5" />}
        />
        <MetricCard
          label="Active Cost Centers"
          value={departments.length}
          status="neutral"
          description="Departmental Segments"
          icon={<Layers className="w-5 h-5" />}
        />
        <MetricCard
          label="Operating Units (P&L)"
          value={operatingUnits.length}
          status="positive"
          description="Segmental Financial Reporting"
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('groups')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'groups'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <GitFork className="w-4 h-4" />
          <span>Corporate Groups & Holding ({groups.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('companies')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'companies'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Legal Entities Master ({companies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('branches')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'branches'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Branches ({branches.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('departments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'departments'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Cost Center Departments ({departments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('operating-units')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'operating-units'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Operating Units & P&L</span>
        </button>

        <button
          onClick={() => setActiveTab('hierarchy')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'hierarchy'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Entity-Branch Network Map</span>
        </button>
      </div>

      {/* Tab 0: Corporate Groups & Holding Master Setup (01.01.02) */}
      {activeTab === 'groups' && <GroupHoldingManagementView />}

      {/* Tab 1: 01.01.01 Company Setup & Legal Entity Master */}
      {activeTab === 'companies' && <CompanySetupManagementView />}

      {/* Tab 2: Hierarchy Tree */}
      {activeTab === 'hierarchy' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Landmark className="w-5 h-5 text-indigo-600" />
                <span>{companyGroup.name}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
                  {companyGroup.code}
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Consolidated Group Currency: <strong>{companyGroup.currency}</strong> • Holding Entity ID:{' '}
                {companyGroup.holdingCompanyId}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-semibold">
                Multi-Branch & Multi-GAAP Ready
              </span>
            </div>
          </div>

          {/* Interactive Hierarchy Chart */}
          <div className="space-y-6">
            {companies.map(company => (
              <div
                key={company.id}
                className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-slate-50 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                      {company.code.substring(0, 3)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{company.legalName}</h4>
                        <StatusBadge status={company.status} size="sm" />
                      </div>
                      <p className="text-xs text-slate-500">
                        {company.country} • Currency: <strong>{company.currency}</strong> • Tax ID:{' '}
                        <span className="font-mono">{company.taxNumber}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600">
                    <span className="font-semibold">{branches.filter(b => b.companyId === company.id).length}</span> Branches •{' '}
                    <span className="font-semibold">{departments.filter(d => d.companyId === company.id).length}</span> Departments
                  </div>
                </div>

                {/* Sub-branches for this company */}
                <div className="mt-4 pl-4 sm:pl-8 border-l-2 border-indigo-200 space-y-3">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Associated Operating Branches
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {branches
                      .filter(b => b.companyId === company.id)
                      .map(branch => (
                        <div
                          key={branch.id}
                          className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs hover:border-indigo-300 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-semibold text-slate-800 text-xs">{branch.name}</div>
                              <div className="text-[11px] text-slate-500 font-mono mt-0.5">{branch.code}</div>
                            </div>
                            <StatusBadge status={branch.status} size="sm" />
                          </div>
                          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                            <span>{branch.address}</span>
                            <span className="font-medium text-slate-700">{branch.isTaxBranch ? 'Tax Branch' : 'Standard'}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Branches */}
      {activeTab === 'branches' && (
        <DataTable
          title="Operational Branch Network"
          subtitle="Physical sites, commercial warehouses, regional sales offices, and manufacturing plants"
          data={branches}
          columns={branchColumns}
          keyExtractor={item => item.id}
          onAddClick={() => setIsBranchModalOpen(true)}
          addLabel="Add Branch Site"
          searchPlaceholder="Search branch code, name, city, company..."
          exportFileName="artify-branch-network"
          filterOptions={[
            {
              key: 'status',
              label: 'Branch Status',
              options: [
                { value: 'Active', label: 'Active Sites' },
                { value: 'Inactive', label: 'Inactive Sites' }
              ],
              filterFn: (item, val) => item.status === val
            }
          ]}
        />
      )}

      {/* Tab 4: Departments */}
      {activeTab === 'departments' && (
        <DataTable
          title="Departmental Cost Center Registry"
          subtitle="Managerial accountability cost centers mapped to general ledger segmentation"
          data={departments}
          columns={deptColumns}
          keyExtractor={item => item.id}
          onAddClick={() => setIsDeptModalOpen(true)}
          addLabel="Add Department"
          searchPlaceholder="Search department code, cost center, head..."
          exportFileName="artify-departments"
        />
      )}

      {/* Tab 5: Operating Units */}
      {activeTab === 'operating-units' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="border-b border-slate-200 pb-4 mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Profit & Loss Operating Units</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Segment reporting units with autonomous balance sheet and income statement tracking
              </p>
            </div>
            <button
              onClick={() => {
                addOperatingUnit({
                  code: `OU-${operatingUnits.length + 1}`,
                  name: 'New Strategic Business Unit',
                  type: 'Profit Center',
                  manager: 'General Manager',
                  status: 'Active'
                });
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Business Unit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {operatingUnits.map(ou => (
              <div
                key={ou.id}
                className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-white transition-all shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-indigo-700">{ou.code}</span>
                      <h4 className="font-bold text-slate-900 text-sm mt-0.5">{ou.name}</h4>
                    </div>
                    <StatusBadge status={ou.status} />
                  </div>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Classification:</span>
                      <span className="font-semibold text-slate-800">{ou.type}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Business Head:</span>
                      <span className="font-semibold text-slate-800">{ou.manager}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Segregated Reporting
                  </span>
                  <button
                    onClick={() =>
                      updateOperatingUnit(ou.id, {
                        status: ou.status === 'Active' ? 'Inactive' : 'Active'
                      })
                    }
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                  >
                    Toggle Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Create Company */}
      <FormModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        title="Register Legal Entity"
        subtitle="Establish a distinct legal company with statutory registration, currency, and tax IDs"
        onSubmit={handleCreateCompany}
        submitLabel="Register Company"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Company Code *</label>
            <input
              type="text"
              required
              value={companyForm.code}
              onChange={e => setCompanyForm({ ...companyForm, code: e.target.value.toUpperCase() })}
              placeholder="e.g. ARTIFY-LOG"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Industry Segment</label>
            <input
              type="text"
              value={companyForm.industrySegment}
              onChange={e => setCompanyForm({ ...companyForm, industrySegment: e.target.value })}
              placeholder="e.g. Manufacturing & Distribution"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-700 font-semibold mb-1">Legal Entity Name *</label>
            <input
              type="text"
              required
              value={companyForm.legalName}
              onChange={e => setCompanyForm({ ...companyForm, legalName: e.target.value })}
              placeholder="e.g. Artify Logistics & Supply Chain SAOC"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Jurisdiction / Country *</label>
            <select
              value={companyForm.country}
              onChange={e => {
                const c = e.target.value;
                let cur = 'OMR';
                if (c === 'United Arab Emirates') cur = 'AED';
                if (c === 'Saudi Arabia') cur = 'SAR';
                if (c === 'Qatar') cur = 'QAR';
                if (c === 'Kuwait') cur = 'KWD';
                setCompanyForm({ ...companyForm, country: c, currency: cur });
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Oman">Oman</option>
              <option value="United Arab Emirates">United Arab Emirates</option>
              <option value="Saudi Arabia">Saudi Arabia</option>
              <option value="Qatar">Qatar</option>
              <option value="Kuwait">Kuwait</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="United States">United States</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Functional Currency</label>
            <input
              type="text"
              value={companyForm.currency}
              onChange={e => setCompanyForm({ ...companyForm, currency: e.target.value.toUpperCase() })}
              placeholder="OMR, AED, USD..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Commercial Registration (CR)</label>
            <input
              type="text"
              value={companyForm.registrationNumber}
              onChange={e => setCompanyForm({ ...companyForm, registrationNumber: e.target.value })}
              placeholder="e.g. CR-1049281"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Tax / VAT Identification Number</label>
            <input
              type="text"
              value={companyForm.taxNumber}
              onChange={e => setCompanyForm({ ...companyForm, taxNumber: e.target.value })}
              placeholder="e.g. OM1100984920"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-700 font-semibold mb-1">Registered HQ Address</label>
            <input
              type="text"
              value={companyForm.address}
              onChange={e => setCompanyForm({ ...companyForm, address: e.target.value })}
              placeholder="Building, Street, City, P.O. Box"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </FormModal>

      {/* Modal: Create Branch */}
      <FormModal
        isOpen={isBranchModalOpen}
        onClose={() => setIsBranchModalOpen(false)}
        title="Add Operational Branch"
        subtitle="Provision a physical site or operational branch under a parent legal entity"
        onSubmit={handleCreateBranch}
        submitLabel="Create Branch"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-slate-700 font-semibold mb-1">Parent Company *</label>
            <select
              value={branchForm.companyId}
              onChange={e => setBranchForm({ ...branchForm, companyId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
            >
              {companies.map(c => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.legalName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Branch Code *</label>
            <input
              type="text"
              required
              value={branchForm.code}
              onChange={e => setBranchForm({ ...branchForm, code: e.target.value.toUpperCase() })}
              placeholder="e.g. BR-OM-SOHAR"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Branch Name *</label>
            <input
              type="text"
              required
              value={branchForm.name}
              onChange={e => setBranchForm({ ...branchForm, name: e.target.value })}
              placeholder="e.g. Sohar Industrial Distribution Hub"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Site Classification</label>
            <select
              value={branchForm.type}
              onChange={e => setBranchForm({ ...branchForm, type: e.target.value as any })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Commercial Office">Commercial Office</option>
              <option value="Warehouse & Logistics">Warehouse & Logistics</option>
              <option value="Sales Showroom">Sales Showroom</option>
              <option value="Manufacturing Plant">Manufacturing Plant</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">City & Country</label>
            <input
              type="text"
              value={branchForm.city}
              onChange={e => setBranchForm({ ...branchForm, city: e.target.value })}
              placeholder="e.g. Sohar"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Branch Manager</label>
            <input
              type="text"
              value={branchForm.managerName}
              onChange={e => setBranchForm({ ...branchForm, managerName: e.target.value })}
              placeholder="e.g. Tariq Al-Habsi"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Default Cost Center</label>
            <input
              type="text"
              value={branchForm.costCenterCode}
              onChange={e => setBranchForm({ ...branchForm, costCenterCode: e.target.value })}
              placeholder="e.g. CC-BR-SOHAR"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </FormModal>

      {/* Modal: Create Department */}
      <FormModal
        isOpen={isDeptModalOpen}
        onClose={() => setIsDeptModalOpen(false)}
        title="Add Department Cost Center"
        subtitle="Define an operational unit for budget allocation and expense tracking"
        onSubmit={handleCreateDept}
        submitLabel="Save Department"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-slate-700 font-semibold mb-1">Parent Company</label>
            <select
              value={deptForm.companyId}
              onChange={e => setDeptForm({ ...deptForm, companyId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            >
              {companies.map(c => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.legalName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Department Code *</label>
            <input
              type="text"
              required
              value={deptForm.code}
              onChange={e => setDeptForm({ ...deptForm, code: e.target.value.toUpperCase() })}
              placeholder="e.g. DEPT-ENG"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Department Name *</label>
            <input
              type="text"
              required
              value={deptForm.name}
              onChange={e => setDeptForm({ ...deptForm, name: e.target.value })}
              placeholder="e.g. Engineering & Maintenance"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Cost Center Code *</label>
            <input
              type="text"
              required
              value={deptForm.costCenterCode}
              onChange={e => setDeptForm({ ...deptForm, costCenterCode: e.target.value.toUpperCase() })}
              placeholder="e.g. CC-7010"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Head of Department</label>
            <input
              type="text"
              value={deptForm.headOfDepartment}
              onChange={e => setDeptForm({ ...deptForm, headOfDepartment: e.target.value })}
              placeholder="e.g. Johnathan Miller"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>
        </div>
      </FormModal>
    </div>
  );
};
