"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
let config = {
    siteName: "Artpoint",
    domain: "http://127.0.0.1:5000",
    frontEnd: "http://127.0.0.1:3000",
    mail: {
        host: "smtp.ethereal.email",
        port: 587,
        user: "jarret65@ethereal.email",
        pass: "fHbUDEQkx6UXyU2UMx",
    },
    parentDirectory: __dirname,
    profileDirectory: path_1.default.join(__dirname, "/images/"),
    backend: {
        name: "Noel Jose",
        email: "noeljose1998af@gmail.com"
    }
};
exports.default = config;
