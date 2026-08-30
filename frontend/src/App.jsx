import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SidebarNavigation from './components/common/SidebarNavigation.jsx';
import UploadFlowView from './components/views/UploadFlowView.jsx';
import UploadedListsView from './components/views/UploadedListsView.jsx';
import DatasetDetailsView from './components/views/DatasetDetailsView.jsx';
import BenchmarkFactorsView from './components/views/BenchmarkFactorsView.jsx';
import { useCbamWizard } from './hooks/useCbamWizard.js';

export default function App() {
  const {
    benchmarkFactors,
    updateBenchmarkFactor,
    addBenchmarkFactor,
    uploadBenchmarkCsv,
    uploadedBatches,
    selectedBatchId,
    activeBatch,
    userDataset,
    addUploadedBatch,
    selectBatch,
    calculatedDataset,
    runWholeColumnCalculation,
  } = useCbamWizard();

  return (
    <BrowserRouter>
      <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased transition-colors duration-200">
        {/* Sidebar Navigation */}
        <SidebarNavigation
          batchCount={uploadedBatches.length}
          factorCount={benchmarkFactors.length}
        />

        {/* Main Content Workspace Router */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<Navigate to="/upload" replace />} />

            <Route
              path="/upload"
              element={
                <UploadFlowView
                  benchmarkFactors={benchmarkFactors}
                  onAddUploadedBatch={addUploadedBatch}
                />
              }
            />

            <Route
              path="/lists"
              element={
                <UploadedListsView
                  uploadedBatches={uploadedBatches}
                  onSelectBatch={selectBatch}
                />
              }
            />

            <Route
              path="/lists/:batchId"
              element={
                <DatasetDetailsView
                  uploadedBatches={uploadedBatches}
                  onSelectBatch={selectBatch}
                  userDataset={userDataset}
                  calculatedDataset={calculatedDataset}
                  onRunCalculation={runWholeColumnCalculation}
                />
              }
            />

            <Route
              path="/benchmarks"
              element={
                <BenchmarkFactorsView
                  benchmarkFactors={benchmarkFactors}
                  onUpdateBenchmarkFactor={updateBenchmarkFactor}
                  onAddBenchmarkFactor={addBenchmarkFactor}
                  onUploadBenchmarkCsv={uploadBenchmarkCsv}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
