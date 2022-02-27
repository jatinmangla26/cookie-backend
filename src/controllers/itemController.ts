import { Item } from "src/types";
import * as dotenv from "dotenv";
import { model, Mongoose } from "mongoose";
import { item } from "../models/item.model";

dotenv.config();

export const addItem = async (req: any, res: any) => {
  try {
    const { name, Quantity, Price, Description } = req.body;
    console.log(req.id);
    if (!name && Price && Description)
      res.status(400).send("All input is required");
    else {
      const newItem = await item.create({
        name,
        Price,
        Description,
        Quantity,
        OwnerId: req.id,
      });
      res.status(201).json(newItem);
    }
  } catch (err) {
    res.send(err);
  }
};

export const getItem = async (req: any, res: any) => {
  const id = req.id;
  const items = await item.find({ OwnerId: id });
  res.json(items);
};

export const updateItem = async (req: any, res: any) => {
  const id = req.id;
  console.log(id);
  const itemId = req.params.itemId;
  const { name, Quantity, Price, Description } = req.body;
  const newItem = new item({
    _id: itemId,
    name,
    Price,
    Description,
    Quantity,
  });
  item
    .find({ _id: itemId, OwnerId: id })
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
  item
    .find({ _id: req.params.itemId })
    .then((Item) => {
      if (Item.length === 0) res.json({ err: "No Items Your Match" });
      else res.json(Item);
    })
    .catch((error) => {
      res.json(error);
    });
  // console.log(Item);
};

export const deleteItem = async (req: any, res: any) => {
    const itemId=req.params.itemId;
    const id=req.id;
    console.log(id);
    item.findOne({_id:itemId}).then((Item)=>{
        if(Item)
        {
            console.log(Item.OwnerId.toString());
            if(Item.OwnerId.toString()===id)
            {
                item.deleteOne({_id:itemId}).then(()=>{
                    
                    res.json("Item Deleted");
                }).catch((error)=>{
                    res.json(error);
                });
            }
            else
            res.json("Invalid User");
        }
        else
        {
            res.json("No Item Exist");
        }
        

    }).catch((error)=>{
        res.json(error);
    })
};
