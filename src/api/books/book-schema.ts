import mongoose, { Schema } from 'mongoose';

interface IBook {
  id?: string;
  title: string;
  author: string;
  categories: string;
  stok: number;
  userId: string;
  isbn: string;
}

export const BookSchema: Schema = new mongoose.Schema<IBook>(
  {
    title: { type: String, required: true, min: 2, max: 40 },
    author: { type: String, required: true, min: 2, max: 30 },
    userId: { type: String, required: true },
    categories: { type: String, required: true, min: 2, max: 32 },
    stok: { type: Number, require: true },
    isbn: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const BookModel = mongoose.model('books', BookSchema);

export const getBooks = () => BookModel.find();
export const getBookByUser = (userId: string) => BookModel.find<IBook>({ userId });
export const getBookByISBN = (isbn: string) => BookModel.findOne<IBook>({ isbn });
export const bookById = (id: string) => BookModel.findById<IBook>(id);

export const createBook = (values: Partial<IBook>) =>
  new BookModel(values).save().then((user) => user.toObject());
