import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  DollarSign,
  TrendingDown,
  ShieldAlert,
  Archive,
  Users,
  CheckCircle2,
  Calendar,
  Layers,
  Calculator
} from 'lucide-react';
import type { Asset, Category, Department, Location, OrganizationSettings } from '../../types';
import { formatCurrency, formatDate, exportToCSV } from '../../lib/utils';
import { StatusBadge } from '../common/Badge';

interface ReportsViewProps {
  assets: Asset[];
  categories: Category[];
  departments: Department[];
  locations: Location[];
  settings: OrganizationSettings | null;
}

export function ReportsView({
  assets,
  categories,
  departments,
  locations,
  settings
}: ReportsViewProps) {
  const [selectedReport, setSelectedReport] = useState<
    'depreciation' | 'warranties' | 'idle' | 'department_budget'
  >('depreciation');

  const [depreciationYears, setDepreciationYears] = useState<number>(3);

  const currencySymbol = settings?.currencySymbol || '$';
  const currencyCode = settings?.defaultCurrency || 'USD';

  // 1. Depreciation Calculation (Straight line)
  const depreciationData = useMemo(() => {
    const now = new Date().getTime();
    return assets.map(a => {
      const pCost = a.purchaseCost || 0;
      const pDate = new Date(a.purchaseDate || Date.now()).getTime();
      const ageInDays = Math.max(0, (now - pDate) / (1000 * 60 * 60 * 24));
      const totalLifecycleDays = depreciationYears * 365;
      const fractionDepreciated = Math.min(1, ageInDays / totalLifecycleDays);
      const currentValue = Math.max(0, pCost * (1 - fractionDepreciated));
      const accumulatedDepreciation = pCost - currentValue;

      return {
        ...a,
        ageInMonths: Math.round(ageInDays / 30),
        currentValue: Math.round(currentValue * 100) / 100,
        accumulatedDepreciation: Math.round(accumulatedDepreciation * 100) / 100,
        depreciationPercentage: Math.round(fractionDepreciated * 100)
      };
    });
  }, [assets, depreciationYears]);

  const totalOriginalCost = useMemo(() => assets.reduce((sum, a) => sum + (a.purchaseCost || 0), 0), [assets]);
  const totalCurrentValue = useMemo(() => depreciationData.reduce((sum, a) => sum + a.currentValue, 0), [depreciationData]);

  // 2. Expiring Warranties
  const expiringWarranties = useMemo(() => {
    const now = new Date();
    const next180Days = new Date(now.getTime() + 180 * 86400000);
    return assets
      .filter(a => {
        if (!a.warrantyExpiry) return false;
        const wDate = new Date(a.warrantyExpiry);
        return wDate <= next180Days;
      })
      .sort((a, b) => new Date(a.warrantyExpiry).getTime() - new Date(b.warrantyExpiry).getTime());
  }, [assets]);

  // 3. Idle / Available Assets
  const idleAssets = useMemo(() => {
    return assets.filter(a => a.status === 'Available');
  }, [assets]);

  // 4. Department Hardware Allocation
  const departmentStats = useMemo(() => {
    return departments.map(d => {
      const deptAssets = assets.filter(a => a.departmentId === d.id);
      const totalValue = deptAssets.reduce((sum, a) => sum + (a.purchaseCost || 0), 0);
      return {
        ...d,
        assetCount: deptAssets.length,
        totalValue,
        budgetUtilization: d.budget ? Math.round((totalValue / d.budget) * 100) : 0
      };
    });
  }, [departments, assets]);

  // Export handlers
  const handleExportDepreciation = () => {
    const rows = depreciationData.map(a => ({
      'Asset Tag': a.assetTag,
      'Name': a.name,
      'Category': a.categoryName || '',
      'Purchase Date': a.purchaseDate,
      'Original Cost': a.purchaseCost,
      'Current Book Value': a.currentValue,
      'Accumulated Depreciation': a.accumulatedDepreciation,
      'Depreciated %': `${a.depreciationPercentage}%`,
      'Status': a.status
    }));
    exportToCSV(`assethub_depreciation_report_${depreciationYears}yr`, rows);
  };

  const handleExportWarranties = () => {
    const rows = expiringWarranties.map(a => ({
      'Asset Tag': a.assetTag,
      'Name': a.name,
      'Vendor': a.vendorName || '',
      'Serial Number': a.serialNumber || '',
      'Warranty Expiry': a.warrantyExpiry,
      'Status': a.status,
      'Assigned Custodian': a.assignedEmployeeName || 'Unassigned'
    }));
    exportToCSV('assethub_warranty_expirations', rows);
  };

  const handleExportIdle = () => {
    const rows = idleAssets.map(a => ({
      'Asset Tag': a.assetTag,
      'Name': a.name,
      'Category': a.categoryName || '',
      'Location': a.locationName || '',
      'Purchase Cost': a.purchaseCost,
      'Status': a.status
    }));
    exportToCSV('assethub_idle_available_inventory', rows);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          Financial & Inventory Reports
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Generate capital depreciation models, warranty coverage audits, and department allocation statements.
        </p>
      </div>

      {/* Report Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-semibold overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setSelectedReport('depreciation')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            selectedReport === 'depreciation'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          Asset Depreciation & Valuation
        </button>

        <button
          onClick={() => setSelectedReport('warranties')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            selectedReport === 'warranties'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          Warranty Expirations ({expiringWarranties.length})
        </button>

        <button
          onClick={() => setSelectedReport('idle')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            selectedReport === 'idle'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Archive className="w-4 h-4" />
          Available / Unassigned Stock ({idleAssets.length})
        </button>

        <button
          onClick={() => setSelectedReport('department_budget')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            selectedReport === 'department_budget'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Department Budget & Fleet Allocation
        </button>
      </div>

      {/* REPORT 1: DEPRECIATION */}
      {selectedReport === 'depreciation' && (
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-500">Total Procurement Cost</span>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {formatCurrency(totalOriginalCost, currencyCode, currencySymbol)}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-500">Current Net Book Value ({depreciationYears}-Year Model)</span>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {formatCurrency(totalCurrentValue, currencyCode, currencySymbol)}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-500">Total Accumulated Depreciation</span>
              <div className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1">
                {formatCurrency(totalOriginalCost - totalCurrentValue, currencyCode, currencySymbol)}
              </div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-indigo-500" />
                Useful Lifecycle Span:
              </span>
              <div className="flex items-center gap-1">
                {[3, 4, 5].map(yrs => (
                  <button
                    key={yrs}
                    onClick={() => setDepreciationYears(yrs)}
                    className={`px-3 py-1.5 rounded-lg font-medium border transition-colors ${
                      depreciationYears === yrs
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {yrs} Years
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleExportDepreciation}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-sm"
            >
              <Download className="w-4 h-4" />
              Export Valuation CSV
            </button>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] uppercase font-bold text-slate-500">
                  <tr>
                    <th className="p-3">Asset</th>
                    <th className="p-3">Purchase Date</th>
                    <th className="p-3 text-right">Original Cost</th>
                    <th className="p-3 text-right">Current Book Value</th>
                    <th className="p-3 text-right">Depreciation</th>
                    <th className="p-3">Depreciated Bar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {depreciationData.map(a => (
                    <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3">
                        <div className="font-semibold text-slate-900 dark:text-white">{a.name}</div>
                        <div className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400">{a.assetTag}</div>
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">{formatDate(a.purchaseDate)}</td>
                      <td className="p-3 text-right font-medium text-slate-900 dark:text-white">
                        {formatCurrency(a.purchaseCost)}
                      </td>
                      <td className="p-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(a.currentValue)}
                      </td>
                      <td className="p-3 text-right text-rose-600 dark:text-rose-400">
                        -{formatCurrency(a.accumulatedDepreciation)}
                      </td>
                      <td className="p-3 min-w-[130px]">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-indigo-600 h-full rounded-full"
                              style={{ width: `${a.depreciationPercentage}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-mono text-slate-500">{a.depreciationPercentage}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* REPORT 2: WARRANTIES */}
      {selectedReport === 'warranties' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Warranties Expiring Soon (Next 180 Days)
            </h2>
            <button
              onClick={handleExportWarranties}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-sm"
            >
              <Download className="w-4 h-4" />
              Export Warranty CSV
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] uppercase font-bold text-slate-500">
                <tr>
                  <th className="p-3">Asset</th>
                  <th className="p-3">Serial No</th>
                  <th className="p-3">Vendor</th>
                  <th className="p-3">Custodian</th>
                  <th className="p-3">Warranty Expiry</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {expiringWarranties.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-500">
                      No asset warranties expiring within the next 180 days.
                    </td>
                  </tr>
                ) : (
                  expiringWarranties.map(a => (
                    <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3 font-semibold text-slate-900 dark:text-white">
                        {a.name} <span className="font-mono text-indigo-600 text-[11px]">({a.assetTag})</span>
                      </td>
                      <td className="p-3 font-mono">{a.serialNumber || '—'}</td>
                      <td className="p-3">{a.vendorName || '—'}</td>
                      <td className="p-3">{a.assignedEmployeeName || 'Unassigned'}</td>
                      <td className="p-3 text-rose-600 font-semibold">{formatDate(a.warrantyExpiry)}</td>
                      <td className="p-3"><StatusBadge status={a.status} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT 3: IDLE ASSETS */}
      {selectedReport === 'idle' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Available & Unassigned Inventory
            </h2>
            <button
              onClick={handleExportIdle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-sm"
            >
              <Download className="w-4 h-4" />
              Export Available Stock CSV
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] uppercase font-bold text-slate-500">
                <tr>
                  <th className="p-3">Asset</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Purchase Date</th>
                  <th className="p-3 text-right">Value</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {idleAssets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-500">
                      No idle assets currently in stock. All units assigned or in service.
                    </td>
                  </tr>
                ) : (
                  idleAssets.map(a => (
                    <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3 font-semibold text-slate-900 dark:text-white">
                        {a.name} <span className="font-mono text-indigo-600 text-[11px]">({a.assetTag})</span>
                      </td>
                      <td className="p-3">{a.categoryName}</td>
                      <td className="p-3">{a.locationName}</td>
                      <td className="p-3">{formatDate(a.purchaseDate)}</td>
                      <td className="p-3 text-right font-medium">{formatCurrency(a.purchaseCost)}</td>
                      <td className="p-3"><StatusBadge status={a.status} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT 4: DEPARTMENT ALLOCATION */}
      {selectedReport === 'department_budget' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {departmentStats.map(d => (
              <div
                key={d.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">{d.name}</h3>
                  <span className="font-mono text-xs font-bold text-indigo-600">{d.code}</span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span>Allocated Fleet Value:</span>
                    <strong className="text-slate-900 dark:text-white">{formatCurrency(d.totalValue)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Budget Limit:</span>
                    <strong className="text-slate-900 dark:text-white">{formatCurrency(d.budget || 0)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Hardware Units:</span>
                    <strong className="text-indigo-600">{d.assetCount} Assets</strong>
                  </div>
                </div>

                <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Budget Consumed</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{d.budgetUtilization}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        d.budgetUtilization > 90 ? 'bg-rose-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${Math.min(100, d.budgetUtilization)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
