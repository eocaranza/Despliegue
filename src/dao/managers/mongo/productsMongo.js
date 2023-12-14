import { productsModel } from "../../models/products.model.js";
import { addLogger } from "../../../helpers/logger.js";

const logger = addLogger();


export class ProductsMongo{
    constructor(){
        this.model = productsModel;
    };

    //get products
    async getProducts(){
        try{
            const products = await this.model.find().lean();
            return products;
        }catch(error){
            logger.error(error.message);
            throw new Error("Error al obtener los productos");
        }
    }

    //get products with paginate
    async getProductsWithPaginate(query, options){
        try{
            const products = await this.model.paginate(query, options);
            return products;
        }catch(error){
            logger.error(error.message);
            throw new Error("Error al obtener los productos");
        }
    }

    //save product
    async addProduct(productInfo){
        try{
            const duplicado = await this.model.findOne({code: productInfo.code}).exec();
            if(duplicado)
                return "Ya existe un producto con ese codigo"
            await this.model.create(productInfo);
            return true;
        }catch(error){
            return error.message;
        }
    }

    //get product by id
    async getProductById(id){
        try{
            const product = await this.model.findById(id);
            return product;
        }catch(error){
            logger.error(error.message);
            throw new Error("Error al obtener el producto");
        }
    }

    //update product
    async updateProduct(idProducto, producto){
        try{
            await this.model.findOneAndUpdate({_id: idProducto}, producto);
            return true;
        }catch(error){
            logger.error(error.message);
            throw new Error("Error al actualizar el producto");
        }
    }

    //delete product
    async deleteProduct(idProducto){
        try{
            await this.model.deleteOne({_id: idProducto});
            return true;
        }catch(error){
            logger.error(error.message);
            throw new Error("Error al eliminar el producto");
        }
    }
}