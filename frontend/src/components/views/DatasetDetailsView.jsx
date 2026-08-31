import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Play, FileSpreadsheet, CheckCircle2, Table, Zap, Download, AlertCircle } from 'lucide-react';
import { useBatchDetailsQuery, useCalculateMutation, useDownloadReportMutation } from '../../hooks/useBatchQueries.js';

export function DatasetDetailsView() {
  const navigate = useNavigate();
  const { batchId } = useParams();

  const { data: batch, isLoading, isError, error } = useBatchDetailsQuery(batchId);
  const calculateMutation = useCalculateMutation();
  const downloadReportMutation = useDownloadReportMutation();

  const handleRunCalculation = async () => {
    if (!batchId) return;
    try {
      await calculateMutation.mutateAsync(batchId);
    } catch (err) {
      console.error('Calculation failed:', err);
    }
  };

  const handleDownloadWordReport = async () => {
    if (!batchId) return;
    try {
      await downloadReportMutation.mutateAsync(batchId);
    } catch (err) {
      console.error('Download report failed:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
        <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <span>Loading batch details & dataset line items...</span>
      </div>
    );
  }

  if (isError || !batch) {
    return (
      <div className="p-8 text-center text-xs text-rose-500 space-y-3">
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
        <p>Failed to load dataset batch details: {error?.message || 'Batch not found.'}</p>
        <button
          onClick={() => navigate('/lists')}
          className="px-4 py-2 bg-slate-800 text-slate-200 rounded-xl text-xs font-semibold"
        >
          Back to Datasets List
        </button>
      </div>
    );
  }

  const datasets = batch.datasets || [];
  const results = batch.results;

  const totalQuantity = datasets.reduce((acc, row) => acc + (row.productionQuantity || 0), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Top Back Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate('/lists')}
          className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-500" /> Back to Uploaded Lists
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunCalculation}
            disabled={calculateMutation.isPending}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {calculateMutation.isPending ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Run CBAM Emissions Calculation</span>
              </>
            )}
          </button>

          {results && (
            <button
              onClick={handleDownloadWordReport}
              disabled={downloadReportMutation.isPending}
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {downloadReportMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Word Report (.docx)</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Selected Batch Header Banner */}
      <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{batch.originalName || batch.fileName}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Uploaded by {batch.user?.name || 'Customer'} ({batch.user?.company || 'N/A'}) • {datasets.length} Line Items
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {results ? 'CBAM Calculation Completed' : batch.status}
        </span>
      </div>

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900/60 border border-emerald-500/30 rounded-2xl p-4 space-y-1 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
            Total Embedded Emissions
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {results ? results.totalEmbeddedEmissions.toFixed(2) : '—'}{' '}
            <span className="text-xs font-normal text-slate-500">tCO2e</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-1 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
            Direct Scope 1
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {results ? results.totalDirectEmissions.toFixed(2) : '—'}{' '}
            <span className="text-xs font-normal text-slate-500">tCO2e</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-1 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-cyan-600 dark:text-cyan-400 tracking-wider flex items-center gap-1">
            <Zap className="w-3 h-3" /> Scope 2 Indirect
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {results ? results.totalIndirectEmissions.toFixed(2) : '—'}{' '}
            <span className="text-xs font-normal text-slate-500">tCO2e</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-1 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
            Total Production Volume
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {totalQuantity.toLocaleString()} <span className="text-xs font-normal text-slate-500">tonnes</span>
          </div>
        </div>
      </div>

      {/* Dataset Details Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
            <Table className="w-4 h-4 text-emerald-500" />
            <span>Dataset Products & Emissions Parameters ({datasets.length} Line Items)</span>
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 font-mono">
            Direct Emissions = Production Tonnage × Direct Factor
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 text-xs font-semibold border-b border-slate-200 dark:border-slate-800">
                <th className="p-4">CN Code</th>
                <th className="p-4">Goods Description</th>
                <th className="p-4">Origin</th>
                <th className="p-4 text-right">Production (Tonnes)</th>
                <th className="p-4 text-right">Direct Factor (tCO2e/t)</th>
                <th className="p-4 text-right">Indirect Factor (tCO2e/t)</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs text-slate-700 dark:text-slate-200">
              {datasets.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono text-emerald-600 dark:text-emerald-400 font-bold">{row.cnCode}</td>
                  <td className="p-4 font-medium">{row.goodsDescription || 'CBAM Goods'}</td>
                  <td className="p-4">{row.countryOfOrigin}</td>
                  <td className="p-4 text-right font-mono font-bold text-slate-900 dark:text-slate-100">
                    {row.productionQuantity?.toLocaleString()} {row.quantityUnit}
                  </td>
                  <td className="p-4 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {row.directEmissions !== null ? `${row.directEmissions} tCO2e/t` : 'EU Default Benchmark'}
                  </td>
                  <td className="p-4 text-right font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                    {row.indirectEmissions !== null ? `${row.indirectEmissions} tCO2e/t` : 'EU Default Benchmark'}
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      Valid
                    </span>
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

export default DatasetDetailsView;
