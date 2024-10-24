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
exports.getRecords = exports.getPlayerStats = exports.saveGame = void 0;
const formatValidationErrors_1 = __importDefault(require("../../utils/formatValidationErrors"));
const prismaClient_1 = __importDefault(require("../../utils/prismaClient"));
const GameRecord_1 = __importDefault(require("../../validations/GameRecord"));
const Params_1 = __importDefault(require("../../validations/Params"));
const calculateUserStrength = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userGames = yield prismaClient_1.default.gameRecords.findMany({
        where: {
            userId
        }
    });
    const totalGames = userGames.length;
    const obtainedStars = userGames.reduce((a, b) => a + (b.attemptCount || 0), 0);
    const gameovers = userGames.reduce((a, b) => a + (b.gameover ? 1 : 0), 0);
    const validStars = obtainedStars - gameovers;
    return validStars / (totalGames * 3) * 100;
});
const updateUserStats = (userId, streak) => __awaiter(void 0, void 0, void 0, function* () {
    const userStats = yield prismaClient_1.default.gameProgress.findFirst({
        where: {
            userId
        },
    });
    const highestStreak = Math.max((userStats === null || userStats === void 0 ? void 0 : userStats.highestStreak) || 0, streak);
    const gamesCount = yield prismaClient_1.default.gameRecords.count({
        where: {
            userId
        }
    });
    const userStrength = yield calculateUserStrength(userId);
    yield prismaClient_1.default.gameProgress.update({
        where: {
            userId
        },
        data: {
            highestStreak,
            gamesCount,
            userStrength
        }
    });
});
const saveGame = (userId, game) => __awaiter(void 0, void 0, void 0, function* () {
    const res = { statusCode: 200 };
    const data = GameRecord_1.default.safeParse(game);
    const error = (0, formatValidationErrors_1.default)(data);
    if (error)
        return error;
    const { streak, attemptCount, gameover } = data.data;
    yield prismaClient_1.default.gameRecords.create({
        data: {
            userId,
            attemptCount,
            gameover
        }
    });
    yield updateUserStats(userId, streak);
    res.data = { message: "game saved" };
    return res;
});
exports.saveGame = saveGame;
const getPlayerStats = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const res = { statusCode: 200 };
    const userStats = yield prismaClient_1.default.gameProgress.findFirst({
        where: {
            userId
        },
    });
    if (userStats) {
        res.data = userStats;
        return res;
    }
    res.data = yield prismaClient_1.default.gameProgress.create({
        data: {
            userId,
        }
    });
    return res;
});
exports.getPlayerStats = getPlayerStats;
const getRecords = (userId, params) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const res = { statusCode: 200, };
    const data = Params_1.default.safeParse(params);
    const page = ((_a = data.data) === null || _a === void 0 ? void 0 : _a.page) || 1;
    const pageSize = ((_b = data.data) === null || _b === void 0 ? void 0 : _b.pageSize) || parseInt(process.env.PAGE_SIZE || "10");
    res.data = yield prismaClient_1.default.gameRecords.findMany({
        where: {
            userId
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
            createdAt: "desc"
        }
    });
    const totalGames = yield prismaClient_1.default.gameRecords.count({
        where: {
            userId
        }
    });
    res.info = {
        hasNextPage: (page * pageSize) < totalGames,
        itemsCount: totalGames
    };
    return res;
});
exports.getRecords = getRecords;
