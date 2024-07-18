import User from "../models/userModel";
import { IUser } from "../interface/userInterface";
import bcrypt from 'bcrypt'
import { JwtUtills } from "../utils/jwtUtiils"

class AuthServices {
    public async createUser(newUser: IUser): Promise<IUser> {

        const hashPassword = await bcrypt.hash(newUser.password, 10);
        newUser.password = hashPassword;
        const user = new User(newUser);
        return await user.save();

    }

    public async loginUser(email: string, password: string): Promise<any> {

        let user;
        user = await User.findOne({ email: email })

        if (!user) {
            throw new Error(`User with Email ${email} not found`);
        }

        const pass = await bcrypt.compare(password, user.password);
        
        if (!pass) {
            throw new Error(`Incorrect password`);
        }
        const role = user.role;
        const userName = user.username;
        const userId = user._id;
        const token = JwtUtills.generateToken(user.id, user.role);
        return { token, role, userName,userId };;
    }




}

export default new AuthServices();