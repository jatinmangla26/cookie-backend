import { User } from "../types/user.type";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { model } from "mongoose";
import { user } from "../models/User";
import { item } from "../models/item.model";
import * as nodemailer from "nodemailer";
import generateToken from "../middleware/generateToken";
dotenv.config();
export const verificationLink = async (req: any, res: any) => {
    const { name, email, password, contact, address } = req.body;
    const { phoneNumber } = contact;
    const userExists = await user.findOne({ email });
    // console.log(phoneNumber);

    if (userExists) {
        return res.status(400).send("Email is already registered");
    }
    const validatename = name.length;
    const validateaddress = address.length;
    const validatePassword = password.length;

    if (validatename < 3) {
        return res
            .status(400)
            .send("Name must be of 3 characters  or more length ");
    }

    if (validateaddress < 5) {
        return res
            .status(400)
            .send("Address must be of 5 characters  or more length ");
    }
    if (validatePassword < 6) {
        return res.status(400).send("Password length must be greater than 5");
    }

    const validateContact = contact.phoneNumber.length;
    if (validateContact !== 10) {
        return res.status(400).send("Enter 10 digit mobile number");
    }

    const tokengenerate = jwt.sign(
        { name, email, password, contact, address },
        process.env.MONGO_JWT_SECRET!,
        { expiresIn: "10m" }
    );
    // return res.status(200).send(tokengenerate);
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "jasn2609@gmail.com",
            pass: "Jatin@2001",
        },
    });
    const mailOptions = {
        from: "jasn2609@gmail.com",
        to: email,
        subject: "Verify your account",

        html: `<p>Please click on the link below to activate your account</p>
      <a href="localhost:3000/verify/${tokengenerate}">localhost:3000/verify/${tokengenerate}</a>`,
    };

    await transporter.sendMail(mailOptions, function (error: any, info: any) {
        if (error) {
            res.status(400);
            console.log("error occurred");
            throw new Error(error);
        } else {
            console.log("Email sent: " + info.response);
            res.status(201).json({
                response:
                    "A verification link has been sent to your Email. Verify it at first.",
            });
        }
    });
};
export const registerUser = async (req: any, res: any) => {
    const { token } = req.body;
    if (token) {
        const decoded = jwt.verify(token, process.env.MONGO_JWT_SECRET!);
        if (!decoded) {
            return res.status(401).send("NOt Valid Jwt Token");
        }
        const { name, email, password, contact, address } = <any>decoded;
        const userExists = await user.findOne({ email });

        if (userExists) {
            return res.status(400).send("You have already been verified");
        } else {
            const User = await user
                .create({
                    name,
                    email,
                    password,
                    contact,
                    address,
                })
                .then((User) => {
                    return res.status(201).send({
                        _id: User._id,
                        name: User.name,
                        email: User.email,
                        isAdmin: User.isAdmin,
                        token: generateToken(User._id.toString()),
                        address: User.address,
                        contact: User.contact,
                    });
                })
                .catch(() => {
                    return res.status(401).send("Invalid user Data");
                });
        }
    } else {
        return res.status(404).send("No token found");
    }
};

