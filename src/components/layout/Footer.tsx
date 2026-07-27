import React from 'react';
import { Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200/80 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-600" />
          <span className="font-semibold text-slate-700">ClaimFlow Platform</span>
          <span>&copy; {new Date().getFullYear()} ClaimFlow Inc. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-slate-900 transition-colors">HIPAA Compliance</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Security Policy</a>
          <a href="#" className="hover:text-slate-900 transition-colors">API Docs</a>
        </div>
      </div>
    </footer>
  );
};
