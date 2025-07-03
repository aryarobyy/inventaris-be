import { Router } from "express";
import { addUser, deleteUser, getUserById, getUserByNim, getUsers, updateUser } from "../controller/user.controller";

const router = Router();

router.get("/", getUsers);
router.post("/", addUser);
router.get("/nim", getUserByNim) 
router.get("/:id", getUserById);
router.put("/:id", updateUser)
router.delete("/:id", deleteUser);

export default router;