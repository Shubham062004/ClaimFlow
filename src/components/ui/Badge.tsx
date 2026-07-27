import React from 'react';
import { ClaimStatus } from '@/types/claim';
import { cn } from '@/lib/utils';
import { formatStatus } from '@/utils/formatters';

export interface BadgeProps {
  status: ClaimStatus | string;
  className?: string;
  showDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ status, className, showDot = true }) => {
  const getStatusStyles = (st: string) => {
    switch (st) {
      case 'submitted':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'bg-blue-600',
        };
      case 'under_review':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
        };
      case 'pending_documents':
        return {
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
          dot: 'bg-purple-600',
        };
      case 'approved':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-600',
        };
      case 'paid':
        return {
          bg: 'bg-teal-50 text-teal-700 border-teal-200',
          dot: 'bg-teal-600',
        };
      case 'rejected':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-600',
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-500',
        };
    }
  };

  const styles = getStatusStyles(status);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border',
        styles.bg,
        className
      )}
    >
      {showDot && <span className={cn('w-1.5 h-1.5 rounded-full', styles.dot)} />}
      <span>{formatStatus(status)}</span>
    </span>
  );
};
