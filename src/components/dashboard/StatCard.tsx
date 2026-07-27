import React, { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendType = 'positive',
}) => {
  return (
    <Card className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        {icon && <div className="p-2 rounded-xl bg-slate-100/80">{icon}</div>}
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold text-slate-900 tracking-tight">{value}</div>
        {trend && (
          <span
            className={`inline-block mt-1 text-xs font-medium ${
              trendType === 'positive'
                ? 'text-emerald-600'
                : trendType === 'negative'
                ? 'text-rose-600'
                : 'text-slate-500'
            }`}
          >
            {trend}
          </span>
        )}
      </div>
    </Card>
  );
};
