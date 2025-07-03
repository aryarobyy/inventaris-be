import express, { Request, Response } from "express";
import dotenv from "dotenv";
import userRouter from "./route/user.route";
import AdminRouter from "./route/admin.route";
import ItemRouter from "./route/item.route";

dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(express.json());

app.get("/", (req: Request, res: Response) => { 
  res.status(200).send("Hello World");
}); 

app.use("/user" ,userRouter);
app.use("/admin" ,AdminRouter);
app.use("/item" ,ItemRouter);

app.listen(PORT, () => { 
  console.log("Server running at PORT: ", PORT); 
}).on("error", (error) => {
  throw new Error(error.message);
});