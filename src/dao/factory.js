//import {ProductManager} from "./managers/fileSystem/ProductManager.js";
//import { ProductsMongo } from "./managers/mongo/productsMongo.js";
//import {CartManager} from "./managers/fileSystem/CartManager.js";
//import { CartsMongo } from "./managers/mongo/cartsMongo.js";
//import { usersMongo } from './managers/mongo/usersMongo.js';
//import {connectDB} from '../config/dbConnection.js'
import { config } from "../config/config.js";

//connectDB();
//const productDao = new ProductsMongo();
//const cartDao = new CartsMongo();
//const userDao = new usersMongo();

let productDao;
let cartDao;
let userDao;
let ticketDao;

const persistence = config.server.persistence;

switch(persistence) {
    case "mongo":
        const {connectDB} = await import("../config/dbConnection.js");
        connectDB();
        const {CartsMongo} = await import("./managers/mongo/cartsMongo.js");
        const {ProductsMongo} = await import("./managers/mongo/productsMongo.js");
        const {usersMongo} = await import("./managers/mongo/usersMongo.js");
        const {ticketsMongo} = await import("./managers/mongo/ticketsMongo.js");
        productDao = new ProductsMongo();
        cartDao = new CartsMongo();
        userDao = new usersMongo();
        ticketDao = new ticketsMongo();
    break;

    case "memory":
        const {CartManager} = await import("./managers/fileSystem/CartManager.js");
        const {ProductManager} = await import("./managers/fileSystem/ProductManager.js");
    break;
    
    default:
    break;
}

export {productDao}
export {cartDao}
export {userDao}
export {ticketDao};