import { Router } from "express";
import { addLoanItems, deleteLoanItem, getLoanItems, getLoanItemsById, updateLoanItem } from "../controller/loanItem.controller";

const router = Router();

router.post("/", addLoanItems);
router.get("", getLoanItems);
router.get("/:id", getLoanItemsById);
router.put("/:id", updateLoanItem);
router.delete("/:id", deleteLoanItem);

export default router;
