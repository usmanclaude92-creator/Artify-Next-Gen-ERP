import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../services/administrationStore';
import { DocumentRecord, DocumentVersion } from '../../types';
import {
  Folder,
  FileText,
  Lock,
  Unlock,
  Archive,
  RefreshCw,
  Search,
  Plus,
  Upload,
  Clock,
  ShieldAlert,
  Download,
  History,
  Tag,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Layers,
  Sparkles
} from 'lucide-react';

interface DocumentManagementViewProps {
  activeTab?: string;
}

export const DocumentManagementView: React.FC<DocumentManagementViewProps> = ({ activeTab: initialTab }) => {
  const {
    documents,
    addDocument,
    checkoutDocument,
    checkinDocument,
    archiveDocument,
    restoreDocument
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<'active' | 'archived' | 'checkout'>('active');

  useEffect(() => {
    if (initialTab && ['active', 'archived', 'checkout'].includes(initialTab)) {
      setActiveTab(initialTab as 'active' | 'archived' | 'checkout');
    }
  }, [initialTab]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);

  // Modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCheckinModal, setShowCheckinModal] = useState(false);

  // New Document state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<any>('Policy & SOP');
  const [newClassification, setNewClassification] = useState<any>('Internal Use');
  const [newDepartment, setNewDepartment] = useState('Legal & Corporate Affairs');
  const [newDescription, setNewDescription] = useState('');
  const [newRetentionYears, setNewRetentionYears] = useState(10);
  const [newLegalHold, setNewLegalHold] = useState(false);

  // Checkin state
  const [checkinVersion, setCheckinVersion] = useState('');
  const [checkinSummary, setCheckinSummary] = useState('');

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    addDocument({
      title: newTitle,
      category: newCategory,
      classification: newClassification,
      department: newDepartment,
      description: newDescription,
      retentionYears: newRetentionYears,
      legalHold: newLegalHold,
      tags: [newCategory, newClassification, newDepartment.split(' ')[0]]
    });

    setShowUploadModal(false);
    setNewTitle('');
    setNewDescription('');
  };

  const handleCheckin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc || !checkinVersion) return;
    checkinDocument(selectedDoc.id, checkinVersion, checkinSummary || 'Updated version', 'Current User');
    setShowCheckinModal(false);
    setCheckinVersion('');
    setCheckinSummary('');
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesTab =
      activeTab === 'active' ? !doc.isArchived :
      activeTab === 'archived' ? doc.isArchived :
      doc.isCheckedOut;

    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    const matchesSearch =
      doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesTab && matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              03.03
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Document Management & Archiving (DMS)</h2>
              <p className="text-xs text-slate-500">Document control, lock checkout/checkin, version histories, and regulatory cold archives</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('active')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'active' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Folder className="w-3.5 h-3.5" />
                <span>Active Vault ({documents.filter(d => !d.isArchived).length})</span>
              </button>
              <button
                onClick={() => setActiveTab('checkout')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'checkout' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Checked Out ({documents.filter(d => d.isCheckedOut).length})</span>
              </button>
              <button
                onClick={() => setActiveTab('archived')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'archived' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Archive className="w-3.5 h-3.5 text-slate-600" />
                <span>Cold Storage Archive ({documents.filter(d => d.isArchived).length})</span>
              </button>
            </div>

            <button
              onClick={() => setShowUploadModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Document</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search doc #, title, SOP tag, or department..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="p-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none hidden md:block"
            >
              <option value="all">All Categories</option>
              <option value="Policy & SOP">Policy & SOP</option>
              <option value="Board Resolution">Board Resolution</option>
              <option value="Commercial Agreement">Commercial Agreement</option>
              <option value="Compliance & Legal">Compliance & Legal</option>
            </select>
          </div>
          <div className="text-xs text-slate-500 hidden sm:block">
            {filteredDocuments.length} registered documents in current view
          </div>
        </div>
      </div>

      {/* Main Grid: Doc List + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5">Doc Number</th>
                  <th className="p-3.5">Title & Taxonomy</th>
                  <th className="p-3.5">Classification</th>
                  <th className="p-3.5">Version</th>
                  <th className="p-3.5">Control Status</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDocuments.map(doc => (
                  <tr
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className={`hover:bg-slate-50/70 cursor-pointer transition-colors ${
                      selectedDoc?.id === doc.id ? 'bg-indigo-50/40' : ''
                    }`}
                  >
                    <td className="p-3.5 font-mono font-bold text-indigo-700">
                      <div>{doc.documentNumber}</div>
                      <div className="text-[10px] text-slate-400 font-sans">{doc.fileType} • {doc.fileSize}</div>
                    </td>
                    <td className="p-3.5 max-w-xs">
                      <div className="font-bold text-slate-900 truncate">{doc.title}</div>
                      <div className="text-[11px] text-slate-500">{doc.category} • {doc.department}</div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        doc.classification === 'Restricted' ? 'bg-rose-100 text-rose-800' :
                        doc.classification === 'Confidential' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {doc.classification}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-slate-900">{doc.currentVersion}</td>
                    <td className="p-3.5">
                      {doc.isCheckedOut ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          <Lock className="w-3 h-3" /> Locked
                        </span>
                      ) : doc.isArchived ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          <Archive className="w-3 h-3" /> Archived
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      )}
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
          {selectedDoc ? (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-mono text-xs font-bold text-indigo-700">{selectedDoc.documentNumber}</span>
                <span className="text-[11px] text-slate-500 font-mono">Current: {selectedDoc.currentVersion}</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{selectedDoc.title}</h3>
                <p className="text-slate-600 mt-1 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {selectedDoc.description || 'Enterprise document master record.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div>
                  <span className="text-slate-400 block">Department</span>
                  <span className="font-semibold text-slate-800">{selectedDoc.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Owner / Custodian</span>
                  <span className="font-semibold text-slate-800">{selectedDoc.ownerName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Registered Date</span>
                  <span className="font-semibold text-slate-800">{selectedDoc.registrationDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Retention Expiry</span>
                  <span className="font-semibold text-slate-800">{selectedDoc.retentionExpiryDate}</span>
                </div>
              </div>

              {/* Version History */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <History className="w-3 h-3" /> Version History & Rollback Logs
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {selectedDoc.versions.map((ver, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-indigo-700">{ver.version}</span>
                          <span className="text-[10px] text-slate-400">{ver.uploadedAt} by {ver.uploadedBy}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">{ver.changeSummary}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{ver.fileSize}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Document Lock Status / Control */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-slate-800">Checkout & Version Control</span>
                  {selectedDoc.isCheckedOut ? (
                    <span className="text-amber-700 font-bold text-[11px] flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Locked for edit
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                      <Unlock className="w-3 h-3" /> Ready for checkout
                    </span>
                  )}
                </div>
                {selectedDoc.isCheckedOut && (
                  <p className="text-[11px] text-slate-500 mb-2">
                    Checked out by: <strong className="text-slate-800">{selectedDoc.checkedOutBy}</strong>
                  </p>
                )}

                <div className="flex gap-2">
                  {!selectedDoc.isCheckedOut ? (
                    <button
                      onClick={() => checkoutDocument(selectedDoc.id, 'Eng. Khalid Al-Amri')}
                      className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xs cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Lock className="w-3 h-3" /> Checkout & Lock
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const nextSubVer = `v${(parseFloat(selectedDoc.currentVersion.replace('v', '')) + 0.1).toFixed(1)}`;
                        setCheckinVersion(nextSubVer);
                        setShowCheckinModal(true);
                      }}
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Unlock className="w-3 h-3" /> Checkin New Version
                    </button>
                  )}
                </div>
              </div>

              {/* Archiving Actions */}
              <div className="pt-2 flex gap-2">
                {!selectedDoc.isArchived ? (
                  <button
                    onClick={() => archiveDocument(selectedDoc.id)}
                    className="flex-1 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg font-semibold text-xs cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Archive className="w-3 h-3" /> Move to Cold Archive
                  </button>
                ) : (
                  <button
                    onClick={() => restoreDocument(selectedDoc.id)}
                    className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-xs cursor-pointer flex items-center justify-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Restore to Active Vault
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 text-slate-400 my-auto">
              <Folder className="w-10 h-10 mb-2 stroke-1" />
              <p className="font-semibold text-slate-600">Select a document</p>
              <p className="text-xs">View version history, metadata, and perform checkout / checkin locks</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload/Register Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Register Document in Central DMS</h3>
            <form onSubmit={handleCreateDocument} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Document Title / Policy Name</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Standard Operating Procedure: Corporate Travel & Fleet Security"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none"
                  >
                    <option value="Policy & SOP">Policy & SOP</option>
                    <option value="Board Resolution">Board Resolution</option>
                    <option value="Commercial Agreement">Commercial Agreement</option>
                    <option value="Compliance & Legal">Compliance & Legal</option>
                    <option value="Engineering Spec">Engineering Spec</option>
                    <option value="Office Administration">Office Administration</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Classification Tier</label>
                  <select
                    value={newClassification}
                    onChange={e => setNewClassification(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none"
                  >
                    <option value="Public">Public</option>
                    <option value="Internal Use">Internal Use</option>
                    <option value="Confidential">Confidential</option>
                    <option value="Restricted">Restricted</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Owning Department</label>
                  <input
                    type="text"
                    value={newDepartment}
                    onChange={e => setNewDepartment(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Retention Policy (Years)</label>
                  <select
                    value={newRetentionYears}
                    onChange={e => setNewRetentionYears(parseInt(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none"
                  >
                    <option value={5}>5 Years (Standard Operations)</option>
                    <option value={10}>10 Years (Commercial Contracts)</option>
                    <option value={99}>99 Years (Permanent / Corporate Deeds)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Abstract & Scope</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="Summary of document purpose and governing mandate..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="legalHoldCheck"
                  checked={newLegalHold}
                  onChange={e => setNewLegalHold(e.target.checked)}
                  className="rounded border-slate-300"
                />
                <label htmlFor="legalHoldCheck" className="text-slate-700 font-medium cursor-pointer">
                  Apply immutable Legal Hold (prevents deletion or routine archiving)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold cursor-pointer"
                >
                  Register in Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Checkin Modal */}
      {showCheckinModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Checkin New Version</h3>
            <form onSubmit={handleCheckin} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">New Version Tag</label>
                <input
                  type="text"
                  required
                  value={checkinVersion}
                  onChange={e => setCheckinVersion(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Changelog / Revision Notes</label>
                <textarea
                  rows={3}
                  required
                  value={checkinSummary}
                  onChange={e => setCheckinSummary(e.target.value)}
                  placeholder="Describe exact modifications made in this revision..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCheckinModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold cursor-pointer"
                >
                  Checkin & Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
