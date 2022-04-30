import * as express from "express";
import { addItemToCart } from "../controllers/cartController";
const app = express();
var router = express.Router();

//Add Item To Cart
router.get("/add-to-cart",  addItemToCart);
module.exports = router;
