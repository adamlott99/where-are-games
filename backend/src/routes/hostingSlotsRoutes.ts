import { Router } from 'express';
import { getAllHostingSlots, createHostingSlot, updateHostingSlot, deleteHostingSlot } from '../controllers/hostingSlotsController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', getAllHostingSlots);
router.post('/', authenticateToken, createHostingSlot);
router.put('/:id', authenticateToken, updateHostingSlot);
router.delete('/:id', authenticateToken, deleteHostingSlot);

export default router;
