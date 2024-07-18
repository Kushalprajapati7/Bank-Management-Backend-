import Account from "../models/accountModel";
import { IAccount } from "../interface/accountInterface";
import Transaction from "../models/transactionModel";
import { ITransaction } from "../interface/transactionInterface";
import { ObjectId } from "mongoose";


class AccountService {
    public async createAccount(accountData: IAccount): Promise<IAccount> {
        const account = new Account(accountData);
        return await account.save();
    }
    public async findAccountByUserId(userId: string): Promise<IAccount[] | null> {
        return await Account.find({ user: userId });
    }
    public async showAllAccount(): Promise<IAccount[]> {
        const allAccount = await Account.aggregate(
            [
                {
                    $lookup: {
                        from: "users",
                        localField: "user",
                        foreignField: "_id",
                        as: "userDetails"
                    }
                },
                {
                    $unwind: {
                        path: "$userDetails"
                    }
                },
                {
                    $project: {
                        "userDetails.username": 1,
                        "userDetails.email": 1,
                        accountNumber: 1,
                        accountType: 1,
                        balance: 1,
                        createdAt: 1
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        AccountDetails: {
                            $first: {
                                username: "$userDetails.username",
                                email: "$userDetails.email",
                                AccountNo: "$accountNumber",
                                AccountType: "$accountType",
                                Balance: "$balance",
                                AccountCreatedDate: "$createdAt"
                            }
                        }
                    }
                }
            ]
        )
        return allAccount;
    }
    public async updateAccount(accountId: string, updatedData: IAccount): Promise<IAccount | null> {
        const account = await Account.findById(accountId);
        if (!account) {
            throw new Error("Account not Found");
        }
        const updatedAccount = await Account.findByIdAndUpdate(accountId, updatedData, { new: true });
        return updatedAccount;
    }
    public async deleteAccount(accountId: string): Promise<IAccount | null> {
        const account = await Account.findById(accountId);
        if (!account) {
            throw new Error("Account not Found");
        }
        return await Account.findByIdAndDelete(accountId);
    }

    public async getTransactionsByDateRange(accountId: string, startDate: Date, endDate: Date): Promise<{ transactions: ITransaction[], balance: number }> {
        const transactions = await Transaction.find({
            account: accountId,
            createdAt: { $gte: startDate, $lte: endDate }
        }).sort({ createdAt: 1 });

        const account = await Account.findById(accountId);
        if (!account) {
            throw new Error("Account not found");
        }

        return {
            transactions,
            balance: account.balance
        };
    }


}


export default new AccountService();