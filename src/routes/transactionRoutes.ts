import transactionController from "../controllers/transactionController";
import { Router } from "express";
import verifyToken from "../middleware/authMiddleware";
import authorize from "../middleware/roleBase";

const router = Router();

router.post('/',verifyToken,transactionController.createTransaction)
router.get('/',verifyToken,authorize(['admin']),transactionController.getAllTransactions)
router.get('/:accountId',verifyToken,authorize(['admin','user']),transactionController.getAllTrasactionByAccountId )
router.get("/statement/:accountId", verifyToken, transactionController.getBankStatement);



export default router;  