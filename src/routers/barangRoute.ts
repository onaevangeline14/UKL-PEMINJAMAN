import { Router } from "express";
import { createBarang, getAllBarang, updateBarang, deleteBarang, getBarangbyID, returnBarang, borrowBarang,} from "../controller/Barang";
import { createValidation, updateValidation, validateAnalis, validateBorrowAnalis } from "../middlewares/BarangValidation";
import { verifyRole, verifyToken} from "../middlewares/authorization"
import { validateBorrow, validateReturn } from "../middlewares/Peminjaman";
import { analisis, borrowAnalysis } from "../controller/Analisis";



const app = Router();

app.post("/",[verifyToken, verifyRole (["Admin"]),createValidation], createBarang);0
app.get("/:id", [verifyToken, verifyRole (["Admin","User"])] ,getBarangbyID);
app.put("/:id", [verifyToken, verifyRole (["Admin"]),updateValidation], updateBarang);
app.delete("/:id",[verifyToken, verifyRole (["Admin"])],deleteBarang);
app.get("/", getAllBarang)

//peminjaman 
app.post("/borrow",[verifyToken,verifyRole(["Admin","User"]),validateBorrow],borrowBarang)
app.post("/return",[verifyToken,verifyRole(["Admin","User"]),validateReturn],returnBarang)
app.get("/inventory/usage-report",[verifyToken,verifyRole(["Admin"]),validateAnalis],analisis)
app.post("/borrow-analysis",[verifyToken,verifyRole(["Admin"]),validateBorrowAnalis,borrowAnalysis])


export default app
