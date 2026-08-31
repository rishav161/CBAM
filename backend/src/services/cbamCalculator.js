import prisma from '../config/database.js';

export async function calculateBatchEmissions(batchId) {
  const batch = await prisma.uploadBatch.findUnique({
    where: { id: batchId },
    include: { datasets: true },
  });

  if (!batch) {
    throw new Error('Batch not found');
  }

  // Fetch benchmark factors dictionary
  const benchmarks = await prisma.benchmarkFactor.findMany();
  const benchmarkMap = new Map();
  benchmarks.forEach((b) => benchmarkMap.set(b.cnCode.trim(), b));

  let totalQuantity = 0;
  let totalDirect = 0;
  let totalIndirect = 0;

  for (const item of batch.datasets) {
    const defaultBenchmark = benchmarkMap.get(item.cnCode.trim());

    const directFactor = item.directEmissions !== null && item.directEmissions !== undefined
      ? item.directEmissions
      : (defaultBenchmark ? defaultBenchmark.directBenchmark : 1.35);

    const indirectFactor = item.indirectEmissions !== null && item.indirectEmissions !== undefined
      ? item.indirectEmissions
      : (defaultBenchmark ? defaultBenchmark.indirectBenchmark : 0.30);

    const itemDirectEmissions = item.productionQuantity * directFactor;
    const itemIndirectEmissions = item.productionQuantity * indirectFactor;

    totalQuantity += item.productionQuantity;
    totalDirect += itemDirectEmissions;
    totalIndirect += itemIndirectEmissions;
  }

  const totalEmbedded = totalDirect + totalIndirect;

  // Upsert calculation summary in database
  const result = await prisma.calculationResult.upsert({
    where: { batchId },
    update: {
      totalProductionQuantity: totalQuantity,
      totalDirectEmissions: totalDirect,
      totalIndirectEmissions: totalIndirect,
      totalEmbeddedEmissions: totalEmbedded,
      calculatedAt: new Date(),
    },
    create: {
      batchId,
      totalProductionQuantity: totalQuantity,
      totalDirectEmissions: totalDirect,
      totalIndirectEmissions: totalIndirect,
      totalEmbeddedEmissions: totalEmbedded,
    },
  });

  // Update batch status to CALCULATED
  await prisma.uploadBatch.update({
    where: { id: batchId },
    data: { status: 'CALCULATED' },
  });

  return result;
}
