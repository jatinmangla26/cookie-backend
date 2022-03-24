import * as express from "express";
import { addItemToCart } from "../controllers/cartController";
import { fetchUser } from "../middleware/fetchUser";
const app = express();
var router = express.Router();

//Add Item To Cart
router.get("/add-to-cart", fetchUser, addItemToCart);
module.exports = router;
