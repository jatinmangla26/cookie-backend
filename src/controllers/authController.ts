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
  try {
    const { name, password, rollNumber, email } = req.body;
    if (!(name && password && rollNumber))
      res.status(400).send("All input is required");
    const oldUser = await user.findOne({ rollNumber });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    } else {
      var salt = await bcrypt.genSalt(10);
      var SecPass = await bcrypt.hash(password, salt);
      const newUser = await user.create({
        name,
        password: SecPass,
        rollNumber,
        email,
      });
      res.status(201).json(newUser);

      const token = jsonwebtoken.sign(
        { id: newUser._id.toString() },
        process.env.MONGO_JWT_SECRET!
      );
      console.log(token);
    }
  } catch (err) {
    console.log(err);
  }
};

export const loginUser = async (req: any, res: any) => {
  try {
    const { name, password, rollNumber } = req.body;

    if (!name && password) res.status(400).send("Enter Your Details");
    const User = await user.findOne({ rollNumber });

    if (!User) res.status(401).send("User Not Available");
    else {
      console.log(User);
      const passCheck = await bcrypt.compare(password, User.password);
      console.log(passCheck);

      if (passCheck) {
        res.json(User);
        const token = jsonwebtoken.sign(
          { id: User._id.toString() },
          process.env.MONGO_JWT_SECRET!
        );
        console.log(token);
      } else res.json("Enter Valid Details");
    }
  } catch (err) {
    res.json(err);
  }
};

export const getUser = async (req: any, res: any) => {
  const id = req.id;
  console.log(id);
  const User = await user.findOne({ _id: id });
  res.json(User);
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
  if (!User) return res.status(400).send("user with given email doesn't exist");
  else {
    var salt = await bcrypt.genSalt(10);
    var SecPass = await bcrypt.hash(password, salt);
    User.password = SecPass;
    await User.save();
    res.send("password reset sucessfully.");
  }
  // res.json(User);
};

