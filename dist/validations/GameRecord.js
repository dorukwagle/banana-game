"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const GameRecord = zod_1.z.object({
    attemptCount: zod_1.z.coerce.number()
        .min(1)
        .max(3)
        .optional(),
    gameover: zod_1.z.boolean().optional(),
    streak: zod_1.z.coerce.number()
});
exports.default = GameRecord;
