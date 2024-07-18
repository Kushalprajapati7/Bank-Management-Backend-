import userController from "../controllers/userController";
import { Router } from "express";
import verifyToken from "../middleware/authMiddleware";
import authorize from "../middleware/roleBase";

const router = Router();

router.get('/', verifyToken, authorize(['admin']), userController.getAllUser)
router.delete('/:id', verifyToken, authorize(['admin']), userController.deleteUser)
router.put('/:id', verifyToken, authorize(['admin']), userController.updateUser)
router.get('/:id', verifyToken, authorize(['admin']), userController.getUserById)
router.post('/', verifyToken, authorize(['admin']), userController.addUser)


export default router;