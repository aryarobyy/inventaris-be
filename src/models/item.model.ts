import { ItemAvailability, ItemCategory, ItemCondition } from "./enums";
import { LoanItemModel } from "./loanItem.model";

export interface ItemModel {
  id: number;
  name: string;
  description?: string;
  quantity: number;
  brand?: string;
  imgUrl?: string;
  pair_id?: number;
  status_notes?: string;
  created_at: Date;
  updated_at: Date;

  loan_items?: LoanItemModel[];
  category: ItemCategory;
  condition_status: ItemCondition;
  availability_status: ItemAvailability;
}

export interface PostItemModel {
  name: string;
  description?: string;
  quantity?: number;
  brand?: string;
  imgUrl?: string;
  pair_id?: number;
  status_notes?: string;

  category: ItemCategory;
  condition_status: ItemCondition;
  availability_status: ItemAvailability;
}

export interface UpdateItemModel {
  name?: string;
  description?: string;
  quantity?: number;
  brand?: string;
  imgUrl?: string;
  pair_id?: number;
  status_notes?: string;

  category?: ItemCategory;
  condition_status?: ItemCondition;
  availability_status?: ItemAvailability;
}

