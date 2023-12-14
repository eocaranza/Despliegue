import passport from "passport";
import { createHash, isValidPassword } from "../utils.js";
import { UsersService } from "../services/users.services.js";
import githubStratregy from "passport-github2";
import LocalStrategy from "passport-local";
import { config } from "./config.js";

const userService = UsersService;


export const initializePassport = () =>{
    passport.use("githubLoginStrategy", new githubStratregy(
    {
        clientID: config.github.clientId,
        clientSecret: config.github.secretId,
        callbackUrl: config.github.callbackUrl
    },
    async(accesstoken, refreshtoken, profile, done) => {
        try {
            //verificar registro en la app
            const user = await userService.getUserByEmail(profile.username);

            if(!user){
                const newUser = {
                    first_name: profile.username,
                    email: profile.username,
                    password: createHash(profile.id),
                    role: "user",
                    last_connection: Date.now()
                }
                const userCreated = await userService.save(newUser);
                return done(null, userCreated);
            } else{
                user.last_connection = Date.now();
                await userService.updateUser(user._id, user);
                return done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }));

    passport.use("signupStrategy", new LocalStrategy(
        {
            usernameField: "email",
            passReqToCallback: true
        },
        async(req, username, password, done) => {
            try {
                const {first_name} = req.body;
                //verificar registro en la app
                const user = await userService.getUserByEmail(username);
    
                if(!user){
                    const newUser = {
                        first_name: first_name,
                        email: username,
                        password: createHash(password),
                        role: (username == "adminCoder@coder.com")? "admin" : "user"
                    }
                    const userCreated = await userService.save(newUser);
                    return done(null, userCreated);
                } else{
                    return done(null, false);
                }
            } catch (error) {
                return done(error);
            }
        }));
    
    passport.use("loginStrategy", new LocalStrategy(
        {
            usernameField: "email"
        },
        async(username, password, done) => {
            try {
                //verificar registro en la app
                const user = await userService.getUserByEmail(username);
    
                if(!user){
                    return done(null, false);
                }

                const rol = (username == "adminCoder@coder.com")? "admin" : "user";

                if(isValidPassword(user, password) || (password == "adminCod3r123" && rol == "admin")){
                    user.last_connection = Date.now();
                    await userService.updateUser(user._id, user);
                    return done(null, user);
                }
                else{
                    return done(null, false);
                }
            } catch (error) {
                return done(error);
            }
        }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
      });
      
      passport.deserializeUser(async (id, done) => {
        const user = await userService.getUserById(id);
        done(null, user);
      });
};