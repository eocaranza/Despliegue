export const checkUserAuthenticated = (req, res, next) =>{
        if(req.user){
            next();
        }
        else
            res.redirect("/login")
}

export const checkRole = (roles) => {
    return (req, res, next) =>{
        if(roles.includes(req.user.role))
            next();
        else
            res.json({status: "error", message: "Permisos insuficientes"})
    }
}

export const showLoginView = (req, res, next) =>{
        if(req.user){
            res.redirect("/products")
        }
        else
            next();
}