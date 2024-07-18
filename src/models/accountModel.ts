import mongoose, { Types } from "mongoose";
import { IAccount } from "../interface/accountInterface";

const accountSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'user is required'],
        },
        accountNumber: {
            type: String,
            required: true,
            unique: true
        },
        accountType: {
            type: String,
            enum: ['savings', 'checking'],
            required: true
        },
        balance: {
            type: Number,
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




const Account = mongoose.model<IAccount>('Account', accountSchema)
export default Account;