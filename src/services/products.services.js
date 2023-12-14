import { productDao } from "../dao/factory.js";

export class ProductsService{
    static async getProducts(){
        return productDao.getProducts();
    };

    static async getProductById(productId){
        return productDao.getProductById(productId);
    };

    static async addProduct(product){
        return productDao.addProduct(product);
    };

    static async updateProduct(productId, product){
        return productDao.updateProduct(productId, product);
    };

    static async deleteProduct(productId){
        return productDao.deleteProduct(productId);
    };

    static async getProductsWithPaginate(query, options){
        return productDao.getProductsWithPaginate(query, options);
    };
}