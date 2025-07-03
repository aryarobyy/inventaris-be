import { Router } from "express";
import { registerAdmin, deleteAdmin, getAdminById, getAdmins, updateAdmin, loginAdmin } from "../controller/admin.controller";

const router = Router();

router.get("/", getAdmins);
router.post("/", registerAdmin);
router.post("/login", loginAdmin);
router.get("/:id", getAdminById);
router.put("/:id", updateAdmin);
router.delete("/:id", deleteAdmin);

export default router;