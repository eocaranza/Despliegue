import {Router} from "express";
import { ProductsController } from "../controllers/products.controller.js";
import { checkRole } from "../middlewares/auth.js";

const prodManager = ProductsController;
const router = Router();


//definimos las rutas
router.get("/", prodManager.getProducts);

router.get("/:pid", prodManager.getProductById);

router.post("/", checkRole(["admin", "premium"]), prodManager.addProduct);

router.put("/:pid", checkRole(["admin", "premium"]), prodManager.updateProduct);

router.delete("/:pid", checkRole(["admin", "premium"]), prodManager.deleteProduct);

export {router as productsRouter}