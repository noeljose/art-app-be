"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const common_1 = require("../lib/common");
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const cors_1 = __importDefault(require("cors"));
const products = (0, express_1.default)();
//MIDDLEWARES
products.use((0, cors_1.default)());
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
const Category_1 = __importDefault(require("../models/Category"));
const Product_1 = __importDefault(require("../models/Product"));
let pdt = typeof Product_1.default;
//IMAGES
products.use("/images", express_1.default.static("images"));
//CURD Category and  Subcategory
products.post("/category/:operation", async (req, res) => {
    let data = {
        category: req.body.category,
        subCategory: req.body.subCategory
    };
    let checkExist = await Category_1.default.findOne({ category: req.body.category }) || false;
    let response = {
        status: false,
        message: "Somthing went wrong"
    };
    let _id = req.body._id || "";
    try {
        switch (req.params.operation) {
            case "create":
                if ((0, common_1.empty)(data.category) || (0, common_1.empty)(data.subCategory)) {
                    response.message = "Please fill all fields";
                    throw "error";
                }
                if (checkExist != false) {
                    response.message = "Category already exists";
                    throw "error";
                }
                await new Category_1.default(data).save().catch((err) => { response.backError = err; throw "errkor"; });
                break;
            case "update":
                if ((0, common_1.empty)(data.category) || (0, common_1.empty)(data.subCategory)) {
                    response.message = "Please fill all fields";
                    throw "error";
                }
                await Category_1.default.findOneAndUpdate({ _id: _id }, { $set: data }).catch((err) => { response.backError = err; throw "error"; });
                break;
            case "list":
                let list = await Category_1.default.find().catch((err) => { response.backError = err; throw "error"; });
                response.data = list;
                break;
            case "delete":
                // await Category.findOneAndDelete({_id:_id}).catch((err: any)=> { response.backError = err; throw "error"})
                response.backError = "Products have been not yet added";
                throw "error";
                break;
            default:
                throw "No Match";
                break;
        }
    }
    catch (error) {
        return res.json(response);
    }
    response.status = true;
    response.message = "Operation successful";
    res.json(response);
});
products.post("/uploadimage", upload.single("productimage"), (req, res) => {
    let value = req.body.customFileUploadName;
    let response = {
        status: false,
        message: "Somthing went wrong"
    };
    try {
        if (value) {
            response.status = true;
            response.message = "File uploaded Successfully";
            response.data = value;
        }
        else {
            response.message = "File uploaded Failed";
        }
    }
    catch (error) {
        response.status = false,
            response.message = "Something went wrong while uploading the file",
            response.backError = error;
    }
    res.json(response);
});
//*--------------------UPDATE DP--------------------//
products.post("/updateimage", upload.single("productimage"), (req, res) => {
    let value = req.body.customFileUploadName;
    let oldImage = req.body.oldImage;
    let response = {
        status: false,
        message: "Somthing went wrong"
    };
    try {
        fs_1.default.unlink(`'./images/'${oldImage}`, (err) => {
            if (value) {
                //* S-Response
                response.status = true;
                response.message = "File uploaded successfully";
                response.data = value;
            }
            else {
                //* E-Response
                response.message = "File uploaded Failed",
                    response.backError = err;
            }
        });
    }
    catch (error) {
        response.status = false,
            response.message = "Something went wrong while uploading the file",
            response.backError = error;
    }
    res.json(response);
});
// Create
products.post("/create", async (req, res) => {
    let data = {
        title: req.body.title,
        image: req.body.image,
        category: req.body.category,
        subCategory: req.body.subCategory
    };
    let response = {
        status: false,
        message: "Somthing went wrong"
    };
    if (data.title == '' || data.image == "" || data.category == "" || data.subCategory == "") {
        response.message = 'Please fill all the fields';
        return res.json(response);
    }
    //Check Product Exist
    let check_product = await Product_1.default.findOne({ title: data.title, image: data.image }) || false;
    if (check_product == false) {
        try {
            await Product_1.default.create(data).catch(error => { throw new Error; });
            response.message = "Product saved successfully";
            response.status = true;
            return res.json(response);
        }
        catch (error) {
            response.message = 'Somthing went wrong, failed to add';
            return res.json(response);
        }
    }
    else {
        response.message = "Product with similar name already added";
    }
    res.json(response);
});
// Update
products.post("/update", async (req, res) => {
    let product_id = req.body._id;
    let data = {
        title: req.body.title,
        image: req.body.image,
        category: req.body.category,
        subCategory: req.body.subCategory
    };
    let response = {
        status: false,
        message: "Somthing went wrong, failed to update 234"
    };
    if (data.title == '' || data.image == "" || data.category == "" || data.subCategory == "") {
        response.message = 'Please fill all the fields';
        return res.json(response);
    }
    try {
        await Product_1.default.findById(product_id).updateOne(data).catch(error => { throw new Error; });
        response.message = "Product saved successfully";
        response.status = true;
        return res.json(response);
    }
    catch (error) {
        response.message = 'Somthing went wrong, failed to update 249';
        return res.json(response);
    }
    res.json(response);
});
// List products
products.post("/search", async (req, res) => {
    let skip = req.body.skip;
    let limit = req.body.limit;
    let category = req.body.category;
    let subCategory = req.body.subCategory;
    let response = {
        status: false,
        message: "Somthing went wrong"
    };
    let list_query = {
        category: { $regex: ".*" + category + ".*" },
        subCategory: { $regex: ".*" + subCategory + ".*" }
    };
    //send list query
    try {
        let result = await Product_1.default.find(list_query)
            .then(data => {
            response.data = data;
            response.status = true;
            response.message = "Data Fetched successfully";
        })
            .catch(err => { throw new Error; });
    }
    catch (error) {
        response.message = 'Somthing went wrong, failed to fetch';
        return res.json(response);
    }
    //return data
    res.json(response);
});
// Read single product
products.post("/list/:productid", async (req, res) => {
    let product_id = req.params.productid;
    let response = {
        status: false,
        message: "Somthing went wrong"
    };
    try {
        let result = await Product_1.default.findById(product_id).then(data => {
            response.data = data;
            response.status = true;
            response.message = "Product fetched successfully";
        });
    }
    catch (error) {
        response.message = "Product could not be fetched";
    }
    res.json(response);
});
// Delete
products.post("/delete/:id", async (req, res) => {
    let product_id = req.params.id;
    let response = {
        status: false,
        message: "Somthing went wrong"
    };
    await Product_1.default.findByIdAndDelete(product_id)
        .then(result => {
        response.status = true;
        response.message = "Product deleted successfully";
    })
        .catch(error => {
        response.message = "Product couldn't be deleted";
    });
    res.json(response);
});
// Search
products.get("/list_product", async (req, res) => {
    let response = {
        status: false,
        message: "Somthing went wrong"
    };
    try {
        let data = await Product_1.default.find().limit(10);
        response.data = data;
        response.status = true;
        response.message = "Data Fetched sucessfully";
    }
    catch (error) {
        response.message = "Somthing went wrong";
    }
    res.json(response);
});
// Search
products.post("/list", async (req, res) => {
    let response = {
        status: false,
        message: "Somthing went wrong"
    };
    try {
        let data = await Product_1.default.find();
        response.data = data;
        response.status = true;
        response.message = "Data Fetched sucessfully";
    }
    catch (error) {
        response.message = "Somthing went wrong";
    }
    res.json(response);
});
// Search By Category
products.post("/list_by_category", async (req, res) => {
    let response = {
        status: false,
        message: "Somthing went wrong"
    };
    let skip = req.body.skip;
    let query = {};
    req.body.category ? query.category = req.body.category : null;
    req.body.subCategory ? query.subCategory = req.body.subCategory : null;
    try {
        if (!req.body.category && !req.body.category) {
            throw new Error("Please select the category");
        }
        console.log(query);
        let dataLength = await Product_1.default.find(query).countDocuments();
        let data = await Product_1.default.find(query)
            .skip(skip).limit(10);
        console.log(data, skip);
        response.data = data;
        response.status = true;
        response.message = "Data Fetched sucessfully";
        response.metadata = {
            resultCount: dataLength
        };
    }
    catch (error) {
        response.message = "Somthing went wrong";
    }
    res.json(response);
});
exports.default = products;
