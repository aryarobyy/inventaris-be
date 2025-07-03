import { NextFunction, Request, Response } from "express";
import { errorRes, successRes } from "../utils/response";
import prisma from "../prisma/prisma";
import { PostUserModel, UpdateUserModel, UserModel } from "../models/user.model";

export const getUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> =>{
    try{
        const data: UserModel[] = await prisma.user.findMany();
        successRes(res, 200, { data }, "get users successful");
    } catch (e: any) {
        console.error("Error in :", e);
        errorRes(res, 500, "Error ", e.message);
    }
}

export const addUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> =>{
    try{
        const { name, student_id, academic_year, major_name, phone_number, organization } = req.body;
        if (!name || !student_id || !academic_year || !major_name || !phone_number || !organization) {
            errorRes(res, 400, "All fields are required");
            return
        }
        
        const existingUser = await prisma.user.findUnique({
            where: { student_id }
        });

        if(existingUser) {
            errorRes(res, 400, "User with this student ID already exists");
            return;
        }

        const data: PostUserModel = await prisma.user.create({
            data: {
                name,
                student_id,
                academic_year,
                major_name,
                phone_number,
                organization
            }
        });

        successRes(res, 200, { data }, "post user successful");
    } catch (e: any) {
        console.error("Error in :", e);
        errorRes(res, 500, "Error ", e.message);
    }
}

export const getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> =>{
    try{
        const { id }= req.params;
        const data: UserModel | null= await prisma.user.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                name: true,
                student_id: true,
                academic_year: true,
                major_name: true,
                phone_number: true,
                organization: true,
                created_at: true,
                updated_at: true
            }
        });
        if (!data) {
            errorRes(res, 404, "User not found");
            return;
        }
        successRes(res, 200, { data }, "getting user successful");
    } catch (e: any) {
        console.error("Error in :", e);
        errorRes(res, 500, "Error ", e.message);
    }
}

export const updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> =>{
    try{
        const { id }= req.params;
        const { name, student_id, academic_year, major_name, phone_number, organization } = req.body;

        const data: UpdateUserModel = await prisma.user.update({
            where: { id: Number(id) },
            data: {
                name,
                student_id,
                academic_year,
                major_name,
                phone_number,
                organization
            }
        });

        successRes(res, 200, { data }, "update user successful");
    } catch (e: any) {
        console.error("Error in :", e);
        errorRes(res, 500, "Error ", e.message);
    }
}

export const getUserByNim = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> =>{
    try{
        const { nim } = req.body;
        if (!nim) {
            errorRes(res, 400, "NIM is required");
            return;
        }
        
        const data = await prisma.user.findUnique({
            where: { student_id: nim },
            select: {
                id: true,
                name: true,
                student_id: true,
                academic_year: true,
                major_name: true,
                phone_number: true,
                organization: true,
                created_at: true,
                updated_at: true
            }
        });

        if (!data) {
            errorRes(res, 404, "User not found");
            return;
        }

        successRes(res, 200, { data }, "  successful");
    } catch (e: any) {
        console.error("Error in :", e);
        errorRes(res, 500, "Error ", e.message);
    }
}

export const deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> =>{
    try{
        const { id }= req.params;
        const data = await prisma.user.findUnique({
            where: { id: Number(id) }
        });

        successRes(res, 200, { data }, "delete successful");
    } catch (e: any) {
        console.error("Error in :", e);
        errorRes(res, 500, "Error ", e.message);
    }
}