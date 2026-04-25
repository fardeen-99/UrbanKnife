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
      enum: ["male","female","sneaker"],
      required: true
    }
  },

  variation: [
    {
      color: {
        type: String,
      },
      material: {
        type: String,
      },
      images: [
        {
          url: {
            type: String,
          }
        }
      ],
      sizes: [
        {
          size: {
            type: String,
            enum: ["XS", "S", "M", "L", "XL", "XXL"],
            required: true
          },
          stock: {
            type: Number,
            default: 0
          },
          price: {
            type: Number // optional price override for this specific size
          }
        }
      ]
    }
  ],

  sellerID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  }

}, { timestamps: true });

export const Product = mongoose.model("Product", ProductSchema);