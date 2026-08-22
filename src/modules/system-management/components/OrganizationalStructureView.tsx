import React, { useState } from 'react';
import {
  Layers,
  GitFork,
  Building2,
  Users,
  Plus,
  Search,
  Filter,
  Download,
  Edit2,
  Trash2,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Compass,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Building,
  Briefcase,
  X
} from 'lucide-react';
import { useSystemManagement } from '../services/systemManagementStore';
import { Department, OperatingUnit } from '../types';

interface OrganizationalStructureViewProps {
  initialTransactionId?: string;
  initialTransactionCode?: string;
}

export const OrganizationalStructureView: React.FC<OrganizationalStructureViewProps> = ({
  initialTransactionId,
  initialTransactionCode
}) => {
  const {
    companies = [],
    branches = [],
    departments = [],
    operatingUnits = [],
    addDepartment,
    updateDepartment,
    addOperatingUnit,
    updateOperatingUnit
  } = useSystemManagement();

  const [activeTab, setActiveTab] = useState<'departments' | 'divisions' | 'sections' | 'reporting-tree'>('departments');

  React.useEffect(() => {
    if (initialTransactionId === 'tx-dept-setup' || initialTransactionCode === '01.01.03.01') {
      setActiveTab('departments');
    } else if (initialTransactionId === 'tx-division-setup' || initialTransactionCode === '01.01.03.02') {
      setActiveTab('divisions');
    } else if (initialTransactionId === 'tx-section-setup' || initialTransactionCode === '01.01.03.03') {
      setActiveTab('sections');
    } else if (initialTransactionId === 'tx-reporting-structure' || initialTransactionCode === '01.01.03.04') {
      setActiveTab('reporting-tree');
    }
  }, [initialTransactionId, initialTransactionCode]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState('ALL');

  // Department Modal
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deptForm, setDeptForm] = useState({
    code: '',
    name: '',
    companyId: companies?.[0]?.id || 'comp-1',
    branchId: branches?.[0]?.id || 'br-1',
    departmentHead: '',
    costCenterCode: 'CC-101',
    employeeCount: 12,
    status: 'Active' as const
  });

  // Operating Unit / Division Modal
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<OperatingUnit | null>(null);
  const [unitForm, setUnitForm] = useState({
    code: '',
    name: '',
    companyId: companies[0]?.id || 'comp-1',
    branchId: branches[0]?.id || 'br-1',
    departmentId: departments[0]?.id || 'dept-1',
    locationId: 'loc-1',
    manager: '',
    unitType: 'Profit Center' as OperatingUnit['unitType'],
    status: 'Active' as const
  });

  const handleOpenNewDept = () => {
    setEditingDept(null);
    setDeptForm({
      code: `DEPT-${String(departments.length + 1).padStart(2, '0')}`,
      name: '',
      companyId: companies[0]?.id || 'comp-1',
      branchId: branches[0]?.id || 'br-1',
      departmentHead: '',
      costCenterCode: `CC-${String(departments.length + 101)}`,
      employeeCount: 8,
      status: 'Active'
    });
    setIsDeptModalOpen(true);
  };

  const handleEditDept = (dept: Department) => {
    setEditingDept(dept);
    setDeptForm({
      code: dept.code,
      name: dept.name,
      companyId: dept.companyId,
      branchId: dept.branchId,
      departmentHead: dept.departmentHead,
      costCenterCode: dept.costCenterCode,
      employeeCount: dept.employeeCount,
      status: dept.status
    });
    setIsDeptModalOpen(true);
  };

  const handleSaveDept = (e: React.FormEvent) => {
    e.preventDefault();
    const comp = companies.find(c => c.id === deptForm.companyId);
    const br = branches.find(b => b.id === deptForm.branchId);

    if (editingDept) {
      updateDepartment(editingDept.id, {
        ...deptForm,
        companyName: comp?.legalName || 'Unknown Company',
        branchName: br?.name || 'Unknown Branch'
      });
    } else {
      addDepartment({
        ...deptForm,
        companyName: comp?.legalName || 'Unknown Company',
        branchName: br?.name || 'Unknown Branch'
      });
    }
    setIsDeptModalOpen(false);
  };

  const handleOpenNewUnit = () => {
    setEditingUnit(null);
    setUnitForm({
      code: `OU-${String(operatingUnits.length + 1).padStart(2, '0')}`,
      name: '',
      companyId: companies[0]?.id || 'comp-1',
      branchId: branches[0]?.id || 'br-1',
      departmentId: departments[0]?.id || 'dept-1',
      locationId: 'loc-1',
      manager: '',
      unitType: 'Profit Center',
      status: 'Active'
    });
    setIsUnitModalOpen(true);
  };

  const handleSaveUnit = (e: React.FormEvent) => {
    e.preventDefault();
    const comp = companies.find(c => c.id === unitForm.companyId);
    if (editingUnit) {
      updateOperatingUnit(editingUnit.id, {
        ...unitForm,
        companyName: comp?.legalName || 'Unknown Company'
      });
    } else {
      addOperatingUnit({
        ...unitForm,
        companyName: comp?.legalName || 'Unknown Company'
      });
    }
    setIsUnitModalOpen(false);
  };

  const filteredDepts = departments.filter(d => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.departmentHead.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.costCenterCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCompany = selectedCompanyFilter === 'ALL' || d.companyId === selectedCompanyFilter;
    return matchesSearch && matchesCompany;
  });

  const filteredUnits = operatingUnits.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.manager.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCompany = selectedCompanyFilter === 'ALL' || u.companyId === selectedCompanyFilter;
    return matchesSearch && matchesCompany;
  });

  return (
    <div id="org-structure-view" className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
                  01.01.03
                </span>
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Organizational Structure
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
                  Hierarchy Active
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
                Manage business divisions, functional departments, operational sections, and hierarchical executive reporting lines.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {activeTab === 'departments' && (
              <button
                onClick={handleOpenNewDept}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Department</span>
              </button>
            )}
            {activeTab === 'divisions' && (
              <button
                onClick={handleOpenNewUnit}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Operating Division</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 mt-6 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('departments')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'departments'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>01.01.03.01 Department Setup ({departments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('divisions')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'divisions'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>01.01.03.02 Division Setup ({operatingUnits.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sections')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'sections'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>01.01.03.03 Section Setup</span>
          </button>

          <button
            onClick={() => setActiveTab('reporting-tree')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'reporting-tree'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <GitFork className="w-4 h-4" />
            <span>01.01.03.04 Reporting Structure (Organogram)</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search departments, cost centers, leaders..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Filter Entity:</span>
          <select
            value={selectedCompanyFilter}
            onChange={e => setSelectedCompanyFilter(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
          >
            <option value="ALL">All Legal Companies</option>
            {companies.map(c => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.legalName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tab 1: Departments */}
      {activeTab === 'departments' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Cost Center Departments Master</span>
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                ({filteredDepts.length} departments)
              </span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3">Dept Code & Name</th>
                  <th className="px-4 py-3">Cost Center Code</th>
                  <th className="px-4 py-3">Legal Company</th>
                  <th className="px-4 py-3">Operating Branch</th>
                  <th className="px-4 py-3">Head of Department</th>
                  <th className="px-4 py-3">Headcount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredDepts.map(dept => (
                  <tr
                    key={dept.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold font-mono text-xs">
                          {dept.code}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {dept.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                      {dept.costCenterCode}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-800 dark:text-slate-200">
                      {dept.companyName}
                    </td>
                    <td className="px-4 py-3.5 text-slate-700 dark:text-slate-300">
                      {dept.branchName}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-900 dark:text-slate-100">
                      {dept.departmentHead}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {dept.employeeCount} staff
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          dept.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {dept.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => handleEditDept(dept)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Divisions & Operating Units */}
      {activeTab === 'divisions' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Operating Divisions & Profit Centers (P&L Segments)</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {filteredUnits.map(unit => (
              <div
                key={unit.id}
                className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/40"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center font-mono font-bold text-sky-700 dark:text-sky-300 text-xs">
                      {unit.code}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                        {unit.name}
                      </h4>
                      <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                        {unit.unitType}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                    {unit.status}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Company:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{unit.companyName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Division Manager:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">{unit.manager}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Section Setup */}
      {activeTab === 'sections' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs p-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <span>Section Setup & Operational Sub-Teams</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Sub-department functional units, engineering discipline squads, and financial sub-sections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {departments.slice(0, 6).map((d, idx) => (
              <div
                key={d.id}
                className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/40"
              >
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-xs border-b border-slate-200 dark:border-slate-700 pb-2 mb-3">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>{d.name} ({d.code})</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-700/60">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      SEC-0{idx + 1}A: Core Operations Team
                    </span>
                    <span className="text-[10px] text-slate-500">Lead: {d.departmentHead}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-700/60">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      SEC-0{idx + 1}B: Compliance & Quality Cell
                    </span>
                    <span className="text-[10px] text-slate-500">4 Members</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Reporting Tree / Organogram */}
      {activeTab === 'reporting-tree' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs p-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <GitFork className="w-5 h-5 text-indigo-600" />
              <span>Hierarchical Executive Reporting Organogram</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Interactive multi-tier organization tree showing company leadership, division directors, and department heads.
            </p>
          </div>

          <div className="space-y-6">
            {companies.map(company => (
              <div
                key={company.id}
                className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-slate-50/50 dark:bg-slate-800/30"
              >
                {/* Level 1: Legal Entity Node */}
                <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-lg shadow-xs">
                  <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    {company.code.substring(0, 3)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {company.legalName}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Managing Director: <strong>{company.contactPerson || 'Executive Directorate'}</strong> • {company.country}
                    </p>
                  </div>
                </div>

                {/* Level 2: Branches & Cost Centers */}
                <div className="mt-4 ml-6 pl-4 border-l-2 border-dashed border-indigo-200 dark:border-indigo-800 space-y-3">
                  {branches
                    .filter(b => b.companyId === company.id)
                    .map(branch => (
                      <div key={branch.id} className="space-y-2">
                        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                          <Building className="w-4 h-4 text-sky-600" />
                          <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                            {branch.name} ({branch.code})
                          </span>
                          <span className="text-[11px] text-slate-500">
                            • Mgr: {branch.manager}
                          </span>
                        </div>

                        {/* Level 3: Department Nodes */}
                        <div className="ml-5 pl-4 border-l-2 border-dashed border-slate-300 dark:border-slate-700 space-y-1.5">
                          {departments
                            .filter(d => d.companyId === company.id)
                            .map(dept => (
                              <div
                                key={dept.id}
                                className="flex items-center justify-between text-xs bg-white dark:bg-slate-900 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-800"
                              >
                                <div className="flex items-center gap-2">
                                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                                    {dept.name}
                                  </span>
                                  <span className="font-mono text-[10px] text-slate-400">
                                    ({dept.costCenterCode})
                                  </span>
                                </div>
                                <span className="text-[11px] text-slate-500">
                                  Head: {dept.departmentHead}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Department Modal */}
      {isDeptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>{editingDept ? 'Edit Cost Center Department' : 'Create Department'}</span>
              </h3>
              <button
                onClick={() => setIsDeptModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDept} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Department Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={deptForm.code}
                    onChange={e => setDeptForm({ ...deptForm, code: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Cost Center Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={deptForm.costCenterCode}
                    onChange={e => setDeptForm({ ...deptForm, costCenterCode: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Department Name *
                </label>
                <input
                  type="text"
                  required
                  value={deptForm.name}
                  onChange={e => setDeptForm({ ...deptForm, name: e.target.value })}
                  placeholder="e.g. Treasury & Financial Control"
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Legal Company *
                  </label>
                  <select
                    value={deptForm.companyId}
                    onChange={e => setDeptForm({ ...deptForm, companyId: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
                  >
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.code} - {c.legalName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Head of Department
                  </label>
                  <input
                    type="text"
                    value={deptForm.departmentHead}
                    onChange={e => setDeptForm({ ...deptForm, departmentHead: e.target.value })}
                    placeholder="e.g. Zaid Al-Habsi"
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsDeptModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs cursor-pointer"
                >
                  {editingDept ? 'Update Department' : 'Save Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
