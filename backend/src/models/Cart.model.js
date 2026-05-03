import mongoose from "mongoose";

const CartSchema=new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    items:[
        {
            productID:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product",
                required:true
            },
            quantity:{
                type:Number,
                default:1
            },
            price:{
                type:Number,
                required:true
            },
            size:{
                type:String,
                required:true
            },
            variationID:{
                type:mongoose.Schema.Types.ObjectId,
                // Removed ref: "Variation" because variations are embedded within the Product model
            }
        }
    ]
    
}, { timestamps: true })

export const Cart=mongoose.model("Cart",CartSchema)
