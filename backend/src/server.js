import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import benchmarkRoutes from './routes/benchmarkRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import { connectDatabase } from './config/database.js';
import { seedSuperAdmin } from './services/seedSuperAdmin.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// HTTP Request Logger Middleware
app.use((req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? '❌' : '⚡';
    console.log(`${statusColor} [${timestamp}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });

  next();
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads / reports directories
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/reports', express.static(path.join(__dirname, '../reports')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/benchmarks', benchmarkRoutes);
app.use('/api/reports', reportRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'CBAM Backend API',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  });
});

// Start Server, Test DB Connection, and Seed Superadmin
app.listen(PORT, async () => {
  console.log(`============================================================`);
  console.log(`🚀 CBAM Backend Server running on http://localhost:${PORT}`);
  console.log(`============================================================`);
  
  // Test Database Connection
  await connectDatabase();
  
  // Auto-seed Superadmin & default benchmarks
  await seedSuperAdmin();
});

export default app;
