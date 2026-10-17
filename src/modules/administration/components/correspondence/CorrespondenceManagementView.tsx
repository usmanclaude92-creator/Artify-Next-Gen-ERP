import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../services/administrationStore';
import { CorrespondenceRecord, CorrespondenceType, RequestPriority } from '../../types';
import {
  Mail,
  Send,
  Inbox,
  FileText,
  Search,
  Plus,
  Sparkles,
  Paperclip,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Filter,
  Layers,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  FileCheck
} from 'lucide-react';

interface CorrespondenceManagementViewProps {
  activeTab?: string;
}

export const CorrespondenceManagementView: React.FC<CorrespondenceManagementViewProps> = ({ activeTab: initialTab }) => {
  const {
    correspondenceList,
    addCorrespondence,
    updateCorrespondenceStatus,
    classifyCorrespondenceWithAI
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<CorrespondenceType | 'all' | 'tracking'>('all');

  useEffect(() => {
    if (initialTab && ['incoming', 'outgoing', 'internal', 'all', 'tracking'].includes(initialTab)) {
      setActiveTab(initialTab as CorrespondenceType | 'all' | 'tracking');
    }
  }, [initialTab]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<CorrespondenceRecord | null>(null);

  // Registration Modal
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [regType, setRegType] = useState<CorrespondenceType>('incoming');
  const [newSubject, setNewSubject] = useState('');
  const [newSender, setNewSender] = useState('');
  const [newRecipient, setNewRecipient] = useState('');
  const [newCategory, setNewCategory] = useState<any>('Government Decree');
  const [newPriority, setNewPriority] = useState<RequestPriority>('High');
  const [newSummary, setNewSummary] = useState('');
  const [requiresResponse, setRequiresResponse] = useState(true);
  const [aiClassifying, setAiClassifying] = useState(false);

  // AI Classification Trigger
  const handleAiAutoFill = () => {
    if (!newSubject) return;
    setAiClassifying(true);
    setTimeout(() => {
      const result = classifyCorrespondenceWithAI(newSubject, newSummary);
      setNewCategory(result.category);
      setNewPriority(result.priority);
      setNewRecipient(result.suggestedDepartment);
      setAiClassifying(false);
    }, 400);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject) return;

    addCorrespondence({
      type: regType,
      subject: newSubject,
      senderEntity: regType === 'incoming' ? (newSender || 'External Ministry / Partner') : 'Artify Future Generation Group',
      recipientEntity: regType === 'outgoing' ? (newRecipient || 'External Organization') : 'Artify Group',
      recipientDepartment: regType === 'incoming' ? (newRecipient || 'Executive Management') : 'Corporate Directorate',
      category: newCategory,
      priority: newPriority,
      summary: newSummary || newSubject,
      requiresResponse,
      dueDateForResponse: requiresResponse ? new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0] : undefined
    });

    setShowRegisterModal(false);
    setNewSubject('');
    setNewSender('');
    setNewRecipient('');
    setNewSummary('');
  };

  const filteredCorrespondence = correspondenceList.filter(item => {
    const matchesTab = activeTab === 'all' || activeTab === 'tracking' || item.type === activeTab;
    const matchesSearch =
      item.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.senderEntity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.recipientDepartment.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              03.02
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Corporate Correspondence & Digital Mailroom</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Inbound decrees, outbound transmittals, internal circulars, and barcode tracking</p>
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
                <span>All Mail ({correspondenceList.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('incoming')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'incoming' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Incoming</span>
              </button>
              <button
                onClick={() => setActiveTab('outgoing')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'outgoing' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <ArrowUpRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Outgoing</span>
              </button>
              <button
                onClick={() => setActiveTab('internal')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'internal' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Mail className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Internal Memos</span>
              </button>
              <button
                onClick={() => setActiveTab('tracking')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'tracking' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Response Tracking</span>
              </button>
            </div>

            <button
              onClick={() => setShowRegisterModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Correspondence</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search reference #, subject, ministry, or department..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900"
            />
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            Showing {filteredCorrespondence.length} correspondence items
          </div>
        </div>
      </div>

      {/* Main Table View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5">Ref Number</th>
                  <th className="p-3.5">Type & Priority</th>
                  <th className="p-3.5">Subject & Entity</th>
                  <th className="p-3.5">Assigned To</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCorrespondence.map(item => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedRecord(item)}
                    className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/70 cursor-pointer transition-colors ${
                      selectedRecord?.id === item.id ? 'bg-indigo-50/40 dark:bg-indigo-500/40' : ''
                    }`}
                  >
                    <td className="p-3.5 font-mono font-bold text-indigo-700 dark:text-indigo-300">
                      <div>{item.referenceNumber}</div>
                      {item.externalReference && (
                        <div className="text-[10px] font-normal text-slate-500 dark:text-slate-400 font-sans">{item.externalReference}</div>
                      )}
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.type === 'incoming' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200' :
                          item.type === 'outgoing' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-200' :
                          'bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-200'
                        }`}>
                          {item.type}
                        </span>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          item.priority === 'Urgent' ? 'bg-rose-500' :
                          item.priority === 'High' ? 'bg-amber-500' :
                          'bg-slate-400'
                        }`} />
                      </div>
                    </td>
                    <td className="p-3.5 max-w-xs">
                      <div className="font-bold text-slate-900 dark:text-slate-100 truncate">{item.subject}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {item.type === 'incoming' ? `From: ${item.senderEntity}` : `To: ${item.recipientEntity}`}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{item.assignedOwner}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">{item.recipientDepartment}</div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'Closed' ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' :
                        item.status === 'Assigned' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-200' :
                        'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-200'
                      }`}>
                        {item.status}
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
          {selectedRecord ? (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300">{selectedRecord.referenceNumber}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  selectedRecord.confidentialityLevel === 'Confidential' ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-200' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  {selectedRecord.confidentialityLevel}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{selectedRecord.subject}</h3>
                <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  {selectedRecord.summary}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Sender</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedRecord.senderEntity}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Recipient Dept</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedRecord.recipientDepartment}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Date Logged</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedRecord.dateReceivedOrSent}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Response Deadline</span>
                  <span className="font-semibold text-amber-700 dark:text-amber-300">{selectedRecord.dueDateForResponse || 'N/A'}</span>
                </div>
              </div>

              {/* Attachments */}
              {selectedRecord.attachments && selectedRecord.attachments.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Paperclip className="w-3 h-3" /> Attached Scans ({selectedRecord.attachments.length})
                  </h4>
                  <div className="space-y-1">
                    {selectedRecord.attachments.map(att => (
                      <div key={att.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                        <span className="font-mono text-slate-800 dark:text-slate-200 truncate">{att.fileName}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">{att.fileSize}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Audit & Tracking Timeline</h4>
                <div className="space-y-2 relative pl-4 border-l-2 border-slate-200 dark:border-slate-700 text-[11px]">
                  {selectedRecord.timeline.map(t => (
                    <div key={t.id} className="relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-900 border-2 border-white" />
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{t.action}</div>
                      <div className="text-slate-500 dark:text-slate-400 text-[10px]">{t.actor} • {t.timestamp}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                {selectedRecord.status !== 'Closed' && (
                  <button
                    onClick={() => updateCorrespondenceStatus(selectedRecord.id, 'Closed')}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold cursor-pointer text-center"
                  >
                    Mark Responded & Close Ticket
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 text-slate-500 dark:text-slate-400 my-auto">
              <Mail className="w-10 h-10 mb-2 stroke-1" />
              <p className="font-semibold text-slate-600 dark:text-slate-400">Select a correspondence record</p>
              <p className="text-xs">View full OCR summary, attachments, and routing timeline</p>
            </div>
          )}
        </div>
      </div>

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-lg shadow-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Register Official Correspondence</h3>
              <button
                type="button"
                onClick={handleAiAutoFill}
                disabled={!newSubject || aiClassifying}
                className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{aiClassifying ? 'Analyzing...' : 'AI Auto-Classify'}</span>
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-2">
                {(['incoming', 'outgoing', 'internal'] as CorrespondenceType[]).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setRegType(type)}
                    className={`py-2 rounded-lg font-semibold capitalize cursor-pointer transition-all ${
                      regType === type ? 'bg-slate-900 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Subject / Document Title</label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value)}
                  placeholder="e.g. Ministry Decree No. 142/2026 on In-Country Value Compliance"
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    {regType === 'incoming' ? 'Sender Entity' : 'Originating Department'}
                  </label>
                  <input
                    type="text"
                    value={newSender}
                    onChange={e => setNewSender(e.target.value)}
                    placeholder="e.g. Ministry of Commerce"
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    {regType === 'outgoing' ? 'Recipient Entity' : 'Assigned Target Dept'}
                  </label>
                  <input
                    type="text"
                    value={newRecipient}
                    onChange={e => setNewRecipient(e.target.value)}
                    placeholder="e.g. Legal & Corporate Affairs"
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none"
                  >
                    <option value="Government Decree">Government Decree</option>
                    <option value="Commercial Contract">Commercial Contract</option>
                    <option value="Client Inquiry">Client Inquiry</option>
                    <option value="Vendor Notice">Vendor Notice</option>
                    <option value="Audit Request">Audit Request</option>
                    <option value="Internal Memo">Internal Memo</option>
                  </select>
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

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Summary / OCR Key Points</label>
                <textarea
                  rows={3}
                  value={newSummary}
                  onChange={e => setNewSummary(e.target.value)}
                  placeholder="Key decisions, referenced decree numbers, or mandated deadlines..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="respCheck"
                  checked={requiresResponse}
                  onChange={e => setRequiresResponse(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-600"
                />
                <label htmlFor="respCheck" className="text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                  Requires mandatory response (14-day SLA auto-timer)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold cursor-pointer"
                >
                  Log & Index Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
