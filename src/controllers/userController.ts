import { Request, Response } from "express";
import userService from "../services/userService";

class UserController {
    public async addUser(req: Request, res: Response): Promise<void> {
        try {
            const newUser = await userService.addUser(req.body);
            res.status(201).json(newUser)
        } catch (error: any) {
            res.status(500).json({
                message: error.message
            })
        }
    }
    public async getAllUser(req: Request, res: Response): Promise<void> {
        try {
            const allUser = await userService.allUser()
            if (!allUser) {
                res.status(404).json({ error: "Users Not Found!" });
                return
            }
            res.status(200).json(allUser)
        } catch (error: any) {
            res.status(500).json({
                message: error.message
            })
        }
    }
    public async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.id;
            await userService.deleteUser(userId)
            res.status(200).json("User Deleted")
        } catch (error: any) {
            res.status(500).json({
                message: error.message
            })
        }
    }
    public async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.id;
            const user = await userService.userById(userId)
            res.status(200).json(user)
        } catch (error: any) {
            res.status(500).json({
                message: error.message
            })
        }
    }
    public async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.id;
            const userData = req.body;
            const updatedUser = await userService.updateUser(userId, userData)
            res.json(updatedUser)
        } catch (error: any) {
            res.status(500).json({
                message: error.message
            })
        }
    }
}

export default new UserController();