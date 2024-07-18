import { Request } from "express";


interface CustomRequest extends Request {
    userId?: string;
    role?:string
    
}

export default CustomRequest;
