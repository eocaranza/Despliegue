import mongoose from "mongoose";
import { productsCollection } from "../../constants/index.js";
import mongoosePaginate from "mongoose-paginate-v2";

// esquema de productos
const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    code:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true,
        enum:["Ropa", "Deportes", "Cosmetica"]
    },
    stock:{
        type: Number,
        required: true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }
});
productSchema.plugin(mongoosePaginate);
export const productsModel = mongoose.model(productsCollection, productSchema);