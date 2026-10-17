// ==========================================
// 16.09 INTERCOMPANY & FOREIGN CURRENCY VIEW
// Intercompany matching & elimination, FX rate table, foreign-currency exposure
// ==========================================

import React, { useState } from 'react';
import { useFinanceStore } from '../../services/financeStore';
import {
  Globe,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Building2,
  TrendingUp
} from 'lucide-react';

type Tab = 'intercompany' | 'rates' | 'exposure';

export const IntercompanyFxView: React.FC = () => {
  const {
    currency,
    intercompanyTransactions,
    currencyRates,
    supplierInvoices,
    customerInvoices,
    reconcileIntercompanyTransaction,
    eliminateIntercompanyTransaction,
    updateCurrencyRate
  } = useFinanceStore();

  const [activeTab, setActiveTab] = useState<Tab>('intercompany');
  const [rateDrafts, setRateDrafts] = useState<Record<string, string>>({});

  const pending = intercompanyTransactions.filter(t => t.status === 'PENDING_MATCH');
  const pendingAmount = pending.reduce((s, t) => s + t.amount, 0);
  const eliminated = intercompanyTransactions.filter(t => t.status === 'ELIMINATED').length;

  const rateOf = (code: string) => currencyRates.find(r => r.currencyCode === code)?.exchangeRateToBase;

  // Open foreign-currency balances, expressed in OMR at current spot (1 OMR = X foreign)
  const exposures = [
    ...supplierInvoices
      .filter(i => i.currency !== currency && i.balanceDue > 0)
      .map(i => ({ ref: i.systemRef, party: i.vendorName, side: 'AP' as const, currency: i.currency, amount: i.balanceDue })),
    ...customerInvoices
      .filter(i => i.currency !== currency && i.balanceAmount > 0)
      .map(i => ({ ref: i.invoiceNumber, party: i.customerName, side: 'AR' as const, currency: i.currency, amount: i.balanceAmount }))
  ].map(e => {
    const rate = rateOf(e.currency);
    return { ...e, rate, baseAmount: rate ? e.amount / rate : 0 };
  });
  const netExposure = exposures.reduce((s, e) => s + (e.side === 'AR' ? e.baseAmount : -e.baseAmount), 0);

  const commitRate = (code: string) => {
    const v = Number(rateDrafts[code]);
    if (v > 0) updateCurrencyRate(code, v);
    setRateDrafts(d => {
      const { [code]: _omit, ...rest } = d;
      return rest;
    });
  };

  const statusStyle: Record<string, string> = {
    PENDING_MATCH: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    RECONCILED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    ELIMINATED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-slate-900 dark:text-white shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5" />
            Module 16.09 — Intercompany & Foreign Currency
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Group Matching, FX Rates & Currency Exposure</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Match and eliminate intercompany balances, maintain spot rates, and monitor open foreign-currency payables and receivables.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-bold">{pending.length}</div>
            <div className="text-[10px] uppercase text-slate-600 dark:text-slate-400">Pending Match</div>
          </div>
          <div>
            <div className="text-xl font-bold">{currency} {pendingAmount.toLocaleString()}</div>
            <div className="text-[10px] uppercase text-slate-600 dark:text-slate-400">Unmatched Value</div>
          </div>
          <div>
            <div className="text-xl font-bold">{eliminated}</div>
            <div className="text-[10px] uppercase text-slate-600 dark:text-slate-400">Eliminated</div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {([
          { id: 'intercompany', label: 'Intercompany Transactions' },
          { id: 'rates', label: 'Foreign Currency Rates' },
          { id: 'exposure', label: 'FX Exposure' }
        ] as { id: Tab; label: string }[]).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'intercompany' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Ref</th>
                <th className="py-3 px-4">Entities</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {intercompanyTransactions.map(t => (
                <tr key={t.id}>
                  <td className="py-3 px-4 font-mono">
                    {t.transactionRef}
                    <div className="text-[10px] text-slate-600 dark:text-slate-400">{t.date}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                      {t.originEntity}
                      <ArrowRight className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                      {t.targetEntity}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{t.description}</td>
                  <td className="py-3 px-4 text-right font-mono">{t.currency} {t.amount.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusStyle[t.status]}`}>
                      {t.status.replace('_', ' ')}
                    </span>
                    {t.eliminationVoucherId && (
                      <div className="text-[10px] font-mono text-slate-600 dark:text-slate-400 mt-1">{t.eliminationVoucherId}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {t.status === 'PENDING_MATCH' && (
                      <button
                        onClick={() => reconcileIntercompanyTransaction(t.id)}
                        className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg cursor-pointer"
                      >
                        Match
                      </button>
                    )}
                    {t.status === 'RECONCILED' && (
                      <button
                        onClick={() => eliminateIntercompanyTransaction(t.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg cursor-pointer"
                      >
                        Eliminate
                      </button>
                    )}
                    {t.status === 'ELIMINATED' && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-500 inline" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'rates' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Currency</th>
                <th className="py-3 px-4 text-right">1 {currency} = X</th>
                <th className="py-3 px-4 text-right">1 Unit = {currency}</th>
                <th className="py-3 px-4">Last Updated</th>
                <th className="py-3 px-4 text-right">Update Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {currencyRates.map(r => (
                <tr key={r.currencyCode}>
                  <td className="py-3 px-4 font-semibold">
                    {r.currencyCode} <span className="font-normal text-slate-600 dark:text-slate-400">{r.currencyName}</span>
                    {r.isBaseCurrency && <span className="ml-2 text-[10px] text-sky-600 dark:text-sky-500 font-bold">BASE</span>}
                  </td>
                  <td className="py-3 px-4 text-right font-mono">{r.exchangeRateToBase.toFixed(4)}</td>
                  <td className="py-3 px-4 text-right font-mono">{r.inverseRate.toFixed(4)}</td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{r.lastUpdated}</td>
                  <td className="py-3 px-4 text-right">
                    {!r.isBaseCurrency && (
                      <div className="inline-flex items-center gap-2">
                        <input
                          type="number"
                          step="0.0001"
                          min="0"
                          value={rateDrafts[r.currencyCode] ?? ''}
                          onChange={e => setRateDrafts(d => ({ ...d, [r.currencyCode]: e.target.value }))}
                          placeholder={r.exchangeRateToBase.toFixed(4)}
                          className="w-24 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent font-mono text-right"
                        />
                        <button
                          onClick={() => commitRate(r.currencyCode)}
                          disabled={!(Number(rateDrafts[r.currencyCode]) > 0)}
                          className="p-1.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white rounded-lg cursor-pointer"
                          aria-label={`Update ${r.currencyCode} rate`}
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'exposure' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
              <div className="text-[10px] uppercase text-slate-600 dark:text-slate-400">Net Open Exposure ({currency})</div>
              <div className="text-xl font-bold font-mono">{netExposure.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              <div className="text-[10px] text-slate-600 dark:text-slate-400">Receivables minus payables at current spot</div>
            </div>
            {[1, 5].map(pct => (
              <div key={pct} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
                <div className="text-[10px] uppercase text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Impact of ±{pct}% rate move
                </div>
                <div className="text-xl font-bold font-mono">
                  ±{currency} {Math.abs(netExposure * pct / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-x-auto">
            {exposures.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-600 dark:text-slate-400 flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" /> No open foreign-currency balances.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Document</th>
                    <th className="py-3 px-4">Party</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4 text-right">Open Amount</th>
                    <th className="py-3 px-4 text-right">Spot Rate</th>
                    <th className="py-3 px-4 text-right">{currency} Equivalent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {exposures.map(e => (
                    <tr key={e.ref}>
                      <td className="py-3 px-4 font-mono">{e.ref}</td>
                      <td className="py-3 px-4">{e.party}</td>
                      <td className="py-3 px-4">{e.side}</td>
                      <td className="py-3 px-4 text-right font-mono">{e.currency} {e.amount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right font-mono">{e.rate ? e.rate.toFixed(4) : 'n/a'}</td>
                      <td className="py-3 px-4 text-right font-mono">{e.baseAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
