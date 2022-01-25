"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const cors_1 = __importDefault(require("cors"));
const admin = (0, express_1.default)();
//MIDDLEWARES
admin.use((0, cors_1.default)());
// admin.use(validate_token)
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images/');
    },
    filename: (req, file, cb) => {
        const { originalname } = file;
        let finalName = () => {
            // let ext = originalname.split(".")
            return `${(0, uuid_1.v4)()}.jpg`;
        };
        let file_name = finalName();
        req.body.customFileUploadName = file_name;
        cb(null, file_name);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
//MODELS
const Marketeer_1 = __importDefault(require("../models/Marketeer"));
const Distributer_1 = __importDefault(require("../models/Distributer"));
const Order_1 = __importDefault(require("../models/Order"));
//CREATE SALESMAN
admin.post("/marketeer/create", async (req, res) => {
    let response = {
        status: false,
        message: "Somthing went wrong!"
    };
    let data = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password
    };
    try {
        await Marketeer_1.default.create(data).catch((error) => { throw new Error; });
        response.status = true;
        response.message = "Sales person creation successful";
    }
    catch (error) {
        response.status = false;
        response.message = "Sales person creation failed!";
    }
    res.json(response);
});
//UPDATE SALESMAN
admin.post("/marketeer/update", async (req, res) => {
    let response = {
        status: false,
        message: "Somthing went wrong"
    };
    let _id = req.body._id;
    let data = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        active: req.body.active
    };
    try {
        await Marketeer_1.default.findByIdAndUpdate(_id, data).catch((error) => { throw new Error; });
        response.status = true;
        response.message = "Sales person data updation successful";
    }
    catch (error) {
        response.status = false;
        response.message = "Sales person data updation failed!";
    }
    res.json(response);
});
//READ SALESMAN
admin.post("/marketeer/read", async (req, res) => {
    let response = {
        status: false,
        message: "Somthing went wrong"
    };
    let limit = req.body.limit || 1;
    let skip = req.body.skip || 0;
    try {
        let partData = await Marketeer_1.default.find().limit(limit).skip(skip).catch((error) => { throw new Error; });
        let count = await Marketeer_1.default.find().countDocuments();
        response.status = true;
        response.message = "Data fetched successfully";
        response.data = {
            marketeers: partData,
            count: count
        };
    }
    catch (error) {
        response.status = false;
        response.message = "Data fetch failed!";
    }
    res.json(response);
});
//ASSIGN SALESMAN
admin.post("/marketeer/assign", async (req, res) => {
    let response = {
        status: false,
        message: "Somthing went wrong"
    };
    let marketeer_id = req.body.marketeer_id;
    let order_id = req.body.order_id;
    try {
        await Order_1.default.findByIdAndUpdate(order_id, {
            $set: { order_processed_by: marketeer_id, status: 1 }
        })
            .then(() => {
            response.status = true;
            response.message = "Sales person assigned successfully";
        })
            .catch((error) => { throw new Error; });
    }
    catch (error) {
        response.status = false;
        response.message = "Sales person assign failed!";
    }
    res.json(response);
});
//READ SALESMAN SINGLE
admin.post("/marketeer/read/:id", async (req, res) => {
    let response = {
        status: false,
        message: "Somthing went wrong"
    };
    let _id = req.params.id;
    try {
        await Marketeer_1.default.findById(_id)
            .then((data) => {
            response.status = true;
            response.message = "Sales person fetched successfully";
            response.data = data;
        })
            .catch((error) => { throw new Error; });
    }
    catch (error) {
        response.status = false;
        response.message = "Sales person fetch failed!";
    }
    res.json(response);
});
//DELETE SALESMAN
admin.post("/marketeer/delete", async (req, res) => {
    let response = {
        status: false,
        message: "Somthing went wrong"
    };
    let _id = req.body._id;
    try {
        await Marketeer_1.default.findByIdAndDelete(_id)
            .then((data) => {
            response.status = true;
            response.message = "Sales person deleted successfully";
        })
            .catch((error) => { throw new Error; });
    }
    catch (error) {
        response.status = false;
        response.message = "Sales person deleted failed!";
    }
    res.json(response);
});
//CREATE DISTRIBUTER
admin.post("/distributer/create", async (req, res) => {
    let response = {
        status: false,
        message: "Somthing went wrong!"
    };
    let data = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password,
        basePrice: req.body.basePrice,
        deliveryPrice: req.body.deliveryPrice,
        address: "No address Provided yet"
    };
    req.body.address ? data.address = req.body.address : null;
    try {
        await Distributer_1.default.create(data).catch((error) => {
            console.log(error);
            throw new Error;
        });
        response.status = true;
        response.message = "Distributer creation successful";
    }
    catch (error) {
        response.status = false;
        response.message = "Distributer creation failed!";
    }
    res.json(response);
});
//UPDATE DISTRIBUTER
admin.post("/distributer/update", async (req, res) => {
    let response = {
        status: false,
        message: "Somthing went wrong"
    };
    let _id = req.body._id;
    let data = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        active: req.body.active,
        basePrice: req.body.basePrice,
        deliveryPrice: req.body.deliveryPrice,
        address: req.body.address
    };
    try {
        await Distributer_1.default.findByIdAndUpdate(_id, data).catch((error) => { throw new Error; });
        response.status = true;
        response.message = "Distributer data updation successful";
    }
    catch (error) {
        response.status = false;
        response.message = "Distributer data updation failed!";
    }
    res.json(response);
});
//READ DISTRIBUTER
admin.post("/distributer/read", async (req, res) => {
    let response = {
        status: false,
        message: "Somthing went wrong"
    };
    let limit = req.body.limit || 1;
    let skip = req.body.skip || 0;
    try {
        let partData = await Distributer_1.default.find().limit(limit).skip(skip).catch((error) => { throw new Error; });
        let count = await Distributer_1.default.find().countDocuments();
        response.status = true;
        response.message = "Data fetched successfully";
        response.data = {
            distributer: partData,
            count: count
        };
    }
    catch (error) {
        response.status = false;
        response.message = "Data fetch failed!";
    }
    res.json(response);
});
//READ DISTRIBUTER SINGLE
admin.post("/distributer/read/:id", async (req, res) => {
    let response = {
        status: false,
        message: "Somthing went wrong"
    };
    let _id = req.params.id;
    try {
        await Distributer_1.default.findById(_id)
            .then((data) => {
            response.status = true;
            response.message = "Distributer fetched successfully";
            response.data = data;
        })
            .catch((error) => { throw new Error; });
    }
    catch (error) {
        response.status = false;
        response.message = "Distributer fetch failed!";
    }
    res.json(response);
});
//DELETE DISTRIBUTER
admin.post("/distributer/delete", async (req, res) => {
    let response = {
        status: false,
        message: "Somthing went wrong"
    };
    let _id = req.body._id;
    try {
        await Distributer_1.default.findByIdAndDelete(_id)
            .then((data) => {
            response.status = true;
            response.message = "Distributer deleted successfully";
        })
            .catch((error) => { throw new Error; });
    }
    catch (error) {
        response.status = false;
        response.message = "Distributer deleted failed!";
    }
    res.json(response);
});
exports.default = admin;
