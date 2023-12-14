import bcrypt from "bcrypt";
import path from 'path';
import { fileURLToPath } from 'url';
import {faker, Faker, es ,en} from '@faker-js/faker';
import jwt from 'jsonwebtoken';
import { config } from "./config/config.js";
import multer from 'multer';
import fs from "fs";

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync());
}

export const isValidPassword = (userDB, password) => {
    return bcrypt.compareSync(password, userDB?.password);
}

const {database, commerce, string, person, internet} = faker;

if (!fs.existsSync(path.join(__dirname, "/public/userFiles/"))){
    fs.mkdirSync(path.join(__dirname, "/public/userFiles/"));
}

const storageFiles = multer.diskStorage({
    destination: function(req, file, cb){
        /*const types = ["documents","profiles","products"]
        if(types.includes(req.body.type))*/
        if (!fs.existsSync(path.join(__dirname, "/public/userFiles/" + req.body.type))){
            fs.mkdirSync(path.join(__dirname, "/public/userFiles/" + req.body.type));
        }
        cb(null, path.join(__dirname, "/public/userFiles/" + req.body.type));
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + "-" + file.originalname);
    }
});

export const uploader = multer({storage: storageFiles});

export const generateProduct = () =>{
    return {
        id : database.mongodbObjectId(),
        name: commerce.productName(),
        price: parseFloat(commerce.price()),
        code: string.alphanumeric(10),
        category: commerce.department(),
        stock: parseInt(string.numeric(3))
    };
}

export const generateUser = () => {
    //const numberOfProducts = parseInt(string.numeric(1));
    const numberOfProducts = 100;

    let products = [];

    for(let i = 1; i < numberOfProducts; i++){
        const newProduct = generateProduct();
        products.push(newProduct);
    };

    return {
        id: database.mongodbObjectId(),
        first_name: person.firstName(),
        last_name: person.lastName(),
        email: internet.email(),
        age: parseInt(string.numeric(2)),
        //password:,
        cart: products,
        role: "user"
    };
}

export const validateToken = (token) => {
    try {
        const info = jwt.verify(token, config.gmail.secretToken);
        return info.email;
    } catch (error) {
        console.log(error.message);
        return null;
    }
};