import React, { useState } from 'react';
import {
  Settings,
  Building,
  DollarSign,
  Calendar,
  Tag,
  Moon,
  Sun,
  Database,
  RefreshCw,
  Download,
  Shield,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import type { OrganizationSettings, User as AuthUser } from '../../types';

interface SettingsViewProps {
  settings: OrganizationSettings | null;
  currentUser: AuthUser | null;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onSaveSettings: (settings: Partial<OrganizationSettings>) => Promise<void>;
  onResetDatabase: () => Promise<void>;
}

export function SettingsView({
  settings,
  currentUser,
  darkMode,
  onToggleDarkMode,
  onSaveSettings,
  onResetDatabase
}: SettingsViewProps) {
  const [formData, setFormData] = useState({
    organizationName: settings?.organizationName || 'AssetHub Enterprise',
    defaultCurrency: settings?.defaultCurrency || 'USD',
    currencySymbol: settings?.currencySymbol || '$',
    dateFormat: settings?.dateFormat || 'YYYY-MM-DD',
    assetTagPrefix: settings?.assetTagPrefix || 'AST'
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);

  const canEdit = currentUser?.role === 'Super Admin';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await onSaveSettings(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleCurrencyChange = (curr: string) => {
    const symbolMap: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      INR: '₹',
      CAD: 'C$',
      AUD: 'A$'
    };
    setFormData({
      ...formData,
      defaultCurrency: curr,
      currencySymbol: symbolMap[curr] || '$'
    });
  };

  const handleDownloadBackup = () => {
    window.open('/api/export/db', '_blank');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          System Preferences & Organization Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Configure organization identity, localization formats, currency conventions, and database maintenance.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Organization settings saved successfully!</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Card 1: Organization Profile */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-indigo-600" />
            Organization Identity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Organization / Company Name</label>
              <input
                type="text"
                disabled={!canEdit}
                value={formData.organizationName}
                onChange={e => setFormData({ ...formData, organizationName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white disabled:opacity-60"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Default Asset Tag Prefix</label>
              <input
                type="text"
                disabled={!canEdit}
                value={formData.assetTagPrefix}
                onChange={e => setFormData({ ...formData, assetTagPrefix: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono uppercase disabled:opacity-60"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Currency & Localization */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            Localization & Currency Formats
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Default Currency</label>
              <select
                disabled={!canEdit}
                value={formData.defaultCurrency}
                onChange={e => handleCurrencyChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white disabled:opacity-60"
              >
                <option value="USD">USD ($) — US Dollar</option>
                <option value="EUR">EUR (€) — Euro</option>
                <option value="GBP">GBP (£) — British Pound</option>
                <option value="JPY">JPY (¥) — Japanese Yen</option>
                <option value="INR">INR (₹) — Indian Rupee</option>
                <option value="CAD">CAD (C$) — Canadian Dollar</option>
                <option value="AUD">AUD (A$) — Australian Dollar</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Date Display Format</label>
              <select
                disabled={!canEdit}
                value={formData.dateFormat}
                onChange={e => setFormData({ ...formData, dateFormat: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white disabled:opacity-60"
              >
                <option value="YYYY-MM-DD">YYYY-MM-DD (ISO standard)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (US standard)</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY (European standard)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card 3: Theme Appearance */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {darkMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              Interface Theme Mode
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-0.5">
              Toggle between high-contrast daylight theme and dark mode.
            </p>
          </div>

          <button
            type="button"
            onClick={onToggleDarkMode}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 font-medium text-slate-800 dark:text-slate-200 shadow-sm"
          >
            {darkMode ? 'Switch to Light' : 'Switch to Dark'}
          </button>
        </div>

        {/* Action Save Button */}
        {canEdit && (
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              {saving && <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
              Save System Settings
            </button>
          </div>
        )}
      </form>

      {/* Database Maintenance & Backup Section */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-purple-600" />
          Database Backup & Maintenance
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-semibold text-slate-900 dark:text-white">Download Database Backup</div>
            <p className="text-slate-500 text-[11px]">
              Export the entire JSON database containing all assets, employees, assignments, categories, and audit logs.
            </p>
            <button
              type="button"
              onClick={handleDownloadBackup}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 font-medium text-slate-800 dark:text-slate-200 transition-colors mt-2"
            >
              <Download className="w-3.5 h-3.5" />
              Download assethub-db.json
            </button>
          </div>

          {canEdit && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-2">
              <div className="font-semibold text-rose-900 dark:text-rose-200">Reset Demo Data</div>
              <p className="text-rose-700 dark:text-rose-300 text-[11px]">
                Replaces all current records with fresh sample assets, IT categories, and corporate departments.
              </p>
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 font-medium text-white shadow-sm transition-colors mt-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset & Re-Seed Database
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowResetConfirm(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-10 p-6 text-xs space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Reset Database?</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              This will overwrite all active assets, assignments, and audit logs with fresh sample data. This operation cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setResetting(true);
                  await onResetDatabase();
                  setResetting(false);
                  setShowResetConfirm(false);
                }}
                disabled={resetting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium shadow-sm"
              >
                {resetting ? 'Resetting...' : 'Yes, Reset Database'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
