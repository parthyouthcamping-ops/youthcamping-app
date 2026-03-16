import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import travelerRoutes from "./routes/traveler.routes";
import adminRoutes from "./routes/admin.routes";
import aiRoutes from "./routes/ai.routes";

const app = express();

app.use(cors());
app.use(express.json());

// Main entry point for API health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// V2 Route Mounting
app.use("/api/auth", authRoutes);
app.use("/api/traveler", travelerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`YouthCamping V2 Backend Server running securely on port ${PORT}`);
});

export default app;
