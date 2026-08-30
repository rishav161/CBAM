import React from 'react';
import { NavLink } from 'react-router-dom';
import { UploadCloud, Table, ShieldCheck, Database, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../providers/ThemeProvider.jsx';

export function SidebarNavigation({ batchCount, factorCount }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen sticky top-0 shrink-0 transition-colors duration-200">
      {/* Branding Header */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">EU CBAM Tool</h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Emissions Calculator</p>
          </div>
        </div>

        {/* Centralized Dark / Light Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>
      </div>

      {/* Main Navigation Menu */}
      <div className="p-4 space-y-2 flex-1">
        <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">
          Navigation Menu
        </div>

        {/* Menu Item 1: Upload Flow (/upload) */}
        <NavLink
          to="/upload"
          className={({ isActive }) =>
            `w-full p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
              isActive
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold shadow-sm ring-1 ring-emerald-500/20'
                : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800/60 font-semibold'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                <UploadCloud className="w-4 h-4" />
              </div>
              <span className="text-xs">Upload Flow</span>
            </>
          )}
        </NavLink>

        {/* Menu Item 2: Uploaded Lists (/lists) */}
        <NavLink
          to="/lists"
          className={({ isActive }) =>
            `w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
              isActive
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold shadow-sm ring-1 ring-emerald-500/20'
                : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800/60 font-semibold'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Table className="w-4 h-4" />
                </div>
                <span className="text-xs">Uploaded Lists</span>
              </div>

              <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                {batchCount}
              </span>
            </>
          )}
        </NavLink>

        {/* Menu Item 3: Benchmark Factors (/benchmarks) */}
        <NavLink
          to="/benchmarks"
          className={({ isActive }) =>
            `w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
              isActive
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold shadow-sm ring-1 ring-emerald-500/20'
                : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800/60 font-semibold'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Database className="w-4 h-4" />
                </div>
                <span className="text-xs">Benchmark Factors</span>
              </div>

              <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                {factorCount}
              </span>
            </>
          )}
        </NavLink>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-emerald-500" /> Reference Factors
        </span>
        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">EU v2024.1</span>
      </div>
    </aside>
  );
}

export default SidebarNavigation;
