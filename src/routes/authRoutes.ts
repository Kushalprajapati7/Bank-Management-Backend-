
import { Router } from "express";
import authController from "../controllers/authController";

const router = Router();

router.post('/register', authController.creatUser);
router.post('/login', authController.loginUser)


export default router;