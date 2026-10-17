// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 17: COMPLIANCE, RISK & AUDIT
// Module Runner Component
// ==========================================

import React, { useState, useEffect } from 'react';
import {
  ERPModule,
  ERPFunctionalArea,
  ERPProcess,
  ERPTransaction,
  ERPRouteState,
  ERPUserRole
} from '../../types/erp';
import { ComplianceProvider, useComplianceStore } from './services/complianceStore';
import { RegulatoryComplianceView } from './components/regulatory/RegulatoryComplianceView';
import { TaxComplianceView } from './components/tax/TaxComplianceView';
import { InternalControlsView } from './components/controls/InternalControlsView';
import { RiskManagementView } from './components/risk/RiskManagementView';
import { InternalAuditView } from './components/internalaudit/InternalAuditView';
import { ExternalAuditView } from './components/externalaudit/ExternalAuditView';
import { CorrectiveActionsView } from './components/corrective/CorrectiveActionsView';
import { FraudMonitoringView } from './components/fraud/FraudMonitoringView';
import {
  ShieldCheck,
  Receipt,
  Lock,
  AlertTriangle,
  FileText,
  Building2,
  Wrench,
  Radar,
  Award,
  ChevronRight,
  Star,
  Sparkles,
  Layers,
  ArrowLeft
} from 'lucide-react';

export type Submodule17Key =
  | '17.01'
  | '17.02'
  | '17.03'
  | '17.04'
  | '17.05'
  | '17.06'
  | '17.07'
  | '17.08';

const SUBMODULES: {
  key: Submodule17Key;
  code: string;
  name: string;
  shortName: string;
  description: string;
  functionalAreaId: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    key: '17.01',
    code: '17.01',
    name: 'Regulatory Compliance',
    shortName: 'Regulatory',
    description: 'Statutory requirements, compliance calendar, department health scorecards',
    functionalAreaId: 'regulatory-compliance',
    icon: Award
  },
  {
    key: '17.02',
    code: '17.02',
    name: 'Tax Compliance & Statutory Reporting',
    shortName: 'Tax & VAT',
    description: '5% Oman VAT e-invoices, CIT (15%) tax schedules, statutory returns',
    functionalAreaId: 'tax-compliance',
    icon: Receipt
  },
  {
    key: '17.03',
    code: '17.03',
    name: 'COSO Internal Controls & SoD',
    shortName: 'Internal Controls',
    description: 'Key control framework, DOA approval limits, SoD conflict analyzer, walkthroughs',
    functionalAreaId: 'internal-controls',
    icon: Lock
  },
  {
    key: '17.04',
    code: '17.04',
    name: 'Enterprise Risk Management',
    shortName: 'Risk (ERM)',
    description: 'Risk register, interactive 5x5 heatmap, mitigation plans & KRIs',
    functionalAreaId: 'risk-management',
    icon: AlertTriangle
  },
  {
    key: '17.05',
    code: '17.05',
    name: 'Internal Audit',
    shortName: 'Internal Audit',
    description: 'Annual audit plan, fieldwork workpapers, 5C formal findings register',
    functionalAreaId: 'internal-audit',
    icon: FileText
  },
  {
    key: '17.06',
    code: '17.06',
    name: 'External Audit & PBC Workspace',
    shortName: 'External Audit',
    description: 'Big-4 statutory audit, PBC request tracker, evidence repository',
    functionalAreaId: 'external-audit',
    icon: Building2
  },
  {
    key: '17.07',
    code: '17.07',
    name: 'Corrective Actions (CAPA)',
    shortName: 'CAPA Plans',
    description: 'Root cause analysis, milestone tracking, audit closure verification',
    functionalAreaId: 'corrective-actions-audit',
    icon: Wrench
  },
  {
    key: '17.08',
    code: '17.08',
    name: 'Fraud Detection & GRC Cockpit',
    shortName: 'Fraud & GRC',
    description: 'AI anomaly scanner, Benford’s Law analysis, code of conduct, 10-yr retention',
    functionalAreaId: 'fraud-compliance-monitoring',
    icon: Radar
  }
];

export interface ComplianceModuleRunnerProps {
  module?: ERPModule;
  functionalArea?: ERPFunctionalArea;
  process?: ERPProcess;
  transaction?: ERPTransaction;
  onNavigate?: (route: ERPRouteState) => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  activeRole?: ERPUserRole;
}

