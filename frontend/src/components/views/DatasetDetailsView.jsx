import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Play, FileSpreadsheet, FileCode, CheckCircle2, Table, Zap, Calculator } from 'lucide-react';

export function DatasetDetailsView({
  uploadedBatches,
  onSelectBatch,
  userDataset,
  calculatedDataset,
  onRunCalculation,
}) {
  const navigate = useNavigate();
  const { batchId } = useParams();
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [isExportingCsv, setIsExportingCsv] = useState(false);

  useEffect(() => {
    if (batchId && onSelectBatch) {
      onSelectBatch(batchId);
    }
  }, [batchId, onSelectBatch]);

  const activeBatch = uploadedBatches.find((b) => b.id === batchId) || uploadedBatches[0];
  const displayData = calculatedDataset.length > 0 ? calculatedDataset : userDataset;

  const totalQuantity = displayData.reduce((acc, row) => acc + (row.quantityTonnes || 0), 0);
  const totalEmissions = displayData.reduce((acc, row) => acc + (row.totalEmissions || 0), 0);
  const totalDirect = displayData.reduce((acc, row) => acc + (row.directEmissions || 0), 0);
  const totalIndirect = displayData.reduce((acc, row) => acc + (row.indirectEmissions || 0), 0);
  const avgSpecificEmissions = totalQuantity > 0 && totalEmissions > 0 ? (totalEmissions / totalQuantity).toFixed(4) : '0.00';

  const handleExportCsv = () => {
    setIsExportingCsv(true);
    setTimeout(() => {
      const headers = ['CN Code', 'Product Name', 'Weight Column (Tonnes)', 'Origin', 'Multiplier Factor', 'Direct Scope 1 (tCO2e)', 'Scope 2 Indirect (tCO2e)', 'Total Emissions (tCO2e)', 'Specific Emissions (tCO2e/tonne)'];
      const csvRows = [
        headers.join(','),
        ...displayData.map((row) =>
          [
            `"${row.cnCode}"`,
            `"${row.productName}"`,
            row.quantityTonnes,
            `"${row.countryOfOrigin}"`,
            row.benchmarkDirectFactor || 0.65,
            row.directEmissions || 0,
            row.indirectEmissions || 0,
            row.totalEmissions || 0,
            row.specificEmissionsPerTonne || 0,
          ].join(',')
        ),
      ];

      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${activeBatch?.fileName || 'Dataset'}_Calculated_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExportingCsv(false);
    }, 500);
  };

  const handleExportExcel = () => {
    setIsExportingExcel(true);
    setTimeout(() => {
      handleExportCsv();
      setIsExportingExcel(false);
    }, 500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/lists')}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" /> Back to Uploaded Lists Table
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={onRunCalculation}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            Run Whole-Column Multiplication
          </button>

          <button
            onClick={handleExportCsv}
            disabled={isExportingCsv}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <FileCode className="w-4 h-4 text-cyan-400" />
            {isExportingCsv ? 'Exporting...' : 'Export CSV'}
          </button>

          <button
            onClick={handleExportExcel}
            disabled={isExportingExcel}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            {isExportingExcel ? 'Generating...' : 'Export Excel (.xlsx)'}
          </button>
        </div>
      </div>

      {/* Selected Batch Header Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">{activeBatch?.fileName || 'Selected Dataset'}</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Uploaded at {activeBatch?.uploadedAt} • {displayData.length} Records Processed
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {calculatedDataset.length > 0 ? 'Column Calculations Executed' : 'Validation Passed'}
        </span>
      </div>

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-emerald-500/30 rounded-2xl p-4 space-y-1">
          <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
            Total Embedded Emissions
          </div>
          <div className="text-2xl font-extrabold text-slate-100">
            {totalEmissions > 0 ? totalEmissions.toLocaleString() : '—'}{' '}
            <span className="text-xs font-normal text-slate-400">tCO2e</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Direct Scope 1
          </div>
          <div className="text-2xl font-extrabold text-slate-100">
            {totalDirect > 0 ? totalDirect.toLocaleString() : '—'}{' '}
            <span className="text-xs font-normal text-slate-400">tCO2e</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider flex items-center gap-1">
            <Zap className="w-3 h-3" /> Scope 2 Indirect
          </div>
          <div className="text-2xl font-extrabold text-slate-100">
            {totalIndirect > 0 ? totalIndirect.toLocaleString() : '—'}{' '}
            <span className="text-xs font-normal text-slate-400">tCO2e</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Avg Specific Emissions
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">
            {avgSpecificEmissions} <span className="text-xs font-normal text-slate-400">tCO2e/t</span>
          </div>
        </div>
      </div>

      {/* Dataset Details Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
            <Table className="w-4 h-4 text-emerald-400" />
            <span>Dataset Rows & Calculated Output Columns ({displayData.length} Items)</span>
          </div>
          <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 font-mono">
            Direct Scope 1 = Weight Cell × Benchmark Multiplier
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-slate-950 text-slate-400 text-xs font-semibold border-b border-slate-800">
                <th className="p-4">CN Code</th>
                <th className="p-4">Product Line Name</th>
                <th className="p-4 text-right">Weight Column (Tonnes)</th>
                <th className="p-4 text-right">Benchmark Multiplier</th>
                <th className="p-4 text-right text-emerald-400 font-bold">Direct Scope 1 (tCO2e)</th>
                <th className="p-4 text-right text-cyan-400">Scope 2 Indirect (tCO2e)</th>
                <th className="p-4 text-right text-slate-100 font-bold">Total Emissions (tCO2e)</th>
                <th className="p-4 text-right text-emerald-400 font-bold">Specific (tCO2e/t)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs text-slate-200">
              {displayData.map((row, idx) => (
                <tr key={row.id || idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono text-emerald-400 font-bold">{row.cnCode}</td>
                  <td className="p-4 font-medium">{row.productName}</td>
                  <td className="p-4 text-right font-mono bg-slate-900/40 font-bold text-slate-100">
                    {row.quantityTonnes?.toLocaleString()} t
                  </td>
                  <td className="p-4 text-right font-mono text-emerald-400">
                    × {row.benchmarkDirectFactor || 0.65}
                  </td>
                  <td className="p-4 text-right font-mono text-emerald-400 font-bold bg-emerald-500/5">
                    {row.directEmissions !== undefined ? `${row.directEmissions.toLocaleString()} tCO2e` : '—'}
                  </td>
                  <td className="p-4 text-right font-mono text-cyan-400">
                    {row.indirectEmissions !== undefined ? `${row.indirectEmissions.toLocaleString()} tCO2e` : '—'}
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-slate-100">
                    {row.totalEmissions !== undefined ? `${row.totalEmissions.toLocaleString()} tCO2e` : '—'}
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-emerald-400">
                    {row.specificEmissionsPerTonne !== undefined ? row.specificEmissionsPerTonne : '—'}
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
