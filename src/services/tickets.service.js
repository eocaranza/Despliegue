import { ticketDao } from "../dao/factory.js";

export class TicketsService{
    static async getTickets(){
        return ticketDao.getTickets();
    };

    static async addTicket(ticket){
        return ticketDao.addTicket(ticket);
    };
}