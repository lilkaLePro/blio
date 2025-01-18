import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import api from './api';
import userRouter from './api/users/user-router';
import bookRouter from './api/books/book-router';

require('dotenv').config();

const createApp = () => {
  const app = express();
  app.use(morgan('dev'));
  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.get('/', (req, res) => {
    res.json({
      message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
    });
  });
  app.use('/api/v1', api);
  

  app.use('/api/auth', userRouter);
  app.use('/api/books', bookRouter);
  return app;
};


export default createApp;
