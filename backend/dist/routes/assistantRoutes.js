"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const assistantController_1 = require("../controllers/assistantController");
const router = (0, express_1.Router)();
router.post("/assistant", authMiddleware_1.authenticate, assistantController_1.askAssistant);
router.post("/ops/query", authMiddleware_1.authenticate, authMiddleware_1.requireAdmin, assistantController_1.opsQuery);
exports.default = router;
