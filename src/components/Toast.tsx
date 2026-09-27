import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  isVisible: boolean;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-200 pointer-events-none px-4 max-w-sm w-full">
      <div
        className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-md text-sm font-semibold ${
          type === 'success'
            ? 'bg-slate-900/95 border-emerald-500/40 text-emerald-300 shadow-emerald-950/40'
            : type === 'error'
            ? 'bg-slate-900/95 border-rose-500/40 text-rose-300 shadow-rose-950/40'
            : 'bg-slate-900/95 border-purple-500/40 text-purple-300 shadow-purple-950/40'
        }`}
      >
        {type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
        {type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
        <span>{message}</span>
      </div>
    </div>
  );
};