export const loginUser = async (req: any, res: any) => {
    try {
        const { email, password } = req.body;
        const User = await user.findOne({ email });
        if (!User)
            return res
                .status(400)
                .send({ errors: "User DOES NOT Exists", type: "EXISTS" });
        else {
            console.log(User.password);
            console.log(password);
            const passCheck = await bcrypt.compare(password, User.password);

            if (passCheck) {
                // res.json(User);
                return res.status(200).send({
                    _id: User._id,
                    name: User.name,
                    email: User.email,
                    isAdmin: User.isAdmin,
                    address: User.address,
                    contact: User.contact,
                    token: generateToken(User._id.toString()),
                });
            } else
                return res
                    .status(401)
                    .send({ errors: "Wrong Password", type: "AUTH" });
        }
    } catch (err) {
        res.json(err);
    }
};
export const getUserProfile = async (req: any, res: any) => {
    const User = await user.findById(req.user._id);
    if (User) {
        return res.status(201).send({
            _id: User._id,
            name: User.name,
            email: User.email,
            isAdmin: User.isAdmin,
            address: User.address,
            contact: User.contact,
        });
    } else {
        res.status(404).send("User not found");
    }
};
export const deleteUser = async (req: any, res: any) => {
    const User = await user.findById(req.params.id);
    if (User) {
        await User.remove();
        return res.status(200).json({ message: "User removed" });
    } else {
        return res.status(404).send("User not found");
    }
};
export const updateUserProfile = async (req: any, res: any) => {
    // const user = await User.findById(req.params.id)
    const { name, email, password, address, phone_no } = req.body;

    const User = await user.findById(req.params.id);

    if (User) {
        if (
            req.user._id.toString() === User._id.toString() ||
            req.User.isAdmin
        ) {
            (User.name = name || User.name),
                (User.email = email || User.email),
                (User.address = address || User.address),
                (User.password = password || User.password),
                (User.contact.phoneNumber =
                    phone_no || User.contact.phoneNumber);
            const updatedUser = await User.save();
            return res.status(201).json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,

                address: updatedUser.address,
                contact: updatedUser.contact,
            });
        } else {
            return res.status(401).send("You cannot perform this action");
        }
    } else {
        return res.status(404).send("No user found");
    }
};
export const getUserById = async (req: any, res: any) => {
    const User = await user.findById(req.params.id).select("-password");
    console.log(User);
    console.log(req.user);

    if (
        (User && User._id.toString() === req.user._id.toString()) ||
        req.user.isAdmin
    ) {
        res.status(200).json(User);
    } else {
        res.status(404).send("User not found");
    }
};
export const emailSend = async (req: any, res: any) => {
    const { receiver, text, name, address, productName, email, phone_no } =
        req.body;
    console.log("user is", email);
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "jasn2609@gmail.com",
            pass: "Jatin@2001",
        },
    });
    var mailOptions = {
        from: "jasn2609@gmail.com",
        to: receiver,
        subject: "You have a buyer",

        html: `<div style="background:#31686e;text-align:center;color:white">One of the  user wants
      to buy your ${productName}. </div><br/>
      <p>His/Her name is ${name} and is a resident of ${address}.His/Her
      email is: ${email} and registered contact no is: ${phone_no}.</p>
  
      He/She says:  ${text}`,
    };

    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.status(400).send(error);
        } else {
            console.log("Email sent: " + info.response);
            res.status(201).json({ response: "Email Successfully Sent" });
        }
    });
};
export const getAllUsers = async (req: any, res: any) => {
    const User = await user.find();
    if (!User) return res.status(401).send({ error: "No User Exist" });
    else return res.status(200).send({ User });
};
// export const sendEmail = async (email: any, token: any) => {
//     var email = email;
//     var token = token;
//     let transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//             user: "jasn2609@gmail.com",
//             pass: "Jatin@2001",
//         },
//     });
//     var mailOptions = {
//         from: "jasn2609@gmail.com",
//         to: "jatinmangla2001@gmail.com",
//         subject: "Reset Password Link",
//         text: `localhost:5000/api/auth/forgot-password/${token}`,
//     };
//     await transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//             console.log(1);
//             console.log(error);
//         } else {
//             console.log("Check Your Mail");
//         }
//     });
// };

// export const forgetPassword = async (req: any, res: any) => {
//     const { email } = req.body;

//     const User = await user.findOne({ email });
//     // console.log(User);
//     if (!User) return res.status(400).json({ error: "Email Not Found" });
//     else {
//         const token: any = jsonwebtoken.sign(
//             { id: User._id.toString() },
//             process.env.MONGO_JWT_SECRET!
//         );
//         console.log(token);
//         sendEmail(email, token);
//     }
// };

// export const resetPassword = async (req: any, res: any) => {
//     console.log(req.params.token);
//     const password = req.body.password;
//     const data: any = jsonwebtoken.verify(
//         req.params.token,
//         process.env.MONGO_JWT_SECRET!
//     );
//     console.log(data.id);
//     const User = await user.findOne({ _id: data.id });
//     if (!User)
//         return res.status(400).send("user with given email doesn't exist");
//     else {
//         var salt = await bcrypt.genSalt(10);
//         var SecPass = await bcrypt.hash(password, salt);
//         User.password = SecPass;
//         await User.save();
//         res.send("password reset sucessfully.");
//     }
//     // res.json(User);
// };

// export const getOwner = async (req: any, res: any) => {
//     const id = req.params.id;
//     const User = await user.findOne({ _id: id });
//     const userDetails = {
//         name: User?.name,
//         rollNumber: User?.rollNumber,
//         email: User?.email,
//     };

//     if (!userDetails)
//         return res
//             .status(401)
//             .send({ errors: "user Does Not Exist", type: "WRONG DETAILS" });
//     return res.status(200).send({ user: userDetails });
// };
