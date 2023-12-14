import jwt from 'jsonwebtoken';
import { config } from "../config/config.js";
import { gmailTransporter } from '../config/gmail.config.js';
import { addLogger } from "../helpers/logger.js";

const logger = addLogger();

export const generateEmailWithToken = (email, expireTime) => {
    //genera el token
    const token = jwt.sign({email}, config.gmail.secretToken, {expiresIn:expireTime});
    return token;
};

export const recoveryEmail = async(req, userEmail, emailToken) =>{
    try {
        const domain = `${req.protocol}://${req.get('host')}`;
        const link = `${domain}/reset-password?token=${emailToken}`;
        await gmailTransporter.sendMail({
            from: "Ecommerce Coder",
            to: userEmail,
            subject: "Establece tu contraseña",
            html: `
                <p> Solicitaste cambiar tu contraseña</p>
                <p> Da click en este enlace: <a href= ${link}> Restablecer contraseña </a> <p>
            `
        });
    } catch (error) {
        logger.error(error.message);
    }
};

export const deleteProductEmail = async(req, userEmail, emailToken) =>{
    try {
        await gmailTransporter.sendMail({
            from: "Ecommerce Coder",
            to: userEmail,
            subject: "Producto eliminado",
            html: `
                <p> Le informamos que uno de sus productos fue eliminado de nuestro ecommerce</p>
            `
        });
    } catch (error) {
        logger.error(error.message);
    }
};

export const inactivityEmail = async(req, userEmail, emailToken) =>{
    try {
        await gmailTransporter.sendMail({
            from: "Ecommerce Coder",
            to: userEmail,
            subject: "Usuario eliminado",
            html: `
                <p> Le informamos que su usuario fue eliminado por inactividad</p>
            `
        });
    } catch (error) {
        logger.error(error.message);
    }
};