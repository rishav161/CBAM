-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "BatchStatus" AS ENUM ('UPLOADED', 'MAPPING_REQUIRED', 'VALIDATED', 'CALCULATED', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT,
    "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "mustChangePassword" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "upload_batches" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "status" "BatchStatus" NOT NULL DEFAULT 'UPLOADED',
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "upload_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_datasets" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "cnCode" TEXT NOT NULL,
    "goodsDescription" TEXT,
    "countryOfOrigin" TEXT NOT NULL,
    "installationName" TEXT,
    "productionQuantity" DOUBLE PRECISION NOT NULL,
    "quantityUnit" TEXT NOT NULL DEFAULT 'tonne',
    "directEmissions" DOUBLE PRECISION,
    "indirectEmissions" DOUBLE PRECISION,
    "electricityConsumed" DOUBLE PRECISION,
    "isValid" BOOLEAN NOT NULL DEFAULT true,
    "validationErrors" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_datasets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "benchmark_factors" (
    "id" TEXT NOT NULL,
    "cnCode" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "goodsName" TEXT NOT NULL,
    "directBenchmark" DOUBLE PRECISION NOT NULL,
    "indirectBenchmark" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'tCO2e/t',
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "benchmark_factors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calculation_results" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "totalProductionQuantity" DOUBLE PRECISION NOT NULL,
    "totalDirectEmissions" DOUBLE PRECISION NOT NULL,
    "totalIndirectEmissions" DOUBLE PRECISION NOT NULL,
    "totalEmbeddedEmissions" DOUBLE PRECISION NOT NULL,
    "reportPath" TEXT,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calculation_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "benchmark_factors_cnCode_key" ON "benchmark_factors"("cnCode");

-- CreateIndex
CREATE UNIQUE INDEX "calculation_results_batchId_key" ON "calculation_results"("batchId");

-- AddForeignKey
ALTER TABLE "upload_batches" ADD CONSTRAINT "upload_batches_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_datasets" ADD CONSTRAINT "client_datasets_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "upload_batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calculation_results" ADD CONSTRAINT "calculation_results_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "upload_batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
