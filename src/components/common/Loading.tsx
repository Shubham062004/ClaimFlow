import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LoadingProps {
  fullPage?: boolean;
  message?: string;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  fullPage = false,
  message = 'Loading ClaimFlow platform...',
  className,
}) => {
  const content = (
    <div className={cn('flex flex-col items-center justify-center space-y-3 text-center p-6', className)}>
      <div className="relative flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-blue-100 animate-pulse" />
        <Loader2 className="w-6 h-6 text-[#2563EB] animate-spin absolute" />
      </div>
      {message && <p className="text-xs font-medium text-slate-500 tracking-wide">{message}</p>}
    </div>
  );

  if (fullPage) {
    return <div className="fixed inset-0 bg-[#F8FAFC]/80 backdrop-blur-xs flex items-center justify-center z-50">{content}</div>;
  }

  return content;
};
