import React from 'react';
import { ShieldCheck, Calendar } from 'lucide-react';

export function NavigationHeader() {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-100 leading-tight">EU CBAM Calculation & Reporting</h1>
          <p className="text-xs text-slate-400">Carbon Border Adjustment Mechanism Compliance System</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700/50 text-xs text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <span>Reporting Period: <strong>Q1 2024</strong></span>
        </div>
      </div>
    </header>
  );
}

export default NavigationHeader;
