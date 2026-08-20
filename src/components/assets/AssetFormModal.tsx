import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Sparkles, Check, AlertCircle } from 'lucide-react';
import type {
  Asset,
  Category,
  Location,
  Department,
  Vendor,
  AssetStatus,
  Employee
} from '../../types';

interface AssetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (assetData: Partial<Asset>) => Promise<void>;
  initialData?: Asset | null;
  categories: Category[];
  locations: Location[];
  departments: Department[];
  vendors: Vendor[];
  employees: Employee[];
}

const SAMPLE_IMAGES = [
  { name: 'MacBook Pro Space Black', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80' },
  { name: 'MacBook Silver', url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&auto=format&fit=crop&q=80' },
  { name: 'Dell XPS Workstation', url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop&q=80' },
  { name: 'ThinkPad Laptop', url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=80' },
  { name: '4K Display Monitor', url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=80' },
  { name: 'Server & Networking', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop&q=80' },
  { name: 'Smartphone / Tablet', url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80' },
  { name: 'Office Printer', url: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500&auto=format&fit=crop&q=80' }
];

export function AssetFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  categories,
  locations,
  departments,
  vendors,
  employees
}: AssetFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    assetTag: '',
    categoryId: '',
    brand: '',
    model: '',
    serialNumber: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    purchaseCost: '',
    warrantyExpiry: new Date(Date.now() + 365 * 3 * 86400000).toISOString().split('T')[0],
    vendorId: '',
    locationId: '',
    departmentId: '',
    status: 'Available' as AssetStatus,
    assignedEmployeeId: '',
    notes: '',
    imageUrl: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        assetTag: initialData.assetTag || '',
        categoryId: initialData.categoryId || (categories[0]?.id || ''),
        brand: initialData.brand || '',
        model: initialData.model || '',
        serialNumber: initialData.serialNumber || '',
        purchaseDate: initialData.purchaseDate || new Date().toISOString().split('T')[0],
        purchaseCost: String(initialData.purchaseCost || ''),
        warrantyExpiry: initialData.warrantyExpiry || '',
        vendorId: initialData.vendorId || (vendors[0]?.id || ''),
        locationId: initialData.locationId || (locations[0]?.id || ''),
        departmentId: initialData.departmentId || (departments[0]?.id || ''),
        status: initialData.status || 'Available',
        assignedEmployeeId: initialData.assignedEmployeeId || '',
        notes: initialData.notes || '',
        imageUrl: initialData.imageUrl || ''
      });
    } else {
      // Auto-generate tag for new asset
      const nextNum = Math.floor(Math.random() * 900) + 100;
      setFormData({
        name: '',
        assetTag: `AST-2024-${nextNum}`,
        categoryId: categories[0]?.id || '',
        brand: '',
        model: '',
        serialNumber: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        purchaseCost: '',
        warrantyExpiry: new Date(Date.now() + 365 * 3 * 86400000).toISOString().split('T')[0],
        vendorId: vendors[0]?.id || '',
        locationId: locations[0]?.id || '',
        departmentId: departments[0]?.id || '',
        status: 'Available',
        assignedEmployeeId: '',
        notes: '',
        imageUrl: SAMPLE_IMAGES[0].url
      });
    }
    setError(null);
  }, [initialData, isOpen, categories, vendors, locations, departments]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Asset name is required');
      return;
    }
    if (!formData.assetTag.trim()) {
      setError('Asset tag is required');
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        ...formData,
        purchaseCost: Number(formData.purchaseCost) || 0,
        assignedEmployeeId: formData.assignedEmployeeId || null
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save asset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />

      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-10 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {initialData ? 'Edit Asset Record' : 'Register New Asset'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {initialData ? `Updating ${initialData.assetTag}` : 'Add hardware or IT equipment to your registry'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar text-xs">
          {/* Row 1: Asset Name & Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Asset Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. MacBook Pro 16 M3 Max"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Asset Tag <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="AST-2024-001"
                value={formData.assetTag}
                onChange={e => setFormData({ ...formData, assetTag: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 uppercase font-mono"
              />
            </div>
          </div>

          {/* Row 2: Category, Brand, Model */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Category</label>
              <select
                value={formData.categoryId}
                onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Brand / Manufacturer</label>
              <input
                type="text"
                placeholder="Apple, Dell, Cisco..."
                value={formData.brand}
                onChange={e => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Model Name / Number</label>
              <input
                type="text"
                placeholder="XPS 15 9530"
                value={formData.model}
                onChange={e => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Row 3: Serial Number, Status, Cost */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Serial Number</label>
              <input
                type="text"
                placeholder="C02G8721MD6T"
                value={formData.serialNumber}
                onChange={e => setFormData({ ...formData, serialNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Asset Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as AssetStatus })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Available">Available</option>
                <option value="Assigned">Assigned</option>
                <option value="Under Maintenance">Under Maintenance</option>
                <option value="Damaged">Damaged</option>
                <option value="Lost">Lost</option>
                <option value="Retired">Retired</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Purchase Cost ($)</label>
              <input
                type="number"
                step="0.01"
                placeholder="2499.00"
                value={formData.purchaseCost}
                onChange={e => setFormData({ ...formData, purchaseCost: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Row 4: Dates & Vendor */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Purchase Date</label>
              <input
                type="date"
                value={formData.purchaseDate}
                onChange={e => setFormData({ ...formData, purchaseDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Warranty Expiry</label>
              <input
                type="date"
                value={formData.warrantyExpiry}
                onChange={e => setFormData({ ...formData, warrantyExpiry: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Vendor / Supplier</label>
              <select
                value={formData.vendorId}
                onChange={e => setFormData({ ...formData, vendorId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                {vendors.map(ven => (
                  <option key={ven.id} value={ven.id}>{ven.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 5: Location, Department, Initial Assignee */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Location</label>
              <select
                value={formData.locationId}
                onChange={e => setFormData({ ...formData, locationId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Department</label>
              <select
                value={formData.departmentId}
                onChange={e => setFormData({ ...formData, departmentId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                {departments.map(dep => (
                  <option key={dep.id} value={dep.id}>{dep.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Assigned Employee (Optional)</label>
              <select
                value={formData.assignedEmployeeId}
                onChange={e => {
                  const empId = e.target.value;
                  setFormData({
                    ...formData,
                    assignedEmployeeId: empId,
                    status: empId ? 'Assigned' : formData.status === 'Assigned' ? 'Available' : formData.status
                  });
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="">-- Unassigned (In Stock) --</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.fullName} ({emp.employeeId})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 6: Image Selection */}
          <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Hardware Photo URL</span>
              <span className="text-[11px] text-slate-400 font-normal">Pick preset or paste custom image link</span>
            </label>

            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={formData.imageUrl}
                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  referrerPolicy="no-referrer"
                  className="w-10 h-9 rounded-lg object-cover ring-1 ring-slate-300 shrink-0"
                />
              )}
            </div>

            {/* Quick Sample Image Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {SAMPLE_IMAGES.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFormData({ ...formData, imageUrl: img.url })}
                  className={`px-2 py-1 rounded-lg text-[11px] border transition-colors ${
                    formData.imageUrl === img.url
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-medium'
                      : 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {img.name}
                </button>
              ))}
            </div>
          </div>

          {/* Row 7: Notes */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Technical Notes & Specifications</label>
            <textarea
              rows={2}
              placeholder="Processor specs, MDM enrollment status, warranty contract number..."
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
            >
              {loading && <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
              {initialData ? 'Update Asset' : 'Save Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
