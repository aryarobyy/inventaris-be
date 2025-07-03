import { LoanItemModel } from "./loanItem.model";
import { RoomBookingModel } from "./roomBooking.model";

export interface UserModel {
  id: number;
  name: string;
  student_id: string;
  major_name: string;
  academic_year: string;
  phone_number: string;
  organization: string;
  created_at: Date;
  updated_at: Date;
  
  // Relations
  loans?: LoanItemModel[];
  roomBookings?: RoomBookingModel[];
}

export interface PostUserModel {
  name: string;
  student_id: string;
  major_name: string;
  academic_year: string;
  phone_number: string;
  organization: string;
}

export interface UpdateUserModel {
  name?: string;
  student_id?: string;
  major_name?: string;
  academic_year?: string;
  phone_number?: string;
  organization?: string;
}
