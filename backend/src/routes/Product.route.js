import express from "express";
import RoleMiddleware from "../middleware/Role.middleware.js";
import multer from "multer";


const upload=multer({storage:multer.memoryStorage()})

const router=express.Router();

router.post("/",upload.array("image",7),RoleMiddleware,CreateProduct)


export default router;