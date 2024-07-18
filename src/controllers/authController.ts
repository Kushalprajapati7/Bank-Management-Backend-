import { Request, Response } from "express";
import authService from "../services/authService";

class AuthController {
    public async creatUser(req: Request, res: Response): Promise<void> {
        try {
            const newUser = req.body;
            const User = await authService.createUser(newUser);
            res.json(User);
        } catch (error: any) {
            res.status(500).json({
                message: error.message
            })
        }
    }
    public async loginUser(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const response = await authService.loginUser(email, password);
            res.json(response)
        } catch (error: any) {
            res.status(500).json({
                message: error.message
            })
        }
    }
}

export default new AuthController();