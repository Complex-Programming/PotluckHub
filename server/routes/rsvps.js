import { Router } from 'express';
const router = Router();

router.post('/', (req, res) => res.status(201).json({}));
router.delete('/', (req, res) => res.status(204).send());

export default router;
