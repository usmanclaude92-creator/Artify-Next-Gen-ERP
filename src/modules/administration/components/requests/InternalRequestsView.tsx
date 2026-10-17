import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../services/administrationStore';
import { InternalRequestRecord, InternalRequestCategory, WorkflowStatus } from '../../types';
import { ActorSimulationBar } from '../common/ActorSimulationBar';
import { WorkflowBannerAlert } from '../common/WorkflowBannerAlert';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Building,
  Plus,
  Search,
  Filter,
  Layers,
  ChevronRight,
  AlertCircle,
  BadgeCheck,
  Send,
  MessageSquare,
  ShieldCheck,
  GitBranch
} from 'lucide-react';

interface InternalRequestsViewProps {
  activeTab?: string;
}

export const InternalRequestsView: React.FC<InternalRequestsViewProps> = ({ activeTab: initialTab }) => {
  const {
    activeActor,
    internalRequests,
    addInternalRequest,
    approveInternalRequest,
    rejectInternalRequest,
    completeInternalRequest
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<InternalRequestRecord['requestType'] | 'all' | 'pending'>('all');

  useEffect(() => {
    if (initialTab && ['Employee', 'Department', 'Administrative', 'all', 'pending'].includes(initialTab)) {
      setActiveTab(initialTab as InternalRequestRecord['requestType'] | 'all' | 'pending');
    }
  }, [initialTab]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReq, setSelectedReq] = useState<InternalRequestRecord | null>(null);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalDecision, setApprovalDecision] = useState<'Approve' | 'Reject'>('Approve');
  const [approvalComments, setApprovalComments] = useState('');

  // Form State initialized from activeActor
  const [newType, setNewType] = useState<InternalRequestRecord['requestType']>('Employee');
  const [newCategory, setNewCategory] = useState<string>('Salary Certificate');
  const [newTitle, setNewTitle] = useState('');
  const [newEmployeeName, setNewEmployeeName] = useState(activeActor.name);
  const [newEmployeeId, setNewEmployeeId] = useState(activeActor.employeeRef);
  const [newDepartment, setNewDepartment] = useState(activeActor.department);
  const [newBranch, setNewBranch] = useState(activeActor.branch);
  const [newPriority, setNewPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('Medium');
  const [newJustification, setNewJustification] = useState('');

  // Synchronize defaults when active actor switches
  useEffect(() => {
    setNewEmployeeName(activeActor.name);
    setNewEmployeeId(activeActor.employeeRef);
    setNewDepartment(activeActor.department);
    setNewBranch(activeActor.branch);
  }, [activeActor]);

  // Keep selected request synchronized when internalRequests list changes
  useEffect(() => {
    if (selectedReq) {
      const refreshed = internalRequests.find(r => r.id === selectedReq.id);
      if (refreshed) {
        setSelectedReq(refreshed);
      }
    }
  }, [internalRequests]);

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const res = addInternalRequest({
      requestType: newType,
      category: newCategory as InternalRequestCategory,
      title: newTitle,
      requestedBy: newEmployeeName,
      employeeId: newEmployeeId,
      department: newDepartment,
      branch: newBranch,
      priority: newPriority,
      justification: newJustification
    });

    if (res.success) {
      setShowCreateModal(false);
      setNewTitle('');
      setNewJustification('');
    }
  };

  const handleProcessApproval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq) return;

    if (approvalDecision === 'Approve') {
      approveInternalRequest(selectedReq.id, activeActor, approvalComments || 'Approved in accordance with enterprise DoA.');
    } else {
      rejectInternalRequest(selectedReq.id, activeActor, approvalComments || 'Disapproved due to missing documentation or non-compliance.');
    }

    setShowApprovalModal(false);
    setApprovalComments('');
  };

  const filteredRequests = internalRequests.filter(req => {
    const matchesTab =
      activeTab === 'all' ? true :
      activeTab === 'pending' ? req.status === 'Pending Approval' :
      req.requestType === activeTab;

    const matchesSearch =
      req.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.category.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Simulation Bar */}
      <ActorSimulationBar />

      {/* Workflow Notification Banner */}
      <WorkflowBannerAlert />

      {/* Top Banner with Navigation Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              03.04
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Internal Requests & Service Desk</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Employee certifications, department requisitions, and multi-tier approval authorizations</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'all' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>All Requests ({internalRequests.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'pending' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Pending Approvals ({internalRequests.filter(r => r.status === 'Pending Approval').length})</span>
              </button>
              <button
                onClick={() => setActiveTab('Employee')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'Employee' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Employee Services</span>
              </button>
              <button
                onClick={() => setActiveTab('Department')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'Department' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Building className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Department Requisitions</span>
              </button>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Raise Request</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search ticket #, title, category, requester..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Main Grid: List Table & Approval Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Table (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5">Ticket #</th>
                  <th className="p-3.5">Subject & Category</th>
                  <th className="p-3.5">Requester & Dept</th>
                  <th className="p-3.5">Priority</th>
                  <th className="p-3.5">Workflow Stage</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredRequests.map(req => (
                  <tr
                    key={req.id}
                    onClick={() => setSelectedReq(req)}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/80 cursor-pointer transition-colors ${
                      selectedReq?.id === req.id ? 'bg-indigo-50/50 dark:bg-indigo-500/50' : ''
                    }`}
                  >
                    <td className="p-3.5 font-mono font-bold text-indigo-700 dark:text-indigo-300">{req.ticketNumber}</td>
                    <td className="p-3.5 max-w-xs">
                      <div className="font-bold text-slate-900 dark:text-slate-100 truncate">{req.title}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{req.category}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{req.requestedBy}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{req.department}</div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        req.priority === 'Urgent' ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-200' :
                        req.priority === 'High' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-200' :
                        req.priority === 'Medium' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-200' :
                        'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {req.priority}
                      </span>
                    </td>
                    <td className="p-3.5 font-medium">
                      <div className="flex items-center gap-1 text-[11px] text-slate-700 dark:text-slate-300">
                        <GitBranch className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
                        <span>Tier {req.currentApprovalLevel || 1} / {req.totalApprovalLevels || 1}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        req.status === 'Completed' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200' :
                        req.status === 'Approved' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-200' :
                        req.status === 'Rejected' ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-200' :
                        'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-200'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400 ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Detail Pane */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-2xs flex flex-col justify-between">
          {selectedReq ? (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300">{selectedReq.ticketNumber}</span>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Category: {selectedReq.category}</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  selectedReq.status === 'Approved' || selectedReq.status === 'Completed' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200' :
                  selectedReq.status === 'Rejected' ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-200' :
                  'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-200'
                }`}>
                  {selectedReq.status}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{selectedReq.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  {selectedReq.justification || 'Standard corporate requisition.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Requested By</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedReq.requestedBy}</span>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{selectedReq.employeeId}</div>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Department</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedReq.department}</span>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{selectedReq.branch}</div>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Required By Date</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedReq.requiredByDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Priority</span>
                  <span className="font-semibold text-indigo-700 dark:text-indigo-300">{selectedReq.priority}</span>
                </div>
              </div>

              {/* Approval Hierarchy Chain */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Multi-Tier Approval Pipeline</h4>
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                    Tier {selectedReq.currentApprovalLevel} of {selectedReq.totalApprovalLevels}
                  </span>
                </div>
                <div className="space-y-2">
                  {selectedReq.approvers.map((appr, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border transition-all ${
                        appr.status === 'Approved'
                          ? 'bg-emerald-50/60 dark:bg-emerald-500/60 border-emerald-200 dark:border-emerald-500/30'
                          : appr.status === 'Rejected'
                          ? 'bg-rose-50/60 dark:bg-rose-500/60 border-rose-200 dark:border-rose-500/30'
                          : selectedReq.currentApprovalLevel === appr.level
                          ? 'bg-indigo-50/80 dark:bg-indigo-500/80 border-indigo-300 dark:border-indigo-500/40 ring-1 ring-indigo-200 dark:ring-indigo-500/30'
                          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-70'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          Tier {appr.level}: {appr.role}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          appr.status === 'Approved' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200' :
                          appr.status === 'Rejected' ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-200' :
                          'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-200'
                        }`}>
                          {appr.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between flex-wrap gap-1">
                        <span>Assigned: {appr.approverName}</span>
                        {appr.decisionDate && <span>{appr.decisionDate}</span>}
                      </div>
                      {appr.comments && (
                        <div className="text-[11px] text-slate-600 dark:text-slate-400 bg-white/90 dark:bg-slate-900/90 p-1.5 rounded border border-slate-200 dark:border-slate-700 mt-1.5 italic">
                          "{appr.comments}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons for Approver */}
              {selectedReq.status === 'Pending Approval' && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Operating as: <strong className="text-slate-800 dark:text-slate-200">{activeActor.name}</strong> ({activeActor.role})</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setApprovalDecision('Approve');
                        setShowApprovalModal(true);
                      }}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold cursor-pointer flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve Tier {selectedReq.currentApprovalLevel}
                    </button>
                    <button
                      onClick={() => {
                        setApprovalDecision('Reject');
                        setShowApprovalModal(true);
                      }}
                      className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold cursor-pointer flex items-center justify-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                </div>
              )}

              {selectedReq.status === 'Approved' && (
                <button
                  onClick={() => completeInternalRequest(selectedReq.id, 'Official document issued and signed.')}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold cursor-pointer flex items-center justify-center gap-1"
                >
                  <BadgeCheck className="w-3.5 h-3.5" /> Mark Fulfilled & Closed
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 text-slate-500 dark:text-slate-400 my-auto">
              <FileCheck2 className="w-10 h-10 mb-2 stroke-1" />
              <p className="font-semibold text-slate-600 dark:text-slate-400">Select a service request</p>
              <p className="text-xs">Review authorization chains, attached justifications, and perform approvals</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-lg shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">Raise Internal Service Request</h3>
            <form onSubmit={handleCreateRequest} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setNewType('Employee');
                    setNewCategory('Salary Certificate');
                  }}
                  className={`py-2 rounded-lg font-semibold cursor-pointer transition-all ${
                    newType === 'Employee' ? 'bg-slate-900 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Employee Request
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewType('Department');
                    setNewCategory('Workstation Re-layout');
                  }}
                  className={`py-2 rounded-lg font-semibold cursor-pointer transition-all ${
                    newType === 'Department' ? 'bg-slate-900 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Department Request
                </button>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Request Subject</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder={newType === 'Employee' ? 'e.g. Salary Certificate with Embassy Attestation' : 'e.g. Additional Desk Partitioning for PMO Team'}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Category</label>
                  {newType === 'Employee' ? (
                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none"
                    >
                      <option value="Salary Certificate">Salary Certificate</option>
                      <option value="Embassy Visa Letter">Embassy Visa Letter</option>
                      <option value="NOC Certificate">NOC Certificate</option>
                      <option value="Experience Certificate">Experience Certificate</option>
                      <option value="Bank Attestation">Bank Attestation</option>
                    </select>
                  ) : (
                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none"
                    >
                      <option value="Workstation Re-layout">Workstation Re-layout</option>
                      <option value="Office Ergonomic Furniture">Office Ergonomic Furniture</option>
                      <option value="Document Courier Dispatch">Document Courier Dispatch</option>
                      <option value="VIP Meeting Catering">VIP Meeting Catering</option>
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={e => setNewPriority(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Requester Name</label>
                  <input
                    type="text"
                    value={newEmployeeName}
                    onChange={e => setNewEmployeeName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Department</label>
                  <input
                    type="text"
                    value={newDepartment}
                    onChange={e => setNewDepartment(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Detailed Justification & Requirements</label>
                <textarea
                  rows={3}
                  value={newJustification}
                  onChange={e => setNewJustification(e.target.value)}
                  placeholder="Provide any specific recipient addresses, purpose, or deadlines..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold cursor-pointer"
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Approval Decision Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
              {approvalDecision === 'Approve' ? 'Authorize Service Request' : 'Reject Service Request'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Ticket: <strong className="text-slate-800 dark:text-slate-200">{selectedReq?.ticketNumber}</strong> ({selectedReq?.title})
            </p>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs mb-4">
              <div className="text-slate-500 dark:text-slate-400 font-semibold">Authorizing Identity:</div>
              <div className="font-bold text-slate-900 dark:text-slate-100">{activeActor.name} ({activeActor.role})</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Tier {selectedReq?.currentApprovalLevel} Review</div>
            </div>

            <form onSubmit={handleProcessApproval} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Executive Notes / Approval Comments</label>
                <textarea
                  rows={3}
                  value={approvalComments}
                  onChange={e => setApprovalComments(e.target.value)}
                  placeholder={approvalDecision === 'Approve' ? 'Approved as per group policy...' : 'State reason for rejection...'}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowApprovalModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-slate-900 dark:text-white rounded-lg font-semibold cursor-pointer ${
                    approvalDecision === 'Approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  Confirm {approvalDecision}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
