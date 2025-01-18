import { Router } from 'express';
import { getAllUsers, getUserByToken, login, register } from './user-controller';

const router = Router();

// api/user
router.get('/users', getAllUsers);
// recuperer un user par son token
router.get('/me', getUserByToken );

// api/user/234
router.post('/register', register );
router.post('/login', login);

export default router ;