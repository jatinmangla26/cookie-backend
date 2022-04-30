import { item } from "../models/item.model";
import { order } from "../models/order.model";

export const buyItem = async (req: any, res: any) => {
    const itemId = req.params.id;
    const buyerId = req.id;
    const ItemDetails = await item.findOne({ _id: itemId });
    // console.log(orderItem?.OwnerId);
    const ownerId = ItemDetails?.OwnerId;
    if (buyerId == ownerId)
        return res.status(401).send({
            item: "Cannot Buy this Item as you are owner",
            type: "Owner",
        });
    const orderItem = await order.findOne({ id: itemId });

    if (orderItem)
        return res
            .status(401)
            .send({ item: "Item Already Exists", type: "Exists" });
    else {
        order
            .create({
                BuyerId: buyerId,
                itemId: itemId,
                ownerId: ownerId,
            })
            .then((orderItem) => {
                return res.status(201).send({ item: orderItem, type: "Added" });
            })
            .catch((err) => {
                return res.status(401).send({ item: err, type: "Error" });
            });
    }
};

export const viewBuyItem = async (req: any, res: any) => {
    const buyerId = req.id;
    const orderItems = await order.find({ BuyerId: buyerId });
    if (orderItems.length > 0) {
        return res
            .status(200)
            .send({ itemsBought: orderItems, type: "Exists" });
    } else
        return res
            .status(401)
            .send({ itemsBought: "No Items Bought", type: "Exists" });
};

export const viewSellItem = async (req: any, res: any) => {
    const sellerId = req.id;
    const soldItems = await order.find({ ownerId: sellerId });
    if (soldItems.length > 0) {
        return res.status(200).send({ itemsSold: soldItems, type: "Exists" });
    } else
        return res
            .status(401)
            .send({ itemsSold: "No Items Sold", type: "Exists" });
};

export const sellItem=async(req:any,res:any)=>{
    const itemId = req.params.id;
    const ownerId=req.id;
    const ItemDetails = await item.findOne({ _id: itemId });
    // console.log(orderItem?.OwnerId);
    const originalOwnerId = ItemDetails?.OwnerId;
    
    console.log(originalOwnerId);
    console.log(ownerId);
    if(ownerId!=originalOwnerId)
    return res.status(401).send({item:"You are not authorised to sell the item",err:"Illegal"});
    else
    return res.status(200).send("OKAY");
}

