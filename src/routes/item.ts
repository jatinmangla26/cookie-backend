import * as express from "express";
import { fetchUser } from "../middleware/fetchUser";
import { addItem,getItem, infoItem, updateItem } from "../controllers/itemController";


const app = express();

var router = express.Router();

router.post('/additem',fetchUser,addItem);
router.get('/getItem',fetchUser,getItem);
router.get('/infoItem/:itemId',infoItem);
router.put('/updateItem/:itemId',fetchUser,updateItem);
router.put('/deleteItem/:itemId',fetchUser,updateItem);
module.exports = router;