import * as express from "express";
import { fetchUser } from "../middleware/fetchUser";
import {
    addItem,
    deleteItem,
    getAllItem,
    getItem,
    infoItem,
    updateItem,
    searchItem
} from "../controllers/itemController";
import * as Multer from "multer";
import { multer } from "../images/upload";

const app = express();
var router = express.Router();

router.post("/additem", fetchUser, multer.single("file"), addItem);

router.get("/getItem", fetchUser, getItem);

router.get("/infoItem/:itemId", infoItem);

router.put("/updateItem/:itemId", fetchUser, updateItem);

router.delete("/deleteItem/:itemId", fetchUser, deleteItem);

router.get("/allItems", getAllItem);

router.get("/search/:name", searchItem);

module.exports = router;
