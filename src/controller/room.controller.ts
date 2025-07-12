import { NextFunction, Request, Response } from "express";
import { errorRes, successRes } from "../utils/response";
import prisma from "../prisma/prisma";
import { PostRoomModel, UpdateRoomModel } from "../models/room.model";

export const getRooms = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await prisma.room.findMany();
    successRes(res, 200, { data }, "Get rooms successful");
  } catch (e: any) {
    console.error("Error in :", e);
    errorRes(res, 500, "Error ", e.message);
  }
};

export const addRoom = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      room_name,
      pc_count,
      description,
      capacity,
      location,
      room_status,
    } = req.body;
    if (!room_name && !room_status) {
      errorRes(res, 404, "Room name are required");
      return;
    }
    const data = await prisma.room.create({
      data: {
        room_name,
        pc_count,
        description,
        capacity,
        location,
        room_status,
      },
    });
    successRes(res, 201, { data }, "Add room successful");
  } catch (e: any) {
    console.error("Error in :", e);
    errorRes(res, 500, "Error ", e.message);
  }
};

export const getRoomById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = await prisma.room.findUnique({
      where: { id: Number(id) },
    });
    if (!data) {
      errorRes(res, 404, "Room not found");
    }
    successRes(res, 200, { data }, "Get By id successful");
  } catch (e: any) {
    console.error("Error in :", e);
    errorRes(res, 500, "Error ", e.message);
  }
};

export const updateRoom = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      room_name,
      pc_count,
      description,
      capacity,
      location,
      room_status,
    } = req.body;

    const data = await prisma.room.update({
      where: { id: Number(id) },
      data: {
        room_name,
        pc_count,
        description,
        capacity,
        location,
        room_status,
      },
      select: {
        room_name: true,
        pc_count: true,
        description: true,
        capacity: true,
        location: true,
        room_status: true,
      },
    });

    successRes(res, 200, { data }, "Update successful");
  } catch (e: any) {
    console.error("Error in updateRoom:", e);
    errorRes(res, 500, "Error updating room", e.message);
  }
};

export const deleteRoom = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = await prisma.room.delete({
      where: { id: Number(id) },
    });
    successRes(res, 200, { data }, "Delete successful");
  } catch (e: any) {
    console.error("Error in :", e);
    errorRes(res, 500, "Error ", e.message);
  }
};
