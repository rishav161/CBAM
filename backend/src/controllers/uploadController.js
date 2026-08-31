import XLSX from 'xlsx';
import prisma from '../config/database.js';
import path from 'path';

export async function uploadFile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { originalname, filename, path: filePath, size, mimetype } = req.file;

    // Create batch entry in database linked to current authenticated user
    const batch = await prisma.uploadBatch.create({
      data: {
        userId: req.user.id,
        fileName: filename,
        originalName: originalname,
        filePath,
        fileSize: size,
        mimeType: mimetype,
        status: 'UPLOADED',
      },
    });

    // Parse workbook using SheetJS
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const rawRows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const datasetEntries = [];
    for (const row of rawRows) {
      const cnCode = row['CN Code'] || row['cnCode'] || row['CN_CODE'] || '7207 11 11';
      const goodsDescription = row['Goods Description'] || row['description'] || row['Goods'] || null;
      const countryOfOrigin = row['Country of Origin'] || row['country'] || row['Origin'] || 'IN';
      const installationName = row['Installation Name'] || row['facility'] || row['Installation'] || null;
      const productionQuantity = parseFloat(row['Quantity (tonnes)'] || row['quantity'] || row['Production'] || 100);
      const directEmissions = row['Direct Emissions (tCO2e/t)'] !== undefined ? parseFloat(row['Direct Emissions (tCO2e/t)']) : null;
      const indirectEmissions = row['Indirect Emissions (tCO2e/t)'] !== undefined ? parseFloat(row['Indirect Emissions (tCO2e/t)']) : null;

      const validationErrors = [];
      if (!cnCode) validationErrors.push('Missing CN Code');
      if (!productionQuantity || isNaN(productionQuantity)) validationErrors.push('Invalid or missing production quantity');

      datasetEntries.push({
        batchId: batch.id,
        cnCode: String(cnCode).trim(),
        goodsDescription: goodsDescription ? String(goodsDescription).trim() : null,
        countryOfOrigin: String(countryOfOrigin).trim(),
        installationName: installationName ? String(installationName).trim() : null,
        productionQuantity,
        quantityUnit: 'tonne',
        directEmissions: directEmissions !== null && !isNaN(directEmissions) ? directEmissions : null,
        indirectEmissions: indirectEmissions !== null && !isNaN(indirectEmissions) ? indirectEmissions : null,
        isValid: validationErrors.length === 0,
        validationErrors,
      });
    }

    if (datasetEntries.length > 0) {
      await prisma.clientDataset.createMany({
        data: datasetEntries,
      });
    }

    // Update batch status
    const updatedBatch = await prisma.uploadBatch.update({
      where: { id: batch.id },
      data: { status: 'VALIDATED' },
      include: {
        datasets: true,
      },
    });

    res.status(201).json({
      message: 'File uploaded and dataset extracted successfully',
      batch: updatedBatch,
      rowCount: datasetEntries.length,
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'Failed to process uploaded file' });
  }
}

export async function listBatches(req, res) {
  try {
    const whereClause = req.user.role === 'SUPER_ADMIN' ? {} : { userId: req.user.id };

    const batches = await prisma.uploadBatch.findMany({
      where: whereClause,
      include: {
        user: {
          select: { id: true, name: true, email: true, company: true },
        },
        results: true,
        _count: {
          select: { datasets: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ batches });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve uploaded batches' });
  }
}

export async function getBatchDetails(req, res) {
  try {
    const { id } = req.params;

    const batch = await prisma.uploadBatch.findUnique({
      where: { id },
      include: {
        datasets: true,
        results: true,
        user: { select: { id: true, name: true, email: true, company: true } },
      },
    });

    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }

    // Scoping: Customers can only access their own batch
    if (req.user.role !== 'SUPER_ADMIN' && batch.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied to this dataset batch' });
    }

    res.status(200).json({ batch });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch batch details' });
  }
}

export async function downloadSampleTemplate(req, res) {
  try {
    const sampleData = [
      {
        'CN Code': '7207 11 11',
        'Goods Description': 'Non-alloy steel billets',
        'Country of Origin': 'India',
        'Installation Name': 'Tata Steel Works',
        'Quantity (tonnes)': 1500,
        'Direct Emissions (tCO2e/t)': 1.35,
        'Indirect Emissions (tCO2e/t)': 0.29,
      },
      {
        'CN Code': '7601 10 00',
        'Goods Description': 'Unwrought primary aluminum',
        'Country of Origin': 'India',
        'Installation Name': 'Hindalco Smelter',
        'Quantity (tonnes)': 800,
        'Direct Emissions (tCO2e/t)': 1.58,
        'Indirect Emissions (tCO2e/t)': 6.90,
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'CBAM Template');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="CBAM_Sample_Template.xlsx"');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate sample template' });
  }
}
