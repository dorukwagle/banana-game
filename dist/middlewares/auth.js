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
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const getSession = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const sessionCookie = req.cookies.sessionId;
    if (!sessionCookie)
        return null;
    return prismaClient_1.default.sessions.findFirst({
        where: {
            AND: [
                {
                    session: sessionCookie
                },
                {
                    expiresAt: { gte: new Date() }
                }
            ]
        }
    });
});
const authorize = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield getSession(req);
    if (!session)
        return res.status(401).json({ error: "please login first" });
    req.session = session;
    next();
});
exports.default = authorize;
