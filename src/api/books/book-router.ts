import { Router } from 'express';
import { addBook, getBookById, getUserBook } from './book-controller';
const router = Router();

router.get('/books/:userId', getUserBook);

router.get('/:id', getBookById);
router.post('/add', addBook);

export default router;