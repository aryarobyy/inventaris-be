import { RoomStatus } from "./enums";

export interface RoomModel {
  id: number;
  room_name: string;
  pc_count: number;
  description?: string;
  capacity?: number;
  location?: string;
  room_status: RoomStatus;
  created_at: Date;
  updated_at: Date;
}

export interface PostRoomModel {
  room_name: string;
  pc_count?: number;
  description?: string;
  capacity?: number;
  location?: string;
  room_status: RoomStatus;
}

export interface UpdateRoomModel {
  room_name?: string;
  pc_count?: number;
  description?: string;
  capacity?: number;
  location?: string;
  room_status?: RoomStatus;
}
