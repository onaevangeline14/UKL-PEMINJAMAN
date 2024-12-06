import express from "express";
import { Router } from "express";
import UserRouter from "./routers/UserRoute";
import barangRouter from "./routers/barangRoute";

const app = express();

app.use(express.json());

app.use("/user", UserRouter);
app.use("/barang", barangRouter);


const PORT = 4000;
app.listen(PORT, () => {
  console.log(`server run on port ${PORT}`);
});