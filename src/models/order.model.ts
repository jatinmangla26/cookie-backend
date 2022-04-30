import { model, Schema } from "mongoose";
import { Order } from "src/types/order.item";
import { item } from "./item.model";

const orderSchema = new Schema<Order>({
    itemId:{
        type: Schema.Types.ObjectId,
        ref: "Item",
    },
    BuyerId:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    ownerId:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },


});
export const order = model("Order", orderSchema);