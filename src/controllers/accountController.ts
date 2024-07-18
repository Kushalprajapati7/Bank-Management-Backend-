import { Request, Response } from "express";
import accountService from "../services/accountService";
import { IAccount } from "../interface/accountInterface";
import CustomRequest from "../types/customRequest";
import { Types } from "mongoose";

class AccountController {
    public async createAccount(req: Request, res: Response): Promise<void> {
        try {
            const accountData: IAccount = req.body;
            const userId = (req as CustomRequest).userId as any;
            accountData.user = userId;

            // const existingAccount = await accountService.findAccountByUserId(userId);
            // if (existingAccount) {
            //     res.status(400).json({
            //         message: "User already has an account"
            //     });
            //     return;
            // }
            accountData.accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
            const newAcc = await accountService.createAccount(accountData);
            res.status(201).json(newAcc)
        } catch (error: any) {
            res.status(500).json({
                message: error.message
            })
        }
    }

    public async getAllAccount(req: Request, res: Response): Promise<void> {
        try {
            const allAcc = await accountService.showAllAccount();
            res.status(200).json(allAcc)
        } catch (error: any) {
            res.status(500).json({
                message: error.message
            })
        }
    }

    public async updateAccount(req: Request, res: Response): Promise<void> {
        try {
            const accountId = req.params.id;
            const accountData = req.body;
            const updatedAccount = await accountService.updateAccount(accountId, accountData);
            res.status(200).json(updatedAccount)
        } catch (error: any) {
            res.status(500).json({
                message: error.message
            })
        }
    }
    public async deleteAccount(req: Request, res: Response): Promise<void> {
        try {
            const accountId = req.params.id;
            await accountService.deleteAccount(accountId);
            res.status(200).json("Done")
        } catch (error: any) {
            res.status(500).json({
                message: error.message
            })
        }
    }

    public async getStatement(req: Request, res: Response): Promise<void> {
        try {
            const { account: accountId } = req.body;
            const { startDate, endDate } = req.query;

            const start = new Date(startDate as string);
            const end = new Date(endDate as string);

            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                res.status(400).json({ message: "Invalid date range" });
                return;
            }

            const { transactions, balance } = await accountService.getTransactionsByDateRange(accountId.toString(), start, end);
            res.status(200).json({ transactions, balance });
        } catch (error: any) {
            res.status(500).json({
                message: error.message
            });
        }
    }

    public async getAccountsByUserId(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.userId;
            if (!userId) {
                throw new Error("User Not Found");
            }
            const accoundts = await accountService.findAccountByUserId(userId);
            res.status(200).json(accoundts);

        } catch (error:any) {
            res.status(500).json({
                message: error.message
            });
        }
    }




}

export default new AccountController()