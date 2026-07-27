import React from 'react';
import { Toaster } from 'react-hot-toast';

export const ToastConfig: React.FC = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#FFFFFF',
          color: '#0F172A',
          border: '1px solid rgba(226, 232, 240, 0.9)',
          borderRadius: '16px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.025)',
          padding: '12px 16px',
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif',
        },
        success: {
          iconTheme: {
            primary: '#2563EB',
            secondary: '#FFFFFF',
          },
        },
        error: {
          iconTheme: {
            primary: '#E11D48',
            secondary: '#FFFFFF',
          },
        },
      }}
    />
  );
};
