import { Router } from 'express';
import { addLoan, getUserLoans } from './loan-controller';

const router = Router();

router.get('/all/:userId', getUserLoans);
router.post('/add', addLoan);

export default router;