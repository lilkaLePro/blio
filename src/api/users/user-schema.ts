import mongoose, { Document, Schema } from 'mongoose';

interface IUser {
  _id?: string;
  firstname: string;
  lastname: string;
  password: string;
  email: string;
}

export const UserSchema: Schema = new mongoose.Schema<IUser>(
  {
    firstname: { type: String, required: true, min: 2, max: 30 },
    lastname: { type: String, required: true, min: 2, max: 30 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, min: 8, max: 8 },
  },
  {
    timestamps: true,
  },
);

const UserModel = mongoose.model('users', UserSchema);

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({
    'authentication.sessionToken': sessionToken,
  });

export const getUserById = (id: string) => UserModel.findById(id);

export const createUser = (value: Record<string, any>) =>
  new UserModel(value).save().then((user) => user.toObject());

export const deleteUserById = (id: string) =>
  UserModel.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, value: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, value);
