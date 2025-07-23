import express, { Request, Response } from "express";
import dotenv from "dotenv";
import UserRouter from "./route/user.route";
import AdminRouter from "./route/admin.route";
import ItemRouter from "./route/item.route";
import RoomRouter from "./route/room.route";
import BookingRouter from "./route/booking.route";
import LoanRouter from "./route/loan.route";
import cors from "cors";
import cron from "node-cron";
import { runOverdueLoans, runUpdateActiveLoans } from "./controller/loan.controller";

dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello World");
});

app.use(cors());

// app.use(cors({
//   origin: 'http://localhost:5173'
// }));

cron.schedule("0 0 * * *", async () => { //kalau server sudah publish ganti jadi 0 0
  console.log("⏰ Cron running...");
  await runUpdateActiveLoans();
  await runOverdueLoans();
  console.log("✅ Cron completed.");
})

app.use("/user", UserRouter);
app.use("/admin", AdminRouter);
app.use("/item", ItemRouter);
app.use("/room", RoomRouter);
app.use("/booking", BookingRouter);
app.use("/loan", LoanRouter)

app
  .listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
  })
  .on("error", (error) => {
    throw new Error(error.message);
  });
