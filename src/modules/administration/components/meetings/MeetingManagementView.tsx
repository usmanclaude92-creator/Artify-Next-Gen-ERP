import React, { useState } from 'react';
import { useAdmin } from '../../services/administrationStore';
import { MeetingRecord, MeetingActionItem } from '../../types';
import {
  Users,
  Video,
  MapPin,
  Calendar,
  Clock,
  FileText,
  Plus,
  Search,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ListOrdered,
  ChevronRight,
  Send,
  AlertCircle
} from 'lucide-react';

export const MeetingManagementView: React.FC = () => {
  const {
    meetings,
    addMeeting,
    updateMeetingMoM,
    convertMoMActionToTask
  } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingRecord | null>(meetings[0] || null);

  // Modals
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showMoMEditorModal, setShowMoMEditorModal] = useState(false);

  // New Meeting Form
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<MeetingRecord['meetingType']>('Department Operational');
  const [newOrganizer, setNewOrganizer] = useState('Eng. Khalid Al-Amri');
  const [newRoom, setNewRoom] = useState('Muscat HQ — Boardroom Alpha');
  const [isVirtual, setIsVirtual] = useState(false);
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newStartTime, setNewStartTime] = useState('10:00 AM');
  const [newEndTime, setNewEndTime] = useState('11:30 AM');
  const [newAgenda, setNewAgenda] = useState<string[]>(['Review project progress', 'Budget & resource allocation']);

  // MoM Form
  const [momText, setMomText] = useState('');
  const [momDecisions, setMomDecisions] = useState<string[]>([]);
  const [momActions, setMomActions] = useState<MeetingActionItem[]>([]);
  const [newDecisionInput, setNewDecisionInput] = useState('');
  const [newActionDesc, setNewActionDesc] = useState('');
  const [newActionOwner, setNewActionOwner] = useState('Eng. Salim Al-Rawahi');
  const [newActionDueDate, setNewActionDueDate] = useState(new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0]);

  const handleOpenMoMEditor = (mtg: MeetingRecord) => {
    setSelectedMeeting(mtg);
    setMomText(mtg.minutesOfMeeting || 'Official Minutes of Meeting record.\n\nKey discussion points:\n1. Operational highlights reviewed.\n2. Milestone progress approved.');
    setMomDecisions(mtg.decisions || []);
    setMomActions(mtg.actionItems || []);
    setShowMoMEditorModal(true);
  };

  const handleSaveMoM = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMeeting) return;
    updateMeetingMoM(selectedMeeting.id, momText, momDecisions, momActions);
    setShowMoMEditorModal(false);
    // Refresh selected meeting view
    const updated = meetings.find(m => m.id === selectedMeeting.id);
    if (updated) setSelectedMeeting({ ...updated, minutesOfMeeting: momText, decisions: momDecisions, actionItems: momActions });
  };

  const handleAddDecision = () => {
    if (!newDecisionInput) return;
    setMomDecisions([...momDecisions, newDecisionInput]);
    setNewDecisionInput('');
  };

  const handleAddAction = () => {
    if (!newActionDesc) return;
    const newAct: MeetingActionItem = {
      id: `act-${Date.now()}`,
      actionDescription: newActionDesc,
      responsiblePerson: newActionOwner,
      dueDate: newActionDueDate,
      priority: 'High',
      status: 'Open'
    };
    setMomActions([...momActions, newAct]);
    setNewActionDesc('');
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    addMeeting({
      title: newTitle,
      meetingType: newType,
      organizerName: newOrganizer,
      locationOrRoom: newRoom,
      isVirtual,
      meetingDate: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
      agenda: newAgenda.filter(Boolean).map((title, i) => ({
        id: `ag-${i}`,
        orderNumber: i + 1,
        title,
        allocatedMinutes: 20
      }))
    });

    setShowScheduleModal(false);
    setNewTitle('');
  };

  const filteredMeetings = meetings.filter(m =>
    m.meetingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.organizerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              03.06
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Corporate Meeting & MoM Management</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Board meetings, room bookings, structured Minutes of Meeting (MoM), and actionable task routing</p>
            </div>
          </div>

          <button
            onClick={() => setShowScheduleModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs self-start md:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Meeting</span>
          </button>
        </div>

        {/* Search */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search meeting #, title, or organizer..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900"
            />
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            {filteredMeetings.length} meetings scheduled on corporate calendar
          </div>
        </div>
      </div>

      {/* Main Grid: Meeting List & MoM Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Meeting Roster */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider px-1">Meeting Schedule</h3>
          <div className="space-y-2">
            {filteredMeetings.map(mtg => (
              <div
                key={mtg.id}
                onClick={() => setSelectedMeeting(mtg)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedMeeting?.id === mtg.id ? 'bg-indigo-50/60 dark:bg-indigo-500/60 border-indigo-300 dark:border-indigo-500/40 ring-1 ring-indigo-200 dark:ring-indigo-500/30' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] mb-1.5">
                  <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300">{mtg.meetingNumber}</span>
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    mtg.status === 'Completed' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200' : 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-200'
                  }`}>
                    {mtg.status}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug mb-1">{mtg.title}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-2">
                  <Calendar className="w-3 h-3" /> {mtg.meetingDate} • {mtg.startTime}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-1 truncate">
                    {mtg.isVirtual ? <Video className="w-3 h-3 text-blue-600 dark:text-blue-400" /> : <MapPin className="w-3 h-3 text-slate-500 dark:text-slate-400" />}
                    <span className="truncate max-w-[140px]">{mtg.locationOrRoom}</span>
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{mtg.participants.length} Attendees</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Selected Meeting Detail & MoM Record */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-2xs flex flex-col justify-between">
          {selectedMeeting ? (
            <div className="space-y-6 text-xs">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300">{selectedMeeting.meetingNumber}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {selectedMeeting.meetingType}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{selectedMeeting.title}</h3>
                </div>

                <button
                  onClick={() => handleOpenMoMEditor(selectedMeeting)}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs self-start"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{selectedMeeting.minutesOfMeeting ? 'Edit Minutes & Actions' : 'Record MoM & Actions'}</span>
                </button>
              </div>

              {/* Timing & Location */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Date & Time</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedMeeting.meetingDate}</span>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{selectedMeeting.startTime} - {selectedMeeting.endTime}</div>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Location / Link</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedMeeting.locationOrRoom}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Organizer</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedMeeting.organizerName}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Participants</span>
                  <span className="font-bold text-indigo-700 dark:text-indigo-300">{selectedMeeting.participants.length} Confirmed</span>
                </div>
              </div>

              {/* Agenda Topics */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-2">Meeting Agenda</h4>
                <div className="space-y-1.5">
                  {selectedMeeting.agenda.map((item, idx) => (
                    <div key={item.id || idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {item.orderNumber}. {item.title}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{item.allocatedMinutes} mins</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Formal Decisions */}
              {selectedMeeting.decisions && selectedMeeting.decisions.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-2">Formal Decisions Adopted</h4>
                  <div className="space-y-1.5">
                    {selectedMeeting.decisions.map((dec, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-500/50 border border-emerald-200 dark:border-emerald-500/30">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-slate-800 dark:text-slate-200 font-medium">{dec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Items & 1-Click Conversion to Enterprise Tasks */}
              {selectedMeeting.actionItems && selectedMeeting.actionItems.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-2">
                    Action Items Tracker ({selectedMeeting.actionItems.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedMeeting.actionItems.map(action => (
                      <div key={action.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100">{action.actionDescription}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            Responsible: <strong className="text-slate-700 dark:text-slate-300">{action.responsiblePerson}</strong> • Due: {action.dueDate}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {action.status === 'Transferred to Task' ? (
                            <span className="px-2 py-1 rounded text-[10px] font-bold bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-200">
                              ✓ Transferred to Task Engine
                            </span>
                          ) : (
                            <button
                              onClick={() => convertMoMActionToTask(selectedMeeting.id, action.id)}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <span>Convert to Task</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Minutes of Meeting Text */}
              {selectedMeeting.minutesOfMeeting && (
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-2">Minutes of Meeting (MoM)</h4>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-sans text-xs">
                    {selectedMeeting.minutesOfMeeting}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-12 text-slate-500 dark:text-slate-400 my-auto">
              <Users className="w-12 h-12 mb-3 stroke-1" />
              <p className="font-semibold text-slate-600 dark:text-slate-400">Select a meeting from the schedule</p>
              <p className="text-xs">View agendas, formal decisions, and manage Minutes of Meeting</p>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Meeting Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-lg shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">Schedule Corporate Meeting</h3>
            <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Meeting Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Q3 Commercial Execution & EPC Strategy Review"
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Meeting Type</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none"
                  >
                    <option value="Board Meeting">Board Meeting</option>
                    <option value="Executive Committee">Executive Committee</option>
                    <option value="Department Operational">Department Operational</option>
                    <option value="Project Review">Project Review</option>
                    <option value="Vendor Negotiation">Vendor Negotiation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Organizer</label>
                  <input
                    type="text"
                    value={newOrganizer}
                    onChange={e => setNewOrganizer(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Start Time</label>
                  <input
                    type="text"
                    value={newStartTime}
                    onChange={e => setNewStartTime(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">End Time</label>
                  <input
                    type="text"
                    value={newEndTime}
                    onChange={e => setNewEndTime(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Room / Facility Location</label>
                <input
                  type="text"
                  value={newRoom}
                  onChange={e => setNewRoom(e.target.value)}
                  placeholder="e.g. Muscat HQ — Boardroom Alpha"
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold cursor-pointer"
                >
                  Schedule & Send Invites
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MoM Editor Modal */}
      {showMoMEditorModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-2xl shadow-xl border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">Record Minutes of Meeting (MoM)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{selectedMeeting?.title}</p>

            <form onSubmit={handleSaveMoM} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Minutes Summary & Key Discussion Notes</label>
                <textarea
                  rows={4}
                  value={momText}
                  onChange={e => setMomText(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none"
                />
              </div>

              {/* Decisions Box */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Formal Resolutions & Decisions</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newDecisionInput}
                    onChange={e => setNewDecisionInput(e.target.value)}
                    placeholder="Enter approved resolution..."
                    className="flex-1 p-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddDecision}
                    className="px-3 py-2 bg-slate-900 text-white rounded-lg font-semibold cursor-pointer"
                  >
                    Add Decision
                  </button>
                </div>
                <div className="space-y-1">
                  {momDecisions.map((dec, i) => (
                    <div key={i} className="p-2 rounded bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                      • {dec}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions Box */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Action Items & Deliverables</label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <input
                    type="text"
                    value={newActionDesc}
                    onChange={e => setNewActionDesc(e.target.value)}
                    placeholder="Action item description..."
                    className="col-span-2 p-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={newActionOwner}
                    onChange={e => setNewActionOwner(e.target.value)}
                    placeholder="Responsible Person"
                    className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddAction}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg font-semibold cursor-pointer mb-2"
                >
                  + Add Action Item
                </button>
                <div className="space-y-1">
                  {momActions.map((act, i) => (
                    <div key={i} className="p-2 rounded bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{act.actionDescription}</span>
                      <span className="text-slate-500 dark:text-slate-400 font-mono">Assigned: {act.responsiblePerson}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowMoMEditorModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold cursor-pointer"
                >
                  Save Official MoM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
