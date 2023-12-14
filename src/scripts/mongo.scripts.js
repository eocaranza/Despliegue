import mongoose from "mongoose";
import { productsModel } from "../dao/models/products.model.js";
import { config } from "../config/config.js";

const updateProducts = async() =>{
    try {
        await mongoose.connect(config.mongo.url);
        console.log("Base de datos conectada");
        const adminId = "65199cbb74b43f2391b77d4f";
        const result = await productsModel.updateMany({},{$set:{owner:adminId}});
        console.log(result);
    } catch (error) {
        throw error;
    } finally{
        await mongoose.connection.close();
    }
};

updateProducts();