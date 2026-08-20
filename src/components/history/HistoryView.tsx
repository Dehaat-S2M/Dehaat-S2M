import React, { useState, useMemo } from 'react';
import { History, Download, Search, Filter, Clock, User, Tag, Calendar } from 'lucide-react';
import type { AssetHistory } from '../../types';
import { exportToCSV, formatDateTime } from '../../lib/utils';

interface HistoryViewProps {
  history: AssetHistory[];
  globalSearch: string;
}

export function HistoryView({ history, globalSearch }: HistoryViewProps) {
  const [localSearch, setLocalSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const effectiveSearch = (globalSearch || localSearch).trim().toLowerCase();

  const uniqueActions = useMemo(() => {
    return Array.from(new Set(history.map(h => h.action)));
  }, [history]);

  const filteredHistory = useMemo(() => {
    return history
      .filter(item => {
        if (effectiveSearch) {
          const matchTag = item.assetTag.toLowerCase().includes(effectiveSearch);
          const matchAction = item.action.toLowerCase().includes(effectiveSearch);
          const matchUser = item.userName.toLowerCase().includes(effectiveSearch);
          const matchNotes = (item.notes || '').toLowerCase().includes(effectiveSearch);
          if (!matchTag && !matchAction && !matchUser && !matchNotes) return false;
        }

        if (actionFilter !== 'all' && item.action !== actionFilter) return false;

        return true;
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [history, effectiveSearch, actionFilter]);

  const totalPages = Math.ceil(filteredHistory.length / pageSize) || 1;
  const paginatedHistory = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredHistory.slice(start, start + pageSize);
  }, [filteredHistory, currentPage, pageSize]);

  const handleExportCSV = () => {
    const rows = filteredHistory.map(h => ({
      'Timestamp': h.timestamp,
      'Asset Tag': h.assetTag,
      'Action': h.action,
      'Performed By': h.userName,
      'Previous Value': h.previousValue || '',
      'New Value': h.newValue || '',
      'Notes': h.notes || ''
    }));
    exportToCSV(`assethub_audit_history_${new Date().toISOString().split('T')[0]}`, rows);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Audit Trail & Asset Lifecycle History
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Immutable log of all asset creations, check-outs, returns, status transitions, and maintenance updates.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-slate-500" />
          Export Audit Log
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="relative sm:col-span-2">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by asset tag, user, action, notes..."
              value={localSearch}
              onChange={e => {
                setLocalSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <select
              value={actionFilter}
              onChange={e => {
                setActionFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Lifecycle Actions</option>
              {uniqueActions.map(act => (
                <option key={act} value={act}>{act}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <tr>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Asset Tag</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Performed By</th>
                <th className="py-3 px-4">Details / Changes</th>
                <th className="py-3 px-4">Notes</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedHistory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    <History className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="font-semibold">No audit entries found</p>
                  </td>
                </tr>
              ) : (
                paginatedHistory.map(item => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3 px-4 whitespace-nowrap text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                      {formatDateTime(item.timestamp)}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {item.assetTag}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-semibold text-[10px] ${
                          item.action.includes('Assigned') || item.action.includes('Check-Out')
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : item.action.includes('Returned') || item.action.includes('Check-In')
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : item.action.includes('Created') || item.action.includes('Imported')
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                            : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {item.action}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {item.userName}
                    </td>

                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {item.previousValue && item.newValue ? (
                        <div className="text-[11px]">
                          <span className="line-through text-rose-500 mr-1">{item.previousValue}</span>
                          <span>→</span>
                          <span className="text-emerald-500 font-medium ml-1">{item.newValue}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                      {item.notes || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[11px] text-slate-500 dark:text-slate-400">
          <div>
            Showing <strong>{filteredHistory.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> to{' '}
            <strong>{Math.min(currentPage * pageSize, filteredHistory.length)}</strong> of{' '}
            <strong>{filteredHistory.length}</strong> total events
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
            >
              Previous
            </button>
            <span className="px-2 font-semibold text-slate-800 dark:text-slate-200">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
