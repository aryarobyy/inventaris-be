import { Router } from "express";
import { addItem, deleteItem, getItemById, getItems, updateItem } from "../controller/item.controller";
const router = Router();

router.get("/", getItems);
router.post("/", addItem);
router.get("/:id", getItemById);
router.put("/:id", updateItem)
router.delete("/:id", deleteItem);

export default router;