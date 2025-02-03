import { Router } from 'express';
import { addBook, bookCount, getBookById, getUserBook } from './book-controller';
const router = Router();

router.get('/books/:userId', getUserBook);

router.get('/:id', getBookById);
router.get('/counts/:userId', bookCount);

router.post('/add', addBook);

export default router;