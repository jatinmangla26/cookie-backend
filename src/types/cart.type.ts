import { Item } from "./item.type";

export interface Cart{
    items:Item[];
    subTotal:Number;
    OwnerId:any
}