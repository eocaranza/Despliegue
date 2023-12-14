import mongoose from "mongoose";

// nombre de la coleccion de chats
const chatCollection = "chatMessages";

// esquema de chats
const messageSchema = new mongoose.Schema({
    user:{
        type: String,
        required: true
    },
    message:{
        type: String,
        required: true
    }
});

export const chatModel = mongoose.model(chatCollection, messageSchema);