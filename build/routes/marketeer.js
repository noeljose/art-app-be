"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cors_1 = __importDefault(require("cors"));
const marketeerRoute = (0, express_1.default)();
marketeerRoute.use((0, cors_1.default)());
//MODELS
const Marketeer_1 = __importDefault(require("../models/Marketeer"));
const Order_1 = __importDefault(require("../models/Order"));
//Login
marketeerRoute.post("/login", async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let response = {
        status: false,
        message: "Unable to login, please check the login credentials!"
    };
    try {
        let loginCheck = await Marketeer_1.default
            .find({ email: req.body.email, password: req.body.password })
            .catch(() => { throw new Error; });
        !loginCheck[0].email ? response.message = 'This account does not exist.' : null;
        console.log(loginCheck);
        if (loginCheck[0].email == email && loginCheck[0].password == password) {
            let data = {
                name: loginCheck[0].name,
                phone: loginCheck[0].phone,
                email: loginCheck[0].email,
            };
            let token = jsonwebtoken_1.default.sign({ ...data, _id: loginCheck[0]._id, authority: 'A2' }, process.env.JWT_PASS, {
                expiresIn: '8h'
            });
            if (loginCheck.active == false) {
                response.message = "The account is not active at the moment, please contact your adminstrator";
            }
            else {
                response.status = true;
                response.message = 'Login Successful';
                response.data = {
                    name: loginCheck[0].name,
                    phone: loginCheck[0].phone,
                    email: loginCheck[0].email,
                    token: token
                };
            }
        }
    }
    catch (error) {
        response.message = "Error to login";
    }
    console.log(response);
    res.json(response);
});
marketeerRoute.post("/update", async (req, res) => {
    let response = {
        status: false,
        message: "Unable to update, please try later!"
    };
    let _id = req.body._id;
    let data = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email
    };
    try {
        await Marketeer_1.default.findByIdAndUpdate(_id, data)
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
marketeerRoute.post("/list", async (req, res) => {
    let response = {
        status: false,
        message: "Unable to update, please try later!"
    };
    let _id = req.body._id;
    try {
        await Marketeer_1.default.findById(_id)
            .then(function (res) {
            response.status = true;
            response.message = "Data Fetched successfully!";
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
        response.message = "Error occured while fetching, try again";
    }
    res.json(response);
});
marketeerRoute.post("/update_password", async (req, res) => {
    let response = {
        status: false,
        message: "Unable to update the password, please try later!"
    };
    let id = req.body._id;
    let password = {
        new_password: req.body.new_password,
        old_password: req.body.old_password
    };
    console.log({ _id: id, password: password.old_password });
    try {
        await Marketeer_1.default.findOneAndUpdate({ password: password.old_password, _id: id }, {
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
marketeerRoute.post("/my_jobs", async (req, res) => {
    let response = {
        status: false,
        message: "Unable to fetch your jobs, please try later!"
    };
    let _id = req.body._id;
    try {
        await Order_1.default.find({ order_processed_by: _id })
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
exports.default = marketeerRoute;
// //update order status
// marketeerRoute.post("/order_status", async (req:Request, res:Response)=> {
//   let response:response = {
//     status : false,
//     message : "Unable to update the order status, please try later"
//   }
//   let order_id = req.body._id;
//   let status = req.body.status
//   try {
//     if (typeof status != 'number') {
//       throw `The status must be a number, but instead recieved status of type ${typeof status}`
//     }
//     await Order.findByIdAndUpdate(order_id, {$set : {
//       status : status
//     }})
//     .then(()=>{
//       response.status = true
//       response.message = 'Order status updated successfully!'
//     })
//     .catch(()=>{throw 'somthing failed while updating the status, please try again!'})
//   } catch (error) {
//     if (typeof error == 'string') {
//       response.status = false
//       response.message = error
//     }
//   }
//   res.json(response)
// })
