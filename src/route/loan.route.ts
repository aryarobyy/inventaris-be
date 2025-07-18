import { Router } from "express";
import { addLoan, deleteLoan, getLoanById, getLoanByStatus, getLoans, returnLoan, updateLoan } from "../controller/loan.controller";

const router = Router();

router.post("/", addLoan);
router.get("", getLoans);
router.post("/:id", returnLoan);
router.get("/:id", getLoanById);
router.get("/status/:status", getLoanByStatus);
router.put("/:id", updateLoan);
router.delete("/:id", deleteLoan);

export default router;
