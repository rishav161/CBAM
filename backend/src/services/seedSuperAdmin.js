import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';

export async function seedSuperAdmin() {
  try {
    const adminEmail = process.env.SUPER_ADMIN_EMAIL || 'admin@cbam.eu';
    const adminPassword = process.env.SUPER_ADMIN_PASSWORD || 'AdminPass123!';
    const adminName = process.env.SUPER_ADMIN_NAME || 'Super Administrator';

    // Check if Superadmin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: adminName,
          company: 'EU CBAM Administration',
          role: 'SUPER_ADMIN',
          isActive: true,
          mustChangePassword: false,
        },
      });
      console.log(`✅ Superadmin auto-seeded: ${adminEmail}`);
    }

    // Seed default EU benchmark factors if empty
    const factorCount = await prisma.benchmarkFactor.count();
    if (factorCount === 0) {
      await prisma.benchmarkFactor.createMany({
        data: [
          { cnCode: '7207 11 11', sector: 'Iron & Steel', goodsName: 'Non-alloy steel semi-finished products', directBenchmark: 1.32, indirectBenchmark: 0.28 },
          { cnCode: '7208 10 00', sector: 'Iron & Steel', goodsName: 'Flat-rolled products of iron or steel', directBenchmark: 1.45, indirectBenchmark: 0.31 },
          { cnCode: '7601 10 00', sector: 'Aluminum', goodsName: 'Unwrought unwrought aluminum, non-alloyed', directBenchmark: 1.54, indirectBenchmark: 6.85 },
          { cnCode: '7604 10 10', sector: 'Aluminum', goodsName: 'Aluminum bars, rods and profiles', directBenchmark: 1.62, indirectBenchmark: 7.10 },
          { cnCode: '2523 29 00', sector: 'Cement', goodsName: 'Portland cement clinker', directBenchmark: 0.766, indirectBenchmark: 0.08 },
          { cnCode: '3102 10 10', sector: 'Fertilizers', goodsName: 'Urea containing > 45% nitrogen', directBenchmark: 1.25, indirectBenchmark: 0.42 },
          { cnCode: '2804 10 00', sector: 'Hydrogen', goodsName: 'Pure Hydrogen gas', directBenchmark: 8.90, indirectBenchmark: 1.15 }
        ]
      });
      console.log(`✅ Default EU benchmark factors seeded.`);
    }
  } catch (error) {
    console.error('❌ Superadmin seed error:', error.message);
  }
}
