import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();
export const fetchUser = (req: any, res: any, next: any) => {
    const token = req.header("auth-token");
    // const token =
    //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMzU5OTI2NjNiZmM5MDc4MTFlNjQ2MyIsImlhdCI6MTY0Nzc1NTgyMX0.QOwIGVpMhMpUzjqdbeXskpCIOGFPa1B4sBvprmHFtTs";
    if (!token) {
        return res.status(401).send("Please Login with valid Token");
    } else {
        try {
            const data: any = jwt.verify(token, process.env.MONGO_JWT_SECRET!);
            req.id = data.id;

            next();
        } catch (err) {
            res.json(err);
        }
    }
};
