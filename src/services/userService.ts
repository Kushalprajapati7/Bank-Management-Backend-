import User from "../models/userModel";
import { IUser } from "../interface/userInterface";


class UserServices {

    public async addUser(userData: IUser): Promise<IUser> {
        const user = new User(userData);
        return await user.save();
    }
    public async allUser(): Promise<IUser[]> {
        // const user = await User.find()
        const user = User.aggregate(
            [
                {
                    $project: {
                        username: 1,
                        email: 1,
                        role: 1
                    }
                }
            ]
        )
        return user;
    }

    public async deleteUser(id: string): Promise<void> {
        await User.findByIdAndDelete(id);
    }
    public async userById(id: string): Promise<IUser|null> {
        const user = await User.findById(id);
        
        return user
    }
    public async updateUser(id: string, userData: IUser): Promise<IUser | null> {
        const user = await User.findById(id);
        if (!user) {
            throw new Error("User Not Found");
        }
        return await User.findByIdAndUpdate(id, userData, { new: true });
    }


}

export default new UserServices();