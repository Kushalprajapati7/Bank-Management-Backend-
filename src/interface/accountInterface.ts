import mongoose, { Document, Types } from 'mongoose';

export interface IAccount extends Document {
    user: mongoose.Schema.Types.ObjectId;
    accountNumber: string,
    accountType: string
    balance: number
    createdAt: Date
}