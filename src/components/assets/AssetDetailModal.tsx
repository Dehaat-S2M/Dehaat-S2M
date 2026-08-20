import React from 'react';
import {
  X,
  QrCode,
  Tag,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  Shield,
  Truck,
  User,
  History,
  Edit2,
  Trash2,
  ArrowRightLeft,
  ArrowDownLeft,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';
import type { Asset, AssetHistory, AssetAssignment, User as AuthUser } from '../../types';
import { StatusBadge } from '../common/Badge';
import { formatCurrency, formatDate, formatDateTime } from '../../lib/utils';

interface AssetDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: (Asset & { history: AssetHistory[]; activeAssignment?: AssetAssignment }) | null;
  currentUser: AuthUser | null;
  onEdit: (asset: Asset) => void;
  onDelete: (assetId: string) => void;
  onAssign: (asset: Asset) => void;
  onReturn: (asset: Asset) => void;
}

export function AssetDetailModal({
  isOpen,
  onClose,
  asset,
  currentUser,
  onEdit,
  onDelete,
  onAssign,
  onReturn
}: AssetDetailModalProps) {
  if (!isOpen || !asset) return null;

  const canEdit = currentUser?.role !== 'Viewer';
  const canDelete = currentUser?.role === 'Super Admin';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />

      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-10 flex flex-col overflow-hidden text-xs">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-3">
            {asset.imageUrl ? (
              <img
                src={asset.imageUrl}
                alt={asset.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
                {asset.name[0]}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {asset.name}
                </h2>
                <StatusBadge status={asset.status} />
              </div>
              <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">{asset.assetTag}</span>
                <span>•</span>
                <span>{asset.brand} {asset.model}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {canEdit && (
              <button
                onClick={() => onEdit(asset)}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Edit Asset"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => onDelete(asset.id)}
                className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Delete Asset"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* Quick Action Bar (Check Out / Return) */}
          {canEdit && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">
                  Lifecycle Status:
                </span>{' '}
                <span className="text-slate-600 dark:text-slate-400">
                  {asset.status === 'Assigned'
                    ? `Currently assigned to ${asset.assignedEmployeeName}`
                    : `Currently in inventory (${asset.status})`}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {asset.status === 'Assigned' ? (
                  <button
                    onClick={() => onReturn(asset)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-sm transition-all"
                  >
                    <ArrowDownLeft className="w-4 h-4" />
                    Check-In (Return Asset)
                  </button>
                ) : (
                  <button
                    onClick={() => onAssign(asset)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-sm transition-all"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                    Check-Out (Assign to Employee)
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Asset Specs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Column 1: Hardware Specs */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                <Tag className="w-4 h-4 text-indigo-500" />
                Hardware Details
              </h3>
              <div className="space-y-1.5 text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Category:</span>
                  <strong className="text-slate-900 dark:text-slate-100">{asset.categoryName}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Brand:</span>
                  <strong className="text-slate-900 dark:text-slate-100">{asset.brand || '—'}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Model:</span>
                  <strong className="text-slate-900 dark:text-slate-100">{asset.model || '—'}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Serial No:</span>
                  <strong className="font-mono text-slate-900 dark:text-slate-100">{asset.serialNumber || '—'}</strong>
                </div>
              </div>
            </div>

            {/* Column 2: Procurement & Warranty */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                Financial & Warranty
              </h3>
              <div className="space-y-1.5 text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Purchase Cost:</span>
                  <strong className="text-slate-900 dark:text-slate-100">{formatCurrency(asset.purchaseCost)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Purchase Date:</span>
                  <strong className="text-slate-900 dark:text-slate-100">{formatDate(asset.purchaseDate)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Warranty Expiry:</span>
                  <strong className="text-slate-900 dark:text-slate-100">{formatDate(asset.warrantyExpiry)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Vendor:</span>
                  <strong className="text-slate-900 dark:text-slate-100">{asset.vendorName || '—'}</strong>
                </div>
              </div>
            </div>

            {/* Column 3: Location & Custody */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                <MapPin className="w-4 h-4 text-purple-500" />
                Location & Custody
              </h3>
              <div className="space-y-1.5 text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Location:</span>
                  <strong className="text-slate-900 dark:text-slate-100">{asset.locationName}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Department:</span>
                  <strong className="text-slate-900 dark:text-slate-100">{asset.departmentName}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Assigned To:</span>
                  <strong className="text-blue-600 dark:text-blue-400 font-semibold">{asset.assignedEmployeeName || 'Unassigned'}</strong>
                </div>
                {asset.assignedDate && (
                  <div className="flex justify-between">
                    <span>Assigned On:</span>
                    <strong className="text-slate-900 dark:text-slate-100">{formatDate(asset.assignedDate)}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Barcode & Physical Tag Preview */}
          <div className="p-4 rounded-xl bg-slate-950 text-white flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                Physical Asset Tag & QR Code
              </div>
              <div className="font-mono text-base font-bold tracking-widest mt-1">
                {asset.assetTag}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Scan with mobile camera or handheld barcode scanner
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-white text-slate-900 flex flex-col items-center justify-center">
              <QrCode className="w-10 h-10" />
              <span className="text-[9px] font-mono font-bold mt-1">{asset.assetTag}</span>
            </div>
          </div>

          {/* Notes */}
          {asset.notes && (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <div className="font-semibold text-slate-900 dark:text-white mb-1">
                Technical Notes & Configuration
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {asset.notes}
              </p>
            </div>
          )}

          {/* Audit History Timeline */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3 flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-500" />
              Complete Asset Audit History
            </h3>

            {asset.history && asset.history.length > 0 ? (
              <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 space-y-4">
                {asset.history.map(item => (
                  <div key={item.id} className="relative">
                    <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-white dark:ring-slate-900" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {item.action}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                          by {item.userName}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-400 text-[11px]">
                          {formatDateTime(item.timestamp)}
                        </span>
                      </div>
                      {item.previousValue && item.newValue && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Changed: <span className="line-through text-rose-500">{item.previousValue}</span> →{' '}
                          <span className="text-emerald-500 font-medium">{item.newValue}</span>
                        </div>
                      )}
                      {item.notes && (
                        <p className="text-slate-600 dark:text-slate-300 mt-1 text-[11px]">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 py-2">No past history recorded for this asset.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
