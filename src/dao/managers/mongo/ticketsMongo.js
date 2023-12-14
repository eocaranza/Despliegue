import { ticketsModel } from "../../models/tickets.model.js";
import { addLogger } from "../../../helpers/logger.js";

const logger = addLogger();


export class ticketsMongo{
    constructor(){
        this.model = ticketsModel;
    };

    //get tickets
    async getTickets(){
        try{
            const tickets = await this.model.find().lean();
            return tickets;
        }catch(error){
            logger.error(error.message);
            throw new Error("Error al obtener los tickets");
        }
    }

    //save ticket
    async addTicket(ticketInfo){
        try{
            const duplicado = await this.model.findOne({code: ticketInfo.code}).exec();
            if(duplicado)
                return "Ya existe un ticket con ese codigo"
            await this.model.create(ticketInfo);
            return true;
        }catch(error){
            return error.message;
        }
    }
}