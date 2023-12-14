import { userDao } from "../dao/factory.js";

export class UsersService{
    
    static async getUserById(userId){
        return userDao.getUserById(userId);
    }

    static async getUserByEmail(email){
        return userDao.getUserByEmail(email);
    }

    static async save(user){
        return userDao.save(user);
    }

    static updateUser = async(userId, userInfo) => {
        return userDao.update(userId, userInfo);
    }

    static deleteUser = async(userId) => {
        return userDao.delete(userId);
    }

    static async getAllUsersLimited(){
        return userDao.getAllUsersLimited();
    }

    static async getAllUsers(){
        return userDao.getAllUsers();
    }
}