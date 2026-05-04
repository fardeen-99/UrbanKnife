import {Cart }from "../models/Cart.model.js";
import{ Product } from "../models/Product.model.js";
import HandleError from "../utils/error.js";


// const addToCart=async(req,res,next)=>{
//     try {
//         const {productID,quantity,size,variationID}=req.body;
//         const product=await Product.findById(productID);
//         if(!product){
//             return next(new HandleError(404,"Product not found"));
//         }
// if(variationID){
//     const variation=product.variation.id(variationID);
//     if(!variation){
//         return next(new HandleError(404,"Variation not found"));
//     }
//     var price=variation.price;
// }
// else{
//     var price=product.price;
// }

//         const stock=variationID?product.variation.id(variationID).sizes.find(s=>s.size.toString()===size.toString())?.stock:product.sizes.find(s=>s.size.toString()===size.toString())?.stock;
//         if(quantity>stock){
//             return next(new HandleError(400,"Insufficient stock"));
//         }


//         const cart=await Cart.findOne({userId:req.user.id});
//         if(!cart){
//             const cart=new Cart({userId:req.user.id,items:[{productID,quantity,price,size,variationID}]});
//             await cart.save();
//             return res.status(200).json({success:true,cart});
//         }

//         const existingItem=cart.items.find(
//             item=>item.productID.toString() === productID && item.size === size && item.variationID?.toString() === (variationID || "")
//         )

//         if(existingItem){
//             existingItem.quantity+=quantity;
            
//         }
//         else{
//             cart.items.push({productID,quantity,price,size,variationID});
//         }
//         await cart.save();
//         return res.status(200).json({success:true,cart});
//     }
//     catch(error){
//         next(error);
//     }
// }




export const addToCart = async (req, res, next) => {
    try {
        let { productID, quantity, size, variationID } = req.body;
        
        // If frontend sends "0" or 0 for no variation, set it to undefined to prevent Mongoose CastError
        if (!variationID || variationID === "0" || variationID === 0) {
            variationID = undefined;
        }

        const product = await Product.findById(productID);
        
        if (!product) {
            return next(new HandleError(404, "Product not found"));
        }

        let price = product.price.amount;
        let stock = 0;

        if (variationID) {
            const variation = product.variation.id(variationID);
            if (!variation) {
                return next(new HandleError(404, "Variation not found"));
            }

            const sizeObj = variation.sizes.find(s => s.size.toString() === size.toString());
            if (!sizeObj) {
                return next(new HandleError(404, "Size not found in variation"));
            }

            stock = sizeObj.stock;
            if (sizeObj.price) price = sizeObj.price;
        } else {
            const sizeObj = product.sizes.find(s => s.size.toString() === size.toString());
            if (!sizeObj) {
                return next(new HandleError(404, "Size not found"));
            }

            stock = sizeObj.stock;
            if (sizeObj.price) price = sizeObj.price;
        }

        if (quantity > stock) {
            return next(new HandleError(400, "Insufficient stock"));
        }

        let cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            cart = new Cart({ userId: req.user.id, items: [{ productID, quantity, price, size, variationID }] });
        } else {
            const existingItem = cart.items.find(
                item => {
                    const isSameProduct = item.productID.toString() === productID.toString();
                    const isSameSize = item.size === size;
                    const isSameVariation = variationID 
                        ? item.variationID?.toString() === variationID.toString() 
                        : !item.variationID;
                    return isSameProduct && isSameSize && isSameVariation;
                }
            );

            if (existingItem) {
                if (existingItem.quantity + quantity > stock) {
                    return next(new HandleError(400, "Cannot add more items than available in stock"));
                }
                existingItem.quantity += quantity;
                
                // If quantity becomes 0 or less, we should probably remove it, 
                // but for now we follow the existing logic where quantity is updated.
                // HandleDecreaseCart in frontend checks for quantity <= 1.
            } else {
                cart.items.push({ productID, quantity, price, size, variationID });
            }
        }
        
        await cart.save();

        // Populate and transform for consistent frontend experience
        const populatedCart = await Cart.findById(cart._id).populate("items.productID");
        const transformedCart = transformCartData(populatedCart);

        return res.status(200).json({ success: true, cart: transformedCart });
    }
    catch (error) {
        next(error);
    }
}

