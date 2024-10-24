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
exports.getUser = exports.registerUser = void 0;
const formatValidationErrors_1 = __importDefault(require("../../utils/formatValidationErrors"));
const hash_1 = require("../../utils/hash");
const prismaClient_1 = __importDefault(require("../../utils/prismaClient"));
const User_1 = __importDefault(require("../../validations/User"));
const registerUser = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const res = { statusCode: 400 };
    const validation = User_1.default.safeParse(body);
    const error = (0, formatValidationErrors_1.default)(validation);
    if (error)
        return error;
    const data = validation.data;
    data.password = yield (0, hash_1.hashPassword)(data.password);
    res.data = yield prismaClient_1.default.users.create({
        data,
        omit: { password: true },
    });
    res.statusCode = 200;
    return res;
});
exports.registerUser = registerUser;
const getUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return prismaClient_1.default.users.findUnique({
        where: {
            userId,
        },
        omit: { password: true },
    });
});
exports.getUser = getUser;
