import { Product as productmodel } from "../models/Product.model.js";
import uploadFiles from "../services/upload.service.js";
import HandleError from "../utils/error.js";
import mongoose from "mongoose";

const VALID_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export const CreateProduct = async (req, res, next) => {
    try {
        const { title, description, genre, clothType, currency, color, material } = req.body;
        let sizes = req.body.sizes;

        // Parse price
        let amount = req.body.price;
        if (typeof amount === 'string') amount = Number(amount);
        if (isNaN(amount)) return next(new HandleError(400, "Invalid price amount"));

        // Handle images
        const images = req.files || [];
        if (images.length === 0) return next(new HandleError(400, "At least one product image is required"));

        const uploadedImages = await Promise.all(images.map(async (image) => {
            const file = await uploadFiles(image.buffer, image.originalname);
            return { url: file.url };
        }));

        // Parse sizes if provided — these belong to the PRODUCT itself, not a variation
        let productSizes = [];
        if (sizes) {
            if (typeof sizes === 'string') sizes = JSON.parse(sizes);
            if (Array.isArray(sizes) && sizes.length > 0) {
                productSizes = sizes.map(s => ({
                    size: String(s.size).toUpperCase(),
                    stock: Math.floor(Number(s.stock || 0)),
                    price: s.price ? Number(s.price) : undefined
                }));
            }
        }

        const data = await productmodel.create({
            title,
            description,
            price: {
                amount: amount,
                currency: currency || "INR"
            },
            category: {
                genre: genre,
                clothType: clothType
            },
            image: uploadedImages,
            color: color || "Default",
            material: material || "",
            sizes: productSizes,
            variation: [],
            sellerID: req.user
        });

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product: data
        });
    } catch (error) {
        next(error);
    }
};

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

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new HandleError(400, "Invalid product ID"));
        }

        const product = await productmodel.findById(id).select("sellerID");
        if (!product) {
            return next(new HandleError(404, "Product not found"));
        }

        if (product.sellerID.toString() !== req.user.toString()) {
            return next(new HandleError(403, "You are not authorized to modify this product"));
        }

        // --- ENFORCE IMAGE UPLOAD FOR NEW VARIATIONS ---
        const images = req.files || [];
        if (!images || images.length === 0) {
            return next(new HandleError(400, "Image upload is mandatory for new variations"));
        }

        const { color, material } = req.body;
        let sizes = req.body.sizes;

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

        const validatedSizes = sizes.map((item, index) => {
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
            
            let stock = 0;
            if (stockValue !== undefined && stockValue !== null && stockValue !== "") {
                stock = Number(stockValue);
                if (isNaN(stock) || stock < 0) {
                    throw new Error(`Invalid stock value for size ${normalizedSize}. Received: ${stockValue}`);
                }
            }

            return {
                size: normalizedSize,
                stock: Math.floor(stock),
                price: (priceValue && !isNaN(Number(priceValue))) ? Number(priceValue) : undefined
            };
        });

        const uploadedImages = await Promise.all(
            images.map(async (image) => {
                const file = await uploadFiles(image.buffer, image.originalname);
                return { url: file.url };
            })
        );

        const newVariation = {
            color: color ? String(color).trim() : "Default",
            material: material ? String(material).trim() : "",
            images: uploadedImages,
            sizes: validatedSizes
        };

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

export const GetAllProducts=async(req,res,next)=>{
    try {
        const products=await productmodel.find({sellerID:req.user})
        if(!products){
            return next(new HandleError(404,"Products not found"))
        }
        res.status(200).json({
            success:true,
            message:"Products fetched successfully",
            products
        })
    } catch (error) {
        next(error)
    }
}

export const GetsellerDetailProduct=async(req,res,next)=>{
    try {
        const product=await productmodel.findById(req.params.id)
        if(!product){
            return next(new HandleError(404,"Product not found"))
        }
        if(product.sellerID.toString()!==req.user.toString()){
            return next(new HandleError(403,"You are not authorized to access this product"))
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