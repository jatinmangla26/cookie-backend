import { order } from "../models/order.model";

export const buyItem = async (req: any, res: any) => {
    const id = req.params.id;
    const buyerId = req.id;
    const orderItem = await order.findOne({ id: id });

    if (orderItem)
        return res
            .status(401)
            .send({ item: "Item Already Exists", type: "Exists" });
    else {
        order
            .create({
                BuyerId: buyerId,
                itemId: id,
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
