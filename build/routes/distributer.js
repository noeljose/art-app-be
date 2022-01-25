"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cors_1 = __importDefault(require("cors"));
const distributerRoute = (0, express_1.default)();
//MIDDLEWARES
distributerRoute.use((0, cors_1.default)());
//MODELS
const Distributer_1 = __importDefault(require("../models/Distributer"));
const Order_1 = __importDefault(require("../models/Order"));
//Login
distributerRoute.post("/login", async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let response = {
        status: false,
        message: "Unable to login, please check the login credentials!"
    };
    try {
        let loginCheck = await Distributer_1.default
            .find({ email: req.body.email, password: req.body.password })
            .catch(() => { throw new Error; });
        !loginCheck[0].email ? response.message = 'This account, does not exist.' : null;
        if (loginCheck[0].email == email && loginCheck[0].password == password) {
            let data = {
                name: loginCheck[0].name,
                phone: loginCheck[0].phone,
                email: loginCheck[0].email,
                basePrice: loginCheck[0].basePrice
            };
            let token = jsonwebtoken_1.default.sign({ ...data, _id: loginCheck[0]._id, authority: 'A3' }, process.env.JWT_PASS, { expiresIn: '8h' });
            if (loginCheck.active == false) {
                response.message = "The account is not active at the moment, please contact your adminstrator";
            }
            else {
                response.status = true;
                response.message = 'Login successful';
                response.data = {
                    _id: loginCheck[0]._id,
                    name: loginCheck[0].name,
                    phone: loginCheck[0].phone,
                    email: loginCheck[0].email,
                    address: loginCheck[0].address,
                    token: token
                };
            }
        }
    }
    catch (error) {
        response.message = "Error to login";
    }
    res.json(response);
});
distributerRoute.post("/update", async (req, res) => {
    let response = {
        status: false,
        message: "Unable to update, please try later!"
    };
    let _id = req.body._id;
    let data = {
        name: req.body.details.name,
        phone: req.body.details.phone,
        email: req.body.details.email,
        address: req.body.details.address
    };
    try {
        await Distributer_1.default.findByIdAndUpdate(_id, data)
            .then(function (res) {
            response.status = true;
            response.message = "Data Updated successfully!";
            response.data = {
                name: res.name,
                email: res.email,
                phone: res.phone,
                address: res.address
            };
        })
            .catch(function () {
            throw new Error;
        });
    }
    catch (error) {
        response.message = "Error occured while updating, try again";
    }
    res.json(response);
});
distributerRoute.post("/update_password", async (req, res) => {
    let response = {
        status: false,
        message: "Unable to update the password, please try later!"
    };
    let _id = req.body._id;
    let password = {
        new_password: req.body.new_password,
        old_password: req.body.old_password
    };
    try {
        await Distributer_1.default.findOneAndUpdate({ _id, password: password.old_password }, {
            $set: {
                password: password.new_password
            }
        })
            .then(function (res) {
            response.status = true;
            response.message = "Password Updated successfully!";
        })
            .catch(function () {
            throw new Error;
        });
    }
    catch (error) {
        response.message = "Error occured while updating password, try again";
    }
    res.json(response);
});
distributerRoute.post("/read", async (req, res) => {
    let response = {
        status: false,
        message: "Unable to fetch your account, please try later!"
    };
    let _id = req.body._id;
    console.log(_id);
    try {
        await Distributer_1.default.findById(_id)
            .then((data) => {
            response.status = true;
            response.message = "Bingo!";
            response.data = data;
        })
            .catch(() => { throw new Error; });
    }
    catch (error) {
        response.status = false;
        response.message = "Something went worng, please try again";
    }
    res.json(response);
});
distributerRoute.post("/my_orders", async (req, res) => {
    let response = {
        status: false,
        message: "Unable to fetch your orders, please try later!"
    };
    let _id = req.body._id;
    try {
        await Order_1.default.find({ order_placed_by: _id })
            .then((data) => {
            response.status = true;
            response.message = "Bingo!";
            response.data = data;
        })
            .catch(() => { throw new Error; });
    }
    catch (error) {
        response.status = false;
        response.message = "Something went worng, please try again";
    }
    res.json(response);
});
exports.default = distributerRoute;
