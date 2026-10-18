import React, { useState } from 'react';
import {
  Users,
  Shield,
  KeyRound,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  Plus,
  RotateCcw,
  UserCheck,
  ShieldAlert,
  Fingerprint,
  Clock,
  Globe
} from 'lucide-react';
import { useSystemManagement } from '../services/systemManagementStore';
import { DataTable, ColumnDef } from './common/DataTable';
import { StatusBadge } from './common/StatusBadge';
import { MetricCard } from './common/MetricCard';
import { FormModal } from './common/FormModal';
import { UserAccount, UserGroup, SoDRule, AccessRestriction } from '../types';

export const UserAccessManagementView: React.FC<{ activeTab?: string }> = ({ activeTab: initialTab = 'users' }) => {
  const {
    users,
    userGroups,
    sodRules,
    accessRestrictions,
    addUser,
    updateUser,
    toggleUserLock,
    resetUserPassword,
    addUserGroup,
    addSoDException,
    toggleSoDRule,
    addAccessRestriction
  } = useSystemManagement();

  const [activeTab, setActiveTab] = useState<'users' | 'groups' | 'sod' | 'restrictions'>(
    (initialTab as any) || 'users'
  );

  // Modals
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isExceptionModalOpen, setIsExceptionModalOpen] = useState(false);
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);

  // Form states
  const [userForm, setUserForm] = useState({
    username: '',
    fullName: '',
    email: '',
    roleId: 'role-ap-clerk',
    roleName: 'AP Accountant',
    defaultCompanyId: 'comp-1',
    accessibleCompanies: ['comp-1'],
    status: 'Active' as const,
    authMethod: 'SAML_SSO' as const,
    mfaEnabled: true
  });

  const [groupForm, setGroupForm] = useState({
    name: '',
    code: '',
    description: '',
    rolesIncluded: ['role-gl-acc'],
    status: 'Active' as const
  });

  const [exceptionForm, setExceptionForm] = useState({
    userId: 'usr-finmgr',
    userName: 'Rashid Al-Kiyumi',
    reason: '',
    expiresAt: '2026-12-31'
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.username || !userForm.fullName || !userForm.email) return;
    addUser({
      userId: userForm.username,
      username: userForm.username,
      fullName: userForm.fullName,
      email: userForm.email,
      mobile: '',
      employeeRef: '',
      companyId: userForm.defaultCompanyId,
      companyName: '',
      branchId: '',
      departmentId: '',
      departmentName: '',
      position: '',
      roleId: userForm.roleId,
      roleName: userForm.roleName,
      userGroupId: '',
      userGroupName: '',
      status: userForm.status,
      authMethod: 'SAML SSO',
      mfaEnabled: userForm.mfaEnabled,
      lastLogin: '—',
      lastLoginIp: ''
    });
    setIsUserModalOpen(false);
    setUserForm({
      username: '',
      fullName: '',
      email: '',
      roleId: 'role-ap-clerk',
      roleName: 'AP Accountant',
      defaultCompanyId: 'comp-1',
      accessibleCompanies: ['comp-1'],
      status: 'Active',
      authMethod: 'SAML_SSO',
      mfaEnabled: true
    });
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupForm.name || !groupForm.code) return;
    addUserGroup({
      code: groupForm.code,
      name: groupForm.name,
      description: groupForm.description,
      memberCount: 0,
      members: [],
      assignedRoles: groupForm.rolesIncluded,
      status: groupForm.status
    });
    setIsGroupModalOpen(false);
  };

  const handleCreateException = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRuleId || !exceptionForm.reason) return;
    addSoDException(selectedRuleId, exceptionForm);
    setIsExceptionModalOpen(false);
  };

  // User columns
  const userColumns: ColumnDef<UserAccount>[] = [
    {
      key: 'username',
      header: 'User Account',
      accessor: item => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center">
            {item.fullName.split(' ').map(n => n[0]).join('').substring(0, 2)}
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-slate-100">{item.fullName}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">@{item.username} • {item.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'roleName',
      header: 'Assigned Role',
      accessor: item => (
        <span className="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 font-semibold text-[11px]">
          {item.roleName}
        </span>
      )
    },
    {
      key: 'authMethod',
      header: 'Auth & MFA',
      accessor: item => (
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
          <span className="font-mono text-[11px]">{item.authMethod}</span>
          {item.mfaEnabled ? (
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 font-semibold flex items-center gap-0.5">
              <Fingerprint className="w-3 h-3" /> MFA
            </span>
          ) : (
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
              No MFA
            </span>
          )}
        </div>
      )
    },
    {
      key: 'lastLogin',
      header: 'Last Active Session',
      accessor: item => (
        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
          {item.lastLogin || 'Never Logged In'}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      accessor: item => <StatusBadge status={item.status} />
    }
  ];

  // Group columns
  const groupColumns: ColumnDef<UserGroup>[] = [
    {
      key: 'code',
      header: 'Group Code',
      accessor: item => <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300">{item.code}</span>
    },
    {
      key: 'name',
      header: 'Group Title & Scope',
      accessor: item => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-slate-100">{item.name}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.description}</div>
        </div>
      )
    },
    {
      key: 'memberCount',
      header: 'Members Enrolled',
      accessor: item => (
        <span className="font-semibold text-slate-800 dark:text-slate-200">{item.memberCount} Users</span>
      )
    },
    {
      key: 'assignedRoles',
      header: 'Inherited Roles',
      accessor: item => (
        <div className="flex gap-1 flex-wrap">
          {item.assignedRoles.map(r => (
            <span key={r} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px]">
              {r}
            </span>
          ))}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      accessor: item => <StatusBadge status={item.status} />
    }
  ];

  // SoD Rules Columns
  const sodColumns: ColumnDef<SoDRule>[] = [
    {
      key: 'code',
      header: 'Rule Code',
      accessor: item => <span className="font-mono font-bold text-rose-700 dark:text-rose-300">{item.code}</span>
    },
    {
      key: 'title',
      header: 'Conflicting Entitlements',
      accessor: item => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-slate-100">{item.title}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Conflict:{' '}
            <strong className="text-slate-700 dark:text-slate-300">
              {item.conflictingActionA} ⚡ {item.conflictingActionB}
            </strong>
          </div>
        </div>
      )
    },
    {
      key: 'severity',
      header: 'Risk Level',
      accessor: item => <StatusBadge status={item.severity} />
    },
    {
      key: 'exceptions',
      header: 'Active Waivers',
      accessor: item => {
        const count = item.exceptions.filter(e => e.status === 'Active').length;
        return count > 0 ? (
          <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-200 text-[11px] font-semibold">
            {count} Exception Granted
          </span>
        ) : (
          <span className="text-slate-500 dark:text-slate-400 text-[11px]">Zero Waivers (Strict)</span>
        );
      }
    },
    {
      key: 'status',
      header: 'Enforcement',
      accessor: item => <StatusBadge status={item.status} />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Provisioned User Accounts"
          value={users.length}
          change="87.5% MFA Enrolled"
          isPositive={true}
          description="Active Enterprise Identities"
          icon={<Users className="w-5 h-5" />}
        />
        <MetricCard
          label="Segregation of Duties Rules"
          value={sodRules.length}
          status="positive"
          description="Strict Anti-Fraud Matrix"
          icon={<ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
        />
        <MetricCard
          label="Security Role Groups"
          value={userGroups.length}
          status="neutral"
          description="Role Hierarchy Groups"
          icon={<Shield className="w-5 h-5" />}
        />
        <MetricCard
          label="Locked / Restricted Accounts"
          value={users.filter(u => u.status === 'Locked').length}
          status="warning"
          description="Security Quarantined"
          icon={<Lock className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'users' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Accounts & Credentials ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('groups')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'groups' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>User Security Groups ({userGroups.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sod')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'sod' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Segregation of Duties (SoD) & Waivers</span>
        </button>

        <button
          onClick={() => setActiveTab('restrictions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'restrictions' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>IP & Time Access Restrictions</span>
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <DataTable
          title="Enterprise User Directory"
          subtitle="Directory of authenticated users with corporate SSO, RBAC roles, MFA enforcement, and account locks"
          data={users}
          columns={userColumns}
          keyExtractor={item => item.id}
          onAddClick={() => setIsUserModalOpen(true)}
          addLabel="Provision New User"
          searchPlaceholder="Search name, username, email, role..."
          exportFileName="artify-users-directory"
          filterOptions={[
            {
              key: 'status',
              label: 'Status',
              options: [
                { value: 'Active', label: 'Active' },
                { value: 'Locked', label: 'Locked' },
                { value: 'Inactive', label: 'Inactive' }
              ],
              filterFn: (item, val) => item.status === val
            },
            {
              key: 'roleName',
              label: 'Role',
              options: [
                { value: 'Super Administrator', label: 'Super Administrator' },
                { value: 'CFO / Group Financial Officer', label: 'CFO' },
                { value: 'Senior Finance Manager', label: 'Finance Manager' },
                { value: 'AP Accountant', label: 'AP Accountant' }
              ],
              filterFn: (item, val) => item.roleName.includes(val)
            }
          ]}
          actionRenderer={item => (
            <div className="flex items-center justify-end gap-1.5">
              <button
                onClick={() => resetUserPassword(item.id)}
                title="Send password reset link"
                className="p-1 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => toggleUserLock(item.id)}
                title={item.status === 'Locked' ? 'Unlock user account' : 'Lock user account'}
                className={`px-2.5 py-1 rounded text-xs font-medium border cursor-pointer ${
                  item.status === 'Locked'
                    ? 'border-emerald-300 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
                    : 'border-rose-300 dark:border-rose-500/40 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10'
                }`}
              >
                {item.status === 'Locked' ? (
                  <span className="flex items-center gap-1">
                    <Unlock className="w-3 h-3" /> Unlock
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Lock
                  </span>
                )}
              </button>
            </div>
          )}
        />
      )}

      {/* Groups Tab */}
      {activeTab === 'groups' && (
        <DataTable
          title="User Security & Access Groups"
          subtitle="Group-based entitlement inheritance with bundled role memberships"
          data={userGroups}
          columns={groupColumns}
          keyExtractor={item => item.id}
          onAddClick={() => setIsGroupModalOpen(true)}
          addLabel="Create User Group"
          searchPlaceholder="Search group title, code..."
          exportFileName="artify-user-groups"
        />
      )}

      {/* SoD Tab */}
      {activeTab === 'sod' && (
        <div className="space-y-6">
          <DataTable
            title="Segregation of Duties (SoD) Conflict Rules"
            subtitle="Automated audit compliance rules preventing toxic combinations of conflicting transaction duties"
            data={sodRules}
            columns={sodColumns}
            keyExtractor={item => item.id}
            searchPlaceholder="Search rule code, conflict roles..."
            exportFileName="artify-sod-rules"
            actionRenderer={item => (
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    setSelectedRuleId(item.id);
                    setIsExceptionModalOpen(true);
                  }}
                  className="px-2.5 py-1 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-500/40 rounded text-xs font-medium cursor-pointer"
                >
                  Grant Waiver
                </button>
                <button
                  onClick={() => toggleSoDRule(item.id)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 font-semibold cursor-pointer"
                >
                  {item.status === 'Enforced' ? 'Set Warning' : 'Enforce'}
                </button>
              </div>
            )}
          />

          {/* Active Exceptions Detail */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Active SoD Compliance Exceptions & Temporary Waivers</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              All exceptions require executive CFO sign-off and are subject to mandatory continuous SIEM audit review.
            </p>

            <div className="space-y-3">
              {sodRules.flatMap(r =>
                r.exceptions.map(exc => (
                  <div
                    key={exc.id}
                    className="border border-amber-200 dark:border-amber-500/30 bg-amber-50/50 dark:bg-amber-500/10 rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {exc.userName} • <span className="font-mono text-indigo-700 dark:text-indigo-300">{r.code}</span> ({r.title})
                      </div>
                      <div className="text-slate-600 dark:text-slate-400 mt-0.5">
                        <strong>Reason:</strong> {exc.reason}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        Approved by: <strong>{exc.approvedBy}</strong> • Expiry Date:{' '}
                        <strong className="text-rose-700 dark:text-rose-300">{exc.expiresAt}</strong>
                      </div>
                    </div>
                    <StatusBadge status={exc.status} size="sm" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Restrictions Tab */}
      {activeTab === 'restrictions' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4 mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Network & Geolocation Access Policies</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Conditional access rules restricting financial and system transactions to authorized IP subnets and work hours
              </p>
            </div>
            <button
              onClick={() => {
                addAccessRestriction({
                  name: 'Branch Office Subnet Gate',
                  type: 'IP Whitelist',
                  targetType: 'Role',
                  targetValue: 'role-ap-clerk, role-gl-acc',
                  ruleValue: '185.190.24.0/24, 195.229.241.0/24',
                  enforceMfa: false,
                  status: 'Active',
                  description: 'Restrict AP/GL transactions to branch office subnets (08:00 - 18:00 Sun-Thu)'
                });
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Access Policy</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accessRestrictions.map(ar => (
              <div key={ar.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50/60 dark:bg-slate-800/60 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{ar.name}</h4>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">ID: {ar.id}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30">
                    Enforcement: {ar.type}{ar.enforceMfa ? ' + MFA' : ''}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Applied Roles:</span>
                    <div className="flex gap-1 flex-wrap mt-1">
                      {ar.targetValue.split(',').map(r => r.trim()).map(r => (
                        <span key={r} className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-indigo-700 dark:text-indigo-300 font-mono text-[10px]">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Permitted Subnets / IP Ranges:</span>
                    <div className="flex gap-1 flex-wrap mt-1">
                      {(ar.type === 'IP Whitelist' ? ar.ruleValue.split(',').map(x => x.trim()) : []).map(ip => (
                        <span key={ip} className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-200 font-mono text-[10px]">
                          {ip}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Time Window:</span>
                    <div className="mt-1 text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      <span>{ar.type === 'Time Window' ? ar.ruleValue : '—'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Create User */}
      <FormModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title="Provision Enterprise User"
        subtitle="Create an authorized identity with assigned RBAC role and SSO login capability"
        onSubmit={handleCreateUser}
        submitLabel="Provision User"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Username *</label>
            <input
              type="text"
              required
              value={userForm.username}
              onChange={e => setUserForm({ ...userForm, username: e.target.value.toLowerCase().replace(/\s+/g, '.') })}
              placeholder="e.g. omar.khalid"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-xs focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={userForm.fullName}
              onChange={e => setUserForm({ ...userForm, fullName: e.target.value })}
              placeholder="e.g. Omar Khalid Al-Raisi"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Work Email Address *</label>
            <input
              type="email"
              required
              value={userForm.email}
              onChange={e => setUserForm({ ...userForm, email: e.target.value })}
              placeholder="e.g. omar.khalid@artify.om"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Assigned Role</label>
            <select
              value={userForm.roleName}
              onChange={e => {
                const r = e.target.value;
                let id = 'role-ap-clerk';
                if (r === 'Super Administrator') id = 'role-super-admin';
                if (r === 'Senior Finance Manager') id = 'role-fin-mgr';
                if (r === 'General Ledger Lead') id = 'role-gl-acc';
                if (r === 'Inventory Controller') id = 'role-inv-mgr';
                setUserForm({ ...userForm, roleName: r, roleId: id });
              }}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            >
              <option value="AP Accountant">AP Accountant</option>
              <option value="General Ledger Lead">General Ledger Lead</option>
              <option value="Senior Finance Manager">Senior Finance Manager</option>
              <option value="Inventory Controller">Inventory Controller</option>
              <option value="Super Administrator">Super Administrator</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Authentication Method</label>
            <select
              value={userForm.authMethod}
              onChange={e => setUserForm({ ...userForm, authMethod: e.target.value as any })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            >
              <option value="SAML_SSO">SAML 2.0 / Okta / Azure AD</option>
              <option value="LOCAL_PASSWORD">Internal Secure Database Auth</option>
              <option value="OAUTH_GOOGLE">Google Workspace OAuth</option>
            </select>
          </div>
        </div>
      </FormModal>

      {/* Modal: Create Group */}
      <FormModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        title="Create Security Role Group"
        subtitle="Group multiple roles into a coherent entitlement template"
        onSubmit={handleCreateGroup}
        submitLabel="Create Group"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Group Code *</label>
            <input
              type="text"
              required
              value={groupForm.code}
              onChange={e => setGroupForm({ ...groupForm, code: e.target.value.toUpperCase() })}
              placeholder="e.g. GRP-AUDIT-TEAM"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Group Name *</label>
            <input
              type="text"
              required
              value={groupForm.name}
              onChange={e => setGroupForm({ ...groupForm, name: e.target.value })}
              placeholder="e.g. Internal & External Auditors"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Description</label>
            <textarea
              rows={2}
              value={groupForm.description}
              onChange={e => setGroupForm({ ...groupForm, description: e.target.value })}
              placeholder="Explain intended use and permissions..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            />
          </div>
        </div>
      </FormModal>

      {/* Modal: Grant SoD Exception */}
      <FormModal
        isOpen={isExceptionModalOpen}
        onClose={() => setIsExceptionModalOpen(false)}
        title="Grant SoD Policy Waiver"
        subtitle="Authorize a temporary Segregation of Duties exception with audit justification"
        onSubmit={handleCreateException}
        submitLabel="Grant & Record Waiver"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Target User *</label>
            <select
              value={exceptionForm.userId}
              onChange={e => {
                const u = users.find(usr => usr.id === e.target.value);
                setExceptionForm({
                  ...exceptionForm,
                  userId: e.target.value,
                  userName: u ? u.fullName : exceptionForm.userName
                });
              }}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.fullName} (@{u.username}) - {u.roleName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Expiry Date *</label>
            <input
              type="date"
              required
              value={exceptionForm.expiresAt}
              onChange={e => setExceptionForm({ ...exceptionForm, expiresAt: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Audit Justification & Compensating Controls *
            </label>
            <textarea
              required
              rows={3}
              value={exceptionForm.reason}
              onChange={e => setExceptionForm({ ...exceptionForm, reason: e.target.value })}
              placeholder="e.g. Month-end emergency coverage approved by CFO with secondary reconciliation check..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            />
          </div>
        </div>
      </FormModal>
    </div>
  );
};
