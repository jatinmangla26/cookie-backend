import * as express from "express";
import {
    addItem,
    deleteItem,
    getItemById,
    getProducts,
    reviewProduct,
    updateItem,
} from "../controllers/itemController";
import * as Multer from "multer";
import { multer } from "../images/upload";
import { admin, protect } from "../middleware/fetchUser";
const upload = require("multer")();
const app = express();
var router = express.Router();

// router.post("/additem", multer.single("file"), addItem);
router.route("/allitems").get(getProducts);
router.route("/additem").post(multer.single("file"), protect, addItem);
router.route("/:id/reviews").post(protect, reviewProduct);
router
    .route("/:id")
    .get(getItemById)
    .delete(protect, admin, deleteItem)
    .put(protect, updateItem);
// router.get("/getItem", getItem);

// router.get("/infoItem/:itemId", infoItem);

// router.put("/updateItem/:itemId", updateItem);

// router.delete("/deleteItem/:itemId", deleteItem);

// router.get("/allItems", getAllItem);

// router.get("/search/:name", searchItem);

module.exports = router;
