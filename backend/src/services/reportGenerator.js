import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, HeadingLevel } from 'docx';
import prisma from '../config/database.js';
import path from 'path';
import fs from 'fs';

export async function generateWordReport(batchId) {
  const batch = await prisma.uploadBatch.findUnique({
    where: { id: batchId },
    include: {
      user: true,
      datasets: true,
      results: true,
    },
  });

  if (!batch || !batch.results) {
    throw new Error('Batch or calculation results not found');
  }

  const reportDir = process.env.REPORT_DIR || './reports';
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const reportFileName = `CBAM_Report_${batch.id.slice(0, 8)}_${Date.now()}.docx`;
  const reportPath = path.join(reportDir, reportFileName);

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: 'EU Carbon Border Adjustment Mechanism (CBAM)',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Official Embedded Emissions Compliance Report',
                bold: true,
                size: 32,
                color: '10B981',
              }),
            ],
            spacing: { after: 300 },
          }),

          // Metadata Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Batch ID:', bold: true })] }),
                  new TableCell({ children: [new Paragraph(batch.id)] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Client Name:', bold: true })] }),
                  new TableCell({ children: [new Paragraph(batch.user.name)] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Company:', bold: true })] }),
                  new TableCell({ children: [new Paragraph(batch.user.company || 'N/A')] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Date Generated:', bold: true })] }),
                  new TableCell({ children: [new Paragraph(new Date().toLocaleDateString())] }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: '', spacing: { after: 300 } }),

          // Executive Summary Section
          new Paragraph({
            text: 'Executive Summary of Emissions',
            heading: HeadingLevel.HEADING_3,
            spacing: { after: 200 },
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Metric', bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Value', bold: true })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Total Goods Production Volume')] }),
                  new TableCell({ children: [new Paragraph(`${batch.results.totalProductionQuantity.toFixed(2)} tonnes`)] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Total Direct Embedded Emissions (Scope 1)')] }),
                  new TableCell({ children: [new Paragraph(`${batch.results.totalDirectEmissions.toFixed(2)} tCO2e`)] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Total Indirect Embedded Emissions (Scope 2)')] }),
                  new TableCell({ children: [new Paragraph(`${batch.results.totalIndirectEmissions.toFixed(2)} tCO2e`)] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Total Embedded Emissions', bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: `${batch.results.totalEmbeddedEmissions.toFixed(2)} tCO2e`, bold: true, color: '10B981' })] }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: '', spacing: { after: 400 } }),

          // Goods Line Items Breakdown Table
          new Paragraph({
            text: 'Goods Line Item Emissions Breakdown',
            heading: HeadingLevel.HEADING_3,
            spacing: { after: 200 },
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'CN Code', bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Description', bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Origin', bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Quantity (t)', bold: true })] }),
                ],
              }),
              ...batch.datasets.map(
                (item) =>
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph(item.cnCode)] }),
                      new TableCell({ children: [new Paragraph(item.goodsDescription || 'CBAM Goods')] }),
                      new TableCell({ children: [new Paragraph(item.countryOfOrigin)] }),
                      new TableCell({ children: [new Paragraph(item.productionQuantity.toString())] }),
                    ],
                  })
              ),
            ],
          }),

          new Paragraph({ text: '', spacing: { after: 400 } }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'Compliance Note: ',
                bold: true,
                size: 18,
              }),
              new TextRun({
                text: 'Calculations adhere to EU Regulation 2023/956 on the Carbon Border Adjustment Mechanism.',
                size: 18,
                italics: true,
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(reportPath, buffer);

  // Update CalculationResult reportPath
  await prisma.calculationResult.update({
    where: { batchId },
    data: { reportPath },
  });

  await prisma.uploadBatch.update({
    where: { id: batchId },
    data: { status: 'COMPLETED' },
  });

  return reportPath;
}
