import { Router } from 'express';
import { getUserProfile, getAllUsers } from '../controllers/users.js';

const router = Router();

router.get('/:id', getUserProfile);
router.get('/', getAllUsers);

export default router;
