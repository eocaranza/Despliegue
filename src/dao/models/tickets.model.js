import mongoose from "mongoose";
import { ticketsCollection } from "../../constants/index.js";
import mongoosePaginate from "mongoose-paginate-v2";

// esquema de tickets
const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    purchase_datetime:{
        type: Date
    },
    amount:{
        type: Number,
        required: true
    },
    purchaser:{
        type: String
    }
});
ticketSchema.plugin(mongoosePaginate);
export const ticketsModel = mongoose.model(ticketsCollection, ticketSchema);