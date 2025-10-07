import { Router } from 'express';
import { getAllHostingSlots, createHostingSlot, deleteHostingSlot } from '../controllers/hostingSlotsController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', getAllHostingSlots);
router.post('/', authenticateToken, createHostingSlot);
router.delete('/:id', authenticateToken, deleteHostingSlot);

export default router;
