import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  price: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      enum: ["INR","USD","AED"],
      default: "INR"
    }
  },

  image: [
    {
      url: {
        type: String,
        required: true
      }
    }
  ],

  category: {
    clothType: {
      type: String,
      required: true
    },
    genre: {
      type: String,
      enum: ["male","female","kids"],
      required: true
    }
  },

  variation: [
    {
      attributes: {
        type: Map,
        of: String   // color, material, etc
      },

      size: {
        type: String,
        enum: ["XS","S","M","L","XL","XXL"]
      },

      stock: {
        type: Number,
        default: 0
      },

      images: [
        {
          url: {
            type: String,
            required: true
          }
        }
      ],

      price: {
        type: Number // optional override
      }
    }
  ],

  sellerID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user"
  }

}, { timestamps: true });

export const Product = mongoose.model("product", ProductSchema);