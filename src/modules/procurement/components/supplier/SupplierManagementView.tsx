import React, { useState } from 'react';
import { useProcurement } from '../../services/procurementStore';
import { Supplier, SupplierContract, EvaluationScorecard } from '../../types';
import {
  Users,
  Award,
  FileText,
  TrendingUp,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Building,
  ShieldCheck,
  Star,
  ExternalLink,
  Calendar,
  DollarSign
} from 'lucide-react';
import { mockRandom } from '@/src/utils/mockRandom';

export const SupplierManagementView: React.FC = () => {
  const {
    suppliers,
    scorecards,
    contracts,
    addSupplier,
    addScorecard,
    addContract,
    updateSupplierRating
  } = useProcurement();

  const [activeTab, setActiveTab] = useState<'master' | 'evaluation' | 'contracts' | 'performance'>('master');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [showScorecardModal, setShowScorecardModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);

  // Add Supplier Form State
  const [suppName, setSuppName] = useState('');
  const [suppCategory, setSuppCategory] = useState('Raw Materials');
  const [suppCountry, setSuppCountry] = useState('Sultanate of Oman');
  const [suppCity, setSuppCity] = useState('Muscat');
  const [suppEmail, setSuppEmail] = useState('');
  const [suppPhone, setSuppPhone] = useState('+968 24');
  const [suppTaxId, setSuppTaxId] = useState('OM-VAT-');
  const [isSme, setIsSme] = useState(false);

  // Scorecard Form
  const [evalSupplierId, setEvalSupplierId] = useState(suppliers[0]?.id || '');
  const [qualityScore, setQualityScore] = useState<number>(92);
  const [deliveryScore, setDeliveryScore] = useState<number>(90);
  const [commercialScore, setCommercialScore] = useState<number>(88);
  const [serviceScore, setServiceScore] = useState<number>(90);
  const [esgScore, setEsgScore] = useState<number>(85);
  const [evalNotes, setEvalNotes] = useState('');

  // Contract Form
  const [contractTitle, setContractTitle] = useState('');
  const [contractSupplierId, setContractSupplierId] = useState(suppliers[0]?.id || '');
  const [contractVal, setContractVal] = useState<number>(100000);
  const [contractExpiry, setContractExpiry] = useState('2027-12-31');

  const formatOMR = (amt?: number) =>
    `OMR ${(amt ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const handleAddSupplierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suppName.trim()) return;

    addSupplier({
      name: suppName,
      tradeName: suppName,
      commercialRegistrationNumber: `CR-OM-${Math.floor(1000000 + mockRandom() * 9000000)}`,
      taxIdentificationNumber: suppTaxId,
      category: suppCategory,
      tier: isSme ? 'Tier 3 (Emerging / SME)' : 'Tier 2 (Preferred)',
      country: suppCountry,
      city: suppCity,
      primaryContactName: 'Procurement Liaison Manager',
      primaryEmail: suppEmail || 'sales@vendor.om',
      phone: suppPhone,
      isOmaniSME: isSme,
      icvScorePercentage: isSme ? 75 : 55,
      qualificationStatus: 'Approved',
      rating: 'Tier A',
      qualityScore: 90,
      onTimeDeliveryRate: 92,
      spendYTD_OMR: 0,
      activeContractCount: 1,
      bankName: 'Bank Muscat SAOG',
      bankAccountNumber: '0421098230192',
      bankIban: 'OM68BMSC0421098230192001',
      swiftCode: 'BMSCOM2X'
    });

    setShowAddSupplierModal(false);
    setSuppName('');
  };

  const handleScorecardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const supp = suppliers.find((s) => s.id === evalSupplierId);
    if (!supp) return;

    const composite = Number(
      (
        qualityScore * 0.35 +
        deliveryScore * 0.3 +
        commercialScore * 0.2 +
        serviceScore * 0.1 +
        esgScore * 0.05
      ).toFixed(1)
    );

    const grade = composite >= 90 ? 'Grade A' : composite >= 80 ? 'Grade B' : 'Grade C';

    addScorecard({
      supplierId: supp.id,
      supplierName: supp.name,
      evaluationPeriod: 'Q1 2026',
      evaluatedBy: 'Vendor Performance Review Panel',
      qualityScore: Number(qualityScore),
      onTimeDeliveryScore: Number(deliveryScore),
      commercialCompetitivenessScore: Number(commercialScore),
      serviceResponsivenessScore: Number(serviceScore),
      esgAndComplianceScore: Number(esgScore),
      compositeScore: composite,
      performanceGrade: grade,
      strengths: 'Strong local engineering support and zero critical defects.',
      areasForImprovement: evalNotes || 'Improve advance shipping notice compliance.',
      actionPlan: 'Maintain priority allocation in upcoming tenders.'
    });

    setShowScorecardModal(false);
  };

  const handleContractSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const supp = suppliers.find((s) => s.id === contractSupplierId);
    if (!supp) return;

    addContract({
      contractTitle,
      contractType: 'Master Service Agreement (MSA)',
      supplierId: supp.id,
      supplierName: supp.name,
      startDate: new Date().toISOString().split('T')[0],
      expiryDate: contractExpiry,
      contractValueOMR: Number(contractVal),
      governingLaw: 'Oman Commercial Law',
      status: 'Active',
      autoRenewalClause: true,
      slaResponseTimeHours: 4,
      penaltyTerms: '0.5% per week of delay up to 10% maximum.'
    });

    setShowContractModal(false);
    setContractTitle('');
  };

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.supplierCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Sub-header Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('master')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'master'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>05.09.01 Approved Vendor List (AVL)</span>
          </button>
          <button
            onClick={() => setActiveTab('evaluation')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'evaluation'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>05.09.02 Vendor Scorecards</span>
          </button>
          <button
            onClick={() => setActiveTab('contracts')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'contracts'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>05.09.03 Contracts & MSAs</span>
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'performance'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>05.09.04 Performance Analytics</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'master' && (
            <button
              onClick={() => setShowAddSupplierModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Onboard New Vendor</span>
            </button>
          )}
          {activeTab === 'evaluation' && (
            <button
              onClick={() => setShowScorecardModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Conduct Evaluation</span>
            </button>
          )}
          {activeTab === 'contracts' && (
            <button
              onClick={() => setShowContractModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Archive New Contract</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: APPROVED VENDOR LIST */}
      {activeTab === 'master' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="relative max-w-md flex-1">
                <Search className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search supplier by name, code, category, city..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-700">
                    <th className="py-3 px-4">Supplier Code & Name</th>
                    <th className="py-3 px-4">Category & Origin</th>
                    <th className="py-3 px-4">Tier & SME Status</th>
                    <th className="py-3 px-4 text-right">Spend YTD (OMR)</th>
                    <th className="py-3 px-4 text-center">Quality %</th>
                    <th className="py-3 px-4 text-center">OTIF %</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredSuppliers.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-slate-100">{s.name}</div>
                        <div className="font-mono text-[10px] text-slate-500 dark:text-slate-400">{s.supplierCode} • {s.commercialRegistrationNumber}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800 dark:text-slate-200">{s.category}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{s.city}, {s.country}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">{s.tier}</div>
                        {s.isOmaniSME && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-200 inline-block mt-0.5">
                            Riyada SME (ICV: {s.icvScorePercentage}%)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-slate-100">
                        {formatOMR(s.spendYTD_OMR)}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400">{s.qualityScore}%</td>
                      <td className="py-3 px-4 text-center font-bold text-blue-600 dark:text-blue-400">{s.onTimeDeliveryRate}%</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            s.rating === 'Tier A'
                              ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200'
                              : 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-200'
                          }`}
                        >
                          {s.rating}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedSupplier(s)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs cursor-pointer"
                        >
                          Vendor File
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VENDOR SCORECARDS */}
      {activeTab === 'evaluation' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scorecards.map((sc) => (
              <div key={sc.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {sc.scorecardNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200">
                    {sc.performanceGrade} ({sc.compositeScore}/100)
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{sc.supplierName}</h4>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px]">Period: {sc.evaluationPeriod} • Evaluator: {sc.evaluatedBy}</div>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl text-center">
                  <div>
                    <div className="text-[10px] uppercase text-slate-500 dark:text-slate-400">Quality</div>
                    <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{sc.qualityScore}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-slate-500 dark:text-slate-400">OTIF Delivery</div>
                    <div className="font-bold text-blue-600 dark:text-blue-400 text-sm">{sc.onTimeDeliveryScore}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-slate-500 dark:text-slate-400">Commercial</div>
                    <div className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">{sc.commercialCompetitivenessScore}%</div>
                  </div>
                </div>

                <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">Strengths:</span> {sc.strengths}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">Action Plan:</span> {sc.actionPlan}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CONTRACTS ARCHIVE */}
      {activeTab === 'contracts' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contracts.map((c) => (
              <div key={c.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {c.contractNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200">
                    {c.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{c.contractTitle}</h4>
                  <div className="text-slate-500 dark:text-slate-400 font-medium">{c.supplierName} • {c.contractType}</div>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl">
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 dark:text-slate-400 block">Total Value</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{formatOMR(c.contractValueOMR ?? c.valueOMR ?? 0)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 dark:text-slate-400 block">Start Date</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{c.startDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 dark:text-slate-400 block">Expiry Date</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{c.expiryDate}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  <span className="font-bold">SLA:</span> {c.slaResponseTimeHours} Hour Response | <span className="font-bold">Law:</span> {c.governingLaw}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PERFORMANCE ANALYTICS */}
      {activeTab === 'performance' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Procurement Performance & Local In-Country Value (ICV) Index</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enterprise supplier delivery conformance, lead-time variance, and Oman Vision 2040 SME contribution tracking.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Average Supplier OTIF</span>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">95.0%</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Target benchmark: ≥ 90.0%</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Omani SME ICV Spend Ratio</span>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">24.5%</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Exceeds national 20% mandate</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Active Supply Contracts</span>
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">{contracts.length} MSAs</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">100% compliant with local laws</p>
            </div>
          </div>
        </div>
      )}

      {/* SUPPLIER DETAILS MODAL */}
      {selectedSupplier && (
        <div className="fixed inset-0 z-50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 border border-slate-200 dark:border-slate-700 shadow-xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{selectedSupplier.name}</h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200">
                    {selectedSupplier.rating}
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                  CR: {selectedSupplier.commercialRegistrationNumber} • VAT: {selectedSupplier.taxIdentificationNumber}
                </p>
              </div>
              <button
                onClick={() => setSelectedSupplier(null)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-400 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Category</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedSupplier.category}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Location</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedSupplier.city}, {selectedSupplier.country}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Spend YTD</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-300">{formatOMR(selectedSupplier.spendYTD_OMR)}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Contact</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedSupplier.primaryContactName}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Email</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedSupplier.primaryEmail}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Phone</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedSupplier.phone}</span>
              </div>
            </div>

            {/* Banking Details */}
            <div className="space-y-1 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-900 dark:text-slate-100 block">Banking & Disbursement Coordinates</span>
              <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                <div>Bank: <span className="font-semibold">{selectedSupplier.bankName}</span></div>
                <div>Account: <span className="font-mono font-semibold">{selectedSupplier.bankAccountNumber}</span></div>
                <div className="col-span-2">IBAN: <span className="font-mono font-semibold">{selectedSupplier.bankIban}</span></div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedSupplier(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold cursor-pointer"
              >
                Close Vendor File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD SUPPLIER MODAL */}
      {showAddSupplierModal && (
        <div className="fixed inset-0 z-50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-700 shadow-xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Onboard Approved Vendor</h3>
            <form onSubmit={handleAddSupplierSubmit} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Company / Legal Entity Name</label>
                <input
                  type="text"
                  required
                  value={suppName}
                  onChange={(e) => setSuppName(e.target.value)}
                  placeholder="e.g. Oman Heavy Electrical Industries SAOC"
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
                  <select
                    value={suppCategory}
                    onChange={(e) => setSuppCategory(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg"
                  >
                    <option value="Raw Materials">Raw Materials</option>
                    <option value="Capital Equipment">Capital Equipment</option>
                    <option value="IT & Telecom">IT & Telecom</option>
                    <option value="Facilities & Services">Facilities & Services</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Tax ID / VAT #</label>
                  <input
                    type="text"
                    required
                    value={suppTaxId}
                    onChange={(e) => setSuppTaxId(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">City / Governorate</label>
                  <input
                    type="text"
                    value={suppCity}
                    onChange={(e) => setSuppCity(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Primary Email</label>
                  <input
                    type="email"
                    required
                    value={suppEmail}
                    onChange={(e) => setSuppEmail(e.target.value)}
                    placeholder="sales@vendor.om"
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-500/10 rounded-lg text-amber-900 dark:text-amber-100">
                <input
                  type="checkbox"
                  id="smeCheck"
                  checked={isSme}
                  onChange={(e) => setIsSme(e.target.checked)}
                  className="rounded text-amber-600 dark:text-amber-400 focus:ring-amber-500 cursor-pointer"
                />
                <label htmlFor="smeCheck" className="text-xs font-semibold cursor-pointer">
                  Certified Riyada Omani SME (Preferential Terms & Fast-Track Settlement)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddSupplierModal(false)}
                  className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold cursor-pointer"
                >
                  Save to AVL Master
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SCORECARD MODAL */}
      {showScorecardModal && (
        <div className="fixed inset-0 z-50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-700 shadow-xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Perform Supplier Scorecard Evaluation</h3>
            <form onSubmit={handleScorecardSubmit} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Select Supplier</label>
                <select
                  value={evalSupplierId}
                  onChange={(e) => setEvalSupplierId(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Quality Conformance (0-100)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={qualityScore}
                    onChange={(e) => setQualityScore(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">OTIF Delivery (0-100)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={deliveryScore}
                    onChange={(e) => setDeliveryScore(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowScorecardModal(false)}
                  className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold cursor-pointer"
                >
                  Record Scorecard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONTRACT MODAL */}
      {showContractModal && (
        <div className="fixed inset-0 z-50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-700 shadow-xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Archive Supplier Contract</h3>
            <form onSubmit={handleContractSubmit} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Contract Title</label>
                <input
                  type="text"
                  required
                  value={contractTitle}
                  onChange={(e) => setContractTitle(e.target.value)}
                  placeholder="e.g. Master Supply Agreement for High Voltage Transformers"
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Contractor / Vendor</label>
                <select
                  value={contractSupplierId}
                  onChange={(e) => setContractSupplierId(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Contract Value (OMR)</label>
                  <input
                    type="number"
                    required
                    value={contractVal}
                    onChange={(e) => setContractVal(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={contractExpiry}
                    onChange={(e) => setContractExpiry(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowContractModal(false)}
                  className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold cursor-pointer"
                >
                  Save Contract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
