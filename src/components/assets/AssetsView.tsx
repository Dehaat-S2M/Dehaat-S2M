import React, { useState, useMemo } from 'react';
import {
  Boxes,
  Plus,
  Upload,
  Download,
  Filter,
  Search,
  Eye,
  Edit2,
  Trash2,
  ArrowRightLeft,
  ArrowDownLeft,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Laptop,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import type {
  Asset,
  Category,
  Location,
  Department,
  Vendor,
  AssetStatus,
  User as AuthUser,
  OrganizationSettings
} from '../../types';
import { StatusBadge } from '../common/Badge';
import { formatCurrency, formatDate, exportToCSV } from '../../lib/utils';

interface AssetsViewProps {
  assets: Asset[];
  categories: Category[];
  locations: Location[];
  departments: Department[];
  vendors: Vendor[];
  currentUser: AuthUser | null;
  settings: OrganizationSettings | null;
  onAddAsset: () => void;
  onEditAsset: (asset: Asset) => void;
  onDeleteAsset: (asset: Asset) => void;
  onViewAsset: (asset: Asset) => void;
  onAssignAsset: (asset: Asset) => void;
  onReturnAsset: (asset: Asset) => void;
  onImportClick: () => void;
  globalSearch: string;
}

export function AssetsView({
  assets,
  categories,
  locations,
  departments,
  vendors,
  currentUser,
  settings,
  onAddAsset,
  onEditAsset,
  onDeleteAsset,
  onViewAsset,
  onAssignAsset,
  onReturnAsset,
  onImportClick,
  globalSearch
}: AssetsViewProps) {
  // Local filtering states
  const [localSearch, setLocalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  // Sorting
  const [sortField, setSortField] = useState<keyof Asset>('createdAt');
  const [sortAsc, setSortAsc] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const effectiveSearch = (globalSearch || localSearch).trim().toLowerCase();

  const handleSort = (field: keyof Asset) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Filtered & Sorted Assets
  const filteredAssets = useMemo(() => {
    return assets
      .filter(item => {
        // Search query
        if (effectiveSearch) {
          const matchName = item.name.toLowerCase().includes(effectiveSearch);
          const matchTag = item.assetTag.toLowerCase().includes(effectiveSearch);
          const matchSerial = (item.serialNumber || '').toLowerCase().includes(effectiveSearch);
          const matchBrand = (item.brand || '').toLowerCase().includes(effectiveSearch);
          const matchModel = (item.model || '').toLowerCase().includes(effectiveSearch);
          const matchEmp = (item.assignedEmployeeName || '').toLowerCase().includes(effectiveSearch);
          const matchCat = (item.categoryName || '').toLowerCase().includes(effectiveSearch);
          if (!matchName && !matchTag && !matchSerial && !matchBrand && !matchModel && !matchEmp && !matchCat) {
            return false;
          }
        }

        // Status
        if (statusFilter !== 'all' && item.status !== statusFilter) {
          return false;
        }

        // Category
        if (categoryFilter !== 'all' && item.categoryId !== categoryFilter) {
          return false;
        }

        // Location
        if (locationFilter !== 'all' && item.locationId !== locationFilter) {
          return false;
        }

        // Department
        if (departmentFilter !== 'all' && item.departmentId !== departmentFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let valA: any = a[sortField];
        let valB: any = b[sortField];

        if (valA === undefined || valA === null) valA = '';
        if (valB === undefined || valB === null) valB = '';

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortAsc ? valA - valB : valB - valA;
        }

        const comp = String(valA).localeCompare(String(valB));
        return sortAsc ? comp : -comp;
      });
  }, [assets, effectiveSearch, statusFilter, categoryFilter, locationFilter, departmentFilter, sortField, sortAsc]);

  // Paginated Slice
  const totalPages = Math.ceil(filteredAssets.length / pageSize) || 1;
  const paginatedAssets = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAssets.slice(start, start + pageSize);
  }, [filteredAssets, currentPage, pageSize]);

  const handleExportCSV = () => {
    const exportRows = filteredAssets.map(a => ({
      'Asset Tag': a.assetTag,
      'Name': a.name,
      'Category': a.categoryName || '',
      'Brand': a.brand || '',
      'Model': a.model || '',
      'Serial Number': a.serialNumber || '',
      'Status': a.status,
      'Assigned Employee': a.assignedEmployeeName || 'Unassigned',
      'Assigned Date': a.assignedDate || '',
      'Purchase Cost': a.purchaseCost || 0,
      'Purchase Date': a.purchaseDate || '',
      'Warranty Expiry': a.warrantyExpiry || '',
      'Location': a.locationName || '',
      'Department': a.departmentName || '',
      'Vendor': a.vendorName || '',
      'Notes': a.notes || ''
    }));

    exportToCSV(`assethub_inventory_${new Date().toISOString().split('T')[0]}`, exportRows);
  };

  const canEdit = currentUser?.role !== 'Viewer';
  const canDelete = currentUser?.role === 'Super Admin';

  const statusPills: { label: string; value: string; count: number }[] = [
    { label: 'All Fleet', value: 'all', count: assets.length },
    { label: 'Available', value: 'Available', count: assets.filter(a => a.status === 'Available').length },
    { label: 'Assigned', value: 'Assigned', count: assets.filter(a => a.status === 'Assigned').length },
    { label: 'Maintenance', value: 'Under Maintenance', count: assets.filter(a => a.status === 'Under Maintenance').length },
    { label: 'Retired', value: 'Retired', count: assets.filter(a => a.status === 'Retired').length }
  ];

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Boxes className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Asset Registry & Hardware Inventory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage organization assets, assignments, lifecycle statuses, and hardware tags.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export CSV
          </button>

          {canEdit && (
            <button
              onClick={onImportClick}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors shadow-sm"
            >
              <Upload className="w-4 h-4 text-slate-500" />
              Import Batch
            </button>
          )}

          {canEdit && (
            <button
              onClick={onAddAsset}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-md shadow-indigo-600/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Asset
            </button>
          )}
        </div>
      </div>

      {/* Quick Status Pill Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs custom-scrollbar">
        {statusPills.map(pill => {
          const isSelected = statusFilter === pill.value;
          return (
            <button
              key={pill.value}
              onClick={() => {
                setStatusFilter(pill.value);
                setCurrentPage(1);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-all font-medium border ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{pill.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                  isSelected
                    ? 'bg-indigo-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {pill.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search and Advanced Dropdown Filters Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Local Search Input */}
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter table..."
              value={localSearch}
              onChange={e => {
                setLocalSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={e => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <select
              value={locationFilter}
              onChange={e => {
                setLocationFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Locations</option>
              {locations.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={departmentFilter}
              onChange={e => {
                setDepartmentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div>
            <select
              value={statusFilter}
              onChange={e => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Assigned">Assigned</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Damaged">Damaged</option>
              <option value="Lost">Lost</option>
              <option value="Retired">Retired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <tr>
                <th className="py-3 px-4">Asset</th>
                <th
                  onClick={() => handleSort('assetTag')}
                  className="py-3 px-4 cursor-pointer hover:text-indigo-600 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Tag & Serial</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('categoryName')}
                  className="py-3 px-4 cursor-pointer hover:text-indigo-600 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Category</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="py-3 px-4 cursor-pointer hover:text-indigo-600 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">Assigned Custody</th>
                <th
                  onClick={() => handleSort('locationName')}
                  className="py-3 px-4 cursor-pointer hover:text-indigo-600 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Location</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('purchaseCost')}
                  className="py-3 px-4 cursor-pointer hover:text-indigo-600 transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Cost</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedAssets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    <Boxes className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="font-semibold">No matching assets found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Try adjusting your search criteria or register a new asset.</p>
                  </td>
                </tr>
              ) : (
                paginatedAssets.map(asset => (
                  <tr
                    key={asset.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group"
                  >
                    {/* Asset Name & Thumbnail */}
                    <td className="py-3 px-4">
                      <div
                        onClick={() => onViewAsset(asset)}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        {asset.imageUrl ? (
                          <img
                            src={asset.imageUrl}
                            alt={asset.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0">
                            {asset.name[0]}
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors block truncate max-w-xs">
                            {asset.name}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block">
                            {asset.brand} {asset.model}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Tag & Serial */}
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {asset.assetTag}
                      </div>
                      <div className="font-mono text-[10px] text-slate-400 truncate">
                        SN: {asset.serialNumber || '—'}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                      {asset.categoryName}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <StatusBadge status={asset.status} />
                    </td>

                    {/* Custody */}
                    <td className="py-3 px-4">
                      {asset.assignedEmployeeName ? (
                        <div>
                          <div className="font-medium text-slate-900 dark:text-slate-200 truncate">
                            {asset.assignedEmployeeName}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Since {formatDate(asset.assignedDate)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">In Stock</span>
                      )}
                    </td>

                    {/* Location */}
                    <td className="py-3 px-4">
                      <div className="text-slate-800 dark:text-slate-200 truncate max-w-[130px]">
                        {asset.locationName}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[130px]">
                        {asset.departmentName}
                      </div>
                    </td>

                    {/* Cost */}
                    <td className="py-3 px-4 text-right font-medium text-slate-900 dark:text-slate-100">
                      {formatCurrency(asset.purchaseCost, settings?.defaultCurrency, settings?.currencySymbol)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* View Modal */}
                        <button
                          onClick={() => onViewAsset(asset)}
                          title="View Details"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Check In / Out Quick Button */}
                        {canEdit && (
                          asset.status === 'Assigned' ? (
                            <button
                              onClick={() => onReturnAsset(asset)}
                              title="Check-In (Return Asset)"
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                            >
                              <ArrowDownLeft className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => onAssignAsset(asset)}
                              title="Check-Out (Assign to Employee)"
                              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                            >
                              <ArrowRightLeft className="w-4 h-4" />
                            </button>
                          )
                        )}

                        {/* Edit Button */}
                        {canEdit && (
                          <button
                            onClick={() => onEditAsset(asset)}
                            title="Edit Asset"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}

                        {/* Delete Button */}
                        {canDelete && (
                          <button
                            onClick={() => onDeleteAsset(asset)}
                            title="Delete Asset"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[11px] text-slate-500 dark:text-slate-400">
          <div>
            Showing <strong>{filteredAssets.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> to{' '}
            <strong>{Math.min(currentPage * pageSize, filteredAssets.length)}</strong> of{' '}
            <strong>{filteredAssets.length}</strong> total assets
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
