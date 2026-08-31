import React, { useState } from 'react';
import { Database, Plus, Edit2, Upload, Search, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '../../providers/AuthProvider.jsx';
import {
  useBenchmarkFactorsQuery,
  useUpdateBenchmarkMutation,
  useAddBenchmarkMutation,
  useUploadBenchmarkExcelMutation,
} from '../../hooks/useBenchmarkQueries.js';

export function BenchmarkFactorsView() {
  const { isSuperAdmin } = useAuth();
  const { data: benchmarkFactors = [], isLoading, isError } = useBenchmarkFactorsQuery();

  const updateMutation = useUpdateBenchmarkMutation();
  const addMutation = useAddBenchmarkMutation();
  const uploadExcelMutation = useUploadBenchmarkExcelMutation();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editDirect, setEditDirect] = useState('');
  const [editIndirect, setEditIndirect] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCnCode, setNewCnCode] = useState('');
  const [newSector, setNewSector] = useState('');
  const [newGoodsName, setNewGoodsName] = useState('');
  const [newDirect, setNewDirect] = useState('');
  const [newIndirect, setNewIndirect] = useState('');

  const filteredFactors = benchmarkFactors.filter(
    (f) =>
      f.cnCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.goodsName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartEdit = (factor) => {
    if (!isSuperAdmin) return;
    setEditingId(factor.id);
    setEditDirect(factor.directBenchmark);
    setEditIndirect(factor.indirectBenchmark);
  };

  const handleSaveEdit = (id) => {
    updateMutation.mutate({
      id,
      directBenchmark: parseFloat(editDirect),
      indirectBenchmark: parseFloat(editIndirect),
    });
    setEditingId(null);
  };

  const handleAddFactorSubmit = (e) => {
    e.preventDefault();
    addMutation.mutate(
      {
        cnCode: newCnCode,
        sector: newSector,
        goodsName: newGoodsName,
        directBenchmark: parseFloat(newDirect),
        indirectBenchmark: parseFloat(newIndirect || 0),
      },
      {
        onSuccess: () => {
          setIsAddModalOpen(false);
          setNewCnCode('');
          setNewSector('');
          setNewGoodsName('');
          setNewDirect('');
          setNewIndirect('');
        },
      }
    );
  };

  const handleExcelUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      uploadExcelMutation.mutate(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Database className="w-6 h-6 text-emerald-500" /> EU Benchmark Default Factors
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Reference default specific emission intensity values (tCO2e / tonne) defined by EU Regulation 2023/956.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isSuperAdmin && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold border border-slate-200 dark:border-slate-700">
              <Lock className="w-3.5 h-3.5 text-amber-500" /> View Only (Superadmin Edits)
            </span>
          )}

          {isSuperAdmin && (
            <>
              <label className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all">
                <Upload className="w-4 h-4 text-emerald-500" />
                <span>Upload Excel Benchmarks</span>
                <input type="file" accept=".xlsx,.xls,.csv" onChange={handleExcelUpload} className="hidden" />
              </label>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Benchmark
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by CN Code, Goods Description, or Sector (e.g. Steel, 7207, Aluminum)..."
          className="w-full bg-transparent text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
        />
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading benchmark database...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <th className="p-4">CN Code</th>
                  <th className="p-4">Sector</th>
                  <th className="p-4">Goods Name</th>
                  <th className="p-4 text-right">Direct Factor (tCO2e/t)</th>
                  <th className="p-4 text-right">Indirect Factor (tCO2e/t)</th>
                  {isSuperAdmin && <th className="p-4 text-right">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs text-slate-700 dark:text-slate-200">
                {filteredFactors.map((factor) => (
                  <tr key={factor.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">{factor.cnCode}</td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">{factor.sector}</td>
                    <td className="p-4 font-medium">{factor.goodsName}</td>

                    <td className="p-4 text-right font-mono font-bold">
                      {editingId === factor.id ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editDirect}
                          onChange={(e) => setEditDirect(e.target.value)}
                          className="w-20 px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-emerald-500 rounded text-right text-xs"
                        />
                      ) : (
                        `${factor.directBenchmark} tCO2e/t`
                      )}
                    </td>

                    <td className="p-4 text-right font-mono font-bold text-cyan-600 dark:text-cyan-400">
                      {editingId === factor.id ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editIndirect}
                          onChange={(e) => setEditIndirect(e.target.value)}
                          className="w-20 px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-cyan-500 rounded text-right text-xs"
                        />
                      ) : (
                        `${factor.indirectBenchmark} tCO2e/t`
                      )}
                    </td>

                    {isSuperAdmin && (
                      <td className="p-4 text-right">
                        {editingId === factor.id ? (
                          <button
                            onClick={() => handleSaveEdit(factor.id)}
                            className="px-3 py-1 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStartEdit(factor)}
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-emerald-500 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Factor Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Add EU Benchmark Default Factor</h3>

            <form onSubmit={handleAddFactorSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">CN Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 7207 11 11"
                  value={newCnCode}
                  onChange={(e) => setNewCnCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Sector *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Iron & Steel"
                  value={newSector}
                  onChange={(e) => setNewSector(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Goods Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Non-alloy steel semi-finished products"
                  value={newGoodsName}
                  onChange={(e) => setNewGoodsName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Direct Factor *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="1.32"
                    value={newDirect}
                    onChange={(e) => setNewDirect(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Indirect Factor</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.28"
                    value={newIndirect}
                    onChange={(e) => setNewIndirect(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addMutation.isPending}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs"
                >
                  Save Benchmark
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BenchmarkFactorsView;
