import React, { useState } from 'react';
import { Database, UploadCloud, Plus, Edit2, Check, Save, FileSpreadsheet, Calculator } from 'lucide-react';

export function BenchmarkFactorsView({
  benchmarkFactors,
  onUpdateBenchmarkFactor,
  onAddBenchmarkFactor,
  onUploadBenchmarkCsv,
}) {
  const [editingCnCode, setEditingCnCode] = useState(null);
  const [editFactorValue, setEditFactorValue] = useState('');
  const [editTargetColumn, setEditTargetColumn] = useState('quantityTonnes');

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCnCode, setNewCnCode] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newFactorValue, setNewFactorValue] = useState('');
  const [newTargetColumn, setNewTargetColumn] = useState('quantityTonnes');

  const [csvFile, setCsvFile] = useState(null);

  const handleStartEdit = (factor) => {
    setEditingCnCode(factor.cnCode);
    setEditFactorValue(factor.benchmarkDirectFactor);
    setEditTargetColumn(factor.targetColumn || 'quantityTonnes');
  };

  const handleSaveEdit = (cnCode) => {
    if (onUpdateBenchmarkFactor) {
      onUpdateBenchmarkFactor(cnCode, {
        benchmarkDirectFactor: parseFloat(editFactorValue),
        targetColumn: editTargetColumn,
        targetColumnLabel: editTargetColumn === 'quantityTonnes' ? 'Weight / Quantity (Tonnes)' : 'Electricity (MWh)',
      });
    }
    setEditingCnCode(null);
  };

  const handleCreateFactor = (e) => {
    e.preventDefault();
    if (!newCnCode || !newCategory || !newFactorValue) return;

    if (onAddBenchmarkFactor) {
      onAddBenchmarkFactor({
        cnCode: newCnCode,
        category: newCategory,
        description: newDescription || 'Custom Reference Rule',
        targetColumn: newTargetColumn,
        targetColumnLabel: newTargetColumn === 'quantityTonnes' ? 'Weight / Quantity (Tonnes)' : 'Electricity (MWh)',
        benchmarkDirectFactor: parseFloat(newFactorValue),
        outputColumnLabel: 'Direct Scope 1 (tCO2e)',
      });
    }

    setNewCnCode('');
    setNewCategory('');
    setNewDescription('');
    setNewFactorValue('');
    setIsAddingNew(false);
  };

  const handleCsvUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCsvFile(file);
      if (onUploadBenchmarkCsv) {
        onUploadBenchmarkCsv(file);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Database className="w-6 h-6 text-emerald-400" /> Benchmark Factor & Multiplier Rules
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Specify fixed reference column multiplication rules. The engine multiplies every cell in the selected Weight column by the multiplier factor.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <label className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors">
            <UploadCloud className="w-4 h-4 text-emerald-400" />
            Upload Benchmark CSV
            <input type="file" accept=".csv,.xlsx" onChange={handleCsvUpload} className="hidden" />
          </label>

          <button
            onClick={() => setIsAddingNew(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Benchmark Rule
          </button>
        </div>
      </div>

      {/* Formula Explanation Card */}
      <div className="bg-slate-900/60 border border-emerald-500/30 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-100">Whole-Column Cell Multiplication Rule</h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Target Output Cell = (Cell Value in Target Weight Column) × (Benchmark Multiplier Factor)
          </p>
        </div>
      </div>

      {/* Benchmark Factors Data Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Benchmark Factor & Column Multiplier Table ({benchmarkFactors.length} Rules)</span>
          </div>
          <span className="text-xs text-slate-400">Click "Edit Rule" to change target column or multiplier</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-950 text-slate-400 text-xs font-semibold border-b border-slate-800">
                <th className="p-4">CN Code</th>
                <th className="p-4">Category Sector</th>
                <th className="p-4">Target Column to Multiply</th>
                <th className="p-4 text-right">Multiplier Factor</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs text-slate-200">
              {benchmarkFactors.map((factor) => {
                const isEditing = editingCnCode === factor.cnCode;
                return (
                  <tr key={factor.cnCode} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono text-emerald-400 font-bold">{factor.cnCode}</td>
                    <td className="p-4 font-semibold text-slate-100">{factor.category}</td>

                    {/* Target Column Selection */}
                    <td className="p-4">
                      {isEditing ? (
                        <select
                          value={editTargetColumn}
                          onChange={(e) => setEditTargetColumn(e.target.value)}
                          className="bg-slate-950 border border-emerald-500 rounded-lg px-2 py-1 text-xs text-emerald-400 font-medium focus:outline-none"
                        >
                          <option value="quantityTonnes">Weight / Quantity (Tonnes)</option>
                          <option value="electricityMWh">Electricity (MWh)</option>
                        </select>
                      ) : (
                        <span className="text-slate-300 bg-slate-800 px-2.5 py-1 rounded-md font-mono">
                          {factor.targetColumnLabel || 'Weight / Quantity (Tonnes)'}
                        </span>
                      )}
                    </td>

                    {/* Multiplier Factor */}
                    <td className="p-4 text-right font-mono">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editFactorValue}
                          onChange={(e) => setEditFactorValue(e.target.value)}
                          className="w-24 bg-slate-950 border border-emerald-500 rounded-lg px-2 py-1 text-right font-mono text-emerald-400 font-bold focus:outline-none"
                        />
                      ) : (
                        <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                          × {factor.benchmarkDirectFactor}
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      {isEditing ? (
                        <button
                          onClick={() => handleSaveEdit(factor.cnCode)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1 shadow-md transition-all cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" /> Save Rule
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(factor)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold inline-flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-emerald-400" /> Edit Rule
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BenchmarkFactorsView;
