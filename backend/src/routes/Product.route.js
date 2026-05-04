import express from "express";
import RoleMiddleware from "../middleware/Role.middleware.js";
import multer from "multer";
import { CreateProduct,GetMaleProducts,GetFemaleProducts,GetSneakerProducts,GetProductById,AddVariation,GetAllProducts,GetsellerDetailProduct,DeleteProduct,DeleteVariation,UpdateProduct,UpdateVariation } from "../controllers/Product.controller.js";


const upload=multer({storage:multer.memoryStorage()})

const router=express.Router();



router.post("/",upload.array("images",7),RoleMiddleware,CreateProduct)
router.get("/male",GetMaleProducts)
router.get("/female",GetFemaleProducts)
router.get("/sneakers",GetSneakerProducts)
router.get("/:id",GetProductById)
router.post("/:id/variation",upload.array("images",7),RoleMiddleware,AddVariation)
router.get("/seller/products",RoleMiddleware,GetAllProducts)
router.get("/seller/product/:id",RoleMiddleware,GetsellerDetailProduct)
router.delete("/:id",RoleMiddleware,DeleteProduct)
router.delete("/:id/variation/:variationId",RoleMiddleware,DeleteVariation)
router.patch("/:id",upload.array("images",7),RoleMiddleware,UpdateProduct)
router.patch("/:id/variation/:variationId",upload.array("images",7),RoleMiddleware,UpdateVariation)


export default router;