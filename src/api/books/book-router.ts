import { Router } from 'express';
import { addBook, getBookById, getUserBook } from './bookController';
const router = Router();

router.get('/books/:userId', getUserBook);

router.get('/:id', getBookById);
router.post('/add/:userId', addBook);

export default router;