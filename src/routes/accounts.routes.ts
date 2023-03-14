import { Router } from "express";
import { accountDisable } from "../controllers";
import { isAdmin } from "../middleware/auth";
import { protectRoute } from "../services/protectRoutes.service";

const accountRouter = Router();

accountRouter.post("/disable", protectRoute, isAdmin, accountDisable); // disable user account

export default accountRouter;
