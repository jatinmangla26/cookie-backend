import * as express from "express";
import * as mongoose from "mongoose";
import {
    registerUser,
    loginUser,
    deleteUser,
    // forgetPassword,
    // resetPassword,
    getAllUsers,
    verificationLink,
    getUserProfile,
    updateUserProfile,
    getUserById,
    emailSend,
    // getOwner,
} from "../controllers/authController";
import { admin, protect } from "../middleware/fetchUser";
const app = express();
var router = express.Router();

//Register User
router.route("/register").post(registerUser).get(protect, admin, getAllUsers);
router.route("/verificationlink").post(verificationLink);
router.post("/login", loginUser);
router.get("/allUser", getAllUsers);
router.route("/getuser").get(protect, getUserProfile);
router.route("/email").post(protect, emailSend);
router
    .route("/:id")
    .delete(protect, admin, deleteUser)
    .put(protect, updateUserProfile)
    .get(protect, getUserById);
module.exports = router;
