import { Router } from "express"
import authMiddleware from "../middleware/auth.middleware.js";
import { addToCart } from "../controllers/cart.controller.js";



const router = Router();


router.post("/add", authMiddleware, addToCart);


export default router;