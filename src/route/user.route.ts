import { Router } from "express";
import { addUser, deleteUser, getIdentities, getUserById, getUserByIdentity, getUsers, updateUser } from "../controller/user.controller";

const router = Router();

router.get("/", getUsers);
router.post("/", addUser);
router.get("/nim", getIdentities)
router.post("/nim", getUserByIdentity) 
router.get("/:id", getUserById);
router.put("/:id", updateUser)
router.delete("/:id", deleteUser);

export default router;