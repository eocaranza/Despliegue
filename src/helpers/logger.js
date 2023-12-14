import winston from "winston";
import dotenv from "dotenv";

dotenv.config();

const currenEnv = process.env.NODE_ENV;

const levels = {
    debug : 5,
    http : 4,
    info : 3,
    warning : 2,
    error : 1,
    fatal : 0
}

//crear el transporte
const devLogger = winston.createLogger({
    levels: levels,
    transports:[
        //definir los transportes del sistema de registros
        new winston.transports.Console({level:"debug"})
    ]
});

const prodLogger = winston.createLogger({
    levels: levels,
    transports:[
        //definir los transportes del sistema de registros
        new winston.transports.Console({level:"info"}),
        new winston.transports.File({filename:"./logs/errors.log", level:"error"})
    ]
});

//definir el logger dependiendo del ambiente

export const addLogger = () =>{
    let logger;
    if(currenEnv === "development"){
        logger = devLogger;
    }
    else{
        logger = prodLogger;
    }
    return logger;
};