import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileSpreadsheet, Layers, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';

export function UploadedListsView({ uploadedBatches, onSelectBatch }) {
  const navigate = useNavigate();
  const totalRowsSum = uploadedBatches.reduce((acc, b) => acc + (b.rowCount || 0), 0);

  const handleRowClick = (batchId) => {
    if (onSelectBatch) onSelectBatch(batchId);
    navigate(`/lists/${batchId}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Layers className="w-6 h-6 text-emerald-400" /> Uploaded Datasets List
        </h2>
        <p className="text-slate-400 text-xs mt-1">
          Select any uploaded dataset list from the table below to view its details, perform whole-column calculations, and export results.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Uploaded Lists</div>
            <div className="text-xl font-bold text-slate-100">{uploadedBatches.length} Batches</div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Total Products</div>
            <div className="text-xl font-bold text-cyan-400">{totalRowsSum} Rows</div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-emerald-500/20 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Engine Status</div>
            <div className="text-xl font-bold text-emerald-400">Ready to Calculate</div>
          </div>
        </div>
      </div>

      {/* Uploaded Lists Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Uploaded Lists Table ({uploadedBatches.length} Items)</span>
          </div>
          <span className="text-xs text-slate-400">Click any row to open dataset details</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-950 text-slate-400 text-xs font-semibold border-b border-slate-800">
                <th className="p-4">File Name</th>
                <th className="p-4">Upload Timestamp</th>
                <th className="p-4 text-right">Row Count</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs text-slate-200">
              {uploadedBatches.map((batch) => (
                <tr
                  key={batch.id}
                  onClick={() => handleRowClick(batch.id)}
                  className="hover:bg-slate-800/60 transition-all cursor-pointer group"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 group-hover:border-emerald-500/50 transition-colors">
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-100 group-hover:text-emerald-400 transition-colors">
                          {batch.fileName}
                        </div>
                        <div className="text-[10px] text-slate-400">Excel / CSV Template</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-slate-400 font-mono">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {batch.uploadedAt}
                    </div>
                  </td>

                  <td className="p-4 text-right font-mono font-bold text-slate-200">
                    {batch.rowCount} Rows
                  </td>

                  <td className="p-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" /> Ready
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(batch.id);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold inline-flex items-center gap-1 transition-all cursor-pointer"
                    >
                      View Details & Calculate
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UploadedListsView;
