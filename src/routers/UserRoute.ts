import { Router } from "express";
import { createUser, getAllUser, updateUser, deleteUser, authentication } from "../controller/User";
import { verifyAddAdmin, verifyAddUser, verifyAuthentification, verifyUpdateUser } from "../middlewares/UserValidation";


const router = Router();

router.post("/",[ verifyAddAdmin, verifyAddUser],createUser);
router.get("/", getAllUser);
router.put("/:id", [ verifyUpdateUser],updateUser);
router.delete("/:id",deleteUser);
router.post("/login", [verifyAuthentification], authentication)
export default router