import { Request, Response } from 'express';
import { getBookByUser } from '../books/book-schema';
import { getSubcribersByUser } from '../subcribers/subcriber-schema';

export const AllCounts = async (req: Request, res: Response) => {
  
  const { userId } = req.params;

  try {
    const books = (await getBookByUser(userId)).length;

    const subcribers = (await getSubcribersByUser(userId)).length;

    return res.status(200).json({ books, subcribers });
  } catch (error) {
    return res.status(500).json({ msg: 'error getting counts' });
  }
};