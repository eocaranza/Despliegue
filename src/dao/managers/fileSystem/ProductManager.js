import fs from "fs";

export class ProductManager{

    constructor (path){
        this.path = path;
    }

    async addProduct(productoNuevo){

        try {
            
            if(!productoNuevo.title || !productoNuevo.description || !productoNuevo.code ||
                !productoNuevo.price || !productoNuevo.stock || !productoNuevo.category){
                return "Faltan campos";
                }

            if(this.fileExist()){
                let ultId = 1;
                const contenido = await fs.promises.readFile(this.path, "utf-8");
                const productos = JSON.parse(contenido);
                if(productos.length)
                {
                    ultId = productos[productos.length-1].id + 1;
                }
                const existe = productos.some((producto) => {return producto.code.toString() === productoNuevo.code.toString().trim()});

                if(!existe){
                    productoNuevo.id = ultId;
                    productoNuevo.status = true;
                    productos.push(productoNuevo);
                    await fs.promises.writeFile(this.path, JSON.stringify(productos,null,'\t'));
                    return true;
                }
                else
                {
                    return "Codigo repetido.";
                }
            }
            else{
                await fs.promises.writeFile(this.path, JSON.stringify([productoNuevo],null,'\t'));
                return "El archivo no existe";
            }
        } catch (error) {
            return error.message;
        }
    }

    fileExist(){
        return fs.existsSync(this.path);
    }

    async getProducts(){
        try {
            if (this.fileExist()) {
                const contenido = await fs.promises.readFile(this.path, "utf-8");
                const contenidoJson = JSON.parse(contenido);
                return contenidoJson;
            } else {
                return console.log("El producto no existe");
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    async getProductById(idProducto){
        try {
            if (this.fileExist()) {
                const contenido = await fs.promises.readFile(this.path, "utf-8");
                const productos = JSON.parse(contenido);
                return productos.find((producto) => producto.id === idProducto);
            } else {
                return console.log("El producto no existe");
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    async updateProduct(idProducto, producto){
        try {
            if (this.fileExist()) {
                const contenido = await fs.promises.readFile(this.path, "utf-8");
                const productos = JSON.parse(contenido);
                let existe;
                if(!producto.code)
                    existe = false;
                else
                    existe = productos.some((product) => {return product.code.toString() === producto.code.toString().trim()});
                if(!existe){
                    const encontrado = productos.find((producto) => producto.id === idProducto);
                    Object.keys(encontrado).forEach(function(x) {
                        if (typeof producto[x] !== "undefined")
                            encontrado[x] = producto[x];
                    })
                    await fs.promises.writeFile(this.path, JSON.stringify(productos,null,'\t'));
                    return true;
                }
                else
                    return "Codigo repetido.";
            } else {
                return "El producto no existe";
            }
        } catch (error) {
            return error.message;
        }
    }

    async deleteProduct(idProducto){
        try {
            if (this.fileExist()) {
                const contenido = await fs.promises.readFile(this.path, "utf-8");
                const productos = JSON.parse(contenido);
                const encontrado = productos.find((producto) => producto.id === idProducto);
                if(!encontrado)
                    return "El producto no existe";
                const final = productos.filter((producto) => producto.id != idProducto);
                await fs.promises.writeFile(this.path, JSON.stringify(final,null,'\t'));
                return true;
            } else {
                return "El archivo no existe";
            }
        } catch (error) {
            error.message;
        }
    }
}