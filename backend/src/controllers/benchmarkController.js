import prisma from '../config/database.js';
import XLSX from 'xlsx';

export async function listBenchmarkFactors(req, res) {
  try {
    const factors = await prisma.benchmarkFactor.findMany({
      orderBy: { sector: 'asc' },
    });
    res.status(200).json({ factors });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch benchmark factors' });
  }
}

export async function updateBenchmarkFactor(req, res) {
  try {
    const { id } = req.params;
    const { directBenchmark, indirectBenchmark, goodsName, sector } = req.body;

    const existing = await prisma.benchmarkFactor.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Benchmark factor not found' });
    }

    const updated = await prisma.benchmarkFactor.update({
      where: { id },
      data: {
        directBenchmark: directBenchmark !== undefined ? parseFloat(directBenchmark) : existing.directBenchmark,
        indirectBenchmark: indirectBenchmark !== undefined ? parseFloat(indirectBenchmark) : existing.indirectBenchmark,
        goodsName: goodsName || existing.goodsName,
        sector: sector || existing.sector,
        updatedBy: req.user.id,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'UPDATE_BENCHMARK_FACTOR',
        details: `Updated CN Code ${updated.cnCode} benchmarks: Direct=${updated.directBenchmark}, Indirect=${updated.indirectBenchmark}`,
      },
    });

    res.status(200).json({ message: 'Benchmark factor updated', factor: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update benchmark factor' });
  }
}

export async function addBenchmarkFactor(req, res) {
  try {
    const { cnCode, sector, goodsName, directBenchmark, indirectBenchmark } = req.body;

    if (!cnCode || !sector || !goodsName || directBenchmark === undefined) {
      return res.status(400).json({ error: 'CN Code, Sector, Goods Name, and Direct Benchmark are required' });
    }

    const newFactor = await prisma.benchmarkFactor.create({
      data: {
        cnCode: cnCode.trim(),
        sector: sector.trim(),
        goodsName: goodsName.trim(),
        directBenchmark: parseFloat(directBenchmark),
        indirectBenchmark: parseFloat(indirectBenchmark || 0),
        updatedBy: req.user.id,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'ADD_BENCHMARK_FACTOR',
        details: `Added new benchmark factor for CN Code ${newFactor.cnCode}`,
      },
    });

    res.status(201).json({ message: 'Benchmark factor added', factor: newFactor });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Benchmark factor for this CN Code already exists' });
    }
    res.status(500).json({ error: 'Failed to add benchmark factor' });
  }
}

export async function uploadBenchmarkExcel(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No Excel file uploaded' });
    }

    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    let count = 0;
    for (const row of sheetData) {
      const cnCode = row['CN Code'] || row['cnCode'] || row['CN_CODE'];
      const sector = row['Sector'] || row['sector'] || 'General';
      const goodsName = row['Goods Name'] || row['goodsName'] || row['Description'] || 'CBAM Goods';
      const directBenchmark = row['Direct Benchmark'] || row['directBenchmark'] || row['Direct'];
      const indirectBenchmark = row['Indirect Benchmark'] || row['indirectBenchmark'] || row['Indirect'] || 0;

      if (cnCode && directBenchmark !== undefined) {
        await prisma.benchmarkFactor.upsert({
          where: { cnCode: String(cnCode).trim() },
          update: {
            sector: String(sector).trim(),
            goodsName: String(goodsName).trim(),
            directBenchmark: parseFloat(directBenchmark),
            indirectBenchmark: parseFloat(indirectBenchmark),
            updatedBy: req.user.id,
          },
          create: {
            cnCode: String(cnCode).trim(),
            sector: String(sector).trim(),
            goodsName: String(goodsName).trim(),
            directBenchmark: parseFloat(directBenchmark),
            indirectBenchmark: parseFloat(indirectBenchmark),
            updatedBy: req.user.id,
          },
        });
        count++;
      }
    }

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'UPLOAD_BENCHMARK_EXCEL',
        details: `Uploaded benchmark Excel sheet, updated ${count} records`,
      },
    });

    res.status(200).json({ message: `Successfully imported ${count} benchmark factors` });
  } catch (error) {
    console.error('Benchmark Excel upload error:', error);
    res.status(500).json({ error: 'Failed to process benchmark Excel file' });
  }
}
