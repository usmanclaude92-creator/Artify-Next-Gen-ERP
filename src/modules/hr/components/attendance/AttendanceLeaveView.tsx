// ==========================================
// ARTIFY ERP — MODULE 09: HUMAN RESOURCES (HR)
// 09.04: Attendance & Leave View
// (Biometric Attendance, Leave Balances & Approvals, Holidays, Overtime)
// ==========================================

import React, { useState } from 'react';
import { useHrStore } from '../../services/hrStore';
import { AttendanceRecord, LeaveRequest, PublicHoliday, OvertimeClaim, LeaveType, LeaveStatus } from '../../types';
import { ERPRouteState } from '../../../../types/erp';
import {
  Calendar,
  Clock,
  CalendarDays,
  FileText,
  DollarSign,
  Search,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Check,
  X,
  Building,
  User,
  Zap
} from 'lucide-react';

interface AttendanceLeaveViewProps {
  initialTab?: 'attendance' | 'leaves' | 'holidays' | 'overtime';
  onNavigate: (route: ERPRouteState) => void;
}

export const AttendanceLeaveView: React.FC<AttendanceLeaveViewProps> = ({
  initialTab = 'attendance',
  onNavigate
}) => {
  const {
    employees,
    attendanceRecords,
    leaveRequests,
    publicHolidays,
    overtimeClaims,
    logBiometricAttendance,
    submitLeaveRequest,
    updateLeaveRequestStatus,
    addPublicHoliday,
    submitOvertimeClaim,
    updateOvertimeStatus
  } = useHrStore();

  const [activeTab, setActiveTab] = useState<'attendance' | 'leaves' | 'holidays' | 'overtime'>(initialTab);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showOvertimeModal, setShowOvertimeModal] = useState(false);

  // Leave Form State
  const [leaveForm, setLeaveForm] = useState({
    employeeId: employees[0]?.id || '',
    employeeName: employees[0]?.fullName || '',
    department: employees[0]?.department || '',
    leaveType: 'ANNUAL' as LeaveType,
    startDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    totalDays: 4,
    reason: '',
    relieverEmployeeId: '',
    relieverEmployeeName: ''
  });

  // Overtime Form State
  const [otForm, setOtForm] = useState({
    employeeId: employees[0]?.id || '',
    employeeName: employees[0]?.fullName || '',
    department: employees[0]?.department || '',
    date: new Date().toISOString().split('T')[0],
    overtimeType: 'NORMAL_DAY' as const,
    hours: 3.0,
    multiplier: 1.5,
    hourlyRate: 65,
    totalPayable: 292.5,
    currency: 'AED',
    reason: ''
  });

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(x => x.id === leaveForm.employeeId);
    submitLeaveRequest({
      ...leaveForm,
      employeeName: emp?.fullName || leaveForm.employeeName,
      department: emp?.department || leaveForm.department
    });
    setShowLeaveModal(false);
  };

  const handleOtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(x => x.id === otForm.employeeId);
    const total = otForm.hours * otForm.multiplier * otForm.hourlyRate;
    submitOvertimeClaim({
      ...otForm,
      employeeName: emp?.fullName || otForm.employeeName,
      department: emp?.department || otForm.department,
      totalPayable: total
    });
    setShowOvertimeModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Sub-Navigation Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'attendance'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Biometric Attendance ({attendanceRecords.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('leaves')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'leaves'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Leave Applications ({leaveRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('holidays')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'holidays'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Public Holidays ({publicHolidays.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('overtime')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'overtime'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Overtime Sign-Offs ({overtimeClaims.length})</span>
          </button>
        </div>

        {activeTab === 'leaves' && (
          <button
            onClick={() => setShowLeaveModal(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Apply for Leave</span>
          </button>
        )}

        {activeTab === 'overtime' && (
          <button
            onClick={() => setShowOvertimeModal(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Submit OT Claim</span>
          </button>
        )}
      </div>

      {/* TAB 1: ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          {/* Quick Simulation Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-400" />
                Live Biometric Time Log Synchronizer
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Biometric Gate Terminals in Sohar, Dubai HQ, and Riyadh synchronized.</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => logBiometricAttendance(employees[0]?.id || 'EMP-00101', 'CHECK_IN')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Simulate Biometric Check-In</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Employee</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Check-In</th>
                  <th className="py-3 px-3">Check-Out</th>
                  <th className="py-3 px-3">Work Hours</th>
                  <th className="py-3 px-3">Shift</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {attendanceRecords.map(rec => (
                  <tr key={rec.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{rec.employeeName}</div>
                      <div className="text-[11px] text-slate-400">{rec.department}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-200">{rec.date}</td>
                    <td className="py-3 px-3 font-mono text-emerald-400">{rec.checkIn}</td>
                    <td className="py-3 px-3 font-mono text-slate-300">{rec.checkOut}</td>
                    <td className="py-3 px-3 font-bold text-white">{rec.workHours} hrs</td>
                    <td className="py-3 px-3 text-slate-400">{rec.shiftName}</td>
                    <td className="py-3 px-3 text-slate-400">{rec.location}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: LEAVE MANAGEMENT */}
      {activeTab === 'leaves' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leaveRequests.map(leave => (
              <div key={leave.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                        {leave.requestNumber}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1.5">{leave.employeeName}</h4>
                      <p className="text-xs text-slate-400">{leave.department}</p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                      leave.status === 'APPROVED'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : leave.status === 'PENDING_APPROVAL'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {leave.status}
                    </span>
                  </div>

                  <div className="mt-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Leave Type:</span>
                      <span className="font-bold text-rose-400">{leave.leaveType}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Duration:</span>
                      <span className="font-bold text-white">{leave.totalDays} Days ({leave.startDate} to {leave.endDate})</span>
                    </div>
                    {leave.relieverEmployeeName && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Reliever:</span>
                        <span className="text-slate-200">{leave.relieverEmployeeName}</span>
                      </div>
                    )}
                  </div>

                  <p className="mt-3 text-xs text-slate-300 italic">
                    "{leave.reason}"
                  </p>
                </div>

                {leave.status === 'PENDING_APPROVAL' ? (
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2 text-xs">
                    <button
                      onClick={() => updateLeaveRequestStatus(leave.id, 'REJECTED', 'Operational workload constraints.')}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 font-bold flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => updateLeaveRequestStatus(leave.id, 'APPROVED')}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 shadow-md shadow-emerald-600/20"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve Leave</span>
                    </button>
                  </div>
                ) : (
                  <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Approved By: {leave.approvedBy || 'HR Admin'}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PUBLIC HOLIDAYS */}
      {activeTab === 'holidays' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-rose-400" />
              Statutory National & Public Holiday Calendar 2026
            </h3>
            <p className="text-xs text-slate-400 mt-1">Official non-working public holidays observed across GCC operations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {publicHolidays.map(hol => (
              <div key={hol.id} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                    {hol.holidayType}
                  </span>
                  <span className="text-xs text-slate-300 font-bold">{hol.totalDays} Days</span>
                </div>
                <h4 className="text-sm font-bold text-white mt-1">{hol.title}</h4>
                <p className="text-xs text-slate-400">{hol.startDate} to {hol.endDate}</p>
                <div className="pt-2 border-t border-slate-700/60 text-[11px] text-slate-400">
                  Applicable to: <strong className="text-slate-200">{hol.applicableBranches.join(', ')}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: OVERTIME */}
      {activeTab === 'overtime' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-rose-400" />
                Overtime Calculation & Supervisor Sign-Offs
              </h3>
              <p className="text-xs text-slate-400 mt-1">Calculates 1.5x (normal days) and 2.0x (weekend/rest days) rates.</p>
            </div>
          </div>

          <div className="space-y-3">
            {overtimeClaims.map(ot => (
              <div key={ot.id} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                      {ot.claimNumber}
                    </span>
                    <h4 className="text-sm font-bold text-white">{ot.employeeName} ({ot.department})</h4>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Date: <strong>{ot.date}</strong> • Type: <strong>{ot.overtimeType}</strong> • Reason: <em>{ot.reason}</em>
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="text-right">
                    <div className="text-slate-400">{ot.hours}h × {ot.multiplier}x multiplier</div>
                    <div className="text-base font-bold text-emerald-400">{ot.totalPayable.toFixed(2)} {ot.currency}</div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                    ot.status === 'HR_POSTED'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {ot.status}
                  </span>

                  {ot.status === 'SUPERVISOR_APPROVED' && (
                    <button
                      onClick={() => updateOvertimeStatus(ot.id, 'HR_POSTED')}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs"
                    >
                      Post to Payroll
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LEAVE APPLICATION MODAL */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-rose-400" />
                Submit Leave Application
              </h3>
              <button onClick={() => setShowLeaveModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLeaveSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Employee</label>
                <select
                  value={leaveForm.employeeId}
                  onChange={e => setLeaveForm({ ...leaveForm, employeeId: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.fullName} (Balance: {e.leaveBalanceDays}d)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Leave Type</label>
                <select
                  value={leaveForm.leaveType}
                  onChange={e => setLeaveForm({ ...leaveForm, leaveType: e.target.value as LeaveType })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="ANNUAL">Annual Leave</option>
                  <option value="SICK">Sick Leave</option>
                  <option value="EMERGENCY">Emergency / Casual Leave</option>
                  <option value="MATERNITY">Maternity / Paternity Leave</option>
                  <option value="HAJJ_PILGRIMAGE">Hajj Pilgrimage</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.startDate}
                    onChange={e => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.endDate}
                    onChange={e => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Total Days</label>
                <input
                  type="number"
                  min="1"
                  value={leaveForm.totalDays}
                  onChange={e => setLeaveForm({ ...leaveForm, totalDays: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Reason</label>
                <textarea
                  rows={2}
                  required
                  placeholder="State justification..."
                  value={leaveForm.reason}
                  onChange={e => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-rose-600 text-white font-bold"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OVERTIME MODAL */}
      {showOvertimeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-rose-400" />
                Submit Overtime Claim
              </h3>
              <button onClick={() => setShowOvertimeModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleOtSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Employee</label>
                <select
                  value={otForm.employeeId}
                  onChange={e => setOtForm({ ...otForm, employeeId: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.fullName} ({e.department})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Overtime Type</label>
                  <select
                    value={otForm.overtimeType}
                    onChange={e => {
                      const t = e.target.value as any;
                      const mult = t === 'WEEKEND_REST' ? 2.0 : t === 'PUBLIC_HOLIDAY' ? 2.5 : 1.5;
                      setOtForm({ ...otForm, overtimeType: t, multiplier: mult });
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="NORMAL_DAY">Normal Working Day (1.5x)</option>
                    <option value="WEEKEND_REST">Weekend / Rest Day (2.0x)</option>
                    <option value="PUBLIC_HOLIDAY">Public Holiday (2.5x)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Total OT Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={otForm.hours}
                    onChange={e => setOtForm({ ...otForm, hours: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Operational Justification</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Critical valve machining turnaround"
                  value={otForm.reason}
                  onChange={e => setOtForm({ ...otForm, reason: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowOvertimeModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-rose-600 text-white font-bold"
                >
                  Submit OT Sign-Off
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
