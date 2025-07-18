import { Role } from "./enums";

export interface AdminModel {
  id: number;
  username: string;
  name: string;
  status: boolean;
  created_at: Date;
  updated_at: Date;
  role: Role;
}

export interface PostAdminModel {
  username: string;
  name: string;
  password: string;
}

export interface LoginAdmin{
  username: string;
  password: string;
}

export interface UpdateAdminModel {
  username: string | null;
  name: string | null;
  password: string | null;
  status: boolean | null;
  role: Role | null;
}