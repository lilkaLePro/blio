import mongoose, { Date, Schema } from 'mongoose';

interface ILoan {
  id?: string;
  subscriberId: string;
  bookId: string;
  from: Date;
  to: Date;
  loanPeriod: number
}

export const LoanSchema: Schema = new mongoose.Schema<ILoan>(
  {
    subscriberId: { type: String, required: true },
    bookId: { type: String, required: true },
    from: { type: Date, required: true },
    to: { type: Date, required: true },
    loanPeriod: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);

export const LoanModel = mongoose.model('loans', LoanSchema);

export const getAllUserLoans = (userId: string) => LoanModel.find<ILoan>({ userId });
export const getLoanById = (userId: string) => LoanModel.findById<ILoan>({ userId });

export const createLoan = (values: Partial<ILoan>) => 
  new LoanModel(values).save().then((loan) => loan.toObject());