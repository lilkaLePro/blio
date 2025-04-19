import express, { Request, Response } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import api from './api';
import userRouter from './api/users/user-router';
import bookRouter from './api/books/book-router';
import subscriberRouter from './api/subcribers/subcriber-route';
import countsRouter from './api/counts/counts-route';
import loanRouter from './api/loans/loan-route';

require('dotenv').config();

const createApp = () => {
  const app = express();
  app.use(morgan('dev'));
  app.use(helmet());
  app.use(
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(cookieParser());

  app.get('/', (req: Request, res: Response) => {
    res.json({
      message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
    });
  });
  app.use('/api/v1', api);

  app.use('/api/auth', userRouter);
  app.use('/api/books', bookRouter);
  app.use('/api/subscriber', subscriberRouter);
  app.use('/api/counts', countsRouter);
  app.use('/api/loan', loanRouter);
  return app;
};

export default createApp;
