import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ProcurementPlan,
  PurchaseForecastItem,
  ProcurementBudgetCategory,
  PurchaseRequisition,
  RequestForQuotation,
  SupplierQuotation,
  SupplierSelectionRecord,
  PurchaseOrder,
  BlanketPurchaseOrder,
  GoodsReceiptNote,
  ReceiptInspectionRecord,
  PurchaseInvoice,
  PurchaseReturn,
  SupplierDebitNote,
  SupplierMaster,
  SupplierContract,
  SupplierEvaluationRecord
} from '../types';
import {
  initialSuppliers,
  initialProcurementPlans,
  initialPurchaseForecasts,
  initialBudgetCategories,
  initialPurchaseRequisitions,
  initialRFQs,
  initialSupplierQuotations,
  initialSupplierSelections,
  initialPurchaseOrders,
  initialBlanketPOs,
  initialGoodsReceiptNotes,
  initialReceiptInspections,
  initialPurchaseInvoices,
  initialPurchaseReturns,
  initialDebitNotes,
  initialContracts,
  initialEvaluations
} from '../data/initialData';

interface ProcurementContextType {
  // 05.01 Planning
  plans: ProcurementPlan[];
  forecasts: PurchaseForecastItem[];
  budgetCategories: ProcurementBudgetCategory[];
  addProcurementPlan: (plan: Omit<ProcurementPlan, 'id' | 'planNumber'>) => void;
  updatePlanStatus: (id: string, status: ProcurementPlan['status']) => void;
  refreshForecasts: () => void;

  // 05.02 Requisitions
  requisitions: PurchaseRequisition[];
  createRequisition: (pr: Omit<PurchaseRequisition, 'id' | 'prNumber' | 'totalEstimatedAmountOMR'>) => PurchaseRequisition;
  submitRequisition: (id: string) => void;
  approveRequisition: (id: string, approverName: string, comments?: string) => void;
  rejectRequisition: (id: string, approverName: string, reason: string) => void;
  convertPrToPo: (prId: string, supplierId: string, buyerName: string) => PurchaseOrder;
  convertPrToRfq: (prId: string, buyerName: string) => RequestForQuotation;

  // 05.03 RFQs
  rfqs: RequestForQuotation[];
  createRFQ: (rfq: Omit<RequestForQuotation, 'id' | 'rfqNumber' | 'bidSubmissionCount'>) => RequestForQuotation;
  inviteSupplierToRfq: (rfqId: string, supplierId: string) => void;
  updateRfqStatus: (id: string, status: RequestForQuotation['status']) => void;

  // 05.04 Supplier Quotations
  quotations: SupplierQuotation[];
  supplierSelections: SupplierSelectionRecord[];
  addSupplierQuotation: (quote: Omit<SupplierQuotation, 'id' | 'quotationNumber' | 'totalAmountOMR'>) => void;
  awardSupplierSelection: (selection: Omit<SupplierSelectionRecord, 'id' | 'awardNumber'>) => void;

  // 05.05 Purchase Orders
  purchaseOrders: PurchaseOrder[];
  blanketPOs: BlanketPurchaseOrder[];
  createPurchaseOrder: (po: Omit<PurchaseOrder, 'id' | 'poNumber' | 'grandTotalOMR'>) => PurchaseOrder;
  approvePurchaseOrder: (id: string, approverName: string) => void;
  issuePoToVendor: (id: string) => void;
  createBlanketPO: (bpo: Omit<BlanketPurchaseOrder, 'id' | 'blanketPoNumber'>) => void;
  createReleaseOrderFromBlanket: (blanketId: string, amount: number, description: string) => void;

  // 05.06 Purchasing Receipts
  goodsReceipts: GoodsReceiptNote[];
  inspections: ReceiptInspectionRecord[];
  createGoodsReceipt: (grn: Omit<GoodsReceiptNote, 'id' | 'grnNumber'>) => GoodsReceiptNote;
  recordInspection: (insp: Omit<ReceiptInspectionRecord, 'id' | 'inspectionNumber'>) => void;

  // 05.07 Purchase Invoices & 3-Way Match
  invoices: PurchaseInvoice[];
  registerPurchaseInvoice: (inv: Omit<PurchaseInvoice, 'id' | 'invoiceNumber' | 'totalInvoiceAmountOMR' | 'threeWayMatchResult'>) => PurchaseInvoice;
  runThreeWayMatch: (invoiceId: string) => void;
  approveInvoiceForPayment: (invoiceId: string, approverName: string) => void;

  // 05.08 Purchase Returns & Debit Notes
  purchaseReturns: PurchaseReturn[];
  debitNotes: SupplierDebitNote[];
  createPurchaseReturn: (ret: Omit<PurchaseReturn, 'id' | 'returnNumber'>) => PurchaseReturn;
  generateDebitNoteFromReturn: (returnId: string, approverName: string) => SupplierDebitNote;

