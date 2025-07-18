import { LoanStatus } from "@prisma/client";
import { UserModel } from "./user.model";
import { LoanItemModel } from "./item.model";

export interface LoanModel {
  id: number;
  borrower: UserModel;
  borrower_id: number;
  loan_date: Date;
  due_date: Date;
  return_date?: Date | null;
  notes?: string | null;
  created_at: Date;
  updated_at: Date;
  loan_status: LoanStatus;
  loan_items: LoanItemModel[];
}

export interface PostLoanModel {
  borrower_id: number;
  loan_date: Date;
  due_date: Date;
  return_date?: Date | null;
  notes?: string | null;
  loan_status: LoanStatus
  loan_items: {
    item_id: number;
    quantity: number;
  }[];
}

export interface UpdateLoanModel {
  loan_date?: Date;
  due_date?: Date;
  return_date?: Date | null;
  notes?: string | null;
  loan_status?: LoanStatus;
  loan_items?: {
    item_id: number;
    quantity: number;
  }[];
}
