import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white border border-slate-200/80 rounded-2xl p-8 shadow-soft space-y-4">
        <div className="w-14 h-14 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center mx-auto">
          <FileQuestion className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">404 Error</span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Page Not Found</h1>
        </div>
        <p className="text-sm text-slate-500 leading-relaxed">
          The requested page route could not be located on the ClaimFlow platform.
        </p>
        <div className="pt-2">
          <Link to={ROUTES.HOME}>
            <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
