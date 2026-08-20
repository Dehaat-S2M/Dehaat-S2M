import React from 'react';
import {
  Boxes,
  CheckCircle,
  UserCheck,
  Wrench,
  Archive,
  Users,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldAlert,
  Plus,
  ArrowRightLeft
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import type { DashboardStats, OrganizationSettings } from '../../types';
import { StatusBadge } from '../common/Badge';
import { formatCurrency, formatDate, formatDateTime } from '../../lib/utils';
import type { NavTab } from '../layout/Sidebar';

interface DashboardViewProps {
  stats: DashboardStats | null;
  settings: OrganizationSettings | null;
  onNavigate: (tab: NavTab) => void;
  onAddAsset: () => void;
  onQuickAssign: () => void;
}

export function DashboardView({
  stats,
  settings,
  onNavigate,
  onAddAsset,
  onQuickAssign
}: DashboardViewProps) {
  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading dashboard analytics...</p>
        </div>
      </div>
    );
  }

  const currencySymbol = settings?.currencySymbol || '$';
  const currencyCode = settings?.defaultCurrency || 'USD';

  const statCards = [
    {
      title: 'Total Assets',
      value: stats.totalAssets,
      subValue: formatCurrency(stats.totalAssetValue, currencyCode, currencySymbol),
      subLabel: 'Total Value',
      icon: Boxes,
      color: 'bg-indigo-500 text-white',
      border: 'border-indigo-100 dark:border-indigo-900/40',
      actionTab: 'assets' as NavTab
    },
    {
      title: 'Available',
      value: stats.availableAssets,
      subValue: `${Math.round((stats.availableAssets / (stats.totalAssets || 1)) * 100)}%`,
      subLabel: 'Of Total Fleet',
      icon: CheckCircle,
      color: 'bg-emerald-500 text-white',
      border: 'border-emerald-100 dark:border-emerald-900/40',
      actionTab: 'assets' as NavTab
    },
    {
      title: 'Assigned',
      value: stats.assignedAssets,
      subValue: `${Math.round((stats.assignedAssets / (stats.totalAssets || 1)) * 100)}%`,
      subLabel: 'In Active Use',
      icon: UserCheck,
      color: 'bg-blue-500 text-white',
      border: 'border-blue-100 dark:border-blue-900/40',
      actionTab: 'assets' as NavTab
    },
    {
      title: 'Maintenance',
      value: stats.maintenanceAssets,
      subValue: stats.damagedAssets > 0 ? `${stats.damagedAssets} Damaged` : 'Healthy',
      subLabel: 'Service Queue',
      icon: Wrench,
      color: 'bg-amber-500 text-white',
      border: 'border-amber-100 dark:border-amber-900/40',
      actionTab: 'assets' as NavTab
    },
    {
      title: 'Retired / Lost',
      value: stats.retiredAssets + stats.lostAssets,
      subValue: `${stats.retiredAssets} Ret, ${stats.lostAssets} Lost`,
      subLabel: 'Out of Service',
      icon: Archive,
      color: 'bg-slate-500 text-white',
      border: 'border-slate-100 dark:border-slate-800',
      actionTab: 'assets' as NavTab
    },
    {
      title: 'Employees',
      value: stats.totalEmployees,
      subValue: 'Active Personnel',
      subLabel: 'Across Offices',
      icon: Users,
      color: 'bg-purple-500 text-white',
      border: 'border-purple-100 dark:border-purple-900/40',
      actionTab: 'employees' as NavTab
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
            {settings?.organizationName || 'AssetHub'} Asset Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Real-time inventory intelligence, asset lifecycles, employee hardware allocation, and warranty tracking.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onQuickAssign}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs backdrop-blur-sm border border-white/15 transition-all"
          >
            <ArrowRightLeft className="w-4 h-4" />
            Check-In / Check-Out
          </button>
          <button
            onClick={onAddAsset}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add New Asset
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigate(card.actionTab)}
              className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border ${card.border} shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {card.title}
                </span>
                <div className={`p-2 rounded-xl ${card.color} shadow-sm`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3">
                <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {card.value}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between mt-1 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="truncate">{card.subValue}</span>
                  <span className="text-[10px] text-slate-400">{card.subLabel}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assets by Category Bar Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Assets & Capital Value by Category
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Fleet distribution across hardware categories
              </p>
            </div>
            <button
              onClick={() => onNavigate('categories')}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
            >
              View Categories <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.assetsByCategory}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  formatter={(value: any, name: string) => [
                    name === 'count' ? `${value} Units` : formatCurrency(value, currencyCode, currencySymbol),
                    name === 'count' ? 'Asset Count' : 'Total Capital Value'
                  ]}
                  contentStyle={{
                    borderRadius: '12px',
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} name="count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Assets by Status Donut */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Fleet Status Breakdown
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Operating condition distribution
              </p>
            </div>
          </div>

          <div className="h-48 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.assetsByStatus}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {stats.assetsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val} Assets`, 'Count']}
                  contentStyle={{
                    borderRadius: '12px',
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                {stats.totalAssets}
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-medium">Assets</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {stats.assetsByStatus.map((status, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: status.color }}
                />
                <span className="text-slate-600 dark:text-slate-400 truncate">{status.name}</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200 ml-auto">
                  {status.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Section: Location Distribution & Warranty Alerts / Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Asset Activity Timeline */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Recent Asset Activity Log
              </h3>
            </div>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
            >
              Full Audit Trail <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-2">
            {stats.recentActivity.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No recent activity recorded.</p>
            ) : (
              stats.recentActivity.slice(0, 5).map(item => (
                <div key={item.id} className="pt-2 flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {item.assetTag} - {item.action}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {formatDateTime(item.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate mt-0.5">
                      {item.notes || `${item.action} by ${item.userName}`}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Expiring Warranties & Location Overview */}
        <div className="space-y-6">
          {/* Expiring Warranty Alert Card */}
          <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-semibold text-sm">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                Warranty Expirations (Next 180 Days)
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-200/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
                {stats.expiringWarranties.length} Assets
              </span>
            </div>

            {stats.expiringWarranties.length === 0 ? (
              <p className="text-xs text-amber-700 dark:text-amber-400">
                No asset warranties are expiring within the next 180 days. All systems covered.
              </p>
            ) : (
              <div className="space-y-2">
                {stats.expiringWarranties.map(asset => (
                  <div
                    key={asset.id}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-amber-900/30 flex items-center justify-between text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-slate-900 dark:text-white truncate">
                        {asset.name}
                      </div>
                      <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                        Tag: {asset.assetTag} | Brand: {asset.brand}
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <span className="text-rose-600 dark:text-rose-400 font-medium">
                        Expires: {formatDate(asset.warrantyExpiry)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Location Distribution */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Assets by Location
              </h3>
              <button
                onClick={() => onNavigate('locations')}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
              >
                Manage Locations <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {stats.assetsByLocation.map((loc, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700 dark:text-slate-300">{loc.name}</span>
                    <span className="text-slate-900 dark:text-white font-bold">{loc.count}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all"
                      style={{
                        width: `${Math.round((loc.count / (stats.totalAssets || 1)) * 100)}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
