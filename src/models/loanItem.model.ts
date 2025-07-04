import { ItemCondition } from "./enums";

export interface LoanItemModel {
  id: number;
  loan_id: number;
  item_id: number;
  borrowed_quantity: number;
  returned_at?: Date;
  borrow_condition?: ItemCondition;
  return_condition?: ItemCondition;
}

export interface PostLoanItemModel {
  loan_id?: number;
  item_id: number;
  borrowed_quantity?: number;
  borrow_condition?: ItemCondition;
}

export interface UpdateLoanItemModel {
  returned_at?: Date;
  return_condition?: ItemCondition;
  borrowed_quantity?: number;
}
