import { Router} from "express";
import { SessionsController } from "../controllers/sessions.controllers.js";
import passport from "passport";
import { checkUserAuthenticated } from "../middlewares/auth.js";

const router = Router();

router.get("/fail-signup", SessionsController.failSignup);

router.get("/fail-login", SessionsController.failLogin);

router.get("/logout", SessionsController.logout);

router.get("/loginGitHub", passport.authenticate("githubLoginStrategy"));

router.post("/login", passport.authenticate("loginStrategy",{
    failureRedirect: "/api/sessions/fail-login"
}), SessionsController.login);

router.get("/github-callback", passport.authenticate("githubLoginStrategy",{
    failureRedirect: "/api/sessions/signup"
}), SessionsController.githubCallback);

router.post("/signup", passport.authenticate("signupStrategy",{
    failureRedirect: "/api/sessions/fail-signup"
}), SessionsController.signup);

router.get("/current", SessionsController.current);

router.post("/forgot-password", SessionsController.forgotPassword);

router.post("/reset-password", SessionsController.resetPassword);

export {router as sessionRouter};