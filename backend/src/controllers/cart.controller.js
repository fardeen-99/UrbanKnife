import Cart from "../models/Cart.model.js";
import Product  from "../models/Product.model.js";
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
        const { productID, quantity, size, variationID } = req.body;
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

        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            const newCart = new Cart({ userId: req.user.id, items: [{ productID, quantity, price, size, variationID }] });
            await newCart.save();
            return res.status(200).json({ success: true, cart: newCart });
        }

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
        } else {
            cart.items.push({ productID, quantity, price, size, variationID });
        }
        
        await cart.save();
        return res.status(200).json({ success: true, cart });
    }
    catch (error) {
        next(error);
    }
}

