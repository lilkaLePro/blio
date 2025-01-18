import mongoose, { Schema } from 'mongoose';

interface IBook {
  id?: string;
  title: string;
  author: string;
  categories: string;
  stok: number;
  userId: string;
  code: string;
}

export const BookSchema: Schema = new mongoose.Schema<IBook>(
  {
    title: { type: String, required: true, min: 2, max: 40 },
    author: { type: String, required: true, min: 2, max: 30 },
    userId: { type: String, required: true },
    categories: { type: String, required: true, min: 2, max: 32 },
    stok: { type: Number, require: true },
    code: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const BookModel = mongoose.model('books', BookSchema);

export const getBooks = () => BookModel.find();
export const getBookByUser = (userId: string) => BookModel.find<IBook>({ userId });
export const getBookByCode = (code: string) => BookModel.findOne<IBook>({ code });
export const bookById = (id: string) => BookModel.findById<IBook>(id);

export const createBook = (values: Partial<IBook>) =>
  new BookModel(values).save().then((user) => user.toObject());
