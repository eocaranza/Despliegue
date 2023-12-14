import { cartDao } from "../dao/factory.js";

export class CartsService{
    static async getCarts(){
        return cartDao.getCarts();
    };

    static async getCartById(cartId){
        return cartDao.getCartById(cartId);
    };

    static async addCart(cart){
        return cartDao.addCart(cart);
    };

    static async addProduct(cartId, productId){
        return cartDao.addProduct(cartId, productId);
    };

    static async deleteProduct(cartId, productId){
        return cartDao.deleteProduct(cartId, productId);
    };

    static async deleteProducts(cartId){
        return cartDao.deleteProducts(cartId);
    };

    static async editCart(cartId, cart){
        return cartDao.editCart(cartId, cart);
    };

    static async editQuantity(cartId, productId, quantity){
        return cartDao.editQuantity(cartId, productId, quantity);
    };
}