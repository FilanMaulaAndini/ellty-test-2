import { Router } from "express";
import { getTree, startNode, respondNode } from "../controllers/node.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getTree);
router.post("/start", authMiddleware, startNode);
router.post("/:id/respond", authMiddleware, respondNode);

export default router;
