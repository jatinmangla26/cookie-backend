import { item } from "../models/item.model";
import { cart } from "../models/cart.model";

export const addItemToCart = async (req: any, res: any) => {
    const { productID, Quantity } = req.body;
    const Item = await item.findOne({ _id: productID });

    // console.log(Item);
    // if (Item) return res.status(200).send(Item);
    if (!Item) return res.status(400).send({ error: "Item Not Available" });
    const id = req.id;
    const Cart = await cart.findOne({ OwnerId: id });

    let sum = 0;
    if (!Cart) {
        cart.create({
            OwnerId: id,
            items: Item,
            subTotal: Item.Price,
        });
        return res.json("make");
    } else {
        const items = await item.find({
            _id: { $in: Cart.items },
        });
        items.forEach((i) => {
            sum += i.Price;
        });
        console.log(sum);
        await cart.updateOne({
            // $push: { items: Item },
            subTotal: sum,
        });
        return res.json("Added");
    }
};
