export const createProductErrorMsg = (product) =>{
    return `
        Uno o mas campos son invalidos,
        listado de campos requeridos:
        name: campo obligatorio y de tipo string, el dato recibido fue ${product.name},
        price: campo obligatorio y de tipo number, el dato recibido fue ${product.price},
        code: campo obligatorio y de tipo string, el dato recibido fue ${product.code},
        category: campo obligatorio y de tipo string, el dato recibido fue ${product.category},
        stock: campo obligatorio y de tipo number, el dato recibido fue ${product.stock}
    `
}