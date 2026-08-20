import React from 'react';
import { X, ShieldCheck, Check, Lock, ShieldAlert, UserCheck, KeyRound } from 'lucide-react';
import { ERPUserRole, ERPPermissionAction } from '../../types/erp';
import { MOCK_USER_ROLES } from '../../navigation/erpHierarchy';

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRole: ERPUserRole;
  onSelectRole: (role: ERPUserRole) => void;
}

const ALL_PERMISSIONS: { action: ERPPermissionAction; label: string; description: string }[] = [
  { action: 'VIEW', label: 'View Records', description: 'Read and browse data registers, logs, reports, and analytical dashboards.' },
  { action: 'CREATE', label: 'Create New', description: 'Generate new vouchers, requisitions, records, master catalog items, and draft entries.' },
  { action: 'EDIT', label: 'Edit & Modify', description: 'Update existing unposted vouchers, amend draft contracts, and adjust line items.' },
  { action: 'DELETE', label: 'Delete / Void', description: 'Void or purge draft documents, soft-delete inactive items, and mark records cancelled.' },
  { action: 'APPROVE', label: 'Authorize / Approve', description: 'Grant formal signature authorization on workflow documents exceeding approval thresholds.' },
  { action: 'REJECT', label: 'Reject & Return', description: 'Decline documents in approval queues and return with mandatory rejection notes.' },
  { action: 'EXPORT', label: 'Export Data', description: 'Download sensitive data extracts to Excel, CSV, PDF, and secure data lakes.' },
  { action: 'PRINT', label: 'Print / Official PDF', description: 'Generate formatted legal stationery, vouchers, certificates, and invoices.' },
  { action: 'POST', label: 'General Ledger Post', description: 'Commit financial journals permanently into the General Ledger (irreversible commit).' },
  { action: 'REVERSE', label: 'Reverse & Credit Note', description: 'Execute compensating reversal entries and issue debit/credit notes for posted vouchers.' },
  { action: 'ADMIN', label: 'Security & System Admin', description: 'Configure audit controls, user access, security encryption, and global enterprise rules.' }
];

export const PermissionsModal: React.FC<PermissionsModalProps> = ({
  isOpen,
  onClose,
  activeRole,
  onSelectRole
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Enterprise Role-Based Access Control (RBAC) Matrix
              </h2>
              <p className="text-xs text-slate-500">
                11 Granular Action Permissions across Executive Roles & Segregation of Duties (SoD)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="px-4 py-2 border-b border-slate-100 bg-slate-50 flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
          <span className="text-[11px] uppercase font-bold text-slate-400 shrink-0">Persona:</span>
          {MOCK_USER_ROLES.map(role => {
            const isSelected = role.id === activeRole.id;
            return (
              <button
                key={role.id}
                onClick={() => onSelectRole(role)}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
                }`}
              >
                <span className="w-4 h-4 rounded bg-slate-100 text-slate-800 text-[9px] font-bold flex items-center justify-center">
                  {role.avatar}
                </span>
                <span>{role.name}</span>
                <span className="text-[10px] opacity-75">({role.department.split(' ')[0]})</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body: Active Role Overview & Permission Grid */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                {activeRole.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm">{activeRole.name}</h3>
                  <span className="text-[11px] font-mono font-semibold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                    {activeRole.department}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">{activeRole.title}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-indigo-700 bg-white px-2.5 py-1 rounded-md border border-indigo-200">
                {activeRole.permissions.length} of {ALL_PERMISSIONS.length} Permissions Active
              </span>
            </div>
          </div>

          {/* Matrix Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3">Permission Code</th>
                  <th className="py-2.5 px-3">Action Description</th>
                  <th className="py-2.5 px-3 text-center w-28">Status for Active Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ALL_PERMISSIONS.map(perm => {
                  const hasPerm = activeRole.permissions.includes(perm.action);
                  return (
                    <tr key={perm.action} className={hasPerm ? 'bg-white' : 'bg-slate-50/40 text-slate-400'}>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">
                          {perm.action}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <p className="font-semibold text-slate-800">{perm.label}</p>
                        <p className="text-[11px] text-slate-500">{perm.description}</p>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {hasPerm ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <Check className="w-3 h-3" /> Granted
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            <Lock className="w-3 h-3" /> Restricted
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Compliant with IFRS, VAT, ISO 27001, and Sarbanes-Oxley SoD governance standards</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-900 transition-colors"
          >
            Close Matrix
          </button>
        </div>
      </div>
    </div>
  );
};
