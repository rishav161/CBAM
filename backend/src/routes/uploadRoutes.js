import express from 'express';
import {
  uploadFile,
  listBatches,
  getBatchDetails,
  downloadSampleTemplate,
} from '../controllers/uploadController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Require JWT authentication for all dataset batch routes
router.use(authenticateToken);

router.post('/', upload.single('file'), uploadFile);
router.get('/batches', listBatches);
router.get('/batches/:id', getBatchDetails);
router.get('/template', downloadSampleTemplate);

export default router;
