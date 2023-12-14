export class UserDto{
    constructor(user){
        this.first_name = user.first_name;
        this.email = user.email;
        this.password = user.password;
        this.cart = user.cart;
        this.role = user.role;
    };
}