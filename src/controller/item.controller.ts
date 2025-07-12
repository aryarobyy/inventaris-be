import { NextFunction, Request, Response } from "express";
import { errorRes, successRes } from "../utils/response";
import prisma from "../prisma/prisma";
import { ItemModel } from "../models/item.model";

export const getItems = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await prisma.item.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        quantity: true,
        brand: true,
        category: true,
        condition_status: true,
        availability_status: true,
        loan_items: true,
        pair_id: true,
        status_notes: true,
        created_at: true,
        updated_at: true,
      },
      //   include: {
      //     loan_items: true
      //     }
    });

    successRes(res, 200, { data }, "get items successful");
  } catch (e: any) {
    console.error("Error in getItems:", e);
    errorRes(res, 500, "Error", e.message);
  }
};

export const getPairItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const items = await prisma.item.findMany();

    const data = await Promise.all(
      items.map(async (item) => {
        const pairItems = item.pair_id
          ? await prisma.item.findMany({
              where: {
                pair_id: item.pair_id,
                NOT: { id: item.id },
              },
            })
          : [];

        return {
          ...item,
          pair_items: pairItems,
        };
      }),
    );

    successRes(res, 200, { data }, "get items with pair successful");
  } catch (e: any) {
    console.error("Error in getItems:", e);
    errorRes(res, 500, "Error", e.message);
  }
};

export const addItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      name,
      description,
      quantity,
      brand,
      pair_id,
      status_notes,
      loan_items,
      pair,
      paired_items,
      condition_status,
      availability_status,
      category,
    } = req.body;
    if (!name) {
      errorRes(res, 404, "Name are required");
      return;
    }

    const data = await prisma.item.create({
      data: {
        name,
        description,
        quantity,
        brand,
        pair_id,
        status_notes,
        category,
        condition_status,
        availability_status,
      },
    });

    successRes(res, 201, { data }, "post item successful");
  } catch (e: any) {
    console.error("Error in :", e);
    errorRes(res, 500, "Error ", e.message);
  }
};

export const getItemById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = await prisma.item.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        description: true,
        quantity: true,
        brand: true,
        category: true,
        condition_status: true,
        availability_status: true,
        pair_id: true,
        status_notes: true,
        created_at: true,
        updated_at: true,
      },
    });
    if (!data) {
      errorRes(res, 404, "Item not found");
      return;
    }
    successRes(res, 200, { data }, "getting item successful");
  } catch (e: any) {
    console.error("Error in :", e);
    errorRes(res, 500, "Error ", e.message);
  }
};

export const updateItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      quantity,
      brand,
      pair_id,
      status_notes,
      loan_items,
      pair,
      paired_items,
      condition_status,
      availability_status,
      category,
    } = req.body;

    //req.files
    const data = await prisma.item.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        quantity,
        brand,
        pair_id,
        status_notes,
        category,
        condition_status,
        availability_status,
      },
    });

    successRes(res, 200, { data }, "update item successful");
  } catch (e: any) {
    console.error("Error in :", e);
    errorRes(res, 500, "Error ", e.message);
  }
};

export const deleteItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = await prisma.item.findUnique({
      where: { id: Number(id) },
    });

    successRes(res, 200, { data }, "delete successful");
  } catch (e: any) {
    console.error("Error in :", e);
    errorRes(res, 500, "Error ", e.message);
  }
};