import express from 'express';
import { triggerCalculation, downloadReport } from '../controllers/reportController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/:batchId/calculate', triggerCalculation);
router.get('/:batchId/download', downloadReport);

export default router;
