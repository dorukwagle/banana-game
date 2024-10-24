"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const User = zod_1.z.object({
    fullName: zod_1.z
        .string({ required_error: "Full Name is required" })
        .refine((val) => val.split(" ").length >= 2, "Please enter your full name"),
    username: zod_1.z
        .string({ required_error: "Username is required" })
        .min(5, "Must be at least 5 characters"),
    password: zod_1.z
        .string({ required_error: "Password is required" })
        .min(8, "Password must be at least 8 characters long"),
});
exports.default = User;
