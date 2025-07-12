import { NextFunction, Request, Response } from "express";
import { errorRes, successRes } from "../utils/response";
import prisma from "../prisma/prisma";
import { LoanStatus } from "@prisma/client";

export const getLoans = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await prisma.loan.findMany({
      include: {
        borrower: {
          select: {
            id: true,
            name: true,
            student_id: true,
            major_name: true,
            academic_year: true,
            phone_number: true,
            organization: true,
          },
        },
        loan_items: {
          include: {
            item: {
              select: {
                id: true,
                name: true,
                description: true,
                category: true,
                condition_status: true,
                availability_status: true,
              },
            },
          },
        },
      },
    });
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

    const requiredFields = [
      borrower_id,
      loan_date,
      due_date,
      return_date,
      notes,
      loan_status,
      loan_items,
    ]

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        errorRes(res, 404, `${field.name} cant be empty.`);
      }
    });

    if (!Array.isArray(loan_items) || loan_items.length === 0) {
      errorRes(res, 404, "loan_items must be a non-empty array");
      return;
    }

    const borrower = await prisma.user.findUnique({
      where: { id: borrower_id },
    });

    if (!borrower) {
      errorRes(res, 404, "Borrower not found");
      return;
    }

    const itemIds = loan_items.map((item: any) => item.item_id);
    const items = await prisma.item.findMany({
      where: { id: { in: itemIds } },
    });

    if (items.length !== itemIds.length) {
      errorRes(res, 404, "One or more items not found");
      return;
    }

    const data = await prisma.$transaction(async (t) => {
      const loan = await t.loan.create({
        data: {
          borrower_id,
          loan_date: new Date(loan_date),
          due_date: new Date(due_date),
          return_date: return_date ? new Date(return_date) : null,
          notes,
          loan_status,
        },
      });

      const loanItemsData = loan_items.map((item: any) => ({
        loan_id: loan.id,
        item_id: item.item_id,
        borrowed_quantity: item.borrowed_quantity || 1,
        borrow_condition: item.borrow_condition || null,
      }));

      await t.loanItem.createMany({
        data: loanItemsData,
      });

      return await t.loan.findUnique({
        where: { id: loan.id },
        include: {
          borrower: {
            select: {
              id: true,
              name: true,
              student_id: true,
              major_name: true,
              academic_year: true,
              phone_number: true,
              organization: true,
            },
          },
          loan_items: {
            include: {
              item: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  category: true,
                  condition_status: true,
                  availability_status: true,
                },
              },
            },
          },
        },
      });
    });

    successRes(res, 201, { data }, "Add loan successful");
  } catch (e: any) {
    console.error("Error in addLoan:", e);
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
      include: {
        borrower: {
          select: {
            id: true,
            name: true,
            student_id: true,
            major_name: true,
            academic_year: true,
            phone_number: true,
            organization: true,
          },
        },
        loan_items: {
          include: {
            item: {
              select: {
                id: true,
                name: true,
                description: true,
                category: true,
                condition_status: true,
                availability_status: true,
              },
            },
          },
        },
      },
    });
    if (!data) {
      errorRes(res, 404, "Loan data not found");
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

    const existingLoan = await prisma.loan.findUnique({
      where: { id: Number(id) },
    });

    if (!existingLoan) {
      errorRes(res, 404, "Loan not found");
      return;
    }

    if (loan_items && Array.isArray(loan_items)) {
      const data = await prisma.$transaction(async (t) => {
        await t.loan.update({
          where: { id: Number(id) },
          data: {
            borrower_id,
            loan_date: loan_date ? new Date(loan_date) : undefined,
            due_date: due_date ? new Date(due_date) : undefined,
            return_date: return_date ? new Date(return_date) : undefined,
            notes,
            loan_status,
            updated_at: new Date(),
          },
        });

        await t.loanItem.deleteMany({
          where: { loan_id: Number(id) },
        });

        if (loan_items.length > 0) {
          const loanItemsData = loan_items.map((item: any) => ({
            loan_id: Number(id),
            item_id: item.item_id,
            borrowed_quantity: item.borrowed_quantity || 1,
            borrow_condition: item.borrow_condition || null,
            return_condition: item.return_condition || null,
            returned_at: item.returned_at ? new Date(item.returned_at) : null,
          }));

          await t.loanItem.createMany({
            data: loanItemsData,
          });
        }

        return await t.loan.findUnique({
          where: { id: Number(id) },
          include: {
            borrower: {
              select: {
                id: true,
                name: true,
                student_id: true,
                major_name: true,
                academic_year: true,
                phone_number: true,
                organization: true,
              },
            },
            loan_items: {
              include: {
                item: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    category: true,
                    condition_status: true,
                    availability_status: true,
                  },
                },
              },
            },
          },
        });
      });

      successRes(res, 200, { data }, "Update successful");
    } else {
      const data = await prisma.loan.update({
        where: { id: Number(id) },
        data: {
          borrower_id,
          loan_date: loan_date ? new Date(loan_date) : undefined,
          due_date: due_date ? new Date(due_date) : undefined,
          return_date: return_date ? new Date(return_date) : undefined,
          notes,
          loan_status,
          updated_at: new Date(),
        },
        include: {
          borrower: {
            select: {
              id: true,
              name: true,
              student_id: true,
              major_name: true,
              academic_year: true,
              phone_number: true,
              organization: true,
            },
          },
          loan_items: {
            include: {
              item: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  category: true,
                  condition_status: true,
                  availability_status: true,
                },
              },
            },
          },
        },
      });

      successRes(res, 200, { data }, "Update successful");
    }
  } catch (e: any) {
    console.error("Error in updateLoan:", e);
    errorRes(res, 500, "Error updating loan", e.message);
  }
};
export const deleteLoan = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    
    const existingLoan = await prisma.loan.findUnique({
      where: { id: Number(id) },
    });

    if (!existingLoan) {
      errorRes(res, 404, "Loan not found");
      return;
    }

    const data = await prisma.loan.delete({
      where: { id: Number(id) },
    });
    
    successRes(res, 200, { data }, "Delete successful");
  } catch (e: any) {
    console.error("Error in deleteLoan:", e);
    errorRes(res, 500, "Error ", e.message);
  }
};

export const returnLoan = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { return_date, loan_items } = req.body;

    if (!return_date) {
      errorRes(res, 400, "return_date is required");
      return;
    }

    const data = await prisma.$transaction(async (t) => {
      await t.loan.update({
        where: { id: Number(id) },
        data: {
          return_date: new Date(return_date),
          loan_status: LoanStatus.returned,
          updated_at: new Date(),
        },
      });

      if (loan_items && Array.isArray(loan_items)) {
        for (const item of loan_items) {
          await t.loanItem.updateMany({
            where: {
              loan_id: Number(id),
              item_id: item.item_id,
            },
            data: {
              returned_at: new Date(return_date),
              return_condition: item.return_condition || null,
            },
          });
        }
      }

      return await t.loan.findUnique({
        where: { id: Number(id) },
        include: {
          borrower: {
            select: {
              id: true,
              name: true,
              student_id: true,
              major_name: true,
              academic_year: true,
              phone_number: true,
              organization: true,
            },
          },
          loan_items: {
            include: {
              item: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  category: true,
                  condition_status: true,
                  availability_status: true,
                },
              },
            },
          },
        },
      });
    });

    successRes(res, 200, { data }, "Return loan successful");
  } catch (e: any) {
    console.error("Error in returnLoan:", e);
    errorRes(res, 500, "Error returning loan", e.message);
  }
};