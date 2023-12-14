import {Router} from "express";
import { CartsController } from "../controllers/carts.controller.js";
import { checkRole } from "../middlewares/auth.js";

const cartManager = CartsController;

const router = Router();

//definimos las rutas

router.get("/", cartManager.getCarts);

router.get("/:cid", cartManager.getCartById);

router.post("/", checkRole(["user", "premium"]), cartManager.addCart);

router.post("/:cid/product/:pid", checkRole(["user", "premium"]), cartManager.addProduct);

router.delete("/:cid/product/:pid", cartManager.deleteProduct);

router.delete("/:cid/", cartManager.deleteProducts);

router.put("/:cid/", cartManager.editCart);

router.put("/:cid/product/:pid", cartManager.editQuantity);

router.post("/:cid/purchase", cartManager.purchase);

router.get("/tickets/all", cartManager.getTickets);

export {router as cartsRouter}