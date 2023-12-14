import { UsersService } from "../services/users.services.js";
import { generateEmailWithToken, inactivityEmail } from "../helpers/gmail.js";

export class UsersController{
    
    static modifyRole = async(req, res) =>{
        try {
            const userId = req.params.uid;
            const user = await UsersService.getUserById(userId);
            const userRole = user.role;

            let uploaded = false;
            let names = [];

            for (let i = 0; i < user.documents.length; i++) {
                names.push(user.documents[i].name);
            }

            uploaded = names.includes('Identificacion') &&
                        names.includes('Comprobante de domicilio') &&
                        names.includes('Comprobante de estado de cuenta');

            if(userRole === "user")
                if(uploaded)
                    user.role = "premium";
                else
                return res.json({status: "error", message: "Son necesarios documentos"});
            else
            if(userRole === "premium")
                user.role = "user";
            else
            if(userRole === "admin")
                return res.json({status: "error", message: "No se puede cambiar el rol de este usuario"});
            
            await UsersService.updateUser(user._id, user);
            return res.json({status: "success", message: "Se ha cambiado el rol de este usuario"});
        } catch (error) {
            console.log(error.message);
        }
    };

    static uploadFiles = async(req, res) =>{
        try {
            const userId = req.params.uid;
            const user = await UsersService.getUserById(userId);

            const reference = req.file.path;
            console.log(reference);

            user.documents.push({
                name: req.body.name,
                reference: req.file.path
            });

            await UsersService.updateUser(userId, user);

            return res.json({status: "success", message: "Se ha subido la documentación"});
        } catch (error) {
            console.log(error.message);
        }
    };

    static getAllUsers = async(req, res) =>{
        const users = await UsersService.getAllUsersLimited();
        //const users = await UsersService.getAllUsers();
        res.json({status: "success", data: users});
    };

    static deleteInactive = async(req, res) => {
        const users = await UsersService.getAllUsers();
        var currentdate = new Date();
        var difference;
        users.forEach(async (user) => {
            difference = parseInt((currentdate.getTime() - new Date(user.last_connection).getTime())/(1000 * 60 * 60 * 24));
            if(difference > 2){
                await UsersService.deleteUser(user._id);
                const email = user.email;
                const token = generateEmailWithToken(email, 3600)
                await inactivityEmail(req, email, token);
            }
            
        });
        res.json({status: "success", message: "Se borraron usuarios inactivos"});
    };

    static deleteUser = async(req, res) => {
        const userId = req.params.uid;
        await UsersService.deleteUser(userId);
        res.json({status: "success", message: "Se borró con éxito el usuario"});
    };
}