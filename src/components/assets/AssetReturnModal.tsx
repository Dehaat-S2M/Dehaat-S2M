import React, { useState, useEffect } from 'react';
import { X, ArrowDownLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { Asset } from '../../types';

interface AssetReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset | null;
  onReturn: (payload: {
    returnCondition: 'Excellent' | 'Good' | 'Fair' | 'Damaged' | 'Defective';
    returnDate: string;
    notes?: string;
  }) => Promise<void>;
}

export function AssetReturnModal({
  isOpen,
  onClose,
  asset,
  onReturn
}: AssetReturnModalProps) {
  const [returnCondition, setReturnCondition] = useState<'Excellent' | 'Good' | 'Fair' | 'Damaged' | 'Defective'>('Good');
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setReturnCondition('Good');
    setReturnDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setError(null);
  }, [isOpen, asset]);

  if (!isOpen || !asset) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await onReturn({
        returnCondition,
        returnDate,
        notes: notes.trim() || undefined
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to check-in asset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />

      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-10 overflow-hidden text-xs">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-emerald-50/50 dark:bg-emerald-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-600 text-white">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Check-In Asset (Return to Stock)
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Currently with: <strong className="text-slate-800 dark:text-slate-200">{asset.assignedEmployeeName || 'Unknown'}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2.5 text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="font-semibold text-slate-900 dark:text-white">{asset.name}</div>
            <div className="text-slate-500 dark:text-slate-400 flex items-center gap-3">
              <span>Tag: <strong className="font-mono text-slate-700 dark:text-slate-300">{asset.assetTag}</strong></span>
              <span>Serial: <strong className="font-mono text-slate-700 dark:text-slate-300">{asset.serialNumber || 'N/A'}</strong></span>
            </div>
          </div>

          {/* Condition selector */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Hardware Return Condition <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {(['Excellent', 'Good', 'Fair', 'Damaged', 'Defective'] as const).map(condition => {
                const isSelected = returnCondition === condition;
                return (
                  <button
                    key={condition}
                    type="button"
                    onClick={() => setReturnCondition(condition)}
                    className={`py-2 px-2 rounded-xl text-center font-medium border transition-all ${
                      isSelected
                        ? condition === 'Damaged' || condition === 'Defective'
                          ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-700 dark:text-rose-300 ring-2 ring-rose-500/20'
                          : 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    {condition}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Return Date */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Date of Return</label>
            <input
              type="date"
              required
              value={returnDate}
              onChange={e => setReturnDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Return Notes */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Inspection Notes / Diagnostics
            </label>
            <textarea
              rows={3}
              placeholder="All accessories returned, wiped and restored to factory defaults..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {returnCondition === 'Damaged' || returnCondition === 'Defective' ? (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 text-[11px]">
              ⚠️ Since this asset is marked as {returnCondition}, its status will automatically be set to <strong>Under Maintenance</strong> for inspection.
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-[11px]">
              This asset will be unassigned from <strong>{asset.assignedEmployeeName}</strong> and become <strong>Available</strong> in inventory.
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-md shadow-emerald-600/30 transition-all flex items-center gap-2"
            >
              {loading && <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
              Complete Return
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
