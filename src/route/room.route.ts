import { Router } from "express";
import {
  addRoom,
  deleteRoom,
  getRoomById,
  getRooms,
  updateRoom,
} from "../controller/room.controller";

const router = Router();

router.post("/", addRoom);
router.get("", getRooms);
router.get("/:id", getRoomById);
router.put("/:id", updateRoom);
router.delete("/:id", deleteRoom);

export default router;
