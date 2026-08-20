import React from 'react';
import {
  LayoutDashboard,
  Boxes,
  Users,
  Layers,
  Building2,
  Truck,
  History,
  FileBarChart2,
  Settings,
  BookOpen,
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { DashboardStats, User } from '../../types';

export type NavTab =
  | 'dashboard'
  | 'assets'
  | 'employees'
  | 'categories'
  | 'locations'
  | 'vendors'
  | 'history'
  | 'reports'
  | 'settings'
  | 'guide';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  stats: DashboardStats | null;
  currentUser: User | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onQuickAssignClick: () => void;
}

export function Sidebar({
  activeTab,
  setActiveTab,
  stats,
  currentUser,
  isOpen,
  setIsOpen,
  onQuickAssignClick
}: SidebarProps) {
  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'assets' as NavTab,
      label: 'Assets',
      icon: Boxes,
      badge: stats?.totalAssets ? String(stats.totalAssets) : null
    },
    {
      id: 'employees' as NavTab,
      label: 'Employees',
      icon: Users,
      badge: stats?.totalEmployees ? String(stats.totalEmployees) : null
    },
    {
      id: 'categories' as NavTab,
      label: 'Categories',
      icon: Layers,
      badge: null
    },
    {
      id: 'locations' as NavTab,
      label: 'Locations & Depts',
      icon: Building2,
      badge: null
    },
    {
      id: 'vendors' as NavTab,
      label: 'Vendors',
      icon: Truck,
      badge: null
    },
    {
      id: 'history' as NavTab,
      label: 'Audit History',
      icon: History,
      badge: null
    },
    {
      id: 'reports' as NavTab,
      label: 'Reports & Export',
      icon: FileBarChart2,
      badge: null
    },
    {
      id: 'settings' as NavTab,
      label: 'Settings & DB',
      icon: Settings,
      badge: null
    },
    {
      id: 'guide' as NavTab,
      label: 'Deployment Guide',
      icon: BookOpen,
      badge: 'Help'
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      <aside
        className={cn(
          'fixed lg:static top-0 bottom-0 left-0 z-40 flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 font-bold text-lg tracking-wider">
              A
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white tracking-tight text-base">AssetHub</span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Enterprise IT Assets</p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 lg:hidden"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Check-In / Check-Out Action Button */}
        {currentUser?.role !== 'Viewer' && (
          <div className="p-3 border-b border-slate-800/80">
            <button
              onClick={onQuickAssignClick}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs tracking-wide shadow-sm shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Check-Out / Check-In</span>
            </button>
          </div>
        )}

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Core Modules
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group',
                  isActive
                    ? 'bg-indigo-600/20 text-white font-semibold border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      'w-4 h-4 transition-colors',
                      isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'
                    )}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={cn(
                      'text-[10px] font-semibold px-2 py-0.5 rounded-full',
                      isActive
                        ? 'bg-indigo-500 text-white'
                        : 'bg-slate-800 text-slate-400 group-hover:text-slate-300'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Current User Card */}
        <div className="p-3 m-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
          <div className="flex items-center gap-2.5">
            {currentUser?.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30 shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300">
                {currentUser?.name ? currentUser.name[0] : 'U'}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-medium text-slate-200 truncate">{currentUser?.name || 'Loading...'}</p>
              <div className="flex items-center gap-1 text-[11px] text-indigo-400">
                <ShieldCheck className="w-3 h-3 shrink-0" />
                <span className="truncate">{currentUser?.role || 'User'}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
