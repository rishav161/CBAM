import express from 'express';
import {
  listBenchmarkFactors,
  updateBenchmarkFactor,
  addBenchmarkFactor,
  uploadBenchmarkExcel,
} from '../controllers/benchmarkController.js';
import { authenticateToken, requireRole } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Require authentication for all benchmark endpoints
router.use(authenticateToken);

// Read-only list: Accessible by both CUSTOMER and SUPER_ADMIN
router.get('/', listBenchmarkFactors);

// Modifying operations: Strictly SUPER_ADMIN only
router.post('/', requireRole('SUPER_ADMIN'), addBenchmarkFactor);
router.put('/:id', requireRole('SUPER_ADMIN'), updateBenchmarkFactor);
router.post('/upload', requireRole('SUPER_ADMIN'), upload.single('file'), uploadBenchmarkExcel);

export default router;
