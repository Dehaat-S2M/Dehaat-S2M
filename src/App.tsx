import React, { useState, useEffect, useCallback } from 'react';
import { api } from './lib/api';
import type {
  Asset,
  Employee,
  Category,
  Location,
  Department,
  Vendor,
  AssetHistory,
  DashboardStats,
  OrganizationSettings,
  User as AuthUser
} from './types';

// Layout & Common Components
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastProvider, useToast } from './components/common/Toast';
import { ConfirmationModal } from './components/common/ConfirmationModal';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { AssetsView } from './components/assets/AssetsView';
import { AssetFormModal } from './components/assets/AssetFormModal';
import { AssetDetailModal } from './components/assets/AssetDetailModal';
import { AssetAssignModal } from './components/assets/AssetAssignModal';
import { AssetReturnModal } from './components/assets/AssetReturnModal';
import { AssetImportModal } from './components/assets/AssetImportModal';
import { EmployeesView } from './components/employees/EmployeesView';
import { EmployeeFormModal } from './components/employees/EmployeeFormModal';
import { EmployeeDetailModal } from './components/employees/EmployeeDetailModal';
import { HistoryView } from './components/history/HistoryView';
import { OrganizationView } from './components/organization/OrganizationView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';

function AssetHubApp() {
  const { success, error, info } = useToast();

  // Navigation & UI state
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [globalSearch, setGlobalSearch] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('assethub_dark') === 'true';
  });

  // Data Store
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [history, setHistory] = useState<AssetHistory[]>([]);
  const [settings, setSettings] = useState<OrganizationSettings | null>(null);

  // Auth / Users
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [allUsers, setAllUsers] = useState<AuthUser[]>([]);

  // Asset Modals
  const [isAssetFormOpen, setIsAssetFormOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [selectedAssetDetail, setSelectedAssetDetail] = useState<(Asset & { history: AssetHistory[] }) | null>(null);
  const [assigningAsset, setAssigningAsset] = useState<Asset | null>(null);
  const [returningAsset, setReturningAsset] = useState<Asset | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Employee Modals
  const [isEmployeeFormOpen, setIsEmployeeFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [selectedEmployeeDetail, setSelectedEmployeeDetail] = useState<(Employee & { assignedAssets: Asset[]; pastAssignments: any[] }) | null>(null);

  // Delete Confirm Modal
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: async () => {}
  });

  // Quick Action Modal (Check-In / Check-Out selector)
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);

  // Apply dark mode class to root HTML
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('assethub_dark', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('assethub_dark', 'false');
    }
  }, [darkMode]);

  // Data fetcher
  const loadAllData = useCallback(async (showToast = false) => {
    try {
      setIsRefreshing(true);
      const [
        dashboardStats,
        assetList,
        empList,
        catList,
        locList,
        deptList,
        vendList,
        histList,
        settData,
        currUserData,
        usersList
      ] = await Promise.all([
        api.getDashboardStats(),
        api.getAssets(),
        api.getEmployees(),
        api.getCategories(),
        api.getLocations(),
        api.getDepartments(),
        api.getVendors(),
        api.getHistory(),
        api.getSettings(),
        api.getCurrentUser(),
        api.getUsers()
      ]);

      setStats(dashboardStats);
      setAssets(assetList);
      setEmployees(empList);
      setCategories(catList);
      setLocations(locList);
      setDepartments(deptList);
      setVendors(vendList);
      setHistory(histList);
      setSettings(settData);
      setCurrentUser(currUserData);
      setAllUsers(usersList);

      if (showToast) {
        success('Data synchronized with server.');
      }
    } catch (err: any) {
      console.error('Failed to load application data:', err);
      error(`Failed to load data: ${err.message}`);
    } finally {
      setIsRefreshing(false);
    }
  }, [error, success]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Role switch handler
  const handleSwitchUser = async (userId: string) => {
    try {
      const updatedUser = await api.setActiveUser(userId);
      setCurrentUser(updatedUser);
      info(`Switched active profile to ${updatedUser.name} (${updatedUser.role})`);
    } catch (err: any) {
      error(`Failed to switch user: ${err.message}`);
    }
  };

  // ----------------------------------------------------
  // ASSET HANDLERS
  // ----------------------------------------------------
  const handleOpenAddAsset = () => {
    setEditingAsset(null);
    setIsAssetFormOpen(true);
  };

  const handleOpenEditAsset = (asset: Asset) => {
    setEditingAsset(asset);
    setIsAssetFormOpen(true);
    setSelectedAssetDetail(null);
  };

  const handleSaveAsset = async (assetData: Partial<Asset>) => {
    if (editingAsset) {
      await api.updateAsset(editingAsset.id, assetData);
      success(`Asset ${assetData.assetTag || editingAsset.assetTag} updated successfully.`);
    } else {
      await api.createAsset(assetData);
      success(`Asset ${assetData.assetTag} registered successfully.`);
    }
    await loadAllData();
  };

  const handleDeleteAssetClick = (asset: Asset) => {
    setDeleteConfirm({
      isOpen: true,
      title: `Delete Asset ${asset.assetTag}?`,
      message: `Are you sure you want to permanently remove "${asset.name}" (${asset.assetTag})? This will also remove its assignment records.`,
      onConfirm: async () => {
        try {
          await api.deleteAsset(asset.id);
          success(`Asset ${asset.assetTag} deleted successfully.`);
          setSelectedAssetDetail(null);
          await loadAllData();
        } catch (err: any) {
          error(err.message || 'Failed to delete asset');
        }
      }
    });
  };

  const handleViewAssetDetails = async (asset: Asset) => {
    try {
      const fullAsset = await api.getAsset(asset.id);
      setSelectedAssetDetail(fullAsset);
    } catch (err: any) {
      error(`Could not fetch asset details: ${err.message}`);
    }
  };

  const handleOpenAssign = (asset: Asset) => {
    setAssigningAsset(asset);
    setSelectedAssetDetail(null);
  };

  const handleOpenReturn = (asset: Asset) => {
    setReturningAsset(asset);
    setSelectedAssetDetail(null);
  };

  const handleAssignSubmit = async (payload: {
    employeeId: string;
    assignedDate: string;
    expectedReturnDate?: string;
    notes?: string;
  }) => {
    if (!assigningAsset) return;
    await api.assignAsset(assigningAsset.id, payload);
    success(`Asset ${assigningAsset.assetTag} checked out to employee.`);
    await loadAllData();
  };

  const handleReturnSubmit = async (payload: {
    returnCondition: 'Excellent' | 'Good' | 'Fair' | 'Damaged' | 'Defective';
    returnDate: string;
    notes?: string;
  }) => {
    if (!returningAsset) return;
    await api.returnAsset(returningAsset.id, payload);
    success(`Asset ${returningAsset.assetTag} checked back into inventory (${payload.returnCondition}).`);
    await loadAllData();
  };

  const handleBatchImport = async (importedAssets: Partial<Asset>[]) => {
    const res = await api.importAssets(importedAssets);
    success(`Successfully imported ${res.count} assets into inventory.`);
    await loadAllData();
    return res;
  };

  // ----------------------------------------------------
  // EMPLOYEE HANDLERS
  // ----------------------------------------------------
  const handleOpenAddEmployee = () => {
    setEditingEmployee(null);
    setIsEmployeeFormOpen(true);
  };

  const handleOpenEditEmployee = (emp: Employee) => {
    setEditingEmployee(emp);
    setIsEmployeeFormOpen(true);
    setSelectedEmployeeDetail(null);
  };

  const handleSaveEmployee = async (empData: Partial<Employee>) => {
    if (editingEmployee) {
      await api.updateEmployee(editingEmployee.id, empData);
      success(`Employee ${empData.fullName} updated successfully.`);
    } else {
      await api.createEmployee(empData);
      success(`Employee ${empData.fullName} registered.`);
    }
    await loadAllData();
  };

  const handleDeleteEmployeeClick = (emp: Employee) => {
    setDeleteConfirm({
      isOpen: true,
      title: `Delete Employee ${emp.fullName}?`,
      message: `Are you sure you want to delete ${emp.fullName} (${emp.employeeId})? Any assets currently assigned to them will be unassigned.`,
      onConfirm: async () => {
        try {
          await api.deleteEmployee(emp.id);
          success(`Employee ${emp.fullName} deleted.`);
          setSelectedEmployeeDetail(null);
          await loadAllData();
        } catch (err: any) {
          error(err.message || 'Failed to delete employee');
        }
      }
    });
  };

  const handleViewEmployeeDetails = async (emp: Employee) => {
    try {
      const fullEmp = await api.getEmployee(emp.id);
      setSelectedEmployeeDetail(fullEmp);
    } catch (err: any) {
      error(`Could not fetch employee profile: ${err.message}`);
    }
  };

  // ----------------------------------------------------
  // MASTER DATA (Categories, Locations, Departments, Vendors)
  // ----------------------------------------------------
  const handleSaveCategory = async (cat: Partial<Category>) => {
    if (cat.id) {
      await api.updateCategory(cat.id, cat);
      success('Category updated.');
    } else {
      await api.createCategory(cat);
      success('Category created.');
    }
    await loadAllData();
  };

  const handleDeleteCategory = async (id: string) => {
    await api.deleteCategory(id);
    success('Category removed.');
    await loadAllData();
  };

  const handleSaveLocation = async (loc: Partial<Location>) => {
    if (loc.id) {
      await api.updateLocation(loc.id, loc);
      success('Location updated.');
    } else {
      await api.createLocation(loc);
      success('Location created.');
    }
    await loadAllData();
  };

  const handleDeleteLocation = async (id: string) => {
    await api.deleteLocation(id);
    success('Location removed.');
    await loadAllData();
  };

  const handleSaveDepartment = async (dept: Partial<Department>) => {
    if (dept.id) {
      await api.updateDepartment(dept.id, dept);
      success('Department updated.');
    } else {
      await api.createDepartment(dept);
      success('Department created.');
    }
    await loadAllData();
  };

  const handleDeleteDepartment = async (id: string) => {
    await api.deleteDepartment(id);
    success('Department removed.');
    await loadAllData();
  };

  const handleSaveVendor = async (ven: Partial<Vendor>) => {
    if (ven.id) {
      await api.updateVendor(ven.id, ven);
      success('Vendor updated.');
    } else {
      await api.createVendor(ven);
      success('Vendor created.');
    }
    await loadAllData();
  };

  const handleDeleteVendor = async (id: string) => {
    await api.deleteVendor(id);
    success('Vendor removed.');
    await loadAllData();
  };

  // ----------------------------------------------------
  // SETTINGS & DB RESET
  // ----------------------------------------------------
  const handleSaveSettings = async (newSettings: Partial<OrganizationSettings>) => {
    const updated = await api.updateSettings(newSettings);
    setSettings(updated);
    success('System preferences updated.');
  };

  const handleResetDatabase = async () => {
    await api.resetDatabase();
    info('Database reset to original seed data.');
    await loadAllData();
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 dark:bg-slate-950 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        currentUser={currentUser}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onQuickAssignClick={() => setIsQuickActionOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Bar */}
        <Header
          currentUser={currentUser}
          availableUsers={allUsers}
          onSwitchUser={handleSwitchUser}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onRefreshData={() => loadAllData(true)}
          isRefreshing={isRefreshing}
          searchQuery={globalSearch}
          setSearchQuery={setGlobalSearch}
          isDarkMode={darkMode}
          setIsDarkMode={setDarkMode}
        />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto pb-12">
            {activeTab === 'dashboard' && (
              <DashboardView
                stats={stats}
                settings={settings}
                onNavigate={tab => setActiveTab(tab as NavTab)}
                onAddAsset={handleOpenAddAsset}
                onQuickAssign={() => setIsQuickActionOpen(true)}
              />
            )}

            {activeTab === 'assets' && (
              <AssetsView
                assets={assets}
                categories={categories}
                locations={locations}
                departments={departments}
                vendors={vendors}
                currentUser={currentUser}
                settings={settings}
                onAddAsset={handleOpenAddAsset}
                onEditAsset={handleOpenEditAsset}
                onDeleteAsset={handleDeleteAssetClick}
                onViewAsset={handleViewAssetDetails}
                onAssignAsset={handleOpenAssign}
                onReturnAsset={handleOpenReturn}
                onImportClick={() => setIsImportModalOpen(true)}
                globalSearch={globalSearch}
              />
            )}

            {activeTab === 'employees' && (
              <EmployeesView
                employees={employees}
                departments={departments}
                locations={locations}
                currentUser={currentUser}
                onAddEmployee={handleOpenAddEmployee}
                onEditEmployee={handleOpenEditEmployee}
                onDeleteEmployee={handleDeleteEmployeeClick}
                onViewEmployee={handleViewEmployeeDetails}
                globalSearch={globalSearch}
              />
            )}

            {activeTab === 'history' && (
              <HistoryView
                history={history}
                globalSearch={globalSearch}
              />
            )}

            {(activeTab === 'categories' ||
              activeTab === 'locations' ||
              activeTab === 'vendors') && (
              <OrganizationView
                initialTab={activeTab === 'categories' ? 'categories' : activeTab === 'locations' ? 'locations' : 'vendors'}
                categories={categories}
                locations={locations}
                departments={departments}
                vendors={vendors}
                currentUser={currentUser}
                onSaveCategory={handleSaveCategory}
                onDeleteCategory={handleDeleteCategory}
                onSaveLocation={handleSaveLocation}
                onDeleteLocation={handleDeleteLocation}
                onSaveDepartment={handleSaveDepartment}
                onDeleteDepartment={handleDeleteDepartment}
                onSaveVendor={handleSaveVendor}
                onDeleteVendor={handleDeleteVendor}
              />
            )}

            {activeTab === 'reports' && (
              <ReportsView
                assets={assets}
                categories={categories}
                departments={departments}
                locations={locations}
                settings={settings}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView
                settings={settings}
                currentUser={currentUser}
                darkMode={darkMode}
                onToggleDarkMode={() => setDarkMode(!darkMode)}
                onSaveSettings={handleSaveSettings}
                onResetDatabase={handleResetDatabase}
              />
            )}

            {activeTab === 'guide' && (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                  AssetHub Deployment & Administrator Guide
                </h1>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Welcome to AssetHub! Here is how your IT Hardware and Equipment inventory flows:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">1. Setup Master Data</span>
                    <p className="text-slate-500 text-[11px]">Define Categories, Office Locations, Departments, and Vendor partners under the Organization tab.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">2. Register Assets & Staff</span>
                    <p className="text-slate-500 text-[11px]">Add company computers, monitors, accessories manually or import via CSV bulk upload.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">3. Check-Out / Check-In</span>
                    <p className="text-slate-500 text-[11px]">Assign gear to employees with expected return dates. When returned, capture condition and record immutable audit logs.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ======================================================== */}
      {/* MODAL DIALOGS */}
      {/* ======================================================== */}

      {/* Add / Edit Asset Modal */}
      <AssetFormModal
        isOpen={isAssetFormOpen}
        onClose={() => {
          setIsAssetFormOpen(false);
          setEditingAsset(null);
        }}
        onSubmit={handleSaveAsset}
        initialData={editingAsset}
        categories={categories}
        locations={locations}
        departments={departments}
        vendors={vendors}
        employees={employees}
      />

      {/* Detailed Asset Drawer */}
      <AssetDetailModal
        isOpen={!!selectedAssetDetail}
        onClose={() => setSelectedAssetDetail(null)}
        asset={selectedAssetDetail}
        currentUser={currentUser}
        onEdit={handleOpenEditAsset}
        onDelete={(id) => {
          const a = assets.find(x => x.id === id);
          if (a) handleDeleteAssetClick(a);
        }}
        onAssign={handleOpenAssign}
        onReturn={handleOpenReturn}
      />

      {/* Asset Check-Out Modal */}
      <AssetAssignModal
        isOpen={!!assigningAsset}
        onClose={() => setAssigningAsset(null)}
        asset={assigningAsset}
        employees={employees}
        onAssign={handleAssignSubmit}
      />

      {/* Asset Check-In Modal */}
      <AssetReturnModal
        isOpen={!!returningAsset}
        onClose={() => setReturningAsset(null)}
        asset={returningAsset}
        onReturn={handleReturnSubmit}
      />

      {/* Batch CSV Import Modal */}
      <AssetImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleBatchImport}
        categories={categories}
        locations={locations}
        departments={departments}
        vendors={vendors}
      />

      {/* Add / Edit Employee Modal */}
      <EmployeeFormModal
        isOpen={isEmployeeFormOpen}
        onClose={() => {
          setIsEmployeeFormOpen(false);
          setEditingEmployee(null);
        }}
        onSubmit={handleSaveEmployee}
        initialData={editingEmployee}
        departments={departments}
        locations={locations}
      />

      {/* Detailed Employee Drawer */}
      <EmployeeDetailModal
        isOpen={!!selectedEmployeeDetail}
        onClose={() => setSelectedEmployeeDetail(null)}
        employee={selectedEmployeeDetail}
        currentUser={currentUser}
        onEdit={handleOpenEditEmployee}
        onDelete={(id) => {
          const e = employees.find(x => x.id === id);
          if (e) handleDeleteEmployeeClick(e);
        }}
        onReturnAsset={handleOpenReturn}
        onViewAsset={handleViewAssetDetails}
      />

      {/* Quick Check-In / Check-Out Modal Selector */}
      {isQuickActionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsQuickActionOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-10 p-6 text-xs space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Quick Hardware Check-In / Check-Out
            </h3>
            <p className="text-slate-500">
              Select an asset from your inventory to check out to staff or return to stock:
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar">
              {assets.map(a => (
                <div
                  key={a.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 dark:text-white truncate">{a.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{a.assetTag} • {a.status}</div>
                  </div>

                  <div>
                    {a.status === 'Assigned' ? (
                      <button
                        onClick={() => {
                          setIsQuickActionOpen(false);
                          handleOpenReturn(a);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[11px]"
                      >
                        Check-In
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setIsQuickActionOpen(false);
                          handleOpenAssign(a);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[11px]"
                      >
                        Check-Out
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setIsQuickActionOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Universal Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirm.isOpen}
        title={deleteConfirm.title}
        message={deleteConfirm.message}
        confirmLabel="Delete Record"
        isDestructive={true}
        onConfirm={async () => {
          await deleteConfirm.onConfirm();
          setDeleteConfirm(prev => ({ ...prev, isOpen: false }));
        }}
        onCancel={() => setDeleteConfirm(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AssetHubApp />
    </ToastProvider>
  );
}
