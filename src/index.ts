import createApp from './app';
import mongoose from 'mongoose';

const app = createApp();

const URL = process.env.DATABASE_URL;
const PORT = process.env.PORT || 5001;

mongoose.connect(URL || '')
  .then(() => {

    app.listen(PORT, () => {
      console.log('server runing & db connected', PORT);
    });

  }).catch(() => console.log('server error'));