import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prismaClient";
import { AuthRequest } from "../middleware/auth.middleware";

const JWT_SECRET = process.env.JWT_SECRET || "YouthCamping_SuperSecret_JWT_Key_2026";
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });
    
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: EXPIRES_IN as any });
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch(err: any) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = async (req: AuthRequest, res: Response): Promise<any> => {
    return res.json({ message: "Successfully logged out" });
};

export const me = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const user = await prisma.user.findUnique({ where: { id: req.user!.id }});
      if(!user) return res.status(404).json({ error: "User not found" });
      
      return res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
    } catch(err: any) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
};
