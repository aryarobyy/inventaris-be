import { NextFunction, Request, Response } from "express";
import { errorRes, successRes } from "../utils/response";
import prisma from "../prisma/prisma";

export const getLoanItems = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await prisma.loan.findMany();
    successRes(res, 200, { data }, "get Items successful");
  } catch (e: any) {
    console.error("Error in :", e);
    errorRes(res, 500, "Error ", e.message);
  }
};

export const addLoanItems = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
        loan_id,
        item_id,
        borrowed_quantity,
        borrow_condition,
    } = req.body;
    if (!item_id && !borrow_condition &&  !borrowed_quantity) {
      errorRes(res, 400, "All fields are required");
      return;
    }
    const data = await prisma.loanItem.create({
      data: {
        loan_id: Number(loan_id),
        item_id,
        borrowed_quantity,
        borrow_condition,
      },
    });
    successRes(res, 200, { data }, "Add loan Items successful");
  } catch (e: any) {
    console.error("Error in :", e);
    errorRes(res, 500, "Error ", e.message);
  }
};

export const getLoanItemsById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = await prisma.loanItem.findUnique({
      where: { id: Number(id) },
    });
    if (!data) {
      errorRes(res, 400, "Loan data not found");
    }
    successRes(res, 200, { data }, "Get By Id successful");
  } catch (e: any) {
    console.error("Error in :", e);
    errorRes(res, 500, "Error ", e.message);
  }
};

export const updateLoanItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const {
        returned_at,
        return_condition,
        borrowed_quantity,
    } = req.body;

    const data = await prisma.loanItem.update({
      where: { id: Number(id) },
      data: {
        returned_at,
        return_condition,
        borrowed_quantity,
      },
    });

    successRes(res, 200, { data }, "Update successful");
  } catch (e: any) {
    console.error("Error in updateRoom:", e);
    errorRes(res, 500, "Error updating room", e.message);
  }
};

export const deleteLoanItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = await prisma.loanItem.delete({
      where: { id: Number(id) },
    });
    successRes(res, 200, { data }, "Delete successful");
  } catch (e: any) {
    console.error("Error in :", e);
    errorRes(res, 500, "Error ", e.message);
  }
};
