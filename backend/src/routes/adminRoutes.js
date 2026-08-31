import express from 'express';
import { createCustomerUser, listUsers, toggleUserStatus } from '../controllers/adminController.js';
import { authenticateToken, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All admin routes require valid JWT token AND SUPER_ADMIN role
router.use(authenticateToken, requireRole('SUPER_ADMIN'));

router.post('/users', createCustomerUser);
router.get('/users', listUsers);
router.patch('/users/:id/status', toggleUserStatus);

export default router;
