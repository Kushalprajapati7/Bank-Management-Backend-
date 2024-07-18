import mongoose,{Document} from "mongoose";


export interface ITransaction extends Document{
    account:string;
    toAccount:string;
    type:string;
    amount:number;
    accountBalance:number;
    description:string;
    createdAt:Date;
}