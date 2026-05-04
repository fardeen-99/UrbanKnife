import { Router } from "express"
import authMiddleware from "../middleware/auth.middleware.js";
import { addToCart,getUserCart, removeFromCart } from "../controllers/cart.controller.js";



const router = Router();


router.post("/add", authMiddleware, addToCart);
router.get("/",authMiddleware,getUserCart);
router.delete("/:id",authMiddleware,removeFromCart);


export default router;