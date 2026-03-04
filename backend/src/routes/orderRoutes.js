const express = require("express");
const CartItem = require("../models/CartItem");
const Order = require("../models/Order");

const router = express.Router();

const getUserId = (req) =>
  req.header("x-user-id") || req.body.userId || req.query.userId;

const calculateTotal = (items) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0);

// Product IDs by category (Fake Store API): 1-4 men's clothing, 5-8 jewelery, 9-14 electronics, 15-20 women's clothing
const CLOTHING_IDS = [1, 2, 3, 4, 15, 16, 17, 18, 19, 20];
const ELECTRONICS_JEWELLERY_IDS = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

const getCategorySubtotals = (items) => {
  let clothing = 0;
  let electronicsJewelery = 0;
  for (const item of items) {
    const line = item.price * (item.quantity || 1);
    if (CLOTHING_IDS.includes(item.productId)) clothing += line;
    else if (ELECTRONICS_JEWELLERY_IDS.includes(item.productId)) electronicsJewelery += line;
  }
  return { clothing, electronicsJewelery };
};

router.post("/", async (req, res) => {
  try {
    const userId = getUserId(req);
    const { name, mobileNumber, address, discountClothingApplied, discountElectronicsJeweleryApplied } = req.body;

    if (!userId || !name || !mobileNumber || !address) {
      return res.status(400).json({
        message: "userId, name, mobileNumber and address are required",
      });
    }

    const cartItems = await CartItem.find({ userId }).lean();
    if (!cartItems.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalPrice = calculateTotal(cartItems);
    const { clothing: clothingSubtotal, electronicsJewelery: electronicsJewelerySubtotal } = getCategorySubtotals(cartItems);

    if (discountClothingApplied && clothingSubtotal > 500) {
      totalPrice -= Math.round(clothingSubtotal * 0.1 * 100) / 100;
    }
    if (discountElectronicsJeweleryApplied && electronicsJewelerySubtotal > 1000) {
      totalPrice -= Math.round(electronicsJewelerySubtotal * 0.15 * 100) / 100;
    }
    totalPrice = Math.round(totalPrice * 100) / 100;

    const order = await Order.create({
      userId,
      name,
      mobileNumber,
      address,
      items: cartItems.map((item) => ({
        productId: item.productId,
        title: item.title,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
      })),
      totalPrice,
    });

    await CartItem.deleteMany({ userId });

    res.status(201).json(order);
  } catch (err) {
    console.error("Error creating order", err);
    res.status(500).json({ message: "Failed to create order" });
  }
});

router.get("/", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

module.exports = router;

