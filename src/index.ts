import createApp from './app';
import mongoose from 'mongoose';

const app = createApp();

const URL = process.env.DATABASE_URL;

mongoose.connect(URL || '')
  .then(() => {

    app.listen(5001, () => {
      console.log('server runing & db connected');
    });

  }).catch(() => console.log('server error'));