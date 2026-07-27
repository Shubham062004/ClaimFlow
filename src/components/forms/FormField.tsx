import React, { ReactNode } from 'react';

export interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  description?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error,
  children,
  description,
}) => {
  return (
    <div className="space-y-1.5 w-full">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      </div>

      {children}

      {description && !error && (
        <p className="text-xs text-slate-500">{description}</p>
      )}

      {error && (
        <p className="text-xs font-medium text-red-600 animate-fade-in">{error}</p>
      )}
    </div>
  );
};
