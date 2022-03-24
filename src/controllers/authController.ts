import { User } from "src/types";
import * as bcrypt from "bcrypt";
import * as jsonwebtoken from "jsonwebtoken";
import * as dotenv from "dotenv";
import { model } from "mongoose";
import { user } from "../models/User";
import { item } from "../models/item.model";
import * as nodemailer from "nodemailer";
import * as crypto from "crypto";
dotenv.config();

export const registerUser = async (req: any, res: any) => {
    const { name, password, rollNumber, email } = req.body;
    const errors: User = {
        name: "",
        rollNumber: "",
        email: "",
        password: "",
    };
    if (!name) {
        errors.name = "Name is required";
    }
    if (!password) {
        errors.password = "password is required";
    }
    if (!rollNumber) {
        errors.rollNumber = "Roll Number is required";
    }
    if (!email) {
        errors.email = "Email is required";
    }

    if (errors.email || errors.name || errors.password || errors.rollNumber) {
        return res.status(401).send({ errors, type: "INPUT" });
    }

    const oldUser = await user.findOne({ rollNumber });

    if (oldUser) {
        return res
            .status(401)
            .send({ errors: "User Already Exists", type: "EXISTS" });
    } else {
        var salt = await bcrypt.genSalt(10);
        var SecPass = await bcrypt.hash(password, salt);
        const newUser = await user.create({
            name,
            password: SecPass,
            rollNumber,
            email,
        });
        // res.status(201).json(newUser);

        const token = jsonwebtoken.sign(
            { id: newUser._id.toString() },
            process.env.MONGO_JWT_SECRET!
        );
        return res.status(200).send({ token: token });
    }
};

export const loginUser = async (req: any, res: any) => {
    try {
        const { password, rollNumber } = req.body;
        const errors: { password: string; rollNumber: string } = {
            password: "",
            rollNumber: "",
        };
        if (!password) {
            errors.password = "password is required";
        }
        if (!rollNumber) {
            errors.rollNumber = "Roll Number is required";
        }
        if (errors.password || errors.rollNumber) {
            return res.status(401).send({ errors, type: "INPUT" });
        }
        const User = await user.findOne({ rollNumber });

        if (!User)
            return res
                .status(401)
                .send({ errors: "User DOES NOT Exists", type: "EXISTS" });
        else {
            const passCheck = await bcrypt.compare(password, User.password);

            if (passCheck) {
                // res.json(User);
                const token = jsonwebtoken.sign(
                    { id: User._id.toString() },
                    process.env.MONGO_JWT_SECRET!
                );
                return res.status(200).send({ token: token });
            } else
                return res
                    .status(401)
                    .send({ errors: "Wrong Password", type: "AUTH" });
        }
    } catch (err) {
        res.json(err);
    }
};

export const getUser = async (req: any, res: any) => {
    const id = req.id;
    const User = await user.findOne({ _id: id });
    const userDetails = {
        name: User?.name,
        rollNumber: User?.rollNumber,
        email: User?.email,
    };

    if (!userDetails)
        return res
            .status(401)
            .send({ errors: "user Does Not Exist", type: "WRONG DETAILS" });
    return res.status(200).send({ user: userDetails });
};

export const deleteUser = async (req: any, res: any) => {
    const id = req.id;
    const User = await user.findOne({ _id: id });
    console.log(User?._id.toString());
    console.log(id);
    if (!User) res.json("User Does Not Exist");
    else {
        if (User?._id.toString() != id) {
            return res.status(401).json({ message: "Not Authorized" });
        } else {
            try {
                await user.deleteOne({ _id: id });
                await item.deleteMany({ OwnerId: id });
                res.json("User Deleted");
            } catch (err) {
                console.log("Server Error");
                res.json(err);
            }
        }
    }
};

export const updateUser = async (req: any, res: any) => {
    const id = req.id;
    const User = await user.findOne({ _id: id });
};

export const sendEmail = async (email: any, token: any) => {
    var email = email;
    var token = token;
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "jasn2609@gmail.com",
            pass: "Jatin@2001",
        },
    });
    var mailOptions = {
        from: "jasn2609@gmail.com",
        to: "jatinmangla2001@gmail.com",
        subject: "Reset Password Link",
        text: `localhost:5000/api/auth/forgot-password/${token}`,
    };
    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(1);
            console.log(error);
        } else {
            console.log("Check Your Mail");
        }
    });
};

export const forgetPassword = async (req: any, res: any) => {
    const { email } = req.body;

    const User = await user.findOne({ email });
    // console.log(User);
    if (!User) return res.status(400).json({ error: "Email Not Found" });
    else {
        const token: any = jsonwebtoken.sign(
            { id: User._id.toString() },
            process.env.MONGO_JWT_SECRET!
        );
        console.log(token);
        sendEmail(email, token);
    }
};

export const resetPassword = async (req: any, res: any) => {
    console.log(req.params.token);
    const password = req.body.password;
    const data: any = jsonwebtoken.verify(
        req.params.token,
        process.env.MONGO_JWT_SECRET!
    );
    console.log(data.id);
    const User = await user.findOne({ _id: data.id });
    if (!User)
        return res.status(400).send("user with given email doesn't exist");
    else {
        var salt = await bcrypt.genSalt(10);
        var SecPass = await bcrypt.hash(password, salt);
        User.password = SecPass;
        await User.save();
        res.send("password reset sucessfully.");
    }
    // res.json(User);
};

export const getAllUsers = async (req: any, res: any) => {
    const User = await user.find();
    if (!User) return res.status(401).send({ error: "No User Exist" });
    else return res.status(200).send({ User });
};
