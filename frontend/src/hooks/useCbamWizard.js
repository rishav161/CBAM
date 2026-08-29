import { useState } from 'react';

// System Benchmark Reference Rules (Target Column + Multiplier Factor)
export const DEFAULT_BENCHMARK_FACTORS = [
  {
    cnCode: '72011011',
    category: 'Iron & Steel',
    targetColumn: 'quantityTonnes', // Weight / Volume column to multiply
    targetColumnLabel: 'Weight / Quantity (Tonnes)',
    benchmarkDirectFactor: 0.65, // Multiplier
    outputColumnLabel: 'Direct Scope 1 (tCO2e)',
    description: 'Multiplies Weight column by 0.65 for all cells',
  },
  {
    cnCode: '76011000',
    category: 'Aluminum',
    targetColumn: 'quantityTonnes',
    targetColumnLabel: 'Weight / Quantity (Tonnes)',
    benchmarkDirectFactor: 0.53,
    outputColumnLabel: 'Direct Scope 1 (tCO2e)',
    description: 'Multiplies Weight column by 0.53 for all cells',
  },
  {
    cnCode: '72041000',
    category: 'Iron & Steel',
    targetColumn: 'quantityTonnes',
    targetColumnLabel: 'Weight / Quantity (Tonnes)',
    benchmarkDirectFactor: 0.42,
    outputColumnLabel: 'Direct Scope 1 (tCO2e)',
    description: 'Multiplies Weight column by 0.42 for all cells',
  },
  {
    cnCode: '76041010',
    category: 'Aluminum',
    targetColumn: 'quantityTonnes',
    targetColumnLabel: 'Weight / Quantity (Tonnes)',
    benchmarkDirectFactor: 0.61,
    outputColumnLabel: 'Direct Scope 1 (tCO2e)',
    description: 'Multiplies Weight column by 0.61 for all cells',
  },
];

export const DEFAULT_GRID_FACTORS = {
  India: 0.71,
  Turkey: 0.44,
  China: 0.62,
  Germany: 0.35,
};

const INITIAL_UPLOAD_BATCHES = [
  {
    id: 'batch-001',
    fileName: 'Client_Steel_Imports_Q1.xlsx',
    uploadedAt: '2026-08-26 19:30',
    rowCount: 4,
    status: 'Ready',
    dataset: [
      { id: 1, cnCode: '72011011', productName: 'Pig Iron Billets A', quantityTonnes: 12500, electricityMWh: 450, countryOfOrigin: 'India' },
      { id: 2, cnCode: '76011000', productName: 'Aluminum Extrusions B', quantityTonnes: 8200, electricityMWh: 920, countryOfOrigin: 'Turkey' },
      { id: 3, cnCode: '72041000', productName: 'Steel Scrap Line C', quantityTonnes: 4200, electricityMWh: 120, countryOfOrigin: 'India' },
      { id: 4, cnCode: '76041010', productName: 'Aluminum Rods D', quantityTonnes: 3100, electricityMWh: 310, countryOfOrigin: 'China' },
    ],
  },
  {
    id: 'batch-002',
    fileName: 'Supplier_Aluminum_Batch_Feb.csv',
    uploadedAt: '2026-08-26 18:15',
    rowCount: 3,
    status: 'Ready',
    dataset: [
      { id: 101, cnCode: '76011000', productName: 'High Purity Ingot Batch 1', quantityTonnes: 6400, electricityMWh: 710, countryOfOrigin: 'Turkey' },
      { id: 102, cnCode: '76041010', productName: 'Alloy Rods Section 4', quantityTonnes: 2900, electricityMWh: 340, countryOfOrigin: 'Germany' },
      { id: 103, cnCode: '72011011', productName: 'Industrial Pig Iron Grade 2', quantityTonnes: 9100, electricityMWh: 520, countryOfOrigin: 'India' },
    ],
  },
];

