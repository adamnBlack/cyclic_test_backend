const express = require("express");
const { AuthValidator } = require("../middlewares/Auth.middleware");
const { ValidationForProducts } = require("../middlewares/ValidationForProducts");
const { CartModel } = require("../models/Cart.model");
const { ProductModel } = require("../models/Products.model");
const cartRouter = express.Router();


cartRouter.use(AuthValidator);


cartRouter.get("/cartItems", async (req, res) => {
    const price_low = req.query.price_low;
    const price_high = req.query.price_high;

    if (price_low && price_high) {
        try {
            let cartItems = await CartModel.find({ $and: [{ price: { $gt: price_low } }, { price: { $lt: price_high } }] });
            res.send(cartItems);
        }
        catch (err) {
            console.log(err);
            res.send({ Message: "Can not find cart items in given range!" });
        }
    }
    else {
        try {
            let cartdata = await CartModel.find();
            res.send(cartdata);
        }
        catch (err) {
            console.log(err);
            res.send({ Message: "Can not find products!" });
        }
    }
});


// Sorting Asc or Desc
cartRouter.get("/q", async (req, res) => {
    let query = req.query;
    try {
        if (query.sortBy) {
            const sortedData = await CartModel.find(query).sort({ price: query.sortBy });
            res.send(sortedData);
        } else {
            const data = await CartModel.find(query);
            res.send(data);
        }
    }
    catch (err) {
        console.log(err);
        res.send({ Message: "Can't sort cart items!" });
    }
});


cartRouter.post("/addcartItem/:id", async (req, res) => {
    const id = req.params.id;
    const item = await ProductModel.findById({ "_id": id });

    try {
        const cartItem = new CartModel({
            brand: item.brand,
            name: item.name,
            weight: item.weight,
            price: item.price,
            mrp: item.mrp,
            ImgSrc: item.ImgSrc,
            category: item.category,
            sasta: item.sasta,
            packet: item.packet,
            offers: item.offers,
            isavailable: item.isavailable,
            quantity: item.quantity
        });
        await cartItem.save();
        res.send({ Message: "Item added to cart successfully!" });
    }
    catch (err) {
        console.log(err);
        res.send({ Message: "Item can't be added to cart!" });
    }
});


cartRouter.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;

    try {
        await CartModel.findByIdAndDelete({ "_id": id });
        res.send({ Message: "Cart Item Deleted!" });
    } catch (error) {
        console.log(err);
        res.send({ Message: "Can not delete cart item!" });
    }
});

cartRouter.patch("/update/:id", async (req, res) => {
    const payload = req.body;
    const id = req.params.id;

    try {
        await CartModel.findByIdAndUpdate({ "_id": id }, payload);
        res.send({ Message: "Product Quantity Updated!" });
    }
    catch (error) {
        console.log(err);
        res.send({ Message: "Can not update quantity of product!" });
    }
});

// only admin can add many cart items
cartRouter.use(ValidationForProducts);

// Insert many
cartRouter.post("/addmany", async (req, res) => {
    const payload = req.body;
    try {
        await CartModel.insertMany(payload);
        res.send({ Message: "All Products added to cart!" });
    }
    catch (err) {
        console.log(err);
        res.send({ Message: "Can not add all products to cart!" });
    }
});


// Delete all cart items
cartRouter.delete("/deletemany", async (req, res) => {
    try {
        await CartModel.deleteMany();
        res.send({ Message: "All Cart Items deleted!" });
    }
    catch (err) {
        console.log(err);
        res.send({ Message: "Can not delete all cart items something went wrong!" });
    }
});


module.exports = { cartRouter };