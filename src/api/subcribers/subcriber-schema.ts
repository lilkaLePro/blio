import mongoose, { Schema } from 'mongoose';

interface ISubcriber {
  id?: string;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  job: string;
  userId: string
}

export const SubscriberSchema: Schema = new mongoose.Schema<ISubcriber>(
  {
    firstname: { type: String, required: true, min: 2 },
    lastname: { type: String, required: true, min: 2 },
    email: { type: String, required: true, unique: true },
    job: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    userId: { type: String },
  },
  {
    timestamps: true,
  },
);

const SubscriberModel = mongoose.model('subscribers', SubscriberSchema);

export const getSubcribersByUser = (userId: string) => SubscriberModel.find<ISubcriber>({ userId });
export const findSubscriberByNumber = (phoneNumber: string) => SubscriberModel.findOne<ISubcriber>({ phoneNumber });
export const getSubscriberById = (id: string) => SubscriberModel.findById<ISubcriber>(id);

export const createSubscriber = (values: Partial<ISubcriber>) => 
  new SubscriberModel(values).save().then((subcriber) => subcriber.toObject());