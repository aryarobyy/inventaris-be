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
    const rawData = await prisma.loan.findMany({
      include: {
        borrower: true,
        loan_items: {
          include: {
            item: true,
          },
        },
      }
    });

    const calculatePriority = (loan: any) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); 
      
      const loanDate = new Date(loan.loan_date);
      const dueDate = new Date(loan.due_date);
      
      loanDate.setHours(0, 0, 0, 0);
      dueDate.setHours(0, 0, 0, 0);
      
      let priority = 0;
      
      if (loan.loan_status === 'overdue') {
        priority += 1000;
      }
      
      if (dueDate >= today) {
        priority += 100;
        const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        priority += Math.max(0, 50 - daysUntilDue); 
      }
      
      const daysSinceLoan = Math.abs(Math.ceil((today.getTime() - loanDate.getTime()) / (1000 * 60 * 60 * 24)));
      priority += Math.max(0, 30 - daysSinceLoan);
      
      return priority;
    };

    const sortedData = rawData
      .map(loan => ({
        ...loan,
        priority: calculatePriority(loan)
      }))
      .sort((a, b) => b.priority - a.priority) 
      .map(loan => {
        const { priority, ...loanWithoutPriority } = loan;
        return loanWithoutPriority;
      });

    successRes(res, 200, { data: sortedData }, "get Loans successful");
  } catch (e: any) {
    console.error("Error in getLoans:", e);
    errorRes(res, 500, "Error getting loans", e.message);
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

    if (!borrower_id || !loan_status) {
      errorRes(res, 400, "Borrower_id and loan_status cannot be null");
      return;
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

    const itemStockMap = new Map();
    items.forEach(item => {
      itemStockMap.set(item.id, { stock: item.stock, name: item.name });
    });

    for (const item of loan_items) {
      if (!item.item_id || typeof item.item_id !== 'number') {
        errorRes(res, 400, "Each loan item must have a valid item_id");
        return;
      }
      if (item.borrowed_quantity && (typeof item.borrowed_quantity !== 'number' || item.borrowed_quantity <= 0)) {
        errorRes(res, 400, "borrowed_quantity must be a positive number");
        return;
      }
    }

    const data: PostLoanModel = await prisma.$transaction(async (t) => {
      for (const item of loan_items) {
        const itemDetails = itemStockMap.get(item.item_id);
        if (!itemDetails || itemDetails.stock < item.borrowed_quantity) {
          throw new Error(`Not enough stock for item: ${itemDetails?.name}. Available: ${itemDetails?.stock}, Requested: ${item.borrowed_quantity}`);
        }
      }

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

      const loanWithItems = await t.loan.findUnique({
        where: { id: loan.id },
        include: {
          borrower: true,
          loan_items: {
            include: {
              item: true,
            },
          },
        },
      });

      return {
        borrower_id: loanWithItems!.borrower_id,
        loan_date: loanWithItems!.loan_date,
        due_date: loanWithItems!.due_date,
        return_date: loanWithItems!.return_date,
        notes: loanWithItems!.notes,
        loan_status: loanWithItems!.loan_status,
        loan_items: loanWithItems!.loan_items.map((loanItem: any) => ({
          item_id: loanItem.item_id,
          quantity: loanItem.borrowed_quantity,
        })),
      } as PostLoanModel;
    });

    successRes(res, 200, { data }, "Add loan successful");
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
        borrower: true,
        loan_items: {
          select: {
            id: true,
            item: true,
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
    const data = await prisma.loan.findMany({
      where: { loan_status: status as LoanStatus },
      include: {
        borrower: true,
        loan_items: {
          include: {
            item: true,
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
    const loanId = Number(id);
    const {
      loan_date,
      due_date,
      return_date,
      notes,
      loan_status,
      loan_items,
      approved_by_id,
    }: UpdateLoanModel = req.body;

    const existingLoan = await prisma.loan.findUnique({
      where: { id: loanId },
      include: {
        loan_items: true,
      },
    });

    if (!existingLoan) {
      errorRes(res, 404, "Loan not found");
      return;
    }

    if (loan_items && !Array.isArray(loan_items)) {
      errorRes(res, 400, "loan_items must be an array");
      return;
    }

    if (loan_status && loan_status === existingLoan.loan_status) {
      errorRes(res, 400, `Loan is already ${loan_status}`);
      return;
    }

    if(!approved_by_id) {
      errorRes(res, 400, "Admin who approved is required for updating loan status");
      return;
    }
    
    const data = await prisma.$transaction(async (t) => {
        const loanUpdateData = {
            loan_date: loan_date ? new Date(loan_date) : existingLoan.loan_date,
            due_date: due_date ? new Date(due_date) : existingLoan.due_date,
            return_date: return_date ? new Date(return_date) : existingLoan.return_date,
            notes: notes ?? existingLoan.notes,
            loan_status: loan_status ?? existingLoan.loan_status,
            approved_by_id: approved_by_id,
            updated_at: new Date(),
        };

        if (loanUpdateData.loan_status === 'returned' && existingLoan.loan_status !== 'returned') {
            const itemsInLoan = await t.loanItem.findMany({ where: { loan_id: loanId } });
            
            for (const item of itemsInLoan) {
                await t.item.update({
                    where: { id: item.item_id },
                    data: { 
                        stock: { increment: item.borrowed_quantity },
                        borrowed_quantity: { decrement: item.borrowed_quantity }
                    }
                });
            }
        }
        
        if (loanUpdateData.loan_status === 'approved' && existingLoan.loan_status !== 'approved') {
            let itemsToProcess;
            
            if (loan_items && loan_items.length > 0) {
                itemsToProcess = loan_items;
            } else {
                const existingItems = await t.loanItem.findMany({ where: { loan_id: loanId } });
                itemsToProcess = existingItems.map(item => ({
                    item_id: item.item_id,
                    borrowed_quantity: item.borrowed_quantity
                }));
            }

            const itemIds = itemsToProcess.map((item: any) => item.item_id);
            const itemsDb = await t.item.findMany({ where: { id: { in: itemIds } } });
            const itemStockMap = new Map(itemsDb.map(item => [item.id, item]));

            for (const item of itemsToProcess) {
                const dbItem = itemStockMap.get(item.item_id);
                if (!dbItem || dbItem.stock < item.borrowed_quantity) {
                    throw new Error(`Not enough stock for item: ${dbItem?.name || 'Unknown'}. Available: ${dbItem?.stock || 0}, Requested: ${item.borrowed_quantity}`);
                }
            }

            for (const item of itemsToProcess) {
                await t.item.update({
                    where: { id: item.item_id },
                    data: { 
                        stock: { decrement: item.borrowed_quantity },
                        borrowed_quantity: { increment: item.borrowed_quantity }
                    }
                });
            }
        }

        if (loan_items) {
          if (loanUpdateData.loan_status === 'approved' && existingLoan.loan_status === 'approved') {
            const oldItems = await t.loanItem.findMany({ where: { loan_id: loanId } });
            for (const item of oldItems) {
                await t.item.update({
                    where: { id: item.item_id },
                    data: { 
                        stock: { increment: item.borrowed_quantity },
                        borrowed_quantity: { decrement: item.borrowed_quantity }
                    }
                });
            }
          }
          
          await t.loanItem.deleteMany({ where: { loan_id: loanId } });
          
          if (loan_items.length > 0) {
            const loanItemsData = loan_items.map((item: any) => ({
              loan_id: loanId,
              item_id: item.item_id,
              borrowed_quantity: item.borrowed_quantity || 1,
              borrow_condition: item.borrow_condition || null,
              return_condition: item.return_condition || null,
              returned_at: item.returned_at ? new Date(item.returned_at) : null,
            }));
            await t.loanItem.createMany({ data: loanItemsData });

            if (loanUpdateData.loan_status === 'approved' && existingLoan.loan_status === 'approved') {
              const itemIds = loan_items.map((item: any) => item.item_id);
              const itemsDb = await t.item.findMany({ where: { id: { in: itemIds } } });
              const itemStockMap = new Map(itemsDb.map(item => [item.id, item]));

              for (const item of loan_items) {
                const dbItem = itemStockMap.get(item.item_id);
                if (!dbItem || dbItem.stock < item.borrowed_quantity) {
                    throw new Error(`Not enough stock for item: ${dbItem?.name || 'Unknown'}. Available: ${dbItem?.stock || 0}, Requested: ${item.borrowed_quantity}`);
                }
              }

              for (const item of loan_items) {
                await t.item.update({
                    where: { id: item.item_id },
                    data: { 
                        stock: { decrement: item.borrowed_quantity },
                        borrowed_quantity: { increment: item.borrowed_quantity }
                    }
                });
              }
            }
          }
        }
        
        const updatedLoan = await t.loan.update({
          where: { id: loanId },
          data: loanUpdateData,
          include: {
            approved_by: true,
            borrower: true,
            loan_items: {
              include: {
                item: true,
              },
            },
          },
        });

        return updatedLoan;
    });

    successRes(res, 200, { data }, "Update successful");
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
          borrower: true,
          loan_items: {
            include: {
              item: true,
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

export const getLoansWithFilters = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { 
      start_date, 
      end_date, 
      status, 
      overdue_only = 'false',
      sort_by = 'priority'  
    } = req.query;

    let whereClause: any = {};

    if (start_date || end_date) {
      whereClause.loan_date = {};
      if (start_date) {
        whereClause.loan_date.gte = new Date(start_date as string);
      }
      if (end_date) {
        whereClause.loan_date.lte = new Date(end_date as string);
      }
    }

    if (status) {
      whereClause.loan_status = status;
    }

    if (overdue_only === 'true') {
      whereClause.loan_status = 'overdue';
    }

    const rawData = await prisma.loan.findMany({
      where: whereClause,
      include: {
        borrower: true,
        loan_items: {
          include: {
            item: true,
          },
        },
      }
    });

    const calculatePriority = (loan: any) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const loanDate = new Date(loan.loan_date);
      const dueDate = new Date(loan.due_date);
      
      loanDate.setHours(0, 0, 0, 0);
      dueDate.setHours(0, 0, 0, 0);
      
      let priority = 0;
      
      if (loan.loan_status === 'overdue') {
        priority += 1000;
      }
      
      if (dueDate >= today) {
        priority += 100;
        const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        priority += Math.max(0, 50 - daysUntilDue);
      }
      
      const daysSinceLoan = Math.abs(Math.ceil((today.getTime() - loanDate.getTime()) / (1000 * 60 * 60 * 24)));
      priority += Math.max(0, 30 - daysSinceLoan);
      
      return priority;
    };

    let sortedData = rawData.map(loan => ({
      ...loan,
      priority: calculatePriority(loan)
    }));

    switch (sort_by) {
      case 'loan_date':
        sortedData.sort((a, b) => new Date(b.loan_date).getTime() - new Date(a.loan_date).getTime());
        break;
      case 'due_date':
        sortedData.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
        break;
      case 'priority':
      default:
        sortedData.sort((a, b) => b.priority - a.priority);
        break;
    }

    const finalData = sortedData.map(loan => {
      const { priority, ...loanWithoutPriority } = loan;
      return loanWithoutPriority;
    });

    successRes(res, 200, { 
      data: finalData,
      total: finalData.length,
      filters_applied: {
        start_date,
        end_date,
        status,
        overdue_only,
        sort_by
      }
    }, "get Loans with filters successful");
  } catch (e: any) {
    console.error("Error in getLoansWithFilters:", e);
    errorRes(res, 500, "Error getting loans with filters", e.message);
  }
};