import * as express from "express";
import { buyItem, viewBuyItem } from "../controllers/orderController";
import { fetchUser } from "../middleware/fetchUser";
const app = express();
var router = express.Router();

//Buy a item
router.get("/buy/:id", fetchUser, buyItem);

router.get("/getbought", fetchUser, viewBuyItem);

module.exports = router;
