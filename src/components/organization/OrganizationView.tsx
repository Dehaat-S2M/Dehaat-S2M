import React, { useState } from 'react';
import {
  FolderTree,
  MapPin,
  Building,
  Truck,
  Plus,
  Edit2,
  Trash2,
  X,
  ExternalLink,
  Mail,
  Phone,
  DollarSign
} from 'lucide-react';
import type { Category, Location, Department, Vendor, User as AuthUser } from '../../types';
import { formatCurrency } from '../../lib/utils';

interface OrganizationViewProps {
  initialTab?: 'categories' | 'locations' | 'departments' | 'vendors';
  categories: Category[];
  locations: Location[];
  departments: Department[];
  vendors: Vendor[];
  currentUser: AuthUser | null;
  onSaveCategory: (cat: Partial<Category>) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  onSaveLocation: (loc: Partial<Location>) => Promise<void>;
  onDeleteLocation: (id: string) => Promise<void>;
  onSaveDepartment: (dep: Partial<Department>) => Promise<void>;
  onDeleteDepartment: (id: string) => Promise<void>;
  onSaveVendor: (ven: Partial<Vendor>) => Promise<void>;
  onDeleteVendor: (id: string) => Promise<void>;
}

export function OrganizationView({
  initialTab = 'categories',
  categories,
  locations,
  departments,
  vendors,
  currentUser,
  onSaveCategory,
  onDeleteCategory,
  onSaveLocation,
  onDeleteLocation,
  onSaveDepartment,
  onDeleteDepartment,
  onSaveVendor,
  onDeleteVendor
}: OrganizationViewProps) {
  const [activeTab, setActiveTab] = useState<'categories' | 'locations' | 'departments' | 'vendors'>(initialTab);

  // Modals state
  const [modalType, setModalType] = useState<'category' | 'location' | 'department' | 'vendor' | null>(null);
  const [editItem, setEditItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // Category Form State
  const [catForm, setCatForm] = useState({ name: '', description: '', color: '#6366f1' });

  // Location Form State
  const [locForm, setLocForm] = useState({ name: '', address: '', building: '', contactPerson: '' });

  // Department Form State
  const [depForm, setDepForm] = useState({ name: '', code: '', managerName: '', budget: '' });

  // Vendor Form State
  const [venForm, setVenForm] = useState({ name: '', contactEmail: '', phone: '', website: '', address: '' });

  const canEdit = currentUser?.role !== 'Viewer';
  const canDelete = currentUser?.role === 'Super Admin';

  const openCategoryModal = (item?: Category) => {
    setEditItem(item || null);
    setCatForm({
      name: item?.name || '',
      description: item?.description || '',
      color: item?.color || '#6366f1'
    });
    setModalType('category');
  };

  const openLocationModal = (item?: Location) => {
    setEditItem(item || null);
    setLocForm({
      name: item?.name || '',
      address: item?.address || '',
      building: item?.building || '',
      contactPerson: item?.contactPerson || ''
    });
    setModalType('location');
  };

  const openDepartmentModal = (item?: Department) => {
    setEditItem(item || null);
    setDepForm({
      name: item?.name || '',
      code: item?.code || '',
      managerName: item?.managerName || '',
      budget: item ? String(item.budget || '') : ''
    });
    setModalType('department');
  };

  const openVendorModal = (item?: Vendor) => {
    setEditItem(item || null);
    setVenForm({
      name: item?.name || '',
      contactEmail: item?.contactEmail || '',
      phone: item?.phone || '',
      website: item?.website || '',
      address: item?.address || ''
    });
    setModalType('vendor');
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await onSaveCategory({ id: editItem?.id, ...catForm });
      setModalType(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await onSaveLocation({ id: editItem?.id, ...locForm });
      setModalType(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await onSaveDepartment({
        id: editItem?.id,
        ...depForm,
        budget: Number(depForm.budget) || 0
      });
      setModalType(null);
    } finally {
      setLoading(false);
    }
  };

  const handleVendorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await onSaveVendor({ id: editItem?.id, ...venForm });
      setModalType(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          Organization Structure & Master Data
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Configure hardware categories, physical office locations, business departments, and suppliers.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'categories'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          Categories ({categories.length})
        </button>

        <button
          onClick={() => setActiveTab('locations')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'locations'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          Locations ({locations.length})
        </button>

        <button
          onClick={() => setActiveTab('departments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'departments'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Building className="w-4 h-4" />
          Departments ({departments.length})
        </button>

        <button
          onClick={() => setActiveTab('vendors')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'vendors'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Truck className="w-4 h-4" />
          Vendors / Suppliers ({vendors.length})
        </button>
      </div>

      {/* Tab 1: Categories */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Hardware & Asset Categories
            </h2>
            {canEdit && (
              <button
                onClick={() => openCategoryModal()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(cat => (
              <div
                key={cat.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-lg shrink-0 shadow-sm"
                        style={{ backgroundColor: cat.color || '#6366f1' }}
                      />
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                        {cat.name}
                      </h3>
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {cat.assetCount || 0} Assets
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {cat.description || 'No description provided.'}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-1 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  {canEdit && (
                    <button
                      onClick={() => openCategoryModal(cat)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => onDeleteCategory(cat.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Locations */}
      {activeTab === 'locations' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Office Locations & Datacenters
            </h2>
            {canEdit && (
              <button
                onClick={() => openLocationModal()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Location
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map(loc => (
              <div
                key={loc.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-purple-600" />
                      {loc.name}
                    </h3>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {loc.assetCount || 0} Assets
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300">{loc.address}</p>

                  <div className="text-[11px] text-slate-400 space-y-0.5">
                    {loc.building && <div>Facility / Building: <strong className="text-slate-700 dark:text-slate-300">{loc.building}</strong></div>}
                    {loc.contactPerson && <div>Site Manager: <strong className="text-slate-700 dark:text-slate-300">{loc.contactPerson}</strong></div>}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  {canEdit && (
                    <button
                      onClick={() => openLocationModal(loc)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => onDeleteLocation(loc.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Departments */}
      {activeTab === 'departments' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Business Departments
            </h2>
            {canEdit && (
              <button
                onClick={() => openDepartmentModal()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Department
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map(dep => (
              <div
                key={dep.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-indigo-600" />
                      {dep.name}
                    </h3>
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {dep.code}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <div>Lead: <strong>{dep.managerName || '—'}</strong></div>
                    <div>Hardware Budget: <strong>{formatCurrency(dep.budget || 0)}</strong></div>
                    <div>Allocated Fleet: <strong>{dep.assetCount || 0} Assets</strong></div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  {canEdit && (
                    <button
                      onClick={() => openDepartmentModal(dep)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => onDeleteDepartment(dep.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Vendors */}
      {activeTab === 'vendors' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Vendors & IT Suppliers
            </h2>
            {canEdit && (
              <button
                onClick={() => openVendorModal()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Vendor
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendors.map(ven => (
              <div
                key={ven.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-emerald-600" />
                      {ven.name}
                    </h3>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    {ven.contactEmail && (
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{ven.contactEmail}</span>
                      </div>
                    )}
                    {ven.phone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{ven.phone}</span>
                      </div>
                    )}
                    {ven.website && (
                      <div className="flex items-center gap-1.5">
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        <a href={ven.website} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline truncate">
                          {ven.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  {canEdit && (
                    <button
                      onClick={() => openVendorModal(ven)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => onDeleteVendor(ven.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Category */}
      {modalType === 'category' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setModalType(null)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-10 p-6 text-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {editItem ? 'Edit Category' : 'Create Category'}
              </h3>
              <button onClick={() => setModalType(null)} className="p-1 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCategorySubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Laptops & Notebooks"
                  value={catForm.name}
                  onChange={e => setCatForm({ ...catForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Description</label>
                <textarea
                  rows={2}
                  placeholder="Description of hardware items in this category"
                  value={catForm.description}
                  onChange={e => setCatForm({ ...catForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Tag Accent Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={catForm.color}
                    onChange={e => setCatForm({ ...catForm, color: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
                  />
                  <span className="font-mono text-slate-600 dark:text-slate-300">{catForm.color}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium shadow-sm"
                >
                  {loading ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Location */}
      {modalType === 'location' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setModalType(null)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-10 p-6 text-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {editItem ? 'Edit Location' : 'Create Location'}
              </h3>
              <button onClick={() => setModalType(null)} className="p-1 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLocationSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Location Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Austin Tech Campus"
                  value={locForm.name}
                  onChange={e => setLocForm({ ...locForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="701 Brazos St, Austin, TX"
                  value={locForm.address}
                  onChange={e => setLocForm({ ...locForm, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Building / Suite</label>
                  <input
                    type="text"
                    placeholder="Building B, Floor 4"
                    value={locForm.building}
                    onChange={e => setLocForm({ ...locForm, building: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Site Contact</label>
                  <input
                    type="text"
                    placeholder="Marcus Vance"
                    value={locForm.contactPerson}
                    onChange={e => setLocForm({ ...locForm, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium shadow-sm"
                >
                  {loading ? 'Saving...' : 'Save Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Department */}
      {modalType === 'department' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setModalType(null)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-10 p-6 text-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {editItem ? 'Edit Department' : 'Create Department'}
              </h3>
              <button onClick={() => setModalType(null)} className="p-1 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDepartmentSubmit} className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Department Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Quality Assurance"
                    value={depForm.name}
                    onChange={e => setDepForm({ ...depForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Code</label>
                  <input
                    type="text"
                    required
                    placeholder="QA"
                    value={depForm.code}
                    onChange={e => setDepForm({ ...depForm, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white uppercase font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Department Head</label>
                  <input
                    type="text"
                    placeholder="Sarah Lin"
                    value={depForm.managerName}
                    onChange={e => setDepForm({ ...depForm, managerName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Hardware Budget ($)</label>
                  <input
                    type="number"
                    placeholder="50000"
                    value={depForm.budget}
                    onChange={e => setDepForm({ ...depForm, budget: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium shadow-sm"
                >
                  {loading ? 'Saving...' : 'Save Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Vendor */}
      {modalType === 'vendor' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setModalType(null)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-10 p-6 text-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {editItem ? 'Edit Vendor' : 'Create Vendor'}
              </h3>
              <button onClick={() => setModalType(null)} className="p-1 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleVendorSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CDW Corporate"
                  value={venForm.name}
                  onChange={e => setVenForm({ ...venForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Support Email</label>
                  <input
                    type="email"
                    placeholder="sales@cdw.com"
                    value={venForm.contactEmail}
                    onChange={e => setVenForm({ ...venForm, contactEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Phone</label>
                  <input
                    type="tel"
                    placeholder="1-800-555-0199"
                    value={venForm.phone}
                    onChange={e => setVenForm({ ...venForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Portal / Website</label>
                <input
                  type="url"
                  placeholder="https://www.cdw.com"
                  value={venForm.website}
                  onChange={e => setVenForm({ ...venForm, website: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium shadow-sm"
                >
                  {loading ? 'Saving...' : 'Save Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
