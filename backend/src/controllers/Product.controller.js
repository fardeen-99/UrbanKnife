import { Product as productmodel } from "../models/Product.model.js";
import uploadFiles from "../services/upload.service.js";


export const CreateProduct=async (req,res,next)=>{
    try {

const {title,description,size}=req.body
const price = typeof req.body.price === 'string' ? JSON.parse(req.body.price) : req.body.price;
const category = typeof req.body.category === 'string' ? JSON.parse(req.body.category) : req.body.category;


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
    price,
    category,
    size,
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
