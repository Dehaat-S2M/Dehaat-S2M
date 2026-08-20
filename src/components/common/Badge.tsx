import React from 'react';
import { cn } from '../../lib/utils';
import type { AssetStatus } from '../../types';

interface BadgeProps {
  status?: AssetStatus | 'Active' | 'On Leave' | 'Terminated' | 'Returned' | string;
  variant?: 'default' | 'outline' | 'pill';
  className?: string;
  children?: React.ReactNode;
}

export function StatusBadge({ status, className }: BadgeProps) {
  const getStyle = () => {
    switch (status) {
      case 'Available':
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
      case 'Assigned':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800';
      case 'Under Maintenance':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
      case 'Damaged':
        return 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-800';
      case 'Lost':
      case 'Terminated':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
      case 'Retired':
      case 'Returned':
        return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
      case 'On Leave':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  const getDotColor = () => {
    switch (status) {
      case 'Available':
      case 'Active':
        return 'bg-emerald-500';
      case 'Assigned':
        return 'bg-blue-500';
      case 'Under Maintenance':
        return 'bg-amber-500';
      case 'Damaged':
        return 'bg-pink-500';
      case 'Lost':
      case 'Terminated':
        return 'bg-rose-500';
      case 'Retired':
      case 'Returned':
        return 'bg-slate-400';
      case 'On Leave':
        return 'bg-indigo-500';
      default:
        return 'bg-slate-400';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap',
        getStyle(),
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', getDotColor())} />
      {status}
    </span>
  );
}

export function RoleBadge({ role, className }: { role: string; className?: string }) {
  const getStyle = () => {
    switch (role) {
      case 'Super Admin':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800';
      case 'Asset Manager':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border whitespace-nowrap',
        getStyle(),
        className
      )}
    >
      {role}
    </span>
  );
}
