import React, { useState } from 'react';
import {
  Building,
  MapPin,
  Plus,
  Search,
  Filter,
  Download,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Layers,
  Compass,
  ArrowRight,
  Landmark,
  Building2,
  Eye,
  SlidersHorizontal,
  Check,
  X
} from 'lucide-react';
import { useSystemManagement } from '../services/systemManagementStore';
import { Branch, Location } from '../types';

interface BranchLocationSetupViewProps {
  initialTransactionId?: string;
  initialTransactionCode?: string;
}

export const BranchLocationSetupView: React.FC<BranchLocationSetupViewProps> = ({
  initialTransactionId,
  initialTransactionCode
}) => {
  const {
    companies = [],
    branches = [],
    locations = [],
    addBranch,
    updateBranch,
    addLocation,
    updateLocation
  } = useSystemManagement();

  const [activeTab, setActiveTab] = useState<'branches' | 'locations' | 'sites' | 'assignment'>('branches');

  React.useEffect(() => {
    if (initialTransactionId === 'tx-branch-creation' || initialTransactionCode === '01.01.02.01') {
      setActiveTab('branches');
    } else if (initialTransactionId === 'tx-location-creation' || initialTransactionCode === '01.01.02.02') {
      setActiveTab('locations');
    } else if (initialTransactionId === 'tx-site-creation' || initialTransactionCode === '01.01.02.03') {
      setActiveTab('sites');
    } else if (initialTransactionId === 'tx-branch-location-assign' || initialTransactionCode === '01.01.02.04') {
      setActiveTab('assignment');
    }
  }, [initialTransactionId, initialTransactionCode]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');

  // Branch Modal State
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [branchForm, setBranchForm] = useState({
    code: '',
    name: '',
    companyId: companies?.[0]?.id || 'comp-1',
    locationId: locations?.[0]?.id || 'loc-1',
    manager: '',
    address: '',
    phone: '',
    email: '',
    currency: 'OMR',
    isTaxBranch: true,
    status: 'Active' as const
  });

  // Location Modal State
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [locationForm, setLocationForm] = useState({
    code: '',
    name: '',
    locationType: 'Regional Office' as Location['locationType'],
    companyId: companies[0]?.id || 'comp-1',
    country: 'Oman',
    region: 'Muscat Governorate',
    city: 'Muscat',
    address: '',
    coordinates: '23.5880° N, 58.3829° E',
    status: 'Active' as const
  });

  // Site Creation Modal State
  const [isSiteModalOpen, setIsSiteModalOpen] = useState(false);
  const [siteForm, setSiteForm] = useState({
    code: '',
    name: '',
    locationType: 'Project Site' as Location['locationType'],
    companyId: companies[0]?.id || 'comp-1',
    country: 'Oman',
    region: 'Al Batinah North',
    city: 'Sohar',
    address: 'Sohar Industrial Port Zone, Plot 44B',
    coordinates: '24.3638° N, 56.7447° E',
    status: 'Active' as const
  });

  const handleOpenNewBranch = () => {
    setEditingBranch(null);
    setBranchForm({
      code: `BR-${String(branches.length + 1).padStart(2, '0')}`,
      name: '',
      companyId: companies[0]?.id || 'comp-1',
      locationId: locations[0]?.id || 'loc-1',
      manager: '',
      address: '',
      phone: '+968 ',
      email: '',
      currency: 'OMR',
      isTaxBranch: true,
      status: 'Active'
    });
    setIsBranchModalOpen(true);
  };

  const handleEditBranch = (branch: Branch) => {
    setEditingBranch(branch);
    setBranchForm({
      code: branch.code,
      name: branch.name,
      companyId: branch.companyId,
      locationId: branch.locationId,
      manager: branch.manager,
      address: branch.address,
      phone: branch.phone,
      email: branch.email,
      currency: branch.currency,
      isTaxBranch: branch.isTaxBranch,
      status: branch.status
    });
    setIsBranchModalOpen(true);
  };

  const handleSaveBranch = (e: React.FormEvent) => {
    e.preventDefault();
    const comp = companies.find(c => c.id === branchForm.companyId);
    const loc = locations.find(l => l.id === branchForm.locationId);

    if (editingBranch) {
      updateBranch(editingBranch.id, {
        ...branchForm,
        companyName: comp?.legalName || 'Unknown Company',
        locationName: loc?.name || 'Unknown Location'
      });
    } else {
      addBranch({
        ...branchForm,
        companyName: comp?.legalName || 'Unknown Company',
        locationName: loc?.name || 'Unknown Location'
      });
    }
    setIsBranchModalOpen(false);
  };

  const handleOpenNewLocation = (type: Location['locationType'] = 'Regional Office') => {
    setEditingLocation(null);
    setLocationForm({
      code: `LOC-${String(locations.length + 1).padStart(3, '0')}`,
      name: '',
      locationType: type,
      companyId: companies[0]?.id || 'comp-1',
      country: 'Oman',
      region: 'Muscat',
      city: 'Muscat',
      address: '',
      coordinates: '23.5880° N, 58.3829° E',
      status: 'Active'
    });
    setIsLocationModalOpen(true);
  };

  const handleEditLocation = (loc: Location) => {
    setEditingLocation(loc);
    setLocationForm({
      code: loc.code,
      name: loc.name,
      locationType: loc.locationType,
      companyId: loc.companyId,
      country: loc.country,
      region: loc.region,
      city: loc.city,
      address: loc.address,
      coordinates: loc.coordinates,
      status: loc.status
    });
    setIsLocationModalOpen(true);
  };

  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault();
    const comp = companies.find(c => c.id === locationForm.companyId);
    if (editingLocation) {
      updateLocation(editingLocation.id, {
        ...locationForm,
        companyName: comp?.legalName || 'Unknown Company'
      });
    } else {
      addLocation({
        ...locationForm,
        companyName: comp?.legalName || 'Unknown Company'
      });
    }
    setIsLocationModalOpen(false);
  };

  const filteredBranches = branches.filter(b => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.manager.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCompany = selectedCompanyFilter === 'ALL' || b.companyId === selectedCompanyFilter;
    const matchesStatus = selectedStatusFilter === 'ALL' || b.status === selectedStatusFilter;
    return matchesSearch && matchesCompany && matchesStatus;
  });

  const filteredLocations = locations.filter(l => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCompany = selectedCompanyFilter === 'ALL' || l.companyId === selectedCompanyFilter;
    const matchesStatus = selectedStatusFilter === 'ALL' || l.status === selectedStatusFilter;
    return matchesSearch && matchesCompany && matchesStatus;
  });

  const siteLocations = filteredLocations.filter(
    l => l.locationType === 'Project Site' || l.locationType === 'Warehouse' || l.locationType === 'Factory / Plant' || l.locationType === 'Yard'
  );

  return (
    <div id="branch-location-setup-view" className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/80 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 font-semibold border border-sky-200 dark:border-sky-800">
                  01.01.02
                </span>
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Branch & Location Setup
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
                  Network Active
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
                Manage corporate operating branches, geographical facilities, warehouse and project sites, and cross-branch location mapping.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {activeTab === 'branches' && (
              <button
                onClick={handleOpenNewBranch}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Branch</span>
              </button>
            )}
            {activeTab === 'locations' && (
              <button
                onClick={() => handleOpenNewLocation('Regional Office')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Location</span>
              </button>
            )}
            {activeTab === 'sites' && (
              <button
                onClick={() => handleOpenNewLocation('Project Site')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Project Site</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 mt-6 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('branches')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'branches'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>01.01.02.01 Branch Creation ({branches.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('locations')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'locations'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>01.01.02.02 Location Creation ({locations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sites')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'sites'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>01.01.02.03 Site Creation ({siteLocations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('assignment')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'assignment'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>01.01.02.04 Branch/Location Assignment</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search code, name, city, manager..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Company:</span>
            <select
              value={selectedCompanyFilter}
              onChange={e => setSelectedCompanyFilter(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
            >
              <option value="ALL">All Legal Entities</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.legalName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Status:</span>
            <select
              value={selectedStatusFilter}
              onChange={e => setSelectedStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tab 1: Branches Table */}
      {activeTab === 'branches' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Building className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Operational Branches Master</span>
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                ({filteredBranches.length} entries)
              </span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3">Branch Code & Name</th>
                  <th className="px-4 py-3">Legal Company</th>
                  <th className="px-4 py-3">Primary Location</th>
                  <th className="px-4 py-3">Branch Manager</th>
                  <th className="px-4 py-3">Tax / Currency</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredBranches.map(branch => (
                  <tr
                    key={branch.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/80 flex items-center justify-center text-sky-700 dark:text-sky-300 font-bold font-mono text-xs">
                          {branch.code}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 dark:text-slate-100 block">
                            {branch.name}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                            {branch.phone || branch.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-900 dark:text-slate-100">
                      {branch.companyName}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{branch.locationName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-800 dark:text-slate-200">
                      {branch.manager}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                          {branch.currency}
                        </span>
                        {branch.isTaxBranch && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
                            VAT Branch
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          branch.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                            : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                        }`}
                      >
                        {branch.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => handleEditBranch(branch)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                        title="Edit Branch"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Locations Table */}
      {activeTab === 'locations' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Physical Locations & Facilities Master</span>
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                ({filteredLocations.length} entries)
              </span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3">Location Code & Name</th>
                  <th className="px-4 py-3">Facility Type</th>
                  <th className="px-4 py-3">Legal Entity</th>
                  <th className="px-4 py-3">City & Region</th>
                  <th className="px-4 py-3">GPS Coordinates</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredLocations.map(loc => (
                  <tr
                    key={loc.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold font-mono text-xs">
                          {loc.code}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 dark:text-slate-100 block">
                            {loc.name}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {loc.address}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                        {loc.locationType}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-900 dark:text-slate-100">
                      {loc.companyName}
                    </td>
                    <td className="px-4 py-3.5 text-slate-700 dark:text-slate-300">
                      {loc.city}, {loc.region}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      {loc.coordinates}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          loc.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                            : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                        }`}
                      >
                        {loc.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => handleEditLocation(loc)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                        title="Edit Location"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Site Creation Table */}
      {activeTab === 'sites' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Project Sites & Industrial Yards</span>
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                  ({siteLocations.length} active sites)
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Construction project sites, manufacturing plants, storage depots, and industrial logistics yards.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {siteLocations.map(site => (
              <div
                key={site.id}
                className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold font-mono text-xs">
                      {site.code}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                        {site.name}
                      </h4>
                      <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                        {site.locationType}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold">
                    {site.status}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-700/60 text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Company:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{site.companyName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Zone / City:</span>
                    <span className="text-slate-800 dark:text-slate-200">{site.city}, {site.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Coordinates:</span>
                    <span className="font-mono text-[10px] text-slate-500">{site.coordinates}</span>
                  </div>
                </div>

                <div className="mt-4 pt-2 flex justify-end">
                  <button
                    onClick={() => handleEditLocation(site)}
                    className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Edit Site Config</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Branch/Location Assignment Matrix */}
      {activeTab === 'assignment' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs p-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Branch to Physical Location Assignment Matrix</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Cross-entity assignment map determining which legal branches own, operate, or share physical facilities across the corporate group.
            </p>
          </div>

          <div className="space-y-4">
            {branches.map(branch => {
              const assignedLoc = locations.find(l => l.id === branch.locationId);
              return (
                <div
                  key={branch.id}
                  className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center font-mono font-bold text-indigo-700 dark:text-indigo-300 text-xs">
                      {branch.code}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                          {branch.name}
                        </h4>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          ({branch.companyName})
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Manager: <strong className="text-slate-700 dark:text-slate-300">{branch.manager}</strong> • Currency: <span className="font-mono font-bold">{branch.currency}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                        Assigned Operating Facility:
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 justify-end">
                        <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        {assignedLoc ? assignedLoc.name : 'Central Headquarters'}
                      </span>
                    </div>

                    <button
                      onClick={() => handleEditBranch(branch)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-200 dark:border-indigo-800 transition-colors cursor-pointer"
                    >
                      Reassign
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Branch Modal */}
      {isBranchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-600" />
                <span>{editingBranch ? 'Edit Branch' : 'Create Operational Branch'}</span>
              </h3>
              <button
                onClick={() => setIsBranchModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBranch} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Branch Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={branchForm.code}
                    onChange={e => setBranchForm({ ...branchForm, code: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Branch Currency *
                  </label>
                  <select
                    value={branchForm.currency}
                    onChange={e => setBranchForm({ ...branchForm, currency: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
                  >
                    <option value="OMR">OMR - Omani Rial</option>
                    <option value="AED">AED - UAE Dirham</option>
                    <option value="SAR">SAR - Saudi Riyal</option>
                    <option value="USD">USD - US Dollar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Branch Name *
                </label>
                <input
                  type="text"
                  required
                  value={branchForm.name}
                  onChange={e => setBranchForm({ ...branchForm, name: e.target.value })}
                  placeholder="e.g. Muscat Regional Hub"
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Legal Company *
                  </label>
                  <select
                    value={branchForm.companyId}
                    onChange={e => setBranchForm({ ...branchForm, companyId: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
                  >
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.code} - {c.legalName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Primary Facility *
                  </label>
                  <select
                    value={branchForm.locationId}
                    onChange={e => setBranchForm({ ...branchForm, locationId: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
                  >
                    {locations.map(l => (
                      <option key={l.id} value={l.id}>
                        {l.code} - {l.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Branch Manager
                  </label>
                  <input
                    type="text"
                    value={branchForm.manager}
                    onChange={e => setBranchForm({ ...branchForm, manager: e.target.value })}
                    placeholder="e.g. Tariq Al-Said"
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={branchForm.phone}
                    onChange={e => setBranchForm({ ...branchForm, phone: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={branchForm.isTaxBranch}
                    onChange={e => setBranchForm({ ...branchForm, isTaxBranch: e.target.checked })}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    Registered Tax / VAT Reporting Branch
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsBranchModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs cursor-pointer"
                >
                  {editingBranch ? 'Update Branch' : 'Save Branch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Location Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-600" />
                <span>{editingLocation ? 'Edit Facility Location' : 'Create Physical Location / Site'}</span>
              </h3>
              <button
                onClick={() => setIsLocationModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLocation} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Location Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={locationForm.code}
                    onChange={e => setLocationForm({ ...locationForm, code: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Facility Type *
                  </label>
                  <select
                    value={locationForm.locationType}
                    onChange={e => setLocationForm({ ...locationForm, locationType: e.target.value as any })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
                  >
                    <option value="Headquarters">Headquarters</option>
                    <option value="Regional Office">Regional Office</option>
                    <option value="Factory / Plant">Factory / Plant</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Project Site">Project Site</option>
                    <option value="Yard">Yard / Depot</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Location / Facility Name *
                </label>
                <input
                  type="text"
                  required
                  value={locationForm.name}
                  onChange={e => setLocationForm({ ...locationForm, name: e.target.value })}
                  placeholder="e.g. Sohar Industrial Plant 2"
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    City & Region *
                  </label>
                  <input
                    type="text"
                    required
                    value={locationForm.city}
                    onChange={e => setLocationForm({ ...locationForm, city: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    required
                    value={locationForm.country}
                    onChange={e => setLocationForm({ ...locationForm, country: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Physical Address
                </label>
                <input
                  type="text"
                  value={locationForm.address}
                  onChange={e => setLocationForm({ ...locationForm, address: e.target.value })}
                  placeholder="Street, Industrial Zone, Way No."
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsLocationModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-lg shadow-xs cursor-pointer"
                >
                  {editingLocation ? 'Update Location' : 'Save Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
