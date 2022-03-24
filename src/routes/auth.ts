import * as express from "express";
import * as mongoose from "mongoose";
import {
    registerUser,
    loginUser,
    getUser,
    deleteUser,
    forgetPassword,
    resetPassword,
    getAllUsers,
} from "../controllers/authController";
import { fetchUser } from "../middleware/fetchUser";
const app = express();
var router = express.Router();

//Register User
router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/getUser", fetchUser, getUser);

router.delete("/deleteUser", fetchUser, deleteUser);

router.post("/forgot-password", forgetPassword);

router.get("/forgot-password/:token", resetPassword);

router.get("/allUser", getAllUsers);
module.exports = router;
