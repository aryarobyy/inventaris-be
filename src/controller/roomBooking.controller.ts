import { NextFunction, Request, Response } from "express";
import { errorRes, successRes } from "../utils/response";
import prisma from "../prisma/prisma";

export const getBookings = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await prisma.roomBooking.findMany();
    successRes(res, 200, { data }, "Get booking successful");
  } catch (e: any) {
    console.error("Error in :", e);
    errorRes(res, 500, "Error ", e.message);
  }
};

export const addBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      borrower_id,
      room_id,
      booking_date,
      start_time,
      end_time,
      purpose,
      notes,
      booking_status,
    } = req.body;

    if (!borrower_id && !room_id && !booking_date && !start_time && !end_time) {
      errorRes(res, 400, "Field must be fulied");
    }
    const data = await prisma.roomBooking.create({
      data: {
        borrower_id,
        room_id,
        booking_date,
        start_time,
        end_time,
        purpose,
        notes,
        booking_status,
      },
    });
    successRes(res, 200, { data }, "booking successful");
  } catch (e: any) {
    console.error("Error in :", e);
    errorRes(res, 500, "Error ", e.message);
  }
};
export const getBookingById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = await prisma.roomBooking.findUnique({
      where: {
        id: Number(id),
      },
    });
    successRes(res, 200, { data }, "Successful");
  } catch (e: any) {
    console.error("Error in getBookingById:", e);
    errorRes(res, 500, "Error", e.message);
  }
};

export const updateBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      start_time,
      end_time,
      actual_return_time,
      purpose,
      notes,
      booking_status,
    } = req.body;
    const data = await prisma.roomBooking.update({
      where: {
        id: Number(id),
      },
      data: {
        start_time,
        end_time,
        actual_return_time,
        purpose,
        notes,
        booking_status,
      },
    });
    successRes(res, 200, { data }, "  successful");
  } catch (e: any) {
    console.error("Error in :", e);
    errorRes(res, 500, "Error ", e.message);
  }
};

export const deleteBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = await prisma.roomBooking.delete({
      where: { id: Number(id) },
    });
    successRes(res, 200, { data }, "  successful");
  } catch (e: any) {
    console.error("Error in :", e);
    errorRes(res, 500, "Error ", e.message);
  }
};