const InnerComplianceRunner: React.FC<ComplianceModuleRunnerProps> = ({
  module,
  functionalArea,
  process,
  transaction,
  onNavigate,
  isFavorite,
  onToggleFavorite
}) => {
  const {
    regulatoryRequirements,
    vatRecords,
    riskItems,
    auditFindings,
    fraudAlerts
  } = useComplianceStore();

  const getInitialSubmodule = (): Submodule17Key => {
    if (functionalArea) {
      const match = SUBMODULES.find(s => s.functionalAreaId === functionalArea.id);
      if (match) return match.key;
    }
    return '17.01';
  };

  const [activeSubmodule, setActiveSubmodule] = useState<Submodule17Key>(getInitialSubmodule());

  useEffect(() => {
    if (functionalArea) {
      const match = SUBMODULES.find(s => s.functionalAreaId === functionalArea.id);
      if (match) setActiveSubmodule(match.key);
    }
  }, [functionalArea?.id]);

  // Quick metrics
  const compliantReqCount = regulatoryRequirements.filter(r => r.status === 'COMPLIANT').length;
  const openFindingsCount = auditFindings.filter(f => f.status !== 'CLOSED').length;
  const openFraudCount = fraudAlerts.filter(a => a.status === 'NEW' || a.status === 'UNDER_INVESTIGATION').length;

  return (
    <div className="space-y-6">
      {/* Top Banner with Stats Strip */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Module 17 • Governance, Risk & Compliance (GRC)</span>
              </div>

              {onToggleFavorite && (
                <button
                  onClick={onToggleFavorite}
                  className={`p-1.5 rounded-xl border transition cursor-pointer ${
                    isFavorite
                      ? 'bg-amber-400/20 border-amber-400/40 text-amber-300'
                      : 'bg-white/10 border-white/20 text-slate-300 hover:text-white'
                  }`}
                  title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-300' : ''}`} />
                </button>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Compliance, Enterprise Risk & Audit
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Oman regulatory mandates, 5% VAT & Corporate Tax (CIT), COSO internal controls, Segregation of Duties (SoD), dynamic 5×5 ERM heatmap, internal/external audit workflows, CAPA remediation, and AI fraud detection.
            </p>

            {(functionalArea || process || transaction) && (
              <div className="flex items-center gap-2 pt-2 text-xs font-mono text-emerald-400">
                <span>Direct Context:</span>
                <span className="bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-500/30">
                  {transaction?.name || process?.name || functionalArea?.name}
                </span>
              </div>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 block">
                Statutory Health
              </span>
              <strong className="text-xl font-bold font-mono text-emerald-400">
                {Math.round((compliantReqCount / (regulatoryRequirements.length || 1)) * 100)}%
              </strong>
              <span className="text-[10px] text-slate-400 block mt-0.5">Compliant</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 block">
                Tax Filings
              </span>
              <strong className="text-xl font-bold font-mono text-cyan-400">
                100%
              </strong>
              <span className="text-[10px] text-slate-400 block mt-0.5">5% VAT Verified</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 block">
                Open Findings
              </span>
              <strong className="text-xl font-bold font-mono text-amber-400">
                {openFindingsCount}
              </strong>
              <span className="text-[10px] text-slate-400 block mt-0.5">Under CAPA</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 block">
                Fraud Flags
              </span>
              <strong className="text-xl font-bold font-mono text-rose-400">
                {openFraudCount}
              </strong>
              <span className="text-[10px] text-slate-400 block mt-0.5">Active Triage</span>
            </div>
          </div>
        </div>
      </div>

      {/* Submodule Navigation Switcher */}
      <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {SUBMODULES.map(sub => {
            const Icon = sub.icon;
            const isActive = activeSubmodule === sub.key;
            return (
              <button
                key={sub.key}
                onClick={() => {
                  setActiveSubmodule(sub.key);
                  if (onNavigate) {
                    onNavigate({
                      view: 'functional_area',
                      moduleId: 'compliance-risk-audit',
                      functionalAreaId: sub.functionalAreaId
                    });
                  }
                }}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{sub.code} {sub.shortName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Submodule Component Rendering */}
      <div className="transition-all duration-300">
        {activeSubmodule === '17.01' && <RegulatoryComplianceView />}
        {activeSubmodule === '17.02' && <TaxComplianceView />}
        {activeSubmodule === '17.03' && <InternalControlsView />}
        {activeSubmodule === '17.04' && <RiskManagementView />}
        {activeSubmodule === '17.05' && <InternalAuditView />}
        {activeSubmodule === '17.06' && <ExternalAuditView />}
        {activeSubmodule === '17.07' && <CorrectiveActionsView />}
        {activeSubmodule === '17.08' && <FraudMonitoringView />}
      </div>
    </div>
  );
};

export const ComplianceModuleRunner: React.FC<ComplianceModuleRunnerProps> = props => {
  return (
    <ComplianceProvider>
      <InnerComplianceRunner {...props} />
    </ComplianceProvider>
  );
};
