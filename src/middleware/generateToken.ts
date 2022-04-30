import * as  jwt from "jsonwebtoken";
import { ObjectId } from "mongoose";
const generateToken = (id: string) => {
    console.log(id);
    
    return jwt.sign({ id }, process.env.MONGO_JWT_SECRET!, {
        expiresIn: "30d",
    });
};

export default generateToken;
