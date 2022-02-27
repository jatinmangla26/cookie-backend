import * as express from "express";
import * as mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const connectUri = process.env.MONGO_URI;
const connectToMongo = () => {
  mongoose.connect(connectUri!, () => {
    console.log("Connected To Database Successfully");
  });
};

const main = () => {
  const app = express();
  const port = 5000;
  app.use(express.json());
  app.get("/", (req: any, res: any) => {
    res.send("Hello");
  });


  app.use('/api/auth',require("./routes/auth"));

  
  app.use('/items',require("./routes/item"));



  app.listen(port, () => {
    console.log(`Cookie listening on port ${port}`);
  });
};

connectToMongo();
main();
