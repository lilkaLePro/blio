import express, { Request, Response } from 'express';

const router = express.Router();

type EmojiResponse = string[];

router.get<{}, EmojiResponse>('/', (req: Request, res: Response) => {
  res.json(['😀', '😳', '🙄']);
});

export default router;
