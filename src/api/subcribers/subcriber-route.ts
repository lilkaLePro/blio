import { Router } from 'express';
import { addSubscriber, getAllSubscribersByUser, getoneSubcribersById } from './subcribers-controllers';

const router = Router();

router.post('/add', addSubscriber);
router.get('/:id', getoneSubcribersById);
router.get('/user/:userId', getAllSubscribersByUser);

export default router;