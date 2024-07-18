import mongoose, { Types } from "mongoose";
import { IUser } from "../interface/userInterface";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
        },
        email: {
            type: String,
            required: [true, 'E-mail is required'],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        role: {
            type: String,
            enum: {
                values: ['admin', 'user']
            },
            default: 'user',
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




const User = mongoose.model<IUser>('User', userSchema)
export default User;