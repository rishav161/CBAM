import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['info', 'warn', 'error'],
});

export async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL Database connected successfully (Neon Cloud)');
  } catch (error) {
    console.error('❌ PostgreSQL Database connection failed:', error.message);
  }
}

export default prisma;
