import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== "ADMIN") {
    res.status(403).json({ error: "Forbidden: Admins only" });
    return;
  }
  next();
};
