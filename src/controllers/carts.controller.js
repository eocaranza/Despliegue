import { CartsService } from "../services/carts.services.js";
import { ProductsService } from "../services/products.services.js";
import { TicketsService } from "../services/tickets.service.js";
import { CartDto } from "../dao/dto/cart.dto.js";
import { TicketDto } from "../dao/dto/ticket.dto.js";
import {v4 as uuidv4} from 'uuid';

export class CartsController{

    static async getCarts(req, res){
        const limit = req.query.limit;
        const recibidos = await CartsService.getCarts();
        if(limit)
        {
            const filtrados = recibidos.splice(0,limit);
            res.json({status: "success", data: filtrados});
        }
        else
            res.json({status: "success", data: recibidos});
    }

    static async getCartById(req, res){
        const cartId = req.params.cid;
        const recibido = await CartsService.getCartById(cartId);
        //const cart = recibidos.find(carrito => carrito.id === cartId);
        if(!recibido){
            res.status(404).json({status: "error", message: "El carrito no existe"});
        }
        else
            res.json({status: "success", data: recibido});
    }

    static async addCart(req, res){
        const dtoInfo = new CartDto(req.body);
        const recibido = await CartsService.addCart(dtoInfo);
        if(recibido._id)
            res.json({status: "success", message: recibido});
        else
            res.json({status: "error", message: recibido});
    }

    static async addProduct(req, res){
        const cartId = req.params.cid;
        const prodId = req.params.pid;

        const producto = await ProductsService.getProductById(prodId);
        
        if((req.user.role === "premium" && producto.owner.toString() === req.user._id.toString())){
            res.json({status: "error", message: "No puede agregar un producto creado por usted"});
        }
        else{
        const recibido = await CartsService.addProduct(cartId,prodId);
        if(recibido === true)
            res.json({status: "success", message: "Producto agregado"});
        else
            res.json({status: "error", message: recibido});
        }
    }

    static async deleteProduct(req, res){
        const cartId = req.params.cid;
        const prodId = req.params.pid;
        const recibido = await CartsService.deleteProduct(cartId,prodId);
        if(recibido === true)
            res.json({status: "success", message: "Producto elminado"});
        else
            res.json({status: "error", message: recibido});
    }

    static async deleteProducts(req, res){
        const cartId = req.params.cid;
        const recibido = await CartsService.deleteProducts(cartId);
        if(recibido === true)
            res.json({status: "success", message: "Productos elminados"});
        else
            res.json({status: "error", message: recibido});
    }

    static async editCart(req, res){
        const cartId = req.params.cid;
        const dtoInfo = new CartDto(req.body);
        const recibido = await CartsService.editCart(cartId, dtoInfo);
        if(recibido)
            res.json({status: "success", message: "Carrito actualizado"});
        else
            res.json({status: "error", message: recibido});
    }

    static async editQuantity(req, res){
        const cartId = req.params.cid;
        const prodId = req.params.pid;
        const recibido = await CartsService.editQuantity(cartId, prodId, req.body);
        if(recibido)
            res.json({status: "success", message: "Carrito actualizado"});
        else
            res.json({status: "error", message: recibido});
    }

    static async getTickets(req, res){
        const recibidos = await TicketsService.getTickets();
        res.json({status: "success", data: recibidos});
    }

    static async purchase(req, res){
        const cartId = req.params.cid;
        const recibido = await CartsService.getCartById(cartId);
        if(recibido){

            const dtoInfo = new TicketDto(req.body);
            let prodId;
            let producto;
            let purchased = [];
            let rejected = [];
            let suma = 0;

            for(let i = 0; i< recibido.products.length; i++){
                prodId = recibido.products[i].product._id;
                producto = await ProductsService.getProductById(prodId);
                if(producto.stock >= recibido.products[i].quantity){
                    purchased.push(prodId);
                    producto.stock = producto.stock - recibido.products[i].quantity;
                    await ProductsService.updateProduct(prodId, producto);
                    suma += producto.price * recibido.products[i].quantity;
                }
                else
                    rejected.push(producto._id);
            }

            for(let i = 0; i< purchased.length; i++){
                await CartsService.deleteProduct(cartId,purchased[i].toString());
            }

            if(suma > 0){
                const nuevoTicket = await TicketsService.addTicket({
                    code: uuidv4(),
                    purchase_datetime: new Date(),
                    amount: suma,
                    //purchaser: req.user.email
                });
            }
            if(rejected.length > 0)
            res.json({status: "success", rejected: rejected});
                else
            res.json({status: "success", message: "Compra realizada"});
        }
        else
            res.json({status: "error", message: "No existe el carrito"});
    }
}