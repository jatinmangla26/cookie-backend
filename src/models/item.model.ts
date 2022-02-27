import * as mongoose from "mongoose";
import { model } from "mongoose";
import { Item } from "src/types";
const { Schema } = mongoose;

const itemSchema = new Schema<Item>({
  name: String,
  Price:Number,
  Description:String,
  OwnerId:
  {
      type:Schema.Types.ObjectId,
      ref:'User'
  },
  Quantity:Number
});

export const item=model('Item',itemSchema);

