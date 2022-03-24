import * as express from "express";
import * as mongoose from "mongoose";
import * as dotenv from "dotenv";
import * as cors from "cors";
import helmet from "helmet";

dotenv.config();

const connectUri = process.env.MONGO_URI;
const connectToMongo = () => {
    mongoose
        .connect(connectUri!)
        .then(() => {
            console.log("Connected To Database Successfully");
        })
        .catch((err) => {
            console.log("No Connection");
        });
};

const main = () => {
    const app = express();
    const port = 5000;
    app.use(express.json());
    app.use(helmet());
    app.use(cors({ credentials: true }));
    app.get("/", (req: any, res: any) => {
        res.send("Hello");
    });

    app.use("/auth", require("./routes/auth"));

    app.use("/items", require("./routes/item"));

    app.use("/cart",require("./routes/cart"));

    app.listen(port, () => {
        console.log(`Cookie listening on port ${port}`);
    });
};

connectToMongo();
main();
