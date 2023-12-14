import fs from "fs";
import {ProductManager} from "./ProductManager.js";
const fileProd = "./src/productos.json";
const prodManager = new ProductManager(fileProd);

export class CartManager{

    constructor (path){
        this.path = path;
    }

    async addCart(carritoNuevo){

        try {
            
            if(!carritoNuevo.products)
                return "Faltan campos";
            
            carritoNuevo.productos.array.forEach(element => {
                if(!element.id || !element.quantity)
                    return "Faltan campos";
                if(!(prodManager.getProductById(element.id)).id)
                    return "No existe un producto";
            });

            if(this.fileExist()){
                let ultId = 1;
                const contenido = await fs.promises.readFile(this.path, "utf-8");
                const carritos = JSON.parse(contenido);
                if(carritos.length)
                {
                    ultId = carritos[carritos.length-1].id + 1;
                }
                const existe = carritos.some((carrito) => {return carrito.id.toString() === carritoNuevo.id.toString().trim()});

                if(!existe){
                    carritoNuevo.id = ultId;
                    carritos.push(carritoNuevo);
                    await fs.promises.writeFile(this.path, JSON.stringify(carritos,null,'\t'));
                    return true;
                }
                else
                    return "Codigo repetido.";
            }
            else{
                await fs.promises.writeFile(this.path, JSON.stringify([carritoNuevo],null,'\t'));
                return "El archivo no existe";
            }
        } catch (error) {
            console.log(error.toString());
            return error.message;
        }
    }

    fileExist(){
        return fs.existsSync(this.path);
    }

    async getCarts(){
        try {
            if (this.fileExist()) {
                const contenido = await fs.promises.readFile(this.path, "utf-8");
                const contenidoJson = JSON.parse(contenido);
                return contenidoJson;
            } else {
                return console.log("El archivo no existe");
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    async getCartById(idCarrito){
        try {
            if (this.fileExist()) {
                const contenido = await fs.promises.readFile(this.path, "utf-8");
                const carritos = JSON.parse(contenido);
                const encontrado = carritos.find((carrito) => carrito.id === idCarrito);
                return encontrado.products;
            } else {
                return console.log("El carrito no existe");
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    async addProduct(idCarrito, idProducto){
        try {
            if (this.fileExist()) {
                if(!idProducto || !idCarrito)
                    return "Faltan campos";
                const existeProd = await prodManager.getProductById(idProducto);
                if(!existeProd)
                    return "El producto no existe";
                const existeCart = await this.getCartById(idCarrito);
                if(!existeCart)
                    return "No existe el carrito";

                const contenido = await fs.promises.readFile(this.path, "utf-8");
                const carritos = JSON.parse(contenido);
                const encontrado = carritos.find((carro) => carro.id === idCarrito);
                const prodEncontrado = encontrado.products.find((prod) => prod.product === idProducto);
                if(!prodEncontrado)
                    encontrado.products.push({"product":idProducto, "quantity":1});
                else
                    prodEncontrado.quantity = prodEncontrado.quantity + 1;
                await fs.promises.writeFile(this.path, JSON.stringify(carritos,null,'\t'));
                return true;
            } else {
                return "El archivo no existe";
            }
        } catch (error) {
            return error.message;
        }
    }
}