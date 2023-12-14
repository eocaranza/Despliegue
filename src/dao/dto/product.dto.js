export class ProductDto{
    constructor(product){
        this.name = product.name;
        this.price = product.price;
        this.code = product.code;
        this.category = product.category;
        this.stock = product.stock;
    };
}