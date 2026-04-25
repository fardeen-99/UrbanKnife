import { Product as productmodel } from "../models/Product.model.js";
import uploadFiles from "../services/upload.service.js";
import HandleError from "../utils/error.js";
import mongoose from "mongoose";

const VALID_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export const CreateProduct=async (req,res,next)=>{
    try {

const {title,description,genre,clothType}=req.body
const price = typeof req.body.price === 'string' ? JSON.parse(req.body.price) : req.body.price;

// const category = typeof req.body.category === 'string' ? JSON.parse(req.body.category) : req.body.category;
// const {genre,clothType}=category

const currency=req.body.currency;

const images = req.files || [];


const uploadedImages=await Promise.all(images?.map(async (image)=>{
    const file=await uploadFiles(image?.buffer,image?.originalname);
    return {
        url:file.url,
        
    }

}))

console.log(uploadedImages);

const data=await productmodel.create({
    title,
    description,
    price:{
        amount:price,
        currency:currency?currency:"INR"
    },
    category:{
        genre:genre,
        clothType:clothType
    },
    image:uploadedImages,
    sellerID:req.user
})

res.status(201).json({
    success: true,
    message: "Product created successfully",
    product: data
});

}

      catch (error) {
        next(error);
    }
}

export const GetMaleProducts=async(req,res,next)=>{
    try {   
        const products=await productmodel.find({"category.genre":"male"})
        res.status(200).json({
            success:true,
            message:"Products fetched successfully",
            products
        })
    } catch (error) {
        next(error)
    }
}
export const GetFemaleProducts=async(req,res,next)=>{
    try {   
        const products=await productmodel.find({"category.genre":"female"})
        res.status(200).json({
            success:true,
            message:"Products fetched successfully",
            products
        })
    } catch (error) {
        next(error)
    }
}
export const GetSneakerProducts=async(req,res,next)=>{
    try {   
        const products=await productmodel.find({"category.genre":"sneaker"})
        res.status(200).json({
            success:true,
            message:"Products fetched successfully",
            products
        })
    } catch (error) {
        next(error)
    }
}



export const GetProductById=async(req,res,next)=>{
    try {
        const product=await productmodel.findById(req.params.id)
        if(!product){
            return next(new HandleError(404,"Product not found"))
        }

        res.status(200).json({
            success:true,
            message:"Product fetched successfully",
            product
        })
    } catch (error) {
        next(error)
    }
}

export const AddVariation = async (req, res, next) => {
    try {
        const { id } = req.params;

        // 1. Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new HandleError(400, "Invalid product ID"));
        }

        // 2. Fetch product & verify existence
        const product = await productmodel.findById(id).select("sellerID");
        if (!product) {
            return next(new HandleError(404, "Product not found"));
        }

        // 3. Authorization
        if (product.sellerID.toString() !== req.user.toString()) {
            return next(new HandleError(403, "You are not authorized to modify this product"));
        }

        // 4. Parse & validate fields
        const { color, material } = req.body;
        let sizes = req.body.sizes;

        // Since we use multipart/form-data for images, sizes might arrive as a JSON string
        if (typeof sizes === 'string') {
            try {
                sizes = JSON.parse(sizes);
            } catch (e) {
                return next(new HandleError(400, "Invalid sizes format. Must be a JSON array."));
            }
        }

        if (!sizes || !Array.isArray(sizes) || sizes.length === 0) {
            return next(new HandleError(400, "At least one size variation is required"));
        }

        // 5. Validate and normalize sizes
        const validatedSizes = sizes.map((item, index) => {
            // Support for flat objects if parsed from form-data
            const sizeValue = item.size;
            const stockValue = item.stock;
            const priceValue = item.price;

            if (!sizeValue) {
                throw new Error(`Variation at index ${index} is missing 'size'`);
            }

            const normalizedSize = String(sizeValue).toUpperCase();
            if (!VALID_SIZES.includes(normalizedSize)) {
                throw new Error(`Invalid size: ${normalizedSize}. Allowed: ${VALID_SIZES.join(", ")}`);
            }
            
            // Handle stock - default to 0 if missing or empty
            let stock = 0;
            if (stockValue !== undefined && stockValue !== null && stockValue !== "") {
                stock = Number(stockValue);
                if (isNaN(stock) || stock < 0) {
                    throw new Error(`Invalid stock value for size ${normalizedSize}. Received: ${stockValue}`);
                }
            }

            return {
                size: normalizedSize,
                stock: Math.floor(stock), // Ensure integer
                price: (priceValue && !isNaN(Number(priceValue))) ? Number(priceValue) : undefined
            };
        });

        // 6. Upload images
        const images = req.files || [];
        let uploadedImages = [];
        if (images.length > 0) {
            uploadedImages = await Promise.all(
                images.map(async (image) => {
                    const file = await uploadFiles(image.buffer, image.originalname);
                    return { url: file.url };
                })
            );
        }

        // 7. Build the new variation group
        const newVariation = {
            color: color ? String(color).trim() : "Default",
            material: material ? String(material).trim() : "",
            images: uploadedImages,
            sizes: validatedSizes
        };

        // 8. Update product
        const updatedProduct = await productmodel.findByIdAndUpdate(
            id,
            { $push: { variation: newVariation } },
            { new: true, runValidators: true }
        );

        return res.status(201).json({
            success: true,
            message: "Variation added successfully",
            product: updatedProduct,
        });
    } catch (error) {
        if (error.message.includes("Invalid size") || error.message.includes("Must be a JSON")) {
            return next(new HandleError(400, error.message));
        }
        next(error);
    }
};
