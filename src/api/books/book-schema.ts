import mongoose, { Schema } from 'mongoose';

interface IBook {
  name: string;
  author: string;
  categories: string;
  stock: number;
}

export const BookSchema: Schema = new mongoose.Schema<IBook>({
  name: { type: String, required: true, min: 2, max: 40 },
  author: { type: String, required: true, min: 2, max: 30 },
  categories: { type: String, required: true, min: 2, max: 32 },
  stock: { type: Number, require: true },
});

const BookModel = mongoose.model('books', BookSchema);

export const getBooks = () => BookModel.find();
