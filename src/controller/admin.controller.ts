import { NextFunction, Request, Response } from "express";
import { errorRes, successRes } from "../utils/response";
import prisma from "../prisma/prisma";
import bcrypt from "bcryptjs";

export const getAdmins = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> =>{
    try{
        const data = await prisma.admin.findMany({
            select: {
                id: true,
                username: true,
                name: true,
                status: true,
                created_at: true,
                updated_at: true
            }
        });
        successRes(res, 200, { data }, "get data successful");
    } catch (e: any) {
        console.error("Error in :", e);
        errorRes(res, 500, "Error ", e.message);
    }
}

export const registerAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> =>{
    try{
        const { username, name, password } = req.body;
        if (!username || !name || !password) {
            errorRes(res, 400, "All fields are required");
            return
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        
        const newData = await prisma.admin.create({
            data: {
                username,
                password: hashedPassword,
                name,
            }
        });

        successRes(res, 200, { newData }, "add data successful");
    } catch (e: any) {
        console.error("Error in :", e);
        errorRes(res, 500, "Error ", e.message);
    }
}

export const loginAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
        errorRes(res, 400, "Username dan password wajib diisi");
        return;
        }

        const admin = await prisma.admin.findUnique({
        where: { username },
        });

        if (!admin) {
        errorRes(res, 401, "Username atau password salah");
        return;
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
        errorRes(res, 401, "Username atau password salah");
        return;
        }

        const { password: _, ...adminData } = admin;

        successRes(res, 200, adminData, "Login berhasil");
    } catch (e: any) {
        console.error("Login error:", e);
        errorRes(res, 500, "Terjadi kesalahan", e.message);
    }
};

export const getAdminById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> =>{
    try{
        const { id }= req.params;
        const data = await prisma.admin.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                name: true,
                username: true,
                status: true,
                role: true,
                created_at: true,
                updated_at: true
            }
        });
        if (!data) {
            errorRes(res, 404, "admin not found");
            return;
        }
        successRes(res, 200, { data }, "getting data successful");
    } catch (e: any) {
        console.error("Error in :", e);
        errorRes(res, 500, "Error ", e.message);
    }
}

export const updateAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> =>{
    try{
        const { id }= req.params;
        const { name, username, status } = req.body;

        const updatedData = await prisma.admin.update({
            where: { id: Number(id) },
            data: {
                name,
                username,
                status
            }
        });

        successRes(res, 200, { updatedData }, "update user successful");
    } catch (e: any) {
        console.error("Error in :", e);
        errorRes(res, 500, "Error ", e.message);
    }
}

export const deleteAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> =>{
    try{
        const { id }= req.params;
        const data = await prisma.admin.findUnique({
            where: { id: Number(id) }
        });

        successRes(res, 200, { data }, "delete successful");
    } catch (e: any) {
        console.error("Error in :", e);
        errorRes(res, 500, "Error ", e.message);
    }
}