import * as mongoose from "mongoose";
import { User } from "src/types";
const { Schema } = mongoose;

const userSchema = new Schema<User>({
    name: String,
    password: String,
    rollNumber: {
        type: String,
        required: true,
    },
    email: String,
});
export const user = mongoose.model("User", userSchema);
