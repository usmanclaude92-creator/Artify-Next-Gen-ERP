// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 09: HUMAN RESOURCES (HR)
// 09.01: Employee Management View
// (Employee Master, Documents Vault, Org Chart, Contracts)
// ==========================================

import React, { useState } from 'react';
import { useHrStore } from '../../services/hrStore';
import { Employee, EmployeeDocument, EmployeeContract } from '../../types';
import { ERPRouteState } from '../../../../types/erp';
import {
  Users,
  FileText,
  Network,
  Scroll,
  Search,
  Plus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Calendar,
  Building,
  Mail,
  Phone,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Download,
  Upload,
  User,
  ChevronDown,
  X,
  CreditCard,
  Briefcase
} from 'lucide-react';
import { notify } from '@/src/components/common/Feedback';
import { mockRandom } from '@/src/utils/mockRandom';

interface EmployeeManagementViewProps {
  initialTab?: 'master' | 'docs' | 'orgchart' | 'contracts';
  onNavigate: (route: ERPRouteState) => void;
}

export const EmployeeManagementView: React.FC<EmployeeManagementViewProps> = ({
  initialTab = 'master',
  onNavigate
}) => {
  const {
    employees,
    documents,
    contracts,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addDocument,
    addContract
  } = useHrStore();

  const [activeTab, setActiveTab] = useState<'master' | 'docs' | 'orgchart' | 'contracts'>(initialTab);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);

  // Form State for New Employee
  const [newEmpForm, setNewEmpForm] = useState({
    firstName: '',
    lastName: '',
    fullName: '',
    email: '',
    phone: '',
    gender: 'MALE' as const,
    dateOfBirth: '1990-01-01',
    nationality: 'Emirati',
    maritalStatus: 'MARRIED' as const,
    department: 'Manufacturing & Engineering',
    departmentId: 'dept-mfg',
    designation: '',
    jobGrade: 'G3',
    employmentType: 'FULL_TIME' as const,
    status: 'ACTIVE' as const,
    joinDate: new Date().toISOString().split('T')[0],
    branch: 'Dubai Corporate HQ',
    workLocation: 'HQ Level 14',
    costCenter: 'CC-1000-GEN',
    basicSalary: 20000,
    totalCompensation: 28000,
    currency: 'AED',
    bankName: 'First Abu Dhabi Bank (FAB)',
    bankAccountNumber: '1234567890',
    iban: 'AE44033000001234567890',
    emergencyContactName: '',
    emergencyContactRelation: 'Spouse',
    emergencyContactPhone: ''
  });

  // Filtered employees
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch =
      emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'ALL' || emp.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const departments = Array.from(new Set(employees.map(e => e.department)));

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${newEmpForm.firstName} ${newEmpForm.lastName}`.trim();
    addEmployee({
      ...newEmpForm,
      fullName: fullName || newEmpForm.firstName
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Navigation Sub-Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('master')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'master'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Employee Master ({employees.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'docs'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Document Vault ({documents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orgchart')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'orgchart'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>Organization Hierarchy</span>
          </button>

          <button
            onClick={() => setActiveTab('contracts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'contracts'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Scroll className="w-4 h-4" />
            <span>Employment Contracts ({contracts.length})</span>
          </button>
        </div>

        {activeTab === 'master' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-rose-600/20 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Employee Record</span>
          </button>
        )}
      </div>

      {/* TAB 1: EMPLOYEE MASTER DIRECTORY */}
      {activeTab === 'master' && (
        <div className="space-y-4">
          {/* Filter / Search Toolbar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by employee name, code, designation, or email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 transition-all"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Filter className="w-4 h-4 text-slate-400" />
                <span>Department:</span>
              </div>
              <select
                value={departmentFilter}
                onChange={e => setDepartmentFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                <option value="ALL">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Employee Directory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmployees.map(emp => (
              <div
                key={emp.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all hover:shadow-lg flex flex-col justify-between"
              >
                <div>
                  {/* Card Header: Avatar, Name, Code */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={emp.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                        alt={emp.fullName}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-white tracking-tight">{emp.fullName}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                            {emp.employeeCode}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">{emp.jobGrade}</span>
                        </div>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      emp.status === 'ACTIVE'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : emp.status === 'PROBATION'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                    }`}>
                      {emp.status}
                    </span>
                  </div>

                  {/* Role & Department */}
                  <div className="mt-3.5 space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-center gap-2 text-slate-200 font-semibold">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{emp.designation}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{emp.department}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{emp.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{emp.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Metadata & Actions */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="text-slate-400">
                    <span>Leave: <strong className="text-slate-200">{emp.leaveBalanceDays}d</strong></span>
                    <span className="mx-1.5">•</span>
                    <span>Comp: <strong className="text-rose-400">{(emp.totalCompensation).toLocaleString()} {emp.currency}</strong></span>
                  </div>

                  <button
                    onClick={() => setSelectedEmployee(emp)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium transition-all flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Dossier</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: DIGITAL DOCUMENT VAULT */}
      {activeTab === 'docs' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-rose-400" />
                  Employee Compliance & Document Vault
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Passports, Residence Visas, Labor Cards, Educational Certificates, and Expiry Reminders.
                </p>
              </div>

              <button
                onClick={() => setShowDocModal(true)}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Document</span>
              </button>
            </div>

            {/* Document Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">Document Title</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Doc Number</th>
                    <th className="py-3 px-3">Issuing Authority</th>
                    <th className="py-3 px-3">Expiry Date</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {documents.map(doc => {
                    const emp = employees.find(e => e.id === doc.employeeId);
                    return (
                      <tr key={doc.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-semibold text-white">{doc.title}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Belongs to: <span className="text-rose-400 font-medium">{emp?.fullName || doc.employeeId}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                            {doc.documentType}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-200">{doc.documentNumber}</td>
                        <td className="py-3 px-3 text-slate-400">{doc.issuingAuthority}</td>
                        <td className="py-3 px-3 font-semibold text-slate-200">{doc.expiryDate}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            doc.status === 'VALID'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : doc.status === 'EXPIRING_SOON'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            {doc.status}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <button
                            onClick={() => notify(`Simulating download of ${doc.fileName} (${doc.fileSize})`)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                            title="Download PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ORGANIZATION HIERARCHY CHART */}
      {activeTab === 'orgchart' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Network className="w-5 h-5 text-rose-400" />
              Interactive Organizational Hierarchy & Reporting Lines
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Visual governance structure mapping corporate executive management down to functional leads and specialists.
            </p>
          </div>

          {/* Visual Org Tree Node Demo */}
          <div className="flex flex-col items-center justify-center space-y-8 py-4">
            {/* Level 1: CEO / Executive */}
            <div className="bg-slate-800 border-2 border-rose-500 rounded-2xl p-4 text-center w-72 shadow-lg shadow-rose-500/10">
              <div className="w-14 h-14 rounded-full mx-auto mb-2 overflow-hidden border-2 border-rose-400">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                  alt="CEO"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="font-bold text-white text-sm">Tariq Al-Hashimi</div>
              <div className="text-xs text-rose-400 font-semibold">Chief Executive Officer (CEO)</div>
              <div className="text-[10px] text-slate-400 mt-1">Executive Board of Directors</div>
            </div>

            {/* Connecting Vertical Line */}
            <div className="w-0.5 h-6 bg-slate-700"></div>

            {/* Level 2: C-Suite (COO, CFO, VP Tech) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
              {/* COO */}
              <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-2 overflow-hidden border border-slate-600">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                    alt="COO"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="font-bold text-white text-xs">Dr. Rashid Al-Mansoor</div>
                <div className="text-[11px] text-rose-400 font-medium">Chief Operating Officer</div>
                <div className="text-[10px] text-slate-400 mt-1">Direct Reports: 4 Department Heads</div>
              </div>

              {/* CFO */}
              <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-2 overflow-hidden border border-slate-600">
                  <img
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80"
                    alt="CFO"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="font-bold text-white text-xs">Sultan Al-Nuaimi</div>
                <div className="text-[11px] text-cyan-400 font-medium">Chief Financial Officer</div>
                <div className="text-[10px] text-slate-400 mt-1">Finance & Treasury</div>
              </div>

              {/* HR Director */}
              <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-2 overflow-hidden border border-slate-600">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
                    alt="HR Director"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="font-bold text-white text-xs">Elena Vostrikova</div>
                <div className="text-[11px] text-emerald-400 font-medium">Director of People Ops</div>
                <div className="text-[10px] text-slate-400 mt-1">Talent Acquisition & HR Admin</div>
              </div>
            </div>

            {/* Connecting Vertical Line */}
            <div className="w-0.5 h-6 bg-slate-700"></div>

            {/* Level 3: Department Operations */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
              {employees.slice(2, 6).map(emp => (
                <div key={emp.id} className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/80 text-center">
                  <div className="font-semibold text-white text-xs truncate">{emp.fullName}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{emp.designation}</div>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold bg-slate-700 text-slate-300">
                    {emp.department}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EMPLOYMENT CONTRACTS */}
      {activeTab === 'contracts' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Scroll className="w-5 h-5 text-rose-400" />
                Employment Contracts & Legal Terms Registry
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Manage Unlimited, Fixed-Term, Executive contracts, notice periods, and statutory renewals.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contracts.map(ctr => (
              <div key={ctr.id} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      {ctr.contractNumber}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1.5">{ctr.employeeName}</h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    ctr.status === 'ACTIVE'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {ctr.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Contract Type:</span>
                    <span className="font-semibold text-white">{ctr.contractType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Notice Period:</span>
                    <span className="font-semibold text-white">{ctr.noticePeriodDays} Days</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Basic Salary:</span>
                    <span className="font-semibold text-rose-400">{ctr.basicSalary.toLocaleString()} {ctr.currency}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Start Date:</span>
                    <span className="font-semibold text-white">{ctr.startDate}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">Signed: {ctr.signedDate}</span>
                  <button
                    onClick={() => notify(`Opening digital contract viewer for ${ctr.contractNumber}`)}
                    className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium transition-all"
                  >
                    View Terms
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DETAIL MODAL: EMPLOYEE DOSSIER */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedEmployee.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={selectedEmployee.fullName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-rose-500/40"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white tracking-tight">{selectedEmployee.fullName}</h2>
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      {selectedEmployee.employeeCode}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedEmployee.designation} • {selectedEmployee.department}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedEmployee(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dossier Tabs / Information Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Personal & Contact */}
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-800 space-y-2.5">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  Personal Information
                </h4>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Nationality:</span>
                    <span className="font-semibold text-white">{selectedEmployee.nationality}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Gender:</span>
                    <span className="font-semibold text-white">{selectedEmployee.gender}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Date of Birth:</span>
                    <span className="font-semibold text-white">{selectedEmployee.dateOfBirth}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Marital Status:</span>
                    <span className="font-semibold text-white">{selectedEmployee.maritalStatus}</span>
                  </div>
                </div>
              </div>

              {/* Employment & Grade */}
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-800 space-y-2.5">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  Employment Matrix
                </h4>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Job Grade:</span>
                    <span className="font-semibold text-white">{selectedEmployee.jobGrade}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Join Date:</span>
                    <span className="font-semibold text-white">{selectedEmployee.joinDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Cost Center:</span>
                    <span className="font-semibold text-white">{selectedEmployee.costCenter}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Location / Branch:</span>
                    <span className="font-semibold text-white">{selectedEmployee.branch}</span>
                  </div>
                </div>
              </div>

              {/* Compensation & Bank */}
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-800 space-y-2.5">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4" />
                  Compensation & Bank
                </h4>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Basic Salary:</span>
                    <span className="font-semibold text-white">{selectedEmployee.basicSalary.toLocaleString()} {selectedEmployee.currency}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Total Package:</span>
                    <span className="font-semibold text-emerald-400">{selectedEmployee.totalCompensation.toLocaleString()} {selectedEmployee.currency}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[11px]">Bank / IBAN:</span>
                    <span className="font-mono text-[11px] text-slate-200">{selectedEmployee.bankName} • {selectedEmployee.iban}</span>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-800 space-y-2.5">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Phone className="w-4 h-4" />
                  Emergency Contact
                </h4>
                <div className="space-y-1 text-slate-300">
                  <div className="font-semibold text-white">{selectedEmployee.emergencyContactName} ({selectedEmployee.emergencyContactRelation})</div>
                  <div className="text-slate-400">{selectedEmployee.emergencyContactPhone}</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedEmployee(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE EMPLOYEE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-rose-400" />
                Add New Employee Master Record
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={newEmpForm.firstName}
                    onChange={e => setNewEmpForm({ ...newEmpForm, firstName: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={newEmpForm.lastName}
                    onChange={e => setNewEmpForm({ ...newEmpForm, lastName: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Corporate Email *</label>
                  <input
                    type="email"
                    required
                    value={newEmpForm.email}
                    onChange={e => setNewEmpForm({ ...newEmpForm, email: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Mobile Phone *</label>
                  <input
                    type="text"
                    required
                    value={newEmpForm.phone}
                    onChange={e => setNewEmpForm({ ...newEmpForm, phone: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Department *</label>
                  <select
                    value={newEmpForm.department}
                    onChange={e => setNewEmpForm({ ...newEmpForm, department: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="Executive Management">Executive Management</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Manufacturing & Engineering">Manufacturing & Engineering</option>
                    <option value="Quality Assurance & EHS">Quality Assurance & EHS</option>
                    <option value="Supply Chain & Procurement">Supply Chain & Procurement</option>
                    <option value="Commercial Sales & CRM">Commercial Sales & CRM</option>
                    <option value="Finance & Treasury">Finance & Treasury</option>
                    <option value="Information Technology">Information Technology</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Designation / Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lead Process Engineer"
                    value={newEmpForm.designation}
                    onChange={e => setNewEmpForm({ ...newEmpForm, designation: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Job Grade *</label>
                  <select
                    value={newEmpForm.jobGrade}
                    onChange={e => setNewEmpForm({ ...newEmpForm, jobGrade: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="G1">G1 — Entry Operations</option>
                    <option value="G2">G2 — Technician / Junior</option>
                    <option value="G3">G3 — Senior Specialist / Engineer</option>
                    <option value="G4">G4 — Lead / Manager</option>
                    <option value="G5">G5 — Director / Chief Engineer</option>
                    <option value="EXEC">EXEC — C-Suite Executive</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Basic Monthly Salary (AED) *</label>
                  <input
                    type="number"
                    required
                    value={newEmpForm.basicSalary}
                    onChange={e => setNewEmpForm({ ...newEmpForm, basicSalary: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30"
                >
                  Save Employee Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPLOAD DOCUMENT MODAL */}
      {showDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-rose-400" />
                Upload Employee Document
              </h3>
              <button onClick={() => setShowDocModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addDocument({
                  employeeId: employees[0]?.id || 'EMP-00101',
                  documentType: 'PASSPORT',
                  documentNumber: 'P-' + Math.floor(100000 + mockRandom() * 900000),
                  title: 'National Passport Renewal Scan',
                  issuingAuthority: 'Immigration & Civil Registry',
                  issueDate: new Date().toISOString().split('T')[0],
                  expiryDate: '2031-12-31',
                  status: 'VALID',
                  fileName: 'passport_scan_verified.pdf',
                  fileSize: '1.8 MB',
                  verifiedBy: 'Elena Vostrikova',
                  verifiedAt: new Date().toISOString().split('T')[0]
                });
                setShowDocModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="text-slate-400 block mb-1">Select Employee</label>
                <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white">
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.fullName} ({e.employeeCode})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Document Category</label>
                <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white">
                  <option value="PASSPORT">Passport</option>
                  <option value="VISA_WORK_PERMIT">Residence Visa / Work Permit</option>
                  <option value="LABOR_CARD">National Labor Card</option>
                  <option value="EDUCATION_DEGREE">Degree & University Attestation</option>
                  <option value="MEDICAL_FITNESS">Medical Fitness Clearance</option>
                </select>
              </div>

              <div className="p-4 border-2 border-dashed border-slate-700 rounded-xl text-center text-slate-400 hover:border-rose-500 transition-colors cursor-pointer">
                <Upload className="w-6 h-6 mx-auto mb-1 text-slate-400" />
                <span className="text-xs">Drag and drop file here or click to browse</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowDocModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-rose-600 text-white font-bold"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
