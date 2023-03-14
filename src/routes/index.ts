import { Router } from "express";
import authRouter from "./auth.routes";
import passportRouter from "./passport.routes";
import productRouter from "./product.routes";
import userRouter from "./user.routes";
import cartRouter from "./cart.routes";
import checkoutRouter from "./checkout.routes";
import orderRouter from "./order.routes";
import wishRouter from "./wishes.routes";
import chatRouter from "./chat.routes";

const router = Router();

router.use("/auth", authRouter);
router.use(passportRouter);
router.use("/product", productRouter);
router.use("/cart", cartRouter);
router.use("/user", userRouter);
router.use("/checkout", checkoutRouter);
router.use("/order", orderRouter);
router.use("/wishes", wishRouter);
router.use("/chat", chatRouter);

export default router;
