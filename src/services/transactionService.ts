import Transaction from "../models/transactionModel";
import { ITransaction } from "../interface/transactionInterface";
import Account from "../models/accountModel";
import mongoose, { Types } from "mongoose";

class TransactionService {
    public async createTrasnsaction(transactionData: ITransaction): Promise<ITransaction> {

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { account, toAccount, type, amount, description } = transactionData;

            const sourceAccount = await Account.findById(account).session(session);
            const destinationAccount = await Account.findById(toAccount).session(session);

            if (!sourceAccount || (type === 'transfer' && !destinationAccount)) {
                throw new Error("Source or destination account not found");
            }

            if ((type === 'withdrawal' || type === 'transfer') && sourceAccount.balance < amount) {
                throw new Error("Insufficient Balance");
            }
            if ((type === 'withdrawal' || type === 'deposit') && sourceAccount.accountNumber !== destinationAccount?.accountNumber) {
                throw new Error("Please Enter your A/C number");
            }

            let transaction;

            switch (type) {
                case 'withdrawal':
                    sourceAccount.balance -= amount;
                    break;
                case 'deposit':
                    sourceAccount.balance += amount;
                    break;
                case 'transfer':
                    if (!destinationAccount) {
                        throw new Error("Destination account not found");
                    }
                    if (sourceAccount.accountNumber === destinationAccount.accountNumber) {
                        throw new Error("To Transfer Money, accounts must be different");
                    }
                    sourceAccount.balance -= amount;
                    destinationAccount.balance += amount;
                    await destinationAccount.save();
                    break;
                default:
                    throw new Error("Invalid transaction type");

            }

            await sourceAccount.save();
            transaction = new Transaction({
                account,
                toAccount,
                type,
                amount,
                description,
                accountBalance: sourceAccount.balance
            });

            await transaction.save();
            await session.commitTransaction();
            session.endSession();
            return transaction;
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }

    public async getAllTransaction(): Promise<ITransaction[]> {
        const allTrasnsaction = Transaction.aggregate(
            [
                {
                  $lookup: {
                    from: "accounts",
                    localField: "account",
                    foreignField: "_id",
                    as: "accountDetails"
                  }
                },
                {
                  $unwind: {
                    path: "$accountDetails"
                  }
                },
                {
                  $lookup: {
                    from: "users",
                    localField: "accountDetails.user",
                    foreignField: "_id",
                    as: "sourceUserDetails"
                  }
                },
                {
                  $unwind: {
                    path: "$sourceUserDetails"
                  }
                },
                {
                  $lookup: {
                    from: "accounts",
                    localField: "toAccount",
                    foreignField: "_id",
                    as: "destinationAccountDetails"
                  }
                },
                {
                  $unwind: {
                    path: "$destinationAccountDetails"
                  }
                },
                {
                  $lookup: {
                    from: "users",
                    localField:
                      "destinationAccountDetails.user",
                    foreignField: "_id",
                    as: "destinationUserDetails"
                  }
                },
                {
                  $unwind: {
                    path: "$destinationUserDetails"
                  }
                },
                {
                  $project: {
                    "sourceUserDetails.username": 1,
                    "accountDetails.accountType": 1,
                    "accountDetails.accountNumber": 1,
                    "destinationUserDetails.username": 1,
                    "destinationAccountDetails.accountType": 1,
                    "destinationAccountDetails.accountNumber": 1,
                    amount: 1,
                    type: 1,
                    description: 1,
                    createdAt: 1
                  }
                },
                {
                  $group: {
                    _id: "$_id",
                    transactionDetails: {
                      $first: {
                        sourceUsername:
                          "$sourceUserDetails.username",
                        sourceAccountNumber:
                          "$accountDetails.accountNumber",
                        sourceAccountType:
                          "$accountDetails.accountType",
                        destinationUsername:
                          "$destinationUserDetails.username",
                        destinationAccountNumber:
                          "$destinationAccountDetails.accountNumber",
                        destinationAccountType:
                          "$destinationAccountDetails.accountType",
                        amount: "$amount",
                        type: "$type",
                        description: "$description",
                        transactionDate: "$createdAt"
                      }
                    }
                  }
                },
                {
                    $sort: {
                    "createdAt": 1
                    }
                  }
              ]
        );

        return allTrasnsaction;
    }

