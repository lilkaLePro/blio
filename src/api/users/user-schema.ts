import mongoose, { Document, ObjectId, Schema } from 'mongoose';

export interface IUser {
  _id?: ObjectId;
  firstname: string;
  lastname: string;
  username?: string;
  password: string;
  email: string;
  sessionToken: any;
  sessionTokenExpiresAt: any;
  salt: string;
}

export const UserSchema: Schema = new mongoose.Schema<IUser>(
  {
    firstname: { type: String, required: true, min: 2, max: 30 },
    lastname: { type: String, required: true, min: 2, max: 30 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, min: 8, max: 8 },
    sessionToken: { type: String, default: null },
    sessionTokenExpiresAt: { type: Date, default: null },
    salt: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const UserModel = mongoose.model('users', UserSchema);

export const getUsers = () => UserModel.find<IUser>();
export const getUserByEmail = (email: string) =>
  UserModel.findOne<IUser>({ email });
export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({ sessionToken });

export const getUserById = (id: string) => UserModel.findById<IUser>(id);

export const createUser = (values: Partial<IUser>) =>
  new UserModel(values).save().then((user) => user.toObject());

export const deleteUserById = (id: string) =>
  UserModel.findOneAndDelete<IUser>({ _id: id });
export const updateUserById = (id: string, value: Record<string, any>) =>
  UserModel.findByIdAndUpdate<IUser>(id, value);
