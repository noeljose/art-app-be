import express, {Request, Response, Application} from "express"
import {response, product} from "../types";
import {empty} from "../lib/common"
import {SchemaTypes} from "mongoose"
const products: Application = express()


//MIDDLEWARES


//MODELS
import Category from "../models/Category"
import Product from "../models/Product"

let pdt =  typeof Product

//CURD Category and  Subcategory
products.post("/category/:operation", async(req, res )=>{

    let data = {
        category : req.body.category,
        subCategory : req.body.subCategory
    }

    let checkExist = await Category.findOne({category : req.body.category}) || false

    let response: response = {
        status : false,
        message : "Somthing Went wrong"
    }

    let _id = req.body._id || ""
    

    try {
        
        switch (req.params.operation) {

            case "create":
                if (empty(data.category) || empty(data.subCategory)) { response.message ="Please Fill all fields"; throw "error" }
           
                if (checkExist != false) {
                    response.message = "Category already exists"
                    throw "error"
                } 
                await new Category(data).save().catch((err: any)=> { response.backError = err; throw "errkor"})
                
                break;
                
            case "update":
                if (empty(data.category) || empty(data.subCategory)) { response.message ="Please Fill all fields"; throw "error" }
                await Category.findOneAndUpdate({_id:_id}, {$set: data }).catch((err: any)=> { response.backError = err; throw "error"})
                break;
    
            case "list":
                let list = await Category.find().catch((err: any)=> { response.backError = err; throw "error"})

                response.data = list;
                break;
    
            case "delete":
        
                // await Category.findOneAndDelete({_id:_id}).catch((err: any)=> { response.backError = err; throw "error"})
                response.backError = "Products have been not yet added"
                throw "error"
                break;
    
        
            default:
                throw "No Match"
                break;
        }
         
    } catch (error) {
        
        return res.json(response)
    }
      
    response.status = true
    response.message = "Operation Successful"
    
    res.json(response)
    
})

// Create

products.post("/create", async (req:Request, res:Response)=>{
    let data:product  = {
        title : req.body.title,
        image : req.body.image,
        category : req.body.category,
        subCategory: req.body.subCategory
    }
    let response : response = {
        status : false,
        message : "Somthing Went Wrong"
    }

    if (data.title == '' || data.image == "" || data.category == "" || data.subCategory == "") {        
        response.message = 'Please fill all the fields';
        return res.json(response)

    }
    
    //Check Product Exist
    let check_product = await Product.findOne({ title: data.title, image: data.image }) || false

    if (check_product !== false) {
        try {
        
            await Product.create(data).catch(error => {throw new Error;})
            response.message = "Product Saved successfully"
            response.status = true
            return res.json(response)
        } catch (error) {
            response.message = 'Somthing Went Wrong, failed to add';
            return res.json(response)
        }
    }
    res.json(response)

})

// Update
products.post("/update", async (req : Request, res: Response)=>{
    let product_id = req.body._id
    let data:product  = {
        title : req.body.title,
        image : req.body.image,
        category : req.body.category,
        subCategory: req.body.subCategory
    }
    let response : response = {
        status : false,
        message : "Somthing Went Wrong, failed to update"
    }

    if (data.title == '' || data.image == "" || data.category == "" || data.subCategory == "") {        
        response.message = 'Please fill all the fields';
        return res.json(response)

    }
    
    //Check Product Exist
    let check_product = await Product.findOne({ title: data.title, image: data.image }) || false

    if (check_product !== false) {
        try {
        
            await Product.findById(product_id).update(data).catch(error => {throw new Error;})
            response.message = "Product Saved successfully"
            response.status = true
            return res.json(response)
        } catch (error) {
            response.message = 'Somthing Went Wrong, failed to update';
            return res.json(response)
        }
    }

    res.json(response)
})

// List products
products.post("/list", (req, res)=>{

    let skip = req.body.skip
    let limit = req.body.limit
    let category = req.body.category
    let subCategory = req.body.subCategory

    let list_query = {
        category : "",
        subCategory : ""
    }
    req.body.category != "" ? list_query.category = category: "";
    req.body.subCategory != "" ? list_query.subCategory = subCategory: "";

    
    
})
// Read single product
products.post("/list/:productid", (req, res)=>{
    
    
})

// Delete
products.post("/delete", (req, res)=>{
    
})


// Search
products.post("/search/:query", (req, res)=>{
    
})

export default products
