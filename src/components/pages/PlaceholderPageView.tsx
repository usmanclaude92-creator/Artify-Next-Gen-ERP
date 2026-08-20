import React, { useState } from 'react';
import {
  FileText,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Save,
  Send,
  Printer,
  Download,
  Share2,
  Database,
  Layers,
  Clock,
  Star,
  Zap,
  HelpCircle,
  Plus
} from 'lucide-react';
import {
  ERPModule,
  ERPFunctionalArea,
  ERPProcess,
  ERPTransaction,
  ERPRouteState,
  ERPUserRole
} from '../../types/erp';

interface PlaceholderPageViewProps {
  module: ERPModule;
  functionalArea: ERPFunctionalArea;
  process: ERPProcess;
  transaction: ERPTransaction;
  onNavigate: (route: ERPRouteState) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  activeRole: ERPUserRole;
}

export const PlaceholderPageView: React.FC<PlaceholderPageViewProps> = ({
  module,
  functionalArea,
  process,
  transaction,
  onNavigate,
  isFavorite,
  onToggleFavorite,
  activeRole
}) => {
  const [activeTab, setActiveTab] = useState<'workspace' | 'workflow' | 'audit'>('workspace');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const triggerAction = (actionName: string) => {
    setFeedbackMessage(`Action executed: "${actionName}" recorded in system audit logs by ${activeRole.name}`);
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 4000);
  };

  const hasPermission = (action: string) => {
    // @ts-ignore
    return activeRole.permissions.includes(action) || activeRole.permissions.includes('ADMIN');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <button
                onClick={() =>
                  onNavigate({
                    view: 'process',
                    moduleId: module.id,
                    functionalAreaId: functionalArea.id,
                    processId: process.id
                  })
                }
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to {process.name}</span>
              </button>
              <span className="text-slate-300">•</span>
              <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                {transaction.code}
              </span>
              <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                {transaction.phase}
              </span>
              <span className="text-[11px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI Co-Pilot Ready
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {transaction.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              {transaction.description}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              onClick={onToggleFavorite}
              title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-amber-50 border-amber-200 text-amber-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Star
                className={`w-4 h-4 ${isFavorite ? 'text-amber-500 fill-amber-400' : 'text-slate-400'}`}
              />
              <span>{isFavorite ? 'Favorited' : 'Add to Favorites'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Trigger Banner */}
      {feedbackMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('workspace')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'workspace'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Interactive Transaction Workspace
        </button>
        <button
          onClick={() => setActiveTab('workflow')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'workflow'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Workflow & SoD Governance Blueprint
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'audit'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Schema & Relational API Stubs
        </button>
      </div>

      {/* Tab 1: Interactive Workspace */}
      {activeTab === 'workspace' && (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
                STATUS: DRAFT (UNPOSTED)
              </span>
              <span className="text-xs text-slate-400">Voucher Ref #ART-2026-9902</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                disabled={!hasPermission('CREATE')}
                onClick={() => triggerAction('Save Draft')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Draft</span>
              </button>

              <button
                disabled={!hasPermission('APPROVE')}
                onClick={() => triggerAction('Submit for Executive Approval')}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Approval</span>
              </button>

              <button
                disabled={!hasPermission('POST')}
                onClick={() => triggerAction('Commit & Post to General Ledger')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Post to GL</span>
              </button>

              <button
                disabled={!hasPermission('PRINT')}
                onClick={() => triggerAction('Generate Official PDF & Print')}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs"
                title="Print Document"
              >
                <Printer className="w-4 h-4" />
              </button>

              <button
                disabled={!hasPermission('EXPORT')}
                onClick={() => triggerAction('Export to Excel & CSV')}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs"
                title="Export Data"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Form Header Fields */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
              Voucher Header & Organization Scope
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-slate-500 font-medium mb-1">Company Entity</label>
                <input
                  type="text"
                  readOnly
                  value="Artify Global Holding Co. (HOLD-01)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Operating Branch / Yard</label>
                <input
                  type="text"
                  readOnly
                  value="Muscat Global HQ (MCT-HQ)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Accounting / Posting Date</label>
                <input
                  type="date"
                  defaultValue="2026-08-20"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Base Currency</label>
                <input
                  type="text"
                  readOnly
                  value="OMR (Omani Rial) • Rate: 1.0000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-semibold font-mono"
                />
              </div>
            </div>
          </div>

          {/* Line Item Table */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Transaction Line Items & Ledger Allocation
              </h2>
              <button
                onClick={() => triggerAction('Add Item Row')}
                className="px-2.5 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Line Item</span>
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Account Code / Description</th>
                    <th className="py-2.5 px-3">Cost Center</th>
                    <th className="py-2.5 px-3 text-right">Debit (OMR)</th>
                    <th className="py-2.5 px-3 text-right">Credit (OMR)</th>
                    <th className="py-2.5 px-3">Tax Code</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-400">01</td>
                    <td className="py-2.5 px-3">
                      <p className="font-semibold text-slate-900">11040 — Trade Operations Clearing</p>
                      <p className="text-[11px] text-slate-400">Batch delivery ref #BD-991</p>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">CC-MCT-OPS</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      14,500.000
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-400">-</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-600">VAT-5% (Standard)</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-400">02</td>
                    <td className="py-2.5 px-3">
                      <p className="font-semibold text-slate-900">21010 — Accounts Payable Vendor Control</p>
                      <p className="text-[11px] text-slate-400">Al-Maha Steel Mills LLC</p>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">CC-CORP-FIN</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-400">-</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      14,500.000
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-400">EXEMPT</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
                    <td colSpan={3} className="py-2.5 px-3 text-right uppercase tracking-wider text-xs">
                      Balanced Journal Total:
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-emerald-700">
                      14,500.000 OMR
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-emerald-700">
                      14,500.000 OMR
                    </td>
                    <td className="py-2.5 px-3 text-xs text-emerald-600">✓ Balanced</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Workflow & Governance */}
      {activeTab === 'workflow' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              End-to-End Approval Chain & Segregation of Duties (SoD)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Strict multi-tier signatory thresholds configured for compliance with International Standards on Auditing (ISA).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Step 1: Originator
                </span>
                <h4 className="font-bold text-sm text-slate-900 mt-2">Data Entry & Submission</h4>
                <p className="text-xs text-slate-500 mt-1">Initiator verifies invoices, attachments, and purchase orders.</p>
              </div>
              <span className="text-xs text-slate-400 mt-3 pt-2 border-t border-slate-200">
                Required Role: <strong>CREATE</strong>
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  Step 2: Department Head
                </span>
                <h4 className="font-bold text-sm text-slate-900 mt-2">Operational Verification</h4>
                <p className="text-xs text-slate-500 mt-1">Confirms project delivery, receipt note, and budget availability.</p>
              </div>
              <span className="text-xs text-slate-400 mt-3 pt-2 border-t border-slate-200">
                Required Role: <strong>EDIT / APPROVE</strong>
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Step 3: Executive CFO
                </span>
                <h4 className="font-bold text-sm text-slate-900 mt-2">Financial Authorization</h4>
                <p className="text-xs text-slate-500 mt-1">Dual digital certificate signature required for amounts &gt;OMR 25,000.</p>
              </div>
              <span className="text-xs text-slate-400 mt-3 pt-2 border-t border-slate-200">
                Required Role: <strong>APPROVE</strong>
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Step 4: System GL Post
                </span>
                <h4 className="font-bold text-sm text-slate-900 mt-2">Immutable GL Commit</h4>
                <p className="text-xs text-slate-500 mt-1">Automatic journal entry posted to general ledger with cryptographic hash.</p>
              </div>
              <span className="text-xs text-slate-400 mt-3 pt-2 border-t border-slate-200">
                Required Role: <strong>POST</strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Schema & Relational API Stubs */}
      {activeTab === 'audit' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              PostgreSQL Relational Schema & RESTful API Stubs
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Production database schema definitions, indices, foreign keys, and microservice endpoints.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 text-slate-300 font-mono text-xs overflow-x-auto space-y-3">
            <div>
              <p className="text-indigo-400 font-bold text-[11px] uppercase tracking-wider">
                -- Database Table Structure: {(transaction?.code || 'TX').toLowerCase().replace(/[^a-z0-9]/g, '_')}
              </p>
              <pre className="text-slate-300 mt-1">
{`CREATE TABLE ${(transaction?.code || 'TX').toLowerCase().replace(/[^a-z0-9]/g, '_')}_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voucher_no VARCHAR(64) UNIQUE NOT NULL,
  company_id VARCHAR(32) REFERENCES erp_companies(id),
  branch_id VARCHAR(32) REFERENCES erp_branches(id),
  posting_date DATE NOT NULL,
  currency_code VARCHAR(3) DEFAULT 'OMR',
  exchange_rate NUMERIC(12, 6) DEFAULT 1.000000,
  total_amount NUMERIC(18, 3) NOT NULL,
  status VARCHAR(24) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SUBMITTED', 'APPROVED', 'POSTED', 'VOID')),
  created_by VARCHAR(64) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  posted_by VARCHAR(64),
  posted_at TIMESTAMPTZ
);`}
              </pre>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <p className="text-emerald-400 font-bold text-[11px] uppercase tracking-wider">
                -- API Microservice Endpoints:
              </p>
              <p className="text-slate-400 mt-1">
                POST /api/v1/{module.id}/{transaction.id}/create<br />
                PUT /api/v1/{module.id}/{transaction.id}/:id/submit-approval<br />
                POST /api/v1/{module.id}/{transaction.id}/:id/gl-post<br />
                GET /api/v1/{module.id}/{transaction.id}/:id/export-pdf
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
