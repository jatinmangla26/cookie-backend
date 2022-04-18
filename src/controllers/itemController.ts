import { Item } from "src/types";
import * as dotenv from "dotenv";
import { model, Mongoose } from "mongoose";
import { item } from "../models/item.model";
import { user } from "../models/User";
import { uploadImageToStorage } from "../images/upload";

dotenv.config();

export const addItem = async (req: any, res: any) => {
    const { name, Quantity, Price, Description, Category } = req.body;
    const User = await user.findOne({ _id: req.id });
    let image;
    if (!User)
        return res
            .status(400)
            .send({ error: "User Does not Exist", type: "User" });
    if (!name && !Price && !Description && !Category)
        return res
            .status(400)
            .send({ error: "Enter All Details", type: "Details" });
    try {
        image = uploadImageToStorage(req.file);
    } catch (e) {
        return res.status(400).send({ error: e.message, type: "Image" });
    }
    item.create({
        name,
        Price,
        Description,
        Quantity,
        Category,
        OwnerId: req.id,
        imageUrl: image,
    })
        .then((newItem) => {
            return res.status(201).send(newItem);
        })
        .catch((error) => {
            return res.status(401).send(error);
        });
};

export const getItem = async (req: any, res: any) => {
    const id = req.id;
    const items = await item.find({ OwnerId: id });
    if (items) return res.status(200).send({ items });
    else return res.status(401).send({ items, type: "NULL" });
};

export const updateItem = async (req: any, res: any) => {
    const id = req.id;
    console.log(id);
    const itemId = req.params.itemId;
    const { name, Quantity, Price, Description, Category } = req.body;
    const newItem = new item({
        _id: itemId,
        name,
        Price,
        Description,
        Quantity,
        OwnerId: req.id,
        Category,
    });
    item.find({ _id: itemId, OwnerId: id })
        .then(() => {
            res.json("Item Finded");
        })
        .catch((error) => {
            res.json(error);
        });
    // console.log(Item);
    // item.updateOne({_id: itemId,OwnerId:id}, newItem).then(
    //     () => {
    //       res.status(201).json({
    //         message: 'Thing updated successfully!'
    //       });
    //     }
    //   ).catch(
    //     (error) => {
    //       res.status(400).json({
    //         error: error
    //       });
    //     }
    //   );
};

export const infoItem = async (req: any, res: any) => {
    console.log(req.params.itemId);
    item.findOne({ _id: req.params.itemId })
        .then((Item) => {
            res.status(201).send({ data: Item, type: "Item" });
        })
        .catch((error) => {
            res.status(401).send({ data: "No Item Exist", type: "NULL" });
        });
    // console.log(Item);
};

export const deleteItem = async (req: any, res: any) => {
    const itemId = req.params.itemId;
    const id = req.id;
    console.log(id);
    item.findOne({ _id: itemId })
        .then((Item) => {
            if (Item) {
                console.log(Item.OwnerId.toString());
                if (Item.OwnerId.toString() === id) {
                    item.deleteOne({ _id: itemId })
                        .then(() => {
                            res.json("Item Deleted");
                        })
                        .catch((error) => {
                            res.json(error);
                        });
                } else res.json("Invalid User");
            } else {
                res.json("No Item Exist");
            }
        })
        .catch((error) => {
            res.json(error);
        });
};

export const getAllItem = async (req: any, res: any) => {
    const items = await item.find({});
    return res.status(200).send({ items });
};

export const searchItem = async (req: any, res: any) => {
    var regex = new RegExp(req.params.name, "i");
    user.find({ name: regex }).then((result) => {
        return res.status(200).send(result);
    });
};
