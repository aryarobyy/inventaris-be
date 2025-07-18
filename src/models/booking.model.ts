import { BookingStatus } from "./enums";

export interface RoomBookingModel {
  id: number;
  borrower_id: number;
  room_id: number;
  booking_date: Date;
  start_time: Date;
  end_time: Date;
  actual_return_time: Date | null; 
  purpose: string | null;
  notes: string | null;
  booking_status: BookingStatus;
  created_at: Date;
  updated_at: Date;
}

export interface PostRoomBookingModel {
  borrower_id: number;
  room_id: number;
  booking_date: Date;
  start_time: Date;
  end_time: Date;
  purpose: string | null;
  notes: string | null;
  booking_status: BookingStatus;
}

export interface UpdateRoomBookingModel {
  start_time: Date | null;
  end_time: Date | null;
  actual_return_time: Date | null;
  purpose: string | null;
  notes: string | null;
  booking_status: BookingStatus;
}