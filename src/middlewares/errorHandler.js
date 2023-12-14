import { EError } from "../enums/EError.js";

export const errorHandler = (error, req, res, next) =>{
    switch(error.code){
        case EError.AUTH_ERROR:
            res.status(401).send({status: "error", error: error.cause});
            break;
        case EError.INVALID_JSON:
            res.status(401).send({status: "error", error: error.cause});
            break;
        case EError.DATABASE_ERROR:
            res.status(500).send({status: "error", error: error.message});
            break;
        default:
            //res.status(500).send({status: "error", error: "error desconocido"});
            res.status(500).send({status: "error", error: error.message});
            break;
    }
    //next(error);
};