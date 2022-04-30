import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { user } from "../models/User";
import asyncHandler from "express-async-handler";
import { item } from "../models/item.model";
dotenv.config();

export const protect = async (req: any, res: any, next: any) => {
    let token = req.header("auth-token");
    console.log(token);
    // console.log(req.headers.authorization);
    if (token) {
        try {
            // token = token.split(" ")[1];
            const decoded = jwt.verify(token, process.env.MONGO_JWT_SECRET!);
            const { id } = <any>decoded;

            req.user = await user.findById(id).select("-password");
            next();
        } catch (error) {
            console.error(error);
            res.status(401).send("Token failed");
        }
    }
    if (!token) {
        res.status(401).send("Not authorized, no token");
    }
};

export const admin = async (req: any, res: any, next: any) => {
    const product = await item.findById(req.params.id);
    // console.log(req.user);
    // console.log(product.user);
    // console.log(req.user._id);
    if (req.user && req.user.isAdmin) {
        next();
    } else if (req.user && product.user.toString() == req.user._id.toString()) {
        next();
    } else {
        res.status(401).send("Not authorized as an admin");
    }
};
