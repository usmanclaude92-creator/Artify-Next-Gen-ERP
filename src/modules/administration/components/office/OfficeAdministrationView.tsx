import React, { useState } from 'react';
import { useAdmin } from '../../services/administrationStore';
import { OfficeNotice, StationeryRequest, FacilityWorkOrder, OfficeServiceOrder } from '../../types';
import {
  Bell,
  Wrench,
  BookOpen,
  Briefcase,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  User,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  ChevronRight,
  Trash2,
  PackageCheck
} from 'lucide-react';

export const OfficeAdministrationView: React.FC = () => {
  const {
    notices,
    addNotice,
    deleteNotice,
    officeServices,
    addOfficeService,
    updateOfficeServiceStatus,
    stationeryItems,
    stationeryRequests,
    addStationeryRequest,
    issueStationeryRequest,
    facilityWorkOrders,
    addFacilityWorkOrder,
    updateFacilityWorkOrderStatus,
    formatCurrency
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<'notices' | 'services' | 'stationery' | 'facilities'>('notices');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showStationeryModal, setShowStationeryModal] = useState(false);
  const [showFacilityModal, setShowFacilityModal] = useState(false);

  // Form states
  const [newNotice, setNewNotice] = useState<Partial<OfficeNotice>>({
    title: '',
    category: 'General',
    content: '',
    targetAudience: 'All Employees',
    priority: 'Normal',
    isPinned: false
  });

  const [newService, setNewService] = useState<Partial<OfficeServiceOrder>>({
    serviceType: 'Visitor Security Pass',
    title: '',
    department: 'Corporate Administration',
    location: 'Muscat HQ',
    scheduledDate: new Date().toISOString().split('T')[0],
    details: '',
    guestCount: 1
  });

  const [newStationery, setNewStationery] = useState<{
    itemId: string;
    quantity: number;
    purpose: string;
    department: string;
  }>({
    itemId: stationeryItems[0]?.id || '',
    quantity: 1,
    purpose: '',
    department: 'Operations'
  });

  const [newFacilityOrder, setNewFacilityOrder] = useState<Partial<FacilityWorkOrder>>({
    title: '',
    category: 'Workstation & Furniture',
    facilityLocation: 'Muscat HQ — Floor 3',
    department: 'Administration',
    priority: 'Medium',
    description: '',
    estimatedCostOMR: 45
  });

  // Handlers
  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.content) return;
    addNotice(newNotice);
    setShowNoticeModal(false);
    setNewNotice({
      title: '',
      category: 'General',
      content: '',
      targetAudience: 'All Employees',
      priority: 'Normal',
      isPinned: false
    });
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.title) return;
    addOfficeService(newService);
    setShowServiceModal(false);
  };

  const handleCreateStationery = (e: React.FormEvent) => {
    e.preventDefault();
    const item = stationeryItems.find(i => i.id === newStationery.itemId);
    if (!item) return;
    addStationeryRequest({
      department: newStationery.department,
      purpose: newStationery.purpose || 'Departmental routine supplies.',
      totalCostOMR: item.unitCostOMR * newStationery.quantity,
      items: [
        {
          itemId: item.id,
          itemCode: item.itemCode,
          itemName: item.itemName,
          quantityRequested: newStationery.quantity,
          quantityIssued: 0,
          unitCostOMR: item.unitCostOMR
        }
      ]
    });
    setShowStationeryModal(false);
  };

  const handleCreateFacilityOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFacilityOrder.title) return;
    addFacilityWorkOrder(newFacilityOrder);
    setShowFacilityModal(false);
  };

  // Filtered lists
  const filteredNotices = notices.filter(n =>
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredServices = officeServices.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.requestedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStationeryReqs = stationeryRequests.filter(s =>
    s.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.requesterName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFacilities = facilityWorkOrders.filter(f =>
    f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.facilityLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner with Navigation Tabs */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              03.01
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Office Administration & Facility Hub</h2>
              <p className="text-xs text-slate-500">Manage notices, office services, stationery allocation, and facility work orders</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('notices')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'notices' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Bulletins & Notices ({notices.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'services' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Office Services ({officeServices.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('stationery')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'stationery' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Stationery Management ({stationeryItems.length} SKUs)</span>
              </button>
              <button
                onClick={() => setActiveTab('facilities')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'facilities' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Facility Work Orders ({facilityWorkOrders.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search & Action Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search office records..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {activeTab === 'notices' && (
              <button
                onClick={() => setShowNoticeModal(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post Notice</span>
              </button>
            )}
            {activeTab === 'services' && (
              <button
                onClick={() => setShowServiceModal(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Book Service</span>
              </button>
            )}
            {activeTab === 'stationery' && (
              <button
                onClick={() => setShowStationeryModal(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Requisition Stationery</span>
              </button>
            )}
            {activeTab === 'facilities' && (
              <button
                onClick={() => setShowFacilityModal(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Facility Request</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tab 1: Notices & Bulletins */}
      {activeTab === 'notices' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotices.map(notice => (
            <div
              key={notice.id}
              className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                notice.isPinned ? 'border-indigo-300 ring-1 ring-indigo-200' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      notice.priority === 'Critical' ? 'bg-rose-100 text-rose-700' :
                      notice.priority === 'Important' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {notice.category} • {notice.priority}
                    </span>
                    {notice.isPinned && (
                      <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded">Pinned</span>
                    )}
                  </div>
                  <button
                    onClick={() => deleteNotice(notice.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                    title="Delete notice"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug">{notice.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-4 mb-4">{notice.content}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3 h-3" /> {notice.targetAudience}
                </span>
                <span>{notice.publishedDate}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Office Services */}
      {activeTab === 'services' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Office Service Orders Register</h3>
            <span className="text-xs text-slate-500">{filteredServices.length} records</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5">Order No</th>
                  <th className="p-3.5">Service Type</th>
                  <th className="p-3.5">Title / Subject</th>
                  <th className="p-3.5">Requested By</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredServices.map(srv => (
                  <tr key={srv.id} className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-mono font-bold text-indigo-700">{srv.orderNumber}</td>
                    <td className="p-3.5 font-medium">{srv.serviceType}</td>
                    <td className="p-3.5 max-w-xs truncate text-slate-900 font-semibold">{srv.title}</td>
                    <td className="p-3.5">{srv.requestedBy} ({srv.department})</td>
                    <td className="p-3.5">{srv.location}</td>
                    <td className="p-3.5">{srv.scheduledDate}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        srv.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                        srv.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {srv.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {srv.status === 'Submitted' && (
                        <button
                          onClick={() => updateOfficeServiceStatus(srv.id, 'Approved')}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold cursor-pointer"
                        >
                          Approve
                        </button>
                      )}
                      {srv.status === 'Approved' && (
                        <button
                          onClick={() => updateOfficeServiceStatus(srv.id, 'Completed')}
                          className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-semibold cursor-pointer"
                        >
                          Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Stationery Management */}
      {activeTab === 'stationery' && (
        <div className="space-y-6">
          {/* Stock SKUs Inventory */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {stationeryItems.map(item => (
              <div key={item.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mb-1">
                    <span>{item.itemCode}</span>
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded">{item.unitOfMeasure}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2 mb-2">{item.itemName}</h4>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400">Available</p>
                    <p className={`text-sm font-extrabold ${item.availableStock <= item.reorderLevel ? 'text-rose-600' : 'text-slate-900'}`}>
                      {item.availableStock}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400">Unit Cost</p>
                    <p className="text-xs font-bold text-indigo-700">{formatCurrency(item.unitCostOMR)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stationery Requisition List */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Department Stationery Requisitions</h3>
              <span className="text-xs text-slate-500">{filteredStationeryReqs.length} requests</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3.5">Req No</th>
                    <th className="p-3.5">Department / User</th>
                    <th className="p-3.5">Items Requested</th>
                    <th className="p-3.5">Total Cost</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStationeryReqs.map(req => (
                    <tr key={req.id} className="hover:bg-slate-50/50">
                      <td className="p-3.5 font-mono font-bold text-indigo-700">{req.requestNumber}</td>
                      <td className="p-3.5">
                        <span className="font-semibold text-slate-900">{req.requesterName}</span>
                        <div className="text-[11px] text-slate-500">{req.department} • {req.requestDate}</div>
                      </td>
                      <td className="p-3.5">
                        {req.items.map(it => (
                          <div key={it.itemId} className="text-slate-800">
                            • {it.itemName} <span className="font-bold text-indigo-700">({it.quantityRequested} pcs)</span>
                          </div>
                        ))}
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">{formatCurrency(req.totalCostOMR)}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          req.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                          req.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        {req.status === 'Pending Approval' && (
                          <button
                            onClick={() => issueStationeryRequest(req.id, 'Eng. Khalid Al-Amri')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                          >
                            <PackageCheck className="w-3 h-3" />
                            <span>Issue Stock</span>
                          </button>
                        )}
                        {req.status === 'Completed' && (
                          <span className="text-[11px] text-slate-400">Fulfilled by {req.issuedBy}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Facility Work Orders */}
      {activeTab === 'facilities' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Facilities Maintenance Work Orders</h3>
            <span className="text-xs text-slate-500">{filteredFacilities.length} work orders</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5">WO Number</th>
                  <th className="p-3.5">Title & Location</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Priority</th>
                  <th className="p-3.5">Assigned Technician</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFacilities.map(wo => (
                  <tr key={wo.id} className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-mono font-bold text-indigo-700">{wo.workOrderNumber}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{wo.title}</div>
                      <div className="text-[11px] text-slate-500">{wo.facilityLocation}</div>
                    </td>
                    <td className="p-3.5 font-medium">{wo.category}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        wo.priority === 'Urgent' ? 'bg-rose-100 text-rose-800' :
                        wo.priority === 'High' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {wo.priority}
                      </span>
                    </td>
                    <td className="p-3.5">{wo.assignedTechnician || 'Unassigned'}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        wo.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                        wo.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {wo.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {wo.status !== 'Completed' && (
                        <button
                          onClick={() => updateFacilityWorkOrderStatus(wo.id, 'Completed', 'Work inspected and signed off.')}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-semibold cursor-pointer"
                        >
                          Sign Off
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {/* Notice Modal */}
      {showNoticeModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Post Corporate Administrative Bulletin</h3>
            <form onSubmit={handleCreateNotice} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notice Headline</label>
                <input
                  type="text"
                  required
                  value={newNotice.title}
                  onChange={e => setNewNotice({ ...newNotice, title: e.target.value })}
                  placeholder="e.g. Muscat HQ Energy Policy Updates"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    value={newNotice.category}
                    onChange={e => setNewNotice({ ...newNotice, category: e.target.value as any })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none"
                  >
                    <option value="General">General</option>
                    <option value="Security">Security</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Policy">Policy</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Target Audience</label>
                  <select
                    value={newNotice.targetAudience}
                    onChange={e => setNewNotice({ ...newNotice, targetAudience: e.target.value as any })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none"
                  >
                    <option value="All Employees">All Employees</option>
                    <option value="Muscat HQ">Muscat HQ</option>
                    <option value="Sohar Facility">Sohar Facility</option>
                    <option value="Salalah Depot">Salalah Depot</option>
                    <option value="Executives">Executives</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notice Content</label>
                <textarea
                  rows={4}
                  required
                  value={newNotice.content}
                  onChange={e => setNewNotice({ ...newNotice, content: e.target.value })}
                  placeholder="Details of the announcement..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinCheck"
                  checked={newNotice.isPinned}
                  onChange={e => setNewNotice({ ...newNotice, isPinned: e.target.checked })}
                  className="rounded border-slate-300"
                />
                <label htmlFor="pinCheck" className="text-slate-700 font-medium cursor-pointer">
                  Pin this bulletin to the top of the board
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNoticeModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold cursor-pointer"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stationery Requisition Modal */}
      {showStationeryModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Request Stationery Supplies</h3>
            <form onSubmit={handleCreateStationery} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Select Item SKU</label>
                <select
                  value={newStationery.itemId}
                  onChange={e => setNewStationery({ ...newStationery, itemId: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none"
                >
                  {stationeryItems.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.itemName} (Stock: {item.availableStock} {item.unitOfMeasure}) — {formatCurrency(item.unitCostOMR)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Quantity Requested</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={newStationery.quantity}
                    onChange={e => setNewStationery({ ...newStationery, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Department</label>
                  <input
                    type="text"
                    value={newStationery.department}
                    onChange={e => setNewStationery({ ...newStationery, department: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Operational Purpose</label>
                <textarea
                  rows={2}
                  value={newStationery.purpose}
                  onChange={e => setNewStationery({ ...newStationery, purpose: e.target.value })}
                  placeholder="e.g. Preparing tender submission dossiers..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowStationeryModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold cursor-pointer"
                >
                  Submit Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Facility Order Modal */}
      {showFacilityModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Create Facility Maintenance Work Order</h3>
            <form onSubmit={handleCreateFacilityOrder} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Work Order Title</label>
                <input
                  type="text"
                  required
                  value={newFacilityOrder.title}
                  onChange={e => setNewFacilityOrder({ ...newFacilityOrder, title: e.target.value })}
                  placeholder="e.g. AC Thermostat Repair in Level 4 Conference Room"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    value={newFacilityOrder.category}
                    onChange={e => setNewFacilityOrder({ ...newFacilityOrder, category: e.target.value as any })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none"
                  >
                    <option value="HVAC & Climate">HVAC & Climate</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Workstation & Furniture">Workstation & Furniture</option>
                    <option value="Civil & Painting">Civil & Painting</option>
                    <option value="Access & Locks">Access & Locks</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Priority</label>
                  <select
                    value={newFacilityOrder.priority}
                    onChange={e => setNewFacilityOrder({ ...newFacilityOrder, priority: e.target.value as any })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Facility Location</label>
                <input
                  type="text"
                  required
                  value={newFacilityOrder.facilityLocation}
                  onChange={e => setNewFacilityOrder({ ...newFacilityOrder, facilityLocation: e.target.value })}
                  placeholder="e.g. Muscat HQ — Level 4 East Wing"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Fault Description & Scope</label>
                <textarea
                  rows={3}
                  value={newFacilityOrder.description}
                  onChange={e => setNewFacilityOrder({ ...newFacilityOrder, description: e.target.value })}
                  placeholder="Provide complete breakdown of the maintenance required..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowFacilityModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold cursor-pointer"
                >
                  Submit Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
