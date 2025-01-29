import { Request, Response } from 'express';
import { bookById, createBook, getBookByISBN, getBookByUser } from './book-schema';
import { getUserById } from '../users/user-schema';

export const getUserBook = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const books = await getBookByUser(userId);
    if (!books) {
      return res.status(403).json('user dosn t exist');
    }
    return res.status(200).json({ msg: 'all books', books });
  } catch (error) {
    return res.status(500).json('error lors de la recuperation de livre');
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const book = await bookById(id.toString());
    if (!book) {
      return res.status(403).json('book doesn t existe');
    }
    return res.status(200).json({ msg: 'book', book });

  } catch (error) {
    return res.status(500).json({ msg : 'book doesn t exist', error });
  }
};

export const addBook = async (req: Request, res: Response) => {
  try {
    const { title, author, categories, stok, isbn, userId } = req.body;
    const isUserExist = await getUserById(userId);
    if (!isUserExist) {
      return res.status(403).json(`user with id ${userId} doesn t exist`);
    }
    const isBookExist = await getBookByISBN(isbn);
    if (isBookExist) {
      return res.status(400).json('Book already exist');
    }
    const book = await createBook({
      title,
      author,
      userId : userId.toString(),
      categories,
      stok,
      isbn,
    });

    return res.status(201).json({ success: 'book added sussessfully', book });

  } catch (error) {
    return res.status(500).json({ msg: 'creation book failed', error });
  }
};
