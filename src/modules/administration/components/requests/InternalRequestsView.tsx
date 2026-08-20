import React, { useState } from 'react';
import { useAdmin } from '../../services/administrationStore';
import { InternalRequestRecord, WorkflowStatus } from '../../types';
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
  MessageSquare
} from 'lucide-react';

export const InternalRequestsView: React.FC = () => {
  const {
    internalRequests,
    addInternalRequest,
    approveInternalRequest,
    rejectInternalRequest,
    completeInternalRequest
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<InternalRequestRecord['requestType'] | 'all' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReq, setSelectedReq] = useState<InternalRequestRecord | null>(null);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalDecision, setApprovalDecision] = useState<'Approve' | 'Reject'>('Approve');
  const [approvalComments, setApprovalComments] = useState('');

  // Form State
  const [newType, setNewType] = useState<InternalRequestRecord['requestType']>('Employee');
  const [newCategory, setNewCategory] = useState<any>('Salary Certificate');
  const [newTitle, setNewTitle] = useState('');
  const [newEmployeeName, setNewEmployeeName] = useState('Eng. Salim Al-Rawahi');
  const [newEmployeeId, setNewEmployeeId] = useState('EMP-2041');
  const [newDepartment, setNewDepartment] = useState('Operations & Projects');
  const [newBranch, setNewBranch] = useState('Muscat HQ');
  const [newPriority, setNewPriority] = useState<any>('Medium');
  const [newJustification, setNewJustification] = useState('');

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    addInternalRequest({
      requestType: newType,
      category: newCategory,
      title: newTitle,
      requestedBy: newEmployeeName,
      employeeId: newEmployeeId,
      department: newDepartment,
      branch: newBranch,
      priority: newPriority,
      justification: newJustification
    });

    setShowCreateModal(false);
    setNewTitle('');
    setNewJustification('');
  };

  const handleProcessApproval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq) return;

    if (approvalDecision === 'Approve') {
      approveInternalRequest(selectedReq.id, 'Eng. Khalid Al-Amri', approvalComments || 'Approved as per corporate entitlement.');
    } else {
      rejectInternalRequest(selectedReq.id, 'Eng. Khalid Al-Amri', approvalComments || 'Disapproved due to missing documentation.');
    }

    setShowApprovalModal(false);
    setApprovalComments('');
    // refresh selected req
    const updated = internalRequests.find(r => r.id === selectedReq.id);
    if (updated) setSelectedReq(updated);
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
      {/* Top Banner with Navigation Tabs */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              03.04
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Internal Requests & Service Desk</h2>
              <p className="text-xs text-slate-500">Employee certifications, department requisitions, and multi-tier approval authorizations</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>All Requests ({internalRequests.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Pending Approvals ({internalRequests.filter(r => r.status === 'Pending Approval').length})</span>
              </button>
              <button
                onClick={() => setActiveTab('Employee')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'Employee' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>Employee Services</span>
              </button>
              <button
                onClick={() => setActiveTab('Department')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'Department' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building className="w-3.5 h-3.5 text-blue-600" />
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

        {/* Search Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search ticket #, employee, or category..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          <div className="text-xs text-slate-500 hidden sm:block">
            {filteredRequests.length} requests in active view
          </div>
        </div>
      </div>

      {/* Main Grid: Request List + Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5">Ticket #</th>
                  <th className="p-3.5">Category & Title</th>
                  <th className="p-3.5">Requester</th>
                  <th className="p-3.5">Approval Level</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map(req => (
                  <tr
                    key={req.id}
                    onClick={() => setSelectedReq(req)}
                    className={`hover:bg-slate-50/70 cursor-pointer transition-colors ${
                      selectedReq?.id === req.id ? 'bg-indigo-50/40' : ''
                    }`}
                  >
                    <td className="p-3.5 font-mono font-bold text-indigo-700">
                      <div>{req.ticketNumber}</div>
                      <div className="text-[10px] text-slate-400 font-sans">{req.requestDate}</div>
                    </td>
                    <td className="p-3.5 max-w-xs">
                      <div className="font-bold text-slate-900 truncate">{req.title}</div>
                      <div className="text-[11px] text-slate-500">{req.category} • {req.branch}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-slate-800">{req.requestedBy}</div>
                      <div className="text-[10px] text-slate-400">{req.employeeId} ({req.department})</div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-mono text-slate-800 font-semibold">
                        L{req.currentApprovalLevel} / L{req.totalApprovalLevels}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        req.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                        req.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                        req.status === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Detail Pane */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          {selectedReq ? (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-mono text-xs font-bold text-indigo-700">{selectedReq.ticketNumber}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  selectedReq.status === 'Approved' || selectedReq.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                  selectedReq.status === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {selectedReq.status}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{selectedReq.title}</h3>
                <p className="text-slate-600 mt-1 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {selectedReq.justification || 'Standard corporate requisition.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div>
                  <span className="text-slate-400 block">Requested By</span>
                  <span className="font-semibold text-slate-800">{selectedReq.requestedBy}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Department</span>
                  <span className="font-semibold text-slate-800">{selectedReq.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Required By Date</span>
                  <span className="font-semibold text-slate-800">{selectedReq.requiredByDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Priority</span>
                  <span className="font-semibold text-indigo-700">{selectedReq.priority}</span>
                </div>
              </div>

              {/* Approval Hierarchy Chain */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">Multi-Tier Approval Hierarchy</h4>
                <div className="space-y-2">
                  {selectedReq.approvers.map((appr, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">Tier {appr.level}: {appr.role}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          appr.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                          appr.status === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {appr.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        Approver: {appr.approverName} {appr.decisionDate && `• ${appr.decisionDate}`}
                      </div>
                      {appr.comments && (
                        <div className="text-[11px] text-slate-600 bg-white p-1.5 rounded border border-slate-200 mt-1.5 italic">
                          "{appr.comments}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons for Approver */}
              {selectedReq.status === 'Pending Approval' && (
                <div className="pt-3 border-t border-slate-100 flex gap-2">
                  <button
                    onClick={() => {
                      setApprovalDecision('Approve');
                      setShowApprovalModal(true);
                    }}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold cursor-pointer flex items-center justify-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve Request
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
            <div className="flex flex-col items-center justify-center text-center p-8 text-slate-400 my-auto">
              <FileCheck2 className="w-10 h-10 mb-2 stroke-1" />
              <p className="font-semibold text-slate-600">Select a service request</p>
              <p className="text-xs">Review authorization chains, attached justifications, and perform approvals</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Raise Internal Service Request</h3>
            <form onSubmit={handleCreateRequest} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setNewType('Employee');
                    setNewCategory('Salary Certificate');
                  }}
                  className={`py-2 rounded-lg font-semibold cursor-pointer transition-all ${
                    newType === 'Employee' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
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
                    newType === 'Department' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Department Request
                </button>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Request Subject</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder={newType === 'Employee' ? 'e.g. Salary Certificate with Embassy Attestation' : 'e.g. Additional Desk Partitioning for PMO Team'}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  {newType === 'Employee' ? (
                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none"
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
                      className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none"
                    >
                      <option value="Workstation Re-layout">Workstation Re-layout</option>
                      <option value="Office Ergonomic Furniture">Office Ergonomic Furniture</option>
                      <option value="Document Courier Dispatch">Document Courier Dispatch</option>
                      <option value="VIP Meeting Catering">VIP Meeting Catering</option>
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={e => setNewPriority(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none"
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
                  <label className="block text-slate-700 font-semibold mb-1">Requester Name</label>
                  <input
                    type="text"
                    value={newEmployeeName}
                    onChange={e => setNewEmployeeName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Department</label>
                  <input
                    type="text"
                    value={newDepartment}
                    onChange={e => setNewDepartment(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Detailed Justification & Requirements</label>
                <textarea
                  rows={3}
                  value={newJustification}
                  onChange={e => setNewJustification(e.target.value)}
                  placeholder="Provide any specific recipient addresses, purpose, or deadlines..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
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
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              {approvalDecision === 'Approve' ? 'Authorize Service Request' : 'Reject Service Request'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Ticket: <strong className="text-slate-800">{selectedReq?.ticketNumber}</strong> ({selectedReq?.title})
            </p>

            <form onSubmit={handleProcessApproval} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Executive Notes / Approval Comments</label>
                <textarea
                  rows={3}
                  value={approvalComments}
                  onChange={e => setApprovalComments(e.target.value)}
                  placeholder={approvalDecision === 'Approve' ? 'Approved as per group policy...' : 'State reason for rejection...'}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowApprovalModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-white rounded-lg font-semibold cursor-pointer ${
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
