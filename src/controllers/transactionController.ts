import { Request, Response } from "express";
import transactionService from "../services/transactionService";
import { ITransaction } from "../interface/transactionInterface";
import generateBankStatementPDF from "../utils/pdfGenerator";
import { IAccount } from "../interface/accountInterface";
import Account from "../models/accountModel";
import fs from 'fs'
import CustomRequest from "../types/customRequest";
import { IError } from "../interface/errorInterface";

class TransactionController {
    public async createTransaction(req: Request, res: Response): Promise<void> {
        try {
            const transactionData: ITransaction = req.body;
            const { toAccount } = transactionData;
            const destinationAccount = await Account.findOne({ accountNumber: toAccount });
            if (!destinationAccount) {
                res.status(404).json({ message: 'Destination Account Not Found' });
                return
            }
            transactionData.toAccount = destinationAccount?._id as string;
            const userId = (req as CustomRequest).userId;
            const sourceAccount = await Account.findById(transactionData.account);
            console.log(sourceAccount,"So");
                
            if (sourceAccount) {
                const newTransaction = await transactionService.createTrasnsaction(transactionData);
                res.status(201).json(newTransaction);
            } else {
                res.status(403).json({ message: 'Invalid account or permission denied' });
            }
        } catch (error: any) {
            res.status(500).json({
                message: error.message
            });
        }
    }
    public async getAllTransactions(req: Request, res: Response): Promise<void> {
        try {
            const allTransaction = await transactionService.getAllTransaction();
            res.status(200).json(allTransaction);
        } catch (error: any) {
            res.status(500).json({
                message: error.message
            });
        }
    }

    public async getAllTrasactionByAccountId(req: Request, res: Response): Promise<void> {
        try {
            const accountId = req.params.accountId;
            const allTransaction = await transactionService.getTransactionByAccount(accountId);
            res.status(200).json(allTransaction)
        } catch (error: any) {
            res.status(500).json({
                message: error.message
            });
        }
    }

    public async getBankStatement(req: Request, res: Response) {
        try {
            const accountId = req.params.accountId;
            const startDate = new Date(req.query.startDate as string);
            const endDate = new Date(req.query.endDate as string);

            const transactions: any = await transactionService.getAccountStatment(accountId, startDate, endDate);

            const account: IAccount | null = await Account.findById(accountId);
            if (!account) {
                res.status(404).json({ message: 'Account not found' });
                return;
            }

            const fileName = await generateBankStatementPDF(accountId, transactions, [account]);

            res.setHeader('Content-Type', 'application/pdf');
            res.download(fileName, fileName, (err) => {
                if (err) {
                    res.status(500).json({ message: 'Error downloading file', error: err.message });
                } else {
                    fs.unlink(fileName, (err) => {
                        if (err) {
                            console.error('Error deleting file:', err);
                        }
                    });
                }
            });
        } catch (error) {
            const err: IError = error as IError
            res.status(500).json({ message: 'Error generating PDF', error: err.message });
        }
    };


}

export default new TransactionController();
