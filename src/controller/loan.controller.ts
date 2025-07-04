import { NextFunction, Request, Response } from "express";
import { errorRes, successRes } from "../utils/response";
import prisma from "../prisma/prisma";

export const getLoans = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await prisma.loan.findMany();
    successRes(res, 200, { data }, "get Loans successful");
  } catch (e: any) {
    console.error("Error in :", e);
    errorRes(res, 500, "Error ", e.message);
  }
};

export const addLoan = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      borrower_id,
      loan_date,
      due_date,
      return_date,
      notes,
      loan_status,
      loan_items,
    } = req.body;
    if (!borrower_id && !loan_date && !due_date && !loan_status && !loan_items) {
      errorRes(res, 400, "All fields are required");
      return;
    }
    const data = await prisma.loan.create({
      data: {
        borrower_id,
        loan_date,
        due_date,
        return_date,
        notes,
        loan_status,
        loan_items,
      },
    });
    successRes(res, 200, { data }, "Add loan successful");
  } catch (e: any) {
    console.error("Error in :", e);
    errorRes(res, 500, "Error ", e.message);
  }
};

export const getLoanById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = await prisma.loan.findUnique({
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

export const updateLoan = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      borrower_id,
      loan_date,
      due_date,
      return_date,
      notes,
      loan_status,
      loan_items,
    } = req.body;

    const data = await prisma.loan.update({
      where: { id: Number(id) },
      data: {
        borrower_id,
        loan_date,
        due_date,
        return_date,
        notes,
        loan_status,
        loan_items,
      },
    });

    successRes(res, 200, { data }, "Update successful");
  } catch (e: any) {
    console.error("Error in updateRoom:", e);
    errorRes(res, 500, "Error updating room", e.message);
  }
};

export const deleteLoan = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = await prisma.loan.delete({
      where: { id: Number(id) },
    });
    successRes(res, 200, { data }, "Delete successful");
  } catch (e: any) {
    console.error("Error in :", e);
    errorRes(res, 500, "Error ", e.message);
  }
};
