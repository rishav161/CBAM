import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileSpreadsheet, Database, ArrowRight, CheckCircle2, Download, AlertCircle } from 'lucide-react';
import { useUploadBatchMutation, useDownloadTemplateMutation } from '../../hooks/useBatchQueries.js';
import { useBenchmarkFactorsQuery } from '../../hooks/useBenchmarkQueries.js';

export function UploadFlowView() {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const uploadBatchMutation = useUploadBatchMutation();
  const downloadTemplateMutation = useDownloadTemplateMutation();
  const { data: benchmarkFactors = [] } = useBenchmarkFactorsQuery();

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile) return;

    try {
      const result = await uploadBatchMutation.mutateAsync(selectedFile);
      if (result?.batch?.id) {
        navigate(`/lists/${result.batch.id}`);
      } else {
        navigate('/lists');
      }
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const handleDownloadTemplate = () => {
    downloadTemplateMutation.mutate();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Upload Client Dataset File</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-xs">
          Upload raw client Excel (`.xlsx`, `.xls`) or CSV files. The tool structures data and maps it against EU CBAM default factors.
        </p>
        <div className="pt-2">
          <button
            onClick={handleDownloadTemplate}
            disabled={downloadTemplateMutation.isPending}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadTemplateMutation.isPending ? 'Downloading...' : 'Download Sample Excel Template'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* System Reference Factors Card */}
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">EU Reference Factors</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Default Benchmark Values</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs max-h-80 overflow-y-auto pr-1">
            {benchmarkFactors.slice(0, 6).map((factor) => (
              <div key={factor.id || factor.cnCode} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">{factor.cnCode}</span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[140px]">{factor.goodsName}</p>
                </div>
                <span className="font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px]">
                  {factor.directBenchmark} tCO2e/t
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* User File Upload Dropzone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              setSelectedFile(e.dataTransfer.files[0]);
            }
          }}
          className={`md:col-span-2 border-2 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center transition-all ${
            isDragging
              ? 'border-emerald-500 bg-emerald-500/5'
              : selectedFile
              ? 'border-emerald-500/40 bg-white dark:bg-slate-900/60'
              : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 hover:border-slate-400 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-900/60'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-4">
            {selectedFile ? <FileSpreadsheet className="w-8 h-8" /> : <UploadCloud className="w-8 h-8" />}
          </div>

          {uploadBatchMutation.isError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{uploadBatchMutation.error?.response?.data?.error || 'Upload failed.'}</span>
            </div>
          )}

          {selectedFile ? (
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> File Ready to Upload
              </span>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{selectedFile.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{(selectedFile.size / 1024).toFixed(1)} KB</p>

              <div className="pt-2 flex items-center gap-3 justify-center">
                <label className="text-xs text-slate-500 underline cursor-pointer hover:text-emerald-500">
                  Change File
                  <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileSelect} className="hidden" />
                </label>

                <button
                  onClick={handleConfirmUpload}
                  disabled={uploadBatchMutation.isPending}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {uploadBatchMutation.isPending ? (
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Upload & Extract Dataset</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Drag & drop your client Excel or CSV file here</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Supports .xlsx, .xls, and .csv files up to 25MB</p>

              <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs font-semibold cursor-pointer border border-slate-300 dark:border-slate-700 transition-colors mt-2">
                Browse Files
                <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileSelect} className="hidden" />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadFlowView;
