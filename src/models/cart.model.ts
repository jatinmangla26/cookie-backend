import * as mongoose from "mongoose";
import { Item } from "src/types";
import { Cart } from "src/types";

import { model } from "mongoose";
const { Schema } = mongoose;

const cartSchema=new Schema<Cart>({
  
    subTotal:Number,
    OwnerId:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    items:[{
        type:Schema.Types.ObjectId,
        ref:"Item",
    }]


});
export const cart = model("Cart", cartSchema);