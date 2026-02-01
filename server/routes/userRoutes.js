import express from 'express';
import {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    revealPassword
} from '../controllers/userController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/reveal', requireAuth, revealPassword);
router.get('/', getAllUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
