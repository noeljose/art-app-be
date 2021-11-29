"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
// const express  = require("express")
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const mongoose_1 = __importDefault(require("mongoose"));
const product_1 = __importDefault(require("./routes/product"));
//ROUTES
app.use("/products", product_1.default);
mongoose_1.default.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lgzgs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
    .then(() => { console.log("connected"); })
    .catch(() => { console.log("Somthing went wrong, Try again later"); });
app.get("/", (req, res) => {
    res.send("WELCOME TO THE PROJECT API");
});
app.listen(process.env.PORT);
