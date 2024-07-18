import express, { Request, Response } from "express";
import connectDB from "./config/database";
import * as dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'
import accountRoutes from './routes/accountRoutes'
import transactionRoutes from './routes/transactionRoutes'
dotenv.config();


const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/transaction', transactionRoutes);


connectDB().then(() => {

    app.listen(port, () => {
        console.log(`Server is On At Port 3000`);

    })
}).catch((error: any) => {
    console.log("Error starting server :", error.message);
});
