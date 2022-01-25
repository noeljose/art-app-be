"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const OrderDetails = new mongoose_1.default.Schema({
    width: Number,
    height: Number,
    arcTop: Boolean,
    arcBottom: Boolean,
    varnish: Boolean,
    whiteCoat: Boolean,
    sandwich: Number,
    message: String
});
const OrderSchema = new mongoose_1.default.Schema({
    product_id: {
        type: String,
        required: true
    },
    order_details: OrderDetails,
    order_placed_by: {
        type: String,
        required: true
    },
    order_processed_by: {
        type: String,
        required: false
    },
    shipping_address: {
        type: String,
        required: false
    },
    status: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: false
    },
    subCategory: {
        type: String,
        required: false
    }
});
const Order = mongoose_1.default.model("Order", OrderSchema);
exports.default = Order;
