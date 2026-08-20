import React, { useState } from 'react';
import { useAdmin } from '../../services/administrationStore';
import { GeneralServiceRequest, ServiceVendorRecord, OfficeAssetRecord } from '../../types';
import {
  Sparkles,
  Store,
  Armchair,
  CheckCircle2,
  Plus,
  Search,
  Filter,
  Layers,
  Star,
  Phone,
  Mail,
  Building,
  Tag,
  Clock,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const GeneralBusinessServicesView: React.FC = () => {
  const {
    generalServices,
    addGeneralService,
    updateGeneralServiceStatus,
    serviceVendors,
    officeAssets,
    addOfficeAsset,
    formatCurrency
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<'services' | 'vendors' | 'assets'>('services');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);

  // Service Form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<any>('Office Interior & Relocation');
  const [newLocation, setNewLocation] = useState('Muscat HQ');
  const [newBudget, setNewBudget] = useState(300);
  const [newScope, setNewScope] = useState('');

  // Asset Form
  const [assetName, setAssetName] = useState('');
  const [assetCategory, setAssetCategory] = useState('Office Furniture');
  const [assetRoom, setAssetRoom] = useState('Muscat HQ — Executive Wing');
  const [assetCustodian, setAssetCustodian] = useState('Eng. Khalid Al-Amri');
  const [assetValue, setAssetValue] = useState(220);

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    addGeneralService({
      title: newTitle,
      serviceCategory: newCategory,
      location: newLocation,
      estimatedBudgetOMR: newBudget,
      scopeOfWork: newScope
    });

    setShowServiceModal(false);
    setNewTitle('');
    setNewScope('');
  };

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetName) return;

    addOfficeAsset({
      itemName: assetName,
      category: assetCategory,
      locationRoom: assetRoom,
      custodianEmployee: assetCustodian,
      purchaseValueOMR: assetValue
    });

    setShowAssetModal(false);
    setAssetName('');
  };

  const filteredServices = generalServices.filter(s =>
    s.serviceRequestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.serviceCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVendors = serviceVendors.filter(v =>
    v.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.serviceCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAssets = officeAssets.filter(a =>
    a.assetTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.locationRoom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              03.08
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">General Business Services & Office Assets</h2>
              <p className="text-xs text-slate-500">Corporate facility fit-outs, accredited service vendors, and asset tagging</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('services')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'services' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Service Requests ({generalServices.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('vendors')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'vendors' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Approved Vendors ({serviceVendors.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('assets')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'assets' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Armchair className="w-3.5 h-3.5" />
                <span>Office Assets ({officeAssets.length})</span>
              </button>
            </div>

            {activeTab === 'services' && (
              <button
                onClick={() => setShowServiceModal(true)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Service Requisition</span>
              </button>
            )}
            {activeTab === 'assets' && (
              <button
                onClick={() => setShowAssetModal(true)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Register Office Asset</span>
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search service, vendor, or asset tag..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Tab 1: General Services */}
      {activeTab === 'services' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5">Requisition #</th>
                  <th className="p-3.5">Category & Title</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">Assigned Vendor</th>
                  <th className="p-3.5">Budget</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredServices.map(srv => (
                  <tr key={srv.id} className="hover:bg-slate-50/70">
                    <td className="p-3.5 font-mono font-bold text-indigo-700">{srv.serviceRequestNumber}</td>
                    <td className="p-3.5 max-w-xs">
                      <div className="font-bold text-slate-900 truncate">{srv.title}</div>
                      <div className="text-[11px] text-slate-500">{srv.serviceCategory}</div>
                    </td>
                    <td className="p-3.5 font-medium">{srv.location}</td>
                    <td className="p-3.5 font-medium">{srv.vendorAssigned || 'In Tendering'}</td>
                    <td className="p-3.5 font-mono font-bold text-slate-900">{formatCurrency(srv.estimatedBudgetOMR)}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        srv.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                        srv.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {srv.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {srv.status !== 'Completed' && (
                        <button
                          onClick={() => updateGeneralServiceStatus(srv.id, 'Completed')}
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

      {/* Tab 2: Service Vendors */}
      {activeTab === 'vendors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVendors.map(ven => (
            <div key={ven.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    Code: {ven.vendorCode}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{ven.serviceRating} / 5.0</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-1">{ven.vendorName}</h3>
                <p className="text-[11px] text-slate-500">{ven.serviceCategory}</p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Contact</span>
                    <span className="font-semibold text-slate-800">{ven.contactPerson}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Phone</span>
                    <span className="font-mono text-slate-800">{ven.contactPhone}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Contract Expiry</span>
                    <span className="font-semibold text-emerald-700">{ven.contractEndDate}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Annual: {formatCurrency(ven.annualValueOMR)}</span>
                <span className="text-indigo-600 font-semibold">{ven.slaCompliancePercent}% SLA Health</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Office Assets */}
      {activeTab === 'assets' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5">Asset Tag</th>
                  <th className="p-3.5">Item Name & Category</th>
                  <th className="p-3.5">Location & Room</th>
                  <th className="p-3.5">Custodian</th>
                  <th className="p-3.5">Value (OMR)</th>
                  <th className="p-3.5">Condition</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAssets.map(ast => (
                  <tr key={ast.id} className="hover:bg-slate-50/70">
                    <td className="p-3.5 font-mono font-bold text-indigo-700">{ast.assetTag}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{ast.itemName}</div>
                      <div className="text-[10px] text-slate-400 font-sans">{ast.category}</div>
                    </td>
                    <td className="p-3.5 font-medium">{ast.locationRoom}</td>
                    <td className="p-3.5">{ast.custodianEmployee}</td>
                    <td className="p-3.5 font-mono font-bold text-slate-900">{formatCurrency(ast.purchaseValueOMR)}</td>
                    <td className="p-3.5 font-medium">{ast.condition}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {ast.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Raise General Service Requisition</h3>
            <form onSubmit={handleCreateService} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Executive Boardroom Acoustic Wall Cladding"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none"
                  >
                    <option value="Office Interior & Relocation">Office Interior & Relocation</option>
                    <option value="Pest Control & Sanitization">Pest Control & Sanitization</option>
                    <option value="Deep Carpet & HVAC Cleaning">Deep Carpet & HVAC Cleaning</option>
                    <option value="Waste Management & Recycling">Waste Management & Recycling</option>
                    <option value="Security Guard Services">Security Guard Services</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Estimated Budget (OMR)</label>
                <input
                  type="number"
                  value={newBudget}
                  onChange={e => setNewBudget(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Scope of Work</label>
                <textarea
                  rows={3}
                  value={newScope}
                  onChange={e => setNewScope(e.target.value)}
                  placeholder="Detailed specifications and vendor requirements..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowServiceModal(false)}
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

      {/* Asset Modal */}
      {showAssetModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Register Administrative Office Asset</h3>
            <form onSubmit={handleCreateAsset} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Asset / Furnishing Name</label>
                <input
                  type="text"
                  required
                  value={assetName}
                  onChange={e => setAssetName(e.target.value)}
                  placeholder="e.g. Ergonomic Executive Leather Chair"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Location / Room</label>
                  <input
                    type="text"
                    value={assetRoom}
                    onChange={e => setAssetRoom(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Value (OMR)</label>
                  <input
                    type="number"
                    value={assetValue}
                    onChange={e => setAssetValue(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Custodian Employee</label>
                <input
                  type="text"
                  value={assetCustodian}
                  onChange={e => setAssetCustodian(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAssetModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold cursor-pointer"
                >
                  Register Asset Tag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
