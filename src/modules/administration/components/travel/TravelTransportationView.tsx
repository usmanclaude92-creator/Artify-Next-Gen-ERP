import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../services/administrationStore';
import { TravelRequestRecord, VehicleBookingRecord, FleetVehicleRecord } from '../../types';
import { ActorSimulationBar } from '../common/ActorSimulationBar';
import { WorkflowBannerAlert } from '../common/WorkflowBannerAlert';
import {
  Plane,
  Car,
  Compass,
  Calendar,
  Clock,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Fuel,
  Gauge,
  MapPin,
  User,
  ShieldCheck,
  CreditCard,
  ChevronRight,
  Layers,
  GitBranch
} from 'lucide-react';

interface TravelTransportationViewProps {
  activeTab?: string;
}

export const TravelTransportationView: React.FC<TravelTransportationViewProps> = ({ activeTab: initialTab }) => {
  const {
    activeActor,
    travelRequests,
    addTravelRequest,
    approveTravelRequest,
    rejectTravelRequest,
    fleetVehicles,
    vehicleBookings,
    addVehicleBooking,
    updateFleetVehicleStatus,
    formatCurrency
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<'travel' | 'fleet' | 'bookings'>('travel');

  useEffect(() => {
    if (initialTab && ['travel', 'fleet', 'bookings'].includes(initialTab)) {
      setActiveTab(initialTab as 'travel' | 'fleet' | 'bookings');
    }
  }, [initialTab]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTravel, setSelectedTravel] = useState<TravelRequestRecord | null>(null);

  // Modals
  const [showTravelModal, setShowTravelModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Travel Form initialized from activeActor
  const [travelerName, setTravelerName] = useState(activeActor.name);
  const [destinationCity, setDestinationCity] = useState('Salalah');
  const [destinationCountry, setDestinationCountry] = useState('Oman');
  const [travelPurpose, setTravelPurpose] = useState<string>('Project Site Inspection');
  const [departureDate, setDepartureDate] = useState(new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);
  const [returnDate, setReturnDate] = useState(new Date(Date.now() + 86400000 * 6).toISOString().split('T')[0]);
  const [travelClass, setTravelClass] = useState<'Economy' | 'Business' | 'First'>('Business');
  const [flightCost, setFlightCost] = useState(140);
  const [hotelCost, setHotelCost] = useState(210);
  const [perDiem, setPerDiem] = useState(105);
  const [hotelRequired, setHotelRequired] = useState(true);

  // Synchronize defaults when active actor switches
  useEffect(() => {
    setTravelerName(activeActor.name);
  }, [activeActor]);

  // Vehicle Booking Form
  const [bookingPurpose, setBookingPurpose] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(fleetVehicles[0]?.id || '');
  const [pickupLoc, setPickupLoc] = useState('Muscat HQ');
  const [dropoffLoc, setDropoffLoc] = useState('Sohar Industrial Estate');
  const [tripDate, setTripDate] = useState(new Date().toISOString().split('T')[0]);
  const [requiresChauffeur, setRequiresChauffeur] = useState(true);

  const handleCreateTravel = (e: React.FormEvent) => {
    e.preventDefault();
    const res = addTravelRequest({
      travelerName,
      destinationCity,
      destinationCountry,
      travelPurpose: travelPurpose as TravelRequestRecord['travelPurpose'],
      departureDate,
      returnDate,
      travelClass: travelClass === 'Economy' ? 'Economy' : 'Business Class',
      hotelRequired,
      estimatedFlightCostOMR: flightCost,
      estimatedHotelCostOMR: hotelCost,
      perDiemAllowanceOMR: perDiem
    });
    if (res.success) {
      setShowTravelModal(false);
    }
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const veh = fleetVehicles.find(v => v.id === selectedVehicle);
    addVehicleBooking({
      purpose: bookingPurpose || 'Official departmental mission',
      vehicleAssigned: veh ? `${veh.makeModel} (${veh.plateNumber})` : 'Toyota Land Cruiser',
      plateNumber: veh?.plateNumber || '9042-AA',
      pickupLocation: pickupLoc,
      dropoffLocation: dropoffLoc,
      tripStartDate: tripDate,
      tripEndDate: tripDate,
      requiresChauffeur,
      assignedDriver: requiresChauffeur ? 'Abdullah Al-Balushi' : undefined
    });
    setShowBookingModal(false);
    setBookingPurpose('');
  };

  const handleAuthorizeTravel = (travelId: string) => {
    approveTravelRequest(travelId, activeActor);
  };

  const handleRejectTravel = (travelId: string) => {
    rejectTravelRequest(travelId, activeActor);
  };

  const filteredTravel = travelRequests.filter(t =>
    t.travelNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.travelerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.destinationCity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFleet = fleetVehicles.filter(v =>
    v.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.makeModel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBookings = vehicleBookings.filter(b =>
    b.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.requestedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Simulation Bar */}
      <ActorSimulationBar />

      {/* Workflow Notification Banner */}
      <WorkflowBannerAlert />

      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              03.07
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Travel & Corporate Fleet Logistics</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Business travel authorizations, flight & hotel budgets, and motor pool bookings</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('travel')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'travel' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Plane className="w-3.5 h-3.5" />
                <span>Travel Authorizations ({travelRequests.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('fleet')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'fleet' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>Vehicle Fleet ({fleetVehicles.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'bookings' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Pool Bookings ({vehicleBookings.length})</span>
              </button>
            </div>

            {activeTab === 'travel' && (
              <button
                onClick={() => setShowTravelModal(true)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Travel Authorization</span>
              </button>
            )}
            {activeTab === 'bookings' && (
              <button
                onClick={() => setShowBookingModal(true)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Book Fleet Vehicle</span>
              </button>
            )}
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
              placeholder="Search travel #, destination, vehicle plate..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Tab 1: Travel Requests */}
      {activeTab === 'travel' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5">Travel Ref #</th>
                  <th className="p-3.5">Traveler & Dept</th>
                  <th className="p-3.5">Destination & Dates</th>
                  <th className="p-3.5">Workflow Pipeline</th>
                  <th className="p-3.5">Total Budget</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Approval Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTravel.map(trv => (
                  <tr key={trv.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/70">
                    <td className="p-3.5 font-mono font-bold text-indigo-700 dark:text-indigo-300">
                      <div>{trv.travelNumber}</div>
                      {trv.bookingRef && <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300">{trv.bookingRef}</div>}
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{trv.travelerName}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{trv.department}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500 dark:text-slate-400" /> {trv.destinationCity}, {trv.destinationCountry}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{trv.departureDate} → {trv.returnDate}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                        <GitBranch className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                        <span>Tier {trv.currentApprovalLevel || 1} / {trv.totalApprovalLevels || 1}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">{trv.travelClass} Class • {trv.hotelRequired ? 'Hotel' : 'Flight Only'}</div>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrency(trv.totalEstimatedCostOMR)}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        trv.status === 'Approved' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200' :
                        trv.status === 'Rejected' ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-200' :
                        'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-200'
                      }`}>
                        {trv.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {trv.status === 'Pending Approval' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleAuthorizeTravel(trv.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold cursor-pointer shadow-2xs"
                            title={`Authorize as ${activeActor.name}`}
                          >
                            Authorize (Tier {trv.currentApprovalLevel || 1})
                          </button>
                          <button
                            onClick={() => handleRejectTravel(trv.id)}
                            className="px-2 py-1 bg-rose-100 dark:bg-rose-500/20 hover:bg-rose-200 dark:hover:bg-rose-500/30 text-rose-700 dark:text-rose-300 rounded text-[11px] font-semibold cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {trv.approvedBy ? `Approved by ${trv.approvedBy}` : trv.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Vehicle Fleet Inventory */}
      {activeTab === 'fleet' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredFleet.map(veh => (
            <div key={veh.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-extrabold bg-slate-900 text-white px-2 py-0.5 rounded">
                    {veh.plateNumber}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    veh.currentStatus === 'Available' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200' :
                    veh.currentStatus === 'On Mission' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-200' :
                    veh.currentStatus === 'Scheduled Maintenance' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-200' :
                    'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                  }`}>
                    {veh.currentStatus}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{veh.makeModel}</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{veh.vehicleType} • Code: {veh.vehicleCode}</p>

                <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Odometer</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{veh.currentOdometerKm.toLocaleString()} KM</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Assigned Pool</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{veh.assignedBranch}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Last Service</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{veh.lastServiceDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Default Driver</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{veh.defaultDriver || 'Pool'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <button
                  onClick={() => updateFleetVehicleStatus(veh.id, veh.currentStatus === 'Available' ? 'On Mission' : 'Available')}
                  className="w-full py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Toggle Status ({veh.currentStatus === 'Available' ? 'Set Mission' : 'Set Available'})
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Vehicle Bookings */}
      {activeTab === 'bookings' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5">Booking #</th>
                  <th className="p-3.5">Requester & Purpose</th>
                  <th className="p-3.5">Vehicle & Plate</th>
                  <th className="p-3.5">Route</th>
                  <th className="p-3.5">Driver</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredBookings.map(bk => (
                  <tr key={bk.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/70">
                    <td className="p-3.5 font-mono font-bold text-indigo-700 dark:text-indigo-300">{bk.bookingNumber}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{bk.requestedBy}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{bk.purpose}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{bk.vehicleAssigned}</span>
                    </td>
                    <td className="p-3.5">
                      <div className="text-slate-800 dark:text-slate-200">{bk.pickupLocation} → {bk.dropoffLocation}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">{bk.tripStartDate} {bk.tripStartTime}</div>
                    </td>
                    <td className="p-3.5 font-medium">{bk.assignedDriver || 'Self-Driven'}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200">
                        {bk.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Request Travel Modal */}
      {showTravelModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-lg shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">Request Corporate Travel Authorization</h3>
            <form onSubmit={handleCreateTravel} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Traveler Name</label>
                <input
                  type="text"
                  required
                  value={travelerName}
                  onChange={e => setTravelerName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Destination City</label>
                  <input
                    type="text"
                    required
                    value={destinationCity}
                    onChange={e => setDestinationCity(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={destinationCountry}
                    onChange={e => setDestinationCountry(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Departure Date</label>
                  <input
                    type="date"
                    required
                    value={departureDate}
                    onChange={e => setDepartureDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Return Date</label>
                  <input
                    type="date"
                    required
                    value={returnDate}
                    onChange={e => setReturnDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Purpose of Mission</label>
                <textarea
                  rows={2}
                  required
                  value={travelPurpose}
                  onChange={e => setTravelPurpose(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Flight (OMR)</label>
                  <input
                    type="number"
                    value={flightCost}
                    onChange={e => setFlightCost(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Hotel (OMR)</label>
                  <input
                    type="number"
                    value={hotelCost}
                    onChange={e => setHotelCost(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Per Diem (OMR)</label>
                  <input
                    type="number"
                    value={perDiem}
                    onChange={e => setPerDiem(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <span className="font-bold text-slate-800 dark:text-slate-200">Total Estimated Budget:</span>
                <span className="font-mono font-bold text-sm text-indigo-700 dark:text-indigo-300">
                  {formatCurrency(flightCost + hotelCost + perDiem)}
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowTravelModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold cursor-pointer"
                >
                  Submit Travel Authorization
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Book Vehicle Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-lg shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">Book Motor Pool Vehicle</h3>
            <form onSubmit={handleCreateBooking} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Mission Purpose</label>
                <input
                  type="text"
                  required
                  value={bookingPurpose}
                  onChange={e => setBookingPurpose(e.target.value)}
                  placeholder="e.g. VIP Client Escort from MCT Airport to HQ"
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Select Available Fleet Vehicle</label>
                <select
                  value={selectedVehicle}
                  onChange={e => setSelectedVehicle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none"
                >
                  {fleetVehicles.filter(v => v.currentStatus === 'Available').map(v => (
                    <option key={v.id} value={v.id}>
                      {v.makeModel} ({v.plateNumber}) • {v.vehicleType}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Pickup Location</label>
                  <input
                    type="text"
                    required
                    value={pickupLoc}
                    onChange={e => setPickupLoc(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Dropoff Location</label>
                  <input
                    type="text"
                    required
                    value={dropoffLoc}
                    onChange={e => setDropoffLoc(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Trip Date</label>
                  <input
                    type="date"
                    required
                    value={tripDate}
                    onChange={e => setTripDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none"
                  />
                </div>
                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={requiresChauffeur}
                      onChange={e => setRequiresChauffeur(e.target.checked)}
                      className="rounded text-slate-900 dark:text-slate-100 focus:ring-slate-200 dark:focus:ring-slate-900"
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Assign Company Driver</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold cursor-pointer"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
