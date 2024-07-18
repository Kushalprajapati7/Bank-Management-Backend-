// errorInterface.ts
export interface IError extends Error {
    message: string;
    status?: number;
    stack?: string;
    [key: string]: any; 
}
