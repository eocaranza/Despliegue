import express from "express";
import { productsRouter } from "./routes/products.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { viewsRouter } from "./routes/views.routes.js";
import { config } from "./config/config.js";
import { engine } from 'express-handlebars';
import { __dirname } from "./utils.js";
import path from 'path';
import { Server } from "socket.io";
import { chatModel } from "./dao/models/chat.model.js";
import { sessionRouter } from "./routes/session.routes.js";
import { usersRouter } from "./routes/users.routes.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import {initializePassport} from "./config/passportConfig.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { addLogger } from "./helpers/logger.js";
import { swaggerSpecs } from "./config/swagger.config.js";
import swaggerUI from 'swagger-ui-express';

const logger = addLogger();

const port = config.server.port;
//creamos la aplicacion del servidor
const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "/public")));

//configuracion de sesiones
app.use(session({
    store:MongoStore.create({
        ttl:40,
        mongoUrl: config.mongo.url
    }),
    secret: config.server.secretSession,
    resave: true,
    saveUninitialized: true
}));

//configuracion de handlebars
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, "/views"));

//configuración de passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions",sessionRouter);
app.use("/api/users",usersRouter);
app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpecs));
app.use(viewsRouter);
app.use(errorHandler);

//levantar el servidor
const httpServer = app.listen(port,()=>logger.info(`El servidor esta escuchando en el puerto ${port}`));

app.on("error", (error) => {
    logger.error('Error en el servidor:', error);
});

//crear server websocket
const socketServer = new Server(httpServer);

//socket server
socketServer.on("connection",(socket)=>{
    logger.info("Nuevo cliente conectado");
    
    socket.on("authenticated", async (msg)=>{
        const messages = await chatModel.find();
        socket.emit("messageHistory", messages);
        socket.broadcast.emit("newUser",msg);
    });

    //recibir el mensaje del cliente
    socket.on("message", async (data)=>{
        logger.info("data",data);
        const messageCreated = await chatModel.create(data);
        const messages = await chatModel.find();
        socketServer.emit("messageHistory", messages);
    })
});

export {app}