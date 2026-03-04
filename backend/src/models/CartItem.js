const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    productId: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

cartItemSchema.index({ userId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model("CartItem", cartItemSchema);