// export const carttoadd=async(req,res,next)=>{

// const {varid,proid,size}=req.body


// const productReal=await Product.findOne({

//   _id:proid  

// })

// let price=productReal.price.amount

// let stock=productReal.sizes.stock

// if(!productReal){
//     return res.status(404).json({
//         message:"product not found"
//     })
// }

// if(varid){
//     const variation=await Product.variation.id(varid)
//     if(!variation){
//     return res.status(404).json({
//         message:"variation not found"
//     })
// }

// if(variation.sizes.price){
//     price=variation.sizes.price
// }

// stock=variation.sizes.stock

// }
// const cartavail=await Cart.findOne({
//     userId:req.user
// })

// if(cartavail){
// const existingCart=cartavail.items.find(item=>{
//     const isproduct=item.productId.toString()===proid
//     const isSize=item.size.toString()===size
//     const isprice=item.price===price
//     const isvariation=varid?item.variationId.toString()===varid:!varid

//     return isproduct && isSize && isprice && isvariation
// })

// if(existingCart){
//     if(existingCart.quantity+quantity>stock){
//         return res.status(400).json({
//             message:"cannot add more items "
//         })
//     }else{
//         cartavail.items.quantity+=1
//     }
// }


// }else{
//     if(quantity>stock){
//      return res.status(400).json({
//         message:"not added too much product"
//      })
//     }
//     const cartmodel=await Cart.create({
//         userId:req.user,
//         item:[{
//             productId:proid,
//             variationId:varid,
//             size,
//             price
//         }]
//     })

// }


// }

export const getUserCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id }).populate("items.productID");
        
        if (!cart) {
            return next(new HandleError(404, "Cart not found"));
        }

        const transformedCart = transformCartData(cart);

        res.status(200).json({
            success: true,
            cart: transformedCart
        });
    }
    catch (error) {
        next(error);
    }
}

// Helper function to transform cart data with populated product/variation details
const transformCartData = (cart) => {
    if (!cart) return null;

    const transformedItems = cart.items.map(item => {
        const product = item.productID;
        
        if (!product) return null; 

        // Default product details
        let responseItem = {
            _id: item._id, 
            productID: product._id, 
            quantity: item.quantity,
            size: item.size,
            price: item.price,
            variationID: item.variationID,
            title: product.title,
            description: product.description,
        };

        // If cart item has variationID, extract variation details (color, image, material)
        if (item.variationID && product.variation) {
            const variation = product.variation.find(v => v._id.toString() === item.variationID.toString());
            
            if (variation) {
                responseItem.image = variation.images; 
                responseItem.color = variation.color;
                responseItem.material = variation.material;
            } else {
                responseItem.image = product.image;
                responseItem.color = product.color;
                responseItem.material = product.material;
            }
        } else {
            // No variation (original product)
            responseItem.image = product.image;
            responseItem.color = product.color;
            responseItem.material = product.material;
        }

        return responseItem;
    }).filter(item => item !== null);

    return {
        _id: cart._id,
        userId: cart.userId,
        items: transformedItems
    };
};


export const removeFromCart =async (req,res,next)=>{
    
try{

const id=req.params.id

const cart=await Cart.findOne({userId:req.user.id})

if(!cart){
    return next(new HandleError(404,"cart not found"))
}

const item=cart.items.find(item=>item._id.toString()===id.toString())

if(!item){
    return next(new HandleError(404,"item not found"))
}

cart.items.pull(id)
await cart.save()

return res.status(200).json({
    success:true,
    message:"item removed from cart"
})

}catch{
    next(error)
}

}