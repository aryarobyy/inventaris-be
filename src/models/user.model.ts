import { RoomBookingModel } from "./booking.model";
import { LoanItemModel } from "./item.model";

export interface UserModel {
  id: number;
  name: string;
  student_id: string;
  major_name: string;
  phone_number: string;
  created_at: Date;
  updated_at: Date;
  
  loans?: LoanItemModel[];
  room_bookings?: RoomBookingModel[];
}

export interface PostUserModel {
  name: string;
  student_id: string;
  major_name: string;
  phone_number: string;
}

export interface UpdateUserModel {
  name?: string;
  student_id?: string;
  major_name?: string;
  phone_number?: string;
}

// user.model.ts
export type UserNim = {
    student_id: string;
}