"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: __dirname + '/../.env' });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
//MIDDLEWARES
app.use(express_1.default.json());
app.use((0, cors_1.default)());
//Routes
const product_1 = __importDefault(require("./routes/product"));
const admin_1 = __importDefault(require("./routes/admin"));
const distributer_1 = __importDefault(require("./routes/distributer"));
const orders_1 = __importDefault(require("./routes/orders"));
const marketeer_1 = __importDefault(require("./routes/marketeer"));
//ROUTES
app.use("/admin", admin_1.default);
app.use("/distributer", distributer_1.default);
app.use("/marketeer", marketeer_1.default);
app.use("/order", orders_1.default);
app.use("/products", product_1.default);
app.use("/product_images", express_1.default.static("images"));
mongoose_1.default.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lgzgs.mongodb.net/artpoint?retryWrites=true&w=majority`)
    .then(() => { console.log("connected"); })
    .catch((err) => { console.log("Somthing went wrong, Try again later"); });
app.get("/", (req, res) => {
    res.send("WELCOME TO THE PROJECT API");
});
app.listen(process.env.PORT, () => { console.log('running at http://127.0.0.1:' + process.env.PORT); });
