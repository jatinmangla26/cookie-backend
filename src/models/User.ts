import * as mongoose from "mongoose";
import { User } from "src/types";
import * as bcrypt from "bcrypt";
const { Schema } = mongoose;

const userSchema = new Schema<User>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        contact: {
            phoneNumber: {
                type: String,
                required: true,
            },
            isVerified: {
                type: Boolean,
                required: true,
                default: false,
            },
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);
userSchema.pre("save", async function<User> (next:any) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

export const user = mongoose.model("User", userSchema);