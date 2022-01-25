"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const DistributerSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    basePrice: {
        type: Number,
        required: true
    },
    deliveryPrice: {
        type: Number,
        required: true
    },
    active: {
        type: Boolean,
        default: false
    },
});
const Distributer = mongoose_1.default.model("Distributer", DistributerSchema);
exports.default = Distributer;
