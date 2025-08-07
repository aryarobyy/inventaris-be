import { NextFunction, Request, Response } from "express";
import { errorRes, successRes } from "../utils/response";
import prisma from "../prisma/prisma";
import { PostUserModel, UpdateUserModel, UserModel, UserIdentity } from "../models/user.model";

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
        const { name, identity_number, major_name, phone_number } = req.body;
        console.log("Adding user with data:", req.body);
        if (!name || !identity_number || !major_name || !phone_number) {
            errorRes(res, 400, "All fields are required");
            return
        }
        
        const existingUser = await prisma.user.findUnique({
            where: { identity_number }
        });

        if(existingUser) {
            errorRes(res, 409, "User with this student ID already exists");
            return;
        }

        const data: PostUserModel = await prisma.user.create({
            data: {
                name,
                identity_number,
                major_name,
                phone_number,
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
                identity_number: true,
                major_name: true,
                phone_number: true,
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
        const { name, identity_number, major_name, phone_number } = req.body;

        const data: UpdateUserModel = await prisma.user.update({
            where: { id: Number(id) },
            data: {
                name,
                identity_number,
                major_name,
                phone_number,
            }
        });

        successRes(res, 200, { data }, "update user successful");
    } catch (e: any) {
        console.error("Error in :", e);
        errorRes(res, 500, "Error ", e.message);
    }
}

export const getUserByIdentity = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> =>{
    try{
        const { nim } = req.body;
        if (!nim) {
            errorRes(res, 404, "NIM is required");
            return;
        }
        
        const data = await prisma.user.findUnique({
            where: { identity_number: nim },
        });

        if (!data) {
            errorRes(res, 404, "User not found");
            return;
        }

        successRes(res, 200, { data }, "get user by nim successful");
    } catch (e: any) {
        console.error("Error in :", e);
        errorRes(res, 500, "Error ", e.message);
    }
}

export const getIdentities = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const data: UserIdentity[]  = await prisma.user.findMany({
            select: {
                identity_number: true
            }
        })
    successRes(res, 200, { data }, "getting nim successful");
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