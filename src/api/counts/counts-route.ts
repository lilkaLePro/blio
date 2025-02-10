import { Router } from 'express';
import { AllCounts } from './counts-controller';

const router = Router();

router.get('/:userId', AllCounts);

export default router;