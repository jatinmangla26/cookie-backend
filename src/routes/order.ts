import * as express from "express";
import { buyItem, sellItem, viewBuyItem, viewSellItem } from "../controllers/orderController";
const app = express();
var router = express.Router();

//Buy a item
router.get("/buy/:id",  buyItem);
router.get("/sell/:id",  sellItem);

router.get("/getbought",  viewBuyItem);
router.get("/getsold",  viewSellItem);

module.exports = router;
