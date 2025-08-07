import { LoanStatus } from "./enums";


export interface LoanModel {
  id: number;
  loan_date: Date;
  due_date: Date;
  return_date?: Date | null;
  notes?: string | null;
  loan_status: LoanStatus;
  approved_by_id: number | null;
  borrower: {
    id: number;
    name: string;
    identity_number: string;
    major_name: string;
    phone_number: string;
  };
  loan_items: {
    id: number;
    item: {
      id: number;
      name: string;
      description: string | null;
      category: string;
      condition_status: string;
      availability_status: string;
      borrowed_quantity: number;
      stock: number;
      quantity: number;
    };
  }[];
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
    borrowed_quantity: number;
    quantity: number;
  }[];
}

export interface UpdateLoanModel {
  loan_date?: Date;
  due_date?: Date;
  return_date?: Date | null;
  notes?: string | null;
  loan_status?: LoanStatus;
  approved_by_id?: number;
  loan_items?: {
    item_id: number;
    borrowed_quantity: number;
    quantity: number;
  }[];
}