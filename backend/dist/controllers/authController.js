"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prismaClient_1 = require("../utils/prismaClient");
const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name, phone, role } = req.body;
        const existing = yield prismaClient_1.prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({ error: "User already exists" });
        }
        const passwordHash = yield bcrypt_1.default.hash(password, 10);
        // basic roles: ADMIN, TRAVELER, GUIDE, DRIVER
        const newRole = ["ADMIN", "TRAVELER", "GUIDE", "DRIVER"].includes(role) ? role : "TRAVELER";
        const user = yield prismaClient_1.prisma.user.create({
            data: { email, password_hash: passwordHash, name, phone, role: newRole }
        });
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal error" });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield prismaClient_1.prisma.user.findUnique({ where: { email } });
        if (!user)
            return res.status(401).json({ error: "Invalid credentials" });
        const isMatch = yield bcrypt_1.default.compare(password, user.password_hash);
        if (!isMatch)
            return res.status(401).json({ error: "Invalid credentials" });
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal error" });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ message: "Logged out. Please remove your token on the client side." });
});
exports.logout = logout;
