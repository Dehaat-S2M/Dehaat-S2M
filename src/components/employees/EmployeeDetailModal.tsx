import React from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  Boxes,
  ArrowDownLeft,
  History,
  Edit2,
  Trash2
} from 'lucide-react';
import type { Employee, Asset, AssetAssignment, User as AuthUser } from '../../types';
import { StatusBadge } from '../common/Badge';
import { formatDate, formatCurrency } from '../../lib/utils';

interface EmployeeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: (Employee & { assignedAssets: Asset[]; pastAssignments: AssetAssignment[] }) | null;
  currentUser: AuthUser | null;
  onEdit: (emp: Employee) => void;
  onDelete: (empId: string) => void;
  onReturnAsset: (asset: Asset) => void;
  onViewAsset: (asset: Asset) => void;
}

export function EmployeeDetailModal({
  isOpen,
  onClose,
  employee,
  currentUser,
  onEdit,
  onDelete,
  onReturnAsset,
  onViewAsset
}: EmployeeDetailModalProps) {
  if (!isOpen || !employee) return null;

  const canEdit = currentUser?.role !== 'Viewer';
  const canDelete = currentUser?.role === 'Super Admin';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />

      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-10 flex flex-col overflow-hidden text-xs">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-3.5">
            <img
              src={employee.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
              alt={employee.fullName}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-500/30 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {employee.fullName}
                </h2>
                <StatusBadge status={employee.status} />
              </div>
              <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                <span className="font-mono font-semibold text-purple-600 dark:text-purple-400">{employee.employeeId}</span>
                <span>•</span>
                <span>{employee.jobTitle}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {canEdit && (
              <button
                onClick={() => onEdit(employee)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Edit Employee"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => onDelete(employee.id)}
                className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                title="Delete Employee"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* Contact & Department Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Department</span>
              <p className="font-semibold text-slate-900 dark:text-white">{employee.departmentName}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Location</span>
              <p className="font-semibold text-slate-900 dark:text-white">{employee.locationName}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Work Email</span>
              <p className="font-semibold text-slate-900 dark:text-white truncate" title={employee.email}>
                {employee.email}
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Joining Date</span>
              <p className="font-semibold text-slate-900 dark:text-white">{formatDate(employee.joiningDate)}</p>
            </div>
          </div>

          {/* Currently Assigned Assets */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                <Boxes className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Currently Assigned Hardware ({employee.assignedAssets.length})
              </h3>
            </div>

            {employee.assignedAssets.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 text-center text-slate-500">
                No active assets currently assigned to this employee.
              </div>
            ) : (
              <div className="space-y-2">
                {employee.assignedAssets.map(asset => (
                  <div
                    key={asset.id}
                    className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-sm hover:border-indigo-300 transition-colors"
                  >
                    <div
                      onClick={() => onViewAsset(asset)}
                      className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
                    >
                      {asset.imageUrl ? (
                        <img
                          src={asset.imageUrl}
                          alt={asset.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold">
                          {asset.name[0]}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 dark:text-white truncate">
                          {asset.name}
                        </div>
                        <div className="text-slate-500 text-[11px] flex items-center gap-2">
                          <span className="font-mono text-indigo-600 dark:text-indigo-400">{asset.assetTag}</span>
                          <span>•</span>
                          <span>Assigned on {formatDate(asset.assignedDate)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {canEdit && (
                        <button
                          onClick={() => onReturnAsset(asset)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 font-medium"
                        >
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                          Check-In
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Assignment Logs */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm mb-3">
              <History className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Past Asset Assignment History
            </h3>

            {employee.pastAssignments && employee.pastAssignments.length > 0 ? (
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-[10px] uppercase font-bold text-slate-500">
                    <tr>
                      <th className="p-2.5">Asset Tag & Name</th>
                      <th className="p-2.5">Assigned Date</th>
                      <th className="p-2.5">Returned Date</th>
                      <th className="p-2.5">Condition</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {employee.pastAssignments.map(asg => (
                      <tr key={asg.id}>
                        <td className="p-2.5">
                          <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                            {asg.assetTag}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate max-w-xs">{asg.assetName}</div>
                        </td>
                        <td className="p-2.5 text-slate-600 dark:text-slate-400">{formatDate(asg.assignedDate)}</td>
                        <td className="p-2.5 text-slate-600 dark:text-slate-400">{asg.returnedDate ? formatDate(asg.returnedDate) : '—'}</td>
                        <td className="p-2.5 text-slate-700 dark:text-slate-300">{asg.returnCondition || 'In Use'}</td>
                        <td className="p-2.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              asg.status === 'Active'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            {asg.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-slate-500 text-center py-3">No past assignments on record.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
