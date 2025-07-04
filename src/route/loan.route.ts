import { Router } from "express";
import { addLoan, deleteLoan, getLoanById, getLoans, updateLoan } from "../controller/loan.controller";

const router = Router();

router.post("/", addLoan);
router.get("", getLoans);
router.get("/:id", getLoanById);
router.put("/:id", updateLoan);
router.delete("/:id", deleteLoan);

export default router;
