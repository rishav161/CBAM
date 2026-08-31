import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileSpreadsheet, Layers, ArrowRight, Clock, CheckCircle2, User } from 'lucide-react';
import { useBatchesQuery } from '../../hooks/useBatchQueries.js';

export function UploadedListsView() {
  const navigate = useNavigate();
  const { data: uploadedBatches = [], isLoading, isError, error } = useBatchesQuery();

  const totalRowsSum = uploadedBatches.reduce((acc, b) => acc + (b._count?.datasets || 0), 0);

  const handleRowClick = (batchId) => {
    navigate(`/lists/${batchId}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Layers className="w-6 h-6 text-emerald-500" /> Uploaded Datasets List
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
          Select any uploaded dataset list from the table below to view line items, perform CBAM calculations, and export Word reports.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Uploaded Batches</div>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{uploadedBatches.length} Batches</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500 font-bold">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Products</div>
            <div className="text-xl font-bold text-cyan-600 dark:text-cyan-400">{totalRowsSum} Line Items</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/60 border border-emerald-500/20 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Calculation Engine</div>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">Ready to Process</div>
          </div>
        </div>
      </div>

      {/* Uploaded Lists Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span>Uploaded Datasets Table ({uploadedBatches.length} Items)</span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">Click any row to view dataset & calculate</span>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Fetching datasets list from backend...</span>
          </div>
        ) : isError ? (
          <div className="p-4 text-xs text-rose-500">Failed to load datasets: {error?.message}</div>
        ) : uploadedBatches.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 space-y-3">
            <FileSpreadsheet className="w-10 h-10 text-slate-400 mx-auto" />
            <p>No dataset batches uploaded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <th className="p-4">File Name</th>
                  <th className="p-4">Uploaded By</th>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4 text-right">Items</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs text-slate-700 dark:text-slate-200">
                {uploadedBatches.map((batch) => (
                  <tr
                    key={batch.id}
                    onClick={() => handleRowClick(batch.id)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all cursor-pointer group"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-emerald-500 group-hover:border-emerald-500/50 transition-colors">
                          <FileSpreadsheet className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-500 transition-colors">
                            {batch.originalName || batch.fileName}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{(batch.fileSize / 1024).toFixed(1)} KB</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{batch.user?.name || 'Customer'}</span>
                      </div>
                      {batch.user?.company && (
                        <div className="text-[10px] text-slate-400">{batch.user.company}</div>
                      )}
                    </td>

                    <td className="p-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(batch.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="p-4 text-right font-mono font-bold text-slate-900 dark:text-slate-100">
                      {batch._count?.datasets || 0} Products
                    </td>

                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          batch.status === 'COMPLETED'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : batch.status === 'CALCULATED'
                            ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" /> {batch.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(batch.id);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-semibold inline-flex items-center gap-1 transition-all cursor-pointer"
                      >
                        View & Calculate
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadedListsView;