  // 05.09 Supplier Management
  suppliers: SupplierMaster[];
  contracts: SupplierContract[];
  evaluations: SupplierEvaluationRecord[];
  addSupplier: (supp: Omit<SupplierMaster, 'id' | 'supplierCode' | 'outstandingPayableOMR' | 'activeContractsCount' | 'onboardingDate'>) => void;
  updateSupplier: (id: string, data: Partial<SupplierMaster>) => void;
  addContract: (contract: Omit<SupplierContract, 'id' | 'contractNumber'>) => void;
  recordEvaluation: (evalRecord: Omit<SupplierEvaluationRecord, 'id' | 'evaluationNumber' | 'totalScore' | 'evaluationGrade'>) => void;

  // Global KPIs & AI Copilot Helper
  stats: {
    totalSpendYTD_OMR: number;
    openCommitmentsPO_OMR: number;
    pendingPrCount: number;
    pendingPoApprovalCount: number;
    activeRfqCount: number;
    unmatchedInvoicesCount: number;
    activeVendorsCount: number;
    expiringContractsCount: number;
  };
}

const ProcurementContext = createContext<ProcurementContextType | undefined>(undefined);

const STORAGE_KEY = 'artify_erp_procurement_data_v1';

export const ProcurementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state or default
  const [plans, setPlans] = useState<ProcurementPlan[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_plans`);
    return saved ? JSON.parse(saved) : initialProcurementPlans;
  });

  const [forecasts, setForecasts] = useState<PurchaseForecastItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_forecasts`);
    return saved ? JSON.parse(saved) : initialPurchaseForecasts;
  });

  const [budgetCategories, setBudgetCategories] = useState<ProcurementBudgetCategory[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_budgets`);
    return saved ? JSON.parse(saved) : initialBudgetCategories;
  });

  const [requisitions, setRequisitions] = useState<PurchaseRequisition[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_prs`);
    return saved ? JSON.parse(saved) : initialPurchaseRequisitions;
  });

  const [rfqs, setRfqs] = useState<RequestForQuotation[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_rfqs`);
    return saved ? JSON.parse(saved) : initialRFQs;
  });

  const [quotations, setQuotations] = useState<SupplierQuotation[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_quotations`);
    return saved ? JSON.parse(saved) : initialSupplierQuotations;
  });

  const [supplierSelections, setSupplierSelections] = useState<SupplierSelectionRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_selections`);
    return saved ? JSON.parse(saved) : initialSupplierSelections;
  });

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_pos`);
    return saved ? JSON.parse(saved) : initialPurchaseOrders;
  });

  const [blanketPOs, setBlanketPOs] = useState<BlanketPurchaseOrder[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_blanket_pos`);
    return saved ? JSON.parse(saved) : initialBlanketPOs;
  });

  const [goodsReceipts, setGoodsReceipts] = useState<GoodsReceiptNote[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_grns`);
    return saved ? JSON.parse(saved) : initialGoodsReceiptNotes;
  });

  const [inspections, setInspections] = useState<ReceiptInspectionRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_inspections`);
    return saved ? JSON.parse(saved) : initialReceiptInspections;
  });

  const [invoices, setInvoices] = useState<PurchaseInvoice[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_invoices`);
    return saved ? JSON.parse(saved) : initialPurchaseInvoices;
  });

  const [purchaseReturns, setPurchaseReturns] = useState<PurchaseReturn[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_returns`);
    return saved ? JSON.parse(saved) : initialPurchaseReturns;
  });

  const [debitNotes, setDebitNotes] = useState<SupplierDebitNote[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_debit_notes`);
    return saved ? JSON.parse(saved) : initialDebitNotes;
  });

  const [suppliers, setSuppliers] = useState<SupplierMaster[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_suppliers`);
    return saved ? JSON.parse(saved) : initialSuppliers;
  });

  const [contracts, setContracts] = useState<SupplierContract[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_contracts`);
    return saved ? JSON.parse(saved) : initialContracts;
  });

  const [evaluations, setEvaluations] = useState<SupplierEvaluationRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_evaluations`);
    return saved ? JSON.parse(saved) : initialEvaluations;
  });

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_plans`, JSON.stringify(plans));
      localStorage.setItem(`${STORAGE_KEY}_forecasts`, JSON.stringify(forecasts));
      localStorage.setItem(`${STORAGE_KEY}_budgets`, JSON.stringify(budgetCategories));
      localStorage.setItem(`${STORAGE_KEY}_prs`, JSON.stringify(requisitions));
      localStorage.setItem(`${STORAGE_KEY}_rfqs`, JSON.stringify(rfqs));
      localStorage.setItem(`${STORAGE_KEY}_quotations`, JSON.stringify(quotations));
      localStorage.setItem(`${STORAGE_KEY}_selections`, JSON.stringify(supplierSelections));
      localStorage.setItem(`${STORAGE_KEY}_pos`, JSON.stringify(purchaseOrders));
      localStorage.setItem(`${STORAGE_KEY}_blanket_pos`, JSON.stringify(blanketPOs));
      localStorage.setItem(`${STORAGE_KEY}_grns`, JSON.stringify(goodsReceipts));
      localStorage.setItem(`${STORAGE_KEY}_inspections`, JSON.stringify(inspections));
      localStorage.setItem(`${STORAGE_KEY}_invoices`, JSON.stringify(invoices));
      localStorage.setItem(`${STORAGE_KEY}_returns`, JSON.stringify(purchaseReturns));
      localStorage.setItem(`${STORAGE_KEY}_debit_notes`, JSON.stringify(debitNotes));
      localStorage.setItem(`${STORAGE_KEY}_suppliers`, JSON.stringify(suppliers));
      localStorage.setItem(`${STORAGE_KEY}_contracts`, JSON.stringify(contracts));
      localStorage.setItem(`${STORAGE_KEY}_evaluations`, JSON.stringify(evaluations));
    } catch (e) {
      console.error('Failed to sync procurement data to localStorage', e);
    }
  }, [
    plans,
    forecasts,
    budgetCategories,
    requisitions,
    rfqs,
    quotations,
    supplierSelections,
    purchaseOrders,
    blanketPOs,
    goodsReceipts,
    inspections,
    invoices,
    purchaseReturns,
    debitNotes,
    suppliers,
    contracts,
    evaluations
  ]);

  // ==========================================
  // 05.01 PLANNING
  // ==========================================
  const addProcurementPlan = (plan: Omit<ProcurementPlan, 'id' | 'planNumber'>) => {
    const newId = `plan-${Date.now()}`;
    const newNumber = `PLAN-FY${plan.fiscalYear}-${String(plans.length + 1).padStart(2, '0')}`;
    const newPlan: ProcurementPlan = {
      ...plan,
      id: newId,
      planNumber: newNumber
    };
    setPlans((prev) => [newPlan, ...prev]);
  };

  const updatePlanStatus = (id: string, status: ProcurementPlan['status']) => {
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  const refreshForecasts = () => {
    // Re-calculate AI forecast recommendations with small dynamic variation
    setForecasts((prev) =>
      prev.map((f) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const newRunRate = Math.max(1, f.historicalRunRateMonthly + delta);
        const newRec = Math.round(newRunRate * 3.2);
        return {
          ...f,
          historicalRunRateMonthly: newRunRate,
          recommendedOrderQty: newRec,
          confidenceScore: Math.min(99, Math.max(88, f.confidenceScore + (Math.random() > 0.5 ? 1 : -1)))
        };
      })
    );
  };

  // ==========================================
  // 05.02 REQUISITIONS
  // ==========================================
  const createRequisition = (pr: Omit<PurchaseRequisition, 'id' | 'prNumber' | 'totalEstimatedAmountOMR'>): PurchaseRequisition => {
    const newId = `pr-${Date.now()}`;
    const newNumber = `PR-2026-${String(requisitions.length + 90).padStart(4, '0')}`;
    const exchangeRate = pr.currency === 'USD' ? 0.385 : 1.0;
    const totalOMR = pr.totalEstimatedAmount * exchangeRate;

    const newPr: PurchaseRequisition = {
      ...pr,
      id: newId,
      prNumber: newNumber,
      totalEstimatedAmountOMR: totalOMR
    };

    setRequisitions((prev) => [newPr, ...prev]);
    return newPr;
  };

  const submitRequisition = (id: string) => {
    setRequisitions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'Pending Approval' } : p))
    );
  };

  const approveRequisition = (id: string, approverName: string, comments?: string) => {
    const today = new Date().toISOString().split('T')[0];
    setRequisitions((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'Approved',
              approvedBy: approverName,
              approvedDate: today,
              approverComments: comments || 'Approved in accordance with procurement delegation matrix.'
            }
          : p
      )
    );
  };

  const rejectRequisition = (id: string, approverName: string, reason: string) => {
    setRequisitions((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'Rejected',
              approverComments: `Rejected by ${approverName}: ${reason}`
            }
          : p
      )
    );
  };

  const convertPrToPo = (prId: string, supplierId: string, buyerName: string): PurchaseOrder => {
    const pr = requisitions.find((p) => p.id === prId);
    if (!pr) throw new Error('PR not found');

    const supplier = suppliers.find((s) => s.id === supplierId) || suppliers[0];
    const newPoId = `po-${Date.now()}`;
    const newPoNumber = `PO-2026-${String(purchaseOrders.length + 150).padStart(4, '0')}`;
    const today = new Date().toISOString().split('T')[0];

    const poLines = pr.lines.map((l, index) => ({
      id: `poline-${Date.now()}-${index}`,
      itemCode: l.itemCode,
      itemDescription: l.itemDescription,
      orderedQuantity: l.quantity,
      receivedQuantity: 0,
      invoicedQuantity: 0,
      unitOfMeasure: l.unitOfMeasure,
      unitPrice: l.estimatedUnitPrice,
      discountPercentage: 0,
      vatRatePercentage: 5,
      lineTotal: l.lineTotal,
      glAccountCode: l.glAccountCode,
      deliveryDate: pr.requiredDeliveryDate,
      lineStatus: 'Open' as const
    }));

    const subtotal = poLines.reduce((acc, curr) => acc + curr.lineTotal, 0);
    const vatTotal = subtotal * 0.05;
    const grandTotal = subtotal + vatTotal;

    const newPo: PurchaseOrder = {
      id: newPoId,
      poNumber: newPoNumber,
      poType: 'Standard PO',
      orderDate: today,
      promisedDeliveryDate: pr.requiredDeliveryDate,
      supplierId: supplier.id,
      supplierName: supplier.name,
      supplierContact: supplier.primaryContactName,
      supplierTaxNumber: supplier.taxIdentificationNumber,
      currency: pr.currency,
      exchangeRate: pr.currency === 'USD' ? 0.385 : 1.0,
      subtotal,
      vatTotal,
      grandTotal,
      grandTotalOMR: pr.currency === 'USD' ? grandTotal * 0.385 : grandTotal,
      sourcePrNumber: pr.prNumber,
      paymentTerms: supplier.paymentTerms,
      incoterms: 'DDP Site Delivery',
      deliveryAddress: 'Central Warehouse / Site Location, Oman',
      buyerName: buyerName || 'Procurement Specialist',
      status: 'Pending Approval',
      approvalLevel: grandTotal > 50000 ? 'Tier 3 (CFO / Director)' : 'Tier 2 (Procurement Mgr)',
      lines: poLines,
      specialInstructions: `Generated automatically from Purchase Requisition ${pr.prNumber}. Delivery mandatory by ${pr.requiredDeliveryDate}.`
    };

    setPurchaseOrders((prev) => [newPo, ...prev]);

    // Update PR
    setRequisitions((prev) =>
      prev.map((p) =>
        p.id === prId
          ? { ...p, status: 'Converted to PO', convertedPoNumber: newPoNumber }
          : p
      )
    );

    return newPo;
  };

  const convertPrToRfq = (prId: string, buyerName: string): RequestForQuotation => {
    const pr = requisitions.find((p) => p.id === prId);
    if (!pr) throw new Error('PR not found');

    const newRfqId = `rfq-${Date.now()}`;
    const newRfqNumber = `RFQ-2026-${String(rfqs.length + 450).padStart(4, '0')}`;
    const today = new Date().toISOString().split('T')[0];

    const targetClosing = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];

    const rfqLines = pr.lines.map((l, idx) => ({
      id: `rfqline-${Date.now()}-${idx}`,
      prLineId: l.id,
      itemCode: l.itemCode,
      itemDescription: l.itemDescription,
      specification: `Required as per PR ${pr.prNumber} specifications.`,
      targetQuantity: l.quantity,
      unitOfMeasure: l.unitOfMeasure,
      targetDeliveryDate: pr.requiredDeliveryDate
    }));

    // Pre-invite matching suppliers
    const matchingSuppliers = suppliers.slice(0, 3).map((s) => ({
      supplierId: s.id,
      supplierName: s.name,
      supplierEmail: s.primaryEmail,
      inviteStatus: 'Invited' as const,
      invitedAt: today,
      submissionDeadline: targetClosing
    }));

    const newRfq: RequestForQuotation = {
      id: newRfqId,
      rfqNumber: newRfqNumber,
      title: `Competitive Tender for ${pr.lines[0]?.itemDescription || 'Requisition Items'}`,
      issueDate: today,
      closingDate: targetClosing,
      category: pr.lines[0]?.category || 'General Procurement',
      procurementSpecialist: buyerName || 'Senior Sourcing Specialist',
      sourcePrNumber: pr.prNumber,
      deliveryLocation: 'Sultanate of Oman Sites',
      paymentTerms: 'Net 45 Days from GRN Acceptance',
      status: 'Published',
      lines: rfqLines,
      invitedSuppliers: matchingSuppliers,
      termsAndConditions: 'All bids must include fixed unit pricing, manufacturer country of origin, warranty terms, and valid tax registration certificate.',
      bidSubmissionCount: 0
    };

    setRfqs((prev) => [newRfq, ...prev]);

    setRequisitions((prev) =>
      prev.map((p) =>
        p.id === prId
          ? { ...p, status: 'Converted to RFQ', convertedRfqNumber: newRfqNumber }
          : p
      )
    );

    return newRfq;
  };

  // ==========================================
  // 05.03 RFQS
  // ==========================================
  const createRFQ = (rfq: Omit<RequestForQuotation, 'id' | 'rfqNumber' | 'bidSubmissionCount'>): RequestForQuotation => {
    const newId = `rfq-${Date.now()}`;
    const newNumber = `RFQ-2026-${String(rfqs.length + 450).padStart(4, '0')}`;
    const newRfq: RequestForQuotation = {
      ...rfq,
      id: newId,
      rfqNumber: newNumber,
      bidSubmissionCount: 0
    };
    setRfqs((prev) => [newRfq, ...prev]);
    return newRfq;
  };

  const inviteSupplierToRfq = (rfqId: string, supplierId: string) => {
    const supp = suppliers.find((s) => s.id === supplierId);
    if (!supp) return;

    setRfqs((prev) =>
      prev.map((r) => {
        if (r.id === rfqId) {
          const already = r.invitedSuppliers.some((s) => s.supplierId === supplierId);
          if (already) return r;
          const newInvite = {
            supplierId: supp.id,
            supplierName: supp.name,
            supplierEmail: supp.primaryEmail,
            inviteStatus: 'Invited' as const,
            invitedAt: new Date().toISOString().split('T')[0],
            submissionDeadline: r.closingDate
          };
          return {
            ...r,
            invitedSuppliers: [...r.invitedSuppliers, newInvite]
          };
        }
        return r;
      })
    );
  };

  const updateRfqStatus = (id: string, status: RequestForQuotation['status']) => {
    setRfqs((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  // ==========================================
  // 05.04 SUPPLIER QUOTATIONS
  // ==========================================
  const addSupplierQuotation = (quote: Omit<SupplierQuotation, 'id' | 'quotationNumber' | 'totalAmountOMR'>) => {
    const newId = `quote-${Date.now()}`;
    const newNumber = `QUO-${quote.supplierName.slice(0, 4).toUpperCase()}-2026-${String(quotations.length + 101).padStart(3, '0')}`;
    const rate = quote.currency === 'USD' ? 0.385 : 1.0;

    const newQuotation: SupplierQuotation = {
      ...quote,
      id: newId,
      quotationNumber: newNumber,
      totalAmountOMR: quote.totalAmount * rate
    };

    setQuotations((prev) => [newQuotation, ...prev]);

    // Increment bid count in RFQ if linked
    if (quote.rfqId) {
      setRfqs((prev) =>
        prev.map((r) =>
          r.id === quote.rfqId
            ? {
                ...r,
                bidSubmissionCount: r.bidSubmissionCount + 1,
                invitedSuppliers: r.invitedSuppliers.map((inv) =>
                  inv.supplierId === quote.supplierId
                    ? { ...inv, inviteStatus: 'Bid Submitted', responseRef: newNumber }
                    : inv
                )
              }
            : r
        )
      );
    }
  };

  const awardSupplierSelection = (selection: Omit<SupplierSelectionRecord, 'id' | 'awardNumber'>) => {
    const newId = `award-${Date.now()}`;
    const newNumber = `AWD-2026-${String(supplierSelections.length + 20).padStart(3, '0')}`;

    const newAward: SupplierSelectionRecord = {
      ...selection,
      id: newId,
      awardNumber: newNumber
    };

    setSupplierSelections((prev) => [newAward, ...prev]);

    // Update quote status
    setQuotations((prev) =>
      prev.map((q) =>
        q.quotationNumber === selection.selectedQuotationNumber
          ? { ...q, status: 'Selected / Awarded' }
          : q.rfqNumber === selection.rfqNumber
          ? { ...q, status: 'Rejected' }
          : q
      )
    );

    // Update RFQ status
    setRfqs((prev) =>
      prev.map((r) =>
        r.rfqNumber === selection.rfqNumber ? { ...r, status: 'Awarded' } : r
      )
    );
  };

  // ==========================================
  // 05.05 PURCHASE ORDERS
  // ==========================================
  const createPurchaseOrder = (po: Omit<PurchaseOrder, 'id' | 'poNumber' | 'grandTotalOMR'>): PurchaseOrder => {
    const newId = `po-${Date.now()}`;
    const newNumber = `PO-2026-${String(purchaseOrders.length + 150).padStart(4, '0')}`;
    const rate = po.currency === 'USD' ? 0.385 : 1.0;

    const newPo: PurchaseOrder = {
      ...po,
      id: newId,
      poNumber: newNumber,
      grandTotalOMR: po.grandTotal * rate
    };

    setPurchaseOrders((prev) => [newPo, ...prev]);
    return newPo;
  };

  const approvePurchaseOrder = (id: string, approverName: string) => {
    const today = new Date().toISOString().split('T')[0];
    setPurchaseOrders((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'Approved',
              approvedBy: approverName,
              approvedDate: today
            }
          : p
      )
    );
  };

  const issuePoToVendor = (id: string) => {
    setPurchaseOrders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'Issued to Vendor' } : p))
    );
  };

  const createBlanketPO = (bpo: Omit<BlanketPurchaseOrder, 'id' | 'blanketPoNumber'>) => {
    const newId = `bpo-${Date.now()}`;
    const newNumber = `BPO-2026-${String(blanketPOs.length + 10).padStart(3, '0')}`;
    const newBpo: BlanketPurchaseOrder = {
      ...bpo,
      id: newId,
      blanketPoNumber: newNumber
    };
    setBlanketPOs((prev) => [newBpo, ...prev]);
  };

  const createReleaseOrderFromBlanket = (blanketId: string, amount: number, description: string) => {
    setBlanketPOs((prev) =>
      prev.map((b) => {
        if (b.id === blanketId) {
          const newReleased = b.releasedAmount + amount;
          const newRemaining = Math.max(0, b.agreedCeilingAmount - newReleased);
          return {
            ...b,
            releasedAmount: newReleased,
            remainingAmount: newRemaining,
            numberOfReleaseOrders: b.numberOfReleaseOrders + 1
          };
        }
        return b;
      })
    );
  };

  // ==========================================
  // 05.06 PURCHASING RECEIPTS
  // ==========================================
  const createGoodsReceipt = (grn: Omit<GoodsReceiptNote, 'id' | 'grnNumber'>): GoodsReceiptNote => {
    const newId = `grn-${Date.now()}`;
    const isService = grn.grnType === 'Service Entry Sheet (SES)';
    const prefix = isService ? 'SES' : 'GRN';
    const newNumber = `${prefix}-2026-${String(goodsReceipts.length + 100).padStart(4, '0')}`;

    const newGrn: GoodsReceiptNote = {
      ...grn,
      id: newId,
      grnNumber: newNumber
    };

    setGoodsReceipts((prev) => [newGrn, ...prev]);

    // Update PO line received quantities
    setPurchaseOrders((prev) =>
      prev.map((po) => {
        if (po.id === grn.poId || po.poNumber === grn.poNumber) {
          const updatedLines = po.lines.map((pol) => {
            const grnLine = grn.lines.find((gl) => gl.poLineId === pol.id);
            if (grnLine) {
              const newRec = pol.receivedQuantity + grnLine.deliveredQty;
              return {
                ...pol,
                receivedQuantity: newRec,
                lineStatus: newRec >= pol.orderedQuantity ? ('Fully Received' as const) : ('Partially Received' as const)
              };
            }
            return pol;
          });
          const allDone = updatedLines.every((l) => l.receivedQuantity >= l.orderedQuantity);
          return {
            ...po,
            lines: updatedLines,
            status: allDone ? ('Received' as const) : ('Partially Received' as const)
          };
        }
        return po;
      })
    );

    return newGrn;
  };

  const recordInspection = (insp: Omit<ReceiptInspectionRecord, 'id' | 'inspectionNumber'>) => {
    const newId = `insp-${Date.now()}`;
    const newNumber = `QC-INSP-2026-${String(inspections.length + 60).padStart(3, '0')}`;

    const newInspection: ReceiptInspectionRecord = {
      ...insp,
      id: newId,
      inspectionNumber: newNumber
    };

    setInspections((prev) => [newInspection, ...prev]);

    // Update GRN status
    setGoodsReceipts((prev) =>
      prev.map((g) =>
        g.grnNumber === insp.grnNumber
          ? {
              ...g,
              status: insp.overallStatus === 'Pass' ? 'Posted to Stock' : 'Under Inspection'
            }
          : g
      )
    );
  };

  // ==========================================
  // 05.07 PURCHASE INVOICE & 3-WAY MATCH
  // ==========================================
  const registerPurchaseInvoice = (
    inv: Omit<PurchaseInvoice, 'id' | 'invoiceNumber' | 'totalInvoiceAmountOMR' | 'threeWayMatchResult'>
  ): PurchaseInvoice => {
    const newId = `inv-${Date.now()}`;
    const newNumber = `PINV-2026-${String(invoices.length + 120).padStart(4, '0')}`;
    const rate = inv.currency === 'USD' ? 0.385 : 1.0;
    const totalOMR = inv.totalInvoiceAmount * rate;

    // Run preliminary 3-Way Match Check
    const po = purchaseOrders.find((p) => p.poNumber === inv.poNumber);
    const grn = goodsReceipts.find((g) => g.grnNumber === inv.grnNumber || g.poNumber === inv.poNumber);

    let matchResult: PurchaseInvoice['threeWayMatchResult'] = 'Full 3-Way Match Passed';

    if (!po) {
      matchResult = 'Price Discrepancy';
    } else if (!grn) {
      matchResult = 'Pending Matching';
    } else {
      // Check total price variance
      const priceDiff = Math.abs(po.subtotal - inv.netSubtotal);
      const diffPct = (priceDiff / (po.subtotal || 1)) * 100;
      if (diffPct > 5) {
        matchResult = 'Price Discrepancy';
      } else if (diffPct > 0) {
        matchResult = 'Variance Within Tolerance';
      }
    }

    const newInvoice: PurchaseInvoice = {
      ...inv,
      id: newId,
      invoiceNumber: newNumber,
      totalInvoiceAmountOMR: totalOMR,
      threeWayMatchResult: matchResult,
      status: matchResult === 'Full 3-Way Match Passed' ? 'Matched' : 'Under Verification'
    };

    setInvoices((prev) => [newInvoice, ...prev]);
    return newInvoice;
  };

  const runThreeWayMatch = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          const po = purchaseOrders.find((p) => p.poNumber === inv.poNumber);
          const grn = goodsReceipts.find((g) => g.grnNumber === inv.grnNumber || g.poNumber === inv.poNumber);

          let updatedMatch: PurchaseInvoice['threeWayMatchResult'] = 'Full 3-Way Match Passed';
          if (!po || !grn) {
            updatedMatch = 'Quantity Discrepancy';
          }

          return {
            ...inv,
            threeWayMatchResult: updatedMatch,
            status: 'Matched'
          };
        }
        return inv;
      })
    );
  };

  const approveInvoiceForPayment = (invoiceId: string, approverName: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId
          ? {
              ...inv,
              status: 'Approved for Payment',
              approvedBy: approverName
            }
          : inv
      )
    );
  };

  // ==========================================
  // 05.08 PURCHASE RETURNS & DEBIT NOTES
  // ==========================================
  const createPurchaseReturn = (ret: Omit<PurchaseReturn, 'id' | 'returnNumber'>): PurchaseReturn => {
    const newId = `ret-${Date.now()}`;
    const newNumber = `PRET-2026-${String(purchaseReturns.length + 15).padStart(4, '0')}`;

    const newReturn: PurchaseReturn = {
      ...ret,
      id: newId,
      returnNumber: newNumber
    };

    setPurchaseReturns((prev) => [newReturn, ...prev]);
    return newReturn;
  };

  const generateDebitNoteFromReturn = (returnId: string, approverName: string): SupplierDebitNote => {
    const ret = purchaseReturns.find((r) => r.id === returnId);
    if (!ret) throw new Error('Return not found');

    const newDbnId = `dbn-${Date.now()}`;
    const newDbnNumber = `DBN-2026-${String(debitNotes.length + 10).padStart(4, '0')}`;
    const today = new Date().toISOString().split('T')[0];

    const subtotal = ret.totalReturnValueOMR;
    const vat = subtotal * 0.05;
    const total = subtotal + vat;

    const newDbn: SupplierDebitNote = {
      id: newDbnId,
      debitNoteNumber: newDbnNumber,
      issueDate: today,
      supplierId: ret.supplierId,
      supplierName: ret.supplierName,
      originalInvoiceNumber: `INV-REF-ORIG-${ret.poNumber}`,
      originalPoNumber: ret.poNumber,
      returnReferenceNumber: ret.returnNumber,
      currency: 'OMR',
      debitSubtotal: subtotal,
      vatReversalAmount: vat,
      totalDebitAmount: total,
      totalDebitAmountOMR: total,
      glAccountDebit: '2010-01-001 (AP Control Account)',
      glAccountCredit: '1410-02-001 (Inventory Value Reversal)',
      reason: `Debit memo generated from Return Material Authorization ${ret.rmaReferenceNumber} for ${ret.returnNumber}.`,
      status: 'Posted',
      approvedBy: approverName || 'Mazin Al-Hinai (CPO)'
    };

    setDebitNotes((prev) => [newDbn, ...prev]);

    // Update return status
    setPurchaseReturns((prev) =>
      prev.map((r) =>
        r.id === returnId
          ? {
              ...r,
              status: 'Debit Note Issued',
              debitNoteNumber: newDbnNumber
            }
          : r
      )
    );

    return newDbn;
  };

  // ==========================================
  // 05.09 SUPPLIER MANAGEMENT
  // ==========================================
  const addSupplier = (
    supp: Omit<SupplierMaster, 'id' | 'supplierCode' | 'outstandingPayableOMR' | 'activeContractsCount' | 'onboardingDate'>
  ) => {
    const newId = `supp-${Date.now()}`;
    const newCode = `VND-OM-${String(suppliers.length + 1006).padStart(4, '0')}`;
    const today = new Date().toISOString().split('T')[0];

    const newSupp: SupplierMaster = {
      ...supp,
      id: newId,
      supplierCode: newCode,
      outstandingPayableOMR: 0,
      activeContractsCount: 0,
      onboardingDate: today
    };

    setSuppliers((prev) => [newSupp, ...prev]);
  };

  const updateSupplier = (id: string, data: Partial<SupplierMaster>) => {
    setSuppliers((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
  };

  const addContract = (contract: Omit<SupplierContract, 'id' | 'contractNumber'>) => {
    const newId = `cntr-${Date.now()}`;
    const newNumber = `CNT-2026-${String(contracts.length + 90).padStart(3, '0')}`;

    const newContract: SupplierContract = {
      ...contract,
      id: newId,
      contractNumber: newNumber
    };

    setContracts((prev) => [newContract, ...prev]);

    // Increment supplier active contract count
    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === contract.supplierId
          ? { ...s, activeContractsCount: s.activeContractsCount + 1 }
          : s
      )
    );
  };

  const recordEvaluation = (
    evalRecord: Omit<SupplierEvaluationRecord, 'id' | 'evaluationNumber' | 'totalScore' | 'evaluationGrade'>
  ) => {
    const newId = `eval-${Date.now()}`;
    const newNumber = `EVAL-2026-${evalRecord.evaluationPeriod}-${String(evaluations.length + 5).padStart(2, '0')}`;

    const total =
      evalRecord.qualityMetricScore +
      evalRecord.deliveryPunctualityScore +
      evalRecord.priceCompetitivenessScore +
      evalRecord.afterSalesSupportScore +
      evalRecord.complianceAndEsgScore;

    let grade: SupplierEvaluationRecord['evaluationGrade'] = 'A - Excellent';
    if (total < 60) grade = 'F - Action Required';
    else if (total < 75) grade = 'D - Poor / Warning';
    else if (total < 85) grade = 'C - Satisfactory';
    else if (total < 92) grade = 'B - Good';

    const newEval: SupplierEvaluationRecord = {
      ...evalRecord,
      id: newId,
      evaluationNumber: newNumber,
      totalScore: Number(total.toFixed(1)),
      evaluationGrade: grade
    };

    setEvaluations((prev) => [newEval, ...prev]);

    // Update supplier overall scores
    setSuppliers((prev) =>
      prev.map((s) => {
        if (s.id === evalRecord.supplierId) {
          return {
            ...s,
            qualityScore: Math.round((evalRecord.qualityMetricScore / 30) * 100),
            onTimeDeliveryRate: Math.round((evalRecord.deliveryPunctualityScore / 30) * 100)
          };
        }
        return s;
      })
    );
  };

  // Aggregated Stats
  const totalSpendYTD_OMR = invoices
    .filter((i) => i.status === 'Approved for Payment' || i.status === 'Posted to AP' || i.status === 'Paid')
    .reduce((acc, curr) => acc + curr.totalInvoiceAmountOMR, 0);

  const openCommitmentsPO_OMR = purchaseOrders
    .filter((p) => p.status === 'Approved' || p.status === 'Issued to Vendor' || p.status === 'Partially Received')
    .reduce((acc, curr) => acc + curr.grandTotalOMR, 0);

  const pendingPrCount = requisitions.filter(
    (p) => p.status === 'Submitted' || p.status === 'Pending Approval'
  ).length;

  const pendingPoApprovalCount = purchaseOrders.filter(
    (p) => p.status === 'Pending Approval'
  ).length;

  const activeRfqCount = rfqs.filter(
    (r) => r.status === 'Published' || r.status === 'Under Evaluation'
  ).length;

  const unmatchedInvoicesCount = invoices.filter(
    (i) => i.status === 'Under Verification' || i.threeWayMatchResult !== 'Full 3-Way Match Passed'
  ).length;

  const activeVendorsCount = suppliers.filter((s) => s.status === 'Active').length;

  const expiringContractsCount = contracts.filter(
    (c) => c.status === 'Expiring Soon'
  ).length;

  return (
    <ProcurementContext.Provider
      value={{
        plans,
        forecasts,
        budgetCategories,
        addProcurementPlan,
        updatePlanStatus,
        refreshForecasts,

        requisitions,
        createRequisition,
        submitRequisition,
        approveRequisition,
        rejectRequisition,
        convertPrToPo,
        convertPrToRfq,

        rfqs,
        createRFQ,
        inviteSupplierToRfq,
        updateRfqStatus,

        quotations,
        supplierSelections,
        addSupplierQuotation,
        awardSupplierSelection,

        purchaseOrders,
        blanketPOs,
        createPurchaseOrder,
        approvePurchaseOrder,
        issuePoToVendor,
        createBlanketPO,
        createReleaseOrderFromBlanket,

        goodsReceipts,
        inspections,
        createGoodsReceipt,
        recordInspection,

        invoices,
        registerPurchaseInvoice,
        runThreeWayMatch,
        approveInvoiceForPayment,

        purchaseReturns,
        debitNotes,
        createPurchaseReturn,
        generateDebitNoteFromReturn,

        suppliers,
        contracts,
        evaluations,
        addSupplier,
        updateSupplier,
        addContract,
        recordEvaluation,

        stats: {
          totalSpendYTD_OMR,
          openCommitmentsPO_OMR,
          pendingPrCount,
          pendingPoApprovalCount,
          activeRfqCount,
          unmatchedInvoicesCount,
          activeVendorsCount,
          expiringContractsCount
        }
      }}
    >
      {children}
    </ProcurementContext.Provider>
  );
};

export const useProcurement = () => {
  const ctx = useContext(ProcurementContext);
  if (!ctx) {
    throw new Error('useProcurement must be used within a ProcurementProvider');
  }
  return ctx;
};
