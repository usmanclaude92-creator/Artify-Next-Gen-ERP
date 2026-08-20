import React from 'react';
import { useAdmin } from '../../services/administrationStore';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Plane,
  Car,
  Mail,
  Building2,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Users
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface AdministrationDashboardViewProps {
  onNavigateToSubView?: (viewId: string) => void;
}

export const AdministrationDashboardView: React.FC<AdministrationDashboardViewProps> = ({
  onNavigateToSubView
}) => {
  const {
    analyticsSummary,
    formatCurrency,
    generateAdminBriefing,
    notices,
    internalRequests,
    meetings,
    tasks
  } = useAdmin();

  const monthlyRequestData = [
    { month: 'Jan', requests: 42, completed: 40 },
    { month: 'Feb', requests: 56, completed: 52 },
    { month: 'Mar', requests: 68, completed: 64 },
    { month: 'Apr', requests: 74, completed: 70 },
    { month: 'May', requests: 85, completed: 81 },
    { month: 'Jun', requests: 62, completed: 59 }
  ];

  const deptSpendData = [
    { name: 'Executive & Legal', value: 4200, color: '#0f172a' },
    { name: 'Operations & EPC', value: 6800, color: '#4f46e5' },
    { name: 'Finance & Admin', value: 2900, color: '#059669' },
    { name: 'Commercial & BD', value: 3400, color: '#d97706' }
  ];

  const urgentTasks = tasks.filter(t => t.priority === 'Urgent' || t.priority === 'High').slice(0, 4);
  const recentNotices = notices.slice(0, 3);
  const pendingApprovals = internalRequests.filter(r => r.status === 'Pending Approval').slice(0, 4);

  return (
    <div className="space-y-6">
      {/* AI Daily Briefing Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-600/20 to-transparent pointer-events-none" />
        <div className="relative z-10 space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>AI Executive Administration Intelligence</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Corporate Administration Daily Operations Pulse</h2>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            {generateAdminBriefing()}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SLA Response Health: <strong>98.4%</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Avg Requisition Turnaround: <strong>{analyticsSummary.avgRequestResolutionDays} Days</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Document Vault Retention Compliance: <strong>100%</strong></span>
          </div>
        </div>
      </div>

      {/* KPI Metrics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Pending Authorizations
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-extrabold text-amber-600">{analyticsSummary.pendingApprovalsCount}</span>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">Action Req</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Across tickets & travel</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Vault Documents
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-extrabold text-slate-900">{analyticsSummary.activeDocumentsCount}</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Indexed</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">{analyticsSummary.archivedDocumentsCount} Cold Archived</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Incoming Mailroom
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-extrabold text-indigo-700">{analyticsSummary.totalIncomingMailThisMonth}</span>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">This Month</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Government decrees & tenders</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Today's Meetings
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-extrabold text-slate-900">{analyticsSummary.upcomingMeetingsCount}</span>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">Roster</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Executive & operational</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Active Fleet Pool
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-extrabold text-slate-900">{analyticsSummary.activeVehiclesInPool}</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Ready</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Corporate vehicles deployed</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Travel Spend YTD
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-extrabold text-slate-900">{formatCurrency(analyticsSummary.totalMonthlyTravelBudgetOMR)}</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Approved business trips</span>
        </div>
      </div>

      {/* Analytics Charts & Action Workbenches */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Charts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Administrative Requisitions Volume</h3>
                <p className="text-[11px] text-slate-500">Submitted vs Completed internal requests (H1 2026)</p>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-slate-900" />
                  <span className="text-slate-600">Requests</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
                  <span className="text-slate-600">Fulfilled</span>
                </div>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRequestData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                  />
                  <Bar dataKey="requests" fill="#0f172a" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pending Authorizations Fast-Track Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Pending Authorizations Queue</h3>
              </div>
              <button
                onClick={() => onNavigateToSubView && onNavigateToSubView('03.04')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer flex items-center gap-1"
              >
                <span>View All ({analyticsSummary.pendingApprovalsCount})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {pendingApprovals.map(req => (
                <div key={req.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50/50">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono font-bold text-indigo-700">{req.ticketNumber}</span>
                      <span className="font-semibold text-slate-900">{req.title}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Requested by {req.requestedBy} ({req.department}) • Required by {req.requiredByDate}
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigateToSubView && onNavigateToSubView('03.04')}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-semibold cursor-pointer"
                  >
                    Authorize
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Quick Modules & Bulletins */}
        <div className="space-y-6">
          {/* Quick Sub-module Launchpad */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Module 03 Quick Navigation</h3>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => onNavigateToSubView && onNavigateToSubView('03.01')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-left cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-900">
                    01
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Office Administration</div>
                    <div className="text-[10px] text-slate-500">Notices, services, stationery, facility orders</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigateToSubView && onNavigateToSubView('03.02')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-left cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-900">
                    02
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Correspondence Management</div>
                    <div className="text-[10px] text-slate-500">Inbound decrees, outbound courier, barcode mail</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigateToSubView && onNavigateToSubView('03.03')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-left cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-900">
                    03
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Document Management (DMS)</div>
                    <div className="text-[10px] text-slate-500">Document checkout locks, versioning, archives</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigateToSubView && onNavigateToSubView('03.05')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-left cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-900">
                    05
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Task & Activity Kanban</div>
                    <div className="text-[10px] text-slate-500">Cross-departmental execution engine</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigateToSubView && onNavigateToSubView('03.06')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-left cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-900">
                    06
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Meeting Management & MoM</div>
                    <div className="text-[10px] text-slate-500">Board meetings, room bookings, minutes</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigateToSubView && onNavigateToSubView('03.07')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-left cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-900">
                    07
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Travel & Fleet Logistics</div>
                    <div className="text-[10px] text-slate-500">Trip authorizations & motor pool dispatch</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Active Bulletins Widget */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Active Bulletins</h3>
              <span className="text-[11px] text-indigo-600 font-semibold cursor-pointer" onClick={() => onNavigateToSubView && onNavigateToSubView('03.01')}>
                View Board
              </span>
            </div>
            <div className="space-y-2 text-xs">
              {recentNotices.map(n => (
                <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 mb-0.5">{n.title}</div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{n.content}</p>
                  <div className="mt-1.5 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>{n.targetAudience}</span>
                    <span>{n.publishedDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