export function useCbamWizard() {
  const [benchmarkFactors, setBenchmarkFactors] = useState(DEFAULT_BENCHMARK_FACTORS);
  const [gridFactors, setGridFactors] = useState(DEFAULT_GRID_FACTORS);
  
  const [uploadedBatches, setUploadedBatches] = useState(INITIAL_UPLOAD_BATCHES);
  const [selectedBatchId, setSelectedBatchId] = useState('batch-001');

  const activeBatch = uploadedBatches.find((b) => b.id === selectedBatchId) || uploadedBatches[0];
  const userDataset = activeBatch ? activeBatch.dataset : [];

  const [calculatedDataset, setCalculatedDataset] = useState([]);

  // Benchmark Factors Management functions
  const updateBenchmarkFactor = (cnCode, newValues) => {
    setBenchmarkFactors((prev) =>
      prev.map((factor) => (factor.cnCode === cnCode ? { ...factor, ...newValues } : factor))
    );
  };

  const addBenchmarkFactor = (newFactor) => {
    setBenchmarkFactors((prev) => [newFactor, ...prev]);
  };

  const uploadBenchmarkCsv = (file) => {
    const simulatedFactors = [
      { cnCode: '72011011', category: 'Iron & Steel', targetColumn: 'quantityTonnes', targetColumnLabel: 'Weight / Quantity (Tonnes)', benchmarkDirectFactor: 0.68, outputColumnLabel: 'Direct Scope 1 (tCO2e)', description: 'Multiplies Weight by 0.68' },
      { cnCode: '76011000', category: 'Aluminum', targetColumn: 'quantityTonnes', targetColumnLabel: 'Weight / Quantity (Tonnes)', benchmarkDirectFactor: 0.55, outputColumnLabel: 'Direct Scope 1 (tCO2e)', description: 'Multiplies Weight by 0.55' },
      { cnCode: '72041000', category: 'Iron & Steel', targetColumn: 'quantityTonnes', targetColumnLabel: 'Weight / Quantity (Tonnes)', benchmarkDirectFactor: 0.45, outputColumnLabel: 'Direct Scope 1 (tCO2e)', description: 'Multiplies Weight by 0.45' },
      { cnCode: '76041010', category: 'Aluminum', targetColumn: 'quantityTonnes', targetColumnLabel: 'Weight / Quantity (Tonnes)', benchmarkDirectFactor: 0.63, outputColumnLabel: 'Direct Scope 1 (tCO2e)', description: 'Multiplies Weight by 0.63' },
    ];
    setBenchmarkFactors(simulatedFactors);
  };

  const addUploadedBatch = (file) => {
    const newBatch = {
      id: `batch-${Date.now()}`,
      fileName: file.name,
      uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      rowCount: 3,
      status: 'Ready',
      dataset: [
        { id: Date.now() + 1, cnCode: '72011011', productName: `${file.name.replace(/\.[^/.]+$/, "")} Line 1`, quantityTonnes: 15000, electricityMWh: 500, countryOfOrigin: 'India' },
        { id: Date.now() + 2, cnCode: '76011000', productName: `${file.name.replace(/\.[^/.]+$/, "")} Line 2`, quantityTonnes: 9800, electricityMWh: 820, countryOfOrigin: 'Turkey' },
        { id: Date.now() + 3, cnCode: '76041010', productName: `${file.name.replace(/\.[^/.]+$/, "")} Line 3`, quantityTonnes: 4500, electricityMWh: 390, countryOfOrigin: 'China' },
      ],
    };

    setUploadedBatches((prev) => [newBatch, ...prev]);
    setSelectedBatchId(newBatch.id);
    return newBatch.id;
  };

  const selectBatch = (batchId) => {
    setSelectedBatchId(batchId);
  };

  // Whole-column multiplication logic across all cells of the specified target column (Weight/Quantity)
  const runWholeColumnCalculation = () => {
    const computed = userDataset.map((row) => {
      const benchmark = benchmarkFactors.find((b) => b.cnCode === row.cnCode) || { benchmarkDirectFactor: 0.5, targetColumn: 'quantityTonnes' };
      const gridFactor = gridFactors[row.countryOfOrigin] || 0.5;

      // Extract cell value from the specified target column (Weight / Quantity)
      const weightCellValue = parseFloat(row[benchmark.targetColumn] || row.quantityTonnes || 0);

      // Perform column-wide cell multiplication: Cell Value x Multiplier Factor
      const directEmissions = parseFloat((weightCellValue * benchmark.benchmarkDirectFactor).toFixed(2));
      const indirectEmissions = parseFloat((row.electricityMWh * gridFactor).toFixed(2));
      const totalEmissions = parseFloat((directEmissions + indirectEmissions).toFixed(2));
      const specificEmissionsPerTonne = weightCellValue > 0 ? parseFloat((totalEmissions / weightCellValue).toFixed(4)) : 0;

      return {
        ...row,
        weightCellValue,
        targetColumnName: benchmark.targetColumnLabel || 'Weight',
        benchmarkDirectFactor: benchmark.benchmarkDirectFactor,
        gridFactorUsed: gridFactor,
        directEmissions,
        indirectEmissions,
        totalEmissions,
        specificEmissionsPerTonne,
      };
    });

    setCalculatedDataset(computed);
  };

  return {
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
  };
}

export default useCbamWizard;
