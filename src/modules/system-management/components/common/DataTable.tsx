import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Columns,
  RefreshCw,
  Plus
} from 'lucide-react';

export interface ColumnDef<T> {
  key: string;
  header: string;
  accessor?: (item: T) => React.ReactNode;
  sortable?: boolean;
  searchable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  title?: string;
  subtitle?: string;
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor: (item: T) => string;
  onAddClick?: () => void;
  addLabel?: string;
  searchPlaceholder?: string;
  onRowClick?: (item: T) => void;
  actionRenderer?: (item: T) => React.ReactNode;
  exportFileName?: string;
  filterOptions?: {
    key: string;
    label: string;
    options: { value: string; label: string }[];
    filterFn: (item: T, selectedValue: string) => boolean;
  }[];
  batchActions?: {
    label: string;
    icon?: React.ReactNode;
    onClick: (selectedItems: T[]) => void;
    variant?: 'default' | 'danger';
  }[];
}

export function DataTable<T extends Record<string, any>>({
  title,
  subtitle,
  data,
  columns,
  keyExtractor,
  onAddClick,
  addLabel = 'New Record',
  searchPlaceholder = 'Search records...',
  onRowClick,
  actionRenderer,
  exportFileName = 'export-data',
  filterOptions,
  batchActions
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filter and search
  const filteredData = useMemo(() => {
    let result = [...data];

    // Filter dropdowns
    if (filterOptions) {
      filterOptions.forEach(filter => {
        const selectedVal = selectedFilters[filter.key];
        if (selectedVal && selectedVal !== 'ALL') {
          result = result.filter(item => filter.filterFn(item, selectedVal));
        }
      });
    }

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(item => {
        return columns.some(col => {
          if (col.searchable === false) return false;
          const val = item[col.key];
          if (val === null || val === undefined) return false;
          return String(val).toLowerCase().includes(q);
        });
      });
    }

    // Sorting
    if (sortKey) {
      result.sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];
        if (valA === valB) return 0;
        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;
        const comp = String(valA).localeCompare(String(valB), undefined, { numeric: true });
        return sortDirection === 'asc' ? comp : -comp;
      });
    }

    return result;
  }, [data, filterOptions, selectedFilters, searchTerm, columns, sortKey, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortKey(null);
        setSortDirection('asc');
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedData.length) {
      setSelectedIds(new Set());
    } else {
      const newSet = new Set(paginatedData.map(item => keyExtractor(item)));
      setSelectedIds(newSet);
    }
  };

  const toggleSelectItem = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const exportToCsv = () => {
    if (filteredData.length === 0) return;
    const headers = columns.map(c => `"${c.header}"`).join(',');
    const rows = filteredData.map(item => {
      return columns
        .map(c => {
          const val = item[c.key];
          return `"${String(val ?? '').replace(/"/g, '""')}"`;
        })
        .join(',');
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${exportFileName}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
      {/* Header bar */}
      {(title || onAddClick) && (
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/50">
          <div>
            {title && <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {batchActions && selectedIds.size > 0 && (
              <div className="flex items-center gap-2 mr-2 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-700 dark:text-indigo-300">
                <span>{selectedIds.size} selected</span>
                {batchActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const selectedItems = data.filter(item => selectedIds.has(keyExtractor(item)));
                      action.onClick(selectedItems);
                      setSelectedIds(new Set());
                    }}
                    className={`px-2 py-1 rounded font-semibold text-xs ${
                      action.variant === 'danger'
                        ? 'bg-rose-600 text-white hover:bg-rose-700'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={exportToCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors shadow-xs"
              title="Export filtered records to CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Export CSV</span>
            </button>

            {onAddClick && (
              <button
                onClick={onAddClick}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{addLabel}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Filter and search controls */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-400"
            >
              ×
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {filterOptions &&
            filterOptions.map(filter => (
              <div key={filter.key} className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{filter.label}:</span>
                <select
                  value={selectedFilters[filter.key] || 'ALL'}
                  onChange={e => {
                    setSelectedFilters(prev => ({ ...prev, [filter.key]: e.target.value }));
                    setCurrentPage(1);
                  }}
                  className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="ALL">All {filter.label}</option>
                  {filter.options.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}

          <div className="flex items-center gap-1.5 ml-auto text-xs text-slate-500 dark:text-slate-400">
            <span>Show:</span>
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto flex-1 min-h-[220px]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              {batchActions && (
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={paginatedData.length > 0 && selectedIds.size === paginatedData.length}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 dark:border-slate-600 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 cursor-pointer"
                  />
                </th>
              )}
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => (col.sortable !== false ? handleSort(col.key) : undefined)}
                  className={`py-3 px-4 select-none ${col.sortable !== false ? 'cursor-pointer hover:bg-slate-100/60 dark:hover:bg-slate-800/60' : ''} ${
                    col.className || ''
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span>{col.header}</span>
                    {col.sortable !== false && sortKey === col.key && (
                      <span>{sortDirection === 'asc' ? <ChevronUp className="w-3 h-3 text-indigo-600 dark:text-indigo-400" /> : <ChevronDown className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />}</span>
                    )}
                  </div>
                </th>
              ))}
              {actionRenderer && <th className="py-3 px-4 text-right w-24">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (batchActions ? 1 : 0) + (actionRenderer ? 1 : 0)} className="py-12 text-center text-slate-500 dark:text-slate-400">
                  <div className="flex flex-col items-center justify-center">
                    <Filter className="w-8 h-8 text-slate-400 dark:text-slate-300 mb-2 stroke-1" />
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No matching records found</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Try refining your search query or filter options</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map(item => {
                const id = keyExtractor(item);
                const isSelected = selectedIds.has(id);
                return (
                  <tr
                    key={id}
                    onClick={() => onRowClick && onRowClick(item)}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-colors ${
                      isSelected ? 'bg-indigo-50/40 dark:bg-indigo-500/40' : ''
                    } ${onRowClick ? 'cursor-pointer' : ''}`}
                  >
                    {batchActions && (
                      <td className="py-3 px-4" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectItem(id)}
                          className="rounded border-slate-300 dark:border-slate-600 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 cursor-pointer"
                        />
                      </td>
                    )}
                    {columns.map(col => (
                      <td key={col.key} className={`py-3 px-4 text-slate-700 dark:text-slate-300 ${col.className || ''}`}>
                        {col.accessor ? col.accessor(item) : item[col.key]}
                      </td>
                    ))}
                    {actionRenderer && (
                      <td className="py-3 px-4 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                        {actionRenderer(item)}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3.5 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div>
          Showing{' '}
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {filteredData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
          </span>{' '}
          to{' '}
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {Math.min(currentPage * pageSize, filteredData.length)}
          </span>{' '}
          of <span className="font-semibold text-slate-700 dark:text-slate-300">{filteredData.length}</span> entries
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 dark:text-slate-400 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 py-1 font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 dark:text-slate-400 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
