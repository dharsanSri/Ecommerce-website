const express = require("express");
const CartItem = require("../models/CartItem");

const router = express.Router();

const getUserId = (req) =>
  req.header("x-user-id") || req.body.userId || req.query.userId;

const calculateTotal = (items) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0);

router.get("/", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const items = await CartItem.find({ userId }).lean();
    const totalPrice = calculateTotal(items);

    res.json({ cart: items, totalPrice });
  } catch (err) {
    console.error("Error fetching cart", err);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
});

router.post("/", async (req, res) => {
  try {
    const userId = getUserId(req);
    const { product } = req.body;

    if (!userId || !product || typeof product.id === "undefined") {
      return res
        .status(400)
        .json({ message: "userId and product with id are required" });
    }

    const { id, title, price, image } = product;

    let cartItem = await CartItem.findOne({ userId, productId: id });
    if (cartItem) {
      cartItem.quantity += 1;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        userId,
        productId: id,
        title,
        price,
        image,
        quantity: 1,
      });
    }

    const items = await CartItem.find({ userId }).lean();
    const totalPrice = calculateTotal(items);

    res.status(201).json({ cart: items, totalPrice });
  } catch (err) {
    console.error("Error adding to cart", err);
    res.status(500).json({ message: "Failed to add to cart" });
  }
});

router.patch("/:productId", async (req, res) => {
  try {
    const userId = getUserId(req);
    const { productId } = req.params;
    const numericProductId = Number(productId);
    const { action } = req.body;

    if (!userId || !productId || Number.isNaN(numericProductId) || !action) {
      return res
        .status(400)
        .json({ message: "userId, productId and action are required" });
    }

    const item = await CartItem.findOne({ userId, productId: numericProductId });
    if (!item) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    if (action === "increase") {
      item.quantity += 1;
      await item.save();
    } else if (action === "decrease") {
      item.quantity -= 1;
      if (item.quantity <= 0) {
        await item.deleteOne();
      } else {
        await item.save();
      }
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    const items = await CartItem.find({ userId }).lean();
    const totalPrice = calculateTotal(items);

    res.json({ cart: items, totalPrice });
  } catch (err) {
    console.error("Error updating cart quantity", err);
    res.status(500).json({ message: "Failed to update cart item" });
  }
});

router.delete("/:productId", async (req, res) => {
  try {
    const userId = getUserId(req);
    const { productId } = req.params;
    const numericProductId = Number(productId);

    if (!userId || !productId || Number.isNaN(numericProductId)) {
      return res.status(400).json({ message: "userId and productId are required" });
    }

    await CartItem.deleteOne({ userId, productId: numericProductId });

    const items = await CartItem.find({ userId }).lean();
    const totalPrice = calculateTotal(items);

    res.json({ cart: items, totalPrice });
  } catch (err) {
    console.error("Error removing from cart", err);
    res.status(500).json({ message: "Failed to remove from cart" });
  }
});

module.exports = router;

