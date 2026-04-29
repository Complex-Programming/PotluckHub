import { Router } from 'express';
import { getUserProfile, getAllUsers, updateUserBio } from '../controllers/users.js';

const router = Router();

router.get('/:id', getUserProfile);
router.patch('/:id/bio', updateUserBio);
router.get('/', getAllUsers);

export default router;
