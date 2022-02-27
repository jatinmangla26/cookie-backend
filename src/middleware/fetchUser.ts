import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();
export const fetchUser=(req:any,res:any,next:any)=>{
    const token=req.header('auth-token');

    if(!token)
    {
        return res.status(401).send("Please Login with valid Token")
    }
    
    else
    {
        try
        {
        const data:any=jwt.verify(token, process.env.MONGO_JWT_SECRET!);
        console.log(data);
        req.id=data.id;
        console.log(req.id);
        next();
        }
        catch(err)
        {
            res.json(err);
        }
        
    }
}
