import { CartsService } from "../services/carts.services.js";
import { UsersService } from "../services/users.services.js";
import { ProductsService } from "../services/products.services.js";
import { UserDto } from "../dao/dto/user.dto.js";
import { generateUser } from "../utils.js";
import { addLogger } from "../helpers/logger.js";

const logger = addLogger();

export class ViewsController{
    static async renderHome(req, res){
        res.render("home");
    }

    static async renderSignup(req, res){
        res.render("signup");
    }

    static async renderLogin(req, res){
        res.render("login");
    }
    static async renderCartById(req, res){
        const result = await CartsService.getCartById(req.params.cid);
        res.render("carts", result);
    }

    static async renderProductById(req, res){
        const result = await ProductsService.getProductById(req.params.pid);
        res.render("detail", result);
    }

    static async renderProducts(req, res){
        try {
            //capturar valores de queries
            const {limit=10, page=1, stock, sort="asc", name, price, category} = req.query;
    
            const stockValue = stock === 0? undefined : parseInt(stock);
            const nameValue = name === ""? undefined : name;
            const priceValue = price === 0? undefined : parseFloat(price);
            const categoryValue = category === 0? undefined : category;
    
            const sortValue = sort === "asc"? 1:-1;
            if(!["asc","desc"].includes(sort))
                return res.render("products",{error: "Orden no valido"});
    
            let query = {}
            if(stockValue){
                query.stock = {$gte:stockValue};
            }
            if(nameValue){
                query.name= {$eq:nameValue};
            }
            if(price){
                query.price= {$gte:priceValue};
            }
            if(category){
                query.category= {$eq:categoryValue};
            }
    
            const result = await ProductsService.getProductsWithPaginate(query,
            {
                page,
                limit,
                sort: {price:sortValue},
                lean: true
            });
    
            //http://localhost:8080/products
            let baseUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
            let linkAux = baseUrl.includes("?") ? "&" : "?";
            let pLink;
            if(baseUrl.includes("page"))
                pLink = result.hasPrevPage ? `${baseUrl.replace(`page=${result.page}`,`page=${result.prevPage}`)}` : null;
            else
                pLink = baseUrl + `${linkAux}page=${result.prevPage}`;
            let nLink;
            if(baseUrl.includes("page"))
                nLink = result.hasNextPage ? `${baseUrl.replace(`page=${result.page}`,`page=${result.nextPage}`)}` : null;
            else
                nLink = baseUrl + `${linkAux}page=${result.nextPage}`;
    
            const required = {
                status: "success",
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? `${pLink}` : null,
                nextLink: result.hasNextPage ? `${nLink}` : null
            };

            let dtoInfo;

            if(req.session?.userInfo){
                dtoInfo = new UserDto(req.session.userInfo);
                res.render("products", {required: required, user: dtoInfo});
            }
            else{
                dtoInfo = new UserDto(req.user);
                res.render("products", {required: required, user: dtoInfo});
            }
        } catch (error) {
            logger.error(error);
            res.render("products",{error: "Error al cargar la vista"});
        }
    }

    static async mocking(req, res){
        const cant = parseInt(req.query.cant) || 1;
        let users = [];

        for(let i=0; i<cant; i++){
            const user = generateUser();
            users.push(user);
        }

        res.json({status: "success", data: users});
    }

    static async logger(req, res){
        logger.debug("Aviso nivel debug");
        logger.http("Aviso nivel http");
        logger.info("Aviso nivel info");
        logger.warning("Aviso nivel warning");
        logger.error("Aviso nivel error");
        logger.fatal("Aviso nivel fatal");
    }

    static async renderForgot(req, res){
        res.render("forgotPassword");
    }

    static async renderResetPass(req, res){
        const token = req.query.token;
        res.render("resetPassword", {token});
    }

    static async renderUserManager(req, res){
        const required = await UsersService.getAllUsers();
        res.render("userManager", {required : required});
    }
}