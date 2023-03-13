import { Router } from "express";
import { protectRoute } from "../services/protectRoutes.service";
import { getChat } from "../controllers/Chat.controller";

const chatRouter = Router();

chatRouter.get("/", [protectRoute], getChat);

export default chatRouter;
