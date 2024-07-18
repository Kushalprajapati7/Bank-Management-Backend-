import { Router } from "express";
import verifyToken from "../middleware/authMiddleware";
import authorize from "../middleware/roleBase";
import accountController from "../controllers/accountController";

const router = Router();

router.post('/', verifyToken, accountController.createAccount)
router.get('/', verifyToken, accountController.getAllAccount)
router.put('/:id', verifyToken, authorize(['admin']), accountController.updateAccount)
router.delete('/:id', verifyToken, authorize(['admin']), accountController.deleteAccount)
router.get('/:userId', verifyToken, accountController.getAccountsByUserId)

export default router;