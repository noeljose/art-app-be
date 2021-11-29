import express, {Application} from "express"
import {response} from "../types";
import {empty} from "../lib/common"
const products: Application = express()

//MIDDLEWARES
products.use(express.json())

//MODELS
import Category from "../models/Category"

products.post("/category/:operation", async(req, res )=>{

    let checkExist = await Category.findOne({category : req.body.category}) || false

    let response: response = {
        status : false,
        message : "Somthing Went wrong"
    }
    let data = {
        category : req.body.category,
        subCategory : req.body.subCategory
    }

    let _id = req.body._id || ""

    try {
        switch (req.params.operation) {


            case "create":
                if (checkExist != false) {
                    response.message = "Category already exists"
                    throw "error"
                } 
                await new Category(data).save().catch((err: any)=> { response.backError = err; throw "error"})
                
                break;
                
            case "update":
                
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
//CURD Category

//CURD Subcategory

// Create

// Update

// Read List + Read-list/single product

// Delete

// Search

export default products
