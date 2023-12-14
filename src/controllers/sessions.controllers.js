import { UserDto } from "../dao/dto/user.dto.js";
import { UsersService } from '../services/users.services.js'
import { generateEmailWithToken, recoveryEmail } from "../helpers/gmail.js";
import { validateToken, createHash, isValidPassword } from "../utils.js";

export class SessionsController{

    static async signup(req, res){
        res.redirect("/products");
    }

    static async failSignup(req, res){
        res.render("signup", {error: "No se pudo registrar el usuario"})
    }

    static async login(req, res){
        res.redirect("/products");
    }
    
    static async failLogin(req, res){
        res.render("login", {error: "Error al iniciar sesion"})
    }

    static async githubCallback(req, res){
        res.redirect("/products");
    }

    static async logout(req, res){
        req.session.destroy(error => {
            if(error) return res.redirect("/products");
            else return res.redirect("/");
        });
    }

    static async current(req, res){
        if(req.user){
            const userData = req.user;
            const dtoInfo = new UserDto(userData);    
            res.render("current", {user: dtoInfo});
        }
        else
            res.render("current", {error: "No se encuentra loggeado"});
    }

    static async forgotPassword(req, res){
        try {
            const {email} = req.body;
            const user = await UsersService.getUserByEmail(email);
            if(!user)
                return res.json({status: "error", error: "El usuario no existe"});

            const token = generateEmailWithToken(email, 3600)
            await recoveryEmail(req, email, token);
            res.send("Correo enviado");
        } catch (error) {
            console.log(error.message);
        }
    }

    static async resetPassword(req, res){
        try {
            const token = req.query.token;
            const {newPassword} = req.body;
            const validEmail = validateToken(token);

            if(validEmail)
            {
                const user = await UsersService.getUserByEmail(validEmail);
                
                if(user){
                    if(isValidPassword(user, newPassword))
                        res.send("La contraseña debe ser diferente de la anterior");
                    user.password = createHash(newPassword);
                    await UsersService.updateUser(user._id, user);
                        res.send("Contraseña actualizada");
                }
            }
            else{
                return res.send("El token ya caducó, <a href='/forgot-password'>Restablecer contraseña<a/>");
            }
        } catch (error) {
            console.log(error);
        }
    }
}