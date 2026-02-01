import express from 'express';
import {
    getTeamMembers,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember
} from '../controllers/teamController.js';

const router = express.Router();

router.get('/', getTeamMembers);
router.post('/', createTeamMember);
router.put('/:id', updateTeamMember);
router.delete('/:id', deleteTeamMember);

export default router;
