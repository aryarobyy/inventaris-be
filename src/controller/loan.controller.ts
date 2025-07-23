import { NextFunction, Request, Response } from "express";
import { errorRes, successRes } from "../utils/response";
import prisma from "../prisma/prisma";
import { LoanModel, PostLoanModel, UpdateLoanModel } from "../models/loan.model";
import { LoanStatus } from "../models/enums";

export const getLoans = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data: LoanModel[] = await prisma.loan.findMany({
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
            created_at: true,
            updated_at: true,
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
                borrowed_quantity: true,
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


    if(!borrower_id && !loan_status){
      errorRes(res, 400, "Borrwoer_id and loan_status cannot be null")
      return
    }

    if (!loan_date || !due_date || isNaN(Date.parse(loan_date)) || isNaN(Date.parse(due_date))) {
      errorRes(res, 400, "Invalid or missing loan_date or due_date");
      return;
    }


    if (!Array.isArray(loan_items) || loan_items.length === 0) {
      errorRes(res, 400, "loan_items must be a non-empty array");
      return;
    }

    const borrower = await prisma.user.findUnique({
      where: { id: borrower_id },
    });

    if (!borrower) {
      errorRes(res, 400, "Borrower not found");
      return;
    }

    const itemIds = loan_items.map((item: any) => item.item_id);
    const items = await prisma.item.findMany({
      where: { id: { in: itemIds } },
    });

    if (items.length !== itemIds.length) {
      errorRes(res, 400, "One or more items not found");
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
    const data: LoanModel | null = await prisma.loan.findUnique({
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
            created_at: true,
            updated_at: true,
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
                borrowed_quantity: true,
                availability_status: true,
              },
            },
          },
        },
      },
    });
    if (!data) {
      errorRes(res, 404, "Loan data not found");
      return
    }
    successRes(res, 200, { data }, "Get By Id successful");
  } catch (e: any) {
    console.error("Error in :", e);
    errorRes(res, 500, "Error ", e.message);
  }
};

export const getLoanByStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { status } = req.params;
    const data: LoanModel[] = await prisma.loan.findMany({
      where: { loan_status: status as LoanStatus },
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
            created_at: true,
            updated_at: true,
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
                borrowed_quantity: true,
                availability_status: true,
              },
            },
          },
        },
      },
    });
    if (!data || data.length === 0) {
      errorRes(res, 404, "Loan data not found");
      return;
    }
    successRes(res, 200, { data }, "Get By Status successful");
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
      loan_date,
      due_date,
      return_date,
      notes,
      loan_status,
      loan_items,
    }: UpdateLoanModel = req.body;


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
          loan_status: 'returned',
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

export const runUpdateActiveLoans = async () => {
  const today = new Date().toISOString().split("T")[0]; 

  await prisma.loan.updateMany({
    where: {
      loan_status: "approved",
      loan_date: {
        lte: new Date(today), 
      },
    },
    data: {
      loan_status: "active",
    },
  });
};

export const runOverdueLoans = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  await prisma.loan.updateMany({
    where: {
      loan_status: "active",
      return_date: null, 
      due_date: {
        lt: today,
      },
    },
    data: {
      loan_status: "overdue",
    },
  });
};
