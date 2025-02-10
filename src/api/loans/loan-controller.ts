import { Request, Response } from 'express';
import { createLoan, getAllUserLoans } from './loan-schema';

export const getUserLoans = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const loans = getAllUserLoans(userId);

    return res.status(200).json(loans);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const addLoan = async (req: Request, res: Response) => {
  try {
    const { bookId, subscriberId, from, to } = req.body;

    const loan = await createLoan({
      bookId,
      from,
      to,
      subscriberId,
    });

    return res.status(200).json(loan);

  } catch (error) {
    res.status(500).json(error);
  }
};