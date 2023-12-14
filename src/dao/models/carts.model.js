import mongoose from "mongoose";
import { cartsCollection } from "../../constants/index.js";
import { productsCollection } from "../../constants/index.js";
import mongoosePaginate from "mongoose-paginate-v2";

// esquema de carts
const cartSchema = new mongoose.Schema({
    products:
        [{
            product:{
            type: mongoose.Schema.Types.ObjectId,
            ref: productsCollection,
            required: true
            },
            quantity:{
                type: Number,
                default: 1,
                required: true
            }
        }],
});
cartSchema.plugin(mongoosePaginate);

export const cartsModel = mongoose.model(cartsCollection, cartSchema);