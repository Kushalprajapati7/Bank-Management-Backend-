import mongoose, { Types } from "mongoose";
import { ITransaction } from "../interface/transactionInterface";

const transactionSchema = new mongoose.Schema(
    {
        account: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account',
            required: [true, 'Account is required'],
        },
        toAccount: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account',
            required: [true, 'Destination account is required for transfers'],
        },
        type: {
            type: String,
            enum: ['deposit', 'withdrawal', 'transfer'],
            required: true
        },
        amount: {   
            type: Number,
            default: 0
        },
        accountBalance:{
            type:Number,
            default:0
        },
        description: {
            type: String,
            default: 0
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
    },
    {
        timestamps: true
    }
);




const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema)
export default Transaction;