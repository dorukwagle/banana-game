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
const express_1 = __importDefault(require("express"));
const gameModel_1 = require("./gameModel");
const game = express_1.default.Router();
game.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, statusCode, info } = yield (0, gameModel_1.getRecords)(req.session.userId, req.query);
    res.status(statusCode).json({ data, info });
}));
game.get("/stats", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { statusCode, data } = yield (0, gameModel_1.getPlayerStats)(req.session.userId);
    res.status(statusCode).json(data);
}));
game.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { statusCode, data } = yield (0, gameModel_1.saveGame)(req.session.userId, req.body);
    res.status(statusCode).json(data);
}));
exports.default = game;
