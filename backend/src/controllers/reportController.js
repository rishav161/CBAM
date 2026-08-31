import prisma from '../config/database.js';
import { calculateBatchEmissions } from '../services/cbamCalculator.js';
import { generateWordReport } from '../services/reportGenerator.js';
import path from 'path';
import fs from 'fs';

export async function triggerCalculation(req, res) {
  try {
    const { batchId } = req.params;

    const batch = await prisma.uploadBatch.findUnique({
      where: { id: batchId },
    });

    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }

    if (req.user.role !== 'SUPER_ADMIN' && batch.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied to this batch' });
    }

    // Execute emissions calculation
    const calcResult = await calculateBatchEmissions(batchId);

    // Generate Word report
    const reportPath = await generateWordReport(batchId);

    res.status(200).json({
      message: 'CBAM emissions calculated and Word report generated successfully',
      result: calcResult,
      reportPath,
    });
  } catch (error) {
    console.error('Calculation error:', error);
    res.status(500).json({ error: 'Failed to calculate CBAM emissions' });
  }
}

export async function downloadReport(req, res) {
  try {
    const { batchId } = req.params;

    const batch = await prisma.uploadBatch.findUnique({
      where: { id: batchId },
      include: { results: true },
    });

    if (!batch || !batch.results || !batch.results.reportPath) {
      return res.status(404).json({ error: 'Report not generated yet for this batch' });
    }

    if (req.user.role !== 'SUPER_ADMIN' && batch.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied to this report' });
    }

    const filePath = path.resolve(batch.results.reportPath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Report file missing from server storage' });
    }

    res.download(filePath, `CBAM_Report_${batchId.slice(0, 8)}.docx`);
  } catch (error) {
    res.status(500).json({ error: 'Failed to download report' });
  }
}
