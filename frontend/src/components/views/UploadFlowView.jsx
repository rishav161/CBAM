import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileSpreadsheet, Database, ArrowRight, CheckCircle2 } from 'lucide-react';

export function UploadFlowView({ benchmarkFactors, onAddUploadedBatch }) {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };

  const handleConfirmUpload = () => {
    if (selectedFile && onAddUploadedBatch) {
      const newBatchId = onAddUploadedBatch(selectedFile);
      navigate(`/lists/${newBatchId || ''}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-100">Upload New User Data Template</h2>
        <p className="text-slate-400 max-w-xl mx-auto text-sm">
          Upload your unstructured Excel (`.xlsx`, `.xls`) or CSV file. The tool will map and calculate emissions using system benchmark factors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* System Fixed Reference Factor Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">System Reference Factors</h3>
              <p className="text-[10px] text-slate-400">Fixed Benchmark Values (CSV)</p>
            </div>
          </div>

          <div className="divide-y divide-slate-800/60 text-xs">
            {benchmarkFactors.map((factor) => (
              <div key={factor.cnCode} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-mono text-emerald-400 font-bold">{factor.cnCode}</span>
                  <p className="text-[10px] text-slate-400">{factor.category}</p>
                </div>
                <span className="font-mono text-slate-200 bg-slate-800 px-2 py-0.5 rounded">
                  {factor.benchmarkDirectFactor} tCO2e/t
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* User File Upload Dropzone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          className={`md:col-span-2 border-2 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center transition-all ${
            isDragging
              ? 'border-emerald-500 bg-emerald-500/5'
              : selectedFile
              ? 'border-emerald-500/40 bg-slate-900/60'
              : 'border-slate-700 bg-slate-900/40 hover:border-slate-600 hover:bg-slate-900/60'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
            {selectedFile ? <FileSpreadsheet className="w-8 h-8" /> : <UploadCloud className="w-8 h-8" />}
          </div>

          {selectedFile ? (
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Template Selected
              </span>
              <h3 className="text-base font-semibold text-slate-100">{selectedFile.name}</h3>
              <p className="text-xs text-slate-400 font-mono">{(selectedFile.size / 1024).toFixed(1)} KB</p>

              <div className="pt-2 flex items-center gap-3 justify-center">
                <label className="text-xs text-slate-400 underline cursor-pointer hover:text-emerald-400">
                  Change File
                  <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileSelect} className="hidden" />
                </label>

                <button
                  onClick={handleConfirmUpload}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  Confirm & Process Template
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-slate-200">Drag & drop your Excel/CSV template file here</h3>
              <p className="text-xs text-slate-400">Supports .xlsx, .xls, and .csv files up to 25MB</p>
              
              <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold cursor-pointer border border-slate-700 transition-colors mt-2">
                Browse User Template File
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
