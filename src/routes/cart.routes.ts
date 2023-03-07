import { Router } from "express";
import {
  addToCart,
  clearCart,
  removeFromCart,
  updateCartProduct,
  viewCart,
} from "../controllers";
import { isAuth } from "../middleware/auth";
import { ProductSchema, ValidateJoi } from "../middleware/validation";
import { protectRoute } from "../services/protectRoutes.service";

const cartRouter = Router();

cartRouter.post(
  "/add",
  [protectRoute, ValidateJoi(ProductSchema.product.addToCart)],
  addToCart,
);

cartRouter.get("/", [protectRoute], viewCart);

cartRouter.delete("/remove/:id", [protectRoute], removeFromCart);

cartRouter.delete("/clear", [isAuth], clearCart);

cartRouter.patch(
  "/update/:id",
  [protectRoute, ValidateJoi(ProductSchema.product.updateCart)],
  updateCartProduct,
);

export default cartRouter;
