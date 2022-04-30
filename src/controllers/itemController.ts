import { Item } from "src/types";
import * as dotenv from "dotenv";
import { model, Mongoose } from "mongoose";
import { item } from "../models/item.model";
import { user } from "../models/User";
import { uploadImageToStorage } from "../images/upload";

dotenv.config();

export const addItem = async (req: any, res: any) => {
    console.log(req.body);
    const {
        name,
        description,
        category,
        expiresOn,
        address,
        shippingCharge,
        price,
        negotiable,
    } = req.body;
    // console.log(req.body);
    const validatename = name.length;
    const validatedescription = description.length;
    const validateaddress = address.length;
    const validatecategory = category.length;
    if (validatename < 3) {
        res.status(400).send("Name must be of 3 characters  or more length ");
    }
    if (validatedescription < 7) {
        res.status(400).send(
            "Description must be of 7 characters  or more length "
        );
    }
    if (validateaddress < 5) {
        res.status(400).send(
            "Address must be of 5 characters  or more length "
        );
    }
    if (validatecategory < 5) {
        res.status(400).send(
            "Category must be of 5 characters  or more length "
        );
    }
    var x = new Date(expiresOn);
    var y = new Date(Date.now());

    let image;

    try {
        image = uploadImageToStorage(req.file);
    } catch (e) {
        return res.status(400).send({ error: e.message, type: "Image" });
    }
    const product = await item
        .create({
            name,
            images: image,
            description,
            category,
            expiresOn,
            user: req.user._id,
            shippingAddress: { address, shippingCharge },
            seller: {
                sellername: req.user.name,
                selleraddress: req.user.address,
                selleremail: req.user.email,
                phoneNo: {
                    mobile: req.user.contact.phoneNumber,
                    isVerified: req.user.contact.isVerified,
                },
            },
            Cost: { price, negotiable },
        })
        .then(() => {
            return res.status(201).send("Your property is successfully listed");
        })
        .catch((err) => {
            return res.status(400).send(err);
        });
};

export const getItemById = async (req: any, res: any) => {
    const product = await item.findById(req.params.id);
    if (product) {
        return res.status(201).json(product);
    } else {
        return res.status(400).json({ message: "No product found" });
    }
};

export const updateItem = async (req: any, res: any) => {
    const {
        name,
        images,
        description,
        category,
        expiresOn,
        address,
        shippingCharge,
        price,
        negotiable,
    } = req.body;

    const product = await item.findById(req.params.id);

    var x = new Date(expiresOn);
    var y = new Date(Date.now());

    if (x < y) {
        res.status(400);
        throw new Error("Put the upcoming date");
    }
    if (
        (product && product.user.toString() === req.user._id.toString()) ||
        (product && req.user.isAdmin)
    ) {
        product.name = name || product.name;
        product.images = images || product.images;
        product.description = description || product.description;
        product.category = category || product.category;
        product.expiresOn = expiresOn || product.expiresOn;
        product.shippingAddress.address =
            address || product.shippingAddress.address;
        product.shippingAddress.shippingCharge =
            shippingCharge || product.shippingAddress.shippingCharge;

        product.Cost.price = price || product.Cost.price;
        product.Cost.negotiable = negotiable || product.Cost.negotiable;

        const updatedProduct = await product.save();
        res.status(201).json(updatedProduct);
    } else {
        res.status(404);
        throw new Error("You cannot edit this product");
    }
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
    const product = await item.findById(req.params.id);
    if (product) {
        await product.remove();
        return res.status(201).send({ message: "Product removed" });
    } else {
        return res.status(404).send("Product not found");
    }
};

export const reviewProduct = async (req: any, res: any) => {
    const { comment } = req.body;
    console.log(req.body);
    const review = {
        name: req.user.name,
        comment,
        user: req.user._id,
    };
    const product = await item.findById(req.params.id);

    product.reviews.push(review);

    await product.save();
    res.status(201).json({ message: "Review successfully added" });
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

export const getProducts = async (req: any, res: any) => {
    const pageSize = 6;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword
        ? {
              name: {
                  $regex: req.query.keyword,
                  $options: "i",
              },
          }
        : {};

    const count = await item.countDocuments({ ...keyword });
    const products = await item
        .find({ ...keyword }, null, {
            sort: { createdAt: -1 },
        })
        .limit(pageSize)
        .skip(pageSize * (page - 1));
    console.log(products);
    if (products.length !== 0) {
        res.status(201).json({
            products,
            page,
            pages: Math.ceil(count / pageSize),
        });
    } else {
        res.status(400).json({ message: "No match found" });
    }
};
