import React, { useState } from 'react';
import {
  Wand2,
  Plus,
  Play,
  Save,
  Download,
  Trash2,
  Filter,
  Layers,
  Sparkles,
  Database,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { useBI } from '../../services/biStore';
import { DemoDataBanner } from '../common/DemoDataBanner';
import { DATA_SOURCE_REGISTRY, executeReportQuery, ExecutionResult } from '../../services/reportExecutionEngine';
import { ReportDefinition, ReportFilter, DataField, DataSource } from '../../types';
import { exportToCSV } from '../../services/exportService';

export const ReportBuilderView: React.FC = () => {
  const { reports, addReport, formatCurrency } = useBI();

  const [selectedSourceId, setSelectedSourceId] = useState<string>('ds-sales-invoices');
  const [reportTitle, setReportTitle] = useState('New Custom ERP Query Report');
  const [reportDescription, setReportDescription] = useState('Ad-hoc executive data extract');
  
  const currentDataSource = DATA_SOURCE_REGISTRY.find(d => d.id === selectedSourceId) || DATA_SOURCE_REGISTRY[0];

  const [selectedFieldIds, setSelectedFieldIds] = useState<string[]>([
    'sl_customer_name',
    'sl_category',
    'sl_revenue',
    'sl_margin_amt'
  ]);

  const [queryResult, setQueryResult] = useState<ExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState(false);

  const availableSourceFields = currentDataSource.fields;

  const handleSourceChange = (srcId: string) => {
    setSelectedSourceId(srcId);
    const newDs = DATA_SOURCE_REGISTRY.find(d => d.id === srcId) || DATA_SOURCE_REGISTRY[0];
    const defaultIds = newDs.fields.slice(0, 4).map(f => f.id);
    setSelectedFieldIds(defaultIds);
    setQueryResult(null);
  };

  const handleToggleField = (fieldId: string) => {
    if (selectedFieldIds.includes(fieldId)) {
      setSelectedFieldIds(selectedFieldIds.filter(id => id !== fieldId));
    } else {
      setSelectedFieldIds([...selectedFieldIds, fieldId]);
    }
  };

  const handleRunQuery = () => {
    setIsExecuting(true);
    setTimeout(() => {
      const def: ReportDefinition = {
        id: 'temp-preview',
        code: 'RPT-PREVIEW',
        title: reportTitle,
        description: reportDescription,
        category: 'Custom Ad-hoc',
        dataSourceId: selectedSourceId,
        selectedFields: selectedFieldIds,
        filters: [],
        groupByFields: [],
        sorts: [],
        calculatedFields: [],
        visualization: 'table',
        createdBy: 'Current User',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      const data = executeReportQuery(def);
      setQueryResult(data);
      setIsExecuting(false);
    }, 200);
  };

  const handleSaveReport = () => {
    const newReport: ReportDefinition = {
      id: `rep-${Date.now()}`,
      code: `RPT-USR-${String(reports.length + 1).padStart(2, '0')}`,
      title: reportTitle,
      description: reportDescription,
      category: 'Custom Ad-hoc',
      dataSourceId: selectedSourceId,
      selectedFields: selectedFieldIds,
      filters: [],
      groupByFields: [],
      sorts: [],
      calculatedFields: [],
      visualization: 'table',
      createdBy: 'BI Administrator',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    addReport(newReport);
    setSaveSuccessMessage(true);
    setTimeout(() => setSaveSuccessMessage(false), 3000);
  };

  const handleExportResult = () => {
    if (!queryResult || queryResult.rows.length === 0) return;
    const cols = queryResult.headers.map(h => ({ key: h.key, label: h.label }));
    exportToCSV(reportTitle.replace(/\s+/g, '_'), cols, queryResult.rows);
  };

  return (
    <div className="space-y-6">
      <DemoDataBanner moduleSource="Module 02.26 Visual Ad-hoc Report Builder & Query Engine" />

      {/* Builder Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Ad-hoc Report Studio & SQL-Free Dataset Builder
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Combine cross-module datasets, apply multi-condition filters, and execute real-time queries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccessMessage && (
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-lg flex items-center gap-1 animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Report Saved!
            </span>
          )}

          <button
            onClick={handleRunQuery}
            disabled={isExecuting || selectedFieldIds.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg shadow-xs transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {isExecuting ? 'Executing Query...' : 'Run Query'}
          </button>

          <button
            onClick={handleSaveReport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            Save Report
          </button>
        </div>
      </div>

      {/* 2-Column Builder Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Configuration Controls (1 col) */}
        <div className="space-y-4">
          {/* Metadata */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">1. Report Definition</h3>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Report Title</label>
              <input
                type="text"
                value={reportTitle}
                onChange={e => setReportTitle(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold focus:bg-white dark:focus:bg-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Primary Data Source</label>
              <select
                value={selectedSourceId}
                onChange={e => handleSourceChange(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold focus:bg-white dark:focus:bg-slate-900"
              >
                {DATA_SOURCE_REGISTRY.map(ds => (
                  <option key={ds.id} value={ds.id}>
                    {ds.name} ({ds.domain})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Selectable Columns */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">2. Available Fields</h3>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                {selectedFieldIds.length} Selected
              </span>
            </div>

            <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
              {availableSourceFields.map(f => {
                const isSelected = selectedFieldIds.includes(f.id);
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => handleToggleField(f.id)}
                    className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 text-indigo-950 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800/50 border border-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{f.label}</span>
                    <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase">{f.dataType}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Query Results / Live Preview (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-xs flex flex-col min-h-[480px]">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Query Output & Live Data Table</h3>
              </div>

              {queryResult && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                    {queryResult.rows.length} Rows • {queryResult.executionTimeMs.toFixed(1)}ms
                  </span>
                  <button
                    onClick={handleExportResult}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
                  >
                    <Download className="w-3.5 h-3.5" />
                    CSV
                  </button>
                </div>
              )}
            </div>

            {queryResult === null ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500 dark:text-slate-400">
                <Database className="w-12 h-12 stroke-1 text-slate-400 dark:text-slate-300 mb-2" />
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400">No Query Executed Yet</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                  Select your fields and click <strong className="text-indigo-600 dark:text-indigo-400">"Run Query"</strong> to compute real-time dataset outputs.
                </p>
              </div>
            ) : queryResult.rows.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-8 text-slate-500 dark:text-slate-400 text-xs">
                No matching records found for the applied filter parameters.
              </div>
            ) : (
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-semibold">
                      {queryResult.headers.map(h => (
                        <th key={h.key} className="py-2.5 px-3">
                          {h.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {queryResult.rows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        {queryResult.headers.map(h => {
                          const val = row[h.key];
                          let displayVal = val;
                          if (h.dataType === 'currency' && typeof val === 'number') {
                            displayVal = formatCurrency(val);
                          } else if (h.dataType === 'percent' && typeof val === 'number') {
                            displayVal = `${val}%`;
                          }
                          return (
                            <td
                              key={h.key}
                              className={`py-2.5 px-3 ${
                                h.dataType === 'currency' || h.dataType === 'number' || h.dataType === 'percent'
                                  ? 'font-mono text-right'
                                  : 'text-slate-800 dark:text-slate-200'
                              }`}
                            >
                              {displayVal !== undefined ? String(displayVal) : '-'}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
