import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { chatWithAssistant } from "../controllers/ai.controller";

const router = Router();
router.use(authenticate);

router.post("/chat", chatWithAssistant);

export default router;