    public async getTransactionByAccount(accountId: string): Promise<ITransaction[]> {
        const transactions = await Transaction.aggregate(
            [
                {
                    $match: {
                        $or: [
                            {
                                account: new Types.ObjectId(accountId)
                            },
                            {
                                toAccount: new Types.ObjectId(accountId)
                            }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: "accounts",
                        localField: "account",
                        foreignField: "_id",
                        as: "accountDetails"
                    }
                },
                {
                    $unwind: {
                        path: "$accountDetails"
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "accountDetails.user",
                        foreignField: "_id",
                        as: "sourceUserDetails"
                    }
                },
                {
                    $unwind: {
                        path: "$sourceUserDetails"
                    }
                },
                {
                    $lookup: {
                        from: "accounts",
                        localField: "toAccount",
                        foreignField: "_id",
                        as: "destinationAccountDetails"
                    }
                },
                {
                    $unwind: {
                        path: "$destinationAccountDetails"
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField:
                            "destinationAccountDetails.user",
                        foreignField: "_id",
                        as: "destinationUserDetails"
                    }
                },
                {
                    $unwind: {
                        path: "$destinationUserDetails"
                    }
                },
                {
                    $project: {
                        "sourceUserDetails.username": 1,
                        "accountDetails.accountType": 1,
                        "accountDetails.accountNumber": 1,
                        "destinationUserDetails.username": 1,
                        "destinationAccountDetails.accountType": 1,
                        "destinationAccountDetails.accountNumber": 1,
                        amount: 1,
                        type: 1,
                        description: 1,
                        createdAt: 1
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        details: {
                            $first: {
                                sourceUsername:
                                    "$sourceUserDetails.username",
                                sourceAccountNumber:
                                    "$accountDetails.accountNumber",
                                sourceAccountType:
                                    "$accountDetails.accountType",
                                destinationUsername:
                                    "$destinationUserDetails.username",
                                destinationAccountNumber:
                                    "$destinationAccountDetails.accountNumber",
                                destinationAccountType:
                                    "$destinationAccountDetails.accountType",
                                amount: "$amount",
                                type: "$type",
                                description: "$description",
                                TransactionDate: "$createdAt"
                            }
                        }
                    }
                },
                {
                    $sort: {
                    "createdAt": 1
                    }
                  }
            ]
        )



        return transactions;

    }

    public async getAccountStatment(accountId: string, startDate: Date, endDate: Date): Promise<ITransaction[]> {
        const statement = await Transaction.aggregate(
            [
                {
                    $match: {
                        account: new Types.ObjectId(accountId),
                        createdAt: {
                            $gte: startDate,
                            $lte: endDate
                        }
                    }
                },
                {
                    $lookup: {
                        from: "accounts",
                        localField: "account",
                        foreignField: "_id",
                        as: "SenderAccount_Details"
                    }
                },
                {
                    $unwind: {
                        path: "$SenderAccount_Details"
                    }
                },
                {
                    $lookup: {
                        from: "accounts",
                        localField: "toAccount",
                        foreignField: "_id",
                        as: "ReceiversAccount_Details"
                    }
                },
                {
                    $unwind: {
                        path: "$ReceiversAccount_Details",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "SenderAccount_Details.user",
                        foreignField: "_id",
                        as: "User_Details"
                    }
                },
                {
                    $unwind: {
                        path: "$User_Details"
                    }
                },
                {
                    $addFields: {
                        Statment: {
                            AccountHolderName:
                                "$User_Details.username",
                            AccountHolderEmail: "$User_Details.email",
                            AccountNo:
                                "$SenderAccount_Details.accountNumber",
                            AccountID: "$account",
                            AccountType:
                                "$SenderAccount_Details.accountType",
                            CurrentBalance:
                                "$SenderAccount_Details.balance",
                            Transactions: {
                                AccountBalanceAfterTransaction:
                                    "$accountBalance",
                                Date: "$createdAt",
                                Description: "$description",
                                TransactionAmount: "$amount",
                                SendedToAccountNo:
                                    "$ReceiversAccount_Details.accountNumber",
                                TransactionType: "$type"
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        Statment: { $first: "$Statment" }
                    }
                },
                {
                    $sort: {
                        "Statment.Transactions.Date": 1
                    }
                }
            ]
        )
        return statement
    }
}
export default new TransactionService()