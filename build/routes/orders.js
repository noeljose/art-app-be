"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const order = (0, express_1.default)();
//MIDDLEWARES
order.use((0, cors_1.default)());
//MODELS
const Order_1 = __importDefault(require("../models/Order"));
//Routes
order.post("/place", async (req, res) => {
    let response = {
        status: false,
        message: "Unable to place order"
    };
    let data = {
        product_id: req.body.product_id,
        order_details: {
            width: req.body.order_details.width,
            height: req.body.order_details.height,
            arcTop: req.body.order_details.arcTop,
            arcBottom: req.body.order_details.arcBottom,
            varnish: req.body.order_details.varnish,
            whiteCoat: req.body.order_details.whiteCoat,
            sandwich: req.body.order_details.sandwich,
            message: req.body.order_details.message
        },
        order_placed_by: req.body.order_placed_by,
        shipping_address: req.body.shipping_address,
        status: 0,
        // category : req.body.category,
        // subCategory :  req.body.subCategory
    };
    try {
        let ord = await Order_1.default.create(data)
            .then(() => {
            response.status = true;
            response.message = "Order placed successfully";
        }).
            catch((err) => {
            console.log(err);
            throw new Error;
        });
    }
    catch (error) {
        // console.log(error);
        response.message = "Somthing went wrong while placing the order!";
    }
    res.json(response);
});
//update order status
order.post("/order_status", async (req, res) => {
    let response = {
        status: false,
        message: "Unable to update the order status, please try later"
    };
    let order_id = req.body._id;
    let status = req.body.status;
    try {
        if (typeof status != 'number') {
            throw `The status must be a number, but instead recieved status of type ${typeof status}`;
        }
        await Order_1.default.findByIdAndUpdate(order_id, { $set: {
                status: status
            } })
            .then(() => {
            response.status = true;
            response.message = 'Order status updated successfully!';
        })
            .catch(() => { throw 'somthing failed while updating the status, please try again!'; });
    }
    catch (error) {
        if (typeof error == 'string') {
            response.status = false;
            response.message = error;
        }
    }
    res.json(response);
});
order.post("/list", async (req, res) => {
    let response = {
        status: false,
        message: "Unable to list order"
    };
    let limit = req.body.limit;
    let skip = req.body.skip;
    let query = {
        name: { $regex: req.body.search_query, $options: "i" }
    };
    !req.body.search_query ? query.name = "" : null;
    req.body.category ? query.category = req.body.category : null;
    req.body.subCategory ? query.subCategory = req.body.subCategory : null;
    try {
        await Order_1.default.find(query)
            .then(result => {
            response.data = result;
        }).catch(error => {
            throw new Error;
        });
    }
    catch (error) {
        response.message = "Somthing went wrong while fetching the orders!";
    }
    res.json(response);
});
order.post("/read", async (req, res) => {
    let response = {
        status: false,
        message: "Unable to read allorder"
    };
    let limit = req.body.limit;
    let skip = req.body.skip;
    try {
        await Order_1.default.find()
            .then(result => {
            response.data = result;
        }).catch(error => {
            throw new Error;
        });
    }
    catch (error) {
        response.message = "Somthing went wrong while fetching the orders!";
    }
    res.json(response);
});
order.post("/single_order_view", async (req, res) => {
    let order_id = req.body.order_id;
    let response = {
        status: false,
        message: "Unable to find the order"
    };
    try {
        await Order_1.default.findById(order_id)
            .then(result => response.data = result)
            .catch(error => { throw new Error; });
    }
    catch (error) {
        response.message = "Somthing went wrong while fetching the order!";
    }
    res.json(response);
});
exports.default = order;
