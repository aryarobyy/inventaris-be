import { ItemAvailability, ItemCategory, ItemCondition } from "./enums";

export interface LoanItemModel {
  id: number;
  loan_id: number;
  item_id: number;
  borrowed_quantity: number;
  borrow_condition: ItemCondition | null;
  return_condition: ItemCondition | null;
  item: {
    id: number;
    name: string;
  };
}

export interface ItemModel {
  id: number;
  name: string;
  description: string | null;
  quantity: number;
  borrowed_quantity: number;
  brand: string | null;
  imgUrl: string | null;
  pair_id: number | null;
  status_notes: string | null;
  created_at: Date;
  updated_at: Date;

  loan_items: LoanItemModel[] | [];
  category: ItemCategory;
  condition_status: ItemCondition;
  availability_status: ItemAvailability;
}

export interface PostItemModel {
  name: string;
  description: string | null;
  quantity: number | null;
  brand: string | null;
  imgUrl: string | null;
  pair_id: number | null;
  status_notes: string | null;

  category: ItemCategory;
  condition_status: ItemCondition;
  availability_status: ItemAvailability;
}

export interface UpdateItemModel {
  name: string | null;
  description: string | null;
  quantity: number | null;
  brand: string | null;
  imgUrl: string | null;
  pair_id: number | null;
  status_notes: string | null;

  category: ItemCategory;
  condition_status: ItemCondition;
  availability_status: ItemAvailability;
}

