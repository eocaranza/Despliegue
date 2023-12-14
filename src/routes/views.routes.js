import { Router } from "express";
import { checkRole, checkUserAuthenticated, showLoginView } from "../middlewares/auth.js";
import { ViewsController } from "../controllers/views.controller.js";

const router = Router();

router.get("/", checkUserAuthenticated, checkRole("user"), ViewsController.renderHome);

router.get("/registro", showLoginView, ViewsController.renderSignup);

router.get("/login", showLoginView, ViewsController.renderLogin);

router.get("/carts/:cid", ViewsController.renderCartById);

router.get("/products", checkUserAuthenticated, ViewsController.renderProducts);

router.get("/products/:pid", checkUserAuthenticated, ViewsController.renderProductById);

router.get("/mockingproducts", ViewsController.mocking);

router.get("/loggerTest", ViewsController.logger);

router.get("/forgot-password", ViewsController.renderForgot);

router.get("/reset-password", ViewsController.renderResetPass);

router.get("/userManager", checkUserAuthenticated, checkRole("admin"), ViewsController.renderUserManager);

export {router as viewsRouter};